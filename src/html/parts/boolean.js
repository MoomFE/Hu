import { isDirective } from "lit-html";


export default class BooleanPart{

  constructor( element, attr ){
    this.elem = element;
    this.attr = attr;
  }

  setValue( value ){
    if( isDirective( value ) ){
      return value( this );
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