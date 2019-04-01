import { isArray } from "../../shared/global/Array/index";
import { filter } from "../../shared/global/Array/prototype";
import addEventListener from "../../shared/util/addEventListener";
import emptyObject from "../../shared/const/emptyObject";


export default class ModelPart{

  constructor( element ){
    const tag = element.nodeName.toLowerCase();
    const type = element.type;
    let handler;

    if( tag === 'select' ){
      handler = handlerSelect;
    }

    this.elem = element;
    this.handler = handler;
  }

  setValue( options ){
    if( !( isArray( options ) && options.length > 1 ) ){
      throw new Error(':model 指令的参数出错, :model 指令不支持此种传参 !');
    }

    this.oldOptions = this.options || emptyObject;
    this.options = options;
  }

  commit(){
    if( this.init || this.oldOptions[0] === this.options[0] && this.oldOptions[1] === this.options[1] ){
      return;
    }

    this.init = true;
    this.handler && this.handler( this, this.elem );
  }

}

function handlerSelect( part, elem ){
  addEventListener( elem, 'change', event => {
    const [ proxy, name ] = part.options;
    const value = filter.call( elem.options, option => option.selected )
                        .map( option => option.value );

    proxy[ name ] = elem.multiple ? value : value[0];
  });
}