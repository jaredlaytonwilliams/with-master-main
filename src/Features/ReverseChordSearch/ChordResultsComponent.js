import React from 'react';

const ChordResultsComponent = ({ results, onChordSelect }) => {

    const renderResults = () => {
        if (results.length === 0) {
            return <p>No chords found</p>;
        }

        // Get the first chord from the results
        const firstChord = results[0];
        return (
            <div key={firstChord.id || 0} onClick={() => onChordSelect(firstChord)} className="chord-result">
                {firstChord}
            </div>
        );
    };

    return (
        <div className="chord-results-container">
            <h2>Results:</h2>
            {renderResults()}
        </div>
    );
};

export default ChordResultsComponent;