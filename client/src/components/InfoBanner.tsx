import React from 'react';

interface InfoBannerProps {
  onDismiss: () => void;
}

const InfoBanner: React.FC<InfoBannerProps> = ({ onDismiss }) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-violet-100 px-6 py-5 text-indigo-700 shadow-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500"></div>
      <div className="flex items-center justify-between max-w-3xl mx-auto relative z-10">
        <div className="flex items-center">
          <div className="bg-purple-100 rounded-full p-2 ml-3">
            <span className="material-icons text-purple-600 text-xl">tips_and_updates</span>
          </div>
          <div>
            <p className="font-bold mb-1 text-purple-800">بەخێربێیت بۆ زیرەکی دەستکردی قەڵا</p>
            <p className="text-sm text-purple-700 leading-relaxed">
              دەتوانیت بە هەر زمانێک پرسیار بکەیت، زیرەکی دەستکردی قەڵا هەمیشە بە کوردی سۆرانی وەڵامت دەداتەوە 
              <span className="inline-block animate-pulse mx-1">✨</span>
            </p>
          </div>
        </div>
        <button 
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          onClick={onDismiss}
        >
          تێگەیشتم
        </button>
      </div>
      <div className="absolute bottom-0 right-0 opacity-5">
        <span className="material-icons text-8xl text-purple-900">castle</span>
      </div>
    </div>
  );
};

export default InfoBanner;
