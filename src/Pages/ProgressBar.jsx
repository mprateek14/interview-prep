import React, { useState, useEffect } from "react";

const Bar = ({ progress }) => {
  return (
    <div
      style={{ width: "500px", height: "15px", border: "1px solid white" }}
      // --- ACCESSIBILITY ATTRIBUTES ---
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={progress}
      aria-label="Upload progress"
    >
      <div
        style={{
          //   width: `${progress}%`,
          //   transition: "width ease-in 0.1s",
          //   For better performance transform can be used for animation. Comment above 2 and uncomment the below 2
          transform: `scaleX(${progress / 100})`,
          transformOrigin: "left",
          height: "100%",
          backgroundColor: "green",
        }}
      ></div>
    </div>
  );
};

function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev === 100) {
          clearInterval(interval);
          return prev; // if no update is needed always return prev otherwise it will return undefined and set it to the state
        } else return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <Bar progress={progress} />
    </div>
  );
}

export default ProgressBar;

// When a browser renders a webpage, it goes through a specific sequence of steps called the Pixel Pipeline.
// The three most critical steps for animation are:

// Layout (Reflow): The browser calculates the exact geometry, size, and position of every element on the page.

// Paint: The browser fills in the pixels for each element (background colors, text colors, shadows) onto separate layers.

// Composite: The browser hands these painted layers over to the GPU (Graphics Processing Unit) to draw them together onto the screen.

// The Problem with Animating width
// When you animate width: ${progress}%, you are modifying a layout property.
// Every 100 milliseconds, you force the browser to:

// Stop what it is doing on the main JavaScript thread.

// Recalculate the geometry of the progress bar (Layout).

// Check if the changing width affects the parent container or neighboring elements (Layout Thrashing).

// Repaint the pixels (Paint).

// Send it to the GPU (Composite).

// If your React application is doing heavy data processing on the main thread, the browser won't have time to run the Layout step.
// Your progress bar will drop frames, stutter, and look broken.

// The Power of transform: scaleX()
// transform and opacity are special CSS properties. They do not trigger Layout or Paint. They only trigger the Composite step.

// When you use transform:

// The browser calculates the progress bar's geometry exactly once at width: 100%.

// It paints the green rectangle onto its own dedicated GPU layer.

// Every 100 milliseconds, instead of doing heavy math on the CPU, the browser simply tells the GPU: "Stretch this existing image by X percent."
