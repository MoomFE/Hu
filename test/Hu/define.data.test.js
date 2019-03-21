describe( 'Hu.define - data', () => {

  it( '使用自定义元素创建实例时, data 必须是 function 类型', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data: () => ({
        a: 1
      })
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$data ).is.deep.equals({ a: 1 });
  });

  it( '使用自定义元素创建实例时, data 若不是 function 类型, 将会被忽略', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data: {
        a: 1
      }
    });

    const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect( hu.$data ).is.empty;
  });

  it( '使用 new 创建的实例时, data 可以是 function 类型', () => {
    const hu = new Hu({
      data: () => ({
        a: 1
      })
    });

    expect( hu.$data ).is.deep.equals({ a: 1 });
  });

  it( '使用 new 创建的实例时, data 可以是 JSON', () => {
    const hu = new Hu({
      data: {
        a: 1
      }
    });

    expect( hu.$data ).is.deep.equals({ a: 1 });
  });

  it( '定义 data 若是 function 类型, function 的 this 指向是当前实例', () => {
    const hu = new Hu({
      data(){
        return {
          a: this
        };
      }
    });

    expect( hu.a ).is.equals( hu );
  });

});