import isFunction from "../../shared/util/isFunction";
import { has } from "../../shared/global/Reflect/index";


export default class EventPart{

  constructor( element, type, eventContext, modifierKeys ){
    this.elem = element;
    this.type = type;
    this.options = initEventOptions( modifierKeys );
  }

  setValue( listener ){
    this.oldListener = this.listener;
    this.listener = isFunction( listener ) ? listener : null;
  }

  commit(){
    const {
      listener, oldListener,
      options: {
        options, modifiers
      }
    } = this;

    // 新的事件绑定与旧的事件绑定不一致
    if( listener !== oldListener ){
      const elem = this.elem;

      // 移除旧的事件绑定
      if( oldListener ){
        elem.removeEventListener( this.type, this.value );
      }
      // 添加新的事件绑定
      if( listener ){
        elem.addEventListener( this.type, this.value = function( event ){

          // 修饰符检测
          for( let modifier of modifiers ){
            if( modifier( elem, event, modifiers ) === false ) return;
          }

          listener.apply( this, arguments );
        });
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

  return {
    options,
    modifiers
  };
}

/**
 * 事件可选参数
 */
const eventOptions = {
  once: true,
  capture: true,
  passive: true
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

    for( const key of modifierKey ){
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