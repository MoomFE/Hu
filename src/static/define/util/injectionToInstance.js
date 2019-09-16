import isString from "../../../shared/util/isString";
import isReserved from "../../../shared/util/isReserved";
import { has } from "../../../shared/global/Reflect/index";
import defineProperty from "../../../shared/util/defineProperty";
import definePropertyValue from "../../../shared/util/definePropertyValue";
import isPrivate from "../../../shared/util/isPrivate";


export default
/**
 * 在实例和自定义元素上建立对象的引用
 */
( isCustomElement, target, root, key, attributes ) => {

  /** 对象名称是否是字符串 */
  let keyIsString = isString( key ),
  /** 建立对象的引用的方法 */
      definePropertyFn;

  // 对象名称首字母如果为 $ 那么则不允许添加到实例中去
  if( keyIsString && isReserved( key ) ){
    return;
  }
  // 实例中有同名变量, 则删除
  has( target, key ) && delete target[ key ];
  // 在实例中对变量添加映射
  ( definePropertyFn = has( attributes, 'value' ) ? definePropertyValue : defineProperty )(
    target, key, attributes
  );

  // 在自定义元素上建立对象的引用
  if( isCustomElement ){
    // 对象名称首字母如果为 _ 那么则不允许添加到自定义元素中去
    if( keyIsString && isPrivate( key ) ){
      return;
    }
    // 自定义元素中有同名变量, 则删除
    has( root, key ) && delete root[ key ];
    // 在自定义元素中对变量添加映射
    definePropertyFn( root, key, attributes );
  }
}