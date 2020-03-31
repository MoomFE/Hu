export default
/**
 * 序列化为 Boolean 属性
 */
(value) => {
  return value === 'false' ? false
    : value !== null;
};
