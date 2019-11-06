describe( 'Hu.static.directiveFn', () => {

  /** @type {Element} */
  let div;
  beforeEach(() => {
    div = document.createElement('div').$appendTo( document.body );
  });
  afterEach(() => {
    div.$remove();
  });

  it( 'Hu.directiveFn: 使用该方法可用于注册自定义指令方法', () => {
    let result;
    const fn = Hu.directiveFn( class{
      commit( value ){
        result = value;
      }
    });

    Hu.render(
      fn( 123 ),
      div
    );
    expect( result ).is.equals( 123 );
  });

  it( 'Hu.directiveFn: 注册的指令方法在不同地方的使用 ( 在 render 中使用 )', () => {
    let result;
    const fn = Hu.directiveFn( class{
      commit( value ){
        result = value;
      }
    });

    Hu.render(
      fn( 123 ),
      div
    );
    expect( result ).is.equals( 123 );
  });

  it( 'Hu.directiveFn: 注册的指令方法在不同地方的使用 ( 在指令中使用 )', () => {
    let result;
    const fn = Hu.directiveFn( class{
      commit( value ){
        result = value;
      }
    });

    Hu.render( div )`
      <div :text=${ fn( 123 ) }></div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( 'Hu.directiveFn: 注册的指令方法在不同地方的使用 ( 在模板中使用 )', () => {
    let result;
    const fn = Hu.directiveFn( class{
      commit( value ){
        result = value;
      }
    });

    Hu.render( div )`
      <div>${ fn( 123 ) }</div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( 'Hu.directiveFn: 注册的指令方法在不同地方的使用 ( 在数组中使用 )', () => {
    let result;
    const fn = Hu.directiveFn( class{
      commit( value ){
        result = value;
      }
    });

    Hu.render( div )`
      <div>${[ fn( 123 ) ]}</div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( 'Hu.directiveFn: 注册的指令方法在不同地方的使用 ( 在 repeat 指令方法中使用 )', () => {
    let result;
    const fn = Hu.directiveFn( class{
      commit( value ){
        result = value;
      }
    });

    Hu.render( div )`
      <div>${
        Hu.html.repeat( [ 123 ], val => val, val => {
          return fn( val );
        })
      }</div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 render 中使用 )', () => {
    let commitIndex = 0;
    let destroyIndex = 0;
    const fn = Hu.directiveFn( class{
      commit( value ){
        commitIndex++;
      }
      destroy(){
        destroyIndex++;
      }
    });

    expect( commitIndex ).is.equals( 0 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render(
      fn( 123 ),
      div
    );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render(
      123,
      div
    );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    // ------

    Hu.render(
      fn( 456 ),
      div
    );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render(
      456,
      div
    );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在指令中使用 )', () => {
    let commitIndex = 0;
    let destroyIndex = 0;
    const fn = Hu.directiveFn( class{
      commit( value ){
        commitIndex++;
      }
      destroy(){
        destroyIndex++;
      }
    });

    expect( commitIndex ).is.equals( 0 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div :text=${ fn( 123 ) }></div>
    `;
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div></div>
    `;
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    // ------

    Hu.render(
      Hu.html`
        <div :text=${ fn( 456 ) }></div>
      `,
      div
    );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render(
      Hu.html`
        <div></div>
      `,
      div
    );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在模板中使用 )', () => {
    let commitIndex = 0;
    let destroyIndex = 0;
    const fn = Hu.directiveFn( class{
      commit( value ){
        commitIndex++;
      }
      destroy(){
        destroyIndex++;
      }
    });

    expect( commitIndex ).is.equals( 0 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${ fn( 123 ) }</div>
    `;
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div></div>
    `;
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    // ------

    Hu.render(
      Hu.html`
        <div>${ fn( 456 ) }</div>
      `,
      div
    );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render(
      Hu.html`
        <div></div>
      `,
      div
    );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在数组中使用 )', () => {
    let commitIndex = 0;
    let destroyIndex = 0;
    const fn = Hu.directiveFn( class{
      commit( value ){
        commitIndex++;
      }
      destroy(){
        destroyIndex++;
      }
    });

    expect( commitIndex ).is.equals( 0 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${[ fn( 123 ) ]}</div>
    `;
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div></div>
    `;
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    // ------

    Hu.render(
      Hu.html`
        <div>${[ fn( 456 ) ]}</div>
      `,
      div
    );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render(
      Hu.html`
        <div></div>
      `,
      div
    );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 repeat 指令方法中使用 )', () => {
    let commitIndex = 0;
    let destroyIndex = 0;
    const fn = Hu.directiveFn( class{
      commit( value ){
        commitIndex++;
      }
      destroy(){
        destroyIndex++;
      }
    });

    expect( commitIndex ).is.equals( 0 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${
        Hu.html.repeat( [ 123 ], val => val, val => {
          return fn( val );
        })
      }</div>
    `;
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div></div>
    `;
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );

    // ------

    Hu.render(
      Hu.html`
        <div>${
          Hu.html.repeat( [ 123 ], val => val, val => {
            return fn( val );
          })
        }</div>
      `,
      div
    );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 1 );

    Hu.render(
      Hu.html`
        <div></div>
      `,
      div
    );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 2 );
  });

  it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 插值内切换: 指令方法切换为非指令方法 )', () => {
    let commitIndex = 0;
    let destroyIndex = 0;
    const fn = Hu.directiveFn( class{
      commit( value ){
        commitIndex++;
      }
      destroy(){
        destroyIndex++;
      }
    });

    expect( commitIndex ).is.equals( 0 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${ fn( 123 ) }</div>
    `;
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${ 123 }</div>
    `;
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 1 );
  });

  it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 插值内切换: 非指令方法切换为指令方法 )', () => {
    let commitIndex = 0;
    let destroyIndex = 0;
    const fn = Hu.directiveFn( class{
      commit( value ){
        commitIndex++;
      }
      destroy(){
        destroyIndex++;
      }
    });

    expect( commitIndex ).is.equals( 0 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${ 123 }</div>
    `;
    expect( commitIndex ).is.equals( 0 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${ fn( 123 ) }</div>
    `;
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );
  });

  it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 插值内切换: 切换为其他指令方法 )', () => {
    let commitIndex1 = 0;
    let destroyIndex1 = 0;
    const fn1 = Hu.directiveFn( class{
      commit( value ){
        commitIndex1++;
      }
      destroy(){
        destroyIndex1++;
      }
    });

    let commitIndex2 = 0;
    let destroyIndex2 = 0;
    const fn2 = Hu.directiveFn( class{
      commit( value ){
        commitIndex2++;
      }
      destroy(){
        destroyIndex2++;
      }
    });

    expect( commitIndex1 ).is.equals( 0 );
    expect( destroyIndex1 ).is.equals( 0 );
    expect( commitIndex2 ).is.equals( 0 );
    expect( destroyIndex2 ).is.equals( 0 );

    Hu.render( div )`
      <div>${ fn1( 123 ) }</div>
    `;
    expect( commitIndex1 ).is.equals( 1 );
    expect( destroyIndex1 ).is.equals( 0 );
    expect( commitIndex2 ).is.equals( 0 );
    expect( destroyIndex2 ).is.equals( 0 );

    Hu.render( div )`
      <div>${ fn2( 123 ) }</div>
    `;
    expect( commitIndex1 ).is.equals( 1 );
    expect( destroyIndex1 ).is.equals( 1 );
    expect( commitIndex2 ).is.equals( 1 );
    expect( destroyIndex2 ).is.equals( 0 );

    Hu.render( div )`
      <div>${ 123 }</div>
    `;
    expect( commitIndex1 ).is.equals( 1 );
    expect( destroyIndex1 ).is.equals( 1 );
    expect( commitIndex2 ).is.equals( 1 );
    expect( destroyIndex2 ).is.equals( 1 );
  });

  it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 插值内切换: 切换为同样的指令方法 )', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;
    const fn = Hu.directiveFn( class{
      constructor(){
        constructorIndex++
      }
      commit( value ){
        commitIndex++;
      }
      destroy(){
        destroyIndex++;
      }
    });

    expect( constructorIndex ).is.equals( 0 );
    expect( commitIndex ).is.equals( 0 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${ fn( 123 ) }</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );

    Hu.render( div )`
      <div>${ fn( 456 ) }</div>
    `;
    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 2 );
    expect( destroyIndex ).is.equals( 0 );
  });

  it( 'Hu.directiveFn: 注册指令时可以注册 proxy 静态方法来代理指令方法的使用步骤', () => {
    let constructorIndex = 0;
    let commitIndex = 0;
    let destroyIndex = 0;
    let staticUsingStep1Index = 0, staticUsingStep2Index = 0;
    const fn = Hu.directiveFn( class{
      constructor(){
        constructorIndex++
      }
      commit( value ){
        commitIndex++;
      }
      destroy(){
        destroyIndex++;
      }

      static proxy( using ){
        staticUsingStep1Index++;
        return ( part ) => {
          staticUsingStep2Index++;
          return using( part );
        }
      }
    });

    expect( constructorIndex ).is.equals( 0 );
    expect( commitIndex ).is.equals( 0 );
    expect( destroyIndex ).is.equals( 0 );
    expect( staticUsingStep1Index ).is.equals( 0 );
    expect( staticUsingStep2Index ).is.equals( 0 );

    const fn1 = fn( 1, 2, 3 );

    expect( constructorIndex ).is.equals( 0 );
    expect( commitIndex ).is.equals( 0 );
    expect( destroyIndex ).is.equals( 0 );
    expect( staticUsingStep1Index ).is.equals( 1 );
    expect( staticUsingStep2Index ).is.equals( 0 );

    Hu.render( div )`
      <div>${ fn1 }</div>
    `;

    expect( constructorIndex ).is.equals( 1 );
    expect( commitIndex ).is.equals( 1 );
    expect( destroyIndex ).is.equals( 0 );
    expect( staticUsingStep1Index ).is.equals( 1 );
    expect( staticUsingStep2Index ).is.equals( 1 );
  });

});