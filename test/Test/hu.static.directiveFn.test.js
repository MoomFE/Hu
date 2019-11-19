describe( 'Hu.static.directiveFn', () => {

  const render = Hu.render;
  const html = Hu.html;
  let NodePart;
  let AttributePart;
  let BasicBooleanDirective;
  let BasicEventDirective;
  let BasicPropertyDirective;
  let ClassDirective;
  let HtmlDirective;
  let ModelDirective;
  let ShowDirective;
  let StyleDirective;
  let TextDirective;

  Hu.use(( Hu, {
    directiveBasic: {
      Node,
      AttrPart,
      Boolean,
      Event,
      Prop
    },
    directive: {
      Class,
      Html,
      Model,
      Show,
      Style,
      Text
    }
  }) => {
    NodePart = Node;
    AttributePart = AttrPart;
    BasicBooleanDirective = Boolean;
    BasicEventDirective = Event;
    BasicPropertyDirective = Prop;
    ClassDirective = Class;
    HtmlDirective = Html;
    ModelDirective = Model;
    ShowDirective = Show;
    StyleDirective = Style;
    TextDirective = Text;
  });

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

  it( 'Hu.directiveFn: 注册的指令方法可以在 constructor 接受到使用该指令方法的指令', () => {
    let result;
    const fn = Hu.directiveFn( class {
      constructor( part ){
        result = part;
      }
      commit(){}
    });

    // 在 Node 指令中使用
    render(
      fn(),
      div
    );
    expect( result ).is.instanceOf( NodePart );

    // 在 Attr 指令中使用
    render( div )`
      <div class=${ fn() }></div>
    `;
    expect( result ).is.instanceOf( AttributePart );
    // 在 Attr 指令中使用
    render( div )`
      <div class="a ${ fn() } b"></div>
    `;
    expect( result ).is.instanceOf( AttributePart );

    // 在 Boolean 指令中使用
    render( div )`
      <div ?disabled=${ fn() }></div>
    `;
    expect( result ).is.instanceOf( BasicBooleanDirective );

    // 在 Event 指令中使用
    render( div )`
      <div @click=${ fn() }></div>
    `;
    expect( result ).is.instanceOf( BasicEventDirective );

    // 在 Prop 指令中使用
    render( div )`
      <div .title=${ fn() }></div>
    `;
    expect( result ).is.instanceOf( BasicPropertyDirective );
    
    // 在 Class 指令中使用
    render( div )`
      <div :class=${ fn() }></div>
    `;
    expect( result ).is.instanceOf( ClassDirective );
    
    // 在 Html 指令中使用
    render( div )`
      <div :html=${ fn() }></div>
    `;
    expect( result ).is.instanceOf( HtmlDirective );
    
    // // 在 Model 指令中使用
    // render( div )`
    //   <div :model=${ fn() }></div>
    // `;
    // expect( result ).is.instanceOf( ModelDirective );
    
    // 在 Show 指令中使用
    render( div )`
      <div :show=${ fn() }></div>
    `;
    expect( result ).is.instanceOf( ShowDirective );
    
    // 在 Style 指令中使用
    render( div )`
      <div :style=${ fn() }></div>
    `;
    expect( result ).is.instanceOf( StyleDirective );
    
    // 在 Text 指令中使用
    render( div )`
      <div :text=${ fn() }></div>
    `;
    expect( result ).is.instanceOf( TextDirective );
  });

  it( 'Hu.directiveFn: 注册的指令方法可以在 commit 接受到使用该指令方法时传的值', () => {
    let result;
    const fn = Hu.directiveFn( class {
      commit( value ){
        result = value;
      }
    });

    // 在 Node 指令中使用
    render(
      fn(0),
      div
    );
    expect( result ).is.equals( 0 );

    // 在 Attr 指令中使用
    render( div )`
      <div class=${ fn( 1 ) }></div>
    `;
    expect( result ).is.equals( 1 );
    // 在 Attr 指令中使用
    render( div )`
      <div class="a ${ fn( 2 ) } b"></div>
    `;
    expect( result ).is.equals( 2 );

    // 在 Boolean 指令中使用
    render( div )`
      <div ?disabled=${ fn( 3 ) }></div>
    `;
    expect( result ).is.equals( 3 );

    // 在 Event 指令中使用
    render( div )`
      <div @click=${ fn( 4 ) }></div>
    `;
    expect( result ).is.equals( 4 );

    // 在 Prop 指令中使用
    render( div )`
      <div .title=${ fn( 5 ) }></div>
    `;
    expect( result ).is.equals( 5 );
    
    // 在 Class 指令中使用
    render( div )`
      <div :class=${ fn( 6 ) }></div>
    `;
    expect( result ).is.equals( 6 );
    
    // 在 Html 指令中使用
    render( div )`
      <div :html=${ fn( 7 ) }></div>
    `;
    expect( result ).is.equals( 7 );
    
    // // 在 Model 指令中使用
    // render( div )`
    //   <div :model=${ fn( 8 ) }></div>
    // `;
    // expect( result ).is.equals( 8 );
    
    // 在 Show 指令中使用
    render( div )`
      <div :show=${ fn( 9 ) }></div>
    `;
    expect( result ).is.equals( 9 );
    
    // 在 Style 指令中使用
    render( div )`
      <div :style=${ fn( 10 ) }></div>
    `;
    expect( result ).is.equals( 10 );
    
    // 在 Text 指令中使用
    render( div )`
      <div :text=${ fn( 11 ) }></div>
    `;
    expect( result ).is.equals( 11 );
  });

  // it( 'Hu.directiveFn: 注册的指令方法在不同地方的使用 ( 在 render 中使用 )', () => {
  //   let result;
  //   const fn = Hu.directiveFn( class{
  //     commit( value ){
  //       result = value;
  //     }
  //   });

  //   Hu.render(
  //     fn( 123 ),
  //     div
  //   );
  //   expect( result ).is.equals( 123 );
  // });

  // it( 'Hu.directiveFn: 注册的指令方法在不同地方的使用 ( 在指令中使用 )', () => {
  //   let result;
  //   const fn = Hu.directiveFn( class{
  //     commit( value ){
  //       result = value;
  //     }
  //   });

  //   Hu.render( div )`
  //     <div :text=${ fn( 123 ) }></div>
  //   `;
  //   expect( result ).is.equals( 123 );
  // });

  // it( 'Hu.directiveFn: 注册的指令方法在不同地方的使用 ( 在模板中使用 )', () => {
  //   let result;
  //   const fn = Hu.directiveFn( class{
  //     commit( value ){
  //       result = value;
  //     }
  //   });

  //   Hu.render( div )`
  //     <div>${ fn( 123 ) }</div>
  //   `;
  //   expect( result ).is.equals( 123 );
  // });

  // it( 'Hu.directiveFn: 注册的指令方法在不同地方的使用 ( 在数组中使用 )', () => {
  //   let result;
  //   const fn = Hu.directiveFn( class{
  //     commit( value ){
  //       result = value;
  //     }
  //   });

  //   Hu.render( div )`
  //     <div>${[ fn( 123 ) ]}</div>
  //   `;
  //   expect( result ).is.equals( 123 );
  // });

  // it( 'Hu.directiveFn: 注册的指令方法在不同地方的使用 ( 在 repeat 指令方法中使用 )', () => {
  //   let result;
  //   const fn = Hu.directiveFn( class{
  //     commit( value ){
  //       result = value;
  //     }
  //   });

  //   Hu.render( div )`
  //     <div>${
  //       Hu.html.repeat( [ 123 ], val => val, val => {
  //         return fn( val );
  //       })
  //     }</div>
  //   `;
  //   expect( result ).is.equals( 123 );
  // });

  // it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 render 中使用 )', () => {
  //   let commitIndex = 0;
  //   let destroyIndex = 0;
  //   const fn = Hu.directiveFn( class{
  //     commit( value ){
  //       commitIndex++;
  //     }
  //     destroy(){
  //       destroyIndex++;
  //     }
  //   });

  //   expect( commitIndex ).is.equals( 0 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render(
  //     fn( 123 ),
  //     div
  //   );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render(
  //     123,
  //     div
  //   );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   // ------

  //   Hu.render(
  //     fn( 456 ),
  //     div
  //   );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   Hu.render(
  //     456,
  //     div
  //   );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 2 );
  // });

  // it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在指令中使用 )', () => {
  //   let commitIndex = 0;
  //   let destroyIndex = 0;
  //   const fn = Hu.directiveFn( class{
  //     commit( value ){
  //       commitIndex++;
  //     }
  //     destroy(){
  //       destroyIndex++;
  //     }
  //   });

  //   expect( commitIndex ).is.equals( 0 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div :text=${ fn( 123 ) }></div>
  //   `;
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div></div>
  //   `;
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   // ------

  //   Hu.render(
  //     Hu.html`
  //       <div :text=${ fn( 456 ) }></div>
  //     `,
  //     div
  //   );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   Hu.render(
  //     Hu.html`
  //       <div></div>
  //     `,
  //     div
  //   );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 2 );
  // });

  // it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在模板中使用 )', () => {
  //   let commitIndex = 0;
  //   let destroyIndex = 0;
  //   const fn = Hu.directiveFn( class{
  //     commit( value ){
  //       commitIndex++;
  //     }
  //     destroy(){
  //       destroyIndex++;
  //     }
  //   });

  //   expect( commitIndex ).is.equals( 0 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${ fn( 123 ) }</div>
  //   `;
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div></div>
  //   `;
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   // ------

  //   Hu.render(
  //     Hu.html`
  //       <div>${ fn( 456 ) }</div>
  //     `,
  //     div
  //   );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   Hu.render(
  //     Hu.html`
  //       <div></div>
  //     `,
  //     div
  //   );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 2 );
  // });

  // it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在数组中使用 )', () => {
  //   let commitIndex = 0;
  //   let destroyIndex = 0;
  //   const fn = Hu.directiveFn( class{
  //     commit( value ){
  //       commitIndex++;
  //     }
  //     destroy(){
  //       destroyIndex++;
  //     }
  //   });

  //   expect( commitIndex ).is.equals( 0 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${[ fn( 123 ) ]}</div>
  //   `;
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div></div>
  //   `;
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   // ------

  //   Hu.render(
  //     Hu.html`
  //       <div>${[ fn( 456 ) ]}</div>
  //     `,
  //     div
  //   );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   Hu.render(
  //     Hu.html`
  //       <div></div>
  //     `,
  //     div
  //   );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 2 );
  // });

  // it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 repeat 指令方法中使用 )', () => {
  //   let commitIndex = 0;
  //   let destroyIndex = 0;
  //   const fn = Hu.directiveFn( class{
  //     commit( value ){
  //       commitIndex++;
  //     }
  //     destroy(){
  //       destroyIndex++;
  //     }
  //   });

  //   expect( commitIndex ).is.equals( 0 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${
  //       Hu.html.repeat( [ 123 ], val => val, val => {
  //         return fn( val );
  //       })
  //     }</div>
  //   `;
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div></div>
  //   `;
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   // ------

  //   Hu.render(
  //     Hu.html`
  //       <div>${
  //         Hu.html.repeat( [ 123 ], val => val, val => {
  //           return fn( val );
  //         })
  //       }</div>
  //     `,
  //     div
  //   );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 1 );

  //   Hu.render(
  //     Hu.html`
  //       <div></div>
  //     `,
  //     div
  //   );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 2 );
  // });

  // it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 插值内切换: 指令方法切换为非指令方法 )', () => {
  //   let commitIndex = 0;
  //   let destroyIndex = 0;
  //   const fn = Hu.directiveFn( class{
  //     commit( value ){
  //       commitIndex++;
  //     }
  //     destroy(){
  //       destroyIndex++;
  //     }
  //   });

  //   expect( commitIndex ).is.equals( 0 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${ fn( 123 ) }</div>
  //   `;
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${ 123 }</div>
  //   `;
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 1 );
  // });

  // it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 插值内切换: 非指令方法切换为指令方法 )', () => {
  //   let commitIndex = 0;
  //   let destroyIndex = 0;
  //   const fn = Hu.directiveFn( class{
  //     commit( value ){
  //       commitIndex++;
  //     }
  //     destroy(){
  //       destroyIndex++;
  //     }
  //   });

  //   expect( commitIndex ).is.equals( 0 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${ 123 }</div>
  //   `;
  //   expect( commitIndex ).is.equals( 0 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${ fn( 123 ) }</div>
  //   `;
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );
  // });

  // it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 插值内切换: 切换为其他指令方法 )', () => {
  //   let commitIndex1 = 0;
  //   let destroyIndex1 = 0;
  //   const fn1 = Hu.directiveFn( class{
  //     commit( value ){
  //       commitIndex1++;
  //     }
  //     destroy(){
  //       destroyIndex1++;
  //     }
  //   });

  //   let commitIndex2 = 0;
  //   let destroyIndex2 = 0;
  //   const fn2 = Hu.directiveFn( class{
  //     commit( value ){
  //       commitIndex2++;
  //     }
  //     destroy(){
  //       destroyIndex2++;
  //     }
  //   });

  //   expect( commitIndex1 ).is.equals( 0 );
  //   expect( destroyIndex1 ).is.equals( 0 );
  //   expect( commitIndex2 ).is.equals( 0 );
  //   expect( destroyIndex2 ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${ fn1( 123 ) }</div>
  //   `;
  //   expect( commitIndex1 ).is.equals( 1 );
  //   expect( destroyIndex1 ).is.equals( 0 );
  //   expect( commitIndex2 ).is.equals( 0 );
  //   expect( destroyIndex2 ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${ fn2( 123 ) }</div>
  //   `;
  //   expect( commitIndex1 ).is.equals( 1 );
  //   expect( destroyIndex1 ).is.equals( 1 );
  //   expect( commitIndex2 ).is.equals( 1 );
  //   expect( destroyIndex2 ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${ 123 }</div>
  //   `;
  //   expect( commitIndex1 ).is.equals( 1 );
  //   expect( destroyIndex1 ).is.equals( 1 );
  //   expect( commitIndex2 ).is.equals( 1 );
  //   expect( destroyIndex2 ).is.equals( 1 );
  // });

  // it( 'Hu.directiveFn: 注册的指令方法在被弃用时会触发对应 destroy 方法 ( 插值内切换: 切换为同样的指令方法 )', () => {
  //   let constructorIndex = 0;
  //   let commitIndex = 0;
  //   let destroyIndex = 0;
  //   const fn = Hu.directiveFn( class{
  //     constructor(){
  //       constructorIndex++
  //     }
  //     commit( value ){
  //       commitIndex++;
  //     }
  //     destroy(){
  //       destroyIndex++;
  //     }
  //   });

  //   expect( constructorIndex ).is.equals( 0 );
  //   expect( commitIndex ).is.equals( 0 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${ fn( 123 ) }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${ fn( 456 ) }</div>
  //   `;
  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 2 );
  //   expect( destroyIndex ).is.equals( 0 );
  // });

  // it( 'Hu.directiveFn: 注册指令方法时可以注册 proxy 静态方法来代理指令方法的使用步骤', () => {
  //   let constructorIndex = 0;
  //   let commitIndex = 0;
  //   let destroyIndex = 0;
  //   let staticUsingStep1Index = 0, staticUsingStep2Index = 0;
  //   const fn = Hu.directiveFn( class{
  //     constructor(){
  //       constructorIndex++
  //     }
  //     commit( value ){
  //       commitIndex++;
  //     }
  //     destroy(){
  //       destroyIndex++;
  //     }

  //     static proxy( using ){
  //       staticUsingStep1Index++;
  //       return ( part ) => {
  //         staticUsingStep2Index++;
  //         return using( part );
  //       }
  //     }
  //   });

  //   expect( constructorIndex ).is.equals( 0 );
  //   expect( commitIndex ).is.equals( 0 );
  //   expect( destroyIndex ).is.equals( 0 );
  //   expect( staticUsingStep1Index ).is.equals( 0 );
  //   expect( staticUsingStep2Index ).is.equals( 0 );

  //   const fn1 = fn( 1, 2, 3 );

  //   expect( constructorIndex ).is.equals( 0 );
  //   expect( commitIndex ).is.equals( 0 );
  //   expect( destroyIndex ).is.equals( 0 );
  //   expect( staticUsingStep1Index ).is.equals( 1 );
  //   expect( staticUsingStep2Index ).is.equals( 0 );

  //   Hu.render( div )`
  //     <div>${ fn1 }</div>
  //   `;

  //   expect( constructorIndex ).is.equals( 1 );
  //   expect( commitIndex ).is.equals( 1 );
  //   expect( destroyIndex ).is.equals( 0 );
  //   expect( staticUsingStep1Index ).is.equals( 1 );
  //   expect( staticUsingStep2Index ).is.equals( 1 );
  // });

  // it( 'Hu.directiveFn: 注册的指令方法可以在 constructor 中接收到使用该指令方法的指令', () => {
    
  // });

});