import each from "../../../shared/util/each";


/**
 * 初始化当前组件 props 属性
 * @param {HTMLElement} root 
 * @param {{}} options 
 * @param {{}} target 
 */
export default function initProps( root, options, target ){

  const props = options.props;
  const propsTarget = {};


  each( props, ( name, options ) => {
    let value = root.getAttribute( name );

    if( value !== void 0 ){
      propsTarget[ name ] = value;
    }
  });

  target.$props = new Proxy( propsTarget, {

  });
}