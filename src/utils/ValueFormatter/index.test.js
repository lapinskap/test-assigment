/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import Formatter from './index';
import '../../tests/setupTests';

describe('<Formatter />', () => {
  it('executes formatter function correctly', () => {
    const formatter = (v) => v;
    const value = '12323';
    expect(Formatter(formatter, value)).toBe(formatter('12323'));
  });

  it('returns a number', () => {
    const formatter = 'number';
    const value = '12323';
    expect(Formatter(formatter, value)).toBe(12323);
  });
  it('returns only digits', () => {
    const formatter = 'only_digits';
    const value = '12323asd';
    expect(Formatter(formatter, value)).toBe('12323');
  });
  it('returns integer', () => {
    const formatter = 'integer';
    const value = '12323asd';
    expect(Formatter(formatter, value)).toBe(12323);
  });
  it('returns float', () => {
    const formatter = 'float';
    const value = '12323asd';
    expect(Formatter(formatter, value)).toBe('12323');
  });
  it('returns float with dot', () => {
    const formatter = 'float';
    const value = '12323.00534';
    expect(Formatter(formatter, value)).toBe('12323.00534');
  });
  it('parser ipv4 characters', () => {
    const formatter = 'ipv4';
    const value = '123.re3$235c./;s1!';
    expect(Formatter(formatter, value)).toBe('123.3235.1');
  });
  it('parser postcode characters', () => {
    const formatter = 'post_code';
    const value = '12.re$-23./5;!';
    expect(Formatter(formatter, value)).toBe('12-235');
  });
  it('mask postcode with -', () => {
    const formatter = 'post_code';
    const value = '123';
    expect(Formatter(formatter, value)).toBe('12-3');
  });
  it('parser ipv4 characters', () => {
    const formatter = 'ipv4';
    const value = '123.re3$235c./;s1!';
    expect(Formatter(formatter, value)).toBe('123.3235.1');
  });
  it('returns the same value', () => {
    const formatter = 'what';
    const value = '12323asd';
    expect(Formatter(formatter, value)).toBe('12323asd');
  });
  it('returns the same value', () => {
    const formatter = {};
    const value = '12323asd';
    expect(Formatter(formatter, value)).toBe('12323asd');
  });
});
