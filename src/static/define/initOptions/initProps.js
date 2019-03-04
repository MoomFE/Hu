import isArray from "../../../shared/global/Array/isArray";
import isPlainObject from "../../../shared/util/isPlainObject";
import each from "../../../shared/util/each";
import isFunction from "../../../shared/util/isFunction";
import fromBooleanAttribute from "../util/fromBooleanAttribute";
import isObject from "../../../shared/util/isObject";
import isSymbol from "../../../shared/util/isSymbol";
import returnArg from "../../../shared/util/returnArg";
import hyphenate from "../../../shared/util/hyphenate";


/**
 * 初始化组件 props 配置
 * @param {{}} userOptions 用户传入的组件配置
 * @param {{}} options 格式化后的组件配置
 */
export default function initProps( userOptions, options ){

  /** 格式化后的 props 配置 */
  const props = options.props = {};
  /** 最终的 prop 与取值 attribute 的映射 */
  const propsMap = options.propsMap = {};
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
      props[ name ] = initProp( name, null );
    }
  }
  // 格式化 JSON 参数
  else{
    each( userProps, ( name, prop ) => {
      props[ name ] = initProp( name, prop );
    });
  }

  // 生成 propsMap
  each( props, ( name, prop ) => {
    const { attr } = prop;

    if( attr ){
      const map = propsMap[ attr ] || (
        propsMap[ attr ] = []
      );

      map.push({
        name,
        from: prop.from || returnArg
      });
    }
  });
}

/**
 * 格式化组件 prop 配置
 * @param { string | symbol } name prop 名称
 * @param { {} | null } prop 用户传入的 prop
 */
function initProp( name, prop ){
  /** 格式化后的 props 配置 */
  const options = {};

  initPropAttribute( name, prop, options );

  if( prop ){
    // 单纯设置变量类型
    if( isFunction( prop ) ){
      options.from = prop;
    }
    // 高级用法
    else{
      initPropType( prop, options );
      initPropDefault( prop, options );
    }
  }

  // 如果传入值是 Boolean 类型, 则需要另外处理
  if( options.from === Boolean ){
    options.from = fromBooleanAttribute;
  }

  return options;
}

/**
 * 初始化 options.attr
 */
function initPropAttribute( name, prop, options ){
  // 当前 prop 是否是 Symbol 类型的
  options.isSymbol = isSymbol( name );
  // 当前 prop 的取值 attribute
  options.attr = prop && prop.attr || (
    options.isSymbol
      // 没有定义 attr 名称且是 symbol 类型的 attr 名称, 则不设置 attr 名称
      ? null
      // 驼峰转为以连字符号连接的小写 attr 名称
      : hyphenate( name )
  );
}

/**
 * 初始化 options.type 变量类型
 */
function initPropType( prop, options ){
  const type = prop.type;

  if( type != null ){
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
}

/**
 * 初始化 options.default 默认值
 */
function initPropDefault( prop, options ){
  if( 'default' in prop ){
    const $default = prop.default;

    if( isFunction( $default ) || !isObject( $default ) ){
      options.default = $default;
    }
  }
}