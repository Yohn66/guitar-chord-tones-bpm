import React, { useState, useEffect, useRef } from 'react';
import ChordProgressionView from './components/ChordProgressionView';
import ChordDetailView from './components/ChordDetailView';
import BpmTimer from './components/BpmTimer';
import Fretboard from './components/Fretboard';
import Legend from './components/Legend';
import SongSelectionView from './components/SongSelectionView';
import PlaybackView from './components/PlaybackView'; // 新しいコンポーネント
import { songList } from './data/progressions';

function App() {
  // 現在選択されている曲を保存
  const [currentSong, setCurrentSong] = useState(null);
  const [view, setView] = useState('songSelection'); // 'songSelection', 'list', 'detail'
  const [currentChord, setCurrentChord] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 表示モード状態の追加
  const [displayMode, setDisplayMode] = useState('position'); // 初期値を'position'に変更
  // スケール表示のオン/オフ
  const [showScale, setShowScale] = useState(false); // 初期値をfalseに変更
  
  // 画面モード（通常 or 再生）
  const [screenMode, setScreenMode] = useState('normal'); // 'normal' または 'playback'
  
  // 次のコードの情報
  const [nextChordIndex, setNextChordIndex] = useState(1);
  const [nextChord, setNextChord] = useState('');
  
  // BPM関連の状態変数
  const [bpm, setBpm] = useState(120);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [isCountIn, setIsCountIn] = useState(false);
  const [countInBeats, setCountInBeats] = useState(4);
  // カウントイン設定と一時停止状態の追加
  const [enableCountIn, setEnableCountIn] = useState(true); // デフォルトでカウントインを有効にする
  const [isPaused, setIsPaused] = useState(false); // 一時停止状態を管理
  
  // アニメーション状態
  const [isTransitioning, setIsTransitioning] = useState(false);
  
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
        // 次のコードも設定（存在する場合）
        if (song.chords.length > 1) {
          setNextChord(song.chords[1]);
        } else {
          setNextChord('');
        }
      }
      setCurrentIndex(0);
      setNextChordIndex(1);
      setView('list');
      setScreenMode('normal'); // 画面モードを通常に戻す
    }
  };
  
  // 曲選択画面に戻る
  const handleBackToSongSelection = () => {
    if (isAutoplay) {
      stopAutoplay();
    }
    setView('songSelection');
    setScreenMode('normal'); // 画面モードを通常に戻す
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
  
  // 画面モードの切り替え
  const handleToggleScreenMode = () => {
    if (screenMode === 'normal') {
      // 通常 → 再生モードへ切り替え
      setScreenMode('playback');
      // 次のコードを設定
      const nextIdx = (currentIndex + 1) % progression.length;
      setNextChordIndex(nextIdx);
      setNextChord(progression[nextIdx]);
    } else {
      // 再生モード → 通常モードへ切り替え
      setScreenMode('normal');
      if (isAutoplay) {
        stopAutoplay();
      }
    }
  };
  
  const handleSelectChord = (chord, index) => {
    setCurrentChord(chord);
    setCurrentIndex(index);
    
    // 次のコードも設定（存在する場合）
    const nextIdx = (index + 1) % progression.length;
    setNextChordIndex(nextIdx);
    setNextChord(progression[nextIdx]);
    
    setView('detail');
  };
  
  const handlePrevChord = () => {
    const newIndex = (currentIndex - 1 + progression.length) % progression.length;
    setCurrentIndex(newIndex);
    setCurrentChord(progression[newIndex]);
    
    // 次のコードも更新
    const nextIdx = (newIndex + 1) % progression.length;
    setNextChordIndex(nextIdx);
    setNextChord(progression[nextIdx]);
  };
  
  const handleNextChord = () => {
    const newIndex = (currentIndex + 1) % progression.length;
    setCurrentIndex(newIndex);
    setCurrentChord(progression[newIndex]);
    
    // 次のコードも更新
    const nextIdx = (newIndex + 1) % progression.length;
    setNextChordIndex(nextIdx);
    setNextChord(progression[nextIdx]);
  };
  
  // 最初のコードに戻る処理
  const handleFirstChord = () => {
    setCurrentIndex(0);
    setCurrentChord(progression[0]);
    
    // 次のコードも更新
    if (progression.length > 1) {
      setNextChordIndex(1);
      setNextChord(progression[1]);
    } else {
      setNextChordIndex(0);
      setNextChord('');
    }
  };
  
  // スケール表示のトグル
  const handleToggleScale = () => {
    setShowScale(prev => !prev);
  };
  
  const handleBackToList = () => {
    if (isAutoplay) {
      stopAutoplay();
    }
    setView('list');
    setScreenMode('normal'); // 画面モードを通常に戻す
  };
  
  const handleBpmChange = (newBpm) => {
    setBpm(newBpm);
    
    if (isAutoplay) {
      stopAutoplay();
      startAutoplay();
    }
  };
  
  // カウントイン設定のトグル
  const handleToggleCountIn = () => {
    setEnableCountIn(prev => !prev);
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
  
  // コード切り替えのアニメーション処理
  const animateChordChange = () => {
    setIsTransitioning(true);
    
    // アニメーション完了後に状態を更新（500ms = アニメーション時間）
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
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
  
  // 自動コード切り替え開始（アニメーション対応版）
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
    setIsPaused(false);
    
    // コード切り替えインターバルを設定
    timerRef.current = setInterval(() => {
      console.log("コードを次に進めます");
      
      // アニメーションを開始
      animateChordChange();
      
      // 次のコードに進む
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
        
        // 次のコードを更新
        const nextNextIndex = (newIndex + 1) % progression.length;
        setNextChordIndex(nextNextIndex);
        setNextChord(progression[nextNextIndex]);
        
        return newIndex;
      });
    }, barInterval);
  };
  
  // 自動再生の一時停止
  const pauseAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPaused(true);
    stopBeat();
  };
  
  // 自動再生の再開
  const resumeAutoplay = () => {
    startChordAutoplay();
    setIsPaused(false);
  };
  
  // 自動再生の開始
  const startAutoplay = () => {
    if (enableCountIn) {
      startCountIn();
    } else {
      startChordAutoplay();
    }
  };
  
  // 自動再生の停止
  const stopAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsAutoplay(false);
    setIsCountIn(false);
    setIsPaused(false);
    stopBeat();
  };
  
  // 自動再生のアクション処理（再生/一時停止/停止/再開）
  const handleAutoplayAction = (action) => {
    switch (action) {
      case 'play':
        startAutoplay();
        break;
      case 'pause':
        pauseAutoplay();
        break;
      case 'resume':
        resumeAutoplay();
        break;
      case 'stop':
      default:
        stopAutoplay();
        break;
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
  
  // ヘッダーのタイトルを取得
  const getHeaderTitle = () => {
    if (view === 'detail' && currentSong) {
      return `${currentSong.title} - ${currentSong.artist} - キー: ${currentSong.key}`;
    } else {
      return 'ギター用コードトーン表示アプリ';
    }
  };
  
  // フッターのテキストを取得
  const getFooterText = () => {
    if (view === 'detail' && currentSong) {
      return `${currentSong.title} - ${currentSong.artist} - キー: ${currentSong.key}`;
    } else {
      return 'ギターコード進行アプリ';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダーは常に表示する（修正） */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{getHeaderTitle()}</h1>
          
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
          screenMode === 'playback' ? (
            <PlaybackView
              currentChord={currentChord}
              nextChord={nextChord}
              isAutoplay={isAutoplay}
              isCountIn={isCountIn}
              countInBeats={countInBeats}
              bpm={bpm}
              onBpmChange={handleBpmChange}
              onToggleCountIn={handleToggleCountIn}
              enableCountIn={enableCountIn}
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              showScale={showScale}
              onToggleScale={handleToggleScale}
              onToggleScreenMode={handleToggleScreenMode}
              songKey={currentSong.key}
              onPrevChord={handlePrevChord}
              onNextChord={handleNextChord}
              onAutoplayAction={handleAutoplayAction}
              isTransitioning={isTransitioning}
              progression={progression}
              currentIndex={currentIndex}
            />
          ) : (
            <>
              {/* 通常の詳細画面 */}
              <div className="w-full mb-6">
                {/* 画面モード切り替えとその他のボタン */}
                <div className="flex items-center justify-between mb-4">
                  {/* 左側: 画面モード切り替え */}
                  <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      onClick={() => setScreenMode('normal')}
                      className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                        screenMode === 'normal'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      } border border-gray-200`}
                    >
                      通常
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleScreenMode()}
                      className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                        screenMode === 'playback'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      } border border-gray-200`}
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
                    onClick={handleToggleScale}
                    className={`px-4 py-2 text-sm font-medium rounded-lg min-w-[130px] text-center ${
                      showScale
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    スケール表示 {showScale ? 'ON' : 'OFF'}
                  </button>
                </div>
                
                <ChordDetailView 
                  chord={currentChord}
                  progression={progression}
                  currentIndex={currentIndex}
                  onPrevChord={handlePrevChord}
                  onNextChord={handleNextChord}
                  onFirstChord={handleFirstChord}
                />
                
                <Fretboard 
                  chord={currentChord} 
                  songKey={currentSong.key}
                  displayMode={displayMode}
                  setDisplayMode={setDisplayMode}
                  showScale={showScale}
                  onToggleScale={handleToggleScale}
                />
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
                      onToggleAutoplay={handleAutoplayAction}
                      onToggleCountIn={handleToggleCountIn}
                      enableCountIn={enableCountIn}
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
          )
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
      
      {/* フッターは常に表示する（修正） */}
      <footer className="bg-gray-200 p-4 text-center text-gray-600">
        <p>{getFooterText()}</p>
      </footer>
    </div>
  );
}

export default App;