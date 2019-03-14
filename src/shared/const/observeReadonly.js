/**
 * 使观察者对象只读 ( 不可删, 不可写 )
 */
export default {
  set: {
    before: () => 0
  },
  deleteProperty: {
    before: () => 0
  }
};