import isSingleBind from '../util/isSingleBind';
import rWhitespace from '../../shared/const/rWhitespace';
import { isArray } from '../../shared/global/Array/index';
import each from '../../shared/util/each';
import { has } from '../../shared/global/Reflect/index';


/**
 * 存放上次设置的 class 内容
 */
const classesMap = new WeakMap();


export default class ClassDirective {
  constructor(element, strings, modifiers) {
    if (!isSingleBind(strings)) {
      throw new Error(':class 指令的传值只允许包含单个表达式 !');
    }

    this.elem = element;
  }

  commit(value, isDirectiveFn) {
    // 用户传递的是指令方法
    // 交给指令方法处理
    if (isDirectiveFn) return value(this);

    /** 转为对象形式的 class */
    const classes = this.parse(value);
    /** 当前元素的 classList 对象 */
    const classList = this.elem.classList;

    // 非首次运行
    if (classesMap.has(this)) {
      const oldClasses = classesMap.get(this);

      // 移除旧 class
      each(oldClasses, (name) => {
        has(classes, name) || classList.remove(name);
      });
      // 添加新 class
      each(classes, (name) => {
        has(oldClasses, name) || classList.add(name);
      });
    }
    // 首次运行
    else {
      each(classes, (name) => {
        return classList.add(name);
      });
    }

    // 保存最新的 classes
    classesMap.set(this, classes);
  }

  /**
   * 格式化用户传入的 class 内容
   */
  parse(value, classes = {}) {
    // 处理不同类型的 class 内容
    // eslint-disable-next-line default-case
    switch (typeof value) {
      case 'string': {
        value.split(rWhitespace).forEach((name) => {
          return (classes[name] = true);
        });
        break;
      }
      case 'object': {
        if (isArray(value)) {
          value.forEach((name) => {
            return this.parse(name, classes);
          });
        } else {
          each(value, (name, truthy) => {
            return truthy ? this.parse(name, classes)
              : delete classes[name];
          });
        }
      }
    }

    return classes;
  }
}
