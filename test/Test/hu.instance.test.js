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

});