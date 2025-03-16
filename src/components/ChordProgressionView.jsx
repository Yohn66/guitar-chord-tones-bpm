import React from 'react';

const ChordProgressionView = ({ progression, onSelectChord }) => {
  // 4コードずつに分割
  const rows = [];
  for (let i = 0; i < progression.length; i += 4) {
    rows.push(progression.slice(i, i + 4));
  }
  
  return (
    <div className="flex flex-col items-center p-4 w-full">
      <h1 className="text-2xl font-bold mb-6">枯葉</h1>
      
      <div className="w-full max-w-6xl">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center justify-center mb-6 bg-gray-50 rounded-lg p-4 shadow-sm">
            {row.map((chord, colIndex) => (
              <React.Fragment key={colIndex}>
                <button
                  onClick={() => onSelectChord(chord, rowIndex * 4 + colIndex)}
                  className="w-24 h-20 bg-white rounded-lg shadow hover:bg-blue-100 hover:shadow-md transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  <span className="text-lg font-bold">{chord}</span>
                </button>
                
                {colIndex < row.length - 1 && (
                  <div className="flex-grow flex justify-center items-center mx-2">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChordProgressionView;