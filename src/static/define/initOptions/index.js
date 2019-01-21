import create from "../../../shared/global/Object/create";
import isArray from "../../../shared/global/Array/inArray";
import fromEntries from "../../../shared/polyfill/Object.fromEntries";


export default function initOptions( _options ){
  const options = create( null );

  initProps( _options, options );
}


function initProps( _options, options ){

  let props = _options.props;
  let propsIsArray = false;

  // 去除不合法参数
  if( props == null && !( propsIsArray = isArray( props ) ) ){
    return;
  }

  // 格式化数组参数
  if( propsIsArray ){
    if( !props.length ) return;

    props = fromEntries(
      props.map( prop => [ prop, {} ] )
    );
  }
}