describe( 'Hu.html.directiveBasic', () => {

















  it( '使用 @event 的方式对元素绑定事件监听, 使用 .once 修饰符绑定时, 触发前重新渲染不会影响事件绑定', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        once: 0
      },
      render( html ){
        return html`
          <div ref="once" @click.once=${() => this.once++}></div>
        `;
      }
    });

    expect( hu.once ).is.equals( 0 );

    hu.$forceUpdate();
    hu.$forceUpdate();

    expect( hu.once ).is.equals( 0 );

    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );

    hu.$refs.once.click();
    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );
  });

  it( '使用 @event 的方式对元素绑定事件监听, 使用 .once 修饰符绑定时, 触发后重新渲染不会影响事件绑定', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        once: 0
      },
      render( html ){
        return html`
          <div ref="once" @click.once=${() => this.once++}></div>
        `;
      }
    });

    expect( hu.once ).is.equals( 0 );

    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );

    hu.$refs.once.click();
    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );

    hu.$forceUpdate();
    hu.$forceUpdate();

    expect( hu.once ).is.equals( 1 );

    hu.$refs.once.click();
    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );
  });

  it( '使用 @event 的方式对元素绑定事件监听且绑定对象是自定义元素, 则会用于监听自定义元素对应的实例中的自定义事件', () => {
    const customName = window.customName;
    const div = document.createElement('div');
    let index = 0;
    let result;

    Hu.define( customName );

    const row = [
      `<${ customName } @click=`,`></${ customName }>`
    ];

    row.row = Array.prototype.slice.apply( row );

    Hu.render( div )(
      row,
      function(){
        index++;
        result = [ ...arguments ];
      }
    );

    const custom = div.firstElementChild;
    const hu = custom.$hu;

    custom.click();
    expect( index ).is.equals( 0 );
    expect( result ).is.undefined;

    hu.$emit('click');
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ ]);

    hu.$emit( 'click', 1 );
    expect( index ).is.equals( 2 );
    expect( result ).is.deep.equals([ 1 ]);

    hu.$emit( 'click', 1, 2 );
    expect( index ).is.equals( 3 );
    expect( result ).is.deep.equals([ 1, 2 ]);
  });

  it( '使用 @event 的方式对元素绑定事件监听且绑定对象是自定义元素, 使用 .once 修饰符', () => {
    const customName = window.customName;
    const div = document.createElement('div');
    let index = 0;
    let result;

    Hu.define( customName );

    const row = [
      `<${ customName } @click.once=`,`></${ customName }>`
    ];

    row.row = Array.prototype.slice.apply( row );

    Hu.render( div )(
      row,
      function(){
        index++;
        result = [ ...arguments ];
      }
    );

    const custom = div.firstElementChild;
    const hu = custom.$hu;

    custom.click();
    expect( index ).is.equals( 0 );
    expect( result ).is.undefined;

    hu.$emit( 'click', 1 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1 ]);

    hu.$emit( 'click', 1, 2 );
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ 1 ]);
  });

  it( '使用 @event 的方式对元素绑定事件监听且绑定对象是自定义元素, 使用 .native 修饰符', () => {
    const customName = window.customName;
    const div = document.createElement('div');
    let index = 0;

    Hu.define( customName );

    const row = [
      `<${ customName } @click.native=`,`></${ customName }>`
    ];

    row.row = Array.prototype.slice.apply( row );

    Hu.render( div )(
      row,
      function(){
        index++;
      }
    );

    const custom = div.firstElementChild;
    const hu = custom.$hu;

    custom.click();
    expect( index ).is.equals( 1 );

    hu.$emit( 'click', 1 );
    expect( index ).is.equals( 1 );

    hu.$emit( 'click', 1, 2 );
    expect( index ).is.equals( 1 );

    custom.click();
    expect( index ).is.equals( 2 );

    custom.click();
    expect( index ).is.equals( 3 );
  });

});