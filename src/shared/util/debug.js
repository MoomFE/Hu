import noop from './noop';


export let warn = noop; // eslint-disable-line import/no-mutable-exports
export let tip = noop; // eslint-disable-line import/no-mutable-exports


if (process.env.NODE_ENV !== 'production') {
  const hasConsole = typeof console !== 'undefined';

  warn = (msg, hu) => {
    if (hasConsole) {
      console.error(`[ Hu warn ]: ${msg}`);
    }
  };

  tip = (msg, hu) => {
    if (hasConsole) {
      console.warn(`[ Hu tip ]: ${msg}`);
    }
  };
}
