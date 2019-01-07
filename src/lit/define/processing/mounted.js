import get from "../../../shared/util/get";


/**
 * 生命周期 -> 组件挂载并渲染完成
 */
export default function mounted( options ){
  const mountedFns = [];

  if( options.mounted ){
    mountedFns.push(
      get( options, 'mounted' )
    );
  }

  if( options.mixins && options.mixins.length ){
    mountedFns.$concatTo(
      0,
      options.mixins.map( mixins => mixins.mounted )
    );
  }

  mountedFns.$deleteValue( void 0 );

  if( mountedFns.length ){
    options.firstUpdated.push( ...mountedFns );
  }
}