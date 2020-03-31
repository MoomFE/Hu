import callLifecycle from '../util/callLifecycle';
import { observeProxyMap } from '../../observable/observe';
import { activeCustomElement } from '../const';
import { setValueByReadonly } from '../../../shared/const/observeReadonly';


export default (options) => function () {
  const $hu = activeCustomElement.get(this);
  const $info = $hu.$info;
  const isMounted = $info.isMounted;
  const infoTarget = observeProxyMap.get($info).target;

  setValueByReadonly(infoTarget, 'isConnected', true);

  // 是首次挂载
  if (!isMounted) {
    // 运行 beforeMount 生命周期方法
    callLifecycle($hu, 'beforeMount', options);
  }

  // 执行 render 方法, 进行渲染
  $hu.$forceUpdate();

  // 如果是首次挂载, 需要运行 mounted 生命周期方法
  if (!isMounted) {
    // 标记首次实例挂载已完成
    setValueByReadonly(infoTarget, 'isMounted', true);

    // 运行 mounted 生命周期方法
    callLifecycle($hu, 'mounted', options);
  }

  callLifecycle($hu, 'connected', options);
};
