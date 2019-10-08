import { renderWatcherCache } from "../const";


/**
 * 清空 render 方法收集到的依赖
 */
export default targetProxy => {
  const watcher = renderWatcherCache.get( targetProxy );

  if( watcher ){
    watcher.clean();
  }
}