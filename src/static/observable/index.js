import Hu from "../../shared/global/Hu/index";
import isObject from "../../shared/util/isObject";
import { observe } from "./util/observe";


Hu.observable = obj => {
  return isObject( obj ) ? observe( obj ) : obj;
}