import React from 'react';

interface HeaderProps {
  onClearChat?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClearChat }) => {
  // Function to refresh the page and clear the chat
  const handleClearChat = () => {
    if (onClearChat) {
      onClearChat();
    } else {
      // Fallback to reload if no handler provided
      window.location.reload();
    }
  };

  return (
    <header className="bg-gradient-to-l from-indigo-600 to-primary py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <span className="material-icons text-white ml-3 text-2xl">castle</span>
        <h1 className="text-xl font-bold text-white">زیرەکی دەستکردی قەڵا</h1>
      </div>
      <div className="flex gap-2">
        <button 
          type="button" 
          className="p-2 rounded-full hover:bg-indigo-700 transition-colors relative group" 
          aria-label="Clear chat"
          onClick={handleClearChat}
        >
          <span className="material-icons text-white">refresh</span>
          <span className="absolute -bottom-9 right-0 bg-white text-indigo-800 text-xs py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            پاککردنەوەی چات
          </span>
        </button>
        <button 
          type="button" 
          className="p-2 rounded-full hover:bg-indigo-700 transition-colors relative group" 
          aria-label="Settings"
        >
          <span className="material-icons text-white">settings</span>
          <span className="absolute -bottom-9 right-0 bg-white text-indigo-800 text-xs py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            ڕێکخستنەکان
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
