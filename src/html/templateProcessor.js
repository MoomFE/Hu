import { NodePart } from 'lit-html/lib/parts';
import { has } from '../shared/global/Reflect/index';
import ClassPart from './parts/class';
import StylePart from './parts/style';
import EventPart from './parts/event';
import BooleanPart from './parts/boolean';
import PropertyPart from './parts/property';
import AttributePart from './parts/attribute';


class TemplateProcessor{
  handleAttributeExpressions( element, name, strings, options ){

    const prefix = name[0];

    // 用于绑定 DOM 属性 ( property )
    if( prefix === '.' ){
      const [ attr ] = name.slice(1).split('.');

      return [
        new PropertyPart( element, attr )
      ];
    }
    // 事件绑定
    else if( prefix === '@' ){
      const [ type, ...modifierKeys ] = name.slice(1).split('.');

      return [
        new EventPart( element, type, modifierKeys )
      ];
    }
    // 若属性值为 Truthy 则保留 DOM 属性
    // 否则移除 DOM 属性
    // - Truthy: https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy
    else if( prefix === '?' ){
      const [ attr ] = name.slice(1).split('.');

      return [
        new BooleanPart( element, attr )
      ];
    }
    // 扩展属性支持
    else if( prefix === ':' ){
      const [ attr ] = name.slice(1).split('.');

      if( has( attrHandler, attr ) ){
        return [
          new attrHandler[ attr ]( element, attr )
        ];
      }
    }
    // 正常属性
    else{
      return [
        new AttributePart( element, name )
      ];
    }
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
  class: ClassPart,
  style: StylePart
};