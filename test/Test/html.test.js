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
    render( div )`${ '123' }测试`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123测试`);

    render( div )`测试${ '123' }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`测试123`);

    // ------

    render( div )`${ '123' }
      测试
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123
      测试
    `);

    render( div )`
      ${ '123' }测试
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      123测试
    `);

    render( div )`
      测试${ '123' }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      测试123
    `);

    render( div )`
      测试
    ${ '123' }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      测试
    123`);

    // ------

    render( div )`${ '123' }
      测试`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123
      测试`);

    render( div )`
      ${ '123' }测试`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      123测试`);

    render( div )`
      测试${ '123' }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      测试123`);

    // ------

    render( div )`${ 123 }测试
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123测试
    `);

    render( div )`测试${ 123 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`测试123
    `);

    render( div )`测试
    ${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`测试
    123`);
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
  });

  it( '渲染注释节点 - 使用插值绑定', () => {
    render( div )`<!--${ 123 }-->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!--${ marker }-->`);

    render( div )`
      <!--${ 123 }-->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!--${ marker }-->
    `);

    render( div )`
      <!--${ 123 }-->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!--${ marker }-->`);

    render( div )`<!--${ 123 }-->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!--${ marker }-->
    `);

    // ------

    render( div )`<!-- ${ 123 } -->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!-- ${ marker } -->`);

    render( div )`
      <!-- ${ 123 } -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- ${ marker } -->
    `);

    render( div )`
      <!-- ${ 123 } -->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- ${ marker } -->`);

    render( div )`<!-- ${ 123 } -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!-- ${ marker } -->
    `);

    // ------

    render( div )`<!-- ${ 123 }-->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!-- ${ marker }-->`);

    render( div )`
      <!-- ${ 123 }-->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- ${ marker }-->
    `);

    render( div )`
      <!-- ${ 123 }-->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- ${ marker }-->`);

    render( div )`<!-- ${ 123 }-->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!-- ${ marker }-->
    `);

    // ------

    render( div )`<!--${ 123 } -->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!--${ marker } -->`);

    render( div )`
      <!--${ 123 } -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!--${ marker } -->
    `);

    render( div )`
      <!--${ 123 } -->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!--${ marker } -->`);

    render( div )`<!--${ 123 } -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!--${ marker } -->
    `);
  });

  it( '渲染文本节点 - 使用多个插值绑定', () => {
    render( div )`${ 123 }测试${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123测试123`);

    render( div )` ${ 123 }测试${ 123 } `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(` 123测试123 `);

    render( div )`${ 123 } 测试 ${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123 测试 123`);

    // ------

    render( div )`${ 123 }
      测试
    ${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123
      测试
    123`);

    render( div )` ${ 123 }
      测试
    ${ 123 } `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(` 123
      测试
    123 `);

    render( div )`${ 123 }
      ${ 123 }测试${ 123 }
    ${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123
      123测试123
    123`);

    render( div )`${ 123 }
      ${ 123 } 测试 ${ 123 }
    ${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123
      123 测试 123
    123`);

    // ------

    render( div )`${ 123 }
      测试${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123
      测试123`);

    render( div )` ${ 123 }
      测试 ${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(` 123
      测试 123`);

    render( div )` ${ 123 }
      测试 ${ 123 } `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(` 123
      测试 123 `);

    render( div )`${ 123 }
      ${ 123 }测试${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123
      123测试123`);

    render( div )`${ 123 }
      ${ 123 } 测试 ${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123
      123 测试 123`);

    // ------

    render( div )`${ 123 }测试
    ${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123测试
    123`);

    render( div )` ${ 123 }测试
    ${ 123 } `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(` 123测试
    123 `);

    render( div )`${ 123 } 测试
     ${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123 测试
     123`);

    render( div )`${ 123 }测试${ 123 }
    ${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123测试123
    123`);

    render( div )`${ 123 } 测试 ${ 123 }
    ${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123 测试 123
    123`);
  });

  it( '渲染元素节点 - 使用多个插值绑定', () => {
    render( div )`
      1${ 123 }<div class="asd">2</div>${ 123 }3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1123<div class="asd">2</div>1233
    `);

    render( div )`
      1 ${ 123 } <div class="asd">2</div> ${ 123 } 3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1 123 <div class="asd">2</div> 123 3
    `);

    // ------

    render( div )`
      1${ 123 }<div class="${ 123 }asd${ 123 }">2</div>${ 123 }3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1123<div class="123asd123">2</div>1233
    `);

    render( div )`
      1 ${ 123 } <div class=" ${ 123 } asd ${ 123 } ">2</div> ${ 123 } 3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1 123 <div class=" 123 asd 123 ">2</div> 123 3
    `);

    // ------

    render( div )`
      1${ 123 }<div class="${ 123 }asd${ 123 }">${ 123 }2${ 123 }</div>${ 123 }3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1123<div class="123asd123">1232123</div>1233
    `);

    render( div )`
      1 ${ 123 } <div class=" ${ 123 } asd ${ 123 } "> ${ 123 } 2 ${ 123 } </div> ${ 123 } 3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1 123 <div class=" 123 asd 123 "> 123 2 123 </div> 123 3
    `);

    // ------

    render( div )`
      ${ 123 }1${ 123 }<div class="${ 123 }asd${ 123 }">${ 123 }2${ 123 }</div>${ 123 }3${ 123 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1231123<div class="123asd123">1232123</div>1233123
    `);

    render( div )`
       ${ 123 } 1 ${ 123 } <div class=" ${ 123 } asd ${ 123 } "> ${ 123 } 2 ${ 123 } </div> ${ 123 } 3 ${ 123 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
       123 1 123 <div class=" 123 asd 123 "> 123 2 123 </div> 123 3 123
    `);

    // ------

    render( div )`${ 123 }
      ${ 123 }1${ 123 }<div class="${ 123 }asd${ 123 }">${ 123 }2${ 123 }</div>${ 123 }3${ 123 }
    ${ 123 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123
      1231123<div class="123asd123">1232123</div>1233123
    123`);

    render( div )` ${ 123 }
       ${ 123 } 1 ${ 123 } <div class=" ${ 123 } asd ${ 123 } "> ${ 123 } 2 ${ 123 } </div> ${ 123 } 3 ${ 123 }
     ${ 123 } `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(` 123
       123 1 123 <div class=" 123 asd 123 "> 123 2 123 </div> 123 3 123
     123 `);
  });

  it( '渲染注释节点 - 使用多个插值绑定', () => {
    render( div )`<!--${ 123 }${ 123 }${ 123 }-->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!--${ marker }${ marker }${ marker }-->`);

    render( div )`
      <!--${ 123 }${ 123 }${ 123 }-->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!--${ marker }${ marker }${ marker }-->
    `);

    render( div )`
      <!--${ 123 }${ 123 }${ 123 }-->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!--${ marker }${ marker }${ marker }-->`);

    render( div )`<!--${ 123 }${ 123 }${ 123 }-->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!--${ marker }${ marker }${ marker }-->
    `);

    // ------

    render( div )`<!-- ${ 123 }${ 123 }${ 123 } -->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!-- ${ marker }${ marker }${ marker } -->`);

    render( div )`
      <!-- ${ 123 }${ 123 }${ 123 } -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- ${ marker }${ marker }${ marker } -->
    `);

    render( div )`
      <!-- ${ 123 }${ 123 }${ 123 } -->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- ${ marker }${ marker }${ marker } -->`);

    render( div )`<!-- ${ 123 }${ 123 }${ 123 } -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!-- ${ marker }${ marker }${ marker } -->
    `);

    // ------

    render( div )`<!--${ 123 }${ 123 }${ 123 } -->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!--${ marker }${ marker }${ marker } -->`);

    render( div )`
      <!--${ 123 }${ 123 }${ 123 } -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!--${ marker }${ marker }${ marker } -->
    `);

    render( div )`
      <!--${ 123 }${ 123 }${ 123 } -->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!--${ marker }${ marker }${ marker } -->`);

    render( div )`<!--${ 123 }${ 123 }${ 123 } -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!--${ marker }${ marker }${ marker } -->
    `);

    // ------

    render( div )`<!-- ${ 123 }${ 123 }${ 123 }-->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!-- ${ marker }${ marker }${ marker }-->`);

    render( div )`
      <!-- ${ 123 }${ 123 }${ 123 }-->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- ${ marker }${ marker }${ marker }-->
    `);

    render( div )`
      <!-- ${ 123 }${ 123 }${ 123 }-->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- ${ marker }${ marker }${ marker }-->`);

    render( div )`<!-- ${ 123 }${ 123 }${ 123 }-->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!-- ${ marker }${ marker }${ marker }-->
    `);

    // ------

    render( div )`<!-- ${ 123 } ${ 123 } ${ 123 } -->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!-- ${ marker } ${ marker } ${ marker } -->`);

    render( div )`
      <!-- ${ 123 } ${ 123 } ${ 123 } -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- ${ marker } ${ marker } ${ marker } -->
    `);

    render( div )`
      <!-- ${ 123 } ${ 123 } ${ 123 } -->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- ${ marker } ${ marker } ${ marker } -->`);

    render( div )`<!-- ${ 123 } ${ 123 } ${ 123 } -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!-- ${ marker } ${ marker } ${ marker } -->
    `);
  });

  it( '渲染文本节点 - 类似属性绑定的文本节点', () => {
    render( div )`attr=${ 1 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`attr=1`);

    render( div )` attr=${ 1 } `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(` attr=1 `);

    render( div )`
      attr=${ 1 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      attr=1
    `);

    render( div )`attr=${ 1 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`attr=1
    `);

    render( div )` attr=${ 1 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(` attr=1
    `);

    render( div )`
      attr=${ 1 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      attr=1`);

    render( div )`
      attr=${ 1 } `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      attr=1 `);

    // ------

    render( div )`attr1=${ 1 } attr2=${ 2 } attr3=${ 3 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`attr1=1 attr2=2 attr3=3`);

    render( div )` attr1=${ 1 } attr2=${ 2 } attr3=${ 3 } `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(` attr1=1 attr2=2 attr3=3 `);

    render( div )`
      attr1=${ 1 } attr2=${ 2 } attr3=${ 3 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      attr1=1 attr2=2 attr3=3
    `);

    render( div )`attr1=${ 1 } attr2=${ 2 } attr3=${ 3 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`attr1=1 attr2=2 attr3=3
    `);

    render( div )` attr1=${ 1 } attr2=${ 2 } attr3=${ 3 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(` attr1=1 attr2=2 attr3=3
    `);

    render( div )`
      attr1=${ 1 } attr2=${ 2 } attr3=${ 3 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      attr1=1 attr2=2 attr3=3`);

    render( div )`
      attr1=${ 1 } attr2=${ 2 } attr3=${ 3 } `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      attr1=1 attr2=2 attr3=3 `);

    // ------

    render( div )`attr1=${ 1 }attr2=${ 2 }attr3=${ 3 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`attr1=1attr2=2attr3=3`);

    render( div )` attr1=${ 1 }attr2=${ 2 }attr3=${ 3 } `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(` attr1=1attr2=2attr3=3 `);

    render( div )`
      attr1=${ 1 }attr2=${ 2 }attr3=${ 3 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      attr1=1attr2=2attr3=3
    `);

    render( div )`attr1=${ 1 }attr2=${ 2 }attr3=${ 3 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`attr1=1attr2=2attr3=3
    `);

    render( div )` attr1=${ 1 }attr2=${ 2 }attr3=${ 3 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(` attr1=1attr2=2attr3=3
    `);

    render( div )`
      attr1=${ 1 }attr2=${ 2 }attr3=${ 3 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      attr1=1attr2=2attr3=3`);

    render( div )`
      attr1=${ 1 }attr2=${ 2 }attr3=${ 3 } `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      attr1=1attr2=2attr3=3 `);
  });

  it( '渲染注释节点 - 类似属性绑定的注释节点', () => {
    render( div )`
      <!--attr=${ 1 }-->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!--attr=${ marker }-->
    `);

    render( div )`
      <!-- attr=${ 1 } -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- attr=${ marker } -->
    `);

    // ------

    render( div )`
      <!--attr1=${ 1 } attr2=${ 1 } attr3=${ 1 }-->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!--attr1=${ marker } attr2=${ marker } attr3=${ marker }-->
    `);

    render( div )`
      <!-- attr1=${ 1 } attr2=${ 1 } attr3=${ 1 } -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- attr1=${ marker } attr2=${ marker } attr3=${ marker } -->
    `);

    // ------

    render( div )`
      <!--attr1=${ 1 }attr2=${ 1 }attr3=${ 1 }-->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!--attr1=${ marker }attr2=${ marker }attr3=${ marker }-->
    `);

    render( div )`
      <!-- attr1=${ 1 }attr2=${ 1 }attr3=${ 1 } -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- attr1=${ marker }attr2=${ marker }attr3=${ marker } -->
    `);
  });

  it( '同时渲染文本节点及元素节点', () => {
    render( div )`${ 1 }2${ 3 }<div>${ 4 }5${ 6 }</div>${ 7 }8${ 9 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123<div>456</div>789`);

    render( div )`
      ${ 1 }2${ 3 }<div>${ 4 }5${ 6 }</div>${ 7 }8${ 9 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      123<div>456</div>789
    `);

    // ------

    render( div )`1${ 2 }3<div>4${ 5 }6</div>7${ 8 }9`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123<div>456</div>789`);

    render( div )`
      1${ 2 }3<div>4${ 5 }6</div>7${ 8 }9
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      123<div>456</div>789
    `);

    // ------

    render( div )`<div>${ 4 }5${ 6 }</div>`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<div>456</div>`);

    render( div )`
      <div>${ 4 }5${ 6 }</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>456</div>
    `);

    // ------

    render( div )`<div>4${ 5 }6</div>`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<div>456</div>`);

    render( div )`
      <div>4${ 5 }6</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>456</div>
    `);
  });

  it( '同时渲染文本节点及注释节点', () => {
    render( div )`${ 1 }2${ 3 }<!--${ 4 }5${ 6 }-->${ 7 }8${ 9 }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123<!--${ marker }5${ marker }-->789`);

    render( div )`
      ${ 1 }2${ 3 }<!--${ 4 }5${ 6 }-->${ 7 }8${ 9 }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      123<!--${ marker }5${ marker }-->789
    `);

    // ------

    render( div )`1${ 2 }3<!--4${ 5 }6-->7${ 8 }9`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`123<!--4${ marker }6-->789`);

    render( div )`
      1${ 2 }3<!--4${ 5 }6-->7${ 8 }9
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      123<!--4${ marker }6-->789
    `);

    // ------

    render( div )`<!--${ 4 }5${ 6 }-->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!--${ marker }5${ marker }-->`);

    render( div )`
      <!--${ 4 }5${ 6 }-->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!--${ marker }5${ marker }-->
    `);

    // ------

    render( div )`<!--4${ 5 }6-->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!--4${ marker }6-->`);

    render( div )`
      <!--4${ 5 }6-->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!--4${ marker }6-->
    `);
  });

});