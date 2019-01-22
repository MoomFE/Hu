
export default function each( obj, cb ){
  for( let name in obj ) cb(
    name,
    obj[ name ]
  );
}