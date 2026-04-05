import React, { useState, useEffect, useRef } from "react";
import "./index.css";

function BasicAccordian({ isOpen, onToggle, label, children }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      // scrollHeight gives us the exact pixel height of the inner content
      // We explicitly set the inline style to this exact pixel value
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen, children]);
  return (
    <>
      <div className="accordian-container">
        <button className="accordian-trigger" onClick={() => onToggle()}>
          {label}
        </button>

        <div
          ref={contentRef}
          className={`accordian-content ${isOpen ? "isOpen" : ""}`}
          style={{ height: height }}
        >
          {/* Seperation of content to inner div is needed because if we try to use the content div and apply padding, it will break the scrollHeight */}
          <div className="accordian-content-inner">{children}</div>
        </div>
      </div>
    </>
  );
}

export default BasicAccordian;

// The scrollHeight is a read-only JavaScript property, not a CSS property.
// It provides a measurement of the element's entire content height in pixels, including parts not currently visible due to overflow,
// which is highly useful for scripting scrollable areas.
