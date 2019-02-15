describe( 'Lit.define - methods', () => {

  function fn1(){ return 1 }
  function fn2(){ return 2 }

  describe( '在 $lit 实例下会创建 $methods 对象, 存放所有的方法', () => {
    
    it( '定义的所有方法会在 $methods 内找到', () => {
      const customName = window.customName;

      Lit.define( customName, {
        methods: {
          a: fn1,
          b: fn2
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit.$methods, 'a' );
      should.has( lit.$methods, 'b' );

      should.isFunction( lit.$methods.a );
      should.isFunction( lit.$methods.b );

      should.equal( lit.$methods.a(), 1 );
      should.equal( lit.$methods.b(), 2 );
    });

  });

  describe( '首字母不为 $ 的方法会在 $lit 上建立引用', () => {

    it( '首字母不为 $ 的方法可以在 $methods 和 $lit 下找到', () => {
      const customName = window.customName;

      Lit.define( customName, {
        methods: {
          a: fn1
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit.$methods, 'a' );

      should.isFunction( lit.a );
      should.isFunction( lit.$methods.a );

      should.equal( lit.a(), 1 );
      should.equal( lit.$methods.a(), 1 );
    });

    it( '首字母为 $ 的方法可以在 $methods 下找到, 但是不能在 $lit 下找到', () => {
      const customName = window.customName;

      Lit.define( customName, {
        methods: {
          a: fn1,
          $a: fn2
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.notHas( lit, '$a' );
      should.has( lit.$methods, 'a' );
      should.has( lit.$methods, '$a' );

      should.equal( lit.a(), 1 );
      should.equal( lit.$methods.a(), 1 );
      should.equal( lit.$methods.$a(), 2 );
    });

    it( '若在 $lit 下有同名变量, 会把 $lit 下的同名变量替换为当前方法', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: null
        },
        methods: {
          a: fn1
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit.$props, 'a' );
      should.has( lit.$methods, 'a' );

      should.isFunction( lit.a );
      should.isFunction( lit.$methods.a );

      should.equal( lit.$props.a, '1' );
      should.equal( lit.a(), 1 );
      should.equal( lit.$methods.a(), 1 );
    });

  });

});