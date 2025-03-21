import React from 'react';
import { songList } from '../data/progressions';

const SongSelectionView = ({ onSelectSong }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-8 text-center">曲を選択</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {songList.map((song) => (
          <div 
            key={song.id}
            className="p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white"
            onClick={() => onSelectSong && onSelectSong(song.id)}
          >
            <h3 className="text-xl font-semibold mb-3">{song.title}</h3>
            <div className="flex justify-between items-end">
              <p className="text-gray-700">{song.artist}</p>
              <span className="text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                {song.key}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongSelectionView;