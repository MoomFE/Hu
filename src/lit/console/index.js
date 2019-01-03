import noop from "../../shared/global/ZenJS/noop";


let warn = noop;

if( typeof console !== undefined ){
  warn = function( message ){
    console.error(`[Lit warn]: ${ message }`);
  }
}

export default warn;