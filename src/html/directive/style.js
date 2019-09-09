import isSingleBind from "../util/isSingleBind";
import parseStyleText from "../../shared/util/parseStyleText";
import { isArray } from "../../shared/global/Array/index";
import each from "../../shared/util/each";
import hyphenate from "../../shared/util/hyphenate";
import { has } from "../../shared/global/Reflect/index";


/**
 * 存放上次设置的 style 内容
 */
const styleMap = new WeakMap();


export default class StyleDirective{

  constructor( element, strings, modifiers ){
    if( !isSingleBind( strings ) ){
      throw new Error(':style 指令的传值只允许包含单个表达式 !');
    }

    this.elem = element;
  }

  commit( value, isDirectiveFn ){
    // 用户传递的是指令方法
    // 交给指令方法处理
    if( isDirectiveFn ) return value( this );

    /** 转为对象形式的 styles */
    const styles = this.parse( value );
    /** 当前元素的 style 对象 */
    const style = this.elem.style;
    /** 上次设置的 styles */
    const oldStyles = styleMap.get( this );

    // 移除旧 style
    //  - 如果没有上次设置的 styles, each 方法内回调是不会被执行的
    each( oldStyles, ( name, value ) => {
      has( styles, name ) || style.removeProperty( name );
    });
    // 添加 style
    each( styles, ( name, value ) => {
      style.setProperty( name, value );
    });

    // 保存最新的 styles
    styleMap.set( this, styles );
  }

  /**
   * 格式化用户传入的 style 内容
   */
  parse( value, styles = {} ){

    // 处理不同类型的 styles 内容
    switch( typeof value ){
      case 'string': return this.parse(
        parseStyleText( value ),
        styles
      );
      case 'object': {
        if( isArray( value  ) ){
          value.forEach( value => {
            return this.parse( value, styles );
          });
        }else{
          each( value, ( name, value ) => {
            return styles[ hyphenate( name ) ] = value;
          });
        }
      }
    }

    return styles;
  }

}