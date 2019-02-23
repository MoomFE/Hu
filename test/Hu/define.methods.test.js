describe( 'Hu.define - methods', () => {

  function fn1(){ return 1 }
  function fn2(){ return 2 }

  it( '在 $hu 实例下会创建 $methods 对象, 存放所有的方法', () => {
    const customName = window.customName;

    Hu.define( customName, {
      methods: {
        a: fn1,
        b: fn2
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property( 'b' );

    expect( hu.$methods.a() ).is.equals( 1 );
    expect( hu.$methods.b() ).is.equals( 2 );
  });

  it( '首字母不为 $ 的方法可以在 $methods 和 $hu 下找到', () => {
    const customName = window.customName;

    Hu.define( customName, {
      methods: {
        a: fn1
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu.$methods ).has.property( 'a' );

    expect( hu.a() ).is.equals( 1 );
    expect( hu.$methods.a() ).is.equals( 1 );
  });

  it( '首字母为 $ 的方法可以在 $methods 下找到, 但是不能在 $hu 下找到', () => {
    const customName = window.customName;

    Hu.define( customName, {
      methods: {
        a: fn1,
        $a: fn2
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.not.property( '$a' );
    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property( '$a' );

    expect( hu.a() ).is.equals( 1 );
    expect( hu.$methods.a() ).is.equals( 1 );
    expect( hu.$methods.$a() ).is.equals( 2 );
  });

  it( '若在 $hu 下有同名变量, 会把 $hu 下的同名变量替换为当前方法', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null
      },
      methods: {
        a: fn1
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$methods ).has.property( 'a' );

    expect( hu.$props.a ).is.equals( '1' );
    expect( hu.a() ).is.equals( 1 );
    expect( hu.$methods.a() ).is.equals( 1 );
  });

  it( '定义 methods 时有非 function 类型的属性会进行忽略', () => {
    const customName = window.customName;

    Hu.define( customName, {
      methods: {
        a: fn1,
        b: '',
        c: true,
        d: false,
        e: {},
        f: [],
        g: null,
        h: undefined,
        i: Symbol('i')
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property('a');
    expect( hu ).not.has.property('b');
    expect( hu ).not.has.property('c');
    expect( hu ).not.has.property('d');
    expect( hu ).not.has.property('e');
    expect( hu ).not.has.property('f');
    expect( hu ).not.has.property('g');
    expect( hu ).not.has.property('h');
    expect( hu ).not.has.property('i');

    expect( hu.$methods ).has.property('a');
    expect( hu.$methods ).not.has.property('b');
    expect( hu.$methods ).not.has.property('c');
    expect( hu.$methods ).not.has.property('d');
    expect( hu.$methods ).not.has.property('e');
    expect( hu.$methods ).not.has.property('f');
    expect( hu.$methods ).not.has.property('g');
    expect( hu.$methods ).not.has.property('h');
    expect( hu.$methods ).not.has.property('i');
  });

  it( '调用方法时, 方法的 this 指向的是 $hu', () => {
    const customName = window.customName;

    Hu.define( customName, {
      methods: {
        a(){ return this }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu.$methods ).has.property( 'a' );

    expect( hu.a() ).is.equals( hu );
    expect( hu.$methods.a() ).is.equals( hu );
  });

  it( '可以通过 $methods 对方法进行读取和更改', () => {
    const customName = window.customName;

    Hu.define( customName, {
      methods: {
        a: fn1
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$methods.a() ).is.equals( 1 );

    hu.$methods.a = fn2;

    expect( hu.$methods.a() ).is.equals( 2 );
  });

  it( '更改 $hu 上方法的映射, 不会影响到 $methods 内的方法', () => {
    const customName = window.customName;

    Hu.define( customName, {
      methods: {
        a: fn1
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$methods.a() ).is.equals( 1 );

    hu.a = fn2;

    expect( hu.a() ).is.equals( 2 );
    expect( hu.$methods.a() ).is.equals( 1 );
  });

  it( '若删除 $hu 下的方法映射, 不会影响到 $methods 内的方法本体', () => {
    const customName = window.customName;

    Hu.define( customName, {
      methods: {
        a(){}
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu.$methods ).has.property( 'a' );

    delete hu.a;

    expect( hu ).has.not.property( 'a' );
    expect( hu.$methods ).has.property( 'a' );
  });

});