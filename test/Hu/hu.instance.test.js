describe( 'Hu.instance', () => {

  it( '使用 new 创建实例', () => {
    const div = document.createElement('div');
    const steps = [];

    new Hu({
      el: div,
      render( html ){
        steps.push('render');
        return html`<span>123</span>`;
      },
      beforeMount(){
        steps.push('beforeMount');
      },
      mounted(){
        steps.push('mounted');
      }
    });

    steps.push('created');

    expect( div.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.innerText ).is.equals( '123' );
    expect( steps ).is.deep.equals([ 'beforeMount', 'render', 'mounted', 'created' ]);
  });

  it( '使用 new 创建实例 - 使用 $mount 挂载实例', () => {
    const div = document.createElement('div');
    const steps = [];

    const hu = new Hu({
      render( html ){
        steps.push('render');
        return html`<span>123</span>`;
      },
      beforeMount(){
        steps.push('beforeMount');
      },
      mounted(){
        steps.push('mounted');
      }
    });

    steps.push('created');

    expect( hu.$mount( div ) ).is.equals( hu );
    expect( div.firstElementChild.nodeName ).is.equals('SPAN');
    expect( div.innerText ).is.equals( '123' );
    expect( steps ).is.deep.equals([ 'created', 'beforeMount', 'render', 'mounted' ]);
  });

  it( '实例创建后所有前缀为 $ 的私有选项全部不能进行修改及删除', () => {
    const customName = window.customName;

    Hu.define( customName );

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    for( let name of Reflect.ownKeys( hu ) ){
      const value = hu[ name ];
      const type = Object.prototype.toString.call( value );

      delete hu[ name ];
      expect( hu[ name ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu[ name ] ) ).is.equals( type );

      hu[ name ] = 123;
      expect( hu[ name ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu[ name ] ) ).is.equals( type );

      hu[ name ] = '123';
      expect( hu[ name ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu[ name ] ) ).is.equals( type );
    }
  });

  it( '实例创建后所有前缀为 $ 的私有选项全部不能进行修改及删除 ( 二 )', () => {
    const hu = new Hu();

    for( let name of Reflect.ownKeys( hu ) ){
      const value = hu[ name ];
      const type = Object.prototype.toString.call( value );

      delete hu[ name ];
      expect( hu[ name ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu[ name ] ) ).is.equals( type );

      hu[ name ] = 123;
      expect( hu[ name ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu[ name ] ) ).is.equals( type );

      hu[ name ] = '123';
      expect( hu[ name ] ).is.equals( value );
      expect( Object.prototype.toString.call( hu[ name ] ) ).is.equals( type );
    }
  });

  it( '实例上的 $forceUpdate 方法可以强制使当前 Hu 实例重新渲染', () => {
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

  it( '实例上的 $forceUpdate 方法可以强制使当前 Hu 实例重新渲染 ( 二 )', () => {
    let num = 0;
    const hu = new Hu({
      el: document.createElement('div'),
      render(){
        num++;
      }
    });

    expect( num ).is.equals( 1 );

    hu.$forceUpdate();
    expect( num ).is.equals( 2 );

    hu.$forceUpdate();
    hu.$forceUpdate();
    expect( num ).is.equals( 4 );
  });

  it( '实例上的 $forceUpdate 方法可以强制使当前 Hu 实例重新渲染 ( 三 )', () => {
    let num = 0;
    const hu = new Hu({
      render(){
        num++;
      }
    });

    expect( num ).is.equals( 0 );

    hu.$forceUpdate();
    expect( num ).is.equals( 0 );

    hu.$forceUpdate();
    hu.$forceUpdate();
    expect( num ).is.equals( 0 );

    hu.$mount(
      document.createElement('div')
    );

    expect( num ).is.equals( 1 );

    hu.$forceUpdate();
    expect( num ).is.equals( 2 );

    hu.$forceUpdate();
    hu.$forceUpdate();
    expect( num ).is.equals( 4 );
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后会依次触发 beforeDestroy, destroyed 生命周期回调', () => {
    const steps = [];
    const hu = new Hu({
      beforeDestroy: () => steps.push('beforeDestroy'),
      destroyed: () => steps.push('destroyed')
    });

    expect( steps ).is.deep.equals([ ]);

    hu.$destroy();

    expect( steps ).is.deep.equals([ 'beforeDestroy', 'destroyed' ]);
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后会解除所有的 watch 绑定', ( done ) => {
    let index = 0;
    const hu = new Hu({
      data: {
        a: 1
      },
      watch: {
        a: () => index++
      }
    });

    hu.$watch( 'a', () => index++ );

    hu.a = 2;
    hu.$nextTick(() => {
      expect( index ).is.equals( 2 );

      hu.a = 3;
      hu.$nextTick(() => {
        expect( index ).is.equals( 4 );

        hu.$destroy();

        hu.a = 2;
        hu.$nextTick(() => {
          expect( index ).is.equals( 4 );

          done();
        });
      });
    });
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后会解除所有的计算属性', ( done ) => {
    const hu = new Hu({
      data: {
        a: 1
      },
      computed: {
        b(){
          return this.a * 2;
        },
        c(){
          return this.b * 2;
        }
      }
    });

    expect( hu.a ).is.equals( 1 );
    expect( hu.b ).is.equals( 2 );
    expect( hu.c ).is.equals( 4 );

    hu.a = 2;
    hu.$nextTick(() => {
      expect( hu.a ).is.equals( 2 );
      expect( hu.b ).is.equals( 4 );
      expect( hu.c ).is.equals( 8 );

      hu.a = 3;
      hu.$nextTick(() => {
        expect( hu.a ).is.equals( 3 );
        expect( hu.b ).is.equals( 6 );
        expect( hu.c ).is.equals( 12 );

        hu.$destroy();

        hu.a = 4;
        hu.$nextTick(() => {
          expect( hu.a ).is.equals( 4 );
          expect( hu.b ).is.equals( 6 );
          expect( hu.c ).is.equals( 12 );

          done();
        });
      });
    });
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后会解除所有 bind 指令方法绑定和双向数据绑定', ( done ) => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        value: '1'
      },
      render( html ){
        const bind = html.bind;

        return html`
          <input ref="input" :model=${[ this, 'value' ]} data-value=${ bind( this, 'value' ) } />
        `;
      }
    });

    expect( hu.$refs.input.value ).is.equals('1');
    expect( hu.$refs.input.getAttribute('data-value') ).is.equals('1');

    hu.value = '2';
    hu.$nextTick(() => {
      expect( hu.$refs.input.value ).is.equals('2');
      expect( hu.$refs.input.getAttribute('data-value') ).is.equals('2');

      hu.value = '3';
      hu.$nextTick(() => {
        expect( hu.$refs.input.value ).is.equals('3');
        expect( hu.$refs.input.getAttribute('data-value') ).is.equals('3');

        hu.$destroy();

        hu.value = '4';
        hu.$nextTick(() => {
          expect( hu.$refs.input.value ).is.equals('3');
          expect( hu.$refs.input.getAttribute('data-value') ).is.equals('3');

          hu.value = '5';
          hu.$nextTick(() => {
            expect( hu.$refs.input.value ).is.equals('3');
            expect( hu.$refs.input.getAttribute('data-value') ).is.equals('3');

            done();
          });
        });
      });
    });
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后会解除所有自定义事件绑定', () => {
    let index = 0;
    const hu = new Hu();

    hu.$on( 'test', () => index++ );
    hu.$on( 'test', () => index++ );
    hu.$on( 'test', () => index++ );

    expect( index ).is.equals( 0 );

    hu.$emit('test');
    expect( index ).is.equals( 3 );

    hu.$emit('test');
    expect( index ).is.equals( 6 );

    hu.$emit('test');
    hu.$emit('test');
    expect( index ).is.equals( 12 );

    hu.$destroy();

    hu.$emit('test');
    expect( index ).is.equals( 12 );

    hu.$emit('test');
    expect( index ).is.equals( 12 );

    hu.$emit('test');
    hu.$emit('test');
    expect( index ).is.equals( 12 );
  });

  it( '实例上的 $destroy 方法用于手动注销实例, 调用后会解除 render 方法收集到的依赖', ( done ) => {
    let index = 0;
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        value: 123
      },
      render( html ){
        index++;
        return html`<div ref="div">${ this.value }</div>`;
      }
    });

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

        hu.$destroy();

        hu.value = 123456;
        hu.$nextTick(() => {
          expect( index ).is.equals( 3 );
          expect( hu.$refs.div.innerText ).is.equals('12345');

          hu.value = 1234567;
          hu.$nextTick(() => {
            expect( index ).is.equals( 3 );
            expect( hu.$refs.div.innerText ).is.equals('12345');

            done();
          });
        });
      });
    });
  });

});