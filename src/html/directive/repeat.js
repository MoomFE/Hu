import { repeat } from 'lit-html/directives/repeat';
import isString from '../../shared/util/isString';


export default ( items, userKey, template ) => {
  const key = isString( userKey ) ? item => item[ userKey ]
                                  : userKey;
  return repeat( items, key, template );
}