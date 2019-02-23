describe( 'Hu.noConflict', () => {

  it( '使用 noConflict 方法可以释放 window.Hu 的控制权, 还原到定义 Hu 之前', () => {
    const Hu = window.Hu;

    Hu.noConflict();
    expect( window.Hu ).is.undefined;

    window.Hu = Hu;
  });

  it( 'noConflict 方法的返回值始终是 Hu 对象', () => {
    const Hu = window.Hu;

    const result = Hu.noConflict();
    expect( result ).is.equals( Hu );

    const result2 = Hu.noConflict();
    expect( result2 ).is.equals( Hu );

    window.Hu = Hu;
  });

});