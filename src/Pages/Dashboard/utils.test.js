import {
  createHourSlots, createDateListToCheck, formatAppoitmentToHour, excludeCurrentAppointments,
}
  from './utils';
import { searchRange } from './consts';

describe('createHourSlots', () => {
  it('creates non empty result', () => {
    expect(createHourSlots('2021-01-05T11:00:00')).not.toBe(null);
  });

  it('creates array with 16 elements', () => {
    const result = createHourSlots('2021-01-05T11:00:00');
    expect(result.length).toBe(16);
  });
});

describe('createDateListToCheck', () => {
  it('creates an Array', () => {
    expect(createDateListToCheck(searchRange)).not.toBe(null);
  });

  it('creates array with 4 elements', () => {
    const result = createDateListToCheck(searchRange);
    expect(result.length).toBe(4);
  });
});

describe('formatAppoitmentToHour', () => {
  it('creates an Array', () => {
    expect(formatAppoitmentToHour(new Date('2021-01-05T11:00:00'))).toBe('11:00');
  });

  it('creates array with 5 elements', () => {
    const result = formatAppoitmentToHour('2021-01-05T11:00:00');
    expect(result.length).toBe(5);
  });
});

describe('excludeCurrentAppointments', () => {
  it('returns non empty result', () => {
    expect(excludeCurrentAppointments('2021-01-05T11:00:00', ['12:00', '13:00'])).not.toBe(null);
  });
});
