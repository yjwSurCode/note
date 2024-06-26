var a;
console.log(a);
a = 1;

return;

function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map().set('yes', true).set('no', false);

console.log(strMapToObj(myMap), 'strMapToObj(myMap)', strMapToObj(myMap).yes);

return;

const s = new Set();
[2, 3, 5, 4, 5, 2, 2].forEach((x) => s.add(x));
console.log(s, 's', [...s]);

return;
Promise.retry = function (promiseFn, times = 3) {
  return new Promise(async (resolve, reject) => {
    while (times--) {
      try {
        console.log('try1');
        var ret = await promiseFn();
        console.log('try2');
        resolve(ret);
        break;
      } catch (error) {
        if (!times) reject(error);
      }
    }
  });
};

function getProm() {
  console.log('123');
  const n = Math.random();
  return new Promise((resolve, reject) => {
    // resolve(n);
    // 判断接口是否成功
    setTimeout(() => (n > 0.9 ? resolve(n) : reject(n)), 100);
  });
}

Promise.retry(getProm).then((e) => {
  console.log('try3', e);
});

return;

var combine = function (n, k) {
  let res = [];
  let path = [];
  function backtracking(n, k, startIndex) {
    if (path.length == k) {
      res.push([...path]);
      return;
    }
    //i <= n - (k - path.length) + 1为剪枝操作
    // 如果n=4,k=4，那么从元素2开始的遍历都没有意义。所以在每层遍历时可以进行剪枝操作。还需要添加的元素个数是k-path.length，因此最多从index为n - (k - path.length) + 1处开始遍历，剩余的元素才够添加
    // n - (k - path.length) + 1    ----- 2
    console.log(n - (k - path.length), '1111');
    for (let i = startIndex; i <= n - (k - path.length) + 1; i++) {
      path.push(i);
      backtracking(n, k, i + 1); // 2 3 4
      path.pop();
    }
  }
  // 默认从1开始
  backtracking(n, k, 1);
  return res;
};

console.log(combine(10, 2), 'combine');
return;
// ! 1:有效括号 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
var isValid = function (s) {
  s = s.split('');
  let sl = s.length;
  if (sl % 2) return false;
  let map = new Map([
    ['(', ')'],
    ['[', ']'],
    ['{', '}'],
  ]);
  let stack = [];

  for (let i of s) {
    // map.get(i) 找到与之对应的值
    if (!map.get(i)) {
      console.log('2222222', stack, stack[stack.length - 1], map.get(i));
      if (stack[stack.length - 1] === map.get(i)) return false;
      else stack.pop();
    } else {
      stack.push(i); //{
    }
  }
  return !stack.length;
};

// console.log(isValid('()[]{}'), 'RESULT')

// ! 2:判断是否对称二叉树  (迭代-递归)
var isSymmetric = function (root) {
  console.log(root.left, '11111');
  let fun = (r1, r2) => {
    if (r1 === r2) return true;
    if (r1 && r2 && r1.val === r2.val) {
      return fun(r1.left, r2.right) && fun(r1.right, r2.left);
    }
    return false;
  };
  return root ? fun(root.left, root.right) : true;
};

// var isSymmetric = function (root) {
//     if (!root) return true;
//     let stack = [root.left, root.right];
//     while (stack.length) {
//         let r1 = stack.pop();
//         let r2 = stack.pop();
//         if (r1 === r2) continue;
//         if (r1 && r2 && r1.val === r2.val) {
//             stack.push(r1.left, r2.right, r1.right, r2.left);
//         } else {
//             return false;
//         }
//     }
//     return true;
// };

// !3: 二叉搜索树的最近公共祖先
// 输入: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4 输出: 2 解释: 节点 2 和节点 4 的最近公共祖先是 2, 因为根据定义最近公共祖先节点可以为节点本身。
var lowestCommonAncestor = function (root, p, q) {
  class Node {
    constructor(data, left, right) {
      this.data = data;
      this.left = left;
      this.right = right;
      this.count = 1;
    }
  }
};

// ! 4：删除有序数组中的重复项
var removeDuplicates = function (arr) {
  //1 indexOf
  // return Array.prototype.filter.call(arr, (item, index) => arr.indexOf(item) === index)

  //2 ES6
  // Array.from(new Set(arr))

  //3 reduce
  // let newArr = []
  // return arr.reduce((prev, next, index, arr) => {
  //     console.log(prev, index, arr, next, '*****', newArr)
  //     return newArr.includes(next) ? newArr : newArr.push(next)
  // }, null)

  //4 根据id判断
  let obj = {}; // obj[1]===Array [ 1 ]
  return arr.reduce((pre, cur) => {
    if (!obj[cur.id]) {
      // obj没有cur的id则放入数组
      return (obj[cur.id] = true && [...pre, cur]); // { 1: true } =====》 { 1: [ { id: 1 } ] }
    } else {
      return pre;
    }
  }, []);

  //5 根据id判断
  // let map = new Map();
  // for (let item of arr) {
  //     if (!map.has(item.id)) {
  //         map.set(item.id, item);
  //     };
  // };
  // return [...map.values()];
};

// ! 5:回文链表
var isPalindrome = function (head) {
  let fast = head;
  let slow = head;
  let next;
  let pre = null;
  let newIndex;
  console.log(head.next);
  if (!head.next) return true;
  while (fast && fast.next) {
    fast = fast.next.next;
    next = slow.next;
    slow.next = pre;
    pre = slow;
    slow = next;
  }
  newIndex = pre;
  if (fast) {
    // 说明是奇数
    slow = slow.next;
  }
  while (newIndex) {
    if (newIndex.val != slow.val) return false;
    newIndex = newIndex.next;
    slow = slow.next;
  }
  return true;
};

// ! 6:最大子数组和(具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和) (正无穷（Infinity）和负无穷（-Infinity）)

var maxSubArray = function (arr) {
  return arr.reduce(
    ({ sum, max }, cur) => {
      console.log({ sum, max }, cur);
      sum = Math.max(sum + cur, cur); //1 3  0 5
      max = Math.max(sum, max); //1  3   3
      console.log(max, 'max');
      return { sum, max };
    },
    { sum: 0, max: -Infinity }
  ).max; // {0,5}.max
};

// if (val.value) {
//     console.log(1111111111111)
//     if (!opt.data.imgUrl.split("=")[1]) {
//         console.log(1111111111111)
//         const newUrl = opt.data.imgUrl.split("=");
//         newUrl[1] = val.value;
//     }
// }

// console.log(isValid('{[]}'), 'RESULT')

// console.log(isSymmetric([1, 2, 3, 4, 4, 4, 4]), 'RESULT')

// console.log(removeDuplicates([1, 2, 2, 2, 2, 3, 4, 4, 4, 4, 5, 5555, 66, 66, 66]), 'RESULT')
// console.log(removeDuplicates([{ id: 1 }, { id: 1 }, { id: 2 }, { id: 5 }, { id: 3 }, { id: 5 }]), 'removeDuplicates')

// console.log(isPalindrome([1, 2, 2, 3]), 'isPalindrome')

console.log(maxSubArray([1, 2, -3, 5, -5]), 'maxSubArray');

//! 7:求最大组合  [1,2,3]-------->[[1,2,3],[1,3,2],[2,3,1],....]

// 一共有 3*2*1

let func = (arr) => {
  let len = arr.length;
  let res = []; // 所有排列结果

  /**
   * @param tempArr：排列好的元素
   * @param leftArr：待排列元素
   */
  let arrange = (tempArr, leftArr) => {
    //每一次一个元素遍历玩
    if (tempArr.length === len) {
      res.push(tempArr);
    } else {
      leftArr.forEach((item, index) => {
        let temp = [].concat(leftArr); // 根据temp.splice(index, 1) 重置temp
        temp.splice(index, 1);
        // 第一次遍历 tempArr
        console.log('aa-tempArr.concat(item)', tempArr.concat(item), temp); //[1] [2,3]   [1,2] [3]
        arrange(tempArr.concat(item), temp); // 这里使用了递归
      });
    }
  };
  arrange([], arr);
  return res;
};

const com = (arr1 = '', arr2 = '') => {
  //1 2 ,2 3
  console.log(arr1, arr2, '(arr1, arr2');
  let index = 0;
  const res = [];
  // for (let a1 of arr1) {
  //     for (let a2 of arr2) {
  //         if (Array.isArray(a1)) {
  //             res[index++] = [...a1, a2]
  //         } else {
  //             res[index++] = [a1, a2]
  //         }
  //     }
  // }
  return res;
};

const _func = (arr) => {
  return arr.reduce((prev, current) => {
    console.log(prev, current, 'prev, current');
    return com(prev, current);
  });
};

_func([1, 2, 3]);
console.log(_func([1, 2, 3]), 'result');

// !8:简单类型题目
// 1: 存在重复元素 (给你一个整数数组 arr 。如果任一值在数组中出现 至少两次 ，返回 true ；如果数组中每个元素互不相同，返回 false )
var containsDuplicate = function (arr) {
  const result = arr.filter((item, index) => arr.indexOf(item) !== index);
  return result.length === 0 ? false : true;
};

//2 爬楼梯（一次爬一阶或二阶）   F(N)=F(N-1)+F(N-2)
var climbStairs = function (n) {
  if (n === 1) return 1;
  if (n === 2) return 2;
  let numOfWay = [];
  (numOfWay[0] = 1), (numOfWay[1] = 1), (numOfWay[2] = 2);
  for (let i = 3; i <= n; i++) {
    numOfWay[i] = numOfWay[i - 1] + numOfWay[i - 2];
  }
  console.log(numOfWay);
  return numOfWay[n];
};

// 3：统计字符串中每个字符出现的字数
var isAnagram = function (s) {
  const obj = {};
  s.split('').filter((item, index) => {
    console.log(Object.keys(obj), '11111');
    if (!Object.keys(obj).includes(item)) {
      obj[item] = 1;
    } else {
      console.log(obj[item], '22222');
      obj[item] = obj[item] + 1;
    }
  });
  return obj;
};

// 4:移动零(给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。)
var moveZeroes = function (nums) {
  // return nums.sort((a, b) => {
  //     console.log('1111', a, b)
  //     return b? 0: -1
  // })

  // 快指针指向的不等于0的元素都移动到慢指针的位置来
  let fast = 0, // 0 1
    slow = 0;
  while (fast < nums.length) {
    if (nums[fast] != 0) {
      // 0 0          1 1          3 2               5 3
      //[1,1]《=[1,1]  [2,2]《=[2,2]  [3,0]《=[0,3]
      console.log(fast, slow, 'fast', nums); //0 1 3  5    0 1 2 3
      [nums[fast], nums[slow]] = [nums[slow], nums[fast]]; //交换数组对应的值
      slow++;
    }

    fast++;
  }
  return nums;
};

// 5:解析url
var analysisUrl = function (nums) {
  nums = 'http://localhost:8080/?id=2&type=1&age=20&score=88&score=99'; // 模拟url 地址
  let urlIndex = nums.indexOf('?'); // 查看? 位置为多少  22
  // 截取字符串,urlIndex是从下标开始的,应此加一
  let str = nums.substr(urlIndex + 1, nums.toString().length);
  console.log('str', str); // 打印 id=2&type=1&age=20
  let strList = str.split('&'); // ['id=2', 'type=1', 'age=20']

  // let key = strList[i].split("=")[0]; // 如 id
  // let value = strList[i].split("=")[1]; // 如 2
  // obj[key] = value
};

// console.log(climbStairs(4), 'climbStairs')

// console.log(containsDuplicate([11, 2, 3, 4]), 'containsDuplicate')

// console.log(isAnagram('aaabbbcbcdcdc'), 'isAnagram')

console.log(moveZeroes([1, 2, 0, 3, 0, 5, 0]), 'moveZeroes'); //moveZeroes([0, 1, 3, 5, 0, 7, 9, 00, 0, 11, 13, 0, 15, 0, 0])

//#

// 不友好的写法----递归实现
function fibonacci(n) {
  if (n === 0 || n === 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 缺点：递归深度过大导致栈内存溢出

// 尾递归实现
const Fibonacci = (n, sum1 = 1, sum2 = 1) => {
  if (n <= 1) return sum2;
  return Fibonacci(n - 1, sum2, sum1 + sum2);
};

console.log(Fibonacci(100), 'Fibonacci(10)');

function fibonacci(n) {
  let cur = 0;
  let next = 1;
  for (let i = 0; i < n; i++) {
    [cur, next] = [next, cur + next];
  }
  return cur;
}

//! 9:简易版本promise
class SimplePromise {
  constructor(executor) {
    // executor执行器
    this.status = 'pending'; // 等待状态
    this.value = null; // 成功或失败的参数
    this.fulfilledCallbacks = []; // 成功的函数队列
    this.rejectedCallbacks = []; // 失败的函数队列
    const that = this;

    function resolve(value) {
      // 成功的方法
      if (that.status === 'pending') {
        that.status = 'resolved';
        that.value = value;
        that.fulfilledCallbacks.forEach((myFn) => myFn(that.value)); //执行回调方法
      }
    }

    function reject(value) {
      //失败的方法
      if (that.status === 'pending') {
        that.status = 'rejected';
        that.value = value;
        that.rejectedCallbacks.forEach((myFn) => myFn(that.value)); //执行回调方法
      }
    }

    //自执行
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  // 类方法
  then(onFulfilled, onRejected) {
    // 等待状态，添加回调函数到成功的函数队列
    if (this.status === 'pending') {
      this.fulfilledCallbacks.push(() => {
        onFulfilled(this.value);
      });
      // 等待状态，添加回调函数到失败的函数队列
      this.rejectedCallbacks.push(() => {
        onRejected(this.value);
      });
    }
    //成功状态
    if (this.status === 'resolved') {
      // 支持同步调用
      console.log('this', this);
      onFulfilled(this.value);
    }

    if (this.status === 'rejected') {
      // 支持同步调用
      onRejected(this.value);
    }
  }
}

// 测试
const a = new SimplePromise((resolve, reject) => {
  resolve('new');
});
a.then((a) => {
  console.log('a', a);
});

// const data = { value: '123386.7' }
const data = { value: '12345678.7' };
console.log(
  String(data.value)
    .substring(4)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  '000'
);

const res =
  (String(data.value).split('.')[0] || []).length > 7
    ? String(data.value)
        .split('.')[0]
        .substring(4)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '万'
    : String(data.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

console.log(res, 'res');

// https://github.com/tc39/proposal-decorators
// https://babeljs.io/docs/en/babel-plugin-proposal-decorators#options

// function addConcole(target) {
//     // 拓展原型方法
//     target.prototype.log = function (msg) {
//         console.log(`[${new Date()} ${msg}`);
//     };
//     // 拓展静态属性
//     target.myName = '一个类'
//     return target;
// }

// @addConcole
// class MyClass {
//     constructor() { }
// }

// const myObj = new MyClass();
// myObj.log('林三心');
// // [Sat Jul 08 2023 17:31:55 GMT+0800 (中国标准时间) 林三心
// console.log(MyClass.myName)
// // 一个类

// function testable(isTestable) {
//     return function (target) {
//         target.isTestable = isTestable;
//     }
// }

// @testable(true)
// class MyTestableClass { }
// MyTestableClass.isTestable // true

// @testable(false)
// class MyClass { }
// MyClass.isTestable // false

function InsertSort(arr, len) {
  // 检查数据合法性
  if (arr == null || len <= 0) {
    return;
  }
  for (let i = 1; i < len; i++) {
    const tmp = arr[i];
    let j;
    for (j = i - 1; j >= 0; j--) {
      //如果比tmp大把值往后移动一位
      if (arr[j] > tmp) {
        arr[j + 1] = arr[j];
      } else {
        break;
      }
    }
    arr[j + 1] = tmp;
  }
}
const arrayList = [123, 12312, 123, 123, 12321393, 231, 123, 123, 3, 2, 1];
console.log('9999', InsertSort(arrayList, arrayList.length));

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
  }

  return arr;
}

const sortedArray = insertionSort(arrayList);

console.log(insertionSort(arrayList), '0000');

//  function BinaryInsertSort(arr,len){
//    const key, left, right, middle;
//     for (let i=1; i<len; i++)
//     {
//         key = a[i];
//         left = 0;
//         right = i-1;
//         while (left<=right)
//         {
//             middle = (left+right)/2;
//             if (a[middle]>key)
//                 right = middle-1;
//             else
//                 left = middle+1;
//         }

//         for(int j=i-1; j>=left; j--)
//         {
//             a[j+1] = a[j];
//         }

//         a[left] = key;
//     }
//  }

function test(n) {
  let res = 1; // 1次
  let i = 0; // 1次
  for (; i < n; i++) {
    // n+n=2n次
    res += i; // n次
  }
  return res; // 1次
}

function test(n) {
  let res = 1; // 1次
  let i = 0; // 1次
  for (; i < n; i++) {
    // n+n=2n次
    let J = 0; //1
    for (
      ;
      J < n;
      J++ // n^2+n^2=2n^2次
    )
      res = res + i * J; // n^2次
  }

  return res; // 1次
}

console.log(test(3), 'test');

// ! 10  判断两个数组是否完全相等
function areArraysContentEqual(arr1 = [], arr2 = []) {
  arr2 = [...arr2];
  //   console.log(arr2, 'arr2');
  if (arr1.length !== arr2.length) {
    return false;
  }

  const compare = (item1, item2) => {
    console.log(item1, item2, 'item1, item2');
    if (Number.isNaN(item1) && Number.isNaN(item2)) {
      return true;
    }
    return item1 === item2;
  };

  arr1.some((item) => {
    // 找到元素在第二个数组中的位置
    // eg: 第一个元素在第二个数组的位置是下标2  第二个元素在第二个数组的位置是下标1 第二个元素在第二个数组的位置是下标0
    const index = arr2.findIndex((item1) => compare(item, item1));
    console.log(index, 'index');
    // 找到就删除
    if (index !== -1) {
      arr2.splice(index, 1);
    }
    console.log(arr2, 'arr2');
  });
  return !arr2.length; //  [].length==false
}

console.log(test(3), 'test');

const fnPromiseAll = async () => {
  const aPromise = new Promise((resolve, reject) => {
    // 假设异步操作成功并返回 storesTab
    const storesTab = ['a', 'b', 'c'];
    setTimeout(() => {
      resolve({ storesTab });
    }, 2000);
  });

  const cPromise = new Promise((resolve, reject) => {
    // 假设异步操作成功并返回 storesTab
    const storesTab = ['x', 'y', 'z'];
    resolve({ storesTab });
  });

  // 使用 Promise.all 进行并行处理
  // const [{ storesTab = [] }] = await Promise.all([aPromise, cPromise]);

  const [{ storesTab = [] }] = [
    { storesTab: ['a', 'b', 'c'] },
    { storesTab: ['x', 'y', 'z'] },
  ];
  console.log(storesTab, 'storesTab');
  const res = await Promise.all([aPromise, cPromise]);
  console.log(res, 'res');
};

fnPromiseAll();

/* 斐波那契数列：递归 */
function fib(n) {
  // 终止条件 f(1) = 0, f(2) = 1
  if (n === 1 || n === 2) return n - 1;
  // 递归调用 f(n) = f(n-1) + f(n-2)
  // const res = fib(n - 1) + fib(n - 2);
  // 返回结果 f(n)
  return fib(n - 1) + fib(n - 2);
}

console.log(fib(123), 'fib(123)');

// # 循环引用
const isCyclic = (obj) => {
  // 使用Set数据类型来存储已经检测过的对象
  let stackSet = new Set();
  let detected = false;

  const detect = (obj) => {
    // 不是对象类型的话，可以直接跳过
    if (obj && typeof obj != 'object') {
      return;
    }
    // 当要检查的对象已经存在于stackSet中时，表示存在循环引用
    if (stackSet.has(obj)) {
      return (detected = true);
    }
    // 将当前obj存如stackSet
    stackSet.add(obj);

    for (let key in obj) {
      // 对obj下的属性进行挨个检测
      if (obj.hasOwnProperty(key)) {
        detect(obj[key]);
      }
    }
    // 平级检测完成之后，将当前对象删除，防止误判
    /*
      例如：对象的属性指向同一引用，如果不删除的话，会被认为是循环引用
      let tempObj = {
        name: '前端胖头鱼'
      }
      let obj4 = {
        obj1: tempObj,
        obj2: tempObj
      }
    */
    stackSet.delete(obj);
  };

  detect(obj);

  return detected;
};

// const filterData = (selectedPgSeq, selectedBusinessTypes, data) => {
//   return data.filter(item => {
//     const pgSeqMatch = selectedPgSeq.includes(item.pgSeq);
//     const businessTypeMatch = selectedBusinessTypes.includes(item.businessType);
//     return pgSeqMatch && businessTypeMatch;
//   });
// };

// // 示例使用
// const seqData = [
//   // ...你的对象数组
// ];

// const selectedPgSeq = [1]; // 单选华中区
// const selectedBusinessTypes = [1, 2]; // 多选大超和中超

// const filteredData = filterData(selectedPgSeq, selectedBusinessTypes, seqData);
// console.log(filteredData);

const filterData = (selectedPgSeq, selectedBusinessTypes, data) => {
  return data.filter((item) => {
    const pgSeqMatch = selectedPgSeq.includes(item.pgSeq);

    const businessTypeMatch =
      (selectedBusinessTypes.a && item.businessType === '1') ||
      (selectedBusinessTypes.b && item.businessType === '2') ||
      (selectedBusinessTypes.c && item.businessType === '3');

    return pgSeqMatch && businessTypeMatch;
  });
};

// 示例使用
const seqData = [
  {
    businessType: '1',
    pgSeq: '1',
  },
  {
    businessType: '2',
    pgSeq: '1',
  },
  {
    businessType: '3',
    pgSeq: '1',
  },
  {
    businessType: '1',
    pgSeq: '2',
  },
  {
    businessType: '2',
    pgSeq: '2',
  },
  {
    businessType: '3',
    pgSeq: '2',
  },
];

const selectedPgSeq = ['1']; // 单选华中区
const selectedBusinessTypes = { a: true, b: true, c: true }; // 多选大超和中超

const filteredData = filterData(selectedPgSeq, selectedBusinessTypes, seqData);
console.log(filteredData);
