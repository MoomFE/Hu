import Lit from "../../shared/global/Lit/index";
import isObject from "../../shared/util/isObject";
import { observe } from "./util/observe";


Lit.observable = obj => {
  return isObject( obj ) ? observe( obj ) : obj;
}