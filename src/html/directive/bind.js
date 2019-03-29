import { directive, NodePart } from 'lit-html';
import { observeProxyMap } from '../../static/observable/observe';
import { bindWatchesMap, renderStack } from '../const';
import $watch from '../../shared/global/Hu/prototype/$watch';


export default directive(( proxy, name ) => {

  // 是否是观察者对象
  // 绑定的必须是观察者对象
  const isObserve = observeProxyMap.has( proxy );

  return ( part, deep = false ) => {
    if( part instanceof NodePart ){
      throw new Error('Hu.html.bind 指令方法只能在元素属性绑定中使用 !');
    }

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
    let bindWatches = bindWatchesMap.get( rendering );
  
    if( !bindWatches ){
      bindWatches = [];
      bindWatchesMap.set( rendering, bindWatches );
    }
  
    bindWatches.push( unWatch );
  };
});