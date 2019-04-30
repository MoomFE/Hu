import initOptions from "./initOptions/index";
import init from "./init/index";
import { keys } from "../../shared/global/Object/index";
import initAttributeChangedCallback from "./init/initAttributeChangedCallback";
import initDisconnectedCallback from "./init/initDisconnectedCallback";
import initAdoptedCallback from "./init/initAdoptedCallback";
import { assign } from "../../shared/global/Object/index";
import initConnectedCallback from "./init/initConnectedCallback";
import $on, { $once, $off } from "../../core/prototype/$on";
import { definedCustomElement } from "./const";


/**
 * 定义自定义元素
 * @param {string} name 标签名
 * @param {{}} _userOptions 组件配置
 */
export default function define( name, _userOptions ){

  const [ userOptions, options ] = initOptions( true, name, _userOptions );

  class HuElement extends HTMLElement{
    constructor(){
      super();

      this.$hu = init( true, this, name, options, userOptions );
    }
  }

  // 定义需要监听的属性
  HuElement.observedAttributes = keys( options.propsMap );

  assign( HuElement.prototype, {
    // 自定义元素被添加到文档流
    connectedCallback: initConnectedCallback( options ),
    // 自定义元素被从文档流移除
    disconnectedCallback: initDisconnectedCallback( options ),
    // 自定义元素位置被移动
    adoptedCallback: initAdoptedCallback( options ),
    // 自定义元素属性被更改
    attributeChangedCallback: initAttributeChangedCallback( options.propsMap ),
    // 自定义元素实例上的事件处理相关方法
    $on,
    $once,
    $off
  });

  // 注册组件
  customElements.define( name, HuElement );
  // 标记组件已注册
  definedCustomElement.set( name, true );
}