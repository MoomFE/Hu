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

    vm.$destroy();
    vm.$el.$remove();
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

    vm.$destroy();
    vm.$el.$remove();
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

    vm.$destroy();
    vm.$el.$remove();
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

    vm.$destroy();
    vm.$el.$remove();
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

    vm.$destroy();
    vm.$el.$remove();
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

    vm.$destroy();
    vm.$el.$remove();
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

  it( '实例上的 $data 属性下首字母不为 $ 的属性会在实例本身添加映射', () => {
    const c = Symbol('a');
    const hu = new Hu({
      data: {
        a: 1,
        b: 2,
        [ c ]: 3,
        $d: 4,
        _e: 5
      }
    });

    expect( hu.$data ).is.deep.equals({
      a: 1,
      b: 2,
      [ c ]: 3,
      $d: 4,
      _e: 5
    });

    expect( hu ).is.include({
      a: 1,
      b: 2,
      [ c ]: 3,
      _e: 5
    });

    expect( hu ).is.not.include({
      $d: 4,
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

  it( '实例上的 $methods 属性下首字母首字母不为 $ 的方法会在实例本身添加映射', () => {
    const c = Symbol('a');
    const hu = new Hu({
      methods: {
        a: () => 1,
        b: () => 2,
        [ c ]: () => 3,
        $d: () => 4,
        _e: () => 5
      }
    });

    expect( hu.$methods ).have.property( 'a' );
    expect( hu.$methods ).have.property( 'b' );
    expect( hu.$methods ).have.property( c );
    expect( hu.$methods ).have.property( '$d' );
    expect( hu.$methods ).have.property( '_e' );
    expect( hu.$methods.a() ).is.equals( 1 );
    expect( hu.$methods.b() ).is.equals( 2 );
    expect( hu.$methods[ c ]() ).is.equals( 3 );
    expect( hu.$methods.$d() ).is.equals( 4 );
    expect( hu.$methods._e() ).is.equals( 5 );

    expect( hu ).have.property( 'a' );
    expect( hu ).have.property( 'b' );
    expect( hu ).have.property( c );
    expect( hu ).not.have.property( '$d' );
    expect( hu ).have.property( '_e' );
    expect( hu.a() ).is.equals( 1 );
    expect( hu.b() ).is.equals( 2 );
    expect( hu[ c ]() ).is.equals( 3 );
    expect( hu._e() ).is.equals( 5 );
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

  it( '实例上的 $globalMethods 属性下首字母首字母不为 $ 的方法会在实例本身添加映射', () => {
    const c = Symbol('a');
    const hu = new Hu({
      globalMethods: {
        a: () => 1,
        b: () => 2,
        [ c ]: () => 3,
        $d: () => 4,
        _e: () => 5
      }
    });

    expect( hu.$globalMethods ).have.property( 'a' );
    expect( hu.$globalMethods ).have.property( 'b' );
    expect( hu.$globalMethods ).have.property( c );
    expect( hu.$globalMethods ).have.property( '$d' );
    expect( hu.$globalMethods ).have.property( '_e' );
    expect( hu.$globalMethods.a() ).is.equals( 1 );
    expect( hu.$globalMethods.b() ).is.equals( 2 );
    expect( hu.$globalMethods[ c ]() ).is.equals( 3 );
    expect( hu.$globalMethods.$d() ).is.equals( 4 );
    expect( hu.$globalMethods._e() ).is.equals( 5 );

    expect( hu ).have.property( 'a' );
    expect( hu ).have.property( 'b' );
    expect( hu ).have.property( c );
    expect( hu ).not.have.property( '$d' );
    expect( hu ).have.property( '_e' );
    expect( hu.a() ).is.equals( 1 );
    expect( hu.b() ).is.equals( 2 );
    expect( hu[ c ]() ).is.equals( 3 );
    expect( hu._e() ).is.equals( 5 );
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

  it( '实例上的 $computed 属性是禁止增删改的', () => {
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

  it( '实例上的 $computed 属性下首字母首字母不为 $ 的计算属性会在实例本身添加映射', () => {
    const c = Symbol('c');
    const hu = new Hu({
      computed: {
        a: () => 1,
        b: () => 2,
        [ c ]: () => 3,
        $d: () => 4,
        _e: () => 5
      }
    });

    expect( hu.$computed ).is.deep.equals({
      a: 1,
      b: 2,
      [ c ]: 3,
      $d: 4,
      _e: 5
    });

    expect( hu ).is.includes({
      a: 1,
      b: 2,
      [ c ]: 3,
      _e: 5
    });

    expect( hu ).is.not.includes({
      $d: 4
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

  it( '实例上的 $refs 属性是一个包含了当前实例持有注册过 ref 引用特性的所有 DOM 元素的对象', () => {
    const hu = new Hu({
      render( html ){
        return html`
          <div ref="1">123</div>
          <div ref="2">456</div>
          <div ref="3">789</div>
        `;
      }
    });

    expect( hu.$refs ).is.undefined;

    hu.$mount( div );

    expect( hu.$refs ).is.deep.equals({
      1: div.querySelector(':nth-child(1)'),
      2: div.querySelector(':nth-child(2)'),
      3: div.querySelector(':nth-child(3)')
    });
  });

  it( '实例上的 $refs 属性是一个包含了当前实例持有注册过 ref 引用特性的所有 DOM 元素的对象 ( Vue ) ( 不一致 )', () => {
    const vm = new Vue({
      template: `
        <div>
          <div ref="1">123</div>
          <div ref="2">456</div>
          <div ref="3">789</div>
        </div>
      `
    });

    expect( vm.$refs ).is.deep.equals({});

    vm.$mount( div );

    expect( vm.$refs ).is.deep.equals({
      1: vm.$el.querySelector(':nth-child(1)'),
      2: vm.$el.querySelector(':nth-child(2)'),
      3: vm.$el.querySelector(':nth-child(3)')
    });

    vm.$destroy();
    vm.$el.$remove();
  });

  it( '实例上的 $refs 属性在有多个 ref 匹配的情况下会自动拓展为数组', () => {
    const hu = new Hu({
      el: div,
      render( html ){
        return html`
          <div ref="1">123</div>
          <div ref="1">456</div>
          <div ref="2">789</div>
        `;
      }
    });

    expect( hu.$refs ).is.deep.equals({
      1: [
        div.querySelector(':nth-child(1)'),
        div.querySelector(':nth-child(2)')
      ],
      2: div.querySelector(':nth-child(3)')
    });
  });

  it( '实例上的 $refs 属性在有多个 ref 匹配的情况下会自动拓展为数组 ( Vue ) ( 不一致 )', () => {
    const vm = new Vue({
      el: div,
      data: {
        arr: [ 1, 2, 3 ]
      },
      template: `
        <div>
          <div ref="1">123</div>
          <div ref="1">456</div>
          <div ref="2">789</div>
          <div v-for="item in arr" ref="3">
            {{ item }}
          </div>
        </div>
      `
    });

    expect( vm.$refs ).is.deep.equals({
      1: vm.$el.querySelector(':nth-child(2)'),
      2: vm.$el.querySelector(':nth-child(3)'),
      3: [
        vm.$el.querySelector(':nth-child(4)'),
        vm.$el.querySelector(':nth-child(5)'),
        vm.$el.querySelector(':nth-child(6)')
      ]
    });

    vm.$destroy();
    vm.$el.$remove();
  });

  it( '使用 $watch 方法对实例属性进行监听', ( done ) => {
    const hu = new Hu({
      data: () => ({
        a: 1
      })
    });

    let result;
    hu.$watch( 'a', ( value, oldValue ) => {
      result = [ value, oldValue ];
    });

    expect( result ).is.undefined;

    hu.a = 2;
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      hu.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 3, 2 ]);

        done();
      });
    });
  });

  it( '使用 $watch 方法对实例属性进行监听 ( Vue )', ( done ) => {
    const vm = new Vue({
      data: () => ({
        a: 1
      })
    });

    let result;
    vm.$watch( 'a', ( value, oldValue ) => {
      result = [ value, oldValue ];
    });

    expect( result ).is.undefined;

    vm.a = 2;
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      vm.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 3, 2 ]);

        done();
      });
    });
  });

  it( '使用 $watch 方法对实例属性进行监听, 可以和 watch 选项一样使用包含选项的对象', ( done ) => {
    const hu = new Hu({
      data: () => ({
        a: 1
      })
    });

    let result;
    hu.$watch( 'a', {
      immediate: true,
      handler: ( value, oldValue ) => {
        result = [ value, oldValue ];
      }
    });

    expect( result ).is.deep.equals([ 1, undefined ]);

    hu.a = 2;
    expect( result ).is.deep.equals([ 1, undefined ]);
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      hu.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 3, 2 ]);

        done();
      });
    });
  });

  it( '使用 $watch 方法对实例属性进行监听, 可以和 watch 选项一样使用包含选项的对象 ( Vue )', ( done ) => {
    const vm = new Vue({
      data: () => ({
        a: 1
      })
    });

    let result;
    vm.$watch( 'a', {
      immediate: true,
      handler: ( value, oldValue ) => {
        result = [ value, oldValue ];
      }
    });

    expect( result ).is.deep.equals([ 1, undefined ]);

    vm.a = 2;
    expect( result ).is.deep.equals([ 1, undefined ]);
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      vm.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 3, 2 ]);

        done();
      });
    });
  });

  it( '使用 $watch 方法对一个函数的返回值进行监听', ( done ) => {
    const hu = new Hu({
      data: () => ({
        a: 1,
        b: 2
      })
    });

    let result;
    hu.$watch( 
      () => {
        return hu.a + hu.b;
      },
      ( value, oldValue ) => {
        result = [ value, oldValue ];
      }
    );

    expect( result ).is.undefined;

    hu.a = 2;
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 4, 3 ]);

      hu.b = 3;
      expect( result ).is.deep.equals([ 4, 3 ]);
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 5, 4 ]);

        done();
      });
    });
  });

  it( '使用 $watch 方法对一个函数的返回值进行监听 ( Vue )', ( done ) => {
    const vm = new Vue({
      data: () => ({
        a: 1,
        b: 2
      })
    });

    let result;
    vm.$watch( 
      () => {
        return vm.a + vm.b;
      },
      ( value, oldValue ) => {
        result = [ value, oldValue ];
      }
    );

    expect( result ).is.undefined;

    vm.a = 2;
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 4, 3 ]);

      vm.b = 3;
      expect( result ).is.deep.equals([ 4, 3 ]);
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 5, 4 ]);

        done();
      });
    });
  });

  it( '使用 $watch 方法对一个函数的返回值进行监听, 对其他观察者对象进行监听', ( done ) => {
    const hu = new Hu();
    const data = Hu.observable({
      a: 1,
      b: 2
    });

    let result;
    hu.$watch( 
      () => {
        return data.a + data.b;
      },
      ( value, oldValue ) => {
        result = [ value, oldValue ];
      }
    );

    expect( result ).is.undefined;

    data.a = 2;
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 4, 3 ]);

      data.b = 3;
      expect( result ).is.deep.equals([ 4, 3 ]);
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 5, 4 ]);

        done();
      });
    });
  });

  it( '使用 $watch 方法对一个函数的返回值进行监听, 对其他观察者对象进行监听 ( Vue )', ( done ) => {
    const vm = new Vue();
    const data = Vue.observable({
      a: 1,
      b: 2
    });

    let result;
    vm.$watch( 
      () => {
        return data.a + data.b;
      },
      ( value, oldValue ) => {
        result = [ value, oldValue ];
      }
    );

    expect( result ).is.undefined;

    data.a = 2;
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 4, 3 ]);

      data.b = 3;
      expect( result ).is.deep.equals([ 4, 3 ]);
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 5, 4 ]);

        done();
      });
    });
  });

  it( '使用 $watch 方法对一个函数的返回值进行监听, 使用 deep 选项时如果方法返回值不是观察者对象则无效', ( done ) => {
    const hu = new Hu({
      data: { a: 1 }
    });
    const data = {
      b: 2
    };

    let result;
    hu.$watch(
      () => {
        hu.a;
        return data;
      },
      {
        deep: true,
        immediate: true,
        handler: ( value, oldValue ) => result = [ value, oldValue ]
      }
    );

    expect( result ).is.deep.equals([ data, undefined ]);

    data.b = 3;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ data, undefined ]);

      hu.a = 2;
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ data, data ]);

        done();
      });
    });
  });

  it( '使用 $watch 方法对一个函数的返回值进行监听, 使用 deep 选项时如果方法返回值不是观察者对象则无效 ( Vue )', ( done ) => {
    const vm = new Vue({
      data: { a: 1 }
    });
    const data = {
      b: 2
    };

    let result;
    vm.$watch(
      () => {
        vm.a;
        return data;
      },
      {
        deep: true,
        immediate: true,
        handler: ( value, oldValue ) => result = [ value, oldValue ]
      }
    );

    expect( result ).is.deep.equals([ data, undefined ]);

    data.b = 3;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ data, undefined ]);

      vm.a = 2;
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ data, data ]);

        done();
      });
    });
  });

  it( '使用 $watch 方法对一个函数的返回值进行监听, 使用 deep 选项时如果方法返回值是观察者对象则生效', ( done ) => {
    const hu = new Hu({
      data: { a: 1 }
    });
    const data = Hu.observable({
      b: 2
    });

    let result;
    hu.$watch(
      () => {
        hu.a;
        return data;
      },
      {
        deep: true,
        immediate: true,
        handler: ( value, oldValue ) => result = [ value, oldValue ]
      }
    );

    expect( result ).is.deep.equals([ data, undefined ]);

    data.b = 3;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ data, data ]);

      done();
    });
  });

  it( '使用 $watch 方法对一个函数的返回值进行监听, 使用 deep 选项时如果方法返回值是观察者对象则生效 ( Vue )', ( done ) => {
    const vm = new Vue({
      data: { a: 1 }
    });
    const data = Vue.observable({
      b: 2
    });

    let result;
    vm.$watch(
      () => {
        vm.a;
        return data;
      },
      {
        deep: true,
        immediate: true,
        handler: ( value, oldValue ) => result = [ value, oldValue ]
      }
    );

    expect( result ).is.deep.equals([ data, undefined ]);

    data.b = 3;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ data, data ]);

      done();
    });
  });

  it( '使用 $watch 方法会返回取消监听的方法, 运行后, 会立即停止监听', () => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: 1
      })
    });

    const unWatch = hu.$watch( 'a', ( value, oldValue ) => {
      result = [ value, oldValue ];
    });

    expect( result ).is.undefined;

    hu.a = 2;
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      unWatch();
      hu.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 2, 1 ]);
      });
    });
  });

  it( '使用 $watch 方法会返回取消监听的方法, 运行后, 会立即停止监听 ( Vue )', () => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: 1
      })
    });

    const unWatch = vm.$watch( 'a', ( value, oldValue ) => {
      result = [ value, oldValue ];
    });

    expect( result ).is.undefined;

    vm.a = 2;
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      unWatch();
      vm.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 2, 1 ]);
      });
    });
  });

  it( '使用 $watch 方法会返回取消监听的方法, 在回调中注销掉自身的监听后, 其他监听不会受到影响', ( done ) => {
    const hu = new Hu({
      data: {
        a: 1
      }
    });

    let i = 0;
    let j = 0;
    let isDestroy = false;
    const unWatch = hu.$watch( 'a', ( value, oldValue ) => {
      if( isDestroy )
        return unWatch();
      i++;
    });
    const unWatch2 = hu.$watch( 'a', ( value, oldValue ) => {
      j++;
    });

    expect( i ).is.equals( 0 );
    expect( j ).is.equals( 0 );

    hu.a = 2;
    hu.$nextTick(() => {
      expect( i ).is.equals( 1 );
      expect( j ).is.equals( 1 );

      hu.a = 3;
      hu.$nextTick(() => {
        expect( i ).is.equals( 2 );
        expect( j ).is.equals( 2 );

        isDestroy = true;

        hu.a = 4;
        hu.$nextTick(() => {
          expect( i ).is.equals( 2 );
          expect( j ).is.equals( 3 );

          unWatch2();

          hu.a = 4;
          hu.$nextTick(() => {
            expect( i ).is.equals( 2 );
            expect( j ).is.equals( 3 );

            done();
          });
        });
      });
    });
  });

  it( '使用 $watch 方法会返回取消监听的方法, 在回调中注销掉自身的监听后, 其他监听不会受到影响 ( Vue )', ( done ) => {
    const vm = new Vue({
      data: {
        a: 1
      }
    });

    let i = 0;
    let j = 0;
    let isDestroy = false;
    const unWatch = vm.$watch( 'a', ( value, oldValue ) => {
      if( isDestroy )
        return unWatch();
      i++;
    });
    const unWatch2 = vm.$watch( 'a', ( value, oldValue ) => {
      j++;
    });

    expect( i ).is.equals( 0 );
    expect( j ).is.equals( 0 );

    vm.a = 2;
    vm.$nextTick(() => {
      expect( i ).is.equals( 1 );
      expect( j ).is.equals( 1 );

      vm.a = 3;
      vm.$nextTick(() => {
        expect( i ).is.equals( 2 );
        expect( j ).is.equals( 2 );

        isDestroy = true;

        vm.a = 4;
        vm.$nextTick(() => {
          expect( i ).is.equals( 2 );
          expect( j ).is.equals( 3 );

          unWatch2();

          vm.a = 4;
          vm.$nextTick(() => {
            expect( i ).is.equals( 2 );
            expect( j ).is.equals( 3 );

            done();
          });
        });
      });
    });
  });

  it( '实例上的 $on 方法用于注册事件', () => {
    const hu = new Hu();
    let index = 0;
    let result, result1;

    hu.$on( 'test', function(){
      index++;
      result = [ ...arguments ];
      expect( hu ).is.equals( this );
    });

    hu.$on([ 'test1', 'test2' ], function(){
      index++;
      result1 = [ ...arguments ];
      expect( hu ).is.equals( this );
    });

    hu.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.undefined;

    hu.$emit( 'test1', 4, 5, 6 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    hu.$emit( 'test2', 7, 8, 9 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);
  });

  it( '实例上的 $on 方法用于注册事件 ( Vue )', () => {
    const vm = new Vue();
    let index = 0;
    let result, result1;

    vm.$on( 'test', function(){
      index++;
      result = [ ...arguments ];
      expect( vm ).is.equals( this );
    });

    vm.$on([ 'test1', 'test2' ], function(){
      index++;
      result1 = [ ...arguments ];
      expect( vm ).is.equals( this );
    });

    vm.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.undefined;

    vm.$emit( 'test1', 4, 5, 6 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    vm.$emit( 'test2', 7, 8, 9 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);
  });

  it( '实例上的 $once 方法用于注册只执行一次的事件', () => {
    const hu = new Hu();
    let index = 0;
    let result, result1;

    hu.$once( 'test', function(){
      index++;
      result = [ ...arguments ];
      expect( hu ).is.equals( this );
    });

    hu.$on( 'test1', function(){
      index++;
      result1 = [ ...arguments ];
      expect( hu ).is.equals( this );
    });

    hu.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.undefined;

    hu.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.undefined;

    hu.$emit( 'test1', 4, 5, 6 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    hu.$emit( 'test1', 7, 8, 9 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);
  });

  it( '实例上的 $once 方法用于注册只执行一次的事件 ( Vue )', () => {
    const vm = new Vue();
    let index = 0;
    let result, result1;

    vm.$once( 'test', function(){
      index++;
      result = [ ...arguments ];
      expect( vm ).is.equals( this );
    });

    vm.$on( 'test1', function(){
      index++;
      result1 = [ ...arguments ];
      expect( vm ).is.equals( this );
    });

    vm.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.undefined;

    vm.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.undefined;

    vm.$emit( 'test1', 4, 5, 6 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    vm.$emit( 'test1', 7, 8, 9 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);
  });

  it( '实例上的 $off 方法用于解绑事件', () => {
    const hu = new Hu();
    let index = 0;
    let result, result1;

    function fn(){
      index++;
      result = [ ...arguments ];
    }

    function fn1(){
      index++;
      result1 = [ ...arguments ];
    }

    hu.$on( [ 'test', 'test1' ], fn );
    hu.$on( [ 'test', 'test1' ], fn1 );

    // 解绑某个事件的某个回调
    hu.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 1, 2, 3 ]);

    hu.$off( 'test', fn );
    hu.$emit( 'test', 4, 5, 6 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    // 解绑某个事件的全部回调
    hu.$emit( 'test1', 7, 8, 9 );
    expect( index ).is.equals( 5 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);

    hu.$off( 'test1' );
    hu.$emit( 'test1', 1, 2, 3 );
    expect( index ).is.equals( 5 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);

    // 解绑所有事件
    hu.$emit( 'test', 4, 5, 6 );
    expect( index ).is.equals( 6 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    hu.$off();
    hu.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 6 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);
  });

  it( '实例上的 $off 方法用于解绑事件 ( Vue )', () => {
    const vm = new Vue();
    let index = 0;
    let result, result1;

    function fn(){
      index++;
      result = [ ...arguments ];
    }

    function fn1(){
      index++;
      result1 = [ ...arguments ];
    }

    vm.$on( [ 'test', 'test1' ], fn );
    vm.$on( [ 'test', 'test1' ], fn1 );

    // 解绑某个事件的某个回调
    vm.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 1, 2, 3 ]);

    vm.$off( 'test', fn );
    vm.$emit( 'test', 4, 5, 6 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    // 解绑某个事件的全部回调
    vm.$emit( 'test1', 7, 8, 9 );
    expect( index ).is.equals( 5 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);

    vm.$off( 'test1' );
    vm.$emit( 'test1', 1, 2, 3 );
    expect( index ).is.equals( 5 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);

    // 解绑所有事件
    vm.$emit( 'test', 4, 5, 6 );
    expect( index ).is.equals( 6 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    vm.$off();
    vm.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 6 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);
  });

  it( '实例上的 $emit 方法用于触发事件', () => {
    const hu = new Hu();
    let index = 0;
    let result;

    hu.$on( 'test', function(){
      index++;
      result = [ ...arguments ];
    });

    hu.$emit( 'test' );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ ]);

    hu.$emit( 'test', 1 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1 ]);

    hu.$emit( 'test', 1, 2 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2 ]);
  });

  it( '实例上的 $emit 方法用于触发事件 ( Vue )', () => {
    const vm = new Vue();
    let index = 0;
    let result;

    vm.$on( 'test', function(){
      index++;
      result = [ ...arguments ];
    });

    vm.$emit( 'test' );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ ]);

    vm.$emit( 'test', 1 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1 ]);

    vm.$emit( 'test', 1, 2 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2 ]);
  });

  it( '实例上的 $mount 方法用于手动挂载使用 new 创建的实例', () => {
    const hu = new Hu({
      render( html ){
        return html`<div>123</div>`;
      }
    });

    expect( hu.$el ).is.undefined;

    hu.$mount( div );

    expect( hu.$el ).is.equals( div );
  });

  it( '实例上的 $mount 方法用于手动挂载使用 new 创建的实例 ( Vue )', () => {
    const vm = new Vue({
      template: `
        <div>123</div>
      `
    });

    expect( vm.$el ).is.undefined;

    vm.$mount( div );

    expect( vm.$el ).is.not.undefined;

    vm.$destroy();
    vm.$el.$remove();
  });

  it( '实例上的 $mount 方法用于手动挂载使用 new 创建的实例 ( 二 )', () => {
    const customName = window.customName;
    const hu = new Hu({
      render( html ){
        return html`<div>123</div>`;
      }
    });

    expect( hu.$el ).is.undefined;

    div.id = customName;

    hu.$mount( '#' + customName );

    expect( hu.$el ).is.equals( div );
  });

  it( '实例上的 $mount 方法用于手动挂载使用 new 创建的实例 ( 二 ) ( Vue )', () => {
    const customName = window.customName;
    const vm = new Vue({
      template: `
        <div>123</div>
      `
    });

    expect( vm.$el ).is.undefined;

    div.id = customName;

    vm.$mount( '#' + customName );

    expect( vm.$el ).is.not.undefined;

    vm.$destroy();
    vm.$el.$remove();
  });

  it( '实例上的 $forceUpdate 方法用于强制实例立即重新渲染', () => {
    let index = 0;
    const hu = new Hu({
      el: div,
      render: () => index++
    });

    expect( index ).is.equals( 1 );

    hu.$forceUpdate();
    expect( index ).is.equals( 2 );

    hu.$forceUpdate();
    hu.$forceUpdate();
    expect( index ).is.equals( 4 );
  });

  it( '实例上的 $forceUpdate 方法用于强制实例立即重新渲染 ( Vue ) ( 不一致 )', ( done ) => {
    let index = 0;
    const vm = new Vue({
      el: div,
      render: () => index++
    });

    expect( index ).is.equals( 1 );

    vm.$forceUpdate();
    expect( index ).is.equals( 1 );
    vm.$nextTick(() => {
      expect( index ).is.equals( 2 );

      vm.$forceUpdate();
      vm.$forceUpdate();
      expect( index ).is.equals( 2 );
      vm.$nextTick(() => {
        expect( index ).is.equals( 3 );

        done();
      });
    });
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后触发 beforeDestroy, destroyed 生命周期', () => {
    const steps = [];
    const hu = new Hu({
      beforeDestroy: () => steps.push('beforeDestroy'),
      destroyed: () => steps.push('destroyed')
    });

    expect( steps ).is.deep.equals([ ]);

    hu.$destroy();

    expect( steps ).is.deep.equals([ 'beforeDestroy', 'destroyed' ]);
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后触发 beforeDestroy, destroyed 生命周期 ( Vue )', () => {
    const steps = [];
    const vm = new Vue({
      beforeDestroy: () => steps.push('beforeDestroy'),
      destroyed: () => steps.push('destroyed')
    });

    expect( steps ).is.deep.equals([ ]);

    vm.$destroy();

    expect( steps ).is.deep.equals([ 'beforeDestroy', 'destroyed' ]);
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后会解除所有的 watch 监听', ( done ) => {
    let index = 0;
    const hu = new Hu({
      data: {
        a: 1
      },
      watch: {
        a: () => index++
      }
    });

    hu.$watch( 'a', () => index++ );

    hu.a = 2;
    hu.$nextTick(() => {
      expect( index ).is.equals( 2 );

      hu.a = 3;
      hu.$nextTick(() => {
        expect( index ).is.equals( 4 );

        hu.$destroy();

        hu.a = 2;
        hu.$nextTick(() => {
          expect( index ).is.equals( 4 );

          done();
        });
      });
    });
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后会解除所有的 watch 监听 ( Vue )', ( done ) => {
    let index = 0;
    const vm = new Vue({
      data: {
        a: 1
      },
      watch: {
        a: () => index++
      }
    });

    vm.$watch( 'a', () => index++ );

    vm.a = 2;
    vm.$nextTick(() => {
      expect( index ).is.equals( 2 );

      vm.a = 3;
      vm.$nextTick(() => {
        expect( index ).is.equals( 4 );

        vm.$destroy();

        vm.a = 2;
        vm.$nextTick(() => {
          expect( index ).is.equals( 4 );

          done();
        });
      });
    });
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后会解除所有的计算属性', ( done ) => {
    const hu = new Hu({
      data: {
        a: 1
      },
      computed: {
        b(){
          return this.a * 2;
        },
        c(){
          return this.b * 2;
        }
      }
    });

    expect( hu.a ).is.equals( 1 );
    expect( hu.b ).is.equals( 2 );
    expect( hu.c ).is.equals( 4 );

    hu.a = 2;
    hu.$nextTick(() => {
      expect( hu.a ).is.equals( 2 );
      expect( hu.b ).is.equals( 4 );
      expect( hu.c ).is.equals( 8 );

      hu.a = 3;
      hu.$nextTick(() => {
        expect( hu.a ).is.equals( 3 );
        expect( hu.b ).is.equals( 6 );
        expect( hu.c ).is.equals( 12 );

        hu.$destroy();

        hu.a = 4;
        hu.$nextTick(() => {
          expect( hu.a ).is.equals( 4 );
          expect( hu.b ).is.equals( 6 );
          expect( hu.c ).is.equals( 12 );

          done();
        });
      });
    });
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后会解除所有的计算属性 ( Vue )', ( done ) => {
    const vm = new Vue({
      data: {
        a: 1
      },
      computed: {
        b(){
          return this.a * 2;
        },
        c(){
          return this.b * 2;
        }
      }
    });

    expect( vm.a ).is.equals( 1 );
    expect( vm.b ).is.equals( 2 );
    expect( vm.c ).is.equals( 4 );

    vm.a = 2;
    vm.$nextTick(() => {
      expect( vm.a ).is.equals( 2 );
      expect( vm.b ).is.equals( 4 );
      expect( vm.c ).is.equals( 8 );

      vm.a = 3;
      vm.$nextTick(() => {
        expect( vm.a ).is.equals( 3 );
        expect( vm.b ).is.equals( 6 );
        expect( vm.c ).is.equals( 12 );

        vm.$destroy();

        vm.a = 4;
        vm.$nextTick(() => {
          expect( vm.a ).is.equals( 4 );
          expect( vm.b ).is.equals( 6 );
          expect( vm.c ).is.equals( 12 );

          done();
        });
      });
    });
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后会解除所有自定义事件绑定', () => {
    let index = 0;
    const hu = new Hu();

    hu.$on( 'test', () => index++ );
    hu.$on( 'test', () => index++ );
    hu.$on( 'test', () => index++ );

    expect( index ).is.equals( 0 );

    hu.$emit('test');
    expect( index ).is.equals( 3 );

    hu.$emit('test');
    expect( index ).is.equals( 6 );

    hu.$emit('test');
    hu.$emit('test');
    expect( index ).is.equals( 12 );

    hu.$destroy();

    hu.$emit('test');
    expect( index ).is.equals( 12 );

    hu.$emit('test');
    expect( index ).is.equals( 12 );

    hu.$emit('test');
    hu.$emit('test');
    expect( index ).is.equals( 12 );
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后会解除所有自定义事件绑定 ( Vue )', () => {
    let index = 0;
    const vm = new Vue();

    vm.$on( 'test', () => index++ );
    vm.$on( 'test', () => index++ );
    vm.$on( 'test', () => index++ );

    expect( index ).is.equals( 0 );

    vm.$emit('test');
    expect( index ).is.equals( 3 );

    vm.$emit('test');
    expect( index ).is.equals( 6 );

    vm.$emit('test');
    vm.$emit('test');
    expect( index ).is.equals( 12 );

    vm.$destroy();

    vm.$emit('test');
    expect( index ).is.equals( 12 );

    vm.$emit('test');
    expect( index ).is.equals( 12 );

    vm.$emit('test');
    vm.$emit('test');
    expect( index ).is.equals( 12 );
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后会解除所有的 bind 指令的绑定', ( done ) => {
    const steps = [];
    const customDataProxy = new Proxy({
      name: '1'
    }, {
      get: ( target, name ) => {
        Hu.util.isString( name ) && steps.push( name );
        return target[ name ];
      }
    });
    const data = Hu.observable(
      customDataProxy
    );
    const customName = window.customName;
    let isConnected = false;

    Hu.define( customName, {
      render( html ){
        const name = html.bind( data, 'name' );

        return html`
          <div name=${ name }></div>
        `;
      },
      connected: () => isConnected = true,
      disconnected: () => isConnected = false
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    expect( isConnected ).is.true;
    expect( hu.$el.firstElementChild.$attr('name') ).is.equals('1');
    expect( steps ).is.deep.equals([ 'name' ]);

    data.name = '2';
    hu.$nextTick(() => {
      expect( isConnected ).is.true;
      expect( hu.$el.firstElementChild.$attr('name') ).is.equals('2');
      expect( steps ).is.deep.equals([ 'name', 'name' ]);

      data.name = '3';
      hu.$nextTick(() => {
        expect( isConnected ).is.true;
        expect( hu.$el.firstElementChild.$attr('name') ).is.equals('3');
        expect( steps ).is.deep.equals([ 'name', 'name', 'name' ]);

        hu.$destroy();

        expect( isConnected ).is.true;
        expect( hu.$el.firstElementChild.$attr('name') ).is.equals('3');
        expect( steps ).is.deep.equals([ 'name', 'name', 'name' ]);

        data.name = '4';
        hu.$nextTick(() => {
          expect( isConnected ).is.true;
          expect( hu.$el.firstElementChild.$attr('name') ).is.equals('3');
          expect( steps ).is.deep.equals([ 'name', 'name', 'name' ]);

          custom.$remove();

          done();
        });
      });
    });
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后会解除所有的双向数据绑定', ( done ) => {
    const steps = [];
    const customDataProxy = new Proxy({
      value: '1'
    }, {
      get: ( target, name ) => {
        Hu.util.isString( name ) && steps.push( name );
        return target[ name ];
      }
    });
    const data = Hu.observable(
      customDataProxy
    );
    const customName = window.customName;
    let isConnected = false;

    Hu.define( customName, {
      render( html ){
        return html`
          <input ref="input" :model=${[ data, 'value' ]}>
        `;
      },
      connected: () => isConnected = true,
      disconnected: () => isConnected = false
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;
    const input = hu.$refs.input;

    expect( isConnected ).is.true;
    expect( input.value ).is.equals('1');
    expect( steps ).is.deep.equals([ 'value' ]);

    data.value = '12';
    hu.$nextTick(() => {
      expect( isConnected ).is.true;
      expect( input.value ).is.equals('12');
      expect( steps ).is.deep.equals([ 'value', 'value' ]);

      data.value = '123';
      hu.$nextTick(() => {
        expect( isConnected ).is.true;
        expect( input.value ).is.equals('123');
        expect( steps ).is.deep.equals([ 'value', 'value', 'value' ]);

        hu.$destroy();

        expect( isConnected ).is.true;
        expect( input.value ).is.equals('123');
        expect( steps ).is.deep.equals([ 'value', 'value', 'value' ]);

        data.value = '1';
        hu.$nextTick(() => {
          expect( isConnected ).is.true;
          expect( input.value ).is.equals('123');
          expect( steps ).is.deep.equals([ 'value', 'value', 'value' ]);

          custom.$remove();

          done();
        });
      });
    });
  });

  it( '实例上的所有前缀为 $ 的私有属性及方法均不能进行修改及删除', () => {
    const hu = new Hu({
      el: div,
      render( html ){
        return html`<div></div>`;
      }
    });

    let run = false;
    Hu.util.each( hu, ( key, value ) => {
      run = true;

      const type = Object.prototype.toString.call( value );

      delete hu[ key ];
      expect( hu[ key ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu[ key ] ) ).is.equals( type );

      hu[ key ] = 123;
      expect( hu[ key ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu[ key ] ) ).is.equals( type );
    });

    expect( run ).is.true;
  });

  it( '实例上的所有前缀为 $ 的私有属性及方法均不能进行修改及删除 ( 二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      render( html ){
        return html`<div></div>`;
      }
    });

    const custom = document.createElement( customName ).$appendTo( div );
    const hu = custom.$hu;

    let run = false;
    Hu.util.each( hu, ( key, value ) => {
      run = true;

      const type = Object.prototype.toString.call( value );

      delete hu[ key ];
      expect( hu[ key ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu[ key ] ) ).is.equals( type );

      hu[ key ] = 123;
      expect( hu[ key ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu[ key ] ) ).is.equals( type );
    });

    expect( run ).is.true;
  });

});