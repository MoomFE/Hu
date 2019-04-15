import initProps from "./initProps";
import initLifecycle from "./initLifecycle";
import initState from "./initState";
import initOther from "./initOther";
import { assign, create } from "../../../shared/global/Object/index";


export const optionsMap = {};

/**
 * 初始化组件配置
 * @param {boolean} isCustomElement 是否是初始化自定义元素
 * @param {string} name 自定义元素标签名
 * @param {{}} _userOptions 用户传入的组件配置
 */
export default function initOptions( isCustomElement, name, _userOptions ){
  /** 克隆一份用户配置 */
  const userOptions = assign( {}, _userOptions );
  /** 格式化后的组件配置 */
  const options = optionsMap[ name ] = create( null );
  /** 混入选项 */
  let mixins = userOptions.mixins;
      mixins = mixins && mixins.length ? mixins.reverse() : null;

  initProps( userOptions, options, mixins );
  initState( isCustomElement, userOptions, options, mixins );
  initLifecycle( userOptions, options, mixins );
  initOther( isCustomElement, userOptions, options, mixins );

  return [
    userOptions,
    options
  ];
}