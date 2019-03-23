import HuConstructor from "../../../shared/global/Hu/hu";
import initProps from "./initProps";
import initMethods from "./initMethods";
import initData from "./initData";
import initComputed from "./initComputed";
import initWatch from "./initWatch";
import initOptions from "./initOptions";
import { observeMap } from "../../observable/observe";


/**
 * 初始化当前组件属性
 * @param {boolean} isCustomElement 是否是初始化自定义元素
 * @param {HTMLElement} root 自定义元素组件节点
 * @param {string} name 组件名称
 * @param {{}} options 组件配置
 * @param {{}} userOptions 用户组件配置
 */
export default function init( isCustomElement, root, name, options, userOptions ){

  /** 当前实例对象 */
  const target = new HuConstructor( name );
  /** 当前实例观察者对象 */
  const targetProxy = observeMap.get( target ).proxy;

  if( isCustomElement ){
    target.$el = root.attachShadow({ mode: 'open' });
    target.$customElement = root;
  }

  initOptions( isCustomElement, name, target, userOptions );
  initProps( isCustomElement, root, options, target, targetProxy );
  initMethods( options, target, targetProxy );
  initData( options, target, targetProxy );

  options.beforeCreate.call( targetProxy );

  initComputed( options, target, targetProxy );
  initWatch( options, target, targetProxy );

  options.created.call( targetProxy );

  if( !isCustomElement && options.el ){
    targetProxy.$mount( options.el );
  }

  return targetProxy;
}