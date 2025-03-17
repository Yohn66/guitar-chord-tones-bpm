import React from 'react';
import { getChordRomanNotation } from '../utils/musicTheory';
import { chordDefinitions } from '../data/chords';

const ChordProgressionView = ({ progression, onSelectChord }) => {
  // 4小節ずつに分割して行を作成
  const createRows = () => {
    const rows = [];
    const chordsPerRow = 4; // 1行あたり4小節
    
    // 現状はまだ小節＝コードの1対1対応なので、単純に4つずつ分割
    for (let i = 0; i < progression.chords.length; i += chordsPerRow) {
      rows.push(progression.chords.slice(i, i + chordsPerRow));
    }
    return rows;
  };
  
  const rows = createRows();
  
  return (
    <div className="flex flex-col items-center p-4 w-full">
      {/* ヘッダー部分 - 曲名とキー */}
      <div className="mb-8 w-full text-center border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold mb-2">{progression.title}</h1>
        <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-lg">
          キー: {progression.key}
        </div>
      </div>
      
      {/* コード進行表示エリア */}
      <div className="w-full max-w-4xl">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="mb-6 w-full">
            {/* 小節番号表示 */}
            <div className="flex w-full mb-1 text-sm text-gray-600">
              {row.map((_, barIndex) => (
                <div key={barIndex} className="flex-1 text-left pl-2">
                  {rowIndex * 4 + barIndex + 1}
                </div>
              ))}
            </div>
            
            {/* コード表示 */}
            <div className="flex w-full border-t-2 border-b-2 border-gray-800">
              {row.map((chord, barIndex) => (
                <div 
                  key={barIndex} 
                  className={`flex-1 min-h-24 flex items-center justify-center py-4 ${
                    barIndex < row.length - 1 ? 'border-r border-gray-400' : ''
                  }`}
                  style={{ borderLeft: barIndex === 0 ? '1px solid #ccc' : 'none' }}
                >
                  <button
                    onClick={() => onSelectChord(chord, rowIndex * 4 + barIndex)}
                    className="w-full h-full flex flex-col items-center justify-center hover:bg-blue-50 transition-colors py-2"
                  >
                    <span className="text-xl font-bold mb-1">{chord}</span>
                    <span className="text-sm text-gray-600">
                      {getChordRomanNotation(chord, progression.key, chordDefinitions)}
                    </span>
                  </button>
                </div>
              ))}
              
              {/* 行の最後を埋める（4小節に満たない場合） */}
              {Array.from({ length: 4 - row.length }).map((_, i) => (
                <div 
                  key={`empty-${i}`} 
                  className="flex-1 min-h-24 border-r border-gray-400 bg-gray-50"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* ページ下部の説明 */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>コードをクリックすると、そのコードのトーン表示に移動します</p>
      </div>
    </div>
  );
};

export default ChordProgressionView;