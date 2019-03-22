import nextTick from "../nextTick/index";


/** 异步更新队列 */
const queue = new Set();
/** 是否已经有一个队列正在执行了 */
let waiting = false;


/**
 * 将一个更新请求放入队列中
 */
export function queueUpdate( dependentsOptions ){
  if( queue.has( dependentsOptions ) ){
    return;
  }else{
    queue.add( dependentsOptions );
  }

  // 如果当前没有异步更新队列在执行
  // 那么就执行当前的异步更新队列
  // 如果有的话
  // 当前的更新请求就会被当前的异步更新队列执行掉
  if( !waiting ){
    waiting = true;
    nextTick( flushSchedulerQueue );
  }
}

/**
 * 执行异步更新队列
 */
function flushSchedulerQueue(){
  for( let dependentsOptions of queue ){
    // 略过在等待队列执行的过程中就已经被更新了的计算属性
    if( dependentsOptions.isComputed && !dependentsOptions.shouldUpdate ){
      continue;
    }
    dependentsOptions.get();
  }

  queue.clear();
  waiting = false;
}