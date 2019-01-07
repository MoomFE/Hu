import get from "../../../shared/util/get";
import keys from "../../../shared/global/ZenJS/keys";
import $each from "../../../shared/global/Object/$each";
import isFunction from "../../../shared/global/ZenJS/isFunction";
import $isPlainObject from "../../../shared/global/Object/$isPlainObject";
import defineValue from "../../../shared/global/ZenJS/defineValue";
import entries from "../../../shared/global/ZenJS/entries";


export default function watch( options, custom, customProto ){
  const watch = get( options, 'watch' );
  const watcher = initWatch( watch || {} );

  let isFirst = true;
  options.updateStart.push(function( changedProperties ){
    changedProperties.forEach(( oldValue, key ) => {
      if( watcher[ key ] ){
        let value = this[ key ];

        watcher[ key ].forEach( options => {
          if( isFirst ? options.immediate : !options.immediate ){
            options.immediate = false;
            options.handler.call( this, value, oldValue );
          }
        });
      }
    });
    isFirst = false;
  });

  defineValue( customProto, '$watch', function( name, options ){

    entries(
      initWatch(
        {}.$set( name, options )
      )
    ).forEach( keyValue => {
      const [ key, value ] = keyValue;

      if( watcher[ key ] ){
        watcher[ key ].$concat( value );
      }else{
        watcher[ key ] = value;
      }
    });

  });
}


function initWatch( watch ){
  const watcher = {};

  $each( watch, ( name, options ) => {
    
    if( isFunction( options ) ){
      options = {
        immediate: false,// 是否立即执行
        handler: options
      };
    }else if( !( $isPlainObject( options ) && options.handler ) ){
      return;
    }

    watcher[ name ] = [
      options
    ];
  });

  return watcher;
}

// // 第一次更新元素后开始监听
// options.updated.push( changedProperties => {
//   changedProperties.forEach(( oldValue, key ) => {
//     if( watcher[ key ] ){
//       const value = this[ key ];

//       watcher[ key ].forEach( watch => {
//         watch.call( this, value, oldValue );
//       });
//     }
//   });
// });