import callLifecycle from "../../static/define/util/callLifecycle";


export default function(){

  callLifecycle( this, 'beforeDestroy' );

  callLifecycle( this, 'destroyed' );

}