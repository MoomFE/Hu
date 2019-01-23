export default ( obj, cb ) => {
  for( let name in obj ){
    cb( name, obj[ name ] );
  }
}