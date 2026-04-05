import React, { useState, useEffect, useRef } from "react";

function InfiniteScroll() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const targetRef = useRef(null);
  const isInitialLoad = useRef(true); 

  // Fetch Effect
  useEffect(() => {
    if (!hasMore) return; 

    const fetchData = async () => {
      setIsLoading(true);
      const endpoint = `https://dragonball-api.com/api/characters?page=${page}&limit=40`;

      try {
        const resp = await fetch(endpoint);
        if (!resp.ok) throw new Error("Something went wrong");
        
        const result = await resp.json();
        
        if (result?.meta?.totalPages <= result?.meta?.currentPage) {
          setHasMore(false);
        }
        
        setData((prevData) => [...prevData, ...result.items]);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page]); 


  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];

      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return; 
      }

      if (target.isIntersecting && !isLoading && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    const currentTarget = targetRef.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [isLoading, hasMore]); // State added to dependencies to prevent stale closures

  return (
    <>
      {data.length > 0 &&
        data.map((item, idx) => {
          return (
            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }} key={item.id}>
              <span>{idx}</span>
              <span>{item.name}</span>
            </div>
          );
        })}
      <div ref={targetRef} style={{ minHeight: "20px", marginTop: "20px" }}>
        {isLoading && <span>Loading more...</span>}
      </div>
    </>
  );
}

export default InfiniteScroll;