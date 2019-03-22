describe( 'Hu.static', () => {

  it( 'Hu.observable 方法可以将传入对象转为观察者对象', ( done ) => {
    const data = Hu.observable({
      a: 1,
      b: 2
    });

    /* ------------------ 测试是否能被响应 ------------------ */
    let index = 0;
    const hu = new Hu({
      computed: {
        a: () => {
          index++
          return data.a + data.b;
        }
      },
      watch: {
        a(){}
      }
    });

    expect( index ).is.equals( 1 );

    data.a = 2;
    hu.$nextTick(() => {
      expect( index ).is.equals( 2 );
      done();
    });
  });

  it( 'Hu.observable 方法转换 JSON 格式类型, 确保转换完成后是有效的', ( done ) => {
    const data = Hu.observable({
      a: 1
    });

    // getter
    expect( data.a ).is.equals( 1 );

    // setter
    data.a = 2;
    expect( data.a ).is.equals( 2 );

    /* ------------------ 测试是否能被响应 ------------------ */
    let index = 0;
    const hu = new Hu({
      computed: {
        a: () => {
          index++;
          return data.a;
        }
      },
      watch: {
        a: () => {}
      }
    });

    expect( index ).is.equals( 1 );

    data.a = 3;
    hu.$nextTick(() => {
      expect( index ).is.equals( 2 );
      expect( data.a ).is.equals( 3 );

      done();
    });
  });

  it( 'Hu.observable 方法转换 Array 类型, 确保转换完成后是有效的', ( done ) => {
    const data = Hu.observable([
      1
    ]);

    // getter
    expect( data[ 0 ] ).is.equals( 1 );

    // setter
    data[ 0 ] = 2;
    expect( data[ 0 ] ).is.equals( 2 );

    /* ------------------ 测试是否能被响应 ------------------ */
    let index = 0;
    const hu = new Hu({
      computed: {
        a: () => {
          index++;
          return data[ 0 ];
        }
      },
      watch: {
        a: () => {}
      }
    });

    expect( index ).is.equals( 1 );

    data[ 0 ] = 3;
    hu.$nextTick(() => {
      expect( index ).is.equals( 2 );
      expect( data[ 0 ] ).is.equals( 3 );

      done();
    });
  });

  it( 'Hu.noConflict 方法可以释放 window.Hu 的控制权, 还原到导入框架前的状态', () => {
    const Hu = window.Hu;

    Hu.noConflict();
    expect( window.Hu ).is.undefined;

    window.Hu = Hu;
  });

  it( 'Hu.noConflict 方法的返回值始终是 Hu 对象本身', () => {
    const Hu = window.Hu;
    const result = Hu.noConflict();
    const result2 = Hu.noConflict();

    expect( result ).is.equals( Hu );
    expect( result2 ).is.equals( Hu );

    window.Hu = Hu;
  });

});