import React from 'react';

interface InfoBannerProps {
  onDismiss: () => void;
}

const InfoBanner: React.FC<InfoBannerProps> = ({ onDismiss }) => {
  return (
    <div className="bg-indigo-50 border-indigo-200 border-b px-6 py-3 text-indigo-700 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="material-icons text-indigo-500 ml-2 text-lg">info</span>
          <p>دەتوانیت بە چەند زمانێک پرسیار بکەیت، بەڵام وەڵامەکان هەمیشە بە کوردی سۆرانی دەبن.</p>
        </div>
        <button 
          className="text-indigo-600 hover:text-indigo-800 font-medium"
          onClick={onDismiss}
        >
          تێگەیشتم
        </button>
      </div>
    </div>
  );
};

export default InfoBanner;
