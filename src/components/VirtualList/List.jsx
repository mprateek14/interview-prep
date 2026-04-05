import React, { useState, useRef, useEffect } from "react";

const bufferItems = 5;

function List({ data, itemHeight = 50, viewportHeight = 600 }) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = data.length * itemHeight;

  let visibleItemCount = Math.ceil(viewportHeight / itemHeight);
  let startIdx = Math.floor(scrollTop / itemHeight);
  let endIdx = startIdx + visibleItemCount - 1;

  startIdx = Math.max(0, startIdx - bufferItems);
  endIdx = Math.min(data.length - 1, endIdx + bufferItems);

  const offset = startIdx * itemHeight;
  const visibleItems = data.slice(startIdx, endIdx + 1);

  const handleScroll = (e) => {
    console.log("insinde");
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div
      className="outer-fixed-viewport"
      style={{
        height: `${viewportHeight}px`,
        overflowY: "auto",
        width: "400px",
        border: "2px solid black",
      }}
      onScroll={handleScroll}
    >
      <div
        className="inner-ghost-viewport"
        style={{ height: totalHeight, position: "relative" }}
      >
        <div
          style={{
            width: "100%",
            top: "0",
            left: "0",
            position: "absolute",
            transform: `translateY(${offset}px)`,
          }}
        >
          {visibleItems.map((item) => {
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: itemHeight,
                }}
                key={item.id}
              >
                {item.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default List;
