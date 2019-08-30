describe( 'html', () => {

  const render = Hu.render;
  const html = Hu.html;

  let div;
  beforeEach(() => {
    div = document.createElement('div').$appendTo( document.body );
  });
  afterEach(() => {
    div && div.$remove();
  });

  let marker;
  !function(){
    const templateResult = html`<!--${ null }-->`;
    const template = templateResult.getTemplateElement();
    marker = template.content.firstChild.data.trim();
  }();

  it( '渲染文本节点', () => {
    render( div )`测试`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`测试`);

    render( div )`
      测试
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      测试
    `);

    render( div )`
      测试`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      测试`);

    render( div )`测试
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`测试
    `);
  });

  it( '渲染元素节点', () => {
    render( div )`
      <div></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div></div>
    `);

    render( div )`
      <div>123</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>123</div>
    `);

    render( div )`
      <div class="asd"></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div class="asd"></div>
    `);

    render( div )`
      <div class="asd">123</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div class="asd">123</div>
    `);

    render( div )`
      1<div>2</div>3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<div>2</div>3
    `);

    render( div )`
      1<div class="asd">2</div>3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<div class="asd">2</div>3
    `);
  });

  it( '渲染注释节点', () => {
    render( div )`
      <!---->
    `;
    expect( div.innerHTML ).is.equals(`<!---->
      <!---->
    <!---->`);

    render( div )`
      <!-- -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- -->
    `);

    render( div )`
      <!-- comment -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- comment -->
    `);

    render( div )`
      1<!-- 2 -->3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<!-- 2 -->3
    `);

    render( div )`
      <div>1</div>2<div>3</div><!-- 4 --><div>5</div>6<div>7</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>1</div>2<div>3</div><!-- 4 --><div>5</div>6<div>7</div>
    `);

    render( div )`
      <div>1</div>2<div>3</div><!-- <div>4</div> --><div>5</div>6<div>7</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>1</div>2<div>3</div><!-- <div>4</div> --><div>5</div>6<div>7</div>
    `);
  });

  it( '渲染文本节点 - 使用插值绑定', () => {
    render( div )`${ '测试' }测试`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`${ '测试' }测试`);

    render( div )`
      ${ '测试' }测试
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      ${ '测试' }测试
    `);

    render( div )`
      ${ '测试' }测试`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      ${ '测试' }测试`);

    render( div )`${ '测试' }测试
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`${ '测试' }测试
    `);

    // ------

    render( div )`测试${ '测试' }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`测试${ '测试' }`);

    render( div )`
      测试${ '测试' }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      测试${ '测试' }
    `);

    render( div )`
      测试${ '测试' }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      测试${ '测试' }`);

    render( div )`测试${ '测试' }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`测试${ '测试' }
    `);

    // ------

    render( div )`${ '测试' }测试${ '测试' }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`${ '测试' }测试${ '测试' }`);

    render( div )`
      ${ '测试' }测试${ '测试' }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      ${ '测试' }测试${ '测试' }
    `);

    render( div )`
      ${ '测试' }测试${ '测试' }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      ${ '测试' }测试${ '测试' }`);

    render( div )`${ '测试' }测试${ '测试' }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`${ '测试' }测试${ '测试' }
    `);
  });

  it( '渲染元素节点 - 使用插值绑定', () => {
    render( div )`${ 123 }
      1<div class="asd">2</div>3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123
      1<div class="asd">2</div>3
    `);

    render( div )`
      ${ 123 }1<div class="asd">2</div>3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1231<div class="asd">2</div>3
    `);

    render( div )`
      1${ 123 }<div class="asd">2</div>3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1123<div class="asd">2</div>3
    `);

    render( div )`
      1<div class="${ 123 }asd">2</div>3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<div class="123asd">2</div>3
    `);

    render( div )`
      1<div class="asd${ 123 }">2</div>3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<div class="asd123">2</div>3
    `);

    render( div )`
      1<div class="asd">${ 123 }2</div>3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<div class="asd">1232</div>3
    `);

    render( div )`
      1<div class="asd">2${ 123 }</div>3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<div class="asd">2123</div>3
    `);

    render( div )`
      1<div class="asd">2</div>${ 123 }3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<div class="asd">2</div>1233
    `);

    render( div )`
      1<div class="asd">2</div>3${ 123 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<div class="asd">2</div>3123
    `);

    render( div )`
      1<div class="asd">2</div>3
    ${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<div class="asd">2</div>3
    123`);

    // ------

    render( div )`${ 123 }
      1<div class="asd">2</div>3
    ${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123
      1<div class="asd">2</div>3
    123`);

    render( div )`
      ${ 123 }1<div class="asd">2</div>3${ 123 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1231<div class="asd">2</div>3123
    `);

    render( div )`
      1<div class="asd">${ 123 }2${ 123 }</div>3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<div class="asd">1232123</div>3
    `);

    render( div )`
      1<div class="${ 123 }asd${ 123 }">2</div>3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<div class="123asd123">2</div>3
    `);

    render( div )`
      1<div class="asd">${ 123 }2${ 123 }</div>3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<div class="asd">1232123</div>3
    `);

    // ------

    render( div )`${ 123 }
      ${ 123 }1${ 123 }<div class="${ 123 }asd${ 123 }">${ 123 }2${ 123 }</div>${ 123 }3${ 123 }
    ${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123
      1231123<div class="123asd123">1232123</div>1233123
    123`);
  });

});