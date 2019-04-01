import { isArray } from "../../shared/global/Array/index";
import { filter } from "../../shared/global/Array/prototype";
import addEventListener from "../../shared/util/addEventListener";
import emptyObject from "../../shared/const/emptyObject";
import $watch from "../../shared/global/Hu/prototype/$watch";


export default class ModelPart{

  constructor( element ){
    const tag = element.nodeName.toLowerCase();
    const type = element.type;
    let handler;
    let key = 'value';

    if( tag === 'select' ){
      handler = handlerSelect;
    }else if( tag === 'input' && type === 'checkbox' ){
      key = 'checked';
      handler = handlerCheckbox;
    }

    this.elem = element;
    this.key = key;
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
    const { options, oldOptions } = this;

    if( !this.handler || oldOptions[0] === options[0] && oldOptions[1] === options[1] ){
      return;
    }

    const { elem, key } = this;

    if( this.unWatch ){
      this.unWatch();
      this.watch( elem, key, options );
    }else{
      this.handler( elem );
      this.watch( elem, key, options );
    }
  }

  watch( elem, key, options ){
    this.unWatch = $watch(
      () => options[0][ options[1] ],
      ( value ) => elem[ key ] = value,
      { immediate: true }
    );
  }

}

function handlerSelect( elem ){
  addEventListener( elem, 'change', event => {
    const [ proxy, name ] = this.options;
    const value = filter.call( elem.options, option => option.selected )
                        .map( option => option.value );

    proxy[ name ] = elem.multiple ? value : value[0];
  });
}

function handlerCheckbox( elem ){
  addEventListener( elem, 'change', event => {
    const [ proxy, name ] = this.options;
    proxy[ name ] = elem.checked;
  });
}