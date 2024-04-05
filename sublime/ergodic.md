#!!! 前端遍历合集
https://github.com/dg92/Performance-Analysis-JS

1：for
for (let i = 0; i < 10; i++) {
continue // 后面的语句不执行，进入下一次 // continue 一般配合判断条件使用
break // 跳出当前循环 // 一般配合判断语句使用
return 当程序运行到 return; 语句时，会终止循环，结束当前方法。
}

2： for( ...in )
for (let key in {a:1, b:2, c:3}) {
console.log(key); /a b c
}

3： for( ...of )
for (let value of [1,2,3]) {
console.log(value); /1 2 3
}

配合使用 Object.keys({a:1,b:2}) //[a,b]
for(var key of Object.keys({a:1, b:2, c:3})){
console.log(key); // a b
}

4： while
var n = 0;
var x = 0;
while (n < 3) {
n++;
x += n;
}
console.log(n,x);//3 6

4.1：do-while
var i = 0;
do {
i += 1;
result += i + ' ';
} while (i < 5); 1 2 3 4 5

5： switch case
const expr = 'Mangoes';
switch (expr) {
case 'Oranges':
console.log('Oranges are $0.59 a pound.');
break;
case 'Mangoes':
case 'Papayas1':
console.log('Mangoes and papayas are $2.79 a pound.');
// expected output: "Mangoes and papayas are $2.79 a pound."
break;
default:
console.log(`Sorry, we are out of ${expr}.`);
}

6：forEach()
遍历数组全部元素，利用回调函数对数组进行操作，自动遍历数组.length 次。无法 break 中途跳出循环 不可控
forEach 删除自身元素 index 不会被重置
arr.forEach((item, index) => {
arr.splice(index, 1);
}); 当 index=0,时 进入删除,然后进入下一次遍历 index=1,而此时 index=1 的项是第三项

forEach 删除自身元素 index 不会被重置 解决方案
[...arr].forEach((item, index) => {
arr.splice(index, 1);
console.log(1);
});

7：map()
创建新数组 不改变原数组 输出的是 return 什么就输出什么 新数组
map 生成的新数组元素是可自定义。与 filter 相反
回调函数参数,item(数组元素)、index(序列)、arr(数组本身)

8：find()
和 filter 相似 输出的是一旦判断为 true 则跳出循环输出符合条件的数组元素

9：some()
判断出一个符合条件则跳出循环并输出 true

10：every()
判断出一个符合条件则跳出循环并输出 true

11：filter
创建新数组 不改变原数组 输出的是 判断为 true 的数组元素 组成的新数组
filter 生成的新数组元素不可自定义，与对应原数组元素一致。
回调函数参数，item(数组元素)、index(序列)、arr(数组本身)
arr.filter(function(item,index){ return item>2&&item<5 })

12：findIndex 和 find 一样 只是返回的是索引

13：reduce (万物皆可 reduce)
创建新数组 不改变原数组 输出的是 return 叠加什么就输出什么 新数组
pre(第一次为数组第一项，之后为上一操作的结果)
next(数组的下一项)
index(next 项的序列)
arr(数组本身)
回调函数后的改变第一项参数。（不影响原数组）

arr=[1,2,3,4]
var sum = arr.reduce(function(prev, cur, index, arr) {
console.log(prev, cur, index);
return prev + cur;
})
1 2 1
3 3 2
6 4 3

arr=[1,2,3,4]
var sum = arr.reduce(function(prev, cur, index, arr) {
console.log(prev, cur, index);
return prev + cur;
}，0)
0 1 0
1 2 1
3 3 2
6 4 3

数组为空 报错 (设置了初始值就不会报错)

# reduce 实现 map：

const arr = [{name:'Amy', age: 10}, {name:'Bob', age: 20}]
// map 用法
arr.map(item => item.name) // ["Amy", "Bob"]

// 利用扩展运算符 与默认参数
arr.reduce((total, value) => [...total, value.name], [])
// ["Amy", "Bob"]

# reduce 实现 filter

const arr = [{name:'Amy'}, {name:'Bob'}]
// filter 用法
arr.filter(item => item.name === 'Amy') // [{name: "Amy"}]

// 利用三元表达式、如果是真扩展的方式返回、如果是假不处理返回原来的值
arr.reduce((total, value) => value.name === 'Amy' ? [...total, value] : total, [])

# reduce 实现 flat

ES2019 引入了扁平化数组的新方法 flat()
const nested = [ ['📦', '📦'], ['📦']];
const flattened = nested.flat();
console.log(flattened);
// ['📦', '📦', '📦']

var arr = [1, 2, 3, 4, [1, 2, 3, 4, 5, [2, 3, 4]]]
function arrFlat(arr, depth = 1) {
return depth
? arr.reduce((total, currentValue) => {
return Array.isArray(currentValue) ? [...total, ...arrFlat(currentValue, depth - 1)] : [...total, currentValue]
}, [])
: arr
}
arrFlat(arr, 2)

拓展 判断数组的深度

function deepLevel(flatArr) {
if (!Array.isArray(flatArr)) {
return 0;
}
let result = 1;
for (let i = 0; i < flatArr.length; i++) {
if (Array.isArray(flatArr[i])) {
result += deepLevel(flatArr[i]);
}
}
return result;
}

(1）计算数组中每个元素出现的次数

let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];

let nameNum = names.reduce((pre,cur)=>{
if(cur in pre){
pre[cur]++
}else{
pre[cur] = 1
}
return pre
},{})
console.log(nameNum); //{Alice: 2, Bob: 1, Tiff: 1, Bruce: 1}

（2）数组去重
Array.from(new Set(arr))

let arr = [1,2,3,4,4,1]
let newArr = arr.reduce((pre,cur)=>{
if(!pre.includes(cur)){
return pre.concat(cur)
}else{
return pre
}
},[])
console.log(newArr);// [1, 2, 3, 4]

（3）将二维数组转化为一维
let arr = [[0, 1], [2, 3], [4, 5]]
let newArr = arr.reduce((pre,cur)=>{
return pre.concat(cur)
},[])
console.log(newArr); // [0, 1, 2, 3, 4, 5]

（3）将多维数组转化为一维
let arr = [[0, 1], [2, 3], [4,[5,6,7]]]
const newArr = function(arr){
return arr.reduce((pre,cur)=>pre.concat(Array.isArray(cur)?newArr(cur):cur),[])
}
console.log(newArr(arr)); //[0, 1, 2, 3, 4, 5, 6, 7]

（4）对象里的属性求和
var result = [
{
subject: 'math',
score: 10
},
{
subject: 'chinese',
score: 20
},
{
subject: 'english',
score: 30
}
];

var sum = result.reduce(function(prev, cur) {
return cur.score + prev;
}, 0);
console.log(sum) //60

# slice

对数组：实现浅拷贝数组与截取数组,返回的是截取拷贝后的新数组,原数组不会改变
      arr.slice(起始下标,结束下标) 没有结束下标就默认到最后 包括起始下标，不包括结束下标

对字符串：还可以提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串。
        str.slice(a,b) 截取(a,b) 包含a不包含b的字符串

# splice
        只对实现数组的删除/截取/替换/添加,返回的是被删除/截取/替换的原数组的数据,同时原数组会被改变
        arr2.splice(下标索引值(包含),截取个数,添加的值)
        let arr2 = ['first', 'second', 'third', 'forth', 'fifth']
        let spliceArr3 = arr2.splice(2, 1, 'in', 'in2') 
        console.log(arr2);//['first', 'second', 'in', 'in2', 'forth', 'fifth']
        console.log(spliceArr3); // 这是被删除的下标为2的数 [ 'third']

<!-- 拓展 -->

数组去重
Array.from(new Set(arr))

function unique(arr) {
if (!Array.isArray(arr)) {
console.log('type error!')
return
}
var array = [];
for (var i = 0; i < arr.length; i++) {
if (array .indexOf(arr[i]) === -1) {
array .push(arr[i])
}
}
return array;
}

const arr = [{ id: 1 }, { id: 2 }, { id: 1 }];
// const arr = [1, 2, 3, 4, 1, 2, 3];
let newArr = arr.reduce((pre, cur) => {
// 检查累加器中是否已存在具有相同 id 的对象
const existingObject = pre.find((obj) => obj.id === cur.id);
// 如果不存在，则将当前对象添加到累加器中
if (!existingObject) {
pre.push(cur);
}
return pre;

// if (!pre.includes(cur)) {
// return pre.concat(cur);
// } else {
// return pre;
// }
}, []);
console.log(newArr);
