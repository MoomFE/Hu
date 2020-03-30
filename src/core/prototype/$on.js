import { isArray } from '../../shared/global/Array/index';
import { create } from '../../shared/global/Object/index';
import { apply } from '../../shared/global/Reflect/index';
import { slice } from '../../shared/global/Array/prototype';


const eventMap = new WeakMap();
const onceMap = new WeakMap();

export function initEvents(targetProxy) {
  const events = create(null);
  eventMap.set(targetProxy, events);
}


export default function (type, fn) {
  if (isArray(type)) {
    for (const event of type) this.$on(event, fn);
  } else {
    const events = eventMap.get(this);
    const fns = events[type] || (
      events[type] = []
    );

    fns.push(fn);
  }
}

export const $once = function (type, fn) {
  function once(...args) {
    this.$off(type, once);
    apply(fn, this, args);
  }
  onceMap.set(once, fn);
  this.$on(type, once);
};

export const $off = function (type, fn) {
  // 解绑所有事件
  if (!arguments.length) {
    initEvents(this);
    return this;
  }
  // 解绑绑定了同一方法的多个事件
  if (isArray(type)) {
    for (const _type of type) this.$off(_type, fn);
    return this;
  }

  const events = eventMap.get(this);
  const fns = events[type];

  // 没有绑定的事件
  if (!fns || !fns.length) {
    return this;
  }

  // 解绑该事件名下的所有事件
  if (!fn) {
    fns.length = 0;
    return this;
  }

  let index = fns.length;
  while (index--) {
    const cb = fns[index];

    if (cb === fn || onceMap.get(cb) === fn) {
      fns.splice(index, 1);
      break;
    }
  }

  return this;
};

export const $emit = function (...args) {
  const type = args[0];
  const events = eventMap.get(this);
  const fns = events[type];

  if (fns && fns.length) {
    const cbs = fns.length > 1 ? slice.call(fns) : fns;
    const [, ...newArgs] = args;

    for (const cb of cbs) {
      apply(cb, this, newArgs);
    }
  }

  return this;
};
