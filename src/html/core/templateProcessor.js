import AttributeCommitter from '../directiveBasic/attribute';
import BasicEventDirective from '../directiveBasic/event';
import BasicBooleanDirective from '../directiveBasic/boolean';
import BasicPropertyDirective from '../directiveBasic/property';
import ClassDirective from '../directive/class';
import StyleDirective from '../directive/style';
import ModelDirective from '../directive/model';
import TextDirective from '../directive/text';
import HtmlDirective from '../directive/html';
import ShowDirective from '../directive/show';
import createAssign from '../../shared/util/create';
import { create } from '../../shared/global/Object/index';


export default {

  attr( element, name, strings ){
    /** 修饰符对象 */
    const modifiers = create( null );
    /** 修饰符键集合 */
    let modifierKeys;
    /** 属性名称起始分隔位置 */
    let sliceNum = 0;
    /** 属性对应的处理指令 */
    let directive;
    /** 属性对应的处理指令实例 */
    let directiveInstance;

    // 处理基础指令
    switch( name[ 0 ] ){
      // 用于绑定 DOM 属性 ( property )
      case '.': directive = BasicPropertyDirective; sliceNum = 1; break;
      // 事件绑定
      case '@': directive = BasicEventDirective; sliceNum = 1; break;
      // 若属性值为 Truthy 则保留 DOM 属性
      // 否则移除 DOM 属性
      // - Truthy: https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy
      case '?': directive = BasicBooleanDirective; sliceNum = 1; break;
      // 功能指令
      case ':': {
        [ name, ...modifierKeys ] = name.slice(1).split('.');
        directive = userDirectives[ name ] || directives[ name ];
      }
    }

    // 属性名称可能是包含修饰符的, 所以需要对属性名称进行分隔
    if( !modifierKeys ){
      [ name, ...modifierKeys ] = name.slice( sliceNum ).split('.');
    }
    // 将数组格式的指令名称转为对象格式
    for( let modifier of modifierKeys ){
      modifiers[ modifier ] = true;
    }

    // 实例化指令
    directiveInstance = new ( directive || AttributeCommitter )( element, name, strings, modifiers );

    // 单个属性使用了多个插值绑定的情况下
    // 需要返回多个指令类
    return strings.length > 2 ? directiveInstance.parts : [
      directiveInstance
    ];
  }

};

/**
 * 内置指令
 */
export const directives = createAssign({
  class: ClassDirective,
  style: StyleDirective,
  model: ModelDirective,
  text: TextDirective,
  html: HtmlDirective,
  show: ShowDirective
});

/**
 * 用户定义指令
 */
export const userDirectives = createAssign({

});