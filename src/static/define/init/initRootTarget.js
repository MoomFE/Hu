import create from "../../../shared/global/Object/create";
import isSymbol from "../../../shared/util/isSymbol";
import isReserved from "../../../shared/util/isReserved";
import { observe, observeProxyMap } from "../../observable/util/observe";
import canInjection from "../../../shared/util/canInjection";


export default function initRootTarget(){
  /** 当前组件对象 */
  const target = create( null );
  /** 当前组件观察者对象 */
  const targetProxy = observe( target );
  /** 当前组件观察者对象拦截器 */
  const targetProxyInterceptor = new Proxy( targetProxy, {
    set( target, name, value ){
      if( canInjection( name ) ){
        return ( target[ name ] = value ), true;
      }
      return false;
    },
    get( _, name ){
      if( isSymbol( name ) || !isReserved( name ) ){
        return targetProxy[ name ];
      }
      return target[ name ];
    }
  });

  // 将拦截器伪造成观察者对象
  observeProxyMap.set( targetProxyInterceptor, {} );

  return [
    target,
    targetProxy,
    targetProxyInterceptor
  ]
}