import { TemplateResult } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import isString from '../shared/util/isString';
import templateProcessor from './templateProcessor';


export { TemplateResult, render } from 'lit-html';

export default function html( strings, ...values ){
  return new TemplateResult( strings, values, 'html', templateProcessor );
}

html.repeat = ( items, userKey, template ) => {
  const key = isString( userKey ) ? item => item[ userKey ]
                                  : userKey;
  return repeat( items, key, template );
}

html.unsafeHTML = html.unsafe = unsafeHTML;