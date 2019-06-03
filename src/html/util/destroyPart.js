import { activeDirectiveFns } from "../../static/directiveFn/const/index";


export default
/**
 * 注销指令调用的方法
 * @param {{}} part 需要注销的指令
 */
part => {
  /**
   * 尝试在已激活的指令方法合集中获取指令方法的信息
   * 如果可以获取到信息
   * 说明该指令是使用了指令方法的
   */
  const directiveFnOptions = activeDirectiveFns.get( part );

  // 需要将指令方法销毁
  if( directiveFnOptions ){
    // 将指令方法销毁
    directiveFnOptions[ 1 ]( part );
    // 删除缓存信息
    activeDirectiveFns.delete( part );
  }

  // 指令有 destroy 方法
  // 也进行调用
  if( part.destroy ){
    part.destroy();
  }
}