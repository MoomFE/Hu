import AttributeCommitter from '../directiveBasic/attribute';
import BasicEventDirective from '../directiveBasic/event';
import BasicBooleanDirective from '../directiveBasic/boolean';
import BasicPropertyDirective from '../directiveBasic/property';
import { create } from '../../shared/global/Object/index';
import { userDirectives, directives } from '../const';


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
    /** 指令前缀 */
    const prefix = name[ 0 ];

    // 处理基础指令
    switch( prefix ){
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
        const [ attr, ...keys ] = name.slice(1).split('.');
        
        // 指令存在则使用截取出的名称及修饰符
        // 指令不存在则不做任何更改视为普通属性
        if( directive = userDirectives[ attr ] || directives[ attr ] ){
          name = attr;
          modifierKeys = keys;
        }
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

    /** 实例化指令时的传值 */
    const args = [ element, name, strings, modifiers ];

    // 用户注册的指令无需传入名称
    if( directive && prefix === ':' ){
      args.splice( 1, 1 );
    }

    // 实例化指令
    directiveInstance = new ( directive || AttributeCommitter )( ...args );

    // 单个属性使用了多个插值绑定的情况下
    // 需要返回多个指令类
    return directiveInstance.parts || [
      directiveInstance
    ];
  }

};