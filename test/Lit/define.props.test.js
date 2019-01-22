
describe( 'Lit.define - props', () => {

  it( '创建自定义元素时 props 将会立即进行初始化 ( 未传参时, 值为 undefined )', () => {

    Lit.define( 'custom-element', {
      props: [ 'a', 'b', 'c' ]
    });

    const elem = document.createElement('custom-element');
    const lit = elem.$lit;

    should.has( lit.$props, 'a' );
    should.has( lit.$props, 'b' );
    should.has( lit.$props, 'c' );

    should.equal( lit.$props.a, undefined );
    should.equal( lit.$props.b, undefined );
    should.equal( lit.$props.c, undefined );

  });

});