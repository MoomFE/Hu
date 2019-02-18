describe( 'Lit.define - props', () => {

  it( '使用数组定义 props', () => {
    const customName = window.customName;

    Lit.define( customName, {
      props: [ 'a', 'b' ]
    });

    const div = document.createElement('div').$html(`<${ customName } b="3"></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );

    expect( lit.a ).to.equals( undefined );
    expect( lit.b ).to.equals( '3' );
    expect( lit.$props.a ).to.equals( undefined );
    expect( lit.$props.b ).to.equals( '3' );
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );

    expect( lit.a ).to.equals( undefined );
    expect( lit.b ).to.equals( '3' );
    expect( lit.$props.a ).to.equals( undefined );
    expect( lit.$props.b ).to.equals( '3' );
  });

  it( '定义 prop 的类型为 String ( 写法一 )', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.property( 'c' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( 'c' );

    expect( lit.a ).to.equals( undefined );
    expect( lit.b ).to.equals( '' );
    expect( lit.c ).to.equals( '5' );
    expect( lit.$props.a ).to.equals( undefined );
    expect( lit.$props.b ).to.equals( '' );
    expect( lit.$props.c ).to.equals( '5' );
  });

  it( '定义 prop 的类型为 String ( 写法二 )', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.property( 'c' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( 'c' );

    expect( lit.a ).to.equals( undefined );
    expect( lit.b ).to.equals( '' );
    expect( lit.c ).to.equals( '5' );
    expect( lit.$props.a ).to.equals( undefined );
    expect( lit.$props.b ).to.equals( '' );
    expect( lit.$props.c ).to.equals( '5' );
  });

  it( '定义 prop 的类型为 String ( 写法三 )', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.property( 'c' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( 'c' );

    expect( lit.a ).to.equals( undefined );
    expect( lit.b ).to.equals( '' );
    expect( lit.c ).to.equals( '5' );
    expect( lit.$props.a ).to.equals( undefined );
    expect( lit.$props.b ).to.equals( '' );
    expect( lit.$props.c ).to.equals( '5' );
  });

  it( '定义 prop 的类型为 Boolean ( 写法一 )', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.property( 'c' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( 'c' );

    expect( lit.a ).to.equals( undefined );
    expect( lit.b ).to.equals( true );
    expect( lit.c ).to.equals( true );
    expect( lit.$props.a ).to.equals( undefined );
    expect( lit.$props.b ).to.equals( true );
    expect( lit.$props.c ).to.equals( true );
  });

  it( '定义 prop 的类型为 Boolean ( 写法二 )', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.property( 'c' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( 'c' );

    expect( lit.a ).to.equals( undefined );
    expect( lit.b ).to.equals( true );
    expect( lit.c ).to.equals( true );
    expect( lit.$props.a ).to.equals( undefined );
    expect( lit.$props.b ).to.equals( true );
    expect( lit.$props.c ).to.equals( true );
  });

  it( '定义 prop 的类型为 Boolean ( 写法三 )', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.property( 'c' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( 'c' );

    expect( lit.a ).to.equals( undefined );
    expect( lit.b ).to.equals( true );
    expect( lit.c ).to.equals( true );
    expect( lit.$props.a ).to.equals( undefined );
    expect( lit.$props.b ).to.equals( true );
    expect( lit.$props.c ).to.equals( true );
  });

  it( '定义 prop 的类型为 Number ( 写法一 )', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.property( 'c' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( 'c' );

    expect( lit.a ).to.equals( undefined );
    expect( lit.b ).to.equals( 0 );
    expect( lit.c ).to.equals( 5 );
    expect( lit.$props.a ).to.equals( undefined );
    expect( lit.$props.b ).to.equals( 0 );
    expect( lit.$props.c ).to.equals( 5 );
  });

  it( '定义 prop 的类型为 Number ( 写法二 )', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.property( 'c' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( 'c' );

    expect( lit.a ).to.equals( undefined );
    expect( lit.b ).to.equals( 0 );
    expect( lit.c ).to.equals( 5 );
    expect( lit.$props.a ).to.equals( undefined );
    expect( lit.$props.b ).to.equals( 0 );
    expect( lit.$props.c ).to.equals( 5 );
  });

  it( '定义 prop 的类型为 Number ( 写法三 )', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.property( 'c' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( 'c' );

    expect( lit.a ).to.equals( undefined );
    expect( lit.b ).to.equals( 0 );
    expect( lit.c ).to.equals( 5 );
    expect( lit.$props.a ).to.equals( undefined );
    expect( lit.$props.b ).to.equals( 0 );
    expect( lit.$props.c ).to.equals( 5 );
  });

  it( '使用自定义方法转换 prop 的类型 ( 写法一 )', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.property( 'c' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( 'c' );

    expect( lit.a ).to.equals( 2 );
    expect( lit.b ).to.equals( 3 );
    expect( lit.c ).to.equals( 4 );
    expect( lit.$props.a ).to.equals( 2 );
    expect( lit.$props.b ).to.equals( 3 );
    expect( lit.$props.c ).to.equals( 4 );
  });

  it( '使用自定义方法转换 prop 的类型 ( 写法二 )', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.property( 'c' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( 'c' );

    expect( lit.a ).to.equals( 2 );
    expect( lit.b ).to.equals( 3 );
    expect( lit.c ).to.equals( 4 );
    expect( lit.$props.a ).to.equals( 2 );
    expect( lit.$props.b ).to.equals( 3 );
    expect( lit.$props.c ).to.equals( 4 );
  });

  it( '使用自定义方法转换 prop 的类型 ( 写法三 )', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.property( 'c' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( 'c' );

    expect( lit.a ).to.equals( 2 );
    expect( lit.b ).to.equals( 3 );
    expect( lit.c ).to.equals( 4 );
    expect( lit.$props.a ).to.equals( 2 );
    expect( lit.$props.b ).to.equals( 3 );
    expect( lit.$props.c ).to.equals( 4 );
  });

  it( '定义 prop 的默认值为非引用类型时无要求', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.property( 'c' );
    expect( lit ).has.property( 'd' );
    expect( lit ).has.property( 'e' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( 'c' );
    expect( lit.$props ).has.property( 'd' );
    expect( lit.$props ).has.property( 'e' );

    expect( lit.a ).to.equals( '123' );
    expect( lit.b ).to.equals( 123 );
    expect( lit.c ).to.equals( false );
    expect( lit.d ).to.equals( true );
    expect( lit.e ).to.equals( null );
    expect( lit.$props.a ).to.equals( '123' );
    expect( lit.$props.b ).to.equals( 123 );
    expect( lit.$props.c ).to.equals( false );
    expect( lit.$props.d ).to.equals( true );
    expect( lit.$props.e ).to.equals( null );
  });

  it( '定义 prop 的默认值为引用类型时必须使用方法进行返回', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.property( 'c' );
    expect( lit ).has.property( 'd' );
    expect( lit ).has.property( 'e' );
    expect( lit ).has.property( 'f' );
    expect( lit ).has.property( 'g' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( 'c' );
    expect( lit.$props ).has.property( 'd' );
    expect( lit.$props ).has.property( 'e' );
    expect( lit.$props ).has.property( 'f' );
    expect( lit.$props ).has.property( 'g' );

    expect( lit.a ).to.equals( undefined );
    expect( lit.b ).to.equals( undefined );
    expect( lit.c ).to.equals( undefined );
    // expect( lit.d ).to.equals( [ 1, 2, 3 ] );
    expect( lit.e ).to.deep.equals( { a: 1, b: 2, c: 3 } );
    expect( lit.f ).to.deep.equals( /RegExp/ );
    expect( lit.g ).to.equals( ZenJS.noop );
    expect( lit.$props.a ).to.equals( undefined );
    expect( lit.$props.b ).to.equals( undefined );
    expect( lit.$props.c ).to.equals( undefined );
    expect( lit.$props.d ).to.deep.equals( [ 1, 2, 3 ] );
    expect( lit.$props.e ).to.deep.equals( { a: 1, b: 2, c: 3 } );
    expect( lit.$props.f ).to.deep.equals( /RegExp/ );
    expect( lit.$props.g ).to.equals( ZenJS.noop );
  });

  it( '定义 prop 的默认值后, 确保在已传入值时, 默认值不起作用', () => {
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

    expect( lit ).has.property( 'a1' );
    expect( lit ).has.property( 'a2' );
    expect( lit ).has.property( 'a3' );
    expect( lit ).has.property( 'a4' );
    expect( lit ).has.property( 'a5' );
    expect( lit ).has.property( 'a6' );
    expect( lit ).has.property( 'a7' );
    expect( lit ).has.property( 'a8' );
    expect( lit ).has.property( 'a9' );
    expect( lit ).has.property( 'b1' );
    expect( lit ).has.property( 'b2' );
    expect( lit ).has.property( 'b3' );
    expect( lit ).has.property( 'b4' );
    expect( lit ).has.property( 'b5' );
    expect( lit ).has.property( 'b6' );
    expect( lit ).has.property( 'b7' );
    expect( lit ).has.property( 'b8' );
    expect( lit ).has.property( 'b9' );
    expect( lit.$props ).has.property( 'a1' );
    expect( lit.$props ).has.property( 'a2' );
    expect( lit.$props ).has.property( 'a3' );
    expect( lit.$props ).has.property( 'a4' );
    expect( lit.$props ).has.property( 'a5' );
    expect( lit.$props ).has.property( 'a6' );
    expect( lit.$props ).has.property( 'a7' );
    expect( lit.$props ).has.property( 'a8' );
    expect( lit.$props ).has.property( 'a9' );
    expect( lit.$props ).has.property( 'b1' );
    expect( lit.$props ).has.property( 'b2' );
    expect( lit.$props ).has.property( 'b3' );
    expect( lit.$props ).has.property( 'b4' );
    expect( lit.$props ).has.property( 'b5' );
    expect( lit.$props ).has.property( 'b6' );
    expect( lit.$props ).has.property( 'b7' );
    expect( lit.$props ).has.property( 'b8' );
    expect( lit.$props ).has.property( 'b9' );

    expect( lit.a1 ).to.equals( '' );
    expect( lit.a2 ).to.equals( '' );
    expect( lit.a3 ).to.equals( 'b3' );
    expect( lit.a4 ).to.equals( true );
    expect( lit.a5 ).to.equals( true );
    expect( lit.a6 ).to.equals( true );
    expect( lit.a7 ).to.equals( 0 );
    expect( lit.a8 ).to.equals( 0 );
    expect( lit.a9 ).to.equals( 9 );
    expect( lit.b1 ).to.equals( 'c1' );
    expect( lit.b2 ).to.equals( 'c2' );
    expect( lit.b3 ).to.equals( 'c3' );
    expect( lit.b4 ).to.equals( 'c4' );
    expect( lit.b5 ).to.equals( 'c5' );
    expect( lit.b6 ).to.equals( 'c6' );
    expect( lit.b7 ).to.equals( 'c7' );
    expect( lit.b8 ).to.equals( 'c8' );
    expect( lit.b9 ).to.equals( 'c9' );
    expect( lit.$props.a1 ).to.equals( '' );
    expect( lit.$props.a2 ).to.equals( '' );
    expect( lit.$props.a3 ).to.equals( 'b3' );
    expect( lit.$props.a4 ).to.equals( true );
    expect( lit.$props.a5 ).to.equals( true );
    expect( lit.$props.a6 ).to.equals( true );
    expect( lit.$props.a7 ).to.equals( 0 );
    expect( lit.$props.a8 ).to.equals( 0 );
    expect( lit.$props.a9 ).to.equals( 9 );
    expect( lit.$props.b1 ).to.equals( 'c1' );
    expect( lit.$props.b2 ).to.equals( 'c2' );
    expect( lit.$props.b3 ).to.equals( 'c3' );
    expect( lit.$props.b4 ).to.equals( 'c4' );
    expect( lit.$props.b5 ).to.equals( 'c5' );
    expect( lit.$props.b6 ).to.equals( 'c6' );
    expect( lit.$props.b7 ).to.equals( 'c7' );
    expect( lit.$props.b8 ).to.equals( 'c8' );
    expect( lit.$props.b9 ).to.equals( 'c9' );
  });

  it( '定义 prop 的默认值时, 在使用方法进行返回默认值时, this 指向的是 $lit', () => {
    const customName = window.customName;

    Lit.define( customName, {
      props: {
        a: {
          default(){
            return this;
          }
        }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } b="3"></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit ).has.property( 'a' );
    expect( lit.$props ).has.property( 'a' );

    expect( lit.a ).to.equals( lit );
    expect( lit.$props.a ).to.equals( lit );
  });

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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );

    expect( lit.a ).to.equals( undefined );
    expect( lit.b ).to.equals( '3' );
    expect( lit.$props.a ).to.equals( undefined );
    expect( lit.$props.b ).to.equals( '3' );
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.not.property( '$a' );
    expect( lit ).has.not.property( '$b' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( '$a' );
    expect( lit.$props ).has.property( '$b' );

    expect( lit.a ).to.equals( undefined );
    expect( lit.b ).to.equals( '4' );
    expect( lit.$a ).to.equals( undefined );
    expect( lit.$b ).to.equals( undefined );
    expect( lit.$props.a ).to.equals( undefined );
    expect( lit.$props.b ).to.equals( '4' );
    expect( lit.$props.$a ).to.equals( undefined );
    expect( lit.$props.$b ).to.equals( '3' );
  });

  it( '定义了 attr 参数则会从相应的 attribute 中取值', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'b' );
    expect( lit ).has.property( 'aB' );
    expect( lit ).has.property( 'aC' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'b' );
    expect( lit.$props ).has.property( 'aB' );
    expect( lit.$props ).has.property( 'aC' );

    expect( lit[ 'a' ] ).to.equals( '2' );
    expect( lit[ 'b' ] ).to.equals( '1' );
    expect( lit[ 'aB' ] ).to.equals( '4' );
    expect( lit[ 'aC' ] ).to.equals( '3' );
    expect( lit.$props[ 'a' ] ).to.equals( '2' );
    expect( lit.$props[ 'b' ] ).to.equals( '1' );
    expect( lit.$props[ 'aB' ] ).to.equals( '4' );
    expect( lit.$props[ 'aC' ] ).to.equals( '3' );
  });

  it( '未定义 attr 参数则会将当前 prop 的名称转为以连字符号连接的小写 attr 名称', () => {
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

    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'aB' );
    expect( lit ).has.property( 'a-c' );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'aB' );
    expect( lit.$props ).has.property( 'a-c' );

    expect( lit[ 'a' ] ).to.equals( '1' );
    expect( lit[ 'aB' ] ).to.equals( '2' );
    expect( lit[ 'a-c' ] ).to.equals( '3' );
    expect( lit.$props[ 'a' ] ).to.equals( '1' );
    expect( lit.$props[ 'aB' ] ).to.equals( '2' );
    expect( lit.$props[ 'a-c' ] ).to.equals( '3' );
  });

  it( '支持传入名称为 Symbol 类型的 prop, 可以使用默认值给名称为 Symbol 类型的 prop 赋值', () => {
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

    expect( lit ).has.property( a );
    expect( lit ).has.property( b );
    expect( lit.$props ).has.property( a );
    expect( lit.$props ).has.property( b );

    expect( lit[ a ] ).to.equals( 1 );
    expect( lit[ b ] ).to.equals( 2 );
    expect( lit.$props[ a ] ).to.equals( 1 );
    expect( lit.$props[ b ] ).to.equals( 2 );
  });

  it( '支持传入名称为 Symbol 类型的 prop, 可以指定 attr 属性使当前 prop 从指定 attribute 取值', () => {
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

    expect( lit ).has.property( a );
    expect( lit ).has.property( b );
    expect( lit.$props ).has.property( a );
    expect( lit.$props ).has.property( b );

    expect( lit[ a ] ).to.equals( 'd' );
    expect( lit[ b ] ).to.equals( 'e' );
    expect( lit.$props[ a ] ).to.equals( 'd' );
    expect( lit.$props[ b ] ).to.equals( 'e' );
  });

  it( '更改自定义元素的 attribute 属性值时, 会立即将改变更新到内部的值中 ( 非 Symbol 类型 )', () => {
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

    expect( lit.a ).to.equals( '1' );
    expect( lit.aB ).to.equals( '2' );
    expect( lit.attr1 ).to.equals( '6' );
    expect( lit.attr2 ).to.equals( '5' );
    expect( lit.$props.a ).to.equals( '1' );
    expect( lit.$props.aB ).to.equals( '2' );
    expect( lit.$props.attr1 ).to.equals( '6' );
    expect( lit.$props.attr2 ).to.equals( '5' );

    custom.setAttribute('a','2');

    expect( lit.a ).to.equals( '2' );
    expect( lit.aB ).to.equals( '2' );
    expect( lit.attr1 ).to.equals( '6' );
    expect( lit.attr2 ).to.equals( '5' );
    expect( lit.$props.a ).to.equals( '2' );
    expect( lit.$props.aB ).to.equals( '2' );
    expect( lit.$props.attr1 ).to.equals( '6' );
    expect( lit.$props.attr2 ).to.equals( '5' );

    custom.setAttribute('a-b','3');

    expect( lit.a ).to.equals( '2' );
    expect( lit.aB ).to.equals( '3' );
    expect( lit.attr1 ).to.equals( '6' );
    expect( lit.attr2 ).to.equals( '5' );
    expect( lit.$props.a ).to.equals( '2' );
    expect( lit.$props.aB ).to.equals( '3' );
    expect( lit.$props.attr1 ).to.equals( '6' );
    expect( lit.$props.attr2 ).to.equals( '5' );

    custom.setAttribute('attr1','7');
    custom.setAttribute('attr2','8');

    expect( lit.a ).to.equals( '2' );
    expect( lit.aB ).to.equals( '3' );
    expect( lit.attr1 ).to.equals( '8' );
    expect( lit.attr2 ).to.equals( '7' );
    expect( lit.$props.a ).to.equals( '2' );
    expect( lit.$props.aB ).to.equals( '3' );
    expect( lit.$props.attr1 ).to.equals( '8' );
    expect( lit.$props.attr2 ).to.equals( '7' );
  });

  it( '更改自定义元素的 attribute 属性值时, 会立即将改变更新到内部的值中 ( Symbol 类型 )', () => {
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

    expect( lit ).has.property( a );
    expect( lit ).has.property( b );
    expect( lit ).has.property( c );
    expect( lit.$props ).has.property( a );
    expect( lit.$props ).has.property( b );
    expect( lit.$props ).has.property( c );

    expect( lit[ a ] ).to.equals( undefined );
    expect( lit[ b ] ).to.equals( '1' );
    expect( lit[ c ] ).to.equals( 2 );
    expect( lit.$props[ a ] ).to.equals( undefined );
    expect( lit.$props[ b ] ).to.equals( '1' );
    expect( lit.$props[ c ] ).to.equals( 2 );

    custom.setAttribute('a','2');

    expect( lit[ a ] ).to.equals( undefined );
    expect( lit[ b ] ).to.equals( '2' );
    expect( lit[ c ] ).to.equals( 2 );
    expect( lit.$props[ a ] ).to.equals( undefined );
    expect( lit.$props[ b ] ).to.equals( '2' );
    expect( lit.$props[ c ] ).to.equals( 2 );

    custom.setAttribute('b','3');

    expect( lit[ a ] ).to.equals( undefined );
    expect( lit[ b ] ).to.equals( '2' );
    expect( lit[ c ] ).to.equals( 3 );
    expect( lit.$props[ a ] ).to.equals( undefined );
    expect( lit.$props[ b ] ).to.equals( '2' );
    expect( lit.$props[ c ] ).to.equals( 3 );
  });

  it( '可以使用 attr 属性将多个 prop 绑定到一个 attribute 上, 当 attribute 更改时, 所有绑定到 attribute 上的 prop 均会更新', () => {
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

    expect( lit ).has.property( a );
    expect( lit ).has.property( 'a' );
    expect( lit ).has.property( 'aB' );
    expect( lit.$props ).has.property( a );
    expect( lit.$props ).has.property( 'a' );
    expect( lit.$props ).has.property( 'aB' );

    expect( lit[ a ] ).to.equals( '1' );
    expect( lit[ 'a' ] ).to.equals( '1' );
    expect( lit[ 'aB' ] ).to.equals( 1 );
    expect( lit.$props[ a ] ).to.equals( '1' );
    expect( lit.$props[ 'a' ] ).to.equals( '1' );
    expect( lit.$props[ 'aB' ] ).to.equals( 1 );

    custom.setAttribute('a','2');

    expect( lit[ a ] ).to.equals( '2' );
    expect( lit[ 'a' ] ).to.equals( '2' );
    expect( lit[ 'aB' ] ).to.equals( 2 );
    expect( lit.$props[ a ] ).to.equals( '2' );
    expect( lit.$props[ 'a' ] ).to.equals( '2' );
    expect( lit.$props[ 'aB' ] ).to.equals( 2 );
  });

  it( '可以通过 $lit 对 prop 进行读取和更改', () => {
    const customName = window.customName;

    Lit.define( customName, {
      props: {
        a: null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit.a ).to.equals( '1' );
    expect( lit.$props.a ).to.equals( '1' );

    lit.a = 123;

    expect( lit.a ).to.equals( 123 );
    expect( lit.$props.a ).to.equals( 123 );
  });

  it( '可以通过 $props 对 prop 进行读取和更改', () => {
    const customName = window.customName;

    Lit.define( customName, {
      props: {
        a: null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit.a ).to.equals( '1' );
    expect( lit.$props.a ).to.equals( '1' );

    lit.$props.a = 123;

    expect( lit.a ).to.equals( 123 );
    expect( lit.$props.a ).to.equals( 123 );
  });

  it( '若删除 $lit 下的 prop 映射, 不会影响到 $props 内的 prop 本体', () => {
    const customName = window.customName;

    Lit.define( customName, {
      props: {
        a: null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit ).has.property( 'a' );
    expect( lit.$props ).has.property( 'a' );

    expect( lit.a ).to.equals( '1' );
    expect( lit.$props.a ).to.equals( '1' );

    delete lit.a;

    expect( lit ).has.not.property( 'a' );
    expect( lit.$props ).has.property( 'a' );

    expect( lit.a ).to.equals( undefined );
    expect( lit.$props.a ).to.equals( '1' );
  });


});