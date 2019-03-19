describe( 'Hu.define - lifecycle', () => {

  const options = {
    props: {
      a: { default: 1 }
    },
    data: () => ({
      b: 2
    }),
    methods: {
      c: () => 3
    },
    computed: {
      d: () => 4
    }
  };


  it( 'beforeCreate 声明周期钩子会在实例初始化后立即调用, 但是 computed, watch 还未初始化', () => {
    const customName = window.customName;
    let isWatchRun = false;

    Hu.define( customName, Object.assign(
      {}, options, {
        beforeCreate(){
          expect( this ).has.property('a').that.is.equals( 1 );
          expect( this ).has.property('b').that.is.equals( 2 );
          expect( this ).has.property('c').that.is.a('function');
          expect( this.c() ).is.equals( 3 );
          expect( this ).has.not.property('d');
          expect( isWatchRun ).is.false;
        },
        watch: {
          a: {
            immediate: true,
            handler(){
              isWatchRun = true;
            }
          }
        }
      }
    ));

    document.createElement('div').$html(`<${ customName }></${ customName }>`);

    expect( isWatchRun ).is.true;
  });

  it( 'created 声明周期钩子会在实例创建完成后被立即调用, 但是挂载阶段还没开始', () => {
    const customName = window.customName;
    let isWatchRun = false;

    Hu.define( customName, Object.assign(
      {}, options, {
        created(){
          expect( this ).has.property('a').that.is.equals( 1 );
          expect( this ).has.property('b').that.is.equals( 2 );
          expect( this ).has.property('c').that.is.a('function');
          expect( this.c() ).is.equals( 3 );
          expect( this ).has.property('d').that.is.equals( 4 );
          expect( isWatchRun ).is.true;
        },
        watch: {
          a: {
            immediate: true,
            handler(){
              isWatchRun = true;
            }
          }
        }
      }
    ));

    document.createElement('div').$html(`<${ customName }></${ customName }>`);

    expect( isWatchRun ).is.true;
  });

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
    
    expect( isBeforeMountRun ).is.true;
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

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$forceUpdate ).is.a('function');
    expect( hu.$watch ).is.a('function');
  });

});

