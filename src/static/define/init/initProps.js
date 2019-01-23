import each from "../../../shared/util/each";
import isFunction from "../../../shared/util/isFunction";
import returnArg from "../../../shared/util/returnArg";


/**
 * 初始化当前组件 props 属性
 * @param {HTMLElement} root 
 * @param {{}} options 
 * @param {{}} target 
 */
export default function initProps( root, options, target, targetProxy ){

  const props = options.props;
  const propsTarget = {};


  each( props, ( name, options ) => {
    let value = root.getAttribute( name );

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

  target.$props = new Proxy( propsTarget, {

  });
}