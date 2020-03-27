import { slice } from '../../../../shared/global/Array/prototype';
import { freeze } from '../../../../shared/global/Object/index';


export default (root) => {
  const refs = {};
  const elems = root.querySelectorAll('[ref]');

  if (elems.length) {
    slice.call(elems).forEach((elem) => {
      const name = elem.getAttribute('ref');
      refs[name] = refs[name] ? [].concat(refs[name], elem) : elem;
    });
  }

  return freeze(refs);
};
