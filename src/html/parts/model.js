import { isArray } from "../../shared/global/Array/index";
import { filter } from "../../shared/global/Array/prototype";
import addEventListener from "../../shared/util/addEventListener";
import $watch from "../../shared/global/Hu/prototype/$watch";
import { observe } from "../../static/observable/observe";
import { assign } from "../../shared/global/Object/index";
import getAttribute from "../../shared/util/getAttribute";
import isFunction from "../../shared/util/isFunction";
import triggerEvent from "../../shared/util/triggerEvent";


export default class ModelPart{

  constructor( element ){
    const tag = element.nodeName.toLowerCase();
    const type = element.type;
    let handler;

    if( tag === 'select' ){
      handler = handlerSelect;
    }else if( tag === 'input' && type === 'checkbox' ){
      handler = handlerCheckbox;
    }else if( tag === 'input' && type === 'radio' ){
      handler = handlerRadio;
    }else if( tag === 'input' || tag === 'textarea' ){
      handler = handlerDefault;
    }

    this.elem = element;
    this.handler = handler;
  }

  setValue( options ){
    if( !( isArray( options ) && options.length > 1 ) ){
      throw new Error(':model 指令的参数出错, :model 指令不支持此种传参 !');
    }

    this.options = assign(
      this.options || observe([]),
      options
    );
  }

  commit(){
    if( this.init || !this.handler ) return;

    const { elem, options } = this;

    this.init = true;
    this.handler( elem, options );
  }

}

function watch( options, elem, callbackOrProps ){
  $watch(
    () => options[ 0 ][ options[ 1 ] ],
    isFunction( callbackOrProps )
      ? callbackOrProps
      : ( value ) => elem[ callbackOrProps ] = value,
    {
      immediate: true
    }
  );
}

function handlerSelect( elem, options ){
  // 监听绑定值改变
  watch( options, elem, 'value' );
  // 监听控件值改变
  addEventListener( elem, 'change', event => {
    const [ proxy, name ] = options;
    const value = filter.call( elem.options, option => option.selected )
                        .map( option => option.value );

    proxy[ name ] = elem.multiple ? value : value[0];
  });
}

function handlerCheckbox( elem, options ){
  // 监听绑定值改变
  watch( options, elem, 'checked' );
  // 监听控件值改变
  addEventListener( elem, 'change', event => {
    const [ proxy, name ] = this.options;
    proxy[ name ] = elem.checked;
  });
}

function handlerRadio( elem, options ){
  // 监听绑定值改变
  watch( options, elem, value => {
    elem.checked = value == ( getAttribute( elem, 'value' ) || null );
  });
  // 监听控件值改变
  addEventListener( elem, 'change', event => {
    const [ proxy, name ] = this.options;
    proxy[ name ] = getAttribute( elem, 'value' ) || null;
  });
}

function handlerDefault( elem, options ){
  // 监听绑定值改变
  watch( options, elem, 'value' );
  // 监听控件值改变
  addEventListener( 'compositionstart', event => {
    elem.composing = true;
  });
  addEventListener( 'compositionend', event => {
    if( !elem.composing ) return;

    elem.composing = false;
    triggerEvent( elem, 'input' );
  });
  addEventListener( elem, 'input', event => {
    if( elem.composing ) return;

    const [ proxy, name ] = this.options;
    proxy[ name ] = elem.value;
  });
}