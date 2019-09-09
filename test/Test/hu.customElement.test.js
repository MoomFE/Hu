describe( 'hu.customElement', () => {

  it( '自定义元素上的 $hu 属性为当前自定义元素的 Hu 实例', () => {
    const customName = window.customName;

    Hu.define( customName );

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu ).is.instanceOf( Hu );
    expect( hu.$customElement ).is.equals( custom );
  });

  it( '自定义元素上的 $on, $once, $off 方法为当前自定义元素的 Hu 实例上 $on, $once, $off 方法的映射', () => {
    const customName = window.customName;

    Hu.define( customName );

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( custom.$on ).is.equals( hu.$on );
    expect( custom.$off ).is.equals( hu.$off );
    expect( custom.$once ).is.equals( hu.$once );
  });

  it( '自定义元素上的 addEventListener, removeEventListener 方法为当前自定义元素的 Hu 实例上 $on, $off 方法的映射', () => {
    const customName = window.customName;

    Hu.define( customName );

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( custom.addEventListener ).is.equals( hu.$on );
    expect( custom.removeEventListener ).is.equals( hu.$off );
  });

});