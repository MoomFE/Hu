import nextTick from "../../nextTick/nextTick";


const queue = new Set();
let waiting = false;


export function queueUpdate( dependentsOptions ){
  if( queue.has( dependentsOptions ) ){
    return;
  }else{
    queue.add( dependentsOptions );
  }

  if( !waiting ){
    waiting = false;

    nextTick( flushSchedulerQueue );
  }
}

function flushSchedulerQueue(){
  for( let dependentsOptions of queue ){
    dependentsOptions.get();
  }

  queue.clear();
  waiting = false;
}