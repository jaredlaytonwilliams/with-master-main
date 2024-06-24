import React, { useState } from 'react';
import Pagination from './Pagination';
import ChordInputComponent from './ChordInputComponent';
import ChordResultsComponent from './ChordResultsComponent';
import SimilarChordsComponent from './SimilarChordsComponent';
import SelectedChordDisplayComponent from './SelectedChordDisplayComponent';
import { calculateNotesWithOctaves, processQuery } from './utils';
import { auth } from '../../firebase';
import { logActivity } from '../../Components/LogActivity';

const ReverseChordSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [similarResults, setSimilarResults] = useState([]);
  const [selectedChord, setSelectedChord] = useState(null);
  const [notesWithOctaves, setNotesWithOctaves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearchAndSimilarChords, setShowSearchAndSimilarChords] = useState(true);
  const chordsPerPage = 10;
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleInputChange = (e) => {
    setQuery(e.target.value.toUpperCase());
  };

  const handleAddFlat = () => setQuery(query + '♭');

  const isValidInput = (input) => {
    const validInputRegex = /^[A-Za-z\s\u266D]+$/; // Allows uppercase, lowercase letters, and flat symbols
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
    
    setSearchPerformed(true);
    processSearch();
  };

  const clearResults = () => {
    setResults([]);
    setSimilarResults([]);
  };

  const processSearch = () => {
    const processed = processQuery(query);
    setResults(processed.detectedChords);
    setSimilarResults(processed.similarChords);
    setCurrentPage(1);
    setShowSearchAndSimilarChords(false);

    if (auth.currentUser) {
      logActivity(auth.currentUser.uid, `Searched for chord: ${query}`);
    }
  
    if (!processed.detectedChords.length && !processed.similarChords.length) {
      alert('No matching chord found.');
    } else if (!processed.detectedChords.length) {
      alert('No exact match found, but here are some similar chords.');
    }
  };

  const handleChordSelect = (chord) => {
    setSelectedChord(chord);
    setNotesWithOctaves(calculateNotesWithOctaves(chord));

    if (auth.currentUser) {
      logActivity(auth.currentUser.uid, `Selected chord: ${chord}`);
    }
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
          {searchPerformed && (
            <>
              <ChordResultsComponent
                results={results}
                onChordSelect={handleChordSelect}
              />
              <SimilarChordsComponent
                similarChords={similarResults}
                onChordSelect={handleChordSelect}
                currentPage={currentPage}
                chordsPerPage={chordsPerPage}
                searchPerformed={searchPerformed}
              />
              <Pagination
                currentPage={currentPage}
                paginate={setCurrentPage}
                totalChords={similarResults.length}
                chordsPerPage={chordsPerPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ReverseChordSearch;
