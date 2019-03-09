describe( 'Hu.define - lifecycle', () => {

  it( 'beforeMount 生命周期钩子会在自定义元素挂载开始之前被调用', () => {
    const customName = window.customName;
    let isBeforeMountRun = false;

    Hu.define( customName, {
      beforeMount(){
        isBeforeMountRun = true;
      },
      render(){
        expect( isBeforeMountRun ).is.true;
      }
    });

    document.createElement('div')
      .$html(`<${ customName }></${ customName }>`)
      .$appendTo( document.body )
      .$remove();
  });

  it( 'mounted 生命周期钩子会在自定义元素挂载开始之后被调用', () => {
    const customName = window.customName;
    let isMountedRun = false;

    Hu.define( customName, {
      mounted(){
        isMountedRun = true;
      },
      render(){
        expect( isMountedRun ).is.false;
      }
    });

    document.createElement('div')
      .$html(`<${ customName }></${ customName }>`)
      .$appendTo( document.body )
      .$remove();

    expect( isMountedRun ).is.true;
  });

  it( '生命周期钩子的 this 指向的是 $hu', () => {
    const customName = window.customName;
    const self = [];
    const returnSelf = function(){ self.push( this ) };

    Hu.define( customName, {
      beforeMount: returnSelf,
      mounted: returnSelf,
      render(){}
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body );
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect([ ...new Set( self ) ]).deep.equals([ hu ]);

    div.$remove();
  });

  it( '在 beforeCreate 生命周期钩子运行时, 实例上的方法应该是已经初始化了的', () => {
    const customName = window.customName;

    Hu.define( customName, {
      beforeCreate(){
        expect( this.$forceUpdate ).is.a('function');
        expect( this.$watch ).is.a('function');
      }
    });

    document.createElement('div').$html(`<${ customName }></${ customName }>`)
  });

});

