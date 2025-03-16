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
        <div 
          className="text-3xl text-gray-500 px-4 py-2 cursor-pointer hover:text-blue-500 transition-colors"
          onClick={onPrevChord}
        >
          ← {prevChord}
        </div>
        <h2 className="text-6xl font-bold">{chord}</h2>
        <div 
          className="text-3xl text-gray-500 px-4 py-2 cursor-pointer hover:text-blue-500 transition-colors"
          onClick={onNextChord}
        >
          {nextChord} →
        </div>
      </div>
    </div>
  );
};

export default ChordDetailView;