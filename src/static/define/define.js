import initOptions from "./initOptions/index";
import init from "./init/index";
import keys from "../../shared/global/Object/keys";
import initAttributeChangedCallback from "./init/initAttributeChangedCallback";
import initDisconnectedCallback from "./init/initDisconnectedCallback";
import initAdoptedCallback from "./init/initAdoptedCallback";
import assign from "../../shared/global/Object/assign";


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
    connectedCallback,
    // 自定义元素被从文档流移除
    disconnectedCallback: initDisconnectedCallback( options ),
    // 自定义元素位置被移动
    adoptedCallback: initAdoptedCallback( options ),
    // 自定义元素属性被更改
    attributeChangedCallback: initAttributeChangedCallback( options.propsMap )
  });

  // 注册组件
  customElements.define( name, HuElement );
}

function connectedCallback(){
  this.$hu.$mount();
}