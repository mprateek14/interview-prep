import React, { useState } from "react";
import "./index.css";

function Rating({ maxRating, currentRating, handleRating, name = "rating" }) {
  const [hoverIdx, setHoverIdx] = useState(null);

  const handleHover = (idx) => {
    setHoverIdx(idx);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key !== "Enter") return;
    handleRating(idx + 1);
  };

  return (
    <div className="star-rating-container">
      <input type="hidden" value={currentRating} name={name} />
      {/* A hidden input with name attribute can serve the purpose if we need to use the rating component as part of a form or integrate with libraries like react-hook-form */}
      {Array.from({ length: maxRating }).map((_, idx) => {
        const isActive =
          hoverIdx !== null ? idx <= hoverIdx : idx < currentRating;
        return (
          <div
            key={idx}
            className={`rating-star ${isActive ? "active-star" : ""}`}
            onMouseEnter={(e) => handleHover(idx)}
            onMouseLeave={() => setHoverIdx(null)}
            onClick={() => handleRating(idx + 1)}
            // For accessbility
            tabIndex={0}
            role="button"
            aria-label={`Rate ${idx + 1} out of ${maxRating} stars`}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          >
            &#9733;
          </div>
        );
      })}
    </div>
  );
}

export default Rating;
