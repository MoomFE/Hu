describe( 'options.computed', () => {

  it( '使用方法类型定义计算属性', () => {
    const hu = new Hu({
      computed: {
        a: () => 1
      }
    });

    expect( hu ).has.property( 'a' );
    expect( hu.$computed ).has.property( 'a' );

    expect( hu.a ).is.equals( 1 );
    expect( hu.$computed.a ).is.equals( 1 );
  });

  it( '使用方法类型定义计算属性 ( Vue )', () => {
    const vm = new Vue({
      computed: {
        a: () => 1
      }
    });

    expect( vm ).has.property( 'a' );
    // expect( vm.$computed ).has.property( 'a' );

    expect( vm.a ).is.equals( 1 );
    // expect( vm.$computed.a ).is.equals( 1 );
  });

  it( '使用对象类型定义计算属性的 getter 与 setter 方法', () => {
    const hu = new Hu({
      data: () => ({
        a: 1
      }),
      computed: {
        b: {
          set( value ){
            this.a = value;
          },
          get(){
            return this.a * 2;
          }
        }
      }
    });

    expect( hu ).has.property( 'b' );
    expect( hu.$computed ).has.property( 'b' );

    expect( hu.a ).is.equals( 1 );
    expect( hu.b ).is.equals( 2 );
    expect( hu.$computed.b ).is.equals( 2 );

    hu.a = 2;
    expect( hu.a ).is.equals( 2 );
    expect( hu.b ).is.equals( 4 );
    expect( hu.$computed.b ).is.equals( 4 );

    hu.a = 3;
    expect( hu.a ).is.equals( 3 );
    expect( hu.b ).is.equals( 6 );
    expect( hu.$computed.b ).is.equals( 6 );

    hu.b = 4;
    expect( hu.a ).is.equals( 4 );
    expect( hu.b ).is.equals( 8 );
    expect( hu.$computed.b ).is.equals( 8 );

    hu.b = 5;
    expect( hu.a ).is.equals( 5 );
    expect( hu.b ).is.equals( 10 );
    expect( hu.$computed.b ).is.equals( 10 );
  });

  it( '使用对象类型定义计算属性的 getter 与 setter 方法 ( Vue )', () => {
    const vm = new Vue({
      data: () => ({
        a: 1
      }),
      computed: {
        b: {
          set( value ){
            this.a = value;
          },
          get(){
            return this.a * 2;
          }
        }
      }
    });

    expect( vm ).has.property( 'b' );
    // expect( vm.$computed ).has.property( 'b' );

    expect( vm.a ).is.equals( 1 );
    expect( vm.b ).is.equals( 2 );
    // expect( vm.$computed.b ).is.equals( 2 );

    vm.a = 2;
    expect( vm.a ).is.equals( 2 );
    expect( vm.b ).is.equals( 4 );
    // expect( vm.$computed.b ).is.equals( 4 );

    vm.a = 3;
    expect( vm.a ).is.equals( 3 );
    expect( vm.b ).is.equals( 6 );
    // expect( vm.$computed.b ).is.equals( 6 );

    vm.b = 4;
    expect( vm.a ).is.equals( 4 );
    expect( vm.b ).is.equals( 8 );
    // expect( vm.$computed.b ).is.equals( 8 );

    vm.b = 5;
    expect( vm.a ).is.equals( 5 );
    expect( vm.b ).is.equals( 10 );
    // expect( vm.$computed.b ).is.equals( 10 );
  });

  it( '计算属性的首个参数会是当前实例对象', () => {
    const hu = new Hu({
      computed: {
        a: hu => hu
      }
    });

    expect( hu ).has.property( 'a' );
    expect( hu.$computed ).has.property( 'a' );

    expect( hu.a ).is.equals( hu );
    expect( hu.$computed.a ).is.equals( hu );
  });

  it( '计算属性的首个参数会是当前实例对象 ( Vue )', () => {
    const vm = new Vue({
      computed: {
        a: vm => vm
      }
    });

    expect( vm ).has.property( 'a' );
    // expect( vm.$computed ).has.property( 'a' );

    expect( vm.a ).is.equals( vm );
    // expect( vm.$computed.a ).is.equals( vm );
  });

  it('------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------');

  it( '实例化后所定义的计算属性会全部添加到 $computed 实例属性中', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      computed: {
        a: () => '1',
        [ b ]: () => '2',
        $c: () => '3'
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$computed ).has.property( 'a' );
    expect( hu.$computed ).has.property(  b  );
    expect( hu.$computed ).has.property(  '$c'  );

    expect( hu.$computed[ 'a' ] ).is.equals( '1' );
    expect( hu.$computed[  b  ] ).is.equals( '2' );
    expect( hu.$computed[ '$c' ] ).is.equals( '3' );
  });

  it( '实例化后会在实例本身添加 $computed 下所有首字母不为 $ 的计算属性的映射', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      computed: {
        a: () => '1',
        [ b ]: () => '2',
        $c: () => '3'
      }
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

  it( '实例化后若删除在实例本身添加的计算属性的映射, 不会影响到 $computed 实例属性内的计算属性本体', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      computed: {
        a: () => '1',
        [ b ]: () => '2'
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property(  b  );
    expect( hu.$computed ).has.property( 'a' );
    expect( hu.$computed ).has.property(  b  );

    expect( hu[ 'a' ] ).is.equals( '1' );
    expect( hu[  b  ] ).is.equals( '2' );
    expect( hu.$computed[ 'a' ] ).is.equals( '1' );
    expect( hu.$computed[  b  ] ).is.equals( '2' );

    delete hu[ 'a' ];
    delete hu[  b  ];

    expect( hu ).has.not.property( 'a' );
    expect( hu ).has.not.property(  b  );
    expect( hu.$computed ).has.property( 'a' );
    expect( hu.$computed ).has.property(  b  );

    expect( hu[ 'a' ] ).is.equals( undefined );
    expect( hu[  b  ] ).is.equals( undefined );
    expect( hu.$computed[ 'a' ] ).is.equals( '1' );
    expect( hu.$computed[  b  ] ).is.equals( '2' );
  });

  it( '实例化后不可以通过当前实例对象对计算属性进行读取和更改', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      computed: {
        a: () => '1',
        [ b ]: () => '2'
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property(  b  );

    expect( hu[ 'a' ] ).is.equals( '1' );
    expect( hu[  b  ] ).is.equals( '2' );

    hu[ 'a' ] = 3;
    expect( hu[ 'a' ] ).is.equals( '1' );
    expect( hu[  b  ] ).is.equals( '2' );

    hu[  b  ] = 4;
    expect( hu[ 'a' ] ).is.equals( '1' );
    expect( hu[  b  ] ).is.equals( '2' );
  });

  it( '实例化后不可以通过 $computed 实例属性对计算属性进行读取和更改', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define( customName, {
      computed: {
        a: () => '1',
        [ b ]: () => '2'
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$computed ).has.property( 'a' );
    expect( hu.$computed ).has.property(  b  );

    expect( hu.$computed[ 'a' ] ).is.equals( '1' );
    expect( hu.$computed[  b  ] ).is.equals( '2' );

    hu.$computed[ 'a' ] = 3;
    expect( hu.$computed[ 'a' ] ).is.equals( '1' );
    expect( hu.$computed[  b  ] ).is.equals( '2' );

    hu.$computed[  b  ] = 4;
    expect( hu.$computed[ 'a' ] ).is.equals( '1' );
    expect( hu.$computed[  b  ] ).is.equals( '2' );
  });

});