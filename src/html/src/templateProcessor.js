import {
  AttributeCommitter,
  BooleanAttributePart,
  EventPart,
  NodePart,
  PropertyCommitter
} from 'lit-html/lib/parts';


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
      return [
        new EventPart( element, name.slice(1), options.eventContext )
      ];
    }
    // 若属性的值为真则保留 DOM 属性
    // 否则移除 DOM 属性
    else if( prefix === '?' ){
      return [
        new BooleanAttributePart( element, name.slice(1), strings )
      ];
    }
    // 正常属性或扩展属性支持
    else{
      // 扩展属性支持
      if( prefix === ':' ){
        name = name.slice(1);
      }

      // 正常属性
      const comitter = new AttributeCommitter( element, name, strings );
      return comitter.parts;
    }
  }
  handleTextExpression( options ){
    return new NodePart( options );
  }
}

export default new TemplateProcessor();