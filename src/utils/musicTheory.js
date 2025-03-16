// 音度のラベルを取得する関数
export const getNoteLabel = (semitone) => {
    switch (semitone) {
      case 0: return 'ルート';
      case 1: return '♭9th';
      case 2: return '2度/9th';
      case 3: return '短3度';
      case 4: return '3度';
      case 5: return '4度/11th';
      case 6: return '♭5';
      case 7: return '5度';
      case 8: return '♭6';
      case 9: return '6度/13th';
      case 10: return '短7度/m7';
      case 11: return '長7度/△7';
      default: return `${semitone}`;
    }
  };
  
  // フラット表記を#表記に変換する
  export const normalizeNote = (note) => {
    const flatToSharp = {
      'Bb': 'A#',
      'Eb': 'D#',
      'Ab': 'G#',
      'Db': 'C#',
      'Gb': 'F#'
    };
    
    return flatToSharp[note] || note;
  };
  
  // コードのフレット位置を計算する関数
  export const calculateChordPositions = (chord, chordDefinitions, maxFret = 21) => {
    const positions = [];
    const definition = chordDefinitions[chord];
    
    if (!definition) return positions;
    
    const rootNote = definition.root;
    const notes = definition.notes;
    
    // 各弦の開放弦の音
    const openStrings = ['E', 'B', 'G', 'D', 'A', 'E'];
    
    // 音名（半音12個）
    const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // ルート音の正規化（フラット記号を#に変換）
    const normalizedRoot = normalizeNote(rootNote);
    
    // ルート音のインデックスを取得
    const rootIndex = allNotes.indexOf(normalizedRoot);
    
    if (rootIndex === -1) {
      console.error(`ルート音 ${rootNote} (正規化: ${normalizedRoot}) が見つかりません`);
      return positions;
    }
    
    // 各弦、各フレットでコード構成音を探す
    for (let string = 1; string <= 6; string++) {
      const openNote = openStrings[string - 1];
      const openNoteIndex = allNotes.indexOf(openNote);
      
      for (let fret = 0; fret <= maxFret; fret++) {
        // このフレットの音を計算
        const noteIndex = (openNoteIndex + fret) % 12;
        const semitoneFromRoot = (noteIndex - rootIndex + 12) % 12;
        
        // この音がコードの構成音であれば位置情報を追加
        if (notes.includes(semitoneFromRoot)) {
          const notePosition = notes.indexOf(semitoneFromRoot);
          positions.push({
            string: string,
            fret: fret,
            note: semitoneFromRoot,
            position: notePosition + 1,  // 1-indexed for display
            noteName: allNotes[noteIndex]
          });
        }
      }
    }
    
    return positions;
  };