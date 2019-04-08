import callLifecycle from "../util/callLifecycle";
import { unWatchDirectiveCache } from "../../../html/render";
import { observeProxyMap } from "../../observable/observe";


export default options => function(){
  const $hu = this.$hu;
  const infoTarget = observeProxyMap.get( $hu.$info ).target;

  infoTarget.isConnected = false;

  unWatchDirectiveCache( $hu.$el )

  callLifecycle( $hu, 'disconnected', options );
}