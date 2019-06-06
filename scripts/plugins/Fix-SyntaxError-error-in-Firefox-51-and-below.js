const searchValue = /for\s*\(\s*const\s*([^\s]+)\s*of/g;
const replaceValue = 'for( let $1 of';


module.exports = {
  name: 'Fix SyntaxError error in Firefox 51 and below',
  renderChunk( code ){
    return code.replace( searchValue, replaceValue );
  }
};