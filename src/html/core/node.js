import isDirective from "../util/isDirective";
import isEqual from "../../shared/util/isEqual";
import isPrimitive from "../../shared/util/isPrimitive";



export default class NodePart{

  constructor( options ){
    this.options = options;
  }

  setValue(){
    if( isDirective( value ) ){
      return value( this );
    }

    this.oldValue = this.value;
    this.value = value;
  }

  commit(){
    const { value, oldValue } = this;

    if( isEqual( value, oldValue ) ){
      return;
    }

    if( isPrimitive( value ) ){

    }
  }

};