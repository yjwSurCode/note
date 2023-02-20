/** 树节点 */
export interface TreeNode<T, ID = string> {
  /** 节点主键 */
  id: ID;
  /** 节点父键 */
  pid: ID | null;
  /** 父节点 */
  parent?: TreeNode<T, ID>;
  /** 节点属性 */
  attrs?: T;
  /** 子孙节点 */
  children?: Array<TreeNode<T, ID>>;
}

type Compare<T> = (value: TreeQueryNode<T>) => boolean;

type TreeQueryNode<T> = T & {
  children?: TreeQueryNode<T>[];
};

export class TreeQuery<T> {
  constructor(private tree: Array<TreeQueryNode<T>> = []) {}

  searchNodesByDepth(predicate: Compare<T>): Array<TreeQueryNode<T>> {
    return this.searchBy(predicate, "depth");
  }

  findNodeByDepth(predicate: Compare<T>): TreeQueryNode<T> | undefined {
    return this.findBy(predicate, "depth");
  }

  searchNodesByBreadth(predicate: Compare<T>): Array<TreeQueryNode<T>> {
    return this.searchBy(predicate, "breadth");
  }

  findNodeByBreadth(predicate: Compare<T>): TreeQueryNode<T> | undefined {
    return this.findBy(predicate, "breadth");
  }

  traversalByDepth(predicate: (node: TreeQueryNode<T>) => void) {
    return this._traversalByDepth((node) => {
      predicate(node);
      return false;
    }, this.tree);
  }

  traversalByBreadth(predicate: (node: TreeQueryNode<T>) => void) {
    return this._traversalByBreadth((node) => {
      predicate(node);
      return false;
    }, this.tree);
  }

  private _traversalByDepth(
    predicate: Compare<T>,
    tree?: Array<TreeQueryNode<T>>
  ): boolean {
    for (const node of tree || []) {
      const res = node.children
        ? this._traversalByDepth(predicate, node.children)
        : false;

      if (res) {
        return true;
      }

      if (predicate(node)) {
        return true;
      }
    }

    return false;
  }

  private _traversalByBreadth(
    predicate: Compare<T>,
    tree?: Array<TreeQueryNode<T>>
  ): boolean {
    for (const node of tree || []) {
      if (predicate(node)) {
        return true;
      }
    }

    for (const node of tree || []) {
      const res = node.children
        ? this._traversalByBreadth(predicate, node.children)
        : false;

      if (res) {
        return true;
      }
    }

    return false;
  }

  private searchBy(
    _predicate: Compare<T>,
    type: "depth" | "breadth"
  ): Array<TreeQueryNode<T>> {
    const output: Array<TreeQueryNode<T>> = [];

    const predicate: Compare<T> = (node) => {
      if (_predicate(node)) {
        output.push(node);
      }

      return false;
    };

    if (type === "breadth") {
      this._traversalByBreadth(predicate, this.tree);
    } else {
      this._traversalByDepth(predicate, this.tree);
    }

    return output;
  }

  private findBy(
    _predicate: Compare<T>,
    type: "depth" | "breadth"
  ): TreeQueryNode<T> | undefined {
    let output: TreeQueryNode<T> | undefined;

    const predicate: Compare<T> = (node) => {
      if (_predicate(node)) {
        output = node;
        return true;
      }

      return false;
    };

    if (type === "breadth") {
      this._traversalByBreadth(predicate, this.tree);
    } else {
      this._traversalByDepth(predicate, this.tree);
    }

    return output;
  }
}

export function sortTree<T>(
  tree: Array<TreeQueryNode<T>> = [],
  compareFn?: (a: TreeQueryNode<T>, b: TreeQueryNode<T>) => number
): void {
  for (const node of tree) {
    sortTree(node.children, compareFn);
  }

  tree.sort(compareFn);
}

export function buildTreeFromList<T, PK>(
  array: T[] = [],
  options: {
    idField?: string;
    pidField?: string;
  } = {}
): Array<TreeNode<T, PK>> {
  const idField = options.idField || "id";
  const pidField = options.pidField || "pid";

  const treeData: Array<TreeNode<T, PK>> = [];
  const tmpMap: any = {};
  const list: any = [...array];

  for (const node of list) {
    tmpMap[node[idField]] = {
      id: node[idField],
      pid: node[pidField],
      attrs: node,
    };
  }

  for (const attrs of list) {
    const id = attrs[idField];
    const currentNode = tmpMap[id];
    const pid = attrs[pidField];
    const parentNode = tmpMap[pid];

    // 设置父节点
    currentNode.parent = parentNode;

    // 子孙节点
    if (id !== pid && parentNode) {
      if (!parentNode.children) {
        parentNode.children = [];
      }

      parentNode.children.push(currentNode);
      // 顶层节点
    } else {
      treeData.push(currentNode);
    }
  }

  return treeData;
}

export function formatTreeFromList<T>(
  array: any[] = [],
  options: {
    idField?: string;
    pidField?: string;
    parentField?: string;
  } = {}
): T[] {
  const idField = options.idField || "id";
  const pidField = options.pidField || "pid";
  const parentField = options.parentField || "parent";

  const treeData: T[] = [];
  const tmpMap: any = {};
  const list: any = [...array];

  for (const item of list) {
    tmpMap[item[idField]] = {
      ...item,
      id: item[idField],
      pid: item[pidField],
    };
  }

  for (const item of list) {
    const id = item[idField];
    const pid = item[pidField];
    const current = tmpMap[id];
    const parent = tmpMap[pid];

    // 设置父节点
    current[parentField] = parent;

    // 子孙节点
    if (id !== pid && parent) {
      if (!parent.children) {
        parent.children = [];
      }

      parent.children.push(current);
      // 顶层节点
    } else {
      treeData.push(current);
    }
  }

  return treeData;
}

export function treeHasCycle<ID extends number | string = string>(
  id: ID,
  tree: Map<ID, ID>
): boolean {
  let slow: ID | undefined = id;
  let fast: ID | undefined = id;

  while (true) {
    slow = tree.get(slow == null ? id : slow);

    if (slow == null) {
      return false;
    }

    fast = tree.get(fast == null ? id : fast);
    fast = fast != null ? tree.get(fast) : undefined;

    if (fast == null) {
      return false;
    }

    if (slow === fast) {
      return true;
    }
  }
}

function ArraytoTree(data: Array<TreeNode<"id", number>>) {
  let result: Array<TreeNode<any, any>> = [];
  let obj: any = { id: 1, pid: null };
  data.forEach((item) => {
    obj[item.id] = Object.assign(item, obj[item.id] || {});
    if (item.pid) {
      let parent = obj[item.pid] || {};
      parent.child = parent.child || [];
      parent.child.push(item);
      obj[item.pid] = parent;
    } else {
      result.push(obj[item.id]);
    }
  });
  return result;
}
console.log(
  ArraytoTree([
    { id: 4, pid: 3 },
    { id: 1, pid: null },
    { id: 2, pid: null },
    { id: 3, pid: 1 },
    { id: 5, pid: 1 },
    { id: 6, pid: 3 },
    { id: 7, pid: 2 },
    { id: 9, pid: 2 },
    { id: 10, pid: 7 },
  ])
);
