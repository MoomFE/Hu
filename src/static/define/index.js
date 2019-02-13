import Lit from "../../shared/global/Lit/index";
import initOptions from "./initOptions/index";
import init from "./init/index";
import each from "../../shared/util/each";


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

    static get observedAttributes(){
      const attributes = [];

      each( options.props, ( name, options ) => {
        if( options.attr ) attributes.push( options.attr );
      });

      return attributes;
    }

    attributeChangedCallback( name, value, oldValue ){
      console.log( name, value, oldValue )
      // if( value !== oldValue ){
        // console.log( options )
      // }
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