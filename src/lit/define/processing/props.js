import defineGet from "../../../shared/global/ZenJS/defineGet";
import isArray from "../../../shared/global/ZenJS/isArray";
import $isPlainObject from "../../../shared/global/Object/$isPlainObject";
import get from "../../../shared/util/get";
import fromEntries from "../../../shared/global/ZenJS/fromEntries";
import entries from "../../../shared/global/ZenJS/entries";
import isString from "../../../shared/global/ZenJS/isString";
import isFunction from "../../../shared/global/ZenJS/isFunction";
import defineValue from "../../../shared/global/ZenJS/defineValue";
import hasOwnProperty from "../../../shared/global/Object/hasOwnProperty";
import $each from "../../../shared/global/Object/$each";
import $assign from "../../../shared/global/Object/$assign";


/**
 * 初始化 props
 */
export default function props( options, custom ){

  let props = get( options, 'props' );
  let propsIsArray = false;

  // Mixins
  if( options.mixins && options.mixins.length ){
    props = $assign.apply( null, [].concat(
      options.mixins.map( mixins => mixins.props ),
      props
    ));
  }

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
        // 设置变量类型
        if( isFunction( value ) ){
          options.type = value;
        }
        // 高级用法
        else{
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
          // 默认值
          if( 'default' in value ){
            const _default = value.default;

            switch( typeof _default ){
              case 'object': break;
              case 'function': {
                defineGet( options, 'default', _default.bind( void 0 ) );
                break;
              }
              default: {
                defineValue( options, 'default', _default );
                break;
              }
            }
          }
        }
      }

      // 当显式的设定了类型后, 比如: ( String || Number || Boolean )
      // 对没有默认值的类型定义一个初始值
      if( options.type && !( 'default' in options ) ){
        switch( options.type ){
          case String: {
            options.default = '';
            break;
          }
          case Number: {
            options.default = 0;
            break;
          }
          case Boolean: {
            options.default = false;
            break;
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

  // 初始化默认值
  options.connectedCallback.push(function(){
    $each( props, ( name, options ) => {
      if( !hasOwnProperty.call( this, `__${ name }` ) && 'default' in options ){
        this[ name ] = options.default;
      }
    });
  });

}