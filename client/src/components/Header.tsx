import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-l from-indigo-600 to-primary py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <span className="material-icons text-white ml-3 text-2xl">castle</span>
        <h1 className="text-xl font-bold text-white">زیرەکی دەستکردی قەڵا</h1>
      </div>
      <div className="flex gap-2">
        <button 
          type="button" 
          className="p-2 rounded-full hover:bg-indigo-700 transition-colors" 
          aria-label="Clear chat"
        >
          <span className="material-icons text-white">refresh</span>
        </button>
        <button 
          type="button" 
          className="p-2 rounded-full hover:bg-indigo-700 transition-colors" 
          aria-label="Settings"
        >
          <span className="material-icons text-white">settings</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
