/* eslint-disable no-plusplus */
export default function arrayMove(array, oldIndex, newIndex) {
  const from = oldIndex;
  let to = newIndex;

  if (array[from] === undefined) {
    return array;
  }

  if (to < 0) {
    to = 0;
  }
  if (to > array.length - 1) {
    // eslint-disable-next-line no-param-reassign
    to = array.length - 1;
  }

  array.splice(to, 0, array.splice(from, 1)[0]);
  return array;
}
