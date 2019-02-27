import Hu from "../../shared/global/Hu/index";
import initOptions from "./initOptions/index";
import init from "./init/index";
import keys from "../../shared/global/Object/keys";
import isEqual from "../../shared/util/isEqual";


/**
 * 定义自定义标签
 * @param {string} name 标签名
 * @param {{}} options 组件配置
 */
export default function define( name, options ){

  // 初始化组件配置
  options = initOptions( options || {} );

  /**
   * 组件的 prop 与取值 attr 的映射
   */
  const propsMap = options.propsMap;

  // 创建组件
  const LitElement = class LitElement extends HTMLElement{

    constructor(){
      super();

      this.$hu = init( this, options );
    }

    attributeChangedCallback( name, oldValue, value ){
      if( value !== oldValue ){
        /** 当前组件 $props 对象 */
        const { $props } = this.$hu;
        /** 当前属性被改动后需要修改的对应 prop */
        const props = propsMap[ name ];

        for( const { name, from } of props ){
          /** 格式转换后的 value */
          const fromValue = from( value );

          if( !isEqual( $props[ name ], fromValue ) ){
            $props[ name ] = fromValue;
          }
        }
      }
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
  LitElement.observedAttributes = keys( propsMap );

  // 注册组件
  customElements.define( name, LitElement );
}

Hu.define = define;