export const filterPublicFunction = (object, prefix) => {
  const prototype = Object.getPrototypeOf(object);
  return Object.getOwnPropertyNames(prototype).reduce((mappings, key) => {
    const element = prototype[key];
    if (typeof element === "function" && key !== "constructor" && key[0] !== "_") {
      const newKey = (prefix ?? "") !== "" ? `${prefix}${key.slice(0, 1).toUpperCase() + key.slice(1)}` : key;
      mappings[newKey] = element.bind(object);
    }
    return mappings;
  }, {});
};
