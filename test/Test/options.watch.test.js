describe( 'options.watch', () => {

  it( '使用 watch 对实例内的属性进行监听', ( done ) => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: 1
      }),
      watch: {
        a: ( value, oldValue ) => {
          result = [ value, oldValue ];
        }
      }
    });

    expect( result ).is.undefined;

    hu.a = 2;
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      hu.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 3, 2 ]);
        done();
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: 1
      }),
      watch: {
        a: ( value, oldValue ) => {
          result = [ value, oldValue ];
        }
      }
    });

    expect( result ).is.undefined;

    vm.a = 2;
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      vm.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 3, 2 ]);
        done();
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 只有值被真正更改时, 回调才被触发', ( done ) => {
    let index = 0;
    let result;
    const hu = new Hu({
      data: () => ({
        a: 1
      }),
      watch: {
        a: ( value, oldValue ) => {
          index++;
          result = [ value, oldValue ];
        }
      }
    });

    expect( result ).is.undefined;

    hu.a = 2;
    expect( index ).is.equals( 0 );
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( result ).is.deep.equals([ 2, 1 ]);

      hu.a = 2;
      expect( index ).is.equals( 1 );
      expect( result ).is.deep.equals([ 2, 1 ]);
      hu.$nextTick(() => {
        expect( index ).is.equals( 1 );
        expect( result ).is.deep.equals([ 2, 1 ]);

        hu.a = 3;
        expect( index ).is.equals( 1 );
        expect( result ).is.deep.equals([ 2, 1 ]);
        hu.$nextTick(() => {
          expect( index ).is.equals( 2 );
          expect( result ).is.deep.equals([ 3, 2 ]);
          done();
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 只有值被真正更改时, 回调才被触发 ( Vue )', ( done ) => {
    let index = 0;
    let result;
    const vm = new Vue({
      data: () => ({
        a: 1
      }),
      watch: {
        a: ( value, oldValue ) => {
          index++;
          result = [ value, oldValue ];
        }
      }
    });

    expect( result ).is.undefined;

    vm.a = 2;
    expect( index ).is.equals( 0 );
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( result ).is.deep.equals([ 2, 1 ]);

      vm.a = 2;
      expect( index ).is.equals( 1 );
      expect( result ).is.deep.equals([ 2, 1 ]);
      vm.$nextTick(() => {
        expect( index ).is.equals( 1 );
        expect( result ).is.deep.equals([ 2, 1 ]);

        vm.a = 3;
        expect( index ).is.equals( 1 );
        expect( result ).is.deep.equals([ 2, 1 ]);
        vm.$nextTick(() => {
          expect( index ).is.equals( 2 );
          expect( result ).is.deep.equals([ 3, 2 ]);
          done();
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 触发回调时, 值已经被更改', ( done ) => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: 1
      }),
      watch: {
        a( value, oldValue ){
          result = [ this.a, value, oldValue ];
        }
      }
    });

    expect( result ).is.undefined;

    hu.a = 2;
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 2, 1 ]);
      done();
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 触发回调时, 值已经被更改 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: 1
      }),
      watch: {
        a( value, oldValue ){
          result = [ this.a, value, oldValue ];
        }
      }
    });

    expect( result ).is.undefined;

    vm.a = 2;
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 2, 1 ]);
      done();
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 使用 handler 选项在使用对象形式时设定回调', ( done ) => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: 1
      }),
      watch: {
        a: {
          handler: ( value, oldValue ) => {
            result = [ value, oldValue ];
          }
        }
      }
    });

    expect( result ).is.undefined;

    hu.a = 2;
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      hu.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 3, 2 ]);
        done();
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 使用 handler 选项在使用对象形式时设定回调 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: 1
      }),
      watch: {
        a: {
          handler: ( value, oldValue ) => {
            result = [ value, oldValue ];
          }
        }
      }
    });

    expect( result ).is.undefined;

    vm.a = 2;
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      vm.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 3, 2 ]);
        done();
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 使用 immediate 选项可以立即触发回调', ( done ) => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: 1
      }),
      watch: {
        a: {
          immediate: true,
          handler: ( value, oldValue ) => {
            result = [ value, oldValue ];
          }
        }
      }
    });

    expect( result ).is.deep.equals([ 1, undefined ]);

    hu.a = 2;
    expect( result ).is.deep.equals([ 1, undefined ]);
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      hu.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 3, 2 ]);
        done();
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 使用 immediate 选项可以立即触发回调 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: 1
      }),
      watch: {
        a: {
          immediate: true,
          handler: ( value, oldValue ) => {
            result = [ value, oldValue ];
          }
        }
      }
    });

    expect( result ).is.deep.equals([ 1, undefined ]);

    vm.a = 2;
    expect( result ).is.deep.equals([ 1, undefined ]);
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      vm.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 3, 2 ]);
        done();
      });
    });
  });

});