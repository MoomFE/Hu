import Hu from '../../../../src/build/index';
import { expect } from 'chai';


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

  it( 'Hu.directiveFn: 注册的指令方法可以定义 constructor 接收使用该指令方法的指令', () => {
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

  it( 'Hu.directiveFn: 注册的指令方法可以定义 commit 接收使用该指令方法时传的值', () => {
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

  it( 'Hu.directiveFn: 注册的指令方法可以定义 destroy 响应指令方法被注销的操作', () => {
    let result;
    let index = 0
    const fn = Hu.directiveFn( class {
      commit( value ){
        result = value;
      }
      destroy(){
        index++;
      }
    });

    // 在 Node 指令中使用
    render(
      fn(0),
      div
    );
    expect( result ).is.equals( 0 );
    expect( index ).is.equals( 0 );
    render( null, div )
    expect( result ).is.equals( 0 );
    expect( index ).is.equals( 1 );

    // 在 Attr 指令中使用
    render( div )`
      <div class=${ fn( 1 ) }></div>
    `;
    expect( result ).is.equals( 1 );
    expect( index ).is.equals( 1 );
    render( null, div )
    expect( result ).is.equals( 1 );
    expect( index ).is.equals( 2 );
    // 在 Attr 指令中使用
    render( div )`
      <div class="a ${ fn( 2 ) } b"></div>
    `;
    expect( result ).is.equals( 2 );
    expect( index ).is.equals( 2 );
    render( null, div )
    expect( result ).is.equals( 2 );
    expect( index ).is.equals( 3 );

    // 在 Boolean 指令中使用
    render( div )`
      <div ?disabled=${ fn( 3 ) }></div>
    `;
    expect( result ).is.equals( 3 );
    expect( index ).is.equals( 3 );
    render( null, div )
    expect( result ).is.equals( 3 );
    expect( index ).is.equals( 4 );

    // 在 Event 指令中使用
    render( div )`
      <div @click=${ fn( 4 ) }></div>
    `;
    expect( result ).is.equals( 4 );
    expect( index ).is.equals( 4 );
    render( null, div )
    expect( result ).is.equals( 4 );
    expect( index ).is.equals( 5 );

    // 在 Prop 指令中使用
    render( div )`
      <div .title=${ fn( 5 ) }></div>
    `;
    expect( result ).is.equals( 5 );
    expect( index ).is.equals( 5 );
    render( null, div )
    expect( result ).is.equals( 5 );
    expect( index ).is.equals( 6 );
    
    // 在 Class 指令中使用
    render( div )`
      <div :class=${ fn( 6 ) }></div>
    `;
    expect( result ).is.equals( 6 );
    expect( index ).is.equals( 6 );
    render( null, div )
    expect( result ).is.equals( 6 );
    expect( index ).is.equals( 7 );
    
    // 在 Html 指令中使用
    render( div )`
      <div :html=${ fn( 7 ) }></div>
    `;
    expect( result ).is.equals( 7 );
    expect( index ).is.equals( 7 );
    render( null, div )
    expect( result ).is.equals( 7 );
    expect( index ).is.equals( 8 );
    
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
    expect( index ).is.equals( 9 );
    render( null, div )
    expect( result ).is.equals( 9 );
    expect( index ).is.equals( 10 );
    
    // 在 Style 指令中使用
    render( div )`
      <div :style=${ fn( 10 ) }></div>
    `;
    expect( result ).is.equals( 10 );
    expect( index ).is.equals( 10 );
    render( null, div )
    expect( result ).is.equals( 10 );
    expect( index ).is.equals( 11 );
    
    // 在 Text 指令中使用
    render( div )`
      <div :text=${ fn( 11 ) }></div>
    `;
    expect( result ).is.equals( 11 );
    expect( index ).is.equals( 11 );
    render( null, div )
    expect( result ).is.equals( 11 );
    expect( index ).is.equals( 12 );
  });

  it( 'Hu.directiveFn: 注册的指令方法可以定义 proxy 静态方法以拦截指令使用步骤, 方法首个参数为原本指令使用步骤的方法', () => {
    let usingResult;
    const fn = Hu.directiveFn( class {
      commit(){}
      static proxy( using, args ){
        usingResult = using;
      }
    });

    expect( fn() ).is.equals( usingResult );
  });

  it( 'Hu.directiveFn: 注册的指令方法可以定义 proxy 静态方法以拦截指令使用步骤, 方法第二参数为使用指令方法时传入的参数数组', () => {
    let argsResult;
    const fn = Hu.directiveFn( class {
      commit(){}
      static proxy( using, args ){
        argsResult = args;
      }
    });

    fn( 123 );
    expect( argsResult ).is.deep.equals([ 123 ]);

    fn( 1, 2, 3 );
    expect( argsResult ).is.deep.equals([ 1, 2, 3 ]);
  });

  it( 'Hu.directiveFn: 注册的指令方法可以定义 proxy 静态方法以拦截指令使用步骤, 可以返回一个新的指令使用步骤的方法', () => {
    const newUsing = () => {};
    const fn = Hu.directiveFn( class {
      commit(){}
      static proxy( using, args ){
        return newUsing;
      }
    });

    expect( fn() ).is.equals( newUsing );
  });

  it( 'Hu.directiveFn: 注册的指令方法可以定义 proxy 静态方法以拦截指令使用步骤, 返回的方法会在指令使用步骤被调用', () => {
    let result;
    const newUsing = ( part ) => {
      result = part;
    };
    const fn = Hu.directiveFn( class {
      commit(){}
      static proxy( using, args ){
        return newUsing;
      }
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

});