import initOptions from './initOptions/index';
import init from './init/index';
import { keys } from '../../shared/global/Object/index';
import { definedCustomElement } from './const';
import HuElement from '../../core/HuElement';


/**
 * 定义自定义元素
 * @param {string} name 标签名
 * @param {{}} _userOptions 组件配置
 */
export default function define(name, _userOptions) {
  const [userOptions, options] = initOptions(true, name, _userOptions);

  class HuDefineElement extends HuElement {
    constructor() {
      super();

      this.$hu = init(true, this, name, options, userOptions);
    }
  }

  // 定义需要监听的属性
  HuDefineElement.observedAttributes = keys(options.propsMap);

  // 注册组件
  customElements.define(name, HuDefineElement);
  // 标记组件已注册
  definedCustomElement.add(name);
}
