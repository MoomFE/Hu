import { directiveFns, activeDirectiveFns } from '../../static/directiveFn/const';


export default
/**
 * 给指令提交更改所用方法
 * @param {{}} part 需要提交更改的指令
 * @param {any} value 提交更改的值
 */
(part, value) => {
  /**
   * 尝试从指令方法合集中获取传入值的信息
   * 如果获取到了
   * 那么提交的值就是指令方法
   */
  const options = directiveFns.get(value);
  /**
   * 尝试从已激活的指令方法合集中获取当前指令的相关信息
   * 如果可以获取到信息
   * 那么说明上次提交值时使用的也是指令方法
   */
  let activeOptions = activeDirectiveFns.get(part);

  // 如果上次提交的是指令方法, 那么需要进一步处理
  if (activeOptions) {
    // 1. 如果这次提交的值不是指令方法, 那么需要将上次的指令方法销毁
    // 2. 如果这次提交的值是指令方法, 但不是同一个指令方法, 那么需要将上次的指令方法销毁
    if (!options || (options && options.id !== activeOptions.opts.id)) {
      // 那么将上一次提交的指令方法进行销毁
      activeOptions.ins && activeOptions.ins.destroy && activeOptions.ins.destroy();
      // 删除缓存信息
      activeDirectiveFns.delete(part);
      activeOptions = undefined;
    }
    // 如果上次的指令方法和这次的指令方法相同, 那么将本次指令方法的参数进行转移
    // 继续使用上次的指令方法实例
    if (options && activeOptions) {
      activeOptions.args = options.args;
    }
  }

  // 如果上次提交的值缓存信息
  // 说明上次的不是指令方法或不是同一个指令方法
  // 那么需要存储相关信息
  // 相关指令注销时, 同时也要注销指令方法
  if (options && !activeOptions) {
    activeDirectiveFns.set(part, {
      opts: options,
      args: options.args
    });
  }

  // 提交更改
  part.commit(value, !!options);
};
