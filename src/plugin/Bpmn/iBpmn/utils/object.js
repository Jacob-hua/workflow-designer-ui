import { isEmptyArray } from "./array";

export function typeAssert(value, type) {
  if (Object.prototype.toString.call(type) !== "[object Function]") {
    throw new Error("typeCheck type is not a function");
  }

  const typeString = type.toString().match(/(?<=(function )).*(?=(\())/g)[0];
  const valueTypeStirng = Object.prototype.toString.call(value).match(/(?<=(\[object )).*(?=(\]))/g)[0];
  return typeString === valueTypeStirng;
}

export function deepCopy(obj, cache = []) {
  if (typeAssert(obj, Function)) {
    return new Function(`return ${obj.toString()}`)();
  }

  if (typeAssert(obj, RegExp)) {
    obj = obj.toString().substr(1);
    obj = obj.substr(0, obj.length - 1);
    return new RegExp(obj);
  }

  if (typeAssert(obj, Map)) {
    return new Map(obj);
  }

  if (typeAssert(obj, Set)) {
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

export function isObject(obj) {
  return typeof obj == "object" && obj !== null;
}

export function deepEquals(obj1, obj2) {
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2;
  }
  if (obj1 === obj2) return true;
  const obj1Properties = Object.keys(obj1);
  const obj2Properties = Object.keys(obj2);
  if (obj1Properties.length !== obj2Properties.length) {
    return false;
  }
  for (const key in obj1) {
    const result = deepEquals(obj1[key], obj2[key]);
    if (!result) {
      return false;
    }
  }
  return true;
}
