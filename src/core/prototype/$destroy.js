import callLifecycle from "../../static/define/util/callLifecycle";
import { computedMap } from "../../static/define/init/initComputed";
import { watcherMap } from "./$watch";


export default function(){

  callLifecycle( this, 'beforeDestroy' );

  // 注销实例所有计算属性
  {
    const computedOptions = computedMap.get( this );

    if( computedOptions ){
      const [ computedOptionsMap, removeComputed ] = computedOptions;

      computedOptionsMap.forEach(( value, name ) => {
        return removeComputed( name );
      });
    }
  }
  // 注销实例所有 watch 数据
  {
    const watchOptions = watcherMap.get( this );

    if( watchOptions ){
      const [ watchOptionsMap, removeWatch ] = watchOptions;

      watchOptionsMap.forEach(( value, name ) => {
        return removeWatch( name );
      });
    }
  }

  callLifecycle( this, 'destroyed' );

}