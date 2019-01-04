import noop from "../../../shared/global/ZenJS/noop";


/**
 * 生命周期 -> 组件挂载并渲染完成
 */
export default function mounted( options ){
  options.mounted = options.mounted || noop;
}