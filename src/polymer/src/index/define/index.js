import { LitElement, customElement } from '@polymer/lit-element';


export function define( name, options ){

  const custom = customElement( name )( class extends LitElement{

    firstUpdated(){
      options.mounted.call( this );
    }

  });

  Object.$assign( custom.prototype, {
    render: options.render
  });

  return custom;
}