import isSingleBind from "../util/isSingleBind";
import { definedCustomElement, activeCustomElement } from "../../static/define/const";
import { keys } from "../../shared/global/Object/index";
import { supportsPassive } from "../../shared/const/env";
import isFunction from "../../shared/util/isFunction";
import { apply, has } from "../../shared/global/Reflect/index";
import addEventListener from "../../shared/util/addEventListener";
import removeEventListener from "../../shared/util/removeEventListener";


export default class BasicEventDirective{

  constructor( element, type, strings, modifiers ){
    if( !isSingleBind( strings ) ){
      throw new Error('@event 指令的传值只允许包含单个表达式 !');
    }

    const options = this.opts = initEventOptions( modifiers );
    const isCE = this.isCE = definedCustomElement.has(
      element.nodeName.toLowerCase()
    );

    this.elem = element;
    this.type = type;

    this.addEvent( element, type, options, isCE, this );
  }

  addEvent( element, type, { once, native, options, modifiers }, isCE, self ){
    // 绑定的对象是通过 Hu 注册的自定义元素
    if( isCE && !native ){
      const instance = activeCustomElement.get( element );
      const fn = once ? '$once' : '$on';

      instance[ fn ]( type, this.listener = function( ...args ){
        isFunction( self.value ) && apply( self.value, this, args );
      });
    }
    // 绑定事件在正常元素上
    else{
      addEventListener(
        element, type,
        this.listener = function listener( event ){
          // 修饰符检测
          for( const modifier of modifiers ){
            if( modifier( element, event, modifiers ) === false ) return;
          }
          // 只执行一次
          if( once ){
            removeEventListener( element, type, listener, options );
          }
          // 修饰符全部检测通过, 执行用户传入方法
          isFunction( self.value ) && apply( self.value, this, arguments );
        },
        options
      );
    }
  }

  commit( value, isDirectiveFn ){
    // 用户传递的是指令方法
    // 交给指令方法处理
    if( isDirectiveFn ) return value( this );
    // 保存传入的事件
    this.value = value;
  }

}


/**
 * 处理事件相关参数
 */
function initEventOptions( modifiers ){
  const usingEventOptions = {};
  const usingEventModifiers = [];
  const modifierKeys = usingEventModifiers.keys = keys( modifiers );

  for( let name of modifierKeys ){
    if( eventOptions[ name ] ) usingEventOptions[ name ] = true;
    else if( eventModifiers[ name ] ) usingEventModifiers.push( eventModifiers[ name ] );
  }

  const { once, passive, capture, native } = usingEventOptions;

  return {
    once,
    native,
    options: passive ? { passive, capture } : capture,
    modifiers: usingEventModifiers
  };
}


/**
 * 事件可选参数
 */
const eventOptions = {
  once: true,
  capture: true,
  passive: supportsPassive,
  native: true
};


/**
 * 功能性事件修饰符
 */
const eventModifiers = {

  /**
   * 阻止事件冒泡
   */
  stop( elem, event ){
    event.stopPropagation();
  },

  /**
   * 阻止浏览器默认事件
   */
  prevent( elem, event ){
    event.preventDefault();
  },

  /**
   * 只在当前元素自身时触发事件时
   */
  self( elem, event ){
    return event.target === elem;
  },

  /**
   * 系统修饰键限定符
   */
  exact( elem, event, { keys } ){
    const modifierKey = [ 'ctrl', 'alt', 'shift', 'meta' ].filter( key => {
      return keys.indexOf( key ) < 0;
    });

    for( let key of modifierKey ){
      if( event[ key + 'Key' ] ) return false;
    }
    return true;
  }

};

/**
 * 鼠标按钮
 */
[ 'left', 'middle', 'right' ].forEach(( button, index ) => {
  eventModifiers[ button ] = ( elem, event ) => {
    return has( event, 'button' ) && event.button === index;
  }
});

/**
 * 系统修饰键
 */
[ 'ctrl', 'alt', 'shift', 'meta' ].forEach( key => {
  eventModifiers[ key ] = ( elem, event ) => {
    return !!event[ key + 'Key' ];
  }
});