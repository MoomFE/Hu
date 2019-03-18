import { isIOS } from "../../shared/const/env";
import noop from "../../shared/util/noop";


const callbacks = [];
let pending = false;

function flushCallbacks(){
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for( let copy of copies ) copy();
}


const resolve = Promise.resolve();
const timerFunc = () => {
  resolve.then( flushCallbacks );

  if( isIOS ){
    setTimeout( noop );
  }
};


export default function nextTick( callback, ctx ){
  let resolve;

  callbacks.push(() => {
    if( callback ){
      callback.call( ctx );
    }else{
      resolve( ctx );
    }
  });

  if( !pending ){
    pending = true;
    timerFunc();
  }

  if( !callback ){
    return new Promise( _resolve => {
      resolve = _resolve;
    });
  }
}