import { directiveFns } from "../const/index";


/**
 * 注册指令方法
 */
export default ( directiveFn ) => ( ...args ) => {
  const directive = directiveFn( ...args );
  directiveFns.add( directive );
  return directive;
}