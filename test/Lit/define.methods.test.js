describe( 'Lit.define - methods', () => {

  describe( '在 $lit 实例下会创建 $methods 对象, 存放所有的方法', () => {
    
    it( '定义的所有方法会在 $methods 内找到', () => {
      const customName = window.customName;

      Lit.define( customName, {
        methods: {
          a(){},
          b(){}
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const lit = custom.$lit;

      should.has( lit.$methods, 'a' );
      should.has( lit.$methods, 'b' );

      should.isFunction( lit.$methods.a );
      should.isFunction( lit.$methods.b );
    });

  });

});