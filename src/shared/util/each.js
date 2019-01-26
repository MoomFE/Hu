export default ( obj, cb ) => {
  const keys = Reflect.ownKeys( obj );

  for( let key of keys ){
    cb( key, obj[ key ] );
  }
}