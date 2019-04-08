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

  it( 'beforeCreate 生命周期回调: 实例初始化后被调用, 计算属性 computed 和数据监听 watch 还未初始化', () => {
    let isBeforeCreateRun = false;
    let isWatchRun = false;

    new Hu({
      mixins: [ options ],
      beforeCreate(){
        isBeforeCreateRun = true;

        expect( this ).has.property('a').is.equals( 1 );
        expect( this ).has.property('b').is.equals( 2 );
        expect( this ).has.property('c').is.a('function'); expect( this.c() ).is.equals( 3 );
        expect( this ).not.has.property('d');
        expect( isWatchRun ).is.false;
      },
      watch: {
        a: {
          immediate: true,
          handler: () => isWatchRun = true
        }
      }
    });

    expect( isBeforeCreateRun ).is.true;
    expect( isWatchRun ).is.true;
  });

  it( 'beforeCreate 生命周期回调: 实例初始化后被调用, 计算属性 computed 和数据监听 watch 还未初始化 ( 自定义元素 )', () => {
    const customName = window.customName;
    let isBeforeCreateRun = false;
    let isWatchRun = false;

    Hu.define( customName, {
      mixins: [ options ],
      beforeCreate(){
        isBeforeCreateRun = true;

        expect( this ).has.property('a').is.equals( 1 );
        expect( this ).has.property('b').is.equals( 2 );
        expect( this ).has.property('c').is.a('function'); expect( this.c() ).is.equals( 3 );
        expect( this ).not.has.property('d');
        expect( isWatchRun ).is.false;
      },
      watch: {
        a: {
          immediate: true,
          handler: () => isWatchRun = true
        }
      }
    });

    expect( isBeforeCreateRun ).is.false;
    expect( isWatchRun ).is.false;

    document.createElement( customName );

    expect( isBeforeCreateRun ).is.true;
    expect( isWatchRun ).is.true;
  });

  it( 'created 生命周期回调: 实例创建完成后被调用, 但是挂载还未开始', () => {
    let isCreatedRun = false;
    let isMountedRun = false;
    let isWatchRun = false;

    new Hu({
      el: document.createElement('div'),
      mixins: [ options ],
      created(){
        isCreatedRun = true;

        expect( this ).has.property('a').is.equals( 1 );
        expect( this ).has.property('b').is.equals( 2 );
        expect( this ).has.property('c').is.a('function'); expect( this.c() ).is.equals( 3 );
        expect( this ).has.property('d').is.equals( 4 );
        expect( isMountedRun ).is.false;
        expect( isWatchRun ).is.true;
      },
      mounted: () => isMountedRun = true,
      watch: {
        a: {
          immediate: true,
          handler: () => isWatchRun = true
        }
      }
    });

    expect( isCreatedRun ).is.true;
    expect( isMountedRun ).is.true;
    expect( isWatchRun ).is.true;
  });

  it( 'created 生命周期回调: 实例创建完成后被调用, 但是挂载还未开始 ( 自定义元素 )', () => {
    const customName = window.customName;
    let isCreatedRun = false;
    let isMountedRun = false;
    let isWatchRun = false;

    Hu.define( customName, {
      mixins: [ options ],
      created(){
        isCreatedRun = true;

        expect( this ).has.property('a').is.equals( 1 );
        expect( this ).has.property('b').is.equals( 2 );
        expect( this ).has.property('c').is.a('function'); expect( this.c() ).is.equals( 3 );
        expect( this ).has.property('d').is.equals( 4 );
        expect( isMountedRun ).is.false;
        expect( isWatchRun ).is.true;
      },
      mounted: () => isMountedRun = true,
      watch: {
        a: {
          immediate: true,
          handler: () => isWatchRun = true
        }
      }
    });

    expect( isCreatedRun ).is.false;
    expect( isMountedRun ).is.false;
    expect( isWatchRun ).is.false;

    document.createElement( customName ).$appendTo( document.body ).$remove();

    expect( isCreatedRun ).is.true;
    expect( isMountedRun ).is.true;
    expect( isWatchRun ).is.true;
  });

  it( 'beforeMount 声明周期回调: 首次挂载开始之前被调用', () => {
    let isBeforeMountRun = false;
    let isRenderRun = false;
    let index = 0;

    const hu = new Hu({
      render: () => {
        isRenderRun = true;

        expect( isBeforeMountRun ).is.true;
      },
      beforeMount: () => {
        index++;
        isBeforeMountRun = true;

        expect( isRenderRun ).is.false;
      }
    });

    expect( index ).is.equals( 0 );
    expect( isRenderRun ).is.false;
    expect( isBeforeMountRun ).is.false;

    hu.$mount(
      document.createElement('div')
    );

    expect( index ).is.equals( 1 );
    expect( isRenderRun ).is.true;
    expect( isBeforeMountRun ).is.true;

    hu.$mount(
      document.createElement('div')
    );

    expect( index ).is.equals( 1 );
    expect( isRenderRun ).is.true;
    expect( isBeforeMountRun ).is.true;
  });

  it( 'beforeMount 声明周期回调: 首次挂载开始之前被调用 ( 二 )', () => {
    let isBeforeMountRun = false;
    let isRenderRun = false;

    new Hu({
      el: document.createElement('div'),
      render: () => {
        isRenderRun = true;

        expect( isBeforeMountRun ).is.true;
      },
      beforeMount: () => {
        isBeforeMountRun = true;

        expect( isRenderRun ).is.false;
      }
    });

    expect( isRenderRun ).is.true;
    expect( isBeforeMountRun ).is.true;
  });

  it( 'beforeMount 声明周期回调: 首次挂载开始之前被调用 ( 二 ) ( Vue )', () => {
    let isBeforeMountRun = false;
    let isRenderRun = false;

    new Vue({
      el: document.createElement('div'),
      render: () => {
        isRenderRun = true;

        expect( isBeforeMountRun ).is.true;
      },
      beforeMount: () => {
        isBeforeMountRun = true;

        expect( isRenderRun ).is.false;
      }
    });

    expect( isRenderRun ).is.true;
    expect( isBeforeMountRun ).is.true;
  });

  it( 'beforeMount 声明周期回调: 首次挂载开始之前被调用 ( 自定义元素 )', () => {
    const customName = window.customName;
    let isBeforeMountRun = false;
    let isRenderRun = false;
    let index = 0;

    Hu.define( customName, {
      render: () => {
        isRenderRun = true;

        expect( isBeforeMountRun ).is.true;
      },
      beforeMount: () => {
        index++;
        isBeforeMountRun = true;

        expect( isRenderRun ).is.false;
      }
    });

    expect( index ).is.equals( 0 )
    expect( isRenderRun ).is.false;
    expect( isBeforeMountRun ).is.false;

    const custom = document.createElement( customName );

    expect( index ).is.equals( 0 )
    expect( isRenderRun ).is.false;
    expect( isBeforeMountRun ).is.false;

    custom.$appendTo( document.body );

    expect( index ).is.equals( 1 )
    expect( isRenderRun ).is.true;
    expect( isBeforeMountRun ).is.true;

    custom.$remove();

    expect( index ).is.equals( 1 )
    expect( isRenderRun ).is.true;
    expect( isBeforeMountRun ).is.true;

    custom.$appendTo( document.body );

    expect( index ).is.equals( 1 )
    expect( isRenderRun ).is.true;
    expect( isBeforeMountRun ).is.true;

    custom.$remove();
  });

  it( 'mounted 声明周期回调: 首次挂载之后被调用', () => {
    let isMountedRun = false;
    let isRenderRun = false;
    let index = 0;

    const hu = new Hu({
      render(){
        isRenderRun = true;

        expect( isMountedRun ).is.false;
      },
      mounted(){
        index++;
        isMountedRun = true;

        expect( isRenderRun ).is.true;
      }
    });

    expect( index ).is.equals( 0 );
    expect( isRenderRun ).is.false;
    expect( isMountedRun ).is.false;

    hu.$mount(
      document.createElement('div')
    );

    expect( index ).is.equals( 1 );
    expect( isRenderRun ).is.true;
    expect( isMountedRun ).is.true;

    hu.$mount(
      document.createElement('div')
    );

    expect( index ).is.equals( 1 );
    expect( isRenderRun ).is.true;
    expect( isMountedRun ).is.true;
  });

  it( 'mounted 声明周期回调: 首次挂载之后被调用 ( 二 )', () => {
    let isMountedRun = false;
    let isRenderRun = false;
    let index = 0;

    new Hu({
      el: document.createElement('div'),
      render(){
        isRenderRun = true;

        expect( isMountedRun ).is.false;
      },
      mounted(){
        index++;
        isMountedRun = true;

        expect( isRenderRun ).is.true;
      }
    });

    expect( index ).is.equals( 1 );
    expect( isRenderRun ).is.true;
    expect( isMountedRun ).is.true;
  });

  it( 'mounted 声明周期回调: 首次挂载之后被调用 ( 自定义元素 )', () => {
    const customName = window.customName;
    let isMountedRun = false;
    let isRenderRun = false;
    let index = 0;

    Hu.define( customName, {
      render(){
        expect( isMountedRun ).is.equals( isRenderRun );

        isRenderRun = true;
      },
      mounted(){
        index++;
        isMountedRun = true;

        expect( isRenderRun ).is.true;
      }
    });

    expect( index ).is.equals( 0 );
    expect( isRenderRun ).is.false;
    expect( isMountedRun ).is.false;

    const custom = document.createElement( customName );

    expect( index ).is.equals( 0 );
    expect( isRenderRun ).is.false;
    expect( isMountedRun ).is.false;

    custom.$appendTo( document.body );

    expect( index ).is.equals( 1 );
    expect( isRenderRun ).is.true;
    expect( isMountedRun ).is.true;

    custom.$remove();

    expect( index ).is.equals( 1 );
    expect( isRenderRun ).is.true;
    expect( isMountedRun ).is.true;

    custom.$appendTo( document.body );

    expect( index ).is.equals( 1 );
    expect( isRenderRun ).is.true;
    expect( isMountedRun ).is.true;

    custom.$remove();
  });

  it( '生命周期回调的 this 指向的都是当前实例', () => {
    const result = [];
    const returnSelf = function(){
      result.push( this );
    }

    const hu = new Hu({
      beforeCreate: returnSelf,
      created: returnSelf,
      beforeMount: returnSelf,
      mounted: returnSelf,
      beforeDestroy: returnSelf,
      destroyed: returnSelf
    });

    hu.$mount(
      document.createElement('div')
    );
    hu.$destroy();

    expect( result.length ).is.equals( 6 );
    expect([ ...new Set( result ) ]).is.deep.equals([ hu ]);
  });

  it( '生命周期回调触发后会同时触发 hook:name 的自定义事件', () => {
    const result = [];

    const hu = new Hu({
      beforeCreate(){
        this.$on('hook:beforeCreate', () => result.push('beforeCreate'));
        this.$on('hook:created', () => result.push('created'));
        this.$on('hook:beforeMount', () => result.push('beforeMount'));
        this.$on('hook:mounted', () => result.push('mounted'));
        this.$on('hook:beforeDestroy', () => result.push('beforeDestroy'));
        this.$on('hook:destroyed', () => result.push('destroyed'));
      }
    });

    hu.$mount(
      document.createElement('div')
    );
    hu.$destroy();

    expect( result.length ).is.equals( 6 );
    expect( result ).is.deep.equals([ 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeDestroy', 'destroyed' ]);
  });

});

