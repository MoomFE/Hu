

export default options => function(){
  const { $hu } = this;

  options.beforeMount.call( $hu );
  $hu.$forceUpdate();
  options.mounted.call( $hu );
}