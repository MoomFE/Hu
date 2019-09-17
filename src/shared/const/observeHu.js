import isString from "../util/isString";
import isReserved from "../util/isReserved";


const options = {
  before: ( target, name ) => isString( name ) && isReserved( name ) ? 0 : null
};

export default {
  set: options,
  get: options,
  deleteProperty: options
};