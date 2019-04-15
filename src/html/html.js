import { TemplateResult } from 'lit-html';
import templateProcessor from './templateProcessor';
import { assign } from '../shared/global/Object/index';
import repeat from './directiveFn/repeat';
import unsafeHTML from './directiveFn/unsafeHTML';
import bind from './directiveFn/bind';


export default function html( strings, ...values ){
  return new TemplateResult( strings, values, 'html', templateProcessor );
}

assign( html, {
  unsafe: unsafeHTML,
  repeat,
  bind
});