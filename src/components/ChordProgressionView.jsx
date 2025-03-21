import React from 'react';
import { getChordRomanNotation } from '../utils/musicTheory';
import { chordDefinitions } from '../data/chords';

const ChordProgressionView = ({ progression, onSelectChord }) => {
  // 各セクションごとに行を作成する関数
  const createSectionRows = (section) => {
    const rows = [];
    const chordsPerRow = 4; // 1行あたり4小節
    
    // 現状はまだ小節＝コードの1対1対応なので、単純に4つずつ分割
    for (let i = 0; i < section.chords.length; i += chordsPerRow) {
      rows.push(section.chords.slice(i, i + chordsPerRow));
    }
    return rows;
  };
  
  // インデックスを計算する関数（セクションをまたぐ場合の対応）
  const calculateGlobalIndex = (sectionIndex, rowIndex, barIndex) => {
    let globalIndex = 0;
    
    // それ以前のセクションのコード数を合計
    for (let i = 0; i < sectionIndex; i++) {
      globalIndex += progression.sections[i].chords.length;
    }
    
    // 現在のセクション内の位置を加算
    globalIndex += rowIndex * 4 + barIndex;
    
    return globalIndex;
  };
  
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
        {progression.sections.map((section, sectionIndex) => {
          const rows = createSectionRows(section);
          
          return (
            <div key={sectionIndex} className="mb-10">
              {/* セクション名のヘッダー - 同じ色の枠に変更 */}
              <div className="mb-2 font-bold text-lg border-2 border-gray-700 p-2 inline-block rounded">
                {section.name}
              </div>
              
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="mb-6 w-full">
                  {/* 小節番号表示 */}
                  <div className="flex w-full mb-1 text-sm text-gray-600">
                    {row.map((_, barIndex) => {
                      // セクション内の小節番号を計算
                      const barNumber = rowIndex * 4 + barIndex + 1;
                      return (
                        <div key={barIndex} className="flex-1 text-left pl-2">
                          {barNumber}
                        </div>
                      );
                    })}
                    
                    {/* 行の最後を埋める（4小節に満たない場合） */}
                    {Array.from({ length: 4 - row.length }).map((_, i) => (
                      <div 
                        key={`empty-num-${i}`} 
                        className="flex-1 text-left pl-2"
                      >
                        &nbsp;
                      </div>
                    ))}
                  </div>
                  
                  {/* コード表示 */}
                  <div className="flex w-full border-t-2 border-b-2 border-gray-800">
                    {row.map((chord, barIndex) => {
                      // グローバルなインデックスを計算（セクションをまたぐ場合も対応）
                      const globalIndex = calculateGlobalIndex(sectionIndex, rowIndex, barIndex);
                      
                      return (
                        <div 
                          key={barIndex} 
                          className="flex-1 min-h-24 flex items-center justify-center py-4 border-r border-gray-400"
                          style={{ borderLeft: barIndex === 0 ? '1px solid #ccc' : 'none' }}
                        >
                          <button
                            onClick={() => onSelectChord(chord, globalIndex)}
                            className="w-full h-full flex flex-col items-center justify-center hover:bg-blue-50 transition-colors py-2"
                          >
                            <span className="text-xl font-bold mb-1">{chord}</span>
                            <span className="text-sm text-gray-600">
                              {getChordRomanNotation(chord, progression.key, chordDefinitions)}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                    
                    {/* 行の最後を埋める（4小節に満たない場合） */}
                    {Array.from({ length: 4 - row.length }).map((_, i) => (
                      <div 
                        key={`empty-${i}`} 
                        className="flex-1 min-h-24 border-r border-gray-400"
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      
      {/* ページ下部の説明 */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>コードをクリックすると、そのコードのトーン表示に移動します</p>
      </div>
    </div>
  );
};

export default ChordProgressionView;