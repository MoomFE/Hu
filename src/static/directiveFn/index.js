import { directiveFns, activeDirectiveFns } from './const';
import uid from '../../shared/util/uid';
import isFunction from '../../shared/util/isFunction';


/**
 * 注册指令方法
 */
export default function directiveFn(Directive) {
  /** 当前指令方法的 ID */
  const id = uid();
  let isRun = false;

  /**
   * 指令创建步骤
   *  - 注册指令方法后
   *  - 返回方法等待用户调用并传参
   * @param  {...any} args
   */
  return (...args) => {
    /**
     * 指令使用步骤
     *  - 用户调用并传参后
     *  - 返回方法等待渲染时被调用
     * @param {*} part
     */
    function using(part) {
      const options = activeDirectiveFns.get(part);

      // 指令方法调用的子指令方法
      if (isRun) {
        (options.child = new Directive(part)).commit(...args);
        // eslint-disable-next-line brace-style
      }
      // 指令方法本身被调用
      else {
        const instance = options.ins || (
          options.ins = new Directive(part)
        );

        isRun = true;
        instance.commit(...options.args);
        isRun = false;
      }
    }

    // 最终的指令使用步骤方法
    let usingProxy = using;

    // 指令方法可能需要代理指令使用步骤
    if (isFunction(Directive.proxy) && !isFunction(usingProxy = Directive.proxy(using, args))) {
      usingProxy = using;
    }

    // 将指令方法相关的信息存储起来
    directiveFns.set(usingProxy, {
      id,
      args,
      directive: Directive
    });

    // 返回方法
    // 等待下一步调用
    return usingProxy;
  };
}
