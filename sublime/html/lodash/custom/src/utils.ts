/** Detect free variable `global` from Node.js. */
const freeGlobal =
  typeof global === "object" &&
  global !== null &&
  global.Object === Object &&
  global;

/** Detect free variable `globalThis` */
const freeGlobalThis =
  typeof globalThis === "object" &&
  globalThis !== null &&
  globalThis.Object == Object &&
  globalThis;

const self: any = "";

const freeSelf =
  typeof self === "object" && self !== null && self.Object === Object && self;

/** Used as a reference to the global object. */
const root =
  freeGlobalThis || freeGlobal || freeSelf || Function("return this")();

export default root
