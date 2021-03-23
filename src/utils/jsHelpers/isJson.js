const isJson = (string) => {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
};
export default isJson;
