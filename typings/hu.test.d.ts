declare function describe( name: string, fn: () => {} ): void;
declare function it( name: string, fn: () => {} ): void;

// ------

declare const should: Chai.Should;
declare const expect: Chai.ExpectStatic;

interface Window{
  should: Chai.Should;
  expect: Chai.ExpectStatic;
}

// ------

/** 返回一个唯一的自定义元素名称 */
declare const customName: string;

interface Window{
  /** 返回一个唯一的自定义元素名称 */
  customName: string;
}

// ------

/**
 * 触发事件
 * @param target 触发事件的元素对象
 * @param type 事件名称
 * @param process 其它处理
 */
declare function triggerEvent( target: Element, type: string, process: Function ): void;

interface Window{
  /**
   * 触发事件
   * @param target 触发事件的元素对象
   * @param type 事件名称
   * @param process 其它处理
   */
  triggerEvent( target: Element, type: string, process: Function ): void;
}

// ------

/**
 * 移除传入 innerHTML 字符串中的空注释节点
 * @param html 需要移除空注释节点的 innerHTML 字符串
 */
declare function stripExpressionMarkers( html: string ): string;

interface Window{
  /**
   * 移除传入 innerHTML 字符串中的空注释节点
   * @param html 需要移除空注释节点的 innerHTML 字符串
   */
  stripExpressionMarkers( html: string ): string;
}

// ------

/**
 * 当前模板插值绑定标识字符串
 */
declare const templateMarker: string;

interface Window{
  /**
   * 当前模板插值绑定标识字符串
   */
  templateMarker: string;
}

// ------

/**
 * 捕获传入方法在运行中使用 console.error 抛出的所有异常并且和传入的预期异常进行比对
 * @param fn 需要捕获异常的方法
 * @param msg 预期的异常字符串或字符串数组
 */
declare function watchError( fn: () => {}, msg: string | string[] ): Chai.Assertion;

interface Window{
  /**
   * 捕获传入方法在运行中使用 console.error 抛出的所有异常并且和传入的预期异常进行比对
   * @param fn 需要捕获异常的方法
   * @param msg 预期的异常字符串或字符串数组
   */
  watchError( fn: () => {}, msg: string | string[] ): Chai.Assertion;
}

// ------

/**
 * 判断当前环境是否在使用 for...in 循环时触发 Proxy 的 ownKeys 拦截
 */
declare const supportsForInTriggerProxyOwnKeys: boolean;

interface Window{
  /**
   * 判断当前环境是否在使用 for...in 循环时触发 Proxy 的 ownKeys 拦截
   */
  supportsForInTriggerProxyOwnKeys: boolean;
}

// ------