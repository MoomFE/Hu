import { directive } from 'lit-html';
import { observeProxyMap } from '../../static/observable/observe';
import { bindWatchesMap, renderStack } from '../const';
import $watch from '../../shared/global/Hu/prototype/$watch';


export default directive(( proxy, name ) => part => {
  // 绑定的必须是观察者对象
  if( !observeProxyMap.has( proxy ) ){
    return;
  }

  const {
    name: attr,
    element
  } = part.committer;

  const unWatch = $watch(
    () => proxy[ name ],
    ( value ) => {
      return element.setAttribute( attr, value );
    },
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
});