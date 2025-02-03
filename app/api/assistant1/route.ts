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
  threadId: string;
  messages: Message[];
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
    collection = db.collection<Thread>('threads1');
    console.log('[DB] Successfully connected to MongoDB.');
  }
}

export const maxDuration = 30;

// Dummy (or existing) cancelActiveRuns implementation
async function cancelActiveRuns(threadId: string) {
  console.log(`[RUN] Cancelling active runs for threadId: ${threadId}`);
  // Add your actual cancellation logic here if needed.
}

// Save a message (user or assistant) to MongoDB with detailed logging
async function saveMessageToDatabase(
  threadId: string,
  role: 'user' | 'assistant',
  content: string
) {
  try {
    if (!collection) {
      await connectToDatabase();
    }
    const message: Message = {
      role,
      content,
      timestamp: new Date(),
    };
    console.log(`[DB] Saving ${role} message for threadId ${threadId}: ${content}`);
    await collection!.updateOne(
      { threadId },
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
    const input: { threadId: string | null; message: string } = await req.json();
    console.log('[API] Parsed input:', input);

    // Create a new thread if one is not provided
    const threadId =
      input.threadId ?? (await openai.beta.threads.create({})).id;
    console.log(`[API] Using threadId: ${threadId}`);

    try {
      // Cancel any active runs for this thread
      await cancelActiveRuns(threadId);

      // Create the user message on the OpenAI thread
      console.log('[API] Creating user message in OpenAI thread...');
      const createdMessage = await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: input.message,
      });
      console.log(`[API] User message created with id: ${createdMessage.id}`);

      // Save the user's message to MongoDB
      await saveMessageToDatabase(threadId, 'user', input.message);

      // Return a response that will stream the assistant's reply
      return AssistantResponse(
        { threadId, messageId: createdMessage.id },
        async ({ forwardStream }) => {
          console.log('[STREAM] Starting to stream assistant response...');
          const runStream = openai.beta.threads.runs.stream(threadId, {
            assistant_id: process.env.ASSISTANT1_ID ?? (() => {
              throw new Error('ASSISTANT1_ID is not set');
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
              // Fetch all messages in the thread
              const messagesPage = await openai.beta.threads.messages.list(threadId);
              console.log('[STREAM] Fetched thread messages page:', messagesPage);

              // Extract the array of messages
              const threadMessages: any[] = messagesPage.data || [];
              console.log('[STREAM] Thread messages array:', threadMessages);

              // Filter out the assistant messages
              const assistantMessages = threadMessages.filter((msg: any) => msg.role === 'assistant');
              if (assistantMessages.length > 0) {
                // Get the latest assistant message
                const latestAssistantMessage = assistantMessages[assistantMessages.length - 1];
                console.log('[STREAM] Saving latest assistant message:', latestAssistantMessage);

                // Extract plain text from the assistant's content
                const assistantContent = extractPlainText(latestAssistantMessage.content);
                console.log('[STREAM] Extracted plain text:', assistantContent);

                // Save the plain text to MongoDB
                await saveMessageToDatabase(threadId, 'assistant', assistantContent);
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

// Helper function to extract plain text from assistant's content
function extractPlainText(content: any): string {
  if (Array.isArray(content)) {
    // Concatenate all text values from the array
    return content
      .filter((item: any) => item.type === 'text')
      .map((item: any) => item.text.value)
      .join(' ');
  }
  return String(content); // Fallback to string conversion
}