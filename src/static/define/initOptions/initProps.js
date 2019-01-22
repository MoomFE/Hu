import isArray from "../../../shared/global/Array/inArray";


/**
 * 初始化组件 props 配置
 * @param {{}} userOptions 用户传入的组件配置
 * @param {{}} options 格式化后的组件配置
 */
export default function initProps( userOptions, options ){

  /** 格式化后的 props 配置 */
  const props = options.props = {};
  /** 用户传入的 props 配置 */
  const userProps = userOptions.props;
  /** 用户传入的 props 配置是否是数组 */
  let propsIsArray = false;


  // 去除不合法参数
  if( userProps == null || !( propsIsArray = isArray( userProps ) ) ){
    return;
  }

  // 格式化数组参数
  if( propsIsArray ){
    if( !userProps.length ) return;

    for( let name of userProps ){
      props[ name ] = {}
    }
  }

}