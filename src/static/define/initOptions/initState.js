import each from "../../../shared/util/each";
import isFunction from "../../../shared/util/isFunction";
import noop from "../../../shared/util/noop";
import isPlainObject from "../../../shared/util/isPlainObject";
import isObject from "../../../shared/util/isObject";
import isString from "../../../shared/util/isString";
import { isArray } from "../../../shared/global/Array/index";


export default function initState( isCustomElement, userOptions, options, mixins, isMixin ){

  const {
    methods,
    globalMethods,
    data,
    computed,
    watch
  } = userOptions;

  initMethods( methods, options, 'methods' );
  initMethods( globalMethods, options, 'globalMethods' );
  initData( isCustomElement, data, options );
  initComputed( computed, options );
  initWatch( watch, options );
  isCustomElement && initStyles( userOptions.styles, options );

  if( !isMixin ){
    // 处理 Mixins
    if( mixins ){
      for( let mixin of mixins ){
        initState( isCustomElement, mixin, options, null, true );
      }
    }
    // 处理自定义元素的样式
    if( isCustomElement && options.styles ){
      const style = document.createElement('style');

      style.textContent = options.styles.join('');
      options.styles = style;
    }
  }
}


function initMethods( userMethods, options, name ){
  if( userMethods ){
    const methods = options[ name ] || ( options[ name ] = {} );

    each( userMethods, ( key, method ) => {
      if( !methods[ key ] && isFunction( method ) ){
        methods[ key ] = method;
      }
    });
  }
}

function initData( isCustomElement, userData, options ){
  if( isFunction( userData ) || !isCustomElement && isPlainObject( userData ) ){
    const dataList = options.dataList || ( options.dataList = [] );

    dataList.push( userData );
  }
}

function initComputed( userComputed, options ){
  if( userComputed ){
    const computed = options.computed || ( options.computed = {} );

    each( userComputed, ( key, userComputed ) => {
      if( !computed[ key ] && userComputed ){
        const isFn = isFunction( userComputed );
        const get = isFn ? userComputed : ( userComputed.get || noop );
        const set = isFn ? noop : ( userComputed.set || noop );

        computed[ key ] = {
          get,
          set
        };
      }
    });
  }
}

function initWatch( userWatch, options ){
  // 保证 watch 始终被初始化
  // 防止其他地方使用 watch 时且在 Firefox 57 版本之前读取到 Object.prototype.watch
  const watches = options.watch || (
    options.watch = {}
  );

  // 同上, 防止用户未定义 watch 时读取到的是 Object.prototype.watch
  if( isObject( userWatch ) ){
    each( userWatch, ( key, value ) => {
      const watch = watches[ key ] || ( watches[ key ] = [] );

      watch.splice( 0, 0, value );
    });
  }
}

function initStyles( userStyles, options ){
  let stylesIsString = isString( userStyles );

  if( stylesIsString || isArray( userStyles ) ){
    const styles = options.styles || ( options.styles = [] );

    if( stylesIsString ) styles.splice( 0, 0, userStyles );
    else styles.splice( 0, 0, ...userStyles );
  }
}