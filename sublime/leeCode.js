// ! 1:有效括号 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
var isValid = function (s) {
    s = s.split('');
    let sl = s.length;
    if (sl % 2) return false;
    let map = new Map([['(', ')'], ['[', ']'], ['{', '}']]);
    let stack = [];

    for (let i of s) {  // map.get(i) 找到与之对应的值
        if (!map.get(i)) {
            console.log('2222222', stack, stack[stack.length - 1], map.get(i))
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
    console.log(root.left, '11111')
    let fun = (r1, r2) => {
        if (r1 === r2) return true;
        if (r1 && r2 && r1.val === r2.val) {
            return fun(r1.left, r2.right) && fun(r1.right, r2.left);
        }
        return false;
    }
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
    let obj = {}  // obj[1]===Array [ 1 ] 
    return arr.reduce((pre, cur) => {
        if (!obj[cur.id]) { // obj没有cur的id则放入数组
            return obj[cur.id] = true && [...pre, cur]   // { 1: true } =====》 { 1: [ { id: 1 } ] }
        } else {
            return pre
        }
    }, [])


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
    console.log(head.next)
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
    return arr.reduce(({ sum, max }, cur) => {
        console.log({ sum, max }, cur)
        sum = Math.max(sum + cur, cur); //1 3  0 5
        max = Math.max(sum, max); //1  3   3 
        console.log(max, 'max')
        return { sum, max };
    }, { sum: 0, max: -Infinity }).max;   // {0,5}.max

};

if (val.value) {
    console.log(1111111111111)
    if (!opt.data.imgUrl.split("=")[1]) {
        console.log(1111111111111)
        const newUrl = opt.data.imgUrl.split("=");
        newUrl[1] = val.value;
    }
}





// console.log(isValid('{[]}'), 'RESULT')

// console.log(isSymmetric([1, 2, 3, 4, 4, 4, 4]), 'RESULT')

// console.log(removeDuplicates([1, 2, 2, 2, 2, 3, 4, 4, 4, 4, 5, 5555, 66, 66, 66]), 'RESULT')
// console.log(removeDuplicates([{ id: 1 }, { id: 1 }, { id: 2 }, { id: 5 }, { id: 3 }, { id: 5 }]), 'removeDuplicates')

// console.log(isPalindrome([1, 2, 2, 3]), 'isPalindrome')

console.log(maxSubArray([1, 2, -3, 5, -5]), 'maxSubArray')







// !简单类型题目
// 1: 存在重复元素 (给你一个整数数组 arr 。如果任一值在数组中出现 至少两次 ，返回 true ；如果数组中每个元素互不相同，返回 false )
var containsDuplicate = function (arr) {
    const result = arr.filter((item, index) => arr.indexOf(item) !== index)
    return result.length === 0 ? false : true
};

//2 爬楼梯（一次爬一阶或二阶）   F(N)=F(N-1)+F(N-2)
var climbStairs = function (n) {
    if (n === 1) return 1
    if (n === 2) return 2
    let numOfWay = []
    numOfWay[0] = 1, numOfWay[1] = 1, numOfWay[2] = 2;
    for (let i = 3; i <= n; i++) {
        numOfWay[i] = numOfWay[i - 1] + numOfWay[i - 2]
    }
    console.log(numOfWay)
    return numOfWay[n];
};

// 3：统计字符串中每个字符出现的字数
var isAnagram = function (s) {
    const obj = {}
    s.split('').filter((item, index) => {
        console.log(Object.keys(obj), '11111')
        if (!Object.keys(obj).includes(item)) {
            obj[item] = 1
        } else {
            console.log(obj[item], '22222')
            obj[item] = obj[item] + 1
        }
    })
    return obj
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
            console.log(fast, slow, 'fast', nums);  //0 1 3  5    0 1 2 3
            [nums[fast], nums[slow]] = [nums[slow], nums[fast]];  //交换数组对应的值
            slow++;
        }

        fast++;
    }
    return nums

};

// console.log(climbStairs(4), 'climbStairs')

// console.log(containsDuplicate([11, 2, 3, 4]), 'containsDuplicate')

// console.log(isAnagram('aaabbbcbcdcdc'), 'isAnagram')

console.log(moveZeroes([1, 2, 0, 3, 0, 5, 0]), 'moveZeroes') //moveZeroes([0, 1, 3, 5, 0, 7, 9, 00, 0, 11, 13, 0, 15, 0, 0])
