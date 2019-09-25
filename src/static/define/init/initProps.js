import { create } from "../../../shared/global/Object/index";
import each from "../../../shared/util/each";
import isFunction from "../../../shared/util/isFunction";
import returnArg from "../../../shared/util/returnArg";
import { observe, observeProxyMap } from "../../observable/observe";
import injectionPrivateToInstance from "../util/injectionPrivateToInstance";
import injectionToInstance from "../util/injectionToInstance";
import observeReadonly from "../../../shared/const/observeReadonly";


/**
 * 初始化当前组件 props 属性
 * @param {boolean} isCustomElement 是否是初始化自定义元素
 * @param {HTMLElement} root 
 * @param {{}} options 
 * @param {{}} target 
 * @param {{}} targetProxy 
 */
export default function initProps( isCustomElement, target, root, props, targetProxy ){

  const propsTarget = create( null );
  const propsTargetProxy = observe( propsTarget );
  const propsState = create( null );

  // 尝试从标签上获取 props 属性, 否则取默认值
  each( props, ( name, options ) => {
    let value = null;

    if( isCustomElement && options.attr ){
      value = root.getAttribute( options.attr );
    }

    // 定义了该属性
    if( value !== null ){
      propsState[ name ] = true;
      propsTarget[ name ] = ( options.from || returnArg )( value );
    }
    // 使用默认值
    else{
      propsState[ name ] = false;
      propsTarget[ name ] = isFunction( options.default )
                              ? options.default.call( targetProxy )
                              : options.default;
    }
  });


  each( props, ( name, options ) => {
    injectionToInstance( isCustomElement, target, root, name, {
      get: () => propsTargetProxy[ name ],
      set: value => {
        propsState[ name ] = true;
        propsTargetProxy[ name ] = value;
      }
    });
  });

  injectionPrivateToInstance( isCustomElement, target, root, {
    $props: propsTargetProxy
  });

  observeProxyMap.get( target.$info ).target.props = observe( propsState, observeReadonly );
}