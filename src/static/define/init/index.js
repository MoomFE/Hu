import HuConstructor from "../../../core/hu";
import initProps from "./initProps";
import initMethods from "./initMethods";
import initData from "./initData";
import initComputed from "./initComputed";
import initWatch from "./initWatch";
import initOptions from "./initOptions";
import initParent from "./initParent";
import { observeMap } from "../../observable/observe";
import callLifecycle from "../util/callLifecycle";
import { activeCustomElement, activeHu } from "../const";
import moveHuPrototypeToCE from "../util/moveHuPrototypeToCE";


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
  const target = new HuConstructor( name, isCustomElement );
  /** 当前实例观察者对象 */
  const targetProxy = observeMap.get( target ).proxy;

  // 使用自定义元素创建的实例
  if( isCustomElement ){
    target.$el = root.attachShadow({ mode: 'open' });
    target.$customElement = root;

    // 标识当前自定义元素实例已激活, 保存自定义元素和实例的引用
    activeCustomElement.set( root, targetProxy );
    // 标识 $el 选项与实例的引用
    activeHu.set( target.$el, targetProxy );
    // 将实例方法添加到自定义元素上
    moveHuPrototypeToCE( root, target, targetProxy );
  }

  initParent( isCustomElement, target, targetProxy );
  initOptions( isCustomElement, name, target, userOptions );
  initProps( isCustomElement, root, options, target, targetProxy );
  initMethods( isCustomElement, root, options, target, targetProxy );
  initData( options, target, targetProxy );

  // 运行 beforeCreate 生命周期方法
  callLifecycle( targetProxy, 'beforeCreate', options );

  initComputed( options, target, targetProxy );
  initWatch( options, target, targetProxy );

  // 运行 created 生命周期方法
  callLifecycle( targetProxy, 'created', options );

  // 使用 new 创建的实例可以在创建完成后立即进行挂载
  // 使用自定义元素创建的实例会在首次添加到文档流后进行挂载
  if( !isCustomElement && options.el ){
    targetProxy.$mount( options.el );
  }

  return targetProxy;
}