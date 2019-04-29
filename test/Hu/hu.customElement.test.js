describe( 'hu.customElement', () => {

  it( '自定义元素上的 $hu 属性为当前自定义元素的 Hu 实例', () => {
    const customName = window.customName;

    Hu.define( customName );

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu ).is.instanceOf( Hu );
    expect( hu.$customElement ).is.equals( custom );
  });

  it( '自定义元素上的 $on 方法可以绑定当前实例的事件监听器, 而不是绑定原生事件', () => {
    const customName = window.customName;

    Hu.define( customName );

    const custom = document.createElement( customName );
    const hu = custom.$hu;
    let result;
    let arg;

    custom.$on( 'click', ( _arg ) => {
      result = 123;
      arg = _arg;
    });

    custom.click();
    expect( result ).is.undefined;
    expect( arg ).is.undefined;

    hu.$emit('click');
    expect( result ).is.equals( 123 );
    expect( arg ).is.undefined;

    hu.$emit( 'click', '123' );
    expect( result ).is.equals( 123 );
    expect( arg ).is.equals( '123' );
  });

  it( '自定义元素上的 $once 方法可以绑定只执行一次的当前实例的事件监听器', () => {
    const customName = window.customName;

    Hu.define( customName );

    const custom = document.createElement( customName );
    const hu = custom.$hu;
    let result;
    let arg;

    custom.$once( 'click', ( _arg ) => {
      result = 123;
      arg = _arg;
    });

    custom.click();
    expect( result ).is.undefined;
    expect( arg ).is.undefined;

    hu.$emit( 'click' );
    expect( result ).is.equals( 123 );
    expect( arg ).is.undefined;

    hu.$emit( 'click', '123' );
    expect( result ).is.equals( 123 );
    expect( arg ).is.undefined;

    custom.$once( 'click', ( _arg ) => {
      result = 123;
      arg = _arg;
    });

    hu.$emit( 'click', '1234' );
    expect( result ).is.equals( 123 );
    expect( arg ).is.equals( '1234' );
  });

  it( '自定义元素上的 $off 方法可以解除绑定在当前实例的事件监听器', () => {
    const customName = window.customName;

    Hu.define( customName );

    const custom = document.createElement( customName );
    const hu = custom.$hu;
    let result;
    let arg;

    custom.$on( 'click', ( _arg ) => {
      result = 123;
      arg = _arg;
    });

    custom.click();
    expect( result ).is.undefined;
    expect( arg ).is.undefined;

    hu.$emit('click');
    expect( result ).is.equals( 123 );
    expect( arg ).is.undefined;

    custom.$off('click');

    hu.$emit( 'click', '123' );
    expect( result ).is.equals( 123 );
    expect( arg ).is.undefined;
  });

});