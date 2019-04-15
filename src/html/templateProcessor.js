import { NodePart } from 'lit-html/lib/parts';
import { has } from '../shared/global/Reflect/index';
import ClassDirective from './directive/class';
import StyleDirective from './directive/style';
import ModelDirective from './directive/model';
import EventDirective from './directive/event';
import BooleanDirective from './directive/boolean';
import PropertyCommitter from './committer/property';
import AttributeCommitter from './committer/attribute';


class TemplateProcessor{
  handleAttributeExpressions( element, name, strings, options ){

    const prefix = name[0];

    // 用于绑定 DOM 属性 ( property )
    if( prefix === '.' ){
      const [ attr ] = name.slice(1).split('.');

      return [
        new PropertyCommitter( element, attr )
      ];
    }
    // 事件绑定
    else if( prefix === '@' ){
      const [ type, ...modifierKeys ] = name.slice(1).split('.');

      return [
        new EventDirective( element, type, modifierKeys )
      ];
    }
    // 若属性值为 Truthy 则保留 DOM 属性
    // 否则移除 DOM 属性
    // - Truthy: https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy
    else if( prefix === '?' ){
      const [ attr ] = name.slice(1).split('.');

      return [
        new BooleanDirective( element, attr )
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
    return [
      new AttributeCommitter( element, name )
    ];
  }
  handleTextExpression( options ){
    return new NodePart( options );
  }
}

export default new TemplateProcessor();


/**
 * 存放指定属性的特殊处理
 */
const attrHandler = {
  class: ClassDirective,
  style: StyleDirective,
  model: ModelDirective
};