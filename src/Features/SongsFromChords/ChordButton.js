import React from 'react';

const ChordButton = ({ chord, label, onClick, isSelected }) => {
  const buttonClass = isSelected ? 'button-selected' : 'button-unselected';

  return (
    <button className={buttonClass} onClick={onClick}>
      {label}{chord}
    </button>
  );
};

export default ChordButton;