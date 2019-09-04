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

  it('------ ------ ------ ------ ------ ------ ------ ------ ------ 等待 #13 解决后再重构 ------ ------ ------ ------ ------ ------ ------ ------ ------');

  it( '注册的指令使用 constructor 接收使用指令处的相关信息', () => {
    const args = [];

    Hu.directive( 'asd', class {
      commit(){}
      constructor( element, name, strings, modifiers ){
        args.splice( 0, Infinity, ...arguments );
      }
    });

    Hu.render( div )`
      <div :asd=${ 1 }></div>
    `;

    expect( args ).is.deep.equals([
      div.firstElementChild,
      'asd',
      [ '', '' ],
      {}
    ]);
  });

  it( '注册的指令只在元素上使用时会生效', () => {
    const result = [];

    Hu.directive( 'asd', class {
      commit( value ){
        result.push( value );
      }
    });

    Hu.render( div )`
      <div :asd=${ 1 }>:asd=${ 2 }</div>
      <div :asd=${ 3 }>:asd=${ 4 }</div>
    `;

    expect( result ).is.deep.equals([ 1, 3 ]);
  });

  it( '注册的指令使用 commit 接收用户传递的值', () => {
    const result = [];

    Hu.directive( 'asd', class {
      commit( value ){
        result.push( value );
      }
    });

    Hu.render( div )`
      <div :asd=${ 1 }></div>
      <div :asd=${ '2' }></div>
      <div :asd=${ true }></div>
      <div :asd=${ false }></div>
      <div :asd=${ [] }></div>
      <div :asd=${ {} }></div>
    `;

    expect( result ).is.deep.equals([
      1, '2',
      true, false,
      [], {}
    ]);
  });

  it( '注册的指令使用 commit 接收用户传递的值, 第二个参数用于判断用户传递的值是否是指令方法', () => {
    const result = [];
    let directiveFn;
    let fn;

    Hu.directive( 'asd', class {
      commit( value, isDirectiveFn ){
        result.splice( 0, 2, value, isDirectiveFn );
      }
    });

    Hu.render( div )`
      <div :asd=${ 123 }></div>
    `;
    expect( result ).is.deep.equals([ 123, false ]);

    Hu.render( div )`
      <div :asd=${ directiveFn = Hu.html.unsafe('') }></div>
    `;
    expect( result ).is.deep.equals([ directiveFn, true ]);

    Hu.render( div )`
      <div :asd=${ fn = () => {} }></div>
    `;
    expect( result ).is.deep.equals([ fn, false ]);
  });

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 切换模板 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`
      <div :asd=${ null }></div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    // 再测试

    Hu.render( div )`
      <div></div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render( div )`
      <div :asd=${ null }></div>
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

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 切换插值内的模板 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`
      <div>
        ${ Hu.html`<div :asd=${ null }></div>` }
      </div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>
        ${ Hu.html`<div></div>` }
      </div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    // 再测试

    Hu.render( div )`
      <div>
        ${ Hu.html`<div :asd=${ null }></div>` }
      </div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render( div )`
      <div>
        ${ Hu.html`<div></div>` }
      </div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 切换数组内的模板 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
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

    // 再测试

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
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

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 切换数组的数量 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 3 );
    expect( commitIndex ).is.equals( 3 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`${
      [ 1, 2, 3, 5, 6 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 5 );
    expect( commitIndex ).is.equals( 8 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`${
      [ 1 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 5 );
    expect( commitIndex ).is.equals( 9 );
    expect( destroyIndex ).is.equals( 4 );

    // 再测试

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 7 );
    expect( commitIndex ).is.equals( 12 );
    expect( destroyIndex ).is.equals( 4 );

    Hu.render( div )`${
      [ 1, 2, 3, 5, 6 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 9 );
    expect( commitIndex ).is.equals( 17 );
    expect( destroyIndex ).is.equals( 4 );

    Hu.render( div )`${
      [ 1 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 9 );
    expect( commitIndex ).is.equals( 18 );
    expect( destroyIndex ).is.equals( 8 );
  });

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 模板切换为原始对象 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`
      <div>
        ${ Hu.html`<div :asd=${ null }></div>` }
      </div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>
        ${ 123 }
      </div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );
  });

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 模板切换为数组对象 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`
      <div>
        ${ Hu.html`<div :asd=${ null }></div>` }
      </div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>
        ${[ ]}
      </div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );
  });

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 模板切换为 JSON 对象 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`
      <div>
        ${ Hu.html`<div :asd=${ null }></div>` }
      </div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>
        ${{ }}
      </div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );
  });

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 模板切换为元素节点 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`
      <div>
        ${ Hu.html`<div :asd=${ null }></div>` }
      </div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>
        ${ document.createElement('div') }
      </div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );
  });

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 数组切换为原始对象 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 3 );
    expect( commitIndex ).is.equals( 3 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`${ 123 }`;
    expect( constructorIndex ).is.equals( 3 );
    expect( commitIndex ).is.equals( 3 );
    expect( destroyIndex ).is.equals( 3 );
  });

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 数组切换为 JSON 对象 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 3 );
    expect( commitIndex ).is.equals( 3 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`${{ }}`;
    expect( constructorIndex ).is.equals( 3 );
    expect( commitIndex ).is.equals( 3 );
    expect( destroyIndex ).is.equals( 3 );
  });

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 数组切换为元素节点 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 3 );
    expect( commitIndex ).is.equals( 3 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`${
      document.createElement('div')
    }`;
    expect( constructorIndex ).is.equals( 3 );
    expect( commitIndex ).is.equals( 3 );
    expect( destroyIndex ).is.equals( 3 );
  });

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 数组切换为模板 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 3 );
    expect( commitIndex ).is.equals( 3 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`${
      Hu.html`<div :asd=${ null }></div>`
    }`;
    expect( constructorIndex ).is.equals( 4 );
    expect( commitIndex ).is.equals( 4 );
    expect( destroyIndex ).is.equals( 3 );
  });

  it( '注册的指令方法可以被正确调用 ( 在 render 方法中使用 )', () => {
    let result;
    const fn = Hu.directiveFn(( value ) => part => {
      result = value;
    });

    Hu.render(
      fn( 123 ),
      div
    );
    expect( result ).is.equals( 123 );
  });

  it( '注册的指令方法可以被正确调用 ( 在指令中使用 )', () => {
    let result;
    const fn = Hu.directiveFn(( value ) => part => {
      result = value;
    });

    Hu.render( div )`
      <div :text=${ fn( 123 ) }></div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( '注册的指令方法可以被正确调用 ( 在 NodePart 中使用 )', () => {
    let result;
    const fn = Hu.directiveFn(( value ) => part => {
      result = value;
    });

    Hu.render( div )`
      <div>${ fn( 123 ) }</div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( '注册的指令方法可以被正确调用 ( 在 NodePart 数组方式中使用 )', () => {
    let result;
    const fn = Hu.directiveFn(( value ) => part => {
      result = value;
    });

    Hu.render( div )`
      <div>${[ fn( 123 ) ]}</div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( '注册的指令方法可以被正确调用 ( 在 repeat 指令方法中使用 )', () => {
    let result;
    const fn = Hu.directiveFn(( value ) => part => {
      result = value;
    });

    Hu.render( div )`
      <div>${
        Hu.html.repeat( [ 123 ], val => val, val => {
          return fn( val );
        })
      }</div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 render 方法中使用 )', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render(
      fn( 123 ),
      div
    );
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( '123', div );
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在指令中使用 )', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div :text=${ fn( 123 ) }></div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div></div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 NodePart 中使用 )', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div>${ fn( 123 ) }</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div></div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 NodePart 数组方式中使用 )', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div>${[ fn( 123 ) ]}</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div></div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 repeat 指令方法中使用 )', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div>${
        Hu.html.repeat( [ 123 ], val => val, val => {
          return fn( val );
        })
      }</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div></div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '在同一插值绑定内首次传入的是指令方法, 第二次传入的并非指令方法, 首次传入的指令方法会被注销', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div>${ fn( 123 ) }</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div>${ 123 }</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '在同一插值绑定内首次使用的并非指令方法, 第二次传入的是指令方法, 指令方法可以正常使用', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div>${ 123 }</div>
    `;
    expect( commitPart ).is.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div>${ fn( 123 ) }</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div>${ 123 }</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '在同一插值绑定内两次传入的不是同一个指令方法时, 首次传入的指令方法会被注销', () => {
    let commitPart1, destroyPart1;
    let commitPart2, destroyPart2;
    const fn1 = Hu.directiveFn(( value ) => [
      part => commitPart1 = part,
      part => destroyPart1 = part
    ]);
    const fn2 = Hu.directiveFn(( value ) => [
      part => commitPart2 = part,
      part => destroyPart2 = part
    ]);

    Hu.render( div )`
      <div>${ fn1( 123 ) }</div>
    `;
    expect( commitPart1 ).is.not.undefined;
    expect( destroyPart1 ).is.undefined;
    expect( commitPart2 ).is.undefined;
    expect( destroyPart2 ).is.undefined;

    Hu.render( div )`
      <div>${ fn2( 123 ) }</div>
    `;
    expect( commitPart1 ).is.not.undefined;
    expect( destroyPart1 ).is.not.undefined;
    expect( commitPart2 ).is.not.undefined;
    expect( destroyPart2 ).is.undefined;
    expect( commitPart1 ).is.equals( destroyPart1 );

    Hu.render( div )`
      <div>${ '' }</div>
    `;
    expect( commitPart1 ).is.not.undefined;
    expect( destroyPart1 ).is.not.undefined;
    expect( commitPart2 ).is.not.undefined;
    expect( destroyPart2 ).is.not.undefined;
    expect( commitPart1 ).is.equals( destroyPart1 );
    expect( commitPart2 ).is.equals( destroyPart2 );
  });

});