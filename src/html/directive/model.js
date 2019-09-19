import isSingleBind from "../util/isSingleBind";
import { isArray } from "../../shared/global/Array/index";
import { safety } from "../../static/observable/const";
import { observe } from "../../static/observable/observe";
import addEventListener from "../../shared/util/addEventListener";
import { filter } from "../../shared/global/Array/prototype";
import isFunction from "../../shared/util/isFunction";
import $watch from "../../core/prototype/$watch";
import getAttribute from "../../shared/util/getAttribute";
import { apply } from "../../shared/global/Reflect/index";
import removeEventListener from "../../shared/util/removeEventListener";
import { directiveFns } from "../../static/directiveFn/const/index";
import { BindDirectiveFnClass } from "../directiveFn/bind";


export default class ModelDirective{

  constructor( element, strings, modifiers ){
    if( !isSingleBind( strings ) ){
      throw new Error(':model 指令的传值只允许包含单个表达式 !');
    }

    const tag = element.nodeName.toLowerCase();
    const type = element.type;
    let handler;

    // 选择框
    if( tag === 'select' ){
      handler = handlerSelect;
    }
    // 复选框
    else if( tag === 'input' && type === 'checkbox' ){
      handler = handlerCheckbox;
    }
    // 单选框
    else if( tag === 'input' && type === 'radio' ){
      handler = handlerRadio;
    }
    // 普通文本框
    else if( tag === 'input' || tag === 'textarea' ){
      handler = handlerDefault;
    }

    this.elem = element;
    this.handler = handler;
    this.events = [];
  }

  commit( value, isDirectiveFn ){
    let directiveFnInfo;

    // 支持传入 bind 进行绑定
    if( isDirectiveFn && ( directiveFnInfo = directiveFns.get( value ) ).directive === BindDirectiveFnClass ){
      value = directiveFnInfo.args;
    }else if( isDirectiveFn || !( isArray( value ) && value.length > 1 ) ){
      throw new Error(':model 指令的参数出错, 不支持此种传参 !');
    }

    let init;
    let handler;
    let options;

    // 有双向绑定处理函数
    // 说明在可处理的元素范围内
    if( handler = this.handler ){

      safety(() => {
        options = this.options || (
          this.options = observe([])
        );
  
        options.splice( 0, 2, ...value );
  
        if( init = this.init ){
          this.set( value[ 0 ][ value[ 1 ] ] );
        }
      });

      // 若未初始化过监听, 则进行初始化
      if( !init ){
        this.init = true;
        handler( this, this.elem, options );
      }
    }
  }

  destroy(){
    // 解绑值监听绑定值
    if( this.init ){
      // 清除值绑定
      this.unWatch();
      // 清除事件绑定
      this.events.forEach( args => {
        apply( removeEventListener, null, args );
      });
    }
  }

}


function watch( model, options, element, prop ){
  /**
   * 监听到绑定的值被更改后
   * 给绑定的对象赋值的方法
   */
  const set = isFunction( prop ) ? prop : value => element[ prop ] = value;

  // 若后续绑定对象发生更改, 需要调用方法立即更新
  model.set = set;
  // 监听绑定的值
  model.unWatch = $watch(
    // 监听绑定的值
    () => options[ 0 ][ options[ 1 ] ],
    // 响应绑定值更改
    value => set( value ),
    // 立即响应
    { immediate: true }
  );
}

function addEvent( model, ...args ){
  // 存储事件
  model.events.push( args );
  // 绑定事件
  apply( addEventListener, null, args )
}




/**
 * 对 select 元素进行双向绑定
 * @param {ModelDirective} model 
 * @param {Element} element 
 * @param {[ {}, string ]} options 
 */
function handlerSelect( model, element, options ){
  // 监听绑定值改变
  watch( model, options, element, 'value' );
  // 监听控件值改变
  addEvent( model, element, 'change', event => {
    const value = filter.call( element.options, option => option.selected ).map( option => option.value );
    options[ 0 ][ options[ 1 ] ] = element.multiple ? value : value[0];
  });
}

/**
 * 对 input[ type = "checkbox" ] 元素进行双向绑定
 * @param {ModelDirective} model 
 * @param {Element} element 
 * @param {[ {}, string ]} options 
 */
function handlerCheckbox( model, element, options ){
  // 监听绑定值改变
  watch( model, options, element, 'checked' );
  // 监听控件值改变
  addEvent( model, element, 'change', event => {
    options[ 0 ][ options[ 1 ] ] = element.checked;
  });
}

/**
 * 对 input[ type = "radio" ] 元素进行双向绑定
 * @param {ModelDirective} model 
 * @param {Element} element 
 * @param {[ {}, string ]} options 
 */
function handlerRadio( model, element, options ){
  // 监听绑定值改变
  watch( model, options, element, value => {
    element.checked = value === ( getAttribute( element, 'value' ) || null );
  });
  // 监听控件值改变
  addEvent( model, element, 'change', event => {
    options[ 0 ][ options[ 1 ] ] = getAttribute( element, 'value' ) || null;
  });
}

/**
 * 对 input, textarea 元素进行双向绑定
 * @param {ModelDirective} model 
 * @param {Element} element 
 * @param {[ {}, string ]} options 
 */
function handlerDefault( model, element, options, input ){
  // 监听绑定值改变
  watch( model, options, element, 'value' );
  // 监听控件值改变
  addEvent( model, element, 'compositionstart', () => {
    element.composing = true;
  });
  addEvent( model, element, 'compositionend', () => {
    if( !element.composing ) return;

    element.composing = false;
    input();
  });
  addEvent( model, element, 'input', input = () => {
    if( element.composing || !options.length ) return;

    options[ 0 ][ options[ 1 ] ] = element.value;
  });
}