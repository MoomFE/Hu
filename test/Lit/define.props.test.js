describe( 'Lit.define - props', () => {

  describe( '创建时未定义 prop 的类型', () => {

    it( '使用数组定义 props', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: [ 'a', 'b' ]
      });

      const div = document.createElement('div').$html(`<${ customName } b="3"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );

      should.equal( lit.a, undefined );
      should.equal( lit.b, '3' );
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, '3' );
    });

    it( '使用 JOSN 定义 props', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: null,
          b: null
        }
      });

      const div = document.createElement('div').$html(`<${ customName } b="3"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );

      should.equal( lit.a, undefined );
      should.equal( lit.b, '3' );
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, '3' );
    });

  });

  describe( '创建时定义 prop 的类型为 String', () => {

    it( '写法一', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: String,
          b: String,
          c: String
        }
      });

      const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit, 'c' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );

      should.equal( lit.a, undefined );
      should.equal( lit.b, '' );
      should.equal( lit.c, '5' );
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, '' );
      should.equal( lit.$props.c, '5' );
    });

    it( '写法二', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: { type: String },
          b: { type: String },
          c: { type: String }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit, 'c' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );

      should.equal( lit.a, undefined );
      should.equal( lit.b, '' );
      should.equal( lit.c, '5' );
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, '' );
      should.equal( lit.$props.c, '5' );
    });

    it( '写法三', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: {
            type: { from: String }
          },
          b: {
            type: { from: String }
          },
          c: {
            type: { from: String }
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit, 'c' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );

      should.equal( lit.a, undefined );
      should.equal( lit.b, '' );
      should.equal( lit.c, '5' );
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, '' );
      should.equal( lit.$props.c, '5' );
    });

  });

  describe( '创建时定义 prop 的类型为 Boolean', () => {

    it( '写法一', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: Boolean,
          b: Boolean,
          c: Boolean
        }
      });

      const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit, 'c' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );

      should.equal( lit.a, undefined );
      should.equal( lit.b, true );
      should.equal( lit.c, true );
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, true );
      should.equal( lit.$props.c, true );
    });

    it( '写法二', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: { type: Boolean },
          b: { type: Boolean },
          c: { type: Boolean }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit, 'c' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );

      should.equal( lit.a, undefined );
      should.equal( lit.b, true );
      should.equal( lit.c, true );
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, true );
      should.equal( lit.$props.c, true );
    });

    it( '写法三', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: {
            type: { from: Boolean }
          },
          b: {
            type: { from: Boolean }
          },
          c: {
            type: { from: Boolean }
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit, 'c' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );

      should.equal( lit.a, undefined );
      should.equal( lit.b, true );
      should.equal( lit.c, true );
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, true );
      should.equal( lit.$props.c, true );
    });

  });

  describe( '创建时定义 prop 的类型为 Number', () => {

    it( '写法一', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: Number,
          b: Number,
          c: Number
        }
      });

      const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit, 'c' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );

      should.equal( lit.a, undefined );
      should.equal( lit.b, 0 );
      should.equal( lit.c, 5 );
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, 0 );
      should.equal( lit.$props.c, 5 );
    });

    it( '写法二', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: { type: Number },
          b: { type: Number },
          c: { type: Number }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit, 'c' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );

      should.equal( lit.a, undefined );
      should.equal( lit.b, 0 );
      should.equal( lit.c, 5 );
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, 0 );
      should.equal( lit.$props.c, 5 );
    });

    it( '写法三', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: {
            type: { from: Number }
          },
          b: {
            type: { from: Number }
          },
          c: {
            type: { from: Number }
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit, 'c' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );

      should.equal( lit.a, undefined );
      should.equal( lit.b, 0 );
      should.equal( lit.c, 5 );
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, 0 );
      should.equal( lit.$props.c, 5 );
    });

  });

  describe( '创建时使用自定义方法转换 prop 的类型', () => {

    it( '写法一', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: value => parseInt( value ) + 1,
          b: value => parseInt( value ) + 2,
          c: value => parseInt( value ) + 3
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" b="1" c="1"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit, 'c' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );

      should.equal( lit.a, 2 );
      should.equal( lit.b, 3 );
      should.equal( lit.c, 4 );
      should.equal( lit.$props.a, 2 );
      should.equal( lit.$props.b, 3 );
      should.equal( lit.$props.c, 4 );
    });

    it( '写法二', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: { type: value => parseInt( value ) + 1 },
          b: { type: value => parseInt( value ) + 2 },
          c: { type: value => parseInt( value ) + 3 }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" b="1" c="1"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit, 'c' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );

      should.equal( lit.a, 2 );
      should.equal( lit.b, 3 );
      should.equal( lit.c, 4 );
      should.equal( lit.$props.a, 2 );
      should.equal( lit.$props.b, 3 );
      should.equal( lit.$props.c, 4 );
    });

    it( '写法三', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: {
            type: { from: value => parseInt( value ) + 1 }
          },
          b: {
            type: { from: value => parseInt( value ) + 2 }
          },
          c: {
            type: { from: value => parseInt( value ) + 3 }
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" b="1" c="1"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit, 'c' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );

      should.equal( lit.a, 2 );
      should.equal( lit.b, 3 );
      should.equal( lit.c, 4 );
      should.equal( lit.$props.a, 2 );
      should.equal( lit.$props.b, 3 );
      should.equal( lit.$props.c, 4 );
    });

  });

  describe( '创建时定义 prop 的默认值', () => {

    it( '默认值是非引用类型', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: {
            default: '123'
          },
          b: {
            default: 123
          },
          c: {
            default: false
          },
          d: {
            default: true
          },
          e: {
            default: null
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit, 'c' );
      should.has( lit, 'd' );
      should.has( lit, 'e' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );
      should.has( lit.$props, 'd' );
      should.has( lit.$props, 'e' );

      should.equal( lit.a, '123' );
      should.equal( lit.b, 123 );
      should.equal( lit.c, false );
      should.equal( lit.d, true );
      should.equal( lit.e, null );
      should.equal( lit.$props.a, '123' );
      should.equal( lit.$props.b, 123 );
      should.equal( lit.$props.c, false );
      should.equal( lit.$props.d, true );
      should.equal( lit.$props.e, null );
    });

    it( '默认值是引用类型', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: {
            default: [ 1, 2, 3 ]
          },
          b: {
            default: { a: 1, b: 2, c: 3 }
          },
          c: {
            default: /RegExp/
          },
          d: {
            default: () => [ 1, 2, 3 ]
          },
          e: {
            default: () => ({ a: 1, b: 2, c: 3 })
          },
          f: {
            default: () => /RegExp/
          },
          g: {
            default: () => ZenJS.noop
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit, 'c' );
      should.has( lit, 'd' );
      should.has( lit, 'e' );
      should.has( lit, 'f' );
      should.has( lit, 'g' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );
      should.has( lit.$props, 'd' );
      should.has( lit.$props, 'e' );
      should.has( lit.$props, 'f' );
      should.has( lit.$props, 'g' );

      Object.$equals( lit.a, undefined ).should.true;
      Object.$equals( lit.b, undefined ).should.true;
      Object.$equals( lit.c, undefined ).should.true;
      Object.$equals( lit.d, [ 1, 2, 3 ] ).should.true;
      Object.$equals( lit.e, { a: 1, b: 2, c: 3 } ).should.true;
      Object.$equals( lit.f, /RegExp/ ).should.true;
      Object.$equals( lit.g, ZenJS.noop ).should.true;
      Object.$equals( lit.$props.a, undefined ).should.true;
      Object.$equals( lit.$props.b, undefined ).should.true;
      Object.$equals( lit.$props.c, undefined ).should.true;
      Object.$equals( lit.$props.d, [ 1, 2, 3 ] ).should.true;
      Object.$equals( lit.$props.e, { a: 1, b: 2, c: 3 } ).should.true;
      Object.$equals( lit.$props.f, /RegExp/ ).should.true;
      Object.$equals( lit.$props.g, ZenJS.noop ).should.true;
    });

    it( '确保在已传入值时, 默认值不起作用', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a1:  { default: 'a1', type: String },
          a2:  { default: 'a2', type: String },
          a3:  { default: 'a3', type: String },
          a4:  { default: 'a4', type: Boolean },
          a5:  { default: 'a5', type: Boolean },
          a6:  { default: 'a6', type: Boolean },
          a7:  { default: 'a7', type: Number },
          a8:  { default: 'a8', type: Number },
          a9:  { default: 'a9', type: Number },
          b1:  { default: 'c1', type: String },
          b2:  { default: 'c2', type: String },
          b3:  { default: 'c3', type: String },
          b4:  { default: 'c4', type: Boolean },
          b5:  { default: 'c5', type: Boolean },
          b6:  { default: 'c6', type: Boolean },
          b7:  { default: 'c7', type: Number },
          b8:  { default: 'c8', type: Number },
          b9:  { default: 'c9', type: Number }
        }
      });

      const div = document.createElement('div').$html(`
        <${ customName }
          a1 a2="" a3="b3"
          a4 a5="" a6="b5"
          a7 a8="" a9="9"
        >
        </${ customName }>
      `);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a1' );
      should.has( lit, 'a2' );
      should.has( lit, 'a3' );
      should.has( lit, 'a4' );
      should.has( lit, 'a5' );
      should.has( lit, 'a6' );
      should.has( lit, 'a7' );
      should.has( lit, 'a8' );
      should.has( lit, 'a9' );
      should.has( lit, 'b1' );
      should.has( lit, 'b2' );
      should.has( lit, 'b3' );
      should.has( lit, 'b4' );
      should.has( lit, 'b5' );
      should.has( lit, 'b6' );
      should.has( lit, 'b7' );
      should.has( lit, 'b8' );
      should.has( lit, 'b9' );
      should.has( lit.$props, 'a1' );
      should.has( lit.$props, 'a2' );
      should.has( lit.$props, 'a3' );
      should.has( lit.$props, 'a4' );
      should.has( lit.$props, 'a5' );
      should.has( lit.$props, 'a6' );
      should.has( lit.$props, 'a7' );
      should.has( lit.$props, 'a8' );
      should.has( lit.$props, 'a9' );
      should.has( lit.$props, 'b1' );
      should.has( lit.$props, 'b2' );
      should.has( lit.$props, 'b3' );
      should.has( lit.$props, 'b4' );
      should.has( lit.$props, 'b5' );
      should.has( lit.$props, 'b6' );
      should.has( lit.$props, 'b7' );
      should.has( lit.$props, 'b8' );
      should.has( lit.$props, 'b9' );

      should.equal( lit.a1, '' );
      should.equal( lit.a2, '' );
      should.equal( lit.a3, 'b3' );
      should.equal( lit.a4, true );
      should.equal( lit.a5, true );
      should.equal( lit.a6, true );
      should.equal( lit.a7, 0 );
      should.equal( lit.a8, 0 );
      should.equal( lit.a9, 9 );
      should.equal( lit.b1, 'c1' );
      should.equal( lit.b2, 'c2' );
      should.equal( lit.b3, 'c3' );
      should.equal( lit.b4, 'c4' );
      should.equal( lit.b5, 'c5' );
      should.equal( lit.b6, 'c6' );
      should.equal( lit.b7, 'c7' );
      should.equal( lit.b8, 'c8' );
      should.equal( lit.b9, 'c9' );
      should.equal( lit.$props.a1, '' );
      should.equal( lit.$props.a2, '' );
      should.equal( lit.$props.a3, 'b3' );
      should.equal( lit.$props.a4, true );
      should.equal( lit.$props.a5, true );
      should.equal( lit.$props.a6, true );
      should.equal( lit.$props.a7, 0 );
      should.equal( lit.$props.a8, 0 );
      should.equal( lit.$props.a9, 9 );
      should.equal( lit.$props.b1, 'c1' );
      should.equal( lit.$props.b2, 'c2' );
      should.equal( lit.$props.b3, 'c3' );
      should.equal( lit.$props.b4, 'c4' );
      should.equal( lit.$props.b5, 'c5' );
      should.equal( lit.$props.b6, 'c6' );
      should.equal( lit.$props.b7, 'c7' );
      should.equal( lit.$props.b8, 'c8' );
      should.equal( lit.$props.b9, 'c9' );
    });

  });

  describe( '首字母不为 $ 的 prop 会在 $lit 上建立引用', () => {

    it( '首字母不为 $ 的 prop 可以在 $props 和 $lit 下找到', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: null,
          b: null
        }
      });

      const div = document.createElement('div').$html(`<${ customName } b="3"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );

      should.equal( lit.a, undefined );
      should.equal( lit.b, '3' );
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, '3' );
    });

    it( '首字母为 $ 的 prop 可以在 $props 下找到, 但是不能在 $lit 下找到', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: null,
          b: null,
          $a: null,
          $b: null
        }
      });

      const div = document.createElement('div').$html(`<${ customName } $b="3" b="4"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.notHas( lit, '$a' );
      should.notHas( lit, '$b' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, '$a' );
      should.has( lit.$props, '$b' );

      should.equal( lit.a, undefined );
      should.equal( lit.b, '4' );
      should.equal( lit.$a, undefined );
      should.equal( lit.$b, undefined );
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, '4' );
      should.equal( lit.$props.$a, undefined );
      should.equal( lit.$props.$b, '3' );
    });

  });

  describe( '设置 attr 参数来指定当前 prop 是由哪个 attribute 取值而来', () => {

    it( '不设置 attr 则将当前 prop 的名称转为以连字符号连接的小写 attr 名称', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: null,
          'aB': null,
          'a-c': null
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" a-b="2" a-c="3"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'aB' );
      should.has( lit, 'a-c' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'aB' );
      should.has( lit.$props, 'a-c' );

      should.equal( lit[ 'a' ], '1' );
      should.equal( lit[ 'aB' ], '2' );
      should.equal( lit[ 'a-c' ], '3' );
      should.equal( lit.$props[ 'a' ], '1' );
      should.equal( lit.$props[ 'aB' ], '2' );
      should.equal( lit.$props[ 'a-c' ], '3' );
    });

    it( '设置了 attr 属性则会从相应的 attribute 中取值', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: { attr: 'b' },
          b: { attr: 'a' },
          aB: { attr: 'a-c' },
          aC: { attr: 'a-b' }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" b="2" a-b="3" a-c="4"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, 'a' );
      should.has( lit, 'b' );
      should.has( lit, 'aB' );
      should.has( lit, 'aC' );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'aB' );
      should.has( lit.$props, 'aC' );

      should.equal( lit[ 'a' ], '2' );
      should.equal( lit[ 'b' ], '1' );
      should.equal( lit[ 'aB' ], '4' );
      should.equal( lit[ 'aC' ], '3' );
      should.equal( lit.$props[ 'a' ], '2' );
      should.equal( lit.$props[ 'b' ], '1' );
      should.equal( lit.$props[ 'aB' ], '4' );
      should.equal( lit.$props[ 'aC' ], '3' );
    });

  });

  describe( '使用 JSON 定义 props 时支持传入 Symbol 类型的 prop', () => {

    it( '使用默认值给 Symbol 类型的 prop 赋值', () => {
      const customName = window.customName;
      const a = Symbol('a');
      const b = Symbol('b');
      const props = {};
            props[ a ] = { default: 1 };
            props[ b ] = { default: 2 };

      Lit.define( customName, {
        props
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, a );
      should.has( lit, b );
      should.has( lit.$props, a );
      should.has( lit.$props, b );

      should.equal( lit[ a ], 1 );
      should.equal( lit[ b ], 2 );
      should.equal( lit.$props[ a ], 1 );
      should.equal( lit.$props[ b ], 2 );
    });

    it( '指定 attr 给 Symbol 类型的 prop 则会从相应的 attr 中取值', () => {
      const customName = window.customName;
      const a = Symbol('a');
      const b = Symbol('b');
      const props = {};
            props[ a ] = { attr: 'c' };
            props[ b ] = { attr: 'd' };

      Lit.define( customName, {
        props
      });

      const div = document.createElement('div').$html(`<${ customName } c="d" d="e"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, a );
      should.has( lit, b );
      should.has( lit.$props, a );
      should.has( lit.$props, b );

      should.equal( lit[ a ], 'd' );
      should.equal( lit[ b ], 'e' );
      should.equal( lit.$props[ a ], 'd' );
      should.equal( lit.$props[ b ], 'e' );
    });

  });

  describe( '更改元素的 attribute 属性值时, 会立即将改变更新到内部的值中', () => {

    it( 'prop 为非 Symbol 类型', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: null,
          aB: null,
          attr1: { attr: 'attr2' },
          attr2: { attr: 'attr1' }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" a-b="2" attr1="5" attr2="6"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.equal( lit.a, '1' );
      should.equal( lit.aB, '2' );
      should.equal( lit.attr1, '6' );
      should.equal( lit.attr2, '5' );
      should.equal( lit.$props.a, '1' );
      should.equal( lit.$props.aB, '2' );
      should.equal( lit.$props.attr1, '6' );
      should.equal( lit.$props.attr2, '5' );

      custom.setAttribute('a','2');

      should.equal( lit.a, '2' );
      should.equal( lit.aB, '2' );
      should.equal( lit.attr1, '6' );
      should.equal( lit.attr2, '5' );
      should.equal( lit.$props.a, '2' );
      should.equal( lit.$props.aB, '2' );
      should.equal( lit.$props.attr1, '6' );
      should.equal( lit.$props.attr2, '5' );

      custom.setAttribute('a-b','3');

      should.equal( lit.a, '2' );
      should.equal( lit.aB, '3' );
      should.equal( lit.attr1, '6' );
      should.equal( lit.attr2, '5' );
      should.equal( lit.$props.a, '2' );
      should.equal( lit.$props.aB, '3' );
      should.equal( lit.$props.attr1, '6' );
      should.equal( lit.$props.attr2, '5' );

      custom.setAttribute('attr1','7');
      custom.setAttribute('attr2','8');

      should.equal( lit.a, '2' );
      should.equal( lit.aB, '3' );
      should.equal( lit.attr1, '8' );
      should.equal( lit.attr2, '7' );
      should.equal( lit.$props.a, '2' );
      should.equal( lit.$props.aB, '3' );
      should.equal( lit.$props.attr1, '8' );
      should.equal( lit.$props.attr2, '7' );
    });

    it( 'prop 为 Symbol 类型', () => {
      const customName = window.customName;
      const a = Symbol('a');
      const b = Symbol('b');
      const c = Symbol('c');
      const props = {};
            props[ a ] = null;
            props[ b ] = { attr: 'a' };
            props[ c ] = { attr: 'b', type: Number };

      Lit.define( customName, {
        props
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" b="2"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, a );
      should.has( lit, b );
      should.has( lit, c );
      should.has( lit.$props, a );
      should.has( lit.$props, b );
      should.has( lit.$props, c );

      should.equal( lit[ a ], undefined );
      should.equal( lit[ b ], '1' );
      should.equal( lit[ c ], 2 );
      should.equal( lit.$props[ a ], undefined );
      should.equal( lit.$props[ b ], '1' );
      should.equal( lit.$props[ c ], 2 );

      custom.setAttribute('a','2');

      should.equal( lit[ a ], undefined );
      should.equal( lit[ b ], '2' );
      should.equal( lit[ c ], 2 );
      should.equal( lit.$props[ a ], undefined );
      should.equal( lit.$props[ b ], '2' );
      should.equal( lit.$props[ c ], 2 );

      custom.setAttribute('b','3');

      should.equal( lit[ a ], undefined );
      should.equal( lit[ b ], '2' );
      should.equal( lit[ c ], 3 );
      should.equal( lit.$props[ a ], undefined );
      should.equal( lit.$props[ b ], '2' );
      should.equal( lit.$props[ c ], 3 );
    });

    it( '多个 prop 绑定到一个 attribute 上', () => {
      const customName = window.customName;
      const a = Symbol('a');
      const props = {};
            props[ a ] = { attr: 'a' };
            props[ 'a' ] = { attr: 'a' };
            props[ 'aB' ] = { attr: 'a', type: Number };

      Lit.define( customName, {
        props
      });

      const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit, a );
      should.has( lit, 'a' );
      should.has( lit, 'aB' );
      should.has( lit.$props, a );
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'aB' );

      should.equal( lit[ a ], '1' );
      should.equal( lit[ 'a' ], '1' );
      should.equal( lit[ 'aB' ], 1 );
      should.equal( lit.$props[ a ], '1' );
      should.equal( lit.$props[ 'a' ], '1' );
      should.equal( lit.$props[ 'aB' ], 1 );

      custom.setAttribute('a','2');

      should.equal( lit[ a ], '2' );
      should.equal( lit[ 'a' ], '2' );
      should.equal( lit[ 'aB' ], 2 );
      should.equal( lit.$props[ a ], '2' );
      should.equal( lit.$props[ 'a' ], '2' );
      should.equal( lit.$props[ 'aB' ], 2 );
    });

  });

  describe( '可以通过 $lit 和 $props 对 prop 进行读取和更改', () => {

    it( '通过 $lit 对 prop 进行读取和更改', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: null
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.equal( lit.a, '1' );
      should.equal( lit.$props.a, '1' );

      lit.a = 123;

      should.equal( lit.a, 123 );
      should.equal( lit.$props.a, 123 );
    });

    it( '通过 $props 对 prop 进行读取和更改', () => {
      const customName = window.customName;

      Lit.define( customName, {
        props: {
          a: null
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.equal( lit.a, '1' );
      should.equal( lit.$props.a, '1' );

      lit.$props.a = 123;

      should.equal( lit.a, 123 );
      should.equal( lit.$props.a, 123 );
    });

  });

});