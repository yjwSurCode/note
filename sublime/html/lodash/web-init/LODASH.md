# (源码解析,一次性了解)lodash防抖节流

---
highlight: a11y-dark
---
 ## 定义：防抖 如果在Ns内没有再次触发滚动事件，那么就执行函数 如果在Ns内再次触发滚动事件，那么当前的计时取消，重新开始计时 最后一次输入后的Ns执行 

 ## 前言( 参数含义)
 ```
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
  ```
 ## 一、引入代码部分
 ### 1.1：requestAnimationFrame
 ```
  /*判断是否有requestAnimationFrame 通过显式设置"wait=0"使用"requestAnimationFrame" */
  /* 与setTimeout相比，requestAnimationFrame最大的优势是由系统来决定回调函数的执行时机。具体一点讲，如果屏幕刷新率是60Hz,那么回调函数就每16.7ms被执行一次，如果刷新率是75Hz，那么这个时间间隔就变成了1000/75=13.3ms，换句话说就是，requestAnimationFrame的步伐跟着系统的刷新步伐走。它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题。*/
 const useRAF =!wait && wait !== 0 && typeof root.requestAnimationFrame === "function";
```
 ### 1.2：options
 
 ```
 interface DebounceOptions {
  /*执行函数在每个等待时延的开始被调用*/
  leading?: boolean;
  /*最大的等待时间*/
  maxWait?: number;
  /*执行函数函数在每个等待时延的结束被调用 false则不调用*/
  trailing?: boolean;
}

 function useDebounceFn<T extends (...args: T[]) => any>(
  func: (...args: T[]) => any,
  wait: number = 0,
  options?: DebounceOptions
): DebouncedFuncLeading<T> {
 ...

```
 ### 1.3：函数主入口
 
 ```
 ...
 return function debounced(...args: Array<T>) {
    // this?
    lastThis = this;
    lastArgs = args;
 ...
 }
 ```
` 1.3.1：lastThis lastArgs为函数传递的参数  result = func.apply(thisArg, args)将参数传递给传入函数; `
```
const _useDebounceFn = useDebounceFn(
  (e) => {
    console.log("触发-useDebounceFn", e); //e为参数a
  },
  2000,
  { maxWait: 3000 }
);
 _useDebounceFn('a');
```



  
 ### 1.4：判断是否执行函数shouldInvoke
 ```
 const isInvoking = shouldInvoke(time);
 
   /* 传入当前时间戳,判断是否应该取消 */
  function shouldInvoke(time: number) {
    /* 判断时间是否回退 */
    const timeSinceLastCall =
      time - (lastCallTime === undefined ? 0 : lastCallTime);
    /* 判断时间是否到延迟时间 */
    const timeSinceLastInvoke = time - lastInvokeTime;
    /* 判断时间是否到达最大等待时间 (maxing && timeSinceLastInvoke >= maxWait) */

    if (!maxWait) return;

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
 ```
 第一次触发 lastCallTime, lastInvokeTime为0 函数返回true。
 后面shouldInvoke函数判断返回为false。
 
 ### 1.6：leadingEdge回调函数
 ```
 if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }

      /* 传入option maxWait */
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    
    传入时间为执行时的时间戳
    const leadingEdge = (time: number) => {
    /* 重置时间 Reset `maxWait` timer */
    lastInvokeTime = time;
    /* 启动计时器 Start the timer for the trailing edge */
    timerId = startTimer(timerExpired, wait);
    /* 判断执行函数时机 */
    return leading ? invokeFunc(time) : result;
  };
    
 ```
 

