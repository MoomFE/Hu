const searchValue = /for\s*\(\s*const\s*xxx\s*of/g;
const replaceValue = 'for( let $1 of';

const result = {
  name: 'Fix SyntaxError error in Firefox 51 and below',
  renderChunk( code ){
    return code.replace( searchValue, replaceValue );
  }
};

module.exports = () => result;