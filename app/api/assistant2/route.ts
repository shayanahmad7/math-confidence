import { AssistantResponse } from 'ai';
import OpenAI from 'openai';
import { MongoClient, Db, Collection } from 'mongodb';

// Define the structure of a message
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Define the structure of the thread document
interface Thread {
  userId: string; // Unique identifier for the user
  threadId: string; // OpenAI thread ID
  messages: Message[]; // Array of messages in the thread
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);
let db: Db | null = null;
let collection: Collection<Thread> | null = null;

// Connect to MongoDB if not already connected
async function connectToDatabase() {
  if (!db) {
    console.log('[DB] Connecting to MongoDB...');
    await client.connect();
    db = client.db('math-confidence');
    collection = db.collection<Thread>('threads2');
    console.log('[DB] Successfully connected to MongoDB.');
  }
}

export const maxDuration = 30;

// Save a message (user or assistant) to MongoDB with detailed logging
async function saveMessageToDatabase(
  userId: string,
  threadId: string,
  role: 'user' | 'assistant',
  content: string
) {
  try {
    if (!collection) {
      await connectToDatabase();
    }

    // Check if the message already exists to prevent duplicates
    const existingMessage = await collection!.findOne({
      userId,
      threadId,
      'messages.content': content,
    });

    if (existingMessage) {
      console.log(`[DB] Message already exists for userId ${userId}, threadId ${threadId}: ${content}`);
      return;
    }

    const message: Message = {
      role,
      content,
      timestamp: new Date(),
    };

    console.log(`[DB] Saving ${role} message for userId ${userId}, threadId ${threadId}: ${content}`);
    await collection!.updateOne(
      { userId, threadId },
      { $push: { messages: message } },
      { upsert: true }
    );
    console.log('[DB] Message saved successfully.');
  } catch (err) {
    console.error('[DB] Error saving message:', err);
  }
}

export async function POST(req: Request) {
  try {
    console.log('[API] Received request.');
    const input: { userId: string; threadId: string | null; message: string } = await req.json();
    console.log('[API] Parsed input:', input);

    let threadId = input.threadId;

    // If no threadId is provided, check if an existing thread exists for the user
    if (!threadId) {
      if (!collection) {
        await connectToDatabase();
      }
      const existingThread = await collection?.findOne({ userId: input.userId });
      if (existingThread) {
        threadId = existingThread.threadId;
        console.log(`[API] Found existing threadId for userId ${input.userId}: ${threadId}`);
      } else {
        // Create a new thread if none exists
        threadId = (await openai.beta.threads.create({})).id;
        console.log(`[API] Created new threadId for userId ${input.userId}: ${threadId}`);

        // Save the new thread in MongoDB
        await collection!.insertOne({
          userId: input.userId,
          threadId,
          messages: [],
        });
        console.log('[DB] New thread document created for userId:', input.userId);
      }
    }

    console.log(`[API] Using threadId: ${threadId}`);

    try {
      // Cancel any active runs for this thread
      console.log('[API] Cancelling active runs for threadId:', threadId);
      await cancelActiveRuns(threadId);

      // Create the user message on the OpenAI thread
      console.log('[API] Creating user message in OpenAI thread...');
      const createdMessage = await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: input.message,
      });
      console.log(`[API] User message created with id: ${createdMessage.id}`);

      // Save the user's message to MongoDB
      await saveMessageToDatabase(input.userId, threadId, 'user', input.message);

      // Return a response that will stream the assistant's reply
      return AssistantResponse(
        { threadId, messageId: createdMessage.id },
        async ({ forwardStream }) => {
          console.log('[STREAM] Starting to stream assistant response...');
          const runStream = openai.beta.threads.runs.stream(threadId, {
            assistant_id: process.env.ASSISTANT2_ID ?? (() => {
              throw new Error('ASSISTANT2_ID is not set');
            })(),
          });

          let runResult = await forwardStream(runStream);
          console.log('[STREAM] Initial run result:', runResult);

          // Process any required actions (if needed) until the run completes
          while (
            runResult?.status === 'requires_action' &&
            runResult.required_action?.type === 'submit_tool_outputs'
          ) {
            console.log('[STREAM] Run requires action, submitting tool outputs...', runResult);
            runResult = await forwardStream(
              openai.beta.threads.runs.submitToolOutputsStream(
                threadId,
                runResult.id,
                { tool_outputs: [] }
              )
            );
            console.log('[STREAM] Updated run result after action:', runResult);
          }

          // Once the run is completed, fetch the thread messages to obtain the assistant reply
          if (runResult?.status === 'completed') {
            console.log('[STREAM] Run completed. Fetching thread messages for assistant response...');
            try {
              const messagesPage = await openai.beta.threads.messages.list(threadId);
              console.log('[STREAM] Fetched thread messages page:', messagesPage);

              const threadMessages: any[] = messagesPage.data || [];
              console.log('[STREAM] Thread messages array:', threadMessages);

              const assistantMessages = threadMessages.filter((msg: any) => msg.role === 'assistant');
              if (assistantMessages.length > 0) {
                const latestAssistantMessage = assistantMessages[0];
                console.log('[STREAM] Saving latest assistant message:', latestAssistantMessage);

                const assistantContent = extractPlainText(latestAssistantMessage.content);
                console.log('[STREAM] Extracted plain text:', assistantContent);

                await saveMessageToDatabase(input.userId, threadId, 'assistant', assistantContent);
              } else {
                console.warn('[STREAM] No assistant message found in fetched thread messages.');
              }
            } catch (fetchError) {
              console.error('[STREAM] Error fetching thread messages:', fetchError);
            }
          } else {
            console.warn('[STREAM] Run did not complete successfully. Final runResult:', runResult);
          }
        }
      );
    } catch (error) {
      console.error('[API] Error in processing thread:', error);
      return new Response(
        JSON.stringify({
          error: 'An error occurred while processing the request (inner).',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('[API] Error in request handling:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing the request (outer).',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Dummy (or existing) cancelActiveRuns implementation
async function cancelActiveRuns(threadId: string) {
  console.log(`[RUN] Cancelling active runs for threadId: ${threadId}`);
  // Add your actual cancellation logic here if needed.
}

// Helper function to extract plain text from assistant's content
function extractPlainText(content: any): string {
  if (Array.isArray(content)) {
    return content
      .map((item: any) => {
        if (item.type === 'text') {
          return item.text.value;
        }
        return ''; // Ignore non-text items
      })
      .join(' ');
  }
  return String(content); // Fallback to string conversion
}