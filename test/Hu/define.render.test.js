describe( 'Hu.define - render', () => {

  it( 'render 方法首个参数 html 用于创建模板字符串', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      render( html ){
        expect( html ).is.a('function');
        return html`<span>123</span>`;
      }
    });

    expect( div.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.innerText ).is.equals('123');
  });

  it( 'render 方法的返回值可以是 html 的返回值', () => {
    const div = document.createElement('div');

    new Hu({
      el: div,
      render( html ){
        return html`<span>123</span>`;
      }
    });

    expect( div.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.innerText ).is.equals('123');
  });

  it( 'render 方法的返回值可以是数组', () => {
    const div = document.createElement('div');

    new Hu({
      el: div,
      render( html ){
        return [ html`1`, html`2`, html`3` ];
      }
    });

    expect( div.innerText ).is.equals('123');
  });

  it( 'render 方法的返回值可以是字符串', () => {
    const div = document.createElement('div');

    new Hu({
      el: div,
      render( html ){
        return '<div>123<div>';
      }
    });

    expect( div.innerText ).is.equals('<div>123<div>');
  });

  it( 'render 方法的返回值可以是 Element 元素', () => {
    const div = document.createElement('div');
    const span = document.createElement('span');

    new Hu({
      el: div,
      render( html ){
        span.innerHTML = 123;
        return span;
      }
    });

    expect( div.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.firstElementChild ).is.equals( span );
    expect( div.innerText ).is.equals('123');
  });

  it( '由自定义元素创建的实例会在被添加到 DOM 树中后立即运行 render 方法进行渲染', () => {
    const customName = window.customName;
    let isRender = false;

    Hu.define( customName, {
      render(){
        isRender = true;
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);

    expect( isRender ).is.false;

    div.$appendTo( document.body );

    expect( isRender ).is.true;
  });

  it( '由 new 创建的实例将在绑定 el 时立即运行 render 方法进行渲染', () => {
    let isRender = false;

    new Hu({
      el: document.createElement('div'),
      render(){
        isRender = true;
      }
    });

    expect( isRender ).is.true;
  });

  it( '由 new 创建的实例将在绑定 el 时立即运行 render 方法进行渲染 ( 二 )', () => {
    let isRender = false;

    const hu = new Hu({
      render(){
        isRender = true;
      }
    });

    expect( isRender ).is.false;

    hu.$mount( document.createElement('div') );

    expect( isRender ).is.true;
  });

  it( '执行 render 方法时会进行依赖收集', ( done ) => {
    const customName = window.customName;
    let num = 0

    Hu.define( customName, {
      data: () => ({
        a: 1,
        b: 2
      }),
      render( html ){
        num++;
        return html`${ this.a }${ this.b }`;
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body );
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( num ).is.equals( 1 );
    expect( hu.$el.textContent ).is.equals('12');

    hu.a = 123;

    expect( num ).is.equals( 1 );
    expect( hu.$el.textContent ).is.equals('12');
    hu.$nextTick(() => {
      expect( num ).is.equals( 2 );
      expect( hu.$el.textContent ).is.equals('1232');

      hu.b = 456;
      expect( num ).is.equals( 2 );
      expect( hu.$el.textContent ).is.equals('1232');
      hu.$nextTick(() => {
        expect( num ).is.equals( 3 );
        expect( hu.$el.textContent ).is.equals('123456');

        hu.a = 1;
        hu.b = 2;
        expect( num ).is.equals( 3 );
        expect( hu.$el.textContent ).is.equals('123456');
        hu.$nextTick(() => {
          expect( num ).is.equals( 4 );
          expect( hu.$el.textContent ).is.equals('12');

          div.$remove();
          done();
        });
      });
    });
  });


  // it( '同一个自定义元素只有首次被添加到 DOM 节点中时会主动触发 render', () => {
  //   const customName = window.customName;
  //   let index = 0;

  //   Hu.define( customName, {
  //     render: () => index++
  //   });

  //   expect( index ).is.equals( 0 );

  //   const div = document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body );
  //   const custom = div.firstElementChild;

  //   expect( index ).is.equals( 1 );

  //   div.removeChild( custom );
  //   div.appendChild( custom );

  //   expect( index ).is.equals( 1 );

  //   div.$remove();
  // });

});