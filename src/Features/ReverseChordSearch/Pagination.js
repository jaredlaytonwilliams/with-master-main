import React from 'react';

const Pagination = ({ currentPage, paginate, totalChords, chordsPerPage, children }) => {
    return (
        <div>
            {children}
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                Previous
            </button>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage * chordsPerPage >= totalChords}>
                Next
            </button>
        </div>
    );
};

export default Pagination;