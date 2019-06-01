import directiveFn from '../../static/directiveFn/index';
import { observeProxyMap } from '../../static/observable/observe';
import { bindDirectiveCacheMap, renderStack } from '../../render/const/index';
import $watch from '../../core/prototype/$watch';


export default directiveFn(( proxy, name ) => {

  /**
   * 传入对象是否是观察者对象
   */
  const isObserve = observeProxyMap.has( proxy );

  return part => {

    // 若传入对象不是观察者对象
    // 那么只设置一次值
    if( !isObserve ){
      return part.commit( proxy[ name ] );
    }

    const unWatch = $watch(
      () => proxy[ name ],
      value => part.commit( value ),
      {
        immediate: true,
        deep: true
      }
    );

    // 当前渲染元素
    const rendering = renderStack[ renderStack.length - 1 ];
    // 当前渲染元素属性监听解绑方法集
    let bindWatches = bindDirectiveCacheMap.get( rendering );

    if( !bindWatches ){
      bindWatches = [];
      bindDirectiveCacheMap.set( rendering, bindWatches );
    }
  
    bindWatches.push( unWatch );
  };
});