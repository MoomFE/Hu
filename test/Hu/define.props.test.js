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

  it( '定义了 attr 参数则会从相应的 attribute 中取值', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: { attr: 'b' },
        b: { attr: 'a' },
        aB: { attr: 'a-c' },
        aC: { attr: 'a-b' }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" b="2" a-b="3" a-c="4"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'aB' );
    expect( hu ).has.property( 'aC' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'aB' );
    expect( hu.$props ).has.property( 'aC' );

    expect( hu[ 'a' ] ).is.equals( '2' );
    expect( hu[ 'b' ] ).is.equals( '1' );
    expect( hu[ 'aB' ] ).is.equals( '4' );
    expect( hu[ 'aC' ] ).is.equals( '3' );
    expect( hu.$props[ 'a' ] ).is.equals( '2' );
    expect( hu.$props[ 'b' ] ).is.equals( '1' );
    expect( hu.$props[ 'aB' ] ).is.equals( '4' );
    expect( hu.$props[ 'aC' ] ).is.equals( '3' );
  });

  it( '未定义 attr 参数则会将当前 prop 的名称转为以连字符号连接的小写 attr 名称', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null,
        'aB': null,
        'a-c': null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" a-b="2" a-c="3"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'aB' );
    expect( hu ).has.property( 'a-c' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'aB' );
    expect( hu.$props ).has.property( 'a-c' );

    expect( hu[ 'a' ] ).is.equals( '1' );
    expect( hu[ 'aB' ] ).is.equals( '2' );
    expect( hu[ 'a-c' ] ).is.equals( '3' );
    expect( hu.$props[ 'a' ] ).is.equals( '1' );
    expect( hu.$props[ 'aB' ] ).is.equals( '2' );
    expect( hu.$props[ 'a-c' ] ).is.equals( '3' );
  });

  it( '支持传入名称为 Symbol 类型的 prop, 可以使用默认值给名称为 Symbol 类型的 prop 赋值', () => {
    const customName = window.customName;
    const a = Symbol('a');
    const b = Symbol('b');
    const props = {};
          props[ a ] = { default: 1 };
          props[ b ] = { default: 2 };

    Hu.define( customName, {
      props
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( a );
    expect( hu ).has.property( b );
    expect( hu.$props ).has.property( a );
    expect( hu.$props ).has.property( b );

    expect( hu[ a ] ).is.equals( 1 );
    expect( hu[ b ] ).is.equals( 2 );
    expect( hu.$props[ a ] ).is.equals( 1 );
    expect( hu.$props[ b ] ).is.equals( 2 );
  });

  it( '支持传入名称为 Symbol 类型的 prop, 可以指定 attr 属性使当前 prop 从指定 attribute 取值', () => {
    const customName = window.customName;
    const a = Symbol('a');
    const b = Symbol('b');
    const props = {};
          props[ a ] = { attr: 'c' };
          props[ b ] = { attr: 'd' };

    Hu.define( customName, {
      props
    });

    const div = document.createElement('div').$html(`<${ customName } c="d" d="e"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( a );
    expect( hu ).has.property( b );
    expect( hu.$props ).has.property( a );
    expect( hu.$props ).has.property( b );

    expect( hu[ a ] ).is.equals( 'd' );
    expect( hu[ b ] ).is.equals( 'e' );
    expect( hu.$props[ a ] ).is.equals( 'd' );
    expect( hu.$props[ b ] ).is.equals( 'e' );
  });

  it( '更改自定义元素的 attribute 属性值时, 会立即将改变更新到内部的值中 ( 非 Symbol 类型 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null,
        aB: null,
        attr1: { attr: 'attr2' },
        attr2: { attr: 'attr1' }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" a-b="2" attr1="5" attr2="6"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.a ).is.equals( '1' );
    expect( hu.aB ).is.equals( '2' );
    expect( hu.attr1 ).is.equals( '6' );
    expect( hu.attr2 ).is.equals( '5' );
    expect( hu.$props.a ).is.equals( '1' );
    expect( hu.$props.aB ).is.equals( '2' );
    expect( hu.$props.attr1 ).is.equals( '6' );
    expect( hu.$props.attr2 ).is.equals( '5' );

    custom.setAttribute('a','2');

    expect( hu.a ).is.equals( '2' );
    expect( hu.aB ).is.equals( '2' );
    expect( hu.attr1 ).is.equals( '6' );
    expect( hu.attr2 ).is.equals( '5' );
    expect( hu.$props.a ).is.equals( '2' );
    expect( hu.$props.aB ).is.equals( '2' );
    expect( hu.$props.attr1 ).is.equals( '6' );
    expect( hu.$props.attr2 ).is.equals( '5' );

    custom.setAttribute('a-b','3');

    expect( hu.a ).is.equals( '2' );
    expect( hu.aB ).is.equals( '3' );
    expect( hu.attr1 ).is.equals( '6' );
    expect( hu.attr2 ).is.equals( '5' );
    expect( hu.$props.a ).is.equals( '2' );
    expect( hu.$props.aB ).is.equals( '3' );
    expect( hu.$props.attr1 ).is.equals( '6' );
    expect( hu.$props.attr2 ).is.equals( '5' );

    custom.setAttribute('attr1','7');
    custom.setAttribute('attr2','8');

    expect( hu.a ).is.equals( '2' );
    expect( hu.aB ).is.equals( '3' );
    expect( hu.attr1 ).is.equals( '8' );
    expect( hu.attr2 ).is.equals( '7' );
    expect( hu.$props.a ).is.equals( '2' );
    expect( hu.$props.aB ).is.equals( '3' );
    expect( hu.$props.attr1 ).is.equals( '8' );
    expect( hu.$props.attr2 ).is.equals( '7' );
  });

  it( '更改自定义元素的 attribute 属性值时, 会立即将改变更新到内部的值中 ( Symbol 类型 )', () => {
    const customName = window.customName;
    const a = Symbol('a');
    const b = Symbol('b');
    const c = Symbol('c');
    const props = {};
          props[ a ] = null;
          props[ b ] = { attr: 'a' };
          props[ c ] = { attr: 'b', type: Number };

    Hu.define( customName, {
      props
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" b="2"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( a );
    expect( hu ).has.property( b );
    expect( hu ).has.property( c );
    expect( hu.$props ).has.property( a );
    expect( hu.$props ).has.property( b );
    expect( hu.$props ).has.property( c );

    expect( hu[ a ] ).is.equals( undefined );
    expect( hu[ b ] ).is.equals( '1' );
    expect( hu[ c ] ).is.equals( 2 );
    expect( hu.$props[ a ] ).is.equals( undefined );
    expect( hu.$props[ b ] ).is.equals( '1' );
    expect( hu.$props[ c ] ).is.equals( 2 );

    custom.setAttribute('a','2');

    expect( hu[ a ] ).is.equals( undefined );
    expect( hu[ b ] ).is.equals( '2' );
    expect( hu[ c ] ).is.equals( 2 );
    expect( hu.$props[ a ] ).is.equals( undefined );
    expect( hu.$props[ b ] ).is.equals( '2' );
    expect( hu.$props[ c ] ).is.equals( 2 );

    custom.setAttribute('b','3');

    expect( hu[ a ] ).is.equals( undefined );
    expect( hu[ b ] ).is.equals( '2' );
    expect( hu[ c ] ).is.equals( 3 );
    expect( hu.$props[ a ] ).is.equals( undefined );
    expect( hu.$props[ b ] ).is.equals( '2' );
    expect( hu.$props[ c ] ).is.equals( 3 );
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