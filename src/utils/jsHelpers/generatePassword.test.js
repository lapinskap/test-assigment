import generatePassword from './generatePassword';
import '../../tests/setupTests';

describe('generatePassword', () => {
  it('returns length beetween 10 and 15', () => {
    const password = generatePassword();
    expect(password.length).toBeGreaterThanOrEqual(10);
    expect(password.length).toBeLessThanOrEqual(15);
  });
});
