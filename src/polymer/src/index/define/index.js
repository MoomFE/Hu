import { LitElement } from '@polymer/lit-element';


export function define( options ){


  return class extends LitElement{

    constructor(){
      super();
      options.constructor.call( this );
    }

    // 组件被插入 DOM 时触发
    //   - 此时还没触发 render 方法
    //   - 此时已经将 props 初始化完毕
    connectedCallback(){
      super.connectedCallback();
      options.connectedCallback.call( this );
    }

    update( changedProperties ){
      options.updateStart.call( this, changedProperties );
      super.update( changedProperties );
      options.updateEnd.call( this, changedProperties );
    }

    // 第一次更新元素后调用
    firstUpdated( changedProperties ){
      options.firstUpdated.call( this, changedProperties );
    }

    updated( changedProperties ){
      options.updated.call( this, changedProperties );
    }

    disconnectedCallback(){
      super.disconnectedCallback();
      options.disconnectedCallback.call( this );
    }

  };
}