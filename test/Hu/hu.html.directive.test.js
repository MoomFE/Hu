describe( 'Hu.html.directive', () => {

  it( '使用 :text 指令的方式, 对元素内容进行插入 ( textContent )', () => {
    const div = document.createElement('div');
    let text = '<span>123</span>'

    Hu.render( div )`
      <div :text=${ text }></div>
    `;

    expect( div.firstElementChild.innerHTML ).is.equals(
      text.$replaceAll('<','&lt;')
          .$replaceAll('>','&gt;')
    );
  });

  it( '使用 :text 指令插入 null 或 undefined 将会转为空字符串', () => {
    const div = document.createElement('div');

    Hu.render( div )`<div :text=${ null }></div>`;
    expect( div.innerHTML ).is.equals(`<!----><div></div><!---->`);

    Hu.render( div )`<div :text=${ undefined }></div>`;
    expect( div.innerHTML ).is.equals(`<!----><div></div><!---->`);
  });

  it( '使用 :text 指令插入 JSON 将会使用 JSON.stringify 进行格式化输出', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :text=${{ }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{}</div>
    `);

    Hu.render( div )`
      <div :text=${{ asd: 123 }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{\n  "asd": 123\n}</div>
    `);

    Hu.render( div )`
      <div :text=${{ asd: [ 123 ] }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{\n  "asd": [\n    123\n  ]\n}</div>
    `);
  });

  it( '使用 :text 指令插入数组将会使用 JSON.stringify 进行格式化输出', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :text=${[ ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[]</div>
    `);

    Hu.render( div )`
      <div :text=${[ 1, 2, 3 ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[\n  1,\n  2,\n  3\n]</div>
    `);

    Hu.render( div )`
      <div :text=${[ 1, { asd: 123 }, 3 ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[\n  1,\n  {\n    "asd": 123\n  },\n  3\n]</div>
    `);
  });

  it( '使用 :text 指令时, 首次传入的是 undefined, 元素的内容应该被清空', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :text=${ undefined }>123</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div></div>
    `);
  });


  it( '使用 :html 指令的方式, 对元素内容进行插入 ( innerHTML )', () => {
    const div = document.createElement('div');
    let text = '<span>123</span>'

    Hu.render( div )`
      <div :html=${ text }></div>
    `;

    expect( div.firstElementChild.innerHTML ).is.equals(
      text
    );
  });

  it( '使用 :html 指令插入 null 或 undefined 将会转为空字符串', () => {
    const div = document.createElement('div');

    Hu.render( div )`<div :html=${ null }></div>`;
    expect( div.innerHTML ).is.equals(`<!----><div></div><!---->`);

    Hu.render( div )`<div :html=${ undefined }></div>`;
    expect( div.innerHTML ).is.equals(`<!----><div></div><!---->`);
  });

  it( '使用 :html 指令插入 JSON 将会使用 JSON.stringify 进行格式化输出', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :html=${{ }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{}</div>
    `);

    Hu.render( div )`
      <div :html=${{ asd: 123 }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{\n  "asd": 123\n}</div>
    `);

    Hu.render( div )`
      <div :html=${{ asd: [ 123 ] }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{\n  "asd": [\n    123\n  ]\n}</div>
    `);
  });

  it( '使用 :html 指令插入数组将会使用 JSON.stringify 进行格式化输出', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :html=${[ ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[]</div>
    `);

    Hu.render( div )`
      <div :html=${[ 1, 2, 3 ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[\n  1,\n  2,\n  3\n]</div>
    `);

    Hu.render( div )`
      <div :html=${[ 1, { asd: 123 }, 3 ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[\n  1,\n  {\n    "asd": 123\n  },\n  3\n]</div>
    `);
  });

  it( '使用 :html 指令时, 首次传入的是 undefined, 元素的内容应该被清空', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :html=${ undefined }>123</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div></div>
    `);
  });


  it( '使用 :show 指令对元素进行显示和隐藏', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :show=${ false }></div>
    `;
    expect( div.firstElementChild.style.display ).is.equals('none');

    Hu.render( div )`
      <div :show=${ true }></div>
    `;
    expect( div.firstElementChild.style.display ).is.equals('');

    Hu.render( div )`
      <div :show=${ false }></div>
    `;
    expect( div.firstElementChild.style.display ).is.equals('none');
  });

  it( '使用 :show 指时, 首次传入的是 undefined, 元素的状态应该是隐藏的', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :show=${ undefined }></div>
    `;
    expect( div.firstElementChild.style.display ).is.equals('none');
  });


  it( '使用不存在的指令, 将会被当做普通属性处理', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :zhang-wei=${ 666 }></div>
    `;
    expect( div.firstElementChild.getAttribute(':zhang-wei') ).equals('666');

    Hu.render( div )`
      <div :toString=${ 666 }></div>
    `;
    expect( div.firstElementChild.getAttribute(':tostring') ).equals('666');
  });

});