import callLifecycle from "../../static/define/util/callLifecycle";
import { computedMap } from "../../static/define/init/initComputed";
import { watcherMap } from "./$watch";
import removeRenderDeps from "../init/initForceUpdate/util/removeRenderDeps";
import destroyRender from "../../render/util/destroyRender";


export default function(){

  callLifecycle( this, 'beforeDestroy' );

  // 注销实例所有计算属性和 watch 数据
  removeComputed( computedMap, this );
  removeComputed( watcherMap, this );

  // 注销 render 时创建的指令及指令方法
  destroyRender( this.$el );

  // 清空 render 方法收集到的依赖
  removeRenderDeps( this );

  callLifecycle( this, 'destroyed' );

  // 删除所有自定义事件绑定
  this.$off();

}

function removeComputed( optionsMap, self ){
  optionsMap.has( self ) && optionsMap.get( self ).clean();
}