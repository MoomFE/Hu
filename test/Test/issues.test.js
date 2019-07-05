describe( 'Issues', () => {

  it( '#1', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data: () => ({
        someDiv: [
          Hu.html`<div>1</div>`,
          Hu.html`<div>2</div>`
        ]
      }),
      render( html ){
        return html`<div>${ this.someDiv }</div>`
      }
    });

    document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body ).$remove();
  });

});