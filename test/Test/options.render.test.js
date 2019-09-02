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

  it( '执行 render 方法时会进行依赖收集', ( done ) => {
    let index = 0;
    const div = document.createElement('div');
    const data = {
      a: 1
    };
    const dataProxy = Hu.observable({
      b: 2
    });

    const hu = new Hu({
      data: () => ({
        c: 3
      }),
      render(){
        index++;
        return `a: ${ data.a }; b: ${ dataProxy.b }; c: ${ this.c };`;
      }
    });

    expect( index ).is.equals( 0 );
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(``);

    hu.$mount( div );

    expect( index ).is.equals( 1 );
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 1; b: 2; c: 3;`);

    data.a = 2;
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 1; b: 2; c: 3;`);

      dataProxy.b = 3;
      hu.$nextTick(() => {
        expect( index ).is.equals( 2 );
        expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 3;`);

        hu.c = 4;
        hu.$nextTick(() => {
          expect( index ).is.equals( 3 );
          expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 4;`);

          data.a = 5;
          hu.$nextTick(() => {
            expect( index ).is.equals( 3 );
            expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 4;`);

            dataProxy.b = 6;
            hu.$nextTick(() => {
              expect( index ).is.equals( 4 );
              expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 5; b: 6; c: 4;`);

              hu.c = 7;
              hu.$nextTick(() => {
                expect( index ).is.equals( 5 );
                expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 5; b: 6; c: 7;`);

                done();
              });
            });
          });
        });
      });
    });
  });

  it( '执行 render 方法时会进行依赖收集 ( 二 )', ( done ) => {
    let index = 0;
    const customName = window.customName;
    const data = {
      a: 1
    };
    const dataProxy = Hu.observable({
      b: 2
    });

    Hu.define( customName, {
      data: () => ({
        c: 3
      }),
      render(){
        index++;
        return `a: ${ data.a }; b: ${ dataProxy.b }; c: ${ this.c };`;
      }
    });

    expect( index ).is.equals( 0 );

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body );
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( index ).is.equals( 1 );
    expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 1; b: 2; c: 3;`);

    data.a = 2;
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 1; b: 2; c: 3;`);

      dataProxy.b = 3;
      hu.$nextTick(() => {
        expect( index ).is.equals( 2 );
        expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 3;`);

        hu.c = 4;
        hu.$nextTick(() => {
          expect( index ).is.equals( 3 );
          expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 4;`);

          data.a = 5;
          hu.$nextTick(() => {
            expect( index ).is.equals( 3 );
            expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 4;`);

            dataProxy.b = 6;
            hu.$nextTick(() => {
              expect( index ).is.equals( 4 );
              expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 5; b: 6; c: 4;`);

              hu.c = 7;
              hu.$nextTick(() => {
                expect( index ).is.equals( 5 );
                expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 5; b: 6; c: 7;`);

                div.$delete();

                done();
              });
            });
          });
        });
      });
    });
  });

  it( '当 render 方法的依赖更新后, 将会在下一个 tick 触发 render 方法重新渲染', ( done ) => {
    let index = 0;
    const div = document.createElement('div');
    const data = {
      a: 1
    };
    const dataProxy = Hu.observable({
      b: 2
    });

    const hu = new Hu({
      data: () => ({
        c: 3
      }),
      render(){
        index++;
        return `a: ${ data.a }; b: ${ dataProxy.b }; c: ${ this.c };`;
      }
    });

    expect( index ).is.equals( 0 );
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(``);

    hu.$mount( div );

    expect( index ).is.equals( 1 );
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 1; b: 2; c: 3;`);

    data.a = 2;
    expect( index ).is.equals( 1 );
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 1; b: 2; c: 3;`);
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 1; b: 2; c: 3;`);

      dataProxy.b = 3;
      expect( index ).is.equals( 1 );
      expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 1; b: 2; c: 3;`);
      hu.$nextTick(() => {
        expect( index ).is.equals( 2 );
        expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 3;`);

        hu.c = 4;
        expect( index ).is.equals( 2 );
        expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 3;`);
        hu.$nextTick(() => {
          expect( index ).is.equals( 3 );
          expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 4;`);

          data.a = 5;
          expect( index ).is.equals( 3 );
          expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 4;`);
          hu.$nextTick(() => {
            expect( index ).is.equals( 3 );
            expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 4;`);

            dataProxy.b = 6;
            expect( index ).is.equals( 3 );
            expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 4;`);
            hu.$nextTick(() => {
              expect( index ).is.equals( 4 );
              expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 5; b: 6; c: 4;`);

              hu.c = 7;
              expect( index ).is.equals( 4 );
              expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 5; b: 6; c: 4;`);
              hu.$nextTick(() => {
                expect( index ).is.equals( 5 );
                expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 5; b: 6; c: 7;`);

                done();
              });
            });
          });
        });
      });
    });
  });

  it( '当 render 方法的依赖更新后, 将会在下一个 tick 触发 render 方法重新渲染 ( 二 )', ( done ) => {
    let index = 0;
    const customName = window.customName;
    const data = {
      a: 1
    };
    const dataProxy = Hu.observable({
      b: 2
    });

    Hu.define( customName, {
      data: () => ({
        c: 3
      }),
      render(){
        index++;
        return `a: ${ data.a }; b: ${ dataProxy.b }; c: ${ this.c };`;
      }
    });

    expect( index ).is.equals( 0 );

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body );
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( index ).is.equals( 1 );
    expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 1; b: 2; c: 3;`);

    data.a = 2;
    expect( index ).is.equals( 1 );
    expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 1; b: 2; c: 3;`);
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 1; b: 2; c: 3;`);

      dataProxy.b = 3;
      expect( index ).is.equals( 1 );
      expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 1; b: 2; c: 3;`);
      hu.$nextTick(() => {
        expect( index ).is.equals( 2 );
        expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 3;`);

        hu.c = 4;
        expect( index ).is.equals( 2 );
        expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 3;`);
        hu.$nextTick(() => {
          expect( index ).is.equals( 3 );
          expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 4;`);

          data.a = 5;
          expect( index ).is.equals( 3 );
          expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 4;`);
          hu.$nextTick(() => {
            expect( index ).is.equals( 3 );
            expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 4;`);

            dataProxy.b = 6;
            expect( index ).is.equals( 3 );
            expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 4;`);
            hu.$nextTick(() => {
              expect( index ).is.equals( 4 );
              expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 5; b: 6; c: 4;`);

              hu.c = 7;
              expect( index ).is.equals( 4 );
              expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 5; b: 6; c: 4;`);
              hu.$nextTick(() => {
                expect( index ).is.equals( 5 );
                expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 5; b: 6; c: 7;`);

                div.$delete();

                done();
              });
            });
          });
        });
      });
    });
  });

});