describe( 'Hu.instance', () => {

  it( '实例创建后在实例上会有 $options 选项, 包含了实例初始化选项, 且不可更改', () => {
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

    hu.$options.asd = 456;
    expect( hu.$options ).is.deep.equals({ asd: 123, data });
  });

  it( '实例创建后在实例上会有 $info 选项, 包含了当前实例的各种信息, 且不可更改', () => {
    const customName = window.customName;

    Hu.define( customName );

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$info.name ).is.equals( customName );

    for( const name of Reflect.ownKeys( hu.$info ) ){
      const value = hu.$info[ name ];
      const type = Object.prototype.toString.call( value );

      delete hu.$info[ name ];
      expect( hu.$info[ name ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu.$info[ name ] ) ).is.equals( type );

      hu.$info[ name ] = 123;
      expect( hu.$info[ name ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu.$info[ name ] ) ).is.equals( type );

      hu.$info[ name ] = '123';
      expect( hu.$info[ name ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu.$info[ name ] ) ).is.equals( type );
    }
  });

  it( '实例创建后所有前缀为 $ 的私有选项全部不能进行修改及删除', () => {
    const customName = window.customName;

    Hu.define( customName );

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    for( const name of Reflect.ownKeys( hu ) ){
      const value = hu[ name ];
      const type = Object.prototype.toString.call( value );

      delete hu[ name ];
      expect( hu[ name ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu[ name ] ) ).is.equals( type );

      hu[ name ] = 123;
      expect( hu[ name ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu[ name ] ) ).is.equals( type );

      hu[ name ] = '123';
      expect( hu[ name ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu[ name ] ) ).is.equals( type );
    }
  });

});