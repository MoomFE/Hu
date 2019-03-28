describe( 'Hu.html.directive', () => {

  it( '使用 Hu.html.repeat 方法渲染数组内容, 在数组变化时基于 key 的变化重新排列元素', () => {
    const div = document.createElement('div');
    const arr = [
      { text: '1', key: 1 }, { text: '2', key: 2 }, { text: '3', key: 3 },
      { text: '4', key: 4 }, { text: '5', key: 5 }, { text: '6', key: 6 }
    ];

    Hu.render( div )`${
      Hu.html.repeat( arr, 'key', data => {
        return Hu.html`<span>${ data.text }</span>`
      })
    }`;

    // 保存当前的元素顺序
    const children = Array.from( div.children );
    // 保存当前的元素内容顺序
    const childrenText = children.map( elem => elem.innerHTML );

    // 逆序后重新渲染
    arr.reverse();
    Hu.render( div )`${
      Hu.html.repeat( arr, 'key', data => {
        return Hu.html`<span>${ data.text }</span>`
      })
    }`;

    // 保存最新的元素顺序
    const newChildren = Array.from( div.children );
    // 保存最新的元素内容顺序
    const newChildrenText = newChildren.map( elem => elem.innerHTML );

    // 元素的位置跟着数组一起交换了
    expect( children ).is.deep.equals( newChildren.reverse() );
    // 内容的位置跟着数组一起交换了
    expect( childrenText ).is.deep.equals( newChildrenText.reverse() );
  });

  it( '不使用 Hu.html.repeat 的方法渲染数组内容, 在数组变化时尽可能的重用之前的元素进行渲染', () => {
    const div = document.createElement('div');
    const arr = [
      { text: '1', key: 1 }, { text: '2', key: 2 }, { text: '3', key: 3 },
      { text: '4', key: 4 }, { text: '5', key: 5 }, { text: '6', key: 6 }
    ];

    Hu.render( div )`${
      arr.map( data => {
        return Hu.html`<span>${ data.text }</span>`
      })
    }`;

    // 保存当前的元素顺序
    const children = Array.from( div.children );
    // 保存当前的元素内容顺序
    const childrenText = children.map( elem => elem.innerHTML );

    // 逆序后重新渲染
    arr.reverse();
    Hu.render( div )`${
      arr.map( data => {
        return Hu.html`<span>${ data.text }</span>`
      })
    }`;

    // 保存最新的元素顺序
    const newChildren = Array.from( div.children );
    // 保存最新的元素内容顺序
    const newChildrenText = newChildren.map( elem => elem.innerHTML );

    // 元素的位置未着数组一起交换
    expect( children ).is.deep.equals( newChildren );
    // 内容的位置跟着数组一起交换了
    expect( childrenText ).is.deep.equals( newChildrenText.reverse() );
  });

  it( '使用 Hu.html.unsafe 忽略对 HTML 进行转义', () => {
    const div = document.createElement('div');
    const span = '<span>123</span>';

    Hu.render( div )`${
      Hu.html.unsafe( span )
    }`;

    expect( div.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.firstElementChild.innerText ).is.equals('123');
  });

  it( '不使用 Hu.html.unsafe 将始终对 HTML 进行转义', () => {
    const div = document.createElement('div');
    const span = '<span>123</span>';

    Hu.render( div )`${
      span
    }`;

    expect( div.firstElementChild ).is.null;
    expect( div.innerText ).is.equals( span );
  });

  it( '使用 Hu.html.bind 对元素属性和变量进行绑定', ( done ) => {
    const bind = Hu.html.bind;
    const div = document.createElement('div');
    const data = Hu.observable({
      name: '1'
    });

    Hu.render( div )`
      <div name=${ bind( data, 'name' ) }></div>
    `;

    expect( div.firstElementChild.getAttribute('name') ).is.equals('1');

    data.name = '2';

    expect( div.firstElementChild.getAttribute('name') ).is.equals('1');

    Hu.nextTick(() => {
      expect( div.firstElementChild.getAttribute('name') ).is.equals('2');

      done();
    });
  });

  it( '使用 Hu.html.bind 对元素属性和变量进行绑定, 只对观察者对象有效', ( done ) => {
    const bind = Hu.html.bind;
    const div = document.createElement('div');
    const data = {
      name: '1'
    };

    Hu.render( div )`
      <div name=${ bind( data, 'name' ) }></div>
    `;

    expect( div.firstElementChild.getAttribute('name') ).is.equals('1');

    data.name = '2';

    expect( div.firstElementChild.getAttribute('name') ).is.equals('1');

    Hu.nextTick(() => {
      expect( div.firstElementChild.getAttribute('name') ).is.equals('1');

      done();
    });
  });

  it( '使用 Hu.html.repeat 方法只能在文本区域中使用', () => {
    const repeat = Hu.html.repeat;
    const div = document.createElement('div');
    const arr = [ '1', '2', '3' ];

    Hu.render( div )`
      <div>${
        repeat( arr, item => item, item => {
          return Hu.html`<span>${ item }</span>`;
        })
      }</div>
    `;

    expect( div.firstElementChild.nodeName ).is.equals('DIV');
    expect( div.firstElementChild.children.length ).is.equals( 3 );
    expect( Array.from( div.firstElementChild.children ).map( elem => elem.nodeName ) ).is.deep.equals([ 'SPAN', 'SPAN', 'SPAN' ]);
    expect( Array.from( div.firstElementChild.children ).map( elem => elem.innerText ) ).is.deep.equals([ '1', '2', '3' ]);

    should.Throw(() => {
      Hu.render( div )`
        <div name=${
          repeat( arr, item => item, item => {
            return Hu.html`<span>${ item }</span>`;
          })
        }></div>
      `
    },'Hu.html.repeat 指令方法只能在文本区域中使用 !');
  });

  it( '使用 Hu.html.unsafe 方法只能在文本区域中使用', () => {
    const div = document.createElement('div');
    const span = '<span>123</span>';

    Hu.render( div )`
      <div>${
        Hu.html.unsafe( span )
      }</div>
    `;

    expect( div.firstElementChild.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.firstElementChild.firstElementChild.innerText ).is.equals('123');

    should.throw(() => {
      Hu.render( div )`
        <div name=${
          Hu.html.unsafe( span )
        }></div>
      `;
    }, 'Hu.html.unsafe 指令方法只能在文本区域中使用 !');
  });

  it( '使用 Hu.html.bind 方法只能在元素属性绑定中使用', ( done ) => {
    const bind = Hu.html.bind;
    const div = document.createElement('div');
    const data = Hu.observable({
      name: '1'
    });

    Hu.render( div )`
      <div name=${ bind( data, 'name' ) }></div>
    `;

    expect( div.firstElementChild.getAttribute('name') ).is.equals('1');

    data.name = '2';

    expect( div.firstElementChild.getAttribute('name') ).is.equals('1');

    Hu.nextTick(() => {
      expect( div.firstElementChild.getAttribute('name') ).is.equals('2');

      should.throw(() => {
        Hu.render( div )`
          <div>${ bind( data, 'name' ) }</div>
        `;
      }, 'Hu.html.bind 指令方法只能在元素属性绑定中使用 !');

      done();
    });
  });

});