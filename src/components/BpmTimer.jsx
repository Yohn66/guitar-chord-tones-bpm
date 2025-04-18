import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const BpmTimer = forwardRef(({ onBpmChange, isAutoplay, isCountIn, countInBeats, onToggleAutoplay, onToggleCountIn, enableCountIn }, ref) => {
  const [bpm, setBpm] = useState(120); // デフォルトのBPM
  const [isCalculating, setIsCalculating] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [inputBpm, setInputBpm] = useState('');
  const [isBeating, setIsBeating] = useState(false);
  
  // パルス状態を管理（一瞬だけ色が変わるように）
  const [pulsing, setPulsing] = useState(false);
  
  const tapTimesRef = useRef([]);
  const tapTimeoutRef = useRef(null);
  const beatIntervalRef = useRef(null);
  const pulseTimeoutRef = useRef(null);
  
  // 外部からアクセス可能なメソッドを公開
  useImperativeHandle(ref, () => ({
    startBeat: () => {
      // 計測中の状態をリセット
      setIsCalculating(false);
      startBeat();
    },
    stopBeat: () => {
      stopBeat();
    }
  }));
  
  // タップでBPMを計測する関数
  const handleTap = () => {
    // 自動再生中またはカウントイン中はタップを無効化
    if (isAutoplay || isCountIn) {
      return;
    }
    
    const now = Date.now();
    
    if (!isCalculating) {
      setIsCalculating(true);
      tapTimesRef.current = [now];
      setTapCount(1);
    } else {
      // 最後のタップから3秒以上経過していたらリセット
      if (now - tapTimesRef.current[tapTimesRef.current.length - 1] > 3000) {
        tapTimesRef.current = [now];
        setTapCount(1);
        return;
      }
      
      // タップ時間を記録
      tapTimesRef.current.push(now);
      setTapCount(prev => prev + 1);
      
      // 少なくとも4回タップされたらBPMを計算
      if (tapTimesRef.current.length >= 4) {
        calculateBPM();
      }
    }
    
    // タイムアウトをリセット
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    
    // 3秒間タップがなければ計測モードを終了
    tapTimeoutRef.current = setTimeout(() => {
      setIsCalculating(false);
    }, 3000);
  };
  
  // タップをリセットする関数
  const resetTap = () => {
    // 自動再生中またはカウントイン中はリセットを無効化
    if (isAutoplay || isCountIn) {
      return;
    }
    
    setIsCalculating(false);
    setTapCount(0);
    tapTimesRef.current = [];
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
  };
  
  // BPMを計算する関数
  const calculateBPM = () => {
    const intervals = [];
    for (let i = 1; i < tapTimesRef.current.length; i++) {
      intervals.push(tapTimesRef.current[i] - tapTimesRef.current[i-1]);
    }
    
    // 平均インターバルを計算
    const averageInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
    
    // BPM = 60秒 / 平均インターバル(秒)
    const calculatedBpm = Math.round(60000 / averageInterval);
    
    // BPMの範囲を制限（例: 30-300 BPM）
    const validBpm = Math.min(Math.max(calculatedBpm, 30), 300);
    
    setBpm(validBpm);
    if (onBpmChange) {
      onBpmChange(validBpm);
    }
  };
  
  // 入力フィールドからBPMを直接設定
  const handleBpmInputChange = (e) => {
    setInputBpm(e.target.value);
  };
  
  const handleBpmInputSubmit = (e) => {
    e.preventDefault();
    // 全角数字を半角に変換
    const normalizedInput = inputBpm.replace(/[０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    const newBpm = parseInt(normalizedInput, 10);
    if (!isNaN(newBpm) && newBpm >= 30 && newBpm <= 300) {
      setBpm(newBpm);
      if (onBpmChange) {
        onBpmChange(newBpm);
      }
    }
    setInputBpm('');
  };
  
  // パルスのアニメーション（一瞬だけ色を変える）
  const pulse = () => {
    // パルスをオンに
    setPulsing(true);
    
    // 既存のタイムアウトをクリア
    if (pulseTimeoutRef.current) {
      clearTimeout(pulseTimeoutRef.current);
    }
    
    // 50ms後にパルスをオフに（より短いフラッシュ効果）
    pulseTimeoutRef.current = setTimeout(() => {
      setPulsing(false);
    }, 50); // 点滅時間を100msから50msに短縮
  };
  
  // ビートを開始する関数（改良版）
  const startBeat = () => {
    stopBeat(); // 既存のビートがあれば停止
    
    const beatInterval = (60 / bpm) * 1000; // 4分音符1拍の間隔（ミリ秒）
    
    setIsBeating(true);
    
    // まず最初のパルスを実行
    pulse();
    
    beatIntervalRef.current = setInterval(() => {
      // 各ビートで一瞬だけ色を変える
      pulse();
    }, beatInterval);
  };
  
  // ビートを停止する関数
  const stopBeat = () => {
    if (beatIntervalRef.current) {
      clearInterval(beatIntervalRef.current);
      beatIntervalRef.current = null;
    }
    if (pulseTimeoutRef.current) {
      clearTimeout(pulseTimeoutRef.current);
      pulseTimeoutRef.current = null;
    }
    setIsBeating(false);
    setPulsing(false);
  };
  
  // 再生/停止ボタンクリック時の処理
  const handlePlayClick = () => {
    if (isAutoplay || isCountIn) {
      // 再生中なら停止
      onToggleAutoplay('stop');
    } else {
      // 停止中なら再生開始
      onToggleAutoplay('play');
    }
  };
  
  // 自動再生中はビートを表示するためのeffect
  useEffect(() => {
    if (isAutoplay && !isBeating) {
      // 自動再生中で、まだビートが開始されていない場合、ビートを開始
      startBeat();
    } else if (!isAutoplay && !isCountIn && isBeating) {
      // 自動再生が停止され、カウントインもなく、ビートが動いている場合、ビートを停止
      stopBeat();
    }
  }, [isAutoplay, isCountIn, isBeating]);
  
  // コンポーネントがアンマウントされるときにタイマーをクリア
  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
      if (beatIntervalRef.current) {
        clearInterval(beatIntervalRef.current);
      }
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-full">
      <h3 className="text-xl font-bold mb-4 text-center">BPM設定</h3>
      
      <div className="flex flex-wrap items-center justify-between">
        {/* タップボタンエリア（左） */}
        <div className="w-1/3 pr-2 flex flex-col items-center">
          {/* タップボタン（文字サイズを9倍に拡大） */}
          <div className="w-1/2 mb-2">
            <button
              onClick={handleTap}
              disabled={isAutoplay || isCountIn}
              className={`w-full aspect-square rounded-lg text-white font-bold flex items-center justify-center ${
                isAutoplay || isCountIn
                  ? (pulsing ? 'bg-yellow-400' : 'bg-gray-400') // 自動再生中も点滅させる
                  : isCalculating 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : pulsing 
                      ? 'bg-yellow-400' // パルス時に黄色フラッシュ
                      : isBeating 
                        ? 'bg-blue-600' // 通常時
                        : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isCalculating ? (
                <span className="text-4xl">{tapCount}</span> // 9倍大きく
              ) : (
                <span className="text-4xl">{isBeating ? '♪' : 'TAP'}</span> // 9倍大きく
              )}
            </button>
          </div>
          
          {/* リセットボタン */}
          <button
            onClick={resetTap}
            disabled={isAutoplay || isCountIn}
            className={`text-sm px-3 py-1 rounded ${
              isAutoplay || isCountIn
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            リセット
          </button>
        </div>
        
        {/* 現在のBPM表示（中央）（2倍に拡大） */}
        <div className="w-1/3 text-center">
          <span className="text-5xl font-bold block">{bpm}</span> {/* 2倍に拡大 */}
          <span className="text-xl block">BPM</span> {/* 2倍に拡大 */}
        </div>
        
        {/* BPM入力フォーム（右） */}
        <div className="w-1/3 pl-2">
          <form onSubmit={handleBpmInputSubmit} className="flex">
            <input
              type="text"
              value={inputBpm}
              onChange={handleBpmInputChange}
              placeholder="BPM入力"
              className="w-full px-2 py-1 border rounded mr-1 text-center"
            />
            <button 
              type="submit"
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              設定
            </button>
          </form>
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 text-center">
        曲に合わせてタップすると、テンポ(BPM)を自動計算します
      </p>
      
      {/* 再生コントロールエリア */}
      <div className="mt-4 flex flex-col items-center justify-center space-y-3">
        {/* 再生コントロールボタン */}
        <div className="flex space-x-4 items-center">
          {/* 再生/停止ボタン */}
          <button 
            onClick={handlePlayClick}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
              isCountIn ? 'bg-amber-500' : isAutoplay ? 'bg-red-500' : 'bg-green-500'
            }`}
            aria-label={isAutoplay || isCountIn ? "停止" : "再生"}
          >
            {isCountIn ? (
              <span className="text-xl font-bold">{countInBeats}</span>
            ) : isAutoplay ? (
              /* 停止アイコン（四角） */
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <rect x="6" y="6" width="12" height="12" />
              </svg>
            ) : (
              /* 再生アイコン（三角形） */
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
        
        {/* カウントイントグルスイッチ */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">カウントイン</span>
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={enableCountIn}
              onChange={() => onToggleCountIn && onToggleCountIn()}
              disabled={isAutoplay || isCountIn}
            />
            <div className={`relative w-11 h-6 rounded-full peer
              ${enableCountIn ? 'bg-blue-600' : 'bg-gray-200'}
              ${isAutoplay || isCountIn ? 'opacity-50 cursor-not-allowed' : ''}
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
      </div>
    </div>
  );
});

export default BpmTimer;