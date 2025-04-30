import React from 'react';
import Fretboard from './Fretboard';

const PlaybackView = ({
  currentChord,
  nextChord,
  isAutoplay,
  isCountIn,
  countInBeats,
  bpm,
  onBpmChange,
  onToggleCountIn,
  enableCountIn,
  displayMode,
  setDisplayMode,
  showScale,
  onToggleScale,
  onToggleScreenMode,
  songKey,
  onPrevChord,
  onNextChord,
  onAutoplayAction,
  isTransitioning,
  progression,
  currentIndex
}) => {
  // 前後のコード名を取得（安全に）
  const getPrevChord = () => {
    if (!progression || progression.length === 0 || currentIndex <= 0) return '';
    return progression[(currentIndex - 1 + progression.length) % progression.length];
  };
  
  const getNextChordName = () => {
    if (!progression || progression.length === 0 || currentIndex >= progression.length - 1) return '';
    return progression[currentIndex + 1];
  };
  
  return (
    <div className="w-full">
      {/* 上部のモード切り替えバー */}
      <div className="flex justify-between items-center mb-4">
        {/* 左側: 画面モード切り替え */}
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={onToggleScreenMode}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg 
              bg-white text-gray-700 hover:bg-gray-100 border border-gray-200`}
          >
            通常
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg 
              bg-blue-600 text-white border border-gray-200`}
          >
            再生
          </button>
        </div>
        
        {/* 中央: 表示モード切替ボタン */}
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setDisplayMode('position')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              displayMode === 'position'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } border border-gray-200`}
          >
            数字
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('note')}
            className={`px-4 py-2 text-sm font-medium ${
              displayMode === 'note'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } border-t border-b border-gray-200`}
          >
            音名
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('degree')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              displayMode === 'degree'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } border border-gray-200`}
          >
            度数
          </button>
        </div>
        
        {/* 右側: スケール表示トグルボタン */}
        <button
          onClick={onToggleScale}
          className={`px-4 py-2 text-sm font-medium rounded-lg min-w-[130px] text-center ${
            showScale
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          スケール表示 {showScale ? 'ON' : 'OFF'}
        </button>
      </div>
      
      {/* コード表示部分 */}
      <div className="flex flex-col">
        {/* 前のコード・現在のコード・次のコード ナビゲーション */}
        <div className="flex items-center justify-center mb-2">
          <div className="w-1/4 text-right">
            <button
              onClick={onPrevChord}
              className={`px-4 py-2 text-xl text-gray-600 hover:text-blue-500 transition-colors ${isAutoplay ? 'invisible' : ''}`}
            >
              ← {getPrevChord()}
            </button>
          </div>
          
          <h2 className="w-1/2 text-4xl font-bold text-center">
            {currentChord}
          </h2>
          
          <div className="w-1/4 text-left">
            <button
              onClick={onNextChord}
              className={`px-4 py-2 text-xl text-gray-600 hover:text-blue-500 transition-colors ${isAutoplay ? 'invisible' : ''}`}
            >
              {getNextChordName()} →
            </button>
          </div>
        </div>
        
        {/* 現在のコードのフレットボード */}
        <Fretboard 
          chord={currentChord} 
          songKey={songKey}
          displayMode={displayMode}
          showScale={showScale}
        />
        
        {/* 次のコード */}
        <h2 className="text-4xl font-bold mt-4 mb-2 text-center">
          {nextChord}
        </h2>
        
        {/* 次のコードのフレットボード */}
        <Fretboard 
          chord={nextChord} 
          songKey={songKey}
          displayMode={displayMode}
          showScale={showScale}
        />
        
        {/* 再生コントロール - 左寄りに配置（再生中も同じ場所に表示） */}
        <div className="flex items-center mt-6 mb-2 space-x-6">
          {/* 再生/停止ボタン */}
          {isCountIn ? (
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white bg-amber-500">
              <span className="text-2xl font-bold">{countInBeats}</span>
            </div>
          ) : (
            <button 
              onClick={() => onAutoplayAction(isAutoplay ? 'stop' : 'play')}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${
                isAutoplay ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
              aria-label={isAutoplay ? "停止" : "再生"}
            >
              {isAutoplay ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          )}
          
          {/* カウントイン設定 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">カウントイン</span>
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={enableCountIn}
                onChange={onToggleCountIn}
                disabled={isAutoplay}
              />
              <div className={`relative w-11 h-6 rounded-full peer
                ${enableCountIn ? 'bg-blue-600' : 'bg-gray-200'}
                ${isAutoplay ? 'opacity-60' : ''}
                peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300
                after:content-[''] 
                after:absolute 
                after:top-[2px] 
                after:start-[2px] 
                after:bg-white 
                after:border-gray-300 
                after:border 
                after:rounded-full 
                after:h-5 
                after:w-5 
                after:transition-all
                ${enableCountIn ? 'after:translate-x-full' : ''}
              `}></div>
            </label>
          </div>
          
          {/* BPM表示 */}
          <div className="text-xl font-bold">
            BPM: {bpm}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybackView;