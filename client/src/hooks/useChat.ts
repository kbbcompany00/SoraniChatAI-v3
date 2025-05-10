import { useState, useEffect } from 'react';
import { Message } from '@/types';
import { useChatStream } from '@/hooks/useChatStream';

// Regular expression to detect non-Kurdish text
// This detects if the text contains non-Arabic/Persian script characters
const NON_KURDISH_REGEX = /[a-zA-Z]/;

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isNonKurdishDetected, setIsNonKurdishDetected] = useState(false);
  
  // Use our streaming hook to handle SSE
  const { startStream, stopStream, streamingText, isLoading } = useChatStream({
    onComplete: (completeText) => {
      // Update the last message to remove streaming status and set final content
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        
        // If there's no last message or it's not an assistant message, just return
        if (!lastMessage || lastMessage.role !== 'assistant') return prev;
        
        // Update the last message
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          content: completeText,
          isStreaming: false
        };
        
        return updatedMessages;
      });
    }
  });

  // Listen for streaming text changes
  useEffect(() => {
    if (streamingText) {
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        
        // If there's no last message or it's not an assistant message, add a new one
        if (!lastMessage || lastMessage.role !== 'assistant') {
          return [...prev, {
            role: 'assistant',
            content: streamingText,
            timestamp: Date.now(),
            isStreaming: true
          }];
        }
        
        // Update the last message with new streaming content
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          content: streamingText,
          isStreaming: true
        };
        
        return updatedMessages;
      });
    }
  }, [streamingText]);

  // Detect language when input changes
  useEffect(() => {
    if (messageInput) {
      setIsNonKurdishDetected(NON_KURDISH_REGEX.test(messageInput));
    } else {
      setIsNonKurdishDetected(false);
    }
  }, [messageInput]);

  const sendMessage = async () => {
    if (!messageInput.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: messageInput,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessageInput('');
    
    // Start streaming the response
    startStream(messageInput);
  };

  return {
    messages,
    messageInput,
    setMessageInput,
    sendMessage,
    isLoading,
    isNonKurdishDetected
  };
};
