import { activeDirectiveFns } from "../../static/directiveFn/const/index";


export default
/**
 * 注销指令调用的方法
 * @param {{}} part 需要注销的指令
 */
part => {
  /** 当前指令使用的指令方法 */
  const directiveFn = activeDirectiveFns.get( part );

  // 如果有使用指令方法
  // 那么先注销指令方法
  if( directiveFn && directiveFn.destroy ){
    directiveFn.destroy( part );
    activeDirectiveFns.delete( part );
  }
  // 指令有 destroy 方法
  // 也进行调用
  if( part.destroy ){
    part.destroy();
  }
}