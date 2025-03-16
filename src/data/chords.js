// コード定義
export const chordDefinitions = {
    'Cm7': { root: 'C', type: 'minor7', notes: [0, 3, 7, 10] }, // C, Eb, G, Bb
    'F7': { root: 'F', type: 'dominant7', notes: [0, 4, 7, 10] }, // F, A, C, Eb
    'B♭△7': { root: 'Bb', type: 'major7', notes: [0, 4, 7, 11] }, // Bb, D, F, A
    'E♭△7': { root: 'Eb', type: 'major7', notes: [0, 4, 7, 11] }, // Eb, G, Bb, D
    'Am7-5': { root: 'A', type: 'half-diminished', notes: [0, 3, 6, 10] }, // A, C, Eb, G
    'D7': { root: 'D', type: 'dominant7', notes: [0, 4, 7, 10] }, // D, F#, A, C
    'Gm': { root: 'G', type: 'minor', notes: [0, 3, 7] } // G, Bb, D
  };
  
  // 色設定
  export const chordColors = {
    'default': [
      '#0D47A1', // 濃い青 (ルート音)
      '#1E88E5', // 明るい青 (3度)
      '#4FC3F7', // 薄い水色 (5度)
      '#B2EBF2', // 非常に薄い水色 (7度)
      '#E1F5FE'  // ほぼ白に近い非常に薄い水色 (9度/テンション)
    ]
  };
