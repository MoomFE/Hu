import { render } from 'lit-html';
import { renderStack, bindDirectiveCacheMap, modelDirectiveCacheMap } from './const';


export default function( result, container, options ){

  unWatchDirectiveCache( container );

  renderStack.push( container );

  render( result, container, options );

  renderStack.pop();
}


/**
 * 解绑上次渲染时使用 bind 指令方法绑定的属性
 */
export function unWatchDirectiveCache( container ){
  /** 当前渲染元素属性监听解绑方法集 */
  const bindWatches = bindDirectiveCacheMap.get( container );

  if( bindWatches ){
    // 解绑上次渲染时收集到的属性监听
    for( const unWatch of bindWatches ){
      unWatch();
    }
    // 清空属性监听, 重新进行收集
    bindWatches.length = 0;
  }

  /** 当前渲染元素使用的双向数据绑定信息 */
  const modelParts = modelDirectiveCacheMap.get( container );

  if( modelParts ){
    for( const modelPart of modelParts ){
      modelPart.options.length = 0;
    }
    // 清空双向数据绑定信息, 重新进行收集
    modelParts.length = 0;
  }
}