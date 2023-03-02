// ##TYPESCRIPT（ts）

// 新的基础类型 unknown 作为一个类型安全的 any 来使用。任何类型的值都可以赋给 unknown 类型，但是 unknown 类型的值只能赋给 unknown 本身和 any 类型。

// # 箭头函数 泛型写法：
const foo1 = <T>(x: T): T => x;

const foo2 = <T extends {}>(x: T): T => x;

const foo3 = <T extends Record<string, unknown>>(x: T): T => x;

const foo4: <T>(x: T) => T = (x) => x;

const identity1 = <T>(arg: T): T => {
  console.log(arg);
  return arg;
};

//接口iterface 和 类型别名type 的关联和区别：：：：：：：：：::::::::::::::::::::::::::::::::::::

//! 1：都可以描对象和函数
interface SetSister {
  name: string;
  (name: string, age: number): void;
}
//! 2： 都可以扩展 但是type是&   interface是extends
//! 3： interface扩展是不可以重复
//! 4: type可以并用两个接口, 而interface不可以并用接口

interface Admin {
  name: string;
  privileges?: string[];
}

interface Employee {
  name: string;
  startDate: Date;
}
type UnknownEmployee = Employee | Admin;

const eg1: UnknownEmployee = { name: "12" };

//implements与extends的区别：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：

//! extends 是继承一个新的接口或者类，从父类或者接口继承所有的属性和方法，不可以重写属性，但可以重写方法
//! implements 是对某个接口或者类型的实现继承，必须满足接口的类型规范。

//infer   ：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：

// promise 泛型
// Promise 是一种用于异步编程的类型，它接受两个泛型参数：第一个泛型参数表示 resolve 的类型，第二个泛型参数表示 reject 的类型。

export type Service<T, P extends any[]> = (...args: P) => Promise<T>;


// Promise.resolve({
//     prop1: "test",
//   });

// Promise<{ prop1: string; }>

const aa = <T extends {}>(arg: T): Promise<T> => {
  return Promise.resolve(arg);
};

//定义一个 promise函数
interface AxiosInstance {
  <T = any>(value: T): Promise<T>;
}

let instance: AxiosInstance = function <T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    resolve(value);
  });
};
instance(() => 10);
instance(10);


//! 11个技巧 https://juejin.cn/post/7184956275157893176

// 泛型（Generics）是允许同一个函数接受不同类型参数的一种模板：：：：：：：：：：：：：：：： 留给ts让其类型推断
//! T(Type) //表示类型；
//! K(Key) //表示对象中的键类型；
//! V(Value)//表示对象中的值类型；
//! E(Element) //：表示元素类型。
//! R 可以作为请求返回 request<R = any>(url: string): Promise<PerformanceResponseData<R>>

function identity<T, U>(value: T, message: U): T {
  console.log(message);
  return value;
}

identity<number, string>(68, "浩子哥");

function aname<T>(value: T): T {
  return value;
}
aname<number>(5555);

const bname = <T>(x: T): T => {
  return x;
};
bname<string>("55555");

// Record<string, unknown>  表示定义一个对象的写法 :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//!源码:
// type Record<K extends keyof any, T> = {
//     [P in K]: T;
// };

type User = { name: string; age: number };

const users: Record<string, User> = {
  "123": { name: "Alice", age: 20 },
  "456": { name: "Bob", age: 30 },
};

const cname = <T extends Record<string, unknown>>(x: T): T => x;
cname<{ "5": string }>({ "5": "6" });
console.log(cname<{ "5": string }>({ "5": "6" }));

const dname =
  <T1 extends Record<string, unknown>>(arg1: T1) =>
  <T2 extends Record<string, unknown>>(arg2: T2) => {
    return { arg1, arg2 };
  };

// 类型断言： <string>someValue =====  someValue as any

// keyof :::::::::::::::::::::::::::::::::::::::::::::::::::::::::

type Person = {
  id: number;
  name: string;
  age: number;
};

type P1 = keyof Person; //'id''name''age'
type P2 = Person[P1]; //number | string

// Partial  Partial<T> 的作用就是将某个类型或者接口里的属性全部变为可选项?   ::::::::::::::::::::::::::::::::::::::::::::
//!源码
/**
 * Make all properties in T optional
 */

// type Partial<T> = {
//     [P in keyof T]?: T[P];
// };

// p in xx 又是什么意思呢？  in的意思就是遍历，如上就是将 类型string进行遍历，也就是string 每个属性都是传入的T类型，如 string: PersonModel

const a: Partial<{ a: string; b: string }> = { a: "1" };

// Required 、 Readonly、 Pick 、 Exclude 、 Extract 、 Omit

//Required 生成一个新类型，该类型与 T 拥有相同的属性，但是所有属性皆为必选项 ::::::::::::::::::::::::::::::::::::::::::::::::::::

// type Required<T> = {
//     [P in keyof T]-?: T[P];
// };

interface Foo {
  a: string;
  b?: number;
}
const ename: Required<Foo> = { a: "1", b: 2 };

//Pick 生成一个新类型，该类型拥有 T 中的 K 属性集 ; 新类型相当于T与K的交集 :::::::::::::::::::::::::::::::::::::::::::::

// type Pick<T, K extends keyof T> = {
//     [P in K]: T[P];
// };

interface Foo1 {
  a: string;
  b: number;
  c: boolean;
}

interface Foo2 {
  a: string;
  c: number;
}

interface Foo3 {
  e: string;
  f: number;
}

const f: Pick<Foo1, "a"> = { a: "1" };

// Exclude  如果 T 是 U 的子类型则返回 never 不是则返回 T   前提是子集  :::::::::::::::::::::::::::::::::::::

// type Exclude<T, U> = T extends U ? never : T;

const g: Exclude<Foo1, Foo2> = { b: 1, a: "1", c: true };

// Extract  和 Exclude 相反：：：：：：：

// type Extract<T, U> = T extends U ? T : never;

/**
 * Omit  生成一个新类型，该类型拥有 T 中除了 K 属性以外的所有属性 ：：：：：：：：：：：：：：：：：：：：：：：：：：：：：
 */

// type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

const h: Omit<Foo1, "a"> = { b: 1, c: true };

// Parameters  获取元组中函数类型的参数 :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

function fun1(x: number, y: number, z: number) {
  console.log(x, y, z);
  return { x, y, z };
}

type p3 = Parameters<typeof fun1>; // [x: number, y: number, z: number]

// ReturnType 获取函数类型的返回类型::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

type p4 = ReturnType<typeof fun1>;

// NonNullable 用于将类型中的null，undefined属性移除掉。：：：：：：：：：：：：：：：：：：：：：：：

// type NonNullable<T> = T extends null ? never : T

type stringType = NonNullable<string | undefined | null>;
const p5: stringType = "5";
// const p6: stringType = undefined; //报错

// InstanceType  常用于 获取某个子组件组件实例对应类型

// type InstanceType<T extends abstract new (...args: any) => any> =
//   T extends abstract new (...args: any) => infer R ? R : any;

class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>;

//! 栗子1

type CurrentAuthorityType = { a: 1 };

const renderAuthorize =
  <T>(Authorized: T): ((currentAuthority: CurrentAuthorityType) => T) =>
  (currentAuthority: CurrentAuthorityType): T => {
    return Authorized;
  };

renderAuthorize(() => {
  a: 1;
});

console.log(
  renderAuthorize(() => {
    a: 1;
  })
);

//! 栗子2  请求 FETCH

export interface PageRows<T> {
  /** 分页数组 */
  rows: T[];
  /** 总大小 */
  count: number;
}
interface CaseRecord {
  id?: number;
}

class CaseService {
  async getCaseList(query: { id: number }): Promise<PageRows<CaseRecord>> {
    //! 1111111
    const { body } = await (PERFORMANCE_API as any).request(
      "/rest/specialProject/info",
      {
        method: "post",
        payload: query,
      }
    );

    return {
      count: body?.total,
      rows: body?.list || [],
    };
  }
}

class PerformanceAPI {
  //! 2222222 预定义R
  async request<R = any>(
    url: string
    // options?: FetchOptions
  ): Promise<PerformanceResponseData<R>> {
    const { data } = await this.client.request(url, options || {});
    return data;
  }
}
export const PERFORMANCE_API = new PerformanceAPI();

//! 333333333333  函数的返回值是一个Promise<PerformanceResponseData<R>>   里面的body是R
export interface PerformanceResponseData<T = any> {
  code: string;
  msg?: string;
  body: T;
}
