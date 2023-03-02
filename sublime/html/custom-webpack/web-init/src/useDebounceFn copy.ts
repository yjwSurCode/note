import root from "./utils";

interface DebounceOptions {
  /*执行函数在每个等待时延的开始被调用*/
  leading?: boolean;
  /*最大的等待时间*/
  maxWait?: number;
  /*执行函数函数在每个等待时延的结束被调用 false则不调用*/
  trailing?: boolean;
}

interface InitData extends DebounceOptions {
  /* 主函数传入参数 缓存上一个arguments */
  lastArgs?: undefined | Array<any>;
  /* 缓存上一个this */
  lastThis?: undefined | Array<any>;
  /* 传入函数返回值 */
  result?: undefined | any;
  timerId?: number;
  /*最后一次触发时间* */
  lastCallTime?: number;
  /*func上一次执行的时间戳*/
  lastInvokeTime?: number;
  maxing?: number;
}

interface DebouncedFunc<T extends (...args: T[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
}

interface DebouncedFuncLeading<T extends (...args: T[]) => any>
  extends DebouncedFunc<T> {
  (...args: Parameters<T>): ReturnType<T>;
  flush(): ReturnType<T>;
}

//...args: T[]
/* 防抖 如果在Ns内没有再次触发滚动事件，那么就执行函数 如果在Ns内再次触发滚动事件，那么当前的计时取消，重新开始计时 最后一次输入后的Ns执行 */
function useDebounceFn<T extends (...args: T[]) => any>(
  func: (...args: T[]) => any, //func: (...args: T[]) => any,
  wait: number = 0,
  options?: DebounceOptions
): DebouncedFuncLeading<T> {
  //TODO
  /* 主函数传入参数 缓存上一个arguments */
  let lastArgs: undefined | Array<any>; // InitData["lastArgs"];
  let lastThis: undefined | Array<any>; //InitData["lastThis"];
  let result: undefined | any; //InitData["result"];
  let timerId: number; // InitData["timerId"];
  /*最大的等待时间*/
  let maxWait: number = 5000; //InitData["maxWait"] = 9999;
  let maxing: number = 0; // InitData["maxing"]
  /*执行函数在每个等待时延的开始被调用*/
  let leading: boolean = false; // InitData["leading"] =
  /*执行函数函数在每个等待时延的结束被调用 false则不调用*/
  let trailing: boolean = true; //InitData["trailing"] = true;
  let lastCallTime: number = 0; // InitData["lastCallTime"] = 0;
  let lastInvokeTime: number = 0; //InitData["lastInvokeTime"] = 0;

  // console.log("init11111---", options, func, wait, root.requestAnimationFrame);
  /*判断是否有requestAnimationFrame 通过显式设置"wait=0"绕过"requestAnimationFrame" */
  const useRAF =
    !wait && wait !== 0 && typeof root.requestAnimationFrame === "function";

  // console.log("init22222----", !wait && wait !== 0, useRAF);

  if (typeof func !== "function") {
    throw new TypeError("Expected a function");
  }

  wait = (wait && wait + 1) || 0;

  if (isObject(options)) {
    leading = !!options?.leading;
    maxing = options?.maxWait;
    // const optMaxWait = (options?.maxWait && options.maxWait + 1) || 0;
    /*默认5s 优先取传入值*/
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait; //maxing ? Math.max(optMaxWait, wait) : maxWait;
    /* options?.trailing   "trailing" in options */
    trailing = "trailing" in options ? !!options.trailing : trailing;
    // console.log(
    //   maxing,
    //   maxWait,
    //   "对比：",
    //   options?.maxWait,
    //   "maxWait" in options
    // );
  }
  // step 2
  //TODO
  function startTimer(pendingFunc?: () => void, wait?: number) {
    // console.log(useRAF, "useRAF");
    if (useRAF) {
      root.cancelAnimationFrame(timerId);
      return root.requestAnimationFrame(pendingFunc);
    }

    return setTimeout(pendingFunc, wait);
  }
  /* 触发函数 */
  function invokeFunc(time: number) {
    const args = lastArgs;
    const thisArg = lastThis;
    //TODO
    lastArgs = lastThis = undefined;
    /*设置函数最后执行的时间 */
    lastInvokeTime = time;
    /*设置函数最后执行的时间 */
    //TODO
    /* result为返回值 当传入函数又返回值 */
    // console.log("d-1111", result,thisArg, args); // undefined   event
    result = func.apply(thisArg, args);
    // console.log(result, "result");
    return result;
  }

  /* 传入当前时间戳,判断是否应该取消 */
  function shouldInvoke(time: number) {
    /* 判断时间是否回退 */
    const timeSinceLastCall =
      time - (lastCallTime === undefined ? 0 : lastCallTime);
    /* 判断时间是否到延迟时间 */
    const timeSinceLastInvoke = time - lastInvokeTime;

    /* 判断时间是否到达最大等待时间 (maxing && timeSinceLastInvoke >= maxWait) */
    if (!maxWait) return;

    // console.log("shouldInvoke--eeeeee");

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    // 1:false true false true  2:false....  3:false false false true
    // const maxWait===undefined
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    );
  }

  /*剩余等待时间*/
  //TODO 考虑合并
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
  // step 3
  function timerExpired() {
    const time = Date.now();
    // console.log("d-2后", shouldInvoke(time), trailingEdge(time)); //true undefined
    if (shouldInvoke(time)) {
      //TODO
      return trailingEdge(time);
    }
    /* 连续触发重置计时 */
    timerId = startTimer(timerExpired, remainingWait(time));
  }

  // step 1
  const leadingEdge = (time: number) => {
    /* 重置时间 Reset `maxWait` timer */
    lastInvokeTime = time;
    // console.log(timerExpired, leading, "c-1111"); // a-33  145
    /* 启动计时器 Start the timer for the trailing edge */
    timerId = startTimer(timerExpired, wait);
    // console.log("d-222", startTimer(timerExpired, wait));
    /* 判断执行函数时机 */
    return leading ? invokeFunc(time) : result;
  };
  // step 4 shouldInvoke(time)===true
  function trailingEdge(time: number) {
    timerId = undefined;
    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.

    // console.log(trailing, lastArgs, "trailing && lastArgs");
    //TODO
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    /* 跳转用户传入执行函数 */
    return result;
  }

  // step 0
  function debounced(...args: Array<any>) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time); //第一次true在时间内点击false

    lastArgs = args;
    // TODO this的探究
    lastThis = this;
    lastCallTime = time;
    // console.log("a--debounced(...args)", this, args, timerId, isInvoking);
    if (isInvoking) {
      if (timerId === undefined) {
        // console.log("b----1", timerId, lastCallTime === time);
        // console.log("d---1111leadingEdge", leadingEdge(lastCallTime));
        return leadingEdge(lastCallTime);
      }
      /* 传入option maxWait */
      if (maxing) {
        // console.log("b----2", maxing, timerId);
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    // console.log(timerId, "d-timerId");
    //TODO 执行时机
    /* 负责一种情况 trailing为true 在前一个wait的 trailingEdge 已经执行了函数 而在这次函数调用时 shouldInvoke不满足条件 因此要设置定时器 保证函数被执行 */
    if (timerId === undefined) {
      console.log("！！！！！！！！！！", timerId);
      timerId = startTimer(timerExpired, wait);
    }

    return result;
  }

  debounced.cancel = () => {
    alert(0);
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
    /* 取消并立即执行一次 debounce 函数 */
    return timerId === undefined ? result : trailingEdge(Date.now());
  };

  debounced.pending = () => {
    alert(0);
    return timerId !== undefined;
  };

  return debounced;
}

function isObject(value?: DebounceOptions) {
  const type = typeof value;
  return value != null && (type === "object" || type === "function");
}

export default useDebounceFn;
