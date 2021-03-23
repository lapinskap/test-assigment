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

export const subscribeFrequencyMock = [
  {
    label: 'raz',
    value: 'once',
  },
  {
    label: 'tygodniowo',
    value: 'weekly',
  },
  {
    label: 'miesięcznie',
    value: 'monthly',
  },
  {
    label: 'rocznie',
    value: 'annually',
  },
];

export const subscribeFrequencyModalMock = [
  {
    label: 'raz',
    value: 'once',
  },
  {
    label: 'tydzień',
    value: 'weekly',
  },
  {
    label: 'miesiąc',
    value: 'monthly',
  },
  {
    label: 'rok',
    value: 'annually',
  },
];

export const sendMethodDataMock = {
  datId: '1a2s3d',
  messageTitle: 'Tytuł wiadomości',
  recipients: 'adresat@asd.pl',
  hiddenRecipients: 'ukryty@asd.pl',
  format: { label: 'pdf', value: 'pdf' },
  messageContent: 'treści wiadomości lallalalala',
};

export const formatDropdownMock = [
  { label: 'xls', value: 'xls' },
  { label: 'doc', value: 'doc' },
  { label: 'pdf', value: 'pdf' },
];

export const ahrsDropdownMock = [
  { label: 'ahr1', value: 'ahr1@mb.pl' },
  { label: 'ahr2', value: 'ahr2@mb.pl' },
  { label: 'ahr3', value: 'ahr3@mb.pl' },
];

export const daysArrayMock = [
  {
    day: 'monday', isSelected: false, dayLetter: 'P', daypl: 'poniedziałek',
  },
  {
    day: 'tuesday', isSelected: false, dayLetter: 'W', daypl: 'wtorek',
  },
  {
    day: 'wednesday', isSelected: false, dayLetter: 'Ś', daypl: 'środa',
  },
  {
    day: 'thursday', isSelected: false, dayLetter: 'C', daypl: 'czwartek',
  },
  {
    day: 'friday', isSelected: false, dayLetter: 'P', daypl: 'piątek',
  },
  {
    day: 'saturday', isSelected: false, dayLetter: 'S', daypl: 'sobota',
  },
  {
    day: 'sunday', isSelected: false, dayLetter: 'N', daypl: 'niedziela',
  },
];
