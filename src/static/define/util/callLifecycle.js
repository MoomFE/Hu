

export default ( targetProxy, lifecycle ) => {
  const lifecycleFn = targetProxy.$options[ lifecycle ];

  if( lifecycleFn ){
    lifecycleFn.call( targetProxy );
  }

  targetProxy.$emit( 'hook:' + lifecycle );
}