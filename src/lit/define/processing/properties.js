import defineGet from "../../../shared/global/ZenJS/defineGet";
import isArray from "../../../shared/global/ZenJS/isArray";
import $isPlainObject from "../../../shared/global/Object/$isPlainObject";
import get from "../../../shared/util/get";
import fromEntries from "../../../shared/global/ZenJS/fromEntries";
import entries from "../../../shared/global/ZenJS/entries";
import isString from "../../../shared/global/ZenJS/isString";
import isFunction from "../../../shared/global/ZenJS/isFunction";


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
      props.map( prop => [ prop, {} ] )
    );
  }
  // 格式化 JSON 参数
  else{
    props = entries( props ).map( keyValue => {
      const [ key, value ] = keyValue;
      const options = {};

      if( value ){
        // 变量取值属性名
        if( isString( value.attr ) ){
          options.attribute = value.attr;
        }
        // 变量发生变化联动属性一起更改
        if( value.reflect ){
          options.reflect = true;
        }
        // 变量类型
        if( value.type != null ){
          const type = value.type;

          // String || Number || Boolean
          // function( value ){ return value };
          if( isFunction( type ) ){
            options.type = type;
          }
          // {
          //   from(){},
          //   to(){}
          // }
          else if( $isPlainObject( type ) ){
            options.type = {};

            if( isFunction( type.from ) ) options.type.fromAttribute = type.from;
            if( isFunction( type.to ) ) options.type.toAttribute = type.to;
          }
        }
      }

      return [ key, options ];
    });
    props = fromEntries( props );
  }

  defineGet( custom, 'properties', function(){
    return props;
  });

}