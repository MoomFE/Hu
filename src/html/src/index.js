import { TemplateResult } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import isString from '../../shared/util/isString';
import huTemplateProcessor from './HuTemplateProcessor';


export { TemplateResult, render } from 'lit-html';

export const html = function( strings, ...values ){
  return new TemplateResult( strings, values, 'html', huTemplateProcessor );
}

html.repeat = ( items, userKey, template ) => {
  const key = isString( userKey ) ? item => item[ userKey ]
                                  : userKey;
  return repeat( items, key, template );
}

html.unsafeHTML = html.unsafe = unsafeHTML;