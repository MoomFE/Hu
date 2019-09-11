import { create } from "../../../shared/global/Object/index";
import each from "../../../shared/util/each";
import isFunction from "../../../shared/util/isFunction";
import returnArg from "../../../shared/util/returnArg";
import defineProperty from "../../../shared/util/defineProperty";
import { observe } from "../../observable/observe";
import isReserved from "../../../shared/util/isReserved";
import injectionPrivateToInstance from "../util/injectionPrivateToInstance";


/**
 * 初始化当前组件 props 属性
 * @param {boolean} isCustomElement 是否是初始化自定义元素
 * @param {HTMLElement} root 
 * @param {{}} options 
 * @param {{}} target 
 * @param {{}} targetProxy 
 */
export default function initProps( isCustomElement, target, root, options, targetProxy ){

  const props = options.props;
  const propsTarget = create( null );
  const propsTargetProxy = observe( propsTarget );

  // 尝试从标签上获取 props 属性, 否则取默认值
  each( props, ( name, options ) => {
    let value = null;

    if( isCustomElement && options.attr ){
      value = root.getAttribute( options.attr );
    }

    // 定义了该属性
    if( value !== null ){
      propsTarget[ name ] = ( options.from || returnArg )( value );
    }
    // 使用默认值
    else{
      propsTarget[ name ] = isFunction( options.default )
                              ? options.default.call( targetProxy )
                              : options.default;
    }
  });

  // 将 $props 上的属性在 $hu 上建立引用
  each( props, ( name, options ) => {
    if( options.isSymbol || !isReserved( name ) ){
      defineProperty(
        target, name,
        () => propsTargetProxy[ name ],
        value => propsTargetProxy[ name ] = value
      );
    }
  });

  injectionPrivateToInstance( isCustomElement, target, root, {
    $props: propsTargetProxy
  });

}