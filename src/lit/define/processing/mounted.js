/**
 * 生命周期 -> 挂载完成
 */
export default function mounted( options ){
  if( !options.mounted ){
    options.mounted = ZenJS.noop;
  }
}