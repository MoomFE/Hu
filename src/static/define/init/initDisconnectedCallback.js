import callLifecycle from "../util/callLifecycle";
import { unWatchBindDirectiveWatches } from "../../../html/render";


export default options => function(){
  const $hu = this.$hu;

  unWatchBindDirectiveWatches( $hu.$el )

  callLifecycle( $hu, 'disconnected', options );
}