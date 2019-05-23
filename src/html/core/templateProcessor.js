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
import create from '../../shared/util/create';


export default {

  attr( element, name, strings ){

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
      const directive = directives[ attr ] || userDirectives[ attr ];

      if( directive ){
        return [
          new directives[ attr ]( element, attr )
        ];
      }
    }

    // 正常属性
    return ( new AttributeCommitter( element, name, strings ) ).parts;
  }

};


/**
 * 内置指令
 */
const directives = create({
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
export const userDirectives = create({

});