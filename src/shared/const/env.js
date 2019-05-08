import { defineProperty } from "../global/Reflect/index";


export const inBrowser = typeof window !== 'undefined';
export const UA = inBrowser && window.navigator.userAgent.toLowerCase();
export const isIOS = UA && /iphone|ipad|ipod|ios/.test( UA );


export let supportsPassive = false;

try{

  const options = {};

  defineProperty( options, 'passive', {
    get: () => {
      return supportsPassive = true;
    }
  });

  window.addEventListener( 'test-passive', null, options );

}catch(e){}


export const hasShadyCss = typeof window.ShadyCSS !== 'undefined' && !window.ShadyCSS.nativeShadow;