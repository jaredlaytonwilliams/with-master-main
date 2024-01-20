import { Chord } from '@tonaljs/tonal';
import { findSimilarChords } from './FindSimilarChords';

export const noteOrder = {
    'C': 1, 'C#': 2, 'Db': 2, 'D': 3, 'D#': 4, 'Eb': 4, 'E': 5, 
    'F': 6, 'F#': 7, 'Gb': 7, 'G': 8, 'G#': 9, 'Ab': 9, 'A': 10, 'A#': 11, 'Bb': 11, 'B': 12
};

export const getNoteOrder = (note) => noteOrder[note] || null;

export const calculateNotesWithOctaves = (chord) => {
const notesWithoutOctave = Chord.get(chord).notes;
const rootNoteOrder = getNoteOrder(notesWithoutOctave[0]);
return notesWithoutOctave.map(note => {
const noteBase = note.replace(/\d/, '');
const noteOrderValue = getNoteOrder(noteBase);
return noteBase + (noteOrderValue < rootNoteOrder ? '4' : '3');
});
};

export const processQuery = (query) => {
const processedQuery = query.replace(/♭/g, 'b');
const matchedNotes = processedQuery.match(/([A-G](#|b)?)/g) || [];
let detectedChords = Chord.detect(matchedNotes).filter(chord => !chord.includes("7#5"));
let similarChords = findSimilarChords(detectedChords, processedQuery); // Assuming findSimilarChords is imported here
return { detectedChords, similarChords };
};