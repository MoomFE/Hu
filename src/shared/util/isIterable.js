import { isArray } from "../global/Array/index";


export default value => {
  return isArray( value ) || !!(
    value && value[ Symbol.iterator ]
  );
}