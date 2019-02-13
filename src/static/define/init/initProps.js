import create from "../../../shared/global/Object/create";
import each from "../../../shared/util/each";
import isFunction from "../../../shared/util/isFunction";
import returnArg from "../../../shared/util/returnArg";
import isReserved from "../../../shared/util/isReserved";
import defineProperty from "../../../shared/global/Object/defineProperty";


/**
 * 初始化当前组件 props 属性
 * @param {HTMLElement} root 
 * @param {{}} options 
 * @param {{}} target 
 */
export default function initProps( root, options, target, targetProxy ){

  const props = options.props;
  const propsTarget = create( null );
  const propsTargetProxy = target.$props = new Proxy( propsTarget, {
    set( target, name, value ){
      if( name in target ) target[ name ] = value;
    }
  });

  // 尝试从标签上获取 props 属性, 否则取默认值
  each( props, ( name, options ) => {
    let value = null;

    if( options.attr ){
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

  // 将 $props 上的属性在 $lit 上建立引用
  each( props, ( name, options ) => {
    if( !( options.isSymbol || !isReserved( name ) ) ) return;

    defineProperty( target, name, {
      enumerable: true,
      configurable: true,
      get: () => propsTargetProxy[ name ],
      set: value => propsTargetProxy[ name ] = value
    });
  });

}