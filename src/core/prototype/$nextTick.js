import nextTick from "../../static/nextTick/index";


/**
 * 在下次 DOM 更新循环结束之后执行回调
 */
export default function( callback ){
  return nextTick( callback, this );
}