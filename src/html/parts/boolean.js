import { isDirective } from "lit-html";


export default class BooleanPart{

  constructor( element, attr ){
    this.elem = element;
    this.attr = attr;
  }

  setValue( value ){
    if( isDirective( value ) ){
      throw new Error(`?${ this.attr } 指令不支持传入指令方法进行使用 !`);
    }

    this.oldValue = this.value;
    this.value = !!value;
  }

  commit(){
    const { value, oldValue } = this;

    if( value !== oldValue ){
      if( value ){
        this.elem.setAttribute( this.attr , '' );
      }else{
        this.elem.removeAttribute( this.attr );
      }
    }
  }

}