import React, { useState } from "react";
import BasicAccordian from "./BasicAccordian";
import "./index.css";

function AccordianGroup({ itemList }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (idx) => {
    setActiveIndex((prevIdx) => (prevIdx === idx ? null : idx));
  };

  return (
    <>
      <div className="accordian-group-container">
        {itemList.map((item, idx) => {
          const isCurrentlyOpen = activeIndex === idx;
          return (
            <BasicAccordian
              key={item.id}
              isOpen={isCurrentlyOpen}
              label={item.label}
              onToggle={() => handleToggle(idx)}
            >
              {item.content}
            </BasicAccordian>
          );
        })}
      </div>
    </>
  );
}

export default AccordianGroup;

// if we want multiple support just use Array state to keep indexes. That will be O(N) time
// Object state can give O(1) time but will be O(N) space.
// For accordians, array is better because we dont show thousands of accordians. If we show that many UI will start crashing and TC concerns will come later
// Object or Map appraoch is better with virtualized lists where we might want to search across thousands items but show only few on screen
