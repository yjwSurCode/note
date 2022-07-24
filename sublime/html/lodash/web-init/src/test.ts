// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>__empty__</title>
//   </head>
//   <body></body>

//   <script src="./debounce.js">
//     // import debouncd from "./debounce.ts";
//     console.log(debounce);
//   </script>
// </html>

import useDebounceFn from "./useDebounceFn";
import useThrottleFn from "./useThrottleFn";
import debounced from "./debounce";
import _ from "lodash"; //npm i --save-dev @types/lodash

var callCounts = 0;

const _debounced = debounced(
  () => {
    console.log("触发-debounce");
    // _debounced.cancel;
    callCounts++;
  },
  1000
  // { trailing: false } // false 0 0    true 0 1
);

const _useDebounceFn = useDebounceFn(
  (e) => {
    console.log("触发-useDebounceFn", e);
    callCounts++;
    // alert("触发-useDebounceFn");
    // _useDebounceFn.cancel;
    // _useDebounceFn.flush;
  },
  200,
  { maxWait: 200 }
);

const lodashDebounce = _.debounce(
  () => {
    console.log("触发-lodashDebounce");
    // _debounced.cancel;
    callCounts++;
  },
  2000,
  { leading: true, maxWait: 2000 }
);

// var lodash_runInContext = _.runInContext();
var dateCount = 0;
var lodash_runInContext = _.runInContext({
  Date: {
    now: function () {
      return ++dateCount < 4 ? 0 : +new Date();
    },
  },
});
console.log(
  "lodash_runInContext",
  lodash_runInContext,
  lodash_runInContext.throttle
);
lodash_runInContext.throttle(function (value) {
  callCounts++;
  return value;
}, 32);

const _useThrottleFn = useThrottleFn(
  function (e) {
    callCounts++;
    console.log("触发-_useThrottleFn", e);
  },
  1000,
  { leading: true }
);

window.addEventListener("click", (e) => {
  console.log("用户点击", e);
  // _debounced();
  // _useDebounceFn();
  _useThrottleFn(e);
  // lodashDebounce();
  // useDebounceFn(
  //   () => {
  //     console.log("触发-useDebounceFn");
  //   },
  //   1000,
  //   { maxWait: 3000 }
  // )();

  console.log("callCounts[0]", callCounts);

  // setTimeout(function () {
  //   console.log("callCounts[1]", callCounts);
  //   _useThrottleFn();
  // }, 192);

  // setTimeout(function () {
  //   console.log("callCounts[0]----2222222", callCounts); //2
  // }, 254);

  // setTimeout(function () {
  //   console.log("callCounts[0]----333333333", callCounts); //2
  // }, 384);

  setTimeout(_useDebounceFn, 190);
  setTimeout(_useDebounceFn, 200);
  setTimeout(_useDebounceFn, 210);

  setTimeout(function () {
    console.log("callCounts[0]----_useDebounceFn", callCounts);
  }, 500);
});

// _debounce.cancel;