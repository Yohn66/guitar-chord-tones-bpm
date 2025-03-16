import React, { useState } from 'react';
import ChordProgressionView from './components/ChordProgressionView';
import ChordDetailView from './components/ChordDetailView';
import { autumnLeavesProgression } from './data/progressions';

function App() {
  const [view, setView] = useState('list'); // 'list' または 'detail'
  const [currentChord, setCurrentChord] = useState('Cm7');
  const [currentIndex, setCurrentIndex] = useState(0);
  
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
    setView('list');
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">ギター用コードトーン表示アプリ</h1>
      </header>
      
      <main className="container mx-auto py-6">
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