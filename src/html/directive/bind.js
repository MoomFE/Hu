import { directive } from 'lit-html';
import { observeProxyMap } from '../../static/observable/observe';
import { bindWatchesMap, renderStack } from '../const';
import $watch from '../../shared/global/Hu/prototype/$watch';
import AttributePart from '../parts/attribute';


export default directive(( proxy, name ) => {

  // 是否是观察者对象
  // 绑定的必须是观察者对象
  const isObserve = observeProxyMap.has( proxy );

  return part => {
    if( !( part instanceof AttributePart ) ){
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
        immediate: true
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