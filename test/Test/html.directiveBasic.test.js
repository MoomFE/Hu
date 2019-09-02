describe( 'html.directiveBasic', () => {

  const render = Hu.render;
  const html = Hu.html;

  /** @type {Element} */
  let div;
  beforeEach(() => {
    div = document.createElement('div').$appendTo( document.body );
  });
  afterEach(() => {
    div.$remove();
  });


  it( '使用 .attr 的方式对元素属性 ( Property ) 进行绑定', () => {
    render( div )`
      <div .prop=${{ a: 1, b: 2 }}></div>
    `;
    expect( div.firstElementChild.prop ).is.deep.equals({ a: 1, b: 2 });
    expect( div.firstElementChild.hasAttribute('prop') ).is.false;

    render( div )`
      <div .parent=${ div }></div>
    `;
    expect( div.firstElementChild.parent ).is.equals( div );
    expect( div.firstElementChild.hasAttribute('parent') ).is.false;

    render( div )`
      <div .prop=${ 123 }></div>
    `;
    expect( div.firstElementChild.prop ).is.equals( 123 );
    expect( div.firstElementChild.hasAttribute('prop') ).is.false;
  });

  it( '使用 ?attr 的方式对元素属性 ( Attribute ) 进行绑定', () => {
    render( div )`
      <input ?disabled=${ true }>
    `;
    expect( div.firstElementChild.hasAttribute('disabled') ).is.true;
    expect( div.firstElementChild.getAttribute('disabled') ).is.equals('');
    expect( div.firstElementChild.disabled ).is.true;

    render( div )`
      <input ?disabled=${ false }>
    `;
    expect( div.firstElementChild.hasAttribute('disabled') ).is.false;
    expect( div.firstElementChild.getAttribute('disabled') ).is.null;
    expect( div.firstElementChild.disabled ).is.false;
  });

  it( '使用 @event 的方式对元素绑定事件监听', () => {
    let index = 0;

    render( div )`
      <div @click=${() => index++}></div>
    `;

    expect( index ).is.equals( 0 );

    div.firstElementChild.click();
    expect( index ).is.equals( 1 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );
  });

  it( '使用 @event 的方式对元素绑定事件监听, 重复渲染时不会绑定多余的事件', () => {
    let index = 0;

    render( div )`
      <div @click=${() => index++}></div>
    `;
    render( div )`
      <div @click=${() => index++}></div>
    `;
    render( div )`
      <div @click=${() => index++}></div>
    `;

    expect( index ).is.equals( 0 );

    div.firstElementChild.click();
    expect( index ).is.equals( 1 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );
  });

  it( '使用 @event 的方式对元素绑定事件监听, 重复渲染时移除事件后将不会再触发', () => {
    let index = 0;

    render( div )`
      <div @click=${() => index++}></div>
    `;

    expect( index ).is.equals( 0 );

    div.firstElementChild.click();
    expect( index ).is.equals( 1 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );

    // ------
    render( div )`
      <div @click=${ undefined }></div>
    `;

    expect( index ).is.equals( 3 );

    div.firstElementChild.click();
    expect( index ).is.equals( 3 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );
  });

  it( '使用 @event 的方式对元素绑定事件监听, 使用 .stop 修饰符可以停止冒泡', () => {
    const result = [];

    render( div )`
      <div ref="none" @click=${() => result.push( 1 )}></div>
      <div ref="stop" @click.stop=${() => result.push( 2 )}></div>
    `;

    div.addEventListener('click', () => {
      result.push( 0 );
    });

    expect( result ).is.deep.equals([]);

    div.click();
    div.click();
    expect( result ).is.deep.equals([ 0, 0 ]);

    div.$queryFirst('[ref="none"]').click();
    div.$queryFirst('[ref="none"]').click();
    expect( result ).is.deep.equals([ 0, 0, 1, 0, 1, 0 ]);

    div.$queryFirst('[ref="stop"]').click();
    div.$queryFirst('[ref="stop"]').click();
    expect( result ).is.deep.equals([ 0, 0, 1, 0, 1, 0, 2, 2 ]);
  });

  it( '使用 @event 的方式对元素绑定事件监听, 使用 .prevent 修饰符可以阻止浏览器默认事件', () => {
    let none;
    let prevent;

    render( div )`
      <div ref="none" type="checkbox" @click=${event => none = event.defaultPrevented}></div>
      <div ref="prevent" type="checkbox" @click.prevent=${event => prevent = event.defaultPrevented}></div>
    `;

    expect( none ).is.undefined;
    expect( prevent ).is.undefined;

    div.$queryFirst('[ref="none"]').click();
    div.$queryFirst('[ref="prevent"]').click();

    expect( none ).is.false;
    expect( prevent ).is.true;
  });

  it( '使用 @event 的方式对元素绑定事件监听, 使用 .self 修饰符可以只在当前元素自身时触发事件时触发回调', () => {
    let result = [];

    render( div )`
      <div ref="none" @click=${() => result.push( 0 )}>
        <span></span>
      </div>
      <div ref="self" @click.self=${() => result.push( 1 )}>
        <span></span>
      </div>
    `;

    expect( result ).is.deep.equals([]);

    div.$queryFirst('[ref="none"]').click();
    div.$queryFirst('[ref="self"]').click();
    div.$queryFirst('[ref="none"]').click();
    div.$queryFirst('[ref="self"]').click();
    expect( result ).is.deep.equals([ 0, 1, 0, 1 ]);

    div.$queryFirst('[ref="none"]').firstElementChild.click();
    div.$queryFirst('[ref="self"]').firstElementChild.click();
    div.$queryFirst('[ref="none"]').firstElementChild.click();
    div.$queryFirst('[ref="self"]').firstElementChild.click();
    expect( result ).is.deep.equals([ 0, 1, 0, 1, 0, 0 ]);
  });

});