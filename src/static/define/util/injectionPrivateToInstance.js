import each from "../../../shared/util/each";
import { defineProperty } from "../../../shared/global/Reflect/index";


export default
/**
 * 在实例和自定义元素上建立内部对象的引用
 */
( isCustomElement, target, root, data ) => each( data, ( key, value ) => {

  // 实例上直接写入就好
  // 常规操作有观察者对象进行拦截
  target[ key ] = value;

  // 自定义元素上需要通过 defineProperty 进行转发
  if( isCustomElement ){
    defineProperty( root, key, {
      value
    });
  }

});