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

  it( '实例上的 $on 方法用于注册事件', () => {
    const hu = new Hu();
    let index = 0;
    let result, result1;

    hu.$on( 'test', function(){
      index++;
      result = [ ...arguments ];
      expect( hu ).is.equals( this );
    });

    hu.$on([ 'test1', 'test2' ], function(){
      index++;
      result1 = [ ...arguments ];
      expect( hu ).is.equals( this );
    });

    hu.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.undefined;

    hu.$emit( 'test1', 4, 5, 6 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    hu.$emit( 'test2', 7, 8, 9 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);
  });

  it( '实例上的 $on 方法用于注册事件 ( Vue )', () => {
    const vm = new Vue();
    let index = 0;
    let result, result1;

    vm.$on( 'test', function(){
      index++;
      result = [ ...arguments ];
      expect( vm ).is.equals( this );
    });

    vm.$on([ 'test1', 'test2' ], function(){
      index++;
      result1 = [ ...arguments ];
      expect( vm ).is.equals( this );
    });

    vm.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.undefined;

    vm.$emit( 'test1', 4, 5, 6 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    vm.$emit( 'test2', 7, 8, 9 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);
  });

  it( '实例上的 $once 方法用于注册只执行一次的事件', () => {
    const hu = new Hu();
    let index = 0;
    let result, result1;

    hu.$once( 'test', function(){
      index++;
      result = [ ...arguments ];
      expect( hu ).is.equals( this );
    });

    hu.$on( 'test1', function(){
      index++;
      result1 = [ ...arguments ];
      expect( hu ).is.equals( this );
    });

    hu.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.undefined;

    hu.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.undefined;

    hu.$emit( 'test1', 4, 5, 6 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    hu.$emit( 'test1', 7, 8, 9 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);
  });

  it( '实例上的 $once 方法用于注册只执行一次的事件 ( Vue )', () => {
    const vm = new Vue();
    let index = 0;
    let result, result1;

    vm.$once( 'test', function(){
      index++;
      result = [ ...arguments ];
      expect( vm ).is.equals( this );
    });

    vm.$on( 'test1', function(){
      index++;
      result1 = [ ...arguments ];
      expect( vm ).is.equals( this );
    });

    vm.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.undefined;

    vm.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.undefined;

    vm.$emit( 'test1', 4, 5, 6 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    vm.$emit( 'test1', 7, 8, 9 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);
  });

  it( '实例上的 $off 方法用于解绑事件', () => {
    const hu = new Hu();
    let index = 0;
    let result, result1;

    function fn(){
      index++;
      result = [ ...arguments ];
    }

    function fn1(){
      index++;
      result1 = [ ...arguments ];
    }

    hu.$on( [ 'test', 'test1' ], fn );
    hu.$on( [ 'test', 'test1' ], fn1 );

    // 解绑某个事件的某个回调
    hu.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 1, 2, 3 ]);

    hu.$off( 'test', fn );
    hu.$emit( 'test', 4, 5, 6 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    // 解绑某个事件的全部回调
    hu.$emit( 'test1', 7, 8, 9 );
    expect( index ).is.equals( 5 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);

    hu.$off( 'test1' );
    hu.$emit( 'test1', 1, 2, 3 );
    expect( index ).is.equals( 5 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);

    // 解绑所有事件
    hu.$emit( 'test', 4, 5, 6 );
    expect( index ).is.equals( 6 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    hu.$off();
    hu.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 6 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);
  });

  it( '实例上的 $off 方法用于解绑事件 ( Vue )', () => {
    const vm = new Vue();
    let index = 0;
    let result, result1;

    function fn(){
      index++;
      result = [ ...arguments ];
    }

    function fn1(){
      index++;
      result1 = [ ...arguments ];
    }

    vm.$on( [ 'test', 'test1' ], fn );
    vm.$on( [ 'test', 'test1' ], fn1 );

    // 解绑某个事件的某个回调
    vm.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 1, 2, 3 ]);

    vm.$off( 'test', fn );
    vm.$emit( 'test', 4, 5, 6 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2, 3 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    // 解绑某个事件的全部回调
    vm.$emit( 'test1', 7, 8, 9 );
    expect( index ).is.equals( 5 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);

    vm.$off( 'test1' );
    vm.$emit( 'test1', 1, 2, 3 );
    expect( index ).is.equals( 5 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 7, 8, 9 ]);

    // 解绑所有事件
    vm.$emit( 'test', 4, 5, 6 );
    expect( index ).is.equals( 6 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);

    vm.$off();
    vm.$emit( 'test', 1, 2, 3 );
    expect( index ).is.equals( 6 );
    expect( result ).is.deep.equals([ 7, 8, 9 ]);
    expect( result1 ).is.deep.equals([ 4, 5, 6 ]);
  });

  it( '实例上的 $emit 方法用于触发事件', () => {
    const hu = new Hu();
    let index = 0;
    let result;

    hu.$on( 'test', function(){
      index++;
      result = [ ...arguments ];
    });

    hu.$emit( 'test' );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ ]);

    hu.$emit( 'test', 1 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1 ]);

    hu.$emit( 'test', 1, 2 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2 ]);
  });

  it( '实例上的 $emit 方法用于触发事件 ( Vue )', () => {
    const vm = new Vue();
    let index = 0;
    let result;

    vm.$on( 'test', function(){
      index++;
      result = [ ...arguments ];
    });

    vm.$emit( 'test' );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ ]);

    vm.$emit( 'test', 1 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1 ]);

    vm.$emit( 'test', 1, 2 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2 ]);
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