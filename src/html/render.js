import { render } from 'lit-html';
import { renderStack } from './const';


export default function( result, container, options ){
  renderStack.push( container );

  render( result, container, options );

  renderStack.pop();
}