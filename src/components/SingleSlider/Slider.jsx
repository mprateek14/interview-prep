import React, { useState, useEffect } from "react";
import { imagesData } from "../../constants/imagesData";
import "./index.css";

const CarouselItem = ({ image, active }) => {
  return (
    <div className={`single-slide-item ${active ? "active" : ""}`}>
      <img src={image} className="carousel-image" />
    </div>
  );
};

function Slider({ images = imagesData, slideInterval = 2500 }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const getNextItem = () => {
    setActiveIdx((prevIdx) =>
      prevIdx === images.length - 1 ? 0 : prevIdx + 1,
    );
  };

  const getPrevItem = () => {
    setActiveIdx((prevIdx) =>
      prevIdx === 0 ? images.length - 1 : prevIdx - 1,
    );
  };

  return (
    <>
      <div className="single-slider-container">
        <div className="single-slider-inner">
          {images.map((image, index) => (
            <CarouselItem image={image} active={activeIdx === index} />
          ))}
        </div>

        <button className="slider-next-btn" onClick={() => getNextItem()}>
          Next
        </button>

        <button className="slider-prev-btn" onClick={() => getPrevItem()}>
          Prev
        </button>
      </div>
    </>
  );
}

export default Slider;
