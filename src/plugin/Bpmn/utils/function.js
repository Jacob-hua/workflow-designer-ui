/**
 * 函数柯里化工具
 *
 * @param {*} fun
 * @returns
 */
export function curryFunction(fun) {
  return function curried(...args) {
    if (args.length >= fun.length) {
      return fun.apply(this, args);
    } else {
      return function (...args1) {
        return curried.apply(this, args.concat(args1));
      };
    }
  };
}

/**
 * 函数节流
 *
 * @param {*} fun
 * @param {*} delay
 * @returns
 */
export function throttle(callback, delay) {
  let lastExec = 0;
  let timerId = 0;
  let canceled = false;

  const wrapper = function (...args) {
    if (canceled) {
      return;
    }

    const elapsed = Date.now() - lastExec;

    const exec = () => {
      lastExec = Date.now();
      callback.apply(this, args);
    };

    if (timerId) {
      clearTimeout(timerId);
      timerId = 0;
    }

    if (elapsed > delay) {
      exec();
    } else {
      timerId = setTimeout(exec, delay - elapsed);
    }
  };

  wrapper.cancel = () => {
    timerId && clearTimeout(timerId);
    lastExec = 0;
    timerId = 0;
    canceled = true;
  };

  return wrapper;
}

/**
 * 函数防抖
 *
 * @param {*} fun
 * @param {*} delay
 */
export function debounce(callback, delay) {
  let timerId = 0;

  return function (...args) {
    if (!timerId) {
      callback.apply(this, args);
    } else {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      timerId = 0;
    }, delay);
  };
}
