import create from "../../../shared/global/Object/create";
import initProps from "./initProps";


/**
 * 初始化当前组件属性
 * @param {HTMLElement} root 组件根节点
 * @param {{}} options 组件配置
 */
export default function init( root, options ){
  /** 当前组件对象 */
  const target = create( null );
  /** 当前组件代理对象 */
  const targetProxy = new Proxy( target, {
    set( target, name, value ){
      if( name[0] === '$' ) return false;

      target[ name ] = value;
      return true;
    }
  });

  target.$el = root.attachShadow({ mode: 'open' });
  target.$root = root;

  initProps( root, options, target, targetProxy );

  return targetProxy;
}