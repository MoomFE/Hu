describe( 'Hu.define - watch', () => {

  it( '使用 $watch 方法对一个函数的返回值进行监听, 类似于监听一个计算属性', () => {
    const customName = window.customName;
    let result;

    Hu.define( customName, {
      data: () => ({
        a: 1,
        b: 2
      })
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    hu.$watch(
      function(){
        return this.a + this.b;
      },
      ( value, oldValue ) => result = [ value, oldValue ],
      {
        immediate: true
      }
    );

    expect( result ).is.deep.equals([ 3, undefined ]);
  });

  it( '使用 $watch 方法对一个函数的返回值进行监听, 类似于监听一个计算属性( Vue )', () => {
    let result;

    const vm = new Vue({
      data: () => ({
        a: 1,
        b: 2
      })
    });

    vm.$watch(
      function(){
        return this.a + this.b;
      },
      ( value, oldValue ) => result = [ value, oldValue ],
      {
        immediate: true
      }
    );

    expect( result ).is.deep.equals([ 3, undefined ]);
  });

});