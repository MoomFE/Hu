describe( 'Hu.define - mixins', () => {

  it( '使用 mixins 选项对当前实例 props 选项进行混入', () => {
    const hu = new Hu({
      mixins: [
        { props: { b: String } },
        { props: { c: String } }
      ],
      props: {
        a: String
      }
    });

    expect( hu.$props ).is.deep.equals({
      a: undefined,
      b: undefined,
      c: undefined
    });
  });

  it( '使用 mixins 选项对当前实例 props 选项进行混入 ( Vue )', () => {
    const vm = new Vue({
      mixins: [
        { props: { b: String } },
        { props: { c: String } }
      ],
      props: {
        a: String
      }
    });

    expect( vm.$props ).is.deep.equals({
      a: undefined,
      b: undefined,
      c: undefined
    });
  });

  it( '使用 mixins 选项对当前实例 props 选项进行混入, 当前实例定义的 prop 优先级比较高', () => {
    const hu = new Hu({
      mixins: [
        { props: { a: { default: 'aaa' } } },
        { props: { b: { default: 'bbb' } } },
        { props: { c: { default: 'ccc' } } }
      ],
      props: {
        a: { default: 'a' }
      }
    });

    expect( hu.$props ).is.deep.equals({
      a: 'a',
      b: 'bbb',
      c: 'ccc'
    });
  });

  it( '使用 mixins 选项对当前实例 props 选项进行混入, 当前实例定义的 prop 优先级比较高 ( Vue )', () => {
    const vm = new Vue({
      mixins: [
        { props: { a: { default: 'aaa' } } },
        { props: { b: { default: 'bbb' } } },
        { props: { c: { default: 'ccc' } } }
      ],
      props: {
        a: { default: 'a' }
      }
    });

    expect( vm.$props ).is.deep.equals({
      a: 'a',
      b: 'bbb',
      c: 'ccc'
    });
  });

  it( '使用 mixins 选项对当前实例 props 选项进行混入, 多个 mixin 时, 越后定义的 mixin 优先级越高', () => {
    const hu = new Hu({
      mixins: [
        { props: { a: { default: 'a1' } } },
        { props: { a: { default: 'a2' } } },
        { props: { a: { default: 'a3' } } }
      ]
    });

    expect( hu.$props ).is.deep.equals({
      a: 'a3'
    });
  });

  it( '使用 mixins 选项对当前实例 props 选项进行混入, 多个 mixin 时, 越后定义的 mixin 优先级越高 ( Vue )', () => {
    const vm = new Vue({
      mixins: [
        { props: { a: { default: 'a1' } } },
        { props: { a: { default: 'a2' } } },
        { props: { a: { default: 'a3' } } }
      ]
    });

    expect( vm.$props ).is.deep.equals({
      a: 'a3'
    });
  });

});