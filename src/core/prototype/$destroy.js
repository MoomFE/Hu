import callLifecycle from "../../static/define/util/callLifecycle";
import { computedMap } from "../../static/define/init/initComputed";
import { watcherMap } from "./$watch";


export default function(){

  callLifecycle( this, 'beforeDestroy' );

  // 注销实例所有计算属性和 watch 数据
  {
    const computedOptions = computedMap.get( this );
    const watchOptions = watcherMap.get( this );

    removeComputed( computedOptions );
    removeComputed( watchOptions );
  }

  callLifecycle( this, 'destroyed' );

}

function removeComputed( options ){
  if( options ){
    const [ optionsMap, remove ] = options;

    optionsMap.forEach(( value, name ) => {
      return remove( name );
    })
  }
}