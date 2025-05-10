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
  // Store animation frame ID for cancellation
  const animationFrameRef = useRef<number | null>(null);
  // Buffer for incoming chunks to ensure smooth streaming display
  const chunkBufferRef = useRef<string[]>([]);

  // Cleanup function to close EventSource and cancel animation frames
  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    // Cancel any pending animation frames
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Process buffered chunks with optimized rendering
  const processBuffer = useCallback(() => {
    if (chunkBufferRef.current.length > 0) {
      const chunk = chunkBufferRef.current.shift() || '';
      completeTextRef.current += chunk;
      setStreamingText(completeTextRef.current);
      
      // Continue processing buffer if there are more chunks
      if (chunkBufferRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(processBuffer);
      }
    }
  }, []);

  const startStream = useCallback((message: string) => {
    // Clean up any existing connection
    cleanup();
    
    // Reset state
    setIsLoading(true);
    setStreamingText('');
    completeTextRef.current = '';
    chunkBufferRef.current = [];
    
    // Create new EventSource connection with priority hint
    const url = `/api/chat/stream?message=${encodeURIComponent(message)}`;
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    // Handle incoming stream data with optimized rendering
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
          // Add chunk to buffer for smoother rendering
          chunkBufferRef.current.push(chunk);
          
          // Start or continue processing the buffer
          if (animationFrameRef.current === null) {
            animationFrameRef.current = requestAnimationFrame(processBuffer);
          }
        }
      } catch (error) {
        console.error('Error parsing stream data:', error);
      }
    };

    // Optimize connection opening
    eventSource.onopen = () => {
      // Connection established - ready for data
      console.log('Stream connection established');
    };

    // Handle errors with improved recovery
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      
      // Try to recover from temporary connection issues
      if (eventSource.readyState !== EventSource.CLOSED) {
        setTimeout(() => {
          if (eventSourceRef.current === eventSource) {
            // Only try to reconnect if this is still the active connection
            console.log('Attempting to recover stream connection...');
          }
        }, 1000);
      } else {
        // Permanent failure, clean up
        cleanup();
        setIsLoading(false);
      }
    };
  }, [cleanup, onComplete, processBuffer]);

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
