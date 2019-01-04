import defineGet from "../../../shared/global/ZenJS/defineGet";
import isArray from "../../../shared/global/ZenJS/isArray";
import $isPlainObject from "../../../shared/global/Object/$isPlainObject";
import get from "../../../shared/util/get";
import fromEntries from "../../../shared/global/ZenJS/fromEntries";
import entries from "../../../shared/global/ZenJS/entries";


/**
 * 初始化 props
 */
export default function properties( options, custom ){

  let props = get( options, 'props' );
  let propsIsArray = false;

  // 去除不合法参数
  if( props == null || !( ( propsIsArray = isArray( props ) ) || $isPlainObject( props ) ) ){
    return;
  }

  // 格式化数组参数
  if( propsIsArray ){
    if( !props.length ) return;

    props = fromEntries(
      props.map( prop => ([ prop, { attribute: true } ]) )
    );
  }
  // 格式化 JSON 参数
  else{
    props = entries( props ).map( keyValue => {
      const key = keyValue[ 0 ];
      const value = keyValue[ 1 ];

      
      
      return keyValue;
    });
  }

  defineGet( custom, 'properties', function(){
    return props;
  });

}