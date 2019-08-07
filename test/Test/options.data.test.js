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

  it('------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------');

  it( '实例化后所定义的 data 会全部添加到 $data 实例属性中', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      data: () => ({
        a: '1',
        [ b ]: '2',
        $c: '3'
      })
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$data ).has.property( 'a' );
    expect( hu.$data ).has.property(  b  );
    expect( hu.$data ).has.property(  '$c'  );

    expect( hu.$data[ 'a' ] ).is.equals( '1' );
    expect( hu.$data[  b  ] ).is.equals( '2' );
    expect( hu.$data[ '$c' ] ).is.equals( '3' );
  });

  it( '实例化后会在实例本身添加 $data 下所有首字母不为 $ 的属性的映射', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      data: () => ({
        a: '1',
        [ b ]: '2',
        $c: '3'
      })
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property(  b  );
    expect( hu ).has.not.property(  '$c'  );

    expect( hu[ 'a' ] ).is.equals( '1' );
    expect( hu[  b  ] ).is.equals( '2' );
  });

  it( '实例化后若删除在实例本身添加的 $data 的属性的映射, 不会影响到 $data 的属性本体', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      data: () => ({
        a: '1',
        [ b ]: '2'
      })
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property(  b  );
    expect( hu.$data ).has.property( 'a' );
    expect( hu.$data ).has.property(  b  );

    delete hu[ 'a' ];
    delete hu[  b  ];

    expect( hu[ 'a' ] ).is.equals( undefined );
    expect( hu[  b  ] ).is.equals( undefined );
    expect( hu.$data[ 'a' ] ).is.equals( '1' );
    expect( hu.$data[  b  ] ).is.equals( '2' );
  });

  it( '实例化后可以通过当前实例对象对 $data 的属性进行更改', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      data: () => ({
        a: '1',
        [ b ]: '2'
      })
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property(  b  );

    expect( hu[ 'a' ] ).is.equals( '1' );
    expect( hu[  b  ] ).is.equals( '2' );

    hu[ 'a' ] = 3;

    expect( hu[ 'a' ] ).is.equals( 3 );
    expect( hu[  b  ] ).is.equals( '2' );

    hu[ b ] = 4;

    expect( hu[ 'a' ] ).is.equals( 3 );
    expect( hu[  b  ] ).is.equals( 4 );
  });

  it( '实例化后可以通过 $data 实例属性对 data 的属性进行更改', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      data: () => ({
        a: '1',
        [ b ]: '2'
      })
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$data ).has.property( 'a' );
    expect( hu.$data ).has.property(  b  );

    expect( hu.$data[ 'a' ] ).is.equals( '1' );
    expect( hu.$data[  b  ] ).is.equals( '2' );

    hu.$data[ 'a' ] = 3;

    expect( hu.$data[ 'a' ] ).is.equals( 3 );
    expect( hu.$data[  b  ] ).is.equals( '2' );

    hu.$data[ b ] = 4;

    expect( hu.$data[ 'a' ] ).is.equals( 3 );
    expect( hu.$data[  b  ] ).is.equals( 4 );
  });

});