import isString from "../../../shared/util/isString";
import isReserved from "../../../shared/util/isReserved";
import defineProperty from "../../../shared/util/defineProperty";
import { has } from "../../../shared/global/Reflect/index";


export default
/**
 * 在 $hu 上建立对象的映射
 * 
 * @param {{}} huTarget $hu 实例
 * @param {string} key 对象名称
 * @param {any} value 对象值
 * @param {function} get 属性的 getter 方法, 若传值, 则视为使用 Object.defineProperty 对值进行定义
 * @param {function} set 属性的 setter 方法
 */
( huTarget, key, value, get, set ) => {

  // 首字母为 $ 则不允许映射到 $hu 实例中去
  if( isString( key ) && isReserved( key ) ) return;

  // 若在 $hu 下有同名变量, 则删除
  has( huTarget, key ) && delete huTarget[ key ];

  // 使用 Object.defineProperty 对值进行定义
  if( get ){
    defineProperty( huTarget, key, get, set );
  }
  // 直接写入到 $hu 上
  else{
    huTarget[ key ] = value;
  }

}