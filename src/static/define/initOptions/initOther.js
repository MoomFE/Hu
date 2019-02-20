import isFunction from "../../../shared/util/isFunction";
import noop from "../../../shared/util/noop";


export default function initOther( userOptions, options ){

  const { render } = userOptions;

  // 渲染方法
  options.render = isFunction( render ) ? render : noop;

}