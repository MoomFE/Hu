describe( 'Hu.directive', () => {

  let div = document.createElement('div');
  beforeEach(() => {
    div.$remove();
    div = document.createElement('div');
  });


  it( '注册的指令使用 constructor 接收使用指令处的相关信息', () => {
    const args = [];

    Hu.directive( 'asd', class {
      commit(){}
      constructor( element, name, strings, modifiers ){
        args.splice( 0, Infinity, ...arguments );
      }
    });

    Hu.render( div )`
      <div :asd=${ 1 }></div>
    `;

    expect( args ).is.deep.equals([
      div.firstElementChild,
      'asd',
      [ '', '' ],
      {}
    ]);
  });

  it( '注册的指令使用 commit 接收用户传递的值', () => {
    const result = [];

    Hu.directive( 'asd', class {
      commit( value ){
        result.push( value );
      }
    });

    Hu.render( div )`
      <div :asd=${ 1 }></div>
      <div :asd=${ '2' }></div>
      <div :asd=${ true }></div>
      <div :asd=${ false }></div>
      <div :asd=${ [] }></div>
      <div :asd=${ {} }></div>
    `;

    expect( result ).is.deep.equals([
      1, '2',
      true, false,
      [], {}
    ]);
  });

  it( '注册的指令只在元素上使用时会生效', () => {
    const result = [];

    Hu.directive( 'asd', class {
      commit( value ){
        result.push( value );
      }
    });

    Hu.render( div )`
      <div :asd=${ 1 }>:asd=${ 2 }</div>
      <div :asd=${ 3 }>:asd=${ 4 }</div>
    `;

    expect( result ).is.deep.equals([ 1, 3 ]);
  });

});