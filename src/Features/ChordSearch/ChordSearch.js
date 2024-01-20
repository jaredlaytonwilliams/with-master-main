import React, { useState, useEffect } from 'react';
import { Chord, Scale } from '@tonaljs/tonal';
import './ChordSearch.css';

const NoteButton = ({ note, index, onClick }) => {
  return (
    <button className="note-button" onClick={() => onClick(note, index)}>
      {note}
    </button>
  );
};
const ChordHTML = ({ html }) => {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};
const SearchBar = () => {
  const [chordNotes, setChordNotes] = useState([]);
  const [selectedKey, setSelectedKey] = useState('C');
  const [bearerToken, setBearerToken] = useState('');
  const [apiTestResponse, setApiTestResponse] = useState(null); // State to store test API response
  const [chordSet, setChordSet] = useState(majorScaleChords); // Initialize with majorScaleChords
  const [selectedScaleDegree, setSelectedScaleDegree] = useState(null);


  useEffect(() => {
    authenticateHooktheory();
  }, []);
  setChordSet[chordSet] = selectedKey === 'major' ? majorScaleChords : minorScaleChords;

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
  const handleScaleDegreeChange = (event) => {
    setSelectedScaleDegree(event.target.value);
  };
  useEffect(() => {
    if (bearerToken && selectedKey && selectedScaleDegree) {
      fetchDataForSelectedKeyAndDegree(selectedKey, selectedScaleDegree);
    }
  }, [bearerToken, selectedKey, selectedScaleDegree]);
  const determineScale = () => {
    const rootNote = selectedKey.length > 1 && selectedKey[1] !== 'm' ? selectedKey.substring(0, 2) : selectedKey[0];
    const isMinor = selectedKey.includes('m');
    const scaleType = isMinor ? ' minor' : ' major';
    return `${rootNote}${scaleType}`;
  };


 
  const fetchDataForSelectedKeyAndDegree = async (selectedKey, scaleDegree) => {
    // Construct the API endpoint with selected key and scale degree
    const apiEndpoint = `https://api.yourapi.com/data?key=${selectedKey}&degree=${scaleDegree}`;

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
      setApiTestResponse(data); // Update the state with the fetched data
    } catch (error) {
      console.error(`There was an error fetching data:`, error);
    }
  };
  
  const handleNoteClick = (note, index) => {
    // Determine the scale type and corresponding chord set
    console.log("yoyoyo", selectedKey)
    const isMinor = selectedKey.includes('minor');
    const chordSet = isMinor ? minorScaleChords : majorScaleChords;
    console.log(chordSet);
    
    // Find the position of the chord in the chord set
    const chordPosition = chordSet[note];
    if (!chordPosition) {
      console.error("Chord not found in scale:", note);
      return; // Exit the function if chord is not found
    }

    console.log("Chord position", chordPosition);

    // The index in chordSet is 1-based
    const childPath = chordPosition;
    const scaleType = isMinor ? 'minor' : 'major';

    // Call testDiminishedChordAPIResponse with the chord, childPath, and scaleType
    testDiminishedChordAPIResponse(note, childPath, scaleType);
    console.log("Chord", note);
    console.log("ChildPath", childPath);
    console.log("ScaleType", scaleType);
};

  


  
  
const getScale = (key) => {
  const isMinor = key.includes("m");
  const scaleType = isMinor ? " minor" : " major";
  console.log("hello!" , Scale.get(key.replace("m", "") + scaleType))

  return Scale.get(key.replace("m", "") + scaleType);};


  const getChordNameFromID = (romanNumeral, scale) => {
    // Determine the scale type
    const scaleChords = scale.type === 'minor' ? minorScaleChords : majorScaleChords;
    console.log("scalechords " + scaleChords);
    // Convert Roman numeral to Arabic numeral (1-based index)
    const arabicNumeral = scaleChords[romanNumeral];
    if (!arabicNumeral) {
        console.error("Invalid Roman numeral:", romanNumeral);
        return 'Invalid Roman numeral';
    }

    // Check if the index is within the range of scale notes
    if (arabicNumeral < 1 || arabicNumeral > scale.notes.length) {
      console.log(" what is the length for ", scale.notes.length);
        console.error("Index out of range:", arabicNumeral, "for Roman numeral:", romanNumeral);
        return 'Index out of range';
    }

    // Get the scale note
    const scaleNote = scale.notes[arabicNumeral]; // Adjust for 0-based index of array
    console.log(scale.notes[arabicNumeral]);
    // Determine chord type
    let chordType = '';
    if (romanNumeral.endsWith('°') || romanNumeral.includes('dim')) {
        chordType = 'dim';
    } else if (romanNumeral === romanNumeral.toLowerCase()) {
        chordType = 'm';
    }

    return scaleNote + chordType;
};


const handleApiResponseClick = async (childPath) => {
  const formattedPath = childPath.replace(/-/g, ',');
  const apiEndpoint = `https://api.hooktheory.com/v1/trends/nodes?cp=${formattedPath}`;

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
    setApiTestResponse(data); // Update the state with the new fetched data
  } catch (error) {
    console.error(`There was an error retrieving the API response for path ${formattedPath}:`, error);
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

    const filteredData = data.map(item => ({
      chord_HTML: item.chord_HTML,
      probability: item.probability,
      child_path: item.child_path
    }));
    localStorage.setItem('apiTestResponse', JSON.stringify(filteredData)); // Store the enhanced data
    setApiTestResponse(filteredData); // Update state with enhanced data

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
const handleKeyChange = (event) => {
  const newKey = event.target.value;
  setSelectedKey(newKey);

  // Update chordSet based on whether the newKey is 'major' or 'minor'
  const isMinor = newKey.includes('minor'); // Assuming minor keys end with 'm'
  setChordSet(isMinor ? minorScaleChords : majorScaleChords);
};


const scale = getScale(selectedKey);
return (
  <div>
    

      {Array.isArray(scale) && scale.map((chordLabel, index) => (
        <button key={chordLabel} onClick={() => handleNoteClick(chordLabel, index)}>
          {chordLabel}
        </button>
      ))}
    
    
      <div className="note-buttons">
      {Object.keys(chordSet).map((chord, index) => {
        return (
          <NoteButton 
            key={index} 
            note={chord} 
            onClick={handleNoteClick} 
          />
        );
      })}
    </div>
      
      
    
    
    {chordNotes.length > 0 && (
  <div>
    <h3></h3>
    <h2>Chord Notes:</h2>
    <p>{chordNotes.join(', ')}</p> {/* Joins all chord notes with a comma and space */}
  </div>
)}
    <div>
    <h3>Most Probable Chords To Come Next in Major Scale:</h3>
    <h4>Click the chord to go deeper.</h4>
  <pre>
    {apiTestResponse && apiTestResponse.map((item, index) => (
      <div key={index} onClick={() => handleApiResponseClick(item.child_path)}className="api-response-item">
        <ChordHTML html={item.chord_HTML} /> - Probability: {(item.probability * 100).toFixed(2)}% - Path: {item.child_path.replace(/,/g, '-')}
      </div>
    ))}
  </pre>
</div>
    </div>
  );
};
    
  
 

const allKeys = ['major', 'minor'];


const majorScaleChords = {
  'I': 1, 'ii': 2, 'iii': 3, 'IV': 4, 'V': 5, 'vi': 6, 'vii°': 7
};

const minorScaleChords = {
  'i': 1, 'iidim': 2, 'III': 3, 'iv': 4, 'v': 5, 'VI': 6, 'VII': 7
};

export default SearchBar;