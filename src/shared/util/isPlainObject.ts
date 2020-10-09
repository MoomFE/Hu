/**
 * 判断传入对象是否是纯粹的对象
 * @param value 需要判断的对象
 */
export default function isPlainObject(value: any): boolean{
  return Object.prototype.toString.call(value) === '[object Object]'
}