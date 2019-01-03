import Lit from '../../shared/global/Lit/index';
import { define } from '../../polymer/dist/index';


ZenJS.defineValue( Lit, 'define', function( name, options ){

  // 克隆一份配置, 保证配置传进来后不被更改
  options = Object.$assign( null, options );

  // 初始化参数
  processing.forEach( fn => {
    fn( options );
  });
  
  // 初始化元素并进行定义
  define( name, options );

});


import render from './processing/render';
import mounted from './processing/mounted';
import properties from './processing/properties';


const processing = [
  render,
  mounted,
  properties
];