import { useState, useEffect, useRef, useCallback } from 'react';

interface UseChatStreamProps {
  onComplete: (completeText: string) => void;
}

export const useChatStream = ({ onComplete }: UseChatStreamProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  
  // Reference to the EventSource for cleanup
  const eventSourceRef = useRef<EventSource | null>(null);
  // Store the full text for when streaming completes
  const completeTextRef = useRef('');

  // Cleanup function to close EventSource
  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startStream = useCallback((message: string) => {
    // Clean up any existing connection
    cleanup();
    
    // Reset state
    setIsLoading(true);
    setStreamingText('');
    completeTextRef.current = '';
    
    // Create new EventSource connection
    const url = `/api/chat/stream?message=${encodeURIComponent(message)}`;
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    // Handle incoming stream data
    eventSource.onmessage = (event) => {
      try {
        const chunk = event.data;
        
        if (chunk === '[DONE]') {
          // Streaming complete
          eventSource.close();
          eventSourceRef.current = null;
          setIsLoading(false);
          onComplete(completeTextRef.current);
        } else {
          // Append new text to the current streaming text
          completeTextRef.current += chunk;
          setStreamingText(completeTextRef.current);
        }
      } catch (error) {
        console.error('Error parsing stream data:', error);
      }
    };

    // Handle errors
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      cleanup();
      setIsLoading(false);
    };
  }, [cleanup, onComplete]);

  const stopStream = useCallback(() => {
    cleanup();
    setIsLoading(false);
  }, [cleanup]);

  return {
    startStream,
    stopStream,
    streamingText,
    isLoading
  };
};
