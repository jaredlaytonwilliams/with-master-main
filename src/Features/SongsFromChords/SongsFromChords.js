import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChordButton from './ChordButton';
import SongList from './SongList';

const App = () => {
  const [token, setToken] = useState('');
  const [selectedChords, setSelectedChords] = useState([]);
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

  const numberToRoman = (number) => romanNumerals[number - 1];

  const authenticate = async () => {
    const credentials = {
      username: process.env.REACT_APP_HOOKTHEORY_USERNAME,
      password: process.env.REACT_APP_HOOKTHEORY_PASSWORD
    };
    try {
      const response = await axios.post('https://api.hooktheory.com/v1/users/auth', credentials);
      setToken(response.data.activkey);
    } catch (error) {
      console.error('Authentication Error:', error);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  const fetchSongs = async (apiEndpoint, page = 1) => {
    try {
      const response = await fetch(`${apiEndpoint}&page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setSongs(data);
        setCanGoBack(page > 1);
        setCanGoForward(data.length === 20); // Assuming 20 is the max number of songs per page
      } else {
        console.error('Expected an array from the API', data);
        setSongs([]);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      setSongs([]);
    }
  };

  const handleChordClick = (chord) => {
    const updatedSelectedChords = [...selectedChords, chord];
    setSelectedChords(updatedSelectedChords);

    const apiEndpoint = `https://api.hooktheory.com/v1/trends/songs?cp=${updatedSelectedChords.join(',')}`;
    setCurrentPage(1); // Reset page to 1 on new chord selection
    fetchSongs(apiEndpoint);
  };

  const resetSelection = () => {
    setSelectedChords([]);
    setSongs([]);
    setCurrentPage(1);
    setCanGoBack(false);
    setCanGoForward(false);
  };

  const loadMoreSongs = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchSongs(`https://api.hooktheory.com/v1/trends/songs?cp=${selectedChords.join(',')}`, nextPage);
  };

  const goToNextPage = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchSongs(`https://api.hooktheory.com/v1/trends/songs?cp=${selectedChords.join(',')}`, nextPage);
  };

  const goToPreviousPage = () => {
    const previousPage = currentPage - 1;
    setCurrentPage(previousPage);
    fetchSongs(`https://api.hooktheory.com/v1/trends/songs?cp=${selectedChords.join(',')}`, previousPage);
  };

  return (
    <div>
      <div>
        {romanNumerals.map((romanNumeral, index) => {
          const chordNumber = index + 1;
          const isSelected = selectedChords.includes(chordNumber);
          console.log(`Chord ${chordNumber} selected: ${isSelected}`); // Debugging line

          return (
            <ChordButton 
              key={chordNumber} 
              label={romanNumeral} 
              isSelected={isSelected}
              onClick={() => handleChordClick(chordNumber)} 
            />
          );
        })}
      </div>
      {selectedChords.length > 0 && (
        <div>
          <h3>Selected Chords:</h3>
          {selectedChords.map(chord => <span key={chord}>{numberToRoman(chord)} </span>)}
          <button onClick={resetSelection}>Reset Selection</button>
        </div>
      )}
      <SongList songs={songs} />

      {canGoBack && <button onClick={goToPreviousPage}>Previous Page</button>}
      {canGoForward && <button onClick={goToNextPage}>Next Page</button>}
    </div>
  );
};

export default App;