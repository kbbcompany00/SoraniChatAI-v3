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

  // Clear input field
  const clearInput = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-2xl mx-auto">
        <form className="flex items-center gap-3" onSubmit={handleSubmit}>
          <div className="relative flex-1">
            <input 
              type="text" 
              id="message-input"
              ref={inputRef}
              className="w-full border border-gray-300 rounded-full py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="پرسیارێک بنووسە... (دەتوانیت بە هەر زمانێک بنووسیت)"
              value={value}
              onChange={(e) => onChange(e.target.value)}
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
            className="bg-primary hover:bg-indigo-700 text-white rounded-full p-2.5 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitDisabled}
          >
            <span className="material-icons">send</span>
          </button>
        </form>

        {/* Language Detection Indicator */}
        {isNonKurdishDetected && (
          <div className="flex items-center justify-center mt-2 text-xs text-gray-500 gap-1.5">
            <span className="material-icons text-xs">translate</span>
            <p>زمانی ئینگلیزی ناسرایەوە، وەڵامەکەت بە کوردی دەبێت</p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default MessageInput;
