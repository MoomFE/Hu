describe( 'options.render', () => {

  it( '使用 html 创建的模板进行渲染', () => {
    const div = document.createElement('div');

    new Hu({
      el: div,
      render( html ){
        return html`<span>123</span>`;
      }
    });

    expect( div.$first().nodeName ).is.equals('SPAN');
    expect( div.$first().innerHTML ).is.equals('123');
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<span>123</span>`);
  });

  it( '使用 html 创建的模板组成的数组进行渲染', () => {
    const div = document.createElement('div');

    new Hu({
      el: div,
      render( html ){
        return [
          html`<span>1</span>`,
          html`<span>2</span>`,
          html`<span>3</span>`
        ];
      }
    });

    expect( div.$child().length ).is.equals( 3 );
    expect( div.$child('span').length ).is.equals( 3 );
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<span>1</span><span>2</span><span>3</span>`);
  });

  it( '使用字符串进行渲染', () => {
    const div = document.createElement('div');

    new Hu({
      el: div,
      render(){
        return '<span>123</span>';
      }
    });

    expect( div.$first() ).is.null;
    expect( div.innerText ).is.equals('<span>123</span>');
  });

  it( '使用 element 元素进行渲染', () => {
    const div = document.createElement('div');
    const span = document.createElement('span');

    new Hu({
      el: div,
      render(){
        span.innerHTML = 1234;
        return span;
      }
    });

    expect( div.$first() ).is.equals( span );
    expect( div.$first().innerHTML ).is.equals('1234');
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<span>1234</span>`);
  });

  it( '使用不支持的对象时会尽可能的进行转码进行渲染', () => {
    const div = document.createElement('div');

    new Hu({
      el: div,
      render(){
        return {
          a: 1,
          b: 2,
          c: [ 3 ]
        };
      }
    });

    expect( div.$first() ).is.null;
    expect( div.innerText ).is.equals('{\n  "a": 1,\n  "b": 2,\n  "c": [\n    3\n  ]\n}');
  });

  it( '使用 new 创建的实例会在绑定 el 时立即运行 render 方法进行渲染', () => {
    let isRender = false;
    let index = 0;

    new Hu({
      el: document.createElement('div'),
      render(){
        isRender = true;
        index++;
      }
    });

    expect( isRender ).is.true;
    expect( index ).is.equals( 1 );
  });

  it( '使用 new 创建的实例会在绑定 el 时立即运行 render 方法进行渲染 ( use $mount )', () => {
    let isRender = false;
    let index = 0;

    const hu = new Hu({
      render(){
        isRender = true;
        index++;
      }
    });

    expect( isRender ).is.false;
    expect( index ).is.equals( 0 );

    hu.$mount( document.createElement('div') );

    expect( isRender ).is.true;
    expect( index ).is.equals( 1 );
  });

  it( '使用自定义元素创建的实例会在被添加到 DOM 中时立即运行 render 方法进行渲染', () => {
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

    div.$remove();
  });

});