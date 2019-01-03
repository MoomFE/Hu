import { html } from '../../../polymer/dist/litHtml';


/**
 * 初始化渲染方法
 */
export default function render( options ){
  // 有 render 方法
  if( options.render ){
    options.render = options.render.$args({ 0: html });
  }
  // 有 template 模板
  else if( options.template ){
    options.render = () => html([ options.template ]);
  }
  // 啥都没有
  else{
    options.render = ZenJS.noop;
  }
}