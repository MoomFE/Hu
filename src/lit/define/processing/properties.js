import isFunction from "../../../shared/global/ZenJS/isFunction";
import defineGet from "../../../shared/global/ZenJS/defineGet";
import isArray from "../../../shared/global/ZenJS/isArray";


/**
 * 初始化 props
 */
export default function properties( options, custom ){

  // 去除不合法参数
  let props = options.props;
  delete options.props;

  if( props != null && !( isFunction( props ) || isArray( props ) ) ){
    props = null;
  }

  if( props == null ) return;

  defineGet( custom, 'properties', function(){

  });

}