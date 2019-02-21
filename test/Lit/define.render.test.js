describe( 'Lit.define - render', () => {

  it( '自定义元素被添加到 DOM 树中后会立即运行渲染方法进行渲染', () => {
    const customName = window.customName;
    let isRender = false;

    Lit.define( customName, {
      render(){
        isRender = true;
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);

    expect( isRender ).to.be.false;

    div.$appendTo( document.body );

    expect( isRender ).to.be.true;

    div.$remove();
  });

  it( 'Lit 实例拥有 $forceUpdate 方法, 迫使 Lit 实例重新渲染', () => {
    const customName = window.customName;
    let num = 0;

    Lit.define( customName, {
      render(){
        num++;
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body );
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( num ).to.equals( 1 );

    lit.$forceUpdate();
    expect( num ).to.equals( 2 );

    lit.$forceUpdate();
    lit.$forceUpdate();
    expect( num ).to.equals( 4 );

    div.$remove();
  });

  it( 'render 方法首个参数 html 是一个方法, 用于创建模板字符串', () => {
    const customName = window.customName;

    Lit.define( customName, {
      render( html ){
        expect( html ).to.be.an( 'function' );
      }
    });

    document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body ).$remove();;
  });

  it( 'render 方法返回使用首个参数 html 创建的模板字符串的对象用于渲染', () => {
    const customName = window.customName;

    Lit.define( customName, {
      render( html ){
        return html`<div>123</div>`
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body );
    const custom = div.firstElementChild;
    const $el = custom.$lit.$el;

    expect( $el.children.length ).to.equals( 1 );
    expect( $el.children[0]._nodeName ).to.equals( 'div' );
    expect( $el.children[0].innerHTML ).to.equals( '123' );

    div.$remove();
  });

});