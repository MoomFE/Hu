import { observeProtoHooks } from "./index";


export default ( constructor, target, targetProxy, name, value ) => {
  const { internalSlots } = observeProtoHooks.get( constructor );

  if( internalSlots ){
    return value.bind( target );
  }
}