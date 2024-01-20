import { ChordType } from '@tonaljs/tonal';

export const generateChordNames = () => {
    const rootNotes = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
    const chordTypes = ChordType.all(); 

    let chordNames = [];

    rootNotes.forEach(root => {
        chordTypes.forEach(type => {
            type.aliases.forEach(alias => {
                chordNames.push(root + alias);
            });
        });
    });

    return chordNames;
};

export default generateChordNames;