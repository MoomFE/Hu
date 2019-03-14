import Hu from "../../shared/global/Hu/index";
import initOptions from "./initOptions/index";
import init from "./init/index";
import keys from "../../shared/global/Object/keys";
import initAttributeChangedCallback from "./init/initAttributeChangedCallback";
import initConnectedCallback from "./init/initConnectedCallback";
import initDisconnectedCallback from "./init/initDisconnectedCallback";
import initAdoptedCallback from "./init/initAdoptedCallback";
import assign from "../../shared/global/Object/assign";


/**
 * 定义自定义标签
 * @param {string} name 标签名
 * @param {{}} options 组件配置
 */
export default function define( name, userOptions ){

  // 克隆一份用户配置
  userOptions = assign(
    {},
    userOptions
  );

  // 初始化组件配置
  const options = initOptions( userOptions );

  // 创建组件
  const LitElement = class LitElement extends HTMLElement{

    constructor(){
      super();

      this.$hu = init( this, options, userOptions );
    }

  }

  // 定义需要监听的属性
  LitElement.observedAttributes = keys( options.propsMap );

  assign( LitElement.prototype, {
    // 自定义元素被添加到文档流
    connectedCallback: initConnectedCallback( options ),
    // 自定义元素被从文档流移除
    disconnectedCallback: initDisconnectedCallback( options ),
    // 自定义元素位置被移动
    adoptedCallback: initAdoptedCallback( options ),
    // 自定义元素属性被更改
    attributeChangedCallback: initAttributeChangedCallback( options.propsMap )
  });

  // 注册组件
  customElements.define( name, LitElement );
}

Hu.define = define;