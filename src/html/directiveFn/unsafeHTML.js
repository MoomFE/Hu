import { directive, NodePart } from 'lit-html';
import isPrimitive from '../../shared/util/isPrimitive';


/**
 * lit-html
 * directives/unsafeHTML
 * Licensed under the MIT License
 * http://polymer.github.io/LICENSE.txt
 *
 * modified by Wei Zhang (@Zhang-Wei-666)
 */

const oldValueMap = new WeakMap();

export default directive( value => part => {
  if( !( part instanceof NodePart ) ){
    throw new Error('Hu.html.unsafe 指令方法只能在文本区域中使用 !');
  }

  const oldValue = oldValueMap.get( part );

  if( oldValue && isPrimitive( value ) && value === oldValue.value && part.value === oldValue.fragment ){
    return;
  }

  const template = document.createElement('template');
        template.innerHTML = value;

  const fragment = document.importNode( template.content, true );

  part.setValue( fragment );

  oldValueMap.set( part, {
    value,
    fragment
  });
});