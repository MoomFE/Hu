import isFunction from "../../../shared/util/isFunction";
import noop from "../../../shared/util/noop";
import { inBrowser } from "../../../shared/const/env";


export default function initOther( isCustomElement, userOptions, options ){

  const { render } = userOptions;

  // 渲染方法
  options.render = isFunction( render ) ? render : noop;

  if( inBrowser && !isCustomElement ){
    // 挂载目标
    options.el = userOptions.el || undefined;
  }

}