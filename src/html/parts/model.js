import { isArray } from "../../shared/global/Array/index";
import { filter } from "../../shared/global/Array/prototype";
import addEventListener from "../../shared/util/addEventListener";
import $watch from "../../core/prototype/$watch";
import { observe } from "../../static/observable/observe";
import getAttribute from "../../shared/util/getAttribute";
import isFunction from "../../shared/util/isFunction";
import triggerEvent from "../../shared/util/triggerEvent";
import { renderStack, modelDirectiveCacheMap } from "../const";
import { apply } from "../../shared/global/Reflect/index";
import emptyObject from "../../shared/const/emptyObject";
import { popTarget, pushTarget } from "../../static/observable/const";


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

    pushTarget();

    const optionsProxy = this.options || (
      this.options = observe([])
    );

    optionsProxy.splice( 0, 2, ...options );

    popTarget();

    // 当前渲染元素
    const rendering = renderStack[ renderStack.length - 1 ];
    // 当前渲染元素使用的双向数据绑定信息
    let modelParts = modelDirectiveCacheMap.get( rendering );

    if( !modelParts ){
      modelParts = [];
      modelDirectiveCacheMap.set( rendering, modelParts );
    }

    modelParts.push( this );
  }

  commit(){
    if( this.init || !this.handler ) return;

    const { elem, options } = this;

    this.init = true;
    this.handler( elem, options );
  }

}

function watch( options, elem, callbackOrProps ){
  apply( $watch, this, [
    () => {
      return options.length ? options[0][ options[1] ]
                            : emptyObject;
    },
    function( value ){
      value !== emptyObject && apply(
        isFunction( callbackOrProps ) ? callbackOrProps : ( value ) => elem[ callbackOrProps ] = value,
        this,
        arguments
      );
    },
    {
      immediate: true
    }
  ]);
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
  addEventListener( elem, 'compositionstart', event => {
    elem.composing = true;
  });
  addEventListener( elem, 'compositionend', event => {
    if( !elem.composing ) return;

    elem.composing = false;
    triggerEvent( elem, 'input' );
  });
  addEventListener( elem, 'input', event => {
    if( elem.composing || !options.length ) return;

    const [ proxy, name ] = this.options;
    proxy[ name ] = elem.value;
  });
}