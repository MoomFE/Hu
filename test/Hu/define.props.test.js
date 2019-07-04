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

  it( '可以使用 attr 属性将多个 prop 绑定到一个 attribute 上, 当 attribute 更改时, 所有绑定到 attribute 上的 prop 均会更新', () => {
    const customName = window.customName;
    const a = Symbol('a');
    const props = {};
          props[ a ] = { attr: 'a' };
          props[ 'a' ] = { attr: 'a' };
          props[ 'aB' ] = { attr: 'a', type: Number };

    Hu.define( customName, {
      props
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( a );
    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'aB' );
    expect( hu.$props ).has.property( a );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'aB' );

    expect( hu[ a ] ).is.equals( '1' );
    expect( hu[ 'a' ] ).is.equals( '1' );
    expect( hu[ 'aB' ] ).is.equals( 1 );
    expect( hu.$props[ a ] ).is.equals( '1' );
    expect( hu.$props[ 'a' ] ).is.equals( '1' );
    expect( hu.$props[ 'aB' ] ).is.equals( 1 );

    custom.setAttribute('a','2');

    expect( hu[ a ] ).is.equals( '2' );
    expect( hu[ 'a' ] ).is.equals( '2' );
    expect( hu[ 'aB' ] ).is.equals( 2 );
    expect( hu.$props[ a ] ).is.equals( '2' );
    expect( hu.$props[ 'a' ] ).is.equals( '2' );
    expect( hu.$props[ 'aB' ] ).is.equals( 2 );
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