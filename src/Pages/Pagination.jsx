import React, { useState, useEffect } from "react";
import Pages from "../components/Pagination/Pages";

function Pagination() {
  const [currentPage, setCurrentPage] = useState(8);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Pages
        maxPages={100}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export default Pagination;
