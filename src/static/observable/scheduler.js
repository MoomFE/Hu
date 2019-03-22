import nextTick from "../nextTick/index";


/** 异步更新队列 */
const queue = [];
/** 判断异步更新队列中是否有一个更新请求 */
const queueMap = new Map();
/** 是否已经有一个队列正在等待执行或正在执行了 */
let waiting = false;
/** 是否已经有一个队列正在执行了 */
let flushing = false;
/** 队列执行到哪了 */
let index = 0;


/**
 * 将一个更新请求放入队列中
 */
export function queueUpdate( watcher ){
  // 当前异步更新队列中没有当前更新请求
  // 或者上一个当前更新请求已经执行完毕了
  if( !queueMap.has( watcher ) ){
    // 标识当前更新请求已经添加了
    queueMap.set( watcher, true );

    // 如果当前异步更新队列还未启动
    // 那么直接直接将当前更新请求添加进去
    if( !flushing ){
      queue.push( watcher );
    }
    // 当前异步更新队列已经启动
    // 则将当前更新请求按照 id 排列好
    else{
      let i = queue.length - 1;
      while( i > index && queue[ i ].id > watcher.id ){
        i--;
      }
      queue.splice( i + 1, 0, watcher );
    }

    // 如果当前没有异步更新队列在执行或等待执行
    // 那么就执行当前的异步更新队列
    if( !waiting ){
      waiting = true;
      nextTick( flushSchedulerQueue );
    }
  }
}

/**
 * 执行异步更新队列
 */
function flushSchedulerQueue(){
  flushing = true;
  index = 0;

  // 保证执行顺序
  queue.sort(( watcherA, watcherB ) => {
    return watcherA.id - watcherB.id;
  });

  for( let watcher; index < queue.length; index++ ){
    watcher = queue[ index ];

    // 标识当前更新请求已经执行完毕了
    queueMap.delete( watcher );

    // 略过在等待队列执行的过程中就已经被更新了的计算属性
    if( watcher.isComputed && !watcher.shouldUpdate ){
      continue;
    }

    // 执行更新
    watcher.get();
  }

  // 标识当前异步更新队列已经执行完毕了
  // 下一个更新请求会进入下一个 tick 进行更新
  waiting = flushing = false;
  index = queue.length = 0;
  queueMap.clear();
}