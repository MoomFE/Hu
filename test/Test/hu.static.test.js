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

});