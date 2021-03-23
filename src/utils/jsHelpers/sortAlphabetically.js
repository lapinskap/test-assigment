const sortAlphabetically = (a, b) => {
  const firstItem = a.toLowerCase();
  const secondItem = b.toLowerCase();
  if (firstItem < secondItem) { return -1; }
  if (firstItem > secondItem) { return 1; }
  return 0;
};

export default sortAlphabetically;
