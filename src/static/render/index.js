import html from '../../html/html';
import render from '../../render/index';
import { apply } from '../../shared/global/Reflect/index';


export default function staticRender(templateResult, container) {
  if (arguments.length > 1) {
    return render(templateResult, container);
  }

  container = templateResult;

  return function (...args) {
    const result = apply(html, null, args);
    return render(result, container);
  };
}
