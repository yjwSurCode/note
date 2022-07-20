import root from "./utils";

interface DebounceOptions {
  /*函数在每个等待时延的开始被调用*/
  leading?: boolean;
  /*最大的等待时间*/
  maxWait?: number;
  /*函数在每个等待时延的结束被调用*/
  trailing?: boolean;
}

interface InitData extends DebounceOptions {
  lastArgs: any | 0;
  lastThis?: any;
  result?: any;
  timerId?: any;
  /*最后一次触发时间* */
  lastCallTime?: number;
  /*func上一次执行的时间戳*/
  lastInvokeTime: number;
  maxing?: number;
}

function isObject(value: DebounceOptions) {
  const type = typeof value;
  return value != null && (type === "object" || type === "function");
}

/* 防抖 如果在Ns内没有再次触发滚动事件，那么就执行函数 如果在Ns内再次触发滚动事件，那么当前的计时取消，重新开始计时 最后一次输入后的Ns执行 */
function useDebounceFn<T extends any[]>(
  func: (...args: T[]) => any,
  wait: number = 0,
  options: DebounceOptions = { leading: false, maxWait: 10000, trailing: true }
): () => T {
  console.log("11---", func, wait, options);
  let lastArgs: InitData["lastArgs"];
  let lastThis: InitData["lastThis"];
  let maxWait: InitData["maxWait"] = 10000;
  let result: InitData["result"];
  let timerId: InitData["timerId"];
  let lastCallTime: InitData["lastCallTime"] = 0;
  let lastInvokeTime: InitData["lastInvokeTime"] = 0;
  let leading: InitData["leading"] = false;
  let maxing: InitData["maxing"] = 0;
  let trailing: InitData["trailing"] = true;

  console.log("11111----", root.requestAnimationFrame);
  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  //判断是否有requestAnimationFrame
  const useRAF =
    !wait && wait !== 0 && typeof root.requestAnimationFrame === "function";

  console.log("222222----", !wait && wait !== 0, useRAF);

  if (typeof func !== "function") {
    throw new TypeError("Expected a function");
  }

  wait = (wait && wait + 1) || 0;

  if (isObject(options)) {
    leading = !!options.leading;
    // maxing = "maxWait" in options;
    maxing = options.maxWait;
    const optMaxWait = (options.maxWait && options.maxWait + 1) || 0;

    maxWait = maxing ? Math.max(optMaxWait, wait) : maxWait;

    trailing = "trailing" in options ? !!options.trailing : trailing;
  }

  function startTimer(pendingFunc: () => {}, wait: number | undefined) {
    if (useRAF) {
      root.cancelAnimationFrame(timerId);
      return root.requestAnimationFrame(pendingFunc);
    }

    return setTimeout(pendingFunc, wait);
  }

  function invokeFunc(time: number) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function shouldInvoke(time: number) {
    console.log("a-31", lastCallTime, lastInvokeTime, wait); //1658301583997 0 0
    console.log("a-32", lastCallTime, lastInvokeTime, wait); //1658301583997 0 0

    const timeSinceLastCall =
      time - (lastCallTime === undefined ? 0 : lastCallTime);
    const timeSinceLastInvoke = time - lastInvokeTime;

    console.log("a-33", maxWait);

    if (!maxWait) return;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    );
  }

  /*剩余等待时间*/
  function remainingWait(time: number) {
    // if (!lastCallTime || !lastInvokeTime || !wait) return;
    if (!maxWait || !lastCallTime) return;

    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time));
  }

  const leadingEdge = (time: number) => {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  };

  function trailingEdge(time: number) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function debounced(...args: any) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time); //第一次true 在时间内点击false

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    console.log("a--debounced(...args)", timerId, args, isInvoking);
    if (isInvoking) {
      if (timerId === undefined) {
        console.log("b----1", timerId);
        /**/
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        console.log("b----2", timerId);
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timerId === undefined) {
      console.log("b----3", timerId);
      timerId = startTimer(timerExpired, wait);
    }

    return result;
  }

  debounced.cancel = () => {
    if (timerId !== undefined) {
      if (useRAF) {
        return root.cancelAnimationFrame(timerId);
      }
      clearTimeout(timerId);
    }

    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  };

  debounced.flush = () => {
    return timerId === undefined ? result : trailingEdge(Date.now());
  };

  debounced.pending = () => timerId !== undefined;

  return debounced;
}

export default useDebounceFn;
