import createComputed from "../../observable/util/createComputed";
import isString from "../../../shared/util/isString";
import isFunction from "../../../shared/util/isFunction";
import parsePath from "../util/parsePath";
import each from "../../../shared/util/each";
import isPlainObject from "../../../shared/util/isPlainObject";
import uid from "../../../shared/util/uid";


const [
  watchTarget,
  watchTargetProxyInterceptor,
  appendComputed,
  removeComputed
] = createComputed(
  null, null, true
);

export default function initWatch( root, options, target, targetProxy ){

  const watch = target.$watch = ( expOrFn, callback, options ) => {
    let watchFn;

    // 另一种写法
    if( isPlainObject( callback ) ){
      return watch( expOrFn, callback.handler, callback );
    }

    // 使用键路径表达式
    if( isString( expOrFn ) ){
      watchFn = parsePath( expOrFn ).bind( targetProxy );
    }
    // 使用计算属性函数
    else if( isFunction( expOrFn ) ){
      watchFn = expOrFn.bind( targetProxy );
    }
    // 不支持其他写法
    else{
      return;
    }

    // 初始化选项参数
    options = options || {};

    /** 当前 watch 的存储名称 */
    const name = uid();
    /** 当前 watch 的回调函数 */
    const watchCallback = callback.bind( targetProxy );
    /** 监听对象内部值的变化 */
    const isWatchDeep = !!options.deep;
    /** 值改变是否运行回调 */
    let runCallback = !!options.immediate;

    // 添加监听
    appendComputed( name, {
      get: () => {
        const oldValue = watchTarget[ name ];
        const value = watchFn();

        runCallback && watchCallback( value, oldValue );
        return value;
      }
    }, isWatchDeep );

    // 首次运行, 以收集依赖
    watchTargetProxyInterceptor[ name ];
    // 下次值改变时运行回调
    runCallback = true;

    // 返回取消监听的方法
    return () => {
      removeComputed( name );
    };
  }

  // 添加监听方法
  each( options.watch, watch );

}