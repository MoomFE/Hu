import each from "../../../shared/util/each";

let uid = 0;

/**
 * 调用堆栈
 * - 存放当前正在计算依赖的方法的 deps 依赖集合数组
 * - [ deps, deps, ... ]
 */
export const targetStack = [];

/**
 * 依赖集合
 * - 存放所有已收集到的依赖
 * - { id: deps, ... }
 */
export const dependentsMap = {};

/**
 * 为传入方法收集依赖
 */
export function createCollectingDependents( fn ){
  // 当前方法收集依赖的 ID, 用于从 watcherMap ( 存储 / 读取 ) 依赖项
  const id = uid++;

  return function collectingDependents(){
    // 对之前收集的依赖进行清空
    cleanDependents( id );

    // 当前方法的依赖存储
    const deps = [];

    // 将当前方法存进 deps 中
    // 当其中一个依赖更新后, 会调用当前方法重新计算依赖
    deps.fn = collectingDependents;

    // 开始收集依赖
    targetStack.push( deps );

    // 执行方法
    // 方法执行的过程中触发响应对象的 getter 而将依赖存储进 deps
    const result = fn();

    // 方法执行完成, 则依赖收集完成
    targetStack.pop();

    // 存储当前方法的依赖
    // 可以在下次收集依赖的时候对这次收集的依赖进行清空
    dependentsMap[ id ] = deps;

    return result;
  };
}

function cleanDependents( id ){
  const deps = dependentsMap[ id ];

  deps && deps.forEach(fn => fn());
}