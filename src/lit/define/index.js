import Lit from '../../shared/global/Lit/index';
import { define } from '../../polymer/dist/index';
import { customElement } from '../../polymer/dist/litElement';
import $assign from '../../shared/global/Object/$assign';


ZenJS.defineValue( Lit, 'define', function( name, _options ){

  // 克隆一份配置, 保证配置传进来后不被更改
  const options = $assign( null, _options );
  // 先初始化元素
  const custom = define( options );
  // 获取原型对象
  const customProto = custom.prototype;

  // 初始化参数
  processing.forEach( fn => {
    fn( options, custom, customProto );
  });

  // 定义组件
  customElement( name )( custom );
});


import lifecycle from './processing/lifecycle';
import render from './processing/render';
import mounted from './processing/mounted';
import props from './processing/props';
import methods from './processing/methods';
import data from './processing/data';
import created from './processing/created';
import watch from './processing/watch';


const processing = [
  lifecycle,
  props, methods, data, watch,
  created,
  render,
  mounted,
];