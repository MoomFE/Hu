import isSingleBind from "../util/isSingleBind";
import { has } from "../../shared/global/Reflect/index";
import isNotEqual from "../../shared/util/isNotEqual";


export default class ShowDirective{

  constructor( element, strings, modifiers ){
    if( !isSingleBind( strings ) ){
      throw new Error(':text 指令的传值只允许包含单个表达式 !');
    }

    this.elem = element;
  }

  commit( value, isDirectiveFn ){
    // 用户传递的是指令方法
    // 交给指令方法处理
    if( isDirectiveFn ) return value( this );
    // 首次设置值或两次传入的值不同
    if( !has( this, 'value' ) || isNotEqual( value, this.value ) ){
      this.value = value;
      this.elem.style.display = value ? '' : 'none'
    }
  }

}