import { directiveFns, activeDirectiveFns } from "./const/index";
import uid from "../../shared/util/uid";


/**
 * 注册指令方法
 */
export default function directiveFn( directive ){
  /** 当前指令方法的 ID */
  const id = uid();

  // 注册指令方法后
  // 返回方法等待用户调用并传参
  return ( ...args ) => {
    // 用户调用并传参后
    // 返回方法等待渲染时被调用
    function directiveFn( part ){
      const options = activeDirectiveFns.get( part );
      const instance = options.ins || (
        options.ins = new directive( part )
      );

      instance.commit( ...options.args );
    }

    // 将指令方法相关的信息存储起来
    directiveFns.set( directiveFn, {
      id,
      args
    });

    // 返回方法
    // 等待下一步调用
    return directiveFn;
  };
};