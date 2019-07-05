describe( 'instance.props', () => {

  it( '实例化后所定义的 props 会全部添加到 $props 实例属性中', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      props: {
        a: null,
        [ b ]: { attr: 'b' },
        $c: { attr: 'c' }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" b="2" c="3"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property(  b  );
    expect( hu.$props ).has.property(  '$c'  );

    expect( hu.$props[ 'a' ] ).is.equals( '1' );
    expect( hu.$props[  b  ] ).is.equals( '2' );
    expect( hu.$props[ '$c' ] ).is.equals( '3' );
  });

  it( '实例化后会在实例本身添加 $props 下所有首字母不为 $ 的 prop 的映射', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      props: {
        a: null,
        [ b ]: { attr: 'b' },
        $c: { attr: 'c' }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" b="2" c="3"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property(  b  );
    expect( hu ).has.not.property(  '$c'  );

    expect( hu[ 'a' ] ).is.equals( '1' );
    expect( hu[  b  ] ).is.equals( '2' );
  });

  it( '实例化后若删除在实例本身添加的 prop 的映射, 不会影响到 $props 实例属性内的 prop 本体', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      props: {
        a: null,
        [ b ]: { attr: 'b' }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" b="2"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property(  b  );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property(  b  );

    expect( hu[ 'a' ] ).is.equals( '1' );
    expect( hu[  b  ] ).is.equals( '2' );
    expect( hu.$props[ 'a' ] ).is.equals( '1' );
    expect( hu.$props[  b  ] ).is.equals( '2' );

    delete hu[ 'a' ];
    delete hu[  b  ];

    expect( hu ).has.not.property( 'a' );
    expect( hu ).has.not.property(  b  );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property(  b  );

    expect( hu[ 'a' ] ).is.equals( undefined );
    expect( hu[  b  ] ).is.equals( undefined );
    expect( hu.$props[ 'a' ] ).is.equals( '1' );
    expect( hu.$props[  b  ] ).is.equals( '2' );
  });

  it( '实例化后可以通过当前实例对象对 prop 进行读取和更改', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      props: {
        a: null,
        [ b ]: { attr: 'b' }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" b="2"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property(  b  );

    expect( hu[ 'a' ] ).is.equals( '1' );
    expect( hu[  b  ] ).is.equals( '2' );

    hu[ 'a' ] = 3;
    expect( hu[ 'a' ] ).is.equals( 3 );
    expect( hu[  b  ] ).is.equals( '2' );

    hu[  b  ] = 4;
    expect( hu[ 'a' ] ).is.equals( 3 );
    expect( hu[  b  ] ).is.equals( 4 );
  });

  it( '实例化后可以通过 $props 实例属性对 prop 进行读取和更改', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      props: {
        a: null,
        [ b ]: { attr: 'b' }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" b="2"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property(  b  );

    expect( hu.$props[ 'a' ] ).is.equals( '1' );
    expect( hu.$props[  b  ] ).is.equals( '2' );

    hu.$props[ 'a' ] = 3;
    expect( hu.$props[ 'a' ] ).is.equals( 3 );
    expect( hu.$props[  b  ] ).is.equals( '2' );

    hu.$props[  b  ] = 4;
    expect( hu.$props[ 'a' ] ).is.equals( 3 );
    expect( hu.$props[  b  ] ).is.equals( 4 );
  });

});