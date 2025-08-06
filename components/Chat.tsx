/* eslint-disable */

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Message, useAssistant } from 'ai/react';
import { Send, Loader2, User, Bot, StopCircle, Mic, MicOff, Volume2, Paperclip } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface ChatProps {
  userId: string; // The user's unique ID
  assistantId?: string; // The assistant ID (1, 2, 3, etc.)
}

const Chat: React.FC<ChatProps> = ({ userId, assistantId }) => {
  const [showComingSoon, setShowComingSoon] = useState(false);
  if (!assistantId) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center">
        <div className="text-2xl text-red-500 font-bold mb-2">AI Tutor Not Available</div>
        <div className="text-gray-600 mb-4">Sorry, the interactive AI tutor for this section is not available yet.</div>
        <input
          type="text"
          className="flex-1 bg-gray-100 px-4 py-2 outline-none rounded mb-2 text-center"
          placeholder="Type your message..."
          disabled
          onFocus={() => setShowComingSoon(true)}
        />
        <button
          className="p-2 rounded-full bg-gray-200 text-gray-400 cursor-not-allowed"
          disabled
        >
          Send
        </button>
        {showComingSoon && (
          <div className="mt-2 text-yellow-600 font-medium">AI tutor for this section is coming soon!</div>
        )}
      </div>
    );
  }

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // States for text-to-speech (TTS)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null)
  
  // A ref to hold the currently playing audio so we can stop it if needed.
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cross-browser speech recognition states
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessingAudio, setIsProcessingAudio] = useState(false)
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const finalTranscriptRef = useRef<string>("")

  // Use the useAssistant hook to interact with the OpenAI Assistants API
  const { status, messages: aiMessages, input, submitMessage, handleInputChange, stop, append } = useAssistant({
    api: `/api/assistant/${assistantId}`,
    body: { userId }, // Pass only userId to the backend
  });

  const [fetchedMessages, setFetchedMessages] = useState<Message[]>([]); // Store fetched messages
  const [isLoadingHistory, setIsLoadingHistory] = useState(true); // Track loading state
  const [hasAutoSent, setHasAutoSent] = useState(false); // Track if auto-send has been triggered

  // helper
  // Extract the section number only if the assistant id includes "<chapter>-<section>".
  // For single-assistant chapters (13 – Final Exam, 14 – Supplement) this returns undefined.
  const getSectionNumber = (id: string | undefined) => {
    if (!id) return undefined
    if (id.includes('-')) {
      return id.split('-')[1]
    }
    return undefined // chapters with a single assistant (13,14)
  };

  const sectionNumber = getSectionNumber(assistantId);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (fetchedMessages.length > 0) return; // Prevent multiple fetches

      try {
        setIsLoadingHistory(true); // Start loading state
        const response = await fetch(`/api/assistant/${assistantId}?userId=${userId}`);
        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder("utf-8");
        let partialData = "";
        let newMessages: Message[] = []; // Store messages temporarily before setting state

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          partialData += decoder.decode(value, { stream: true });

          try {
            // Parse the JSON data from the API response
            const parsedData = JSON.parse(partialData);
            newMessages = parsedData.messages.map((msg: any, index: number) => ({
              id: `msg-${index}`,
              role: msg.role,
              content: msg.content,
            }));

            setFetchedMessages(newMessages); // Store fetched messages in state
            setMessages(newMessages); // Set messages to display
          } catch (e) {
            // Wait until the full JSON object is received
          }
        }

        setIsLoadingHistory(false); // Mark loading as complete
        
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setIsLoadingHistory(false); // Stop loading even if there's an error
        
      }
    };

    fetchChatHistory();
  }, [userId, assistantId]); // Runs once when userId or assistantId changes

  // Append AI messages while keeping fetched messages
  useEffect(() => {
    // Filter out the auto-sent trigger message so it doesn't show in UI
    const filteredAiMessages = aiMessages.filter((msg) => {
      const isAutoSentTrigger = msg.role === 'user' &&
        ((sectionNumber && msg.content === sectionNumber) || (!sectionNumber && msg.content === "Hi, let's start"))
      return !isAutoSentTrigger
    })

    setMessages([...fetchedMessages, ...filteredAiMessages]) // Ensures messages persist
  }, [aiMessages, fetchedMessages, assistantId, sectionNumber])

  // Auto-send first message for assistants that require a trigger (chapters 1-12) or a greeting (chapters 13-14)
  useEffect(() => {
    const shouldAutoSend = !isLoadingHistory && fetchedMessages.length === 0 && aiMessages.length === 0 && !hasAutoSent
    if (!shouldAutoSend) return

    const triggerMessage = sectionNumber ? sectionNumber : 'Hi, let\'s start'

      console.log(`[Chat] Auto-sending initial message: "${triggerMessage}" (assistant ${assistantId})`)

      // Keep loading state active until AI response starts
      setIsLoadingHistory(true)

      // Use the useAssistant hook's streaming mechanism
      const sendInitialMessage = async () => {
        try {
          // Use append to send hidden trigger message without affecting input UI
          await append({ role: 'user', content: triggerMessage })
          console.log('[Chat] Successfully sent initial message.')
        } catch (error) {
          console.error(`[Chat] Error sending initial message:`, error);
          setIsLoadingHistory(false);
        }
      };

      sendInitialMessage();
            setHasAutoSent(true);
  }, [fetchedMessages.length, aiMessages.length, isLoadingHistory, assistantId, hasAutoSent, userId, append, sectionNumber]);

  // Stop loading when AI starts streaming (first response) or when there are messages
  useEffect(() => {
    if (hasAutoSent && (status === 'in_progress' || aiMessages.length > 0)) {
      // AI has started responding or we have messages, stop the loading state
      console.log('[Chat] Stopping loading state - AI response detected');
      setIsLoadingHistory(false);
    }
  }, [status, aiMessages.length, hasAutoSent]);

  // Also stop loading if we have any messages (from history or new)
  useEffect(() => {
    if (messages.length > 0 && isLoadingHistory) {
      console.log('[Chat] Stopping loading state - messages detected');
      setIsLoadingHistory(false);
    }
  }, [messages.length, isLoadingHistory]);

  // Fallback: Stop loading after 30 seconds if AI doesn't respond
  useEffect(() => {
    if (hasAutoSent && isLoadingHistory) {
      const timeout = setTimeout(() => {
        console.warn('[Chat] Loading timeout - stopping loading state');
        setIsLoadingHistory(false);
      }, 30000); // 30 seconds timeout

      return () => clearTimeout(timeout);
    }
  }, [hasAutoSent, isLoadingHistory]);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update streaming state based on the status
  useEffect(() => {
    setIsStreaming(status === 'in_progress');
  }, [status]);

  // Initialize Speech Recognition (STT) if supported
  useEffect(() => {
    const SpeechRecognitionConstructor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognitionConstructor) {
      const recognition = new SpeechRecognitionConstructor()
      // Record continuously until you manually stop.
      recognition.continuous = true
      // Enable interim results so that words are output live.
      recognition.interimResults = true
      recognition.lang = 'en-US'
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          // If result is final, append it to our final transcript.
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += event.results[i][0].transcript + " "
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }
        // Combine the final transcript (accumulated so far) with the interim transcript.
        const currentTranscript = finalTranscriptRef.current + interimTranscript
        // Update the input field with the live transcript.
        handleInputChange({
          target: { value: currentTranscript },
        } as React.ChangeEvent<HTMLInputElement>)
      }
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event)
        setIsRecording(false)
      }
      recognition.onend = () => {
        setIsRecording(false)
      }
      recognitionRef.current = recognition
    }
  }, [handleInputChange])

  // Check if native speech recognition is supported
  const isNativeSpeechRecognitionSupported = () => {
    return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition
  }

  // Check if MediaRecorder is supported (for Firefox fallback)
  const isMediaRecorderSupported = () => {
    return !!(window as any).MediaRecorder
  }

  // Cross-browser speech recognition handler
  const handleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (recognitionRef.current && isNativeSpeechRecognitionSupported()) {
        recognitionRef.current.stop()
      } else if (mediaRecorderRef.current && isMediaRecorderSupported()) {
        mediaRecorderRef.current.stop()
      }
      setIsRecording(false)
      return
    }

    try {
      // Start recording
      if (isNativeSpeechRecognitionSupported() && recognitionRef.current) {
        // Use native speech recognition (Chrome, Edge, Safari)
        finalTranscriptRef.current = ""
        recognitionRef.current.start()
        setIsRecording(true)
      } else if (isMediaRecorderSupported()) {
        // Use MediaRecorder + Whisper API (Firefox, etc.)
        await startMediaRecorder()
      } else {
        alert('Speech recognition is not supported in this browser. Please use a modern browser.')
      }
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      alert('Failed to start speech recognition. Please try again or use text input.')
    }
  }

  // MediaRecorder implementation for Firefox
  const startMediaRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        setIsRecording(false)
        setIsProcessingAudio(true)
        
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          const transcribedText = await transcribeAudio(audioBlob)
          
          if (transcribedText) {
            handleInputChange({
              target: { value: transcribedText },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        } catch (error) {
          console.error('Error transcribing audio:', error)
          alert('Failed to transcribe audio. Please try again.')
        } finally {
          setIsProcessingAudio(false)
          stream.getTracks().forEach(track => track.stop())
        }
      }
      
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Microphone access denied. Please allow microphone access in your browser settings.')
    }
  }

  // Transcribe audio using OpenAI Whisper API
  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.webm')
      
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to transcribe audio')
      }
      
      const result = await response.json()
      return result.text || ''
    } catch (error) {
      console.error('Transcription error:', error)
      throw error
    }
  }

  // ------------------------------
  // Text-to-speech (TTS) function using OpenAI's API
  // ------------------------------
  const speakMessage = async (text: string, messageId: string) => {
    // Clean the text so that only actual words (letters and numbers) are spoken.
    const cleanedText = text.match(/\b\w+\b/g)?.join(' ') || text

    // If there is already audio playing, stop it.
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      if (currentlySpeakingId === messageId) {
        setCurrentlySpeakingId(null)
        setIsSpeaking(false)
        return
      }
    }

    try {
      // Request audio from your server, which communicates with OpenAI's TTS API
      const response = await fetch('/api/openai-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'tts-1',
          voice: 'alloy',
          input: cleanedText,
        }),
      })

      if (!response.ok) {
        throw new Error('TTS API error')
      }

      // Stream the audio response
      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      const audio = new Audio(audioUrl)
      currentAudioRef.current = audio
      setIsSpeaking(true)
      setCurrentlySpeakingId(messageId)

      audio.onended = () => {
        setIsSpeaking(false)
        setCurrentlySpeakingId(null)
        currentAudioRef.current = null
        URL.revokeObjectURL(audioUrl)
      }

      audio.play()
    } catch (error) {
      console.error('TTS error: ', error)
    }
  }

  // Handle file upload for images
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Only image uploads are supported for now.')
      return
    }
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const { url } = await res.json();
      if (!url) throw new Error('upload failed');
      await append({
        role: 'user',
        content: [ { type: 'image_url', image_url: { url } } ] as any,
      });
    } catch (err) {
      console.error('Error uploading/sending image', err);
    }
  }

  // Render Markdown content for messages
  const renderMessage = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        className="prose prose-sm dark:prose-invert max_w-none"
        components={{
          h1: ({ ...props }) => <h1 className="text-2xl font-bold my-4 text-center" {...props} />,
          h2: ({ ...props }) => <h2 className="text-xl font-bold my-3 text-center" {...props} />,
          h3: ({ ...props }) => <h3 className="text-lg font-bold my-3" {...props} />,
          p: ({ ...props }) => <p className="my-2" {...props} />,
          ul: ({ ...props }) => <ul className="my-2 space-y-1 list-disc pl-6" {...props} />,
          ol: ({ ...props }) => <ol className="my-2 space-y-1 list-decimal pl-6" {...props} />,
          li: ({ ...props }) => <li className="leading-normal" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 my-2" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  // Handle form submission (sending a message)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isStreaming) {
      await stop(); // Stop the current streaming response
      setIsStreaming(false);
    } else if (input.trim()) {
      const isImageUrl = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i.test(input.trim());
      if (isImageUrl) {
        // send image content using append
        try {
          await append({
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: input.trim() } },
            ] as any,
          });
          handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
          return;
        } catch (err) {
          console.error('Error sending image message', err);
          setIsStreaming(false);
          return;
        }
      }
      setIsStreaming(true); // Start streaming
      try {
        await submitMessage(); // Send the message to the backend
      } catch (error) {
        console.error('Error submitting message:', error);
        setIsStreaming(false);
      }
    }
  };

  return (
    <div className="flex h-[600px] flex-col rounded-xl bg-gray-50 shadow-inner">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Show loading message while fetching previous messages */}
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 text-sm text-center">
              <Loader2 className="inline-block h-5 w-5 animate-spin mr-2" />
              Loading assistant...
            </div>
          </div>
        ) : null}
        {messages.map((m: Message) => (
          <div key={m.id} className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`flex max-w-[80%] items-start rounded-2xl px-4 py-3 ${
                m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 shadow'
              }`}
            >
              {m.role === 'user' ? (
                <User className="mr-2 h-5 w-5 shrink-0 mt-1" />
              ) : (
                <Bot className="mr-2 h-5 w-5 shrink-0 mt-1" />
              )}
              <div
                className={`${m.role === 'user' ? 'prose-invert' : ''} 
                  prose-headings:text_inherit prose-p:text_inherit
                  prose-strong:text_inherit prose-ol:text_inherit prose-ul:text_inherit
                  [&_.katex-display]:my-3 [&_.katex-display]:text-center
                `}
              >
                {renderMessage(m.content)}
                
                {m.role === 'assistant' && (
                  <button
                    onClick={() => speakMessage(m.content, m.id)}
                    title="Read aloud"
                    className="ml-2 hover:text-gray-900 focus:outline-none"
                  >
                    <Volume2
                      className={`h-5 w-5 ${
                        currentlySpeakingId === m.id ? 'text-blue-500' : 'text-gray-600'
                      }`}
                    />
                  </button>
                )}
                
              </div>
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="flex justify-start items-center mb-4">
            <div className="flex items-center rounded-full bg-white px-4 py-2 text-gray-800 shadow">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              AI is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className={`border-t border-gray-200 bg-white p-4 ${isLoadingHistory ? 'opacity-50' : ''}`}>
        <div className="flex rounded-full bg-gray-100 shadow-inner">
          {/* Mic button on the left with glowing effect when recording */}
          <button
            type="button"
            onClick={handleRecording}
            title={isRecording ? 'Stop recording' : 'Record your message'}
            className={`p-2 rounded-full focus:outline-none ${
              isRecording
                ? 'animate-pulse ring-4 ring-blue-500 bg-gray-200'
                : isProcessingAudio
                ? 'bg-yellow-200 cursor-wait'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            disabled={isProcessingAudio || isLoadingHistory}
          >
            {isProcessingAudio ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isRecording ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </button>

          {/* Text input field */}
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-4 py-2 outline-none"
            disabled={isStreaming || isLoadingHistory}
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={!input.trim() || isStreaming || isLoadingHistory}
            className="p-2 rounded-full focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 mr-1"
          >
            {isStreaming ? (
              <StopCircle className="h-5 w-5" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
          {/* Upload icon */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            title="Upload image"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
        </div>
      </form>
    </div>
  );
};

export default Chat;
