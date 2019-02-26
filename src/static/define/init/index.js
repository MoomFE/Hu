import create from "../../../shared/global/Object/create";
import initProps from "./initProps";
import isReserved from "../../../shared/util/isReserved";
import initMethods from "./initMethods";
import initData from "./initData";
import initRender from "./initRender";
import initComputed from "./initComputed";
import initWatch from "./initWatch";


/**
 * 初始化当前组件属性
 * @param {HTMLElement} root 自定义元素组件节点
 * @param {{}} options 组件配置
 */
export default function init( root, options ){
  /** 当前组件对象 */
  const target = create( null );
  /** 当前组件代理对象 */
  const targetProxy = new Proxy( target, {
    set( target, name, value ){
      if( isReserved( name ) ) return false;

      target[ name ] = value;
      return true;
    }
  });

  target.$el = root.attachShadow({ mode: 'open' });
  target.$customElement = root;

  initProps( root, options, target, targetProxy );
  initMethods( root, options, target, targetProxy );
  initData( root, options, target, targetProxy );
  initComputed( root, options, target, targetProxy );
  initRender( root, options, target, targetProxy );
  initWatch( root, options, target, targetProxy );

  return targetProxy;
}