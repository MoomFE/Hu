
export default function get( object, name ){
  const value = object[ name ];
  delete object[ name ];
  return value;
}