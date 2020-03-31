import { ownKeys, defineProperty } from '../../../shared/global/Reflect/index';
import isReserved from '../../../shared/util/isReserved';
import each from '../../../shared/util/each';
import Hu from '../../../core/hu';


export default (root, target, targetProxy) => {
  const keys = {
    // $on: $on,
    // $off: $off,
    // addEventListener: $on,
    // removeEventListener: $off,
  };

  ownKeys(Hu.prototype).filter(isReserved).forEach((name) => {
    keys[name] = name;
  });

  // 自定义元素实例上的事件处理相关方法
  keys.addEventListener = '$on';
  keys.removeEventListener = '$off';

  each(keys, (to, from) => {
    defineProperty(root, to, {
      value: target[from].bind(targetProxy)
    });
  });
};
