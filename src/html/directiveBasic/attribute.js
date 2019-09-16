import isNotEqual from "../../shared/util/isNotEqual";
import isIterable from "../../shared/util/isIterable";
import isString from "../../shared/util/isString";
import toString from "../../shared/util/toString";


export default class AttributeCommitter{

  constructor( element, name, strings, modifiers ){
    this.elem = element;
    this.name = name;
    this.strings = strings;
    this.parts = Array.apply( null, { length: this.length = strings.length - 1 } ).map(() => {
      return new AttributePart( this );
    });
  }

  getValue(){
    const { strings, parts, length } = this;
    let index = 0;
    let result = '';

    for( const { value } of parts ){
      result += strings[ index++ ];

      if( value != null && isIterable( value ) && !isString( value ) ){
        for( const item of value ){
          result += toString( item );
        }
        continue;
      }

      result += toString( value );
    }

    return result + strings[ length ];
  }

  commit(){
    this.elem.setAttribute(
      this.name,
      this.getValue()
    );
  }

}

export class AttributePart{

  constructor( committer ){
    this.committer = committer;
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
      this.committer.commit( value );
    }
  }

}