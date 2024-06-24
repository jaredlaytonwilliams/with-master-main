import React from 'react';

const SongList = ({ songs, onSongClick }) => {
  if (!Array.isArray(songs)) {
    return <div>No songs available.</div>;
  }
  return (
    <div>
      {songs.map((song, index) => (
        <div key={index}>
          <a href={song.url} target="_blank" rel="noopener noreferrer" onClick={() => onSongClick(song)}>
            {song.artist} - {song.song} ({song.section})
          </a>
        </div>
      ))}
    </div>
  );
};

export default SongList;
