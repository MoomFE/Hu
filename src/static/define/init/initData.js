import { create } from "../../../shared/global/Object/index";
import each from "../../../shared/util/each";
import injectionToHu from "../util/injectionToHu";
import { observe } from "../../observable/observe";
import isFunction from "../../../shared/util/isFunction";
import { has } from "../../../shared/global/Reflect/index";
import injectionPrivateToInstance from "../util/injectionPrivateToInstance";


/**
 * 初始化当前组件 data 属性
 * @param {{}} options
 * @param {{}} target
 * @param {{}} targetProxy
 */
export default function initData( isCustomElement, target, root, options, targetProxy ){

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

  const dataTargetProxy = observe( dataTarget );

  each( dataTarget, name => {
    injectionToHu(
      target, name, 0,
      () => dataTargetProxy[ name ],
      value => dataTargetProxy[ name ] = value
    );
  });

  injectionPrivateToInstance( isCustomElement, target, root, {
    $data: dataTargetProxy
  });

}