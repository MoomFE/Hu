

export default ( el, name ) => {
  const frame = document.createElement('div');
        frame.content = el;

  window.ShadyCSS.ScopingShim.prepareTemplateStyles( frame, name );
}