import React, { useState } from "react";
import { checkboxData } from "../../constants/checkboxData";

function Checkboxes({ data = checkboxData }) {
  const [checkboxes, setCheckboxes] = useState(data);

  const rootNodes = Object.keys(checkboxes).filter(
    (item) => checkboxes[item].parent === null,
  );

  const handleToggle = (id) => {
    const allNodes = JSON.parse(JSON.stringify(checkboxes));

    const node = allNodes[id];
    const value = !node.checked;
    node.checked = value;

    // return

    const checkChildren = (id) => {
      const children = allNodes[id].children;

      children.forEach((child) => {
        allNodes[child].checked = value;
        checkChildren(child, value);
      });
    };
    checkChildren(node.id);

    const checkParent = (id) => {
      const parentData = allNodes[id];
      if (!parentData) return;
      const siblings = parentData.children;

      const allSiblingsChecked = siblings.every(
        (item) => allNodes[item].checked === true,
      );

      if (parentData.checked !== allSiblingsChecked) {
        parentData.checked = allSiblingsChecked;
        checkParent(parentData.parent);
      }
    };
    checkParent(node.parent);

    setCheckboxes(allNodes);
  };

  const renderNode = (id) => {
    const node = checkboxes[id];

    if (!node) return;

    return (
      <li key={node.id}>
        <input
          type="checkbox"
          checked={node.checked}
          name={node.id}
          onChange={() => handleToggle(node.id)}
        />
        <label htmlFor={node.id}>{node.label}</label>

        {node.children.length > 0 && (
          <ul
            className="children-box"
            style={{ marginLeft: "15px", padding: 0 }}
          >
            {node.children.map((item) => renderNode(item))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <div className="checkbox-container">
        <ul>{rootNodes.map((item) => renderNode(item))}</ul>
      </div>
    </>
  );
}

export default Checkboxes;
