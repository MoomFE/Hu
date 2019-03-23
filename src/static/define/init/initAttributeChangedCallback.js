import isEqual from "../../../shared/util/isEqual";
import { observeProxyMap } from "../../observable/observe";


export default propsMap => function( name, oldValue, value ){
  if( value === oldValue ) return;

  const { $props: propsTargetProxy } = this.$hu;
  const { target: propsTarget } = observeProxyMap.get( propsTargetProxy );
  const props = propsMap[ name ];

  for( const { name, from } of props ){
    const fromValue = from( value );

    isEqual( propsTarget[ name ], fromValue ) || (
      propsTargetProxy[ name ] = fromValue
    );
  }
}