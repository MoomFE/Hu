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
    const result = [];
    const hu = new Hu({
      el: div,
      render( html ){
        return html`
          <div ref="none" @click=${() => result.push( 1 )}></div>
          <div ref="stop" @click.stop=${() => result.push( 2 )}></div>
        `;
      },
      mounted(){
        this.$el.addEventListener( 'click', () => {
          result.push( 0 );
        });
      }
    });

    expect( result ).is.deep.equals([ ]);

    div.click();
    div.click();
    expect( result ).is.deep.equals([ 0, 0 ]);

    hu.$refs.none.click();
    hu.$refs.none.click();
    expect( result ).is.deep.equals([ 0, 0, 1, 0, 1, 0 ]);

    hu.$refs.stop.click();
    hu.$refs.stop.click();
    expect( result ).is.deep.equals([ 0, 0, 1, 0, 1, 0, 2, 2 ]);
  });

  it( '使用 @event 绑定事件, 使用 .stop 修饰符可以停止冒泡 ( Vue )', () => {
    const div = document.createElement('div');
    const result = [];
    const vm = new Vue({
      el: div,
      template: `
        <div @click="method0">
          <div ref="none" @click="method1"></div>
          <div ref="stop" @click.stop="method2"></div>
        </div>
      `,
      methods: {
        method0(){
          result.push( 0 );
        },
        method1(){
          result.push( 1 );
        },
        method2(){
          result.push( 2 );
        }
      }
    });

    expect( result ).is.deep.equals([ ]);

    vm.$el.click();
    vm.$el.click();
    expect( result ).is.deep.equals([ 0, 0 ]);

    vm.$refs.none.click();
    vm.$refs.none.click();
    expect( result ).is.deep.equals([ 0, 0, 1, 0, 1, 0 ]);

    vm.$refs.stop.click();
    vm.$refs.stop.click();
    expect( result ).is.deep.equals([ 0, 0, 1, 0, 1, 0, 2, 2 ]);
  });

  it( '使用 @event 绑定事件, 使用 .prevent 修饰符可以阻止浏览器默认事件', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      render( html ){
        return html`
          <input ref="none" type="checkbox" @click=${() => {}}>
          <input ref="prevent" type="checkbox" @click.prevent=${() => {}}>
        `;
      }
    });

    expect( hu.$refs.none.checked ).is.false;
    expect( hu.$refs.prevent.checked ).is.false;

    hu.$refs.none.click();
    hu.$refs.prevent.click();

    expect( hu.$refs.none.checked ).is.true;
    expect( hu.$refs.prevent.checked ).is.false;
  });

  it( '使用 @event 绑定事件, 使用 .prevent 修饰符可以阻止浏览器默认事件 ( Vue )', () => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      template: `
        <div>
          <input ref="none" type="checkbox" @click>
          <input ref="prevent" type="checkbox" @click.prevent>
        </div>
      `
    });

    expect( vm.$refs.none.checked ).is.false;
    expect( vm.$refs.prevent.checked ).is.false;

    vm.$refs.none.click();
    vm.$refs.prevent.click();

    expect( vm.$refs.none.checked ).is.true;
    expect( vm.$refs.prevent.checked ).is.false;
  });

  it( '使用 @event 绑定事件, 使用 .self 修饰符可以只在当前元素自身时触发事件时触发回调', () => {
    const div = document.createElement('div');
    const result = [];
    const hu = new Hu({
      el: div,
      render( html ){
        return html`
          <div ref="none" @click=${() => result.push( 0 )}>
            <span></span>
          </div>
          <div ref="self" @click.self=${() => result.push( 1 )}>
            <span></span>
          </div>
        `;
      }
    });

    expect( result ).is.deep.equals([ ]);

    hu.$refs.none.click();
    hu.$refs.self.click();
    hu.$refs.none.click();
    hu.$refs.self.click();
    expect( result ).is.deep.equals([ 0, 1, 0, 1 ]);

    hu.$refs.none.firstElementChild.click();
    hu.$refs.self.firstElementChild.click();
    hu.$refs.none.firstElementChild.click();
    hu.$refs.self.firstElementChild.click();
    expect( result ).is.deep.equals([ 0, 1, 0, 1, 0, 0 ]);
  });

  it( '使用 @event 绑定事件, 使用 .self 修饰符可以只在当前元素自身时触发事件时触发回调 ( Vue )', () => {
    const div = document.createElement('div');
    const result = [];
    const vm = new Vue({
      el: div,
      template: `
        <div>
          <div ref="none" @click="method0">
            <span></span>
          </div>
          <div ref="self" @click.self="method1">
            <span></span>
          </div>
        </div>
      `,
      methods: {
        method0(){
          result.push( 0 );
        },
        method1(){
          result.push( 1 );
        }
      }
    });

    expect( result ).is.deep.equals([ ]);

    vm.$refs.none.click();
    vm.$refs.self.click();
    vm.$refs.none.click();
    vm.$refs.self.click();
    expect( result ).is.deep.equals([ 0, 1, 0, 1 ]);

    vm.$refs.none.firstElementChild.click();
    vm.$refs.self.firstElementChild.click();
    vm.$refs.none.firstElementChild.click();
    vm.$refs.self.firstElementChild.click();
    expect( result ).is.deep.equals([ 0, 1, 0, 1, 0, 0 ]);
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

  it( '使用 @event 绑定事件, 使用 .left / .middle / .right 修饰符限定鼠标按键 ( Vue )', () => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        left: 0,
        middle: 0,
        right: 0
      },
      template: `
        <div>
          <div ref="left" @mousedown.left="left++">left</div>
          <div ref="middle" @mousedown.middle="middle++">middle</div>
          <div ref="right" @mousedown.right="right++">right</div>
        </div>
      `
    });

    expect( vm.left ).is.equals( 0 );
    triggerEvent( vm.$refs.left, 'mousedown', event => event.button = 0 );
    expect( vm.left ).is.equals( 1 );
    triggerEvent( vm.$refs.left, 'mousedown', event => event.button = 1 );
    expect( vm.left ).is.equals( 1 );
    triggerEvent( vm.$refs.left, 'mousedown', event => event.button = 2 );
    expect( vm.left ).is.equals( 1 );

    expect( vm.middle ).is.equals( 0 );
    triggerEvent( vm.$refs.middle, 'mousedown', event => event.button = 0 );
    expect( vm.middle ).is.equals( 0 );
    triggerEvent( vm.$refs.middle, 'mousedown', event => event.button = 1 );
    expect( vm.middle ).is.equals( 1 );
    triggerEvent( vm.$refs.middle, 'mousedown', event => event.button = 2 );
    expect( vm.middle ).is.equals( 1 );

    expect( vm.right ).is.equals( 0 );
    triggerEvent( vm.$refs.right, 'mousedown', event => event.button = 0 );
    expect( vm.right ).is.equals( 0 );
    triggerEvent( vm.$refs.right, 'mousedown', event => event.button = 1 );
    expect( vm.right ).is.equals( 0 );
    triggerEvent( vm.$refs.right, 'mousedown', event => event.button = 2 );
    expect( vm.right ).is.equals( 1 );
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

  it( '使用 @event 绑定事件, 使用 .ctrl / .alt / .shift / .meta 修饰符限定键盘按键 ( Vue )', () => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        ctrl: 0,
        alt: 0,
        shift: 0,
        meta: 0
      },
      template: `
        <div>
          <div ref="ctrl" @mousedown.ctrl="ctrl++">ctrl</div>
          <div ref="alt" @mousedown.alt="alt++">alt</div>
          <div ref="shift" @mousedown.shift="shift++">shift</div>
          <div ref="meta" @mousedown.meta="meta++">meta</div>
        </div>
      `
    });

    expect( vm.ctrl ).is.equals( 0 );
    triggerEvent( vm.$refs.ctrl, 'mousedown', event => event.ctrlKey = true );
    expect( vm.ctrl ).is.equals( 1 );
    triggerEvent( vm.$refs.ctrl, 'mousedown', event => event.altKey = true );
    expect( vm.ctrl ).is.equals( 1 );
    triggerEvent( vm.$refs.ctrl, 'mousedown', event => event.shiftKey = true );
    expect( vm.ctrl ).is.equals( 1 );
    triggerEvent( vm.$refs.ctrl, 'mousedown', event => event.metaKey = true );
    expect( vm.ctrl ).is.equals( 1 );

    expect( vm.alt ).is.equals( 0 );
    triggerEvent( vm.$refs.alt, 'mousedown', event => event.ctrlKey = true );
    expect( vm.alt ).is.equals( 0 );
    triggerEvent( vm.$refs.alt, 'mousedown', event => event.altKey = true );
    expect( vm.alt ).is.equals( 1 );
    triggerEvent( vm.$refs.alt, 'mousedown', event => event.shiftKey = true );
    expect( vm.alt ).is.equals( 1 );
    triggerEvent( vm.$refs.alt, 'mousedown', event => event.metaKey = true );
    expect( vm.alt ).is.equals( 1 );

    expect( vm.shift ).is.equals( 0 );
    triggerEvent( vm.$refs.shift, 'mousedown', event => event.ctrlKey = true );
    expect( vm.shift ).is.equals( 0 );
    triggerEvent( vm.$refs.shift, 'mousedown', event => event.altKey = true );
    expect( vm.shift ).is.equals( 0 );
    triggerEvent( vm.$refs.shift, 'mousedown', event => event.shiftKey = true );
    expect( vm.shift ).is.equals( 1 );
    triggerEvent( vm.$refs.shift, 'mousedown', event => event.metaKey = true );
    expect( vm.shift ).is.equals( 1 );

    expect( vm.meta ).is.equals( 0 );
    triggerEvent( vm.$refs.meta, 'mousedown', event => event.ctrlKey = true );
    expect( vm.meta ).is.equals( 0 );
    triggerEvent( vm.$refs.meta, 'mousedown', event => event.altKey = true );
    expect( vm.meta ).is.equals( 0 );
    triggerEvent( vm.$refs.meta, 'mousedown', event => event.shiftKey = true );
    expect( vm.meta ).is.equals( 0 );
    triggerEvent( vm.$refs.meta, 'mousedown', event => event.metaKey = true );
    expect( vm.meta ).is.equals( 1 );
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

  it( '使用 @event 绑定事件, 使用 .exact 修饰符 ( Vue )', () => {
    const div = document.createElement('div');
    const vm = new Vue({
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
      template: `
        <div>
          <!-- 不使用 -->
          <div ref="none" @mousedown="$data['none']++">exact</div>
          <!-- 单独使用 -->
          <div ref="exact" @mousedown.exact="$data['exact']++">exact</div>
          <!-- 单个使用 -->
          <div ref="ctrl.exact" @mousedown.ctrl.exact="$data['ctrl.exact']++">ctrl.exact</div>
          <div ref="alt.exact" @mousedown.alt.exact="$data['alt.exact']++">alt.exact</div>
          <div ref="shift.exact" @mousedown.shift.exact="$data['shift.exact']++">shift.exact</div>
          <div ref="meta.exact" @mousedown.meta.exact="$data['meta.exact']++">meta.exact</div>
          <!-- 多个使用 -->
          <div ref="ctrl.alt.exact" @mousedown.ctrl.alt.exact="$data['ctrl.alt.exact']++">ctrl.alt.exact</div>
          <div ref="ctrl.alt.shift.exact" @mousedown.ctrl.alt.shift.exact="$data['ctrl.alt.shift.exact']++">ctrl.alt.shift.exact</div>
          <div ref="ctrl.alt.shift.meta.exact" @mousedown.ctrl.alt.shift.meta="$data['ctrl.alt.shift.meta.exact']++">ctrl.alt.shift.meta.exact</div>
        </div>
      `
    });

    // 未使用 - 始终触发
    expect( vm['none'] ).is.equals( 0 );
    triggerEvent( vm.$refs['none'], 'mousedown' );
    expect( vm['none'] ).is.equals( 1 );
    triggerEvent( vm.$refs['none'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['none'] ).is.equals( 2 );
    triggerEvent( vm.$refs['none'], 'mousedown', event => event.altKey = true );
    expect( vm['none'] ).is.equals( 3 );
    triggerEvent( vm.$refs['none'], 'mousedown', event => event.shiftKey = true );
    expect( vm['none'] ).is.equals( 4 );
    triggerEvent( vm.$refs['none'], 'mousedown', event => event.metaKey = true );
    expect( vm['none'] ).is.equals( 5 );

    // 单独使用
    expect( vm['exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['exact'], 'mousedown' );
    expect( vm['exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['exact'], 'mousedown', event => event.altKey = true );
    expect( vm['exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['exact'] ).is.equals( 1 );

    // 单个使用 - ctrl
    expect( vm['ctrl.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.exact'], 'mousedown' );
    expect( vm['ctrl.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['ctrl.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.exact'], 'mousedown', event => event.altKey = true );
    expect( vm['ctrl.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['ctrl.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['ctrl.exact'] ).is.equals( 1 );
    // 单个使用 - alt
    expect( vm['alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['alt.exact'], 'mousedown' );
    expect( vm['alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['alt.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['alt.exact'], 'mousedown', event => event.altKey = true );
    expect( vm['alt.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['alt.exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['alt.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['alt.exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['alt.exact'] ).is.equals( 1 );
    // 单个使用 - shift
    expect( vm['shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['shift.exact'], 'mousedown' );
    expect( vm['shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['shift.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['shift.exact'], 'mousedown', event => event.altKey = true );
    expect( vm['shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['shift.exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['shift.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['shift.exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['shift.exact'] ).is.equals( 1 );
    // 单个使用 - meta
    expect( vm['meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['meta.exact'], 'mousedown' );
    expect( vm['meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['meta.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['meta.exact'], 'mousedown', event => event.altKey = true );
    expect( vm['meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['meta.exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['meta.exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['meta.exact'] ).is.equals( 1 );

    // 多个使用 - ctrl.alt.exact
    expect( vm['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown' );
    expect( vm['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => event.altKey = true );
    expect( vm['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.exact'] ).is.equals( 1 );
    // 多个使用 - ctrl.alt.shift.exact
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown' );
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.altKey = true );
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 1 );
    // 多个使用 - ctrl.alt.shift.meta.exact
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown' );
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.altKey = true );
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 1 );
  });

  it( '使用 @event 绑定事件, 使用 .capture 修饰符', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        none: [],
        capture: []
      },
      render( html ){
        return html`
          <div ref="none" @click=${() => this.none.push(0)}>
            <div @click=${() => this.none.push(1)}></div>
          </div>
          <div ref="capture" @click.capture=${() => this.capture.push(0)}>
            <div @click=${() => this.capture.push(1)}></div>
          </div>
        `;
      }
    });

    expect( hu.none ).is.deep.equals([ ]);
    expect( hu.capture ).is.deep.equals([ ]);

    hu.$refs.none.firstElementChild.click();
    hu.$refs.capture.firstElementChild.click();

    expect( hu.none ).is.deep.equals([ 1, 0 ]);
    expect( hu.capture ).is.deep.equals([ 0, 1 ]);
  });

  it( '使用 @event 绑定事件, 使用 .capture 修饰符 ( Vue )', () => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        none: [],
        capture: []
      },
      template: `
        <div>
          <div ref="none" @click="none.push(0)">
            <div @click="none.push(1)"></div>
          </div>
          <div ref="capture" @click.capture="capture.push(0)">
            <div @click="capture.push(1)"></div>
          </div>
        </div>
      `
    });

    expect( vm.none ).is.deep.equals([ ]);
    expect( vm.capture ).is.deep.equals([ ]);

    vm.$refs.none.firstElementChild.click();
    vm.$refs.capture.firstElementChild.click();

    expect( vm.none ).is.deep.equals([ 1, 0 ]);
    expect( vm.capture ).is.deep.equals([ 0, 1 ]);
  });

  it( '使用 @event 绑定事件, 使用 .passive 修饰符', () => {
    let supportsPassive = false;

    try{

      const options = {};

      Reflect.defineProperty( options, 'passive', {
        get: () => {
          return supportsPassive = true;
        }
      });

      window.addEventListener( 'test-passive', null, options );

    }catch(e){}

    if( supportsPassive ){
      const div = document.createElement('div');
      const hu = new Hu({
        el: div,
        render( html ){
          return html`
            <input type="checkbox" ref="none" @click=${ this.prevent }/>
            <input type="checkbox" ref="passive" @click.passive=${ this.prevent }/>
            <input type="checkbox" ref="exclusive" @click.prevent.passive=${ this.prevent }/>
          `;
        },
        methods: {
          prevent( event ){
            event.preventDefault();
          }
        }
      });

      expect( hu.$refs.none.checked ).is.false;
      expect( hu.$refs.passive.checked ).is.false;
      expect( hu.$refs.exclusive.checked ).is.false;
      hu.$refs.none.click();
      hu.$refs.passive.click();
      hu.$refs.exclusive.click();
      expect( hu.$refs.none.checked ).is.false;
      expect( hu.$refs.passive.checked ).is.true;
      expect( hu.$refs.exclusive.checked ).is.true;
    }
  });

  it( '使用 @event 绑定事件, 使用 .passive 修饰符 ( Vue )', () => {
    let supportsPassive = false;

    try{

      const options = {};

      Reflect.defineProperty( options, 'passive', {
        get: () => {
          return supportsPassive = true;
        }
      });

      window.addEventListener( 'test-passive', null, options );

    }catch(e){}

    if( supportsPassive ){
      const div = document.createElement('div');

      errorStart();

      const vm = new Vue({
        el: div,
        template: `
          <div>
            <input type="checkbox" ref="none" @click="prevent"/>
            <input type="checkbox" ref="passive" @click.passive="prevent"/>
            <input type="checkbox" ref="exclusive" @click.prevent.passive="prevent"/>
          </div>
        `,
        methods: {
          prevent( event ){
            event.preventDefault();
          }
        }
      });

      errorEnd();

      expect( vm.$refs.none.checked ).is.false;
      expect( vm.$refs.passive.checked ).is.false;
      expect( vm.$refs.exclusive.checked ).is.false;
      vm.$refs.none.click();
      vm.$refs.passive.click();
      vm.$refs.exclusive.click();
      expect( vm.$refs.none.checked ).is.false;
      expect( vm.$refs.passive.checked ).is.true;
      expect( vm.$refs.exclusive.checked ).is.true;
      expect( errorMsg ).is.include('passive and prevent can\'t be used together. Passive handler can\'t prevent default event.');
    }
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        none: 0,
        once: 0
      },
      render( html ){
        return html`
          <div ref="none" @click=${() => this.none++}></div>
          <div ref="once" @click.once=${() => this.once++}></div>
        `;
      }
    });

    expect( hu.none ).is.equals( 0 );
    expect( hu.once ).is.equals( 0 );

    hu.$refs.none.click();
    expect( hu.none ).is.equals( 1 );

    hu.$refs.none.click();
    hu.$refs.none.click();
    expect( hu.none ).is.equals( 3 );

    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );

    hu.$refs.once.click();
    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符 ( Vue )', () => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        none: 0,
        once: 0
      },
      template: `
        <div>
          <div ref="none" @click="none++"></div>
          <div ref="once" @click.once="once++"></div>
        </div>
      `
    });

    expect( vm.none ).is.equals( 0 );
    expect( vm.once ).is.equals( 0 );

    vm.$refs.none.click();
    expect( vm.none ).is.equals( 1 );

    vm.$refs.none.click();
    vm.$refs.none.click();
    expect( vm.none ).is.equals( 3 );

    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );

    vm.$refs.once.click();
    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发前重新渲染不会影响事件绑定', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        once: 0
      },
      render( html ){
        return html`
          <div ref="once" @click.once=${() => this.once++}></div>
        `;
      }
    });

    expect( hu.once ).is.equals( 0 );

    hu.$forceUpdate();
    hu.$forceUpdate();

    expect( hu.once ).is.equals( 0 );

    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );

    hu.$refs.once.click();
    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发前重新渲染不会影响事件绑定 ( Vue )', () => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        once: 0
      },
      template: `
        <div ref="once" @click.once="once++"></div>
      `
    });

    expect( vm.once ).is.equals( 0 );

    vm.$forceUpdate();
    vm.$forceUpdate();

    expect( vm.once ).is.equals( 0 );

    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );

    vm.$refs.once.click();
    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发后重新渲染不会影响事件绑定', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        once: 0
      },
      render( html ){
        return html`
          <div ref="once" @click.once=${() => this.once++}></div>
        `;
      }
    });

    expect( hu.once ).is.equals( 0 );

    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );

    hu.$refs.once.click();
    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );

    hu.$forceUpdate();
    hu.$forceUpdate();

    expect( hu.once ).is.equals( 1 );

    hu.$refs.once.click();
    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发后重新渲染不会影响事件绑定 ( Vue )', () => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        once: 0
      },
      template: `
        <div ref="once" @click.once="once++"></div>
      `
    });

    expect( vm.once ).is.equals( 0 );

    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );

    vm.$refs.once.click();
    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );

    vm.$forceUpdate();
    vm.$forceUpdate();

    expect( vm.once ).is.equals( 1 );

    vm.$refs.once.click();
    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发前不允许对绑定的事件进行替换', ( done ) => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        change: true,
        once: 0
      },
      render( html ){
        return html`
          <div ref="once" @click.once=${ this.change ? this.once1 : this.once2 }></div>
        `;
      },
      methods: {
        once1(){ this.once++ },
        once2(){ this.once+=2 }
      }
    });

    expect( hu.once ).is.equals( 0 );

    hu.change = false;
    hu.$nextTick(() => {
      expect( hu.once ).is.equals( 0 );

      hu.$refs.once.click();
      expect( hu.once ).is.equals( 1 );

      hu.$refs.once.click();
      hu.$refs.once.click();
      expect( hu.once ).is.equals( 1 );

      done();
    });
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发前不允许对绑定的事件进行替换 ( Vue )', ( done ) => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        change: true,
        once: 0
      },
      render( create ){
        return create( 'div', {
          on: {
            '~click': this.change ? this.once1 : this.once2
          },
          ref: 'once'
        });
      },
      methods: {
        once1(){ this.once++ },
        once2(){ this.once+=2 }
      }
    });

    expect( vm.once ).is.equals( 0 );

    vm.change = false;
    vm.$nextTick(() => {
      expect( vm.once ).is.equals( 0 );

      vm.$refs.once.click();
      expect( vm.once ).is.equals( 1 );

      vm.$refs.once.click();
      vm.$refs.once.click();
      expect( vm.once ).is.equals( 1 );

      done();
    });
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发后不允许对绑定的事件进行替换', ( done ) => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        change: true,
        once: 0
      },
      render( html ){
        return html`
          <div ref="once" @click.once=${ this.change ? this.once1 : this.once2 }></div>
        `;
      },
      methods: {
        once1(){ this.once++ },
        once2(){ this.once+=2 }
      }
    });

    expect( hu.once ).is.equals( 0 );

    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );

    hu.$refs.once.click();
    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );

    hu.change = false;
    hu.$nextTick(() => {
      expect( hu.once ).is.equals( 1 );

      hu.$refs.once.click();
      expect( hu.once ).is.equals( 1 );

      hu.$refs.once.click();
      hu.$refs.once.click();
      expect( hu.once ).is.equals( 1 );

      done();
    });
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发后不允许对绑定的事件进行替换 ( Vue )', ( done ) => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        change: true,
        once: 0
      },
      render( create ){
        return create( 'div', {
          on: {
            '~click': this.change ? this.once1 : this.once2
          },
          ref: 'once'
        });
      },
      methods: {
        once1(){ this.once++ },
        once2(){ this.once+=2 }
      }
    });

    expect( vm.once ).is.equals( 0 );

    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );

    vm.$refs.once.click();
    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );

    vm.change = false;
    vm.$nextTick(() => {
      expect( vm.once ).is.equals( 1 );

      vm.$refs.once.click();
      expect( vm.once ).is.equals( 1 );

      vm.$refs.once.click();
      vm.$refs.once.click();
      expect( vm.once ).is.equals( 1 );

      done();
    });
  });

});