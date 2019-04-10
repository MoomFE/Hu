import callLifecycle from "../util/callLifecycle";


export default options => function( oldDocument, newDocument ){
  callLifecycle( this.$hu, 'adopted', options, [
    newDocument, oldDocument
  ]);
}