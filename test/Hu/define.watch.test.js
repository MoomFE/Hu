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

  it( '使用 $watch 对值进行监听, 值每被改变一次, 回调就触发一次', () => {
    const customName = window.customName;
    let index = 0;

    Hu.define( customName, {
      data: () => ({
        a: 1
      })
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    hu.$watch( 'a', () => index++ );

    expect( index ).is.equals( 0 );

    hu.a = 2;
    expect( index ).is.equals( 1 );

    hu.a = 3;
    expect( index ).is.equals( 2 );

    hu.a = 3;
    hu.a = 3;
    hu.a = 3;
    expect( index ).is.equals( 2 );

    hu.a = NaN;
    expect( index ).is.equals( 3 );

    hu.a = NaN;
    hu.a = NaN;
    hu.a = NaN;
    expect( index ).is.equals( 3 );
  });

  it( '使用 $watch 对值进行监听, 触发回调时, 值已经被更改', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data: () => ({
        a: 1
      })
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    hu.$watch( 'a', function( value, oldValue ){
      expect( value ).is.equals( this.a );
    });

    hu.a = 2;
  });

  it( '使用 $watch 方法, 会返回取消监听方法', () => {
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

    const unWatch = hu.$watch( 'a', ( value, oldValue ) => {
      result = [ value, oldValue ];
    });

    expect( result ).is.undefined;
    hu.a = 2;
    expect( result ).is.deep.equals([ 2, 1 ]);
    hu.a = 3;
    expect( result ).is.deep.equals([ 3, 2 ]);

    expect( unWatch ).is.a('function');
    unWatch();

    hu.a = 4;
    expect( result ).is.deep.equals([ 3, 2 ]);
    hu.a = 5;
    expect( result ).is.deep.equals([ 3, 2 ]);
  });

  it( '使用 deep 选项监听对象内部值的变化', () => {
    const customName = window.customName;
    let index = 0;

    Hu.define( customName, {
      data: () => ({
        a: {
          b: 1,
          c: 2
        }
      }),
      watch: {
        a: {
          handler(){ index++ },
          deep: true
        }
      }
    });
  
    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( index ).is.equals( 0 );

    hu.a.b = 2;
    expect( index ).is.equals( 1 );
    hu.a.b = 3;
    expect( index ).is.equals( 2 );
    hu.a.c = 3;
    expect( index ).is.equals( 3 );
    hu.a.c = 4;
    expect( index ).is.equals( 4 );
  });

  it( '使用 depp 选项监听对象只监听最后一级', () => {
    const customName = window.customName;
    let index = 0;

    Hu.define( customName, {
      data: () => ({
        a: {
          b: { c: 1 },
          d: 2
        }
      }),
      watch: {
        'a.b.c': {
          handler(){ index++ },
          deep: true
        }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( index ).is.equals( 0 );

    hu.a.b.c = 2;
    expect( index ).is.equals( 1 );

    hu.a.b.c = 3;
    expect( index ).is.equals( 2 );
    
    hu.a.d = 2;
    expect( index ).is.equals( 2 );
  });

  it( '使用 watch 对实例的属性进行监听, 传入方法', () => {
    const customName = window.customName;
    let result;

    Hu.define( customName, {
      data: () => ({
        a: 1
      }),
      watch: {
        a: ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( result ).is.undefined;

    hu.a = 2;
    expect( result ).is.deep.equals([ 2, 1 ]);

    hu.a = 6;
    expect( result ).is.deep.equals([ 6, 2 ]);
  });

  it( '使用 watch 对实例的属性进行监听, 传入选项对象', () => {
    const customName = window.customName;
    let result;

    Hu.define( customName, {
      data: () => ({
        a: 1
      }),
      watch: {
        a: {
          handler: ( value, oldValue ) => result = [ value, oldValue ]
        }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( result ).is.undefined;

    hu.a = 2;
    expect( result ).is.deep.equals([ 2, 1 ]);

    hu.a = 6;
    expect( result ).is.deep.equals([ 6, 2 ]);
  });

  it( '使用 watch 对计算属性进行监听, 确保每次都能被监听到改变', () => {
    const customName = window.customName;
    let index = 0;
    let result;

    Hu.define( customName, {
      data: () => ({
        d1: 1
      }),
      computed: {
        c1(){ return this.d1 }
      },
      watch: {
        c1: ( value, oldValue ) => {
          index++;
          result = [ value, oldValue ];
        }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( index ).is.deep.equals( 0 );
    expect( result ).is.undefined;
    expect( hu.c1 ).is.deep.equals( 1 );

    hu.d1 = 2;
    expect( index ).is.deep.equals( 1 );
    expect( result ).is.deep.equals([ 2, 1 ]);
    expect( hu.c1 ).is.deep.equals( 2 );

    hu.d1 = 3;
    expect( index ).is.deep.equals( 2 );
    expect( result ).is.deep.equals([ 3, 2 ]);
    expect( hu.c1 ).is.deep.equals( 3 );
  });

});