/**
 * 传入一个键值对的列表, 并返回一个带有这些键值对的新对象 ( 是 Object.entries 的反转 )
 * Object.fromEntries polyfill
 * 
 * From @moomfe/zenjs
 */
export default function fromEntries( iterable ){

  const result = {};
  const newIterable = Array.from( iterable );

  let item;
  let index = newIterable.length;

  while( index-- ){
    item = newIterable[ index ];

    if( item && item.length ){
      result[ item[ 0 ] ] = item[ 1 ];
    }
  }

  return result;
}