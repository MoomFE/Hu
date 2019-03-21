import isSymbolOrNotReserved from "../util/isSymbolOrNotReserved";
import isString from "../util/isString";
import isReserved from "../util/isReserved";


export default {
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
};