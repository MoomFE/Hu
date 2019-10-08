import { observeMap, observerProxySetValue } from "../../static/observable/observe";

/**
 * 使观察者对象只读 ( 不可删, 不可写 )
 */
export default {
  set: {
    before: () => 0
  },
  deleteProperty: {
    before: () => 0
  }
};

/**
 * 内部修改只读对象后触发更新
 * @param {Object|Array} target 
 * @param {String} name 
 * @param {any} value 
 */
export function setValueByReadonly( target, name, value ){
  // 是只读观察者对象
  if( observeMap.has( target ) ){
    const { subs, deepSubs, lastValue, isArray, proxy: targetProxy } = observeMap.get( target );

    // 尝试写入值并触发更新
    observerProxySetValue(
      subs, deepSubs, lastValue, isArray,
      target, name, value, targetProxy
    );
  }
}