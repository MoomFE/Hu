import { defineProperty } from '../global/Reflect/index';


export const inBrowser = typeof window !== 'undefined';
export const UA = inBrowser && window.navigator.userAgent.toLowerCase();
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
// export const isFirefox = UA && UA.indexOf('firefox') > -1;


export let supportsPassive = false; // eslint-disable-line import/no-mutable-exports

try {
  const options = {};

  defineProperty(options, 'passive', {
    get: () => {
      return (supportsPassive = true);
    }
  });

  window.addEventListener('test-passive', null, options);
} catch (e) {} // eslint-disable-line no-empty


export const hasShadyCss = inBrowser
                        && window.ShadyCSS !== undefined
                        && !window.ShadyCSS.nativeShadow;
