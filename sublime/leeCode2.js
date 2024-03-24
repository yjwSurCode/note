/* 斐波那契数列：递归 */
function fib(n) {
  // 终止条件 f(1) = 0, f(2) = 1
  if (n === 1 || n === 2) return n - 1;
  // 递归调用 f(n) = f(n-1) + f(n-2)
  const res = fib(n - 1) + fib(n - 2);
  // console.log(res,'res')
  // 返回结果 f(n)
  return fib(n - 1) + fib(n - 2);
}

console.log(fib(10), 'fib(123)');

function BinarySearchTree(keys) {
  //Node 构造函数
  let Node = function (key) {
    this.key = key;
    this.left = null;
    this.right = null;
  };

  let root = null;

  let insertNode = (node, newNode) => {
    console.log(
      node,
      newNode,
      'insertNode------node, newNode',
      newNode.key,
      node.key
    );
    if (newNode.key < node.key) {
      if (node.left === null) {
        node.left = newNode;
        console.log(node, 'node--left');
      } else {
        insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        insertNode(node.right, newNode);
      }
    }
  };

  this.insert = (key) => {
    let newNode = new Node(key);
    console.log('newNode', newNode);
    if (root === null) {
      root = newNode;
    } else {
      insertNode(root, newNode);
    }
  };
  keys.forEach((key) => {
    console.log('KEY', key);
    this.insert(key);
  });
  return root;
}
const keys = ['1', '3', '5', '4', '2'];
BinarySearchTree(keys);

console.log(BinarySearchTree(keys), 'root');
