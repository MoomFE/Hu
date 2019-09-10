import directiveFn from '../../static/directiveFn/index';
import { observeProxyMap } from '../../static/observable/observe';
import $watch from '../../core/prototype/$watch';


/**
 * 绑定信息合集
 */
const bindMap = new WeakMap();


export default () => {};
directiveFn(( proxy, name ) => {

  /**
   * 传入对象是否是观察者对象
   */
  const isObserve = observeProxyMap.has( proxy );

  return [
    /**
     * commit
     */
    part => {
      // 若传入对象不是观察者对象
      // 那么只设置一次值
      if( !isObserve ){
        return part.commit( proxy[ name ] );
      }
  
      // 绑定
      const unWatch = $watch(
        () => proxy[ name ],
        value => part.commit( value ),
        {
          immediate: true,
          deep: true
        }
      );

      // 存储当前绑定信息
      bindMap.set( part, [
        proxy, name, unWatch
      ]);
    },
    /**
     * destroy
     */
    part => {
      /**
       * 尝试在绑定信息合集中查找上次的绑定信息
       * 如果可以获取到信息
       * 说明上次已经初始过一个绑定了
       */
      const bindOptions = bindMap.get( part );

      if( bindOptions ){
        // 取消绑定
        bindOptions[2]();
        // 删除相关信息
        bindMap.delete( part );
      }
    }
  ];
});