import { TemplateResult } from 'lit-html';
import templateProcessor from './templateProcessor';
import { assign } from '../shared/global/Object/index';
import repeat from './directive/repeat';
import unsafeHTML from './directive/unsafeHTML';


export { TemplateResult, render } from 'lit-html';

export default function html( strings, ...values ){
  return new TemplateResult( strings, values, 'html', templateProcessor );
}

assign( html, {
  unsafe: unsafeHTML,
  unsafeHTML,
  repeat
});