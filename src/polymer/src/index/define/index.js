import { LitElement } from '@polymer/lit-element';


export function define( options ){
  return class extends LitElement{

    constructor(){
      super();
    }

    // 第一次更新元素后调用
    firstUpdated(){
      // 生命周期 -> 组件挂载并渲染完成
      options.mounted.call( this );
    }

  };
}