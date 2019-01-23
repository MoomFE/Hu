describe( 'Lit.define - props', () => {

  it( '创建时未定义 prop 的类型 ( 使用数组定义 props )', () => {
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
  
  it( '创建时未定义 prop 的类型 ( 使用 JOSN 定义 props )', () => {
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

  it( '创建时定义 prop 的类型为 String', () => {
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

  it( '创建时定义 prop 的类型为 Boolean', () => {
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

  it( '创建时定义 prop 的类型为 Number', () => {
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

  it( '创建时使用自定义方法转换 prop 的类型', () => {
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

});