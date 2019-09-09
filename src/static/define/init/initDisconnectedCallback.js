import callLifecycle from "../util/callLifecycle";
import { observeProxyMap } from "../../observable/observe";
import removeRenderDeps from "../../../core/init/initForceUpdate/util/removeRenderDeps";
import { activeCustomElement } from "../const";
import destroyRender from "../../../render/util/destroyRender";


export default options => function(){
  const $hu = activeCustomElement.get( this );
  const infoTarget = observeProxyMap.get( $hu.$info ).target;

  infoTarget.isConnected = false;

  destroyRender( $hu.$el );
  removeRenderDeps( $hu );

  callLifecycle( $hu, 'disconnected', options );
}