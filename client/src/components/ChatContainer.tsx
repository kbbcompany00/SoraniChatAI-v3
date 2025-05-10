import React, { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { Button } from "@/components/ui/button";

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  sendQuestion?: (question: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading, sendQuestion }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Function to handle clicking on suggested questions - if sendQuestion prop exists, use it
  const handleQuestionClick = (question: string) => {
    if (sendQuestion) {
      // Call the sendQuestion function directly (auto-send)
      sendQuestion(question);
    } else {
      // Fallback to old behavior - just populate the input
      document.getElementById('message-input')?.setAttribute('value', question);
    }
  };
  
  // Function to format time in Kurdish
  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'دوای نیوەڕۆ' : 'بەیانی';
    const displayHours = hours % 12 || 12;
    
    // Convert to Kurdish/Arabic numerals
    const kurdishNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const timeString = `${kurdishNumerals[Math.floor(displayHours/10)]}${kurdishNumerals[displayHours%10]}:${kurdishNumerals[Math.floor(minutes/10)]}${kurdishNumerals[minutes%10]} ${ampm}`;
    
    return timeString;
  };
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <main 
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin" 
      id="chat-container"
    >
      {/* Welcome Message */}
      {messages.length === 0 && (
        <div className="max-w-3xl mx-auto mb-8 message-appear">
          <div className="bg-gradient-to-br from-white to-violet-50 rounded-2xl shadow-xl border border-violet-100 p-6 md:p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500"></div>
            <div className="absolute -bottom-8 -right-8 opacity-5 rotate-12">
              <span className="material-icons text-9xl text-purple-900">castle</span>
            </div>
            
            <div className="flex items-center mb-4 relative z-10">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-full p-2.5 ml-3 shadow-lg">
                <span className="material-icons text-white text-2xl">smart_toy</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-800 to-purple-800">
                  بەخێربێیت بۆ زیرەکی دەستکردی قەڵا!
                </h2>
                <p className="text-sm text-purple-600">هەموو پرسیارێکت بە کوردی سۆرانی وەڵام دەدرێتەوە</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-5 leading-relaxed relative z-10">
              دەتوانیت پرسیارم لێ بکەیت دەربارەی هەر بابەتێک. من بە کوردی سۆرانی وەڵامت دەدەمەوە بە شێوەیەکی خێرا و زیرەکانە، جا پرسیارەکەت بە هەر زمانێک بێت.
            </p>
            
            <h3 className="text-lg font-bold text-purple-800 mb-3">چەند پرسیارێک بۆ دەستپێکردن:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 relative z-10">
              <Button 
                variant="outline"
                className="bg-white/80 hover:bg-purple-50 text-purple-800 border-purple-200 py-4 px-4 rounded-xl shadow-sm hover:shadow-md hover:scale-102 active:scale-98 transition-all text-sm text-right justify-between gap-2 h-auto group"
                onClick={() => handleQuestionClick('چۆن دەتوانم فێری زمانی کوردی بم؟')}
              >
                <span className="material-icons text-purple-500 text-lg opacity-0 group-hover:opacity-100 transition-opacity">send</span>
                <span>چۆن دەتوانم فێری زمانی کوردی بم؟</span>
              </Button>
              <Button 
                variant="outline"
                className="bg-white/80 hover:bg-purple-50 text-purple-800 border-purple-200 py-4 px-4 rounded-xl shadow-sm hover:shadow-md hover:scale-102 active:scale-98 transition-all text-sm text-right justify-between gap-2 h-auto group"
                onClick={() => handleQuestionClick('چەند شوێنی سەرنجڕاکێش هەن لە کوردستان؟')}
              >
                <span className="material-icons text-purple-500 text-lg opacity-0 group-hover:opacity-100 transition-opacity">send</span>
                <span>چەند شوێنی سەرنجڕاکێش هەن لە کوردستان؟</span>
              </Button>
              <Button 
                variant="outline"
                className="bg-white/80 hover:bg-purple-50 text-purple-800 border-purple-200 py-4 px-4 rounded-xl shadow-sm hover:shadow-md hover:scale-102 active:scale-98 transition-all text-sm text-right justify-between gap-2 h-auto group"
                onClick={() => handleQuestionClick('باسی کەش و هەوای هەولێر بکە')}
              >
                <span className="material-icons text-purple-500 text-lg opacity-0 group-hover:opacity-100 transition-opacity">send</span>
                <span>باسی کەش و هەوای هەولێر بکە</span>
              </Button>
              <Button 
                variant="outline"
                className="bg-white/80 hover:bg-purple-50 text-purple-800 border-purple-200 py-4 px-4 rounded-xl shadow-sm hover:shadow-md hover:scale-102 active:scale-98 transition-all text-sm text-right justify-between gap-2 h-auto group"
                onClick={() => handleQuestionClick('چەند ڕێگایەک هەیە بۆ چێشت لێنانی دۆلمە؟')}
              >
                <span className="material-icons text-purple-500 text-lg opacity-0 group-hover:opacity-100 transition-opacity">send</span>
                <span>چەند ڕێگایەک هەیە بۆ چێشت لێنانی دۆلمە؟</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator - shows only when there are messages but the AI is still thinking */}
      {messages.length > 0 && isLoading && !messages[messages.length - 1].isStreaming && (
        <div className="max-w-3xl mx-auto mb-6 message-appear">
          <div className="flex">
            <div className="ai-thinking">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-purple-400 to-violet-500 rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                  <span className="material-icons text-white text-[12px]">psychology</span>
                </div>
                <div className="ai-thinking-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Render Messages */}
      {messages.map((message, index) => (
        <div key={index} className="max-w-3xl mx-auto mb-6 message-appear">
          {message.role === 'user' ? (
            // User Message
            <>
              <div className="flex justify-end">
                <div className="bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-2xl py-3.5 px-5 max-w-[85%] shadow-md relative overflow-hidden">
                  {/* Decorative top border */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-300/60 to-violet-300/60"></div>
                  
                  {/* User Icon */}
                  <div className="flex items-center justify-end mb-1.5">
                    <span className="text-xs font-medium text-violet-200">بەکارهێنەر</span>
                    <div className="bg-white/20 rounded-full h-6 w-6 flex items-center justify-center ml-2 shadow-sm">
                      <span className="material-icons text-white text-xs">person</span>
                    </div>
                  </div>
                  
                  {/* Message content */}
                  <p className="leading-relaxed">{message.content}</p>
                </div>
              </div>
              <div className="flex justify-end mt-1.5">
                <span className="text-xs text-gray-500 flex items-center">
                  <span className="material-icons text-purple-400 text-xs ml-1">schedule</span>
                  {formatTime(new Date(message.timestamp))}
                </span>
              </div>
            </>
          ) : (
            // AI Response
            <>
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-purple-50 to-white border border-violet-100 rounded-2xl py-3.5 px-5 max-w-[85%] shadow-md relative overflow-hidden">
                  {/* Decorative top border */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-violet-300 to-purple-500"></div>
                  
                  {/* AI Icon */}
                  <div className="flex items-center mb-1.5">
                    <div className="bg-gradient-to-r from-purple-400 to-violet-500 rounded-full h-6 w-6 flex items-center justify-center mr-2 shadow-sm">
                      <span className="material-icons text-white text-xs">auto_awesome</span>
                    </div>
                    <span className="text-xs font-medium text-purple-700">زیرەکی دەستکردی قەڵا</span>
                  </div>
                  
                  {/* Message content */}
                  <div className="leading-relaxed text-gray-800" 
                    dangerouslySetInnerHTML={{ 
                      __html: message.content
                        .replace(/\n\n/g, '<br/><br/>')
                        .replace(/\n/g, '<br/>') 
                    }} 
                  />
                  
                  {/* Typing animation */}
                  {message.isStreaming && <span className="typing-animation"></span>}
                </div>
              </div>
              <div className="flex mt-1.5">
                <span className="text-xs text-gray-500 flex items-center">
                  <span className="material-icons text-purple-400 text-xs ml-1">schedule</span>
                  {message.isStreaming ? 'ئێستا' : formatTime(new Date(message.timestamp))}
                </span>
              </div>
            </>
          )}
        </div>
      ))}
    </main>
  );
};

export default ChatContainer;
