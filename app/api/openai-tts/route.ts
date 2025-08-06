import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { pipeline } from 'stream'

// Promisify the pipeline for async streaming
const streamPipeline = promisify(pipeline)

// Define valid voice options as a TypeScript union type
type VoiceOption = "alloy" | "ash" | "coral" | "echo" | "fable" | "onyx" | "nova" | "sage" | "shimmer"

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

// POST request handler for the API route
export async function POST(req: Request) {
  try {
    // Parse the request body and destructure parameters
    const { model = 'tts-1', voice = 'alloy', input }: { model: string; voice: VoiceOption; input: string } = await req.json()

    // Validate the voice parameter
    const validVoices: VoiceOption[] = ["alloy", "ash", "coral", "echo", "fable", "onyx", "nova", "sage", "shimmer"]
    if (!validVoices.includes(voice)) {
      return NextResponse.json({ error: 'Invalid voice option' }, { status: 400 })
    }

    // Validate the input text
    if (!input || typeof input !== 'string') {
      return NextResponse.json({ error: 'Invalid input text' }, { status: 400 })
    }

    // Call OpenAI's TTS API to generate speech
    const response = await openai.audio.speech.create({
      model,
      voice,
      input,
    })

    // Check if response.body is null or undefined
    if (!response.body) {
      return NextResponse.json({ error: 'No response body received from TTS API' }, { status: 500 })
    }

    // Generate a temporary file path to save the audio
    const tempDir = path.join(process.cwd(), 'temp')
    const tempAudioPath = path.join(tempDir, `speech_${Date.now()}.mp3`)

    // Ensure the temp directory exists
    await fs.promises.mkdir(tempDir, { recursive: true })

    // Stream the response body directly to a file
    await streamPipeline(response.body as unknown as NodeJS.ReadableStream, fs.createWriteStream(tempAudioPath))

    // Read and return the audio file
    const audioBuffer = await fs.promises.readFile(tempAudioPath)
    await fs.promises.unlink(tempAudioPath) // Clean up temp file

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    })
  } catch (error) {
    console.error('Error generating TTS:', error)
    return NextResponse.json({ error: 'Failed to generate text-to-speech audio' }, { status: 500 })
  }
}
