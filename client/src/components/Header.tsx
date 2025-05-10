import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <span className="material-icons text-primary ml-2">chat</span>
        <h1 className="text-xl font-semibold">هۆشی دەستکرد - کوردی سۆرانی</h1>
      </div>
      <div>
        <button 
          type="button" 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors" 
          aria-label="Settings"
        >
          <span className="material-icons text-gray-500">settings</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
