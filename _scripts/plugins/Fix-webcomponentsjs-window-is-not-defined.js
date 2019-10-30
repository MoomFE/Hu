const { readFile } = require('./fs-extra');
const rSearch = /\\node_modules\\@webcomponents\\webcomponentsjs\\webcomponents-(bundle|loader)\.js$/;


module.exports = {
  name: 'fix webcomponentsjs: window is not defined',
  async load( id ){
    if( rSearch.test( id ) ){
      const source = await readFile( id, 'utf-8' );

      return `
        import { inBrowser } from '../../../src/shared/const/env';

        inBrowser && (() => {
          ${ source }
        })();
      `;
    }
    return null;
  }
};