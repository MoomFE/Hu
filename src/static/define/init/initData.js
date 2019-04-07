import { create } from "../../../shared/global/Object/index";
import each from "../../../shared/util/each";
import injectionToLit from "../util/injectionToLit";
import { observe } from "../../observable/observe";
import isFunction from "../../../shared/util/isFunction";
import { has } from "../../../shared/global/Reflect/index";


/**
 * 初始化当前组件 data 属性
 * @param {{}} options
 * @param {{}} target
 * @param {{}} targetProxy
 */
export default function initData( options, target, targetProxy ){

  const dataList = options.dataList;
  let dataTarget;

  if( dataList && dataList.length ){
    for( let data of dataList ){
      if( isFunction( data ) ) data = data.call( targetProxy );
      if( !dataTarget ) dataTarget = data;

      each( data, ( name, value ) => {
        has( dataTarget, name ) || ( dataTarget[ name ] = value );
      });
    }
  }else{
    dataTarget = create( null );
  }

  const dataTargetProxy = target.$data = observe( dataTarget );

  each( dataTarget, name => {
    injectionToLit(
      target, name, 0,
      () => dataTargetProxy[ name ],
      value => dataTargetProxy[ name ] = value
    );
  });

}