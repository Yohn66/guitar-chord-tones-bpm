import React, { useEffect } from 'react';

const ChordDetailView = ({ 
  chord, 
  progression, 
  currentIndex,
  onPrevChord,
  onNextChord,
  onFirstChord
}) => {
  // 最初と最後のインデックスを計算
  const isFirstChord = currentIndex === 0;
  const isLastChord = currentIndex === progression.length - 1;
  
  // 前後のコードを取得（最初と最後の場合はnullを返す）
  const prevChord = !isFirstChord ? progression[currentIndex - 1] : null;
  const nextChord = !isLastChord ? progression[currentIndex + 1] : null;
  
  // キーボードの左右キーでコード移動
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && !isFirstChord) {
        onPrevChord();
      } else if (e.key === 'ArrowRight' && !isLastChord) {
        onNextChord();
      }
    };
    
    // イベントリスナーを追加
    window.addEventListener('keydown', handleKeyDown);
    
    // クリーンアップ関数
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPrevChord, onNextChord, isFirstChord, isLastChord]);
  
  return (
    <div className="flex flex-col items-center p-4 w-full">
      {/* コード表示部分 */}
      <div className="w-full flex justify-between items-center mb-4">
        {/* 前のコード - 最初のコードの場合は表示しない */}
        <div className="w-1/3 text-right pr-4">
          {prevChord && (
            <div 
              className="text-3xl text-gray-500 cursor-pointer hover:text-blue-500 transition-colors"
              onClick={onPrevChord}
            >
              ← {prevChord}
            </div>
          )}
        </div>
        
        {/* 中央のコード */}
        <h2 className="w-1/3 text-center text-6xl font-bold">{chord}</h2>
        
        {/* 次のコード - 最後のコードの場合は表示しない */}
        <div className="w-1/3 text-left pl-4">
          {nextChord && (
            <div 
              className="text-3xl text-gray-500 cursor-pointer hover:text-blue-500 transition-colors"
              onClick={onNextChord}
            >
              {nextChord} →
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChordDetailView;