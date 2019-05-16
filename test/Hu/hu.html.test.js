describe( 'Hu.html', () => {

  it( '使用 Hu.render 的正常方式', () => {
    const div = document.createElement('div');

    Hu.render(
      Hu.html`<span>123</span>`,
      div
    );

    expect( div.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.firstElementChild.innerText ).is.equals('123');
  });

  it( '使用 Hu.render 的另一种方式', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <span>123</span>
    `;

    expect( div.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.firstElementChild.innerText ).is.equals('123');
  });

  it( '使用 Hu.html 对元素进行重复渲染, 相同的 ( 元素 / 属性 / 内容 ) 不会被重新渲染', () => {
    const div = document.createElement('div');
    let child;
    let newChild;

    Hu.render( div )`
      <div a="1" b="2">12</div>
    `;
    child = div.firstElementChild;

    Hu.render( div )`
      <div a="1" b="2">12</div>
    `;
    newChild = div.firstElementChild;

    expect( child ).is.equals( newChild );
  });

  it( '使用 Hu.html 对元素进行重复渲染, 相同的 ( 元素 / 内容 ) 但 ( 属性 ) 不同会被重新渲染', () => {
    const div = document.createElement('div');
    let child;
    let newChild;

    Hu.render( div )`
      <div a="1" b="2">12</div>
    `;
    child = div.firstElementChild;

    Hu.render( div )`
      <div a="3" b="4">12</div>
    `;
    newChild = div.firstElementChild;

    expect( child ).is.not.equals( newChild );
  });

  it( '使用 Hu.html 对元素进行重复渲染, 相同的 ( 元素 / 属性 ) 但 ( 内容 ) 不同会被重新渲染', () => {
    const div = document.createElement('div');
    let child;
    let newChild;

    Hu.render( div )`
      <div a="1" b="2">12</div>
    `;
    child = div.firstElementChild;

    Hu.render( div )`
      <div a="1" b="2">123</div>
    `;
    newChild = div.firstElementChild;

    expect( child ).is.not.equals( newChild );
  });

  it( '使用 Hu.html 对元素进行重复渲染, 相同的 ( 元素 ) 但 ( 属性 / 内容 ) 不同会被重新渲染', () => {
    const div = document.createElement('div');
    let child;
    let newChild;

    Hu.render( div )`
      <div a="1" b="2">12</div>
    `;
    child = div.firstElementChild;

    Hu.render( div )`
      <div a="3" b="4">123</div>
    `;
    newChild = div.firstElementChild;

    expect( child ).is.not.equals( newChild );
  });

  it( '使用 Hu.html 对元素进行重复渲染, 相同的 ( 元素 / 内容 ) 但 ( 属性 - 插值 ) 不同不会被重新渲染', () => {
    const div = document.createElement('div');
    let child;
    let newChild;

    Hu.render( div )`
      <div a="${ 1 }" b="${ 2 }">12</div>
    `;
    child = div.firstElementChild;

    Hu.render( div )`
      <div a="${ 3 }" b="${ 4 }">12</div>
    `;
    newChild = div.firstElementChild;

    expect( child ).is.equals( newChild );
  });

  it( '使用 Hu.html 对元素进行重复渲染, 相同的 ( 元素 / 属性 ) 但 ( 内容 - 插值 ) 不同不会被重新渲染', () => {
    const div = document.createElement('div');
    let child;
    let newChild;

    Hu.render( div )`
      <div a="1" b="2">${ '12' }</div>
    `;
    child = div.firstElementChild;

    Hu.render( div )`
      <div a="1" b="2">${ '123' }</div>
    `;
    newChild = div.firstElementChild;

    expect( child ).is.equals( newChild );
  });

  it( '使用 Hu.html 对元素进行重复渲染, 相同的 ( 元素 ) 但 ( 属性 - 插值 / 内容 - 插值 ) 不同不会被重新渲染', () => {
    const div = document.createElement('div');
    let child;
    let newChild;

    Hu.render( div )`
      <div a="${ 1 }" b="${ 2 }">${ 12 }</div>
    `;
    child = div.firstElementChild;

    Hu.render( div )`
      <div a="${ 3 }" b="${ 4 }">${ 123 }</div>
    `;
    newChild = div.firstElementChild;

    expect( child ).is.equals( newChild );
  });

  it( '使用 Hu.html 对元素进行重复渲染, 静态属性及静态内容的更改会导致重新渲染, 使用了插槽的部分变化不会被重新渲染', () => {
    const div = document.createElement('div');
    let child;
    let newChild;

    Hu.render( div )`
      <div a="1" b="2">12</div>
    `;
    child = div.firstElementChild;

    Hu.render( div )`
      <div a="3" b="4">123</div>
    `;
    newChild = div.firstElementChild;

    expect( child ).is.not.equals( newChild );

    Hu.render( div )`
      <div a="${ 1 }" b="${ 2 }">${ 12 }</div>
    `;
    child = div.firstElementChild;

    Hu.render( div )`
      <div a="${ 3 }" b="${ 4 }">${ 123 }</div>
    `;
    newChild = div.firstElementChild;

    expect( child ).is.equals( newChild );
  });

  it( '使用 Hu.html 渲染模板中的注释', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <!-- comment -->
    `;

    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- comment -->
    `);
  });

  it( '使用 Hu.html 渲染模板中的注释中的绑定', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <!--${ 1 }-->2<!--${ 3 }-->
    `;

    expect( div.textContent ).is.equals(`
      2
    `);
  });

  it( '使用 Hu.html 同时渲染模板中的元素和注释', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <!-- comment -->
      <div>div</div>
    `;

    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- comment -->
      <div>div</div>
    `);
  });

  it( '使用 Hu.html 同时渲染模板中的元素和注释', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <!-- comment -->
      <div>div</div>
    `;

    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- comment -->
      <div>div</div>
    `);
  });

  it( '使用 Hu.html 同时渲染模板中的元素及绑定和注释', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <!-- comment -->
      <div class=${ 'div' }>${ 'div' }</div>
    `;

    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- comment -->
      <div class="div">div</div>
    `);
  });

  it( '使用 Hu.html 同时渲染模板中的元素及绑定和注释中的标签及绑定', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <!-- <div class=${ 'div' }>${ 'div' }</div> -->
      <div class=${ 'div' }>${ 'div' }</div>
    `;

    expect( div.querySelector('div').innerText ).is.equals('div');
  });

  it( '使用 Hu.html 渲染模板注释中的多个绑定', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div>A<!-- ${ 'B' } ${ 'C' } -->D</div>
    `;

    expect( div.querySelector('div').innerText ).is.equals('AD');
  });

  it( '使用 Hu.html 渲染模板中类似值绑定的注释', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div>A<!-- <div>${ 'B' }</div> -->C</div>
    `;

    expect( div.querySelector('div').innerText ).is.equals('AC');
  });

  it( '使用 Hu.html 渲染模板中类似值绑定的注释 ( 二 )', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div>A<!-- <div>${ 'B' }</div>${ 'C' } -->D</div>
    `;

    expect( div.querySelector('div').innerText ).is.equals('AD');
  });
  
  it( '使用 Hu.html 渲染模板中类似属性绑定的注释', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div>A<!-- <div class=${ 'B' }></div> -->C</div>
    `;

    expect( div.querySelector('div').innerText ).is.equals('AC');
  });

  it( '使用 Hu.html 渲染模板中类似属性绑定的注释 ( 二 )', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div>A<!-- class=${ 'B' } -->C</div>
    `;

    expect( div.querySelector('div').innerText ).is.equals('AC');
  });

  it( '使用 Hu.html 渲染模板中类似值绑定和属性绑定的注释', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div>A<!-- <div class=${ 'B' }>${ 'C' }</div> -->D</div>
    `;

    expect( div.querySelector('div').innerText ).is.equals('AD');
  });

});