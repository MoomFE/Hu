import create from "../../../shared/global/Object/create";
import isReserved from "../../../shared/util/isReserved";
import { observe } from "../../observable/util/observe";
import isSymbolOrNotReserved from "../../../shared/util/isSymbolOrNotReserved";
import isString from "../../../shared/util/isString";


export default function initRootTarget(){
  /** 当前组件对象 */
  const target = create( null );
  /** 当前组件观察者对象 */
  const targetProxy = observe( target, {
    set: {
      before: ( target, name ) => {
        return isSymbolOrNotReserved( name ) ? null : 0;
      }
    },
    get: {
      before: ( target, name ) => {
        return isString( name ) && isReserved( name ) ? 0 : null;
      }
    },
    deleteProperty: {
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