import { Chord, ChordType, Note } from '@tonaljs/tonal';

const extractNotes = (detectedChords, query) => {
    if (detectedChords.length > 0) {
        return new Set(detectedChords.flatMap(chord => Chord.get(chord).notes));
    }

    const noteRegex = /([A-G](#|b)?)/g;
    const noteMatches = query.match(noteRegex) || [];
    return new Set(noteMatches);
};

const calculateScore = (chord, rootNote, detectedNotes) => {
    let score = 0;
    const chordNotes = Chord.get(chord).notes;

    // Increase score if the root note matches
    if (Note.pitchClass(chord[0]) === Note.pitchClass(rootNote)) {
        score += 1;
    }

    // Increase score based on the percentage of shared notes
    const sharedNotes = chordNotes.filter(note => detectedNotes.has(Note.pitchClass(note)));
    score += sharedNotes.length / chordNotes.length;

    return score;
};

const isChordExcluded = (chord) => {
    const exclusionPatterns = ["maj#4", "ma7", "-", "^", "o", "°", "Δ", "ø"];
    if (exclusionPatterns.some(pattern => chord.includes(pattern))) {
        return true;
    }

    // Exclude "sus" chords not followed by a number
    if (/sus(?![2-9])/.test(chord)) {
        return true;
    }

    return false;
};

const transformChordName = (chordName) => {
    return chordName.replace(/M/g, 'maj').replace(/m/g, 'min');
};

export const findSimilarChords = (detectedChords, query) => {
    if (detectedChords.length === 0 && !query) return [];

    const detectedNotes = extractNotes(detectedChords, query);
    const rootNote = query.match(/([A-G](#|b)?)/)[0];
    let chordScores = [];

    ChordType.all().forEach(chordType => {
        chordType.aliases.forEach(alias => {
            detectedNotes.forEach(note => {
                let chordName = Note.pitchClass(note) + alias;
                chordName = transformChordName(chordName);
                const chord = Chord.get(chordName);

                if (chord.empty || isChordExcluded(chordName) || chordName.length === 1) {
                    return;
                }

                const score = calculateScore(chordName, rootNote, detectedNotes);
                if (score > 0) {
                    chordScores.push({ chordName, score });
                }
            });
        });
    });

    // Sort chords based on score
    chordScores.sort((a, b) => b.score - a.score);

    return chordScores.map(chordScore => chordScore.chordName);
};

export default findSimilarChords;