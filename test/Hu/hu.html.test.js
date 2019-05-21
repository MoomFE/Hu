describe( 'Hu.html', () => {

  let div = document.createElement('div');
  beforeEach(() => {
    div.$remove();
    div = document.createElement('div');
  });

  let marker;
  !function(){
    const templateResult = Hu.html`<!--${ null }-->`;
    const template = templateResult.getTemplateElement();
    marker = template.content.firstChild.data.trim();
  }();


  it( '渲染文本节点', () => {
    Hu.render( div )`测试`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`测试`);

    Hu.render( div )`
      测试
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      测试
    `);

    Hu.render( div )`
      测试`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      测试`);

    Hu.render( div )`测试
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`测试
    `);
  });

  it( '渲染元素节点', () => {
    Hu.render( div )`
      <div></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div></div>
    `);

    Hu.render( div )`
      <div>123</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>123</div>
    `);

    Hu.render( div )`
      <div class="asd"></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div class="asd"></div>
    `);

    Hu.render( div )`
      <div class="asd">123</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div class="asd">123</div>
    `);

    Hu.render( div )`
      1<div>2</div>3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<div>2</div>3
    `);

    Hu.render( div )`
      1<div class="asd">2</div>3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<div class="asd">2</div>3
    `);
  });

  it( '渲染注释节点', () => {
    Hu.render( div )`
      <!---->
    `;
    expect( div.innerHTML ).is.equals(`<!---->
      <!---->
    <!---->`);

    Hu.render( div )`
      <!-- -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- -->
    `);

    Hu.render( div )`
      <!-- comment -->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- comment -->
    `);

    Hu.render( div )`
      1<!-- 2 -->3
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      1<!-- 2 -->3
    `);

    Hu.render( div )`
      <div>1</div>2<div>3</div><!-- 4 --><div>5</div>6<div>7</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>1</div>2<div>3</div><!-- 4 --><div>5</div>6<div>7</div>
    `);

    Hu.render( div )`
      <div>1</div>2<div>3</div><!-- <div>4</div> --><div>5</div>6<div>7</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>1</div>2<div>3</div><!-- <div>4</div> --><div>5</div>6<div>7</div>
    `);
  });

  it( '渲染文本节点 - 使用插值绑定', () => {
    Hu.render( div )`${ '测试' }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`测试`);

    Hu.render( div )`
    ${ '测试' }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
    测试`);

    Hu.render( div )`${ '测试' }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`测试
    `);

    Hu.render( div )`测试${ '测试' }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`测试测试`);

    Hu.render( div )`
    测试${ '测试' }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
    测试测试`);

    Hu.render( div )`测试${ '测试' }
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`测试测试
    `);

    Hu.render( div )`测试${ '测试' }测试`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`测试测试测试`);

    Hu.render( div )`
    测试${ '测试' }测试`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
    测试测试测试`);

    Hu.render( div )`测试${ '测试' }测试
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`测试测试测试
    `);
  });

  it( '渲染元素节点 - 使用插值绑定', () => {
    Hu.render( div )`<div>${ 1 }</div>`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<div>1</div>`);

    Hu.render( div )`
    <div>${ 1 }</div>`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
    <div>1</div>`);

    Hu.render( div )`<div>${ 1 }</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<div>1</div>
    `);

    Hu.render( div )`
      <div>${ 1 }</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>1</div>
    `);

    Hu.render( div )`
      <div class=${ 'static' }>${ 1 }</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div class="static">1</div>
    `);

    Hu.render( div )`
      <div class=${ 'static' } name="1${ 2 }3${ 4 }5">${ 1 }</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div class="static" name="12345">1</div>
    `);
  });

  it( '渲染注释节点 - 使用插值绑定', () => {
    Hu.render( div )`<!--${ 123 }-->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!--${ marker }-->`);

    Hu.render( div )`
    <!--${ 123 }-->`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
    <!--${ marker }-->`);

    Hu.render( div )`<!--${ 123 }-->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<!--${ marker }-->
    `);

    Hu.render( div )`
      <!--${ 123 }-->
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!--${ marker }-->
    `);
  });

});


// it( '使用 Hu.html 渲染模板中的注释', () => {
//   const div = document.createElement('div');

//   Hu.render( div )`
//     <!-- comment -->
//   `;

//   expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
//     <!-- comment -->
//   `);
// });

// it( '使用 Hu.html 渲染模板中的注释中的绑定', () => {
//   const div = document.createElement('div');

//   Hu.render( div )`
//     <!--${ 1 }-->2<!--${ 3 }-->
//   `;

//   expect( div.textContent ).is.equals(`
//     2
//   `);
// });

// it( '使用 Hu.html 同时渲染模板中的元素和注释', () => {
//   const div = document.createElement('div');

//   Hu.render( div )`
//     <!-- comment -->
//     <div>div</div>
//   `;

//   expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
//     <!-- comment -->
//     <div>div</div>
//   `);
// });

// it( '使用 Hu.html 同时渲染模板中的元素和注释', () => {
//   const div = document.createElement('div');

//   Hu.render( div )`
//     <!-- comment -->
//     <div>div</div>
//   `;

//   expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
//     <!-- comment -->
//     <div>div</div>
//   `);
// });

// it( '使用 Hu.html 同时渲染模板中的元素及绑定和注释', () => {
//   const div = document.createElement('div');

//   Hu.render( div )`
//     <!-- comment -->
//     <div class=${ 'div' }>${ 'div' }</div>
//   `;

//   expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
//     <!-- comment -->
//     <div class="div">div</div>
//   `);
// });

// it( '使用 Hu.html 同时渲染模板中的元素及绑定和注释中的标签及绑定', () => {
//   const div = document.createElement('div');

//   Hu.render( div )`
//     <!-- <div class=${ 'div' }>${ 'div' }</div> -->
//     <div class=${ 'div' }>${ 'div' }</div>
//   `;

//   expect( div.querySelector('div').innerText ).is.equals('div');
// });

// it( '使用 Hu.html 渲染模板注释中的多个绑定', () => {
//   const div = document.createElement('div');

//   Hu.render( div )`
//     <div>A<!-- ${ 'B' } ${ 'C' } -->D</div>
//   `;

//   expect( div.querySelector('div').innerText ).is.equals('AD');
// });

// it( '使用 Hu.html 渲染模板中类似值绑定的注释', () => {
//   const div = document.createElement('div');

//   Hu.render( div )`
//     <div>A<!-- <div>${ 'B' }</div> -->C</div>
//   `;

//   expect( div.querySelector('div').innerText ).is.equals('AC');
// });

// it( '使用 Hu.html 渲染模板中类似值绑定的注释 ( 二 )', () => {
//   const div = document.createElement('div');

//   Hu.render( div )`
//     <div>A<!-- <div>${ 'B' }</div>${ 'C' } -->D</div>
//   `;

//   expect( div.querySelector('div').innerText ).is.equals('AD');
// });

// it( '使用 Hu.html 渲染模板中类似属性绑定的注释', () => {
//   const div = document.createElement('div');

//   Hu.render( div )`
//     <div>A<!-- <div class=${ 'B' }></div> -->C</div>
//   `;
//   expect( div.querySelector('div').innerText ).is.equals('AC');

//   Hu.render( div )`
//     <div>A<!-- class=${ 'B' } -->C</div>
//   `;
//   expect( div.querySelector('div').innerText ).is.equals('AC');
// });

// it( '使用 Hu.html 渲染模板中类似值绑定和属性绑定的注释', () => {
//   const div = document.createElement('div');

//   Hu.render( div )`
//     <div>A<!-- <div class=${ 'B' }>${ 'C' }</div> -->D</div>
//   `;

//   expect( div.querySelector('div').innerText ).is.equals('AD');
// });

// it( '使用 Hu.html 渲染 template 内的内容', () => {
//   const div = document.createElement('div');

//   Hu.render( div )`
//     <div>'123'</div>
//     <template>
//       <div>${ 123 }-${ 456 }-${ 789 }</div>
//     </template>
//     <div>'123'</div>
//   `;

//   expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
//     <div>'123'</div>
//     <template>
//       <div>123-456-789</div>
//     </template>
//     <div>'123'</div>
//   `);
// });

// it( '使用 Hu.html 渲染文本节点中的连续的插值绑定', () => {
//   const div = document.createElement('div');

//   Hu.render( div )`
//     A${ 123 }B${ 456 }C${ 789 }D
//     <!--class=${ 123 }${ 789 }${ 10 }-->
//     <!--${ 123 } ${ 456 }-->
//   `;

//   expect( div.textContent ).is.equals(`\n      A123B456C789D\n      \n      \n    `);
// });

// it( '使用 Hu.html 渲染文本节点中的类似属性绑定插值', () => {
//   const div = document.createElement('div');

//   // 会被当成普通插值
//   Hu.render( div )`class=${ 'B' }`;
//   expect( div.innerText ).is.equals(`class=B`);

//   // 会被当成类似属性绑定插值
//   Hu.render( div )`
//     class=${ 'B' }
//   `;
//   expect( div.innerText ).is.equals(`
//     class=B
//   `);

//   Hu.render( div )`
//     class=${ 'A' } class=${ 'B' } class=${ 'C' }
//   `;
//   expect( div.innerText ).is.equals(`
//     class=A class=B class=C
//   `);

//   Hu.render( div )`
//     class=${ 'A' }1 class=${ 'B' }2 class=${ 'C' }3
//   `;
//   expect( div.innerText ).is.equals(`
//     class=A1 class=B2 class=C3
//   `);

//   Hu.render( div )`
//     class=1${ 'A' }2 class=3${ 'B' }4 class=5${ 'C' }6
//   `;
//   expect( div.innerText ).is.equals(`
//     class=1A2 class=3B4 class=5C6
//   `);
// });

// it( '使用 Hu.html 渲染元素节点上的属性绑定', () => {
//   const div = document.createElement('div');

//   Hu.render( div )`
//     <div attr1=${ 'A' } attr2=${ 'B' } attr3=${ 'C' }></div>
//   `;

//   expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
//     <div attr1="A" attr2="B" attr3="C"></div>
//   `);
// });