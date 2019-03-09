import create from "../../../shared/global/Object/create";
import isSymbol from "../../../shared/util/isSymbol";
import isReserved from "../../../shared/util/isReserved";
import { observe, observeProxyMap } from "../../observable/util/observe";
import canInjection from "../../../shared/util/canInjection";
import isString from "../../../shared/util/isString";


export default function initRootTarget(){
  /** 当前组件对象 */
  const target = create( null );
  /** 当前组件观察者对象 */
  const targetProxy = observe( target, {
    set: {
      before: ( target, name ) => {
        return canInjection( name ) ? null : 0;
      }
    },
    get: {
      before: ( target, name ) => {
        return isString( name ) && isReserved( name ) ? 0 : null;
      }
    }
  });

  return [
    target,
    targetProxy
  ]
}