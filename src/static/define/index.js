import Lit from "../../shared/global/Lit/index";
import initOptions from "./initOptions/index";
import init from "./init/index";


/**
 * 定义自定义标签
 * @param {string} name 标签名
 * @param {{}} options 组件配置
 */
export default function define( name, options ){

  // 初始化组件配置
  options = initOptions( options );

  // 创建组件
  const LitElement = class LitElement extends HTMLElement{

    constructor(){
      super();

      this.$lit = init( this, options );
    }

    attributeChangedCallback( name, value, oldValue ){

    }

    connectedCallback(){
      console.log('connectedCallback');
    }

    disconnectedCallback(){
      console.log('disconnectedCallback');
    }

    adoptedCallback(){
      console.log('adoptedCallback');
    }

  }

  // 注册组件
  customElements.define( name, LitElement );
}

Lit.define = define;