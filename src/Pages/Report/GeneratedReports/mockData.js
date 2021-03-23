export const ArchiveListMock = [
  {
    id: 'a1s2d3',
    group: 'group 1',
    name: 'raport 2',
    saveDate: '2020-01-01',
    parameters: [
      { label: 'data od', value: '2020-10-01' },
      { label: 'data do', value: '2021-01-31' },
      { label: 'czy aktywny', value: 'tak' },
    ],
    format: '.xls',
    source: 'Subskrypcja',
    createdBy: 'Test',
  },
  {
    id: 'a1s2d2',
    group: 'group 1',
    name: 'raport 3',
    saveDate: '2020-01-01',
    parameters: [
      { label: 'data od', value: '2020-07-01' },
      { label: 'data do', value: '2021-06-30' },
    ],
    format: '.xls',
    source: 'Subskrypcja',
    createdBy: 'Test',
  },
  {
    id: 'a1s2d5',
    group: 'group 2',
    name: 'raport 5',
    saveDate: '2020-01-01',
    parameters: [
      { label: 'parameter', value: 'value' },
    ],
    format: '.xls',
    source: 'Subskrypcja',
    createdBy: 'Test',
  },
  {
    id: 'a1s2d6',
    group: 'group 1',
    name: 'raport 6',
    saveDate: '2020-01-01',
    parameters: [
      { label: 'parameter', value: 'value' },
    ],
    format: '.xls',
    source: 'Subskrypcja',
    createdBy: 'Test',
  },
  {
    id: 'a1s2d9',
    group: 'group 3',
    name: 'raport 1',
    saveDate: '2020-01-01',
    parameters: [
      { label: 'parameter', value: 'value' },
    ],
    format: '.xls',
    source: 'Subskrypcja',
    createdBy: 'Test',
  },
];

export const groupFilterMock = [
  { label: 'Sprzedaz', value: 'Sprzedaz' },
  { label: 'Prac', value: 'Prac' },
];

export const formatFilterMock = [
  { label: 'xls', value: 'xls' },
  { label: 'doc', value: 'doc' },
  { label: 'pdf', value: 'pdf' },
];

export const sourceFilterMock = [
  { label: 'Raporty statyczne', value: 'Raporty statyczne' },
  { label: 'Wysyłki', value: 'Wysyłki' },
];

export const creatorFilterMock = [
  { label: 'asd', value: 'asd' },
  { label: 'qwe', value: 'qwe' },
];

export const archiveDetailsMock = {
  archivedReportId: '44F16422-82EF-4EF0-9DB9-46603A671B2F',
  reportGroup: 'Pracownicy',
  reportName: 'EMP0002 Stany Banków Punktów',
  modificationDate: '2021-01-28T09:19:16.353',
  modificationDateStr: '2021-01-28 09:19',
  fileExtension: 'doc',
  sourceName: 'Raporty statyczne',
  creator: 'qbico_ahr',
  parameters: [
    {
      label: 'asd',
      parameterName: null,
      type: null,
      multiValue: false,
      values: [
        {
          label: '',
          value: '-1',
        },
      ],
      defaultValue: null,
      selectOptions: null,
      isHiddenOption: false,
      isDefaultOption: false,
      isRequired: false,
    },
    {
      label: 'qwe',
      parameterName: null,
      type: null,
      multiValue: false,
      values: [
        {
          label: '',
          value: 'Wszystkie',
        },
      ],
      defaultValue: null,
      selectOptions: null,
      isHiddenOption: false,
      isDefaultOption: false,
      isRequired: false,
    },
    {
      label: 'Zxc',
      parameterName: null,
      type: null,
      multiValue: false,
      values: [
        {
          label: '',
          value: '-1',
        },
      ],
      defaultValue: null,
      selectOptions: null,
      isHiddenOption: false,
      isDefaultOption: false,
      isRequired: false,
    },
    {
      label: 'date',
      parameterName: null,
      type: null,
      multiValue: false,
      values: [
        {
          label: '',
          value: '2021-01-28 00:00',
        },
      ],
      defaultValue: null,
      selectOptions: null,
      isHiddenOption: false,
      isDefaultOption: false,
      isRequired: false,
    },
  ],
};
