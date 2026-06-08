import React, { useState, useRef } from "react";
import "./index.css";
import { getSuggestions } from "../../constants/MockSuggestionsServer";

function AutoCompleteComponent() {
  const [value, setValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const inputRef = useRef();

  const handleChange = (inputText) => {
    setValue(inputText);
    handleApi(inputText);
  };

  const handleApi = async (searchText) => {
    try {
      const response = await getSuggestions(searchText);
      console.log(response);
      if (response) {
        setSearchResults(response);
      }
    } catch (err) {
      console.log(err, "Some error occured");
    }
  };

  return (
    <>
      <div className="autocomplete-wrapper">
        <div className="autocomplete-container">
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className="autocomplete-input"
            ref={inputRef}
          />
          {searchResults.length > 0 ? (
            <div className="autocomplete-suggestions-wrapper">
              <ul className="autocomplete-results-list">
                {searchResults.map((item) => {
                  return (
                    <div
                      className="autocomplete-results-list-item"
                      onClick={() => {
                        setValue(item);
                        inputRef.current.focus();
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default AutoCompleteComponent;
