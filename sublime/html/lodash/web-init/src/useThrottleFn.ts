import useDebounceFn from "./useDebounceFn";

interface ThrottleOptions {
  /*执行函数在每个等待时延的开始被调用*/
  leading?: boolean;
  /*执行函数函数在每个等待时延的结束被调用 false则不调用*/
  trailing?: boolean;
}

interface ThrottleFunc<T extends (...args: T[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
}

interface ThrottleFuncLeading<T extends (...args: T[]) => any>
  extends ThrottleFunc<T> {
  (...args: Parameters<T>): ReturnType<T>;
  flush(): ReturnType<T>;
}

function useThrottleFn<T extends (...args: T[]) => any>(
  func: (...args: T[]) => any,
  wait: number = 0,
  options?: ThrottleOptions
): ThrottleFuncLeading<T> {
  let leading: boolean = true;
  let trailing: boolean = true;

  if (typeof func !== "function") {
    throw new TypeError("Expected a function");
  }

  if (
    options != null &&
    (typeof options === "object" || typeof options === "function")
  ) {
    // if (Object.values(options).length > 0 && options != null) {  //Object.value值为null 报错
    leading = "leading" in options ? !!options.leading : leading;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }

  console.log("throttlr1111111", leading, trailing);

  return useDebounceFn(func, wait, { leading, trailing, maxWait: wait });
}

export default useThrottleFn;
