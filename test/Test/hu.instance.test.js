describe( 'Hu.instance', () => {

  /** @type {Element} */
  let div;
  beforeEach(() => {
    div = document.createElement('div').$appendTo( document.body );
  });
  afterEach(() => {
    div.$remove();
  });


  it( '实例上的 $el 属性是当前实例的根节点的引用', () => {
    const hu = new Hu({
      el: div,
      render( html ){
        return html`<div></div>`;
      }
    });

    expect( hu.$el ).is.equals( div );

    // ------
    const hu2 = new Hu();

    expect( hu2.$el ).is.undefined;

    hu2.$mount( div );
    expect( hu2.$el ).is.equals( div );
  });

  it( '自定义元素实例上的 $el 属性是当前实例的阴影根 ( ShadowRoot ) 节点的引用', () => {
    const customName = window.customName;

    Hu.define( customName );

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    window.xxx = hu.$el;

    if( customElements.polyfillWrapFlushCallback === undefined ){
      expect( hu.$el ).is.a('ShadowRoot');
    }
  });

  it( '自定义元素实例上的 $customElement 属性是当前实例的自定义元素节点的引用', () => {
    const customName = window.customName;

    Hu.define( customName );

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu.$customElement ).is.equals( custom );
  });

  it( '实例上的 $root 属性是当前实例的根实例', () => {
    const hu = new Hu();

    expect( hu.$root ).is.equals( hu );
  });

  it( '实例上的 $root 属性是当前实例的根实例 ( Vue )', () => {
    const vm = new Vue();

    expect( vm.$root ).is.equals( vm );
  });

  it( '自定义元素实例上的 $root 属性是当前实例的根实例', () => {
    const customName = window.customName;

    Hu.define( customName, {

    });

    const hu = new Hu({
      el: div,
      render( html ){
        return html([
          `<${ customName } ref="custom"></${ customName }>`
        ]);
      }
    });

    expect( hu.$root ).is.equals( hu );
    expect( hu.$refs.custom.$hu.$root ).is.equals( hu );
  });

  it( '自定义元素实例上的 $root 属性是当前实例的根实例 ( Vue )', () => {
    const customName = window.customName;

    Vue.component( customName, {
      template: `<div></div>`
    });

    const vm = new Vue({
      el: div,
      template: `
        <${ customName } ref="custom"></${ customName }>
      `
    });

    expect( vm.$root ).is.equals( vm );
    expect( vm.$refs.custom.$root ).is.equals( vm );
  });

  it( '自定义元素实例上的 $root 属性是当前实例的根实例 ( 二 )', () => {
    const customName = window.customName;
    const customName2 = window.customName;

    Hu.define( customName, {
      render( html ){
        return html([
          `<${ customName2 } ref="custom"></${ customName2 }>`
        ]);
      }
    });

    Hu.define( customName2, {

    });

    const hu = new Hu({
      el: div,
      render( html ){
        return html([
          `<${ customName } ref="custom"></${ customName }>`
        ]);
      }
    });

    expect( hu.$root ).is.equals( hu );
    expect( hu.$refs.custom.$hu.$root ).is.equals( hu );
    expect( hu.$refs.custom.$hu.$refs.custom.$hu.$root ).is.equals( hu );
  });

  it( '自定义元素实例上的 $root 属性是当前实例的根实例 ( 二 ) ( Vue )', () => {
    const customName = window.customName;
    const customName2 = window.customName;

    Vue.component( customName, {
      template: `<${ customName2 } ref="custom"></${ customName2 }>`
    });

    Vue.component( customName2, {
      template: `<div></div>`
    });

    const vm = new Vue({
      el: div,
      template: `
        <${ customName } ref="custom"></${ customName }>
      `
    });

    expect( vm.$root ).is.equals( vm );
    expect( vm.$refs.custom.$root ).is.equals( vm );
    expect( vm.$refs.custom.$refs.custom.$root ).is.equals( vm );
  });

  it( '自定义元素实例上的 $root 属性是当前实例的根实例 ( 三 )', () => {
    const customName = window.customName;
    const customName1 = window.customName;
    const customName1_1 = window.customName;
    const customName1_2 = window.customName;
    const customName2 = window.customName;
    const customName2_1 = window.customName;
    const customName2_2 = window.customName;

    Hu.define( customName, {
      render( html ){
        return html([`
          <${ customName1 } ref="1"></${ customName1 }>
          <${ customName2 } ref="2"></${ customName2 }>
        `]);
      }
    });

    Hu.define( customName1, {
      render( html ){
        return html([`
          <${ customName1_1 } ref="1_1"></${ customName1_1 }>
          <${ customName1_2 } ref="1_2"></${ customName1_2 }>
        `]);
      }
    });
    Hu.define( customName1_1 );
    Hu.define( customName1_2 );

    Hu.define( customName2, {
      render( html ){
        return html([`
          <${ customName2_1 } ref="2_1"></${ customName2_1 }>
          <${ customName2_2 } ref="2_2"></${ customName2_2 }>
        `]);
      }
    });
    Hu.define( customName2_1 );
    Hu.define( customName2_2 );

    const custom = document.createElement( customName ).$appendTo( div );
    const hu = custom.$hu;

    expect( hu.$root ).is.equals( hu );
    expect( hu.$refs['1'].$hu.$root ).is.equals( hu );
    expect( hu.$refs['1'].$hu.$refs['1_1'].$hu.$root ).is.equals( hu );
    expect( hu.$refs['1'].$hu.$refs['1_2'].$hu.$root ).is.equals( hu );
    expect( hu.$refs['2'].$hu.$root ).is.equals( hu );
    expect( hu.$refs['2'].$hu.$refs['2_1'].$hu.$root ).is.equals( hu );
    expect( hu.$refs['2'].$hu.$refs['2_2'].$hu.$root ).is.equals( hu );
  });

  it( '自定义元素实例上的 $root 属性是当前实例的根实例 ( 三 ) ( Vue ) ( 无法重现 )', () => {

  });

  it( '实例上的 $parent 属性是当前实例的父实例, 没有父实例则为 undefined', () => {
    const hu = new Hu();

    expect( hu.$parent ).is.undefined;
  });

  it( '实例上的 $parent 属性是当前实例的父实例, 没有父实例则为 undefined ( Vue )', () => {
    const vm = new Vue();

    expect( vm.$parent ).is.undefined;
  });

  it( '自定义元素实例上的 $parent 属性是当前实例的父实例', () => {
    const customName = window.customName;

    Hu.define( customName, {

    });

    const hu = new Hu({
      el: div,
      render( html ){
        return html([
          `<${ customName } ref="custom"></${ customName }>`
        ]);
      }
    });

    expect( hu.$parent ).is.undefined;
    expect( hu.$refs.custom.$hu.$parent ).is.equals( hu );
  });

  it( '自定义元素实例上的 $parent 属性是当前实例的父实例 ( Vue )', () => {
    const customName = window.customName;

    Vue.component( customName, {
      template: `<div></div>`
    });

    const vm = new Vue({
      el: div,
      template: `
        <${ customName } ref="custom"></${ customName }>
      `
    });

    expect( vm.$parent ).is.undefined;
    expect( vm.$refs.custom.$parent ).is.equals( vm );
  });

  it( '自定义元素实例上的 $parent 属性是当前实例的父实例 ( 二 )', () => {
    const customName = window.customName;
    const customName2 = window.customName;

    Hu.define( customName, {
      render( html ){
        return html([
          `<${ customName2 } ref="custom"></${ customName2 }>`
        ]);
      }
    });

    Hu.define( customName2, {

    });

    const hu = new Hu({
      el: div,
      render( html ){
        return html([
          `<${ customName } ref="custom"></${ customName }>`
        ]);
      }
    });

    expect( hu.$parent ).is.undefined;
    expect( hu.$refs.custom.$hu.$parent ).is.equals( hu );
    expect( hu.$refs.custom.$hu.$refs.custom.$hu.$parent ).is.equals( hu.$refs.custom.$hu );
  });

  it( '自定义元素实例上的 $parent 属性是当前实例的父实例 ( 二 ) ( Vue )', () => {
    const customName = window.customName;
    const customName2 = window.customName;

    Vue.component( customName, {
      template: `<${ customName2 } ref="custom"></${ customName2 }>`
    });

    Vue.component( customName2, {
      template: `<div></div>`
    });

    const vm = new Vue({
      el: div,
      template: `
        <${ customName } ref="custom"></${ customName }>
      `
    });

    expect( vm.$parent ).is.undefined;
    expect( vm.$refs.custom.$parent ).is.equals( vm );
    expect( vm.$refs.custom.$refs.custom.$parent ).is.equals( vm.$refs.custom );
  });

  it( '自定义元素实例上的 $parent 属性是当前实例的父实例 ( 三 )', () => {
    const customName = window.customName;
    const customName1 = window.customName;
    const customName1_1 = window.customName;
    const customName1_2 = window.customName;
    const customName2 = window.customName;
    const customName2_1 = window.customName;
    const customName2_2 = window.customName;

    Hu.define( customName, {
      render( html ){
        return html([`
          <${ customName1 } ref="1"></${ customName1 }>
          <${ customName2 } ref="2"></${ customName2 }>
        `]);
      }
    });

    Hu.define( customName1, {
      render( html ){
        return html([`
          <${ customName1_1 } ref="1_1"></${ customName1_1 }>
          <${ customName1_2 } ref="1_2"></${ customName1_2 }>
        `]);
      }
    });
    Hu.define( customName1_1 );
    Hu.define( customName1_2 );

    Hu.define( customName2, {
      render( html ){
        return html([`
          <${ customName2_1 } ref="2_1"></${ customName2_1 }>
          <${ customName2_2 } ref="2_2"></${ customName2_2 }>
        `]);
      }
    });
    Hu.define( customName2_1 );
    Hu.define( customName2_2 );

    const custom = document.createElement( customName ).$appendTo( div );
    const hu = custom.$hu;

    expect( hu.$parent ).is.undefined;
    expect( hu.$refs['1'].$hu.$parent ).is.equals( hu );
    expect( hu.$refs['1'].$hu.$refs['1_1'].$hu.$parent ).is.equals( hu.$refs['1'].$hu );
    expect( hu.$refs['1'].$hu.$refs['1_2'].$hu.$parent ).is.equals( hu.$refs['1'].$hu );
    expect( hu.$refs['2'].$hu.$parent ).is.equals( hu );
    expect( hu.$refs['2'].$hu.$refs['2_1'].$hu.$parent ).is.equals( hu.$refs['2'].$hu );
    expect( hu.$refs['2'].$hu.$refs['2_2'].$hu.$parent ).is.equals( hu.$refs['2'].$hu );
  });

  it( '自定义元素实例上的 $parent 属性是当前实例的父实例 ( 三 ) ( Vue ) ( 无法重现 )', () => {

  });

  it( '实例上的 $children 属性是当前实例的根实例', () => {
    const hu = new Hu();

    expect( hu.$children ).is.have.members([]);
  });

  it( '实例上的 $children 属性是当前实例的根实例 ( Vue )', () => {
    const vm = new Vue();

    expect( vm.$children ).is.have.members([]);
  });

  it( '自定义元素实例上的 $children 属性是当前实例的根实例', () => {
    const customName = window.customName;

    Hu.define( customName, {

    });

    const hu = new Hu({
      el: div,
      render( html ){
        return html([
          `<${ customName } ref="custom"></${ customName }>`
        ]);
      }
    });

    expect( hu.$children ).is.have.members([
      hu.$refs.custom.$hu
    ]);
    expect( hu.$refs.custom.$hu.$children ).is.have.members([]);
  });

  it( '自定义元素实例上的 $children 属性是当前实例的根实例 ( Vue )', () => {
    const customName = window.customName;

    Vue.component( customName, {
      template: `<div></div>`
    });

    const vm = new Vue({
      el: div,
      template: `
        <${ customName } ref="custom"></${ customName }>
      `
    });

    expect( vm.$children ).is.have.members([
      vm.$refs.custom
    ]);
    expect( vm.$refs.custom.$children ).is.have.members([]);
  });

  it( '自定义元素实例上的 $children 属性是当前实例的根实例 ( 二 )', () => {
    const customName = window.customName;
    const customName2 = window.customName;

    Hu.define( customName, {
      render( html ){
        return html([
          `<${ customName2 } ref="custom"></${ customName2 }>`
        ]);
      }
    });

    Hu.define( customName2, {

    });

    const hu = new Hu({
      el: div,
      render( html ){
        return html([
          `<${ customName } ref="custom"></${ customName }>`
        ]);
      }
    });

    expect( hu.$children ).is.have.members([
      hu.$refs.custom.$hu
    ]);
    expect( hu.$refs.custom.$hu.$children ).is.have.members([
      hu.$refs.custom.$hu.$refs.custom.$hu
    ]);
    expect( hu.$refs.custom.$hu.$refs.custom.$hu.$children ).is.have.members([]);
  });

  it( '自定义元素实例上的 $children 属性是当前实例的根实例 ( 二 ) ( Vue )', () => {
    const customName = window.customName;
    const customName2 = window.customName;

    Vue.component( customName, {
      template: `<${ customName2 } ref="custom"></${ customName2 }>`
    });

    Vue.component( customName2, {
      template: `<div></div>`
    });

    const vm = new Vue({
      el: div,
      template: `
        <${ customName } ref="custom"></${ customName }>
      `
    });

    expect( vm.$children ).is.have.members([
      vm.$refs.custom
    ]);
    expect( vm.$refs.custom.$children ).is.have.members([
      vm.$refs.custom.$refs.custom
    ]);
    expect( vm.$refs.custom.$refs.custom.$children ).is.have.members([]);
  });

  it( '自定义元素实例上的 $children 属性是当前实例的根实例 ( 三 )', () => {
    const customName = window.customName;
    const customName1 = window.customName;
    const customName1_1 = window.customName;
    const customName1_2 = window.customName;
    const customName2 = window.customName;
    const customName2_1 = window.customName;
    const customName2_2 = window.customName;

    Hu.define( customName, {
      render( html ){
        return html([`
          <${ customName1 } ref="1"></${ customName1 }>
          <${ customName2 } ref="2"></${ customName2 }>
        `]);
      }
    });

    Hu.define( customName1, {
      render( html ){
        return html([`
          <${ customName1_1 } ref="1_1"></${ customName1_1 }>
          <${ customName1_2 } ref="1_2"></${ customName1_2 }>
        `]);
      }
    });
    Hu.define( customName1_1 );
    Hu.define( customName1_2 );

    Hu.define( customName2, {
      render( html ){
        return html([`
          <${ customName2_1 } ref="2_1"></${ customName2_1 }>
          <${ customName2_2 } ref="2_2"></${ customName2_2 }>
        `]);
      }
    });
    Hu.define( customName2_1 );
    Hu.define( customName2_2 );

    const custom = document.createElement( customName ).$appendTo( div );
    const hu = custom.$hu;

    expect( hu.$children ).is.have.members([
      hu.$refs['1'].$hu,
      hu.$refs['2'].$hu
    ]);
    expect( hu.$refs['1'].$hu.$children ).is.have.members([
      hu.$refs['1'].$hu.$refs['1_1'].$hu,
      hu.$refs['1'].$hu.$refs['1_2'].$hu
    ]);
    expect( hu.$refs['1'].$hu.$refs['1_1'].$hu.$children ).is.have.members([]);
    expect( hu.$refs['1'].$hu.$refs['1_2'].$hu.$children ).is.have.members([]);
    expect( hu.$refs['2'].$hu.$children ).is.have.members([
      hu.$refs['2'].$hu.$refs['2_1'].$hu,
      hu.$refs['2'].$hu.$refs['2_2'].$hu
    ]);
    expect( hu.$refs['2'].$hu.$refs['2_1'].$hu.$children ).is.have.members([]);
    expect( hu.$refs['2'].$hu.$refs['2_2'].$hu.$children ).is.have.members([]);
  });

  it( '自定义元素实例上的 $root 属性是当前实例的根实例 ( 三 ) ( Vue ) ( 无法重现 )', () => {

  });

  it( '自定义元素实例上的 $props 属性是当前实例的 props 对象的代理', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null,
        b: null
      }
    });

    const custom = document.createElement( customName ).$appendTo( div );
    const hu = custom.$hu;

    expect( hu.$props ).is.deep.equals({
      a: undefined,
      b: undefined
    });
  });

  it( '实例上的 $data 属性是当前实例的 data 对象的代理', () => {
    const hu = new Hu({
      data: {
        a: 1,
        b: 2
      }
    });

    expect( hu.$data ).is.deep.equals({
      a: 1,
      b: 2
    });
  });

  it( '实例上的 $data 属性是当前实例的 data 对象的代理 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data: () => ({
        a: 1,
        b: 2
      })
    });

    const custom = document.createElement( customName ).$appendTo( div );
    const hu = custom.$hu;

    expect( hu.$data ).is.deep.equals({
      a: 1,
      b: 2
    });
  });

  it( '实例上的 $methods 属性是当前实例的 methods 对象的代理', () => {
    const hu = new Hu({
      methods: {
        a: () => 1,
        b: () => 2
      }
    });

    expect( hu.$methods ).is.have.all.keys([
      'a', 'b'
    ]);

    expect( hu.$methods.a() ).is.equals( 1 );
    expect( hu.$methods.b() ).is.equals( 2 );
  });

  it( '实例上的 $methods 属性是当前实例的 methods 对象的代理 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      methods: {
        a: () => 1,
        b: () => 2
      }
    });

    const custom = document.createElement( customName ).$appendTo( div );
    const hu = custom.$hu;

    expect( hu.$methods ).is.have.all.keys([
      'a', 'b'
    ]);

    expect( hu.$methods.a() ).is.equals( 1 );
    expect( hu.$methods.b() ).is.equals( 2 );
  });

  it( '实例上的 $globalMethods 属性是当前实例的 globalMethods 对象的代理', () => {
    const hu = new Hu({
      globalMethods: {
        a: () => 1,
        b: () => 2
      }
    });

    expect( hu.$globalMethods ).is.have.all.keys([
      'a', 'b'
    ]);

    expect( hu.$globalMethods.a() ).is.equals( 1 );
    expect( hu.$globalMethods.b() ).is.equals( 2 );
  });

  it( '实例上的 $globalMethods 属性是当前实例的 globalMethods 对象的代理 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      globalMethods: {
        a: () => 1,
        b: () => 2
      }
    });

    const custom = document.createElement( customName ).$appendTo( div );
    const hu = custom.$hu;

    expect( hu.$globalMethods ).is.have.all.keys([
      'a', 'b'
    ]);

    expect( hu.$globalMethods.a() ).is.equals( 1 );
    expect( hu.$globalMethods.b() ).is.equals( 2 );
  });

  it( '实例上的 $computed 属性是当前实例的 computed 对象的代理', () => {
    const hu = new Hu({
      computed: {
        a: () => 1,
        b: () => 2
      }
    });

    expect( hu.$computed ).is.deep.equals({
      a: 1,
      b: 2
    });
  });

  it( '实例上的 $computed 属性是当前实例的 computed 对象的代理 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      computed: {
        a: () => 1,
        b: () => 2
      }
    });

    const custom = document.createElement( customName ).$appendTo( div );
    const hu = custom.$hu;

    expect( hu.$computed ).is.deep.equals({
      a: 1,
      b: 2
    });
  });

  it( '实例上的 $options 属性是当前实例的初始化选项, 且不可更改', () => {
    const data = () => ({
      d: 1,
      e: 2
    });
    const method1 = () => 1;
    const method2 = () => 2;
    const method3 = () => 3;
    const method4 = () => 4;
    const computed1 = () => 5;
    const computed2 = () => 6;

    const hu = new Hu({
      props: {
        a: null,
        b: String,
        c: {
          from: 'cc',
          type: Number,
          default: 0
        }
      },
      data,
      methods: {
        f: method1,
        g: method2
      },
      globalMethods: {
        h: method3,
        i: method4
      },
      computed: {
        j: computed1,
        k: computed2
      }
    });

    expect( hu.$options ).is.deep.equals({
      props: {
        a: null,
        b: String,
        c: {
          from: 'cc',
          type: Number,
          default: 0
        }
      },
      data,
      methods: {
        f: method1,
        g: method2
      },
      globalMethods: {
        h: method3,
        i: method4
      },
      computed: {
        j: computed1,
        k: computed2
      }
    });

    let run = false;

    Hu.util.each( hu.$options, ( key, value ) => {
      run = true;

      hu.$options[ key ] = 123;

      expect( hu.$options[ key ] ).is.equals( value );

      delete hu.$options[ key ];

      expect( hu.$options[ key ] ).is.equals( value );
    });

    expect( run ).is.true;
  });

  it( '实例上的 $options 属性是当前实例的初始化选项, 且不可更改 ( 二 )', () => {
    const customName = window.customName;
    const data = () => ({
      d: 1,
      e: 2
    });
    const method1 = () => 1;
    const method2 = () => 2;
    const method3 = () => 3;
    const method4 = () => 4;
    const computed1 = () => 5;
    const computed2 = () => 6;

    Hu.define( customName, {
      props: {
        a: null,
        b: String,
        c: {
          from: 'cc',
          type: Number,
          default: 0
        }
      },
      data,
      methods: {
        f: method1,
        g: method2
      },
      globalMethods: {
        h: method3,
        i: method4
      },
      computed: {
        j: computed1,
        k: computed2
      }
    });

    const custom = document.createElement( customName ).$appendTo( div );
    const hu = custom.$hu;

    expect( hu.$options ).is.deep.equals({
      props: {
        a: null,
        b: String,
        c: {
          from: 'cc',
          type: Number,
          default: 0
        }
      },
      data,
      methods: {
        f: method1,
        g: method2
      },
      globalMethods: {
        h: method3,
        i: method4
      },
      computed: {
        j: computed1,
        k: computed2
      }
    });

    let run = false;

    Hu.util.each( hu.$options, ( key, value ) => {
      run = true;

      hu.$options[ key ] = 123;

      expect( hu.$options[ key ] ).is.equals( value );

      delete hu.$options[ key ];

      expect( hu.$options[ key ] ).is.equals( value );
    });

    expect( run ).is.true;
  });

  it( '实例上的 $info 属性包含了当前实例的各种信息, 且不可更改', () => {
    const hu = new Hu({
      render( html ){
        return html`<div></div>`;
      }
    });
    const info = hu.$info;

    // 类型限定
    expect( info.uid ).is.a('string');
    expect( info.name ).is.a('string');
    expect( info.isMounted ).is.a('boolean');
    expect( info.isCustomElement ).is.a('boolean');
    expect( info.isConnected ).is.a('boolean');

    // 值比对
    expect( info.uid ).is.equals( info.name );
    expect( info.isMounted ).is.equals( false );
    expect( info.isCustomElement ).is.equals( false );
    expect( info.isConnected ).is.equals( false );

    hu.$mount( div );

    // 值比对
    expect( info.uid ).is.equals( info.name );
    expect( info.isMounted ).is.equals( true );
    expect( info.isCustomElement ).is.equals( false );
    expect( info.isConnected ).is.equals( true );

    // 不可修改及删除
    let run;

    Hu.util.each( info, ( key, value ) => {
      run = true;

      info[ key ] = 123;

      expect( info[ key ] ).is.equals( value );

      delete info[ key ];

      expect( info[ key ] ).is.equals( value );
    });

    expect( run ).is.true;
  });

  it( '实例上的 $info 属性包含了当前实例的各种信息, 且不可更改 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      render( html ){
        return html`<div></div>`;
      }
    });

    const custom = document.createElement( customName );
    const hu = custom.$hu;
    const info = hu.$info;

    // 类型限定
    expect( info.uid ).is.a('string');
    expect( info.name ).is.a('string');
    expect( info.isMounted ).is.a('boolean');
    expect( info.isCustomElement ).is.a('boolean');
    expect( info.isConnected ).is.a('boolean');

    // 值比对
    expect( info.uid ).is.not.equals( info.name );
    expect( info.name ).is.equals( customName );
    expect( info.isMounted ).is.equals( false );
    expect( info.isCustomElement ).is.equals( true );
    expect( info.isConnected ).is.equals( false );

    custom.$appendTo( div );

    // 值比对
    expect( info.uid ).is.not.equals( info.name );
    expect( info.name ).is.equals( customName );
    expect( info.isMounted ).is.equals( true );
    expect( info.isCustomElement ).is.equals( true );
    expect( info.isConnected ).is.equals( true );

    // 不可修改及删除
    let run;

    Hu.util.each( info, ( key, value ) => {
      run = true;

      info[ key ] = 123;

      expect( info[ key ] ).is.equals( value );

      delete info[ key ];

      expect( info[ key ] ).is.equals( value );
    });

    expect( run ).is.true;
  });

});