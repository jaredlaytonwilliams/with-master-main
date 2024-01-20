import React from 'react';

const SimilarChordsComponent = ({ similarChords, onChordSelect, currentPage, chordsPerPage }) => {
    // Slice the similar chords array for the current page
    const startIndex = (currentPage - 1) * chordsPerPage;
    const endIndex = startIndex + chordsPerPage;
    const currentChords = similarChords.slice(startIndex, endIndex);

    return (
        <div>
            <h2>Similar Chords:</h2>
            {currentChords.length > 0 ? (
                currentChords.map((chord, index) => (
                    <div key={index} onClick={() => onChordSelect(chord)}>
                        {chord}
                    </div>
                ))
            ) : (
                <p>No similar chords found</p>
            )}
        </div>
    );
};

export default SimilarChordsComponent;