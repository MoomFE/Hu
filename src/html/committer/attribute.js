import { isDirective } from 'lit-html'
import isEqual from "../../shared/util/isEqual";


export default class AttributeCommitter{

  constructor( element, attr ){
    this.elem = element;
    this.attr = attr;
  }

  setValue( value ){
    if( isDirective( value ) ){
      return value( this );
    }

    this.oldValue = this.value;
    this.value = value;
  }

  commit(){
    const { value, oldValue } = this;

    isEqual( value, oldValue ) || (
      this.elem.setAttribute( this.attr, value )
    );
  }

}