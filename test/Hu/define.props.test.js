describe( 'Hu.define - props', () => {

  it( '使用数组定义 props', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: [ 'a', 'b' ]
    });

    const div = document.createElement('div').$html(`<${ customName } b="3"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( '3' );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( '3' );
  });

  it( '使用 JOSN 定义 props', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null,
        b: null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } b="3"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( '3' );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( '3' );
  });

  it( '定义 prop 的类型为 String ( 写法一 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: String,
        b: String,
        c: String
      }
    });

    const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'c' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'c' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( '' );
    expect( hu.c ).is.equals( '5' );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( '' );
    expect( hu.$props.c ).is.equals( '5' );
  });

  it( '定义 prop 的类型为 String ( 写法二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: { type: String },
        b: { type: String },
        c: { type: String }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'c' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'c' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( '' );
    expect( hu.c ).is.equals( '5' );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( '' );
    expect( hu.$props.c ).is.equals( '5' );
  });

  it( '定义 prop 的类型为 String ( 写法三 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
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
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'c' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'c' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( '' );
    expect( hu.c ).is.equals( '5' );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( '' );
    expect( hu.$props.c ).is.equals( '5' );
  });

  it( '定义 prop 的类型为 Boolean ( 写法一 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: Boolean,
        b: Boolean,
        c: Boolean
      }
    });

    const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'c' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'c' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( true );
    expect( hu.c ).is.equals( true );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( true );
    expect( hu.$props.c ).is.equals( true );
  });

  it( '定义 prop 的类型为 Boolean ( 写法二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: { type: Boolean },
        b: { type: Boolean },
        c: { type: Boolean }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'c' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'c' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( true );
    expect( hu.c ).is.equals( true );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( true );
    expect( hu.$props.c ).is.equals( true );
  });

  it( '定义 prop 的类型为 Boolean ( 写法三 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
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
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'c' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'c' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( true );
    expect( hu.c ).is.equals( true );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( true );
    expect( hu.$props.c ).is.equals( true );
  });

  it( '定义 prop 的类型为 Number ( 写法一 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: Number,
        b: Number,
        c: Number
      }
    });

    const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'c' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'c' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( 0 );
    expect( hu.c ).is.equals( 5 );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( 0 );
    expect( hu.$props.c ).is.equals( 5 );
  });

  it( '定义 prop 的类型为 Number ( 写法二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: { type: Number },
        b: { type: Number },
        c: { type: Number }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'c' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'c' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( 0 );
    expect( hu.c ).is.equals( 5 );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( 0 );
    expect( hu.$props.c ).is.equals( 5 );
  });

  it( '定义 prop 的类型为 Number ( 写法三 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
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
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'c' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'c' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( 0 );
    expect( hu.c ).is.equals( 5 );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( 0 );
    expect( hu.$props.c ).is.equals( 5 );
  });

  it( '使用自定义方法转换 prop 的类型 ( 写法一 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: value => parseInt( value ) + 1,
        b: value => parseInt( value ) + 2,
        c: value => parseInt( value ) + 3
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" b="1" c="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'c' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'c' );

    expect( hu.a ).is.equals( 2 );
    expect( hu.b ).is.equals( 3 );
    expect( hu.c ).is.equals( 4 );
    expect( hu.$props.a ).is.equals( 2 );
    expect( hu.$props.b ).is.equals( 3 );
    expect( hu.$props.c ).is.equals( 4 );
  });

  it( '使用自定义方法转换 prop 的类型 ( 写法二 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: { type: value => parseInt( value ) + 1 },
        b: { type: value => parseInt( value ) + 2 },
        c: { type: value => parseInt( value ) + 3 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" b="1" c="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'c' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'c' );

    expect( hu.a ).is.equals( 2 );
    expect( hu.b ).is.equals( 3 );
    expect( hu.c ).is.equals( 4 );
    expect( hu.$props.a ).is.equals( 2 );
    expect( hu.$props.b ).is.equals( 3 );
    expect( hu.$props.c ).is.equals( 4 );
  });

  it( '使用自定义方法转换 prop 的类型 ( 写法三 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
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
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'c' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'c' );

    expect( hu.a ).is.equals( 2 );
    expect( hu.b ).is.equals( 3 );
    expect( hu.c ).is.equals( 4 );
    expect( hu.$props.a ).is.equals( 2 );
    expect( hu.$props.b ).is.equals( 3 );
    expect( hu.$props.c ).is.equals( 4 );
  });

  it( '定义 prop 的默认值为非引用类型时无要求', () => {
    const customName = window.customName;

    Hu.define( customName, {
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
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'c' );
    expect( hu ).has.property( 'd' );
    expect( hu ).has.property( 'e' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'c' );
    expect( hu.$props ).has.property( 'd' );
    expect( hu.$props ).has.property( 'e' );

    expect( hu.a ).is.equals( '123' );
    expect( hu.b ).is.equals( 123 );
    expect( hu.c ).is.equals( false );
    expect( hu.d ).is.equals( true );
    expect( hu.e ).is.equals( null );
    expect( hu.$props.a ).is.equals( '123' );
    expect( hu.$props.b ).is.equals( 123 );
    expect( hu.$props.c ).is.equals( false );
    expect( hu.$props.d ).is.equals( true );
    expect( hu.$props.e ).is.equals( null );
  });

  it( '定义 prop 的默认值为引用类型时必须使用方法进行返回', () => {
    const customName = window.customName;

    Hu.define( customName, {
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
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'c' );
    expect( hu ).has.property( 'd' );
    expect( hu ).has.property( 'e' );
    expect( hu ).has.property( 'f' );
    expect( hu ).has.property( 'g' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'c' );
    expect( hu.$props ).has.property( 'd' );
    expect( hu.$props ).has.property( 'e' );
    expect( hu.$props ).has.property( 'f' );
    expect( hu.$props ).has.property( 'g' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( undefined );
    expect( hu.c ).is.equals( undefined );
    // expect( hu.d ).is.equals( [ 1, 2, 3 ] );
    expect( hu.e ).is.deep.equals( { a: 1, b: 2, c: 3 } );
    expect( hu.f ).is.deep.equals( /RegExp/ );
    expect( hu.g ).is.equals( ZenJS.noop );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( undefined );
    expect( hu.$props.c ).is.equals( undefined );
    expect( hu.$props.d ).is.deep.equals( [ 1, 2, 3 ] );
    expect( hu.$props.e ).is.deep.equals( { a: 1, b: 2, c: 3 } );
    expect( hu.$props.f ).is.deep.equals( /RegExp/ );
    expect( hu.$props.g ).is.equals( ZenJS.noop );
  });

  it( '定义 prop 的默认值后, 确保在已传入值时, 默认值不起作用', () => {
    const customName = window.customName;

    Hu.define( customName, {
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
    const hu = custom.$hu;

    expect( hu ).has.property( 'a1' );
    expect( hu ).has.property( 'a2' );
    expect( hu ).has.property( 'a3' );
    expect( hu ).has.property( 'a4' );
    expect( hu ).has.property( 'a5' );
    expect( hu ).has.property( 'a6' );
    expect( hu ).has.property( 'a7' );
    expect( hu ).has.property( 'a8' );
    expect( hu ).has.property( 'a9' );
    expect( hu ).has.property( 'b1' );
    expect( hu ).has.property( 'b2' );
    expect( hu ).has.property( 'b3' );
    expect( hu ).has.property( 'b4' );
    expect( hu ).has.property( 'b5' );
    expect( hu ).has.property( 'b6' );
    expect( hu ).has.property( 'b7' );
    expect( hu ).has.property( 'b8' );
    expect( hu ).has.property( 'b9' );
    expect( hu.$props ).has.property( 'a1' );
    expect( hu.$props ).has.property( 'a2' );
    expect( hu.$props ).has.property( 'a3' );
    expect( hu.$props ).has.property( 'a4' );
    expect( hu.$props ).has.property( 'a5' );
    expect( hu.$props ).has.property( 'a6' );
    expect( hu.$props ).has.property( 'a7' );
    expect( hu.$props ).has.property( 'a8' );
    expect( hu.$props ).has.property( 'a9' );
    expect( hu.$props ).has.property( 'b1' );
    expect( hu.$props ).has.property( 'b2' );
    expect( hu.$props ).has.property( 'b3' );
    expect( hu.$props ).has.property( 'b4' );
    expect( hu.$props ).has.property( 'b5' );
    expect( hu.$props ).has.property( 'b6' );
    expect( hu.$props ).has.property( 'b7' );
    expect( hu.$props ).has.property( 'b8' );
    expect( hu.$props ).has.property( 'b9' );

    expect( hu.a1 ).is.equals( '' );
    expect( hu.a2 ).is.equals( '' );
    expect( hu.a3 ).is.equals( 'b3' );
    expect( hu.a4 ).is.equals( true );
    expect( hu.a5 ).is.equals( true );
    expect( hu.a6 ).is.equals( true );
    expect( hu.a7 ).is.equals( 0 );
    expect( hu.a8 ).is.equals( 0 );
    expect( hu.a9 ).is.equals( 9 );
    expect( hu.b1 ).is.equals( 'c1' );
    expect( hu.b2 ).is.equals( 'c2' );
    expect( hu.b3 ).is.equals( 'c3' );
    expect( hu.b4 ).is.equals( 'c4' );
    expect( hu.b5 ).is.equals( 'c5' );
    expect( hu.b6 ).is.equals( 'c6' );
    expect( hu.b7 ).is.equals( 'c7' );
    expect( hu.b8 ).is.equals( 'c8' );
    expect( hu.b9 ).is.equals( 'c9' );
    expect( hu.$props.a1 ).is.equals( '' );
    expect( hu.$props.a2 ).is.equals( '' );
    expect( hu.$props.a3 ).is.equals( 'b3' );
    expect( hu.$props.a4 ).is.equals( true );
    expect( hu.$props.a5 ).is.equals( true );
    expect( hu.$props.a6 ).is.equals( true );
    expect( hu.$props.a7 ).is.equals( 0 );
    expect( hu.$props.a8 ).is.equals( 0 );
    expect( hu.$props.a9 ).is.equals( 9 );
    expect( hu.$props.b1 ).is.equals( 'c1' );
    expect( hu.$props.b2 ).is.equals( 'c2' );
    expect( hu.$props.b3 ).is.equals( 'c3' );
    expect( hu.$props.b4 ).is.equals( 'c4' );
    expect( hu.$props.b5 ).is.equals( 'c5' );
    expect( hu.$props.b6 ).is.equals( 'c6' );
    expect( hu.$props.b7 ).is.equals( 'c7' );
    expect( hu.$props.b8 ).is.equals( 'c8' );
    expect( hu.$props.b9 ).is.equals( 'c9' );
  });

  it( '定义 prop 的默认值时, 在使用方法进行返回默认值时, this 指向的是 $hu', () => {
    const customName = window.customName;

    Hu.define( customName, {
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
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu.$props ).has.property( 'a' );

    expect( hu.a ).is.equals( hu );
    expect( hu.$props.a ).is.equals( hu );
  });

  it( '首字母不为 $ 的 prop 可以在 $props 和 $hu 下找到', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null,
        b: null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } b="3"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( '3' );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( '3' );
  });

  it( '首字母为 $ 的 prop 可以在 $props 下找到, 但是不能在 $hu 下找到', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null,
        b: null,
        $a: null,
        $b: null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } $b="3" b="4"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.not.property( '$a' );
    expect( hu ).has.not.property( '$b' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( '$a' );
    expect( hu.$props ).has.property( '$b' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.b ).is.equals( '4' );
    expect( hu.$a ).is.equals( undefined );
    expect( hu.$b ).is.equals( undefined );
    expect( hu.$props.a ).is.equals( undefined );
    expect( hu.$props.b ).is.equals( '4' );
    expect( hu.$props.$a ).is.equals( undefined );
    expect( hu.$props.$b ).is.equals( '3' );
  });

  it( '定义了 attr 参数则会从相应的 attribute 中取值', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: { attr: 'b' },
        b: { attr: 'a' },
        aB: { attr: 'a-c' },
        aC: { attr: 'a-b' }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" b="2" a-b="3" a-c="4"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'b' );
    expect( hu ).has.property( 'aB' );
    expect( hu ).has.property( 'aC' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'b' );
    expect( hu.$props ).has.property( 'aB' );
    expect( hu.$props ).has.property( 'aC' );

    expect( hu[ 'a' ] ).is.equals( '2' );
    expect( hu[ 'b' ] ).is.equals( '1' );
    expect( hu[ 'aB' ] ).is.equals( '4' );
    expect( hu[ 'aC' ] ).is.equals( '3' );
    expect( hu.$props[ 'a' ] ).is.equals( '2' );
    expect( hu.$props[ 'b' ] ).is.equals( '1' );
    expect( hu.$props[ 'aB' ] ).is.equals( '4' );
    expect( hu.$props[ 'aC' ] ).is.equals( '3' );
  });

  it( '未定义 attr 参数则会将当前 prop 的名称转为以连字符号连接的小写 attr 名称', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null,
        'aB': null,
        'a-c': null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" a-b="2" a-c="3"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'aB' );
    expect( hu ).has.property( 'a-c' );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'aB' );
    expect( hu.$props ).has.property( 'a-c' );

    expect( hu[ 'a' ] ).is.equals( '1' );
    expect( hu[ 'aB' ] ).is.equals( '2' );
    expect( hu[ 'a-c' ] ).is.equals( '3' );
    expect( hu.$props[ 'a' ] ).is.equals( '1' );
    expect( hu.$props[ 'aB' ] ).is.equals( '2' );
    expect( hu.$props[ 'a-c' ] ).is.equals( '3' );
  });

  it( '支持传入名称为 Symbol 类型的 prop, 可以使用默认值给名称为 Symbol 类型的 prop 赋值', () => {
    const customName = window.customName;
    const a = Symbol('a');
    const b = Symbol('b');
    const props = {};
          props[ a ] = { default: 1 };
          props[ b ] = { default: 2 };

    Hu.define( customName, {
      props
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( a );
    expect( hu ).has.property( b );
    expect( hu.$props ).has.property( a );
    expect( hu.$props ).has.property( b );

    expect( hu[ a ] ).is.equals( 1 );
    expect( hu[ b ] ).is.equals( 2 );
    expect( hu.$props[ a ] ).is.equals( 1 );
    expect( hu.$props[ b ] ).is.equals( 2 );
  });

  it( '支持传入名称为 Symbol 类型的 prop, 可以指定 attr 属性使当前 prop 从指定 attribute 取值', () => {
    const customName = window.customName;
    const a = Symbol('a');
    const b = Symbol('b');
    const props = {};
          props[ a ] = { attr: 'c' };
          props[ b ] = { attr: 'd' };

    Hu.define( customName, {
      props
    });

    const div = document.createElement('div').$html(`<${ customName } c="d" d="e"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( a );
    expect( hu ).has.property( b );
    expect( hu.$props ).has.property( a );
    expect( hu.$props ).has.property( b );

    expect( hu[ a ] ).is.equals( 'd' );
    expect( hu[ b ] ).is.equals( 'e' );
    expect( hu.$props[ a ] ).is.equals( 'd' );
    expect( hu.$props[ b ] ).is.equals( 'e' );
  });

  it( '更改自定义元素的 attribute 属性值时, 会立即将改变更新到内部的值中 ( 非 Symbol 类型 )', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null,
        aB: null,
        attr1: { attr: 'attr2' },
        attr2: { attr: 'attr1' }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" a-b="2" attr1="5" attr2="6"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.a ).is.equals( '1' );
    expect( hu.aB ).is.equals( '2' );
    expect( hu.attr1 ).is.equals( '6' );
    expect( hu.attr2 ).is.equals( '5' );
    expect( hu.$props.a ).is.equals( '1' );
    expect( hu.$props.aB ).is.equals( '2' );
    expect( hu.$props.attr1 ).is.equals( '6' );
    expect( hu.$props.attr2 ).is.equals( '5' );

    custom.setAttribute('a','2');

    expect( hu.a ).is.equals( '2' );
    expect( hu.aB ).is.equals( '2' );
    expect( hu.attr1 ).is.equals( '6' );
    expect( hu.attr2 ).is.equals( '5' );
    expect( hu.$props.a ).is.equals( '2' );
    expect( hu.$props.aB ).is.equals( '2' );
    expect( hu.$props.attr1 ).is.equals( '6' );
    expect( hu.$props.attr2 ).is.equals( '5' );

    custom.setAttribute('a-b','3');

    expect( hu.a ).is.equals( '2' );
    expect( hu.aB ).is.equals( '3' );
    expect( hu.attr1 ).is.equals( '6' );
    expect( hu.attr2 ).is.equals( '5' );
    expect( hu.$props.a ).is.equals( '2' );
    expect( hu.$props.aB ).is.equals( '3' );
    expect( hu.$props.attr1 ).is.equals( '6' );
    expect( hu.$props.attr2 ).is.equals( '5' );

    custom.setAttribute('attr1','7');
    custom.setAttribute('attr2','8');

    expect( hu.a ).is.equals( '2' );
    expect( hu.aB ).is.equals( '3' );
    expect( hu.attr1 ).is.equals( '8' );
    expect( hu.attr2 ).is.equals( '7' );
    expect( hu.$props.a ).is.equals( '2' );
    expect( hu.$props.aB ).is.equals( '3' );
    expect( hu.$props.attr1 ).is.equals( '8' );
    expect( hu.$props.attr2 ).is.equals( '7' );
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

    Hu.define( customName, {
      props
    });

    const div = document.createElement('div').$html(`<${ customName } a="1" b="2"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( a );
    expect( hu ).has.property( b );
    expect( hu ).has.property( c );
    expect( hu.$props ).has.property( a );
    expect( hu.$props ).has.property( b );
    expect( hu.$props ).has.property( c );

    expect( hu[ a ] ).is.equals( undefined );
    expect( hu[ b ] ).is.equals( '1' );
    expect( hu[ c ] ).is.equals( 2 );
    expect( hu.$props[ a ] ).is.equals( undefined );
    expect( hu.$props[ b ] ).is.equals( '1' );
    expect( hu.$props[ c ] ).is.equals( 2 );

    custom.setAttribute('a','2');

    expect( hu[ a ] ).is.equals( undefined );
    expect( hu[ b ] ).is.equals( '2' );
    expect( hu[ c ] ).is.equals( 2 );
    expect( hu.$props[ a ] ).is.equals( undefined );
    expect( hu.$props[ b ] ).is.equals( '2' );
    expect( hu.$props[ c ] ).is.equals( 2 );

    custom.setAttribute('b','3');

    expect( hu[ a ] ).is.equals( undefined );
    expect( hu[ b ] ).is.equals( '2' );
    expect( hu[ c ] ).is.equals( 3 );
    expect( hu.$props[ a ] ).is.equals( undefined );
    expect( hu.$props[ b ] ).is.equals( '2' );
    expect( hu.$props[ c ] ).is.equals( 3 );
  });

  it( '可以使用 attr 属性将多个 prop 绑定到一个 attribute 上, 当 attribute 更改时, 所有绑定到 attribute 上的 prop 均会更新', () => {
    const customName = window.customName;
    const a = Symbol('a');
    const props = {};
          props[ a ] = { attr: 'a' };
          props[ 'a' ] = { attr: 'a' };
          props[ 'aB' ] = { attr: 'a', type: Number };

    Hu.define( customName, {
      props
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( a );
    expect( hu ).has.property( 'a' );
    expect( hu ).has.property( 'aB' );
    expect( hu.$props ).has.property( a );
    expect( hu.$props ).has.property( 'a' );
    expect( hu.$props ).has.property( 'aB' );

    expect( hu[ a ] ).is.equals( '1' );
    expect( hu[ 'a' ] ).is.equals( '1' );
    expect( hu[ 'aB' ] ).is.equals( 1 );
    expect( hu.$props[ a ] ).is.equals( '1' );
    expect( hu.$props[ 'a' ] ).is.equals( '1' );
    expect( hu.$props[ 'aB' ] ).is.equals( 1 );

    custom.setAttribute('a','2');

    expect( hu[ a ] ).is.equals( '2' );
    expect( hu[ 'a' ] ).is.equals( '2' );
    expect( hu[ 'aB' ] ).is.equals( 2 );
    expect( hu.$props[ a ] ).is.equals( '2' );
    expect( hu.$props[ 'a' ] ).is.equals( '2' );
    expect( hu.$props[ 'aB' ] ).is.equals( 2 );
  });

  it( '可以通过 $hu 对 prop 进行读取和更改', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.a ).is.equals( '1' );
    expect( hu.$props.a ).is.equals( '1' );

    hu.a = 123;

    expect( hu.a ).is.equals( 123 );
    expect( hu.$props.a ).is.equals( 123 );
  });

  it( '可以通过 $props 对 prop 进行读取和更改', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.a ).is.equals( '1' );
    expect( hu.$props.a ).is.equals( '1' );

    hu.$props.a = 123;

    expect( hu.a ).is.equals( 123 );
    expect( hu.$props.a ).is.equals( 123 );
  });

  it( '若删除 $hu 下的 prop 映射, 不会影响到 $props 内的 prop 本体', () => {
    const customName = window.customName;

    Hu.define( customName, {
      props: {
        a: null
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' );
    expect( hu.$props ).has.property( 'a' );

    expect( hu.a ).is.equals( '1' );
    expect( hu.$props.a ).is.equals( '1' );

    delete hu.a;

    expect( hu ).has.not.property( 'a' );
    expect( hu.$props ).has.property( 'a' );

    expect( hu.a ).is.equals( undefined );
    expect( hu.$props.a ).is.equals( '1' );
  });


});