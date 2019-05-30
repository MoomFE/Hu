describe( 'Hu.directive', () => {

  let div = document.createElement('div');
  beforeEach(() => {
    div.$remove();
    div = document.createElement('div');
  });


  it( '注册的指令使用 constructor 接收使用指令处的相关信息', () => {
    const args = [];

    Hu.directive( 'asd', class {
      commit(){}
      constructor( element, name, strings, modifiers ){
        args.splice( 0, Infinity, ...arguments );
      }
    });

    Hu.render( div )`
      <div :asd=${ 1 }></div>
    `;

    expect( args ).is.deep.equals([
      div.firstElementChild,
      'asd',
      [ '', '' ],
      {}
    ]);
  });

  it( '注册的指令使用 commit 接收用户传递的值', () => {
    const result = [];

    Hu.directive( 'asd', class {
      commit( value ){
        result.push( value );
      }
    });

    Hu.render( div )`
      <div :asd=${ 1 }></div>
      <div :asd=${ '2' }></div>
      <div :asd=${ true }></div>
      <div :asd=${ false }></div>
      <div :asd=${ [] }></div>
      <div :asd=${ {} }></div>
    `;

    expect( result ).is.deep.equals([
      1, '2',
      true, false,
      [], {}
    ]);
  });

  it( '注册的指令只在元素上使用时会生效', () => {
    const result = [];

    Hu.directive( 'asd', class {
      commit( value ){
        result.push( value );
      }
    });

    Hu.render( div )`
      <div :asd=${ 1 }>:asd=${ 2 }</div>
      <div :asd=${ 3 }>:asd=${ 4 }</div>
    `;

    expect( result ).is.deep.equals([ 1, 3 ]);
  });

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 切换模板 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`
      <div :asd=${ null }></div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    // 再测试

    Hu.render( div )`
      <div></div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render( div )`
      <div :asd=${ null }></div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render( div )`
      <div></div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 切换插值内的模板 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`
      <div>
        ${ Hu.html`<div :asd=${ null }></div>` }
      </div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>
        ${ Hu.html`<div></div>` }
      </div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    // 再测试

    Hu.render( div )`
      <div>
        ${ Hu.html`<div :asd=${ null }></div>` }
      </div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render( div )`
      <div>
        ${ Hu.html`<div></div>` }
      </div>
    `;
    expect( constructorIndex ).is.equals( 2 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 切换数组内的模板 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 3 );
    expect( commitIndex ).is.equals( 3 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 3 );
    expect( commitIndex ).is.equals( 3 );
    expect( destroyIndex ).is.equals( 3 );

    // 再测试

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 6 );
    expect( commitIndex ).is.equals( 6 );
    expect( destroyIndex ).is.equals( 3 );

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 6 );
    expect( commitIndex ).is.equals( 6 );
    expect( destroyIndex ).is.equals( 6 );
  });

  it( '注册的指令在被弃用时会触发 destroy 方法 ( 切换数组的数量 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;

    Hu.directive( 'asd', class {
      constructor(){ constructorIndex++ }
      commit(){ commitIndex++ }
      destroy(){ destroyIndex++ }
    });

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 3 );
    expect( commitIndex ).is.equals( 3 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`${
      [ 1, 2, 3, 5, 6 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 5 );
    expect( commitIndex ).is.equals( 8 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`${
      [ 1 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 5 );
    expect( commitIndex ).is.equals( 9 );
    expect( destroyIndex ).is.equals( 4 );

    // 再测试

    Hu.render( div )`${
      [ 1, 2, 3 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 7 );
    expect( commitIndex ).is.equals( 12 );
    expect( destroyIndex ).is.equals( 4 );

    Hu.render( div )`${
      [ 1, 2, 3, 5, 6 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 9 );
    expect( commitIndex ).is.equals( 17 );
    expect( destroyIndex ).is.equals( 4 );

    Hu.render( div )`${
      [ 1 ].map(( num, index ) => {
        return Hu.html`<div :asd=${ null }></div>`;
      })
    }`;
    expect( constructorIndex ).is.equals( 9 );
    expect( commitIndex ).is.equals( 18 );
    expect( destroyIndex ).is.equals( 8 );
  });

});