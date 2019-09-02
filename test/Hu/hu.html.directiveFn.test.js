describe( 'Hu.html.directiveFn', () => {

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

          div.$remove();

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
        const bind = html.bind( this, 'name' );

        index++;
        return html`
          <div ref="div" name=${ bind }>${ bind }</div>
        `;
      }
    });

    expect( index ).is.equals( 1 );
    expect( hu.$refs.div.getAttribute('name') ).is.equals('1');
    expect( hu.$refs.div.innerText ).is.equals('1');

    hu.name = '2';
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( hu.$refs.div.getAttribute('name') ).is.equals('2');
      expect( hu.$refs.div.innerText ).is.equals('2');

      hu.name = '3';
      hu.$nextTick(() => {
        expect( index ).is.equals( 1 );
        expect( hu.$refs.div.getAttribute('name') ).is.equals('3');
        expect( hu.$refs.div.innerText ).is.equals('3');

        hu.$forceUpdate();
        hu.$forceUpdate();
        hu.$forceUpdate();

        expect( index ).is.equals( 4 );
        expect( hu.$refs.div.getAttribute('name') ).is.equals('3');
        expect( hu.$refs.div.innerText ).is.equals('3');

        hu.name = '4';
        hu.$nextTick(() => {
          expect( index ).is.equals( 4 );
          expect( hu.$refs.div.getAttribute('name') ).is.equals('4');
          expect( hu.$refs.div.innerText ).is.equals('4');

          hu.name = '5';
          hu.$nextTick(() => {
            expect( index ).is.equals( 4 );
            expect( hu.$refs.div.getAttribute('name') ).is.equals('5');
            expect( hu.$refs.div.innerText ).is.equals('5');

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

  it( 'html.bind: 该指令方法可使用普通方式对文本区域进行绑定', ( done ) => {
    const bind = Hu.html.bind;
    const div = document.createElement('div');
    const data = Hu.observable({
      text: '1'
    });

    Hu.render( div )`
      <div>${ bind( data, 'text' ) }</div>
    `;

    expect( div.firstElementChild.innerText ).is.equals( '1' );

    data.text = '2';

    expect( div.firstElementChild.innerText ).is.equals( '1' );
    Hu.nextTick(() => {
      expect( div.firstElementChild.innerText ).is.equals( '2' );

      data.text = '3';

      expect( div.firstElementChild.innerText ).is.equals( '2' );
      Hu.nextTick(() => {
        expect( div.firstElementChild.innerText ).is.equals( '3' );

        done();
      });
    });
  });

  it( 'html.bind: 该指令方法可使用普通方式对文本区域进行绑定 ( 二 )', ( done ) => {
    const bind = Hu.html.bind;
    const div = document.createElement('div');
    let renderIndex = 0;
    let computedIndex = 0;

    const hu = new Hu({
      el: div,
      data: {
        arr: [ '1', '2', '3' ]
      },
      render( html ){
        renderIndex++;
        return html`
          <div>${ bind( this, 'renderArr' ) }</div>
        `;
      },
      computed: {
        renderArr(){
          computedIndex++;
          return this.arr.map( item => {
            return Hu.html`<span>${ item }</span>`
          });
        }
      }
    });

    expect( renderIndex ).is.equals( 1 );
    expect( computedIndex ).is.equals( 1 );
    expect( div.firstElementChild.children.length ).is.equals( 3 );
    expect( [ ...new Set( Array.from( div.firstElementChild.children ).map( elem => elem.nodeName.toLowerCase() ) ) ] ).is.deep.equals([ 'span' ]);
    expect( Array.from( div.firstElementChild.children ).map( elem => elem.innerText ) ).is.deep.equals([ '1', '2', '3' ]);

    hu.arr = [ '2', '3', '4', '5' ];
    expect( renderIndex ).is.equals( 1 );
    expect( computedIndex ).is.equals( 1 );
    expect( div.firstElementChild.children.length ).is.equals( 3 );
    expect( [ ...new Set( Array.from( div.firstElementChild.children ).map( elem => elem.nodeName.toLowerCase() ) ) ] ).is.deep.equals([ 'span' ]);
    expect( Array.from( div.firstElementChild.children ).map( elem => elem.innerText ) ).is.deep.equals([ '1', '2', '3' ]);
    Hu.nextTick(() => {
      expect( renderIndex ).is.equals( 1 );
      expect( computedIndex ).is.equals( 2 );
      expect( div.firstElementChild.children.length ).is.equals( 4 );
      expect( [ ...new Set( Array.from( div.firstElementChild.children ).map( elem => elem.nodeName.toLowerCase() ) ) ] ).is.deep.equals([ 'span' ]);
      expect( Array.from( div.firstElementChild.children ).map( elem => elem.innerText ) ).is.deep.equals([ '2', '3', '4', '5' ]);

      hu.arr.push( '6' );
      expect( renderIndex ).is.equals( 1 );
      expect( computedIndex ).is.equals( 2 );
      expect( div.firstElementChild.children.length ).is.equals( 4 );
      expect( [ ...new Set( Array.from( div.firstElementChild.children ).map( elem => elem.nodeName.toLowerCase() ) ) ] ).is.deep.equals([ 'span' ]);
      expect( Array.from( div.firstElementChild.children ).map( elem => elem.innerText ) ).is.deep.equals([ '2', '3', '4', '5' ]);
      Hu.nextTick(() => {
        expect( renderIndex ).is.equals( 1 );
        expect( computedIndex ).is.equals( 3 );
        expect( div.firstElementChild.children.length ).is.equals( 5 );
        expect( [ ...new Set( Array.from( div.firstElementChild.children ).map( elem => elem.nodeName.toLowerCase() ) ) ] ).is.deep.equals([ 'span' ]);
        expect( Array.from( div.firstElementChild.children ).map( elem => elem.innerText ) ).is.deep.equals([ '2', '3', '4', '5', '6' ]);

        done();
      });
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