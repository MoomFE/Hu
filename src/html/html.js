import TemplateResult, { SVGTemplateResult } from './core/templateResult';
import templateProcessor from './core/templateProcessor';
import { assign } from '../shared/global/Object/index';
import repeat from './directiveFn/repeat';
import unsafeHTML from './directiveFn/unsafeHTML';
import bind from './directiveFn/bind';


export default function html( strings, ...values ){
  return new TemplateResult( strings, values, 'html', templateProcessor );
}

function svg( strings, ...values ){
  return new SVGTemplateResult( strings, values, 'svg', templateProcessor );
}

assign( html, {
  unsafe: unsafeHTML,
  repeat,
  bind,
  svg
});