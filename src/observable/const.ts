

interface TargetStack{
  [index: number]: any;
  /** 当前正在收集依赖 */
  target?: string;  
}


/**
 * 调用堆栈
 * - 存放当前正在收集依赖的 watcher 依赖集合数组
 */
export const targetStack: TargetStack = [];


export function targetCollection() {
  
}