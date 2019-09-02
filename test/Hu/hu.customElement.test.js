describe( 'hu.customElement', () => {

  it( '自定义元素上的 $hu 属性为当前自定义元素的 Hu 实例', () => {
    const customName = window.customName;

    Hu.define( customName );

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( hu ).is.instanceOf( Hu );
    expect( hu.$customElement ).is.equals( custom );
  });

  it( '自定义元素上的 $on 方法可以绑定当前实例的事件监听器, 而不是绑定原生事件', () => {
    const customName = window.customName;

    Hu.define( customName );

    const custom = document.createElement( customName );
    const hu = custom.$hu;
    let result;
    let arg;

    custom.$on( 'click', ( _arg ) => {
      result = 123;
      arg = _arg;
    });

    custom.click();
    expect( result ).is.undefined;
    expect( arg ).is.undefined;

    hu.$emit('click');
    expect( result ).is.equals( 123 );
    expect( arg ).is.undefined;

    hu.$emit( 'click', '123' );
    expect( result ).is.equals( 123 );
    expect( arg ).is.equals( '123' );
  });

  it( '自定义元素上的 $once 方法可以绑定只执行一次的当前实例的事件监听器', () => {
    const customName = window.customName;

    Hu.define( customName );

    const custom = document.createElement( customName );
    const hu = custom.$hu;
    let result;
    let arg;

    custom.$once( 'click', ( _arg ) => {
      result = 123;
      arg = _arg;
    });

    custom.click();
    expect( result ).is.undefined;
    expect( arg ).is.undefined;

    hu.$emit( 'click' );
    expect( result ).is.equals( 123 );
    expect( arg ).is.undefined;

    hu.$emit( 'click', '123' );
    expect( result ).is.equals( 123 );
    expect( arg ).is.undefined;

    custom.$once( 'click', ( _arg ) => {
      result = 123;
      arg = _arg;
    });

    hu.$emit( 'click', '1234' );
    expect( result ).is.equals( 123 );
    expect( arg ).is.equals( '1234' );
  });

  it( '自定义元素上的 $off 方法可以解除绑定在当前实例的事件监听器', () => {
    const customName = window.customName;

    Hu.define( customName );

    const custom = document.createElement( customName );
    const hu = custom.$hu;
    let result;
    let arg;

    custom.$on( 'click', ( _arg ) => {
      result = 123;
      arg = _arg;
    });

    custom.click();
    expect( result ).is.undefined;
    expect( arg ).is.undefined;

    hu.$emit('click');
    expect( result ).is.equals( 123 );
    expect( arg ).is.undefined;

    custom.$off('click');

    hu.$emit( 'click', '123' );
    expect( result ).is.equals( 123 );
    expect( arg ).is.undefined;
  });

  it( '由自定义元素创建的实例, 自定义元素被从文档流移除后, 清空 render 方法收集到的依赖', ( done ) => {
    const customName = window.customName;
    let index = 0;

    Hu.define( customName, {
      data: () => ({
        value: 123
      }),
      render( html ){
        index++;
        return html`<div ref="div">${ this.value }</div>`;
      }
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    expect( index ).is.equals( 1 );
    expect( hu.$refs.div.innerText ).is.equals('123');

    hu.value = 1234;
    hu.$nextTick(() => {
      expect( index ).is.equals( 2 );
      expect( hu.$refs.div.innerText ).is.equals('1234');

      hu.value = 12345;
      hu.$nextTick(() => {
        expect( index ).is.equals( 3 );
        expect( hu.$refs.div.innerText ).is.equals('12345');

        custom.$remove();

        hu.value = 123456;
        hu.$nextTick(() => {
          expect( index ).is.equals( 3 );
          expect( hu.$refs.div.innerText ).is.equals('12345');

          hu.value = 1234567;
          hu.$nextTick(() => {
            expect( index ).is.equals( 3 );
            expect( hu.$refs.div.innerText ).is.equals('12345');

            custom.$appendTo( document.body );

            expect( index ).is.equals( 4 );
            expect( hu.$refs.div.innerText ).is.equals('1234567');

            hu.value = 12345678;
            hu.$nextTick(() => {
              expect( index ).is.equals( 5 );
              expect( hu.$refs.div.innerText ).is.equals('12345678');

              custom.$remove();

              done();
            });
          });
        });
      });
    });
  });

});