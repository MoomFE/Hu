describe( 'Hu.define - computed', () => {

  it( '计算属性未被访问时, 将不会自动运行', () => {
    let isComputedGet = false;
    const hu = new Hu({
      computed: {
        a: () => isComputedGet = true
      }
    });

    expect( isComputedGet ).is.false;

    hu.a;

    expect( isComputedGet ).is.true;
  });

  it( '计算属性未被访问时, 将不会自动运行 ( Vue )', () => {
    let isComputedGet = false;
    const vm = new Vue({
      computed: {
        a: () => isComputedGet = true
      }
    });

    expect( isComputedGet ).is.false;

    vm.a;

    expect( isComputedGet ).is.true;
  });

  it( '计算属性运行时会进行依赖收集并缓存值, 若依赖未更新, 那么再进行访问时会直接读取缓存', () => {
    let index = 0;
    const hu = new Hu({
      data: {
        a: 1,
        b: 2
      },
      computed: {
        c(){
          index++;
          return this.a + this.b;
        }
      }
    });

    expect( index ).is.equals( 0 );

    hu.c;
    expect( index ).is.equals( 1 );

    hu.c;
    expect( index ).is.equals( 1 );

    hu.c;
    expect( index ).is.equals( 1 );
  });

  it( '计算属性运行时会进行依赖收集并缓存值, 若依赖未更新, 那么再进行访问时会直接读取缓存 ( Vue )', () => {
    let index = 0;
    const vm = new Vue({
      data: {
        a: 1,
        b: 2
      },
      computed: {
        c(){
          index++;
          return this.a + this.b;
        }
      }
    });

    expect( index ).is.equals( 0 );

    vm.c;
    expect( index ).is.equals( 1 );

    vm.c;
    expect( index ).is.equals( 1 );

    vm.c;
    expect( index ).is.equals( 1 );
  });

  it( '计算属性运行时会进行依赖收集并缓存值, 若依赖更新, 那么在下次访问时会重新运行计算方法', () => {
    let index = 0;
    const hu = new Hu({
      data: {
        a: 1,
        b: 2
      },
      computed: {
        c(){
          index++;
          return this.a + this.b;
        }
      }
    });

    expect( index ).is.equals( 0 );

    hu.c;
    expect( index ).is.equals( 1 );

    hu.c;
    expect( index ).is.equals( 1 );

    hu.c;
    expect( index ).is.equals( 1 );

    hu.a = 2;
    expect( index ).is.equals( 1 );
    hu.c;
    expect( index ).is.equals( 2 );

    hu.a = 3;
    hu.b = 3;
    expect( index ).is.equals( 2 );
    hu.c;
    expect( index ).is.equals( 3 );
  });

  it( '计算属性运行时会进行依赖收集并缓存值, 若依赖更新, 那么在下次访问时会重新运行计算方法 ( Vue )', () => {
    let index = 0;
    const vm = new Vue({
      data: {
        a: 1,
        b: 2
      },
      computed: {
        c(){
          index++;
          return this.a + this.b;
        }
      }
    });

    expect( index ).is.equals( 0 );

    vm.c;
    expect( index ).is.equals( 1 );

    vm.c;
    expect( index ).is.equals( 1 );

    vm.c;
    expect( index ).is.equals( 1 );

    vm.a = 2;
    expect( index ).is.equals( 1 );
    vm.c;
    expect( index ).is.equals( 2 );

    vm.a = 3;
    vm.b = 3;
    expect( index ).is.equals( 2 );
    vm.c;
    expect( index ).is.equals( 3 );
  });

  it( '计算属性不会对非观察者对象收集依赖', () => {
    let index = 0;
    const hu = new Hu({
      data: {
        a: 1
      },
      computed: {
        b(){
          return index + this.a;
        }
      }
    });

    expect( hu.b ).is.equals( 1 );

    hu.a++;
    expect( hu.b ).is.equals( 2 );
    
    hu.a++;
    expect( hu.b ).is.equals( 3 );

    index++;
    expect( hu.b ).is.equals( 3 );

    index++;
    expect( hu.b ).is.equals( 3 );

    hu.a++;
    expect( hu.b ).is.equals( 6 );
  });

  it( '计算属性不会对非观察者对象收集依赖 ( Vue )', () => {
    let index = 0;
    const vm = new Vue({
      data: {
        a: 1
      },
      computed: {
        b(){
          return index + this.a;
        }
      }
    });

    expect( vm.b ).is.equals( 1 );

    vm.a++;
    expect( vm.b ).is.equals( 2 );
    
    vm.a++;
    expect( vm.b ).is.equals( 3 );

    index++;
    expect( vm.b ).is.equals( 3 );

    index++;
    expect( vm.b ).is.equals( 3 );

    vm.a++;
    expect( vm.b ).is.equals( 6 );
  });

  it( '计算属性每次运行时都会进行依赖收集, 只会响应最新的依赖', () => {
    let index = 0;
    const hu = new Hu({
      data: {
        a: 2,
        b: 4
      },
      computed: {
        c(){
          return index++ ? this.b : this.a;
        }
      }
    });

    expect( index ).is.equals( 0 );

    // 目前依赖在 a
    expect( hu.c ).is.equals( 2 );
    expect( index ).is.equals( 1 );

    expect( hu.c ).is.equals( 2 );
    expect( index ).is.equals( 1 );

    hu.a = 3;
    expect( index ).is.equals( 1 );
    // 依赖被改为 b
    expect( hu.c ).is.equals( 4 );
    expect( index ).is.equals( 2 );

    hu.a = 5;
    expect( index ).is.equals( 2 );
    expect( hu.c ).is.equals( 4 );
    expect( index ).is.equals( 2 );

    hu.b = 6;
    expect( index ).is.equals( 2 );
    expect( hu.c ).is.equals( 6 );
    expect( index ).is.equals( 3 );
  });

  it( '计算属性每次运行时都会进行依赖收集, 只会响应最新的依赖 ( Vue )', () => {
    let index = 0;
    const vm = new Vue({
      data: {
        a: 2,
        b: 4
      },
      computed: {
        c(){
          return index++ ? this.b : this.a;
        }
      }
    });

    expect( index ).is.equals( 0 );

    // 目前依赖在 a
    expect( vm.c ).is.equals( 2 );
    expect( index ).is.equals( 1 );

    expect( vm.c ).is.equals( 2 );
    expect( index ).is.equals( 1 );

    vm.a = 3;
    expect( index ).is.equals( 1 );
    // 依赖被改为 b
    expect( vm.c ).is.equals( 4 );
    expect( index ).is.equals( 2 );

    vm.a = 5;
    expect( index ).is.equals( 2 );
    expect( vm.c ).is.equals( 4 );
    expect( index ).is.equals( 2 );

    vm.b = 6;
    expect( index ).is.equals( 2 );
    expect( vm.c ).is.equals( 6 );
    expect( index ).is.equals( 3 );
  });

  it( '计算属性被监听方法依赖时, 当计算属性的依赖被更新, 计算属性会重新运行计算方法', ( done ) => {
    let result;
    let index = 0;
    const hu = new Hu({
      data: {
        a: 1,
        b: 2
      },
      computed: {
        c(){
          index++;
          return this.a + this.b;
        }
      },
      watch: {
        c: ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    expect( index ).is.equals( 1 );
    expect( result ).is.undefined;

    hu.a = 2;
    expect( index ).is.equals( 1 );
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( index ).is.equals( 2 );
      expect( result ).is.deep.equals([ 4, 3 ]);

      hu.a = 3;
      hu.b = 4;
      expect( index ).is.equals( 2 );
      expect( result ).is.deep.equals([ 4, 3 ]);
      hu.$nextTick(() => {
        expect( index ).is.equals( 3 );
        expect( result ).is.deep.equals([ 7, 4 ]);

        done();
      });
    });
  });

  it( '计算属性被监听方法依赖时, 当计算属性的依赖被更新, 计算属性会重新运行计算方法 ( Vue )', ( done ) => {
    let result;
    let index = 0;
    const vm = new Vue({
      data: {
        a: 1,
        b: 2
      },
      computed: {
        c(){
          index++;
          return this.a + this.b;
        }
      },
      watch: {
        c: ( value, oldValue ) => result = [ value, oldValue ]
      }
    });

    expect( index ).is.equals( 1 );
    expect( result ).is.undefined;

    vm.a = 2;
    expect( index ).is.equals( 1 );
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( index ).is.equals( 2 );
      expect( result ).is.deep.equals([ 4, 3 ]);

      vm.a = 3;
      vm.b = 4;
      expect( index ).is.equals( 2 );
      expect( result ).is.deep.equals([ 4, 3 ]);
      vm.$nextTick(() => {
        expect( index ).is.equals( 3 );
        expect( result ).is.deep.equals([ 7, 4 ]);

        done();
      });
    });
  });

  it( '计算属性被监听方法依赖时, 当计算属性的依赖被更新后又被读取, 那么在下一 tick 计算属性不会再运行', ( done ) => {
    let index = 0;
    const hu = new Hu({
      data: {
        a: 1,
        b: 2
      },
      computed: {
        c(){
          index++;
          return this.a + this.b;
        }
      },
      watch: {
        c: {
          immediate: true,
          handler: () => {}
        }
      }
    });

    // 计算属性被监听属性初始化
    expect( index ).is.equals( 1 );

    // 再次访问计算属性是读取的缓存
    expect( hu.c ).is.equals( 3 );
    expect( index ).is.equals( 1 );

    // 更新计算属性的依赖
    // 此时计算属性还未更新
    hu.a = 2;
    expect( index ).is.equals( 1 );

    // 读取计算属性, 计算属性已更新
    expect( hu.c ).is.equals( 4 );
    expect( index ).is.equals( 2 );
    hu.$nextTick(() => {
      expect( hu.c ).is.equals( 4 );
      expect( index ).is.equals( 2 );

      done();
    });
  });
  
  it( '计算属性被监听方法依赖时, 当计算属性的依赖被更新后又被读取, 那么在下一 tick 计算属性不会再运行 ( Vue )', ( done ) => {
    let index = 0;
    const vm = new Vue({
      data: {
        a: 1,
        b: 2
      },
      computed: {
        c(){
          index++;
          return this.a + this.b;
        }
      },
      watch: {
        c: {
          immediate: true,
          handler: () => {}
        }
      }
    });

    // 计算属性被监听属性初始化
    expect( index ).is.equals( 1 );

    // 再次访问计算属性是读取的缓存
    expect( vm.c ).is.equals( 3 );
    expect( index ).is.equals( 1 );

    // 更新计算属性的依赖
    // 此时计算属性还未更新
    vm.a = 2;
    expect( index ).is.equals( 1 );

    // 读取计算属性, 计算属性已更新
    expect( vm.c ).is.equals( 4 );
    expect( index ).is.equals( 2 );
    vm.$nextTick(() => {
      expect( vm.c ).is.equals( 4 );
      expect( index ).is.equals( 2 );

      done();
    });
  });

  it( '计算属性被监听方法依赖时, 当计算属性的依赖被更新, 计算属性会重新运行计算方法, 监听方法会异步调用', ( done ) => {
    let result;
    let index = 0;
    const hu = new Hu({
      data: {
        a: 1,
        b: 2
      },
      computed: {
        c(){
          index++;
          return this.a + this.b;
        }
      },
      watch: {
        c: {
          immediate: true,
          handler: ( value, oldValue ) => result = [ value, oldValue ]
        }
      }
    });

    // 计算属性被监听属性初始化
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 3, undefined ]);

    // 再次访问计算属性是读取的缓存
    expect( hu.c ).is.equals( 3 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 3, undefined ]);

    // 更新计算属性的依赖
    // 此时计算属性还未更新
    hu.a = 2;
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 3, undefined ]);

    // 读取计算属性
    // 计算属性已更新, 但是监听属性还未触发
    expect( hu.c ).is.equals( 4 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 3, undefined ]);

    // 在下一 tick, 监听属性被触发
    hu.$nextTick(() => {
      expect( hu.c ).is.equals( 4 );
      expect( index ).is.equals( 2 );
      expect( result ).is.deep.equals([ 4, 3 ]);

      done();
    });
  });

  it( '计算属性被监听方法依赖时, 当计算属性的依赖被更新, 计算属性会重新运行计算方法, 监听方法会异步调用 ( Vue )', ( done ) => {
    let result;
    let index = 0;
    const vm = new Vue({
      data: {
        a: 1,
        b: 2
      },
      computed: {
        c(){
          index++;
          return this.a + this.b;
        }
      },
      watch: {
        c: {
          immediate: true,
          handler: ( value, oldValue ) => result = [ value, oldValue ]
        }
      }
    });

    // 计算属性被监听属性初始化
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 3, undefined ]);

    // 再次访问计算属性是读取的缓存
    expect( vm.c ).is.equals( 3 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 3, undefined ]);

    // 更新计算属性的依赖
    // 此时计算属性还未更新
    vm.a = 2;
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 3, undefined ]);

    // 读取计算属性
    // 计算属性已更新, 但是监听属性还未触发
    expect( vm.c ).is.equals( 4 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 3, undefined ]);

    // 在下一 tick, 监听属性被触发
    vm.$nextTick(() => {
      expect( vm.c ).is.equals( 4 );
      expect( index ).is.equals( 2 );
      expect( result ).is.deep.equals([ 4, 3 ]);

      done();
    });
  });

  it( '计算属性的计算可以依赖于另一个计算属性', () => {
    const hu = new Hu({
      data: {
        a: 1
      },
      computed: {
        b(){ return this.a * 2 },
        c(){ return this.b * 2 },
        d(){ return this.c * 2 },
        e(){ return this.d * 2 },
        f(){ return this.e * 2 },
        g(){ return this.f * 2 }
      }
    });

    expect( hu.g ).to.equals( 64 );
    expect( hu.f ).to.equals( 32 );
    expect( hu.e ).to.equals( 16 );
    expect( hu.d ).to.equals( 8 );
    expect( hu.c ).to.equals( 4 );
    expect( hu.b ).to.equals( 2 );
    expect( hu.a ).to.equals( 1 );

    hu.a = 2;

    expect( hu.g ).to.equals( 128 );
    expect( hu.f ).to.equals( 64 );
    expect( hu.e ).to.equals( 32 );
    expect( hu.d ).to.equals( 16 );
    expect( hu.c ).to.equals( 8 );
    expect( hu.b ).to.equals( 4 );
    expect( hu.a ).to.equals( 2 );
  });

  it( '计算属性的计算可以依赖于另一个计算属性 ( Vue )', () => {
    const vm = new Vue({
      data: {
        a: 1
      },
      computed: {
        b(){ return this.a * 2 },
        c(){ return this.b * 2 },
        d(){ return this.c * 2 },
        e(){ return this.d * 2 },
        f(){ return this.e * 2 },
        g(){ return this.f * 2 }
      }
    });

    expect( vm.g ).to.equals( 64 );
    expect( vm.f ).to.equals( 32 );
    expect( vm.e ).to.equals( 16 );
    expect( vm.d ).to.equals( 8 );
    expect( vm.c ).to.equals( 4 );
    expect( vm.b ).to.equals( 2 );
    expect( vm.a ).to.equals( 1 );

    vm.a = 2;

    expect( vm.g ).to.equals( 128 );
    expect( vm.f ).to.equals( 64 );
    expect( vm.e ).to.equals( 32 );
    expect( vm.d ).to.equals( 16 );
    expect( vm.c ).to.equals( 8 );
    expect( vm.b ).to.equals( 4 );
    expect( vm.a ).to.equals( 2 );
  });

  it( '计算属性的计算可以依赖于另一个计算属性 ( 二 )', () => {
    let result;
    const hu = new Hu({
      data: {
        a: 1
      },
      computed: {
        b(){ return this.a * 2 },
        c(){ return this.b * 2 },
        d(){ return this.c * 2 },
        e(){ return this.d * 2 },
        f(){ return this.e * 2 },
        g(){ return this.f * 2 }
      },
      watch: {
        g: {
          immediate: true,
          handler: ( value, oldValue ) => result = [ value, oldValue ]
        }
      }
    });

    expect( result ).is.deep.equals([ 64, undefined ]);

    hu.a = 2;
    expect( result ).is.deep.equals([ 64, undefined ]);
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 128, 64 ]);
    });
  });

  it( '计算属性的计算可以依赖于另一个计算属性 ( 二 ) ( Vue )', () => {
    let result;
    const vm = new Vue({
      data: {
        a: 1
      },
      computed: {
        b(){ return this.a * 2 },
        c(){ return this.b * 2 },
        d(){ return this.c * 2 },
        e(){ return this.d * 2 },
        f(){ return this.e * 2 },
        g(){ return this.f * 2 }
      },
      watch: {
        g: {
          immediate: true,
          handler: ( value, oldValue ) => result = [ value, oldValue ]
        }
      }
    });

    expect( result ).is.deep.equals([ 64, undefined ]);

    vm.a = 2;
    expect( result ).is.deep.equals([ 64, undefined ]);
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 128, 64 ]);
    });
  });

  it( '计算属性可以传入一个对象, 包含了当前计算属性的 setter 与 getter 方法', () => {
    const hu = new Hu({
      data: {
        a: 1
      },
      computed: {
        b: {
          get(){
            return this.a * 2
          },
          set( value ){
            this.a = value;
          }
        }
      }
    });

    expect( hu.b ).is.equals( 2 );

    hu.b = 2;

    expect( hu.b ).is.equals( 4 );
  });

  it( '计算属性可以传入一个对象, 包含了当前计算属性的 setter 与 getter 方法 ( Vue )', () => {
    const vm = new Vue({
      data: {
        a: 1
      },
      computed: {
        b: {
          get(){
            return this.a * 2
          },
          set( value ){
            this.a = value;
          }
        }
      }
    });

    expect( vm.b ).is.equals( 2 );

    vm.b = 2;

    expect( vm.b ).is.equals( 4 );
  });

  it( '计算属性在计算时需要遍历对象时, 若对象内部元素被更改, 计算属性也会触发 ( for ... in )', () => {
    const hu = new Hu({
      data: {
        json: {}
      },
      computed: {
        a(){
          const json = {};
          for( const name in this.json ){
            json[ name ] = this.json[ name ];
          }
          return json;
        }
      },
      watch: {
        a(){}
      }
    });

    expect( hu.a ).is.deep.equals({});

    hu.json.aaa = 1;
    hu.json.bbb = 2;

    expect( hu.a ).is.deep.equals({
      aaa: 1,
      bbb: 2
    });

    const ccc = Symbol('ccc');

    hu.json[ ccc ] = 3;

    expect( hu.a ).is.deep.equals({
      aaa: 1,
      bbb: 2,
      [ ccc ]: 3
    });
  });

  it( '计算属性在计算时需要遍历对象时, 若对象内部元素被更改, 计算属性也会触发 ( Reflect.ownKeys )', () => {
    const hu = new Hu({
      data: {
        json: {}
      },
      computed: {
        a(){
          const json = {};
          for( const name of Reflect.ownKeys( this.json ) ){
            json[ name ] = this.json[ name ];
          }
          return json;
        }
      },
      watch: {
        a(){}
      }
    });

    expect( hu.a ).is.deep.equals({});

    hu.json.aaa = 1;
    hu.json.bbb = 2;

    expect( hu.a ).is.deep.equals({
      aaa: 1,
      bbb: 2
    });

    const ccc = Symbol('ccc');

    hu.json[ ccc ] = 3;

    expect( hu.a ).is.deep.equals({
      aaa: 1,
      bbb: 2,
      [ ccc ]: 3
    });
  });

  it( '计算属性在计算时需要遍历对象时, 若对象内部元素被更改, 计算属性也会触发 ( Object.keys )', () => {
    const hu = new Hu({
      data: {
        json: {}
      },
      computed: {
        a(){
          const json = {};
          for( const name of Object.keys( this.json ) ){
            json[ name ] = this.json[ name ];
          }
          return json;
        }
      },
      watch: {
        a(){}
      }
    });

    expect( hu.a ).is.deep.equals({});

    hu.json.aaa = 1;
    hu.json.bbb = 2;

    expect( hu.a ).is.deep.equals({
      aaa: 1,
      bbb: 2
    });

    const ccc = Symbol('ccc');

    hu.json[ ccc ] = 3;

    expect( hu.a ).is.deep.equals({
      aaa: 1,
      bbb: 2,
      [ ccc ]: 3
    });
  });

  it( '计算属性在计算时需要遍历对象时, 若对象内部元素被更改, 计算属性也会触发 ( Object.values )', () => {
    const hu = new Hu({
      data: {
        json: {}
      },
      computed: {
        a(){
          const arr = [];
          for( const value of Object.values( this.json ) ){
            arr.push( value );
          }
          return arr;
        }
      },
      watch: {
        a(){}
      }
    });

    expect( hu.a ).is.deep.equals([]);

    hu.json.aaa = 1;
    hu.json.bbb = 2;

    expect( hu.a ).is.deep.equals([ 1, 2 ]);

    const ccc = Symbol('ccc');

    hu.json[ ccc ] = 3;

    expect( hu.a ).is.deep.equals([ 1, 2 ]);
  });

  it( '计算属性在计算时需要遍历对象时, 若对象内部元素被更改, 计算属性也会触发 ( Object.entries )', () => {
    const hu = new Hu({
      data: {
        json: {}
      },
      computed: {
        a(){
          const json = {};
          for( const [ name, value ] of Object.entries( this.json ) ){
            json[ name ] = value;
          }
          return json;
        }
      },
      watch: {
        a(){}
      }
    });

    expect( hu.a ).is.deep.equals({});

    hu.json.aaa = 1;
    hu.json.bbb = 2;

    expect( hu.a ).is.deep.equals({
      aaa: 1,
      bbb: 2
    });

    const ccc = Symbol('ccc');

    hu.json[ ccc ] = 3;

    expect( hu.a ).is.deep.equals({
      aaa: 1,
      bbb: 2
    });
  });

  it( '计算属性在计算时需要遍历对象时, 若对象内部元素被更改, 计算属性也会触发 ( Object.getOwnPropertyNames )', () => {
    const hu = new Hu({
      data: {
        json: {}
      },
      computed: {
        a(){
          const json = {};
          for( const name of Object.getOwnPropertyNames( this.json ) ){
            json[ name ] = this.json[ name ];
          }
          return json;
        }
      },
      watch: {
        a(){}
      }
    });

    expect( hu.a ).is.deep.equals({});

    hu.json.aaa = 1;
    hu.json.bbb = 2;

    expect( hu.a ).is.deep.equals({
      aaa: 1,
      bbb: 2
    });

    const ccc = Symbol('ccc');

    hu.json[ ccc ] = 3;

    expect( hu.a ).is.deep.equals({
      aaa: 1,
      bbb: 2
    });
  });

  it( '计算属性在计算时需要遍历对象时, 若对象内部元素被更改, 计算属性也会触发 ( Object.getOwnPropertySymbols )', () => {
    const hu = new Hu({
      data: {
        json: {}
      },
      computed: {
        a(){
          const json = {};
          for( const name of Object.getOwnPropertySymbols( this.json ) ){
            json[ name ] = this.json[ name ];
          }
          return json;
        }
      },
      watch: {
        a(){}
      }
    });

    expect( hu.a ).is.deep.equals({});

    hu.json.aaa = 1;
    hu.json.bbb = 2;

    expect( hu.a ).is.deep.equals({});

    const ccc = Symbol('ccc');

    hu.json[ ccc ] = 3;

    expect( hu.a ).is.deep.equals({
      [ ccc ]: 3
    });
  });

  it( '计算属性在计算时需要遍历数组时, 若数组内部元素被更改, 计算属性也会触发 ( for ... in )', () => {
    const hu = new Hu({
      data: {
        arr: []
      },
      computed: {
        a(){
          const arr = [];
          for( const index in this.arr ){
            arr.push(
              this.arr[ index ]
            );
          }
          return arr;
        }
      }
    });

    expect( hu.a ).is.deep.equals([]);

    hu.arr.push( 2 );

    expect( hu.a ).is.deep.equals([ 2 ]);
    
    hu.arr.push( 3 );

    expect( hu.a ).is.deep.equals([ 2, 3 ]);
  });

  it( '计算属性在计算时需要遍历数组时, 若数组内部元素被更改, 计算属性也会触发 ( for ... of )', () => {
    const hu = new Hu({
      data: {
        arr: []
      },
      computed: {
        a(){
          const arr = [];
          for( const item of this.arr ){
            arr.push( item );
          }
          return arr;
        }
      }
    });

    expect( hu.a ).is.deep.equals([]);

    hu.arr.push( 2 );

    expect( hu.a ).is.deep.equals([ 2 ]);
    
    hu.arr.push( 3 );

    expect( hu.a ).is.deep.equals([ 2, 3 ]);
  });

  it( '计算属性在计算时需要遍历数组时, 若数组内部元素被更改, 计算属性也会触发 ( Array.prototype.forEach )', () => {
    const hu = new Hu({
      data: {
        arr: []
      },
      computed: {
        a(){
          const arr = [];
          this.arr.forEach( item => {
            arr.push( item );
          });
          return arr;
        }
      }
    });

    expect( hu.a ).is.deep.equals([]);

    hu.arr.push( 2 );

    expect( hu.a ).is.deep.equals([ 2 ]);
    
    hu.arr.push( 3 );

    expect( hu.a ).is.deep.equals([ 2, 3 ]);
  });

  it( '计算属性的返回值如果是支持的可转为观察者对象的格式类型, 那么会被转为观察者对象', ( done ) => {
    let index = 0;
    const hu = new Hu({
      computed: {
        a: () => ({ aaa: 1 })
      },
      watch: {
        a: {
          deep: true,
          handler(){ index++ }
        }
      }
    });

    expect( index ).is.equals( 0 );

    hu.a.aaa = 2;
    expect( index ).is.equals( 0 );
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );

      done();
    });
  });

  it( '计算属性的返回值如果是支持的可转为观察者对象的格式类型, 那么会被转为观察者对象 ( Vue ) ( 不一致 )', ( done ) => {
    let index = 0;
    const vm = new Vue({
      computed: {
        a: () => ({ aaa: 1 })
      },
      watch: {
        a: {
          deep: true,
          handler(){ index++ }
        }
      }
    });

    expect( index ).is.equals( 0 );

    vm.a.aaa = 2;
    expect( index ).is.equals( 0 );
    vm.$nextTick(() => {
      expect( index ).is.equals( 0 );

      done();
    });
  });

  it( '计算属性的返回值如果是支持的可转为观察者对象的格式类型, 那么会被转为观察者对象 ( 二 )', ( done ) => {
    let index = 0;
    const hu = new Hu({
      computed: {
        a: () => [ 1 ]
      },
      watch: {
        a: {
          deep: true,
          handler(){ index++ }
        }
      }
    });

    expect( index ).is.equals( 0 );

    hu.a[ 0 ] = 2;
    expect( index ).is.equals( 0 );
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );

      done();
    });
  });

  it( '计算属性的返回值如果是支持的可转为观察者对象的格式类型, 那么会被转为观察者对象 ( 二 ) ( Vue ) ( 不一致 )', ( done ) => {
    let index = 0;
    const vm = new Vue({
      computed: {
        a: () => [ 1 ]
      },
      watch: {
        a: {
          deep: true,
          handler(){ index++ }
        }
      }
    });

    expect( index ).is.equals( 0 );

    Vue.set( vm.a, 0, 2 );
    expect( index ).is.equals( 0 );
    vm.$nextTick(() => {
      expect( index ).is.equals( 0 );

      done();
    });
  });

  it( '计算属性的首个参数会是当前实例对象', () => {
    let index = 0;
    const hu = new Hu({
      computed: {
        a( hu ){
          index++;
          expect( hu ).is.equals( this );
        }
      }
    });

    hu.a;
    expect( index ).is.equals( 1 );
  });

  it( '计算属性的首个参数会是当前实例对象 ( Vue )', () => {
    let index = 0;
    const vm = new Vue({
      computed: {
        a( hu ){
          index++;
          expect( hu ).is.equals( this );
        }
      }
    });

    vm.a;
    expect( index ).is.equals( 1 );
  });


});