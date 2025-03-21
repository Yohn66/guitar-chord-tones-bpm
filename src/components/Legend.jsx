import React from 'react';
import { chordDefinitions, chordColors } from '../data/chords';
import { getNoteLabel, getChordRomanNotation } from '../utils/musicTheory';

const Legend = ({ chord, onBackToList, onPrevChord, onNextChord, songKey }) => {
  const definition = chordDefinitions[chord];
  
  if (!definition) return null;
  
  // コードタイプの日本語表記
  const chordTypeJapanese = {
    'major': 'メジャー',
    'minor': 'マイナー',
    'dominant7': 'ドミナント7',
    'major7': 'メジャー7',
    'minor7': 'マイナー7',
    'half-diminished': 'ハーフディミニッシュ',
    'dominant7-suspended4': 'ドミナント7サス4'
  };

  // カレントコードのキー情報を取得
  const currentKey = songKey || 'Gm'; // デフォルトでGmを使用
  const romanNotation = getChordRomanNotation(chord, currentKey, chordDefinitions);

  // オンコードかどうかを確認
  const isOnChord = definition.bass && definition.bassInterval;

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold mb-3">
          コード情報: {chord} {romanNotation && <span className="text-gray-600">({romanNotation})</span>}
        </h3>
        
        <div className="mb-3">
          <p className="text-lg">ルート音: <strong>{definition.root}</strong></p>
          <p className="text-lg">コードタイプ: <strong>{chordTypeJapanese[definition.type] || definition.type}</strong></p>
          {isOnChord && (
            <p className="text-lg">ベース音: <strong>{definition.bass}</strong></p>
          )}
        </div>
        
        <h4 className="text-lg font-bold mb-2">構成音:</h4>
        <div className="flex flex-wrap gap-3">
          {definition.notes.map((note, index) => {
            // オンコードの場合、ベース音かどうかを判定
            const isBassNote = isOnChord && note === definition.bassInterval;
            return (
              <div key={index} className="flex items-center mb-1">
                <div 
                  className="w-10 h-10 rounded-full mr-2 flex items-center justify-center text-white font-bold"
                  style={{ 
                    backgroundColor: isBassNote ? chordColors.bassNote : chordColors.default[index] 
                  }}
                >
                  {note}
                </div>
                <span className="text-lg">{getNoteLabel(note, isBassNote)}</span>
              </div>
            );
          })}
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