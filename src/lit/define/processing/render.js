import { html } from '../../../polymer/dist/litHtml';
import noop from '../../../shared/global/ZenJS/noop';
import get from '../../../shared/util/get';


/**
 * 初始化渲染方法
 */
export default function render( options, custom, customProto ){
  let render = get( options, 'render' ),
      template;

  // 有 render 方法
  if( render ){
    render = render.$args({ 0: html });
  }
  // 有 template 模板
  else if( template = get( options, 'template' ) ){
    render = () => html([ template ]);
  }
  // 啥都没有
  else{
    render = noop;
  }

  // 渲染方法
  customProto.render = render;
}