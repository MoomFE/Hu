describe( 'Hu.directiveFn', () => {

  let div = document.createElement('div');
  beforeEach(() => {
    div.$remove();
    div = document.createElement('div');
  });


  it( '注册的指令方法可以被正确调用 ( 在 render 方法中使用 )', () => {
    let result;
    const fn = Hu.directiveFn(( value ) => part => {
      result = value;
    });

    Hu.render(
      fn( 123 ),
      div
    );
    expect( result ).is.equals( 123 );
  });

  it( '注册的指令方法可以被正确调用 ( 在指令中使用 )', () => {
    let result;
    const fn = Hu.directiveFn(( value ) => part => {
      result = value;
    });

    Hu.render( div )`
      <div :text=${ fn( 123 ) }></div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( '注册的指令方法可以被正确调用 ( 在 NodePart 中使用 )', () => {
    let result;
    const fn = Hu.directiveFn(( value ) => part => {
      result = value;
    });

    Hu.render( div )`
      <div>${ fn( 123 ) }</div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( '注册的指令方法可以被正确调用 ( 在 NodePart 数组方式中使用 )', () => {
    let result;
    const fn = Hu.directiveFn(( value ) => part => {
      result = value;
    });

    Hu.render( div )`
      <div>${[ fn( 123 ) ]}</div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( '注册的指令方法可以被正确调用 ( 在 repeat 指令方法中使用 )', () => {
    let result;
    const fn = Hu.directiveFn(( value ) => part => {
      result = value;
    });

    Hu.render( div )`
      <div>${
        Hu.html.repeat( [ 123 ], val => val, val => {
          return fn( val );
        })
      }</div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 render 方法中使用 )', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render(
      fn( 123 ),
      div
    );
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( '123', div );
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在指令中使用 )', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div :text=${ fn( 123 ) }></div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div></div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 NodePart 中使用 )', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div>${ fn( 123 ) }</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div></div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 NodePart 数组方式中使用 )', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div>${[ fn( 123 ) ]}</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div></div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 repeat 指令方法中使用 )', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div>${
        Hu.html.repeat( [ 123 ], val => val, val => {
          return fn( val );
        })
      }</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div></div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '在同一插值绑定内首次传入的是指令方法, 第二次传入的并非指令方法, 首次传入的指令方法会被注销', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div>${ fn( 123 ) }</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div>${ 123 }</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '在同一插值绑定内首次使用的并非指令方法, 第二次传入的是指令方法, 指令方法可以正常使用', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div>${ 123 }</div>
    `;
    expect( commitPart ).is.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div>${ fn( 123 ) }</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div>${ 123 }</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '在同一插值绑定内两次传入的不是同一个指令方法时, 首次传入的指令方法会被注销', () => {
    let commitPart1, destroyPart1;
    let commitPart2, destroyPart2;
    const fn1 = Hu.directiveFn(( value ) => [
      part => commitPart1 = part,
      part => destroyPart1 = part
    ]);
    const fn2 = Hu.directiveFn(( value ) => [
      part => commitPart2 = part,
      part => destroyPart2 = part
    ]);

    Hu.render( div )`
      <div>${ fn1( 123 ) }</div>
    `;
    expect( commitPart1 ).is.not.undefined;
    expect( destroyPart1 ).is.undefined;
    expect( commitPart2 ).is.undefined;
    expect( destroyPart2 ).is.undefined;

    Hu.render( div )`
      <div>${ fn2( 123 ) }</div>
    `;
    expect( commitPart1 ).is.not.undefined;
    expect( destroyPart1 ).is.not.undefined;
    expect( commitPart2 ).is.not.undefined;
    expect( destroyPart2 ).is.undefined;
    expect( commitPart1 ).is.equals( destroyPart1 );

    Hu.render( div )`
      <div>${ '' }</div>
    `;
    expect( commitPart1 ).is.not.undefined;
    expect( destroyPart1 ).is.not.undefined;
    expect( commitPart2 ).is.not.undefined;
    expect( destroyPart2 ).is.not.undefined;
    expect( commitPart1 ).is.equals( destroyPart1 );
    expect( commitPart2 ).is.equals( destroyPart2 );
  });

});