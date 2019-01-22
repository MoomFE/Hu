
describe( 'Lit.define - props', () => {

  it( '创建自定义元素时 props 将会立即进行初始化 ( 未传参时, 值为 undefined )', () => {
    const customName = window.customName;

    Lit.define( customName, {
      props: [ 'a', 'b', 'c' ]
    });

    const custom = document.createElement( customName );
    const lit = custom.$lit;

    should.has( lit.$props, 'a' );
    should.has( lit.$props, 'b' );
    should.has( lit.$props, 'c' );

    should.equal( lit.$props.a, undefined );
    should.equal( lit.$props.b, undefined );
    should.equal( lit.$props.c, undefined );

  });

  it( '创建自定义元素时 props 将会立即进行初始化 ( 已传参时, 值为传入的参数 )', () => {
    const customName = window.customName;

    Lit.define( customName, {
      props: [ 'a', 'b', 'c' ]
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" b="3" c="5"></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit

    should.has( lit.$props, 'a' );
    should.has( lit.$props, 'b' );
    should.has( lit.$props, 'c' );

    should.equal( lit.$props.a, '1' );
    should.equal( lit.$props.b, '3' );
    should.equal( lit.$props.c, '5' );

  });

});