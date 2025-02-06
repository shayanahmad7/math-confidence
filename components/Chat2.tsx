'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Message, useAssistant } from 'ai/react';
import { Send, Loader2, User, Bot, StopCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';


interface ChatProps {
  userId: string; // The user's unique ID
}

const Chat2: React.FC<ChatProps> = ({ userId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Use the useAssistant hook to interact with the OpenAI Assistants API
  const { status, messages: aiMessages, input, submitMessage, handleInputChange, stop } = useAssistant({
    api: '/api/assistant2',
    body: { assistantId: process.env.ASSISTANT2_ID, userId }, // Pass only userId to the backend
  });

  const [fetchedMessages, setFetchedMessages] = useState<Message[]>([]); // Store fetched messages
  const [isLoadingHistory, setIsLoadingHistory] = useState(true); // Track loading state

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (fetchedMessages.length > 0) return; // Prevent multiple fetches

      try {
        setIsLoadingHistory(true); // Start loading state
        const response = await fetch(`/api/assistant2?userId=${userId}`);
        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder("utf-8");
        let partialData = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          partialData += decoder.decode(value, { stream: true });

          try {
            const parsedData = JSON.parse(partialData);
            const newMessages = parsedData.messages.map((msg: any, index: number) => ({
              id: `msg-${index}`,
              role: msg.role,
              content: msg.content,
            }));

            setFetchedMessages(newMessages); // Store fetched messages
            setMessages(newMessages); // Render messages immediately
            setIsLoadingHistory(false); // Stop loading state
          } catch (e) {
            // Wait until the full JSON object is received
          }
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setIsLoadingHistory(false); // Stop loading even if there's an error
      }
    };

    fetchChatHistory();
  }, [userId]); // Runs once per userId change

  // Append AI messages while keeping fetched messages
  useEffect(() => {
    setMessages([...fetchedMessages, ...aiMessages]); // Ensures messages persist
  }, [aiMessages]); // Runs whenever AI messages change


  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update streaming state based on the status
  useEffect(() => {
    setIsStreaming(status === 'in_progress');
  }, [status]);

  // Render Markdown content for messages
  const renderMessage = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        className="prose prose-sm dark:prose-invert max-w-none"
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
              Loading previous chats...
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
                  prose-headings:text-inherit prose-p:text-inherit
                  prose-strong:text-inherit prose-ol:text-inherit prose-ul:text-inherit
                  [&_.katex-display]:my-3 [&_.katex-display]:text-center
                `}
              >
                {renderMessage(m.content)}
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
      <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4">
        <div className="flex rounded-full bg-gray-100 shadow-inner">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about Naming Numbers..."
            disabled={isStreaming}
            className="flex-1 rounded-l-full bg-transparent px-6 py-3 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() && !isStreaming}
            className={`flex items-center rounded-r-full px-6 py-3 font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 ${
              isStreaming
                ? 'bg-red-500 hover:bg-red-600'
                : input.trim()
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isStreaming ? (
              <>
                <StopCircle className="mr-2 h-5 w-5" />
                <span className="sr-only">Stop generating</span>
                <span aria-hidden="true">Stop</span>
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                <span className="sr-only">Send message</span>
                <span aria-hidden="true">Send</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat2;