describe( 'Hu', () => {

  it( '实例创建后在实例上会有 $options 选项, 包含了实例初始化选项', () => {
    const customName = window.customName;
    const data = () => ({
      asd: 123456
    });

    Hu.define( customName, {
      data,
      asd: 123
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$data ).is.deep.equals({ asd: 123456 });
    expect( hu.$options ).is.deep.equals({ asd: 123, data });
  });

});