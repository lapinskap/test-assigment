import {
  createHourSlots, createDateListToCheck, createFreeDateSlots, excludeCurrentAppointments,
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

describe('createFreeDateSlots', () => {
  it('creates an Array', () => {
    expect(createFreeDateSlots('2021-01-05T11:00:00', ['12:00', '13:00'])).toBe(Array);
  });

  it('creates array with 20 elements', () => {
    const result = createFreeDateSlots('2021-01-05T11:00:00', ['12:00', '13:00']);
    expect(result.length).toBe(20);
  });
});

describe('excludeCurrentAppointments', () => {
  it('creates an Array', () => {
    expect(excludeCurrentAppointments('2021-01-05T11:00:00', ['12:00', '13:00']).toBe(Array));
  });

  it('creates array with 20 elements', () => {
    const result = excludeCurrentAppointments('2021-01-05T11:00:00', ['12:00', '13:00']);
    expect(result.length).toBe(20);
  });
});
