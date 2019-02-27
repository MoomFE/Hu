import createComputed from "../util/createComputed";
import isString from "../../../shared/util/isString";
import isFunction from "../../../shared/util/isFunction";
import parsePath from "../util/parsePath";


let uid = 0;

export default function initWatch( root, options, target, targetProxy ){

  const [
    watchTarget,
    watchTargetProxy,
    watchTargetProxyInterceptor,
    appendComputed
  ] = createComputed(
    null, targetProxy
  );


  target.$watch = ( expOrFn, callback, options ) => {

    
    let watchFn;

    // 使用键路径表达式
    if( isString( expOrFn ) ){
      watchFn = parsePath( expOrFn ).bind( targetProxy );
    }
    // 使用计算属性函数
    else if( isFunction( expOrFn ) ){
      watchFn = expOrFn.bind( targetProxy );
    }else{
      return;
    }

    options = options || {};

    /** 当前 watch 的存储名称 */
    const name = uid++;
    /** 当前 watch 的回调函数 */
    const watchCallback = callback.bind( targetProxy );
    /** 值改变是否运行回调 */
    let runCallback = options.immediate;

    // 添加监听
    appendComputed( true, name, {
      get(){
        const oldValue = watchTarget[ name ];
        const value = watchFn();

        if( runCallback ){
          watchCallback( value, oldValue );
        }

        return value;
      }
    });

    // 首次运行, 以收集依赖
    watchTargetProxyInterceptor[ name ];
    // 下次值改变时运行回调
    runCallback = true;
  }

}