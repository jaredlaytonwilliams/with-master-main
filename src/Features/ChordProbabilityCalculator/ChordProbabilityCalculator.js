import React, { useState, useEffect } from 'react';
import './ChordProbabilityCalculator.css';
import NoteButton from './NoteButton';
import ChordHTML from './ChordHTML';
import MajorScaleChords from './MajorScaleChords';
import { authenticateHooktheory, fetchData } from './APIUtils';
import { auth } from '../../firebase';
import { logActivity } from '../../Components/LogActivity';

const ChordProbabilityCalculator = () => {
  const [chordNotes] = useState([]);
  const [selectedKey] = useState('C');
  const [apiTestResponse, setApiTestResponse] = useState(null);
  const [chordSet] = useState(MajorScaleChords);
  const [bearerToken, setBearerToken] = useState('');
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      const token = await authenticateHooktheory();
      if (token) {
        setBearerToken(token);
      }
    };
    getToken();
  }, []);
  
  useEffect(() => {
    if (bearerToken && selectedKey) {
      const apiEndpoint = `https://api.hooktheory.com/v1/trends/nodes?cp=${selectedKey}`;
      fetchData(apiEndpoint, bearerToken, setApiTestResponse);
    }
  }, [bearerToken, selectedKey]);

  const handleNoteClick = (note) => {
    setIsButtonClicked(true);
    const chordPosition = chordSet[note];
    if (!chordPosition) {
      console.error("Chord not found in scale:", note);
      return;
    }

    const childPath = chordPosition;
    const apiEndpoint = `https://api.hooktheory.com/v1/trends/nodes?cp=${childPath}`;
    fetchData(apiEndpoint, bearerToken, setApiTestResponse);

    if (auth.currentUser) {
      logActivity(auth.currentUser.uid, `Clicked on chord: ${note}`);
    }
  };

  const handleApiResponseClick = async (childPath) => {
    const formattedPath = childPath.replace(/-/g, ',');
    const apiEndpoint = `https://api.hooktheory.com/v1/trends/nodes?cp=${formattedPath}`;
    fetchData(apiEndpoint, bearerToken, setApiTestResponse);

    if (auth.currentUser) {
      logActivity(auth.currentUser.uid, `Clicked on chord path: ${childPath.replace(/,/g, '-')}`);
    }
  };

  const renderApiTestResponse = () => (
    apiTestResponse && apiTestResponse.map((item, index) => (
      <div key={index} onClick={() => handleApiResponseClick(item.child_path)} className="api-response-item">
        <ChordHTML html={item.chord_HTML} /> - Probability: {(item.probability * 100).toFixed(2)}% - Path: {item.child_path.replace(/,/g, '-')}
      </div>
    ))
  );

  return (
    <div>
      <div className="note-buttons">
        {Object.keys(chordSet).map((chord, index) => (
          <NoteButton key={index} note={chord} onClick={() => handleNoteClick(chord)} />
        ))}
      </div>

      {chordNotes.length > 0 && (
        <div>
          <h3>Chord Notes:</h3>
          <p>{chordNotes.join(', ')}</p>
        </div>
      )}

      {isButtonClicked && (
        <div>
          <h3>Most Probable Chords To Come Next in Major Scale:</h3>
          <h4>Click the chord to go deeper.</h4>
          <pre>{renderApiTestResponse()}</pre>
        </div>
      )}
    </div>
  );
};

export default ChordProbabilityCalculator;
