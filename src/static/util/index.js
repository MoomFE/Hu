import { create, assign } from "../../shared/global/Object/index";
import addEventListener from "../../shared/util/addEventListener";
import removeEventListener from "../../shared/util/removeEventListener";
import each from "../../shared/util/each";
import isEmptyObject from "../../shared/util/isEmptyObject";
import isEqual from "../../shared/util/isEqual";
import isPlainObject from "../../shared/util/isPlainObject";
import isPrimitive from "../../shared/util/isPrimitive";
import isString from "../../shared/util/isString";
import isObject from "../../shared/util/isObject";
import isFunction from "../../shared/util/isFunction";
import isSymbol from "../../shared/util/isSymbol";
import uid from "../../shared/util/uid";
import cached from "../../shared/util/cached";


const util = create( null );

assign( util, {
  addEvent: addEventListener,
  removeEvent: removeEventListener,
  each,
  isPlainObject,
  isEmptyObject,
  isPrimitive,
  isEqual,
  isString,
  isObject,
  isFunction,
  isSymbol,
  uid,
  cached
});

export default util;