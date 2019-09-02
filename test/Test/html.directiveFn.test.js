describe( 'html.directiveFn', () => {

  const render = Hu.render;
  const html = Hu.html;
  const nextTick = Hu.nextTick;
  const { repeat, unsafe, bind } = html;

  /** @type {Element} */
  let div;
  beforeEach(() => {
    div = document.createElement('div').$appendTo( document.body );
  });
  afterEach(() => {
    div.$remove();
  });


  it( 'html.repeat: 使用该指令方法渲染数组内容, 在数组变化时基于 key 的变化重新排列元素', () => {
    const arr = [
      { text: '1', key: 1 }, { text: '2', key: 2 }, { text: '3', key: 3 },
      { text: '4', key: 4 }, { text: '5', key: 5 }, { text: '6', key: 6 }
    ];

    render( div )`${
      repeat( arr, 'key', data => {
        return html`<span>${ data.text }</span>`
      })
    }`;

    // 保存当前的元素顺序
    const children = Array.from( div.children );
    // 保存当前的元素内容顺序
    const childrenText = children.map( elem => elem.innerHTML );

    // 逆序后重新渲染
    arr.reverse();
    render( div )`${
      repeat( arr, 'key', data => {
        return html`<span>${ data.text }</span>`
      })
    }`;

    // 保存最新的元素顺序
    const newChildren = Array.from( div.children );
    // 保存最新的元素内容顺序
    const newChildrenText = newChildren.map( elem => elem.innerHTML );

    // 元素个数是对的
    expect( children.length ).is.equals( 6 );
    // 元素的位置跟着数组一起交换了
    expect( children ).is.deep.equals( newChildren.reverse() );
    // 内容的位置跟着数组一起交换了
    expect( childrenText ).is.deep.equals( newChildrenText.reverse() );
  });

  it( 'html.repeat: 使用其他方式渲染数组内容, 在数组变化时尽可能的重用之前的元素进行渲染', () => {
    const arr = [
      { text: '1', key: 1 }, { text: '2', key: 2 }, { text: '3', key: 3 },
      { text: '4', key: 4 }, { text: '5', key: 5 }, { text: '6', key: 6 }
    ];

    render( div )`${
      arr.map( data => {
        return html`<span>${ data.text }</span>`
      })
    }`;

    // 保存当前的元素顺序
    const children = Array.from( div.children );
    // 保存当前的元素内容顺序
    const childrenText = children.map( elem => elem.innerHTML );

    // 逆序后重新渲染
    arr.reverse();
    render( div )`${
      arr.map( data => {
        return html`<span>${ data.text }</span>`
      })
    }`;

    // 保存最新的元素顺序
    const newChildren = Array.from( div.children );
    // 保存最新的元素内容顺序
    const newChildrenText = newChildren.map( elem => elem.innerHTML );

    // 元素个数是对的
    expect( children.length ).is.equals( 6 );
    // 元素的位置未着数组一起交换
    expect( children ).is.deep.equals( newChildren );
    // 内容的位置跟着数组一起交换了
    expect( childrenText ).is.deep.equals( newChildrenText.reverse() );
  });

  it( 'html.repeat: 该指令方法只能在文本区域中使用', () => {

    const arr = [
      { text: '1', key: 1 }, { text: '2', key: 2 }, { text: '3', key: 3 },
      { text: '4', key: 4 }, { text: '5', key: 5 }, { text: '6', key: 6 }
    ];

    render( div )`${
      repeat( arr, 'key', data => {
        return html`<span>${ data.text }</span>`
      })
    }`;

    render( div )`
      <div>${
        repeat( arr, 'key', data => {
          return html`<span>${ data.text }</span>`
        })
      }</div>
    `;

    should.throw(() => {
      render( div )`
        <div text=${ repeat( arr, 'key', data => data.text ) }></div>
      `;
    }, 'repeat 指令方法只能在文本区域中使用 !');

    should.throw(() => {
      render( div )`
        <div .text=${ repeat( arr, 'key', data => data.text ) }></div>
      `;
    }, 'repeat 指令方法只能在文本区域中使用 !');

    should.throw(() => {
      render( div )`
        <div ?text=${ repeat( arr, 'key', data => data.text ) }></div>
      `;
    }, 'repeat 指令方法只能在文本区域中使用 !');
  });

  it( 'html.unsafe: 使用该指令方法包装的 HTML 片段不会被转义', () => {
    const span = '<span>123</span>';

    render( div )`${
      unsafe( span )
    }`;

    expect( div.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.firstElementChild.innerText ).is.equals('123');
  });

  it( 'html.unsafe: 使用其他方式插入的 HTML 片段会被转义', () => {
    const span = '<span>123</span>';

    render( div )`${
      span
    }`;

    expect( div.firstElementChild ).is.null;
    expect( div.innerText ).is.equals( span );
  });

  it( 'html.unsafe: 该指令方法只能在文本区域中使用', () => {
    const span = '<span>123</span>';

    render( div )`${
      unsafe( span )
    }`;

    render( div )`
      <div>${
        unsafe( span )
      }</div>
    `;

    should.throw(() => {
      render( div )`
        <div unsafe=${ unsafe( span ) }></div>
      `;
    }, 'unsafe 指令方法只能在文本区域中使用 !');

    should.throw(() => {
      render( div )`
        <div .unsafe=${ unsafe( span ) }></div>
      `;
    }, 'unsafe 指令方法只能在文本区域中使用 !');

    should.throw(() => {
      render( div )`
        <div ?unsafe=${ unsafe( span ) }></div>
      `;
    }, 'unsafe 指令方法只能在文本区域中使用 !');
  });

  it( 'html.bind: 使用该指令方法可以将观察者对象的值与插值绑定位置的指令进行绑定', ( done ) => {
    const data = Hu.observable({
      name: '1'
    });

    render( div )`
      <div name=${ bind( data, 'name' ) }></div>
    `;

    expect( div.firstElementChild.$attr('name') ).is.equals('1');

    data.name = 2;
    nextTick(() => {
      expect( div.firstElementChild.$attr('name') ).is.equals('2');

      done();
    });
  });

  it( 'html.bind: 使用该指令方法时传入的参数若不是观察者对象则不会响应值的变化', ( done ) => {
    const data = {
      name: '1'
    };

    render( div )`
      <div name=${ bind( data, 'name' ) }></div>
    `;

    expect( div.firstElementChild.$attr('name') ).is.equals('1');

    data.name = 2;
    nextTick(() => {
      expect( div.firstElementChild.$attr('name') ).is.equals('1');

      done();
    });
  });

});