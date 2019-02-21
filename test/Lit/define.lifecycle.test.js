describe( 'Lit.define - lifecycle', () => {

  it( 'beforeMount 生命周期钩子会在自定义元素挂载开始之前被调用', () => {
    const customName = window.customName;
    let isBeforeMountRun = false;

    Lit.define( customName, {
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

    Lit.define( customName, {
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


});

