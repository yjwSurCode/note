// function createArray(...elements) {
//   let target = [];
//   target.push(...elements);
//   console.log(target,'target',elements)
//   return new Proxy(target, {
//     get(target, propKey, receiver) {
//       console.log('111', target, propKey, receiver);
//       let index = Number(propKey);
//       if (index < 0) {
//         propKey = String(target.length + index);
//       }
//       return Reflect.get(target, propKey, receiver);
//     },
//   });
// }

// let arr = createArray('a', 'b', 'c');

// console.log(arr, 'arr');





const obj = { name: "张三", age: 18 };
const proxy = new Proxy(obj, {
    get(target, prop) {
      if (prop in target) {
        return Reflect.get(target, prop);
      } else {
        console.error("字段不存在")
        return undefined;
      }
    },
    set(target, propKey, value, receiver) {
      if (propKey === "age") {
        if (typeof value === "number") {
          return Reflect.set(target, propKey, value, receiver);
          // or
          // target[propKey] = value 
          // return true
        } else {
          console.error("年龄只能输入正整数");
          return false;
        }
      } else {
        return false;
      }
    }
});
proxy.age = 20;  
console.log(proxy.age);  // 20
proxy.age = "22";
console.log(proxy.age);  // 20
console.log(proxy.test); // undefined

