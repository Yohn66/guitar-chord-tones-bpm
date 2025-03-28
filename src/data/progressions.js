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

// lofi2のコード進行
export const lofi2Progression = {
  id: 'lofi-2',
  title: "lofi2",
  artist: "村山叡",
  key: "C",  // キー情報
  sections: [
    {
      name: "Aメロ",
      chords: [
        'Dm7', 'G7', 'C△7', 'A7',
        'Dm7', 'G7', 'C△7', 'A7',
        'Dm7', 'G7', 'C△7', 'A7',
        'Dm7', 'G7', 'C△7', 'A7',
      ]
    }
  ],
  // 全てのコードを配列として平坦化
  chords: [
    'Dm7', 'G7', 'C△7', 'A7',
    'Dm7', 'G7', 'C△7', 'A7',
    'Dm7', 'G7', 'C△7', 'A7',
    'Dm7', 'G7', 'C△7', 'A7'
  ]
};

// ゆれるのコード進行
export const yureruProgression = {
  id: 'yureru',
  title: "ゆれる",
  artist: "EVISBEATS feat.田我流",
  key: "Eb",  // キー情報
  sections: [
    {
      name: "Aメロ",
      chords: [
        'A♭△7', 'E♭△7', 'B♭', 'Cm7',
        'A♭△7', 'E♭△7', 'B♭', 'Cm7',
        'A♭△7', 'E♭△7', 'B♭', 'Cm7',
        'A♭△7', 'E♭△7', 'B♭', 'Cm7'
      ]
    }
  ],
  // 全てのコードを配列として平坦化
  chords: [
    'A♭△7', 'E♭△7', 'B♭', 'Cm7',
    'A♭△7', 'E♭△7', 'B♭', 'Cm7',
    'A♭△7', 'E♭△7', 'B♭', 'Cm7',
    'A♭△7', 'E♭△7', 'B♭', 'Cm7'
  ]
};

// エクスポートする曲のリスト
export const songList = [
  autumnLeavesProgression,
  wishYouWereHereProgression,
  lofi2Progression,
  yureruProgression
];