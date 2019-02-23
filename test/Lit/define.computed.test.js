describe( 'Lit.define - computed', () => {

  it( '在 $lit 实例下会创建 $computed 对象, 存放所有的计算属性', () => {
    const customName = window.customName;

    Lit.define( customName, {
      computed: {
        a(){ return 123 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit )
      .has.property( '$computed' )
      .that.is.deep.equals({ a: 123 });
  });

  it( '计算属性在依赖于创建了观察者的目标对象时, 目标对象被更改, 计算属性自动更新 ( 一 )', () => {
    const customName = window.customName;

    Lit.define( customName, {
      data(){
        return {
          a: 1,
          b: 2
        };
      },
      computed: {
        c(){
          return this.a + this.b;
        }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit.$computed ).has.property( 'c' ).that.is.equals( 3 );

    lit.a = 2;

    expect( lit.$computed ).has.property( 'c' ).that.is.equals( 4 );

    lit.b = 998;

    expect( lit.$computed ).has.property( 'c' ).that.is.equals( 1000 );
  });

  it( '计算属性在依赖于创建了观察者的目标对象时, 目标对象被更改, 计算属性自动更新 ( 二 )', () => {
    const customName = window.customName;
    const data = Lit.observable({
      a: 1,
      b: 2
    });

    Lit.define( customName, {
      computed: {
        c(){
          return data.a + data.b;
        }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( lit.$computed ).has.property( 'c' ).that.is.equals( 3 );

    data.a = 2;

    expect( lit.$computed ).has.property( 'c' ).that.is.equals( 4 );

    data.b = 998;

    expect( lit.$computed ).has.property( 'c' ).that.is.equals( 1000 );
  });

  it( '未访问过计算属性, 计算属性不会自动计算依赖', () => {
    const customName = window.customName;
    let isComputed = false

    Lit.define( customName, {
      computed: {
        a(){ isComputed = true }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( isComputed ).is.false;

    lit.$computed.a;

    expect( isComputed ).is.true;
  });

  it( '多次访问计算属性, 只有第一次会触发计算属性的 getter', () => {
    const customName = window.customName;
    let index = 0;

    Lit.define( customName, {
      computed: {
        a(){
          index++;
          return 123;
        }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const lit = custom.$lit;

    expect( index ).is.equals( 0 );

    expect( lit.$computed.a ).is.equals( 123 );
    expect( index ).is.equals( 1 );

    expect( lit.$computed.a ).is.equals( 123 );
    expect( lit.$computed.a ).is.equals( 123 );
    expect( lit.$computed.a ).is.equals( 123 );
    expect( lit.$computed.a ).is.equals( 123 );
    expect( lit.$computed.a ).is.equals( 123 );
    expect( lit.$computed.a ).is.equals( 123 );
    expect( index ).is.equals( 1 );
  });

});