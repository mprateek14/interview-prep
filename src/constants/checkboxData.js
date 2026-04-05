export const checkboxData = {
  1: { id: 1, checked: false, children: [], label: "Box1", parent: null},
  2: { id: 2, checked: true, children: [], label: "Box2" , parent: null},
  3: { id: 3, checked: false, children: [4, 5], label: "Box3" , parent: null},
  4: { id: 4, checked: true, children: [6, 7], label: "Box4", parent: 3 },
  5: { id: 5, checked: false, children: [], label: "Box5" , parent: 3},
  6: { id: 6, checked: true, children: [], label: "Box6" , parent: 4},
  7: { id: 7, checked: false, children: [8], label: "Box7", parent: 4 },
  8: { id: 8, checked: true, children: [], label: "Box8" , parent: 7},
};
