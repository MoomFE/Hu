describe( 'Lit.define - computed', () => {

  it( '在 $lit 实例下会创建 $computed 对象, 存放所有的计算属性', () => {
    const customName = window.customName;

    Lit.define( customName, {
      computed: {
        a(){ return 123 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit )
      .has.property( '$computed' )
      .that.is.deep.equals({ a: 123 });
  });

});