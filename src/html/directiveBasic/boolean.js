import isDirectiveFn from "../util/isDirectiveFn";


export default class BasicBooleanDirective{

  constructor( element, attr ){
    this.elem = element;
    this.attr = attr;
  }

  setValue( value ){
    if( isDirectiveFn( value ) ){
      return value( this );
    }

    this.oldValue = this.value;
    this.value = value;
  }

  commit(){
    const value = this.value = !!this.value;
    const oldValue = this.oldValue;

    if( value !== oldValue ){
      if( value ){
        this.elem.setAttribute( this.attr , '' );
      }else{
        this.elem.removeAttribute( this.attr );
      }
    }
  }

}