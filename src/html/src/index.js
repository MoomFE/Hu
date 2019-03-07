import { TemplateResult, defaultTemplateProcessor } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import isString from '../../shared/util/isString';


export { TemplateResult, render } from 'lit-html';

export const html = function( strings, ...values ){
  return new TemplateResult( strings, values, 'html', defaultTemplateProcessor );
}

html.repeat = ( items, userKey, template ) => {
  const key = isString( key ) ? item => item[ userKey ]
                              : userKey;
  return repeat( items, key, template );
}