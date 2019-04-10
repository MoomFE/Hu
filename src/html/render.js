import { render } from 'lit-html';
import { renderStack, bindDirectiveCacheMap, modelDirectiveCacheMap } from './const';


export default function( result, container, options ){

  unWatchAllDirectiveCache( container );

  renderStack.push( container );

  render( result, container, options );

  renderStack.pop();
}


/**
 * 解绑上次渲染时使用 bind 指令方法绑定的属性
 */
export function unWatchAllDirectiveCache( container ){
  // 解绑上次渲染时收集到的属性监听
  unWatchDirectiveCache( bindDirectiveCacheMap, container, unWatch => {
    return unWatch();
  });
  // 解绑上次渲染时收集到的双向数据绑定信息
  unWatchDirectiveCache( modelDirectiveCacheMap, container, modelPart => {
    return modelPart.options.length = 0;
  });
}

function unWatchDirectiveCache( cache, container, fn ){
  const options = cache.get( container );

  if( options ){
    for( const option of options ){
      fn( option );
    }
    options.length = 0;
  }
}