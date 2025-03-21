// progressions.js

// 枯葉のコード進行
export const autumnLeavesProgression = {
  id: 'autumn-leaves',
  title: "枯葉（Les Feuilles mortes）",
  artist: "Joseph Kosma",
  key: "Gm",  // キー情報
  sections: [
    {
      name: "Aメロ",
      chords: [
        'Cm7', 'F7', 'B♭△7', 'E♭△7',
        'Am7-5', 'D7', 'Gm', 'Gm',
        'Cm7', 'F7', 'B♭△7', 'E♭△7',
        'Am7-5', 'D7', 'Gm', 'Gm'
      ]
    },
    {
      name: "Bメロ",
      chords: [
        'Am7-5', 'D7', 'Gm', 'Gm',
        'Am7-5', 'D7', 'Gm', 'Gm',
        'Cm7', 'F7', 'B♭△7', 'E♭△7',
        'Am7-5', 'D7', 'Gm', 'Gm'
      ]
    }
  ],
  // 元の配列も残しておく（後方互換性のため）
  chords: [
    'Cm7', 'F7', 'B♭△7', 'E♭△7',
    'Am7-5', 'D7', 'Gm', 'Gm',
    'Cm7', 'F7', 'B♭△7', 'E♭△7',
    'Am7-5', 'D7', 'Gm', 'Gm',
    'Am7-5', 'D7', 'Gm', 'Gm',
    'Cm7', 'F7', 'B♭△7', 'E♭△7',
    'Am7-5', 'D7', 'Gm', 'Gm'
  ]
};

// Wish You Were Hereのコード進行
export const wishYouWereHereProgression = {
  id: 'wish-you-were-here',
  title: "Wish You Were Here",
  artist: "Pink Floyd",
  key: "G",  // キー情報
  sections: [
    {
      name: "前奏",
      chords: [
        'Em7', 'G', 'Em7', 'G',
        'Em7', 'A7sus4', 'Em7', 'A7sus4',
        'G',
      ]
    },
    {
      name: "Aメロ",
      chords: [
        'C', 'D/F#', 'Am/E', 'G',
        'D/F#', 'C', 'Am', 'G',
        'C', 'D/F#', 'Am/E', 'G',
        'D/F#', 'C', 'Am', 'G',
      ]
    },
    {
      name: "間奏",
      chords: [
        'Em7', 'G', 'Em7', 'G',
        'Em7', 'A7sus4', 'Em7', 'A7sus4',
        'G',
      ]
    },
    {
      name: "Aメロ(リピート)",
      chords: [
        'C', 'D/F#', 'Am/E', 'G',
        'D/F#', 'C', 'Am', 'G',
        'C', 'D/F#', 'Am/E', 'G',
        'D/F#', 'C', 'Am', 'G',
      ]
    },
    {
      name: "終奏-1",
      chords: [
        'Em7', 'G', 'Em7', 'G',
        'Em7', 'A7sus4', 'Em7', 'A7sus4',
        'G', 'G',
      ]
    },
    {
      name: "終奏-2",
      chords: [
        'Em7', 'G', 'Em7', 'G',
        'Em7', 'A7sus4', 'Em7', 'A7sus4',
        'G', 'G',
      ]
    }
  ],
  // 全てのコードを配列として平坦化
  chords: [
    'Em7', 'G', 'Em7', 'G',
    'Em7', 'A7sus4', 'Em7', 'A7sus4',
    'G',
    'C', 'D/F#', 'Am/E', 'G',
    'D/F#', 'C', 'Am', 'G',
    'C', 'D/F#', 'Am/E', 'G',
    'D/F#', 'C', 'Am', 'G',
    'Em7', 'G', 'Em7', 'G',
    'Em7', 'A7sus4', 'Em7', 'A7sus4',
    'G',
    'C', 'D/F#', 'Am/E', 'G',
    'D/F#', 'C', 'Am', 'G',
    'C', 'D/F#', 'Am/E', 'G',
    'D/F#', 'C', 'Am', 'G',
    'Em7', 'G', 'Em7', 'G',
    'Em7', 'A7sus4', 'Em7', 'A7sus4',
    'G', 'G',
    'Em7', 'G', 'Em7', 'G',
    'Em7', 'A7sus4', 'Em7', 'A7sus4',
    'G', 'G'
  ]
};

// エクスポートする曲のリスト
export const songList = [
  autumnLeavesProgression,
  wishYouWereHereProgression
];