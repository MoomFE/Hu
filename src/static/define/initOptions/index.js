import initProps from "./initProps";


/**
 * 初始化组件配置
 * @param {{}} userOptions 用户传入的组件配置
 */
export default function initOptions( userOptions ){
  /** 格式化后的组件配置 */
  const options = {};

  initProps( userOptions, options );

  return options;
}