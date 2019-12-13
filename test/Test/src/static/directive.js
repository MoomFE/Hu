import Hu from '../../../../src/build/index';
import { expect } from 'chai';


describe( 'Hu.static.directive', () => {

  /** @type {Element} */
  let div;
  beforeEach(() => {
    div = document.createElement('div').$appendTo( document.body );
  });
  afterEach(() => {
    div.$remove();
  });

  // it( 'Hu.directive: 使用该方法可用于注册自定义指令', () => {
  //   const args = [];

  //   Hu.directive( 'test', class {
  //     constructor( element, strings, modifiers ){
  //       args.splice( 0, Infinity, ...arguments );
  //     }
  //     commit(){

  //     }
  //   });

  //   // 综合测试
  //   Hu.render( div )`
  //     <div :test=${ 1 }></div>
  //   `;
  //   expect( args ).is.deep.equals([
  //     div.firstElementChild,
  //     [ '', '' ],
  //     {}
  //   ]);

  //   // 第一个参数为绑定了指令的 DOM 元素
  //   Hu.render( div )`
  //     <span></span>
  //     <div :test=${ 1 }></div>
  //     <b></b>
  //   `;
  //   expect( args[0] ).is.equals( div.querySelector('div') );

  //   // 第二个参数为使用了指令时, 该指令除了插值绑定的其他部分
  //   Hu.render( div )`
  //     <div :test="I am ${ 'Hu' }.js"></div>
  //   `;
  //   expect( args[1] ).is.deep.equals([
  //     'I am ', '.js'
  //   ]);

  //   // 第三个参数为使用指令时使用的修饰符
  //   Hu.render( div )`
  //     <div :test.a.b.d=${ 123 }></div>
  //   `;
  //   expect( args[2] ).is.deep.equals({
  //     a: true,
  //     b: true,
  //     d: true
  //   });
  // });

  // it( 'Hu.directive: 注册的指令使用 commit 接受用户传递的值', () => {
  //   const result = [];

  //   Hu.directive( 'test', class {
  //     commit( value ){
  //       result.push( value );
  //     }
  //   });

  //   Hu.render( div )`
  //     <div :test=${ 1 }></div>
  //     <div :test=${ '2' }></div>
  //     <div :test=${ true }></div>
  //     <div :test=${ false }></div>
  //     <div :test=${ [] }></div>
  //     <div :test=${ {} }></div>
  //   `;

  //   expect( result ).is.deep.equals([
  //     1, '2',
  //     true, false,
  //     [], {}
  //   ]);
  // });

  // it( 'Hu.directive: 注册的指令使用 commit 接受用户传递的值, 第二个参数用于判断用户传递的值是否是指令方法', () => {
  //   const result = [];
  //   let directiveFn;
  //   let fn;

  //   Hu.directive( 'test', class {
  //     commit( value, isDirectiveFn ){
  //       result.splice( 0, Infinity, value, isDirectiveFn );
  //     }
  //   });

  //   Hu.render( div )`
  //     <div :test=${ 123 }></div>
  //   `;
  //   expect( result ).is.deep.equals([ 123, false ]);

  //   Hu.render( div )`
  //     <div :test=${ directiveFn = Hu.html.unsafe('') }></div>
  //   `;
  //   expect( result ).is.deep.equals([ directiveFn, true ]);

  //   Hu.render( div )`
  //     <div :test=${ fn = () => {} }></div>
  //   `;
  //   expect( result ).is.deep.equals([ fn, false ]);
  // });

  // it( 'Hu.directive: 注册的指令只能在 DOM 元素上使用', () => {
  //   const result = [];

  //   Hu.directive( 'test', class {
  //     commit( value ){
  //       result.push( value );
  //     }
  //   });

  //   Hu.render( div )`
  //     <div :test=${ 1 }>:test=${ 2 }</div>
  //     <div :test=${ 3 }>:test=${ 4 }</div>
  //   `;

  //   expect( result ).is.deep.equals([
  //     1, 3
  //   ]);
  // });

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