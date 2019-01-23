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
  
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
  
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
  
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
  
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
  
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );
  
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, '' );
      should.equal( lit.$props.c, '5' );
    });

    it( '写法二', () => {
      const customName = window.customName;
  
      Lit.define( customName, {
        props: {
          a: {
            type: String
          },
          b: {
            type: String
          },
          c: {
            type: String
          }
        }
      });
  
      const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;
  
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );
  
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, '' );
      should.equal( lit.$props.c, '5' );
    });

    it( '写法三', () => {
      const customName = window.customName;
  
      Lit.define( customName, {
        props: {
          a: {
            type: {
              from: String
            }
          },
          b: {
            type: {
              from: String
            }
          },
          c: {
            type: {
              from: String
            }
          }
        }
      });
  
      const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;
  
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );
  
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
  
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );
  
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, true );
      should.equal( lit.$props.c, true );
    });

    it( '写法二', () => {
      const customName = window.customName;
  
      Lit.define( customName, {
        props: {
          a: {
            type: Boolean
          },
          b: {
            type: Boolean
          },
          c: {
            type: Boolean
          }
        }
      });
  
      const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;
  
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );
  
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, true );
      should.equal( lit.$props.c, true );
    });

    it( '写法三', () => {
      const customName = window.customName;
  
      Lit.define( customName, {
        props: {
          a: {
            type: {
              from: Boolean
            }
          },
          b: {
            type: {
              from: Boolean
            }
          },
          c: {
            type: {
              from: Boolean
            }
          }
        }
      });
  
      const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;
  
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );
  
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
  
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );
  
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, 0 );
      should.equal( lit.$props.c, 5 );
    });

    it( '写法二', () => {
      const customName = window.customName;
  
      Lit.define( customName, {
        props: {
          a: {
            type: Number
          },
          b: {
            type: Number
          },
          c: {
            type: Number
          }
        }
      });
  
      const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;
  
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );
  
      should.equal( lit.$props.a, undefined );
      should.equal( lit.$props.b, 0 );
      should.equal( lit.$props.c, 5 );
    });

    it( '写法三', () => {
      const customName = window.customName;
  
      Lit.define( customName, {
        props: {
          a: {
            type: {
              from: Number
            }
          },
          b: {
            type: {
              from: Number
            }
          },
          c: {
            type: {
              from: Number
            }
          }
        }
      });
  
      const div = document.createElement('div').$html(`<${ customName } b c="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;
  
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );
  
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
  
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );
  
      should.equal( lit.$props.a, 2 );
      should.equal( lit.$props.b, 3 );
      should.equal( lit.$props.c, 4 );
    });
    
    it( '写法二', () => {
      const customName = window.customName;
  
      Lit.define( customName, {
        props: {
          a: {
            type: value => parseInt( value ) + 1
          },
          b: {
            type: value => parseInt( value ) + 2
          },
          c: {
            type: value => parseInt( value ) + 3
          }
        }
      });
  
      const div = document.createElement('div').$html(`<${ customName } a="1" b="1" c="1"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;
  
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );
  
      should.equal( lit.$props.a, 2 );
      should.equal( lit.$props.b, 3 );
      should.equal( lit.$props.c, 4 );
    });
    
    it( '写法三', () => {
      const customName = window.customName;
  
      Lit.define( customName, {
        props: {
          a: {
            type: {
              from: value => parseInt( value ) + 1
            }
          },
          b: {
            type: {
              from: value => parseInt( value ) + 2
            }
          },
          c: {
            type: {
              from: value => parseInt( value ) + 3
            }
          }
        }
      });
  
      const div = document.createElement('div').$html(`<${ customName } a="1" b="1" c="1"></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;
  
      should.has( lit.$props, 'a' );
      should.has( lit.$props, 'b' );
      should.has( lit.$props, 'c' );
  
      should.equal( lit.$props.a, 2 );
      should.equal( lit.$props.b, 3 );
      should.equal( lit.$props.c, 4 );
    });

  });

});