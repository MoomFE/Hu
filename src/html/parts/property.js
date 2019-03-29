import { isDirective } from "lit-html";
import isEqual from "../../shared/util/isEqual";


export default class PropertyPart{

  constructor( element, attr ){
    this.elem = element;
    this.attr = attr;
  }

  setValue( value ){
    if( isDirective( value ) ){
      throw new Error(`.${ this.attr } 指令不支持传入指令方法进行使用 !`);
    }

    this.oldValue = this.value;
    this.value = value;
  }

  commit(){
    const { value, oldValue } = this;

    isEqual( value, oldValue ) || (
      this.elem[ this.attr ] = value
    );
  }
}