import { create } from '../../shared/global/Object/index';
import Template from './template';
import { marker } from '../const';


/**
 * 所有模板类型的缓存对象
 */
const templateCaches = create(null);

export default (result) => {
  /**
   * 当前模板类型的缓存对象
   *  - 'html'
   *  - 'svg'
   */
  let templateCache = templateCaches[result.type];

  // 如果没有获取到当前模板类型的缓存对象
  // 则进行创建并进行缓存
  if (!templateCache) {
    templateCaches[result.type] = templateCache = {
      stringsArray: new WeakMap(),
      keyString: create(null)
    };
  }

  /**
   * 当前模板字面量对应的处理模板
   */
  let template = templateCache.stringsArray.get(result.strings);

  // 获取到了值, 说明之前处理过该模板字面量, 直接返回对应模板
  if (template) {
    return template;
  }

  /**
   * 使用随机的密钥连接模板字面量, 连接后完全相同的模板字面量字符串会公用同一个模板
   */
  const key = result.strings.join(marker);

  // 尝试获取当前模板字面量字符串对应的模板
  template = templateCache.keyString[key];

  // 如果没有获取到当前模板字面量字符串对应的模板
  // 则进行创建并进行缓存
  if (!template) {
    templateCache.keyString[key] = template = new Template(
      result,
      result.getTemplateElement()
    );
  }

  // 缓存当前模板
  templateCache.stringsArray.set(result.strings, template);

  // 返回对应模板
  return template;
};
