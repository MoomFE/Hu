import { renderStack } from './const/index';
import { unWatchAllDirectiveCache } from './util/unWatchAllDirectiveCache';
import { removeNodes } from 'lit-html';
import { assign } from '../shared/global/Object/index';
import templateFactory from '../html/core/templateFactory';
import NodePart from '../html/core/node';


const parts = new WeakMap();

function basicRender( result, container, options ){
  // 尝试获取上次创建的节点对象
  let part = parts.get( container );

  // 首次在该目标对象下进行渲染, 对节点对象进行创建
  if( !part ){
    // 移除需要渲染的目标对象下的所有内容
    removeNodes( container, container.firstChild );

    // 创建节点对象
    parts.set(
      container,
      part = new NodePart(
        assign(
          { templateFactory }, options
        )
      )
    );
    // 将节点对象添加至目标元素
    part.appendInto( container );
  }

  part.setValue( result );
  part.commit();
}


export default ( result, container, options ) => {
  unWatchAllDirectiveCache( container );
  renderStack.push( container );
  basicRender( result, container, options );
  renderStack.pop();
}