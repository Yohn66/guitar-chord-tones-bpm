// コード定義
export const chordDefinitions = {
  // 枯葉のコード
  'Cm7': { root: 'C', type: 'minor7', notes: [0, 3, 7, 10] }, // C, Eb, G, Bb
  'F7': { root: 'F', type: 'dominant7', notes: [0, 4, 7, 10] }, // F, A, C, Eb
  'B♭△7': { root: 'Bb', type: 'major7', notes: [0, 4, 7, 11] }, // Bb, D, F, A
  'E♭△7': { root: 'Eb', type: 'major7', notes: [0, 4, 7, 11] }, // Eb, G, Bb, D
  'Am7-5': { root: 'A', type: 'half-diminished', notes: [0, 3, 6, 10] }, // A, C, Eb, G
  'D7': { root: 'D', type: 'dominant7', notes: [0, 4, 7, 10] }, // D, F#, A, C
  'Gm': { root: 'G', type: 'minor', notes: [0, 3, 7] }, // G, Bb, D
  
  // Wish You Were Hereのコード
  'Em7': { root: 'E', type: 'minor7', notes: [0, 3, 7, 10] }, // E, G, B, D
  'G': { root: 'G', type: 'major', notes: [0, 4, 7] }, // G, B, D
  'A7sus4': { root: 'A', type: 'dominant7-suspended4', notes: [0, 5, 7, 10] }, // A, D, E, G
  'D/F#': { 
    root: 'D', 
    type: 'major', 
    notes: [0, 4, 7], 
    bass: 'F#', 
    bassInterval: 4 // ルートからの半音数（F#はDの3度なので4半音）
  }, // D, F#, A with F# bass
  'C': { root: 'C', type: 'major', notes: [0, 4, 7] }, // C, E, G
  'Am': { root: 'A', type: 'minor', notes: [0, 3, 7] }, // A, C, E
  'Am/E': { 
    root: 'A', 
    type: 'minor', 
    notes: [0, 3, 7], 
    bass: 'E', 
    bassInterval: 7 // ルートからの半音数（EはAの5度なので7半音）
  }, // A, C, E with E bass
  'D': { root: 'D', type: 'major', notes: [0, 4, 7] }, // D, F#, A
  
  // lofi2のコード
  'Dm7': { root: 'D', type: 'minor7', notes: [0, 3, 7, 10] }, // D, F, A, C
  'G7': { root: 'G', type: 'dominant7', notes: [0, 4, 7, 10] }, // G, B, D, F
  'C△7': { root: 'C', type: 'major7', notes: [0, 4, 7, 11] }, // C, E, G, B
  'A7': { root: 'A', type: 'dominant7', notes: [0, 4, 7, 10] }  // A, C#, E, G
};

// 色設定
export const chordColors = {
  'default': [
    '#0D47A1', // 濃い青 (ルート音)
    '#1E88E5', // 明るい青 (3度)
    '#4FC3F7', // 薄い水色 (5度)
    '#B2EBF2', // 非常に薄い水色 (7度)
    '#E1F5FE'  // ほぼ白に近い非常に薄い水色 (9度/テンション)
  ],
  'bassNote': '#000000' // オンコードのベース音用の黒色
};