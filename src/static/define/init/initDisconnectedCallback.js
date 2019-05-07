import callLifecycle from "../util/callLifecycle";
import { unWatchAllDirectiveCache } from "../../../render/util/unWatchAllDirectiveCache";
import { observeProxyMap } from "../../observable/observe";
import removeRenderDeps from "../../../core/init/initForceUpdate/util/removeRenderDeps";


export default options => function(){
  const $hu = this.$hu;
  const infoTarget = observeProxyMap.get( $hu.$info ).target;

  infoTarget.isConnected = false;

  unWatchAllDirectiveCache( $hu.$el );
  removeRenderDeps( $hu );

  callLifecycle( $hu, 'disconnected', options );
}