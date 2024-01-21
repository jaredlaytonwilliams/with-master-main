import React from 'react';

const NoteButton = ({ note, index, onClick }) => (
    <button className="note-button" onClick={() => onClick(note, index)}>
      {note}
    </button>
  );
  export default NoteButton;
