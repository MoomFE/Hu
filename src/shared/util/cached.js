import { create } from '../global/Object/index';
import { has } from '../global/Reflect/index';


export default
/**
 * 创建一个可以缓存方法返回值的方法
 */
(fn) => {
  const cache = create(null);

  return (str) => {
    if (has(cache, str)) return cache[str];
    return (
      cache[str] = fn(str)
    );
  };
};
