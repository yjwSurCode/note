"use strict";
exports.__esModule = true;
var utils_1 = require("./utils");
function debounce(func, wait, options) {
    if (options === void 0) { options = { leading: false, maxWait: 0, trailing: true }; }
    console.log(func, wait, options);
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime;
    var lastInvokeTime = 0;
    var maxing = false;
    // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
    var useRAF = !wait && wait !== 0 && typeof utils_1["default"].requestAnimationFrame === "function";
    if (typeof func !== "function") {
        throw new TypeError("Expected a function");
    }
    return 1;
}
exports["default"] = debounce;
// function sum(a, b) {
//   return a + b;
// }
// module.exports = debounce;
