const searchValue = /for\s*\(\s*const\s*([^\)]+?)\s*of\s*([^\)]+?)\s*\)/g;
const replaceValue = 'for( let $1 of $2 )';


module.exports = {
  name: 'Fix SyntaxError error in Firefox 51 and below',
  renderChunk( code ){
    return code.replace( searchValue, replaceValue );
  }
};