import isFunction from "../../../shared/util/isFunction";
import { inBrowser } from "../../../shared/const/env";


export default function initOther( isCustomElement, userOptions, options ){

  const { render } = userOptions;

  // 渲染方法
  options.render = isFunction( render ) ? render : null;

  if( inBrowser && !isCustomElement ){
    // 挂载目标
    options.el = userOptions.el || undefined;
  }

}