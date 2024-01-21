import React from 'react';

const ChordHTML = ({ html }) => (
  <span dangerouslySetInnerHTML={{ __html: html }} />
);

export default ChordHTML;