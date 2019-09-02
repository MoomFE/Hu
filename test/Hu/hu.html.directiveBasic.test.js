describe( 'Hu.html.directiveBasic', () => {














  it( '使用 @event 的方式对元素绑定事件监听, 使用 .left / .middle / .right 修饰符限定鼠标按键', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        left: 0,
        middle: 0,
        right: 0
      },
      render( html ){
        return html`
          <div ref="left" @mousedown.left=${() => this.left++}>left</div>
          <div ref="middle" @mousedown.middle=${() => this.middle++}>middle</div>
          <div ref="right" @mousedown.right=${() => this.right++}>right</div>
        `;
      }
    });

    expect( hu.left ).is.equals( 0 );
    triggerEvent( hu.$refs.left, 'mousedown', event => event.button = 0 );
    expect( hu.left ).is.equals( 1 );
    triggerEvent( hu.$refs.left, 'mousedown', event => event.button = 1 );
    expect( hu.left ).is.equals( 1 );
    triggerEvent( hu.$refs.left, 'mousedown', event => event.button = 2 );
    expect( hu.left ).is.equals( 1 );

    expect( hu.middle ).is.equals( 0 );
    triggerEvent( hu.$refs.middle, 'mousedown', event => event.button = 0 );
    expect( hu.middle ).is.equals( 0 );
    triggerEvent( hu.$refs.middle, 'mousedown', event => event.button = 1 );
    expect( hu.middle ).is.equals( 1 );
    triggerEvent( hu.$refs.middle, 'mousedown', event => event.button = 2 );
    expect( hu.middle ).is.equals( 1 );

    expect( hu.right ).is.equals( 0 );
    triggerEvent( hu.$refs.right, 'mousedown', event => event.button = 0 );
    expect( hu.right ).is.equals( 0 );
    triggerEvent( hu.$refs.right, 'mousedown', event => event.button = 1 );
    expect( hu.right ).is.equals( 0 );
    triggerEvent( hu.$refs.right, 'mousedown', event => event.button = 2 );
    expect( hu.right ).is.equals( 1 );
  });

  it( '使用 @event 的方式对元素绑定事件监听, 使用 .ctrl / .alt / .shift / .meta 修饰符限定键盘按键', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        ctrl: 0,
        alt: 0,
        shift: 0,
        meta: 0
      },
      render( html ){
        return html`
          <div ref="ctrl" @mousedown.ctrl=${() => this.ctrl++}>ctrl</div>
          <div ref="alt" @mousedown.alt=${() => this.alt++}>alt</div>
          <div ref="shift" @mousedown.shift=${() => this.shift++}>shift</div>
          <div ref="meta" @mousedown.meta=${() => this.meta++}>meta</div>
        `;
      }
    });

    expect( hu.ctrl ).is.equals( 0 );
    triggerEvent( hu.$refs.ctrl, 'mousedown', event => event.ctrlKey = true );
    expect( hu.ctrl ).is.equals( 1 );
    triggerEvent( hu.$refs.ctrl, 'mousedown', event => event.altKey = true );
    expect( hu.ctrl ).is.equals( 1 );
    triggerEvent( hu.$refs.ctrl, 'mousedown', event => event.shiftKey = true );
    expect( hu.ctrl ).is.equals( 1 );
    triggerEvent( hu.$refs.ctrl, 'mousedown', event => event.metaKey = true );
    expect( hu.ctrl ).is.equals( 1 );

    expect( hu.alt ).is.equals( 0 );
    triggerEvent( hu.$refs.alt, 'mousedown', event => event.ctrlKey = true );
    expect( hu.alt ).is.equals( 0 );
    triggerEvent( hu.$refs.alt, 'mousedown', event => event.altKey = true );
    expect( hu.alt ).is.equals( 1 );
    triggerEvent( hu.$refs.alt, 'mousedown', event => event.shiftKey = true );
    expect( hu.alt ).is.equals( 1 );
    triggerEvent( hu.$refs.alt, 'mousedown', event => event.metaKey = true );
    expect( hu.alt ).is.equals( 1 );

    expect( hu.shift ).is.equals( 0 );
    triggerEvent( hu.$refs.shift, 'mousedown', event => event.ctrlKey = true );
    expect( hu.shift ).is.equals( 0 );
    triggerEvent( hu.$refs.shift, 'mousedown', event => event.altKey = true );
    expect( hu.shift ).is.equals( 0 );
    triggerEvent( hu.$refs.shift, 'mousedown', event => event.shiftKey = true );
    expect( hu.shift ).is.equals( 1 );
    triggerEvent( hu.$refs.shift, 'mousedown', event => event.metaKey = true );
    expect( hu.shift ).is.equals( 1 );

    expect( hu.meta ).is.equals( 0 );
    triggerEvent( hu.$refs.meta, 'mousedown', event => event.ctrlKey = true );
    expect( hu.meta ).is.equals( 0 );
    triggerEvent( hu.$refs.meta, 'mousedown', event => event.altKey = true );
    expect( hu.meta ).is.equals( 0 );
    triggerEvent( hu.$refs.meta, 'mousedown', event => event.shiftKey = true );
    expect( hu.meta ).is.equals( 0 );
    triggerEvent( hu.$refs.meta, 'mousedown', event => event.metaKey = true );
    expect( hu.meta ).is.equals( 1 );
  });

  it( '使用 @event 的方式对元素绑定事件监听, 使用 .exact 修饰符', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        "none": 0,
        "exact": 0,
        "ctrl.exact": 0,
        "alt.exact": 0,
        "shift.exact": 0,
        "meta.exact": 0,
        "ctrl.alt.exact": 0,
        "ctrl.alt.shift.exact": 0,
        "ctrl.alt.shift.meta.exact": 0,
      },
      render( html ){
        return html`
          <!-- 不使用 -->
          <div ref="none" @mousedown=${() => this['none']++}>exact</div>
          <!-- 单独使用 -->
          <div ref="exact" @mousedown.exact=${() => this['exact']++}>exact</div>
          <!-- 单个使用 -->
          <div ref="ctrl.exact" @mousedown.ctrl.exact=${() => this['ctrl.exact']++}>ctrl.exact</div>
          <div ref="alt.exact" @mousedown.alt.exact=${() => this['alt.exact']++}>alt.exact</div>
          <div ref="shift.exact" @mousedown.shift.exact=${() => this['shift.exact']++}>shift.exact</div>
          <div ref="meta.exact" @mousedown.meta.exact=${() => this['meta.exact']++}>meta.exact</div>
          <!-- 多个使用 -->
          <div ref="ctrl.alt.exact" @mousedown.ctrl.alt.exact=${() => this['ctrl.alt.exact']++}>ctrl.alt.exact</div>
          <div ref="ctrl.alt.shift.exact" @mousedown.ctrl.alt.shift.exact=${() => this['ctrl.alt.shift.exact']++}>ctrl.alt.shift.exact</div>
          <div ref="ctrl.alt.shift.meta.exact" @mousedown.ctrl.alt.shift.meta.exact=${() => this['ctrl.alt.shift.meta.exact']++}>ctrl.alt.shift.meta.exact</div>
        `;
      }
    });

    // 未使用 - 始终触发
    expect( hu['none'] ).is.equals( 0 );
    triggerEvent( hu.$refs['none'], 'mousedown' );
    expect( hu['none'] ).is.equals( 1 );
    triggerEvent( hu.$refs['none'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['none'] ).is.equals( 2 );
    triggerEvent( hu.$refs['none'], 'mousedown', event => event.altKey = true );
    expect( hu['none'] ).is.equals( 3 );
    triggerEvent( hu.$refs['none'], 'mousedown', event => event.shiftKey = true );
    expect( hu['none'] ).is.equals( 4 );
    triggerEvent( hu.$refs['none'], 'mousedown', event => event.metaKey = true );
    expect( hu['none'] ).is.equals( 5 );

    // 单独使用
    expect( hu['exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['exact'], 'mousedown' );
    expect( hu['exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['exact'], 'mousedown', event => event.altKey = true );
    expect( hu['exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['exact'] ).is.equals( 1 );

    // 单个使用 - ctrl
    expect( hu['ctrl.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.exact'], 'mousedown' );
    expect( hu['ctrl.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['ctrl.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.exact'], 'mousedown', event => event.altKey = true );
    expect( hu['ctrl.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['ctrl.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['ctrl.exact'] ).is.equals( 1 );
    // 单个使用 - alt
    expect( hu['alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['alt.exact'], 'mousedown' );
    expect( hu['alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['alt.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['alt.exact'], 'mousedown', event => event.altKey = true );
    expect( hu['alt.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['alt.exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['alt.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['alt.exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['alt.exact'] ).is.equals( 1 );
    // 单个使用 - shift
    expect( hu['shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['shift.exact'], 'mousedown' );
    expect( hu['shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['shift.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['shift.exact'], 'mousedown', event => event.altKey = true );
    expect( hu['shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['shift.exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['shift.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['shift.exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['shift.exact'] ).is.equals( 1 );
    // 单个使用 - meta
    expect( hu['meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['meta.exact'], 'mousedown' );
    expect( hu['meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['meta.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['meta.exact'], 'mousedown', event => event.altKey = true );
    expect( hu['meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['meta.exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['meta.exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['meta.exact'] ).is.equals( 1 );

    // 多个使用 - ctrl.alt.exact
    expect( hu['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown' );
    expect( hu['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => event.altKey = true );
    expect( hu['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.exact'] ).is.equals( 1 );
    // 多个使用 - ctrl.alt.shift.exact
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown' );
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.altKey = true );
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 1 );
    triggerEvent( hu.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.exact'] ).is.equals( 1 );
    // 多个使用 - ctrl.alt.shift.meta.exact
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown' );
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.altKey = true );
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.shiftKey = true );
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.metaKey = true );
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( hu.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( hu['ctrl.alt.shift.meta.exact'] ).is.equals( 1 );
  });

  it( '使用 @event 的方式对元素绑定事件监听, 使用 .capture 修饰符', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        none: [],
        capture: []
      },
      render( html ){
        return html`
          <div ref="none" @click=${() => this.none.push(0)}>
            <div @click=${() => this.none.push(1)}></div>
          </div>
          <div ref="capture" @click.capture=${() => this.capture.push(0)}>
            <div @click=${() => this.capture.push(1)}></div>
          </div>
        `;
      }
    });

    expect( hu.none ).is.deep.equals([ ]);
    expect( hu.capture ).is.deep.equals([ ]);

    hu.$refs.none.firstElementChild.click();
    hu.$refs.capture.firstElementChild.click();

    expect( hu.none ).is.deep.equals([ 1, 0 ]);
    expect( hu.capture ).is.deep.equals([ 0, 1 ]);
  });

  if( supportsPassive ){
    let supportsCheckboxCheckedPrevent = false;

    {
      const input = document.createElement('input');

      input.setAttribute('type','checkbox');
      input.addEventListener(
        'click',
        ( event ) => {
          event.preventDefault()
        },
        { passive: true }
      );

      input.click();

      supportsCheckboxCheckedPrevent = input.checked;
    }


    it( '使用 @event 的方式对元素绑定事件监听, 使用 .passive 修饰符', () => {
      const div = document.createElement('div');
      const hu = new Hu({
        el: div,
        render( html ){
          return html`
            <input type="checkbox" ref="none" @click=${ this.prevent }>
            <input type="checkbox" ref="passive" @click.passive=${ this.prevent }>
            <input type="checkbox" ref="exclusive" @click.prevent.passive=${() => {}}>
          `;
        },
        methods: {
          prevent( event ){
            event.preventDefault();
          }
        }
      });

      expect( hu.$refs.none.checked ).is.false;
      expect( hu.$refs.passive.checked ).is.false;
      expect( hu.$refs.exclusive.checked ).is.false;
      hu.$refs.none.click();
      hu.$refs.passive.click();
      hu.$refs.exclusive.click();
      expect( hu.$refs.none.checked ).is.false;
      expect( hu.$refs.passive.checked ).is.equals( supportsCheckboxCheckedPrevent );
      expect( hu.$refs.exclusive.checked ).is.equals( supportsCheckboxCheckedPrevent );
    });

  }

  it( '使用 @event 的方式对元素绑定事件监听, 使用 .once 修饰符', () => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        none: 0,
        once: 0
      },
      render( html ){
        return html`
          <div ref="none" @click=${() => this.none++}></div>
          <div ref="once" @click.once=${() => this.once++}></div>
        `;
      }
    });

    expect( hu.none ).is.equals( 0 );
    expect( hu.once ).is.equals( 0 );

    hu.$refs.none.click();
    expect( hu.none ).is.equals( 1 );

    hu.$refs.none.click();
    hu.$refs.none.click();
    expect( hu.none ).is.equals( 3 );

    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );

    hu.$refs.once.click();
    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );
  });

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