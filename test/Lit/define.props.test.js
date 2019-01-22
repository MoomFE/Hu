
describe( 'Lit.define - props', () => {

  it( '创建自定义元素时就对 props 进行初始化', () => {

    Lit.define( 'custom-element', {
      props: [ 'a', 'b', 'c' ]
    });

    const elem = document.createElement('custom-element');

  });

});