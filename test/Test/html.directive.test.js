describe( 'html.directive', () => {

  const render = Hu.render;
  const html = Hu.html;
  const nextTick = Hu.nextTick;

  /** @type {Element} */
  let div;
  beforeEach(() => {
    div = document.createElement('div');
  });
  afterEach(() => {
    div.$remove();
  });


  it( '正常对元素属性 ( Attribute ) 进行绑定', () => {
    // 1
    render( div )`
      <div name=${ 123 }></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div name="123"></div>
    `);

    // 2
    render( div )`
      <div style="width: ${ 100 }px; height: ${ 200 }px; opacity: ${ 0.5 }"></div>
    `;
    expect( div.firstElementChild.style ).is.include({
      width: '100px',
      height: '200px',
      opacity: '0.5'
    });
  });

  it( '使用 :class 指令对元素 className 进行绑定 ( 字符串方式 )', () => {
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

  it( '使用 :class 指令对元素 className 进行绑定 ( JSON 方式 )', () => {
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

  it( '使用 :class 指令对元素 className 进行绑定 ( 数组方式 )', () => {
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

  it( '使用 :style 指令对元素 style 进行绑定 ( 字符串方式 )', () => {
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

  it( '使用 :style 指令对元素 style 进行绑定 ( JSON 方式 )', () => {
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

  it( '使用 :style 指令对元素 style 进行绑定 ( 数组方式 )', () => {
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
    const data = Hu.observable({
      value: '12'
    });

    render( div )`
      <select ref="select" :model=${[ data, 'value' ]}>
        <option value="1">11</option>
        <option value="12">1212</option>
        <option value="123">123123</option>
      </select>
    `;

    const select = div.querySelector('[ref="select"]');

    // 指令首次绑定会进行赋值
    expect( data.value ).is.equals('12');
    expect( select.value ).is.equals('12');
    expect( select.options[1].selected ).is.true;

    // 控件值发生改变, 绑定值也会发生更改
    select.options[0].selected = true;
    triggerEvent( select, 'change' );
    expect( data.value ).is.equals('1');
    expect( select.value ).is.equals('1');
    expect( select.options[0].selected ).is.true;

    select.options[1].selected = true;
    triggerEvent( select, 'change' );
    expect( data.value ).is.equals('12');
    expect( select.value ).is.equals('12');
    expect( select.options[1].selected ).is.true;

    select.options[2].selected = true;
    triggerEvent( select, 'change' );
    expect( data.value ).is.equals('123');
    expect( select.value ).is.equals('123');
    expect( select.options[2].selected ).is.true;

    // 绑定值发生改变, 控件值也会发生更改
    data.value = '1';
    nextTick(() => {
      expect( data.value ).is.equals('1');
      expect( select.value ).is.equals('1');
      expect( select.options[0].selected ).is.true;

      data.value = '12';
      nextTick(() => {
        expect( data.value ).is.equals('12');
        expect( select.value ).is.equals('12');
        expect( select.options[1].selected ).is.true;

        data.value = '123';
        nextTick(() => {
          expect( data.value ).is.equals('123');
          expect( select.value ).is.equals('123');
          expect( select.options[2].selected ).is.true;

          done();
        });
      });
    });
  });

  it( '使用 :model 指令对 select 表单控件进行双向绑定 ( Vue )', ( done ) => {
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

  it( '使用 :model 指令对 input[type="checkbox"] 表单控件进行双向绑定', ( done ) => {
    const data = Hu.observable({
      value: true
    });

    render( div )`
      <input ref="checkbox" type="checkbox" :model=${[ data, 'value' ]}>
    `;

    const checkbox = div.querySelector('[ref="checkbox"]');

    // 指令首次绑定会进行赋值
    expect( data.value ).is.equals( true );
    expect( checkbox.checked ).is.true;

    // 控件值发生改变, 绑定值也会发生更改
    checkbox.checked = false;
    triggerEvent( checkbox, 'change' );
    expect( data.value ).is.equals( false );
    expect( checkbox.checked ).is.false;

    checkbox.checked = true;
    triggerEvent( checkbox, 'change' );
    expect( data.value ).is.equals( true );
    expect( checkbox.checked ).is.true;

    // 绑定值发生改变, 控件值也会发生更改
    data.value = false;
      nextTick(() => {
      expect( checkbox.checked ).is.false;

      data.value = true;
        nextTick(() => {
        expect( checkbox.checked ).is.true;

        done();
      });
    });
  });

  it( '使用 :model 指令对 input[type="checkbox"] 表单控件进行双向绑定 ( Vue )', ( done ) => {
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

  it( '使用 :model 指令对 input[type="radio"] 表单控件进行双向绑定', ( done ) => {
    const data = Hu.observable({
      value: '12'
    });

    render( div )`
      <input type="radio" value="1" :model=${[ data, 'value' ]}>
      <input type="radio" value="12" :model=${[ data, 'value' ]}>
      <input type="radio" value="123" :model=${[ data, 'value' ]}>
    `;

    // 指令首次绑定会进行赋值
    expect( data.value ).is.equals( '12' );
    expect( div.querySelector(':nth-child(1)').checked ).is.false;
    expect( div.querySelector(':nth-child(2)').checked ).is.true;
    expect( div.querySelector(':nth-child(3)').checked ).is.false;

    // 控件值发生改变, 绑定值也会发生更改
    div.querySelector(':nth-child(1)').checked = true;
    triggerEvent( div.querySelector(':nth-child(1)'), 'change' );
    expect( data.value ).is.equals( '1' );
    expect( div.querySelector(':nth-child(1)').checked ).is.true;
    expect( div.querySelector(':nth-child(2)').checked ).is.true;
    expect( div.querySelector(':nth-child(3)').checked ).is.false;
    nextTick(() => {
      expect( data.value ).is.equals( '1' );
      expect( div.querySelector(':nth-child(1)').checked ).is.true;
      expect( div.querySelector(':nth-child(2)').checked ).is.false;
      expect( div.querySelector(':nth-child(3)').checked ).is.false;

      div.querySelector(':nth-child(2)').checked = true;
      triggerEvent( div.querySelector(':nth-child(2)'), 'change' );
      expect( data.value ).is.equals( '12' );
      expect( div.querySelector(':nth-child(1)').checked ).is.true;
      expect( div.querySelector(':nth-child(2)').checked ).is.true;
      expect( div.querySelector(':nth-child(3)').checked ).is.false;
      nextTick(() => {
        expect( data.value ).is.equals( '12' );
        expect( div.querySelector(':nth-child(1)').checked ).is.false;
        expect( div.querySelector(':nth-child(2)').checked ).is.true;
        expect( div.querySelector(':nth-child(3)').checked ).is.false;

        div.querySelector(':nth-child(3)').checked = true;
        triggerEvent( div.querySelector(':nth-child(3)'), 'change' );
        expect( data.value ).is.equals( '123' );
        expect( div.querySelector(':nth-child(1)').checked ).is.false;
        expect( div.querySelector(':nth-child(2)').checked ).is.true;
        expect( div.querySelector(':nth-child(3)').checked ).is.true;
        nextTick(() => {
          expect( data.value ).is.equals( '123' );
          expect( div.querySelector(':nth-child(1)').checked ).is.false;
          expect( div.querySelector(':nth-child(2)').checked ).is.false;
          expect( div.querySelector(':nth-child(3)').checked ).is.true;

          // 绑定值发生改变, 控件值也会发生更改
          data.value = '1';
          nextTick(() => {
            expect( div.querySelector(':nth-child(1)').checked ).is.true;
            expect( div.querySelector(':nth-child(2)').checked ).is.false;
            expect( div.querySelector(':nth-child(3)').checked ).is.false;

            data.value = '12';
            nextTick(() => {
              expect( div.querySelector(':nth-child(1)').checked ).is.false;
              expect( div.querySelector(':nth-child(2)').checked ).is.true;
              expect( div.querySelector(':nth-child(3)').checked ).is.false;

              data.value = '123';
              nextTick(() => {
                expect( div.querySelector(':nth-child(1)').checked ).is.false;
                expect( div.querySelector(':nth-child(2)').checked ).is.false;
                expect( div.querySelector(':nth-child(3)').checked ).is.true;

                done();
              });
            });
          });
        });
      });
    });
  });

  it( '使用 :model 指令对 input[type="radio"] 表单控件进行双向绑定 ( Vue )', ( done ) => {
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
    const data = Hu.observable({
      value: '12'
    });

    render( div )`
      <input ref="text" type="text" :model=${[ data, 'value' ]} />
    `;

    const text = div.querySelector('[ref="text"]')

    // 指令首次绑定会进行赋值
    expect( data.value ).is.equals( '12' );
    expect( text.value ).is.equals( '12' );

    // 控件值发生改变, 绑定值也会发生更改
    text.value = '123';
    triggerEvent( text, 'input' );
    expect( data.value ).is.equals( '123' );

    text.value = '1234';
    triggerEvent( text, 'input' );
    expect( data.value ).is.equals( '1234' );

    // 绑定值发生改变, 控件值也会发生更改
    data.value = '12345';
    nextTick(() => {
      expect( text.value ).is.equals( '12345' );

      done();
    });
  });

  it( '使用 :model 指令对 input 表单控件进行双向绑定 ( Vue )', ( done ) => {
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
    const data = Hu.observable({
      value: '12'
    });

    render( div )`
      <textarea ref="textarea" :model=${[ data, 'value' ]}></textarea>
    `;

    const textarea = div.querySelector('[ref="textarea"]');

    // 指令首次绑定会进行赋值
    expect( data.value ).is.equals( '12' );
    expect( textarea.value ).is.equals( '12' );

    // 控件值发生改变, 绑定值也会发生更改
    textarea.value = '123';
    triggerEvent( textarea, 'input' );
    expect( data.value ).is.equals( '123' );

    textarea.value = '1234';
    triggerEvent( textarea, 'input' );
    expect( data.value ).is.equals( '1234' );

    // 绑定值发生改变, 控件值也会发生更改
    data.value = '12345';
    nextTick(() => {
      expect( textarea.value ).is.equals( '12345' );

      done();
    });
  });

  it( '使用 :model 指令对 textarea 表单控件进行双向绑定 ( Vue )', ( done ) => {
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

  it( '使用 :model 指令对 input 表单控件进行双向绑定时, 不会受到输入法影响', () => {
    const data = Hu.observable({
      value: '12'
    });

    render( div )`
      <input ref="text" type="text" :model=${[ data, 'value' ]} />
    `;

    const text = div.querySelector('[ref="text"]');

    expect( data.value ).is.equals( '12' );
    expect( text.value ).is.equals( '12' );

    text.value = '1';
    triggerEvent( text, 'input' );
    expect( data.value ).is.equals( '1' );

    text.value = '2';
    triggerEvent( text, 'input' );
    expect( data.value ).is.equals( '2' );

    triggerEvent( text, 'compositionstart' );

    text.value = '3';
    triggerEvent( text, 'input' );
    expect( data.value ).is.equals( '2' );

    text.value = '4';
    triggerEvent( text, 'input' );
    expect( data.value ).is.equals( '2' );

    triggerEvent( text, 'compositionend' );
    expect( data.value ).is.equals( '4' );
  });

  it( '使用 :model 指令对 input 表单控件进行双向绑定时, 不会受到输入法影响 ( Vue )', () => {
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
  });

  it( '使用 :model 指令对 textarea 表单控件进行双向绑定时, 不会受到输入法影响', () => {
    const data = Hu.observable({
      value: '12'
    });

    render( div )`
      <textarea ref="textarea" :model=${[ data, 'value' ]}></textarea>
    `;

    const textarea = div.querySelector('[ref="textarea"]');

    expect( data.value ).is.equals( '12' );
    expect( textarea.value ).is.equals( '12' );

    textarea.value = '1';
    triggerEvent( textarea, 'input' );
    expect( data.value ).is.equals( '1' );

    textarea.value = '2';
    triggerEvent( textarea, 'input' );
    expect( data.value ).is.equals( '2' );

    triggerEvent( textarea, 'compositionstart' );

    textarea.value = '3';
    triggerEvent( textarea, 'input' );
    expect( data.value ).is.equals( '2' );

    textarea.value = '4';
    triggerEvent( textarea, 'input' );
    expect( data.value ).is.equals( '2' );

    triggerEvent( textarea, 'compositionend' );
    expect( data.value ).is.equals( '4' );
  });

  it( '使用 :model 指令对 textarea 表单控件进行双向绑定时, 不会受到输入法影响 ( Vue )', () => {
    const vm = new Vue({
      el: div,
      data: {
        value: '12'
      },
      template: `
        <textarea ref="textarea" v-model="value"></textarea>
      `
    });

    expect( vm.value ).is.equals( '12' );
    expect( vm.$refs.textarea.value ).is.equals( '12' );

    vm.$refs.textarea.value = '1';
    triggerEvent( vm.$refs.textarea, 'input' );
    expect( vm.value ).is.equals( '1' );

    vm.$refs.textarea.value = '2';
    triggerEvent( vm.$refs.textarea, 'input' );
    expect( vm.value ).is.equals( '2' );

    triggerEvent( vm.$refs.textarea, 'compositionstart' );

    vm.$refs.textarea.value = '3';
    triggerEvent( vm.$refs.textarea, 'input' );
    expect( vm.value ).is.equals( '2' );

    vm.$refs.textarea.value = '4';
    triggerEvent( vm.$refs.textarea, 'input' );
    expect( vm.value ).is.equals( '2' );

    triggerEvent( vm.$refs.textarea, 'compositionend' );
    expect( vm.value ).is.equals( '4' );
  });

});