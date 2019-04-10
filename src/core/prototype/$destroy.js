import callLifecycle from "../../static/define/util/callLifecycle";
import { computedMap } from "../../static/define/init/initComputed";
import { watcherMap } from "./$watch";
import { unWatchAllDirectiveCache } from "../../html/render";


export default function(){

  callLifecycle( this, 'beforeDestroy' );

  // 注销实例所有计算属性和 watch 数据
  removeComputed( computedMap, this );
  removeComputed( watcherMap, this );

  // 解绑上次渲染时收集到的属性监听和双向数据绑定信息
  unWatchAllDirectiveCache( this.$el );

  callLifecycle( this, 'destroyed' );

  // 删除所有自定义事件绑定
  this.$off();

}

function removeComputed( optionsMap, self ){
  const options = optionsMap.get( self );

  if( options ){
    const [ optionsMap, remove ] = options;

    optionsMap.forEach(( value, name ) => {
      return remove( name );
    })
  }
}