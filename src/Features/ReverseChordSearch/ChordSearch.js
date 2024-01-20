import React, { useState } from 'react';
import Pagination from './Pagination';
import ChordInputComponent from './ChordInputComponent';
import ChordResultsComponent from './ChordResultsComponent';
import SimilarChordsComponent from './SimilarChordsComponent';
import SelectedChordDisplayComponent from './SelectedChordDisplayComponent';
import { calculateNotesWithOctaves, processQuery } from './utils';

const ReverseChordSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [similarResults, setSimilarResults] = useState([]);
    const [selectedChord, setSelectedChord] = useState(null);
    const [notesWithOctaves, setNotesWithOctaves] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showSearchAndSimilarChords, setShowSearchAndSimilarChords] = useState(true);
    const chordsPerPage = 10;

    const handleInputChange = (e) => {
        setQuery(e.target.value.toUpperCase());
    };

    const handleAddFlat = () => setQuery(query + '♭');

    const isValidInput = (input) => {
        const validInputRegex = /^[A-Ga-g#b♭]+$/;
        return validInputRegex.test(input);
    };

    const handleSearch = () => {
        if (!isValidInput(query)) {
            alert('Invalid input. Please enter only musical notes (A-G, #, b, ♭).');
            clearResults();
            return;
        }

        if (/^[#b♭]+$/.test(query)) {
            alert('Invalid input. Please enter valid note names.');
            clearResults();
            return;
        }

        processSearch();
    };

    const clearResults = () => {
        setResults([]);
        setSimilarResults([]);
    };

    const processSearch = () => {
        // Assuming processQuery returns an object with detectedChords and similarChords
        // Adjust as necessary to match your actual implementation
        const processed = processQuery(query);
        if (!processed.detectedChords.length) {
            alert('No matching chord found.');
            return;
        }
        setResults(processed.detectedChords);
        setSimilarResults(processed.similarChords);
        setCurrentPage(1);
        setShowSearchAndSimilarChords(false);
    };

    const handleChordSelect = (chord) => {
        setSelectedChord(chord);
        setNotesWithOctaves(calculateNotesWithOctaves(chord));
    };

    const handleDeselectChord = () => {
        setSelectedChord(null);
        setShowSearchAndSimilarChords(true);
    };


    return (
        <div>
            {selectedChord ? (
                <SelectedChordDisplayComponent
                    chordName={selectedChord}
                    onClose={handleDeselectChord}
                    notesWithOctaves={notesWithOctaves}
                />
            ) : (
                <>
                    <ChordInputComponent
                        onInputChange={handleInputChange}
                        onAddFlat={handleAddFlat}
                        onSearch={handleSearch}
                        query={query}
                    />
                    <ChordResultsComponent
                        results={results}
                        onChordSelect={handleChordSelect}
                />
                    <SimilarChordsComponent
                        similarChords={similarResults}
                        onChordSelect={handleChordSelect}
                        currentPage={currentPage}
                        chordsPerPage={chordsPerPage}
                />
            </>
        )}
        {!selectedChord && (
            <Pagination
                currentPage={currentPage}
                paginate={setCurrentPage}
                totalChords={similarResults.length}
                chordsPerPage={chordsPerPage}
            />
        )}
    </div>
);
};

export default ReverseChordSearch;