import { create } from '../../../shared/global/Object/index';
import each from '../../../shared/util/each';
import injectionPrivateToInstance from '../util/injectionPrivateToInstance';
import injectionToInstance from '../util/injectionToInstance';


/**
 * 初始化当前组件 methods 属性
 * @param {{}} options
 * @param {{}} target
 * @param {{}} targetProxy
 */
export default function initMethods(isCustomElement, target, root, methods, targetProxy) {
  /**
   * $methods 实例属性
   *  - 非响应式
   *  - 会在实例上添加方法的副本 ( 单独修改删除时, 另一个不受影响 )
   */
  const methodsTarget = create(null);


  each(methods, (name, value) => {
    const method = methodsTarget[name] = value.bind(targetProxy);

    injectionToInstance(isCustomElement, target, root, name, {
      writable: true,
      value: method
    });
  });

  injectionPrivateToInstance(isCustomElement, target, root, {
    $methods: methodsTarget
  });
}
