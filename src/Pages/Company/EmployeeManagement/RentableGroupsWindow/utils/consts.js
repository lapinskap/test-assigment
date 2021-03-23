export const WINDOW_TYPE_POPUP = 'popup';
export const WINDOW_TYPE_ACCOUNT = 'account';

export const windowTypeOptions = [
  {
    value: WINDOW_TYPE_POPUP,
    label: 'Wyświetlanie popupu po zalogowaniu',
  },
  {
    value: WINDOW_TYPE_ACCOUNT,
    label: 'Zmiana grupy dochodowości w profilu',
  },
];

export const ACTIVATION_MODE_PERIODICALLY = 'periodically';
export const ACTIVATION_MODE_RANGE = 'range';
export const ACTIVATION_MODE_INFINITY = 'infinity';

export const activationModeOptions = [
  {
    value: ACTIVATION_MODE_PERIODICALLY,
    label: 'Cykliczny',
  },
  {
    value: ACTIVATION_MODE_RANGE,
    label: 'Konkretne daty',
  },
  {
    value: ACTIVATION_MODE_INFINITY,
    label: 'Czas nieokreślony',
  },
];
