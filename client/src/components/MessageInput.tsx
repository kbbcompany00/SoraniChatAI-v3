import React, { useState, useEffect, useRef } from 'react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isNonKurdishDetected: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  value, 
  onChange, 
  onSend, 
  isLoading,
  isNonKurdishDetected
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  
  // Update submit button disabled state
  useEffect(() => {
    setIsSubmitDisabled(!value.trim() || isLoading);
  }, [value, isLoading]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitDisabled) {
      onSend();
    }
  };
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Send message on Enter key (without Shift key)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isSubmitDisabled) {
        onSend();
      }
    }
  };

  // Clear input field
  const clearInput = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <footer className="sticky bottom-0 z-20 p-4 bg-white/80 backdrop-blur-md border-t border-purple-100 shadow-xl">
      <div className="max-w-3xl mx-auto">
        <form className="flex items-center gap-3" onSubmit={handleSubmit}>
          <div className="relative flex-1">
            <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-purple-400">
              <span className="material-icons">message</span>
            </div>
            <input 
              type="text" 
              id="message-input"
              ref={inputRef}
              className="w-full border border-purple-200 rounded-2xl py-4 pl-12 pr-14 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-md bg-white/90 transition-all duration-300"
              placeholder="پرسیارێک بنووسە... (دەتوانیت بە هەر زمانێک بنووسیت)"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              dir="auto" // Auto-detect direction based on content
            />
            {value && (
              <button 
                type="button" 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors" 
                onClick={clearInput}
              >
                <span className="material-icons">clear</span>
              </button>
            )}
          </div>
          <button 
            type="submit" 
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl p-3.5 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-purple-200/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            disabled={isSubmitDisabled}
            aria-label="ناردن"
          >
            <span className="material-icons">send</span>
          </button>
        </form>

        {/* Language Detection Indicator */}
        {isNonKurdishDetected && (
          <div className="flex items-center justify-center mt-3 text-xs text-purple-700 gap-1.5 bg-purple-50 py-2 px-4 rounded-lg mx-auto w-fit shadow-sm border border-purple-100 animate-fadeIn">
            <span className="material-icons text-sm text-purple-500">translate</span>
            <p>زمانی ئینگلیزی ناسرایەوە، وەڵامەکەت بە کوردی دەبێت</p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default MessageInput;
