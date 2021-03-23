export const reportListMockData = [
  {
    reportGuid: 1,
    reportName: 'raport 1',
    description: 'pierwszy raport',
  },
  {
    reportGuid: 2,
    reportName: 'raport 2',
    description: 'drugi raport',
  },
  {
    reportGuid: 3,
    reportName: 'raport 3',
    description: 'trzeci raport',
  },
];

export const reportGroupsMockData = [
  {
    reportGroupId: 1,
    reportGroupName: 'Sprzedaz jednorazowa',
    reportGroupDescription: 'opisasdasd',
  },
  {
    reportGroupId: 2,
    reportGroupName: 'Sprzedaz abonamentowa',
    reportGroupDescription: 'opisasdasd',
  },
  {
    reportGroupId: 3,
    reportGroupName: 'Karty sportowe',
    reportGroupDescription: 'opisasdasd',
  },
  {
    reportGroupId: 4,
    reportGroupName: 'Placowe',
    reportGroupDescription: 'opisasdasd',
  },
  {
    reportGroupId: 5,
    reportGroupName: 'Pracownicy',
    reportGroupDescription: 'opisasdasd',
  },
  {
    reportGroupId: 6,
    reportGroupName: 'Banki i doladowania',
    reportGroupDescription: 'opisasdasd',
  },
  {
    reportGroupId: 7,
    reportGroupName: 'Wybrane benefity',
    reportGroupDescription: 'opisasdasd',
  },
  {
    reportGroupId: 8,
    reportGroupName: 'Raporty dla OMB',
    reportGroupDescription: 'opisasdasd',
  },
];

export const reportParameters = [
  {
    label: 'Od',
    parameterName: 'dateFrom',
    type: 'DateTime',
    defaultValue: ['2020-08-01'],
    selectOptions: [],
    isRequired: true,
  },
  {
    label: 'Do',
    parameterName: 'dateTo',
    type: 'DateTime',
    defaultValue: [],
    selectOptions: [],
    isRequired: true,
  },
  {
    label: 'Świadczenia płatne przez:',
    parameterName: 'paidBy',
    type: 'Select',
    defaultValue: [],
    selectOptions: [{ value: '1', label: 'asd' }, { value: '2', label: 'qwe' }, { value: '3', label: 'zxc' }],
    isRequired: true,
  },
  {
    label: 'Grupa dochodowości:',
    parameterName: 'profitabilityGroup',
    type: 'Select',
    defaultValue: ['2'],
    selectOptions: [{ value: '1', label: 'asd' }, { value: '2', label: 'qwe' }, { value: '3', label: 'zxc' }],
    isRequired: true,
  },
  {
    label: 'Jednostka organizacyjna:',
    parameterName: 'organisationUnit',
    type: 'Multiselect',
    defaultValue: ['1', '3'],
    selectOptions: [{ value: '1', label: 'asd' }, { value: '2', label: 'qwe' }, { value: '3', label: 'zxc' }],
    isRequired: true,
  },
  {
    label: 'Jednostka organizacyjna2:',
    parameterName: 'organisationUnit2',
    type: 'Multiselect',
    defaultValue: [],
    selectOptions: [{ value: '1', label: 'asd' }, { value: '2', label: 'qwe' }, { value: '3', label: 'zxc' }],
    isRequired: true,
  },
  {
    label: 'bool:',
    parameterName: 'bool',
    type: 'Boolean',
    defaultValue: [],
    selectOptions: [],
    isRequired: true,
  },
  {
    label: 'bool2:',
    parameterName: 'bool2',
    type: 'Boolean',
    defaultValue: ['true'],
    selectOptions: [],
    isRequired: true,
  },
  {
    label: 'Nazwisko:',
    parameterName: 'lastName',
    type: 'String',
    defaultValue: [],
    selectOptions: [],
    isRequired: true,
  },
  {
    label: 'Numer FK:',
    parameterName: 'fkNumber',
    type: 'String',
    defaultValue: [],
    selectOptions: [],
    isRequired: true,
  },
];

export const companySelectMockData = [
  {
    companyBusinessId: 'C344FE55-106A-4067-A04D-DDEE78B1C341',
    shortName: 'test',
  },
  {
    companyBusinessId: 'C344FE55-106A-4067-A04D-DDEE78B1C342',
    shortName: 'test2',
  },
];

export const reportDetails = {
  id: 'dc1ca708-0c55-45cd-87ff-8097e48499be',
  name: 'QNR_CLI0004StanBankowPunktowBest',
  path: '/MBReportingTool/QNR_CLI0004StanBankowPunktowBest',
  description: 'To jest jakiś bardzo ważny opis. ĄĘŚĆŻŹ.',

};

export const mockFormat = [
  {
    renderFormatId: 1,
    renderFormatName: 'EXCEL',
    fileExtension: 'xls',
  },
  {
    renderFormatId: 2,
    renderFormatName: 'WORD',
    fileExtension: 'doc',
  },
  {
    renderFormatId: 3,
    renderFormatName: 'PDF',
    fileExtension: 'pdf',
  },
];

export const htmlReportRenderMock = {
  totalPages: '2',
  htmlRender: '<div>raport z reporting services</div>',
};
