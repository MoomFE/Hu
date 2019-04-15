describe( 'Hu.html.parts', () => {

  it( '正常对元素属性 ( Attribute ) 进行绑定', () => {
    const div = document.createElement('div');
    let attr = '123';

    Hu.render( div )`
      <div name=${ attr }></div>
    `;

    expect( div.firstElementChild.getAttribute('name') ).is.equals( attr );
  });

  it( '正常对元素属性 ( Attribute ) 进行绑定 ( 二 )', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div style="
        width: ${ 100 }px; height: ${ 200 }px;
        opacity: ${ 0.5 }
      "></div>
    `;

    expect( div.firstElementChild.style ).is.deep.include({
      width: '100px',
      height: '200px',
      opacity: 0.5
    });
  });

  it( '使用 .attr 的方式对元素属性 ( Property ) 进行绑定', () => {
    const div = document.createElement('div');
    const props = {
      a: 1,
      b: 2
    };

    Hu.render( div )`
      <div .props=${ props }></div>
    `;

    expect( div.firstElementChild.props ).is.equals( props );
    expect( div.firstElementChild.hasAttribute('props') ).is.false;

    Hu.render( div )`
      <div .props=${ div }></div>
    `;

    expect( div.firstElementChild.props ).is.equals( div );
    expect( div.firstElementChild.hasAttribute('props') ).is.false;

    Hu.render( div )`
      <div .props=${ 123 }></div>
    `;

    expect( div.firstElementChild.props ).is.equals( 123 );
    expect( div.firstElementChild.hasAttribute('props') ).is.false;
  });

  it( '使用 ?attr 的方式对元素属性 ( Attribute ) 进行绑定', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <input ?disabled=${ true } />
    `;

    expect( div.firstElementChild.hasAttribute('disabled') ).is.true;
    expect( div.firstElementChild.getAttribute('disabled') ).is.equals('');
    expect( div.firstElementChild.disabled ).is.true;

    Hu.render( div )`
      <input ?disabled=${ false } />
    `;

    expect( div.firstElementChild.hasAttribute('disabled') ).is.false;
    expect( div.firstElementChild.getAttribute('disabled') ).is.null;
    expect( div.firstElementChild.disabled ).is.false;
  });

  it( '使用 :class 的方式对元素 className 进行绑定 - 字符串方式', () => {
    const div = document.createElement('div');

    // 1
    Hu.render( div )`
      <div :class=${ 'a b c' }></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);

    // 2
    Hu.render( div )`
      <div class="a" :class=${ 'b c' }></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);
  });

  it( '使用 :class 的方式对元素 className 进行绑定 - JSON 方式', () => {
    const div = document.createElement('div');

    // 1
    Hu.render( div )`
      <div :class=${{ a: true, b: true, c: true }}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);

    // 2
    Hu.render( div )`
      <div :class=${{ a: true, b: false, c: true }}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'c' ]);

    // 3
    Hu.render( div )`
      <div class="a" :class=${{ b: true, c: true }}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);

    // 4
    Hu.render( div )`
      <div class="a" :class=${{ b: false, c: true }}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'c' ]);
  });

  it( '使用 :class 的方式对元素 className 进行绑定 - 数组方式', () => {
    const div = document.createElement('div');

    // 1
    Hu.render( div )`
      <div :class=${[ 'a', 'b', 'c' ]}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);

    // 2
    Hu.render( div )`
      <div :class=${[ { a: true }, 'b', { c: true } ]}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);

    // 3
    Hu.render( div )`
      <div :class=${[ 'a b', { c: false } ]}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b' ]);

    // 4
    Hu.render( div )`
      <div class="a" :class=${[ 'b', 'c' ]}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);

    // 5
    Hu.render( div )`
      <div class="a" :class=${[ 'b', { c: true } ]}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b', 'c' ]);

    // 6
    Hu.render( div )`
      <div class="a" :class=${[ 'b', { c: false } ]}></div>
    `;

    expect(
      Array.from( div.firstElementChild.classList )
    ).is.deep.equals([ 'a', 'b' ]);
  });

  it( '使用 :style 的方式对元素 style 进行绑定 - 字符串方式', () => {
    const div = document.createElement('div');

    // 1
    Hu.render( div )`
      <div :style=${ 'width: 100px; height: 120px' }></div>
    `;

    expect( div.firstElementChild.style ).is.deep.include({
      width: '100px',
      height: '120px'
    });

    // 2
    Hu.render( div )`
      <div style="width: 100px" :style=${ 'height: 120px' }></div>
    `;

    expect( div.firstElementChild.style ).is.deep.include({
      width: '100px',
      height: '120px'
    });
  });

  it( '使用 :style 的方式对元素 style 进行绑定 - JSON 方式', () => {
    var div = document.createElement('div');

    // 1
    Hu.render( div )`
      <div :style=${{ width: '100px', height: '120px' }}></div>
    `;

    expect( div.firstElementChild.style ).is.deep.include({
      width: '100px',
      height: '120px'
    });

    // 2
    Hu.render( div )`
      <div style="width: 100px" :style=${{ height: '120px' }}></div>
    `;

    expect( div.firstElementChild.style ).is.deep.include({
      width: '100px',
      height: '120px'
    });
  });

  it( '使用 :style 的方式对元素 style 进行绑定 - 数组方式', () => {
    var div = document.createElement('div');

    // 1
    Hu.render( div )`
      <div :style=${[ 'width: 100px', { height: '120px' } ]}></div>
    `;

    expect( div.firstElementChild.style ).is.deep.include({
      width: '100px',
      height: '120px'
    });

    // 2
    Hu.render( div )`
      <div style="width: 100px" :style=${[ { height: '120px' } ]}></div>
    `;

    expect( div.firstElementChild.style ).is.deep.include({
      width: '100px',
      height: '120px'
    });
  });

  it( '使用 :model 指令对 select 表单控件进行双向绑定', ( done ) => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        value: '12'
      },
      render( html ){
        return html`
          <select ref="select" :model=${[ this, 'value' ]}>
            <option value="1">11</option>
            <option value="12">1212</option>
            <option value="123">123123</option>
          </select>
        `;
      }
    });

    // 指令首次绑定会进行赋值
    expect( hu.value ).is.equals( '12' );
    expect( hu.$refs.select.value ).is.equals( '12' );
    expect( hu.$refs.select.options[1].selected ).is.true;

    // 控件值发生改变, 绑定值也会发生更改
    hu.$refs.select.options[ 0 ].selected = true;
    triggerEvent( hu.$refs.select, 'change' );
    expect( hu.value ).is.equals( '1' );
    expect( hu.$refs.select.value ).is.equals( '1' );
    expect( hu.$refs.select.options[0].selected ).is.true;

    hu.$refs.select.options[ 1 ].selected = true;
    triggerEvent( hu.$refs.select, 'change' );
    expect( hu.value ).is.equals( '12' );
    expect( hu.$refs.select.value ).is.equals( '12' );
    expect( hu.$refs.select.options[1].selected ).is.true;

    hu.$refs.select.options[ 2 ].selected = true;
    triggerEvent( hu.$refs.select, 'change' );
    expect( hu.value ).is.equals( '123' );
    expect( hu.$refs.select.value ).is.equals( '123' );
    expect( hu.$refs.select.options[2].selected ).is.true;

    // 绑定值发生改变, 控件值也会发生更改
    hu.value = '1';
    hu.$nextTick(() => {
      expect( hu.value ).is.equals( '1' );
      expect( hu.$refs.select.value ).is.equals( '1' );
      expect( hu.$refs.select.options[0].selected ).is.true;

      hu.value = '12';
      hu.$nextTick(() => {
        expect( hu.value ).is.equals( '12' );
        expect( hu.$refs.select.value ).is.equals( '12' );
        expect( hu.$refs.select.options[1].selected ).is.true;

        hu.value = '123';
        hu.$nextTick(() => {
          expect( hu.value ).is.equals( '123' );
          expect( hu.$refs.select.value ).is.equals( '123' );
          expect( hu.$refs.select.options[2].selected ).is.true;

          done();
        });
      });
    });
  });

  it( '使用 v-model 指令对 select 表单控件进行双向绑定 ( Vue )', ( done ) => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        value: '12'
      },
      template: `
        <select ref="select" v-model="value">
          <option value="1">11</option>
          <option value="12">1212</option>
          <option value="123">123123</option>
        </select>
      `
    });

    // 指令首次绑定会进行赋值
    expect( vm.value ).is.equals( '12' );
    expect( vm.$refs.select.value ).is.equals( '12' );
    expect( vm.$refs.select.options[1].selected ).is.true;

    // 控件值发生改变, 绑定值也会发生更改
    vm.$refs.select.options[ 0 ].selected = true;
    triggerEvent( vm.$refs.select, 'change' );
    expect( vm.value ).is.equals( '1' );
    expect( vm.$refs.select.value ).is.equals( '1' );
    expect( vm.$refs.select.options[0].selected ).is.true;

    vm.$refs.select.options[ 1 ].selected = true;
    triggerEvent( vm.$refs.select, 'change' );
    expect( vm.value ).is.equals( '12' );
    expect( vm.$refs.select.value ).is.equals( '12' );
    expect( vm.$refs.select.options[1].selected ).is.true;

    vm.$refs.select.options[ 2 ].selected = true;
    triggerEvent( vm.$refs.select, 'change' );
    expect( vm.value ).is.equals( '123' );
    expect( vm.$refs.select.value ).is.equals( '123' );
    expect( vm.$refs.select.options[2].selected ).is.true;

    // 绑定值发生改变, 控件值也会发生更改
    vm.value = '1';
    vm.$nextTick(() => {
      expect( vm.value ).is.equals( '1' );
      expect( vm.$refs.select.value ).is.equals( '1' );
      expect( vm.$refs.select.options[0].selected ).is.true;

      vm.value = '12';
      vm.$nextTick(() => {
        expect( vm.value ).is.equals( '12' );
        expect( vm.$refs.select.value ).is.equals( '12' );
        expect( vm.$refs.select.options[1].selected ).is.true;

        vm.value = '123';
        vm.$nextTick(() => {
          expect( vm.value ).is.equals( '123' );
          expect( vm.$refs.select.value ).is.equals( '123' );
          expect( vm.$refs.select.options[2].selected ).is.true;

          done();
        });
      });
    });
  });

  it( '使用 :model 指令对 input[type=checkbox] 表单控件进行双向绑定', ( done ) => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        value: true
      },
      render( html ){
        return html`
          <input ref="checkbox" type="checkbox" :model=${[ this, 'value' ]}>
        `;
      }
    });

    // 指令首次绑定会进行赋值
    expect( hu.value ).is.equals( true );
    expect( hu.$refs.checkbox.checked ).is.true;

    // 控件值发生改变, 绑定值也会发生更改
    hu.$refs.checkbox.checked = false;
    triggerEvent( hu.$refs.checkbox, 'change' );
    expect( hu.value ).is.equals( false );
    expect( hu.$refs.checkbox.checked ).is.false;

    hu.$refs.checkbox.checked = true;
    triggerEvent( hu.$refs.checkbox, 'change' );
    expect( hu.value ).is.equals( true );
    expect( hu.$refs.checkbox.checked ).is.true;

    // 绑定值发生改变, 控件值也会发生更改
    hu.value = false;
    hu.$nextTick(() => {
      expect( hu.$refs.checkbox.checked ).is.false;

      hu.value = true;
      hu.$nextTick(() => {
        expect( hu.$refs.checkbox.checked ).is.true;

        done();
      });
    });
  });

  it( '使用 v-model 指令对 input[type=checkbox] 表单控件进行双向绑定 ( Vue )', ( done ) => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        value: true
      },
      template: `
        <input ref="checkbox" type="checkbox" v-model="value">
      `
    });

    // 指令首次绑定会进行赋值
    expect( vm.value ).is.equals( true );
    expect( vm.$refs.checkbox.checked ).is.true;

    // 控件值发生改变, 绑定值也会发生更改
    vm.$refs.checkbox.checked = false;
    triggerEvent( vm.$refs.checkbox, 'change' );
    expect( vm.value ).is.equals( false );
    expect( vm.$refs.checkbox.checked ).is.false;

    vm.$refs.checkbox.checked = true;
    triggerEvent( vm.$refs.checkbox, 'change' );
    expect( vm.value ).is.equals( true );
    expect( vm.$refs.checkbox.checked ).is.true;

    // 绑定值发生改变, 控件值也会发生更改
    vm.value = false;
    vm.$nextTick(() => {
      expect( vm.$refs.checkbox.checked ).is.false;

      vm.value = true;
      vm.$nextTick(() => {
        expect( vm.$refs.checkbox.checked ).is.true;

        done();
      });
    });
  });

  it( '使用 :model 指令对 input[type=radio] 表单控件进行双向绑定', ( done ) => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        value: '12'
      },
      render( html ){
        return html`
          <input type="radio" value="1" :model=${[ this, 'value' ]}>
          <input type="radio" value="12" :model=${[ this, 'value' ]}>
          <input type="radio" value="123" :model=${[ this, 'value' ]}>
        `;
      }
    });

    // 指令首次绑定会进行赋值
    expect( hu.value ).is.equals( '12' );
    expect( hu.$el.querySelector(':nth-child(1)').checked ).is.false;
    expect( hu.$el.querySelector(':nth-child(2)').checked ).is.true;
    expect( hu.$el.querySelector(':nth-child(3)').checked ).is.false;

    // 控件值发生改变, 绑定值也会发生更改
    hu.$el.querySelector(':nth-child(1)').checked = true;
    triggerEvent( hu.$el.querySelector(':nth-child(1)'), 'change' );
    expect( hu.value ).is.equals( '1' );
    expect( hu.$el.querySelector(':nth-child(1)').checked ).is.true;
    expect( hu.$el.querySelector(':nth-child(2)').checked ).is.true;
    expect( hu.$el.querySelector(':nth-child(3)').checked ).is.false;
    hu.$nextTick(() => {
      expect( hu.value ).is.equals( '1' );
      expect( hu.$el.querySelector(':nth-child(1)').checked ).is.true;
      expect( hu.$el.querySelector(':nth-child(2)').checked ).is.false;
      expect( hu.$el.querySelector(':nth-child(3)').checked ).is.false;

      hu.$el.querySelector(':nth-child(2)').checked = true;
      triggerEvent( hu.$el.querySelector(':nth-child(2)'), 'change' );
      expect( hu.value ).is.equals( '12' );
      expect( hu.$el.querySelector(':nth-child(1)').checked ).is.true;
      expect( hu.$el.querySelector(':nth-child(2)').checked ).is.true;
      expect( hu.$el.querySelector(':nth-child(3)').checked ).is.false;
      hu.$nextTick(() => {
        expect( hu.value ).is.equals( '12' );
        expect( hu.$el.querySelector(':nth-child(1)').checked ).is.false;
        expect( hu.$el.querySelector(':nth-child(2)').checked ).is.true;
        expect( hu.$el.querySelector(':nth-child(3)').checked ).is.false;

        hu.$el.querySelector(':nth-child(3)').checked = true;
        triggerEvent( hu.$el.querySelector(':nth-child(3)'), 'change' );
        expect( hu.value ).is.equals( '123' );
        expect( hu.$el.querySelector(':nth-child(1)').checked ).is.false;
        expect( hu.$el.querySelector(':nth-child(2)').checked ).is.true;
        expect( hu.$el.querySelector(':nth-child(3)').checked ).is.true;
        hu.$nextTick(() => {
          expect( hu.value ).is.equals( '123' );
          expect( hu.$el.querySelector(':nth-child(1)').checked ).is.false;
          expect( hu.$el.querySelector(':nth-child(2)').checked ).is.false;
          expect( hu.$el.querySelector(':nth-child(3)').checked ).is.true;

          // 绑定值发生改变, 控件值也会发生更改
          hu.value = '1';
          hu.$nextTick(() => {
            expect( hu.$el.querySelector(':nth-child(1)').checked ).is.true;
            expect( hu.$el.querySelector(':nth-child(2)').checked ).is.false;
            expect( hu.$el.querySelector(':nth-child(3)').checked ).is.false;

            hu.value = '12';
            hu.$nextTick(() => {
              expect( hu.$el.querySelector(':nth-child(1)').checked ).is.false;
              expect( hu.$el.querySelector(':nth-child(2)').checked ).is.true;
              expect( hu.$el.querySelector(':nth-child(3)').checked ).is.false;

              hu.value = '123';
              hu.$nextTick(() => {
                expect( hu.$el.querySelector(':nth-child(1)').checked ).is.false;
                expect( hu.$el.querySelector(':nth-child(2)').checked ).is.false;
                expect( hu.$el.querySelector(':nth-child(3)').checked ).is.true;

                done();
              });
            });
          });
        });
      });
    });
  });

  it( '使用 v-model 指令对 input[type=radio] 表单控件进行双向绑定 ( Vue )', ( done ) => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        value: '12'
      },
      template: `
        <div>
          <input type="radio" value="1" v-model="value">
          <input type="radio" value="12" v-model="value">
          <input type="radio" value="123" v-model="value">
        </div>
      `
    });

    // 指令首次绑定会进行赋值
    expect( vm.value ).is.equals( '12' );
    expect( vm.$el.querySelector(':nth-child(1)').checked ).is.false;
    expect( vm.$el.querySelector(':nth-child(2)').checked ).is.true;
    expect( vm.$el.querySelector(':nth-child(3)').checked ).is.false;

    // 控件值发生改变, 绑定值也会发生更改
    vm.$el.querySelector(':nth-child(1)').checked = true;
    triggerEvent( vm.$el.querySelector(':nth-child(1)'), 'change' );
    expect( vm.value ).is.equals( '1' );
    expect( vm.$el.querySelector(':nth-child(1)').checked ).is.true;
    expect( vm.$el.querySelector(':nth-child(2)').checked ).is.true;
    expect( vm.$el.querySelector(':nth-child(3)').checked ).is.false;
    vm.$nextTick(() => {
      expect( vm.value ).is.equals( '1' );
      expect( vm.$el.querySelector(':nth-child(1)').checked ).is.true;
      expect( vm.$el.querySelector(':nth-child(2)').checked ).is.false;
      expect( vm.$el.querySelector(':nth-child(3)').checked ).is.false;

      vm.$el.querySelector(':nth-child(2)').checked = true;
      triggerEvent( vm.$el.querySelector(':nth-child(2)'), 'change' );
      expect( vm.value ).is.equals( '12' );
      expect( vm.$el.querySelector(':nth-child(1)').checked ).is.true;
      expect( vm.$el.querySelector(':nth-child(2)').checked ).is.true;
      expect( vm.$el.querySelector(':nth-child(3)').checked ).is.false;
      vm.$nextTick(() => {
        expect( vm.value ).is.equals( '12' );
        expect( vm.$el.querySelector(':nth-child(1)').checked ).is.false;
        expect( vm.$el.querySelector(':nth-child(2)').checked ).is.true;
        expect( vm.$el.querySelector(':nth-child(3)').checked ).is.false;

        vm.$el.querySelector(':nth-child(3)').checked = true;
        triggerEvent( vm.$el.querySelector(':nth-child(3)'), 'change' );
        expect( vm.value ).is.equals( '123' );
        expect( vm.$el.querySelector(':nth-child(1)').checked ).is.false;
        expect( vm.$el.querySelector(':nth-child(2)').checked ).is.true;
        expect( vm.$el.querySelector(':nth-child(3)').checked ).is.true;
        vm.$nextTick(() => {
          expect( vm.value ).is.equals( '123' );
          expect( vm.$el.querySelector(':nth-child(1)').checked ).is.false;
          expect( vm.$el.querySelector(':nth-child(2)').checked ).is.false;
          expect( vm.$el.querySelector(':nth-child(3)').checked ).is.true;

          // 绑定值发生改变, 控件值也会发生更改
          vm.value = '1';
          vm.$nextTick(() => {
            expect( vm.$el.querySelector(':nth-child(1)').checked ).is.true;
            expect( vm.$el.querySelector(':nth-child(2)').checked ).is.false;
            expect( vm.$el.querySelector(':nth-child(3)').checked ).is.false;

            vm.value = '12';
            vm.$nextTick(() => {
              expect( vm.$el.querySelector(':nth-child(1)').checked ).is.false;
              expect( vm.$el.querySelector(':nth-child(2)').checked ).is.true;
              expect( vm.$el.querySelector(':nth-child(3)').checked ).is.false;

              vm.value = '123';
              vm.$nextTick(() => {
                expect( vm.$el.querySelector(':nth-child(1)').checked ).is.false;
                expect( vm.$el.querySelector(':nth-child(2)').checked ).is.false;
                expect( vm.$el.querySelector(':nth-child(3)').checked ).is.true;

                done();
              });
            });
          });
        });
      });
    });
  });

  it( '使用 :model 指令对 input 表单控件进行双向绑定', ( done ) => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        value: '12'
      },
      render( html ){
        return html`
          <input ref="text" type="text" :model=${[ this, 'value' ]} />
        `;
      }
    });

    // 指令首次绑定会进行赋值
    expect( hu.value ).is.equals( '12' );
    expect( hu.$refs.text.value ).is.equals( '12' );

    // 控件值发生改变, 绑定值也会发生更改
    hu.$refs.text.value = '123';
    triggerEvent( hu.$refs.text, 'input' );
    expect( hu.value ).is.equals( '123' );

    hu.$refs.text.value = '1234';
    triggerEvent( hu.$refs.text, 'input' );
    expect( hu.value ).is.equals( '1234' );

    // 绑定值发生改变, 控件值也会发生更改
    hu.value = '12345';
    hu.$nextTick(() => {
      expect( hu.$refs.text.value ).is.equals( '12345' );

      done();
    });
  });

  it( '使用 v-model 指令对 input 表单控件进行双向绑定 ( Vue )', ( done ) => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        value: '12'
      },
      template: `
        <input ref="text" type="text" v-model="value" />
      `
    });

    // 指令首次绑定会进行赋值
    expect( vm.value ).is.equals( '12' );
    expect( vm.$refs.text.value ).is.equals( '12' );

    // 控件值发生改变, 绑定值也会发生更改
    vm.$refs.text.value = '123';
    triggerEvent( vm.$refs.text, 'input' );
    expect( vm.value ).is.equals( '123' );

    vm.$refs.text.value = '1234';
    triggerEvent( vm.$refs.text, 'input' );
    expect( vm.value ).is.equals( '1234' );

    // 绑定值发生改变, 控件值也会发生更改
    vm.value = '12345';
    vm.$nextTick(() => {
      expect( vm.$refs.text.value ).is.equals( '12345' );

      done();
    });
  });

  it( '使用 :model 指令对 textarea 表单控件进行双向绑定', ( done ) => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        value: '12'
      },
      render( html ){
        return html`
          <textarea ref="textarea" :model=${[ this, 'value' ]}></textarea>
        `;
      }
    });

    // 指令首次绑定会进行赋值
    expect( hu.value ).is.equals( '12' );
    expect( hu.$refs.textarea.value ).is.equals( '12' );

    // 控件值发生改变, 绑定值也会发生更改
    hu.$refs.textarea.value = '123';
    triggerEvent( hu.$refs.textarea, 'input' );
    expect( hu.value ).is.equals( '123' );

    hu.$refs.textarea.value = '1234';
    triggerEvent( hu.$refs.textarea, 'input' );
    expect( hu.value ).is.equals( '1234' );

    // 绑定值发生改变, 控件值也会发生更改
    hu.value = '12345';
    hu.$nextTick(() => {
      expect( hu.$refs.textarea.value ).is.equals( '12345' );

      done();
    });
  });

  it( '使用 v-model 指令对 textarea 表单控件进行双向绑定 ( Vue )', ( done ) => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        value: '12'
      },
      template: `
        <textarea ref="textarea" v-model="value"></textarea>
      `
    });

    // 指令首次绑定会进行赋值
    expect( vm.value ).is.equals( '12' );
    expect( vm.$refs.textarea.value ).is.equals( '12' );

    // 控件值发生改变, 绑定值也会发生更改
    vm.$refs.textarea.value = '123';
    triggerEvent( vm.$refs.textarea, 'input' );
    expect( vm.value ).is.equals( '123' );

    vm.$refs.textarea.value = '1234';
    triggerEvent( vm.$refs.textarea, 'input' );
    expect( vm.value ).is.equals( '1234' );

    // 绑定值发生改变, 控件值也会发生更改
    vm.value = '12345';
    vm.$nextTick(() => {
      expect( vm.$refs.textarea.value ).is.equals( '12345' );

      done();
    });
  });

  it( '使用 :model 指令对 input / textarea 表单控件进行双向绑定时, 不会受到输入法的影响', ( done ) => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        value: '12'
      },
      render( html ){
        return html`
          <input ref="text" type="text" :model=${[ this, 'value' ]} />
        `;
      }
    });

    expect( hu.value ).is.equals( '12' );
    expect( hu.$refs.text.value ).is.equals( '12' );

    hu.$refs.text.value = '1';
    triggerEvent( hu.$refs.text, 'input' );
    expect( hu.value ).is.equals( '1' );

    hu.$refs.text.value = '2';
    triggerEvent( hu.$refs.text, 'input' );
    expect( hu.value ).is.equals( '2' );

    triggerEvent( hu.$refs.text, 'compositionstart' );

    hu.$refs.text.value = '3';
    triggerEvent( hu.$refs.text, 'input' );
    expect( hu.value ).is.equals( '2' );

    hu.$refs.text.value = '4';
    triggerEvent( hu.$refs.text, 'input' );
    expect( hu.value ).is.equals( '2' );

    triggerEvent( hu.$refs.text, 'compositionend' );
    expect( hu.value ).is.equals( '4' );

    done();
  });

  it( '使用 v-model 指令对 input / textarea 表单控件进行双向绑定时, 不会受到输入法的影响 ( Vue )', ( done ) => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        value: '12'
      },
      template: `
        <input ref="text" type="text" v-model="value" />
      `
    });

    expect( vm.value ).is.equals( '12' );
    expect( vm.$refs.text.value ).is.equals( '12' );

    vm.$refs.text.value = '1';
    triggerEvent( vm.$refs.text, 'input' );
    expect( vm.value ).is.equals( '1' );

    vm.$refs.text.value = '2';
    triggerEvent( vm.$refs.text, 'input' );
    expect( vm.value ).is.equals( '2' );

    triggerEvent( vm.$refs.text, 'compositionstart' );

    vm.$refs.text.value = '3';
    triggerEvent( vm.$refs.text, 'input' );
    expect( vm.value ).is.equals( '2' );

    vm.$refs.text.value = '4';
    triggerEvent( vm.$refs.text, 'input' );
    expect( vm.value ).is.equals( '2' );

    triggerEvent( vm.$refs.text, 'compositionend' );
    expect( vm.value ).is.equals( '4' );

    done();
  });

  it( '使用 :model 指令时的绑定会在下次使用 render 时进行解绑', ( done ) => {
    const div = document.createElement('div');
    let input, textarea;

    const hu = new Hu({
      el: div,
      data: {
        renderInput: true,
        value: '0'
      },
      render( html ){
        if( this.renderInput ){
          return html`<input ref="input" :model=${[ this, 'value' ]} />`;
        }else{
          return html`<textarea ref="textarea" :model=${[ this, 'value' ]}></textarea>`;
        }
      }
    });

    input = hu.$refs.input;
    expect( hu.value ).is.equals('0');
    expect( input.value ).is.equals('0');

    hu.renderInput = false;
    hu.$nextTick(() => {
      textarea = hu.$refs.textarea;
      expect( hu.value ).is.equals('0');
      expect( textarea.value ).is.equals('0');

      hu.value = '1';
      hu.$nextTick(() => {
        expect( hu.value ).is.equals('1');
        expect( input.value ).is.equals('0');
        expect( textarea.value ).is.equals('1');

        done();
      });
    })
  });

  it( '使用 v-model 指令时的绑定会在下次使用 render 时进行解绑 ( Vue )', ( done ) => {
    const div = document.createElement('div');
    let input, textarea;

    const vm = new Vue({
      el: div,
      data: {
        renderInput: true,
        value: '0'
      },
      template: `
        <input v-if="renderInput" ref="input" v-model="value" />
        <textarea v-else ref="textarea" v-model="value"></textarea>
      `
    });

    input = vm.$refs.input;
    expect( vm.value ).is.equals('0');
    expect( input.value ).is.equals('0');

    vm.renderInput = false;
    vm.$nextTick(() => {
      textarea = vm.$refs.textarea;
      expect( vm.value ).is.equals('0');
      expect( textarea.value ).is.equals('0');

      vm.value = '1';
      vm.$nextTick(() => {
        expect( vm.value ).is.equals('1');
        expect( input.value ).is.equals('0');
        expect( textarea.value ).is.equals('1');

        done();
      });
    });
  });

  it( '使用 :model 指令时对观察者对象的依赖不会被 render 收集, 所以不会触发重新渲染', ( done ) => {
    let index = 0;
    const hu = new Hu({
      el: document.createElement('div'),
      data: {
        value: '1'
      },
      render( html ){
        index++;
        return html`
          <input ref="input" :model=${[ this, 'value' ]}>
        `;
      }
    });

    expect( index ).is.equals( 1 );
    expect( hu.$refs.input.value ).is.equals('1');

    hu.value = '2';
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( hu.$refs.input.value ).is.equals('2');

      hu.value = '3';
      hu.$nextTick(() => {
        expect( index ).is.equals( 1 );
        expect( hu.$refs.input.value ).is.equals('3');

        hu.$forceUpdate();
        hu.$forceUpdate();
        hu.$forceUpdate();

        expect( index ).is.equals( 4 );
        expect( hu.$refs.input.value ).is.equals('3');

        hu.value = '4';
        hu.$nextTick(() => {
          expect( index ).is.equals( 4 );
          expect( hu.$refs.input.value ).is.equals('4');

          hu.value = '5';
          hu.$nextTick(() => {
            expect( index ).is.equals( 4 );
            expect( hu.$refs.input.value ).is.equals('5');

            done();
          });
        });
      });
    });
  });

  it( '使用 :model 指令的自定义元素实例中, 自定义元素被从文档流移除后, 指令的绑定会被解绑', ( done ) => {
    const customName = window.customName;

    Hu.define( customName, {
      data: () => ({
        value: '1'
      }),
      render( html ){
        return html`
          <input ref="input" :model=${[ this, 'value' ]}>
        `;
      }
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    expect( hu.value ).is.equals( '1' );
    expect( hu.$refs.input.value ).is.equals( '1' );

    hu.value = '2'
    hu.$nextTick(() => {
      expect( hu.value ).is.equals( '2' );
      expect( hu.$refs.input.value ).is.equals( '2' );

      hu.$refs.input.value = '3';
      triggerEvent( hu.$refs.input, 'input' );

      expect( hu.value ).is.equals( '3' );
      expect( hu.$refs.input.value ).is.equals( '3' );

      custom.$remove();

      hu.value = '4';
      hu.$nextTick(() => {
        expect( hu.value ).is.equals( '4' );
        expect( hu.$refs.input.value ).is.equals( '3' );

        hu.$refs.input.value = '5';
        triggerEvent( hu.$refs.input, 'input' );

        expect( hu.value ).is.equals( '4' );
        expect( hu.$refs.input.value ).is.equals( '5' );

        custom.$appendTo( document.body );

        expect( hu.value ).is.equals( '4' );
        expect( hu.$refs.input.value ).is.equals( '4' );

        hu.value = '6';
        hu.$nextTick(() => {
          expect( hu.value ).is.equals( '6' );
          expect( hu.$refs.input.value ).is.equals( '6' );

          hu.$refs.input.value = '7';
          triggerEvent( hu.$refs.input, 'input' );

          expect( hu.value ).is.equals( '7' );
          expect( hu.$refs.input.value ).is.equals( '7' );

          custom.$remove();

          done();
        });
      });
    });
  });

  it( '使用 :model 指令的自定义元素实例中, 自定义元素被从文档流移除后又被加回文档流, 指令的绑定的值应该立即更新', ( done ) => {
    const customName = window.customName;
    let index = 0;

    Hu.define( customName, {
      data: () => ({
        value: '1'
      }),
      render( html ){
        index++;
        return html`
          <input ref="input" :model=${[ this, 'value' ]}>
        `;
      }
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    hu.value = '2';
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( hu.value ).is.equals( '2' );
      expect( hu.$refs.input.value ).is.equals( '2' );

      custom.$remove();

      hu.value = '3';
      hu.$nextTick(() => {
        expect( index ).is.equals( 1 );
        expect( hu.value ).is.equals( '3' );
        expect( hu.$refs.input.value ).is.equals( '2' );

        custom.$appendTo( document.body );

        expect( index ).is.equals( 2 );
        expect( hu.value ).is.equals( '3' );
        expect( hu.$refs.input.value ).is.equals( '3' );

        hu.value = '4';
        hu.$nextTick(() => {
          expect( index ).is.equals( 2 );
          expect( hu.value ).is.equals( '4' );
          expect( hu.$refs.input.value ).is.equals( '4' );

          custom.$remove();

          done();
        });
      });
    });
  });

  it( '使用 @event 的方式对元素事件进行绑定', () => {
    const div = document.createElement('div');
    let index = 0;

    Hu.render( div )`
      <div @click=${() => index++}></div>
    `;

    expect( index ).is.equals( 0 );

    div.firstElementChild.click();
    expect( index ).is.equals( 1 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );
  });

  it( '使用 @event 绑定事件, 重复渲染时不会绑定多余的事件', () => {
    const div = document.createElement('div');
    let index = 0;

    Hu.render( div )`
      <div @click=${() => index++}></div>
    `;
    Hu.render( div )`
      <div @click=${() => index++}></div>
    `;
    Hu.render( div )`
      <div @click=${() => index++}></div>
    `;

    expect( index ).is.equals( 0 );

    div.firstElementChild.click();
    expect( index ).is.equals( 1 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );
  });

  it( '使用 @event 绑定事件, 重复渲染时不会绑定多余的事件 ( 二 )', () => {
    const div = document.createElement('div');
    let index = 0;

    function listener(){
      index++
    }

    Hu.render( div )`
      <div @click=${ listener }></div>
    `;
    Hu.render( div )`
      <div @click=${ listener }></div>
    `;
    Hu.render( div )`
      <div @click=${ listener }></div>
    `;

    expect( index ).is.equals( 0 );

    div.firstElementChild.click();
    expect( index ).is.equals( 1 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );
  });

  it( '使用 @event 绑定事件, 重复渲染时移除事件后将不会再触发', () => {
    const div = document.createElement('div');
    let index = 0;

    Hu.render( div )`
      <div @click=${() => index++}></div>
    `;

    expect( index ).is.equals( 0 );

    div.firstElementChild.click();
    expect( index ).is.equals( 1 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );

    Hu.render( div )`
      <div></div>
    `;

    expect( index ).is.equals( 3 );

    div.firstElementChild.click();
    expect( index ).is.equals( 3 );

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect( index ).is.equals( 3 );
  });

  it( '使用 @event 绑定事件, 使用 .stop 修饰符可以停止冒泡', () => {
    const div = document.createElement('div');
    const result = [];
    const hu = new Hu({
      el: div,
      render( html ){
        return html`
          <div ref="none" @click=${() => result.push( 1 )}></div>
          <div ref="stop" @click.stop=${() => result.push( 2 )}></div>
        `;
      },
      mounted(){
        this.$el.addEventListener( 'click', () => {
          result.push( 0 );
        });
      }
    });

    expect( result ).is.deep.equals([ ]);

    div.click();
    div.click();
    expect( result ).is.deep.equals([ 0, 0 ]);

    hu.$refs.none.click();
    hu.$refs.none.click();
    expect( result ).is.deep.equals([ 0, 0, 1, 0, 1, 0 ]);

    hu.$refs.stop.click();
    hu.$refs.stop.click();
    expect( result ).is.deep.equals([ 0, 0, 1, 0, 1, 0, 2, 2 ]);
  });

  it( '使用 @event 绑定事件, 使用 .stop 修饰符可以停止冒泡 ( Vue )', () => {
    const div = document.createElement('div');
    const result = [];
    const vm = new Vue({
      el: div,
      template: `
        <div @click="method0">
          <div ref="none" @click="method1"></div>
          <div ref="stop" @click.stop="method2"></div>
        </div>
      `,
      methods: {
        method0(){
          result.push( 0 );
        },
        method1(){
          result.push( 1 );
        },
        method2(){
          result.push( 2 );
        }
      }
    });

    expect( result ).is.deep.equals([ ]);

    vm.$el.click();
    vm.$el.click();
    expect( result ).is.deep.equals([ 0, 0 ]);

    vm.$refs.none.click();
    vm.$refs.none.click();
    expect( result ).is.deep.equals([ 0, 0, 1, 0, 1, 0 ]);

    vm.$refs.stop.click();
    vm.$refs.stop.click();
    expect( result ).is.deep.equals([ 0, 0, 1, 0, 1, 0, 2, 2 ]);
  });

  it( '使用 @event 绑定事件, 使用 .prevent 修饰符可以阻止浏览器默认事件', () => {
    const div = document.createElement('div');
    let none;
    let prevent;

    const hu = new Hu({
      el: div,
      render( html ){
        return html`
          <input ref="none" type="checkbox" @click=${ this.noneClick }>
          <input ref="prevent" type="checkbox" @click.prevent=${ this.preventClick }>
        `;
      },
      methods: {
        noneClick( event ){
          none = event.defaultPrevented;
        },
        preventClick( event ){
          prevent = event.defaultPrevented;
        }
      }
    });

    expect( none ).is.undefined;
    expect( prevent ).is.undefined;

    hu.$refs.none.click();
    hu.$refs.prevent.click();

    expect( none ).is.false;
    expect( prevent ).is.true;
  });

  it( '使用 @event 绑定事件, 使用 .prevent 修饰符可以阻止浏览器默认事件 ( Vue )', () => {
    const div = document.createElement('div');
    let none;
    let prevent;

    const vm = new Vue({
      el: div,
      template: `
        <div>
          <input ref="none" type="checkbox" @click="noneClick">
          <input ref="prevent" type="checkbox" @click.prevent="preventClick">
        </div>
      `,
      methods: {
        noneClick( event ){
          none = event.defaultPrevented;
        },
        preventClick( event ){
          prevent = event.defaultPrevented;
        }
      }
    });

    expect( none ).is.undefined;
    expect( prevent ).is.undefined;

    vm.$refs.none.click();
    vm.$refs.prevent.click();

    expect( none ).is.false;
    expect( prevent ).is.true;
  });

  it( '使用 @event 绑定事件, 使用 .self 修饰符可以只在当前元素自身时触发事件时触发回调', () => {
    const div = document.createElement('div');
    const result = [];
    const hu = new Hu({
      el: div,
      render( html ){
        return html`
          <div ref="none" @click=${() => result.push( 0 )}>
            <span></span>
          </div>
          <div ref="self" @click.self=${() => result.push( 1 )}>
            <span></span>
          </div>
        `;
      }
    });

    expect( result ).is.deep.equals([ ]);

    hu.$refs.none.click();
    hu.$refs.self.click();
    hu.$refs.none.click();
    hu.$refs.self.click();
    expect( result ).is.deep.equals([ 0, 1, 0, 1 ]);

    hu.$refs.none.firstElementChild.click();
    hu.$refs.self.firstElementChild.click();
    hu.$refs.none.firstElementChild.click();
    hu.$refs.self.firstElementChild.click();
    expect( result ).is.deep.equals([ 0, 1, 0, 1, 0, 0 ]);
  });

  it( '使用 @event 绑定事件, 使用 .self 修饰符可以只在当前元素自身时触发事件时触发回调 ( Vue )', () => {
    const div = document.createElement('div');
    const result = [];
    const vm = new Vue({
      el: div,
      template: `
        <div>
          <div ref="none" @click="method0">
            <span></span>
          </div>
          <div ref="self" @click.self="method1">
            <span></span>
          </div>
        </div>
      `,
      methods: {
        method0(){
          result.push( 0 );
        },
        method1(){
          result.push( 1 );
        }
      }
    });

    expect( result ).is.deep.equals([ ]);

    vm.$refs.none.click();
    vm.$refs.self.click();
    vm.$refs.none.click();
    vm.$refs.self.click();
    expect( result ).is.deep.equals([ 0, 1, 0, 1 ]);

    vm.$refs.none.firstElementChild.click();
    vm.$refs.self.firstElementChild.click();
    vm.$refs.none.firstElementChild.click();
    vm.$refs.self.firstElementChild.click();
    expect( result ).is.deep.equals([ 0, 1, 0, 1, 0, 0 ]);
  });

  it( '使用 @event 绑定事件, 使用 .left / .middle / .right 修饰符限定鼠标按键', () => {
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

  it( '使用 @event 绑定事件, 使用 .left / .middle / .right 修饰符限定鼠标按键 ( Vue )', () => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        left: 0,
        middle: 0,
        right: 0
      },
      template: `
        <div>
          <div ref="left" @mousedown.left="left++">left</div>
          <div ref="middle" @mousedown.middle="middle++">middle</div>
          <div ref="right" @mousedown.right="right++">right</div>
        </div>
      `
    });

    expect( vm.left ).is.equals( 0 );
    triggerEvent( vm.$refs.left, 'mousedown', event => event.button = 0 );
    expect( vm.left ).is.equals( 1 );
    triggerEvent( vm.$refs.left, 'mousedown', event => event.button = 1 );
    expect( vm.left ).is.equals( 1 );
    triggerEvent( vm.$refs.left, 'mousedown', event => event.button = 2 );
    expect( vm.left ).is.equals( 1 );

    expect( vm.middle ).is.equals( 0 );
    triggerEvent( vm.$refs.middle, 'mousedown', event => event.button = 0 );
    expect( vm.middle ).is.equals( 0 );
    triggerEvent( vm.$refs.middle, 'mousedown', event => event.button = 1 );
    expect( vm.middle ).is.equals( 1 );
    triggerEvent( vm.$refs.middle, 'mousedown', event => event.button = 2 );
    expect( vm.middle ).is.equals( 1 );

    expect( vm.right ).is.equals( 0 );
    triggerEvent( vm.$refs.right, 'mousedown', event => event.button = 0 );
    expect( vm.right ).is.equals( 0 );
    triggerEvent( vm.$refs.right, 'mousedown', event => event.button = 1 );
    expect( vm.right ).is.equals( 0 );
    triggerEvent( vm.$refs.right, 'mousedown', event => event.button = 2 );
    expect( vm.right ).is.equals( 1 );
  });

  it( '使用 @event 绑定事件, 使用 .ctrl / .alt / .shift / .meta 修饰符限定键盘按键', () => {
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

  it( '使用 @event 绑定事件, 使用 .ctrl / .alt / .shift / .meta 修饰符限定键盘按键 ( Vue )', () => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        ctrl: 0,
        alt: 0,
        shift: 0,
        meta: 0
      },
      template: `
        <div>
          <div ref="ctrl" @mousedown.ctrl="ctrl++">ctrl</div>
          <div ref="alt" @mousedown.alt="alt++">alt</div>
          <div ref="shift" @mousedown.shift="shift++">shift</div>
          <div ref="meta" @mousedown.meta="meta++">meta</div>
        </div>
      `
    });

    expect( vm.ctrl ).is.equals( 0 );
    triggerEvent( vm.$refs.ctrl, 'mousedown', event => event.ctrlKey = true );
    expect( vm.ctrl ).is.equals( 1 );
    triggerEvent( vm.$refs.ctrl, 'mousedown', event => event.altKey = true );
    expect( vm.ctrl ).is.equals( 1 );
    triggerEvent( vm.$refs.ctrl, 'mousedown', event => event.shiftKey = true );
    expect( vm.ctrl ).is.equals( 1 );
    triggerEvent( vm.$refs.ctrl, 'mousedown', event => event.metaKey = true );
    expect( vm.ctrl ).is.equals( 1 );

    expect( vm.alt ).is.equals( 0 );
    triggerEvent( vm.$refs.alt, 'mousedown', event => event.ctrlKey = true );
    expect( vm.alt ).is.equals( 0 );
    triggerEvent( vm.$refs.alt, 'mousedown', event => event.altKey = true );
    expect( vm.alt ).is.equals( 1 );
    triggerEvent( vm.$refs.alt, 'mousedown', event => event.shiftKey = true );
    expect( vm.alt ).is.equals( 1 );
    triggerEvent( vm.$refs.alt, 'mousedown', event => event.metaKey = true );
    expect( vm.alt ).is.equals( 1 );

    expect( vm.shift ).is.equals( 0 );
    triggerEvent( vm.$refs.shift, 'mousedown', event => event.ctrlKey = true );
    expect( vm.shift ).is.equals( 0 );
    triggerEvent( vm.$refs.shift, 'mousedown', event => event.altKey = true );
    expect( vm.shift ).is.equals( 0 );
    triggerEvent( vm.$refs.shift, 'mousedown', event => event.shiftKey = true );
    expect( vm.shift ).is.equals( 1 );
    triggerEvent( vm.$refs.shift, 'mousedown', event => event.metaKey = true );
    expect( vm.shift ).is.equals( 1 );

    expect( vm.meta ).is.equals( 0 );
    triggerEvent( vm.$refs.meta, 'mousedown', event => event.ctrlKey = true );
    expect( vm.meta ).is.equals( 0 );
    triggerEvent( vm.$refs.meta, 'mousedown', event => event.altKey = true );
    expect( vm.meta ).is.equals( 0 );
    triggerEvent( vm.$refs.meta, 'mousedown', event => event.shiftKey = true );
    expect( vm.meta ).is.equals( 0 );
    triggerEvent( vm.$refs.meta, 'mousedown', event => event.metaKey = true );
    expect( vm.meta ).is.equals( 1 );
  });

  it( '使用 @event 绑定事件, 使用 .exact 修饰符', () => {
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

  it( '使用 @event 绑定事件, 使用 .exact 修饰符 ( Vue )', () => {
    const div = document.createElement('div');
    const vm = new Vue({
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
      template: `
        <div>
          <!-- 不使用 -->
          <div ref="none" @mousedown="$data['none']++">exact</div>
          <!-- 单独使用 -->
          <div ref="exact" @mousedown.exact="$data['exact']++">exact</div>
          <!-- 单个使用 -->
          <div ref="ctrl.exact" @mousedown.ctrl.exact="$data['ctrl.exact']++">ctrl.exact</div>
          <div ref="alt.exact" @mousedown.alt.exact="$data['alt.exact']++">alt.exact</div>
          <div ref="shift.exact" @mousedown.shift.exact="$data['shift.exact']++">shift.exact</div>
          <div ref="meta.exact" @mousedown.meta.exact="$data['meta.exact']++">meta.exact</div>
          <!-- 多个使用 -->
          <div ref="ctrl.alt.exact" @mousedown.ctrl.alt.exact="$data['ctrl.alt.exact']++">ctrl.alt.exact</div>
          <div ref="ctrl.alt.shift.exact" @mousedown.ctrl.alt.shift.exact="$data['ctrl.alt.shift.exact']++">ctrl.alt.shift.exact</div>
          <div ref="ctrl.alt.shift.meta.exact" @mousedown.ctrl.alt.shift.meta="$data['ctrl.alt.shift.meta.exact']++">ctrl.alt.shift.meta.exact</div>
        </div>
      `
    });

    // 未使用 - 始终触发
    expect( vm['none'] ).is.equals( 0 );
    triggerEvent( vm.$refs['none'], 'mousedown' );
    expect( vm['none'] ).is.equals( 1 );
    triggerEvent( vm.$refs['none'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['none'] ).is.equals( 2 );
    triggerEvent( vm.$refs['none'], 'mousedown', event => event.altKey = true );
    expect( vm['none'] ).is.equals( 3 );
    triggerEvent( vm.$refs['none'], 'mousedown', event => event.shiftKey = true );
    expect( vm['none'] ).is.equals( 4 );
    triggerEvent( vm.$refs['none'], 'mousedown', event => event.metaKey = true );
    expect( vm['none'] ).is.equals( 5 );

    // 单独使用
    expect( vm['exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['exact'], 'mousedown' );
    expect( vm['exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['exact'], 'mousedown', event => event.altKey = true );
    expect( vm['exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['exact'] ).is.equals( 1 );

    // 单个使用 - ctrl
    expect( vm['ctrl.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.exact'], 'mousedown' );
    expect( vm['ctrl.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['ctrl.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.exact'], 'mousedown', event => event.altKey = true );
    expect( vm['ctrl.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['ctrl.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['ctrl.exact'] ).is.equals( 1 );
    // 单个使用 - alt
    expect( vm['alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['alt.exact'], 'mousedown' );
    expect( vm['alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['alt.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['alt.exact'], 'mousedown', event => event.altKey = true );
    expect( vm['alt.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['alt.exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['alt.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['alt.exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['alt.exact'] ).is.equals( 1 );
    // 单个使用 - shift
    expect( vm['shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['shift.exact'], 'mousedown' );
    expect( vm['shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['shift.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['shift.exact'], 'mousedown', event => event.altKey = true );
    expect( vm['shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['shift.exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['shift.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['shift.exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['shift.exact'] ).is.equals( 1 );
    // 单个使用 - meta
    expect( vm['meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['meta.exact'], 'mousedown' );
    expect( vm['meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['meta.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['meta.exact'], 'mousedown', event => event.altKey = true );
    expect( vm['meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['meta.exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['meta.exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['meta.exact'] ).is.equals( 1 );

    // 多个使用 - ctrl.alt.exact
    expect( vm['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown' );
    expect( vm['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => event.altKey = true );
    expect( vm['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['ctrl.alt.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.alt.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.exact'] ).is.equals( 1 );
    // 多个使用 - ctrl.alt.shift.exact
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown' );
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.altKey = true );
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 1 );
    triggerEvent( vm.$refs['ctrl.alt.shift.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.exact'] ).is.equals( 1 );
    // 多个使用 - ctrl.alt.shift.meta.exact
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown' );
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.ctrlKey = true );
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.altKey = true );
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.shiftKey = true );
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => event.metaKey = true );
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = false;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 0 );
    triggerEvent( vm.$refs['ctrl.alt.shift.meta.exact'], 'mousedown', event => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect( vm['ctrl.alt.shift.meta.exact'] ).is.equals( 1 );
  });

  it( '使用 @event 绑定事件, 使用 .capture 修饰符', () => {
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

  it( '使用 @event 绑定事件, 使用 .capture 修饰符 ( Vue )', () => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        none: [],
        capture: []
      },
      template: `
        <div>
          <div ref="none" @click="none.push(0)">
            <div @click="none.push(1)"></div>
          </div>
          <div ref="capture" @click.capture="capture.push(0)">
            <div @click="capture.push(1)"></div>
          </div>
        </div>
      `
    });

    expect( vm.none ).is.deep.equals([ ]);
    expect( vm.capture ).is.deep.equals([ ]);

    vm.$refs.none.firstElementChild.click();
    vm.$refs.capture.firstElementChild.click();

    expect( vm.none ).is.deep.equals([ 1, 0 ]);
    expect( vm.capture ).is.deep.equals([ 0, 1 ]);
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


    it( '使用 @event 绑定事件, 使用 .passive 修饰符', () => {
      const div = document.createElement('div');
      const hu = new Hu({
        el: div,
        render( html ){
          return html`
            <input type="checkbox" ref="none" @click=${ this.prevent }/>
            <input type="checkbox" ref="passive" @click.passive=${ this.prevent }/>
            <input type="checkbox" ref="exclusive" @click.prevent.passive=${() => {}}/>
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
  
    it( '使用 @event 绑定事件, 使用 .passive 修饰符 ( Vue )', () => {
      const div = document.createElement('div');

      errorStart();

      const vm = new Vue({
        el: div,
        template: `
          <div>
            <input type="checkbox" ref="none" @click="prevent"/>
            <input type="checkbox" ref="passive" @click.passive="prevent"/>
            <input type="checkbox" ref="exclusive" @click.prevent.passive/>
          </div>
        `,
        methods: {
          prevent( event ){
            event.preventDefault();
          }
        }
      });

      errorEnd();

      expect( vm.$refs.none.checked ).is.false;
      expect( vm.$refs.passive.checked ).is.false;
      expect( vm.$refs.exclusive.checked ).is.false;
      vm.$refs.none.click();
      vm.$refs.passive.click();
      vm.$refs.exclusive.click();
      expect( vm.$refs.none.checked ).is.false;
      expect( vm.$refs.passive.checked ).is.equals( supportsCheckboxCheckedPrevent );
      expect( vm.$refs.exclusive.checked ).is.equals( supportsCheckboxCheckedPrevent );
      expect( errorMsg ).is.include('passive and prevent can\'t be used together. Passive handler can\'t prevent default event.');
    });

  }

  it( '使用 @event 绑定事件, 使用 .once 修饰符', () => {
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

  it( '使用 @event 绑定事件, 使用 .once 修饰符 ( Vue )', () => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        none: 0,
        once: 0
      },
      template: `
        <div>
          <div ref="none" @click="none++"></div>
          <div ref="once" @click.once="once++"></div>
        </div>
      `
    });

    expect( vm.none ).is.equals( 0 );
    expect( vm.once ).is.equals( 0 );

    vm.$refs.none.click();
    expect( vm.none ).is.equals( 1 );

    vm.$refs.none.click();
    vm.$refs.none.click();
    expect( vm.none ).is.equals( 3 );

    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );

    vm.$refs.once.click();
    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发前重新渲染不会影响事件绑定', () => {
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

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发前重新渲染不会影响事件绑定 ( Vue )', () => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        once: 0
      },
      template: `
        <div ref="once" @click.once="once++"></div>
      `
    });

    expect( vm.once ).is.equals( 0 );

    vm.$forceUpdate();
    vm.$forceUpdate();

    expect( vm.once ).is.equals( 0 );

    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );

    vm.$refs.once.click();
    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发后重新渲染不会影响事件绑定', () => {
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

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发后重新渲染不会影响事件绑定 ( Vue )', () => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        once: 0
      },
      template: `
        <div ref="once" @click.once="once++"></div>
      `
    });

    expect( vm.once ).is.equals( 0 );

    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );

    vm.$refs.once.click();
    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );

    vm.$forceUpdate();
    vm.$forceUpdate();

    expect( vm.once ).is.equals( 1 );

    vm.$refs.once.click();
    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发前不允许对绑定的事件进行替换', ( done ) => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        change: true,
        once: 0
      },
      render( html ){
        return html`
          <div ref="once" @click.once=${ this.change ? this.once1 : this.once2 }></div>
        `;
      },
      methods: {
        once1(){ this.once++ },
        once2(){ this.once+=2 }
      }
    });

    expect( hu.once ).is.equals( 0 );

    hu.change = false;
    hu.$nextTick(() => {
      expect( hu.once ).is.equals( 0 );

      hu.$refs.once.click();
      expect( hu.once ).is.equals( 1 );

      hu.$refs.once.click();
      hu.$refs.once.click();
      expect( hu.once ).is.equals( 1 );

      done();
    });
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发前不允许对绑定的事件进行替换 ( Vue )', ( done ) => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        change: true,
        once: 0
      },
      render( create ){
        return create( 'div', {
          on: {
            '~click': this.change ? this.once1 : this.once2
          },
          ref: 'once'
        });
      },
      methods: {
        once1(){ this.once++ },
        once2(){ this.once+=2 }
      }
    });

    expect( vm.once ).is.equals( 0 );

    vm.change = false;
    vm.$nextTick(() => {
      expect( vm.once ).is.equals( 0 );

      vm.$refs.once.click();
      expect( vm.once ).is.equals( 1 );

      vm.$refs.once.click();
      vm.$refs.once.click();
      expect( vm.once ).is.equals( 1 );

      done();
    });
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发后不允许对绑定的事件进行替换', ( done ) => {
    const div = document.createElement('div');
    const hu = new Hu({
      el: div,
      data: {
        change: true,
        once: 0
      },
      render( html ){
        return html`
          <div ref="once" @click.once=${ this.change ? this.once1 : this.once2 }></div>
        `;
      },
      methods: {
        once1(){ this.once++ },
        once2(){ this.once+=2 }
      }
    });

    expect( hu.once ).is.equals( 0 );

    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );

    hu.$refs.once.click();
    hu.$refs.once.click();
    expect( hu.once ).is.equals( 1 );

    hu.change = false;
    hu.$nextTick(() => {
      expect( hu.once ).is.equals( 1 );

      hu.$refs.once.click();
      expect( hu.once ).is.equals( 1 );

      hu.$refs.once.click();
      hu.$refs.once.click();
      expect( hu.once ).is.equals( 1 );

      done();
    });
  });

  it( '使用 @event 绑定事件, 使用 .once 修饰符绑定时, 触发后不允许对绑定的事件进行替换 ( Vue )', ( done ) => {
    const div = document.createElement('div');
    const vm = new Vue({
      el: div,
      data: {
        change: true,
        once: 0
      },
      render( create ){
        return create( 'div', {
          on: {
            '~click': this.change ? this.once1 : this.once2
          },
          ref: 'once'
        });
      },
      methods: {
        once1(){ this.once++ },
        once2(){ this.once+=2 }
      }
    });

    expect( vm.once ).is.equals( 0 );

    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );

    vm.$refs.once.click();
    vm.$refs.once.click();
    expect( vm.once ).is.equals( 1 );

    vm.change = false;
    vm.$nextTick(() => {
      expect( vm.once ).is.equals( 1 );

      vm.$refs.once.click();
      expect( vm.once ).is.equals( 1 );

      vm.$refs.once.click();
      vm.$refs.once.click();
      expect( vm.once ).is.equals( 1 );

      done();
    });
  });

  it( '使用不存在的指令, 将会被当做普通属性处理', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :zhang-wei=${ 666 }></div>
    `;

    expect( div.firstElementChild.getAttribute(':zhang-wei') ).equals('666');
  });

});