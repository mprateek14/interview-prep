import React, { useState, useMemo } from "react";
import "./index.css";

const DOTS = "...";

function Pages({ currentPage, maxPages, onPageChange }) {
  // USING useState and useEffect to calcualte pageArr will be anti pattern as it will cause multiple re renders on page change
  // first on prop change and then on setPageArr state.
  const pageArr = useMemo(() => {
    const siblings = 2;

    const totalItems = 5 + 2 * siblings; //1begin + 1end + 1current + 2ellipses

    if (maxPages <= totalItems) {
      return Array.from({ length: maxPages }, (_, idx) => idx + 1);
    }

    const leftSiblingPage = Math.max(currentPage - siblings, 1);
    const rightSiblingPage = Math.min(currentPage + siblings, maxPages);

    const showLeftDots = leftSiblingPage > 2;
    const showRightDots = rightSiblingPage < maxPages - 1;

    if (showRightDots && !showLeftDots) {
      const leftItemCount = 3 + 2 * siblings;
      // total length is (5 + 2 * siblingCount), and right side takes 2, the left side must be:(5 + 2 * siblingCount) - 2 = 3 + 2 * siblingCount
      // 3 acts like a magic number here. We want to keep no of item strictly to 7 to keep low CLS. Otherwise on reaching extreme ends items will reduce and items will jump
      const leftSide = Array.from({ length: leftItemCount }, (_, i) => i + 1);

      return [...leftSide, DOTS, maxPages];
    }

    if (!showRightDots && showLeftDots) {
      const rightItemCount = 3 + 2 * siblings;
      const rightSide = Array.from(
        { length: rightItemCount },
        (_, i) => maxPages - rightItemCount + i + 1,
      );
      // Need +1 here else we will fall 1 page short in last.
      // If total is 100 and rightCount is 7. Last i will be 6. and last page will become 100-7+6 = 99.
      return [1, DOTS, ...rightSide];
    }

    if (showLeftDots && showRightDots) {
      const middleSide = Array.from(
        { length: 1 + 2 * siblings },
        (_, idx) => currentPage - siblings + idx,
        // this should be currentPage-siblingCount+idx. The current condition only works when sibling count is 1
      );
      return [1, DOTS, ...middleSide, DOTS, maxPages];
    }
    // we are deliberately returning constant number of elements in all result arrays so there is no CLS and content jumping
    // when pages are changed. for 2 siblings and currentPage 10 - [1] [...] [8] [9] [10] [11] [12] [...] [20]
    // we have to total of 9 elements. now in edge case scenarios as well, we want to keep 9.
    // if currentPage is 2, [1] [2] [3] [4] [...] [20] can be a viable solution but the the pagination div will keep
    // jumping due to constant change in total elements when currentPage changes.
  }, [currentPage, maxPages]);

  return (
    <div
      className="pagination-container"
      role="navigation"
      aria-label="Pagination"
    >
      <button
        className="pagination-item"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        ◀
      </button>
      {pageArr.map((item, idx) => {
        if (item === DOTS) return <span key={"DOT-" + idx}>{DOTS}</span>;
        const isActive = currentPage === item;
        return (
          <button
            className={`pagination-item ${isActive ? "page-active" : ""}`}
            onClick={() => onPageChange(item)}
            key={item}
            aria-label={`Go to page ${item}`}
          >
            {item}
          </button>
        );
      })}

      <button
        className="pagination-item"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === maxPages}
        aria-label="Next Page"
      >
        ▶
      </button>
    </div>
  );
}

export default Pages;
