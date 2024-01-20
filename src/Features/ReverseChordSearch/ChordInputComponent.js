import React from 'react';

const ChordInputComponent = ({ onInputChange, onAddFlat, onSearch, query }) => {
    return (
        <div>
            <input 
                type="text" 
                value={query} 
                onChange={onInputChange} 
                placeholder="Type notes to find chords" 
                onKeyPress={event => event.key === 'Enter' && onSearch()} 
            />
            <button onClick={onAddFlat}>♭</button>
            <button onClick={onSearch}>Search</button>
        </div>
    );
};

export default ChordInputComponent;