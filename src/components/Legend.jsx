import React from 'react';
import { chordDefinitions, chordColors } from '../data/chords';
import { getNoteLabel } from '../utils/musicTheory';

const Legend = ({ chord }) => {
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
    <div className="mt-6 bg-white p-4 rounded-lg shadow w-1/2 mx-auto">
      <h3 className="text-lg font-bold mb-2">コード情報: {chord}</h3>
      
      <div className="mb-4">
        <p>ルート音: <strong>{definition.root}</strong></p>
        <p>コードタイプ: <strong>{chordTypeJapanese[definition.type] || definition.type}</strong></p>
      </div>
      
      <h4 className="font-bold mb-2">構成音:</h4>
      <div className="flex flex-wrap gap-4">
        {definition.notes.map((note, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: chordColors.default[index] }}
            >
              {note}
            </div>
            <span>{getNoteLabel(note)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;