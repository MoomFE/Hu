describe( 'Lit.define - data', () => {

  it( '在 $lit 实例下会创建 $data 对象, 存放所有的属性', () => {
    const customName = window.customName;

    Lit.define( customName, {
      data(){
        return {
          a: 1,
          b: 2
        };
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit )
      .has.property( '$data' )
      .that.to.deep.equals({ a: 1, b: 2 });
  });

  it( '定义 data 必须是 function 类型', () => {
    const customName = window.customName;

    Lit.define( customName, {
      data(){
        return { a: 1 };
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit.$data ).to.deep.equals({ a: 1 });
  });

  it( '定义 data 如果不是 function 类型, 否则会被忽略定义', () => {
    const customName = window.customName;

    Lit.define( customName, {
      data: { a: 1 }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit.$data ).to.be.empty;
  });

  it( '首字母不为 $ 的属性可以在 $data 和 $lit 下找到', () => {
    const customName = window.customName;

    Lit.define( customName, {
      data(){
        return { a: 1 };
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit ).has.property( 'a' ).that.to.equals( 1 );
    expect( lit.$data ).has.property( 'a' ).that.to.equals( 1 );
  });

  it( '首字母为 $ 的属性可以在 $data 下找到, 但是不能在 $lit 下找到', () => {
    const customName = window.customName;

    Lit.define( customName, {
      data(){
        return {
          a: 1,
          $b: 2
        };
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit ).has.property( 'a' ).that.to.equals( 1 );
    expect( lit ).has.not.property( '$b' );

    expect( lit.$data ).has.property( 'a' ).that.to.equals( 1 );
    expect( lit.$data ).has.property( '$b' ).that.to.equals( 2 );
  });

  it( '若在 $lit 下有同名变量, 会把 $lit 下的同名变量替换为当前变量 ( 一 )', () => {
    const customName = window.customName;

    Lit.define( customName, {
      props: {
        a: null
      },
      data(){
        return { a: 1 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit ).has.property( 'a' ).that.to.equals( 1 );

    expect( lit.$props ).has.property( 'a' ).that.to.equals( '1' );
    expect( lit.$data ).has.property( 'a' ).that.to.equals( 1 );
  });

  it( '若在 $lit 下有同名变量, 会把 $lit 下的同名变量替换为当前变量 ( 二 )', () => {
    const customName = window.customName;

    Lit.define( customName, {
      methods: {
        a(){ return '1' }
      },
      data(){
        return { a: 1 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit ).has.property( 'a' ).that.to.equals( 1 );
    expect( lit.$data ).has.property( 'a' ).that.to.equals( 1 );

    expect( lit.$methods ).has.property( 'a' ).that.to.an( 'function' );
    expect( lit.$methods.a() ).to.equals( '1' );
  });

  it( '若在 $lit 下有同名变量, 会把 $lit 下的同名变量替换为当前变量 ( 三 )', () => {
    const customName = window.customName;

    Lit.define( customName, {
      props: {
        a: null
      },
      methods: {
        a(){ return '1' }
      },
      data(){
        return { a: 1 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit ).has.property( 'a' ).that.to.equals( 1 );
    expect( lit.$data ).has.property( 'a' ).that.to.equals( 1 );

    expect( lit.$methods ).has.property( 'a' ).that.to.an( 'function' );
    expect( lit.$methods.a() ).to.equals( '1' );

    expect( lit.$props ).has.property( 'a' ).that.to.equals( '1' );;
  });

  it( '执行 data 方法时, this 的指向是 $lit', () => {
    const customName = window.customName;

    Lit.define( customName, {
      data(){
        return { a: this };
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit.a ).to.equals( lit );
    expect( lit.$data.a ).to.equals( lit );
  });

  it( '可以通过 $lit 对变量进行读取和更改', () => {
    const customName = window.customName;

    Lit.define( customName, {
      data(){
        return { a: 1 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit.a ).to.equals( 1 );
    expect( lit.$data.a ).to.equals( 1 );

    lit.a = 123;

    expect( lit.a ).to.equals( 123 );
    expect( lit.$data.a ).to.equals( 123 );
  });

  it( '可以通过 $data 对变量进行读取和更改', () => {
    const customName = window.customName;

    Lit.define( customName, {
      data(){
        return { a: 1 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit.a ).to.equals( 1 );
    expect( lit.$data.a ).to.equals( 1 );

    lit.$data.a = 123;

    expect( lit.a ).to.equals( 123 );
    expect( lit.$data.a ).to.equals( 123 );
  });

  it( '若删除 $lit 下的变量映射, 不会影响到 $data 内的变量本体', () => {
    const customName = window.customName;

    Lit.define( customName, {
      data(){
        return { a: 1 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit.a ).to.equals( 1 );
    expect( lit.$data.a ).to.equals( 1 );

    delete lit.a;

    expect( lit.a ).to.undefined;
    expect( lit.$data.a ).to.equals( 1 );
  });

});