export const SubscriptionListMock = [
  {
    id: 'a1s2d3',
    reportName: 'raport 1',
    created: '2020-01-01',
    subscriptionMethod: 'szyfrowany',
    format: '.xls',
    frequency: 'co 1 miesiąc: ostatni dzień miesiąca',
    active: true,
    recipients: 'asd@a.pl, qwe@asd.pl',
  },
  {
    id: 'a1s2d4',
    reportName: 'raport 2',
    created: '2020-03-01',
    subscriptionMethod: 'szyfrowany',
    format: '.xls',
    frequency: 'co 2 tydzień w dniu poniedziałek środa sobota',
    active: false,
    recipients: 'asd@a.pl, qwe@asd.pl',

  },
  {
    id: 'a1s2d6',
    reportName: 'raport 3',
    created: '2020-01-06',
    subscriptionMethod: 'szyfrowany',
    format: '.xls',
    frequency: 'raz w dniu 2020-11-21',
    active: false,
    recipients: 'asd@a.pl, qwe@asd.pl',

  },
  {
    id: 'a1s2d9',
    reportName: 'raport 4',
    created: '2020-06-01',
    subscriptionMethod: 'szyfrowany',
    format: '.xls',
    frequency: 'co roku w dniu 21.11',
    active: true,
    recipients: 'asd@a.pl, qwe@asd.pl',

  },
];

export const subscribeMethodMock = [
  {
    label: 'Wyślij maila z zaszyfrowanym plikiem Excel',
    value: '1',
  },
  {
    label: 'Wyślij maila z linkiem do raportu',
    value: '2',
  },
  {
    label: 'Wgraj raport na serwer SFTP klienta',
    value: '3',
  },
];

export const formatDropdownMock = [
  { label: 'xls', value: 'xls' },
  { label: 'doc', value: 'doc' },
  { label: 'pdf', value: 'pdf' },
];
