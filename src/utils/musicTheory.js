// musicTheory.js

// 音度のラベルを取得する関数
export const getNoteLabel = (semitone, isBassNote = false) => {
  // ベース音の場合は特別な表記を追加
  const bassText = isBassNote ? '（ベース音）' : '';
  
  switch (semitone) {
    case 0: return `1度${bassText}`;
    case 1: return `♭9${bassText}`;
    case 2: return `9th${bassText}`;
    case 3: return `♭3${bassText}`;
    case 4: return `3度${bassText}`;
    case 5: return `4度${bassText}`;
    case 6: return `♭5${bassText}`;
    case 7: return `5度${bassText}`;
    case 8: return `♭6${bassText}`;
    case 9: return `6度${bassText}`;
    case 10: return `m7${bassText}`;
    case 11: return `M7${bassText}`;
    default: return `${semitone}${bassText}`;
  }
};

// 音階の配列（C基準、シャープ表記）
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 音階の配列（C基準、フラット表記）
const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// フラット表記かどうかを判定する関数
export const usesFlats = (key) => {
  // フラットを使う調
  const flatKeys = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm', 'Abm', 'Dbm'];
  return flatKeys.includes(key);
};

// フラット／シャープ表記を正規化する関数
export const normalizeNote = (note, useFlats = false) => {
  // フラット→シャープ変換マッピング
  const flatToSharp = {
    'Bb': 'A#',
    'Eb': 'D#',
    'Ab': 'G#',
    'Db': 'C#',
    'Gb': 'F#',
    'Cb': 'B'
  };
  
  // シャープ→フラット変換マッピング
  const sharpToFlat = {
    'A#': 'Bb',
    'D#': 'Eb',
    'G#': 'Ab',
    'C#': 'Db',
    'F#': 'Gb'
  };
  
  if (useFlats && sharpToFlat[note]) {
    return sharpToFlat[note];
  }
  
  if (!useFlats && flatToSharp[note]) {
    return flatToSharp[note];
  }
  
  return note;
};

// コードのルート音からスケール内の位置（ディグリー）を取得する関数
export const getDegree = (root, key) => {
  // キーからルート音と調性（メジャー/マイナー）を取得
  let keyRoot = key.replace(/m$/, '');
  const isMinor = key.endsWith('m');
  
  // 使用する音階配列を決定（フラット表記かシャープ表記か）
  const noteArray = usesFlats(key) ? NOTES_FLAT : NOTES;
  
  // ルート音のインデックスを取得
  const keyIndex = noteArray.indexOf(keyRoot);
  let rootIndex = noteArray.indexOf(normalizeNote(root, usesFlats(key)));
  
  if (keyIndex === -1 || rootIndex === -1) {
    console.error(`キー ${key} またはルート音 ${root} が見つかりません`);
    return '';
  }
  
  // ルート音からのスケール内の位置を計算（0～11）
  let degree = (rootIndex - keyIndex + 12) % 12;
  
  // マイナーキーの場合、相対メジャーキーに変換（平行調）
  // 例: Amマイナーキーの場合、Cメジャーを基準にする（3半音上）
  if (isMinor) {
    degree = (degree - 3 + 12) % 12;
  }
  
  return degree;
};

// ローマ数字に変換する関数
export const degreeToRoman = (degree, chordType) => {
  // スケール各音のディグリー表記（メジャースケール基準）
  const degreeMap = {
    0: { roman: 'I', quality: 'major' },
    1: { roman: 'bII', quality: 'flat-two' },
    2: { roman: 'II', quality: 'minor' },
    3: { roman: 'bIII', quality: 'flat-three' },
    4: { roman: 'III', quality: 'minor' },
    5: { roman: 'IV', quality: 'major' },
    6: { roman: 'bV', quality: 'flat-five' },
    7: { roman: 'V', quality: 'major' },
    8: { roman: 'bVI', quality: 'flat-six' },
    9: { roman: 'VI', quality: 'minor' },
    10: { roman: 'bVII', quality: 'flat-seven' },
    11: { roman: 'VII', quality: 'diminished' }
  };
  
  if (degreeMap[degree] === undefined) {
    return '';
  }
  
  const { roman } = degreeMap[degree];
  
  // コードタイプに基づいて適切な表記を選択
  let suffix = '';
  
  switch (chordType) {
    case 'major':
      suffix = '';
      break;
    case 'minor':
      suffix = 'm';
      break;
    case 'dominant7':
      suffix = '7';
      break;
    case 'major7':
      suffix = '△7';
      break;
    case 'minor7':
      suffix = 'm7';
      break;
    case 'half-diminished':
    case 'minor7-flat5':
      suffix = 'm7-5';
      break;
    case 'minor-flat5':
      suffix = 'm-5';
      break;
    case 'major6':
      suffix = '6';
      break;
    case 'minor6':
      suffix = 'm6';
      break;
    case 'suspended4':
      suffix = 'sus4';
      break;
    case 'dominant7-suspended4':
      suffix = '7sus4';
      break;
    case 'add9':
      suffix = 'add9';
      break;
    case 'dominant9':
      suffix = '9';
      break;
    case 'minor9':
      suffix = 'm9';
      break;
    case 'augmented':
      suffix = 'aug';
      break;
    case 'major7-add9':
      suffix = '△7add9';
      break;
    default:
      suffix = '';
  }
  
  return roman + suffix;
};

// コードのローマ数字表記を取得する関数
export const getChordRomanNotation = (chord, key, chordDefinitions) => {
  if (!chord || !key || !chordDefinitions[chord]) {
    return '';
  }
  
  const definition = chordDefinitions[chord];
  const root = definition.root;
  const type = definition.type;
  
  const degree = getDegree(root, key);
  const romanRoot = degreeToRoman(degree, type);
  
  // オンコードの場合、ベース音のローマ数字も追加
  if (definition.bass && definition.bassInterval) {
    // ベース音のディグリーを取得
    const normalizedBass = normalizeNote(definition.bass);
    const bassDegree = getDegree(normalizedBass, key);
    // ベース音のディグリーをローマ数字に変換（コードタイプは無視）
    const romanBass = degreeToRoman(bassDegree, 'major').replace(/[a-z0-9-]+$/, '');
    
    // ルート音/ベース音 の形式で返す
    return `${romanRoot}/${romanBass}`;
  }
  
  return romanRoot;
};

// コードのフレット位置を計算する関数
export const calculateChordPositions = (chord, chordDefinitions, maxFret = 21) => {
  const positions = [];
  const definition = chordDefinitions[chord];
  
  if (!definition) return positions;
  
  const rootNote = definition.root;
  const notes = definition.notes;
  
  // オンコードの場合のベース音情報
  const hasBass = definition.bass && definition.bassInterval;
  const bassNote = hasBass ? definition.bass : null;
  const bassInterval = hasBass ? definition.bassInterval : null;
  
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
      
      // ベース音かどうかをチェック
      const isBassNote = hasBass && bassInterval === semitoneFromRoot;
      
      // この音がコードの構成音であれば位置情報を追加
      if (notes.includes(semitoneFromRoot) || isBassNote) {
        const notePosition = notes.indexOf(semitoneFromRoot);
        positions.push({
          string: string,
          fret: fret,
          note: semitoneFromRoot,
          position: notePosition + 1,  // 1-indexed for display
          noteName: allNotes[noteIndex],
          isBassNote: isBassNote // ベース音かどうかを示すフラグ
        });
      }
    }
  }
  
  return positions;
};