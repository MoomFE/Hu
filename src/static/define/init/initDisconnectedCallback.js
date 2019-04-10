import callLifecycle from "../util/callLifecycle";
import { unWatchAllDirectiveCache } from "../../../html/render";
import { observeProxyMap } from "../../observable/observe";


export default options => function(){
  const $hu = this.$hu;
  const infoTarget = observeProxyMap.get( $hu.$info ).target;

  infoTarget.isConnected = false;

  unWatchAllDirectiveCache( $hu.$el )

  callLifecycle( $hu, 'disconnected', options );
}