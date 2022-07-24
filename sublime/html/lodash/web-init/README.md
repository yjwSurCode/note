yarn add webpack webpack-cli @webpack-cli/generators webpack-dev-server -g

npx webpack init

npm i jest ts-jest @types/jest

jest.config.ts 配置
module.exports = {
transform: {
"^.+\\.tsx?$": "ts-jest",
    "^.+\\.ts?$": "ts-jest",
},
testRegex: "(/**tests**/.\*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

yarn add power-assert

yarn add @types/power-assert

    "test": "jest",
    // "test-single": "jest debounce.spec.js"
    "test-single": "jest throttle.spec.ts"

# Jest 测试框架运行 npm test 时报错：Test suite failed to run

需要手动输入测试

// import assert from "assert";
import assert from "power-assert";

# 修改

if (
options != null &&
(typeof options === "object" || typeof options === "function")
) {

if (Object.values(options).length > 0) {

if (isObject(options)) {

F5-继续：直接跳到下一个断点
单步跳过：运行到当前文件夹的下一行，跳过当前语句，调用其他文件夹的所有语句。比如 a = func_b©，如果 func_b 是其他文件夹定义的复杂函数，直接跳过；
单步调试：运行到自己写的文件下一行语句，比如 a = func_b©，如果 func_b 是其他文件定义的复杂函数，则进入其他文件，运行下一步；
单步跳出：当 debug 陷入某个循环时，直接跳过当前循环。
重启，重新 debug

# 🚀 Welcome to your new awesome project!

interface DebounceOptions {
/_执行函数在每个等待时延的开始被调用_/
leading?: boolean;
/_最大的等待时间_/
maxWait?: number;
/_执行函数函数在每个等待时延的结束被调用_/
trailing?: boolean;
}

interface InitData extends DebounceOptions {
/_主函数传入参数_ _/
lastArgs?: undefined | Array<any>;
lastThis?: undefined | Array<any>;
/_ 处理中间件 */
result?: undefined;
timerId?: number;
/*最后一次触发时间\* */
lastCallTime?: number;
/*func 上一次执行的时间戳\*/
lastInvokeTime?: number;
maxing?: number;
}
//...args: T[]
interface DebouncedFunc<T extends (args: T) => any> {
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
/_ 防抖 如果在 Ns 内没有再次触发滚动事件，那么就执行函数 如果在 Ns 内再次触发滚动事件，那么当前的计时取消，重新开始计时 最后一次输入后的 Ns 执行 _/
function useDebounceFn<T extends (args: T) => any>(
func: (args: T) => any, //func: (...args: T[]) => any,
wait: number = 0,
options?: DebounceOptions
// = { leading: false, maxWait: 4999, trailing: true }
): DebouncedFuncLeading<T> {
let lastArgs: InitData["lastArgs"];
let lastThis: InitData["lastThis"];
let result: InitData["result"];
let timerId: InitData["timerId"];
let maxWait: InitData["maxWait"] = 4999;
let maxing: InitData["maxing"] = 0;
let leading: InitData["leading"] = false;
let trailing: InitData["trailing"] = true;
let lastCallTime: InitData["lastCallTime"] = 0;
let lastInvokeTime: InitData["lastInvokeTime"] = 0;

import root from "./utils";

interface DebounceOptions {
/_执行函数在每个等待时延的开始被调用_/
leading?: boolean;
/_最大的等待时间_/
maxWait?: number;
/_执行函数函数在每个等待时延的结束被调用_/
trailing?: boolean;
}

interface InitData extends DebounceOptions {
/_主函数传入参数_ _/
lastArgs?: undefined | Array<any>;
lastThis?: undefined | Array<any>;
/_ 处理中间件 */
result?: undefined;
timerId?: number;
/*最后一次触发时间\* */
lastCallTime?: number;
/*func 上一次执行的时间戳\*/
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
/_ 防抖 如果在 Ns 内没有再次触发滚动事件，那么就执行函数 如果在 Ns 内再次触发滚动事件，那么当前的计时取消，重新开始计时 最后一次输入后的 Ns 执行 _/
function useDebounceFn<T extends (...args: T[]) => any>(
func: (...args: T[]) => any, //func: (...args: T[]) => any,
wait: number = 0,
options?: DebounceOptions
// = { leading: false, maxWait: 4999, trailing: true }
): DebouncedFuncLeading<T> {
let lastArgs: InitData["lastArgs"];
let lastThis: InitData["lastThis"];
let result: InitData["result"];
let timerId: InitData["timerId"];
let maxWait: InitData["maxWait"] = 4999;
let maxing: InitData["maxing"] = 0;
let leading: InitData["leading"] = false;
let trailing: InitData["trailing"] = true;
let lastCallTime: InitData["lastCallTime"] = 0;
let lastInvokeTime: InitData["lastInvokeTime"] = 0;

console.log("init11111---", options, func, wait, root.requestAnimationFrame);
/_判断是否有 requestAnimationFrame 通过显式设置"wait=0"绕过"requestAnimationFrame" _/
const useRAF =
!wait && wait !== 0 && typeof root.requestAnimationFrame === "function";

console.log("init22222----", !wait && wait !== 0, useRAF);

if (typeof func !== "function") {
throw new TypeError("Expected a function");
}

wait = (wait && wait + 1) || 0;

if (isObject(options)) {
leading = !!options?.leading;
maxing = options?.maxWait;
const optMaxWait = (options?.maxWait && options.maxWait + 1) || 0;
/_默认 5s 优先取传入值_/
maxWait = maxing ? Math.max(optMaxWait, wait) : maxWait;
console.log("init333333---maxWait", maxing, maxWait);
trailing = options?.trailing ? !!options.trailing : trailing;
}
// step 2
function startTimer(
pendingFunc: () => {} | undefined,
wait: number | undefined
) {
console.log(useRAF, "useRAF");
if (useRAF) {
root.cancelAnimationFrame(timerId);
return root.requestAnimationFrame(pendingFunc);
}

    return setTimeout(pendingFunc, wait);

}
/_ 触发函数 _/
function invokeFunc(time: number) {
const args = lastArgs;
const thisArg = lastThis;
lastArgs = lastThis = undefined;
/_设置函数最后执行的时间 _/
lastInvokeTime = time;
/_设置函数最后执行的时间 _/
console.log("d-1111", thisArg, args); // undefined event
result = func.apply(thisArg, args);
return result;
}

/_ 传入当前时间戳,判断是否应该取消 _/
function shouldInvoke(time: number) {
/_ 判断时间是否回退 _/
const timeSinceLastCall =
time - (lastCallTime === undefined ? 0 : lastCallTime);
/_ 判断时间是否到延迟时间 _/
const timeSinceLastInvoke = time - lastInvokeTime;

    /* 判断时间是否到达最大等待时间 (maxing && timeSinceLastInvoke >= maxWait) */
    // console.log(maxWait, "maxWait11");
    if (!maxWait) return;

    console.log("eeeeee");

    // console.log(
    //   "a-33",
    //   "是否",
    //   time - lastInvokeTime,
    //   "lastInvokeTime--->",
    //   lastInvokeTime,
    //   "maxWait--maxing-->",
    //   maxWait,
    //   maxing,
    //   "timeSinceLastInvoke--->",
    //   timeSinceLastInvoke,
    //   lastInvokeTime,
    //   "-----------------------",
    //   lastCallTime === undefined,
    //   timeSinceLastCall >= wait,
    //   timeSinceLastCall < 0,
    //   "触发判断",
    //   maxing && timeSinceLastInvoke >= maxWait,
    //   maxing && timeSinceLastInvoke >= (0 && maxWait)
    // );

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

/_剩余等待时间_/
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
// console.log("d-2 后", shouldInvoke(time), trailingEdge(time)); //true undefined
if (shouldInvoke(time)) {
return trailingEdge(time);
}
// Restart the timer.
timerId = startTimer(timerExpired, remainingWait(time));
}

// step 1
const leadingEdge = (time: number) => {
/_ 重置时间 Reset `maxWait` timer _/
lastInvokeTime = time;
console.log(timerExpired, leading, "c-1111"); // a-33 145
/_ 启动计时器 Start the timer for the trailing edge _/
timerId = startTimer(timerExpired, wait);
console.log("d-222", startTimer(timerExpired, wait));
/_ 判断执行函数时机 _/
return leading ? invokeFunc(time) : result;
};
// step 4 shouldInvoke(time)
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

function debounced(...args: Array<any>) {
const time = Date.now();
const isInvoking = shouldInvoke(time); //第一次 true 在时间内点击 false

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    console.log("a--debounced(...args)", timerId, maxing, args);
    if (isInvoking) {
      if (timerId === undefined) {
        // console.log("b----1", timerId, lastCallTime === time);
        // console.log("d---1111leadingEdge", leadingEdge(lastCallTime));
        return leadingEdge(lastCallTime);
      }
      /* 传入option maxWait */
      if (maxing) {
        alert(maxing);
        console.log("b----2", timerId);
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    console.log(timerId, "d-timerId");
    //TODO 执行时机
    if (timerId === undefined) {
      alert(2);
      console.log("b----3", timerId);
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
alert(0);
return timerId === undefined ? result : trailingEdge(Date.now());
};

debounced.pending = () => {
alert(0);
return timerId !== undefined;
};

return debounced;
}

function isObject(value: DebounceOptions | undefined) {
const type = typeof value;
return value != null && (type === "object" || type === "function");
}

export default useDebounceFn;
