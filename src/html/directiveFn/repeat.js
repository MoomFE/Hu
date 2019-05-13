import NodePart from '../core/node';
import directive from '../util/directive';
import { reparentNodes, createMarker } from 'lit-html';
import isFunction from '../../shared/util/isFunction';
import removeNodes from '../../shared/util/removeNodes';


/**
 * lit-html
 * directives/repeat
 * Licensed under the MIT License
 * http://polymer.github.io/LICENSE.txt
 *
 * modified by Wei Zhang (@Zhang-Wei-666)
 */

const partListCache = new WeakMap();
const keyListCache = new WeakMap();

export default directive(( items, key, template ) => {
  const keyFn = isFunction( key ) ? key : item => item[ key ];

  return containerPart => {
    if( !( containerPart instanceof NodePart ) ){
      throw new Error('Hu.html.repeat 指令方法只能在文本区域中使用 !');
    }

    const oldParts = partListCache.get( containerPart ) || [];
    const oldKeys = keyListCache.get( containerPart ) || [];

    const newKeys = [];
    const newValues = [];
    const newParts = [];

    for( let index = 0, item; index < items.length; index++ ){
      item = items[ index ];

      newKeys[ index ] = keyFn( item, index, items );
      newValues[ index ] = template( item, index, items );
    }

    let newKeyToIndexMap;
    let oldKeyToIndexMap;

    let oldHead = 0;
    let oldTail = oldParts.length - 1;
    let newHead = 0;
    let newTail = newValues.length - 1;


    while( oldHead <= oldTail && newHead <= newTail ){
      if( oldParts[ oldHead ] === null ){
        oldHead++;
      }
      else if( oldParts[ oldTail ] === null ){
        oldTail--;
      }
      else if( oldKeys[ oldHead ] === newKeys[ newHead ] ){
        newParts[ newHead ] = updatePart( oldParts[ oldHead ], newValues[ newHead ] );
        oldHead++;
        newHead++;
      }
      else if( oldKeys[ oldTail ] === newKeys[ newTail ] ){
        newParts[ newTail ] = updatePart( oldParts[ oldTail ], newValues[ newTail ] );
        oldTail--;
        newTail--;
      }
      else if( oldKeys[ oldHead ] === newKeys[ newTail ] ){
        newParts[ newTail ] = updatePart( oldParts[ oldHead ], newValues[ newTail ] );
        insertPartBefore( containerPart, oldParts[ oldHead ], newParts[ newTail + 1 ] );
        oldHead++;
        newTail--;
      }
      else if( oldKeys[ oldTail ] === newKeys[ newHead ] ){
        newParts[ newHead ] = updatePart( oldParts[ oldTail ], newValues[ newHead ] );
        oldTail--;
        newHead++;
      }
      else{
        if( newKeyToIndexMap === undefined ){
          newKeyToIndexMap = generateMap( newKeys, newHead, newTail );
          oldKeyToIndexMap = generateMap( oldKeys, oldHead, oldTail );
        }
        if( newKeyToIndexMap.has( oldKeys[ oldHead ] ) ){
          removePart( oldParts[ oldHead ] );
          oldHead++;
        }
        else if( !newKeyToIndexMap.has( oldKeys[oldTail] ) ){
          removePart( oldParts[ oldTail ] );
          oldTail--;
        }
        else{
          const oldIndex = oldKeyToIndexMap.get( newKeys[ newHead ] );
          const oldPart = oldIndex !== undefined ? oldParts[oldIndex] : null;

          if( oldPart === null ){
            const newPart = createAndInsertPart( containerPart, oldParts[ oldHead ] );

            updatePart( newPart, newValues[ newHead ] );
            newParts[ newHead ] = newPart;
          }else{
            newParts[ newHead ] = updatePart( oldPart, newValues[ newHead ] );
            insertPartBefore(containerPart, oldPart, oldParts[oldHead]);
            oldParts[oldIndex] = null;
          }

          newHead++;
        }
      }
    }

    while( newHead <= newTail ){
      const newPart = createAndInsertPart( containerPart, newParts[ newTail + 1 ] );
      updatePart( newPart, newValues[ newHead ] );
      newParts[ newHead++ ] = newPart;
    }

    while( oldHead <= oldTail ){
      const oldPart = oldParts[ oldHead++ ];
      
      if ( oldPart !== null ){
        removePart( oldPart );
      }
    }

    partListCache.set(containerPart, newParts);
    keyListCache.set(containerPart, newKeys);
  };
});


function updatePart( part, value ){
  part.setValue( value );
  part.commit();
  return part;
}

function insertPartBefore( containerPart, part, ref ){
  const container = containerPart.startNode.parentNode;
  const beforeNode = ref ? ref.startNode : containerPart.endNode;
  const endNode = part.endNode.nextSibling;
  
  if( endNode !== beforeNode ){
    reparentNodes( container, part.startNode, endNode, beforeNode );
  }
}

function generateMap( list, start, end ){
  const map = new Map();
  for( let i = start; i <= end; i++ ){
    map.set( list[i], i );
  }
  return map;
}

function removePart( part ){
  removeNodes( part.startNode.parentNode, part.startNode, part.endNode.nextSibling );
}

function createAndInsertPart( containerPart, beforePart ){
  const container = containerPart.startNode.parentNode;
  const beforeNode = beforePart === undefined ? containerPart.endNode : beforePart.startNode;
  const startNode = container.insertBefore( createMarker(), beforeNode );
  container.insertBefore( createMarker(), beforeNode );
  const newPart = new NodePart();
  newPart.insertAfterNode( startNode );
  return newPart;
}