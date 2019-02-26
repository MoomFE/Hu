describe( 'Hu.define - watch', () => {

  it( '使用 $watch 对一个函数的返回值进行监听, 函数的 this 指向的均是 $hu', () => {
    const customName = window.customName;

    Hu.define( customName );

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    hu.$watch(
      function(){
        expect( this ).is.equals( hu );
      },
      function(){
        expect( this ).is.equals( hu );
      },
      {
        immediate: true
      }
    );
  });

  it( '使用 $watch 对一个函数的返回值进行监听, 类似于监听一个计算属性', () => {
    const customName = window.customName;
    let result;

    Hu.define( customName, {
      data: () => ({
        a: 1,
        b: 2
      })
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    hu.$watch(
      function(){
        return this.a + this.b;
      },
      ( value, oldValue ) => result = [ value, oldValue ]
    );

    expect( result ).is.undefined;

    hu.a = 2;

    expect( result ).is.deep.equals([ 4, 3 ]);

    hu.b = 998;

    expect( result ).is.deep.equals([ 1000, 4 ]);
  });

  it( '使用 $watch 对一个函数的返回值进行监听, 类似于监听一个计算属性( Vue )( 不一致 )', () => {
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
    });
  });

  it( '使用 $watch 对一个函数的返回值进行监听, 类似于监听一个计算属性, 使用 immediate 选项立即触发回调', () => {
    const customName = window.customName;
    let result;

    Hu.define( customName, {
      data: () => ({
        a: 1,
        b: 2
      })
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    hu.$watch(
      function(){
        return this.a + this.b;
      },
      ( value, oldValue ) => result = [ value, oldValue ],
      {
        immediate: true
      }
    );

    expect( result ).is.deep.equals([ 3, undefined ]);

    hu.a = 2;

    expect( result ).is.deep.equals([ 4, 3 ]);

    hu.b = 998;

    expect( result ).is.deep.equals([ 1000, 4 ]);
  });

  it( '使用 $watch 对一个函数的返回值进行监听, 类似于监听一个计算属性, 使用 immediate 选项立即触发回调( Vue )( 不一致 )', () => {
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
      ( value, oldValue ) => result = [ value, oldValue ],
      {
        immediate: true
      }
    );

    expect( result ).is.deep.equals([ 3, undefined ]);

    vm.a = 2;

    expect( result ).is.deep.equals([ 3, undefined ]);
    
    vm.b = 998;

    expect( result ).is.deep.equals([ 3, undefined ]);

    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 1000, 3 ]);
    });
  });

  it( '使用 $watch 对单路径进行监听, 目标对象更改立即触发回调', () => {
    const customName = window.customName;
    let result;

    Hu.define( customName, {
      data: () => ({
        a: 1
      })
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    hu.$watch( 'a', ( value, oldValue ) => result = [ value, oldValue ] );

    expect( result ).is.undefined;

    hu.a = 2;
    expect( result ).is.deep.equals([ 2, 1 ]);

    hu.a = 3;
    expect( result ).is.deep.equals([ 3, 2 ]);
  });

  it( '使用 $watch 对复杂键路径表达式进行监听, 目标对象更改立即触发回调', () => {
    const customName = window.customName;
    let result;

    Hu.define( customName, {
      data: () => ({
        a: {
          b: 1
        }
      })
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    hu.$watch( 'a.b', ( value, oldValue ) => result = [ value, oldValue ] );

    expect( result ).is.undefined;

    hu.a.b = 2;
    expect( result ).is.deep.equals([ 2, 1 ]);
  });

});