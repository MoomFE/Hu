describe( 'Lit.define - methods', () => {

  function fn1(){ return 1 }
  function fn2(){ return 2 }

  it( '在 $lit 实例下会创建 $methods 对象, 存放所有的方法', () => {
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

    expect( lit.$methods ).has.property( 'a' );
    expect( lit.$methods ).has.property( 'b' );

    expect( lit.$methods.a() ).to.equals( 1 );
    expect( lit.$methods.b() ).to.equals( 2 );
  });

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

    expect( lit ).has.property( 'a' );
    expect( lit.$methods ).has.property( 'a' );

    expect( lit.a() ).to.equals( 1 );
    expect( lit.$methods.a() ).to.equals( 1 );
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.not.property( '$a' );
    expect( lit.$methods ).has.property( 'a' );
    expect( lit.$methods ).has.property( '$a' );

    expect( lit.a() ).to.equals( 1 );
    expect( lit.$methods.a() ).to.equals( 1 );
    expect( lit.$methods.$a() ).to.equals( 2 );
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

    expect( lit ).has.property( 'a' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$methods ).has.property( 'a' );

    expect( lit.$props.a ).to.equals( '1' );
    expect( lit.a() ).to.equals( 1 );
    expect( lit.$methods.a() ).to.equals( 1 );
  });

  it( '定义 methods 时有非 function 类型的属性会进行忽略', () => {
    const customName = window.customName;

    Lit.define( customName, {
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
    const lit = custom.$lit;

    expect( lit ).has.property('a');
    expect( lit ).not.has.property('b');
    expect( lit ).not.has.property('c');
    expect( lit ).not.has.property('d');
    expect( lit ).not.has.property('e');
    expect( lit ).not.has.property('f');
    expect( lit ).not.has.property('g');
    expect( lit ).not.has.property('h');
    expect( lit ).not.has.property('i');

    expect( lit.$methods ).has.property('a');
    expect( lit.$methods ).not.has.property('b');
    expect( lit.$methods ).not.has.property('c');
    expect( lit.$methods ).not.has.property('d');
    expect( lit.$methods ).not.has.property('e');
    expect( lit.$methods ).not.has.property('f');
    expect( lit.$methods ).not.has.property('g');
    expect( lit.$methods ).not.has.property('h');
    expect( lit.$methods ).not.has.property('i');
  });

  it( '调用方法时, 方法的 this 指向的是 $lit', () => {
    const customName = window.customName;

    Lit.define( customName, {
      methods: {
        a(){ return this }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit ).has.property( 'a' );
    expect( lit.$methods ).has.property( 'a' );

    expect( lit.a() ).to.equals( lit );
    expect( lit.$methods.a() ).to.equals( lit );
  });

  it( '可以通过 $methods 对方法进行读取和更改', () => {
    const customName = window.customName;

    Lit.define( customName, {
      methods: {
        a: fn1
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit.$methods.a() ).to.equals( 1 );

    lit.$methods.a = fn2;

    expect( lit.$methods.a() ).to.equals( 2 );
  });
  
  it( '更改 $lit 上方法的映射, 不会影响到 $methods 内的方法', () => {
    const customName = window.customName;

    Lit.define( customName, {
      methods: {
        a: fn1
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit.$methods.a() ).to.equals( 1 );

    lit.a = fn2;

    expect( lit.a() ).to.equals( 2 );
    expect( lit.$methods.a() ).to.equals( 1 );
  });

  it( '若删除 $lit 下的方法映射, 不会影响到 $methods 内的方法本体', () => {
    const customName = window.customName;

    Lit.define( customName, {
      methods: {
        a(){}
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit ).has.property( 'a' );
    expect( lit.$methods ).has.property( 'a' );

    delete lit.a;

    expect( lit ).has.not.property( 'a' );
    expect( lit.$methods ).has.property( 'a' );
  });

});