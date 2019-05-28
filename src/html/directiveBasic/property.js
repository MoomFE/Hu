import isSingleBind from "../util/isSingleBind";
import isNotEqual from "../../shared/util/isNotEqual";


export default class BasicPropertyDirective{

  constructor( element, name, strings, modifiers ){
    if( !isSingleBind( strings ) ){
      throw new Error('.prop 指令的传值只允许包含单个表达式 !');
    }

    this.elem = element;
    this.name = name;
  }

  commit( value, isDirectiveFn ){
    // 用户传递的是指令方法
    // 交给指令方法处理
    if( isDirectiveFn ) return value( this );
    // 两次传入的值不同
    if( isNotEqual( value, this.value ) ){
      // 存储当前值
      this.value = value;
      // 更新属性值
      this.elem[ this.name ] = value;
    }
  }

}