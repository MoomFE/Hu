import nextTick from "../../../static/nextTick/nextTick";
import { createCollectingDependents } from "../../../static/observable/util/collectingDependents";
import { optionsMap } from "../../../static/define/initOptions/index";
import html, { TemplateResult, render } from "../../../html/index";
import { observe, observeProxyMap } from "../../../static/observable/util/observe";
import isSymbolOrNotReserved from "../../util/isSymbolOrNotReserved";
import isString from "../../util/isString";
import isReserved from "../../util/isReserved";
import isPlainObject from "../../util/isPlainObject";
import parsePath from "../../../static/define/util/parsePath";
import isFunction from "../../util/isFunction";
import uid from "../../util/uid";
import createComputed from "../../../static/observable/util/createComputed";
import isEqual from "../../util/isEqual";


/**
 * 存放每个实例的 watch 数据
 */
const watcherMap = new WeakMap();


export default class HuConstructor{
  constructor( name ){
    /** 当前实例的实例配置 */
    const options = optionsMap[ name ];
    /** 当前实例对象 */
    const target = this;
    /** 当前实例观察者对象 */
    const targetProxy = observe( target, proxyOptions );

    /** 迫使 Hu 实例重新渲染 */
    this.$forceUpdate = createCollectingDependents(() => {
      const templateResult = options.render.call( targetProxy, html );

      if( templateResult instanceof TemplateResult ){
        render( templateResult, this.$el );
      }
    });

  }

  /** 监听 Hu 实例对象 */
  $watch( expOrFn, callback, options ){
    let watchFn;

    // 另一种写法
    if( isPlainObject( callback ) ){
      return this.$watch( expOrFn, callback.handler, callback );
    }

    // 使用键路径表达式
    if( isString( expOrFn ) ){
      watchFn = parsePath( expOrFn ).bind( this );
    }
    // 使用计算属性函数
    else if( isFunction( expOrFn ) ){
      watchFn = expOrFn.bind( this );
    }
    // 不支持其他写法
    else return;

    let watchTarget, watchTargetProxyInterceptor, appendComputed, removeComputed;

    if( watcherMap.has( this ) ){
      [ watchTarget, watchTargetProxyInterceptor, appendComputed, removeComputed ] = watcherMap.get( this );
    }else{
      watcherMap.set(
        this,
        [ watchTarget, watchTargetProxyInterceptor, appendComputed, removeComputed ] = createComputed( null, null, true )
      );
    }

    // 初始化选项参数
    options = options || {};

    /** 当前 watch 的存储名称 */
    const name = uid();
    /** 当前 watch 的回调函数 */
    const watchCallback = callback.bind( this );
    /** 监听对象内部值的变化 */
    const isWatchDeep = !!options.deep;
    /** 值改变是否运行回调 */
    let immediate, runCallback = immediate = !!options.immediate;

    // 添加监听
    appendComputed( name, {
      get: () => {
        const oldValue = watchTarget[ name ];
        const value = watchFn();

        if( runCallback ){
          //   首次运行             值不一样        值一样的话, 判断是否是深度监听
          if( immediate || !isEqual( value, oldValue ) || isWatchDeep ){
            watchCallback( value, oldValue );
          }
        }

        return value;
      }
    }, isWatchDeep );

    // 首次运行, 以收集依赖
    watchTargetProxyInterceptor[ name ];
    // 下次值改变时运行回调
    runCallback = true;
    immediate = false;

    // 返回取消监听的方法
    return () => {
      removeComputed( name );
    }
  }

  /** 挂载实例 */
  $mount( selectors ){
    const { $info } = this;

    // 首次挂载
    if( !$info.isMounted ){

      // 使用 new 创建的实例
      if( !$info.isCustomElement ){
        const el = selectors && (
          isString( selectors ) ? document.querySelector( selectors )
                                : selectors
        );

        if( !el || el === document.body || el === document.documentElement ){
          return this;
        }

        observeProxyMap.get( this ).target.$el = el;
      }

      /** 当前实例的实例配置 */
      const options = optionsMap[ $info.name ];
      /** 当前实例 $info 原始对象 */
      const infoTarget = observeProxyMap.get( $info ).target;

      // 运行 beforeMount 生命周期方法
      options.beforeMount.call( this );

      // 执行 render 方法, 进行渲染
      this.$forceUpdate();

      // 标记首次实例挂载已完成
      infoTarget.isMounted = true;

      // 运行 mounted 生命周期方法
      options.mounted.call( this );
    }

    return this;
  }

  /** 在下次 DOM 更新循环结束之后执行回调 */
  $nextTick( callback ){
    return nextTick( callback, this );
  }
}


const proxyOptions = {
  set: {
    before: ( target, name ) => {
      return isSymbolOrNotReserved( name ) ? null : 0;
    }
  },
  get: {
    before: ( target, name ) => {
      return isString( name ) && isReserved( name ) ? 0 : null;
    }
  },
  deleteProperty: {
    before: ( target, name ) => {
      return isString( name ) && isReserved( name ) ? 0 : null;
    }
  }
};