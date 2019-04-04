import { optionsMap } from "../initOptions/index";


export default (
  targetProxy,
  lifecycle,
  options = optionsMap[ targetProxy.$info.name ]
) => {
  const fns = options[ lifecycle ];

  if( fns ){
    for( const fn of fns ) fn.call( targetProxy );
  }

  targetProxy.$emit( 'hook:' + lifecycle );
}