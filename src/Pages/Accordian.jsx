import React, { useState } from "react";
import BasicAccordian from "../components/Accordian/BasicAccordian";
import AccordianGroup from "../components/Accordian/AccordianGroup";

const FAQ_DATA = [
  {
    id: "faq-1",
    label: "What is the Big O of a hash map lookup?",
    content:
      "In the average case, a hash map lookup is O(1). In the worst case (heavy collisions), it degrades to O(N).",
  },
  {
    id: "faq-2",
    label: "Why avoid the CSS max-height hack?",
    content:
      "It destroys animation timing curves. The browser wastes time animating empty space if the max-height value is significantly larger than the actual content.",
  },
  {
    id: "faq-3",
    label: "What is Event Bubbling?",
    content:
      "It is the browser mechanic where an event fired on a deeply nested element propagates upward through all of its ancestor elements until it hits the document root.",
  },
];

function Accordian() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <BasicAccordian
        isOpen={isOpen}
        onToggle={handleToggle}
        label={"Basic Accordian Label"}
      >
        What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum has been the industry's standard
        dummy text ever since the 1500s, when an unknown printer took a galley
        of type and scrambled it to make a type specimen book. It has survived
        not only five centuries, but also the leap into electronic typesetting,
        remaining essentially unchanged. It was popularised in the 1960s with
        the release of Letraset sheets containing Lorem Ipsum passages, and more
        recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </BasicAccordian>
      Below is accordian group
      <AccordianGroup itemList={FAQ_DATA} />
    </>
  );
}

export default Accordian;
