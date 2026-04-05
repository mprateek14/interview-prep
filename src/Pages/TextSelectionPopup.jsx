import React from "react";
import useSelectionText from "../hooks/useSelectionText";
import { ToastStackProvider } from "../contexts/ToastStack";

function TextSelectionPopup() {
  const { rect, text } = useSelectionText();
  const maxSafeWidth = document.documentElement.clientWidth;
  const maxSafeHeight = document.documentElement.clientHeight;
  const tooltipWidth = 60;

  const isHittingRightEdge = rect && (rect.right + rect.width + tooltipWidth + 10) > maxSafeWidth;

  return (
    <ToastStackProvider>
    <div>
      What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard dummy
      text ever since the 1500s, when an unknown printer took a galley of type
      and scrambled it to make a type specimen book. It has survived not only
      five centuries, but also the leap into electronic typesetting, remaining
      essentially unchanged. It was popularised in the 1960s with the release of
      Letraset sheets containing Lorem Ipsum passages, and more recently with
      desktop publishing software like Aldus PageMaker including versions of
      Lorem Ipsum.
      {text && rect && (
        <div
          className="tooltip"
          style={{
            position: "absolute",
            left: isHittingRightEdge ? rect.left - 10 : rect.left + rect.width + 10,
            top: rect.top  - 30,
            display: "flex",
            gap: 10,
            padding: 4,
            textAlign: "center",
            backgroundColor: "white",
            width: tooltipWidth
          }}
        >
          <span>🚀</span>
          <span>❌</span>
        </div>
      )}
    </div>
    </ToastStackProvider>
  );
}

export default TextSelectionPopup;
