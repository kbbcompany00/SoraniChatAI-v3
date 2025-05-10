import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import InfoBanner from "@/components/InfoBanner";
import ChatContainer from "@/components/ChatContainer";
import MessageInput from "@/components/MessageInput";
import { useChat } from "@/hooks/useChat";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [showBanner, setShowBanner] = useState(true);
  const { toast } = useToast();
  
  // Use our chat hook to manage state and functionality
  const { 
    messages, 
    messageInput, 
    setMessageInput, 
    sendMessage, 
    isLoading, 
    isNonKurdishDetected,
    clearMessages
  } = useChat();
  
  // Handle clearing the chat
  const handleClearChat = useCallback(() => {
    clearMessages();
    toast({
      title: "پاککرایەوە",
      description: "چاتەکە بە سەرکەوتوویی پاککرایەوە",
      duration: 3000,
    });
  }, [clearMessages, toast]);
  
  // Load banner state from localStorage
  useEffect(() => {
    const isBannerDismissed = localStorage.getItem('infoBannerDismissed') === 'true';
    setShowBanner(!isBannerDismissed);
  }, []);

  // Handle banner dismissal
  const handleDismissBanner = useCallback(() => {
    setShowBanner(false);
    localStorage.setItem('infoBannerDismissed', 'true');
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Header component with clear chat functionality */}
      <Header onClearChat={handleClearChat} />
      
      {/* Optional information banner */}
      {showBanner && (
        <InfoBanner onDismiss={handleDismissBanner} />
      )}
      
      {/* Main chat area */}
      <ChatContainer 
        messages={messages}
        isLoading={isLoading}
      />
      
      {/* Message input component */}
      <MessageInput
        value={messageInput}
        onChange={setMessageInput}
        onSend={sendMessage}
        isLoading={isLoading}
        isNonKurdishDetected={isNonKurdishDetected}
      />
    </div>
  );
};

export default Home;
