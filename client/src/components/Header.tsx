import React, { useState } from 'react';
import SettingsDialog from './SettingsDialog';
import headerBgImage from '../assets/header-bg.png';

interface HeaderProps {
  onClearChat?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClearChat }) => {
  const [showSettings, setShowSettings] = useState(false);
  
  // Function to refresh the page and clear the chat
  const handleClearChat = () => {
    if (onClearChat) {
      onClearChat();
    } else {
      // Fallback to reload if no handler provided
      window.location.reload();
    }
  };

  // Function to open settings dialog
  const openSettings = () => {
    setShowSettings(true);
  };

  return (
    <header className="sticky top-0 z-40 py-4 px-6 shadow-xl relative">
      {/* Background image */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: `url(${headerBgImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-secondary opacity-30 z-0" />
      
      {/* Content container */}
      <div className="flex items-center justify-between relative z-10">
        {/* Logo and title */}
        <div className="flex items-center">
          <div className="relative">
            <span className="material-icons text-white ml-3 text-3xl animate-pulse">castle</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-ping"></span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">زیرەکی دەستکردی قەڵا</h1>
            <p className="text-xs text-indigo-200 -mt-1">وەڵامی زیرەکانە بە کوردی سۆرانی</p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <button 
            type="button" 
            className="p-2.5 rounded-full hover:bg-white/20 transition-all duration-300 relative group" 
            aria-label="Clear chat"
            onClick={handleClearChat}
          >
            <span className="material-icons text-white">refresh</span>
            <span className="absolute -bottom-10 right-0 bg-white text-indigo-800 text-xs py-1.5 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap transform group-hover:-translate-y-1 duration-300">
              پاککردنەوەی چات
            </span>
          </button>
          <button 
            type="button" 
            className="p-2.5 rounded-full hover:bg-white/20 transition-all duration-300 relative group" 
            aria-label="Settings"
            onClick={openSettings}
          >
            <span className="material-icons text-white">settings</span>
            <span className="absolute -bottom-10 right-0 bg-white text-indigo-800 text-xs py-1.5 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap transform group-hover:-translate-y-1 duration-300">
              ڕێکخستنەکان
            </span>
          </button>
        </div>
      </div>
      
      {/* Settings Dialog */}
      <SettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings} 
      />
    </header>
  );
};

export default Header;
