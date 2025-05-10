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
    <footer className="bg-white border-t border-indigo-100 p-4 shadow-lg">
      <div className="max-w-3xl mx-auto">
        <form className="flex items-center gap-3" onSubmit={handleSubmit}>
          <div className="relative flex-1">
            <input 
              type="text" 
              id="message-input"
              ref={inputRef}
              className="w-full border border-indigo-200 rounded-full py-4 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-indigo-300 shadow-sm bg-indigo-50/30"
              placeholder="پرسیارێک بنووسە... (دەتوانیت بە هەر زمانێک بنووسیت)"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              dir="auto" // Auto-detect direction based on content
            />
            {value && (
              <button 
                type="button" 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" 
                onClick={clearInput}
              >
                <span className="material-icons">clear</span>
              </button>
            )}
          </div>
          <button 
            type="submit" 
            className="bg-gradient-to-r from-indigo-600 to-primary hover:from-indigo-700 hover:to-indigo-600 text-white rounded-full p-3.5 flex items-center justify-center transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitDisabled}
            aria-label="ناردن"
          >
            <span className="material-icons">send</span>
          </button>
        </form>

        {/* Language Detection Indicator */}
        {isNonKurdishDetected && (
          <div className="flex items-center justify-center mt-2.5 text-xs text-indigo-600 gap-1.5 bg-indigo-50 py-1.5 px-3 rounded-full mx-auto w-fit">
            <span className="material-icons text-xs">translate</span>
            <p>زمانی ئینگلیزی ناسرایەوە، وەڵامەکەت بە کوردی دەبێت</p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default MessageInput;
