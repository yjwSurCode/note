// import dateFormat from "./dateFormat";
// import obtainTime from "./obtainTime";
// import intervalTime from "./intervalTime";
// import BinarySearch from "./BinarySearch";
// import randomString from "./randomString";

// import { classnames, createBEM } from "./classnames";

// import { Dictionary, Res } from "./interface/index";
// import { okRes, errRes } from "./interface/res";
// import { ArtisanException } from "./interface/error";

// /** 函数 */
// export {
//   dateFormat,
//   obtainTime,
//   intervalTime,
//   BinarySearch,
//   randomString,
//   classnames,
//   createBEM,
// };

// /** 类型 */
// export { Dictionary, Res, ArtisanException, okRes, errRes };

export * from './dateFormat';
export * from './obtainTime';
export * from './intervalTime';
export * from './BinarySearch';

// 防抖 节流
// export * from './debounce-throttle';

export * from './classnames';

export * from './interface/index';
export * from './interface/res';
export * from './interface/error';

// # 获取一个永不重复的ID：
export function GenNonDuplicateID() {
  let str: string = '';
  str = Math.random().toString(36).substr(3);
  str += Date.now().toString(16).substr(4);
  return str;
}
