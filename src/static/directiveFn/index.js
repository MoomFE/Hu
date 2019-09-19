import { directiveFns, activeDirectiveFns } from "./const/index";
import uid from "../../shared/util/uid";


/**
 * 注册指令方法
 */
export default function directiveFn( directive ){
  /** 当前指令方法的 ID */
  const id = uid();

  /**
   * 指令创建步骤
   *  - 注册指令方法后
   *  - 返回方法等待用户调用并传参
   * @param  {...any} args 
   */
  function create( ...args ){
    /**
     * 指令使用步骤
     *  - 用户调用并传参后
     *  - 返回方法等待渲染时被调用
     * @param {*} part 
     */
    function using( part ){
      const options = activeDirectiveFns.get( part );
      const instance = options.ins || (
        options.ins = new directive( part )
      );

      instance.commit( ...options.args );
    }

    // 指令方法可能需要代理指令使用步骤
    const usingProxy = 'using' in directive ? directive.using( using )
                                            : using;

    // 将指令方法相关的信息存储起来
    directiveFns.set( usingProxy, {
      id,
      args,
      directive
    });

    // 返回方法
    // 等待下一步调用
    return usingProxy;
  }

  // 指令方法可能需要代理指令创建步骤
  return 'create' in directive ? directive.create( create )
                               : create;
};