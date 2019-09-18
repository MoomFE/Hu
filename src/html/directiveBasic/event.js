import isSingleBind from "../util/isSingleBind";
import isFunction from "../../shared/util/isFunction";
import addEventListener from "../../shared/util/addEventListener";
import removeEventListener from "../../shared/util/removeEventListener";
import { keys } from "../../shared/global/Object/index";
import { supportsPassive } from "../../shared/const/env";
import { isArray } from "../../shared/global/Array/index";
import { definedCustomElement, activeCustomElement } from "../../static/define/const";
import { apply, has } from "../../shared/global/Reflect/index";


export default class BasicEventDirective{

  constructor( element, type, strings, modifiers ){
    if( !isSingleBind( strings ) ){
      throw new Error('@event 指令的传值只允许包含单个表达式 !');
    }

    this.elem = element;
    this.type = type;
    const options = this.opts = this.init( modifiers );
    const isCE = this.isCE = definedCustomElement.has(
      element.nodeName.toLowerCase()
    );

    this.addEvent( element, type, options, isCE, this );
  }

  commit( value, isDirectiveFn ){
    // 用户传递的是指令方法
    // 交给指令方法处理
    if( isDirectiveFn ) return value( this );
    // 保存传入的事件
    this.value = value;
  }

  /**
   * 事件绑定
   * @param {Element} element 需要绑定事件的 DOM 元素
   * @param {String} type 需要绑定的事件名称
   * @param {{}} options 事件参数
   * @param {Boolean} isCE 绑定事件的 DOM 元素是否是自定义元素组件
   * @param {BasicEventDirective} self 当前指令对想
   */
  addEvent( element, type, { once, native, options, modifiers }, isCE, self ){
    // 绑定的对象是注册的自定义元素
    if( isCE && !native ){
      const instance = activeCustomElement.get( element );
      const fn = once ? '$once' : '$on';

      instance[ fn ]( type, this.listener = function( ...args ){
        isFunction( self.value ) && apply( self.value, this, args );
      });
    }
    // 绑定的对象是正常 DOM 元素
    else addEventListener(
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

  /**
   * 初始化用户传入的修饰符
   * @param {{}} modifiers 用户传入的所有修饰符
   */
  init( modifiers ){
    /** 使用的事件可选参数 */
    const usingEventOptions = {};
    /** 使用的修饰符处理方法 */
    const usingModifiers = [];
    /** 使用的按键码修饰符 */
    const usingKeys = [];
    /** 所有修饰符的数组 */
    const modifierKeys = usingModifiers.keys = keys( modifiers );

    // 寻找相应的修饰符处理方法
    modifierKeys.forEach( name => {
      // 事件可选参数
      if( eventOptions[ name ] ) usingEventOptions[ name ] = true;
      // 功能性事件修饰符
      else if( eventModifiers[ name ] ){
        usingModifiers.push( eventModifiers[ name ] );

        // left / right
        if( keyNames[ name ] ){
          usingKeys.push( name );
        }
      }
      // 按键码修饰符
      else if( keyNames[ name ] ){
        usingKeys.push( name );
      }
    });

    // 处理按键码修饰符
    if( usingKeys.length ) usingModifiers.push(
      keysCheck( usingKeys)
    );

    const { once, capture, passive, native } = usingEventOptions;

    return {
      once,
      native,
      options: passive ? { passive, capture } : capture,
      modifiers: usingModifiers
    };
  }

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
 * 功能性事件修饰符 - 鼠标按钮
 */
[ 'left', 'middle', 'right' ].forEach(( button, index ) => {
  eventModifiers[ button ] = ( elem, event ) => {
    if( has( event, 'button' ) ){
      if( event.button !== index ) return false;
    }
  }
});

/**
 * 功能性事件修饰符 - 系统修饰键
 */
[ 'ctrl', 'alt', 'shift', 'meta' ].forEach( key => {
  eventModifiers[ key ] = ( elem, event ) => {
    return !!event[ key + 'Key' ];
  }
});

/**
 * 按键码
 */
const keyNames = {
  esc: 'Escape',
  tab: 'Tab',
  enter: 'Enter',
  space: ' ',
  up: 'Up',
  left: 'Left',
  right: 'Right',
  down: 'Down',
  delete: [ 'Backspace', 'Delete' ]
};

/**
 * 按键码处理
 * @param {string[]} keys 
 */
function keysCheck( keys ){
  return ( elem, event ) => {
    if( !event.type.indexOf('key') ) for( let key of keys ){
      const value = keyNames[ key ];

      if( isArray( value ) ? value.indexOf( event.key ) === -1 : value !== event.key ){
        return false;
      }
    }
  };
}