import ClassPart from './parts/class';
import {
  AttributeCommitter,
  BooleanAttributePart,
  NodePart,
  PropertyCommitter
} from 'lit-html/lib/parts';
import StylePart from './parts/style';
import { has } from '../shared/global/Reflect/index';
import EventPart from './parts/event';


class TemplateProcessor{
  handleAttributeExpressions( element, name, strings, options ){

    const prefix = name[0];

    // 用于绑定 DOM 属性 ( property )
    if( prefix === '.' ){
      const comitter = new PropertyCommitter( element, name.slice(1), strings );
      return comitter.parts;
    }
    // 事件绑定
    else if( prefix === '@' ){
      const [ type, ...modifierKeys ] = name.slice(1).split('.');

      return [
        new EventPart( element, type, modifierKeys )
      ];
    }
    // 若属性的值为真则保留 DOM 属性
    // 否则移除 DOM 属性
    else if( prefix === '?' ){
      return [
        new BooleanAttributePart( element, name.slice(1), strings )
      ];
    }
    // 扩展属性支持
    else if( prefix === ':' ){
      const [ currentName, ...options ] = name.slice(1).split('.');

      if( has( attrHandler, currentName ) ){
        return [
          new attrHandler[ currentName ]( element, currentName )
        ];
      }
    }
    // 正常属性
    else{
      const comitter = new AttributeCommitter( element, name, strings );
      return comitter.parts;
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