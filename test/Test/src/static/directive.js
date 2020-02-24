import Hu from '../../../../src/build/index';
import { expect } from 'chai';
import { userDirectives } from '../../../../src/html/const';
import { ownKeys, deleteProperty } from '../../../../src/shared/global/Reflect/index';


describe( 'Hu.static.directive', () => {

  const render = Hu.render;
  const html = Hu.html;

  /** @type {Element} */
  let div;
  beforeEach(() => {
    div = document.createElement('div').$appendTo( document.body );
  });
  afterEach(() => {
    div.$remove();
    ownKeys( userDirectives ).forEach( key => {
      deleteProperty( userDirectives, key )
    })
  });

  it( 'Hu.directive: 使用该方法可用于注册自定义指令', () => {
    Hu.directive( 'html', class {
      constructor( element, strings, modifires ){
        this.elm = element
      }
      commit( value ){
        this.elm.innerHTML = value
      }
    });

    render( div )`
      <div :html=${ 123 }></div>
    `;
    expect( div.firstElementChild.innerHTML ).is.equals('123');
  });

  it( 'Hu.directive: 注册的指令可以定义 constructor 接收指令使用时的相关参数, 第一个参数为绑定了指令的 DOM 元素', () => {
    let result;

    Hu.directive( 'test', class {
      constructor ( element ){
        result = element;
      }
      commit(){}
    });

    render( div )`
      <div :test=${ 0 }></div>
    `;
    expect( result ).is.equals( div.firstElementChild ).includes({
      nodeName: 'DIV'
    });

    render( div )`
      <span :test=${ 0 }></span>
    `;
    expect( result ).is.equals( div.firstElementChild ).includes({
      nodeName: 'SPAN'
    });

    render( div )`
      <b :test=${ 0 }></b>
    `;
    expect( result ).is.equals( div.firstElementChild ).includes({
      nodeName: 'B'
    });
  });

  it( 'Hu.directive: 注册的指令可以定义 constructor 接收指令使用时的相关参数, 第二个参数为使用指令时除了插值绑定的其他部分', () => {
    let result;

    Hu.directive( 'test', class {
      constructor ( element, strings ){
        result = strings;
      }
      commit(){}
    });

    render( div )`
      <div :test=${ 'Hu' }></div>
    `;
    expect( result ).is.deep.equals([ '', '' ]);

    render( div )`
      <div :test="${ 'Hu' }"></div>
    `;
    expect( result ).is.deep.equals([ '', '' ]);

    render( div )`
      <span :test="I am ${ 'Hu' }.js"></span>
    `;
    expect( result ).is.deep.equals([ 'I am ', '.js' ]);

    render( div )`
      <span :test="${ 'I' } am ${ 'Hu' }.js"></span>
    `;
    expect( result ).is.deep.equals([ '', ' am ', '.js' ]);

    render( div )`
      <span :test="${ 'I' } am ${ 'Hu' }.${ 'js' }"></span>
    `;
    expect( result ).is.deep.equals([ '', ' am ', '.', '' ]);
  });

  it( 'Hu.directive: 注册的指令可以定义 constructor 接收指令使用时的相关参数, 第二个参数为使用指令时除了插值绑定的其他部分', () => {
    let result;

    Hu.directive( 'test', class {
      constructor ( element, strings, modifires ){
        result = modifires;
      }
      commit(){}
    });

    render( div )`
      <div :test=${ 'Hu' }></div>
    `;
    expect( result ).is.deep.equals({});

    render( div )`
      <div :test.a=${ 'Hu' }></div>
    `;
    expect( result ).is.deep.equals({
      a: true
    });

    render( div )`
      <div :test.a.b=${ 'Hu' }></div>
    `;
    expect( result ).is.deep.equals({
      a: true,
      b: true
    });

    render( div )`
      <div :test.a.b.c=${ 'Hu' }></div>
    `;
    expect( result ).is.deep.equals({
      a: true,
      b: true,
      c: true
    });
  });

  it( 'Hu.directive: 注册的指令可以定义 commit 接收用户传递的值, 第一个参数为传递进来的值', () => {
    let result;

    Hu.directive( 'test', class {
      commit( value ){
        result = value;
      }
    });

    render( div )`
      <div :test=${ 1 }></div>
    `;
    expect( result ).is.equals( 1 );

    render( div )`
      <div :test=${ '2' }></div>
    `;
    expect( result ).is.equals( '2' );

    render( div )`
      <div :test=${ true }></div>
    `;
    expect( result ).is.equals( true );

    render( div )`
      <div :test=${ false }></div>
    `;
    expect( result ).is.equals( false );

    render( div )`
      <div :test=${ [] }></div>
    `;
    expect( result ).is.deep.equals( [] );

    render( div )`
      <div :test=${ {} }></div>
    `;
    expect( result ).is.deep.equals( {} );
  });

  it( 'Hu.directive: 注册的指令可以定义 commit 接收用户传递的值, 第二个参数用于判断用户传递的值是否是指令方法', () => {
    let result;
    let directiveFn;
    let fn;

    Hu.directive( 'test', class {
      commit( value, isDirectiveFn ){
        result = [ value, isDirectiveFn ];
      }
    });

    render( div )`
      <div :test=${ 1 }></div>
    `;
    expect( result ).is.deep.equals([ 1, false ]);

    render( div )`
      <div :test=${ '2' }></div>
    `;
    expect( result ).is.deep.equals([ '2', false ]);

    render( div )`
      <div :test=${ true }></div>
    `;
    expect( result ).is.deep.equals([ true, false ]);

    render( div )`
      <div :test=${ false }></div>
    `;
    expect( result ).is.deep.equals([ false, false ]);

    render( div )`
      <div :test=${ [] }></div>
    `;
    expect( result ).is.deep.equals([ [], false ]);

    render( div )`
      <div :test=${ {} }></div>
    `;
    expect( result ).is.deep.equals([ {}, false ]);

    render( div )`
      <div :test=${ fn = () => {} }></div>
    `;
    expect( result ).is.deep.equals([ fn, false ]);

    render( div )`
      <div :test=${ directiveFn = html.unsafe('') }></div>
    `;
    expect( result ).is.deep.equals([ directiveFn, true ]);
  });

  it( 'Hu.directive: 注册的指令只能在 DOM 元素上使用', () => {
    let result;

    Hu.directive( 'test', class {
      commit( value ){
        result = value;
      }
    });

    render( div )`
      <div :test=${ 1 }></div>
    `;
    expect( result ).is.equals( 1 );

    render( div )`
      <div :test=${ 2 }></div>
    `;
    expect( result ).is.equals( 2 );

    render( div )`
      <div>:test=${ 3 }</div>
    `;
    expect( result ).is.equals( 2 );
  });

  // it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 切换模板 )', () => {
  //   let constructorIndex = 0;
  //   let commitIndex = 0;
  //   let destroyIndex = 0;

  //   Hu.directive( 'test', class {
  //     constructor(){ constructorIndex++ }
  //     commit(){ commitIndex++ }
  //     destroy(){ destroyIndex++ }
  //   });


  //   Hu.render( div )`
  //     <div :test=${ null }></div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div></div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   // ------

  //   Hu.render( div )`
  //     <div :test=${ null }></div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   Hu.render( div )`
  //     <div></div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 2 );
  // });

  // it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 切换数组内的模板 )', () => {
  //   let constructorIndex = 0;
  //   let commitIndex = 0;
  //   let destroyIndex = 0;

  //   Hu.directive( 'test', class {
  //     constructor(){ constructorIndex++ }
  //     commit(){ commitIndex++ }
  //     destroy(){ destroyIndex++ }
  //   });


  //   Hu.render( div )`${
  //     [ 1, 2, 3 ].map(( num, index ) => {
  //       return Hu.html`<div :test=${ null }></div>`;
  //     })
  //   }`;
  //   expect( constructorIndex ).is.equals( 3 );
  //   expect( commitIndex ).is.equals( 3 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`${
  //     [ 1, 2, 3 ].map(( num, index ) => {
  //       return Hu.html`<div></div>`;
  //     })
  //   }`;
  //   expect( constructorIndex ).is.equals( 3 );
  //   expect( commitIndex ).is.equals( 3 );
  //   expect( destroyIndex ).is.equals( 3 );

  //   // ------

  //   Hu.render( div )`${
  //     [ 1, 2, 3 ].map(( num, index ) => {
  //       return Hu.html`<div :test=${ null }></div>`;
  //     })
  //   }`;
  //   expect( constructorIndex ).is.equals( 6 );
  //   expect( commitIndex ).is.equals( 6 );
  //   expect( destroyIndex ).is.equals( 3 );

  //   Hu.render( div )`${
  //     [ 1, 2, 3 ].map(( num, index ) => {
  //       return Hu.html`<div></div>`;
  //     })
  //   }`;
  //   expect( constructorIndex ).is.equals( 6 );
  //   expect( commitIndex ).is.equals( 6 );
  //   expect( destroyIndex ).is.equals( 6 );
  // });

  // it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 切换数组的数量 )', () => {
  //   let constructorIndex = 0;
  //   let commitIndex = 0;
  //   let destroyIndex = 0;

  //   Hu.directive( 'test', class {
  //     constructor(){ constructorIndex++ }
  //     commit(){ commitIndex++ }
  //     destroy(){ destroyIndex++ }
  //   });


  //   Hu.render( div )`${
  //     [ 1, 2, 3 ].map(( num, index ) => {
  //       return Hu.html`<div :test=${ null }></div>`;
  //     })
  //   }`;
  //   expect( constructorIndex ).is.equals( 3 );
  //   expect( commitIndex ).is.equals( 3 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`${
  //     [ 1, 2, 3, 4, 5, 6 ].map(( num, index ) => {
  //       return Hu.html`<div :test=${ null }></div>`;
  //     })
  //   }`;
  //   expect( constructorIndex ).is.equals( 6 );
  //   expect( commitIndex ).is.equals( 9 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`${
  //     [ 1, 2 ].map(( num, index ) => {
  //       return Hu.html`<div :test=${ null }></div>`;
  //     })
  //   }`;
  //   expect( constructorIndex ).is.equals( 6 );
  //   expect( commitIndex ).is.equals( 11 );
  //   expect( destroyIndex ).is.equals( 4 );

  //   Hu.render( div )`${
  //     null
  //   }`;
  //   expect( constructorIndex ).is.equals( 6 );
  //   expect( commitIndex ).is.equals( 11 );
  //   expect( destroyIndex ).is.equals( 6 );
  // });

  // it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 模板 )', () => {
  //   let constructorIndex = 0;
  //   let commitIndex = 0;
  //   let destroyIndex = 0;

  //   Hu.directive( 'test', class {
  //     constructor(){ constructorIndex++ }
  //     commit(){ commitIndex++ }
  //     destroy(){ destroyIndex++ }
  //   });


  //   Hu.render( div )`
  //     <div>${
  //       Hu.html`<div :test=${ null }><div>`
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${
  //       Hu.html`<div><div>`
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   // ------

  //   Hu.render( div )`
  //     <div>${
  //       Hu.html`<div :test=${ null }><div>`
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   Hu.render( div )`
  //     <div>${
  //       Hu.html`<div><div>`
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 2 );
  // });

  // it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 模板切换为原始对象 )', ( done ) => {
  //   const types = [
  //     undefined, null, NaN, Infinity,
  //     'undefined', 'null', 'asd', '',
  //     true, false,
  //     0, 1, 2,
  //     Symbol(), Symbol.iterator, Symbol(123)
  //   ];
  //   const promises = [];

  //   for( let index = 0, types1 = Array.$copy( types ); index < types1.length - 1; index++ ) promises.push(
  //     new Promise( resolve => {
  //       let constructorIndex = 0;
  //       let commitIndex = 0;
  //       let destroyIndex = 0;

  //       Hu.directive( 'test', class {
  //         constructor(){ constructorIndex++ }
  //         commit(){ commitIndex++ }
  //         destroy(){ destroyIndex++ }
  //       });


  //       Hu.render( div )`
  //         <div>${
  //           Hu.html`<div :test=${ null }></div>`
  //         }</div>
  //       `;
  //       expect( constructorIndex ).is.equals( 1 );
  //       expect( commitIndex ).is.equals( 1 );
  //       expect( destroyIndex ).is.equals( 0 );

  //       Hu.render( div )`
  //         <div>
  //           ${ types1[ index ] }
  //         </div>
  //       `;
  //       expect( constructorIndex ).is.equals( 1 );
  //       expect( commitIndex ).is.equals( 1 );
  //       expect( destroyIndex ).is.equals( 1 );

  //       // ------

  //       Hu.render( div )`
  //         <div>${
  //           Hu.html`<div :test=${ null }></div>`
  //         }</div>
  //       `;
  //       expect( constructorIndex ).is.equals( 2 );
  //       expect( commitIndex ).is.equals( 2 );
  //       expect( destroyIndex ).is.equals( 1 );

  //       Hu.render( div )`
  //         <div>
  //           ${ types1[ index ] }
  //         </div>
  //       `;
  //       expect( constructorIndex ).is.equals( 2 );
  //       expect( commitIndex ).is.equals( 2 );
  //       expect( destroyIndex ).is.equals( 2 );

  //       resolve();
  //     })
  //   );

  //   for( let index = 0, types1 = Array.$copy( types ).reverse(); index < types1.length - 1; index++ ) promises.push(
  //     new Promise( resolve => {
  //       let constructorIndex = 0;
  //       let commitIndex = 0;
  //       let destroyIndex = 0;

  //       Hu.directive( 'test', class {
  //         constructor(){ constructorIndex++ }
  //         commit(){ commitIndex++ }
  //         destroy(){ destroyIndex++ }
  //       });


  //       Hu.render( div )`
  //         <div>
  //           ${ Hu.html`<div :test=${ null }></div>` }
  //         </div>
  //       `;
  //       expect( constructorIndex ).is.equals( 1 );
  //       expect( commitIndex ).is.equals( 1 );
  //       expect( destroyIndex ).is.equals( 0 );

  //       Hu.render( div )`
  //         <div>
  //           ${ types1[ index ] }
  //         </div>
  //       `;
  //       expect( constructorIndex ).is.equals( 1 );
  //       expect( commitIndex ).is.equals( 1 );
  //       expect( destroyIndex ).is.equals( 1 );

  //       resolve();
  //     })
  //   );

  //   Promise.all( promises ).then(() => {
  //     done();
  //   });
  // });

  // it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 模板切换为数组 )', () => {
  //   let constructorIndex = 0;
  //   let commitIndex = 0;
  //   let destroyIndex = 0;

  //   Hu.directive( 'test', class {
  //     constructor(){ constructorIndex++ }
  //     commit(){ commitIndex++ }
  //     destroy(){ destroyIndex++ }
  //   });


  //   Hu.render( div )`
  //     <div>${
  //       Hu.html`<div :test=${ null }><div>`
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${
  //       [ 1, 2, 3]
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   // ------
  //   Hu.render( div )`
  //     <div>${
  //       Hu.html`<div :test=${ null }><div>`
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   Hu.render( div )`
  //     <div>${
  //       [ 1, 2, 3, 4, 5, 6 ]
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 2 );
  // });

  // it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 模板切换为 JSON 对象 )', () => {
  //   let constructorIndex = 0;
  //   let commitIndex = 0;
  //   let destroyIndex = 0;

  //   Hu.directive( 'test', class {
  //     constructor(){ constructorIndex++ }
  //     commit(){ commitIndex++ }
  //     destroy(){ destroyIndex++ }
  //   });


  //   Hu.render( div )`
  //     <div>${
  //       Hu.html`<div :test=${ null }><div>`
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${
  //       { a: 1 }
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   // ------
  //   Hu.render( div )`
  //     <div>${
  //       Hu.html`<div :test=${ null }><div>`
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   Hu.render( div )`
  //     <div>${
  //       { a: 1, b: 2, c: 3 }
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 2 );
  // });

  // it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 模板切换为元素节点 )', () => {
  //   let constructorIndex = 0;
  //   let commitIndex = 0;
  //   let destroyIndex = 0;

  //   Hu.directive( 'test', class {
  //     constructor(){ constructorIndex++ }
  //     commit(){ commitIndex++ }
  //     destroy(){ destroyIndex++ }
  //   });


  //   Hu.render( div )`
  //     <div>${
  //       Hu.html`<div :test=${ null }><div>`
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${
  //       document.createElement('div')
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   // ------
  //   Hu.render( div )`
  //     <div>${
  //       Hu.html`<div :test=${ null }><div>`
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   Hu.render( div )`
  //     <div>${
  //       document.createElement('span')
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 2 );
  // });

  // it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 模板切换为指令方法 )', () => {
  //   let constructorIndex = 0;
  //   let commitIndex = 0;
  //   let destroyIndex = 0;

  //   Hu.directive( 'test', class {
  //     constructor(){ constructorIndex++ }
  //     commit(){ commitIndex++ }
  //     destroy(){ destroyIndex++ }
  //   });


  //   Hu.render( div )`
  //     <div>${
  //       Hu.html`<div :test=${ null }><div>`
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${
  //       Hu.directiveFn( value => part => {

  //       })
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   // ------
  //   Hu.render( div )`
  //     <div>${
  //       Hu.html`<div :test=${ null }><div>`
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   Hu.render( div )`
  //     <div>${
  //       Hu.directiveFn( value => part => {

  //       })
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 2 );
  // });

  // it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 数组 )', () => {
  //   let constructorIndex = 0;
  //   let commitIndex = 0;
  //   let destroyIndex = 0;

  //   Hu.directive( 'test', class {
  //     constructor(){ constructorIndex++ }
  //     commit(){ commitIndex++ }
  //     destroy(){ destroyIndex++ }
  //   });


  //   Hu.render( div )`
  //     <div>${[
  //       Hu.html`<div :test=${ null }><div>`
  //     ]}</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${[
  //       Hu.html`<div><div>`
  //     ]}</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   // ------
  //   Hu.render( div )`
  //     <div>${[
  //       Hu.html`<div :test=${ null }><div>`
  //     ]}</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   Hu.render( div )`
  //     <div>${[
  //       Hu.html`<div><div>`
  //     ]}</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 2 );
  // });

  // it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 数组切换为原始对象 )', ( done ) => {
  //   const types = [
  //     undefined, null, NaN, Infinity,
  //     'undefined', 'null', 'asd', '',
  //     true, false,
  //     0, 1, 2,
  //     Symbol(), Symbol.iterator, Symbol(123)
  //   ];
  //   const promises = [];

  //   for( let index = 0, types1 = Array.$copy( types ); index < types1.length - 1; index++ ) promises.push(
  //     new Promise( resolve => {
  //       let constructorIndex = 0;
  //       let commitIndex = 0;
  //       let destroyIndex = 0;

  //       Hu.directive( 'test', class {
  //         constructor(){ constructorIndex++ }
  //         commit(){ commitIndex++ }
  //         destroy(){ destroyIndex++ }
  //       });


  //       Hu.render( div )`
  //         <div>${[
  //           Hu.html`<div :test=${ null }></div>`
  //         ]}</div>
  //       `;
  //       expect( constructorIndex ).is.equals( 1 );
  //       expect( commitIndex ).is.equals( 1 );
  //       expect( destroyIndex ).is.equals( 0 );

  //       Hu.render( div )`
  //         <div>
  //           ${ types1[ index ] }
  //         </div>
  //       `;
  //       expect( constructorIndex ).is.equals( 1 );
  //       expect( commitIndex ).is.equals( 1 );
  //       expect( destroyIndex ).is.equals( 1 );

  //       // ------

  //       Hu.render( div )`
  //         <div>${[
  //           Hu.html`<div :test=${ null }></div>`
  //         ]}</div>
  //       `;
  //       expect( constructorIndex ).is.equals( 2 );
  //       expect( commitIndex ).is.equals( 2 );
  //       expect( destroyIndex ).is.equals( 1 );

  //       Hu.render( div )`
  //         <div>
  //           ${ types1[ index ] }
  //         </div>
  //       `;
  //       expect( constructorIndex ).is.equals( 2 );
  //       expect( commitIndex ).is.equals( 2 );
  //       expect( destroyIndex ).is.equals( 2 );

  //       resolve();
  //     })
  //   );

  //   for( let index = 0, types1 = Array.$copy( types ).reverse(); index < types1.length - 1; index++ ) promises.push(
  //     new Promise( resolve => {
  //       let constructorIndex = 0;
  //       let commitIndex = 0;
  //       let destroyIndex = 0;

  //       Hu.directive( 'test', class {
  //         constructor(){ constructorIndex++ }
  //         commit(){ commitIndex++ }
  //         destroy(){ destroyIndex++ }
  //       });


  //       Hu.render( div )`
  //         <div>
  //           ${ Hu.html`<div :test=${ null }></div>` }
  //         </div>
  //       `;
  //       expect( constructorIndex ).is.equals( 1 );
  //       expect( commitIndex ).is.equals( 1 );
  //       expect( destroyIndex ).is.equals( 0 );

  //       Hu.render( div )`
  //         <div>
  //           ${ types1[ index ] }
  //         </div>
  //       `;
  //       expect( constructorIndex ).is.equals( 1 );
  //       expect( commitIndex ).is.equals( 1 );
  //       expect( destroyIndex ).is.equals( 1 );

  //       resolve();
  //     })
  //   );

  //   Promise.all( promises ).then(() => {
  //     done();
  //   });
  // });

  // it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 数组切换为 JSON 对象 )', () => {
  //   let constructorIndex = 0;
  //   let commitIndex = 0;
  //   let destroyIndex = 0;

  //   Hu.directive( 'test', class {
  //     constructor(){ constructorIndex++ }
  //     commit(){ commitIndex++ }
  //     destroy(){ destroyIndex++ }
  //   });


  //   Hu.render( div )`
  //     <div>${[
  //       Hu.html`<div :test=${ null }><div>`
  //     ]}</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${
  //       { a: 1 }
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   // ------
  //   Hu.render( div )`
  //     <div>${[
  //       Hu.html`<div :test=${ null }><div>`
  //     ]}</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   Hu.render( div )`
  //     <div>${
  //       { a: 1, b: 2, c: 3 }
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 2 );
  // });

  // it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 数组切换为元素节点 )', () => {
  //   let constructorIndex = 0;
  //   let commitIndex = 0;
  //   let destroyIndex = 0;

  //   Hu.directive( 'test', class {
  //     constructor(){ constructorIndex++ }
  //     commit(){ commitIndex++ }
  //     destroy(){ destroyIndex++ }
  //   });


  //   Hu.render( div )`
  //     <div>${[
  //       Hu.html`<div :test=${ null }><div>`
  //     ]}</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${
  //       document.createElement('div')
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   // ------
  //   Hu.render( div )`
  //     <div>${[
  //       Hu.html`<div :test=${ null }><div>`
  //     ]}</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   Hu.render( div )`
  //     <div>${
  //       document.createElement('span')
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 2 );
  // });

  // it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 数组切换为指令方法 )', () => {
  //   let constructorIndex = 0;
  //   let commitIndex = 0;
  //   let destroyIndex = 0;

  //   Hu.directive( 'test', class {
  //     constructor(){ constructorIndex++ }
  //     commit(){ commitIndex++ }
  //     destroy(){ destroyIndex++ }
  //   });


  //   Hu.render( div )`
  //     <div>${[
  //       Hu.html`<div :test=${ null }><div>`
  //     ]}</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${
  //       Hu.directiveFn( value => part => {

  //       })
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   // ------
  //   Hu.render( div )`
  //     <div>${[
  //       Hu.html`<div :test=${ null }><div>`
  //     ]}</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   Hu.render( div )`
  //     <div>${
  //       Hu.directiveFn( value => part => {

  //       })
  //     }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 2 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 2 );
  // });

});