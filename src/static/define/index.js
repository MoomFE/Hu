import Hu from "../../shared/global/Hu/index";
import initOptions from "./initOptions/index";
import init from "./init/index";
import keys from "../../shared/global/Object/keys";
import initAttributeChangedCallback from "./init/initAttributeChangedCallback";


/**
 * 定义自定义标签
 * @param {string} name 标签名
 * @param {{}} options 组件配置
 */
export default function define( name, options ){

  // 初始化组件配置
  options = initOptions( options || {} );

  // 创建组件
  const LitElement = class LitElement extends HTMLElement{

    constructor(){
      super();

      this.$hu = init( this, options );
    }

    connectedCallback(){
      const { $hu } = this;

      options.beforeMount.call( $hu );
      $hu.$forceUpdate();
      options.mounted.call( $hu );
    }

    disconnectedCallback(){

    }

    adoptedCallback(){

    }

  }

  // 定义需要监听的属性
  LitElement.observedAttributes = keys( options.propsMap );
  // 监听属性更改
  LitElement.prototype.attributeChangedCallback = initAttributeChangedCallback( options.propsMap );

  // 注册组件
  customElements.define( name, LitElement );
}

Hu.define = define;