import priceFormatter from './priceFormatter';

describe('priceFormatter', () => {
  it('converts int to price', () => {
    expect(priceFormatter(1)).toEqual('1.00zł');
  });
  it('converts string int to price', () => {
    expect(priceFormatter('1')).toEqual('1.00zł');
  });
  it('converts float to price', () => {
    expect(priceFormatter(1.5434543)).toEqual('1.54zł');
  });
  it('converts float string to price', () => {
    expect(priceFormatter('1.5434543')).toEqual('1.54zł');
  });
  it('converts null to price', () => {
    expect(priceFormatter(null)).toEqual('0.00zł');
  });
  it('converts undefined to price', () => {
    expect(priceFormatter(undefined)).toEqual('0.00zł');
  });
});
