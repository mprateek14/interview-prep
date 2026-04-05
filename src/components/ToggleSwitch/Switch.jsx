import React from "react";
import "./index.css"

function Switch({ checked, onChange, size=50 }) {
  return (
    <div className="toggle-switch-wrapper" >
      <input
        type="checkbox"
        name="toggle-switch"
        checked={checked}
        className="toggle-switch-input"
        style={{fontSize:size}}
      />
      <label htmlFor="toggle-switch"></label>

      <button className="sample-buttton">Click me</button>
    </div>
  );
}

export default Switch;
