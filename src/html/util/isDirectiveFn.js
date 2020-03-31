import { directiveFns } from '../../static/directiveFn/const';


export default (value) => {
  return directiveFns.has(value);
};
