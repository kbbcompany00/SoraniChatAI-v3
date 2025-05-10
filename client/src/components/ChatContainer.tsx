import React, { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { Button } from "@/components/ui/button";

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  sendQuestion?: (question: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
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
                className="bg-white/80 hover:bg-purple-50 text-purple-800 border-purple-200 py-4 px-4 rounded-xl shadow-sm hover:shadow transition-all text-sm text-right justify-between gap-2 h-auto"
                onClick={() => document.getElementById('message-input')?.setAttribute('value', 'چۆن دەتوانم فێری زمانی کوردی بم؟')}
              >
                <span className="material-icons text-purple-500 text-lg opacity-0 group-hover:opacity-100 transition-opacity">arrow_back</span>
                <span>چۆن دەتوانم فێری زمانی کوردی بم؟</span>
              </Button>
              <Button 
                variant="outline"
                className="bg-white/80 hover:bg-purple-50 text-purple-800 border-purple-200 py-4 px-4 rounded-xl shadow-sm hover:shadow transition-all text-sm text-right justify-between gap-2 h-auto"
                onClick={() => document.getElementById('message-input')?.setAttribute('value', 'چەند شوێنی سەرنجڕاکێش هەن لە کوردستان؟')}
              >
                <span className="material-icons text-purple-500 text-lg opacity-0 group-hover:opacity-100 transition-opacity">arrow_back</span>
                <span>چەند شوێنی سەرنجڕاکێش هەن لە کوردستان؟</span>
              </Button>
              <Button 
                variant="outline"
                className="bg-white/80 hover:bg-purple-50 text-purple-800 border-purple-200 py-4 px-4 rounded-xl shadow-sm hover:shadow transition-all text-sm text-right justify-between gap-2 h-auto"
                onClick={() => document.getElementById('message-input')?.setAttribute('value', 'باسی کەش و هەوای هەولێر بکە')}
              >
                <span className="material-icons text-purple-500 text-lg opacity-0 group-hover:opacity-100 transition-opacity">arrow_back</span>
                <span>باسی کەش و هەوای هەولێر بکە</span>
              </Button>
              <Button 
                variant="outline"
                className="bg-white/80 hover:bg-purple-50 text-purple-800 border-purple-200 py-4 px-4 rounded-xl shadow-sm hover:shadow transition-all text-sm text-right justify-between gap-2 h-auto"
                onClick={() => document.getElementById('message-input')?.setAttribute('value', 'چەند ڕێگایەک هەیە بۆ چێشت لێنانی دۆلمە؟')}
              >
                <span className="material-icons text-purple-500 text-lg opacity-0 group-hover:opacity-100 transition-opacity">arrow_back</span>
                <span>چەند ڕێگایەک هەیە بۆ چێشت لێنانی دۆلمە؟</span>
              </Button>
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
                <div className="bg-gradient-to-br from-primary to-indigo-700 text-white rounded-2xl py-3 px-5 max-w-[85%] shadow-md border border-indigo-500">
                  <p className="leading-relaxed">{message.content}</p>
                </div>
              </div>
              <div className="flex justify-end mt-1.5">
                <span className="text-xs text-gray-500 flex items-center">
                  <span className="material-icons text-xs ml-1">person</span>
                  {formatTime(new Date(message.timestamp))}
                </span>
              </div>
            </>
          ) : (
            // AI Response
            <>
              <div className="flex">
                <div className="bg-white border border-indigo-100 rounded-2xl py-3 px-5 max-w-[85%] shadow-md">
                  <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>') }} />
                  {message.isStreaming && <span className="typing-animation"></span>}
                </div>
              </div>
              <div className="flex mt-1.5">
                <span className="text-xs text-gray-500 flex items-center">
                  <span className="material-icons text-xs ml-1">castle</span>
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
