import create from "../../../shared/global/Object/create";


export default function initProps( root, options, target ){

  const $props = target.$props = create( null );
  const props = options.props;

  for( let name in props ){
    let item = props[ name ];

    console.log( name, options )
  }

}