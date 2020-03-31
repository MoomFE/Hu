import { expect } from 'chai';
import Hu from '../../../src/build/index';


// ------

window.Hu = Hu;

// ------

Reflect.defineProperty(window, 'customName', {
  get: () => `custom-element-${ZenJS.guid}`
});

// ------

window.triggerEvent = function (target, type, process) {
  /**
   * 创建事件对象
   */
  const event = document.createEvent('HTMLEvents');

  // 如果想设置 initEvent 方法的 bubbles, cancelable 参数
  // 可以将 type 替换为数组
  // 数组内依次是 type, bubbles, cancelable
  if (!Array.isArray(type)) {
    type = [type, true, true];
  }

  // 初始化事件对象
  event.initEvent(...type);

  // 可传入方法对事件对象做其它处理
  if (process) process(event, target);

  // 触发事件
  target.dispatchEvent(event);
};

// ------

window.stripExpressionMarkers = (html) => {
  return html.replace(/<!---->/g, '');
};

// ------

{
  const templateResult = Hu.html`<!--${null}-->`;
  const template = templateResult.getTemplateElement();

  window.templateMarker = template.content.firstChild.data.trim();
}

// ------

{
  const error = console.error;

  window.watchError = function (fn, msg) {
    const msgs = [];

    // eslint-disable-next-line no-shadow
    console.error = (msg) => {
      msgs.push(msg);
    };

    fn();

    console.error = error;

    if (Array.isArray(msg)) {
      return expect(msgs).is.deep.equals(msg);
    }
    return expect(msgs[0]).is.equals(msg);
  };
}

// ------

{
  let supportsForInTriggerProxyOwnKeys = false;

  const proxyObj = new Proxy({}, {
    ownKeys() {
      supportsForInTriggerProxyOwnKeys = true;
      return [];
    }
  });

  // eslint-disable-next-line no-unused-vars
  for (const item in proxyObj);

  window.supportsForInTriggerProxyOwnKeys = supportsForInTriggerProxyOwnKeys;
}

// ------
