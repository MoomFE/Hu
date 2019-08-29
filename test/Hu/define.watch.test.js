describe( 'Hu.define - watch', () => {

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