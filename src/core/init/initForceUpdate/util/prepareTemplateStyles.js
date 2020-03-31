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

  const root = document.createElement('div');
  const content = document.createElement('div');

  root.content = content;
  content.appendChild(style);

  window.ShadyCSS.ScopingShim.prepareTemplateStyles(root, name);
};
