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

  it( '使用 @event 绑定事件, 使用 .self 修饰符可以只在当前元素自身时触发事件时触发回调', () => {
    const div = document.createElement('div');
    let index = 0;

    Hu.render( div )`
      <div @click.self=${() => index++}>
        <span></span>
      </div>
    `;

    expect( index ).is.equals( 0 );

    div.firstElementChild.click();
    expect( index ).is.equals( 1 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );

    div.firstElementChild.firstElementChild.click();
    expect( index ).is.equals( 3 );

    div.firstElementChild.firstElementChild.click();
    div.firstElementChild.firstElementChild.click();
    expect( index ).is.equals( 3 );
  });

  it( '使用 @event 绑定事件, 不使用 .self 修饰符会按照正常冒泡触发回调', () => {
    const div = document.createElement('div');
    let index = 0;

    Hu.render( div )`
      <div @click=${() => index++}>
        <span></span>
      </div>
    `;

    expect( index ).is.equals( 0 );

    div.firstElementChild.click();
    expect( index ).is.equals( 1 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );

    div.firstElementChild.firstElementChild.click();
    expect( index ).is.equals( 4 );

    div.firstElementChild.firstElementChild.click();
    div.firstElementChild.firstElementChild.click();
    expect( index ).is.equals( 6 );
  });

  it( '使用 @event 绑定事件, 使用 .left / .middle / .right 修饰符限定鼠标按键', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        left: 0,
        middle: 0,
        right: 0
      },
      render( html ){
        return html`
          <div ref="left" @mousedown.left=${() => this.left++}>left</div>
          <div ref="middle" @mousedown.middle=${() => this.middle++}>middle</div>
          <div ref="right" @mousedown.right=${() => this.right++}>right</div>
        `;
      }
    });

    expect( hu.left ).is.equals( 0 );
    triggerEvent( hu.$refs.left, 'mousedown', event => event.button = 0 );
    expect( hu.left ).is.equals( 1 );
    triggerEvent( hu.$refs.left, 'mousedown', event => event.button = 1 );
    expect( hu.left ).is.equals( 1 );
    triggerEvent( hu.$refs.left, 'mousedown', event => event.button = 2 );
    expect( hu.left ).is.equals( 1 );

    expect( hu.middle ).is.equals( 0 );
    triggerEvent( hu.$refs.middle, 'mousedown', event => event.button = 0 );
    expect( hu.middle ).is.equals( 0 );
    triggerEvent( hu.$refs.middle, 'mousedown', event => event.button = 1 );
    expect( hu.middle ).is.equals( 1 );
    triggerEvent( hu.$refs.middle, 'mousedown', event => event.button = 2 );
    expect( hu.middle ).is.equals( 1 );

    expect( hu.right ).is.equals( 0 );
    triggerEvent( hu.$refs.right, 'mousedown', event => event.button = 0 );
    expect( hu.right ).is.equals( 0 );
    triggerEvent( hu.$refs.right, 'mousedown', event => event.button = 1 );
    expect( hu.right ).is.equals( 0 );
    triggerEvent( hu.$refs.right, 'mousedown', event => event.button = 2 );
    expect( hu.right ).is.equals( 1 );
  });
  
  it( '使用 @event 绑定事件, 使用 .ctrl / .alt / .shift / .meta 修饰符限定键盘按键', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        ctrl: 0,
        alt: 0,
        shift: 0,
        meta: 0
      },
      render( html ){
        return html`
          <div ref="ctrl" @mousedown.ctrl=${() => this.ctrl++}>ctrl</div>
          <div ref="alt" @mousedown.alt=${() => this.alt++}>alt</div>
          <div ref="shift" @mousedown.shift=${() => this.shift++}>shift</div>
          <div ref="meta" @mousedown.meta=${() => this.meta++}>meta</div>
        `;
      }
    });

    expect( hu.ctrl ).is.equals( 0 );
    triggerEvent( hu.$refs.ctrl, 'mousedown', event => event.ctrlKey = true );
    expect( hu.ctrl ).is.equals( 1 );
    triggerEvent( hu.$refs.ctrl, 'mousedown', event => event.altKey = true );
    expect( hu.ctrl ).is.equals( 1 );
    triggerEvent( hu.$refs.ctrl, 'mousedown', event => event.shiftKey = true );
    expect( hu.ctrl ).is.equals( 1 );
    triggerEvent( hu.$refs.ctrl, 'mousedown', event => event.metaKey = true );
    expect( hu.ctrl ).is.equals( 1 );

    expect( hu.alt ).is.equals( 0 );
    triggerEvent( hu.$refs.alt, 'mousedown', event => event.ctrlKey = true );
    expect( hu.alt ).is.equals( 0 );
    triggerEvent( hu.$refs.alt, 'mousedown', event => event.altKey = true );
    expect( hu.alt ).is.equals( 1 );
    triggerEvent( hu.$refs.alt, 'mousedown', event => event.shiftKey = true );
    expect( hu.alt ).is.equals( 1 );
    triggerEvent( hu.$refs.alt, 'mousedown', event => event.metaKey = true );
    expect( hu.alt ).is.equals( 1 );

    expect( hu.shift ).is.equals( 0 );
    triggerEvent( hu.$refs.shift, 'mousedown', event => event.ctrlKey = true );
    expect( hu.shift ).is.equals( 0 );
    triggerEvent( hu.$refs.shift, 'mousedown', event => event.altKey = true );
    expect( hu.shift ).is.equals( 0 );
    triggerEvent( hu.$refs.shift, 'mousedown', event => event.shiftKey = true );
    expect( hu.shift ).is.equals( 1 );
    triggerEvent( hu.$refs.shift, 'mousedown', event => event.metaKey = true );
    expect( hu.shift ).is.equals( 1 );

    expect( hu.meta ).is.equals( 0 );
    triggerEvent( hu.$refs.meta, 'mousedown', event => event.ctrlKey = true );
    expect( hu.meta ).is.equals( 0 );
    triggerEvent( hu.$refs.meta, 'mousedown', event => event.altKey = true );
    expect( hu.meta ).is.equals( 0 );
    triggerEvent( hu.$refs.meta, 'mousedown', event => event.shiftKey = true );
    expect( hu.meta ).is.equals( 0 );
    triggerEvent( hu.$refs.meta, 'mousedown', event => event.metaKey = true );
    expect( hu.meta ).is.equals( 1 );
  });

  it( '使用 @event 绑定事件, 使用 .exact 修饰符', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        "none": 0,
        "exact": 0,
        "ctrl.exact": 0,
        "alt.exact": 0,
        "shift.exact": 0,
        "meta.exact": 0,
        "ctrl.alt.exact": 0,
        "ctrl.alt.shift.exact": 0,
        "ctrl.alt.shift.meta.exact": 0,
      },
      render( html ){
        return html`
          <!-- 不使用 -->
          <div ref="none" @mousedown=${() => this['none']++}>exact</div>
          <!-- 单独使用 -->
          <div ref="exact" @mousedown.exact=${() => this['exact']++}>exact</div>
          <!-- 单个使用 -->
          <div ref="ctrl.exact" @mousedown.ctrl.exact=${() => this['ctrl.exact']++}>ctrl.exact</div>
          <div ref="alt.exact" @mousedown.alt.exact=${() => this['alt.exact']++}>alt.exact</div>
          <div ref="shift.exact" @mousedown.shift.exact=${() => this['shift.exact']++}>shift.exact</div>
          <div ref="meta.exact" @mousedown.meta.exact=${() => this['meta.exact']++}>meta.exact</div>
          <!-- 多个使用 -->
          <div ref="ctrl.alt.exact" @mousedown.ctrl.alt.exact=${() => this['ctrl.alt.exact']++}>ctrl.alt.exact</div>
          <div ref="ctrl.alt.shift.exact" @mousedown.ctrl.alt.shift.exact=${() => this['ctrl.alt.shift.exact']++}>ctrl.alt.shift.exact</div>
          <div ref="ctrl.alt.shift.meta.exact" @mousedown.ctrl.alt.shift.meta.exact=${() => this['ctrl.alt.shift.meta.exact']++}>ctrl.alt.shift.meta.exact</div>
        `;
      }
    });

    // 未使用 - 始终触发
    expect( hu['none'] ).is.equals( 0 );
    triggerEvent( hu.$refs['none'], 'mousedown' );
    expect( hu['none'] ).is.equals( 1 );
    triggerEvent( hu.$refs['none'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['none'] ).is.equals( 2 );
    triggerEvent( hu.$refs['none'], 'mousedown', event => event.altKey = true );
    expect( hu['none'] ).is.equals( 3 );
    triggerEvent( hu.$refs['none'], 'mousedown', event => event.shiftKey = true );
    expect( hu['none'] ).is.equals( 4 );
    triggerEvent( hu.$refs['none'], 'mousedown', event => event.metaKey = true );
    expect( hu['none'] ).is.equals( 5 );

    // 单独使用
    expect( hu['exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['exact'], 'mousedown' );
    expect( hu['exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['exact'], 'mousedown', event => event.altKey = true );
    expect( hu['exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['exact'] ).is.equals( 1 );

    // 单个使用 - ctrl
    expect( hu['ctrl.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.exact'], 'mousedown' );
    expect( hu['ctrl.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['ctrl.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.exact'], 'mousedown', event => event.altKey = true );
    expect( hu['ctrl.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['ctrl.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['ctrl.exact'] ).is.equals( 1 );
    // 单个使用 - alt
    expect( hu['alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['alt.exact'], 'mousedown' );
    expect( hu['alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['alt.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['alt.exact'], 'mousedown', event => event.altKey = true );
    expect( hu['alt.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['alt.exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['alt.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['alt.exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['alt.exact'] ).is.equals( 1 );
    // 单个使用 - shift
    expect( hu['shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['shift.exact'], 'mousedown' );
    expect( hu['shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['shift.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['shift.exact'], 'mousedown', event => event.altKey = true );
    expect( hu['shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['shift.exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['shift.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['shift.exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['shift.exact'] ).is.equals( 1 );
    // 单个使用 - meta
    expect( hu['meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['meta.exact'], 'mousedown' );
    expect( hu['meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['meta.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['meta.exact'], 'mousedown', event => event.altKey = true );
    expect( hu['meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['meta.exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['meta.exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['meta.exact'] ).is.equals( 1 );

    // 多个使用 - ctrl.alt.exact
    expect( hu['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown' );
    expect( hu['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => event.altKey = true );
    expect( hu['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.exact'] ).is.equals( 1 );
    // 多个使用 - ctrl.alt.shift.exact
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown' );
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.altKey = true );
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 1 );
    // 多个使用 - ctrl.alt.shift.meta.exact
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown' );
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.altKey = true );
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 1 );
  });

});