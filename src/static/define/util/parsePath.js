/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
const unicodeLetters = 'a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD';
const bail = new RegExp(`[^${ unicodeLetters }.$_\\d]`);

/**
 * Transplant from Vue
 */
export default function parsePath( path ){
  if( bail.test( path ) ){
    return;
  }

  var segments = path.split('.');

  return function(){
    let obj = this;

    for( const segment of segments ){
      if( !obj ) return;
      obj = obj[ segment ];
    }
    return obj;
  }
}