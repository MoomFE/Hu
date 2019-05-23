import { apply } from "../global/Reflect/index";
import { assign, create } from "../global/Object/index";


/**
 * 创建一个干净的目标对象
 * 并把传入方法的对象全部浅拷贝到目标对象并返回目标对象
 */
export default ( ...args ) => {
  return apply( assign, null, [
    create( null ), ...args
  ]);
}