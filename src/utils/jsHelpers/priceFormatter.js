const priceFormatter = (price = null, currency = 'zł') => {
  const priceValue = parseFloat(`${+price}` || '0').toFixed(2);
  return `${priceValue}${currency}`;
};
export default priceFormatter;
