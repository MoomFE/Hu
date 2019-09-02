describe( 'Hu.html.directiveFn', () => {

  it( 'html.bind: 该指令方法可使用 :class 指令对元素 className 进行绑定', ( done ) => {
    const bind = Hu.html.bind;
    const div = document.createElement('div');
    const data = Hu.observable({
      class: {
        a: false,
        b: true
      }
    });

    Hu.render( div )`
      <div :class=${ bind( data, 'class' ) }></div>
    `;

    expect( div.firstElementChild.className ).is.equals( 'b' );

    data.class = {
      a: true,
      b: false
    };

    expect( div.firstElementChild.className ).is.equals( 'b' );
    Hu.nextTick(() => {
      expect( div.firstElementChild.className ).is.equals( 'a' );

      data.class.b = true;

      expect( div.firstElementChild.className ).is.equals( 'a' );
      Hu.nextTick(() => {
        expect( div.firstElementChild.className ).is.equals( 'a b' );

        done();
      });
    });
  });

  it( 'html.bind: 该指令方法可使用 :style 指令对元素 style 进行绑定', ( done ) => {
    const bind = Hu.html.bind;
    const div = document.createElement('div');
    const data = Hu.observable({
      style: {
        fontSize: '12px',
        width: '100px'
      }
    });

    Hu.render( div )`
      <div :style=${ bind( data, 'style' ) }></div>
    `;

    expect( div.firstElementChild.style ).is.deep.include({
      fontSize: '12px',
      width: '100px'
    });

    data.style = {
      fontSize: '16px',
      width: '120px'
    };

    expect( div.firstElementChild.style ).is.deep.include({
      fontSize: '12px',
      width: '100px'
    });
    Hu.nextTick(() => {
      expect( div.firstElementChild.style ).is.deep.include({
        fontSize: '16px',
        width: '120px'
      });

      data.style.width = '160px';

      expect( div.firstElementChild.style ).is.deep.include({
        fontSize: '16px',
        width: '120px'
      });
      Hu.nextTick(() => {
        expect( div.firstElementChild.style ).is.deep.include({
          fontSize: '16px',
          width: '160px'
        });

        done();
      });
    });
  });

});