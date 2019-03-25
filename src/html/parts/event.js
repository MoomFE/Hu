import isFunction from "../../shared/util/isFunction";



export default class EventPart{

  constructor( element, type, eventContext, options ){
    this.elem = element;
    this.type = type;
  }

  setValue( listener ){
    this.oldListener = this.listener;
    this.listener = isFunction( listener ) ? listener : null;
  }

  commit(){
    const { listener, oldListener } = this;

    // 新的事件绑定与旧的事件绑定不一致
    if( listener !== oldListener ){
      // 移除旧的事件绑定
      if( oldListener != null ){
        this.elem.removeEventListener( this.type, oldListener );
      }
      // 添加新的事件绑定
      if( listener ){
        this.elem.addEventListener( this.type, listener );
      }
    }
  }
  
}