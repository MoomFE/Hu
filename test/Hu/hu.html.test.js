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

});