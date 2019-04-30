import { isDirective } from 'lit-html'
import isFunction from "../../shared/util/isFunction";
import { has, apply } from "../../shared/global/Reflect/index";
import { supportsPassive } from "../../shared/const/env";
import removeEventListener from '../../shared/util/removeEventListener';
import addEventListener from '../../shared/util/addEventListener';
import { definedCustomElement } from '../../static/define/const';


export default class BasicEventDirective{

  constructor( element, type, modifierKeys ){
    this.elem = element;
    this.type = type;
    this.opts = initEventOptions( modifierKeys );
    this.isCE = definedCustomElement.get( element.nodeName.toLowerCase() )
  }

  setValue( listener ){
    if( isDirective( listener ) ){
      throw new Error(`@${ this.type } 指令不支持传入指令方法进行使用 !`);
    }

    this.oldListener = this.listener;
    this.listener = isFunction( listener ) ? listener : null;
  }

  commit(){
    const { listener, oldListener } = this;

    // 新的事件绑定与旧的事件绑定不一致
    if( listener !== oldListener ){
      const { elem, type, opts, isCE } = this;
      const { options, modifiers, once, native, add = true } = opts;

      // 移除旧的事件绑定
      // once 修饰符绑定的事件只允许在首次运行回调后自行解绑
      if( oldListener && !once ){
        if( isCE && !native ){
          elem.$off( type, listener );
        }else{
          removeEventListener( elem, type, this.value, options );
        }
      }
      // 添加新的事件绑定
      if( listener && add ){
        // once 修饰符绑定的事件不允许修改
        if( once ) opts.add = false;

        // 绑定的对象是通过 Hu 注册的自定义元素
        if( isCE && !native ){
          elem[ once ? '$once' : '$on' ]( type, listener );
        }else{
          // 生成绑定的方法
          const value = this.value = function callback( event ){
            // 修饰符检测
            for( let modifier of modifiers ){
              if( modifier( elem, event, modifiers ) === false ) return;
            }
            // 只执行一次
            if( once ){
              removeEventListener( elem, type, callback, options );
            }
            // 修饰符全部检测通过, 执行用户传入方法
            apply( listener, this, arguments );
          };
          // 注册事件
          addEventListener( elem, type, value, options );
        }
      }
    }
  }

}

function initEventOptions( modifierKeys ){
  const options = {};
  const modifiers = [];

  for( let name of modifierKeys ){
    if( eventOptions[ name ] ) options[ name ] = true;
    else if( eventModifiers[ name ] ) modifiers.push( eventModifiers[ name ] );
  }

  modifiers.keys = modifierKeys;

  const { once, passive, capture, native } = options;

  return {
    once,
    native,
    options: passive ? { passive, capture } : capture,
    modifiers
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