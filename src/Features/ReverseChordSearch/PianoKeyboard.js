import React, { useEffect, useRef } from 'react';
import PianoKeys from '@jesperdj/pianokeys';

const PianoKeyboard = ({ notes }) => {
    const containerRef = useRef(null);
    const keyboardRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        if (!keyboardRef.current) {
            keyboardRef.current = new PianoKeys.Keyboard(containerRef.current, {
                lowest: 'C2',
                highest: 'C5'
            });
        }

        const keyboard = keyboardRef.current;

        // Clear all keys individually
        if (keyboard && keyboard.keys) {
            keyboard.keys.forEach(key => key.clearKey());
        }

        // Highlight each note for the new chord
        if (notes && notes.length > 0) {
            notes.forEach(note => {
                // Directly highlight the key
                keyboard.fillKey(note);
            });
        }
    }, [notes]);

    return <div ref={containerRef}></div>;
};

export default PianoKeyboard;