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

  it( '使用 watch 对实例内的属性进行监听, 值可以为一个字符串的方法名称', ( done ) => {
    let result;
    const hu = new Hu({
      data: {
        a: 1
      },
      methods: {
        watchA: ( value, oldValue ) => result = [ value, oldValue ]
      },
      watch: {
        a: 'watchA'
      }
    });

    hu.a = 2;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      done();
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 值可以为一个字符串的方法名称 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: {
        a: 1
      },
      methods: {
        watchA: ( value, oldValue ) => result = [ value, oldValue ]
      },
      watch: {
        a: 'watchA'
      }
    });

    vm.a = 2;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      done();
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 值可以为一个函数', ( done ) => {
    let result;
    const hu = new Hu({
      data: {
        a: 1
      },
      watch: {
        a: ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    hu.a = 2;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      done();
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 值可以为一个函数 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: {
        a: 1
      },
      watch: {
        a: ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    vm.a = 2;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      done();
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 值可以为一个数组', ( done ) => {
    let result, result2, result3;
    const hu = new Hu({
      data: {
        a: 1
      },
      methods: {
        watchA: ( value, oldValue ) => result = [ value, oldValue ]
      },
      watch: {
        a: [
          'watchA',
          ( value, oldValue ) => result2 = [ value, oldValue ],
          {
            handler: ( value, oldValue ) => result3 = [ value, oldValue ]
          }
        ]
      }
    });

    hu.a = 2;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);
      expect( result2 ).is.deep.equals([ 2, 1 ]);
      expect( result3 ).is.deep.equals([ 2, 1 ]);

      done();
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 值可以为一个数组 ( Vue )', ( done ) => {
    let result, result2, result3;
    const vm = new Vue({
      data: {
        a: 1
      },
      methods: {
        watchA: ( value, oldValue ) => result = [ value, oldValue ]
      },
      watch: {
        a: [
          'watchA',
          ( value, oldValue ) => result2 = [ value, oldValue ],
          {
            handler: ( value, oldValue ) => result3 = [ value, oldValue ]
          }
        ]
      }
    });

    vm.a = 2;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);
      expect( result2 ).is.deep.equals([ 2, 1 ]);
      expect( result3 ).is.deep.equals([ 2, 1 ]);

      done();
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

  it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项可以监听对象内部值的变化', ( done ) => {
    let index1 = 0;
    let index2 = 0;
    const hu = new Hu({
      data: () => ({
        a: { b: 1, c: 2 }
      }),
      watch: {
        a: [
          () => index1++,
          {
            deep: true,
            handler: () => index2++
          }
        ]
      }
    });

    expect( index1 ).is.equals( 0 );
    expect( index2 ).is.equals( 0 );

    hu.a.b = 2;
    hu.$nextTick(() => {
      expect( index1 ).is.equals( 0 );
      expect( index2 ).is.equals( 1 );

      hu.a.b = 3;
      hu.$nextTick(() => {
        expect( index1 ).is.equals( 0 );
        expect( index2 ).is.equals( 2 );

        hu.a.c = 3;
        hu.$nextTick(() => {
          expect( index1 ).is.equals( 0 );
          expect( index2 ).is.equals( 3 );

          hu.a = 1;
          hu.$nextTick(() => {
            expect( index1 ).is.equals( 1 );
            expect( index2 ).is.equals( 4 );

            done();
          });
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项可以监听对象内部值的变化 ( Vue )', ( done ) => {
    let index1 = 0;
    let index2 = 0;
    const vm = new Vue({
      data: () => ({
        a: { b: 1, c: 2 }
      }),
      watch: {
        a: [
          () => index1++,
          {
            deep: true,
            handler: () => index2++
          }
        ]
      }
    });

    expect( index1 ).is.equals( 0 );
    expect( index2 ).is.equals( 0 );

    vm.a.b = 2;
    vm.$nextTick(() => {
      expect( index1 ).is.equals( 0 );
      expect( index2 ).is.equals( 1 );

      vm.a.b = 3;
      vm.$nextTick(() => {
        expect( index1 ).is.equals( 0 );
        expect( index2 ).is.equals( 2 );

        vm.a.c = 3;
        vm.$nextTick(() => {
          expect( index1 ).is.equals( 0 );
          expect( index2 ).is.equals( 3 );

          vm.a = 1;
          vm.$nextTick(() => {
            expect( index1 ).is.equals( 1 );
            expect( index2 ).is.equals( 4 );

            done();
          });
        });
      });
    });
  });

});