import React, { useState } from "react";

const Carousel = ({ slides, visibleSlides = 3 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slideWidth = 100 / visibleSlides;
  const maxIndex = Math.max(0, slides.length - visibleSlides);

  const onPrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const onNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  return (
    <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
      <div
        style={{
          display: "flex",
          transition: "transform 0.4s ease-in-out",
          transform: `translateX(-${currentIndex * slideWidth}%)`,
        }}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            style={{
              //flex grow 0 prevents stretch. flex stretch 0 prevents collapse. Flex basis enforces the math width
              // flex: [flex-grow] [flex-shrink] [flex-basis]; flex: 0 0 ${slideWidth}%;
              flex: `0 0 ${slideWidth}%`,
              padding: "0 1.5%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={slide}
              alt={`slide-${idx}`}
              style={{
                width: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        Prev
      </button>

      <button
        onClick={onNext}
        disabled={currentIndex === maxIndex}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        Next
      </button>
    </div>
  );
};

function MultiCarousel() {
  const data = Array.from(
    { length: 10 },
    (_, idx) => `https://picsum.photos/id/${idx + 20}/300/200`,
  );

  return <Carousel slides={data} visibleSlides={3} />;
}

export default MultiCarousel;
