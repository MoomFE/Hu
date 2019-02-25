import canInjection from "../../../shared/util/canInjection";
import has from "../../../shared/global/Reflect/has";
import define from "../../../shared/util/define";


export default
/**
 * 在 $hu 上建立对象的映射
 * 
 * @param {{}} litTarget $hu 实例
 * @param {string} key 对象名称
 * @param {any} value 对象值
 * @param {function} set 属性的 getter 方法, 若传值, 则视为使用 Object.defineProperty 对值进行定义
 * @param {function} get 属性的 setter 方法
 */
( litTarget, key, value, set, get ) => {

  // 首字母为 $ 则不允许映射到 $hu 实例中去
  if( !canInjection( key ) ) return;

  // 若在 $hu 下有同名变量, 则删除
  has( litTarget, key ) && delete litTarget[ key ];

  // 使用 Object.defineProperty 对值进行定义
  if( set ){
    define( litTarget, key, set, get )
  }
  // 直接写入到 $hu 上
  else{
    litTarget[ key ] = value;
  }

}