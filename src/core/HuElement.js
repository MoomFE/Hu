import { activeCustomElement } from '../static/define/const';
import { observeProxyMap } from '../static/observable/observe';
import { setValueByReadonly } from '../shared/const/observeReadonly';
import { optionsMap } from '../static/define/initOptions/index';
import callLifecycle from '../static/define/util/callLifecycle';
import destroyRender from '../render/util/destroyRender';
import removeRenderDeps from './init/initForceUpdate/util/removeRenderDeps';
import isEqual from '../shared/util/isEqual';

export default class HuElement extends HTMLElement {
  /**
   * 自定义元素被添加到文档流
   */
  connectedCallback() {
    const $hu = activeCustomElement.get(this);
    const $info = $hu.$info;
    const isMounted = $info.isMounted;
    const infoTarget = observeProxyMap.get($info).target;

    // 标记首次实例已添加到文档流
    setValueByReadonly(infoTarget, 'isConnected', true);

    // 如果是首次挂载, 需要运行 beforeMount 生命周期方法
    if (!isMounted) {
      // 运行 beforeMount 生命周期方法
      callLifecycle($hu, 'beforeMount');
    }

    // 执行 render 方法, 进行渲染
    $hu.$forceUpdate();

    // 如果是首次挂载, 需要运行 mounted 生命周期方法
    if (!isMounted) {
      // 标记首次实例挂载已完成
      setValueByReadonly(infoTarget, 'isMounted', true);

      // 运行 mounted 生命周期方法
      callLifecycle($hu, 'mounted');
    }

    // 运行 connected 生命周期方法
    callLifecycle($hu, 'connected');
  }

  /**
   * 自定义元素被从文档流移除
   */
  disconnectedCallback() {
    const $hu = activeCustomElement.get(this);
    const infoTarget = observeProxyMap.get($hu.$info).target;

    // 标记首次实例已从文档流移除
    setValueByReadonly(infoTarget, 'isConnected', false);

    // 移除自定义元素渲染的节点
    destroyRender($hu.$el);
    // 清空自定义元素渲染时收集的依赖
    removeRenderDeps($hu);

    // 运行 disconnected 生命周期方法
    callLifecycle($hu, 'disconnected');
  }

  /**
   * 自定义元素位置被移动
   */
  adoptedCallback(oldDocument, newDocument) {
    // 运行 adopted 生命周期方法
    callLifecycle(activeCustomElement.get(this), 'adopted', undefined, [
      newDocument, oldDocument
    ]);
  }

  /**
   * 自定义元素属性被更改
   */
  attributeChangedCallback(name, oldValue, value) {
    // 如果值相同, 则不进行触发属性更新
    if (value === oldValue) return;

    const targetProxy = activeCustomElement.get(this);
    const propsTargetProxy = targetProxy.$props;
    const propsTarget = observeProxyMap.get(propsTargetProxy);
    const propsMap = optionsMap[targetProxy.$info.name].propsMap;
    const props = propsMap[name];

    props.forEach(({ name, from }) => { // eslint-disable-line no-shadow
      const fromValue = from(value);

      isEqual(propsTarget[name], fromValue) || (
        propsTargetProxy[name] = fromValue
      );
    });
  }
}
