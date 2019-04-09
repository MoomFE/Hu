/**
 * 调用堆栈
 * - 存放当前正在计算依赖的方法的 watcher 依赖集合数组
 * - [ watcher, watcher, ... ]
 */
export const targetStack = [];

export function pushTarget( target ){
  targetStack.push( target);
  targetStack.target = target;
}

export function popTarget(){
  targetStack.pop();
  targetStack.target = targetStack[ targetStack.length - 1 ];
}