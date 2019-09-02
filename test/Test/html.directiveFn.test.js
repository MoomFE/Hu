describe( 'html.directiveFn', () => {

  const render = Hu.render;
  const html = Hu.html;
  const nextTick = Hu.nextTick;
  const { repeat, unsafe, bind } = html;

  /** @type {Element} */
  let div;
  beforeEach(() => {
    div = document.createElement('div').$appendTo( document.body );
  });
  afterEach(() => {
    div.$remove();
  });


  it( 'html.repeat: 使用该指令方法渲染数组内容, 在数组变化时基于 key 的变化重新排列元素', () => {
    const arr = [
      { text: '1', key: 1 }, { text: '2', key: 2 }, { text: '3', key: 3 },
      { text: '4', key: 4 }, { text: '5', key: 5 }, { text: '6', key: 6 }
    ];

    render( div )`${
      repeat( arr, 'key', data => {
        return html`<span>${ data.text }</span>`
      })
    }`;

    // 保存当前的元素顺序
    const children = Array.from( div.children );
    // 保存当前的元素内容顺序
    const childrenText = children.map( elem => elem.innerHTML );

    // 逆序后重新渲染
    arr.reverse();
    render( div )`${
      repeat( arr, 'key', data => {
        return html`<span>${ data.text }</span>`
      })
    }`;

    // 保存最新的元素顺序
    const newChildren = Array.from( div.children );
    // 保存最新的元素内容顺序
    const newChildrenText = newChildren.map( elem => elem.innerHTML );

    // 元素个数是对的
    expect( children.length ).is.equals( 6 );
    // 元素的位置跟着数组一起交换了
    expect( children ).is.deep.equals( newChildren.reverse() );
    // 内容的位置跟着数组一起交换了
    expect( childrenText ).is.deep.equals( newChildrenText.reverse() );
  });

  it( 'html.repeat: 使用其他方式渲染数组内容, 在数组变化时尽可能的重用之前的元素进行渲染', () => {
    const arr = [
      { text: '1', key: 1 }, { text: '2', key: 2 }, { text: '3', key: 3 },
      { text: '4', key: 4 }, { text: '5', key: 5 }, { text: '6', key: 6 }
    ];

    render( div )`${
      arr.map( data => {
        return html`<span>${ data.text }</span>`
      })
    }`;

    // 保存当前的元素顺序
    const children = Array.from( div.children );
    // 保存当前的元素内容顺序
    const childrenText = children.map( elem => elem.innerHTML );

    // 逆序后重新渲染
    arr.reverse();
    render( div )`${
      arr.map( data => {
        return html`<span>${ data.text }</span>`
      })
    }`;

    // 保存最新的元素顺序
    const newChildren = Array.from( div.children );
    // 保存最新的元素内容顺序
    const newChildrenText = newChildren.map( elem => elem.innerHTML );

    // 元素个数是对的
    expect( children.length ).is.equals( 6 );
    // 元素的位置未着数组一起交换
    expect( children ).is.deep.equals( newChildren );
    // 内容的位置跟着数组一起交换了
    expect( childrenText ).is.deep.equals( newChildrenText.reverse() );
  });

  it( 'html.repeat: 该指令方法只能在文本区域中使用', () => {

    const arr = [
      { text: '1', key: 1 }, { text: '2', key: 2 }, { text: '3', key: 3 },
      { text: '4', key: 4 }, { text: '5', key: 5 }, { text: '6', key: 6 }
    ];

    render( div )`${
      repeat( arr, 'key', data => {
        return html`<span>${ data.text }</span>`
      })
    }`;

    render( div )`
      <div>${
        repeat( arr, 'key', data => {
          return html`<span>${ data.text }</span>`
        })
      }</div>
    `;

    should.throw(() => {
      render( div )`
        <div text=${ repeat( arr, 'key', data => data.text ) }></div>
      `;
    }, 'repeat 指令方法只能在文本区域中使用 !');

    should.throw(() => {
      render( div )`
        <div .text=${ repeat( arr, 'key', data => data.text ) }></div>
      `;
    }, 'repeat 指令方法只能在文本区域中使用 !');

    should.throw(() => {
      render( div )`
        <div ?text=${ repeat( arr, 'key', data => data.text ) }></div>
      `;
    }, 'repeat 指令方法只能在文本区域中使用 !');
  });

  it( 'html.unsafe: 使用该指令方法包装的 HTML 片段不会被转义', () => {
    const span = '<span>123</span>';

    render( div )`${
      unsafe( span )
    }`;

    expect( div.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.firstElementChild.innerText ).is.equals('123');
  });

  it( 'html.unsafe: 使用其他方式插入的 HTML 片段会被转义', () => {
    const span = '<span>123</span>';

    render( div )`${
      span
    }`;

    expect( div.firstElementChild ).is.null;
    expect( div.innerText ).is.equals( span );
  });

  it( 'html.unsafe: 该指令方法只能在文本区域中使用', () => {
    const span = '<span>123</span>';

    render( div )`${
      unsafe( span )
    }`;

    render( div )`
      <div>${
        unsafe( span )
      }</div>
    `;

    should.throw(() => {
      render( div )`
        <div unsafe=${ unsafe( span ) }></div>
      `;
    }, 'unsafe 指令方法只能在文本区域中使用 !');

    should.throw(() => {
      render( div )`
        <div .unsafe=${ unsafe( span ) }></div>
      `;
    }, 'unsafe 指令方法只能在文本区域中使用 !');

    should.throw(() => {
      render( div )`
        <div ?unsafe=${ unsafe( span ) }></div>
      `;
    }, 'unsafe 指令方法只能在文本区域中使用 !');
  });

  it( 'html.bind: 使用该指令方法可以将观察者对象的值与插值绑定位置的指令进行绑定', ( done ) => {
    const data = Hu.observable({
      name: '1'
    });

    render( div )`
      <div name=${ bind( data, 'name' ) }></div>
    `;

    expect( div.firstElementChild.$attr('name') ).is.equals('1');

    data.name = 2;
    nextTick(() => {
      expect( div.firstElementChild.$attr('name') ).is.equals('2');

      done();
    });
  });

  it( 'html.bind: 使用该指令方法时传入的参数若不是观察者对象则不会响应值的变化', ( done ) => {
    const data = {
      name: '1'
    };

    render( div )`
      <div name=${ bind( data, 'name' ) }></div>
    `;

    expect( div.firstElementChild.$attr('name') ).is.equals('1');

    data.name = 2;
    nextTick(() => {
      expect( div.firstElementChild.$attr('name') ).is.equals('1');

      done();
    });
  });

  it( 'html.bind: 使用该指令方法对观察者对象进行绑定不会被 render 收集, 所以不会触发重新渲染', ( done ) => {
    let index = 0;
    const hu = new Hu({
      el: div,
      data: () => ({
        name: '1'
      }),
      render( html ){
        const name = bind( this, 'name' );

        index++;
        return html`
          <div ref="div" name=${ name }>${ name }</div>
        `;
      }
    });

    expect( index ).is.equals( 1 );
    expect( hu.$refs.div.$attr('name') ).is.equals('1');
    expect( hu.$refs.div.textContent ).is.equals('1');

    hu.name = '2';
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( hu.$refs.div.$attr('name') ).is.equals('2');
      expect( hu.$refs.div.textContent ).is.equals('2');

      hu.name = '3';
      hu.$nextTick(() => {
        expect( index ).is.equals( 1 );
        expect( hu.$refs.div.$attr('name') ).is.equals('3');
        expect( hu.$refs.div.textContent ).is.equals('3');

        hu.$forceUpdate();
        hu.$forceUpdate();
        hu.$forceUpdate();

        expect( index ).is.equals( 4 );
        expect( hu.$refs.div.$attr('name') ).is.equals('3');
        expect( hu.$refs.div.textContent ).is.equals('3');

        hu.name = '4';
        hu.$nextTick(() => {
          expect( index ).is.equals( 4 );
          expect( hu.$refs.div.$attr('name') ).is.equals('4');
          expect( hu.$refs.div.textContent ).is.equals('4');

          hu.name = '5';
          hu.$nextTick(() => {
            expect( index ).is.equals( 4 );
            expect( hu.$refs.div.$attr('name') ).is.equals('5');
            expect( hu.$refs.div.textContent ).is.equals('5');

            done();
          });
        });
      });
    });
  });

  it( 'html.bind: 使用该指令方法建立的绑定会在下次 render 时进行解绑', ( done ) => {
    const steps = [];
    const customDataProxy = new Proxy({
      name: '10',
      name2: '20'
    }, {
      get: ( target, name ) => {
        Hu.util.isString( name ) && steps.push( name );
        return target[ name ];
      }
    });
    const data = Hu.observable(
      customDataProxy
    );

    // 绑定到 'name'
    render( div )`
      <div name=${ bind( data, 'name' ) }></div>
    `;

    // 首次读取
    expect( div.firstElementChild.$attr('name') ).is.equals('10');
    expect( steps ).is.deep.equals([ 'name' ]);

    // 修改 'name' 时, 会重新读取值
    data.name = '11';
    nextTick(() => {
      expect( div.firstElementChild.$attr('name') ).is.equals('11');
      expect( steps ).is.deep.equals([ 'name', 'name' ]);

      // 绑定到 'name2', 那么 'name' 就应该被解绑了
      render( div )`
        <div name=${ bind( data, 'name2' ) }></div>
      `;

      // 首次读取
      expect( div.firstElementChild.$attr('name') ).is.equals('20');
      expect( steps ).is.deep.equals([ 'name', 'name', 'name2' ]);

      // 修改 'name2' 时, 会重新读取值
      data.name2 = '21';
      nextTick(() => {
        expect( div.firstElementChild.$attr('name') ).is.equals('21');
        expect( steps ).is.deep.equals([ 'name', 'name', 'name2', 'name2' ]);

        // 修改 'name' 时, 因为已经解绑了, 那么不会触发新的读取了
        data.name = '12';
        nextTick(() => {
          expect( div.firstElementChild.$attr('name') ).is.equals('21');
          expect( steps ).is.deep.equals([ 'name', 'name', 'name2', 'name2' ]);

          done();
        });
      });
    });
  });

  it( 'html.bind: 使用该指令方法在自定义元素实例中建立的绑定, 会在自定义元素从文档流移除时进行解绑', ( done ) => {
    const steps = [];
    const customDataProxy = new Proxy({
      name: '1'
    }, {
      get: ( target, name ) => {
        Hu.util.isString( name ) && steps.push( name );
        return target[ name ];
      }
    });
    const data = Hu.observable(
      customDataProxy
    );
    const customName = window.customName;
    let isConnected = false;

    Hu.define( customName, {
      render( html ){
        const name = bind( data, 'name' );

        return html`
          <div name=${ name }></div>
        `;
      },
      connected: () => isConnected = true,
      disconnected: () => isConnected = false
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    expect( isConnected ).is.true;
    expect( hu.$el.firstElementChild.$attr('name') ).is.equals('1');
    expect( steps ).is.deep.equals([ 'name' ]);

    data.name = '2';
    nextTick(() => {
      expect( isConnected ).is.true;
      expect( hu.$el.firstElementChild.$attr('name') ).is.equals('2');
      expect( steps ).is.deep.equals([ 'name', 'name' ]);

      data.name = '3';
      nextTick(() => {
        expect( isConnected ).is.true;
        expect( hu.$el.firstElementChild.$attr('name') ).is.equals('3');
        expect( steps ).is.deep.equals([ 'name', 'name', 'name' ]);

        custom.$remove();

        expect( isConnected ).is.false;
        expect( hu.$el.firstElementChild.$attr('name') ).is.equals('3');
        expect( steps ).is.deep.equals([ 'name', 'name', 'name' ]);

        data.name = '3';
        nextTick(() => {
          expect( isConnected ).is.false;
          expect( hu.$el.firstElementChild.$attr('name') ).is.equals('3');
          expect( steps ).is.deep.equals([ 'name', 'name', 'name' ]);

          done();
        });
      });
    });
  });

  it( 'html.bind: 使用该指令方法和文本区域进行绑定', ( done ) => {
    const data = Hu.observable({
      text1: '10',
      text2: '20'
    });
    const text1 = bind( data, 'text1' );
    const text2 = bind( data, 'text2' );

    render( div )`<div>${ text1 }${ text2 }</div>`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<div>1020</div>`);

    data.text1 = '11';
    data.text2 = '21';
    nextTick(() => {
      expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<div>1121</div>`);
      done();
    });
  });

  it( 'html.bind: 使用该指令方法和元素属性进行绑定', ( done ) => {
    const data = Hu.observable({
      attr1: '10',
      attr2: '20'
    });
    const attr1 = bind( data, 'attr1' );
    const attr2 = bind( data, 'attr2' );

    render( div )`<div attr1=${ attr1 } attr2=${ attr2 }></div>`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<div attr1="10" attr2="20"></div>`);

    data.attr1 = '11';
    data.attr2 = '21';
    nextTick(() => {
      expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<div attr1="11" attr2="21"></div>`);
      done();
    });
  });

  it( 'html.bind: 使用该指令方法和 .prop 指令进行绑定', ( done ) => {
    const data = Hu.observable({
      prop1: '10',
      prop2: '20'
    });
    const prop1 = bind( data, 'prop1' );
    const prop2 = bind( data, 'prop2' );

    render( div )`<div .prop1=${ prop1 } .prop2=${ prop2 }></div>`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<div></div>`);
    expect( div.firstElementChild ).is.includes({
      prop1: '10',
      prop2: '20'
    });

    data.prop1 = '11';
    data.prop2 = '21';
    nextTick(() => {
      expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<div></div>`);
      expect( div.firstElementChild ).is.includes({
        prop1: '11',
        prop2: '21'
      });
      done();
    });
  });

  it( 'html.bind: 使用该指令方法和 ?attr 指令进行绑定', ( done ) => {
    const data = Hu.observable({
      attr1: false,
      attr2: true
    });
    const attr1 = bind( data, 'attr1' );
    const attr2 = bind( data, 'attr2' );

    render( div )`<div ?attr1=${ attr1 } ?attr2=${ attr2 }></div>`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<div attr2=""></div>`);

    data.attr1 = true;
    data.attr2 = false;
    nextTick(() => {
      expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<div attr1=""></div>`);
      
      data.attr1 = true;
      data.attr2 = true;
      nextTick(() => {
        expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<div attr1="" attr2=""></div>`);
        done();
      });
    });
  });

  it( 'html.bind: 使用该指令方法和 @event 指令进行绑定', ( done ) => {
    
  });

});