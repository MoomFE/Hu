import Lit from "../../shared/global/Lit/index";
import initOptions from "./initOptions/index";
import init from "./init/index";
import each from "../../shared/util/each";
import entries from "../../shared/polyfill/Object.entries";
import fromEntries from "../../shared/polyfill/Object.fromEntries";
import keys from "../../shared/global/Object/keys";
import returnArg from "../../shared/util/returnArg";


/**
 * 定义自定义标签
 * @param {string} name 标签名
 * @param {{}} options 组件配置
 */
export default function define( name, options ){

  // 初始化组件配置
  options = initOptions( options );

  /**
   * 组件的 prop 与取值 attr 的映射
   */
  const props = fromEntries(
    entries( options.props )
      .filter( entry => entry[1].attr )
      .map( entry => [ entry[1].attr, entry[0] ] )
  );
  
  // 创建组件
  const LitElement = class LitElement extends HTMLElement{

    constructor(){
      super();

      this.$lit = init( this, options );
    }

    attributeChangedCallback( name, oldValue, value ){
      if( value !== oldValue ){
        /** 当前组件 $props 对象 */
        const { $props } = this.$lit;
        /** 被改动的 prop 的名称 */
        const propName = props[ name ];
        /** 被改动的 prop 的配置 */
        const prop = options.props[ propName ];
        /** 格式转换后的 value */
        const newValue = ( prop.from || returnArg )( value );

        if( $props[ propName ] !== newValue ){
          $props[ propName ] = newValue;
        }
      }
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

  // 定义需要监听的属性
  LitElement.observedAttributes = keys( props );

  // 注册组件
  customElements.define( name, LitElement );
}

Lit.define = define;