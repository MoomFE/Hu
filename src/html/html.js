import TemplateResult, { SVGTemplateResult } from './core/templateResult';
import { assign } from '../shared/global/Object/index';
import repeat from './directiveFn/repeat';
import unsafeHTML from './directiveFn/unsafeHTML';
import bind from './directiveFn/bind';


export default function html(strings, ...values) {
  return new TemplateResult(strings, values, 'html');
}

function svg(strings, ...values) {
  return new SVGTemplateResult(strings, values, 'svg');
}

assign(html, {
  unsafe: unsafeHTML,
  repeat,
  bind,
  svg
});
