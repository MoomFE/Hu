import { directives } from "../const/index";


/**
 * 注册指令方法
 */
export default ( directiveFn ) => ( ...args ) => {
  const directive = directiveFn( ...args );
  directives.add( directive );
  return directive;
}