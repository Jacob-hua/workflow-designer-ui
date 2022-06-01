import { isEmptyArray } from "./array";

export function deepCopy(obj, cache = []) {
  if (Object.prototype.toString.call(obj) === "[object Function]") {
    return new Function(`return ${obj.toString()}`)();
  }

  if (Object.prototype.toString.call(obj) === "[object RegExp]") {
    obj = obj.toString().substr(1);
    obj = obj.substr(0, obj.length - 1);
    return new RegExp(obj);
  }

  if (Object.prototype.toString.call(obj) === "[object Map]") {
    return new Map(obj);
  }

  if (Object.prototype.toString.call(obj) === "[object Set]") {
    return new Set(obj);
  }

  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  const hit = cache.find((item) => item.origin === obj);
  if (hit) {
    return hit.copy;
  }

  const copy = Array.isArray(obj) ? [] : {};
  cache.push({
    origin: obj,
    copy,
  });
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepCopy(obj[key], cache);
    }
  }
  return copy;
}

export function emptyPropertiesObject(obj) {
  return isEmptyArray(Object.keys(obj));
}
