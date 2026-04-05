import React, { useState, useRef, useEffect } from "react";
import "./index.css";

const MOCK_OPTIONS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid.js" },
];

function SelectSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOptions, setSearchOptions] = useState(MOCK_OPTIONS);
  const [selectedOption, setSelectedOption] = useState();

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOptions = searchOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      <div className="search-select-container" ref={containerRef}>
        <div
          className="search-select-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption?.label}
        </div>
        {isOpen && (
          <div className="search-select-dropdown">
            <input
              id="search-input"
              value={searchTerm}
              onChange={(e) => handleSearch(e)}
              placeholder="Search here"
              ref={inputRef}
            ></input>

            <ul className="search-select-option-list">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((item, idx) => {
                  return (
                    <li
                      key={item.value}
                      onClick={() => setSelectedOption(item)}
                    >
                      {item.label}
                    </li>
                  );
                })
              ) : (
                <div className="search-select-no-options">No Options Found</div>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default SelectSearch;
