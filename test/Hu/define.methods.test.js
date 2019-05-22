describe( 'Hu.define - methods', () => {

  function fn1(){ return 1 }
  function fn2(){ return 2 }

  it( 'methods: 在实例中会创建 $methods 实例属性, 存放所有的方法', () => {
    const hu = new Hu({
      methods: {
        a: fn1,
        b: fn2
      }
    });

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );

    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property( 'b' );

    expect( hu.a ).is.equals( hu.$methods.a );
    expect( hu.b ).is.equals( hu.$methods.b );

    expect( hu.a() ).is.equals( 1 );
    expect( hu.b() ).is.equals( 2 );
  });

  it( 'methods: 在实例中会创建 $methods 实例属性, 存放所有的方法 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      methods: {
        a: fn1,
        b: fn2
      }
    });

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );

    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property( 'b' );

    expect( hu.a ).is.equals( hu.$methods.a );
    expect( hu.b ).is.equals( hu.$methods.b );

    expect( hu.a() ).is.equals( 1 );
    expect( hu.b() ).is.equals( 2 );
  });

  it( 'methods: 所有定义的方法都会在 $methods 实例属性中, 首字母不为 $ 的方法才会在实例中创建副本', () => {
    const hu = new Hu({
      methods: {
        a: fn1,
        $a: fn2
      }
    });

    expect( hu ).has.property( 'a' );
    expect( hu ).has.not.property( '$a' );

    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property( '$a' );

    expect( hu.a ).is.equals( hu.$methods.a );
    expect( hu.$a ).is.undefined;

    expect( hu.a() ).is.equals( 1 );
    expect( hu.$methods.a() ).is.equals( 1 );
    expect( hu.$methods.$a() ).is.equals( 2 );
  });

  it( 'methods: 所有定义的方法都会在 $methods 实例属性中, 首字母不为 $ 的方法才会在实例中创建副本 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      methods: {
        a: fn1,
        $a: fn2
      }
    });

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.not.property( '$a' );

    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property( '$a' );

    expect( hu.a ).is.equals( hu.$methods.a );
    expect( hu.$a ).is.undefined;

    expect( hu.a() ).is.equals( 1 );
    expect( hu.$methods.a() ).is.equals( 1 );
    expect( hu.$methods.$a() ).is.equals( 2 );
  });

  it( 'methods: 若在实例中已有同名变量, 会将同名变量删除并替换为当前方法', () => {
    const hu = new Hu({
      props: {
        a: { default: 3 },
        b: { default: 4 }
      },
      methods: {
        a: fn1,
        b: fn2
      }
    });

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );

    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property( 'b' );

    expect( hu.a ).is.equals( hu.$methods.a );
    expect( hu.b ).is.equals( hu.$methods.b );

    expect( hu.a() ).is.equals( 1 );
    expect( hu.b() ).is.equals( 2 );
  });

  it( 'methods: 若在实例中已有同名变量, 会将同名变量删除并替换为当前方法 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: { default: 3 },
        b: { default: 4 }
      },
      methods: {
        a: fn1,
        b: fn2
      }
    });

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );

    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property( 'b' );

    expect( hu.a ).is.equals( hu.$methods.a );
    expect( hu.b ).is.equals( hu.$methods.b );

    expect( hu.a() ).is.equals( 1 );
    expect( hu.b() ).is.equals( 2 );
  });

  it( 'methods: 定义时非 function 类型的属性会被忽略', () => {
    const hu = new Hu({
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

    expect( hu.a() ).is.equals( 1 );
  });

  it( 'methods: 定义时非 function 类型的属性会被忽略 ( 二 )', () => {
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

    const custom = document.createElement( customName );
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

    expect( hu.a() ).is.equals( 1 );
  });

  it( 'methods: 方法执行时, this 的指向是当前实例', () => {
    const hu = new Hu({
      methods: {
        a: function(){
          return this;
        }
      }
    });

    expect( hu.a() ).is.equals( hu );
  });

  it( 'methods: 方法执行时, this 的指向是当前实例 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      methods: {
        a: function(){
          return this;
        }
      }
    });

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu.a() ).is.equals( hu );
  });

  it( 'methods: 更改实例上方法的副本, 不会影响到 $methods 实例属性内的方法', () => {
    const hu = new Hu({
      methods: {
        a: fn1,
        b: fn2
      }
    });

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property( 'b' );

    delete hu.a;

    expect( hu ).has.not.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property( 'b' );


    expect( hu.b() ).is.equals( 2 );
    expect( hu.$methods.b() ).is.equals( 2 );

    hu.b = fn1;

    expect( hu.b() ).is.equals( 1 );
    expect( hu.$methods.b() ).is.equals( 2 );
  });

  it( 'methods: 更改实例上方法的副本, 不会影响到 $methods 实例属性内的方法 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      methods: {
        a: fn1,
        b: fn2
      }
    });

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property( 'b' );

    delete hu.a;

    expect( hu ).has.not.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property( 'b' );


    expect( hu.b() ).is.equals( 2 );
    expect( hu.$methods.b() ).is.equals( 2 );

    hu.b = fn1;

    expect( hu.b() ).is.equals( 1 );
    expect( hu.$methods.b() ).is.equals( 2 );
  });

  it( 'methods: 更改 $methods 实例属性内的方法, 不会影响到实例上方法的副本', () => {
    const hu = new Hu({
      methods: {
        a: fn1,
        b: fn2
      }
    });

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property( 'b' );

    delete hu.$methods.a;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$methods ).has.not.property( 'a' );
    expect( hu.$methods ).has.property( 'b' );


    expect( hu.b() ).is.equals( 2 );
    expect( hu.$methods.b() ).is.equals( 2 );

    hu.$methods.b = fn1;

    expect( hu.b() ).is.equals( 2 );
    expect( hu.$methods.b() ).is.equals( 1 );
  });

  it( 'methods: 更改 $methods 实例属性内的方法, 不会影响到实例上方法的副本 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      methods: {
        a: fn1,
        b: fn2
      }
    });

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$methods ).has.property( 'a' );
    expect( hu.$methods ).has.property( 'b' );

    delete hu.$methods.a;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$methods ).has.not.property( 'a' );
    expect( hu.$methods ).has.property( 'b' );


    expect( hu.b() ).is.equals( 2 );
    expect( hu.$methods.b() ).is.equals( 2 );

    hu.$methods.b = fn1;

    expect( hu.b() ).is.equals( 2 );
    expect( hu.$methods.b() ).is.equals( 1 );
  });

  /* ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ */

  it( 'globalMethods: 在实例中会创建 $globalMethods 实例属性, 存放所有的方法', () => {
    const hu = new Hu({
      globalMethods: {
        a: fn1,
        b: fn2
      }
    });

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );

    expect( hu.$globalMethods ).has.property( 'a' );
    expect( hu.$globalMethods ).has.property( 'b' );

    expect( hu.a() ).is.equals( 1 );
    expect( hu.b() ).is.equals( 2 );

    expect( hu.$globalMethods.a() ).is.equals( 1 );
    expect( hu.$globalMethods.b() ).is.equals( 2 );
  });

  it( 'globalMethods: 在实例中会创建 $globalMethods 实例属性, 存放所有的方法 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      globalMethods: {
        a: fn1,
        b: fn2
      }
    });

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );

    expect( custom ).has.property( 'a' );
    expect( custom ).has.property( 'b' );

    expect( hu.$globalMethods ).has.property( 'a' );
    expect( hu.$globalMethods ).has.property( 'b' );

    expect( hu.a() ).is.equals( 1 );
    expect( hu.b() ).is.equals( 2 );

    expect( custom.a() ).is.equals( 1 );
    expect( custom.b() ).is.equals( 2 );

    expect( hu.$globalMethods.a() ).is.equals( 1 );
    expect( hu.$globalMethods.b() ).is.equals( 2 );
  });

  it( 'globalMethods: 所有定义的方法都会在 $globalMethods 实例属性中, 首字母不为 $ 的方法才会在实例和自定义元素中创建映射', () => {
    const hu = new Hu({
      globalMethods: {
        a: fn1,
        $a: fn2
      }
    });

    expect( hu ).has.property( 'a' );
    expect( hu ).has.not.property( '$a' );

    expect( hu.$globalMethods ).has.property( 'a' );
    expect( hu.$globalMethods ).has.property( '$a' );

    expect( hu.a() ).is.equals( 1 );
    expect( hu.$globalMethods.a() ).is.equals( 1 );
    expect( hu.$globalMethods.$a() ).is.equals( 2 );
  });

  it( 'globalMethods: 所有定义的方法都会在 $globalMethods 实例属性中, 首字母不为 $ 的方法才会在实例和自定义元素中创建映射 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      globalMethods: {
        a: fn1,
        $a: fn2
      }
    });

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.not.property( '$a' );

    expect( custom ).has.property( 'a' );
    expect( custom ).has.not.property( '$a' );

    expect( hu.$globalMethods ).has.property( 'a' );
    expect( hu.$globalMethods ).has.property( '$a' );

    expect( hu.a() ).is.equals( 1 );
    expect( custom.a() ).is.equals( 1 );
    expect( hu.$globalMethods.a() ).is.equals( 1 );
    expect( hu.$globalMethods.$a() ).is.equals( 2 );
  });

  it( 'globalMethods: 若在实例中已有同名变量, 会将同名变量删除并替换为当前方法', () => {
    const hu = new Hu({
      props: {
        a: { default: 3 },
        b: { default: 4 }
      },
      globalMethods: {
        a: fn1,
        b: fn2
      }
    });

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );

    expect( hu.$globalMethods ).has.property( 'a' );
    expect( hu.$globalMethods ).has.property( 'b' );

    expect( hu.a() ).is.equals( 1 );
    expect( hu.b() ).is.equals( 2 );
    expect( hu.$globalMethods.a() ).is.equals( 1 );
    expect( hu.$globalMethods.b() ).is.equals( 2 );
  });

  it( 'globalMethods: 若在实例中已有同名变量, 会将同名变量删除并替换为当前方法 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: { default: 3 },
        b: { default: 4 }
      },
      globalMethods: {
        a: fn1,
        b: fn2
      }
    });

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );

    expect( custom ).has.property( 'a' );
    expect( custom ).has.property( 'b' );

    expect( hu.$globalMethods ).has.property( 'a' );
    expect( hu.$globalMethods ).has.property( 'b' );

    expect( hu.a() ).is.equals( 1 );
    expect( hu.b() ).is.equals( 2 );
    expect( custom.a() ).is.equals( 1 );
    expect( custom.b() ).is.equals( 2 );
    expect( hu.$globalMethods.a() ).is.equals( 1 );
    expect( hu.$globalMethods.b() ).is.equals( 2 );
  });

  it( 'globalMethods: 定义时非 function 类型的属性会被忽略', () => {
    const hu = new Hu({
      globalMethods: {
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

    expect( hu ).has.property('a');
    expect( hu ).not.has.property('b');
    expect( hu ).not.has.property('c');
    expect( hu ).not.has.property('d');
    expect( hu ).not.has.property('e');
    expect( hu ).not.has.property('f');
    expect( hu ).not.has.property('g');
    expect( hu ).not.has.property('h');
    expect( hu ).not.has.property('i');

    expect( hu.$globalMethods ).has.property('a');
    expect( hu.$globalMethods ).not.has.property('b');
    expect( hu.$globalMethods ).not.has.property('c');
    expect( hu.$globalMethods ).not.has.property('d');
    expect( hu.$globalMethods ).not.has.property('e');
    expect( hu.$globalMethods ).not.has.property('f');
    expect( hu.$globalMethods ).not.has.property('g');
    expect( hu.$globalMethods ).not.has.property('h');
    expect( hu.$globalMethods ).not.has.property('i');

    expect( hu.a() ).is.equals( 1 );
    expect( hu.$globalMethods.a() ).is.equals( 1 );
  });

  it( 'globalMethods: 定义时非 function 类型的属性会被忽略 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      globalMethods: {
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

    const custom = document.createElement( customName );
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

    expect( hu.$globalMethods ).has.property('a');
    expect( hu.$globalMethods ).not.has.property('b');
    expect( hu.$globalMethods ).not.has.property('c');
    expect( hu.$globalMethods ).not.has.property('d');
    expect( hu.$globalMethods ).not.has.property('e');
    expect( hu.$globalMethods ).not.has.property('f');
    expect( hu.$globalMethods ).not.has.property('g');
    expect( hu.$globalMethods ).not.has.property('h');
    expect( hu.$globalMethods ).not.has.property('i');

    expect( hu.a() ).is.equals( 1 );
    expect( custom.a() ).is.equals( 1 );
    expect( hu.$globalMethods.a() ).is.equals( 1 );
  });

  it( 'globalMethods: 方法执行时, this 的指向是当前实例', () => {
    const hu = new Hu({
      globalMethods: {
        a: function(){
          return this;
        }
      }
    });

    expect( hu.a() ).is.equals( hu );
    expect( hu.$globalMethods.a() ).is.equals( hu );
  });

  it( 'globalMethods: 方法执行时, this 的指向是当前实例 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      globalMethods: {
        a: function(){
          return this;
        }
      }
    });

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu.a() ).is.equals( hu );
    expect( custom.a() ).is.equals( hu );
    expect( hu.$globalMethods.a() ).is.equals( hu );
  });

  it( 'globalMethods: 更改 ( 不包括删除 ) 实例上方法的映射, 会影响到 $methods 实例属性内的方法', () => {
    const hu = new Hu({
      globalMethods: {
        a: fn1,
        b: fn2
      }
    });

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$globalMethods ).has.property( 'a' );
    expect( hu.$globalMethods ).has.property( 'b' );

    delete hu.a;

    expect( hu ).has.not.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$globalMethods ).has.property( 'a' );
    expect( hu.$globalMethods ).has.property( 'b' );
    expect( hu.$globalMethods.a() ).is.equals( 1 );


    expect( hu.b() ).is.equals( 2 );
    expect( hu.$globalMethods.b() ).is.equals( 2 );

    hu.b = fn1;

    expect( hu.b() ).is.equals( 1 );
    expect( hu.$globalMethods.b() ).is.equals( 1 );
  });

  it( 'globalMethods: 更改 ( 不包括删除 ) 实例上方法的映射, 会影响到 $methods 实例属性内的方法 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      globalMethods: {
        a: fn1,
        b: fn2
      }
    });

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( custom ).has.property( 'a' );
    expect( custom ).has.property( 'b' );
    expect( hu.$globalMethods ).has.property( 'a' );
    expect( hu.$globalMethods ).has.property( 'b' );

    delete hu.a;

    expect( hu ).has.not.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( custom ).has.property( 'a' );
    expect( custom ).has.property( 'b' );
    expect( hu.$globalMethods ).has.property( 'a' );
    expect( hu.$globalMethods ).has.property( 'b' );
    expect( custom.a() ).is.equals( 1 );
    expect( hu.$globalMethods.a() ).is.equals( 1 );


    expect( hu.b() ).is.equals( 2 );
    expect( custom.b() ).is.equals( 2 );
    expect( hu.$globalMethods.b() ).is.equals( 2 );

    hu.b = fn1;

    expect( hu.b() ).is.equals( 1 );
    expect( custom.b() ).is.equals( 1 );
    expect( hu.$globalMethods.b() ).is.equals( 1 );
  });

  it( 'globalMethods: 更改 ( 不包括删除 ) 自定义元素上方法的映射, 会影响到 $methods 实例属性内的方法', () => {
    const customName = window.customName;

    Hu.define( customName, {
      globalMethods: {
        a: fn1,
        b: fn2
      }
    });

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( custom ).has.property( 'a' );
    expect( custom ).has.property( 'b' );
    expect( hu.$globalMethods ).has.property( 'a' );
    expect( hu.$globalMethods ).has.property( 'b' );

    delete custom.a;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( custom ).has.not.property( 'a' );
    expect( custom ).has.property( 'b' );
    expect( hu.$globalMethods ).has.property( 'a' );
    expect( hu.$globalMethods ).has.property( 'b' );
    expect( hu.a() ).is.equals( 1 );
    expect( hu.$globalMethods.a() ).is.equals( 1 );


    expect( hu.b() ).is.equals( 2 );
    expect( custom.b() ).is.equals( 2 );
    expect( hu.$globalMethods.b() ).is.equals( 2 );

    custom.b = fn1;

    expect( hu.b() ).is.equals( 1 );
    expect( custom.b() ).is.equals( 1 );
    expect( hu.$globalMethods.b() ).is.equals( 1 );
  });

  it( 'globalMethods: 更改 ( 不包括删除 ) $globalMethods 实例属性内的方法, 会影响到实例和自定义元素上方法的映射', () => {
    const hu = new Hu({
      globalMethods: {
        a: fn1,
        b: fn2
      }
    });

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$globalMethods ).has.property( 'a' );
    expect( hu.$globalMethods ).has.property( 'b' );

    delete hu.$globalMethods.a;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$globalMethods ).has.not.property( 'a' );
    expect( hu.$globalMethods ).has.property( 'b' );
    expect( hu.a ).is.undefined;


    expect( hu.b() ).is.equals( 2 );
    expect( hu.$globalMethods.b() ).is.equals( 2 );

    hu.$globalMethods.b = fn1;

    expect( hu.b() ).is.equals( 1 );
    expect( hu.$globalMethods.b() ).is.equals( 1 );
  });

  it( 'globalMethods: 更改 ( 不包括删除 ) $globalMethods 实例属性内的方法, 会影响到实例和自定义元素上方法的映射 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      globalMethods: {
        a: fn1,
        b: fn2
      }
    });

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( custom ).has.property( 'a' );
    expect( custom ).has.property( 'b' );
    expect( hu.$globalMethods ).has.property( 'a' );
    expect( hu.$globalMethods ).has.property( 'b' );

    delete hu.$globalMethods.a;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( custom ).has.property( 'a' );
    expect( custom ).has.property( 'b' );
    expect( hu.$globalMethods ).has.not.property( 'a' );
    expect( hu.$globalMethods ).has.property( 'b' );
    expect( hu.a ).is.undefined;
    expect( custom.a ).is.undefined;


    expect( hu.b() ).is.equals( 2 );
    expect( custom.b() ).is.equals( 2 );
    expect( hu.$globalMethods.b() ).is.equals( 2 );

    hu.$globalMethods.b = fn1;

    expect( hu.b() ).is.equals( 1 );
    expect( custom.b() ).is.equals( 1 );
    expect( hu.$globalMethods.b() ).is.equals( 1 );
  });

});