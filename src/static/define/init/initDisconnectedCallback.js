import callLifecycle from "../util/callLifecycle";


export default options => function(){
  callLifecycle( this.$hu, 'disconnected', options );
}