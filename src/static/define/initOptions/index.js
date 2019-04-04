import initProps from "./initProps";
import initLifecycle from "./initLifecycle";
import initState from "./initState";
import initOther from "./initOther";
import { assign } from "../../../shared/global/Object/index";


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
  const options = optionsMap[ name ] = {};

  initProps( false, userOptions, options );
  initState( false, isCustomElement, userOptions, options );
  initLifecycle( false, userOptions, options );
  initOther( false, isCustomElement, userOptions, options );

  return [
    userOptions,
    options
  ];
}