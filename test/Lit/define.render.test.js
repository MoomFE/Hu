describe( 'Lit.define - render', () => {

  it( '自定义元素被添加到 DOM 树中后会立即运行渲染方法进行渲染', () => {
    const customName = window.customName;
    let isRender = false;

    Lit.define( customName, {
      render(){
        isRender = true;
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    // const custom = div.firstElementChild;
    // const lit = custom.$lit;

    expect( isRender ).to.be.false;

    div.$appendTo( document.body );

    expect( isRender ).to.be.true;
  });

});