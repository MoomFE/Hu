describe( 'Hu.define - data', () => {

  it( '在 $hu 实例下会创建 $data 对象, 存放所有的属性', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data(){
        return {
          a: 1,
          b: 2
        };
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu )
      .has.property( '$data' )
      .that.is.deep.equals({ a: 1, b: 2 });
  });

  it( '定义 data 必须是 function 类型', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data(){
        return { a: 1 };
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$data ).is.deep.equals({ a: 1 });
  });

  it( '定义 data 如果不是 function 类型, 否则会被忽略定义', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data: { a: 1 }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$data ).is.empty;
  });

  it( '使用 new 创建的 Hu 实例, data 可以为 JSON', () => {
    const hu = new Hu({
      data: { a: 1 }
    });

    expect( hu.$data ).is.deep.equals({ a: 1 });
  });

  it( '首字母不为 $ 的属性可以在 $data 和 $hu 下找到', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data(){
        return { a: 1 };
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' ).that.is.equals( 1 );
    expect( hu.$data ).has.property( 'a' ).that.is.equals( 1 );
  });

  it( '首字母为 $ 的属性可以在 $data 下找到, 但是不能在 $hu 下找到', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data(){
        return {
          a: 1,
          $b: 2
        };
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' ).that.is.equals( 1 );
    expect( hu ).has.not.property( '$b' );

    expect( hu.$data ).has.property( 'a' ).that.is.equals( 1 );
    expect( hu.$data ).has.property( '$b' ).that.is.equals( 2 );
  });

  it( '若在 $hu 下有同名变量, 会把 $hu 下的同名变量替换为当前变量 ( 一 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null
      },
      data(){
        return { a: 1 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' ).that.is.equals( 1 );

    expect( hu.$props ).has.property( 'a' ).that.is.equals( '1' );
    expect( hu.$data ).has.property( 'a' ).that.is.equals( 1 );
  });

  it( '若在 $hu 下有同名变量, 会把 $hu 下的同名变量替换为当前变量 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      methods: {
        a(){ return '1' }
      },
      data(){
        return { a: 1 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' ).that.is.equals( 1 );
    expect( hu.$data ).has.property( 'a' ).that.is.equals( 1 );

    expect( hu.$methods ).has.property( 'a' ).that.is.a( 'function' );
    expect( hu.$methods.a() ).is.equals( '1' );
  });

  it( '若在 $hu 下有同名变量, 会把 $hu 下的同名变量替换为当前变量 ( 三 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
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
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' ).that.is.equals( 1 );
    expect( hu.$data ).has.property( 'a' ).that.is.equals( 1 );

    expect( hu.$methods ).has.property( 'a' ).that.is.a( 'function' );
    expect( hu.$methods.a() ).is.equals( '1' );

    expect( hu.$props ).has.property( 'a' ).that.is.equals( '1' );;
  });

  it( '执行 data 方法时, this 的指向是 $hu', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data(){
        return { a: this };
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.a ).is.equals( hu );
    expect( hu.$data.a ).is.equals( hu );
  });

  it( '可以通过 $hu 对变量进行读取和更改', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data(){
        return { a: 1 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.a ).is.equals( 1 );
    expect( hu.$data.a ).is.equals( 1 );

    hu.a = 123;

    expect( hu.a ).is.equals( 123 );
    expect( hu.$data.a ).is.equals( 123 );
  });

  it( '可以通过 $data 对变量进行读取和更改', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data(){
        return { a: 1 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.a ).is.equals( 1 );
    expect( hu.$data.a ).is.equals( 1 );

    hu.$data.a = 123;

    expect( hu.a ).is.equals( 123 );
    expect( hu.$data.a ).is.equals( 123 );
  });

  it( '若删除 $hu 下的变量映射, 不会影响到 $data 内的变量本体', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data(){
        return { a: 1 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.a ).is.equals( 1 );
    expect( hu.$data.a ).is.equals( 1 );

    delete hu.a;

    expect( hu.a ).is.undefined;
    expect( hu.$data.a ).is.equals( 1 );
  });

});