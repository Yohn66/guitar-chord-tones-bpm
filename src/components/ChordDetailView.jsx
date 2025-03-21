import React, { useEffect } from 'react';

const ChordDetailView = ({ 
  chord, 
  progression, 
  currentIndex,
  onPrevChord,
  onNextChord,
  onFirstChord
}) => {
  const prevChord = progression[(currentIndex - 1 + progression.length) % progression.length];
  const nextChord = progression[(currentIndex + 1) % progression.length];
  
  // キーボードの左右キーでコード移動
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        onPrevChord();
      } else if (e.key === 'ArrowRight') {
        onNextChord();
      }
    };
    
    // イベントリスナーを追加
    window.addEventListener('keydown', handleKeyDown);
    
    // クリーンアップ関数
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPrevChord, onNextChord]);
  
  return (
    <div className="flex flex-col items-center p-4 w-full">
      {/* 最初のコードに戻るボタン - 上部に配置して独立させる */}
      <div className="w-full mb-2 text-left">
        <button
          onClick={onFirstChord}
          className="px-3 py-4 bg-gray-500 text-white rounded hover:bg-gray-600 text-lg"
        >
          最初のコードへ
        </button>
      </div>
      
      {/* コード表示部分 - 元の位置と同じになるようにする */}
      <div className="w-full flex justify-between items-center mb-2">
        {/* 前のコード */}
        <div 
          className="w-1/3 text-right pr-4 text-3xl text-gray-500 cursor-pointer hover:text-blue-500 transition-colors"
          onClick={onPrevChord}
        >
          ← {prevChord}
        </div>
        
        {/* 中央のコード */}
        <h2 className="w-1/3 text-center text-6xl font-bold">{chord}</h2>
        
        {/* 次のコード */}
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