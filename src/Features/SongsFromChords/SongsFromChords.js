import React, { useState, useEffect } from 'react';


const NoteButton = ({ note, onClick }) => (
  <button className="note-button" onClick={() => onClick(note)}>
    {note}
  </button>
);

const SongItem = ({ song }) => (
  <div className="song-item">
    <a href={song.url} target="_blank" rel="noopener noreferrer">{song.artist} - {song.song} ({song.section})</a>
  </div>
);

const ChordSongCalculator = () => {
  const [selectedChordProgression, setSelectedChordProgression] = useState('');
  const [bearerToken, setBearerToken] = useState('');
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    authenticateHooktheory();
  }, []);

  useEffect(() => {
    if (bearerToken && selectedChordProgression) {
      const apiEndpoint = `https://api.hooktheory.com/v1/trends/songs?cp=${selectedChordProgression}`;
      fetchSongs(apiEndpoint);
    }
  }, [bearerToken, selectedChordProgression]);

  const authenticateHooktheory = async () => {
    const authEndpoint = 'https://api.hooktheory.com/v1/users/auth';
    const credentials = {
      username: 'jaredlaytonwilliams',
      password: 'TheHorseRanFast5'
    };

  

  const handleChordClick = (chord) => {
    setSelectedChordProgression(chord);
  };

  return (
    <div>
      <div className="note-buttons">
        {Object.keys(majorScaleChords).map((chord, index) => (
          <NoteButton key={index} note={chord} onClick={() => handleChordClick(majorScaleChords[chord])} />
        ))}
      </div>

      <div>
        <h3>Songs with Selected Chord Progression:</h3>
        {songs.map((song, index) => (
          <SongItem key={index} song={song} />
        ))}
      </div>
    </div>
  );
};
const fetchSongs = async (apiEndpoint) => {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSongs(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };
const majorScaleChords = {
  'I': '1',
  'ii': '2',
  'iii': '3',
  'IV': '4',
  'V': '5',
  'vi': '6',
  'vii°': '7'
};
}
export default ChordSongCalculator;