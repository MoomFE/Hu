describe( 'Hu.define - render', () => {

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

  it( '当 render 的依赖被更新后, 将会在下一个 tick 触发 render 方法重新渲染', ( done ) => {
    const div = document.createElement('div');
    let index = 0;
    const data = Hu.observable({
      a: 1,
      b: 2
    });
    const hu = new Hu({
      el: div,
      render(){
        index++;
        return data.a + data.b;
      }
    });

    expect( index ).is.equals( 1 );
    expect( div.innerText ).is.equals('3');

    data.a = 2;
    expect( index ).is.equals( 1 );
    expect( div.innerText ).is.equals('3');
    hu.$nextTick(() => {
      expect( index ).is.equals( 2 );
      expect( div.innerText ).is.equals('4');

      data.b = 3;
      expect( index ).is.equals( 2 );
      expect( div.innerText ).is.equals('4');
      hu.$nextTick(() => {
        expect( index ).is.equals( 3 );
        expect( div.innerText ).is.equals('5');

        data.a = 1;
        data.b = 2;
        expect( index ).is.equals( 3 );
        expect( div.innerText ).is.equals('5');
        hu.$nextTick(() => {
          expect( index ).is.equals( 4 );
          expect( div.innerText ).is.equals('3');

          done();
        });
      });
    });
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