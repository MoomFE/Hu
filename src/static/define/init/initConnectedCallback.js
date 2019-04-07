


export default options => function(){
  callLifecycle( this.$hu, 'connected', options );
  this.$hu.$mount();
}