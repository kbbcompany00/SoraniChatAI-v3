import React, { useEffect, useRef } from 'react';
import { Message } from '@/types';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
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
        <div className="max-w-2xl mx-auto mb-8 message-appear">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">بەخێربێیت بۆ هۆشی دەستکرد کوردی!</h2>
            <p className="text-gray-600 mb-3">دەتوانیت پرسیارم لێ بکەیت دەربارەی هەر بابەتێک. من بە کوردی سۆرانی وەڵامت دەدەمەوە.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
              <button 
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors text-sm text-right"
                onClick={() => document.getElementById('message-input')?.setAttribute('value', 'چۆن دەتوانم فێری زمانی کوردی بم؟')}
              >
                چۆن دەتوانم فێری زمانی کوردی بم؟
              </button>
              <button 
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors text-sm text-right"
                onClick={() => document.getElementById('message-input')?.setAttribute('value', 'چەند شوێنی سەرنجڕاکێش هەن لە کوردستان؟')}
              >
                چەند شوێنی سەرنجڕاکێش هەن لە کوردستان؟
              </button>
              <button 
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors text-sm text-right"
                onClick={() => document.getElementById('message-input')?.setAttribute('value', 'باسی کەش و هەوای هەولێر بکە')}
              >
                باسی کەش و هەوای هەولێر بکە
              </button>
              <button 
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors text-sm text-right"
                onClick={() => document.getElementById('message-input')?.setAttribute('value', 'چەند ڕێگایەک هەیە بۆ چێشت لێنانی دۆلمە؟')}
              >
                چەند ڕێگایەک هەیە بۆ چێشت لێنانی دۆلمە؟
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render Messages */}
      {messages.map((message, index) => (
        <div key={index} className="max-w-2xl mx-auto mb-6 message-appear">
          {message.role === 'user' ? (
            // User Message
            <>
              <div className="flex justify-end">
                <div className="bg-primary text-white rounded-lg py-2 px-4 max-w-[80%] shadow-sm">
                  <p>{message.content}</p>
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-500">
                  {formatTime(new Date(message.timestamp))}
                </span>
              </div>
            </>
          ) : (
            // AI Response
            <>
              <div className="flex">
                <div className="bg-white border border-gray-200 rounded-lg py-2 px-4 max-w-[80%] shadow-sm">
                  <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>') }} />
                  {message.isStreaming && <span className="typing-animation"></span>}
                </div>
              </div>
              <div className="flex mt-1">
                <span className="text-xs text-gray-500">
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
