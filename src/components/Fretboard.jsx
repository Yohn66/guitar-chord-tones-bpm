import React from 'react';
import { calculateChordPositions } from '../utils/musicTheory';
import { chordDefinitions, chordColors } from '../data/chords';

const Fretboard = ({ chord }) => {
  const chordPositions = calculateChordPositions(chord, chordDefinitions, 21);
  const totalFrets = 21;
  
  // フレットマーカーがあるフレット位置
  const markerFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21];
  // 12フレットは特別なマーカー
  const specialMarkerFrets = [12];
  
  // フレット幅の計算（指数関数的に減少）
  const calculateFretWidthPercent = (fret) => {
    // 各フレットのサイズ減少率を98%とする
    const ratio = 0.98;
    // フレット位置に応じて幅を計算（パーセンテージで）
    return Math.pow(ratio, fret) * 100;
  };
  
  // 全フレットの合計パーセンテージを計算
  const calculateTotalPercent = () => {
    let total = 0;
    for (let i = 0; i <= totalFrets; i++) {
      total += calculateFretWidthPercent(i);
    }
    return total;
  };
  
  const totalPercent = calculateTotalPercent();
  
  // 実際の幅の計算（相対値）
  const getFretWidthStyle = (fret) => {
    // 各フレットのパーセンテージ
    const percentWidth = calculateFretWidthPercent(fret);
    // 全体に対する相対値を計算
    const relativeWidth = (percentWidth / totalPercent) * 100;
    
    return { 
      width: `${relativeWidth}%`,
      minWidth: fret === 0 ? '40px' : '24px' // 最小幅を設定
    };
  };
  
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow mx-auto">
      <div className="flex justify-center">
        <div className="w-full">
          {/* 弦表示 */}
          <div className="flex">
            {/* 弦番号 */}
            <div className="w-20 pr-2">
              {[1, 2, 3, 4, 5, 6].map(string => (
                <div 
                  key={string} 
                  className="h-10 flex items-center justify-end"
                >
                  <span className="text-sm font-medium px-3 py-1 rounded bg-blue-50 text-blue-700 whitespace-nowrap">
                    {string}弦
                  </span>
                </div>
              ))}
            </div>
            
            {/* フレットボード本体 */}
            <div className="flex-grow overflow-hidden">
              <div className="flex w-full">
                {/* 0フレット（ナット） */}
                <div 
                  className="border-r-2 border-gray-800 bg-gray-50"
                  style={getFretWidthStyle(0)}
                >
                  {[1, 2, 3, 4, 5, 6].map(string => {
                    const noteAtPosition = chordPositions.find(
                      pos => pos.string === string && pos.fret === 0
                    );
                    
                    return (
                      <div
                        key={string}
                        className="h-10 flex items-center justify-center border-b border-gray-400"
                      >
                        {noteAtPosition && (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ 
                              backgroundColor: chordColors.default[noteAtPosition.position - 1] 
                            }}
                          >
                            {noteAtPosition.note}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* 1~21フレット */}
                {Array.from({ length: totalFrets }).map((_, idx) => {
                  const fret = idx + 1;
                  const isMarker = markerFrets.includes(fret);
                  const isSpecialMarker = specialMarkerFrets.includes(fret);
                  
                  return (
                    <div 
                      key={fret}
                      className={`border-r border-gray-400 ${
                        isSpecialMarker ? 'bg-amber-50' : isMarker ? 'bg-gray-50' : ''
                      }`}
                      style={getFretWidthStyle(fret)}
                    >
                      {[1, 2, 3, 4, 5, 6].map(string => {
                        const noteAtPosition = chordPositions.find(
                          pos => pos.string === string && pos.fret === fret
                        );
                        
                        return (
                          <div
                            key={string}
                            className="h-10 flex items-center justify-center border-b border-gray-400"
                          >
                            {noteAtPosition && (
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm"
                                style={{ backgroundColor: chordColors.default[noteAtPosition.position - 1] }}
                              >
                                {noteAtPosition.note}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* フレット番号表示 */}
          <div className="flex mt-2">
            <div className="w-20"></div> {/* 弦番号と揃えるための余白 */}
            <div className="flex-grow flex">
              {/* 0フレット番号 */}
              <div style={getFretWidthStyle(0)} className="text-center">
                <span className="text-sm">0</span>
              </div>
              
              {/* 1~21フレット番号 */}
              {Array.from({ length: totalFrets }).map((_, idx) => {
                const fret = idx + 1;
                return (
                  <div key={fret} style={getFretWidthStyle(fret)} className="text-center">
                    <span className="text-sm">{fret}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fretboard;