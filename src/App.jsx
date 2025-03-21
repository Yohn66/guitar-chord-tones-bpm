import React, { useState, useEffect, useRef } from 'react';
import ChordProgressionView from './components/ChordProgressionView';
import ChordDetailView from './components/ChordDetailView';
import BpmTimer from './components/BpmTimer';
import Fretboard from './components/Fretboard';
import Legend from './components/Legend';
import SongSelectionView from './components/SongSelectionView';
import { songList } from './data/progressions';

function App() {
  // 現在選択されている曲を保存
  const [currentSong, setCurrentSong] = useState(null);
  const [view, setView] = useState('songSelection'); // 'songSelection', 'list', 'detail'
  const [currentChord, setCurrentChord] = useState('');
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
  
  // 曲選択ハンドラ
  const handleSelectSong = (songId) => {
    const song = songList.find(s => s.id === songId);
    if (song) {
      setCurrentSong(song);
      // 曲の最初のコードを選択
      if (song.chords && song.chords.length > 0) {
        setCurrentChord(song.chords[0]);
      }
      setCurrentIndex(0);
      setView('list');
    }
  };
  
  // 曲選択画面に戻る
  const handleBackToSongSelection = () => {
    if (isAutoplay) {
      stopAutoplay();
    }
    setView('songSelection');
  };
  
  // コード進行（全てのコードを連結した配列）
  const getAllChords = () => {
    if (!currentSong) return [];
    
    // セクションがある場合はそこからコードを取得、ない場合は直接chordsを使用
    if (currentSong.sections) {
      return currentSong.sections.flatMap(section => section.chords);
    } else {
      return currentSong.chords;
    }
  };
  
  const progression = getAllChords();
  
  const handleSelectChord = (chord, index) => {
    setCurrentChord(chord);
    setCurrentIndex(index);
    setView('detail');
  };
  
  const handlePrevChord = () => {
    // 最初のコードの時は前に戻らない
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentChord(progression[newIndex]);
    }
  };
  
  const handleNextChord = () => {
    // 最後のコードの時は次に進まない
    if (currentIndex < progression.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentChord(progression[newIndex]);
    }
  };
  
  // 最初のコードに戻る処理
  const handleFirstChord = () => {
    setCurrentIndex(0);
    setCurrentChord(progression[0]);
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
        const newIndex = prevIndex + 1;
        
        // 最後のコードに達したかチェック
        if (newIndex >= progression.length) {
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
        <div className="container mx-auto flex justify-between items-center">
          {/* ヘッダータイトル - 曲が選択されている場合は曲情報を表示 */}
          {currentSong ? (
            <h1 className="text-2xl font-bold">{currentSong.title} - {currentSong.artist} (Key: {currentSong.key})</h1>
          ) : (
            <h1 className="text-2xl font-bold">ギター用コードトーン表示アプリ</h1>
          )}
          
          {/* 曲選択ボタン */}
          {view !== 'songSelection' && (
            <button
              onClick={handleBackToSongSelection}
              className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-50"
            >
              曲選択に戻る
            </button>
          )}
        </div>
      </header>
      
      <main className="container mx-auto py-6">
        {view === 'songSelection' ? (
          <SongSelectionView onSelectSong={handleSelectSong} />
        ) : view === 'list' && currentSong ? (
          <ChordProgressionView 
            progression={currentSong}
            onSelectChord={handleSelectChord} 
          />
        ) : view === 'detail' && currentSong ? (
          <>
            {/* コード表示とフレットボード - 全幅 */}
            <div className="w-full mb-6">
              <ChordDetailView 
                chord={currentChord}
                progression={progression}
                currentIndex={currentIndex}
                onPrevChord={handlePrevChord}
                onNextChord={handleNextChord}
                onFirstChord={handleFirstChord}
              />
              <Fretboard chord={currentChord} />
            </div>
            
            {/* 下部のコントロールパネル - グリッドレイアウト */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 左側: BPMタイマー */}
              <div>
                <BpmTimer 
                  onBpmChange={handleBpmChange} 
                  ref={bpmTimerRef}
                  isAutoplay={isAutoplay}
                  isCountIn={isCountIn}
                  countInBeats={countInBeats}
                  onToggleAutoplay={toggleAutoplay}
                />
              </div>
              
              {/* 右側: コード情報と操作ボタン */}
              <div>
                <Legend 
                  chord={currentChord}
                  songKey={currentSong.key}
                  onBackToList={handleBackToList}
                  onPrevChord={handlePrevChord}
                  onNextChord={handleNextChord}
                  currentIndex={currentIndex}
                  totalChords={progression.length}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl">曲が選択されていません</p>
            <button 
              onClick={handleBackToSongSelection} 
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              曲を選択する
            </button>
          </div>
        )}
      </main>
      
      <footer className="bg-gray-200 p-4 text-center text-gray-600">
        <p>
          ギターコード進行アプリ
          {currentSong && ` - ${currentSong.title} - キー: ${currentSong.key}`}
        </p>
      </footer>
    </div>
  );
}

export default App;