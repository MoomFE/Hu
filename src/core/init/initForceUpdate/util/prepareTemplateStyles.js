/**
 * 已经初始化过样式表的组件名称
 */
const styleRendered = new Set();

export default (style, name) => {
  // 已经初始化过样式表的组件不再第二次初始化
  if (styleRendered.has(name)) {
    return;
  }

  styleRendered.add(name);

  // eslint-disable-next-line no-undef
  const root = document.createElement('div');
  // eslint-disable-next-line no-undef
  const content = document.createElement('div');

  root.content = content;
  content.appendChild(style);

  // eslint-disable-next-line no-undef
  window.ShadyCSS.ScopingShim.prepareTemplateStyles(root, name);
};
