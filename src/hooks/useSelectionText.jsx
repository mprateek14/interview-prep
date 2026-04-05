import React, { useState, useEffect } from "react";

function useSelectionText() {
  const [selection, setSelection] = useState({ text: "", rect: null });

  useEffect(() => {
    const handleSelection = () => {
      const activeSelection = window.getSelection();

      if (!activeSelection) {
        setSelection({ text: "", rect: null });
        return;
      }

      const text = activeSelection.toString().trim();

      if (!text) {
        setSelection({ text: "", rect: null });
        return;
      }

      const range = activeSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelection({ text: text, rect: rect });
    };

    const clearSelection = () => {
      setSelection({ text: "", rect: null });
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("mousedown", clearSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("mousedown", clearSelection);
    };
  }, []);

  return selection;
}

export default useSelectionText;
