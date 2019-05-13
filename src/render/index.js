import { renderStack } from './const/index';
import { unWatchAllDirectiveCache } from './util/unWatchAllDirectiveCache';
import NodePart from '../html/core/node';
import removeNodes from '../shared/util/removeNodes';


const parts = new WeakMap();

function basicRender( result, container ){
  // 尝试获取上次创建的节点对象
  let part = parts.get( container );

  // 首次在该目标对象下进行渲染, 对节点对象进行创建
  if( !part ){
    // 移除需要渲染的目标对象下的所有内容
    removeNodes( container, container.firstChild );

    // 创建节点对象
    parts.set(
      container,
      part = new NodePart()
    );
    // 将节点对象添加至目标元素
    part.appendInto( container );
  }

  part.setValue( result );
  part.commit();
}


export default ( result, container ) => {
  unWatchAllDirectiveCache( container );
  renderStack.push( container );
  basicRender( result, container );
  renderStack.pop();
}