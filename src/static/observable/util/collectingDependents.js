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
export function collectingDependents( fn ){
  // 当前方法收集依赖的 ID, 用于从 watcherMap ( 存储 / 读取 ) 依赖项
  const id = uid++;

  return function anonymous(){
    // 对之前收集的依赖进行清空
    cleanDependents( id );

    // 当前方法的依赖存储
    const deps = [];

    // 标识当前存储依赖的 ID, 后续可以通过 ID 找到它
    deps.id = id;
    deps.fn = anonymous;

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

    // console.log( deps );

    return result;
  };
}

function cleanDependents( id ){
  const deps = dependentsMap[ id ];

  deps && deps.forEach(fn => fn());
}