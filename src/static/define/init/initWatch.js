import createComputed, { appendComputed } from "../util/createComputed";


let uid = 0;

export default function initWatch( root, options, target, targetProxy ){


  const watchStateMap = {};

  const [
    watchTarget,
    watchTargetProxy,
    watchTargetProxyInterceptor
  ] = createComputed(
    watchStateMap, null, targetProxy
  );


  target.$watch = ( fn, callback, options ) => {

    options = options || {};

    const name = uid++;
    const watchFn = fn.bind( targetProxy );
    const watchCallback = callback.bind( targetProxy );

    /** 值改变是否运行回调 */
    let runCallback = options.immediate;

    // 添加监听
    appendComputed( watchTarget, watchTargetProxy, watchStateMap, targetProxy, name, true, {
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

