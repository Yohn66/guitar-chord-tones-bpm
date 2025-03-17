// progressions.js

// 枯葉のコード進行
export const autumnLeavesProgression = {
  title: "枯葉",
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