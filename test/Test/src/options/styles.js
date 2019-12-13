import Hu from '../../../../src/build/index';
import { expect } from 'chai';


describe( 'options.styles', () => {

  /** @type {string} */
  let customName;
  /** @type {Element} */
  let custom;
  /** @type {$hu} */
  let hu;

  beforeEach(() => {
    customName = window.customName;
  });

  afterEach(() => {
    custom && custom.$remove();
    hu && hu.$destroy();
  });

  // ------------------------------------

  it( '使用 styles 选项定义实例的样式 ( 一 )', () => {
    Hu.define( customName, {
      styles: `
        :host > div{
          position: fixed;
        }
      `,
      render( html ){
        return html`<div ref="div"></div>`;
      }
    });

    custom = document.createElement( customName ).$appendTo( document.body );
    hu = custom.$hu;

    expect( getComputedStyle( hu.$refs.div ).position ).is.equals( 'fixed' );
  });

  it( '使用 styles 选项定义实例的样式 ( 二 )', () => {
    custom = document.createElement('div').$appendTo( document.body ).$prop( 'id', customName );
    hu = new Hu({
      el: custom,
      styles: `
        #${ customName } > div{
          position: fixed;
        }
      `,
      render( html ){
        return html`<div ref="div"></div>`;
      }
    });

    expect( getComputedStyle( hu.$refs.div ).position ).is.equals( 'fixed' );
  });

  it( '使用 styles 选项定义实例的样式, 使用数组传参 ( 一 )', () => {
    Hu.define( customName, {
      styles: [
        `:host > div{ position: fixed }`,
        `:host > div{ top: 0 }`,
        `:host > div{ left: 0 }`
      ],
      render( html ){
        return html`<div ref="div"></div>`;
      }
    });

    custom = document.createElement( customName ).$appendTo( document.body );
    hu = custom.$hu;

    expect( getComputedStyle( hu.$refs.div ).position ).is.equals( 'fixed' );
    expect( getComputedStyle( hu.$refs.div ).top ).is.equals( '0px' );
    expect( getComputedStyle( hu.$refs.div ).left ).is.equals( '0px' );
  });

  it( '使用 styles 选项定义实例的样式, 使用数组传参 ( 二 )', () => {
    custom = document.createElement('div').$appendTo( document.body ).$prop( 'id', customName );
    hu = new Hu({
      el: custom,
      styles: [
        `#${ customName } > div{ position: fixed }`,
        `#${ customName } > div{ top: 0 }`,
        `#${ customName } > div{ left: 0 }`
      ],
      render( html ){
        return html`<div ref="div"></div>`;
      }
    });

    expect( getComputedStyle( hu.$refs.div ).position ).is.equals( 'fixed' );
    expect( getComputedStyle( hu.$refs.div ).top ).is.equals( '0px' );
    expect( getComputedStyle( hu.$refs.div ).left ).is.equals( '0px' );
  });

  it( '使用 styles 选项传入自定义元素的样式 ( 通配选择器 )', () => {
    Hu.define( customName, {
      styles: `
        *{ position: fixed }
      `,
      render( html ){
        return html`
          <div ref="div1">
            <div ref="div2">
              <div ref="div3"></div>
            </div>
            <div ref="div4"></div>
          </div>
        `;
      }
    });

    custom = document.createElement( customName ).$appendTo( document.body );
    hu = custom.$hu;

    expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('fixed');
  });

  it( '使用 styles 选项传入自定义元素的样式 ( 标签选择器 )', () => {
    Hu.define( customName, {
      styles: `
        div{ position: fixed }
      `,
      render( html ){
        return html`
          <div ref="div1">
            <div ref="div2">
              <div ref="div3"></div>
            </div>
            <span ref="div4"></span>
          </div>
        `;
      }
    });

    custom = document.createElement( customName ).$appendTo( document.body );
    hu = custom.$hu;

    expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('static');
  });

  it( '使用 styles 选项传入自定义元素的样式 ( 类选择器 )', () => {
    Hu.define( customName, {
      styles: `
        .test{ position: fixed }
      `,
      render( html ){
        return html`
          <div class="test" ref="div1">
            <div class="test" ref="div2">
              <div class="test" ref="div3"></div>
            </div>
            <div ref="div4"></div>
          </div>
        `;
      }
    });

    custom = document.createElement( customName ).$appendTo( document.body );
    hu = custom.$hu;

    expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('static');
  });

  it( '使用 styles 选项传入自定义元素的样式 ( id 选择器 )', () => {
    Hu.define( customName, {
      styles: `
        #test{ position: fixed }
      `,
      render( html ){
        return html`
          <div ref="div1">
            <div ref="div2">
              <div id="test" ref="div3"></div>
            </div>
            <div ref="div4"></div>
          </div>
        `;
      }
    });

    custom = document.createElement( customName ).$appendTo( document.body );
    hu = custom.$hu;

    expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('static');
    expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('static');
    expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('static');
  });

  it( '使用 styles 选项传入自定义元素的样式 ( 后代选择器 )', () => {
    Hu.define( customName, {
      styles: `
        div div{ position: fixed }
      `,
      render( html ){
        return html`
          <div ref="div1">
            <div ref="div2">
              <div ref="div3"></div>
            </div>
            <div ref="div4"></div>
          </div>
        `;
      }
    });

    custom = document.createElement( customName ).$appendTo( document.body );
    hu = custom.$hu;

    expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('static');
    expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('fixed');
  });

  it( '使用 styles 选项传入自定义元素的样式 ( 子选择器 )', () => {
    Hu.define( customName, {
      styles: `
        div > div{ position: fixed }
      `,
      render( html ){
        return html`
          <div ref="div1">
            <div ref="div2">
              <div ref="div3"></div>
            </div>
            <div ref="div4"></div>
          </div>
        `;
      }
    });

    custom = document.createElement( customName ).$appendTo( document.body );
    hu = custom.$hu;

    expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('static');
    expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('fixed');
  });

  it( '使用 styles 选项传入自定义元素的样式 ( 相邻兄弟选择器 )', () => {
    Hu.define( customName, {
      styles: `
        div + div{ position: fixed }
      `,
      render( html ){
        return html`
          <div ref="div1">
            <div ref="div2">
              <div ref="div3"></div>
            </div>
            <div ref="div4"></div>
            <span></span>
            <div ref="div5"></div>
          </div>
        `;
      }
    });

    custom = document.createElement( customName ).$appendTo( document.body );
    hu = custom.$hu;

    expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('static');
    expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('static');
    expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('static');
    expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div5 ).position ).is.equals('static');
  });

  it( '使用 styles 选项传入自定义元素的样式 ( 匹配选择器 )', () => {
    Hu.define( customName, {
      styles: `
        div ~ div{ position: fixed }
      `,
      render( html ){
        return html`
          <div ref="div1">
            <div ref="div2">
              <div ref="div3"></div>
            </div>
            <div ref="div4"></div>
            <span></span>
            <div ref="div5"></div>
          </div>
        `;
      }
    });

    custom = document.createElement( customName ).$appendTo( document.body );
    hu = custom.$hu;

    expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('static');
    expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('static');
    expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('static');
    expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('fixed');
    expect( getComputedStyle( hu.$refs.div5 ).position ).is.equals('fixed');
  });

});