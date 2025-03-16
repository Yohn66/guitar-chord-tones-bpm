import React, { useState, useEffect, useRef } from 'react';
import ChordProgressionView from './components/ChordProgressionView';
import ChordDetailView from './components/ChordDetailView';
import BpmTimer from './components/BpmTimer';
import { autumnLeavesProgression } from './data/progressions';

function App() {
  const [view, setView] = useState('list');
  const [currentChord, setCurrentChord] = useState('Cm7');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // BPM関連の状態変数
  const [bpm, setBpm] = useState(120);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [isCountIn, setIsCountIn] = useState(false);
  const [countInBeats, setCountInBeats] = useState(4);
  
  // タイマー用のRef
  const timerRef = useRef(null);
  const beatRef = useRef(null);
  const bpmTimerRef = useRef(null);
  
  // コード進行
  const progression = autumnLeavesProgression;
  
  const handleSelectChord = (chord, index) => {
    setCurrentChord(chord);
    setCurrentIndex(index);
    setView('detail');
  };
  
  const handlePrevChord = () => {
    const newIndex = (currentIndex - 1 + progression.length) % progression.length;
    setCurrentIndex(newIndex);
    setCurrentChord(progression[newIndex]);
  };
  
  const handleNextChord = () => {
    const newIndex = (currentIndex + 1) % progression.length;
    setCurrentIndex(newIndex);
    setCurrentChord(progression[newIndex]);
  };
  
  const handleBackToList = () => {
    if (isAutoplay) {
      stopAutoplay();
    }
    setView('list');
  };
  
  const handleBpmChange = (newBpm) => {
    setBpm(newBpm);
    
    if (isAutoplay) {
      stopAutoplay();
      startAutoplay();
    }
  };
  
  // ビートを開始する関数（4分音符のリズム表示用）
  const startBeat = () => {
    stopBeat(); // 既存のビートがあれば停止
    
    const beatInterval = (60 / bpm) * 1000; // 4分音符1拍の間隔（ミリ秒）
    
    // BPMタイマーコンポーネントの参照
    if (bpmTimerRef.current && typeof bpmTimerRef.current.startBeat === 'function') {
      bpmTimerRef.current.startBeat();
    }
  };
  
  // ビートを停止する関数
  const stopBeat = () => {
    if (beatRef.current) {
      clearInterval(beatRef.current);
      beatRef.current = null;
    }
    
    if (bpmTimerRef.current && typeof bpmTimerRef.current.stopBeat === 'function') {
      bpmTimerRef.current.stopBeat();
    }
  };
  
  // カウントイン開始
  const startCountIn = () => {
    // まず既存のタイマーをクリア
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsCountIn(true);
    setCountInBeats(4); // カウントダウン表示のため4から開始
    
    // ビート表示を開始（タップの計測状態もリセットされる）
    startBeat();
    
    // 4分音符2拍ごとのタイマー（1カウント = 2拍）
    const countInterval = 2 * (60 / bpm) * 1000;
    
    let beatsCounter = 4; // 4→3→2→1のカウントダウン
    
    timerRef.current = setInterval(() => {
      beatsCounter--;
      setCountInBeats(beatsCounter);
      
      if (beatsCounter <= 0) {
        // カウントイン終了、自動再生開始
        clearInterval(timerRef.current);
        timerRef.current = null;
        setIsCountIn(false);
        
        // 自動コード切り替え開始
        startChordAutoplay();
      }
    }, countInterval);
  };
  
  // 自動コード切り替え開始
  const startChordAutoplay = () => {
    console.log("自動再生を開始します");
    
    // 既存のタイマーをクリア
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // 1小節の長さ（ミリ秒）= 4拍 * (60秒 / BPM) * 1000
    const barInterval = 4 * (60 / bpm) * 1000;
    
    setIsAutoplay(true);
    
    // コード切り替えインターバルを設定
    timerRef.current = setInterval(() => {
      console.log("コードを次に進めます");
      // Stateを直接更新するため、セッターを使用
      setCurrentIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % progression.length;
        
        // 最後のコードに達したかチェック
        if (newIndex === 0) {
          // 最後まで来たので停止
          console.log("最後のコードまで到達しました。自動再生を停止します。");
          stopAutoplay();
          return prevIndex; // 最後のコードのままにする
        }
        
        // currentChordも更新
        setCurrentChord(progression[newIndex]);
        return newIndex;
      });
    }, barInterval);
  };
  
  // 自動再生の開始
  const startAutoplay = () => {
    startCountIn();
  };
  
  // 自動再生の停止
  const stopAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsAutoplay(false);
    setIsCountIn(false);
    stopBeat();
  };
  
  // 自動再生の切り替え
  const toggleAutoplay = () => {
    if (isAutoplay || isCountIn) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  };
  
  // コンポーネントのアンマウント時にクリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (beatRef.current) {
        clearInterval(beatRef.current);
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">ギター用コードトーン表示アプリ</h1>
      </header>
      
      <main className="container mx-auto py-6">
        {view === 'detail' && (
          <div className="mb-6">
            <BpmTimer 
              onBpmChange={handleBpmChange} 
              ref={bpmTimerRef}
            />
            
            <div className="mt-4 flex justify-center">
              <button
                onClick={toggleAutoplay}
                className={`px-8 py-3 rounded-lg text-white font-bold text-lg ${
                  isAutoplay || isCountIn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isCountIn 
                  ? `${countInBeats}` 
                  : isAutoplay 
                    ? '自動再生停止' 
                    : '自動再生開始'
                }
              </button>
            </div>
          </div>
        )}
        
        {view === 'list' ? (
          <ChordProgressionView 
            progression={progression} 
            onSelectChord={handleSelectChord} 
          />
        ) : (
          <ChordDetailView 
            chord={currentChord}
            onBackToList={handleBackToList}
            onPrevChord={handlePrevChord}
            onNextChord={handleNextChord}
            progression={progression}
            currentIndex={currentIndex}
          />
        )}
      </main>
      
      <footer className="bg-gray-200 p-4 text-center text-gray-600">
        <p>ギターコード進行アプリ - 枯葉</p>
      </footer>
    </div>
  );
}

export default App;