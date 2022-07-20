import root from "./utils";

interface Debounceoptions {
  /*函数在每个等待时延的开始被调用*/
  leading?: boolean | undefined;
  /*最大的等待时间*/
  maxWait?: number | undefined;
  /*函数在每个等待时延的结束被调用*/
  trailing?: boolean | undefined;
}

interface InitData {
  /*func上一次执行的时间*/
  lastInvokeTime?: number;
  leading?: boolean | undefined;
  maxing?: number | undefined;
  trailing?: boolean | undefined;
}

function isObject(value: Debounceoptions) {
  const type = typeof value;
  return value != null && (type === "object" || type === "function");
}

/* 防抖 如果在Ns内没有再次触发滚动事件，那么就执行函数 如果在Ns内再次触发滚动事件，那么当前的计时取消，重新开始计时 最后一次输入后的Ns执行 */
function debounce<T extends any[]>(
  func: (...args: T) => any,
  wait?: number,
  options: Debounceoptions = { leading: false, maxWait: 0, trailing: true }
) {
  console.log(func, wait, options);
  let lastArgs, lastThis, maxWait, result, timerId, lastCallTime;
  let lastInvokeTime: InitData["lastInvokeTime"] = 0;
  let leading: InitData["leading"] = false;
  let maxing: InitData["maxing"] = false;
  let trailing: InitData["trailing"] = true;

  console.log(root.requestAnimationFrame, "root.requestAnimationFrame");
  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  //判断是否有requestAnimationFrame
  const useRAF =
    !wait && wait !== 0 && typeof root.requestAnimationFrame === "function";

  if (typeof func !== "function") {
    throw new TypeError("Expected a function");
  }

  wait = (wait && wait + 1) || 0;

  if (isObject(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    optMaxWait = (options.maxWait && options.maxWait + 1) || 0;
    maxWait = maxing ? Math.max(optMaxWait, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait);
    }
    return result;
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancelTimer(id) {
    if (useRAF) {
      return root.cancelAnimationFrame(id);
    }
    clearTimeout(id);
  }

  debounced.cancel = () => {
    if (timerId !== undefined) {
      cancelTimer(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  };

  debounced.flush = () => {
    return timerId === undefined ? result : trailingEdge(Date.now());
  };

  debounced.pending = () => timerId !== undefined;

  return debounced;

  return 1;
}

export default debounce;

// function sum(a, b) {
//   return a + b;
// }
// module.exports = debounce;
