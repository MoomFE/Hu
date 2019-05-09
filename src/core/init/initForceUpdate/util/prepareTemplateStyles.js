

export default ( style, name ) => {
  const root = document.createElement('div');
  const content = document.createElement('div');

  root.content = content;
  content.appendChild( style );

  window.ShadyCSS.ScopingShim.prepareTemplateStyles( root, name );
}