import React from 'react'
import '../CSS/Pagination.css'

export default function Pagination({ oppsPerPage, totalOpps, paginate, currentPage, setCurrentPage}) {
    const pageNumbers = [];
    
    for (let i = 1; i <= Math.ceil(totalOpps / oppsPerPage); i++) {
        pageNumbers.push(i);
    }

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    }

    const toPrevPage  = () => {
        paginate(currentPage - 1);
        setCurrentPage(currentPage - 1);
        scrollToTop();
    }

    const toNextPage = () => {
        paginate(currentPage + 1);
        setCurrentPage(currentPage + 1);
        scrollToTop();
    }

    return (
        <div className='pagination'>
            <button onClick={() => toPrevPage()} disabled={currentPage === 1}> &laquo; Previous</button>
            {pageNumbers.map((number) => {
                return(
                <button key={number} onClick={() => paginate(number)} className={currentPage === number ? 'active' : ""}> {number} </button>
                );
            })}
            <button onClick={() => toNextPage()} disabled={currentPage === pageNumbers.length}> Next &raquo; </button>
        </div>
    )
}

