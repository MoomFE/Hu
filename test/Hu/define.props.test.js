describe( 'Hu.define - props', () => {

  it( '首字母不为 $ 的 prop 可以在 $props 和 $hu 下找到', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null,
        b: null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } b="3"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( '3' );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( '3' );
  });

  it( '首字母为 $ 的 prop 可以在 $props 下找到, 但是不能在 $hu 下找到', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null,
        b: null,
        $a: null,
        $b: null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } $b="3" b="4"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.not.property( '$a' );
    expect( hu ).has.not.property( '$b' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( '$a' );
    expect( hu.$props ).has.property( '$b' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( '4' );
    expect( hu.$a ).is.equals( undefined );
    expect( hu.$b ).is.equals( undefined );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( '4' );
    expect( hu.$props.$a ).is.equals( undefined );
    expect( hu.$props.$b ).is.equals( '3' );
  });

  it( '可以通过 $hu 对 prop 进行读取和更改', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.a ).is.equals( '1' );
    expect( hu.$props.a ).is.equals( '1' );

    hu.a = 123;

    expect( hu.a ).is.equals( 123 );
    expect( hu.$props.a ).is.equals( 123 );
  });

  it( '可以通过 $props 对 prop 进行读取和更改', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.a ).is.equals( '1' );
    expect( hu.$props.a ).is.equals( '1' );

    hu.$props.a = 123;

    expect( hu.a ).is.equals( 123 );
    expect( hu.$props.a ).is.equals( 123 );
  });

  it( '若删除 $hu 下的 prop 映射, 不会影响到 $props 内的 prop 本体', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu.$props ).has.property( 'a' );

    expect( hu.a ).is.equals( '1' );
    expect( hu.$props.a ).is.equals( '1' );

    delete hu.a;

    expect( hu ).has.not.property( 'a' );
    expect( hu.$props ).has.property( 'a' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.$props.a ).is.equals( '1' );
  });

});