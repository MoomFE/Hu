import { isDirective } from 'lit-html'
import isEqual from "../../shared/util/isEqual";
import { isArray } from '../../shared/global/Array/index';
import isString from '../../shared/util/isString';


export default class AttributeCommitter{

  constructor(){
    [
      this.elem,
      this.attr,
      this.strings
    ] = arguments;
    this.parts = this.createParts();
  }

  createParts(){
    return Array.apply( null, { length: this.strings.length - 1 } ).map(() => {
      return new AttributePart( this );
    });
  }

  getValue(){
    const { strings, parts } = this;
    const length = strings.length - 1;
    let result = '';

    for( let index = 0, part; index < length; index++ ){
      result += strings[ index ];

      if( part = parts[ index ] ){
        const value = part.value;

        if( value != null ){
          if( isArray( value ) || !isString( value ) && value[ Symbol.iterator ] ){
            for( let item of value ){
              result += isString( item ) ? item : String( item );
            }
            continue;
          }
        }
        result += isString( value ) ? value : String( value );
      }
    }

    return result + strings[ length ];
  }

  commit(){
    this.elem.setAttribute(
      this.attr,
      this.getValue()
    );
  }

}


class AttributePart{

  constructor( committer ){
    this.committer = committer;
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
      this.committer.commit( this.value = value )
    );
  }

}