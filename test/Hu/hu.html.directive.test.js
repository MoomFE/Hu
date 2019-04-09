describe( 'Hu.html.directive', () => {

  it( 'html.repeat: 使用该指令方法渲染数组内容, 在数组变化时基于 key 的变化重新排列元素', () => {
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

  it( 'html.repeat: 使用其他方式渲染数组内容, 在数组变化时尽可能的重用之前的元素进行渲染', () => {
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

  it( 'html.repeat: 该指令方法只能在文本区域中使用', () => {
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

    Hu.render( div )`
      <div>${
        Hu.html.repeat( arr, 'key', data => {
          return Hu.html`<span>${ data.text }</span>`
        })
      }</div>
    `;

    should.throw(() => {
      Hu.render( div )`
        <div text=${ Hu.html.repeat( arr, 'key', data => data.text ) }></div>
      `;
    }, 'Hu.html.repeat 指令方法只能在文本区域中使用 !');

    should.throw(() => {
      Hu.render( div )`
        <div .text=${ Hu.html.repeat( arr, 'key', data => data.text ) }></div>
      `;
    }, 'Hu.html.repeat 指令方法只能在文本区域中使用 !');

    should.throw(() => {
      Hu.render( div )`
        <div ?text=${ Hu.html.repeat( arr, 'key', data => data.text ) }></div>
      `;
    }, 'Hu.html.repeat 指令方法只能在文本区域中使用 !');
  });


  it( 'html.unsafe: 使用该指令方法包装的 HTML 片段不会被转义', () => {
    const div = document.createElement('div');
    const span = '<span>123</span>';

    Hu.render( div )`${
      Hu.html.unsafe( span )
    }`;

    expect( div.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.firstElementChild.innerText ).is.equals('123');
  });

  it( 'html.unsafe: 使用其他方式插入的 HTML 片段会被转义', () => {
    const div = document.createElement('div');
    const span = '<span>123</span>';

    Hu.render( div )`${
      span
    }`;

    expect( div.firstElementChild ).is.null;
    expect( div.innerText ).is.equals( span );
  });

  it( 'html.unsafe: 该指令方法只能在文本区域中使用', () => {
    const div = document.createElement('div');
    const span = '<span>123</span>';

    Hu.render( div )`${
      Hu.html.unsafe( span )
    }`;

    Hu.render( div )`
      <div>${
        Hu.html.unsafe( span )
      }</div>
    `;

    should.throw(() => {
      Hu.render( div )`
        <div unsafe=${ Hu.html.unsafe( span ) }></div>
      `;
    }, 'Hu.html.unsafe 指令方法只能在文本区域中使用 !');

    should.throw(() => {
      Hu.render( div )`
        <div .unsafe=${ Hu.html.unsafe( span ) }></div>
      `;
    }, 'Hu.html.unsafe 指令方法只能在文本区域中使用 !');

    should.throw(() => {
      Hu.render( div )`
        <div ?unsafe=${ Hu.html.unsafe( span ) }></div>
      `;
    }, 'Hu.html.unsafe 指令方法只能在文本区域中使用 !');
  });


  it( 'html.bind: 使用该指令方法可以将观察者对象的值与元素的属性进行绑定', ( done ) => {
    const bind = Hu.html.bind;
    const div = document.createElement('div');
    const data = Hu.observable({
      name: '1'
    });

    Hu.render( div )`
      <div name=${ bind( data, 'name' ) }></div>
    `;

    expect( div.firstElementChild.getAttribute('name') ).is.equals( '1' );

    data.name = 2;

    expect( div.firstElementChild.getAttribute('name') ).is.equals( '1' );
    Hu.nextTick(() => {
      expect( div.firstElementChild.getAttribute('name') ).is.equals( '2' );

      done();
    });
  });

  it( 'html.bind: 该指令方法传入的参数若不是观察者对象则不会响应值的变化', ( done ) => {
    const bind = Hu.html.bind;
    const div = document.createElement('div');
    const data = {
      name: '1'
    };

    Hu.render( div )`
      <div name=${ bind( data, 'name' ) }></div>
    `;

    expect( div.firstElementChild.getAttribute('name') ).is.equals( '1' );

    data.name = 2;

    expect( div.firstElementChild.getAttribute('name') ).is.equals( '1' );
    Hu.nextTick(() => {
      expect( div.firstElementChild.getAttribute('name') ).is.equals( '1' );

      done();
    });
  });

  it( 'html.bind: 该指令方法绑定的元素属性会在下次使用 render 时进行解绑', ( done ) => {
    const bind = Hu.html.bind;
    const div = document.createElement('div');
    const data = Hu.observable({
      name: 1
    });

    Hu.render( div )`
      <div name=${ bind( data, 'name' ) }></div>
    `;

    const first = div.firstElementChild;

    expect( first.getAttribute('name') ).is.equals( '1' );

    data.name = 2;
    Hu.nextTick(() => {
      expect( first.getAttribute('name') ).is.equals( '2' );

      Hu.render( div )`
        <div name2=${ bind( data, 'name' ) }></div>
      `;

      const second = div.firstElementChild;

      expect( first ).is.not.equals( second );
      expect( first.getAttribute('name') ).is.equals( '2' );
      expect( second.getAttribute('name2') ).is.equals( '2' );

      data.name = 3;
      Hu.nextTick(() => {
        expect( first.getAttribute('name') ).is.equals( '2' );
        expect( second.getAttribute('name2') ).is.equals( '3' );

        done();
      });
    });
  });

  it( 'html.bind: 该指令在自定义元素实例中, 自定义元素被从文档流移除后, 指令方法的绑定会被解绑', ( done ) => {
    const customName = window.customName;
    const bind = Hu.html.bind;
    const data = Hu.observable({
      name: 1
    });

    let isConnected = false;

    Hu.define( customName, {
      render( html ){
        return html`
          <div name=${ bind( data, 'name' ) }></div>
        `;
      },
      connected: () => isConnected = true,
      disconnected: () => isConnected = false,
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body );
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( isConnected ).is.true;
    expect( hu.$el.firstElementChild.getAttribute('name') ).is.equals('1');
    
    data.name = 2;
    hu.$nextTick(() => {
      expect( hu.$el.firstElementChild.getAttribute('name') ).is.equals('2');

      div.$remove();
      expect( isConnected ).is.false;

      data.name = 3;
      hu.$nextTick(() => {
        expect( hu.$el.firstElementChild.getAttribute('name') ).is.equals('2');

        div.$appendTo( document.body );
        expect( isConnected ).is.true;
        expect( hu.$el.firstElementChild.getAttribute('name') ).is.equals('3');

        data.name = 4;
        hu.$nextTick(() => {
          expect( hu.$el.firstElementChild.getAttribute('name') ).is.equals('4');

          done();
        });
      });
    });
  });

  it( 'html.bind: 该指令对观察者对象的依赖不会被 render 收集, 所以不会触发重新渲染', ( done ) => {
    let index = 0;
    const hu = new Hu({
      el: document.createElement('div'),
      data: {
        name: '1'
      },
      render( html ){
        index++;
        return html`
          <div ref="div" name=${ html.bind( this, 'name' ) }></div>
        `;
      }
    });

    expect( index ).is.equals( 1 );
    expect( hu.$refs.div.getAttribute('name') ).is.equals('1');
    
    hu.name = '2';
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( hu.$refs.div.getAttribute('name') ).is.equals('2');

      hu.name = '3';
      hu.$nextTick(() => {
        expect( index ).is.equals( 1 );
        expect( hu.$refs.div.getAttribute('name') ).is.equals('3');

        hu.$forceUpdate();
        hu.$forceUpdate();
        hu.$forceUpdate();

        expect( index ).is.equals( 4 );
        expect( hu.$refs.div.getAttribute('name') ).is.equals('3');

        hu.name = '4';
        hu.$nextTick(() => {
          expect( index ).is.equals( 4 );
          expect( hu.$refs.div.getAttribute('name') ).is.equals('4');

          hu.name = '5';
          hu.$nextTick(() => {
            expect( index ).is.equals( 4 );
            expect( hu.$refs.div.getAttribute('name') ).is.equals('5');

            done();
          });
        });
      });
    });
  });

  it( 'html.bind: 该指令方法可使用普通方式对元素属性 ( Attribute ) 进行绑定', ( done ) => {
    const bind = Hu.html.bind;
    const div = document.createElement('div');
    const data = Hu.observable({
      name: '1'
    });

    Hu.render( div )`
      <div name=${ bind( data, 'name' ) }></div>
    `;

    expect( div.firstElementChild.getAttribute('name') ).is.equals( '1' );

    data.name = 2;

    expect( div.firstElementChild.getAttribute('name') ).is.equals( '1' );
    Hu.nextTick(() => {
      expect( div.firstElementChild.getAttribute('name') ).is.equals( '2' );

      done();
    });
  });

  it( 'html.bind: 该指令方法可使用 .attr 指令对元素属性 ( Property ) 进行绑定', ( done ) => {
    const bind = Hu.html.bind;
    const div = document.createElement('div');
    const data = Hu.observable({
      name: 1
    });

    Hu.render( div )`
      <div .name=${ bind( data, 'name' ) }></div>
    `;

    expect( div.firstElementChild.name ).is.equals( 1 );

    data.name = 2;

    expect( div.firstElementChild.name ).is.equals( 1 );
    Hu.nextTick(() => {
      expect( div.firstElementChild.name ).is.equals( 2 );

      done();
    });
  });

  it( 'html.bind: 该指令方法可使用 ?attr 指令对元素属性 ( Attribute ) 进行绑定', ( done ) => {
    const bind = Hu.html.bind;
    const div = document.createElement('div');
    const data = Hu.observable({
      name: true
    });

    Hu.render( div )`
      <div ?name=${ bind( data, 'name' ) }></div>
    `;

    expect( div.firstElementChild.hasAttribute('name') ).is.true;

    data.name = false;

    expect( div.firstElementChild.hasAttribute('name') ).is.true;
    Hu.nextTick(() => {
      expect( div.firstElementChild.hasAttribute('name') ).is.false;

      done();
    });
  });

  it( 'html.bind: 该指令方法可使用 :class 指令对元素 className 进行绑定', ( done ) => {
    const bind = Hu.html.bind;
    const div = document.createElement('div');
    const data = Hu.observable({
      class: {
        a: false,
        b: true
      }
    });

    Hu.render( div )`
      <div :class=${ bind( data, 'class' ) }></div>
    `;

    expect( div.firstElementChild.className ).is.equals( 'b' );

    data.class = {
      a: true,
      b: false
    };

    expect( div.firstElementChild.className ).is.equals( 'b' );
    Hu.nextTick(() => {
      expect( div.firstElementChild.className ).is.equals( 'a' );

      data.class.b = true;

      expect( div.firstElementChild.className ).is.equals( 'a' );
      Hu.nextTick(() => {
        expect( div.firstElementChild.className ).is.equals( 'a b' );

        done();
      });
    });
  });

  it( 'html.bind: 该指令方法可使用 :style 指令对元素 style 进行绑定', ( done ) => {
    const bind = Hu.html.bind;
    const div = document.createElement('div');
    const data = Hu.observable({
      style: {
        fontSize: '12px',
        width: '100px'
      }
    });

    Hu.render( div )`
      <div :style=${ bind( data, 'style' ) }></div>
    `;

    expect( div.firstElementChild.style ).is.deep.include({
      fontSize: '12px',
      width: '100px'
    });

    data.style = {
      fontSize: '16px',
      width: '120px'
    };

    expect( div.firstElementChild.style ).is.deep.include({
      fontSize: '12px',
      width: '100px'
    });
    Hu.nextTick(() => {
      expect( div.firstElementChild.style ).is.deep.include({
        fontSize: '16px',
        width: '120px'
      });

      data.style.width = '160px';

      expect( div.firstElementChild.style ).is.deep.include({
        fontSize: '16px',
        width: '120px'
      });
      Hu.nextTick(() => {
        expect( div.firstElementChild.style ).is.deep.include({
          fontSize: '16px',
          width: '160px'
        });

        done();
      });
    });
  });

});