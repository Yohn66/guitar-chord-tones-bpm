import React, { useState } from 'react';
import { calculateChordPositions, getNoteLabel, normalizeNote, usesFlats } from '../utils/musicTheory';
import { chordDefinitions, chordColors } from '../data/chords';

const Fretboard = ({ chord, songKey = 'C', displayMode, setDisplayMode, showScale = true, onToggleScale }) => {
  const chordPositions = calculateChordPositions(chord, chordDefinitions, 21);
  const totalFrets = 21;
  
  // フレットマーカーがあるフレット位置
  const markerFrets = [3, 5, 7, 9, 15, 17, 19, 21];
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
  
  // ノートのカラーを取得する関数
  const getNoteColor = (notePosition, isBassNote) => {
    return isBassNote ? chordColors.bassNote : chordColors.default[notePosition - 1];
  };
  
  // 表示モードに基づいてノートの表示テキストを取得する関数
  const getNoteText = (notePosition) => {
    if (!notePosition) return '';
    
    // キーに基づくフラット/シャープ表記の使用
    const useFlats = songKey ? usesFlats(songKey) : false;
    
    switch (displayMode) {
      case 'position':
        // 修正1: 数字表示を音度（半音数）に変更
        return notePosition.note;
      
      case 'note':
        // 音名表示 - キーに基づいてフラット/シャープを切り替え
        const normalizedNote = normalizeNote(
          notePosition.noteName, 
          useFlats
        );
        return normalizedNote;
      
      case 'degree':
        // 度数表示
        return getNoteLabel(notePosition.note).replace(/（ベース音）$/, '');
      
      default:
        return notePosition.note; // 修正1: デフォルトも音度（半音数）に変更
    }
  };
  
  // 平行長調に変換する関数
  const getRelativeMajorKey = (key) => {
    if (!key) return 'C'; // デフォルトはC
    
    // キーがマイナーかどうかをチェック
    const isMinor = key.endsWith('m');
    
    if (!isMinor) {
      return key; // メジャーキーの場合はそのまま返す
    }
    
    // マイナーキーからルート音を取得（末尾の'm'を削除）
    const root = key.replace(/m$/, '');
    
    // 音階配列（シャープ表記）
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // ルート音のインデックスを取得
    const rootIndex = notes.indexOf(root);
    
    if (rootIndex === -1) {
      console.error(`ルート音 ${root} が見つかりません`);
      return key;
    }
    
    // 平行長調のルート音は短調のルート音から3半音上
    // 例: Amの平行長調はC
    const relativeMajorIndex = (rootIndex + 3) % 12;
    const relativeMajorRoot = notes[relativeMajorIndex];
    
    return relativeMajorRoot;
  };
  
  // 曲のキーのメジャースケールの音を判定する関数
  const isInKeyScale = (noteName, key) => {
    if (!key || !noteName) return false;
    
    // キーを平行長調に変換（マイナーの場合）
    const majorKey = getRelativeMajorKey(key);
    
    // メジャースケールの半音パターン（T-T-S-T-T-T-S、Tは全音=2半音、Sは半音=1半音）
    const majorScalePattern = [0, 2, 4, 5, 7, 9, 11];
    
    // 音階配列
    const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // ルート音と対象音のインデックスを取得
    const keyIndex = allNotes.indexOf(normalizeNote(majorKey));
    const noteIndex = allNotes.indexOf(normalizeNote(noteName));
    
    if (keyIndex === -1 || noteIndex === -1) {
      return false;
    }
    
    // ルート音からの半音数を計算
    const semitones = (noteIndex - keyIndex + 12) % 12;
    
    // スケール内の音かどうかを判定
    return majorScalePattern.includes(semitones);
  };
  
  // フレットの位置と弦番号から音名を取得する関数
  const getNoteNameAtPosition = (string, fret) => {
    // 各弦の開放弦の音
    const openStrings = ['E', 'B', 'G', 'D', 'A', 'E'];
    // 音階配列
    const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // 弦のインデックス（0始まり）
    const stringIndex = string - 1;
    
    if (stringIndex < 0 || stringIndex >= 6) {
      return null;
    }
    
    // 開放弦の音
    const openNote = openStrings[stringIndex];
    const openNoteIndex = allNotes.indexOf(openNote);
    
    if (openNoteIndex === -1) {
      return null;
    }
    
    // フレット位置での音名を計算
    const noteIndex = (openNoteIndex + fret) % 12;
    return allNotes[noteIndex];
  };
  
  // スケール音のための統一された背景色 - 修正2
  const scaleHighlightColor = 'rgba(251, 191, 36, 0.2)';
  
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
                    
                    // 0フレットの音名を取得
                    const noteName = getNoteNameAtPosition(string, 0);
                    // スケール内の音かどうかを判定
                    const isInScale = showScale && noteName && songKey && isInKeyScale(noteName, songKey);
                    
                    return (
                      <div
                        key={string}
                        className="h-10 flex items-center justify-center border-b border-gray-400"
                        style={{
                          // 修正2: スケール音の背景色を統一
                          backgroundColor: isInScale ? scaleHighlightColor : ''
                        }}
                      >
                        {noteAtPosition && (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ 
                              backgroundColor: getNoteColor(noteAtPosition.position, noteAtPosition.isBassNote),
                              textShadow: '0px 0px 1px rgba(0, 0, 0, 0.8)'
                            }}
                          >
                            {getNoteText(noteAtPosition)}
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
                  
                  // 12フレットは少し濃い色、他のマーカーフレットは薄い色
                  let bgColorClass = 'bg-white';
                  if (isSpecialMarker) {
                    bgColorClass = 'bg-gray-100';
                  } else if (isMarker) {
                    bgColorClass = 'bg-gray-50';
                  }
                  
                  return (
                    <div 
                      key={fret}
                      className={`border-r border-gray-400 ${bgColorClass}`}
                      style={getFretWidthStyle(fret)}
                    >
                      {[1, 2, 3, 4, 5, 6].map(string => {
                        const noteAtPosition = chordPositions.find(
                          pos => pos.string === string && pos.fret === fret
                        );
                        
                        // フレットの音名を取得
                        const noteName = getNoteNameAtPosition(string, fret);
                        // スケール内の音かどうかを判定
                        const isInScale = showScale && noteName && songKey && isInKeyScale(noteName, songKey);
                        
                        return (
                          <div
                            key={string}
                            className="h-10 flex items-center justify-center border-b border-gray-400"
                            style={{
                              // 修正2: スケール音の背景色を統一
                              backgroundColor: isInScale ? scaleHighlightColor : ''
                            }}
                          >
                            {noteAtPosition && (
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ 
                                  backgroundColor: getNoteColor(noteAtPosition.position, noteAtPosition.isBassNote),
                                  textShadow: '0px 0px 1px rgba(0, 0, 0, 0.8)'
                                }}
                              >
                                {getNoteText(noteAtPosition)}
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