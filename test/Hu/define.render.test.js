describe( 'Hu.define - render', () => {

  it( '项目创建后, 会将自定义元素本身作为 $customElement 变量存储在 Hu 实例中', () => {
    const customName = window.customName;

    Hu.define( customName );

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$customElement ).is.equals( custom );
  });

  it( '项目创建后, 会将自定义元素的 Shadow DOM 作为 $el 存储在 Hu 实例中', () => {
    const customName = window.customName;

    Hu.define( customName );

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$el ).is.a('ShadowRoot');
  });

  it( '自定义元素被添加到 DOM 树中后会立即运行渲染方法进行渲染', () => {
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

  it( 'Hu 实例拥有 $forceUpdate 方法, 迫使 Hu 实例重新渲染', () => {
    const customName = window.customName;
    let num = 0;

    Hu.define( customName, {
      render(){
        num++;
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body );
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( num ).is.equals( 1 );

    hu.$forceUpdate();
    expect( num ).is.equals( 2 );

    hu.$forceUpdate();
    hu.$forceUpdate();
    expect( num ).is.equals( 4 );

    div.$remove();
  });

  it( 'render 方法首个参数 html 是一个方法, 用于创建模板字符串', () => {
    const customName = window.customName;

    Hu.define( customName, {
      render( html ){
        expect( html ).is.a( 'function' );
      }
    });

    document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body ).$remove();;
  });

  it( 'render 方法返回使用首个参数 html 创建的模板字符串的对象用于渲染', () => {
    const customName = window.customName;

    Hu.define( customName, {
      render( html ){
        return html`<div>123</div>`
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body );
    const custom = div.firstElementChild;
    const $el = custom.$hu.$el;

    expect( $el.children.length ).is.equals( 1 );
    expect( $el.children[0]._nodeName ).is.equals( 'div' );
    expect( $el.children[0].innerHTML ).is.equals( '123' );

    div.$remove();
  });

  it( '执行 render 方法时会进行依赖收集', () => {
    const customName = window.customName;
    let num = 0;

    Hu.define( customName, {
      data(){
        return {
          a: 1,
          b: 2
        };
      },
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

    expect( num ).is.equals( 2 );
    expect( hu.$el.textContent ).is.equals('1232');

    hu.b = 123;

    expect( num ).is.equals( 3 );
    expect( hu.$el.textContent ).is.equals('123123');

    div.$remove();
  });

});