import initProps from "./initProps";


/**
 * 初始化组件属性
 * @param {{}} userOptions 用户传入的组件属性
 */
export default function initOptions( userOptions ){
  /** 格式化后的组件属性 */
  const options = {};

  initProps( userOptions, options );

  return options;
}