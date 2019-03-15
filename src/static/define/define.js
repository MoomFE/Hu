import initOptions from "./initOptions/index";
import init from "./init/index";
import keys from "../../shared/global/Object/keys";
import initAttributeChangedCallback from "./init/initAttributeChangedCallback";
import initConnectedCallback from "./init/initConnectedCallback";
import initDisconnectedCallback from "./init/initDisconnectedCallback";
import initAdoptedCallback from "./init/initAdoptedCallback";
import assign from "../../shared/global/Object/assign";


/**
 * 定义自定义元素
 * @param {string} name 标签名
 * @param {{}} userOptions 组件配置
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

      this.$hu = init( true, this, options, name, userOptions );
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

/**
 * 用于构建非自定义元素的 Hu 实例
 * @param {{}} userOptions 
 */
export function defineInstance( userOptions ){

  // 克隆一份用户配置
  userOptions = assign(
    {},
    userOptions
  );

  // 初始化组件配置
  const options = initOptions( userOptions );

  // 创建实例
  const $hu = init( false, this, options, name, userOptions );

  return $hu;
}