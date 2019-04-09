import noop from "./noop";


export let warn = noop;
export let tip = noop;


if( process.env.NODE_ENV !== 'production' ){
  const hasConsole = typeof console !== 'undefined';

  warn = ( msg, hu ) => {
    if( hasConsole ){
      console.error(`[ Hu warn ]: ${ msg }`);
    }
  }

  tip = ( msg, hu ) => {
    if( hasConsole ){
      console.warn(`[ Hu tip ]: ${ msg }`);
    }
  }
}