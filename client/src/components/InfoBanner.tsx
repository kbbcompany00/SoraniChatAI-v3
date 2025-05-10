import React from 'react';

interface InfoBannerProps {
  onDismiss: () => void;
}

const InfoBanner: React.FC<InfoBannerProps> = ({ onDismiss }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-200 px-6 py-4 text-indigo-700 shadow-sm">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        <div className="flex items-center">
          <span className="material-icons text-indigo-500 ml-3 text-xl">lightbulb</span>
          <div>
            <p className="font-medium mb-0.5">بەخێربێیت بۆ زیرەکی دەستکردی قەڵا</p>
            <p className="text-sm text-indigo-600">دەتوانیت بە هەر زمانێک پرسیار بکەیت، زیرەکی دەستکردی قەڵا هەمیشە بە کوردی سۆرانی وەڵامت دەداتەوە.</p>
          </div>
        </div>
        <button 
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 hover:text-indigo-800 px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={onDismiss}
        >
          تێگەیشتم
        </button>
      </div>
    </div>
  );
};

export default InfoBanner;
