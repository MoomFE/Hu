import create from "../../../shared/global/Object/create";
import { observe, observeMap } from "./observe";
import { dependentsMap, createCollectingDependents } from "./collectingDependents";
import each from "../../../shared/util/each";
import noop from "../../../shared/util/noop";


export default
/**
 * @param {{}} computed
 * @param {any} self 计算属性的 this 指向
 * @param {boolean} isWatch 当前是否用于创建监听
 */
( computed, self, isWatch ) => {

  /** 当前计算属性容器的子级的一些参数 */
  const computedOptionsMap = new Map();
  /** 当前计算属性容器对象 */
  const computedTarget = create( null );
  /** 当前计算属性容器的观察者对象 */
  const computedTargetProxy = observe( computedTarget );
  /** 当前计算属性容器的获取与修改拦截器 */
  const computedTargetProxyInterceptor = new Proxy( computedTargetProxy, {
    get: computedTargetProxyInterceptorGet( computedOptionsMap ),
    set: computedTargetProxyInterceptorSet( computedOptionsMap )
  });

  /** 给当前计算属性添加子级的方法 */
  const appendComputed = createAppendComputed.call( self, computedTarget, computedTargetProxy, computedOptionsMap, isWatch );
  /** 给当前计算属性移除子级的方法, 目前仅有监听需要使用 */
  let removeComputed = isWatch ? createRemoveComputed.call( self, computedOptionsMap )
                               : void 0;

  // 添加计算属性
  each( computed, appendComputed );

  return [
    computedTarget,
    computedTargetProxyInterceptor,
    appendComputed,
    removeComputed
  ];
}


/**
 * 返回添加单个计算属性的方法
 */
function createAppendComputed( computedTarget, computedTargetProxy, computedOptionsMap, isWatch ){

  const isComputed = !isWatch;
  const observeOptions = isComputed && observeMap.get( computedTarget );

  /**
   * @param {string} name 计算属性存储的名称
   * @param {{}} computed 计算属性 getter / setter 对象
   * @param {boolean} isWatchDeep 当前计算属性是否是用于创建深度监听
   */
  return ( name, computed, isWatchDeep ) => {
    /** 计算属性的 setter */
    const set = ( computed.set || noop ).bind( this );
    /** 计算属性的 getter */
    const get = computed.get.bind( this );
    /** 计算属性的 getter 依赖收集包装 */
    const collectingDependentsGet = createCollectingDependents(
      () => computedTargetProxy[ name ] = get(),
      isComputed,
      isWatch, isWatchDeep,
      observeOptions, name
    );

    // 添加占位符
    computedTarget[ name ] = void 0;
    // 存储计算属性参数
    computedOptionsMap.set( name, {
      id: collectingDependentsGet.id,
      get: collectingDependentsGet,
      set
    });
  };
}

/**
 * 返回移除单个计算属性的方法
 */
function createRemoveComputed( computedOptionsMap ){
  /**
   * @param name 需要移除的计算属性
   */
  return name => {
    // 获取计算属性的参数
    const computedOptions = computedOptionsMap.get( name );

    // 有这个计算属性
    if( computedOptions ){
      // 清空依赖
      dependentsMap[ computedOptions.id ].cleanDeps();
    }
  };
}

/**
 * 返回计算属性的获取拦截器
 */
const computedTargetProxyInterceptorGet = computedOptionsMap => ( target, name ) => {
  // 获取计算属性的参数
  const computedOptions = computedOptionsMap.get( name );

  // 防止用户通过 $computed 获取不存在的计算属性
  if( computedOptions ){
    const dependentsOptions = dependentsMap[ computedOptions.id ];

    // 计算属性未初始化或需要更新
    if( !dependentsOptions.isInit || dependentsOptions.shouldUpdate ){
      computedOptions.get();
    }
  }

  return target[ name ];
}

/**
 * 返回计算属性的设置拦截器
 */
const computedTargetProxyInterceptorSet = computedOptionsMap => ( target, name, value ) => {
  const computedOptions = computedOptionsMap.get( name );

  // 防止用户通过 $computed 设置不存在的计算属性
  if( computedOptions ){
    return computedOptions.set( value ), true;
  }
  return false;
}