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

  it( '使用 mixins 选项对当前实例 props 选项进行混入, 多个 mixin 时, 越后定义的 prop 优先级越高', () => {
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

  it( '使用 mixins 选项对当前实例 props 选项进行混入, 多个 mixin 时, 越后定义的 prop 优先级越高 ( Vue )', () => {
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

  it( '使用 mixins 选项对当前实例生命周期回调进行混入', () => {
    const result = [];
    const hu = new Hu({
      mixins: [
        {
          created(){ result.push( 1 ) }
        }
      ],
      created(){ result.push( 2 ) }
    });

    expect( result ).is.deep.equals([ 1, 2 ])
  });

  it( '使用 mixins 选项对当前实例生命周期回调进行混入 ( Vue )', () => {
    const result = [];
    const vm = new Vue({
      mixins: [
        {
          created(){ result.push( 1 ) }
        }
      ],
      created(){ result.push( 2 ) }
    });

    expect( result ).is.deep.equals([ 1, 2 ])
  });

  it( '使用 mixins 选项对当前实例生命周期回调进行混入, 当前实例定义的生命周期回调最晚执行', () => {
    const result = [];
    const hu = new Hu({
      mixins: [
        { created(){ result.push( 1 ) } },
        { created(){ result.push( 2 ) } },
        { created(){ result.push( 3 ) } }
      ],
      created(){ result.push( 4 ) }
    });

    expect( result ).is.deep.equals([ 1, 2, 3, 4 ])
  });

  it( '使用 mixins 选项对当前实例生命周期回调进行混入, 当前实例定义的生命周期回调最晚执行 ( Vue )', () => {
    const result = [];
    const vm = new Vue({
      mixins: [
        { created(){ result.push( 1 ) } },
        { created(){ result.push( 2 ) } },
        { created(){ result.push( 3 ) } }
      ],
      created(){ result.push( 4 ) }
    });

    expect( result ).is.deep.equals([ 1, 2, 3, 4 ])
  });

  it( '使用 mixins 选项对当前实例生命周期回调进行混入, 多个 mixin 时, 越后定义的 mixin 内的生命周期回调越晚执行', () => {
    const result = [];
    const hu = new Hu({
      mixins: [
        { created(){ result.push( 1 ) } },
        { created(){ result.push( 2 ) } },
        { created(){ result.push( 3 ) } }
      ]
    });

    expect( result ).is.deep.equals([ 1, 2, 3 ])
  });

  it( '使用 mixins 选项对当前实例生命周期回调进行混入, 多个 mixin 时, 越后定义的 mixin 内的生命周期回调越晚执行 ( Vue )', () => {
    const result = [];
    const vm = new Vue({
      mixins: [
        { created(){ result.push( 1 ) } },
        { created(){ result.push( 2 ) } },
        { created(){ result.push( 3 ) } }
      ]
    });

    expect( result ).is.deep.equals([ 1, 2, 3 ])
  });

  it( '使用 mixins 选项对当前实例 methods 选项进行混入', () => {
    const hu = new Hu({
      mixins: [
        { methods: { a: () => 'a' } }
      ],
      methods: {
        b: () => 'b'
      }
    });

    expect( hu ).is.include.keys([ 'a', 'b' ]);
    expect( hu.a() ).is.equals( 'a' );
    expect( hu.b() ).is.equals( 'b' );

    expect( hu.$methods ).have.keys([ 'a', 'b' ]);
    expect( hu.$methods.a() ).is.equals( 'a' );
    expect( hu.$methods.b() ).is.equals( 'b' );
  });

  it( '使用 mixins 选项对当前实例 methods 选项进行混入 ( Vue )', () => {
    const vm = new Vue({
      mixins: [
        { methods: { a: () => 'a' } }
      ],
      methods: {
        b: () => 'b'
      }
    });

    expect( vm ).is.include.keys([ 'a', 'b' ]);
    expect( vm.a() ).is.equals( 'a' );
    expect( vm.b() ).is.equals( 'b' );
  });

  it( '使用 mixins 选项对当前实例 methods 选项进行混入, 当前实例定义的 method 优先级比较高', () => {
    const hu = new Hu({
      mixins: [
        { methods: { a: () => 'aaa' } },
        { methods: { b: () => 'bbb' } },
        { methods: { c: () => 'ccc' } }
      ],
      methods: {
        a: () => 'a',
        b: () => 'b'
      }
    });

    expect( hu ).is.include.keys([ 'a', 'b', 'c' ]);
    expect( hu.a() ).is.equals( 'a' );
    expect( hu.b() ).is.equals( 'b' );
    expect( hu.c() ).is.equals( 'ccc' );

    expect( hu.$methods ).have.keys([ 'a', 'b', 'c' ]);
    expect( hu.$methods.a() ).is.equals( 'a' );
    expect( hu.$methods.b() ).is.equals( 'b' );
    expect( hu.$methods.c() ).is.equals( 'ccc' );
  });

  it( '使用 mixins 选项对当前实例 methods 选项进行混入, 当前实例定义的 method 优先级比较高 ( Vue )', () => {
    const vm = new Vue({
      mixins: [
        { methods: { a: () => 'aaa' } },
        { methods: { b: () => 'bbb' } },
        { methods: { c: () => 'ccc' } }
      ],
      methods: {
        a: () => 'a',
        b: () => 'b'
      }
    });

    expect( vm ).is.include.keys([ 'a', 'b', 'c' ]);
    expect( vm.a() ).is.equals( 'a' );
    expect( vm.b() ).is.equals( 'b' );
    expect( vm.c() ).is.equals( 'ccc' );
  });

  it( '使用 mixins 选项对当前实例 methods 选项进行混入, 多个 mixin 时, 越后定义的 method 优先级越高', () => {
    const hu = new Hu({
      mixins: [
        { methods: { a: () => 'aaa' } },
        { methods: { a: () => 'bbb' } },
        { methods: { a: () => 'ccc' } }
      ]
    });

    expect( hu ).is.include.keys([ 'a' ]);
    expect( hu.a() ).is.equals( 'ccc' );

    expect( hu.$methods ).have.keys([ 'a' ]);
    expect( hu.$methods.a() ).is.equals( 'ccc' );
  });

  it( '使用 mixins 选项对当前实例 methods 选项进行混入, 多个 mixin 时, 越后定义的 method 优先级越高 ( Vue )', () => {
    const vm = new Vue({
      mixins: [
        { methods: { a: () => 'aaa' } },
        { methods: { a: () => 'bbb' } },
        { methods: { a: () => 'ccc' } }
      ]
    });

    expect( vm ).is.include.keys([ 'a' ]);
    expect( vm.a() ).is.equals( 'ccc' );
  });

  it( '使用 mixins 选项对当前实例 data 选项进行混入', () => {
    const hu = new Hu({
      mixins: [
        { data: { a: 'a' } },
        { data: () => ({ b: 'b' }) }
      ],
      data: {
        c: 'c'
      }
    });

    expect( hu.$data ).is.deep.equals({
      a: 'a',
      b: 'b',
      c: 'c'
    });
  });

  it( '使用 mixins 选项对当前实例 data 选项进行混入 ( Vue )', () => {
    const vm = new Vue({
      mixins: [
        { data: { a: 'a' } },
        { data: () => ({ b: 'b' }) }
      ],
      data: {
        c: 'c'
      }
    });

    expect( vm.$data ).is.deep.equals({
      a: 'a',
      b: 'b',
      c: 'c'
    });
  });

  it( '使用 mixins 选项对当前实例 data 选项进行混入, 当前实例定义的 data 优先级比较高', () => {
    const hu = new Hu({
      mixins: [
        { data: { a: 'aaa' } },
        { data: () => ({ b: 'bbb' }) }
      ],
      data: {
        a: 'a',
        c: 'c'
      }
    });

    expect( hu.$data ).is.deep.equals({
      a: 'a',
      b: 'bbb',
      c: 'c'
    });
  });

  it( '使用 mixins 选项对当前实例 data 选项进行混入, 当前实例定义的 data 优先级比较高 ( Vue )', () => {
    const vm = new Vue({
      mixins: [
        { data: { a: 'aaa' } },
        { data: () => ({ b: 'bbb' }) }
      ],
      data: {
        a: 'a',
        c: 'c'
      }
    });

    expect( vm.$data ).is.deep.equals({
      a: 'a',
      b: 'bbb',
      c: 'c'
    });
  });

  it( '使用 mixins 选项对当前实例 data 选项进行混入, 多个 mixin 时, 越后定义的 data 优先级越高', () => {
    const hu = new Hu({
      mixins: [
        { data: { a: 'aaa', b: 'b' } },
        { data: () => ({ b: 'bbb', c: 'ccc' }) },
        { data: { a: 'a' } }
      ]
    });

    expect( hu.$data ).is.deep.equals({
      a: 'a',
      b: 'bbb',
      c: 'ccc'
    });
  });

  it( '使用 mixins 选项对当前实例 data 选项进行混入, 多个 mixin 时, 越后定义的 data 优先级越高 ( Vue )', () => {
    const vm = new Vue({
      mixins: [
        { data: { a: 'aaa', b: 'b' } },
        { data: () => ({ b: 'bbb', c: 'ccc' }) },
        { data: { a: 'a' } }
      ]
    });

    expect( vm.$data ).is.deep.equals({
      a: 'a',
      b: 'bbb',
      c: 'ccc'
    });
  });

  it( '使用 mixins 选项对当前实例 computed 选项进行混入', () => {
    const hu = new Hu({
      mixins: [
        { computed: { a: () => 'a' } },
        { computed: { b: { get: () => 'b' } } }
      ],
      computed: {
        c: () => 'c'
      }
    });

    expect( hu.$computed ).is.deep.equals({
      a: 'a',
      b: 'b',
      c: 'c'
    });

    expect( hu ).is.deep.include({
      a: 'a',
      b: 'b',
      c: 'c'
    });
  });

  it( '使用 mixins 选项对当前实例 computed 选项进行混入 ( Vue )', () => {
    const vm = new Vue({
      mixins: [
        { computed: { a: () => 'a' } },
        { computed: { b: { get: () => 'b' } } }
      ],
      computed: {
        c: () => 'c'
      }
    });

    expect( vm ).is.deep.include({
      a: 'a',
      b: 'b',
      c: 'c'
    });
  });

  it( '使用 mixins 选项对当前实例 computed 选项进行混入, 当前实例定义的 computed 优先级比较高', () => {
    const hu = new Hu({
      mixins: [
        { computed: { a: () => 'aaa' } },
        { computed: { b: { get: () => 'bbb' } } }
      ],
      computed: {
        a: () => 'a',
        c: () => 'c'
      }
    });

    expect( hu.$computed ).is.deep.equals({
      a: 'a',
      b: 'bbb',
      c: 'c'
    });

    expect( hu ).is.deep.include({
      a: 'a',
      b: 'bbb',
      c: 'c'
    });
  });

  it( '使用 mixins 选项对当前实例 computed 选项进行混入, 当前实例定义的 computed 优先级比较高 ( Vue )', () => {
    const vm = new Vue({
      mixins: [
        { computed: { a: () => 'aaa' } },
        { computed: { b: { get: () => 'bbb' } } }
      ],
      computed: {
        a: () => 'a',
        c: () => 'c'
      }
    });

    expect( vm ).is.deep.include({
      a: 'a',
      b: 'bbb',
      c: 'c'
    });
  });

  it( '使用 mixins 选项对当前实例 computed 选项进行混入, 多个 mixin 时, 越后定义的 computed 优先级越高', () => {
    const hu = new Hu({
      mixins: [
        { computed: { a: () => 'a', c: () => 'c' } },
        { computed: { b: { get: () => 'bbb' }, c: () => 'ccc' } },
        { computed: { a: () => 'aaa' } }
      ]
    });

    expect( hu.$computed ).is.deep.equals({
      a: 'aaa',
      b: 'bbb',
      c: 'ccc'
    });

    expect( hu ).is.deep.include({
      a: 'aaa',
      b: 'bbb',
      c: 'ccc'
    });
  });

  it( '使用 mixins 选项对当前实例 computed 选项进行混入, 多个 mixin 时, 越后定义的 computed 优先级越高 ( Vue )', () => {
    const vm = new Vue({
      mixins: [
        { computed: { a: () => 'a', c: () => 'c' } },
        { computed: { b: { get: () => 'bbb' }, c: () => 'ccc' } },
        { computed: { a: () => 'aaa' } }
      ]
    });

    expect( vm ).is.deep.include({
      a: 'aaa',
      b: 'bbb',
      c: 'ccc'
    });
  });

  it( '使用 mixins 选项对当前实例 watch 选项进行混入', ( done ) => {
    const step = [];
    const hu = new Hu({
      mixins: [
        { watch: { a: () => step.push( 1 ) } },
        { watch: { a: () => step.push( 2 ) } }
      ],
      data: { a: 1 },
      watch: {
        a: () => step.push( 3 )
      }
    });

    hu.a = 2;
    hu.$nextTick(() => {
      expect( step ).is.deep.equals([ 1, 2, 3 ]);

      done();
    });
  });

  it( '使用 mixins 选项对当前实例 watch 选项进行混入 ( Vue )', ( done ) => {
    const step = [];
    const vm = new Vue({
      mixins: [
        { watch: { a: () => step.push( 1 ) } },
        { watch: { a: () => step.push( 2 ) } }
      ],
      data: { a: 1 },
      watch: {
        a: () => step.push( 3 )
      }
    });

    vm.a = 2;
    vm.$nextTick(() => {
      expect( step ).is.deep.equals([ 1, 2, 3 ]);

      done();
    });
  });

  it( '使用 mixins 选项对当前实例 watch 选项进行混入, 当前实例定义的 watch 最晚执行', ( done ) => {
    const step = [];
    const hu = new Hu({
      mixins: [
        { watch: { a: () => step.push( 1 ) } },
        { watch: { a: () => step.push( 2 ) } }
      ],
      data: { a: 1 },
      watch: {
        a: () => step.push( 3 )
      }
    });

    hu.a = 2;
    hu.$nextTick(() => {
      expect( step ).is.deep.equals([ 1, 2, 3 ]);

      done();
    });
  });

  it( '使用 mixins 选项对当前实例 watch 选项进行混入, 当前实例定义的 watch 最晚执行 ( Vue )', ( done ) => {
    const step = [];
    const vm = new Vue({
      mixins: [
        { watch: { a: () => step.push( 1 ) } },
        { watch: { a: () => step.push( 2 ) } }
      ],
      data: { a: 1 },
      watch: {
        a: () => step.push( 3 )
      }
    });

    vm.a = 2;
    vm.$nextTick(() => {
      expect( step ).is.deep.equals([ 1, 2, 3 ]);

      done();
    });
  });

  it( '使用 mixins 选项对当前实例 watch 选项进行混入, 多个 mixin 时, 越后定义的 watch 越晚执行', ( done ) => {
    const step = [];
    const hu = new Hu({
      mixins: [
        { watch: { a: () => step.push( 1 ) } },
        { watch: { a: () => step.push( 2 ) } },
        { watch: { a: () => step.push( 3 ) } }
      ],
      data: { a: 1 }
    });

    hu.a = 2;
    hu.$nextTick(() => {
      expect( step ).is.deep.equals([ 1, 2, 3 ]);

      done();
    });
  });

  it( '使用 mixins 选项对当前实例 watch 选项进行混入, 多个 mixin 时, 越后定义的 watch 越晚执行 ( Vue )', ( done ) => {
    const step = [];
    const vm = new Vue({
      mixins: [
        { watch: { a: () => step.push( 1 ) } },
        { watch: { a: () => step.push( 2 ) } },
        { watch: { a: () => step.push( 3 ) } }
      ],
      data: { a: 1 }
    });

    vm.a = 2;
    vm.$nextTick(() => {
      expect( step ).is.deep.equals([ 1, 2, 3 ]);

      done();
    });
  });

});