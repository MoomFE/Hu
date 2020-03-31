import { toString } from '../global/Object/prototype';


export default
/**
 * 判断传入对象是否是纯粹的对象
 * @param {any} value 需要判断的对象
 */
(value) => toString.call(value) === '[object Object]';
