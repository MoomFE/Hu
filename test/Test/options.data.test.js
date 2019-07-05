describe( 'options.data', () => {

  it( '定义自定义元素实例时, data 选项必须是 function 类型', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data: () => ({
        a: 1
      })
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu.$data ).has.property( 'a' );

    expect( hu.a ).is.equals( 1 );
    expect( hu.$data.a ).is.equals( 1 );
  });

  it( '定义自定义元素实例时, data 选项若不是 function 类型将会被忽略', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data: {
        a: 1
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.not.property( 'a' );
    expect( hu.$data ).has.not.property( 'a' );
  });

  it( '使用 new 创建实例时, data 选项可以是 function 类型', () => {
    const hu = new Hu({
      data: () => ({
        a: 1
      })
    });

    expect( hu ).has.property( 'a' );
    expect( hu.$data ).has.property( 'a' );

    expect( hu.a ).is.equals( 1 );
    expect( hu.$data.a ).is.equals( 1 );
  });

  it( '使用 new 创建实例时, data 选项可以是 JSON', () => {
    const hu = new Hu({
      data: {
        a: 1
      }
    });

    expect( hu ).has.property( 'a' );
    expect( hu.$data ).has.property( 'a' );

    expect( hu.a ).is.equals( 1 );
    expect( hu.$data.a ).is.equals( 1 );
  });

  it( '定义 data 选项时若是 function 类型, 方法执行时的 this 指向是当前实例 ( 一 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data: function(){
        return {
          self: this
        };
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'self' );
    expect( hu.$data ).has.property( 'self' );

    expect( hu.self ).is.equals( hu );
    expect( hu.$data.self ).is.equals( hu );
  });

  it( '定义 data 选项时若是 function 类型, 方法执行时的 this 指向是当前实例 ( 二 )', () => {
    const hu = new Hu({
      data: function(){
        return {
          self: this
        };
      }
    });

    expect( hu ).has.property( 'self' );
    expect( hu.$data ).has.property( 'self' );

    expect( hu.self ).is.equals( hu );
    expect( hu.$data.self ).is.equals( hu );
  });

});