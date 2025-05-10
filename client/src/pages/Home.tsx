import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import InfoBanner from "@/components/InfoBanner";
import ChatContainer from "@/components/ChatContainer";
import MessageInput from "@/components/MessageInput";
import ImageUploader from "@/components/ImageUploader";
import EmbeddingDisplay from "@/components/EmbeddingDisplay";
import { useChat } from "@/hooks/useChat";
import { useImageEmbedding } from "@/hooks/useImageEmbedding";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Home = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [showImageEmbedding, setShowImageEmbedding] = useState(false);
  const { toast } = useToast();
  
  // Load banner state from localStorage
  useEffect(() => {
    const isBannerDismissed = localStorage.getItem('infoBannerDismissed') === 'true';
    setShowBanner(!isBannerDismissed);
  }, []);

  // Handle banner dismissal
  const handleDismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('infoBannerDismissed', 'true');
  };

  // Use our chat hook to manage state and functionality
  const { 
    messages, 
    messageInput, 
    setMessageInput, 
    sendMessage, 
    isLoading: isChatLoading, 
    isNonKurdishDetected,
    clearMessages
  } = useChat();

  // Use our image embedding hook
  const {
    embedding,
    isLoading: isEmbeddingLoading,
    getEmbedding,
    resetEmbedding
  } = useImageEmbedding();

  // Handle clearing the chat
  const handleClearChat = useCallback(() => {
    clearMessages();
    resetEmbedding();
    toast({
      title: "پاککرایەوە",
      description: "چاتەکە بە سەرکەوتوویی پاککرایەوە",
      duration: 3000,
    });
  }, [clearMessages, resetEmbedding, toast]);

  // Toggle image embedding view
  const toggleImageEmbedding = () => {
    setShowImageEmbedding(prev => !prev);
    if (!showImageEmbedding) {
      resetEmbedding();
    }
  };

  // Handle image capture or upload
  const handleImageCaptured = (imageBase64: string) => {
    getEmbedding(imageBase64);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header component with clear chat functionality */}
      <Header onClearChat={handleClearChat} />
      
      {/* Optional information banner */}
      {showBanner && (
        <InfoBanner onDismiss={handleDismissBanner} />
      )}

      {/* Image embedding toggle button */}
      <div className="flex justify-center pt-2 pb-1">
        <Button
          onClick={toggleImageEmbedding}
          variant="outline"
          className="text-sm bg-white border-violet-200 text-violet-700 hover:bg-violet-50"
        >
          <span className="material-icons mr-1 text-sm">
            {showImageEmbedding ? 'chat' : 'image'}
          </span>
          {showImageEmbedding ? 'گەڕانەوە بۆ چات' : 'شیکردنەوەی وێنە'}
        </Button>
      </div>
      
      {/* Image embedding components */}
      {showImageEmbedding && (
        <div className="px-4 py-2 flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <ImageUploader 
              onImageCaptured={handleImageCaptured} 
              isLoading={isEmbeddingLoading} 
            />
            <EmbeddingDisplay 
              embedding={embedding} 
              isLoading={isEmbeddingLoading} 
            />
          </div>
        </div>
      )}
      
      {/* Main chat area with auto-send functionality for suggested questions */}
      {!showImageEmbedding && (
        <ChatContainer 
          messages={messages}
          isLoading={isChatLoading}
          sendQuestion={(question) => {
            setMessageInput(question);
            // Use setTimeout to ensure the state is updated before sending
            setTimeout(() => {
              sendMessage();
            }, 10);
          }}
        />
      )}
      
      {/* Message input component */}
      {!showImageEmbedding && (
        <MessageInput
          value={messageInput}
          onChange={setMessageInput}
          onSend={sendMessage}
          isLoading={isChatLoading}
          isNonKurdishDetected={isNonKurdishDetected}
        />
      )}
    </div>
  );
};

export default Home;
