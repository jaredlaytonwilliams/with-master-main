import React from 'react';
import { Chord } from '@tonaljs/tonal';
import PianoKeyboard from './PianoKeyboard';

const SelectedChordDisplayComponent = ({ chordName, onClose, notesWithOctaves }) => {
    // Retrieve chord details
    const chordInfo = Chord.get(chordName);

    // Use Chord.tokenize to extract the tonic and symbol
    const [tonic, symbol] = Chord.tokenize(chordName);

    // Extract the chord type more reliably
    const chordType = chordInfo.type || 'Unknown';

    // Add console logs for debugging
    console.log('Chord Info:', chordInfo);
    console.log('Tonic:', tonic);
    console.log('Chord Type:', chordType);

    return (
        <div style={{ marginLeft: '20px', position: 'relative' }}>
            <h2>Selected Chord: {chordName}</h2>
            <div>
                <p><strong>Tonic:</strong> {chordInfo.tonic}</p>
                <p><strong>Notes:</strong> {notesWithOctaves.join(', ')}</p>
                <p><strong>Type:</strong> {chordType}</p>
                <PianoKeyboard notes={notesWithOctaves} />
                <button onClick={onClose}>Return to Chords</button>
            </div>
        </div>
    );
};

export default SelectedChordDisplayComponent;