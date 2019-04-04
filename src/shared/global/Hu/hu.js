import { observe } from "../../../static/observable/observe";
import observeHu from "../../const/observeHu";
import initForceUpdate from "./init/initForceUpdate";
import { assign } from "../Object/index";
import $watch from "./prototype/$watch";
import $nextTick from "./prototype/$nextTick";
import $mount from "./prototype/$mount";
import $on, { initEvents, $once, $off, $emit } from "./prototype/$on";
import $destroy from "./prototype/$destroy";


export default class HuConstructor{
  constructor( name ){
    /** 当前实例观察者对象 */
    const targetProxy = observe( this, observeHu );

    // 初始化 $forceUpdate 方法
    initForceUpdate( name, this, targetProxy );
    // 初始化事件相关
    initEvents( targetProxy );
  }
}

assign( HuConstructor.prototype, {
  $watch,
  $mount,
  $nextTick,
  $on,
  $once,
  $off,
  $emit,
  $destroy
});