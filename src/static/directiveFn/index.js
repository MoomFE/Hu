import { directiveFns } from "./const/index";
import { isArray } from "../../shared/global/Array/index";
import isFunction from "../../shared/util/isFunction";


/**
 * 注册指令方法
 */
export default ( directiveFn ) => {
  // 注册指令方法后
  // 生成等待用户调用的方法
  return ( ...args ) => {
    // 将用户传入的参数传递给注册的指令方法
    // 生成等待模板解析的方法
    let directive = directiveFn( ...args );
    let directiveDestroy;

    // 指令方法返回的是数组
    // 可能同时注册了指令方法的注销方法
    if( isArray( directive ) ){
      [ directive, directiveDestroy ] = directive;
    }

    // 将指令方法的注销方法存起来
    if( isFunction( directiveDestroy ) ){
      directive.destroy = directiveDestroy;
    }

    // 标记生成的方法为指令方法
    directiveFns.add( directive );

    // 返回方法
    // 等待下一步调用
    return directive;
  };
}