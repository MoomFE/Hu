import { bindDirectiveCacheMap, modelDirectiveCacheMap } from "../const/index";


/**
 * 解绑上次渲染时收集到的属性监听和双向数据绑定信息
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
    for( let option of options ){
      fn( option );
    }
    options.length = 0;
  }
}