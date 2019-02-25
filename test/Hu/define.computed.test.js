describe( 'Hu.define - computed', () => {

  it( '在 $hu 实例下会创建 $computed 对象, 存放所有的计算属性', () => {
    const customName = window.customName;

    Hu.define( customName, {
      computed: {
        a(){ return 123 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu )
      .has.property( '$computed' )
      .that.is.deep.equals({ a: 123 });
  });

  it( '首字母不为 $ 的计算属性可以在 $computed 和 $hu 下找到', () => {
    const customName = window.customName;

    Hu.define( customName, {
      computed: {
        a(){ return 1 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' ).that.is.equals( 1 );
    expect( hu.$computed ).has.property( 'a' ).that.is.equals( 1 );
  });

  it( '首字母为 $ 的计算属性可以在 $computed 下找到, 但是不能在 $hu 下找到', () => {
    const customName = window.customName;

    Hu.define( customName, {
      computed: {
        a(){ return 1 },
        $a(){ return 1 }
      }
    });

    const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu ).has.property( 'a' ).that.is.equals( 1 );
    expect( hu.$computed ).has.property( 'a' ).that.is.equals( 1 );

    expect( hu ).has.not.property( '$a' );
    expect( hu.$computed ).has.property( '$a' ).that.is.equals( 1 );
  });

  it( '未访问过计算属性, 计算属性不会自动运行其 getter', () => {
    const customName = window.customName;
    let isComputed = false

    Hu.define( customName, {
      computed: {
        a(){ isComputed = true }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( isComputed ).is.false;

    hu.a;

    expect( isComputed ).is.true;
  });

  it( '未访问过计算属性, 计算属性不会自动运行其 getter ( Vue )', () => {
    let isComputed = false

    const vm = new Vue({
      computed: {
        a(){ isComputed = true }
      }
    });

    expect( isComputed ).is.false;

    vm.a;

    expect( isComputed ).is.true;
  });

  it( '每次访问计算属性的 getter, 都会重新计算依赖', () => {
    const customName = window.customName;
    let index = 0;

    Hu.define( customName, {
      data: () => ({
        a: 1,
        b: 2
      }),
      computed: {
        c(){ return index ? this.b : this.a }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.c ).is.equals( 1 );

    hu.a = 11;
    expect( hu.c ).is.equals( 11 );

    hu.a = 111;
    expect( hu.c ).is.equals( 111 );

    index++
    expect( hu.c ).is.equals( 111 );

    hu.a = 1111;
    expect( hu.c ).is.equals( 2 );

    hu.a = 11111;
    expect( hu.c ).is.equals( 2 );

    hu.b = 22;
    expect( hu.c ).is.equals( 22 );

    hu.b = 222;
    expect( hu.c ).is.equals( 222 );

    index--;
    expect( hu.c ).is.equals( 222 );

    hu.b = 2222;
    expect( hu.c ).is.equals( 11111 );
  });

  it( '每次访问计算属性的 getter, 都会重新计算依赖 ( Vue )', () => {
    let index = 0;

    const vm = new Vue({
      data: () => ({
        a: 1,
        b: 2
      }),
      computed: {
        c(){ return index ? this.b : this.a }
      }
    });

    expect( vm.c ).is.equals( 1 );

    vm.a = 11;
    expect( vm.c ).is.equals( 11 );

    vm.a = 111;
    expect( vm.c ).is.equals( 111 );

    index++
    expect( vm.c ).is.equals( 111 );

    vm.a = 1111;
    expect( vm.c ).is.equals( 2 );

    vm.a = 11111;
    expect( vm.c ).is.equals( 2 );

    vm.b = 22;
    expect( vm.c ).is.equals( 22 );

    vm.b = 222;
    expect( vm.c ).is.equals( 222 );

    index--;
    expect( vm.c ).is.equals( 222 );

    vm.b = 2222;
    expect( vm.c ).is.equals( 11111 );
  });

  it( '若计算属性不依赖于创建了观察者的目标对象, 无论如何都只有第一次访问会触发计算属性的 getter', () => {
    const customName = window.customName;
    let index = 0;

    Hu.define( customName, {
      computed: {
        a(){
          index++;
          return 123;
        }
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( index ).is.equals( 0 );

    expect( hu.a ).is.equals( 123 );
    expect( index ).is.equals( 1 );

    expect( hu.a ).is.equals( 123 );
    expect( hu.a ).is.equals( 123 );
    expect( hu.a ).is.equals( 123 );
    expect( hu.a ).is.equals( 123 );
    expect( hu.a ).is.equals( 123 );
    expect( hu.a ).is.equals( 123 );
    expect( index ).is.equals( 1 );
  });

  it( '若计算属性不依赖于创建了观察者的目标对象, 无论如何都只有第一次访问会触发计算属性的 getter ( Vue )', () => {
    let index = 0;

    const vm = new Vue({
      computed: {
        a(){
          index++;
          return 123;
        }
      }
    });

    expect( index ).is.equals( 0 );

    expect( vm.a ).is.equals( 123 );
    expect( index ).is.equals( 1 );

    expect( vm.a ).is.equals( 123 );
    expect( vm.a ).is.equals( 123 );
    expect( vm.a ).is.equals( 123 );
    expect( vm.a ).is.equals( 123 );
    expect( vm.a ).is.equals( 123 );
    expect( vm.a ).is.equals( 123 );
    expect( index ).is.equals( 1 );
  });

});