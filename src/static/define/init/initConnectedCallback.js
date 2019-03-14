import { observeProxyMap } from "../../observable/util/observe";


export default options => function(){
  const { $hu, $hu: { $info } } = this;

  if( !$info.isMounted ){
    const infoTarget = observeProxyMap.get( $info ).target;

    // 运行 beforeMount 生命周期方法
    options.beforeMount.call( $hu );

    // 执行 render 方法, 进行渲染
    $hu.$forceUpdate();

    // 标记首次实例挂载已完成
    infoTarget.isMounted = true;

    // 运行 mounted 生命周期方法
    options.mounted.call( $hu );
  }
}