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

  it( '使用 Hu.html.unsafe / Hu.html.unsafeHTML 忽略对 HTML 进行转义', () => {
    const div = document.createElement('div');
    const span = '<span>123</span>';

    Hu.render( div )`${
      Hu.html.unsafe( span )
    }`;

    expect( div.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.firstElementChild.innerText ).is.equals('123');
  });

  it( '不使用 Hu.html.unsafe / Hu.html.unsafeHTML 将始终对 HTML 进行转义', () => {
    const div = document.createElement('div');
    const span = '<span>123</span>';

    Hu.render( div )`${
      span
    }`;

    expect( div.firstElementChild ).is.null;
    expect( div.innerText ).is.equals( span );
  });

  it( '使用 :class 对元素 className 进行绑定 - 字符串方式', () => {
    const div = document.createElement('div');

    // 1
    Hu.render( div )`
      <div :class=${ 'a b c' }></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);

    // 2
    Hu.render( div )`
      <div class="a" :class=${ 'b c' }></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);
  });

  it( '使用 :class 对元素 className 进行绑定 - JSON 方式', () => {
    const div = document.createElement('div');

    // 1
    Hu.render( div )`
      <div :class=${{ a: true, b: true, c: true }}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);

    // 2
    Hu.render( div )`
      <div :class=${{ a: true, b: false, c: true }}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'c' ]);

    // 3
    Hu.render( div )`
      <div class="a" :class=${{ b: true, c: true }}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);

    // 4
    Hu.render( div )`
      <div class="a" :class=${{ b: false, c: true }}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'c' ]);
  });

  it( '使用 :class 对元素 className 进行绑定 - 数组方式', () => {
    const div = document.createElement('div');

    // 1
    Hu.render( div )`
      <div :class=${[ 'a', 'b', 'c' ]}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);

    // 2
    Hu.render( div )`
      <div :class=${[ { a: true }, 'b', { c: true } ]}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);

    // 3
    Hu.render( div )`
      <div :class=${[ 'a b', { c: false } ]}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b' ]);

    // 4
    Hu.render( div )`
      <div class="a" :class=${[ 'b', 'c' ]}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);

    // 5
    Hu.render( div )`
      <div class="a" :class=${[ 'b', { c: true } ]}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);

    // 6
    Hu.render( div )`
      <div class="a" :class=${[ 'b', { c: false } ]}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b' ]);
  });

  it( '使用 :style 对元素 style 进行绑定 - 字符串方式', () => {
    const div = document.createElement('div');

    // 1
    Hu.render( div )`
      <div :style=${ 'width: 100px; height: 120px' }></div>
    `;

    expect( div.firstElementChild.style ).is.deep.include({
      width: '100px',
      height: '120px'
    });

    // 2
    Hu.render( div )`
      <div style="width: 100px" :style=${ 'height: 120px' }></div>
    `;

    expect( div.firstElementChild.style ).is.deep.include({
      width: '100px',
      height: '120px'
    });
  });

  it( '使用 :style 对元素 style 进行绑定 - JSON 方式', () => {
    var div = document.createElement('div');

    // 1
    Hu.render( div )`
      <div :style=${{ width: '100px', height: '120px' }}></div>
    `;

    expect( div.firstElementChild.style ).is.deep.include({
      width: '100px',
      height: '120px'
    });

    // 2
    Hu.render( div )`
      <div style="width: 100px" :style=${{ height: '120px' }}></div>
    `;

    expect( div.firstElementChild.style ).is.deep.include({
      width: '100px',
      height: '120px'
    });
  });

  it( '使用 :style 对元素 style 进行绑定 - 数组方式', () => {
    var div = document.createElement('div');

    // 1
    Hu.render( div )`
      <div :style=${[ 'width: 100px', { height: '120px' } ]}></div>
    `;

    expect( div.firstElementChild.style ).is.deep.include({
      width: '100px',
      height: '120px'
    });

    // 2
    Hu.render( div )`
      <div style="width: 100px" :style=${[ { height: '120px' } ]}></div>
    `;

    expect( div.firstElementChild.style ).is.deep.include({
      width: '100px',
      height: '120px'
    });
  });

  it( '使用 @event 可以给元素绑定事件', () => {
    const div = document.createElement('div');
    let index = 0;

    Hu.render( div )`
      <div @click=${() => index++}></div>
    `;

    expect( index ).is.equals( 0 );

    div.firstElementChild.click();
    expect( index ).is.equals( 1 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );
  });

  it( '使用 @event 绑定事件, 重复渲染时不会绑定多余的事件', () => {
    const div = document.createElement('div');
    let index = 0;

    Hu.render( div )`
      <div @click=${() => index++}></div>
    `;
    Hu.render( div )`
      <div @click=${() => index++}></div>
    `;
    Hu.render( div )`
      <div @click=${() => index++}></div>
    `;

    expect( index ).is.equals( 0 );

    div.firstElementChild.click();
    expect( index ).is.equals( 1 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );
  });

  it( '使用 @event 绑定事件, 重复渲染时不会绑定多余的事件 ( 二 )', () => {
    const div = document.createElement('div');
    let index = 0;

    function listener(){
      index++
    }

    Hu.render( div )`
      <div @click=${ listener }></div>
    `;
    Hu.render( div )`
      <div @click=${ listener }></div>
    `;
    Hu.render( div )`
      <div @click=${ listener }></div>
    `;

    expect( index ).is.equals( 0 );

    div.firstElementChild.click();
    expect( index ).is.equals( 1 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );
  });

  it( '使用 @event 绑定事件, 重复渲染时移除事件后将不会再触发', () => {
    const div = document.createElement('div');
    let index = 0;

    Hu.render( div )`
      <div @click=${() => index++}></div>
    `;

    expect( index ).is.equals( 0 );

    div.firstElementChild.click();
    expect( index ).is.equals( 1 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );

    Hu.render( div )`
      <div></div>
    `;

    expect( index ).is.equals( 3 );

    div.firstElementChild.click();
    expect( index ).is.equals( 3 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );
  });

  it( '使用 @event 绑定事件, 使用 .stop 修饰符可以停止冒泡', () => {
    const div = document.createElement('div');
    let result = [];

    div.addEventListener( 'click', () => {
      result.push( 0 );
    });

    Hu.render( div )`
      <div @click.stop=${() => result.push( 1 )}></div>
    `;

    expect( result ).is.deep.equals([]);

    div.firstElementChild.click();
    expect( result ).is.deep.equals([ 1 ]);

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( result ).is.deep.equals([ 1, 1, 1 ]);
  });

  it( '使用 @event 绑定事件, 不使用 .stop 修饰符将会正常冒泡', () => {
    const div = document.createElement('div');
    let result = [];

    div.addEventListener( 'click', () => {
      result.push( 0 );
    });

    Hu.render( div )`
      <div @click=${() => result.push( 1 )}></div>
    `;

    expect( result ).is.deep.equals([]);

    div.firstElementChild.click();
    expect( result ).is.deep.equals([ 1, 0 ]);

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( result ).is.deep.equals([ 1, 0, 1, 0, 1, 0 ]);
  });

  it( '使用 @event 绑定事件, 使用 .prevent 修饰符可以阻止浏览器默认事件', () => {
    var div = document.createElement('div');

    Hu.render( div )`
      <input type="checkbox" @click.prevent=${() => {}}>
    `;

    expect( div.firstElementChild.checked ).is.equals( false );

    div.firstElementChild.click();

    expect( div.firstElementChild.checked ).is.equals( false );
  });

  it( '使用 @event 绑定事件, 不使用 .prevent 修饰符将会正常触发浏览器默认事件', () => {
    var div = document.createElement('div');

    Hu.render( div )`
      <input type="checkbox" @click=${() => {}}>
    `;

    expect( div.firstElementChild.checked ).is.equals( false );

    div.firstElementChild.click();

    expect( div.firstElementChild.checked ).is.equals( true );
  });

});