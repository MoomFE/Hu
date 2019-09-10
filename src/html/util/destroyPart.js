import { activeDirectiveFns } from "../../static/directiveFn/const/index";


export default
/**
 * 注销指令调用的方法
 * @param {{}} part 需要注销的指令
 */
part => {
  /**
   * 尝试从已激活的指令方法合集中获取当前指令的相关信息
   * 如果可以获取到信息
   * 那么说明上次提交值时使用的是指令方法
   */
  const activeOptions = activeDirectiveFns.get( part );

  // 是指令方法, 需要将指令方法销毁
  if( activeOptions ){
    const instance = activeOptions.ins;

    // 那么将上一次提交的指令方法进行销毁
    instance && instance.destroy && instance.destroy();
    // 删除缓存信息
    activeDirectiveFns.delete( part );
  }

  // 将指令销毁
  part.destroy && part.destroy();
}