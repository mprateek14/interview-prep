export const folderData = {
  id: "1",
  name: "Root",
  type: "folder",
  children: [
    {
      id: "2",
      name: "public",
      type: "folder",
      children: [
        {
          id: "5",
          name: "index.html",
          type: "file",
          children: [],
        },
        {
          id: "6",
          name: "index.css",
          type: "file",
          children: [],
        },
      ],
    },
    {
      id: "3",
      name: "src",
      type: "folder",
      children: [
        {
          id: "7",
          name: "components",
          type: "folder",
          children: [
            {
              id: "8",
              name: "button.jsx",
              type: "file",
              children: [],
            },
            {
              id: "9",
              name: "carousel.jsx",
              type: "file",
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "4",
      name: "package.json",
      type: "file",
      children: [],
    },
  ],
};

export const folderDataStructured = {
  1: {
    id: 1,
    name: "Root",
    type: "folder",
    children: [2, 3, 4],
    parent: null,
  },
  2: {
    id: 2,
    name: "src",
    type: "folder",
    children: [6, 7],
    parent: 1,
  },
  3: {
    id: 3,
    name: "Helpers",
    type: "folder",
    children: [],
    parent: 1,
  },
  4: {
    id: 4,
    name: "Constants",
    type: "folder",
    children: [],
    parent: 1,
  },
  5: {
    id: 5,
    name: "Package.json",
    type: "file",
    children: [],
    parent: null,
  },
  6: {
    id: 6,
    name: "Components",
    type: "folder",
    children: [],
    parent: 2,
  },
  7: {
    id: 7,
    name: "Main.js",
    type: "file",
    children: [],
    parent: 2,
  },
};

export const folderDataArrayed = [
  {
    id: "1",
    name: "Root",
    type: "folder",
    children: [
      {
        id: "2",
        name: "public",
        type: "folder",
        children: [
          {
            id: "5",
            name: "index.html",
            type: "file",
            children: [],
          },
          {
            id: "6",
            name: "index.css",
            type: "file",
            children: [],
          },
        ],
      },
      {
        id: "3",
        name: "src",
        type: "folder",
        children: [
          {
            id: "7",
            name: "components",
            type: "folder",
            children: [
              {
                id: "8",
                name: "button.jsx",
                type: "file",
                children: [],
              },
              {
                id: "9",
                name: "carousel.jsx",
                type: "file",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "4",
        name: "package.json",
        type: "file",
        children: [],
      },
    ],
  },
  {
    id: "10",
    name: "xax.yml",
    type: "file",
    children: [],
  },
  {
    id: "11",
    name: "utils",
    type: "folder",
    children: [
      {
        id: "12",
        name: "db.js",
        type: "file",
        children: [],
      },
    ],
  },
];
