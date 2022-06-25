export const isEmptyArray = (array = []) => {
  if (!Array.isArray(array)) {
    throw new Error(`${array} is not Array type!`);
  }
  return array.length === 0;
};
