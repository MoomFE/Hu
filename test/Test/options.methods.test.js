describe( 'options.methods', () => {

  function fn1(){ return 1 }
  function fn2(){ return 2 }
  function fn3(){ return 3 }

  it('------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------');

  it( '实例化后所定义的方法会全部添加到 $methods 实例属性中', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      methods: {
        a: fn1,
        [ b ]: fn2,
        $c: fn3
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property(  b  );
    expect( hu.$methods ).has.property(  '$c'  );

    expect( hu.$methods[ 'a' ] ).is.a( 'function' );
    expect( hu.$methods[  b  ] ).is.a( 'function' );
    expect( hu.$methods[ '$c' ] ).is.a( 'function' );

    expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
    expect( hu.$methods[  b  ]() ).is.equals( 2 );
    expect( hu.$methods[ '$c' ]() ).is.equals( 3 );
  });

  it( '实例化后会在实例本身添加 $methods 下所有首字母不为 $ 的方法的副本', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      methods: {
        a: fn1,
        [ b ]: fn2,
        $c: fn3
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property(  b  );
    expect( hu ).has.not.property(  '$c'  );

    expect( hu[ 'a' ] ).is.a( 'function' );
    expect( hu[  b  ] ).is.a( 'function' );

    expect( hu[ 'a' ]() ).is.equals( 1 );
    expect( hu[  b  ]() ).is.equals( 2 );
  });

  it( '实例化后若删除在实例本身添加的 $methods 的方法的副本, 不会影响到 $methods 的方法本体', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      methods: {
        a: fn1,
        [ b ]: fn2
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property(  b  );
    expect( hu[ 'a' ] ).is.a( 'function' );
    expect( hu[  b  ] ).is.a( 'function' );
    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property(  b  );
    expect( hu.$methods[ 'a' ] ).is.a( 'function' );
    expect( hu.$methods[  b  ] ).is.a( 'function' );

    delete hu[ 'a' ];
    delete hu[  b  ];

    expect( hu[ 'a' ] ).is.equals( undefined );
    expect( hu[  b  ] ).is.equals( undefined );
    expect( hu.$methods[ 'a' ] ).is.a( 'function' );
    expect( hu.$methods[  b  ] ).is.a( 'function' );
    expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
    expect( hu.$methods[  b  ]() ).is.equals( 2 );
  });

  it( '实例化后不可以通过改变当前实例对象内的方法对 $methods 内的的方法进行更改', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      methods: {
        a: fn1,
        [ b ]: fn2
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property(  b  );
    expect( hu[ 'a' ] ).is.a( 'function' );
    expect( hu[  b  ] ).is.a( 'function' );
    expect( hu[ 'a' ]() ).is.equals( 1 );
    expect( hu[  b  ]() ).is.equals( 2 );
    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property(  b  );
    expect( hu.$methods[ 'a' ] ).is.a( 'function' );
    expect( hu.$methods[  b  ] ).is.a( 'function' );
    expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
    expect( hu.$methods[  b  ]() ).is.equals( 2 );

    hu[ 'a' ] = 3;

    expect( hu[ 'a' ] ).is.equals( 3 );
    expect( hu ).has.property(  b  );
    expect( hu[  b  ] ).is.a( 'function' );
    expect( hu[  b  ]() ).is.equals( 2 );
    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property(  b  );
    expect( hu.$methods[ 'a' ] ).is.a( 'function' );
    expect( hu.$methods[  b  ] ).is.a( 'function' );
    expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
    expect( hu.$methods[  b  ]() ).is.equals( 2 );

    hu[ b ] = 4;

    expect( hu[ 'a' ] ).is.equals( 3 );
    expect( hu[  b  ] ).is.equals( 4 );
    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property(  b  );
    expect( hu.$methods[ 'a' ] ).is.a( 'function' );
    expect( hu.$methods[  b  ] ).is.a( 'function' );
    expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
    expect( hu.$methods[  b  ]() ).is.equals( 2 );
  });

  it( '实例化后不可以通过改变 $methods 内的方法对当前实例上方法的映射进行更改', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      methods: {
        a: fn1,
        [ b ]: fn2
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property(  b  );
    expect( hu[ 'a' ] ).is.a( 'function' );
    expect( hu[  b  ] ).is.a( 'function' );
    expect( hu[ 'a' ]() ).is.equals( 1 );
    expect( hu[  b  ]() ).is.equals( 2 );
    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property(  b  );
    expect( hu.$methods[ 'a' ] ).is.a( 'function' );
    expect( hu.$methods[  b  ] ).is.a( 'function' );
    expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
    expect( hu.$methods[  b  ]() ).is.equals( 2 );

    hu.$methods[ 'a' ] = 3;

    expect( hu.$methods[ 'a' ] ).is.equals( 3 );
    expect( hu ).has.property( 'a' );
    expect( hu ).has.property(  b  );
    expect( hu[ 'a' ] ).is.a( 'function' );
    expect( hu[  b  ] ).is.a( 'function' );
    expect( hu[ 'a' ]() ).is.equals( 1 );
    expect( hu[  b  ]() ).is.equals( 2 );
    expect( hu.$methods ).has.property(  b  );
    expect( hu.$methods[  b  ] ).is.a( 'function' );
    expect( hu.$methods[  b  ]() ).is.equals( 2 );

    hu.$methods[ b ] = 4;

    expect( hu.$methods[ 'a' ] ).is.equals( 3 );
    expect( hu.$methods[  b  ] ).is.equals( 4 );
    expect( hu ).has.property( 'a' );
    expect( hu ).has.property(  b  );
    expect( hu[ 'a' ] ).is.a( 'function' );
    expect( hu[  b  ] ).is.a( 'function' );
    expect( hu[ 'a' ]() ).is.equals( 1 );
    expect( hu[  b  ]() ).is.equals( 2 );
  });

});