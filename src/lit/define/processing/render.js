import { html } from '../../../polymer/dist/litHtml';
import noop from '../../../shared/global/ZenJS/noop';


/**
 * 初始化渲染方法
 */
export default function render( options, custom, customProto ){
  const render = options.render;

  // 有 render 方法
  if( render ){
    render = render.$args({ 0: html });
  }
  // 有 template 模板
  else if( options.template ){
    render = () => html([ options.template ]);
  }
  // 啥都没有
  else{
    render = noop;
  }

  // 渲染方法
  options.render = customProto.render = render;
}