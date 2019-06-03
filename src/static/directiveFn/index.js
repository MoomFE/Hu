import { directiveFns } from "./const/index";
import { isArray } from "../../shared/global/Array/index";
import isFunction from "../../shared/util/isFunction";
import uid from "../../shared/util/uid";
import noop from "../../shared/util/noop";


/**
 * 注册指令方法
 */
export default ( directiveFn ) => {

  /** 当前指令方法的 ID */
  const id = uid();

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

    // 如果没有指令方法的注销方法, 则将注销方法指向到空方法
    if( !isFunction( directiveDestroy ) ){
      directiveDestroy = noop;
    }

    // 将指令方法相关的信息存储起来
    // 
    directiveFns.set( directive, [
      id,
      directiveDestroy
    ]);

    // 返回方法
    // 等待下一步调用
    return directive;
  };
}