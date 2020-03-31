import each from '../../../shared/util/each';
import isPlainObject from '../../../shared/util/isPlainObject';
import isFunction from '../../../shared/util/isFunction';
import { isArray } from '../../../shared/global/Array/index';
import isString from '../../../shared/util/isString';
import { apply } from '../../../shared/global/Reflect/index';


export default function initWatch(options, target, targetProxy) {
  // 添加监听方法
  each(options.watch, function createWatcher(expOrFn, watchOptions) {
    if (isArray(watchOptions)) {
      for (const handler of watchOptions) {
        createWatcher(expOrFn, handler);
      }
    } else if (isPlainObject(watchOptions) || isFunction(watchOptions)) {
      targetProxy.$watch(expOrFn, watchOptions);
    } else if (isString(watchOptions)) {
      targetProxy.$watch(expOrFn, function () {
        return apply(this[watchOptions], this, arguments); // eslint-disable-line prefer-rest-params
      });
    }
  });
}
