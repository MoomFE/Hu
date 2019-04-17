import { isDirective } from 'lit-html'
import isEqual from '../../shared/util/isEqual';


export default class TextDirective{

  constructor( element ){
    this.elem = element;
  }

  setValue( value ){
    if( isDirective( value ) ){
      return value( this, true );
    }

    this.oldValue = this.value;
    this.value = value;
  }

  commit(){
    const { value, oldValue } = this;

    isEqual( value, oldValue ) || (
      this.elem.innerText = value
    );
  }

}