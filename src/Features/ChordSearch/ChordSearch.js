import React, { useState, useEffect } from 'react';
import { Chord, Scale } from '@tonaljs/tonal';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chordNotes, setChordNotes] = useState([]);
  const [selectedKey, setSelectedKey] = useState('C');
  const [bearerToken, setBearerToken] = useState('');
  const [nextChords, setNextChords] = useState([]);
  const [apiTestResponse, setApiTestResponse] = useState(null); // State to store test API response

  useEffect(() => {
    authenticateHooktheory();
  }, []);

  const authenticateHooktheory = async () => {
    const authEndpoint = 'https://api.hooktheory.com/v1/users/auth';
    const credentials = {
      username: 'jaredlaytonwilliams',
      password: 'TheHorseRanFast5'
    };

    try {
      const response = await fetch(authEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBearerToken(data.activkey);

    } catch (error) {
      console.error('There was an error retrieving the Bearer Token:', error);
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyChange = (event) => {
    setSelectedKey(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const chordInput = searchTerm;
    const chord = Chord.get(chordInput);
  
    if (chord.empty) {
      setChordNotes([]);
      alert('Invalid chord name. Please try again.');
      return;
    }
  console.log("selectedKey " , selectedKey)
    const isMinorKey = selectedKey.includes("m");
    const scaleChords = isMinorKey ? minorScaleChords : majorScaleChords;
    const scale = Scale.get(selectedKey.replace("m", "") + (isMinorKey ? " minor" : " major"));
    const chordRoot = getChordRoot(chordInput);
    
    // Find the index of the chord in the scale
    const scaleNoteIndex = findChordIndexInScale(chord, scale);
    if (scaleNoteIndex === -1) {
      alert(`The entered chord root ${chordRoot} is not in the ${selectedKey} scale.`);
      return;
    }
    const childPath = scaleNoteIndex + 1;
    console.log("Child Path: " + childPath);
    // Determine the Roman numeral corresponding to the chord's position in the scale
    const romanNumeral = Object.keys(scaleChords).find(key => scaleChords[key] === scaleNoteIndex + 1);
    if (!romanNumeral) {
      alert(`Unable to find a matching Roman numeral for the entered chord in the scale.`);
      return;
    }
  
    // Determine the required chord type based on the Roman numeral case
    let requiredChordType;
if (romanNumeral.endsWith('°') || romanNumeral.endsWith('dim')) {
    requiredChordType = 'diminished';
} else if (romanNumeral === romanNumeral.toLowerCase()) {
    requiredChordType = 'minor';
} else {
    requiredChordType = 'major';
}
console.log('Required Chord Type:', requiredChordType);

// Check if the entered chord matches the required type (ignoring case for user input)
let enteredChordType;
if (chordInput.toLowerCase().includes('dim') || chordInput.toLowerCase().includes('°')) {
    enteredChordType = 'diminished';
} else if (chordInput.toLowerCase().includes('m')) {
    enteredChordType = 'minor';
} else {
    enteredChordType = 'major';
}
console.log('Entered Chord Type:', enteredChordType);

if (enteredChordType !== requiredChordType) {
    alert(`The entered chord must be ${requiredChordType} according to the scale pattern.`);
    return;
}
  
    setChordNotes(chord.notes);
    console.log("Chord Notes: " + chord.notes);
  
   
    testDiminishedChordAPIResponse(chordInput, childPath, selectedKey);

    if (scaleNoteIndex === -1) {
      alert(`Chord root ${chordRoot} is not in the ${selectedKey} scale.`);
      return;
    }
  
    
    console.log("Child Path: " + childPath);
  
  };
  const findChordIndexInScale = (chord, scale) => {
    const chordRoot = chord.tonic; // The root note of the chord
    const scaleNoteIndex = scale.notes.indexOf(chordRoot); // Find the index of the chord root in the scale notes
  
    if (scaleNoteIndex === -1) {
      throw new Error(`Chord root ${chordRoot} is not in the ${scale.name} scale.`);
    }
  
    return scaleNoteIndex;
  };
const getScale = (key) => {
  const isMinor = key.includes("m");
  const scaleType = isMinor ? " minor" : " major";
  console.log("hello!" , Scale.get(key.replace("m", "") + scaleType))

  return Scale.get(key.replace("m", "") + scaleType);};

  const getChordNameFromID = (romanNumeral, scale) => {
    const scaleChords = scale.type === 'minor' ? minorScaleChords : majorScaleChords;
    const chordIndex = scaleChords[romanNumeral];

    if (chordIndex === undefined) {
        return ''; // Handle the case where the Roman numeral is not found
    }

    const scaleNote = scale.notes[chordIndex - 1];

    // Determine the chord type (major, minor, or diminished)
    let chordType = '';
    if (romanNumeral.includes('°') || romanNumeral.includes('dim')) {
        chordType = 'dim'; // Diminished chord
    } else if (romanNumeral === romanNumeral.toLowerCase()) {
        chordType = 'm'; // Minor chord
    } // Major chord has no suffix

    return scaleNote + chordType;
};

const getChordRoot = (input) => {
  const chord = Chord.get(input);
  return chord.tonic; // This ensures we are getting the root of the chord as recognized by the tonal library
};

const fetchNextChords = async (chordInput, childPath, key) => {
  if (!bearerToken) {
    console.error('Bearer token is not set.');
    return;
  }

  const scale = getScale(key);
  console.log("fetchNextChords scale" + scale.notes);
  const chordRoot = getChordRoot(chordInput); // Get chord root based on the new logic
  console.log("fetchNextChords root" + chordRoot);
  const scaleNoteIndex = scale.notes.indexOf(chordRoot) + 1;
  console.log("fetchNextChords index" + scaleNoteIndex);

  
  if (scaleNoteIndex === -1) {
    console.error(`Chord root ${chordRoot} is not in the ${scale.name} scale.`);
    return;
  }


  const apiEndpoint = `https://api.hooktheory.com/v1/trends/nodes?cp=${childPath}`;
  try {
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Ensure data is defined here before using it

    // Determine if the chord is major or minor
    const isMinor = chordInput.includes('m');
    const scaleChords = isMinor ? minorScaleChords : majorScaleChords;

    // Map the Roman numeral to the correct chord name based on the scale
    const updatedData = data.map(chord => ({
      ...chord,
      chordName: chord.chord_HTML ? getChordNameFromID(chord.chord_HTML, scale) : ''
    }));
    setNextChords(updatedData);

  } catch (error) {
    console.error('There was an error retrieving the next chords:', error);
  }
};

const testDiminishedChordAPIResponse = async (testChord, childPath, selectedKey) => {
  

  if (!bearerToken) {
    console.error('Bearer token is not set.');
    return;
  }

  const apiEndpoint = `https://api.hooktheory.com/v1/trends/nodes?cp=${childPath}`;
  try {
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem('apiTestResponse', JSON.stringify(data)); // Store in localStorage
    setApiTestResponse(data); // Update state


  } catch (error) {
    console.error(`There was an error retrieving the API response for ${testChord}:`, error);
  }
};

useEffect(() => {
  const storedApiResponse = localStorage.getItem('apiTestResponse');
  if (storedApiResponse) {
    setApiTestResponse(JSON.parse(storedApiResponse)); // Load from localStorage
  } else if (bearerToken) {
    testDiminishedChordAPIResponse(); // Fetch new data
  }
}, [bearerToken]);
return (
  <div>
    <form onSubmit={handleSubmit}>
      <select onChange={handleKeyChange} value={selectedKey} style={{ padding: '10px', fontSize: '16px' }}>
        {allKeys.map((key, index) => (
          <option key={index} value={key}>{key}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Enter Chord (e.g., Cmaj7)"
        value={searchTerm}
        onChange={handleChange}
      />
      <button type="submit" style={{ padding: '10px 15px', fontSize: '16px' }}>Find Chord</button>
    </form>
    {chordNotes.length > 0 && (
  <div>

    <h2>Chord Notes:</h2>
    <p>{chordNotes.join(', ')}</p> {/* Joins all chord notes with a comma and space */}
  </div>
)}
    <div>
      <h3>API Test Response:</h3>
      <pre>{JSON.stringify(apiTestResponse, null, 2)}</pre>
    </div>
    </div>
  );
};
const allKeys = [
  'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
  'Cm', 'C#m', 'Dbm', 'Dm', 'D#m', 'Ebm', 'Em', 'Fm', 'F#m', 'Gbm', 'Gm', 'G#m', 'Abm', 'Am', 'A#m', 'Bbm', 'Bm'
];

const majorScaleChords = {
  'I': 1, 'ii': 2, 'iii': 3, 'IV': 4, 'V': 5, 'vi': 6, 'vii°': 7
};

const minorScaleChords = {
  'i': 1, 'iidim': 2, 'III': 3, 'iv': 4, 'v': 5, 'VI': 6, 'VII': 7
};

export default SearchBar;