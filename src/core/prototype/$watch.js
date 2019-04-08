import isPlainObject from "../../shared/util/isPlainObject";
import isString from "../../shared/util/isString";
import parsePath from "../../static/define/util/parsePath";
import isFunction from "../../shared/util/isFunction";
import createComputed from "../../static/observable/createComputed";
import uid from "../../shared/util/uid";
import isEqual from "../../shared/util/isEqual";
import emptyObject from "../../shared/const/emptyObject";



/**
 * 存放每个实例的 watch 数据
 */
const watcherMap = new WeakMap();

/**
 * 监听 Hu 实例对象
 */
export default function $watch( expOrFn, callback, options ){
  // 另一种写法
  if( isPlainObject( callback ) ){
    return this.$watch( expOrFn, callback.handler, callback );
  }

  const self = this || emptyObject;
  let watchFn;

  // 使用键路径表达式
  if( isString( expOrFn ) ){
    watchFn = parsePath( expOrFn ).bind( self );
  }
  // 使用计算属性函数
  else if( isFunction( expOrFn ) ){
    watchFn = expOrFn.bind( self );
  }
  // 不支持其他写法
  else return;

  let watchTarget, watchTargetProxyInterceptor, appendComputed, removeComputed;

  if( watcherMap.has( self ) ){
    [ watchTarget, watchTargetProxyInterceptor, appendComputed, removeComputed ] = watcherMap.get( self );
  }else{
    watcherMap.set(
      self,
      [ watchTarget, watchTargetProxyInterceptor, appendComputed, removeComputed ] = createComputed( null, true )
    );
  }

  // 初始化选项参数
  options = options || {};

  /** 当前 watch 的存储名称 */
  const name = uid();
  /** 当前 watch 的回调函数 */
  const watchCallback = callback.bind( self );
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
};