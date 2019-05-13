import { isArray } from "../../shared/global/Array/index";
import each from "../../shared/util/each";
import parseStyleText from "../../shared/util/parseStyleText";
import hyphenate from "../../shared/util/hyphenate";
import { has } from "../../shared/global/Reflect/index";
import ClassDirective from './class';


/**
 * 存放上次设置的 style 内容
 */
const styleMap = new WeakMap();


export default class StyleDirective extends ClassDirective{

  commit(){
    const { value: styles, elem: { style } } = this;
    const oldStyles = styleMap.get( this );

    // 移除旧 style
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
  parse( styles, value ){
    switch( typeof value ){
      case 'string': {
        return this.parse(
          styles,
          parseStyleText( value )
        );
      };
      case 'object': {
        if( isArray( value ) ){
          value.forEach( value => {
            return this.parse( styles, value );
          });
        }else{
          each( value, ( name, value ) => {
            return styles[ hyphenate( name ) ] = value;
          });
        }
      }
    }
  }

}