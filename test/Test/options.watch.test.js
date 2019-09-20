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

  it( '使用 watch 对实例内的属性进行监听, 触发的回调函数的 this 指向的是当前实例', () => {
    let result;
    const hu = new Hu({
      watch: {
        $data: {
          immediate: true,
          handler(){
            result = this;
          }
        }
      }
    });

    // 确保 expect 一定执行过
    expect( result ).is.deep.equals( hu );
  });

  it( '使用 watch 对实例内的属性进行监听, 触发的回调函数的 this 指向的是当前实例 ( Vue )', () => {
    let result;
    const vm = new Vue({
      watch: {
        $data: {
          immediate: true,
          handler(){
            result = this;
          }
        }
      }
    });

    // 确保 expect 一定执行过
    expect( result ).is.deep.equals( vm );
  });

  it( '使用 watch 对实例内的属性进行监听, 使用字符串的键对一个对象内部属性进行监听', ( done ) => {
    let result;
    let index = 0;
    const hu = new Hu({
      data: () => ({
        a: {
          b: 2,
          c: 3
        }
      }),
      watch: {
        'a.b': ( value, oldValue ) => {
          index++;
          result = [ value, oldValue ];
        }
      }
    });

    hu.a.b = 3;
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( result ).is.deep.equals([ 3, 2 ]);

      hu.a.b = 4;
      hu.$nextTick(() => {
        expect( index ).is.equals( 2 );
        expect( result ).is.deep.equals([ 4, 3 ]);

        hu.a.c = 5;
        hu.$nextTick(() => {
          expect( index ).is.equals( 2 );
          expect( result ).is.deep.equals([ 4, 3 ]);

          done();
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 使用字符串的键对一个对象内部属性进行监听 ( Vue )', ( done ) => {
    let result;
    let index = 0;
    const vm = new Vue({
      data: () => ({
        a: {
          b: 2,
          c: 3
        }
      }),
      watch: {
        'a.b': ( value, oldValue ) => {
          index++;
          result = [ value, oldValue ];
        }
      }
    });

    vm.a.b = 3;
    vm.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( result ).is.deep.equals([ 3, 2 ]);

      vm.a.b = 4;
      vm.$nextTick(() => {
        expect( index ).is.equals( 2 );
        expect( result ).is.deep.equals([ 4, 3 ]);

        vm.a.c = 5;
        vm.$nextTick(() => {
          expect( index ).is.equals( 2 );
          expect( result ).is.deep.equals([ 4, 3 ]);

          done();
        });
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

  it( '使用 watch 对实例内的属性进行监听, 对 String 类型进行监听', ( done ) => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: 'a'
      }),
      watch: {
        a: ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    expect( result ).is.undefined;

    hu.a = 'b';
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 'b', 'a' ]);

      hu.a = 'c';
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 'c', 'b' ]);

        done();
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对 String 类型进行监听 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: 'a'
      }),
      watch: {
        a: ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    expect( result ).is.undefined;

    vm.a = 'b';
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 'b', 'a' ]);

      vm.a = 'c';
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 'c', 'b' ]);

        done();
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对 Number 类型进行监听', ( done ) => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: 1
      }),
      watch: {
        a: ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    expect( result ).is.undefined;

    hu.a = 2;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      hu.a = 3;
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 3, 2 ]);

        done();
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对 Number 类型进行监听 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: 1
      }),
      watch: {
        a: ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    expect( result ).is.undefined;

    vm.a = 2;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      vm.a = 3;
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 3, 2 ]);

        done();
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对 Function 类型进行监听', ( done ) => {
    let result;
    const fn1 = () => {};
    const fn2 = () => {};
    const fn3 = () => {};
    const hu = new Hu({
      data: () => ({
        a: fn1
      }),
      watch: {
        a: ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    expect( result ).is.undefined;

    hu.a = fn2;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ fn2, fn1 ]);

      hu.a = fn3;
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ fn3, fn2 ]);

        done();
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对 Function 类型进行监听 ( Vue )', ( done ) => {
    let result;
    const fn1 = () => {};
    const fn2 = () => {};
    const fn3 = () => {};
    const vm = new Vue({
      data: () => ({
        a: fn1
      }),
      watch: {
        a: ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    expect( result ).is.undefined;

    vm.a = fn2;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ fn2, fn1 ]);

      vm.a = fn3;
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ fn3, fn2 ]);

        done();
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对 Object 类型进行监听', ( done ) => {
    let result;
    const obj1 = [];
    const obj2 = [];
    const obj3 = {};
    const obj4 = {};
    const hu = new Hu({
      data: () => ({
        a: obj1
      }),
      watch: {
        a: ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    expect( result ).is.undefined;

    hu.a = obj2;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ obj2, obj1 ]);

      hu.a = obj3;
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ obj3, obj2 ]);

        hu.a = obj4;
        hu.$nextTick(() => {
          expect( result ).is.deep.equals([ obj4, obj3 ]);

          done();
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对 Object 类型进行监听 ( Vue )', ( done ) => {
    let result;
    const obj1 = [];
    const obj2 = [];
    const obj3 = {};
    const obj4 = {};
    const vm = new Vue({
      data: () => ({
        a: obj1
      }),
      watch: {
        a: ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    expect( result ).is.undefined;

    vm.a = obj2;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ obj2, obj1 ]);

      vm.a = obj3;
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ obj3, obj2 ]);

        vm.a = obj4;
        vm.$nextTick(() => {
          expect( result ).is.deep.equals([ obj4, obj3 ]);

          done();
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对 Symbol 类型进行监听', ( done ) => {
    let result;
    const smb1 = Symbol('1');
    const smb2 = Symbol('2');
    const smb3 = Symbol('3');
    const hu = new Hu({
      data: () => ({
        a: smb1
      }),
      watch: {
        a: ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    expect( result ).is.undefined;

    hu.a = smb2;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ smb2, smb1 ]);

      hu.a = smb3;
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ smb3, smb2 ]);

        done();
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对 Symbol 类型进行监听 ( Vue )', ( done ) => {
    let result;
    const smb1 = Symbol('1');
    const smb2 = Symbol('2');
    const smb3 = Symbol('3');
    const vm = new Vue({
      data: () => ({
        a: smb1
      }),
      watch: {
        a: ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    expect( result ).is.undefined;

    vm.a = smb2;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ smb2, smb1 ]);

      vm.a = smb3;
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ smb3, smb2 ]);

        done();
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对各种类型的切换进行监听', ( done ) => {
    const types = [
      '', ' ', 'a',
      -1, 0, 1,
      () => {}, function(){},
      [], [ 1 ], [ 1 ],
      {}, { a: 1 }, { a: 1 },
      Symbol(''), Symbol('1'), Symbol('1'),
      undefined, null
    ];
    const promises = [];

    for( let index = 0, types1 = Array.$copy( types ); index < types1.length - 1; index++ ) promises.push(
      new Promise( resolve => {

        let result;
        const hu = new Hu({
          data: () => ({
            value: types1[ index ]
          }),
          watch: {
            value: ( value, oldValue ) => result = [ value, oldValue ]
          }
        });

        expect( result ).is.undefined;

        hu.value = types1[ index + 1 ];
        hu.$nextTick(() => {
          expect( result ).is.deep.equals([
            types1[ index + 1 ],
            types1[ index ]
          ]);

          resolve();
        });

      })
    );

    for( let index = 0, types2 = Array.$copy( types ).reverse(); index < types2.length - 1; index++ ) promises.push(
      new Promise( resolve => {

        let result;
        const hu = new Hu({
          data: () => ({
            value: types2[ index ]
          }),
          watch: {
            value: ( value, oldValue ) => result = [ value, oldValue ]
          }
        });

        expect( result ).is.undefined;

        hu.value = types2[ index + 1 ];
        hu.$nextTick(() => {
          expect( result ).is.deep.equals([
            types2[ index + 1 ],
            types2[ index ]
          ]);

          resolve();
        });

      })
    );

    Promise.all( promises ).then(() => {
      done();
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对各种类型的切换进行监听 ( Vue )', ( done ) => {
    const types = [
      '', ' ', 'a',
      -1, 0, 1,
      () => {}, function(){},
      [], [ 1 ], [ 1 ],
      {}, { a: 1 }, { a: 1 },
      Symbol(''), Symbol('1'), Symbol('1'),
      undefined, null
    ];
    const promises = [];

    for( let index = 0, types1 = Array.$copy( types ); index < types1.length - 1; index++ ) promises.push(
      new Promise( resolve => {

        let result;
        const vm = new Vue({
          data: () => ({
            value: types1[ index ]
          }),
          watch: {
            value: ( value, oldValue ) => result = [ value, oldValue ]
          }
        });

        expect( result ).is.undefined;

        vm.value = types1[ index + 1 ];
        vm.$nextTick(() => {
          expect( result ).is.deep.equals([
            types1[ index + 1 ],
            types1[ index ]
          ]);

          resolve();
        });

      })
    );

    for( let index = 0, types2 = Array.$copy( types ).reverse(); index < types2.length - 1; index++ ) promises.push(
      new Promise( resolve => {

        let result;
        const vm = new Vue({
          data: () => ({
            value: types2[ index ]
          }),
          watch: {
            value: ( value, oldValue ) => result = [ value, oldValue ]
          }
        });

        expect( result ).is.undefined;

        vm.value = types2[ index + 1 ];
        vm.$nextTick(() => {
          expect( result ).is.deep.equals([
            types2[ index + 1 ],
            types2[ index ]
          ]);

          resolve();
        });

      })
    );

    Promise.all( promises ).then(() => {
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

  it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 上层兄弟节点改变时不会触发回调', ( done ) => {
    let index = 0;
    const hu = new Hu({
      data: () => ({
        a: {
          b: { c: 1 },
          d: 2
        }
      }),
      watch: {
        'a.b': {
          deep: true,
          handler: () => index++
        }
      }
    });

    expect( index ).is.equals( 0 );

    hu.a.b.c = 2;
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );

      hu.a.b.c = 3;
      hu.$nextTick(() => {
        expect( index ).is.equals( 2 );

        hu.a.d = 3;
        hu.$nextTick(() => {
          expect( index ).is.equals( 2 );

          done();
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 上层兄弟节点改变时不会触发回调 ( Vue )', ( done ) => {
    let index = 0;
    const vm = new Vue({
      data: () => ({
        a: {
          b: { c: 1 },
          d: 2
        }
      }),
      watch: {
        'a.b': {
          deep: true,
          handler: () => index++
        }
      }
    });

    expect( index ).is.equals( 0 );

    vm.a.b.c = 2;
    vm.$nextTick(() => {
      expect( index ).is.equals( 1 );

      vm.a.b.c = 3;
      vm.$nextTick(() => {
        expect( index ).is.equals( 2 );

        vm.a.d = 3;
        vm.$nextTick(() => {
          expect( index ).is.equals( 2 );

          done();
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 子级 Object 对象节点内部改变时不会触发回调', ( done ) => {
    let index = 0;
    const hu = new Hu({
      data: () => ({
        a: {
          b: { c: 1 },
          d: 2
        }
      }),
      watch: {
        a: {
          deep: true,
          handler: () => index++
        }
      }
    });

    expect( index ).is.equals( 0 );

    hu.a.d = 3;
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );

      hu.a.b.c = 2;
      hu.$nextTick(() => {
        expect( index ).is.equals( 1 );

        hu.a.b.c = 3;
        hu.$nextTick(() => {
          expect( index ).is.equals( 1 );

          done();
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 子级 Object 对象节点内部改变时不会触发回调 ( Vue ) ( 不一致 )', ( done ) => {
    let index = 0;
    const vm = new Vue({
      data: () => ({
        a: {
          b: { c: 1 },
          d: 2
        }
      }),
      watch: {
        a: {
          deep: true,
          handler: () => index++
        }
      }
    });

    expect( index ).is.equals( 0 );

    vm.a.d = 3;
    vm.$nextTick(() => {
      expect( index ).is.equals( 1 );

      vm.a.b.c = 2;
      vm.$nextTick(() => {
        expect( index ).is.equals( 2 );

        vm.a.b.c = 3;
        vm.$nextTick(() => {
          expect( index ).is.equals( 3 );

          done();
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 子级 Array 对象节点内部改变时不会触发回调', ( done ) => {
    let index = 0;
    const hu = new Hu({
      data: () => ({
        a: {
          b: [
            1
          ],
          d: 2
        }
      }),
      watch: {
        a: {
          deep: true,
          handler: () => index++
        }
      }
    });

    expect( index ).is.equals( 0 );

    hu.a.d = 3;
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );

      hu.a.b.splice( 0, 1, 2 );
      hu.$nextTick(() => {
        expect( index ).is.equals( 1 );

        hu.a.b.splice( 0, 1, 3 );
        hu.$nextTick(() => {
          expect( index ).is.equals( 1 );

          done();
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 子级 Array 对象节点内部改变时不会触发回调 ( Vue ) ( 不一致 )', ( done ) => {
    let index = 0;
    const vm = new Vue({
      data: () => ({
        a: {
          b: [
            1
          ],
          d: 2
        }
      }),
      watch: {
        a: {
          deep: true,
          handler: () => index++
        }
      }
    });

    expect( index ).is.equals( 0 );

    vm.a.d = 3;
    vm.$nextTick(() => {
      expect( index ).is.equals( 1 );

      vm.a.b.splice( 0, 1, 2 );
      vm.$nextTick(() => {
        expect( index ).is.equals( 2 );

        vm.a.b.splice( 0, 1, 3 );
        vm.$nextTick(() => {
          expect( index ).is.equals( 3 );

          done();
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 值被删除时也会触发回调', ( done ) => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: {
          b: 1
        }
      }),
      watch: {
        'a.b': ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    hu.a.b = 2;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      hu.a.b = 3;
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 3, 2 ]);

        delete hu.a.b;
        hu.$nextTick(() => {
          expect( result ).is.deep.equals([ undefined, 3 ]);
          done();
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 值被删除时也会触发回调 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: {
          b: 1
        }
      }),
      watch: {
        'a.b': ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    vm.a.b = 2;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      vm.a.b = 3;
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 3, 2 ]);

        Vue.delete( vm.a, 'b' );
        vm.$nextTick(() => {
          expect( result ).is.deep.equals([ undefined, 3 ]);
          done();
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对数组使用 length = num 的方式删除值后也会触发回调', ( done ) => {
    let index = 0;
    const hu = new Hu({
      data: () => ({
        arr: [ 1, 2, 3 ]
      }),
      watch: {
        arr: {
          deep: true,
          handler: ( value, oldValue ) => index++
        }
      }
    });

    expect( index ).is.equals( 0 );
    expect( hu.arr ).is.deep.equals([ 1, 2, 3 ]);

    hu.arr.push( 4 );
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( hu.arr ).is.deep.equals([ 1, 2, 3, 4 ]);

      hu.arr.pop();
      hu.$nextTick(() => {
        expect( index ).is.equals( 2 );
        expect( hu.arr ).is.deep.equals([ 1, 2, 3 ]);

        hu.arr.length = 1;
        hu.$nextTick(() => {
          expect( index ).is.equals( 3 );
          expect( hu.arr ).is.deep.equals([ 1 ]);

          done();
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对数组使用 length = num 的方式删除值后也会触发回调 ( Vue ) ( 不支持 )', ( done ) => {
    let index = 0;
    const vm = new Vue({
      data: () => ({
        arr: [ 1, 2, 3 ]
      }),
      watch: {
        arr: {
          deep: true,
          handler: ( value, oldValue ) => index++
        }
      }
    });

    expect( index ).is.equals( 0 );
    expect( vm.arr ).is.deep.equals([ 1, 2, 3 ]);

    vm.arr.push( 4 );
    vm.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( vm.arr ).is.deep.equals([ 1, 2, 3, 4 ]);

      vm.arr.pop();
      vm.$nextTick(() => {
        expect( index ).is.equals( 2 );
        expect( vm.arr ).is.deep.equals([ 1, 2, 3 ]);

        Vue.set( vm.arr, 'length', 1 );
        vm.$nextTick(() => {
          expect( index ).is.equals( 2 );
          expect( vm.arr ).is.deep.equals([ 1 ]);

          done();
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对数组的 length 进行监听, 不管给 length 赋了什么类型的值, 触发回调时的应该是真实的 length', ( done ) => {
    let result;
    let index = 0;
    const hu = new Hu({
      data: () => ({
        arr: [ ]
      }),
      watch: {
        'arr.length': ( value , oldValue ) => {
          index++;
          result = [ value, oldValue ];
        }
      }
    });

    hu.arr.length = 1;
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( result ).is.deep.equals([ 1, 0 ]);

      hu.arr.length = 3;
      hu.$nextTick(() => {
        expect( index ).is.equals( 2 );
        expect( result ).is.deep.equals([ 3, 1 ]);

        hu.arr.length = '4';
        hu.$nextTick(() => {
          expect( index ).is.equals( 3 );
          expect( result ).is.deep.equals([ 4, 3 ]);

          hu.arr.length = '0';
          hu.$nextTick(() => {
            expect( index ).is.equals( 4 );
            expect( result ).is.deep.equals([ 0, 4 ]);

            done();
          });
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对数组的 length 进行监听, 不管给 length 赋了什么类型的值, 触发回调时的应该是真实的 length ( Vue ) ( 不支持 )', ( done ) => {
    let result;
    let index = 0;
    const vm = new Vue({
      data: () => ({
        arr: [ ]
      }),
      watch: {
        'arr.length': ( value , oldValue ) => {
          index++;
          result = [ value, oldValue ];
        }
      }
    });

    vm.$set( vm.arr, 'length', 1 );
    vm.$nextTick(() => {
      expect( index ).is.equals( 0 );
      expect( result ).is.undefined;

      vm.$set( vm.arr, 'length', 3 );
      vm.$nextTick(() => {
        expect( index ).is.equals( 0 );
        expect( result ).is.undefined;

        vm.$set( vm.arr, 'length', '4' );
        vm.$nextTick(() => {
          expect( index ).is.equals( 0 );
          expect( result ).is.undefined;

          vm.$set( vm.arr, 'length', '0' );
          vm.$nextTick(() => {
            expect( index ).is.equals( 0 );
            expect( result ).is.undefined;

            done();
          });
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 在触发的回调内修改监听的值会立即再触发回调', ( done ) => {
    const steps = [];
    const hu = new Hu({
      data: () => ({
        a: 1
      }),
      watch: {
        a: [
          value => {
            steps.push( 1 );
            hu.a = 3;
          },
          value => steps.push( 2 ),
          value => steps.push( 3 )
        ]
      }
    });

    hu.a = 2;
    hu.$nextTick(() => {
      expect( steps ).is.deep.equals([ 1, 1, 2, 3 ]);

      done();
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 在触发的回调内修改监听的值会立即再触发回调 ( Vue )', ( done ) => {
    const steps = [];
    const vm = new Vue({
      data: () => ({
        a: 1
      }),
      watch: {
        a: [
          value => {
            steps.push( 1 );
            vm.a = 3;
          },
          value => steps.push( 2 ),
          value => steps.push( 3 )
        ]
      }
    });

    vm.a = 2;
    vm.$nextTick(() => {
      expect( steps ).is.deep.equals([ 1, 1, 2, 3 ]);

      done();
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对数组内置方法对数组内容进行修改时也会触发回调', ( done ) => {
    let index = 0;
    const hu = new Hu({
      data: () => ({
        a: [ 1, 2 ]
      }),
      watch: {
        a: {
          deep: true,
          immediate: true,
          handler: () => index++
        }
      }
    });

    expect( hu.a ).is.deep.equals([ 1, 2 ]);
    expect( index ).is.equals( 1 );

    hu.a.push( 3 );
    hu.$nextTick(() => {
      expect( hu.a ).is.deep.equals([ 1, 2, 3 ]);
      expect( index ).is.equals( 2 );

      hu.a.pop();
      hu.$nextTick(() => {
        expect( hu.a ).is.deep.equals([ 1, 2 ]);
        expect( index ).is.equals( 3 );

        hu.a.shift();
        hu.$nextTick(() => {
          expect( hu.a ).is.deep.equals([ 2 ]);
          expect( index ).is.equals( 4 );

          hu.a.unshift( 4 );
          hu.$nextTick(() => {
            expect( hu.a ).is.deep.equals([ 4, 2 ]);
            expect( index ).is.equals( 5 );

            hu.a.splice( 1, 0, 5 );
            hu.$nextTick(() => {
              expect( hu.a ).is.deep.equals([ 4, 5, 2 ]);
              expect( index ).is.equals( 6 );

              hu.a.sort();
              hu.$nextTick(() => {
                expect( hu.a ).is.deep.equals([ 2, 4, 5 ]);
                expect( index ).is.equals( 7 );

                hu.a.reverse();
                hu.$nextTick(() => {
                  expect( hu.a ).is.deep.equals([ 5, 4, 2 ]);
                  expect( index ).is.equals( 8 );

                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  it( '使用 watch 对实例内的属性进行监听, 对数组内置方法对数组内容进行修改时也会触发回调 ( Vue ) ( 不一致 )', ( done ) => {
    let index = 0;
    const vm = new Vue({
      data: () => ({
        a: [ 1, 2 ]
      }),
      watch: {
        a: {
          immediate: true,
          handler: () => index++
        }
      }
    });

    expect( vm.a ).is.deep.equals([ 1, 2 ]);
    expect( index ).is.equals( 1 );

    vm.a.push( 3 );
    vm.$nextTick(() => {
      expect( vm.a ).is.deep.equals([ 1, 2, 3 ]);
      expect( index ).is.equals( 2 );

      vm.a.pop();
      vm.$nextTick(() => {
        expect( vm.a ).is.deep.equals([ 1, 2 ]);
        expect( index ).is.equals( 3 );

        vm.a.shift();
        vm.$nextTick(() => {
          expect( vm.a ).is.deep.equals([ 2 ]);
          expect( index ).is.equals( 4 );

          vm.a.unshift( 4 );
          vm.$nextTick(() => {
            expect( vm.a ).is.deep.equals([ 4, 2 ]);
            expect( index ).is.equals( 5 );

            vm.a.splice( 1, 0, 5 );
            vm.$nextTick(() => {
              expect( vm.a ).is.deep.equals([ 4, 5, 2 ]);
              expect( index ).is.equals( 6 );

              vm.a.sort();
              vm.$nextTick(() => {
                expect( vm.a ).is.deep.equals([ 2, 4, 5 ]);
                expect( index ).is.equals( 7 );

                vm.a.reverse();
                vm.$nextTick(() => {
                  expect( vm.a ).is.deep.equals([ 5, 4, 2 ]);
                  expect( index ).is.equals( 8 );

                  done();
                });
              });
            });
          });
        });
      });
    });
  });

});