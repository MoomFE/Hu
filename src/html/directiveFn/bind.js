import { directive } from 'lit-html';
import { observeProxyMap } from '../../static/observable/observe';
import { bindDirectiveCacheMap, renderStack } from '../../render/const/index';
import $watch from '../../core/prototype/$watch';


export default directive(( proxy, name ) => {

  // 是否是观察者对象
  // 绑定的必须是观察者对象
  const isObserve = observeProxyMap.has( proxy );

  return ( part, deep = false ) => {

    const setValue = ( value ) => {
      part.setValue( value );
      part.commit();
    }

    if( !isObserve ){
      const value = proxy[ name ];
      return setValue( value );
    }

    const unWatch = $watch(
      () => proxy[ name ],
      setValue,
      {
        immediate: true,
        deep
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