describe( 'Hu.define - styles', () => {

  it( '使用 styles 选项传入自定义元素的样式', () => {
    const customName = window.customName;

    Hu.define( customName, {
      styles: `
        :host > div{
          position: fixed;
        }
      `,
      render( html ){
        return html`<div ref="div"></div>`;
      }
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    expect( getComputedStyle( hu.$refs.div ).position ).is.equals( 'fixed' );

    custom.$remove();
  });

  it( '使用 styles 选项传入自定义元素的样式, 使用数组传参', () => {
    const customName = window.customName;

    Hu.define( customName, {
      styles: [
        `:host > div{ position: fixed }`,
        `:host > div{ top: 0 }`,
        `:host > div{ left: 0 }`
      ],
      render( html ){
        return html`<div ref="div"></div>`;
      }
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    expect( getComputedStyle( hu.$refs.div ).position ).is.equals( 'fixed' );
    expect( getComputedStyle( hu.$refs.div ).top ).is.equals( '0px' );
    expect( getComputedStyle( hu.$refs.div ).left ).is.equals( '0px' );

    custom.$remove();
  });

});