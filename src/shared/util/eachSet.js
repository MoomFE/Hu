

export default
/**
 * Set 的遍历方法
 * @param { Map | Set } obj 需要遍历的 Set 对象
 * @param {( value:string, index: number ) => void} cb 遍历对象的方法
 */
( obj, cb ) => {
  let index = 0;
  let length = obj.size;

  for( let item of obj ){
    index < length && cb( item, index++ );
  }
}