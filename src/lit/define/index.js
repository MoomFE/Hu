import Lit from '../../shared/global/Lit/index';
import { html } from '../../polymer/dist/litHtml';
import { define } from '../../polymer/dist/index';


ZenJS.defineValue( Lit, 'define', function( name, options ){

  // 克隆一份配置, 保证配置传进来后不被更改
  options = Object.$assign( null, options );

  // 初始化渲染方法
  if( options.render ){
    options.render = options.render.$args({ 0: html });
  }else if( options.template ){
    options.render = () => html([ options.template ]);
  }else{
    options.render = ZenJS.noop;
  }

  // 生命周期 -> 挂载完成
  options.mounted = options.mounted || ZenJS.noop;

  define( name, options );
});