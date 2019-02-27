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
 * @param {function} fn 需要收集依赖的方法
 * @param {boolean} isComputed 是否是计算属性, 计算属性如果如果未被其它方法依赖, 则无需立即更新
 * @param {boolean} isDeep 是否监听对象内部值的变化
 */
export function createCollectingDependents( fn, isComputed, isDeep ){
  // 当前方法收集依赖的 ID, 用于从 watcherMap ( 存储 / 读取 ) 依赖项
  const id = uid++;

  const collectingDependentsGet = () => {
    // 对之前收集的依赖进行清空
    cleanDependents( id );

    // 当前收集依赖的方法的一些参数
    const depsOptions = {
      // 当前方法的依赖存储数组
      deps: [],
      // 当其中一个依赖更新后, 会调用当前方法重新计算依赖
      fn: collectingDependentsGet,
      // 判断当前计算属性是否被没有被其它方法收集了依赖
      isCollected: isComputed && !targetStack.length,
      // 依赖是否更新
      // forceUpdate: true,
      // 深度 watcher
      isDeep
    };

    // 开始收集依赖
    targetStack.push( depsOptions );

    // 执行方法
    // 方法执行的过程中触发响应对象的 getter 而将依赖存储进 deps
    const result = fn();

    // 方法执行完成, 则依赖收集完成
    targetStack.pop();

    // 存储当前方法的依赖
    // 可以在下次收集依赖的时候对这次收集的依赖进行清空
    dependentsMap[ id ] = depsOptions;

    return result;
  };

  // 存储当前收集依赖的 ID 到方法
  // - 未被其它方法依赖的计算属性可以用它来获取依赖参数判断是否被更新
  collectingDependentsGet.id = id;

  return collectingDependentsGet;
}

function cleanDependents( id ){
  const depsOptions = dependentsMap[ id ];

  if( depsOptions ){
    depsOptions.deps.forEach(
      fn => fn()
    );
  }
}