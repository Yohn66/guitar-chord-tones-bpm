import React from 'react';
import { chordDefinitions, chordColors } from '../data/chords';
import { getNoteLabel } from '../utils/musicTheory';

const Legend = ({ chord, onBackToList, onPrevChord, onNextChord }) => {
  const definition = chordDefinitions[chord];
  
  if (!definition) return null;
  
  // コードタイプの日本語表記
  const chordTypeJapanese = {
    'major': 'メジャー',
    'minor': 'マイナー',
    'dominant7': 'ドミナント7',
    'major7': 'メジャー7',
    'minor7': 'マイナー7',
    'half-diminished': 'ハーフディミニッシュ'
  };

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold mb-3">コード情報: {chord}</h3>
        
        <div className="mb-3">
          <p className="text-lg">ルート音: <strong>{definition.root}</strong></p>
          <p className="text-lg">コードタイプ: <strong>{chordTypeJapanese[definition.type] || definition.type}</strong></p>
        </div>
        
        <h4 className="text-lg font-bold mb-2">構成音:</h4>
        <div className="flex flex-wrap gap-3">
          {definition.notes.map((note, index) => (
            <div key={index} className="flex items-center mb-1">
              <div 
                className="w-10 h-10 rounded-full mr-2 flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: chordColors.default[index] }}
              >
                {note}
              </div>
              <span className="text-lg">{getNoteLabel(note)}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* ナビゲーションボタン */}
      {onBackToList && onPrevChord && onNextChord && (
        <div className="flex justify-between mt-4">
          <button 
            onClick={onPrevChord}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-base"
          >
            ← 前のコード
          </button>
          <button 
            onClick={onBackToList}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-base mx-1"
          >
            コード一覧に戻る
          </button>
          <button 
            onClick={onNextChord}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-base"
          >
            次のコード →
          </button>
        </div>
      )}
    </div>
  );
};

export default Legend;