const treeData = [
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200022',
    name: 'Kategoria 1',
    active: true,
    subcategories: [
      {
        id: 'b43275e4-eeb2-11ea-adc1-0242ac1200022',
        name: 'Podkategoria 1',
        active: true,
        subcategories: [
          {
            id: 'ce4325e4-eeb2-11ea-adc1-0242ac1200022',
            name: 'Podkategoria 3',
            active: false,
            subcategories: [],
          },
          {
            id: 'bd3275e4-eeb2-11ea-adc1-0242ac1200022',
            name: 'Podkategoria 4',
            active: false,
            subcategories: [],
          },
        ],
      },
      {
        id: 'c43275e4-eeb2-11ea-adc1-0242ac1200022',
        name: 'Podkategoria 2',
        active: true,
        subcategories: [],
      },
    ],
  },
  {
    id: 'd43275e4-eeb2-11ea-adc1-0242ac1200022',
    name: 'Kategoria 2',
    active: true,
    subcategories: [
      {
        id: 'e43275e4-eeb2-11ea-adc1-0242ac1200022',
        name: 'Podkategoria 3',
        active: false,
        subcategories: [
          {
            id: 'cc4325e4-eeb2-11ea-adc1-0242ac1200022',
            name: 'Podkategoria 4',
            active: false,
            subcategories: [],
          },
          {
            id: 'bb3275e4-eeb2-11ea-adc1-0242ac1200022',
            name: 'Podkategoria 5',
            active: false,
            subcategories: [],
          },
        ],
      },
      {
        id: 'f43275e4-eeb2-11ea-adc1-0242ac1200022',
        name: 'Podkategoria 6',
        active: false,
        subcategories: [],
      },
    ],
  },
];

export default treeData;
