import get from "../../../shared/util/get";


/**
 * 生命周期 -> 组件创建完成
 */
export default function created( options ){
  const createdFns = [];

  if( options.created ){
    createdFns.push(
      get( options, 'created' )
    );
  }

  if( options.mixins && options.mixins.length ){
    createdFns.$concatTo(
      0,
      options.mixins.map( mixins => mixins.created )
    );
  }

  createdFns.$deleteValue( void 0 );

  if( createdFns.length ){
    options.connectedCallback.push( ...createdFns );
  }
}