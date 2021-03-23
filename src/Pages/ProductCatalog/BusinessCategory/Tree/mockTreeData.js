const treeData = [
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200022',
    name: 'Kategoria 1',
    active: true,
    helpCenterUrl: '/test/example',
    type: 'collective',
    subcategories: [
      {
        id: 'b43275e4-eeb2-11ea-adc1-0242ac1200022',
        name: 'Podkategoria 1',
        active: true,
        helpCenterUrl: '/test/example',
        subcategories: [
          {
            id: 'ce4325e4-eeb2-11ea-adc1-0242ac1200022',
            name: 'Podkategoria  produktowa 1',
            type: 'product',
            active: true,
            helpCenterUrl: '/test/example',
            subcategories: [],
          },
          {
            id: 'bd3275e4-eeb2-11ea-adc1-0242ac1200022',
            name: 'Podkategoria  produktowa 2',
            type: 'product',
            active: true,
            helpCenterUrl: '/test/example',
            subcategories: [],
          },
        ],
      },
      {
        id: 'c43275e4-eeb2-11ea-adc1-0242ac1200022',
        name: 'Podkategoria 2',
        active: true,
        helpCenterUrl: '/test/example',
        type: 'collective',
        subcategories: [],
      },
    ],
  },
  {
    id: 'd43275e4-eeb2-11ea-adc1-0242ac1200022',
    name: 'Kategoria 2',
    active: true,
    helpCenterUrl: '/test/example',
    type: 'hasCategories',
    subcategories: [
      {
        id: 'e43275e4-eeb2-11ea-adc1-0242ac1200022',
        name: 'Podkategoria 3',
        active: false,
        helpCenterUrl: '/test/example',
        type: 'collective',
        subcategories: [
          {
            id: 'cc4325e4-eeb2-11ea-adc1-0242ac1200022',
            name: 'Podkategoria 4',
            active: false,
            helpCenterUrl: '/test/example',
            subcategories: [],
          },
          {
            id: 'bb3275e4-eeb2-11ea-adc1-0242ac1200022',
            name: 'Podkategoria 5',
            active: false,
            helpCenterUrl: '/test/example',
            subcategories: [],
          },
        ],
      },
      {
        id: 'f43275e4-eeb2-11ea-adc1-0242ac1200022',
        name: 'Podkategoria  produktowa 3',
        active: false,
        helpCenterUrl: '/test/example',
        type: 'product',
        subcategories: [],
      },
    ],
  },
  {
    id: 'a43275e4-eeb2-11ea-adc1-0242ac1200026',
    name: 'Kategoria 3',
    active: false,
    helpCenterUrl: '/test/example',
    type: 'collective',
    subcategories: [
      {
        id: 'b43275e4-eeb2-11ea-adc1-0242ac1200026',
        name: 'Podkategoria 1',
        active: false,
        helpCenterUrl: '/test/example',
        subcategories: [
          {
            id: 'ce4325e4-eeb2-11ea-adc1-0242ac1200026',
            name: 'Podkategoria  produktowa 1',
            type: 'product',
            active: false,
            helpCenterUrl: '/test/example',
            subcategories: [],
          },
          {
            id: 'bd3275e4-eeb2-11ea-adc1-0242ac1200026',
            name: 'Podkategoria  produktowa 2',
            type: 'product',
            active: false,
            helpCenterUrl: '/test/example',
            subcategories: [],
          },
        ],
      },
      {
        id: 'c43275e4-eeb2-11ea-adc1-0242ac1200026',
        name: 'Podkategoria 2',
        active: false,
        helpCenterUrl: '/test/example',
        type: 'collective',
        subcategories: [],
      },
    ],
  },
];

export default treeData;
