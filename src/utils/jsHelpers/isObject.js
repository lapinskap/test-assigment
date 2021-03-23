export default function isObject(variable) {
  return variable !== undefined && variable !== null && variable.constructor === Object;
}
