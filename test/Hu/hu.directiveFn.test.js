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

});