import root from "./utils";

interface DebounceOptions {
  /*执行函数在每个等待时延的开始被调用*/
  leading?: boolean;
  /*最大的等待时间*/
  maxWait?: number;
  /*执行函数函数在每个等待时延的结束被调用 false则不调用*/
  trailing?: boolean;
}
interface DebouncedFunc<T extends (...args: T[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
}

interface DebouncedFuncLeading<T extends (...args: T[]) => any>
  extends DebouncedFunc<T> {
  (...args: Parameters<T>): ReturnType<T>;
  pending(): void;
}

/* 防抖 如果在Ns内没有再次触发事件，那么就执行函数 如果在Ns内再次触发滚动事件，那么当前的计时取消，重新开始计时 最后一次输入后的Ns执行 */
function useDebounceFn<T extends (...args: T[]) => any>(
  func: (...args: T[]) => any,
  wait: number = 0,
  options?: DebounceOptions
): DebouncedFuncLeading<T> {
  //TODO
  /* 缓存上一个this */
  let lastThis: Array<unknown> | undefined;
  /* 主函数传入参数 缓存上一个arguments */
  let lastArgs: undefined | Array<unknown>;
  /* 传入函数返回值 */
  let result: any;
  /* 计时器返回的ID值 */
  let timerId: NodeJS.Timeout;
  /*最大的等待时间*/
  let maxWait: number = 5000;
  let maxing: number = 0;
  /*执行函数在每个等待时延的开始被调用*/
  let leading: boolean = false;
  /*执行函数函数在每个等待时延的结束被调用 false则不调用*/
  let trailing: boolean = true;
  /*最后一次触发时间* */
  let lastCallTime: number = 0;
  /*func上一次执行的时间戳*/
  let lastInvokeTime: number = 0;

  /*判断是否有requestAnimationFrame 通过显式设置"wait=0"使用"requestAnimationFrame" */
  /* 与setTimeout相比，requestAnimationFrame最大的优势是由系统来决定回调函数的执行时机。具体一点讲，如果屏幕刷新率是60Hz,那么回调函数就每16.7ms被执行一次，如果刷新率是75Hz，那么这个时间间隔就变成了1000/75=13.3ms，换句话说就是，requestAnimationFrame的步伐跟着系统的刷新步伐走。它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题。*/
  const useRAF =
    !wait && wait !== 0 && typeof root.requestAnimationFrame === "function";

  if (typeof func !== "function") {
    throw new TypeError("Expected a function");
  }

  wait = (wait && wait + 1) || 0;

  if (
    options != null &&
    (typeof options === "object" || typeof options === "function")
  ) {
    leading = !!options?.leading;
    maxing = options?.maxWait;
    /*默认5s 优先取传入值*/
    // maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
    maxWait = maxing ? Math.max(+(options.maxWait || 0), wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }

  // step 2
  function startTimer(pendingFunc?: () => void, wait?: number): NodeJS.Timeout {
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
    /* result为返回值 当传入有函数返回值 */

    console.log("555", thisArg, "----", args);
    result = func.apply(thisArg, args);
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

    console.log(
      "222",
      lastCallTime === undefined ||
        timeSinceLastCall >= wait ||
        timeSinceLastCall < 0 ||
        (maxing && timeSinceLastInvoke >= maxWait),
      time,
      lastCallTime,
      lastInvokeTime
    );

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    // 1:false true false true  2:false....  3:false false false true
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    );
  }

  // step 3
  function timerExpired() {
    const time = Date.now();
    console.log("444", shouldInvoke(time), time, lastCallTime, lastInvokeTime);
    /* 在第一次倒计时触发false */
    if (shouldInvoke(time)) {
      //TODO
      /*定时器触发 判断是否在等待时间 */
      return trailingEdge(time);
    }

    /*剩余等待时间*/
    const remainingWait = (time: number) => {
      if (!maxWait || !lastCallTime) return;

      const timeSinceLastCall = time - lastCallTime;
      const timeSinceLastInvoke = time - lastInvokeTime;
      const timeWaiting = wait - timeSinceLastCall;

      return maxing
        ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
        : timeWaiting;
    };
    console.log("555", remainingWait(time));
    /* 重置计时 */
    timerId = startTimer(timerExpired, remainingWait(time));
  }

  // step 1
  const leadingEdge = (time: number) => {
    /* 重置时间 Reset `maxWait` timer */
    lastInvokeTime = time;
    /* 启动计时器 Start the timer for the trailing edge */
    timerId = startTimer(timerExpired, wait);
    /* 判断执行函数时机 */
    return leading ? invokeFunc(time) : result;
  };

  // step 4 shouldInvoke(time)===true
  function trailingEdge(time: number) {
    timerId = undefined;
    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.

    //TODO
    /*   */
    if (trailing && lastArgs) {
      console.log("666", trailing && lastArgs);
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    /* 跳转用户传入执行函数 */
    return result;
  }

  // step 0
  function debounced(...args: Array<T>) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    // TODO this?
    lastThis = this;
    lastArgs = args;
    lastCallTime = time;
    console.log("111", time, isInvoking, "THIS", lastThis);
    if (isInvoking) {
      if (timerId === undefined) {
        console.log("111-1", lastCallTime);
        return leadingEdge(lastCallTime);
      }

      /* 传入option maxWait */
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    //TODO 执行时机
    /* 负责一种情况 trailing为true 在前一个wait的trailingEdge已经执行了函数 而在这次函数调用时 shouldInvoke不满足条件 因此要设置定时器 保证函数被执行 */
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait);
    }

    return result;
  }

  /* 取消执行,清除闭包变量 */
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

  /* 取消并立即执行一次 debounce 函数 */
  debounced.flush = () => {
    return timerId === undefined ? result : trailingEdge(Date.now());
  };

  /* 获取当前状态,检查当前是否在计时中*/
  debounced.pending = () => {
    return timerId !== undefined;
  };

  return debounced;
}

export default useDebounceFn;
