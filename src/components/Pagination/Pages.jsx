import React, { useState, useMemo } from "react";
import "./index.css";

const DOTS = "...";

function Pages({ currentPage, maxPages, onPageChange }) {
  // USING useState and useEffect to calcualte pageArr will be anti pattern as it will cause multiple re renders on page change
  // first on prop change and then on setPageArr state.
  const pageArr = useMemo(() => {
    const siblings = 1;

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
      return [1, DOTS, ...rightSide];
    }

    if (showLeftDots && showRightDots) {
      const middleSide = Array.from(
        { length: 1 + 2 * siblings },
        (_, idx) => currentPage - 1 + idx,
        // this should be currentPage-siblingCount+idx. The current condition only works when sibling count is 1
      );
      return [1, DOTS, ...middleSide, DOTS, maxPages];
    }
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
