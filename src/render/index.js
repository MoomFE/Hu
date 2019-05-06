import { render } from 'lit-html';
import { renderStack } from './const/index';
import { unWatchAllDirectiveCache } from './util/unWatchAllDirectiveCache';


export default function( result, container, options ){

  unWatchAllDirectiveCache( container );

  renderStack.push( container );

  render( result, container, options );

  renderStack.pop();
}