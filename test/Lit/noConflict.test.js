describe( 'Lit.noConflict', () => {

  it( '使用 noConflict 方法可以释放 window.Lit 的控制权, 还原到定义 Lit 之前', () => {
    const Lit = window.Lit;

    Lit.noConflict();
    expect( window.Lit ).to.be.undefined;

    window.Lit = Lit;
  });

  it( 'noConflict 方法的返回值始终是 Lit 对象', () => {
    const Lit = window.Lit;

    const result = Lit.noConflict();
    expect( result ).to.equals( Lit );

    const result2 = Lit.noConflict();
    expect( result2 ).to.equals( Lit );

    window.Lit = Lit;
  });

});