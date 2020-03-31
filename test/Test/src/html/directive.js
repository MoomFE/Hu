/* global stripExpressionMarkers, triggerEvent, Vue */
/* eslint-disable no-unused-expressions */


import { expect } from 'chai';
import Hu from '../../../../src/build/index';


describe('html.directive', () => {
  const render = Hu.render;
  const nextTick = Hu.nextTick;

  /** @type {Element} */
  let div;
  beforeEach(() => {
    div = document.createElement('div');
  });
  afterEach(() => {
    div.$remove();
  });


  it('正常对元素属性 ( Attribute ) 进行绑定', () => {
    // 1
    render(div)`
      <div name=${123}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div name="123"></div>
    `);

    // 2
    render(div)`
      <div style="width: ${100}px; height: ${200}px; opacity: ${0.5}"></div>
    `;
    expect(div.firstElementChild.style).is.include({
      width: '100px',
      height: '200px',
      opacity: '0.5'
    });
  });

  it('使用 :class 指令对元素 className 进行绑定 ( 字符串方式 )', () => {
    // 1
    render(div)`
      <div :class=${'a b c'}></div>
    `;
    expect(
      Array.from(div.firstElementChild.classList)
    ).is.deep.equals(['a', 'b', 'c']);

    // 2
    render(div)`
      <div class="a" :class=${'b c'}></div>
    `;
    expect(
      Array.from(div.firstElementChild.classList)
    ).is.deep.equals(['a', 'b', 'c']);
  });

  it('使用 :class 指令对元素 className 进行绑定 ( JSON 方式 )', () => {
    // 1
    render(div)`
      <div :class=${{ a: true, b: true, c: true }}></div>
    `;
    expect(
      Array.from(div.firstElementChild.classList)
    ).is.deep.equals(['a', 'b', 'c']);

    // 2
    render(div)`
      <div :class=${{ a: true, b: false, c: true }}></div>
    `;
    expect(
      Array.from(div.firstElementChild.classList)
    ).is.deep.equals(['a', 'c']);

    // 3
    render(div)`
      <div class="a" :class=${{ b: true, c: true }}></div>
    `;
    expect(
      Array.from(div.firstElementChild.classList)
    ).is.deep.equals(['a', 'b', 'c']);

    // 4
    render(div)`
      <div class="a" :class=${{ b: false, c: true }}></div>
    `;
    expect(
      Array.from(div.firstElementChild.classList)
    ).is.deep.equals(['a', 'c']);
  });

  it('使用 :class 指令对元素 className 进行绑定 ( 数组方式 )', () => {
    // 1
    render(div)`
      <div :class=${['a', 'b', 'c']}></div>
    `;
    expect(
      Array.from(div.firstElementChild.classList)
    ).is.deep.equals(['a', 'b', 'c']);

    // 2
    render(div)`
      <div :class=${[{ a: true }, 'b', { c: true }]}></div>
    `;
    expect(
      Array.from(div.firstElementChild.classList)
    ).is.deep.equals(['a', 'b', 'c']);

    // 3
    render(div)`
      <div :class=${['a b', { c: false }]}></div>
    `;
    expect(
      Array.from(div.firstElementChild.classList)
    ).is.deep.equals(['a', 'b']);

    // 4
    render(div)`
      <div class="a" :class=${['b', 'c']}></div>
    `;
    expect(
      Array.from(div.firstElementChild.classList)
    ).is.deep.equals(['a', 'b', 'c']);

    // 5
    render(div)`
      <div class="a" :class=${['b', { c: true }]}></div>
    `;
    expect(
      Array.from(div.firstElementChild.classList)
    ).is.deep.equals(['a', 'b', 'c']);

    // 6
    render(div)`
      <div class="a" :class=${['b', { c: false }]}></div>
    `;
    expect(
      Array.from(div.firstElementChild.classList)
    ).is.deep.equals(['a', 'b']);
  });

  it('使用 :style 指令对元素 style 进行绑定 ( 字符串方式 )', () => {
    // 1
    render(div)`
      <div :style=${'width: 100px; height: 120px'}></div>
    `;
    expect(div.firstElementChild.style).is.deep.include({
      width: '100px',
      height: '120px'
    });

    // 2
    render(div)`
      <div style="width: 100px" :style=${'height: 120px'}></div>
    `;
    expect(div.firstElementChild.style).is.deep.include({
      width: '100px',
      height: '120px'
    });
  });

  it('使用 :style 指令对元素 style 进行绑定 ( JSON 方式 )', () => {
    // 1
    render(div)`
      <div :style=${{ width: '100px', height: '120px' }}></div>
    `;
    expect(div.firstElementChild.style).is.deep.include({
      width: '100px',
      height: '120px'
    });

    // 2
    render(div)`
      <div style="width: 100px" :style=${{ height: '120px' }}></div>
    `;
    expect(div.firstElementChild.style).is.deep.include({
      width: '100px',
      height: '120px'
    });
  });

  it('使用 :style 指令对元素 style 进行绑定 ( 数组方式 )', () => {
    // 1
    render(div)`
      <div :style=${['width: 100px', { height: '120px' }]}></div>
    `;
    expect(div.firstElementChild.style).is.deep.include({
      width: '100px',
      height: '120px'
    });

    // 2
    render(div)`
      <div style="width: 100px" :style=${[{ height: '120px' }]}></div>
    `;
    expect(div.firstElementChild.style).is.deep.include({
      width: '100px',
      height: '120px'
    });
  });

  it('使用 :model 指令对 select 表单控件进行双向绑定', (done) => {
    const data = Hu.observable({
      value: '12'
    });

    render(div)`
      <select ref="select" :model=${[data, 'value']}>
        <option value="1">11</option>
        <option value="12">1212</option>
        <option value="123">123123</option>
      </select>
    `;

    const select = div.querySelector('[ref="select"]');

    // 指令首次绑定会进行赋值
    expect(data.value).is.equals('12');
    expect(select.value).is.equals('12');
    expect(select.options[1].selected).is.true;

    // 控件值发生改变, 绑定值也会发生更改
    select.options[0].selected = true;
    triggerEvent(select, 'change');
    expect(data.value).is.equals('1');
    expect(select.value).is.equals('1');
    expect(select.options[0].selected).is.true;

    select.options[1].selected = true;
    triggerEvent(select, 'change');
    expect(data.value).is.equals('12');
    expect(select.value).is.equals('12');
    expect(select.options[1].selected).is.true;

    select.options[2].selected = true;
    triggerEvent(select, 'change');
    expect(data.value).is.equals('123');
    expect(select.value).is.equals('123');
    expect(select.options[2].selected).is.true;

    // 绑定值发生改变, 控件值也会发生更改
    data.value = '1';
    nextTick(() => {
      expect(data.value).is.equals('1');
      expect(select.value).is.equals('1');
      expect(select.options[0].selected).is.true;

      data.value = '12';
      nextTick(() => {
        expect(data.value).is.equals('12');
        expect(select.value).is.equals('12');
        expect(select.options[1].selected).is.true;

        data.value = '123';
        nextTick(() => {
          expect(data.value).is.equals('123');
          expect(select.value).is.equals('123');
          expect(select.options[2].selected).is.true;

          done();
        });
      });
    });
  });

  it('使用 v-model 指令对 select 表单控件进行双向绑定 ( Vue )', (done) => {
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
    expect(vm.value).is.equals('12');
    expect(vm.$refs.select.value).is.equals('12');
    expect(vm.$refs.select.options[1].selected).is.true;

    // 控件值发生改变, 绑定值也会发生更改
    vm.$refs.select.options[0].selected = true;
    triggerEvent(vm.$refs.select, 'change');
    expect(vm.value).is.equals('1');
    expect(vm.$refs.select.value).is.equals('1');
    expect(vm.$refs.select.options[0].selected).is.true;

    vm.$refs.select.options[1].selected = true;
    triggerEvent(vm.$refs.select, 'change');
    expect(vm.value).is.equals('12');
    expect(vm.$refs.select.value).is.equals('12');
    expect(vm.$refs.select.options[1].selected).is.true;

    vm.$refs.select.options[2].selected = true;
    triggerEvent(vm.$refs.select, 'change');
    expect(vm.value).is.equals('123');
    expect(vm.$refs.select.value).is.equals('123');
    expect(vm.$refs.select.options[2].selected).is.true;

    // 绑定值发生改变, 控件值也会发生更改
    vm.value = '1';
    vm.$nextTick(() => {
      expect(vm.value).is.equals('1');
      expect(vm.$refs.select.value).is.equals('1');
      expect(vm.$refs.select.options[0].selected).is.true;

      vm.value = '12';
      vm.$nextTick(() => {
        expect(vm.value).is.equals('12');
        expect(vm.$refs.select.value).is.equals('12');
        expect(vm.$refs.select.options[1].selected).is.true;

        vm.value = '123';
        vm.$nextTick(() => {
          expect(vm.value).is.equals('123');
          expect(vm.$refs.select.value).is.equals('123');
          expect(vm.$refs.select.options[2].selected).is.true;

          done();
        });
      });
    });
  });

  it('使用 :model 指令对 input[type="checkbox"] 表单控件进行双向绑定', (done) => {
    const data = Hu.observable({
      value: true
    });

    render(div)`
      <input ref="checkbox" type="checkbox" :model=${[data, 'value']}>
    `;

    const checkbox = div.querySelector('[ref="checkbox"]');

    // 指令首次绑定会进行赋值
    expect(data.value).is.equals(true);
    expect(checkbox.checked).is.true;

    // 控件值发生改变, 绑定值也会发生更改
    checkbox.checked = false;
    triggerEvent(checkbox, 'change');
    expect(data.value).is.equals(false);
    expect(checkbox.checked).is.false;

    checkbox.checked = true;
    triggerEvent(checkbox, 'change');
    expect(data.value).is.equals(true);
    expect(checkbox.checked).is.true;

    // 绑定值发生改变, 控件值也会发生更改
    data.value = false;
    nextTick(() => {
      expect(checkbox.checked).is.false;

      data.value = true;
      nextTick(() => {
        expect(checkbox.checked).is.true;

        done();
      });
    });
  });

  it('使用 v-model 指令对 input[type="checkbox"] 表单控件进行双向绑定 ( Vue )', (done) => {
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
    expect(vm.value).is.equals(true);
    expect(vm.$refs.checkbox.checked).is.true;

    // 控件值发生改变, 绑定值也会发生更改
    vm.$refs.checkbox.checked = false;
    triggerEvent(vm.$refs.checkbox, 'change');
    expect(vm.value).is.equals(false);
    expect(vm.$refs.checkbox.checked).is.false;

    vm.$refs.checkbox.checked = true;
    triggerEvent(vm.$refs.checkbox, 'change');
    expect(vm.value).is.equals(true);
    expect(vm.$refs.checkbox.checked).is.true;

    // 绑定值发生改变, 控件值也会发生更改
    vm.value = false;
    vm.$nextTick(() => {
      expect(vm.$refs.checkbox.checked).is.false;

      vm.value = true;
      vm.$nextTick(() => {
        expect(vm.$refs.checkbox.checked).is.true;

        done();
      });
    });
  });

  it('使用 :model 指令对 input[type="radio"] 表单控件进行双向绑定', (done) => {
    const data = Hu.observable({
      value: '12'
    });

    render(div)`
      <input type="radio" value="1" :model=${[data, 'value']}>
      <input type="radio" value="12" :model=${[data, 'value']}>
      <input type="radio" value="123" :model=${[data, 'value']}>
    `;

    // 指令首次绑定会进行赋值
    expect(data.value).is.equals('12');
    expect(div.querySelector(':nth-child(1)').checked).is.false;
    expect(div.querySelector(':nth-child(2)').checked).is.true;
    expect(div.querySelector(':nth-child(3)').checked).is.false;

    // 控件值发生改变, 绑定值也会发生更改
    div.querySelector(':nth-child(1)').checked = true;
    triggerEvent(div.querySelector(':nth-child(1)'), 'change');
    expect(data.value).is.equals('1');
    expect(div.querySelector(':nth-child(1)').checked).is.true;
    expect(div.querySelector(':nth-child(2)').checked).is.true;
    expect(div.querySelector(':nth-child(3)').checked).is.false;
    nextTick(() => {
      expect(data.value).is.equals('1');
      expect(div.querySelector(':nth-child(1)').checked).is.true;
      expect(div.querySelector(':nth-child(2)').checked).is.false;
      expect(div.querySelector(':nth-child(3)').checked).is.false;

      div.querySelector(':nth-child(2)').checked = true;
      triggerEvent(div.querySelector(':nth-child(2)'), 'change');
      expect(data.value).is.equals('12');
      expect(div.querySelector(':nth-child(1)').checked).is.true;
      expect(div.querySelector(':nth-child(2)').checked).is.true;
      expect(div.querySelector(':nth-child(3)').checked).is.false;
      nextTick(() => {
        expect(data.value).is.equals('12');
        expect(div.querySelector(':nth-child(1)').checked).is.false;
        expect(div.querySelector(':nth-child(2)').checked).is.true;
        expect(div.querySelector(':nth-child(3)').checked).is.false;

        div.querySelector(':nth-child(3)').checked = true;
        triggerEvent(div.querySelector(':nth-child(3)'), 'change');
        expect(data.value).is.equals('123');
        expect(div.querySelector(':nth-child(1)').checked).is.false;
        expect(div.querySelector(':nth-child(2)').checked).is.true;
        expect(div.querySelector(':nth-child(3)').checked).is.true;
        nextTick(() => {
          expect(data.value).is.equals('123');
          expect(div.querySelector(':nth-child(1)').checked).is.false;
          expect(div.querySelector(':nth-child(2)').checked).is.false;
          expect(div.querySelector(':nth-child(3)').checked).is.true;

          // 绑定值发生改变, 控件值也会发生更改
          data.value = '1';
          nextTick(() => {
            expect(div.querySelector(':nth-child(1)').checked).is.true;
            expect(div.querySelector(':nth-child(2)').checked).is.false;
            expect(div.querySelector(':nth-child(3)').checked).is.false;

            data.value = '12';
            nextTick(() => {
              expect(div.querySelector(':nth-child(1)').checked).is.false;
              expect(div.querySelector(':nth-child(2)').checked).is.true;
              expect(div.querySelector(':nth-child(3)').checked).is.false;

              data.value = '123';
              nextTick(() => {
                expect(div.querySelector(':nth-child(1)').checked).is.false;
                expect(div.querySelector(':nth-child(2)').checked).is.false;
                expect(div.querySelector(':nth-child(3)').checked).is.true;

                done();
              });
            });
          });
        });
      });
    });
  });

  it('使用 v-model 指令对 input[type="radio"] 表单控件进行双向绑定 ( Vue )', (done) => {
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
    expect(vm.value).is.equals('12');
    expect(vm.$el.querySelector(':nth-child(1)').checked).is.false;
    expect(vm.$el.querySelector(':nth-child(2)').checked).is.true;
    expect(vm.$el.querySelector(':nth-child(3)').checked).is.false;

    // 控件值发生改变, 绑定值也会发生更改
    vm.$el.querySelector(':nth-child(1)').checked = true;
    triggerEvent(vm.$el.querySelector(':nth-child(1)'), 'change');
    expect(vm.value).is.equals('1');
    expect(vm.$el.querySelector(':nth-child(1)').checked).is.true;
    expect(vm.$el.querySelector(':nth-child(2)').checked).is.true;
    expect(vm.$el.querySelector(':nth-child(3)').checked).is.false;
    vm.$nextTick(() => {
      expect(vm.value).is.equals('1');
      expect(vm.$el.querySelector(':nth-child(1)').checked).is.true;
      expect(vm.$el.querySelector(':nth-child(2)').checked).is.false;
      expect(vm.$el.querySelector(':nth-child(3)').checked).is.false;

      vm.$el.querySelector(':nth-child(2)').checked = true;
      triggerEvent(vm.$el.querySelector(':nth-child(2)'), 'change');
      expect(vm.value).is.equals('12');
      expect(vm.$el.querySelector(':nth-child(1)').checked).is.true;
      expect(vm.$el.querySelector(':nth-child(2)').checked).is.true;
      expect(vm.$el.querySelector(':nth-child(3)').checked).is.false;
      vm.$nextTick(() => {
        expect(vm.value).is.equals('12');
        expect(vm.$el.querySelector(':nth-child(1)').checked).is.false;
        expect(vm.$el.querySelector(':nth-child(2)').checked).is.true;
        expect(vm.$el.querySelector(':nth-child(3)').checked).is.false;

        vm.$el.querySelector(':nth-child(3)').checked = true;
        triggerEvent(vm.$el.querySelector(':nth-child(3)'), 'change');
        expect(vm.value).is.equals('123');
        expect(vm.$el.querySelector(':nth-child(1)').checked).is.false;
        expect(vm.$el.querySelector(':nth-child(2)').checked).is.true;
        expect(vm.$el.querySelector(':nth-child(3)').checked).is.true;
        vm.$nextTick(() => {
          expect(vm.value).is.equals('123');
          expect(vm.$el.querySelector(':nth-child(1)').checked).is.false;
          expect(vm.$el.querySelector(':nth-child(2)').checked).is.false;
          expect(vm.$el.querySelector(':nth-child(3)').checked).is.true;

          // 绑定值发生改变, 控件值也会发生更改
          vm.value = '1';
          vm.$nextTick(() => {
            expect(vm.$el.querySelector(':nth-child(1)').checked).is.true;
            expect(vm.$el.querySelector(':nth-child(2)').checked).is.false;
            expect(vm.$el.querySelector(':nth-child(3)').checked).is.false;

            vm.value = '12';
            vm.$nextTick(() => {
              expect(vm.$el.querySelector(':nth-child(1)').checked).is.false;
              expect(vm.$el.querySelector(':nth-child(2)').checked).is.true;
              expect(vm.$el.querySelector(':nth-child(3)').checked).is.false;

              vm.value = '123';
              vm.$nextTick(() => {
                expect(vm.$el.querySelector(':nth-child(1)').checked).is.false;
                expect(vm.$el.querySelector(':nth-child(2)').checked).is.false;
                expect(vm.$el.querySelector(':nth-child(3)').checked).is.true;

                done();
              });
            });
          });
        });
      });
    });
  });

  it('使用 :model 指令对 input 表单控件进行双向绑定', (done) => {
    const data = Hu.observable({
      value: '12'
    });

    render(div)`
      <input ref="text" type="text" :model=${[data, 'value']} />
    `;

    const text = div.querySelector('[ref="text"]');

    // 指令首次绑定会进行赋值
    expect(data.value).is.equals('12');
    expect(text.value).is.equals('12');

    // 控件值发生改变, 绑定值也会发生更改
    text.value = '123';
    triggerEvent(text, 'input');
    expect(data.value).is.equals('123');

    text.value = '1234';
    triggerEvent(text, 'input');
    expect(data.value).is.equals('1234');

    // 绑定值发生改变, 控件值也会发生更改
    data.value = '12345';
    nextTick(() => {
      expect(text.value).is.equals('12345');

      done();
    });
  });

  it('使用 v-model 指令对 input 表单控件进行双向绑定 ( Vue )', (done) => {
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
    expect(vm.value).is.equals('12');
    expect(vm.$refs.text.value).is.equals('12');

    // 控件值发生改变, 绑定值也会发生更改
    vm.$refs.text.value = '123';
    triggerEvent(vm.$refs.text, 'input');
    expect(vm.value).is.equals('123');

    vm.$refs.text.value = '1234';
    triggerEvent(vm.$refs.text, 'input');
    expect(vm.value).is.equals('1234');

    // 绑定值发生改变, 控件值也会发生更改
    vm.value = '12345';
    vm.$nextTick(() => {
      expect(vm.$refs.text.value).is.equals('12345');

      done();
    });
  });

  it('使用 :model 指令对 textarea 表单控件进行双向绑定', (done) => {
    const data = Hu.observable({
      value: '12'
    });

    render(div)`
      <textarea ref="textarea" :model=${[data, 'value']}></textarea>
    `;

    const textarea = div.querySelector('[ref="textarea"]');

    // 指令首次绑定会进行赋值
    expect(data.value).is.equals('12');
    expect(textarea.value).is.equals('12');

    // 控件值发生改变, 绑定值也会发生更改
    textarea.value = '123';
    triggerEvent(textarea, 'input');
    expect(data.value).is.equals('123');

    textarea.value = '1234';
    triggerEvent(textarea, 'input');
    expect(data.value).is.equals('1234');

    // 绑定值发生改变, 控件值也会发生更改
    data.value = '12345';
    nextTick(() => {
      expect(textarea.value).is.equals('12345');

      done();
    });
  });

  it('使用 v-model 指令对 textarea 表单控件进行双向绑定 ( Vue )', (done) => {
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
    expect(vm.value).is.equals('12');
    expect(vm.$refs.textarea.value).is.equals('12');

    // 控件值发生改变, 绑定值也会发生更改
    vm.$refs.textarea.value = '123';
    triggerEvent(vm.$refs.textarea, 'input');
    expect(vm.value).is.equals('123');

    vm.$refs.textarea.value = '1234';
    triggerEvent(vm.$refs.textarea, 'input');
    expect(vm.value).is.equals('1234');

    // 绑定值发生改变, 控件值也会发生更改
    vm.value = '12345';
    vm.$nextTick(() => {
      expect(vm.$refs.textarea.value).is.equals('12345');

      done();
    });
  });

  it('使用 :model 指令对 input 表单控件进行双向绑定时, 不会受到输入法影响', () => {
    const data = Hu.observable({
      value: '12'
    });

    render(div)`
      <input ref="text" type="text" :model=${[data, 'value']} />
    `;

    const text = div.querySelector('[ref="text"]');

    expect(data.value).is.equals('12');
    expect(text.value).is.equals('12');

    text.value = '1';
    triggerEvent(text, 'input');
    expect(data.value).is.equals('1');

    text.value = '2';
    triggerEvent(text, 'input');
    expect(data.value).is.equals('2');

    triggerEvent(text, 'compositionstart');

    text.value = '3';
    triggerEvent(text, 'input');
    expect(data.value).is.equals('2');

    text.value = '4';
    triggerEvent(text, 'input');
    expect(data.value).is.equals('2');

    triggerEvent(text, 'compositionend');
    expect(data.value).is.equals('4');
  });

  it('使用 v-model 指令对 input 表单控件进行双向绑定时, 不会受到输入法影响 ( Vue )', () => {
    const vm = new Vue({
      el: div,
      data: {
        value: '12'
      },
      template: `
        <input ref="text" type="text" v-model="value" />
      `
    });

    expect(vm.value).is.equals('12');
    expect(vm.$refs.text.value).is.equals('12');

    vm.$refs.text.value = '1';
    triggerEvent(vm.$refs.text, 'input');
    expect(vm.value).is.equals('1');

    vm.$refs.text.value = '2';
    triggerEvent(vm.$refs.text, 'input');
    expect(vm.value).is.equals('2');

    triggerEvent(vm.$refs.text, 'compositionstart');

    vm.$refs.text.value = '3';
    triggerEvent(vm.$refs.text, 'input');
    expect(vm.value).is.equals('2');

    vm.$refs.text.value = '4';
    triggerEvent(vm.$refs.text, 'input');
    expect(vm.value).is.equals('2');

    triggerEvent(vm.$refs.text, 'compositionend');
    expect(vm.value).is.equals('4');
  });

  it('使用 :model 指令对 textarea 表单控件进行双向绑定时, 不会受到输入法影响', () => {
    const data = Hu.observable({
      value: '12'
    });

    render(div)`
      <textarea ref="textarea" :model=${[data, 'value']}></textarea>
    `;

    const textarea = div.querySelector('[ref="textarea"]');

    expect(data.value).is.equals('12');
    expect(textarea.value).is.equals('12');

    textarea.value = '1';
    triggerEvent(textarea, 'input');
    expect(data.value).is.equals('1');

    textarea.value = '2';
    triggerEvent(textarea, 'input');
    expect(data.value).is.equals('2');

    triggerEvent(textarea, 'compositionstart');

    textarea.value = '3';
    triggerEvent(textarea, 'input');
    expect(data.value).is.equals('2');

    textarea.value = '4';
    triggerEvent(textarea, 'input');
    expect(data.value).is.equals('2');

    triggerEvent(textarea, 'compositionend');
    expect(data.value).is.equals('4');
  });

  it('使用 v-model 指令对 textarea 表单控件进行双向绑定时, 不会受到输入法影响 ( Vue )', () => {
    const vm = new Vue({
      el: div,
      data: {
        value: '12'
      },
      template: `
        <textarea ref="textarea" v-model="value"></textarea>
      `
    });

    expect(vm.value).is.equals('12');
    expect(vm.$refs.textarea.value).is.equals('12');

    vm.$refs.textarea.value = '1';
    triggerEvent(vm.$refs.textarea, 'input');
    expect(vm.value).is.equals('1');

    vm.$refs.textarea.value = '2';
    triggerEvent(vm.$refs.textarea, 'input');
    expect(vm.value).is.equals('2');

    triggerEvent(vm.$refs.textarea, 'compositionstart');

    vm.$refs.textarea.value = '3';
    triggerEvent(vm.$refs.textarea, 'input');
    expect(vm.value).is.equals('2');

    vm.$refs.textarea.value = '4';
    triggerEvent(vm.$refs.textarea, 'input');
    expect(vm.value).is.equals('2');

    triggerEvent(vm.$refs.textarea, 'compositionend');
    expect(vm.value).is.equals('4');
  });

  it('使用 :model 指令产生的绑定会在下次 render 时进行解绑', (done) => {
    const steps = [];
    const customDataProxy = new Proxy({
      value: '10',
      value2: '20'
    }, {
      get: (target, name) => {
        Hu.util.isString(name) && steps.push(name);
        return target[name];
      }
    });
    const data = Hu.observable(
      customDataProxy
    );

    render(div)`
      <input ref="input" :model=${[data, 'value']} />
    `;

    const input = div.querySelector('[ref="input"]');

    // 首次读取
    expect(input.value).is.equals('10');
    expect(steps).is.deep.equals(['value']);

    // 修改 'value' 时, 会重新读取值
    data.value = '11';
    nextTick(() => {
      expect(input.value).is.equals('11');
      expect(steps).is.deep.equals(['value', 'value']);

      // 绑定到 'value2', 那么 'value' 就应该被解绑了
      render(div)`
        <textarea ref="textarea" :model=${[data, 'value2']}></textarea>
      `;

      const textarea = div.querySelector('[ref="textarea"]');

      // 首次读取
      expect(input.value).is.equals('11');
      expect(textarea.value).is.equals('20');
      expect(steps).is.deep.equals(['value', 'value', 'value2']);

      // 修改 'value2' 时, 会重新读取值
      data.value2 = '21';
      nextTick(() => {
        expect(input.value).is.equals('11');
        expect(textarea.value).is.equals('21');
        expect(steps).is.deep.equals(['value', 'value', 'value2', 'value2']);

        // 修改 'value' 时, 因为已经解绑了, 那么不会触发新的读取了
        data.value = '12';
        nextTick(() => {
          expect(input.value).is.equals('11');
          expect(textarea.value).is.equals('21');
          expect(steps).is.deep.equals(['value', 'value', 'value2', 'value2']);

          done();
        });
      });
    });
  });

  it('使用 v-model 指令产生的绑定会在下次 render 时进行解绑 ( Vue )', (done) => {
    const steps = [];
    const customDataProxy = new Proxy({
      renderInput: true,
      value: '10',
      value2: '20'
    }, {
      get: (target, name) => {
        Hu.util.isString(name) && steps.push(name);
        return target[name];
      }
    });

    const vm = new Vue({
      data: customDataProxy,
      template: `
        <input v-if="renderInput" ref="input" v-model="value" />
        <textarea v-else ref="textarea" v-model="value2"></textarea>
      `
    });

    // 清除 Vue 初始化对象时产生的读取
    steps.$delete(0, 666);

    // 执行渲染
    vm.$mount(div);

    const input = vm.$refs.input;

    // 首次读取
    expect(input.value).is.equals('10');
    expect(steps).is.deep.equals(['renderInput', 'value', 'value']);

    // 修改 'value' 时, 会重新读取值
    vm.value = '11';
    vm.$nextTick(() => {
      expect(input.value).is.equals('11');
      expect(steps).is.deep.equals(['renderInput', 'value', 'value', 'renderInput', 'value', 'value']);

      // 绑定到 'value2', 那么 'value' 就应该被解绑了
      vm.renderInput = false;
      vm.$nextTick(() => {
        const textarea = vm.$refs.textarea;

        // 首次读取
        expect(input.value).is.equals('11');
        expect(textarea.value).is.equals('20');
        expect(steps).is.deep.equals(['renderInput', 'value', 'value', 'renderInput', 'value', 'value', 'renderInput', 'value2', 'value2']);

        // 修改 'value2' 时, 会重新读取值
        vm.value2 = '21';
        vm.$nextTick(() => {
          expect(input.value).is.equals('11');
          expect(textarea.value).is.equals('21');
          expect(steps).is.deep.equals(['renderInput', 'value', 'value', 'renderInput', 'value', 'value', 'renderInput', 'value2', 'value2', 'renderInput', 'value2', 'value2']);

          // 修改 'value' 时, 因为已经解绑了, 那么不会触发新的读取了
          vm.value = '12';
          vm.$nextTick(() => {
            expect(input.value).is.equals('11');
            expect(textarea.value).is.equals('21');
            expect(steps).is.deep.equals(['renderInput', 'value', 'value', 'renderInput', 'value', 'value', 'renderInput', 'value2', 'value2', 'renderInput', 'value2', 'value2']);

            done();
          });
        });
      });
    });
  });

  it('使用 :model 指令产生的对观察者对象的依赖不会被 render 收集, 所以不会触发重新渲染', (done) => {
    let index = 0;
    const hu = new Hu({
      el: div,
      data: {
        value: '1'
      },
      render(html) {
        index++;
        return html`
          <input ref="input" :model=${[this, 'value']}>
        `;
      }
    });

    expect(index).is.equals(1);
    expect(hu.$refs.input.value).is.equals('1');

    hu.value = '2';
    hu.$nextTick(() => {
      expect(index).is.equals(1);
      expect(hu.$refs.input.value).is.equals('2');

      hu.value = '3';
      hu.$nextTick(() => {
        expect(index).is.equals(1);
        expect(hu.$refs.input.value).is.equals('3');

        hu.$forceUpdate();
        hu.$forceUpdate();
        hu.$forceUpdate();

        expect(index).is.equals(4);
        expect(hu.$refs.input.value).is.equals('3');

        hu.value = '4';
        hu.$nextTick(() => {
          expect(index).is.equals(4);
          expect(hu.$refs.input.value).is.equals('4');

          hu.value = '5';
          hu.$nextTick(() => {
            expect(index).is.equals(4);
            expect(hu.$refs.input.value).is.equals('5');

            done();
          });
        });
      });
    });
  });

  it('使用 :model 指令对 select 表单控件在自定义元素中建立的双向绑定, 会在自定义元素从文档流移除时进行解绑', (done) => {
    const steps = [];
    const customDataProxy = new Proxy({
      value: '1'
    }, {
      get: (target, name) => {
        Hu.util.isString(name) && steps.push(name);
        return target[name];
      }
    });
    const data = Hu.observable(
      customDataProxy
    );
    const customName = window.customName;
    let isConnected = false;

    Hu.define(customName, {
      render(html) {
        return html`
          <select ref="select" :model=${[data, 'value']}>
            <option value="1">11</option>
            <option value="12">1212</option>
            <option value="123">123123</option>
          </select>
        `;
      },
      connected: () => (isConnected = true),
      disconnected: () => (isConnected = false)
    });

    const custom = document.createElement(customName).$appendTo(document.body);
    const hu = custom.$hu;
    const select = hu.$refs.select;

    expect(isConnected).is.true;
    expect(select.value).is.equals('1');
    expect(steps).is.deep.equals(['value']);

    data.value = '12';
    nextTick(() => {
      expect(isConnected).is.true;
      expect(select.value).is.equals('12');
      expect(steps).is.deep.equals(['value', 'value']);

      data.value = '123';
      nextTick(() => {
        expect(isConnected).is.true;
        expect(select.value).is.equals('123');
        expect(steps).is.deep.equals(['value', 'value', 'value']);

        custom.$remove();

        expect(isConnected).is.false;
        expect(select.value).is.equals('123');
        expect(steps).is.deep.equals(['value', 'value', 'value']);

        data.value = '1';
        nextTick(() => {
          expect(isConnected).is.false;
          expect(select.value).is.equals('123');
          expect(steps).is.deep.equals(['value', 'value', 'value']);

          done();
        });
      });
    });
  });

  it('使用 :model 指令对 input[type="checkbox"] 表单控件在自定义元素中建立的双向绑定, 会在自定义元素从文档流移除时进行解绑', (done) => {
    const steps = [];
    const customDataProxy = new Proxy({
      value: true
    }, {
      get: (target, name) => {
        Hu.util.isString(name) && steps.push(name);
        return target[name];
      }
    });
    const data = Hu.observable(
      customDataProxy
    );
    const customName = window.customName;
    let isConnected = false;

    Hu.define(customName, {
      render(html) {
        return html`
          <input ref="checkbox" type="checkbox" :model=${[data, 'value']} />
        `;
      },
      connected: () => (isConnected = true),
      disconnected: () => (isConnected = false)
    });

    const custom = document.createElement(customName).$appendTo(document.body);
    const hu = custom.$hu;
    const checkbox = hu.$refs.checkbox;

    expect(isConnected).is.true;
    expect(checkbox.checked).is.true;
    expect(steps).is.deep.equals(['value']);

    data.value = false;
    nextTick(() => {
      expect(isConnected).is.true;
      expect(checkbox.checked).is.false;
      expect(steps).is.deep.equals(['value', 'value']);

      data.value = true;
      nextTick(() => {
        expect(isConnected).is.true;
        expect(checkbox.checked).is.true;
        expect(steps).is.deep.equals(['value', 'value', 'value']);

        custom.$remove();

        expect(isConnected).is.false;
        expect(checkbox.checked).is.true;
        expect(steps).is.deep.equals(['value', 'value', 'value']);

        data.value = '1';
        nextTick(() => {
          expect(isConnected).is.false;
          expect(checkbox.checked).is.true;
          expect(steps).is.deep.equals(['value', 'value', 'value']);

          done();
        });
      });
    });
  });

  it('使用 :model 指令对 input[type="radio"] 表单控件在自定义元素中建立的双向绑定, 会在自定义元素从文档流移除时进行解绑', (done) => {
    const steps = [];
    const customDataProxy = new Proxy({
      value: '1'
    }, {
      get: (target, name) => {
        Hu.util.isString(name) && steps.push(name);
        return target[name];
      }
    });
    const data = Hu.observable(
      customDataProxy
    );
    const customName = window.customName;
    let isConnected = false;

    Hu.define(customName, {
      render(html) {
        return html`
          <input ref="radio1" type="radio" value="1" :model=${[data, 'value']}>
          <input ref="radio2" type="radio" value="12" :model=${[data, 'value']}>
          <input ref="radio3" type="radio" value="123" :model=${[data, 'value']}>
        `;
      },
      connected: () => (isConnected = true),
      disconnected: () => (isConnected = false)
    });

    const custom = document.createElement(customName).$appendTo(document.body);
    const hu = custom.$hu;
    const radio1 = hu.$refs.radio1;
    const radio2 = hu.$refs.radio2;
    const radio3 = hu.$refs.radio3;

    expect(isConnected).is.true;
    expect(radio1.checked).is.equals(true);
    expect(radio2.checked).is.equals(false);
    expect(radio3.checked).is.equals(false);
    expect(steps).is.deep.equals(['value', 'value', 'value']);

    data.value = '12';
    nextTick(() => {
      expect(isConnected).is.true;
      expect(radio1.checked).is.equals(false);
      expect(radio2.checked).is.equals(true);
      expect(radio3.checked).is.equals(false);
      expect(steps).is.deep.equals(['value', 'value', 'value', 'value', 'value', 'value']);

      data.value = '123';
      nextTick(() => {
        expect(isConnected).is.true;
        expect(radio1.checked).is.equals(false);
        expect(radio2.checked).is.equals(false);
        expect(radio3.checked).is.equals(true);
        expect(steps).is.deep.equals(['value', 'value', 'value', 'value', 'value', 'value', 'value', 'value', 'value']);

        custom.$remove();

        expect(isConnected).is.false;
        expect(radio1.checked).is.equals(false);
        expect(radio2.checked).is.equals(false);
        expect(radio3.checked).is.equals(true);
        expect(steps).is.deep.equals(['value', 'value', 'value', 'value', 'value', 'value', 'value', 'value', 'value']);

        data.value = '1';
        nextTick(() => {
          expect(isConnected).is.false;
          expect(radio1.checked).is.equals(false);
          expect(radio2.checked).is.equals(false);
          expect(radio3.checked).is.equals(true);
          expect(steps).is.deep.equals(['value', 'value', 'value', 'value', 'value', 'value', 'value', 'value', 'value']);

          done();
        });
      });
    });
  });

  it('使用 :model 指令对 input 表单控件在自定义元素中建立的双向绑定, 会在自定义元素从文档流移除时进行解绑', (done) => {
    const steps = [];
    const customDataProxy = new Proxy({
      value: '1'
    }, {
      get: (target, name) => {
        Hu.util.isString(name) && steps.push(name);
        return target[name];
      }
    });
    const data = Hu.observable(
      customDataProxy
    );
    const customName = window.customName;
    let isConnected = false;

    Hu.define(customName, {
      render(html) {
        return html`
          <input ref="input" :model=${[data, 'value']}>
        `;
      },
      connected: () => (isConnected = true),
      disconnected: () => (isConnected = false)
    });

    const custom = document.createElement(customName).$appendTo(document.body);
    const hu = custom.$hu;
    const input = hu.$refs.input;

    expect(isConnected).is.true;
    expect(input.value).is.equals('1');
    expect(steps).is.deep.equals(['value']);

    data.value = '12';
    nextTick(() => {
      expect(isConnected).is.true;
      expect(input.value).is.equals('12');
      expect(steps).is.deep.equals(['value', 'value']);

      data.value = '123';
      nextTick(() => {
        expect(isConnected).is.true;
        expect(input.value).is.equals('123');
        expect(steps).is.deep.equals(['value', 'value', 'value']);

        custom.$remove();

        expect(isConnected).is.false;
        expect(input.value).is.equals('123');
        expect(steps).is.deep.equals(['value', 'value', 'value']);

        data.value = '1';
        nextTick(() => {
          expect(isConnected).is.false;
          expect(input.value).is.equals('123');
          expect(steps).is.deep.equals(['value', 'value', 'value']);

          done();
        });
      });
    });
  });

  it('使用 :model 指令对 textarea 表单控件在自定义元素中建立的双向绑定, 会在自定义元素从文档流移除时进行解绑', (done) => {
    const steps = [];
    const customDataProxy = new Proxy({
      value: '1'
    }, {
      get: (target, name) => {
        Hu.util.isString(name) && steps.push(name);
        return target[name];
      }
    });
    const data = Hu.observable(
      customDataProxy
    );
    const customName = window.customName;
    let isConnected = false;

    Hu.define(customName, {
      render(html) {
        return html`
          <textarea ref="textarea" :model=${[data, 'value']}></textarea>
        `;
      },
      connected: () => (isConnected = true),
      disconnected: () => (isConnected = false)
    });

    const custom = document.createElement(customName).$appendTo(document.body);
    const hu = custom.$hu;
    const textarea = hu.$refs.textarea;

    expect(isConnected).is.true;
    expect(textarea.value).is.equals('1');
    expect(steps).is.deep.equals(['value']);

    data.value = '12';
    nextTick(() => {
      expect(isConnected).is.true;
      expect(textarea.value).is.equals('12');
      expect(steps).is.deep.equals(['value', 'value']);

      data.value = '123';
      nextTick(() => {
        expect(isConnected).is.true;
        expect(textarea.value).is.equals('123');
        expect(steps).is.deep.equals(['value', 'value', 'value']);

        custom.$remove();

        expect(isConnected).is.false;
        expect(textarea.value).is.equals('123');
        expect(steps).is.deep.equals(['value', 'value', 'value']);

        data.value = '1';
        nextTick(() => {
          expect(isConnected).is.false;
          expect(textarea.value).is.equals('123');
          expect(steps).is.deep.equals(['value', 'value', 'value']);

          done();
        });
      });
    });
  });

  it('使用 :model 指令时可以传入 bind 指令方法, 会提取 bind 指令方法的参数进行绑定', (done) => {
    let index = 0;
    const hu = new Hu({
      el: div,
      data: {
        value: '1'
      },
      render(html) {
        index++;
        return html`
          <input ref="input" :model=${html.bind(this, 'value')}>
        `;
      }
    });

    expect(index).is.equals(1);
    expect(hu.$refs.input.value).is.equals('1');

    hu.value = '2';
    hu.$nextTick(() => {
      expect(index).is.equals(1);
      expect(hu.$refs.input.value).is.equals('2');

      hu.value = '3';
      hu.$nextTick(() => {
        expect(index).is.equals(1);
        expect(hu.$refs.input.value).is.equals('3');

        hu.$forceUpdate();
        hu.$forceUpdate();
        hu.$forceUpdate();

        expect(index).is.equals(4);
        expect(hu.$refs.input.value).is.equals('3');

        hu.value = '4';
        hu.$nextTick(() => {
          expect(index).is.equals(4);
          expect(hu.$refs.input.value).is.equals('4');

          hu.value = '5';
          hu.$nextTick(() => {
            expect(index).is.equals(4);
            expect(hu.$refs.input.value).is.equals('5');

            done();
          });
        });
      });
    });
  });

  it('使用 :text 指令对元素 textContent 进行绑定', () => {
    const text = '<span>123</span>';

    render(div)`
      <div :text=${text}></div>
    `;

    expect(div.firstElementChild.innerHTML).is.equals(
      text.$replaceAll('<', '&lt;')
        .$replaceAll('>', '&gt;')
    );
  });

  it('使用 :text 指令对元素 textContent 进行绑定, 传入 JSON 将会使用 JSON.stringify 进行格式化输出', () => {
    render(div)`
      <div :text=${{}}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>{}</div>
    `);

    render(div)`
      <div :text=${{ asd: 123 }}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>{\n  "asd": 123\n}</div>
    `);

    render(div)`
      <div :text=${{ asd: [123] }}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>{\n  "asd": [\n    123\n  ]\n}</div>
    `);
  });

  it('使用 :text 指令对元素 textContent 进行绑定, 传入数组将会使用 JSON.stringify 进行格式化输出', () => {
    render(div)`
      <div :text=${[]}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>[]</div>
    `);

    render(div)`
      <div :text=${[1, 2, 3]}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>[\n  1,\n  2,\n  3\n]</div>
    `);

    render(div)`
      <div :text=${[1, { asd: 123 }, 3]}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>[\n  1,\n  {\n    "asd": 123\n  },\n  3\n]</div>
    `);
  });

  it('使用 :text 指令对元素 textContent 进行绑定, 传入 null 或 undefined 时将会转为空字符串', () => {
    render(div)`
      <div :text=${null}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div></div>
    `);

    render(div)`
      <div :text=${undefined}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div></div>
    `);
  });

  it('使用 :text 指令对元素 textContent 进行绑定, 首次传入 null 或 undefined 时, 元素的内容应该被清空', () => {
    render(div)`
      <div :text=${null}>123</div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div></div>
    `);

    render(div)`
      <div :text=${undefined}>123</div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div></div>
    `);
  });

  it('使用 :html 指令对元素 innerHTML 进行绑定', () => {
    const text = '<span>123</span>';

    render(div)`
      <div :html=${text}></div>
    `;

    expect(div.firstElementChild.innerHTML).is.equals(
      text
    );
  });

  it('使用 :html 指令对元素 innerHTML 进行绑定, 传入 JSON 将会使用 JSON.stringify 进行格式化输出', () => {
    render(div)`
      <div :html=${{}}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>{}</div>
    `);

    render(div)`
      <div :html=${{ asd: 123 }}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>{\n  "asd": 123\n}</div>
    `);

    render(div)`
      <div :html=${{ asd: [123] }}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>{\n  "asd": [\n    123\n  ]\n}</div>
    `);
  });

  it('使用 :html 指令对元素 textContent 进行绑定, 传入数组将会使用 JSON.stringify 进行格式化输出', () => {
    render(div)`
      <div :html=${[]}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>[]</div>
    `);

    render(div)`
      <div :html=${[1, 2, 3]}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>[\n  1,\n  2,\n  3\n]</div>
    `);

    render(div)`
      <div :html=${[1, { asd: 123 }, 3]}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>[\n  1,\n  {\n    "asd": 123\n  },\n  3\n]</div>
    `);
  });

  it('使用 :html 指令对元素 innerHTML 进行绑定, 传入 null 或 undefined 时将会转为空字符串', () => {
    render(div)`
      <div :html=${null}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div></div>
    `);

    render(div)`
      <div :html=${undefined}></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div></div>
    `);
  });

  it('使用 :html 指令对元素 innerHTML 进行绑定, 首次传入 null 或 undefined 时, 元素的内容应该被清空', () => {
    render(div)`
      <div :html=${null}>123</div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div></div>
    `);

    render(div)`
      <div :html=${undefined}>123</div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div></div>
    `);
  });

  it('使用 :show 指令对元素的显示隐藏进行控制', () => {
    render(div)`
      <div :show=${false}></div>
    `;
    expect(div.firstElementChild.style.display).is.equals('none');

    render(div)`
      <div :show=${true}></div>
    `;
    expect(div.firstElementChild.style.display).is.equals('');

    render(div)`
      <div :show=${false}></div>
    `;
    expect(div.firstElementChild.style.display).is.equals('none');
  });

  it('使用 :show 指令对元素的显示隐藏进行控制, 首次传入 null 或 undefined 时, 元素应该被隐藏', () => {
    render(div)`
      <div :show=${undefined}></div>
    `;
    expect(div.firstElementChild.style.display).is.equals('none');
  });

  it('使用不存在的指令, 将会被当做普通属性处理', () => {
    render(div)`
      <div :zhang-wei=${666}></div>
    `;
    expect(div.firstElementChild.getAttribute(':zhang-wei')).equals('666');

    render(div)`
      <div :toString=${666}></div>
    `;
    expect(div.firstElementChild.getAttribute(':tostring')).equals('666');
  });
});
