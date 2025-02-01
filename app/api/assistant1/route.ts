import { AssistantResponse } from 'ai';
import OpenAI from 'openai';
import { MongoClient, Db, Collection } from 'mongodb';

// Define the structure of a message
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Define the structure of the collection document
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

// Ensure MongoDB connection
async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db('math-confidence');
    collection = db.collection<Thread>('messages');
  }
}

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

async function cancelActiveRuns(threadId: string) {
  // ... (keep the existing cancelActiveRuns function)
}

async function saveMessageToDatabase(threadId: string, role: 'user' | 'assistant', content: string) {
  // ... (keep the existing saveMessageToDatabase function)
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const input: {
      threadId: string | null;
      message: string;
    } = await req.json();

    // Create a thread if needed
    const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

    try {
      // Cancel any active runs before adding a new message
      await cancelActiveRuns(threadId);

      // Add user message to the thread and save it to the database
      const createdMessage = await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: input.message,
      });
      await saveMessageToDatabase(threadId, 'user', input.message);

      return AssistantResponse(
        { threadId, messageId: createdMessage.id },
        async ({ forwardStream }) => {
          // Run the assistant on the thread
          const runStream = openai.beta.threads.runs.stream(threadId, {
            assistant_id: process.env.ASSISTANT1_ID ?? (() => {
              throw new Error('ASSISTANT1_ID is not set');
            })(),
          });

          // Forward run status with message deltas
          let runResult = await forwardStream(runStream);

          // Save assistant responses to the database
          if (runResult?.status === 'completed' && runResult.messages) {
            for (const message of runResult.messages) {
              if (message.role === 'assistant') {
                await saveMessageToDatabase(threadId, 'assistant', message.content);
              }
            }
          }

          // Process requires_action states
          while (
            runResult?.status === 'requires_action' &&
            runResult.required_action?.type === 'submit_tool_outputs'
          ) {
            runResult = await forwardStream(
              openai.beta.threads.runs.submitToolOutputsStream(
                threadId,
                runResult.id,
                { tool_outputs: [] }
              )
            );
          }
        }
      );
    } catch (error) {
      console.error('Error in POST /api/assistant1:', error);
      return new Response(
        JSON.stringify({ error: 'An error occurred while processing the request' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/assistant1:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing the request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
