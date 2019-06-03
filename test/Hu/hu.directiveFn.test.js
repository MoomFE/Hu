describe( 'Hu.directiveFn', () => {

  let div = document.createElement('div');
  beforeEach(() => {
    div.$remove();
    div = document.createElement('div');
  });


  it( '注册的指令方法可以被正确识别为指令方法并正确调用', () => {
    const fn = Hu.directiveFn(( value ) => part => {
      expect( value ).is.equals( 123 );
      expect( part ).is.instanceOf(
        Hu.directive( 'text' )
      );
    });

    Hu.render( div )`
      <div :text=${ fn( 123 ) }></div>
    `;
  });

  it( '注册指令方法时, 返回的第二层函数可以为一个数组, 第二个是定义 destroy 方法', () => {
    const parts = [];
    const fn = Hu.directiveFn(( value ) => [
      part => {
        parts.push( part );
      },
      part => {
        parts.push( part );
      }
    ]);

    Hu.render( div )`
      <div :text=${ fn( 123 ) }></div>
    `;
    expect( parts.length ).is.equals( 1 );

    Hu.render( div )`
      <div></div>
    `;
    expect( parts.length ).is.equals( 2 );
    expect( parts[ 0 ] ).is.equals( parts[ 1 ] );
  });

  it( '注册的指令方法在对应的指令被弃用时会触发 destroy 方法', () => {
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





  // 以下情况需要确认
  // 1. 先传入指令方法, 再传入其它值
  // 2. 先传入其它值, 再传入指令方法
  // 3. 两次传入的不是同一个指令方法

});