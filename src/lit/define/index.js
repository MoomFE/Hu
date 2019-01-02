import '@moomfe/zenjs/dist/zen.fat.esm';
import Lit from '../../shared/global/Lit/index';
import { customElement, LitElement, html } from '../../shared/dependencies/polymer/dist/litElement';

Object.defineProperty( Lit, 'define', {
  enumerable: true,
  value( name, options ){
    const custom = customElement( name )( class extends LitElement{
      
      render(){
        return html`
          <div>${ String.$someRandom( 36, true, true ) }</div>
        `
      }
    });
  }
});