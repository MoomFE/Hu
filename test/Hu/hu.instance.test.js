describe( 'Hu.instance', () => {

  it( '使用 new 创建实例', () => {
    const div = document.createElement('div');
    const steps = [];

    new Hu({
      el: div,
      render( html ){
        steps.push('render');
        return html`<span>123</span>`;
      },
      beforeMount(){
        steps.push('beforeMount');
      },
      mounted(){
        steps.push('mounted');
      }
    });

    steps.push('created');

    expect( div.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.innerText ).is.equals( '123' );
    expect( steps ).is.deep.equals([ 'beforeMount', 'render', 'mounted', 'created' ]);
  });

  it( '使用 new 创建实例 - 使用 $mount 挂载实例', () => {
    const div = document.createElement('div');
    const steps = [];

    const hu = new Hu({
      render( html ){
        steps.push('render');
        return html`<span>123</span>`;
      },
      beforeMount(){
        steps.push('beforeMount');
      },
      mounted(){
        steps.push('mounted');
      }
    });

    steps.push('created');

    expect( hu.$mount( div ) ).is.equals( hu );
    expect( div.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.innerText ).is.equals( '123' );
    expect( steps ).is.deep.equals([ 'created', 'beforeMount', 'render', 'mounted' ]);
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

  it( '实例创建后所有前缀为 $ 的私有选项全部不能进行修改及删除 ( 二 )', () => {
    const hu = new Hu();

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

  it( '实例创建后所有前缀为 $ 的私有对象 ( 除了 $methods ) 都是观察者对象', () => {
    const customName = window.customName;

    Hu.define( customName );

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    for( const name of Reflect.ownKeys( hu ) ){
      if( name === '$methods' ) continue;

      const value = hu[ name ];

      if( Object.prototype.toString.call( value ) === '[object Object]' || Array.isArray( value ) ){
        expect( value ).is.equals( Hu.observable( value ) );
      }
    }
  });

  it( '实例上的 $options 选项, 包含了实例初始化选项, 且不可更改', () => {
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

  it( '实例上的 $options 选项, 包含了实例初始化选项, 且不可更改 ( 二 )', () => {
    const data = () => ({
      asd: 123456
    });

    const hu = new Hu({
      data,
      asd: 123
    });

    expect( hu.$data ).is.deep.equals({ asd: 123456 });
    expect( hu.$options ).is.deep.equals({ asd: 123, data });

    hu.$options.asd = 456;
    expect( hu.$options ).is.deep.equals({ asd: 123, data });
  });

  it( '实例上的 $info 选项, 包含了当前实例的各种信息, 且不可更改', () => {
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

  it( '实例上的 $info 选项, 包含了当前实例的各种信息, 且不可更改 ( 二 )', () => {
    const hu = new Hu();

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

  it( '实例上的 $info 选项的各个属性', () => {
    const customName = window.customName;

    Hu.define( customName );

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const { $info } = custom.$hu;

    expect( $info.name ).is.equals( customName );
    expect( $info.isMounted ).is.false;
    expect( $info.isCustomElement ).is.true;

    div.$appendTo( document.body );

    expect( $info.name ).is.equals( customName );
    expect( $info.isMounted ).is.true;
    expect( $info.isCustomElement ).is.true;

    div.$remove();
  });

  it( '实例上的 $info 选项的各个属性 ( 二 )', () => {
    const { $info: $info2 } = new Hu();

    expect( /anonymous-/.test( $info2.name ) ).is.true;
    expect( $info2.isMounted ).is.false;
    expect( $info2.isCustomElement ).is.false;
  });

  it( '自定义元素实例创建后在实例上会有 $customElement 属性, 是自定义元素本身', () => {
    const customName = window.customName;

    Hu.define( customName );

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$customElement ).is.equals( custom );
  });

  it( '实例上的 $el 属性存放的是当前实例的根节点', () => {
    const customName = window.customName;

    Hu.define( customName );

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$el ).is.a('ShadowRoot');
  });

  it( '实例上的 $el 属性存放的是当前实例的根节点 ( 二 )', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div
    });

    expect( hu.$el ).is.equals( div );
  });

  it( '实例上的 $el 属性存放的是当前实例的根节点 ( 三 )', () => {
    const div = document.createElement('div');
    const hu = new Hu();

    expect( hu.$el ).is.undefined;

    hu.$mount( div );

    expect( hu.$el ).is.equals( div );
  });

  it( '实例上的 $forceUpdate 方法可以强制使当前 Hu 实例重新渲染', () => {
    const customName = window.customName;
    let num = 0;

    Hu.define( customName, {
      render(){
        num++;
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body );
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( num ).is.equals( 1 );

    hu.$forceUpdate();
    expect( num ).is.equals( 2 );

    hu.$forceUpdate();
    hu.$forceUpdate();
    expect( num ).is.equals( 4 );

    div.$remove();
  });

  it( '实例上的 $forceUpdate 方法可以强制使当前 Hu 实例重新渲染 ( 二 )', () => {
    let num = 0;
    const hu = new Hu({
      el: document.createElement('div'),
      render(){
        num++;
      }
    });

    expect( num ).is.equals( 1 );

    hu.$forceUpdate();
    expect( num ).is.equals( 2 );

    hu.$forceUpdate();
    hu.$forceUpdate();
    expect( num ).is.equals( 4 );
  });

  it( '实例上的 $forceUpdate 方法可以强制使当前 Hu 实例重新渲染 ( 三 )', () => {
    let num = 0;
    const hu = new Hu({
      render(){
        num++;
      }
    });

    expect( num ).is.equals( 0 );

    hu.$forceUpdate();
    expect( num ).is.equals( 0 );

    hu.$forceUpdate();
    hu.$forceUpdate();
    expect( num ).is.equals( 0 );

    hu.$mount(
      document.createElement('div')
    );

    expect( num ).is.equals( 1 );

    hu.$forceUpdate();
    expect( num ).is.equals( 2 );

    hu.$forceUpdate();
    hu.$forceUpdate();
    expect( num ).is.equals( 4 );
  });

  it( '实例上的 $computed 属性会存放所有定义了的计算属性', () => {
    const $$a = Symbol('$$a');
    const hu = new Hu({
      computed: {
        a: () => 123,
        $a: () => 456,
        [ $$a ]: () => 789
      }
    });

    expect( hu.$computed ).is.deep.equals({
      a: 123,
      $a: 456,
      [ $$a ]: 789
    });
  });

  it( '实例上的 $computed 属性下首字母不为 $ 的计算属性会在实例上添加映射', () => {
    const $$a = Symbol('$$a');
    const hu = new Hu({
      computed: {
        a: () => 123,
        $a: () => 456,
        [ $$a ]: () => 789
      }
    });

    expect( hu ).is.deep.include({
      a: 123,
      [ $$a ]: 789
    });
  });

  it( '实例上的 $computed 属性是禁止修改已有属性和删除已有属性和添加新的属性的', () => {
    const hu = new Hu({
      computed: {
        a: () => 123
      }
    });

    expect( hu.a ).is.equals( 123 );
    expect( hu.$computed.a ).is.equals( 123 );

    // 禁止修改
    hu.$computed.a = 234;
    expect( hu.a ).is.equals( 123 );
    expect( hu.$computed.a ).is.equals( 123 );

    // 禁止删除
    delete hu.$computed.a;
    expect( hu.a ).is.equals( 123 );
    expect( hu.$computed.a ).is.equals( 123 );

    // 禁止添加
    hu.$computed.b = 123;
    expect( hu.b ).is.undefined;
    expect( hu.$computed.b ).is.undefined;
  });

  it( '实例上的 $computed 属性是禁止修改已有属性和删除已有属性和添加新的属性的 ( 二 )', () => {
    const hu = new Hu();

    // 未定义计算属性时
    // 计算属性容器为空
    expect( hu.$computed ).is.deep.equals({})

    // 禁止添加
    hu.$computed.b = 123;
    expect( hu.b ).is.undefined;
    expect( hu.$computed.b ).is.undefined;
  });

});