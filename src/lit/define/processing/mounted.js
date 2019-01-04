import get from "../../../shared/util/get";


/**
 * 生命周期 -> 组件挂载并渲染完成
 */
export default function mounted( options ){
  const mounted = get( options, 'mounted' );

  if( mounted ){
    options.firstUpdated.push( mounted )
  }
}