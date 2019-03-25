import isFunction from "../../shared/util/isFunction";
import { create, assign } from "../../shared/global/Object/index";



export default class EventPart{

  constructor( element, type, eventContext, modifiers ){
    this.elem = element;
    this.type = type;
    this.options = initEventOptions( modifiers );
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
            if( modifier( elem, event ) === false ) return;
          }

          listener.apply( this, arguments );
        });
      }
    }
  }

}

function initEventOptions( _modifiers ){
  const options = {};
  const modifiers = [];

  for( let name of _modifiers ){
    if( eventOptions[ name ] ) options[ name ] = true;
    else if( eventModifiers[ name ] ) modifiers.push( eventModifiers[ name ] );
  }

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
  }

};