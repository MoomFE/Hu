import { has } from '../../shared/global/Reflect/index';
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


class TemplateProcessor{
  handleAttributeExpressions( element, name, strings ){

    const prefix = name[0];

    // 用于绑定 DOM 属性 ( property )
    if( prefix === '.' ){
      const [ attr ] = name.slice(1).split('.');

      return [
        new BasicPropertyDirective( element, attr )
      ];
    }
    // 事件绑定
    else if( prefix === '@' ){
      const [ type, ...modifierKeys ] = name.slice(1).split('.');

      return [
        new BasicEventDirective( element, type, modifierKeys )
      ];
    }
    // 若属性值为 Truthy 则保留 DOM 属性
    // 否则移除 DOM 属性
    // - Truthy: https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy
    else if( prefix === '?' ){
      const [ attr ] = name.slice(1).split('.');

      return [
        new BasicBooleanDirective( element, attr )
      ];
    }
    // 功能指令
    else if( prefix === ':' ){
      const [ attr ] = name.slice(1).split('.');

      if( has( attrHandler, attr ) ){
        return [
          new attrHandler[ attr ]( element, attr )
        ];
      }
    }

    // 正常属性
    return ( new AttributeCommitter( element, name, strings ) ).parts;
  }
}

export default new TemplateProcessor();


/**
 * 存放指定属性的特殊处理
 */
const attrHandler = {
  class: ClassDirective,
  style: StyleDirective,
  model: ModelDirective,
  text: TextDirective,
  html: HtmlDirective,
  show: ShowDirective
};