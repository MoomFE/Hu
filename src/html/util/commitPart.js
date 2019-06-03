import { directiveFns, activeDirectiveFns } from "../../static/directiveFn/const/index";


export default
/**
 * 给指令提交更改所用方法
 * @param {{}} part 需要提交更改的指令
 * @param {any} value 提交更改的值
 */
( part, value ) => {
  /**
   * 尝试在指令方法合集中获取指令方法的信息
   * 如果可以获取到信息
   * 那么提交的值就是指令方法
   */
  const directiveFnOptions = directiveFns.get( value );
  /**
   * 尝试在已激活的指令方法合集中获取指令方法的信息
   * 如果可以获取到信息
   * 那么说明上次提交值时也是指令方法
   */
  const oldDirectiveFnOptions = activeDirectiveFns.get( part );

  // 如果上次提交的也是指令方法, 那么需要做一些处理
  if( oldDirectiveFnOptions ){
    // 如果这次提交的值同样是指令方法, 那么需要判断是否是同一种指令方法
    // 如果不是同一种指令方法, 需要将之前的指令方法销毁
    if( directiveFnOptions ){
      // 两个指令方法的 ID 不同, 说明不是同一个指令方法
      if( directiveFnOptions[0] !== oldDirectiveFnOptions[0] ){
        // 将之前的指令方法销毁
        oldDirectiveFnOptions[ 1 ]( part );
      }
    }
    // 如果这次提交的值不是指令方法, 那么需要将上次的指令方法销毁
    else{
      // 将之前的指令方法销毁
      oldDirectiveFnOptions[ 1 ]( part );
      // 删除缓存信息
      activeDirectiveFns.delete( part );
    }
  }

  // 如果值是指令方法, 那么需要存储相关信息
  // 相关指令注销时, 同时也要注销指令方法
  if( directiveFnOptions ){
    activeDirectiveFns.set( part, directiveFnOptions );
  }

  // 提交更改
  part.commit( value, !!directiveFnOptions );
}