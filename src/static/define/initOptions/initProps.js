import isArray from "../../../shared/global/Array/inArray";
import isPlainObject from "../../../shared/util/isPlainObject";
import each from "../../../shared/util/each";
import isFunction from "../../../shared/util/isFunction";
import fromBooleanAttribute from "../../../shared/util/fromBooleanAttribute";
import isObject from "../../../shared/util/isObject";
import rHyphenate from "../../../shared/const/rHyphenate";
import isSymbol from "../../../shared/util/isSymbol";


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
  if( userProps == null || !( ( propsIsArray = isArray( userProps ) ) || isPlainObject( userProps ) ) ){
    return;
  }

  // 格式化数组参数
  if( propsIsArray ){
    if( !userProps.length ) return;

    for( let name of userProps ){
      props[ name ] = initAttribute( name, null, {} );
    }
  }
  // 格式化 JSON 参数
  else{
    each( userProps, ( name, userProp ) => {
      props[ name ] = userProp ? initProp( name, userProp, {} )
                               : initAttribute( name, null, {} );
    });
  }

}


function initProp( name, prop, options ){

  // 设置 options.attr
  initAttribute( name, prop, options );

  // 单纯设置变量类型
  if( isFunction( prop ) ){
    options.from = prop;
  }
  // 高级用法
  else{
    // 变量类型
    if( prop.type != null ){
      const type = prop.type;

      // String || Number || Boolean || function( value ){ return value };
      if( isFunction( type ) ){
        options.from = type;
      }
      // {
      //   from(){}
      //   to(){}
      // }
      else if( isPlainObject( type ) ){
        if( isFunction( type.from ) ) options.from = type.from;
        if( isFunction( type.to ) ) options.to = type.to;
      }
    }
    // 默认值
    if( 'default' in prop ){
      const $default = prop.default;

      if( isFunction( $default ) || !isObject( $default ) ){
        options.default = $default;
      }
    }
  }

  // 如果传入值是 Boolean 类型, 则需要另外处理
  if( options.from === Boolean ){
    options.from = fromBooleanAttribute;
  }

  return options;
}

function initAttribute( name, prop, options ){
  options.attr = prop && prop.attr
                  ? prop.attr
                  : isSymbol( name )
                    ? null
                    : name.replace( rHyphenate, '-$1' ).toLowerCase();
  return options;
}