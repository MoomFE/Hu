describe( 'Hu.instance', () => {

  /** @type {Element} */
  let div;
  beforeEach(() => {
    div = document.createElement('div').$appendTo( document.body );
  });
  afterEach(() => {
    div.$remove();
  });


  it( '实例上的 $el 属性是当前实例的根节点', () => {
    const hu = new Hu({
      el: div
    });

    expect( hu.$el ).is.equals( div );

    // ------
    const hu2 = new Hu();

    expect( hu2.$el ).is.undefined;

    hu2.$mount( div );
    expect( hu.$el ).is.equals( div );
  });

  it( '实例上的 $el 属性是当前实例的阴影根 ( ShadowRoot ) 节点 ( 自定义元素 )', () => {
    const customName = window.customName;

    Hu.define( customName );

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    window.xxx = hu.$el;

    if( customElements.polyfillWrapFlushCallback === undefined ){
      expect( hu.$el ).is.a('ShadowRoot');
    }
  });

});