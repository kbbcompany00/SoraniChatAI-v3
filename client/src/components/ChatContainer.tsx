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
        <div className="max-w-3xl mx-auto mb-8 message-appear">
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-lg shadow-lg border border-indigo-100 p-5 md:p-7">
            <div className="flex items-center mb-4">
              <span className="material-icons text-primary text-2xl ml-3">castle</span>
              <h2 className="text-xl font-bold text-gray-800">بەخێربێیت بۆ زیرەکی دەستکردی قەڵا!</h2>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">دەتوانیت پرسیارم لێ بکەیت دەربارەی هەر بابەتێک. من بە کوردی سۆرانی وەڵامت دەدەمەوە بە شێوەیەکی خێرا و زیرەکانە.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
              <button 
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 py-3 px-4 rounded-lg transition-colors text-sm text-right flex items-center justify-between group"
                onClick={() => document.getElementById('message-input')?.setAttribute('value', 'چۆن دەتوانم فێری زمانی کوردی بم؟')}
              >
                <span className="material-icons text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">arrow_back</span>
                <span>چۆن دەتوانم فێری زمانی کوردی بم؟</span>
              </button>
              <button 
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 py-3 px-4 rounded-lg transition-colors text-sm text-right flex items-center justify-between group"
                onClick={() => document.getElementById('message-input')?.setAttribute('value', 'چەند شوێنی سەرنجڕاکێش هەن لە کوردستان؟')}
              >
                <span className="material-icons text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">arrow_back</span>
                <span>چەند شوێنی سەرنجڕاکێش هەن لە کوردستان؟</span>
              </button>
              <button 
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 py-3 px-4 rounded-lg transition-colors text-sm text-right flex items-center justify-between group"
                onClick={() => document.getElementById('message-input')?.setAttribute('value', 'باسی کەش و هەوای هەولێر بکە')}
              >
                <span className="material-icons text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">arrow_back</span>
                <span>باسی کەش و هەوای هەولێر بکە</span>
              </button>
              <button 
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 py-3 px-4 rounded-lg transition-colors text-sm text-right flex items-center justify-between group"
                onClick={() => document.getElementById('message-input')?.setAttribute('value', 'چەند ڕێگایەک هەیە بۆ چێشت لێنانی دۆلمە؟')}
              >
                <span className="material-icons text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">arrow_back</span>
                <span>چەند ڕێگایەک هەیە بۆ چێشت لێنانی دۆلمە؟</span>
              </button>
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
                  <div className="leading-relaxed" 
                    dangerouslySetInnerHTML={{ 
                      __html: message.content
                        .replace(/\n\n/g, '<br/><br/>')
                        .replace(/\n/g, '<br/>') 
                    }}
                    style={{ 
                      direction: 'rtl', 
                      textAlign: 'right',
                      maxWidth: '100%', 
                      overflowWrap: 'break-word'
                    }}
                  />
                  {message.isStreaming && <span className="typing-animation ml-1"></span>}
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
