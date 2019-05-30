describe( 'Hu.html.directive', () => {

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
      opacity: '0.5'
    });
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

  it( '使用 :model 指令的自定义元素实例中, 自定义元素被从文档流移除后, 指令的绑定会被解绑 ( input )', ( done ) => {
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

  it( '使用 :model 指令的自定义元素实例中, 自定义元素被从文档流移除后, 指令的绑定会被解绑 ( textarea )', ( done ) => {
    const customName = window.customName;

    Hu.define( customName, {
      data: () => ({
        value: '1'
      }),
      render( html ){
        return html`
          <textarea ref="input" :model=${[ this, 'value' ]}></textarea>
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

  it( '使用 :model 指令的自定义元素实例中, 自定义元素被从文档流移除后, 指令的绑定会被解绑 ( checkbox )', ( done ) => {
    const customName = window.customName;


    Hu.define( customName, {
      data: () => ({
        value: true
      }),
      render( html ){
        return html`
          <input ref="checkbox" type="checkbox" :model=${[ this, 'value' ]} />
        `;
      }
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    expect( hu.value ).is.equals( true );
    expect( hu.$refs.checkbox.checked ).is.equals( true );

    hu.value = false
    hu.$nextTick(() => {
      expect( hu.value ).is.equals( false );
      expect( hu.$refs.checkbox.checked ).is.equals( false );

      hu.$refs.checkbox.checked = true;
      triggerEvent( hu.$refs.checkbox, 'change' );

      expect( hu.value ).is.equals( true );
      expect( hu.$refs.checkbox.checked ).is.equals( true );

      custom.$remove();

      hu.value = false;
      hu.$nextTick(() => {
        expect( hu.value ).is.equals( false );
        expect( hu.$refs.checkbox.checked ).is.equals( true );

        triggerEvent( hu.$refs.checkbox, 'change' );

        expect( hu.value ).is.equals( false );
        expect( hu.$refs.checkbox.checked ).is.equals( true );

        custom.$appendTo( document.body );

        expect( hu.value ).is.equals( false );
        expect( hu.$refs.checkbox.checked ).is.equals( false );

        hu.value = true;
        hu.$nextTick(() => {
          expect( hu.value ).is.equals( true );
          expect( hu.$refs.checkbox.checked ).is.equals( true );

          hu.$refs.checkbox.checked = false;
          triggerEvent( hu.$refs.checkbox, 'change' );

          expect( hu.value ).is.equals( false );
          expect( hu.$refs.checkbox.checked ).is.equals( false );

          custom.$remove();

          done();
        });
      });
    });
  });

  it( '使用 :model 指令的自定义元素实例中, 自定义元素被从文档流移除后, 指令的绑定会被解绑 ( radio )', ( done ) => {
    const customName = window.customName;

    Hu.define( customName, {
      data: () => ({
        value: '1'
      }),
      render( html ){
        return html`
          <input ref="input" type="radio" value="1" :model=${[ this, 'value' ]}>
          <input ref="input" type="radio" value="12" :model=${[ this, 'value' ]}>
          <input ref="input" type="radio" value="123" :model=${[ this, 'value' ]}>
        `;
      }
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    expect( hu.value ).is.equals( '1' );
    expect( hu.$refs.input[0].checked ).is.equals( true );
    expect( hu.$refs.input[1].checked ).is.equals( false );
    expect( hu.$refs.input[2].checked ).is.equals( false );

    hu.value = '12'
    hu.$nextTick(() => {
      expect( hu.value ).is.equals( '12' );
      expect( hu.$refs.input[0].checked ).is.equals( false );
      expect( hu.$refs.input[1].checked ).is.equals( true );
      expect( hu.$refs.input[2].checked ).is.equals( false );

      hu.$refs.input[2].checked = true;
      triggerEvent( hu.$refs.input[2], 'change' );

      expect( hu.value ).is.equals( '123' );
      expect( hu.$refs.input[0].checked ).is.equals( false );
      expect( hu.$refs.input[1].checked ).is.equals( true );
      expect( hu.$refs.input[2].checked ).is.equals( true );
      hu.$nextTick(() => {
        expect( hu.value ).is.equals( '123' );
        expect( hu.$refs.input[0].checked ).is.equals( false );
        expect( hu.$refs.input[1].checked ).is.equals( false );
        expect( hu.$refs.input[2].checked ).is.equals( true );

        custom.$remove();
  
        hu.value = '1';
        hu.$nextTick(() => {
          expect( hu.value ).is.equals( '1' );
          expect( hu.$refs.input[0].checked ).is.equals( false );
          expect( hu.$refs.input[1].checked ).is.equals( false );
          expect( hu.$refs.input[2].checked ).is.equals( true );
  
          hu.$refs.input[1].checked = true;
          triggerEvent( hu.$refs.input[1], 'change' );
  
          expect( hu.value ).is.equals( '1' );
          expect( hu.$refs.input[0].checked ).is.equals( false );
          expect( hu.$refs.input[1].checked ).is.equals( true );
          expect( hu.$refs.input[2].checked ).is.equals( true );
          hu.$nextTick(() => {
            expect( hu.value ).is.equals( '1' );
            expect( hu.$refs.input[0].checked ).is.equals( false );
            expect( hu.$refs.input[1].checked ).is.equals( true );
            expect( hu.$refs.input[2].checked ).is.equals( true );
  
            custom.$appendTo( document.body );
    
            expect( hu.value ).is.equals( '1' );
            expect( hu.$refs.input[0].checked ).is.equals( true );
            expect( hu.$refs.input[1].checked ).is.equals( false );
            expect( hu.$refs.input[2].checked ).is.equals( false );
    
            hu.value = '12';
            hu.$nextTick(() => {
              expect( hu.value ).is.equals( '12' );
              expect( hu.$refs.input[0].checked ).is.equals( false );
              expect( hu.$refs.input[1].checked ).is.equals( true );
              expect( hu.$refs.input[2].checked ).is.equals( false );
    
              hu.$refs.input[2].checked = true;
              triggerEvent( hu.$refs.input[2], 'change' );
    
              expect( hu.value ).is.equals( '123' );
              expect( hu.$refs.input[0].checked ).is.equals( false );
              expect( hu.$refs.input[1].checked ).is.equals( true );
              expect( hu.$refs.input[2].checked ).is.equals( true );
              hu.$nextTick(() => {
                expect( hu.value ).is.equals( '123' );
                expect( hu.$refs.input[0].checked ).is.equals( false );
                expect( hu.$refs.input[1].checked ).is.equals( false );
                expect( hu.$refs.input[2].checked ).is.equals( true );
    
                custom.$remove();
      
                done();
              });
            });
          });
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

  it( '使用 :model 指令的自定义元素实例中, 自定义元素被从文档流移除后, 指令的绑定会被解绑 ( Select )', ( done ) => {
    const customName = window.customName;

    Hu.define( customName, {
      data: () => ({
        value: '1'
      }),
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

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    expect( hu.value ).is.equals( '1' );
    expect( hu.$refs.select.value ).is.equals( '1' );

    hu.value = '12'
    hu.$nextTick(() => {
      expect( hu.value ).is.equals( '12' );
      expect( hu.$refs.select.value ).is.equals( '12' );

      hu.$refs.select.value = '123';
      triggerEvent( hu.$refs.select, 'change' );

      expect( hu.value ).is.equals( '123' );
      expect( hu.$refs.select.value ).is.equals( '123' );

      custom.$remove();

      hu.value = '1';
      hu.$nextTick(() => {
        expect( hu.value ).is.equals( '1' );
        expect( hu.$refs.select.value ).is.equals( '123' );

        hu.$refs.select.value = '12';
        triggerEvent( hu.$refs.select, 'change' );

        expect( hu.value ).is.equals( '1' );
        expect( hu.$refs.select.value ).is.equals( '12' );

        custom.$appendTo( document.body );

        expect( hu.value ).is.equals( '1' );
        expect( hu.$refs.select.value ).is.equals( '1' );

        hu.value = '12';
        hu.$nextTick(() => {
          expect( hu.value ).is.equals( '12' );
          expect( hu.$refs.select.value ).is.equals( '12' );

          hu.$refs.select.value = '123';
          triggerEvent( hu.$refs.select, 'change' );

          expect( hu.value ).is.equals( '123' );
          expect( hu.$refs.select.value ).is.equals( '123' );

          custom.$remove();

          done();
        });
      });
    });
  });


  it( '使用 :text 指令的方式, 对元素内容进行插入 ( textContent )', () => {
    const div = document.createElement('div');
    let text = '<span>123</span>'

    Hu.render( div )`
      <div :text=${ text }></div>
    `;

    expect( div.firstElementChild.innerHTML ).is.equals(
      text.$replaceAll('<','&lt;')
          .$replaceAll('>','&gt;')
    );
  });

  it( '使用 :text 指令插入 null 或 undefined 将会转为空字符串', () => {
    const div = document.createElement('div');

    Hu.render( div )`<div :text=${ null }></div>`;
    expect( div.innerHTML ).is.equals(`<!----><div></div><!---->`);

    Hu.render( div )`<div :text=${ undefined }></div>`;
    expect( div.innerHTML ).is.equals(`<!----><div></div><!---->`);
  });

  it( '使用 :text 指令插入 JSON 将会使用 JSON.stringify 进行格式化输出', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :text=${{ }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{}</div>
    `);

    Hu.render( div )`
      <div :text=${{ asd: 123 }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{\n  "asd": 123\n}</div>
    `);

    Hu.render( div )`
      <div :text=${{ asd: [ 123 ] }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{\n  "asd": [\n    123\n  ]\n}</div>
    `);
  });

  it( '使用 :text 指令插入数组将会使用 JSON.stringify 进行格式化输出', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :text=${[ ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[]</div>
    `);

    Hu.render( div )`
      <div :text=${[ 1, 2, 3 ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[\n  1,\n  2,\n  3\n]</div>
    `);

    Hu.render( div )`
      <div :text=${[ 1, { asd: 123 }, 3 ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[\n  1,\n  {\n    "asd": 123\n  },\n  3\n]</div>
    `);
  });

  it( '使用 :text 指令时, 首次传入的是 undefined, 元素的内容应该被清空', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :text=${ undefined }>123</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div></div>
    `);
  });


  it( '使用 :html 指令的方式, 对元素内容进行插入 ( innerHTML )', () => {
    const div = document.createElement('div');
    let text = '<span>123</span>'

    Hu.render( div )`
      <div :html=${ text }></div>
    `;

    expect( div.firstElementChild.innerHTML ).is.equals(
      text
    );
  });

  it( '使用 :html 指令插入 null 或 undefined 将会转为空字符串', () => {
    const div = document.createElement('div');

    Hu.render( div )`<div :html=${ null }></div>`;
    expect( div.innerHTML ).is.equals(`<!----><div></div><!---->`);

    Hu.render( div )`<div :html=${ undefined }></div>`;
    expect( div.innerHTML ).is.equals(`<!----><div></div><!---->`);
  });

  it( '使用 :html 指令插入 JSON 将会使用 JSON.stringify 进行格式化输出', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :html=${{ }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{}</div>
    `);

    Hu.render( div )`
      <div :html=${{ asd: 123 }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{\n  "asd": 123\n}</div>
    `);

    Hu.render( div )`
      <div :html=${{ asd: [ 123 ] }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{\n  "asd": [\n    123\n  ]\n}</div>
    `);
  });

  it( '使用 :html 指令插入数组将会使用 JSON.stringify 进行格式化输出', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :html=${[ ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[]</div>
    `);

    Hu.render( div )`
      <div :html=${[ 1, 2, 3 ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[\n  1,\n  2,\n  3\n]</div>
    `);

    Hu.render( div )`
      <div :html=${[ 1, { asd: 123 }, 3 ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[\n  1,\n  {\n    "asd": 123\n  },\n  3\n]</div>
    `);
  });

  it( '使用 :html 指令时, 首次传入的是 undefined, 元素的内容应该被清空', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :html=${ undefined }>123</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div></div>
    `);
  });


  it( '使用 :show 指令对元素进行显示和隐藏', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :show=${ false }></div>
    `;
    expect( div.firstElementChild.style.display ).is.equals('none');

    Hu.render( div )`
      <div :show=${ true }></div>
    `;
    expect( div.firstElementChild.style.display ).is.equals('');

    Hu.render( div )`
      <div :show=${ false }></div>
    `;
    expect( div.firstElementChild.style.display ).is.equals('none');
  });

  it( '使用 :show 指时, 首次传入的是 undefined, 元素的状态应该是隐藏的', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :show=${ undefined }></div>
    `;
    expect( div.firstElementChild.style.display ).is.equals('none');
  });


  it( '使用不存在的指令, 将会被当做普通属性处理', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :zhang-wei=${ 666 }></div>
    `;
    expect( div.firstElementChild.getAttribute(':zhang-wei') ).equals('666');

    Hu.render( div )`
      <div :toString=${ 666 }></div>
    `;
    expect( div.firstElementChild.getAttribute(':tostring') ).equals('666');
  });

});