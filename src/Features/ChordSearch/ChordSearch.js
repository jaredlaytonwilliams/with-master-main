import React, { useState, useEffect } from 'react';
import { Chord, Scale } from '@tonaljs/tonal';
import './ChordSearch.css';

const NoteButton = ({ note, onClick }) => {
  return (
    <button className="note-button" onClick={() => onClick(note)}>
      {note}
    </button>
  );
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chordNotes, setChordNotes] = useState([]);
  const [selectedKey, setSelectedKey] = useState('C');
  const [bearerToken, setBearerToken] = useState('');
  const [apiTestResponse, setApiTestResponse] = useState(null); // State to store test API response
  const [chordName, setChordName] = useState(''); // New state variable for storing the chord name

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

  const determineScale = () => {
    const rootNote = selectedKey.length > 1 && selectedKey[1] !== 'm' ? selectedKey.substring(0, 2) : selectedKey[0];
    const isMinor = selectedKey.includes('m');
    const scaleType = isMinor ? ' minor' : ' major';
    return `${rootNote}${scaleType}`;
  };

  const getScaleNotes = () => {
    const scaleName = determineScale();
    console.log("what " , Scale.get(scaleName).notes)
    return Scale.get(scaleName).notes;
  };
  const handleNoteClick = (note) => {
    // Handle the click event for each note button
    console.log("Note clicked:", note);
  };
  const handleKeyChange = (event) => {
    setSelectedKey(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const chordInput = searchTerm;
    const chord = Chord.get(chordInput);
    setChordName(chordInput);

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

    const scale = getScale(selectedKey); // Ensure you have this function or logic to get the current scale

    const updatedData = data.map(chord => ({
      ...chord,
      chordName: chord.chord_HTML ? getChordNameFromID(chord.chord_HTML, scale) : ''
    }));

    localStorage.setItem('apiTestResponse', JSON.stringify(updatedData)); // Store the enhanced data
    setApiTestResponse(updatedData); // Update state with enhanced data

  } catch (error) {
    console.error(`There was an error retrieving the API response for ${testChord}:`, error);
  }
};

useEffect((testDiminishedChordAPIResponse) => {
  const storedApiResponse = localStorage.getItem('apiTestResponse');
  if (storedApiResponse) {
    setApiTestResponse(JSON.parse(storedApiResponse)); // Load from localStorage
  } else if (bearerToken) {
    testDiminishedChordAPIResponse(); // Fetch new data
  }
}, [bearerToken]);

const generateScaleNotes = (key) => {
  const scale = Scale.get(key);
  console.log("scale ", scale);
  return scale.notes;
};

return (
  <div>
    <form onSubmit={handleSubmit}>
    <select onChange={handleKeyChange} value={selectedKey} style={{ padding: '10px', fontSize: '16px' }}>
        {allKeys.map((key, index) => (
          <option key={index} value={key}>{key}</option>
        ))}
      </select>
      <div className="note-buttons">
        {getScaleNotes().map((note, index) => {
          const isMinorKey = selectedKey.includes("m");
          const scaleChords = isMinorKey ? minorScaleChords : majorScaleChords;
          
          // Adjusted indexing - assuming scaleChords starts from 'I'/'i' for the first note
          const chordIndex = Object.keys(scaleChords)[index];
          const chordType = chordIndex 
            ? scaleChords[chordIndex] === chordIndex.toUpperCase() ? 'major' : 'minor'
            : 'unknown'; // Handle undefined chordIndex

          const noteLabel = `${note} ${chordType}`;
          return <NoteButton key={index} note={noteLabel} onClick={handleNoteClick} />;
        })}
      </div>
      
      
    </form>
    
    {chordNotes.length > 0 && (
  <div>
    <h3></h3>
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