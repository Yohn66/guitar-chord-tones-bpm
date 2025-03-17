import React from 'react';

const ChordDetailView = ({ 
  chord, 
  progression, 
  currentIndex,
  onPrevChord,
  onNextChord
}) => {
  const prevChord = progression[(currentIndex - 1 + progression.length) % progression.length];
  const nextChord = progression[(currentIndex + 1) % progression.length];
  
  return (
    <div className="flex flex-col items-center p-4 w-full">
      <div className="w-full flex justify-between items-center mb-2">
        {/* 固定幅クラスを追加 */}
        <div 
          className="w-1/3 text-right pr-4 text-3xl text-gray-500 cursor-pointer hover:text-blue-500 transition-colors"
          onClick={onPrevChord}
        >
          ← {prevChord}
        </div>
        {/* 中央のコードにも固定幅 */}
        <h2 className="w-1/3 text-center text-6xl font-bold">{chord}</h2>
        {/* 固定幅クラスを追加 */}
        <div 
          className="w-1/3 text-left pl-4 text-3xl text-gray-500 cursor-pointer hover:text-blue-500 transition-colors"
          onClick={onNextChord}
        >
          {nextChord} →
        </div>
      </div>
    </div>
  );
};

export default ChordDetailView;