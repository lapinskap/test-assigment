export default (data = {}) => {
  const { 'execute:errorLines': errors = [], 'execute:processed': processed = 0, 'execute:totalLines': totalLines = 0 } = data;
  return {
    success: !errors.length, processed, totalLines, errors,
  };
};
