describe( 'Hu.html', () => {

  it( '不使用 html.repeat 渲染数组, 数组变化时将会尽可能的重用之前的元素进行渲染', () => {
    const div1 = document.createElement('div');
    const arr = [
      { text: '1', key: 1 }, { text: '2', key: 2 }, { text: '3', key: 3 },
      { text: '4', key: 4 }, { text: '5', key: 5 }, { text: '6', key: 6 }
    ];

    function render(){
      return Hu.html`${
        arr.map( data => Hu.html`<span>${ data.text }</span>` )
      }`;
    }

    Hu.render(
      render(),
      div1
    );

    // 保存当前的元素顺序
    const children = Array.from( div1.children );
    // 保存当前的元素内容顺序
    const childrenText = children.map( elem => elem.innerHTML );

    // 逆序后重新渲染
    arr.reverse();
    Hu.render(
      render(),
      div1
    );

    // 保存最新的元素顺序
    const newChildren = Array.from( div1.children );
    // 保存最新的元素内容顺序
    const newChildrenText = newChildren.map( elem => elem.innerHTML );

    // 元素顺序未交换
    expect( children ).is.deep.equals( newChildren );
    // 内容变换了
    expect( childrenText ).is.deep.equals( newChildrenText.reverse() );
  });

  it( '使用 html.repeat 渲染数组, 可以在数组变化时基于 key 的变化重新排列元素顺序而不是重新渲染他们', () => {
    const div1 = document.createElement('div');
    const arr = [
      { text: '1', key: 1 }, { text: '2', key: 2 }, { text: '3', key: 3 },
      { text: '4', key: 4 }, { text: '5', key: 5 }, { text: '6', key: 6 }
    ];

    function render(){
      return Hu.html`${
        Hu.html.repeat( arr, 'key', data => Hu.html`<span>${ data.text }</span>` )
      }`;
    }

    Hu.render(
      render(),
      div1
    );

    // 保存当前的元素顺序
    const children = Array.from( div1.children );
    // 保存当前的元素内容顺序
    const childrenText = children.map( elem => elem.innerHTML );

    // 逆序后重新渲染
    arr.reverse();
    Hu.render(
      render(),
      div1
    );

    // 保存最新的元素顺序
    const newChildren = Array.from( div1.children );
    // 保存最新的元素内容顺序
    const newChildrenText = newChildren.map( elem => elem.innerHTML );

    // 元素位置交换了, 还是换之前的元素
    expect( children ).is.deep.equals( newChildren.reverse() );
    // 内容同样变换了
    expect( childrenText ).is.deep.equals( newChildrenText.reverse() );
  });

  it( '不使用 html.unsafeHTML 将会对 HTML 进行转义', () => {
    const div = document.createElement('div');

    Hu.render(
      Hu.html`${ '<span></span>' }`,
      div
    );

    expect( div.firstElementChild ).is.null;
    expect( div.innerText ).is.equals('<span></span>');
  });

  it( '使用 html.unsafeHTML 将不会对 HTML 进行转义', () => {
    const div = document.createElement('div');

    Hu.render(
      Hu.html`${ Hu.html.unsafeHTML('<span></span>') }`,
      div
    );

    expect( div.firstElementChild ).is.not.null;
    expect( div.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.innerText ).is.equals('');
  });

});