
/**
 * 存放创建过的观察者
 */
export const observeMap = new WeakMap();


export default
/**
 * 为传入对象创建观察者
 */
function observe( target ){
  // 如果创建过观察者
  // 则返回之前创建的观察者
  if( observeMap.has( target ) ) return observeMap.get( target ).proxy;

  const proxy = createObserver( target );
  const valueParameter = {
    proxy
  };

  observeMap.set( target, valueParameter );

  return proxy;
}

function createObserver( target ){
  const targetProxy = new Proxy( target, {

  });

  return targetProxy;
}