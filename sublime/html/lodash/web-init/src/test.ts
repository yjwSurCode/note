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
import debounced from "./debounce";
import _ from "lodash"; //npm i --save-dev @types/lodash

// debounce(
//   () => {
//     console.log("触发-debounce");
//   },
//   1000,
//   {}
// );

// function a() {
//   debounce(
//     () => {
//       console.log("触发-debounce");
//     },
//     1000,
//     {}
//   );
// }

// a();

const _debounced = debounced(
  () => {
    console.log("触发-debounce");
    // _debounced.cancel;
  },
  2000,
  { leading: true }
);

const _useDebounceFn = useDebounceFn(
  () => {
    console.log("触发-useDebounceFn");
  },
  1000,
  { leading: true }
);

window.addEventListener("click", () => {
  console.log("用户点击");
  // _debounced();
  _useDebounceFn();
  // _.debounce(
  //   () => {
  //     console.log("触发-lodash-debounce");
  //   },
  //   2000,
  //   { leading: true }
  // )();
});

// _debounce.cancel;
