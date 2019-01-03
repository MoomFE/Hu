import { LitElement, customElement } from '@polymer/lit-element';


export function define( name, options ){

  const custom = customElement( name )( class extends LitElement{

    static get properties(){
      return {

      };
    }

    // 第一次更新元素后调用
    firstUpdated(){
      options.mounted.call( this );
    }

  });

  custom.prototype.render = options.render;

  return custom;
}