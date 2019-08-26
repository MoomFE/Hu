describe( 'Hu.define - watch', () => {

  it( '使用 $watch 对一个函数的返回值进行监听, 函数的 this 指向的均是当前实例', () => {
    const steps = [];
    const hu = new Hu({});

    hu.$watch(
      function(){
        steps.push('watch');
        expect( this ).is.equals( hu );
      },
      function(){
        steps.push('callback');
        expect( this ).is.equals( hu );
      },
      {
        immediate: true
      }
    );

    expect( steps ).is.deep.equals([ 'watch', 'callback' ]);
  });

  it( '使用 $watch 对一个函数的返回值进行监听, 函数的 this 指向的均是当前实例 ( Vue )', () => {
    const steps = [];
    const vm = new Vue({});

    vm.$watch(
      function(){
        steps.push('watch');
        expect( this ).is.equals( vm );
      },
      function(){
        steps.push('callback');
        expect( this ).is.equals( vm );
      },
      {
        immediate: true
      }
    );

    expect( steps ).is.deep.equals([ 'watch', 'callback' ]);
  });

  it( '使用 $watch 对一个函数的返回值进行监听, 类似于监听一个计算属性', ( done ) => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: 1,
        b: 2
      })
    });

    hu.$watch(
      function(){
        return this.a + this.b;
      },
      ( value, oldValue ) => result = [ value, oldValue ]
    );

    expect( result ).is.undefined;

    hu.a = 2;

    expect( result ).is.undefined;

    hu.b = 998;

    expect( result ).is.undefined;

    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 1000, 3 ]);
      done();
    });
  });

  it( '使用 $watch 对一个函数的返回值进行监听, 类似于监听一个计算属性 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: 1,
        b: 2
      })
    });

    vm.$watch(
      function(){
        return this.a + this.b;
      },
      ( value, oldValue ) => result = [ value, oldValue ]
    );

    expect( result ).is.undefined;

    vm.a = 2;

    expect( result ).is.undefined;

    vm.b = 998;

    expect( result ).is.undefined;

    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 1000, 3 ]);
      done();
    });
  });

  it( '使用 $watch 对变量的内容进行深度监听', ( done ) => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: {
          b: 1,
          c: 2
        }
      })
    });

    hu.$watch( 'a.b', ( value, oldValue ) => {
      result = [ value, oldValue ];
    });

    expect( result ).is.undefined;

    hu.a.b = 2;
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      hu.a = { b: 2 };
      expect( result ).is.deep.equals([ 2, 1 ]);
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 2, 1 ]);
        done();
      });
    });
  });

  it( '使用 $watch 对变量的内容进行深度监听 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: {
          b: 1,
          c: 2
        }
      })
    });

    vm.$watch( 'a.b', ( value, oldValue ) => {
      result = [ value, oldValue ];
    });

    expect( result ).is.undefined;

    vm.a.b = 2;
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      vm.a = { b: 2 };
      expect( result ).is.deep.equals([ 2, 1 ]);
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 2, 1 ]);
        done();
      });
    });
  });

  it( '使用 $watch 对变量的内容进行深度监听 ( 二 )', ( done ) => {
    let result;
    let index = 0;
    const hu = new Hu({
      data: () => ({
        a: {
          b: undefined,
          c: 2
        }
      })
    });

    hu.$watch( 'a.b', {
      immediate: true,
      handler( value, oldValue ){
        index++;
        result = [ value, oldValue ];
      }
    });

    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ undefined, undefined ]);

    hu.a = { b: undefined };
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ undefined, undefined ]);
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( result ).is.deep.equals([ undefined, undefined ]);
      done();
    });
  });

  it( '使用 $watch 对变量的内容进行深度监听 ( 二 ) ( Vue )', ( done ) => {
    let result;
    let index = 0;
    const vm = new Vue({
      data: () => ({
        a: {
          b: undefined,
          c: 2
        }
      })
    });

    vm.$watch( 'a.b', {
      immediate: true,
      handler( value, oldValue ){
        index++;
        result = [ value, oldValue ];
      }
    });

    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ undefined, undefined ]);

    vm.a = { b: undefined };
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ undefined, undefined ]);
    vm.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( result ).is.deep.equals([ undefined, undefined ]);
      done();
    });
  });

  it( '使用 $watch 方法, 会返回取消监听的方法, 运行后, 会立即停止监听', () => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: 1
      })
    });

    const unWatch = hu.$watch( 'a', ( value, oldValue ) => {
      result = [ value, oldValue ];
    });

    expect( result ).is.undefined;

    hu.a = 2;
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      unWatch();
      hu.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 2, 1 ]);
      });
    });
  });

  it( '使用 $watch 方法, 会返回取消监听的方法, 运行后, 会立即停止监听 ( Vue )', () => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: 1
      })
    });

    const unWatch = vm.$watch( 'a', ( value, oldValue ) => {
      result = [ value, oldValue ];
    });

    expect( result ).is.undefined;

    vm.a = 2;
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      unWatch();
      vm.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 2, 1 ]);
      });
    });
  });

  it( '使用 $watch 方法, 会返回取消监听的方法, 运行后, 会立即停止监听 ( 二 )', ( done ) => {
    let index = 0;
    let unWatch;
    const hu = new Hu({
      data: {
        a: 'aaa'
      },
      computed: {
        b(){
          if( unWatch ) unWatch();
          return this.a;
        }
      },
      watch: {
        b(){}
      }
    });

    expect( hu.b ).is.equals( 'aaa' );

    hu.$watch( 'a', () => {} );
    hu.$watch( 'a', () => {} );
    const unWatchCache = hu.$watch( 'a', {
      immediate: true,
      handler(){
        index++;
      }
    });
    hu.$watch( 'a', () => {} );
    hu.$watch( 'a', () => {} );

    expect( index ).is.equals( 1 );

    hu.a = 'aaaa';
    hu.$nextTick(() => {
      expect( index ).is.equals( 2 );

      unWatch = unWatchCache;
      hu.a = 'aaaaa';
      hu.$nextTick(() => {
        expect( index ).is.equals( 2 );

        done();
      });
    });
  });

  it( '使用 $watch 方法, 会返回取消监听的方法, 运行后, 会立即停止监听 ( 二 ) ( Vue )', ( done ) => {
    let index = 0;
    let unWatch;
    const vm = new Vue({
      data: {
        a: 'aaa'
      },
      computed: {
        b(){
          if( unWatch ) unWatch();
          return this.a;
        }
      },
      watch: {
        b(){}
      }
    });

    expect( vm.b ).is.equals( 'aaa' );

    vm.$watch( 'a', () => {} );
    vm.$watch( 'a', () => {} );
    const unWatchCache = vm.$watch( 'a', {
      immediate: true,
      handler(){
        index++;
      }
    });
    vm.$watch( 'a', () => {} );
    vm.$watch( 'a', () => {} );

    expect( index ).is.equals( 1 );

    vm.a = 'aaaa';
    vm.$nextTick(() => {
      expect( index ).is.equals( 2 );

      unWatch = unWatchCache;
      vm.a = 'aaaaa';
      vm.$nextTick(() => {
        expect( index ).is.equals( 2 );

        done();
      });
    });
  });

  it( '使用 $watch 时, 使用 deep 选项如果返回值不是观察者对象则无效', ( done ) => {
    let result;
    const hu = new Hu({
      data: { a: 1 }
    });

    hu.$watch(
      function(){
        this.a;
        return sessionStorage;
      },
      {
        deep: true,
        immediate: true,
        handler: ( value, oldValue ) => result = [ value, oldValue ]
      }
    );

    expect( result ).is.deep.equals([ sessionStorage, undefined ]);

    sessionStorage.setItem('a',1);
    expect( result ).is.deep.equals([ sessionStorage, undefined ]);
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ sessionStorage, undefined ]);

      done();
    });
  });

  it( '使用 $watch 时, 使用 deep 选项如果返回值不是观察者对象则无效 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: { a: 1 }
    });

    vm.$watch(
      function(){
        this.a;
        return sessionStorage;
      },
      {
        deep: true,
        immediate: true,
        handler: ( value, oldValue ) => result = [ value, oldValue ]
      }
    );

    expect( result ).is.deep.equals([ sessionStorage, undefined ]);

    sessionStorage.setItem('a',1);
    expect( result ).is.deep.equals([ sessionStorage, undefined ]);
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ sessionStorage, undefined ]);

      done();
    });
  });

  it( '使用 $watch 时, 使用 deep 选项如果返回值不是观察者对象则可以生效', ( done ) => {
    let result;
    const data = Hu.observable({
      aaa: 1
    });
    const hu = new Hu({
      data: { a: 1 }
    });

    hu.$watch(
      function(){
        this.a;
        return data;
      },
      {
        deep: true,
        immediate: true,
        handler: ( value, oldValue ) => result = [ value, oldValue ]
      }
    );

    expect( result ).is.deep.equals([ data, undefined ]);

    data.aaa = 2;
    expect( result ).is.deep.equals([ data, undefined ]);
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ data, data ]);

      done();
    });
  });

  it( '使用 $watch 时, 使用 deep 选项如果返回值不是观察者对象则可以生效 ( Vue )', ( done ) => {
    let result;
    const data = Vue.observable({
      aaa: 1
    });
    const vm = new Vue({
      data: { a: 1 }
    });

    vm.$watch(
      function(){
        this.a;
        return data;
      },
      {
        deep: true,
        immediate: true,
        handler: ( value, oldValue ) => result = [ value, oldValue ]
      }
    );

    expect( result ).is.deep.equals([ data, undefined ]);

    data.aaa = 2;
    expect( result ).is.deep.equals([ data, undefined ]);
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ data, data ]);

      done();
    });
  });

  it( '使用 $watch 时, 在回调方法内修改监听的值会立即再收到一次回调', ( done ) => {
    const steps = [];
    const hu = new Hu({
      data: {
        a: 1
      }
    });

    hu.$watch( 'a', ( value ) => {
      steps.push( 1 );
      hu.a = 3;
    });
    hu.$watch( 'a', ( value ) => {
      steps.push( 2 );
    });
    hu.$watch( 'a', ( value ) => {
      steps.push( 3 );
    });

    hu.a = 2;
    hu.$nextTick(() => {
      expect( steps ).is.deep.equals([ 1, 1, 2, 3 ]);

      done();
    });
  });

  it( '使用 $watch 时, 在回调方法内修改监听的值会立即再收到一次回调 ( Vue )', ( done ) => {
    const steps = [];
    const vm = new Vue({
      data: {
        a: 1
      }
    });

    vm.$watch( 'a', ( value ) => {
      steps.push( 1 );
      vm.a = 3;
    });
    vm.$watch( 'a', ( value ) => {
      steps.push( 2 );
    });
    vm.$watch( 'a', ( value ) => {
      steps.push( 3 );
    });

    vm.a = 2;
    vm.$nextTick(() => {
      expect( steps ).is.deep.equals([ 1, 1, 2, 3 ]);

      done();
    });
  });

  it( '使用 $watch 对数组进行监听, 使用 length = num 的方式删除值后也会触发', ( done ) => {
    let result0, result1, result2;
    let index0 = 0, index1 = 0, index2 = 0;
    const hu = new Hu({
      data: {
        arr: [ 1, 2, 3 ]
      }
    });

    hu.$watch(
      () => hu.arr[ 0 ],
      ( value, oldValue ) => {
        index0++;
        result0 = [ value, oldValue ];
      }
    );
    hu.$watch(
      () => hu.arr[ 1 ],
      ( value, oldValue ) => {
        index1++;
        result1 = [ value, oldValue ];
      }
    );
    hu.$watch(
      () => hu.arr[ 2 ],
      ( value, oldValue ) => {
        index2++;
        result2 = [ value, oldValue ];
      }
    );

    hu.arr.splice( 0, 3, 4, 5, 6 );
    hu.$nextTick(() => {
      expect( index0 ).is.equals( 1 );
      expect( index1 ).is.equals( 1 );
      expect( index2 ).is.equals( 1 );
      expect( result0 ).is.deep.equals([ 4, 1 ]);
      expect( result1 ).is.deep.equals([ 5, 2 ]);
      expect( result2 ).is.deep.equals([ 6, 3 ]);

      hu.arr.length = 2;
      hu.$nextTick(() => {
        expect( index0 ).is.equals( 1 );
        expect( index1 ).is.equals( 1 );
        expect( index2 ).is.equals( 2 );
        expect( result0 ).is.deep.equals([ 4, 1 ]);
        expect( result1 ).is.deep.equals([ 5, 2 ]);
        expect( result2 ).is.deep.equals([ undefined, 6 ]);

        hu.arr.length = 0;
        hu.$nextTick(() => {
          expect( index0 ).is.equals( 2 );
          expect( index1 ).is.equals( 2 );
          expect( index2 ).is.equals( 2 );
          expect( result0 ).is.deep.equals([ undefined, 4 ]);
          expect( result1 ).is.deep.equals([ undefined, 5 ]);
          expect( result2 ).is.deep.equals([ undefined, 6 ]);

          done();
        });
      });
    });
  });

  it( '使用 $watch 对数组进行监听, 使用 length = num 的方式删除值后也会触发 ( Vue ) ( 不支持 )', ( done ) => {
    let result0, result1, result2;
    let index0 = 0, index1 = 0, index2 = 0;
    const vm = new Vue({
      data: {
        arr: [ 1, 2, 3 ]
      }
    });

    vm.$watch(
      () => vm.arr[ 0 ],
      ( value, oldValue ) => {
        index0++;
        result0 = [ value, oldValue ];
      }
    );
    vm.$watch(
      () => vm.arr[ 1 ],
      ( value, oldValue ) => {
        index1++;
        result1 = [ value, oldValue ];
      }
    );
    vm.$watch(
      () => vm.arr[ 2 ],
      ( value, oldValue ) => {
        index2++;
        result2 = [ value, oldValue ];
      }
    );

    vm.arr.splice( 0, 3, 4, 5, 6 );
    vm.$nextTick(() => {
      expect( index0 ).is.equals( 1 );
      expect( index1 ).is.equals( 1 );
      expect( index2 ).is.equals( 1 );
      expect( result0 ).is.deep.equals([ 4, 1 ]);
      expect( result1 ).is.deep.equals([ 5, 2 ]);
      expect( result2 ).is.deep.equals([ 6, 3 ]);

      vm.arr.length = 2;
      vm.$set( vm.arr, 'length', 2 );
      vm.$nextTick(() => {
        expect( index0 ).is.equals( 1 );
        expect( index1 ).is.equals( 1 );
        expect( index2 ).is.equals( 1 );
        expect( result0 ).is.deep.equals([ 4, 1 ]);
        expect( result1 ).is.deep.equals([ 5, 2 ]);
        expect( result2 ).is.deep.equals([ 6, 3 ]);

        vm.arr.length = 0;
        vm.$set( vm.arr, 'length', 0 );
        vm.$nextTick(() => {
          expect( index0 ).is.equals( 1 );
          expect( index1 ).is.equals( 1 );
          expect( index2 ).is.equals( 1 );
          expect( result0 ).is.deep.equals([ 4, 1 ]);
          expect( result1 ).is.deep.equals([ 5, 2 ]);
          expect( result2 ).is.deep.equals([ 6, 3 ]);

          done();
        });
      });
    });
  });

  it( '使用 $watch 对数组长度进行监听, 当使用了字符串数字给数组长度进行赋值后, 触发回调的也应该是正确的数组长度', ( done ) => {
    let result;
    let index = 0;
    const hu = new Hu({
      data: {
        arr: [ 1, 2, 3, 4, 5, 6 ]
      }
    });

    hu.$watch(
      () => hu.arr.length,
      ( value, oldValue ) => {
        index++;
        result = [ value, oldValue ];
      }
    );

    hu.arr.length = 5;
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( result ).is.deep.equals([ 5, 6 ]);

      hu.arr.length = '5';
      hu.$nextTick(() => {
        expect( index ).is.equals( 1 );
        expect( result ).is.deep.equals([ 5, 6 ]);

        hu.arr.length = '4';
        hu.arr.length = '3';
        hu.$nextTick(() => {
          expect( index ).is.equals( 2 );
          expect( result ).is.deep.equals([ 3, 5 ]);

          done();
        });
      });
    });
  });

  it( '使用 $watch 对数组长度进行监听, 当使用了字符串数字给数组长度进行赋值后, 触发回调的也应该是正确的数组长度 ( Vue ) ( 不支持 )', ( done ) => {
    let result;
    let index = 0;
    const vm = new Vue({
      data: {
        arr: [ 1, 2, 3, 4, 5, 6 ]
      }
    });

    vm.$watch(
      () => vm.arr.length,
      ( value, oldValue ) => {
        index++;
        result = [ value, oldValue ];
      }
    );

    vm.$set( vm.arr, 'length', 5 );
    vm.$nextTick(() => {
      expect( index ).is.equals( 0 );
      expect( result ).is.equals( undefined );

      vm.$set( vm.arr, 'length', '5' );
      vm.$nextTick(() => {
        expect( index ).is.equals( 0 );
        expect( result ).is.equals( undefined );

        vm.$set( vm.arr, 'length', '4' );
        vm.$set( vm.arr, 'length', '3' );
        vm.$nextTick(() => {
          expect( index ).is.equals( 0 );
          expect( result ).is.equals( undefined );

          done();
        });
      });
    });
  });

  it( '使用 $watch 监听值后, 值被删除时也会受到回调', ( done ) => {
    let result;
    const hu = new Hu({
      data: {
        data: {
          a: 1
        }
      },
      watch: {
        'data.a': {
          immediate: true,
          handler( value, oldValue ){
            result = [ value, oldValue ];
          }
        }
      }
    });

    expect( hu.data.a ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1, undefined ]);

    hu.data.a = 2;
    expect( hu.data.a ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1, undefined ]);
    hu.$nextTick(() => {
      expect( hu.data.a ).is.equals( 2 );
      expect( result ).is.deep.equals([ 2, 1 ]);

      delete hu.data.a;
      expect( hu.data.a ).is.undefined;
      expect( result ).is.deep.equals([ 2, 1 ]);
      hu.$nextTick(() => {
        expect( hu.data.a ).is.undefined;
        expect( result ).is.deep.equals([ undefined, 2 ]);

        done();
      });
    });
  });

  it( '使用 $watch 监听值后, 值被删除时也会受到回调 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: {
        data: {
          a: 1
        }
      },
      watch: {
        'data.a': {
          immediate: true,
          handler( value, oldValue ){
            result = [ value, oldValue ];
          }
        }
      }
    });

    expect( vm.data.a ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1, undefined ]);

    vm.data.a = 2;
    expect( vm.data.a ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1, undefined ]);
    vm.$nextTick(() => {
      expect( vm.data.a ).is.equals( 2 );
      expect( result ).is.deep.equals([ 2, 1 ]);

      Vue.delete( vm.data, 'a' );
      expect( vm.data.a ).is.undefined;
      expect( result ).is.deep.equals([ 2, 1 ]);
      vm.$nextTick(() => {
        expect( vm.data.a ).is.undefined;
        expect( result ).is.deep.equals([ undefined, 2 ]);

        done();
      });
    });
  });

  it( '使用 $watch 监听值后, 在 $watch 的回调中注销掉自己的监听时, 其它监听不会受到影响', () => {
    let result1, result2, result3;
    const hu = new Hu({
      data: { a: 1 }
    });

    const unWatch1 = hu.$watch( 'a', value => {
      unWatch1();
      result1 = value;
    });
    const unWatch2 = hu.$watch( 'a', value => {
      result2 = value;
    });
    const unWatch3 = hu.$watch( 'a', value => {
      result3 = value;
    });

    hu.a = 2;
    hu.$nextTick(() => {
      expect( result1 ).is.equals( 2 );
      expect( result2 ).is.equals( 2 );
      expect( result3 ).is.equals( 2 );
    });
  });

});