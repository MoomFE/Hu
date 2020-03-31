import isSingleBind from '../util/isSingleBind';
import isNotEqual from '../../shared/util/isNotEqual';
import toString from '../../shared/util/toString';
import { has } from '../../shared/global/Reflect/index';


export default class HtmlDirective {
  constructor(element, strings, modifiers) {
    if (!isSingleBind(strings)) {
      throw new Error(':html 指令的传值只允许包含单个表达式 !');
    }

    this.elem = element;
  }

  commit(value, isDirectiveFn) {
    // 用户传递的是指令方法
    // 交给指令方法处理
    if (isDirectiveFn) return value(this);
    // 两次传入的值不同
    if (!has(this, 'value') || isNotEqual(value, this.value)) {
      this.elem.innerHTML = toString(this.value = value);
    }
  }
}
