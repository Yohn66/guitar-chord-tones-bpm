import React, { useEffect } from 'react';
import Fretboard from './Fretboard';
import Legend from './Legend';

const ChordDetailView = ({ 
  chord, 
  onBackToList, 
  onPrevChord, 
  onNextChord, 
  progression, 
  currentIndex 
}) => {
  const prevChord = progression[(currentIndex - 1 + progression.length) % progression.length];
  const nextChord = progression[(currentIndex + 1) % progression.length];
  
  // キーボードイベントのハンドラを追加
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        onPrevChord();
      } else if (event.key === 'ArrowRight') {
        onNextChord();
      }
    };
    
    // イベントリスナーを登録
    window.addEventListener('keydown', handleKeyDown);
    
    // クリーンアップ関数
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPrevChord, onNextChord]);
  
  return (
    <div className="flex flex-col items-center p-4 w-full">
      <div className="w-full flex justify-between items-center mb-2">
        <div 
          className="text-lg text-gray-500 cursor-pointer hover:text-blue-500 transition-colors px-4 py-2"
          onClick={onPrevChord}
        >
          ← {prevChord}
        </div>
        <h2 className="text-3xl font-bold">{chord}</h2>
        <div 
          className="text-lg text-gray-500 cursor-pointer hover:text-blue-500 transition-colors px-4 py-2"
          onClick={onNextChord}
        >
          {nextChord} →
        </div>
      </div>
      
      <Fretboard chord={chord} />
      
      <Legend chord={chord} />
      
      {/* ナビゲーションボタン */}
      <div className="flex space-x-4 mt-6">
        <button 
          onClick={onPrevChord}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ← 前のコード
        </button>
        <button 
          onClick={onBackToList}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          コード一覧に戻る
        </button>
        <button 
          onClick={onNextChord}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          次のコード →
        </button>
      </div>
    </div>
  );
};

export default ChordDetailView;