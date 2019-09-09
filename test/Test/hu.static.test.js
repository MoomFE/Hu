describe( 'Hu.static', () => {

  /** @type {Element} */
  let div;
  beforeEach(() => {
    div = document.createElement('div').$appendTo( document.body );
  });
  afterEach(() => {
    div.$remove();
  });


  it( 'Hu.define: 方法用于注册一个全局的自定义元素', () => {
    const customName = window.customName;

    Hu.define( customName, {
      render( html ){
        return html`
          <div>custom-element</div>
        `;
      }
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    expect( stripExpressionMarkers( hu.$el.innerHTML ) ).is.equals(`
          <div>custom-element</div>
        `);

    custom.$remove();
  });

  it( 'Hu.define: 注册过的自定义元素不可再次注册', () => {
    const customName = window.customName;

    Hu.define( customName );

    should.throw(() => {
      Hu.define( customName );
    });
  });

  it( 'Hu.observable: 方法用于将传入对象转为观察者对象', ( done ) => {
    const data = Hu.observable({
      a: 1,
      b: 2
    });

    /* ------------------ 测试是否能被响应 ------------------ */
    let index = 0;
    const hu = new Hu({
      computed: {
        a: () => {
          index++;
          return data.a + data.b;
        }
      },
      watch: {
        a: () => {}
      }
    });

    expect( index ).is.equals( 1 );

    data.a = 2;
    hu.$nextTick(() => {
      expect( index ).is.equals( 2 );

      done();
    });
  });

  it( 'Hu.observable: 转换 JSON 格式类型, 确保转换完成后是有效的', ( done ) => {
    const data = Hu.observable({
      a: 1
    });

    // getter
    expect( data.a ).is.equals( 1 );

    // setter
    data.a = 2;
    expect( data.a ).is.equals( 2 );

    /* ------------------ 测试是否能被响应 ------------------ */
    let index = 0;
    const hu = new Hu({
      computed: {
        a: () => {
          index++;
          return data.a;
        }
      },
      watch: {
        a: () => {}
      }
    });

    expect( index ).is.equals( 1 );

    data.a = 1;
    hu.$nextTick(() => {
      expect( index ).is.equals( 2 );

      done();
    });
  });

  it( 'Hu.observable: 转换数组类型, 确保转换完成后是有效的', ( done ) => {
    const data = Hu.observable([
      1
    ]);

    // getter
    expect( data[0] ).is.equals( 1 );

    // setter
    data[0] = 2;
    expect( data[0] ).is.equals( 2 );

    /* ------------------ 测试是否能被响应 ------------------ */
    let index = 0;
    const hu = new Hu({
      computed: {
        a: () => {
          index++;
          return data[0];
        }
      },
      watch: {
        a: () => {}
      }
    });

    expect( index ).is.equals( 1 );

    data[0] = 1;
    hu.$nextTick(() => {
      expect( index ).is.equals( 2 );

      done();
    });
  });

  it( 'Hu.html: 创建用于渲染的模板', () => {
    const result = Hu.html`
      <div id=${ 'asd' }>${ 123 }</div>
    `;
    const getHTML = result.getHTML();
    const getTemplateElement = result.getTemplateElement();

    expect( getHTML ).is.equals(`
      <div id$hu$=${ templateMarker }><!--${ templateMarker }--></div>
    `);

    expect( getTemplateElement.nodeName ).is.equals('TEMPLATE');
    expect( getTemplateElement.innerHTML ).is.equals(`
      <div id$hu$="${ templateMarker }"><!--${ templateMarker }--></div>
    `);
  });

  it( 'Hu.html.svg: 创建用于 SVG 标签内部标签的模板', () => {
    const htmlResult = Hu.html`<text y="50%" dy="30%">123</text>`;
    const svgResult = Hu.html.svg`<text y="50%" dy="30%">123</text>`;

    Hu.render( div )`
      <svg>${ htmlResult }</svg>
    `;
    expect( getComputedStyle( div.querySelector('text') ) ).is.not.include({
      display: 'block'
    });

    Hu.render( div )`
      <svg>${ svgResult }</svg>
    `;
    expect( getComputedStyle( div.querySelector('text') ) ).is.include({
      display: 'block'
    });
  });

  it( 'Hu.render: 方法用于直接渲染一段模板片段', () => {
    const result = Hu.html`
      <div>${ 123 }</div>
    `;

    Hu.render( result, div );

    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>123</div>
    `);
  });

  it( 'Hu.render: 默认使用方式', () => {
    Hu.render(
      Hu.html`
        <div>${ 123 }</div>
      `,
      div
    );

    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
        <div>123</div>
      `);
  });

  it( 'Hu.render: 另一种使用方式', () => {
    Hu.render( div )`
      <div>${ 123 }</div>
    `;

    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>123</div>
    `);
  });

  it( 'Hu.nextTick: 方法用于在下次 DOM 更新循环结束之后执行延迟回调', ( done ) => {
    const data = Hu.observable({
      msg: 'hello'
    });

    Hu.render( div )`${
      Hu.html.bind( data, 'msg' )
    }`;

    expect( div.textContent ).is.equals('hello');

    data.msg += ' !';
    expect( div.textContent ).is.equals('hello');
    Hu.nextTick(() => {
      expect( div.textContent ).is.equals('hello !');

      done();
    });
  });

  it( 'Hu.noConflict: 方法用于释放 window.Hu 的控制权, 还原到导入框架前的状态', () => {
    const Hu = window.Hu;

    Hu.noConflict();
    expect( window.Hu ).is.undefined;

    window.Hu = Hu;
  });

  it( 'Hu.noConflict: 方法的返回值始终是 Hu 对象本身', () => {
    const Hu = window.Hu;
    const result = Hu.noConflict();
    const result2 = Hu.noConflict();

    expect( result ).is.equals( Hu );
    expect( result2 ).is.equals( Hu );

    window.Hu = Hu;
  });

  it( 'Hu.version: 字符串形式的 Hu 安装版本号', () => {
    expect( Hu.version ).is.a('string');
  });

  it( 'Hu.util: 共享出来的部分内部使用的方法', () => {
    let isRun = false;

    Reflect.ownKeys( Hu.util ).forEach( name => {
      isRun = true;
      expect( Hu.util[ name ] ).is.a('function');
    });

    expect( isRun ).is.true;
  });

  it( 'Hu.util.addEvent: 绑定事件', () => {
    let index = 0;

    Hu.util.addEvent( div, 'click', () => {
      index++;
    });

    expect( index ).is.equals( 0 );

    div.click();
    div.click();
    div.click();

    expect( index ).is.equals( 3 );
  });

  it( 'Hu.util.removeEvent: 移除事件', () => {
    let index = 0;
    const fn = () => index++;

    Hu.util.addEvent( div, 'click', fn );

    expect( index ).is.equals( 0 );

    div.click();
    div.click();
    div.click();

    expect( index ).is.equals( 3 );

    Hu.util.removeEvent( div, 'click', fn );

    div.click();
    div.click();
    div.click();

    expect( index ).is.equals( 3 );
  });

  it( 'Hu.util.each: 对象遍历方法', () => {
    const steps = [];
    const data = {
      a: 1,
      b: 2,
      c: 3
    };

    Hu.util.each( data, ( key, value ) => {
      steps.push( key, value );
    });

    expect( steps ).is.deep.equals([
      'a', 1, 'b', 2, 'c', 3
    ]);
  });

  it( 'Hu.util.toString: 将值转为字符串形式', () => {
    expect( Hu.util.toString( undefined ) ).is.equals('');
    expect( Hu.util.toString( null ) ).is.equals('');
    expect( Hu.util.toString( NaN ) ).is.equals('NaN');
    expect( Hu.util.toString( Infinity ) ).is.equals('Infinity');
    expect( Hu.util.toString( 'undefined' ) ).is.equals('undefined');
    expect( Hu.util.toString( 'null' ) ).is.equals('null');
    expect( Hu.util.toString( 'asd' ) ).is.equals('asd');
    expect( Hu.util.toString( '' ) ).is.equals('');
    expect( Hu.util.toString( {} ) ).is.equals('{}');
    expect( Hu.util.toString( { asd: 123 } ) ).is.equals('{\n  "asd": 123\n}');
    expect( Hu.util.toString( [] ) ).is.equals('[]');
    expect( Hu.util.toString( [ 1 ] ) ).is.equals('[\n  1\n]');
    expect( Hu.util.toString( true ) ).is.equals('true');
    expect( Hu.util.toString( false ) ).is.equals('false');
    expect( Hu.util.toString( 0 ) ).is.equals('0');
    expect( Hu.util.toString( 1 ) ).is.equals('1');
    expect( Hu.util.toString( 2 ) ).is.equals('2');
    expect( Hu.util.toString( Symbol() ) ).is.equals('Symbol()');
    expect( Hu.util.toString( Symbol.iterator ) ).is.equals('Symbol(Symbol.iterator)');
    expect( Hu.util.toString( Symbol(123) ) ).is.equals('Symbol(123)');
    expect( Hu.util.toString( function(){} ) ).is.equals('function(){}');
  });

  it( 'Hu.util.isPlainObject: 判断传入对象是否是纯粹的对象', () => {
    expect( Hu.util.isPlainObject( undefined ) ).is.false;
    expect( Hu.util.isPlainObject( null ) ).is.false;
    expect( Hu.util.isPlainObject( NaN ) ).is.false;
    expect( Hu.util.isPlainObject( Infinity ) ).is.false;
    expect( Hu.util.isPlainObject( 'undefined' ) ).is.false;
    expect( Hu.util.isPlainObject( 'null' ) ).is.false;
    expect( Hu.util.isPlainObject( 'asd' ) ).is.false;
    expect( Hu.util.isPlainObject( '' ) ).is.false;
    expect( Hu.util.isPlainObject( {} ) ).is.true;
    expect( Hu.util.isPlainObject( { asd: 123 } ) ).is.true;
    expect( Hu.util.isPlainObject( [] ) ).is.false;
    expect( Hu.util.isPlainObject( [ 1 ] ) ).is.false;
    expect( Hu.util.isPlainObject( true ) ).is.false;
    expect( Hu.util.isPlainObject( false ) ).is.false;
    expect( Hu.util.isPlainObject( 0 ) ).is.false;
    expect( Hu.util.isPlainObject( 1 ) ).is.false;
    expect( Hu.util.isPlainObject( 2 ) ).is.false;
    expect( Hu.util.isPlainObject( Symbol() ) ).is.false;
    expect( Hu.util.isPlainObject( Symbol.iterator ) ).is.false;
    expect( Hu.util.isPlainObject( Symbol(123) ) ).is.false;
    expect( Hu.util.isPlainObject( function(){} ) ).is.false;
  });

  it( 'Hu.util.isEmptyObject: 判断传入对象是否是一个空对象', () => {
    expect( Hu.util.isEmptyObject({}) ).is.true;
    expect( Hu.util.isEmptyObject({ a: 1 }) ).is.false;
  });

  it( 'Hu.util.isPrimitive: 判断传入对象是否是原始对象', () => {
    expect( Hu.util.isPrimitive( undefined ) ).is.true;
    expect( Hu.util.isPrimitive( null ) ).is.true;
    expect( Hu.util.isPrimitive( NaN ) ).is.true;
    expect( Hu.util.isPrimitive( Infinity ) ).is.true;
    expect( Hu.util.isPrimitive( 'undefined' ) ).is.true;
    expect( Hu.util.isPrimitive( 'null' ) ).is.true;
    expect( Hu.util.isPrimitive( 'asd' ) ).is.true;
    expect( Hu.util.isPrimitive( '' ) ).is.true;
    expect( Hu.util.isPrimitive( {} ) ).is.false;
    expect( Hu.util.isPrimitive( { asd: 123 } ) ).is.false;
    expect( Hu.util.isPrimitive( [] ) ).is.false;
    expect( Hu.util.isPrimitive( [ 1 ] ) ).is.false;
    expect( Hu.util.isPrimitive( true ) ).is.true;
    expect( Hu.util.isPrimitive( false ) ).is.true;
    expect( Hu.util.isPrimitive( 0 ) ).is.true;
    expect( Hu.util.isPrimitive( 1 ) ).is.true;
    expect( Hu.util.isPrimitive( 2 ) ).is.true;
    expect( Hu.util.isPrimitive( Symbol() ) ).is.true;
    expect( Hu.util.isPrimitive( Symbol.iterator ) ).is.true;
    expect( Hu.util.isPrimitive( Symbol(123) ) ).is.true;
    expect( Hu.util.isPrimitive( function(){} ) ).is.false;
  });

  it( 'Hu.util.isIterable: 判断传入对象是否可迭代', () => {
    expect( Hu.util.isIterable( undefined ) ).is.false;
    expect( Hu.util.isIterable( null ) ).is.false;
    expect( Hu.util.isIterable( NaN ) ).is.false;
    expect( Hu.util.isIterable( Infinity ) ).is.false;
    expect( Hu.util.isIterable( 'undefined' ) ).is.true;
    expect( Hu.util.isIterable( 'null' ) ).is.true;
    expect( Hu.util.isIterable( 'asd' ) ).is.true;
    expect( Hu.util.isIterable( '' ) ).is.true;
    expect( Hu.util.isIterable( {} ) ).is.false;
    expect( Hu.util.isIterable( { asd: 123 } ) ).is.false;
    expect( Hu.util.isIterable( [] ) ).is.true;
    expect( Hu.util.isIterable( [ 1 ] ) ).is.true;
    expect( Hu.util.isIterable( true ) ).is.false;
    expect( Hu.util.isIterable( false ) ).is.false;
    expect( Hu.util.isIterable( 0 ) ).is.false;
    expect( Hu.util.isIterable( 1 ) ).is.false;
    expect( Hu.util.isIterable( 2 ) ).is.false;
    expect( Hu.util.isIterable( Symbol() ) ).is.false;
    expect( Hu.util.isIterable( Symbol.iterator ) ).is.false;
    expect( Hu.util.isIterable( Symbol(123) ) ).is.false;
    expect( Hu.util.isIterable( function(){} ) ).is.false;
  });

  it( 'Hu.util.isEqual: 判断传入的两个值是否相等', () => {
    expect( Hu.util.isEqual( undefined, undefined ) ).is.true;
    expect( Hu.util.isEqual( null, null ) ).is.true;
    expect( Hu.util.isEqual( NaN, NaN ) ).is.true;
    expect( Hu.util.isEqual( Infinity, Infinity ) ).is.true;
    expect( Hu.util.isEqual( 'undefined', 'undefined' ) ).is.true;
    expect( Hu.util.isEqual( 'null', 'null' ) ).is.true;
    expect( Hu.util.isEqual( 'asd', 'asd' ) ).is.true;
    expect( Hu.util.isEqual( '', '' ) ).is.true;
    expect( Hu.util.isEqual( {}, {} ) ).is.false;
    expect( Hu.util.isEqual( { asd: 123 }, { asd: 123 } ) ).is.false;
    expect( Hu.util.isEqual( [], [] ) ).is.false;
    expect( Hu.util.isEqual( [ 1 ], [ 1 ] ) ).is.false;
    expect( Hu.util.isEqual( true, true ) ).is.true;
    expect( Hu.util.isEqual( false, false ) ).is.true;
    expect( Hu.util.isEqual( 0, 0 ) ).is.true;
    expect( Hu.util.isEqual( 1, 1 ) ).is.true;
    expect( Hu.util.isEqual( 2, 2 ) ).is.true;
    expect( Hu.util.isEqual( Symbol(), Symbol() ) ).is.false;
    expect( Hu.util.isEqual( Symbol.iterator, Symbol.iterator ) ).is.true;
    expect( Hu.util.isEqual( Symbol(123), Symbol(123) ) ).is.false;
    expect( Hu.util.isEqual( function(){}, function(){} ) ).is.false;
  });

  it( 'Hu.util.isNotEqual: 判断传入的两个值是否不相等', () => {
    expect( Hu.util.isNotEqual( undefined, undefined ) ).is.false;
    expect( Hu.util.isNotEqual( null, null ) ).is.false;
    expect( Hu.util.isNotEqual( NaN, NaN ) ).is.false;
    expect( Hu.util.isNotEqual( Infinity, Infinity ) ).is.false;
    expect( Hu.util.isNotEqual( 'undefined', 'undefined' ) ).is.false;
    expect( Hu.util.isNotEqual( 'null', 'null' ) ).is.false;
    expect( Hu.util.isNotEqual( 'asd', 'asd' ) ).is.false;
    expect( Hu.util.isNotEqual( '', '' ) ).is.false;
    expect( Hu.util.isNotEqual( {}, {} ) ).is.true;
    expect( Hu.util.isNotEqual( { asd: 123 }, { asd: 123 } ) ).is.true;
    expect( Hu.util.isNotEqual( [], [] ) ).is.true;
    expect( Hu.util.isNotEqual( [ 1 ], [ 1 ] ) ).is.true;
    expect( Hu.util.isNotEqual( true, true ) ).is.false;
    expect( Hu.util.isNotEqual( false, false ) ).is.false;
    expect( Hu.util.isNotEqual( 0, 0 ) ).is.false;
    expect( Hu.util.isNotEqual( 1, 1 ) ).is.false;
    expect( Hu.util.isNotEqual( 2, 2 ) ).is.false;
    expect( Hu.util.isNotEqual( Symbol(), Symbol() ) ).is.true;
    expect( Hu.util.isNotEqual( Symbol.iterator, Symbol.iterator ) ).is.false;
    expect( Hu.util.isNotEqual( Symbol(123), Symbol(123) ) ).is.true;
    expect( Hu.util.isNotEqual( function(){}, function(){} ) ).is.true;
  });

  it( 'Hu.util.isString: 判断传入对象是否是 String 类型', () => {
    expect( Hu.util.isString( undefined ) ).is.false;
    expect( Hu.util.isString( null ) ).is.false;
    expect( Hu.util.isString( NaN ) ).is.false;
    expect( Hu.util.isString( Infinity ) ).is.false;
    expect( Hu.util.isString( 'undefined' ) ).is.true;
    expect( Hu.util.isString( 'null' ) ).is.true;
    expect( Hu.util.isString( 'asd' ) ).is.true;
    expect( Hu.util.isString( '' ) ).is.true;
    expect( Hu.util.isString( {} ) ).is.false;
    expect( Hu.util.isString( { asd: 123 } ) ).is.false;
    expect( Hu.util.isString( [] ) ).is.false;
    expect( Hu.util.isString( [ 1 ] ) ).is.false;
    expect( Hu.util.isString( true ) ).is.false;
    expect( Hu.util.isString( false ) ).is.false;
    expect( Hu.util.isString( 0 ) ).is.false;
    expect( Hu.util.isString( 1 ) ).is.false;
    expect( Hu.util.isString( 2 ) ).is.false;
    expect( Hu.util.isString( Symbol() ) ).is.false;
    expect( Hu.util.isString( Symbol.iterator ) ).is.false;
    expect( Hu.util.isString( Symbol(123) ) ).is.false;
    expect( Hu.util.isString( function(){} ) ).is.false;
  });

  it( 'Hu.util.isObject: 判断传入对象是否是 Object 类型', () => {
    expect( Hu.util.isObject( undefined ) ).is.false;
    expect( Hu.util.isObject( null ) ).is.false;
    expect( Hu.util.isObject( NaN ) ).is.false;
    expect( Hu.util.isObject( Infinity ) ).is.false;
    expect( Hu.util.isObject( 'undefined' ) ).is.false;
    expect( Hu.util.isObject( 'null' ) ).is.false;
    expect( Hu.util.isObject( 'asd' ) ).is.false;
    expect( Hu.util.isObject( '' ) ).is.false;
    expect( Hu.util.isObject( {} ) ).is.true;
    expect( Hu.util.isObject( { asd: 123 } ) ).is.true;
    expect( Hu.util.isObject( [] ) ).is.true;
    expect( Hu.util.isObject( [ 1 ] ) ).is.true;
    expect( Hu.util.isObject( true ) ).is.false;
    expect( Hu.util.isObject( false ) ).is.false;
    expect( Hu.util.isObject( 0 ) ).is.false;
    expect( Hu.util.isObject( 1 ) ).is.false;
    expect( Hu.util.isObject( 2 ) ).is.false;
    expect( Hu.util.isObject( Symbol() ) ).is.false;
    expect( Hu.util.isObject( Symbol.iterator ) ).is.false;
    expect( Hu.util.isObject( Symbol(123) ) ).is.false;
    expect( Hu.util.isObject( function(){} ) ).is.false;
  });

  it( 'Hu.util.isFunction: 判断传入对象是否是 Function 类型', () => {
    expect( Hu.util.isFunction( undefined ) ).is.false;
    expect( Hu.util.isFunction( null ) ).is.false;
    expect( Hu.util.isFunction( NaN ) ).is.false;
    expect( Hu.util.isFunction( Infinity ) ).is.false;
    expect( Hu.util.isFunction( 'undefined' ) ).is.false;
    expect( Hu.util.isFunction( 'null' ) ).is.false;
    expect( Hu.util.isFunction( 'asd' ) ).is.false;
    expect( Hu.util.isFunction( '' ) ).is.false;
    expect( Hu.util.isFunction( {} ) ).is.false;
    expect( Hu.util.isFunction( { asd: 123 } ) ).is.false;
    expect( Hu.util.isFunction( [] ) ).is.false;
    expect( Hu.util.isFunction( [ 1 ] ) ).is.false;
    expect( Hu.util.isFunction( true ) ).is.false;
    expect( Hu.util.isFunction( false ) ).is.false;
    expect( Hu.util.isFunction( 0 ) ).is.false;
    expect( Hu.util.isFunction( 1 ) ).is.false;
    expect( Hu.util.isFunction( 2 ) ).is.false;
    expect( Hu.util.isFunction( Symbol() ) ).is.false;
    expect( Hu.util.isFunction( Symbol.iterator ) ).is.false;
    expect( Hu.util.isFunction( Symbol(123) ) ).is.false;
    expect( Hu.util.isFunction( function(){} ) ).is.true;
  });

  it( 'Hu.util.isSymbol: 判断传入对象是否是 Symbol 类型', () => {
    expect( Hu.util.isSymbol( undefined ) ).is.false;
    expect( Hu.util.isSymbol( null ) ).is.false;
    expect( Hu.util.isSymbol( NaN ) ).is.false;
    expect( Hu.util.isSymbol( Infinity ) ).is.false;
    expect( Hu.util.isSymbol( 'undefined' ) ).is.false;
    expect( Hu.util.isSymbol( 'null' ) ).is.false;
    expect( Hu.util.isSymbol( 'asd' ) ).is.false;
    expect( Hu.util.isSymbol( '' ) ).is.false;
    expect( Hu.util.isSymbol( {} ) ).is.false;
    expect( Hu.util.isSymbol( { asd: 123 } ) ).is.false;
    expect( Hu.util.isSymbol( [] ) ).is.false;
    expect( Hu.util.isSymbol( [ 1 ] ) ).is.false;
    expect( Hu.util.isSymbol( true ) ).is.false;
    expect( Hu.util.isSymbol( false ) ).is.false;
    expect( Hu.util.isSymbol( 0 ) ).is.false;
    expect( Hu.util.isSymbol( 1 ) ).is.false;
    expect( Hu.util.isSymbol( 2 ) ).is.false;
    expect( Hu.util.isSymbol( Symbol() ) ).is.true;
    expect( Hu.util.isSymbol( Symbol.iterator ) ).is.true;
    expect( Hu.util.isSymbol( Symbol(123) ) ).is.true;
    expect( Hu.util.isSymbol( function(){} ) ).is.false;
  });

  it( 'Hu.util.uid: 返回一个字符串 UID', () => {
    expect( Hu.util.uid() ).is.a('string');
    expect( Hu.util.uid() ).is.not.equals( Hu.util.uid() );
  });

  it( 'Hu.directive: 使用该方法可用于注册自定义指令', () => {
    const args = [];

    Hu.directive( 'test', class {
      constructor( element, strings, modifiers ){
        args.splice( 0, Infinity, ...arguments );
      }
      commit(){

      }
    });

    // 综合测试
    Hu.render( div )`
      <div :test=${ 1 }></div>
    `;
    expect( args ).is.deep.equals([
      div.firstElementChild,
      [ '', '' ],
      {}
    ]);

    // 第一个参数为绑定了指令的 DOM 元素
    Hu.render( div )`
      <span></span>
      <div :test=${ 1 }></div>
      <b></b>
    `;
    expect( args[0] ).is.equals( div.querySelector('div') );

    // 第二个参数为使用了指令时, 该指令除了插值绑定的其他部分
    Hu.render( div )`
      <div :test="I am ${ 'Hu' }.js"></div>
    `;
    expect( args[1] ).is.deep.equals([
      'I am ', '.js'
    ]);

    // 第三个参数为使用指令时使用的修饰符
    Hu.render( div )`
      <div :test.a.b.d=${ 123 }></div>
    `;
    expect( args[2] ).is.deep.equals({
      a: true,
      b: true,
      d: true
    });
  });

  it( 'Hu.directive: 注册的指令使用 commit 接受用户传递的值', () => {
    const result = [];

    Hu.directive( 'test', class {
      commit( value ){
        result.push( value );
      }
    });

    Hu.render( div )`
      <div :test=${ 1 }></div>
      <div :test=${ '2' }></div>
      <div :test=${ true }></div>
      <div :test=${ false }></div>
      <div :test=${ [] }></div>
      <div :test=${ {} }></div>
    `;

    expect( result ).is.deep.equals([
      1, '2',
      true, false,
      [], {}
    ]);
  });

  it( 'Hu.directive: 注册的指令使用 commit 接受用户传递的值, 第二个参数用于判断用户传递的值是否是指令方法', () => {
    const result = [];
    let directiveFn;
    let fn;

    Hu.directive( 'test', class {
      commit( value, isDirectiveFn ){
        result.splice( 0, Infinity, value, isDirectiveFn );
      }
    });

    Hu.render( div )`
      <div :test=${ 123 }></div>
    `;
    expect( result ).is.deep.equals([ 123, false ]);

    Hu.render( div )`
      <div :test=${ directiveFn = Hu.html.unsafe('') }></div>
    `;
    expect( result ).is.deep.equals([ directiveFn, true ]);

    Hu.render( div )`
      <div :test=${ fn = () => {} }></div>
    `;
    expect( result ).is.deep.equals([ fn, false ]);
  });

  it( 'Hu.directive: 注册的指令只能在 DOM 元素上使用', () => {
    const result = [];

    Hu.directive( 'test', class {
      commit( value ){
        result.push( value );
      }
    });

    Hu.render( div )`
      <div :test=${ 1 }>:test=${ 2 }</div>
      <div :test=${ 3 }>:test=${ 4 }</div>
    `;

    expect( result ).is.deep.equals([
      1, 3
    ]);
  });

  it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 切换模板 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'test', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });


    Hu.render( div )`
      <div :test=${ null }></div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div></div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    // ------

    Hu.render( div )`
      <div :test=${ null }></div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render( div )`
      <div></div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 切换数组内的模板 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'test', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });


    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div :test=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 3 );
    expect( commitIndex ).is.equals( 3 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 3 );
    expect( commitIndex ).is.equals( 3 );
    expect( destroyIndex ).is.equals( 3 );

    // ------

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div :test=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 6 );
    expect( commitIndex ).is.equals( 6 );
    expect( destroyIndex ).is.equals( 3 );

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 6 );
    expect( commitIndex ).is.equals( 6 );
    expect( destroyIndex ).is.equals( 6 );
  });

  it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 切换数组的数量 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'test', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });


    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div :test=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 3 );
    expect( commitIndex ).is.equals( 3 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`${
      [ 1, 2, 3, 4, 5, 6 ].map(( num, index ) => {
        return Hu.html`<div :test=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 6 );
    expect( commitIndex ).is.equals( 9 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`${
      [ 1, 2 ].map(( num, index ) => {
        return Hu.html`<div :test=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 6 );
    expect( commitIndex ).is.equals( 11 );
    expect( destroyIndex ).is.equals( 4 );

    Hu.render( div )`${
      null
    }`;
    expect( constructorIndex ).is.equals( 6 );
    expect( commitIndex ).is.equals( 11 );
    expect( destroyIndex ).is.equals( 6 );
  });

  it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 模板 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'test', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });


    Hu.render( div )`
      <div>${
        Hu.html`<div :test=${ null }><div>`
      }</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${
        Hu.html`<div><div>`
      }</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    // ------
    Hu.render( div )`
      <div>${
        Hu.html`<div :test=${ null }><div>`
      }</div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render( div )`
      <div>${
        Hu.html`<div><div>`
      }</div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 模板切换为原始对象 )', ( done ) => {
    const types = [
      undefined, null, NaN, Infinity,
      'undefined', 'null', 'asd', '',
      true, false,
      0, 1, 2,
      Symbol(), Symbol.iterator, Symbol(123)
    ];
    const promises = [];

    for( let index = 0, types1 = Array.$copy( types ); index < types1.length - 1; index++ ) promises.push(
      new Promise( resolve => {
        let constructorIndex = 0;
        let commitIndex = 0;
        let destroyIndex = 0;

        Hu.directive( 'test', class {
          constructor(){ constructorIndex++ }
          commit(){ commitIndex++ }
          destroy(){ destroyIndex++ }
        });


        Hu.render( div )`
          <div>${
            Hu.html`<div :test=${ null }></div>`
          }</div>
        `;
        expect( constructorIndex ).is.equals( 1 );
        expect( commitIndex ).is.equals( 1 );
        expect( destroyIndex ).is.equals( 0 );

        Hu.render( div )`
          <div>
            ${ types1[ index ] }
          </div>
        `;
        expect( constructorIndex ).is.equals( 1 );
        expect( commitIndex ).is.equals( 1 );
        expect( destroyIndex ).is.equals( 1 );

        // ------

        Hu.render( div )`
          <div>${
            Hu.html`<div :test=${ null }></div>`
          }</div>
        `;
        expect( constructorIndex ).is.equals( 2 );
        expect( commitIndex ).is.equals( 2 );
        expect( destroyIndex ).is.equals( 1 );

        Hu.render( div )`
          <div>
            ${ types1[ index ] }
          </div>
        `;
        expect( constructorIndex ).is.equals( 2 );
        expect( commitIndex ).is.equals( 2 );
        expect( destroyIndex ).is.equals( 2 );

        resolve();
      })
    );

    for( let index = 0, types1 = Array.$copy( types ).reverse(); index < types1.length - 1; index++ ) promises.push(
      new Promise( resolve => {
        let constructorIndex = 0;
        let commitIndex = 0;
        let destroyIndex = 0;

        Hu.directive( 'test', class {
          constructor(){ constructorIndex++ }
          commit(){ commitIndex++ }
          destroy(){ destroyIndex++ }
        });


        Hu.render( div )`
          <div>
            ${ Hu.html`<div :test=${ null }></div>` }
          </div>
        `;
        expect( constructorIndex ).is.equals( 1 );
        expect( commitIndex ).is.equals( 1 );
        expect( destroyIndex ).is.equals( 0 );

        Hu.render( div )`
          <div>
            ${ types1[ index ] }
          </div>
        `;
        expect( constructorIndex ).is.equals( 1 );
        expect( commitIndex ).is.equals( 1 );
        expect( destroyIndex ).is.equals( 1 );

        resolve();
      })
    );

    Promise.all( promises ).then(() => {
      done();
    });
  });

  it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 模板切换为数组 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'test', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });


    Hu.render( div )`
      <div>${
        Hu.html`<div :test=${ null }><div>`
      }</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${
        [ 1, 2, 3]
      }</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    // ------
    Hu.render( div )`
      <div>${
        Hu.html`<div :test=${ null }><div>`
      }</div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render( div )`
      <div>${
        [ 1, 2, 3, 4, 5, 6 ]
      }</div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 模板切换为 JSON 对象 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'test', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });


    Hu.render( div )`
      <div>${
        Hu.html`<div :test=${ null }><div>`
      }</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${
        { a: 1 }
      }</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    // ------
    Hu.render( div )`
      <div>${
        Hu.html`<div :test=${ null }><div>`
      }</div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render( div )`
      <div>${
        { a: 1, b: 2, c: 3 }
      }</div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 模板切换为元素节点 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'test', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });


    Hu.render( div )`
      <div>${
        Hu.html`<div :test=${ null }><div>`
      }</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${
        document.createElement('div')
      }</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    // ------
    Hu.render( div )`
      <div>${
        Hu.html`<div :test=${ null }><div>`
      }</div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render( div )`
      <div>${
        document.createElement('span')
      }</div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 数组 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'test', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });


    Hu.render( div )`
      <div>${[
        Hu.html`<div :test=${ null }><div>`
      ]}</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${[
        Hu.html`<div><div>`
      ]}</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    // ------
    Hu.render( div )`
      <div>${[
        Hu.html`<div :test=${ null }><div>`
      ]}</div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render( div )`
      <div>${[
        Hu.html`<div><div>`
      ]}</div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 数组切换为原始对象 )', ( done ) => {
    const types = [
      undefined, null, NaN, Infinity,
      'undefined', 'null', 'asd', '',
      true, false,
      0, 1, 2,
      Symbol(), Symbol.iterator, Symbol(123)
    ];
    const promises = [];

    for( let index = 0, types1 = Array.$copy( types ); index < types1.length - 1; index++ ) promises.push(
      new Promise( resolve => {
        let constructorIndex = 0;
        let commitIndex = 0;
        let destroyIndex = 0;

        Hu.directive( 'test', class {
          constructor(){ constructorIndex++ }
          commit(){ commitIndex++ }
          destroy(){ destroyIndex++ }
        });


        Hu.render( div )`
          <div>${[
            Hu.html`<div :test=${ null }></div>`
          ]}</div>
        `;
        expect( constructorIndex ).is.equals( 1 );
        expect( commitIndex ).is.equals( 1 );
        expect( destroyIndex ).is.equals( 0 );

        Hu.render( div )`
          <div>
            ${ types1[ index ] }
          </div>
        `;
        expect( constructorIndex ).is.equals( 1 );
        expect( commitIndex ).is.equals( 1 );
        expect( destroyIndex ).is.equals( 1 );

        // ------

        Hu.render( div )`
          <div>${[
            Hu.html`<div :test=${ null }></div>`
          ]}</div>
        `;
        expect( constructorIndex ).is.equals( 2 );
        expect( commitIndex ).is.equals( 2 );
        expect( destroyIndex ).is.equals( 1 );

        Hu.render( div )`
          <div>
            ${ types1[ index ] }
          </div>
        `;
        expect( constructorIndex ).is.equals( 2 );
        expect( commitIndex ).is.equals( 2 );
        expect( destroyIndex ).is.equals( 2 );

        resolve();
      })
    );

    for( let index = 0, types1 = Array.$copy( types ).reverse(); index < types1.length - 1; index++ ) promises.push(
      new Promise( resolve => {
        let constructorIndex = 0;
        let commitIndex = 0;
        let destroyIndex = 0;

        Hu.directive( 'test', class {
          constructor(){ constructorIndex++ }
          commit(){ commitIndex++ }
          destroy(){ destroyIndex++ }
        });


        Hu.render( div )`
          <div>
            ${ Hu.html`<div :test=${ null }></div>` }
          </div>
        `;
        expect( constructorIndex ).is.equals( 1 );
        expect( commitIndex ).is.equals( 1 );
        expect( destroyIndex ).is.equals( 0 );

        Hu.render( div )`
          <div>
            ${ types1[ index ] }
          </div>
        `;
        expect( constructorIndex ).is.equals( 1 );
        expect( commitIndex ).is.equals( 1 );
        expect( destroyIndex ).is.equals( 1 );

        resolve();
      })
    );

    Promise.all( promises ).then(() => {
      done();
    });
  });

  it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 数组切换为 JSON 对象 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'test', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });


    Hu.render( div )`
      <div>${[
        Hu.html`<div :test=${ null }><div>`
      ]}</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${
        { a: 1 }
      }</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    // ------
    Hu.render( div )`
      <div>${[
        Hu.html`<div :test=${ null }><div>`
      ]}</div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render( div )`
      <div>${
        { a: 1, b: 2, c: 3 }
      }</div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  it( 'Hu.directive: 注册的指令在被弃用时会触发 destroy 方法 ( 插值内切换: 数组切换为元素节点 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'test', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });


    Hu.render( div )`
      <div>${[
        Hu.html`<div :test=${ null }><div>`
      ]}</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${
        document.createElement('div')
      }</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    // ------
    Hu.render( div )`
      <div>${[
        Hu.html`<div :test=${ null }><div>`
      ]}</div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render( div )`
      <div>${
        document.createElement('span')
      }</div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  // it( '注册的指令方法可以被正确调用 ( 在 render 方法中使用 )', () => {
  //   let result;
  //   const fn = Hu.directiveFn(( value ) => part => {
  //     result = value;
  //   });

  //   Hu.render(
  //     fn( 123 ),
  //     div
  //   );
  //   expect( result ).is.equals( 123 );
  // });

  // it( '注册的指令方法可以被正确调用 ( 在指令中使用 )', () => {
  //   let result;
  //   const fn = Hu.directiveFn(( value ) => part => {
  //     result = value;
  //   });

  //   Hu.render( div )`
  //     <div :text=${ fn( 123 ) }></div>
  //   `;
  //   expect( result ).is.equals( 123 );
  // });

  // it( '注册的指令方法可以被正确调用 ( 在 NodePart 中使用 )', () => {
  //   let result;
  //   const fn = Hu.directiveFn(( value ) => part => {
  //     result = value;
  //   });

  //   Hu.render( div )`
  //     <div>${ fn( 123 ) }</div>
  //   `;
  //   expect( result ).is.equals( 123 );
  // });

  // it( '注册的指令方法可以被正确调用 ( 在 NodePart 数组方式中使用 )', () => {
  //   let result;
  //   const fn = Hu.directiveFn(( value ) => part => {
  //     result = value;
  //   });

  //   Hu.render( div )`
  //     <div>${[ fn( 123 ) ]}</div>
  //   `;
  //   expect( result ).is.equals( 123 );
  // });

  // it( '注册的指令方法可以被正确调用 ( 在 repeat 指令方法中使用 )', () => {
  //   let result;
  //   const fn = Hu.directiveFn(( value ) => part => {
  //     result = value;
  //   });

  //   Hu.render( div )`
  //     <div>${
  //       Hu.html.repeat( [ 123 ], val => val, val => {
  //         return fn( val );
  //       })
  //     }</div>
  //   `;
  //   expect( result ).is.equals( 123 );
  // });

  // it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 render 方法中使用 )', () => {
  //   let commitPart;
  //   let destroyPart;
  //   const fn = Hu.directiveFn(( value ) => [
  //     part => commitPart = part,
  //     part => destroyPart = part
  //   ]);

  //   Hu.render(
  //     fn( 123 ),
  //     div
  //   );
  //   expect( commitPart ).is.not.undefined;
  //   expect( destroyPart ).is.undefined;

  //   Hu.render( '123', div );
  //   expect( commitPart ).is.not.undefined;
  //   expect( destroyPart ).is.not.undefined;
  //   expect( commitPart ).is.equals( destroyPart );
  // });

  // it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在指令中使用 )', () => {
  //   let commitPart;
  //   let destroyPart;
  //   const fn = Hu.directiveFn(( value ) => [
  //     part => commitPart = part,
  //     part => destroyPart = part
  //   ]);

  //   Hu.render( div )`
  //     <div :text=${ fn( 123 ) }></div>
  //   `;
  //   expect( commitPart ).is.not.undefined;
  //   expect( destroyPart ).is.undefined;

  //   Hu.render( div )`
  //     <div></div>
  //   `;
  //   expect( commitPart ).is.not.undefined;
  //   expect( destroyPart ).is.not.undefined;
  //   expect( commitPart ).is.equals( destroyPart );
  // });

  // it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 NodePart 中使用 )', () => {
  //   let commitPart;
  //   let destroyPart;
  //   const fn = Hu.directiveFn(( value ) => [
  //     part => commitPart = part,
  //     part => destroyPart = part
  //   ]);

  //   Hu.render( div )`
  //     <div>${ fn( 123 ) }</div>
  //   `;
  //   expect( commitPart ).is.not.undefined;
  //   expect( destroyPart ).is.undefined;

  //   Hu.render( div )`
  //     <div></div>
  //   `;
  //   expect( commitPart ).is.not.undefined;
  //   expect( destroyPart ).is.not.undefined;
  //   expect( commitPart ).is.equals( destroyPart );
  // });

  // it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 NodePart 数组方式中使用 )', () => {
  //   let commitPart;
  //   let destroyPart;
  //   const fn = Hu.directiveFn(( value ) => [
  //     part => commitPart = part,
  //     part => destroyPart = part
  //   ]);

  //   Hu.render( div )`
  //     <div>${[ fn( 123 ) ]}</div>
  //   `;
  //   expect( commitPart ).is.not.undefined;
  //   expect( destroyPart ).is.undefined;

  //   Hu.render( div )`
  //     <div></div>
  //   `;
  //   expect( commitPart ).is.not.undefined;
  //   expect( destroyPart ).is.not.undefined;
  //   expect( commitPart ).is.equals( destroyPart );
  // });

  // it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 repeat 指令方法中使用 )', () => {
  //   let commitPart;
  //   let destroyPart;
  //   const fn = Hu.directiveFn(( value ) => [
  //     part => commitPart = part,
  //     part => destroyPart = part
  //   ]);

  //   Hu.render( div )`
  //     <div>${
  //       Hu.html.repeat( [ 123 ], val => val, val => {
  //         return fn( val );
  //       })
  //     }</div>
  //   `;
  //   expect( commitPart ).is.not.undefined;
  //   expect( destroyPart ).is.undefined;

  //   Hu.render( div )`
  //     <div></div>
  //   `;
  //   expect( commitPart ).is.not.undefined;
  //   expect( destroyPart ).is.not.undefined;
  //   expect( commitPart ).is.equals( destroyPart );
  // });

  // it( '在同一插值绑定内首次传入的是指令方法, 第二次传入的并非指令方法, 首次传入的指令方法会被注销', () => {
  //   let commitPart;
  //   let destroyPart;
  //   const fn = Hu.directiveFn(( value ) => [
  //     part => commitPart = part,
  //     part => destroyPart = part
  //   ]);

  //   Hu.render( div )`
  //     <div>${ fn( 123 ) }</div>
  //   `;
  //   expect( commitPart ).is.not.undefined;
  //   expect( destroyPart ).is.undefined;

  //   Hu.render( div )`
  //     <div>${ 123 }</div>
  //   `;
  //   expect( commitPart ).is.not.undefined;
  //   expect( destroyPart ).is.not.undefined;
  //   expect( commitPart ).is.equals( destroyPart );
  // });

  // it( '在同一插值绑定内首次使用的并非指令方法, 第二次传入的是指令方法, 指令方法可以正常使用', () => {
  //   let commitPart;
  //   let destroyPart;
  //   const fn = Hu.directiveFn(( value ) => [
  //     part => commitPart = part,
  //     part => destroyPart = part
  //   ]);

  //   Hu.render( div )`
  //     <div>${ 123 }</div>
  //   `;
  //   expect( commitPart ).is.undefined;
  //   expect( destroyPart ).is.undefined;

  //   Hu.render( div )`
  //     <div>${ fn( 123 ) }</div>
  //   `;
  //   expect( commitPart ).is.not.undefined;
  //   expect( destroyPart ).is.undefined;

  //   Hu.render( div )`
  //     <div>${ 123 }</div>
  //   `;
  //   expect( commitPart ).is.not.undefined;
  //   expect( destroyPart ).is.not.undefined;
  //   expect( commitPart ).is.equals( destroyPart );
  // });

  // it( '在同一插值绑定内两次传入的不是同一个指令方法时, 首次传入的指令方法会被注销', () => {
  //   let commitPart1, destroyPart1;
  //   let commitPart2, destroyPart2;
  //   const fn1 = Hu.directiveFn(( value ) => [
  //     part => commitPart1 = part,
  //     part => destroyPart1 = part
  //   ]);
  //   const fn2 = Hu.directiveFn(( value ) => [
  //     part => commitPart2 = part,
  //     part => destroyPart2 = part
  //   ]);

  //   Hu.render( div )`
  //     <div>${ fn1( 123 ) }</div>
  //   `;
  //   expect( commitPart1 ).is.not.undefined;
  //   expect( destroyPart1 ).is.undefined;
  //   expect( commitPart2 ).is.undefined;
  //   expect( destroyPart2 ).is.undefined;

  //   Hu.render( div )`
  //     <div>${ fn2( 123 ) }</div>
  //   `;
  //   expect( commitPart1 ).is.not.undefined;
  //   expect( destroyPart1 ).is.not.undefined;
  //   expect( commitPart2 ).is.not.undefined;
  //   expect( destroyPart2 ).is.undefined;
  //   expect( commitPart1 ).is.equals( destroyPart1 );

  //   Hu.render( div )`
  //     <div>${ '' }</div>
  //   `;
  //   expect( commitPart1 ).is.not.undefined;
  //   expect( destroyPart1 ).is.not.undefined;
  //   expect( commitPart2 ).is.not.undefined;
  //   expect( destroyPart2 ).is.not.undefined;
  //   expect( commitPart1 ).is.equals( destroyPart1 );
  //   expect( commitPart2 ).is.equals( destroyPart2 );
  // });

});