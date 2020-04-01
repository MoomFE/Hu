/* global stripExpressionMarkers, templateMarker */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */


import { expect, should as chaiShould } from 'chai';
import Hu from '../../../../src/build/index';


const should = chaiShould();


describe('Hu.static', () => {
  /** @type {Element} */
  let div;
  beforeEach(() => {
    div = document.createElement('div').$appendTo(document.body);
  });
  afterEach(() => {
    div.$remove();
  });


  it('Hu.define: 方法用于注册一个全局的自定义元素', () => {
    const customName = window.customName;

    Hu.define(customName, {
      render(html) {
        return html`
          <div>custom-element</div>
        `;
      }
    });

    const custom = document.createElement(customName).$appendTo(document.body);
    const hu = custom.$hu;

    expect(stripExpressionMarkers(hu.$el.innerHTML)).is.equals(`
          <div>custom-element</div>
        `);

    custom.$remove();
  });

  it('Hu.define: 注册过的自定义元素不可再次注册', () => {
    const customName = window.customName;

    Hu.define(customName);

    should.throw(() => {
      Hu.define(customName);
    });
  });

  it('Hu.observable: 方法用于将传入对象转为观察者对象', (done) => {
    const data = Hu.observable({
      a: 1,
      b: 2
    });

    /* ------------------ 测试是否能被响应 ------------------ */
    let index = 0;
    const hu = new Hu({
      computed: {
        a: () => {
          index++;
          return data.a + data.b;
        }
      },
      watch: {
        a: () => {}
      }
    });

    expect(index).is.equals(1);

    data.a = 2;
    hu.$nextTick(() => {
      expect(index).is.equals(2);

      done();
    });
  });

  it('Hu.observable: 转换 JSON 格式类型, 确保转换完成后是有效的', (done) => {
    const data = Hu.observable({
      a: 1
    });

    // getter
    expect(data.a).is.equals(1);

    // setter
    data.a = 2;
    expect(data.a).is.equals(2);

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

    expect(index).is.equals(1);

    data.a = 1;
    hu.$nextTick(() => {
      expect(index).is.equals(2);

      done();
    });
  });

  it('Hu.observable: 转换数组类型, 确保转换完成后是有效的', (done) => {
    const data = Hu.observable([
      1
    ]);

    // getter
    expect(data[0]).is.equals(1);

    // setter
    data[0] = 2;
    expect(data[0]).is.equals(2);

    /* ------------------ 测试是否能被响应 ------------------ */
    let index = 0;
    const hu = new Hu({
      computed: {
        a: () => {
          index++;
          return data[0];
        }
      },
      watch: {
        a: () => {}
      }
    });

    expect(index).is.equals(1);

    data[0] = 1;
    hu.$nextTick(() => {
      expect(index).is.equals(2);

      done();
    });
  });

  it('Hu.html: 创建用于渲染的模板', () => {
    const result = Hu.html`
      <div id=${'asd'}>${123}</div>
    `;
    const getHTML = result.getHTML();
    const getTemplateElement = result.getTemplateElement();

    expect(getHTML).is.equals(`
      <div id$hu$=${templateMarker}><!--${templateMarker}--></div>
    `);

    expect(getTemplateElement.nodeName).is.equals('TEMPLATE');
    expect(getTemplateElement.innerHTML).is.equals(`
      <div id$hu$="${templateMarker}"><!--${templateMarker}--></div>
    `);
  });

  {
    const div1 = document.createElement('div').$appendTo(document.body).$html('<svg><text y="50%" dy="30%">123</text></svg>');
    const div2 = document.createElement('div').$appendTo(document.body).$html('<svg></svg>');

    div2.firstElementChild.appendChild(
      document.createElement('text').$appendTo(div2).$html('123').$attr({ y: '50%', dy: '30%' })
    );

    const display1 = getComputedStyle(div1.querySelector('text')).display;
    const display2 = getComputedStyle(div2.querySelector('text')).display;

    div1.$remove();
    div2.$remove();

    if (display1 !== display2) {
      it('Hu.html.svg: 创建用于 SVG 标签内部标签的模板', () => {
        const htmlResult = Hu.html`<text y="50%" dy="30%">123</text>`;
        const svgResult = Hu.html.svg`<text y="50%" dy="30%">123</text>`;

        Hu.render(div)`
          <svg>${htmlResult}</svg>
        `;
        expect(getComputedStyle(div.querySelector('text'))).is.include({
          display: display2
        });

        Hu.render(div)`
          <svg>${svgResult}</svg>
        `;
        expect(getComputedStyle(div.querySelector('text'))).is.include({
          display: display1
        });
      });
    }
  }

  it('Hu.render: 方法用于直接渲染一段模板片段', () => {
    const result = Hu.html`
      <div>${123}</div>
    `;

    Hu.render(result, div);

    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>123</div>
    `);
  });

  it('Hu.render: 默认使用方式', () => {
    Hu.render(
      Hu.html`
        <div>${123}</div>
      `,
      div
    );

    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
        <div>123</div>
      `);
  });

  it('Hu.render: 另一种使用方式', () => {
    Hu.render(div)`
      <div>${123}</div>
    `;

    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>123</div>
    `);
  });

  it('Hu.nextTick: 方法用于在下次 DOM 更新循环结束之后执行延迟回调', (done) => {
    const data = Hu.observable({
      msg: 'hello'
    });

    Hu.render(div)`${
      Hu.html.bind(data, 'msg')
    }`;

    expect(div.textContent).is.equals('hello');

    data.msg += ' !';
    expect(div.textContent).is.equals('hello');
    Hu.nextTick(() => {
      expect(div.textContent).is.equals('hello !');

      done();
    });
  });

  it('Hu.version: 字符串形式的 Hu 安装版本号', () => {
    expect(Hu.version).is.a('string');
  });

  it('Hu.util: 共享出来的部分内部使用的方法', () => {
    let isRun = false;

    Reflect.ownKeys(Hu.util).forEach((name) => {
      isRun = true;
      expect(Hu.util[name]).is.a('function');
    });

    expect(isRun).is.true;
  });

  it('Hu.util.addEvent: 绑定事件', () => {
    let index = 0;

    Hu.util.addEvent(div, 'click', () => {
      index++;
    });

    expect(index).is.equals(0);

    div.click();
    div.click();
    div.click();

    expect(index).is.equals(3);
  });

  it('Hu.util.removeEvent: 移除事件', () => {
    let index = 0;
    const fn = () => index++;

    Hu.util.addEvent(div, 'click', fn);

    expect(index).is.equals(0);

    div.click();
    div.click();
    div.click();

    expect(index).is.equals(3);

    Hu.util.removeEvent(div, 'click', fn);

    div.click();
    div.click();
    div.click();

    expect(index).is.equals(3);
  });

  it('Hu.util.each: 对象遍历方法', () => {
    const steps = [];
    const data = {
      a: 1,
      b: 2,
      c: 3
    };

    Hu.util.each(data, (key, value) => {
      steps.push(key, value);
    });

    expect(steps).is.deep.equals([
      'a', 1, 'b', 2, 'c', 3
    ]);
  });

  it('Hu.util.toString: 将值转为字符串形式', () => {
    expect(Hu.util.toString(undefined)).is.equals('');
    expect(Hu.util.toString(null)).is.equals('');
    expect(Hu.util.toString(NaN)).is.equals('NaN');
    expect(Hu.util.toString(Infinity)).is.equals('Infinity');
    expect(Hu.util.toString('undefined')).is.equals('undefined');
    expect(Hu.util.toString('null')).is.equals('null');
    expect(Hu.util.toString('asd')).is.equals('asd');
    expect(Hu.util.toString('')).is.equals('');
    expect(Hu.util.toString({})).is.equals('{}');
    expect(Hu.util.toString({ asd: 123 })).is.equals('{\n  "asd": 123\n}');
    expect(Hu.util.toString(Object.create(null))).is.equals('{}');
    expect(Hu.util.toString(Object.assign(Object.create(null), { asd: 123 }))).is.equals('{\n  "asd": 123\n}');
    expect(Hu.util.toString([])).is.equals('[]');
    expect(Hu.util.toString([1])).is.equals('[\n  1\n]');
    expect(Hu.util.toString(true)).is.equals('true');
    expect(Hu.util.toString(false)).is.equals('false');
    expect(Hu.util.toString(0)).is.equals('0');
    expect(Hu.util.toString(1)).is.equals('1');
    expect(Hu.util.toString(2)).is.equals('2');
    expect(Hu.util.toString(Symbol())).is.equals('Symbol()'); // eslint-disable-line symbol-description
    expect(Hu.util.toString(Symbol.iterator)).is.equals('Symbol(Symbol.iterator)');
    expect(Hu.util.toString(Symbol(123))).is.equals('Symbol(123)');
    expect(true).is.equals(
      ['function(){}', 'function (){}', '() => {}'].$inArray(
        Hu.util.toString(() => {})
      )
    );
  });

  it('Hu.util.isPlainObject: 判断传入对象是否是纯粹的对象', () => {
    expect(Hu.util.isPlainObject(undefined)).is.false;
    expect(Hu.util.isPlainObject(null)).is.false;
    expect(Hu.util.isPlainObject(NaN)).is.false;
    expect(Hu.util.isPlainObject(Infinity)).is.false;
    expect(Hu.util.isPlainObject('undefined')).is.false;
    expect(Hu.util.isPlainObject('null')).is.false;
    expect(Hu.util.isPlainObject('asd')).is.false;
    expect(Hu.util.isPlainObject('')).is.false;
    expect(Hu.util.isPlainObject({})).is.true;
    expect(Hu.util.isPlainObject({ asd: 123 })).is.true;
    expect(Hu.util.isPlainObject(Object.create(null))).is.true;
    expect(Hu.util.isPlainObject(Object.assign(Object.create(null), { asd: 123 }))).is.true;
    expect(Hu.util.isPlainObject([])).is.false;
    expect(Hu.util.isPlainObject([1])).is.false;
    expect(Hu.util.isPlainObject(true)).is.false;
    expect(Hu.util.isPlainObject(false)).is.false;
    expect(Hu.util.isPlainObject(0)).is.false;
    expect(Hu.util.isPlainObject(1)).is.false;
    expect(Hu.util.isPlainObject(2)).is.false;
    expect(Hu.util.isPlainObject(Symbol())).is.false; // eslint-disable-line symbol-description
    expect(Hu.util.isPlainObject(Symbol.iterator)).is.false;
    expect(Hu.util.isPlainObject(Symbol(123))).is.false;
    expect(Hu.util.isPlainObject(() => {})).is.false;
  });

  it('Hu.util.isEmptyObject: 判断传入对象是否是一个空对象', () => {
    expect(Hu.util.isEmptyObject({})).is.true;
    expect(Hu.util.isEmptyObject({ asd: 123 })).is.false;
    expect(Hu.util.isEmptyObject(Object.create(null))).is.true;
    expect(Hu.util.isEmptyObject(Object.assign(Object.create(null), { asd: 123 }))).is.false;
  });

  it('Hu.util.isPrimitive: 判断传入对象是否是原始对象', () => {
    expect(Hu.util.isPrimitive(undefined)).is.true;
    expect(Hu.util.isPrimitive(null)).is.true;
    expect(Hu.util.isPrimitive(NaN)).is.true;
    expect(Hu.util.isPrimitive(Infinity)).is.true;
    expect(Hu.util.isPrimitive('undefined')).is.true;
    expect(Hu.util.isPrimitive('null')).is.true;
    expect(Hu.util.isPrimitive('asd')).is.true;
    expect(Hu.util.isPrimitive('')).is.true;
    expect(Hu.util.isPrimitive({})).is.false;
    expect(Hu.util.isPrimitive({ asd: 123 })).is.false;
    expect(Hu.util.isPrimitive(Object.create(null))).is.false;
    expect(Hu.util.isPrimitive(Object.assign(Object.create(null), { asd: 123 }))).is.false;
    expect(Hu.util.isPrimitive([])).is.false;
    expect(Hu.util.isPrimitive([1])).is.false;
    expect(Hu.util.isPrimitive(true)).is.true;
    expect(Hu.util.isPrimitive(false)).is.true;
    expect(Hu.util.isPrimitive(0)).is.true;
    expect(Hu.util.isPrimitive(1)).is.true;
    expect(Hu.util.isPrimitive(2)).is.true;
    expect(Hu.util.isPrimitive(Symbol())).is.true; // eslint-disable-line symbol-description
    expect(Hu.util.isPrimitive(Symbol.iterator)).is.true;
    expect(Hu.util.isPrimitive(Symbol(123))).is.true;
    expect(Hu.util.isPrimitive(() => {})).is.false;
  });

  it('Hu.util.isIterable: 判断传入对象是否可迭代', () => {
    expect(Hu.util.isIterable(undefined)).is.false;
    expect(Hu.util.isIterable(null)).is.false;
    expect(Hu.util.isIterable(NaN)).is.false;
    expect(Hu.util.isIterable(Infinity)).is.false;
    expect(Hu.util.isIterable('undefined')).is.true;
    expect(Hu.util.isIterable('null')).is.true;
    expect(Hu.util.isIterable('asd')).is.true;
    expect(Hu.util.isIterable('')).is.true;
    expect(Hu.util.isIterable({})).is.false;
    expect(Hu.util.isIterable({ asd: 123 })).is.false;
    expect(Hu.util.isIterable(Object.create(null))).is.false;
    expect(Hu.util.isIterable(Object.assign(Object.create(null), { asd: 123 }))).is.false;
    expect(Hu.util.isIterable([])).is.true;
    expect(Hu.util.isIterable([1])).is.true;
    expect(Hu.util.isIterable(true)).is.false;
    expect(Hu.util.isIterable(false)).is.false;
    expect(Hu.util.isIterable(0)).is.false;
    expect(Hu.util.isIterable(1)).is.false;
    expect(Hu.util.isIterable(2)).is.false;
    expect(Hu.util.isIterable(Symbol())).is.false; // eslint-disable-line symbol-description
    expect(Hu.util.isIterable(Symbol.iterator)).is.false;
    expect(Hu.util.isIterable(Symbol(123))).is.false;
    expect(Hu.util.isIterable(() => {})).is.false;
  });

  it('Hu.util.isEqual: 判断传入的两个值是否相等', () => {
    expect(Hu.util.isEqual(undefined, undefined)).is.true;
    expect(Hu.util.isEqual(null, null)).is.true;
    expect(Hu.util.isEqual(NaN, NaN)).is.true;
    expect(Hu.util.isEqual(Infinity, Infinity)).is.true;
    expect(Hu.util.isEqual('undefined', 'undefined')).is.true;
    expect(Hu.util.isEqual('null', 'null')).is.true;
    expect(Hu.util.isEqual('asd', 'asd')).is.true;
    expect(Hu.util.isEqual('', '')).is.true;
    expect(Hu.util.isEqual({}, {})).is.false;
    expect(Hu.util.isEqual({ asd: 123 }, { asd: 123 })).is.false;
    expect(Hu.util.isEqual(Object.create(null), Object.create(null))).is.false;
    expect(Hu.util.isEqual(Object.assign(Object.create(null), { asd: 123 }), Object.assign(Object.create(null), { asd: 123 }))).is.false;
    expect(Hu.util.isEqual([], [])).is.false;
    expect(Hu.util.isEqual([1], [1])).is.false;
    expect(Hu.util.isEqual(true, true)).is.true;
    expect(Hu.util.isEqual(false, false)).is.true;
    expect(Hu.util.isEqual(0, 0)).is.true;
    expect(Hu.util.isEqual(1, 1)).is.true;
    expect(Hu.util.isEqual(2, 2)).is.true;
    expect(Hu.util.isEqual(Symbol(), Symbol())).is.false; // eslint-disable-line symbol-description
    expect(Hu.util.isEqual(Symbol.iterator, Symbol.iterator)).is.true;
    expect(Hu.util.isEqual(Symbol(123), Symbol(123))).is.false;
    expect(Hu.util.isEqual(() => {}, () => {})).is.false;
  });

  it('Hu.util.isNotEqual: 判断传入的两个值是否不相等', () => {
    expect(Hu.util.isNotEqual(undefined, undefined)).is.false;
    expect(Hu.util.isNotEqual(null, null)).is.false;
    expect(Hu.util.isNotEqual(NaN, NaN)).is.false;
    expect(Hu.util.isNotEqual(Infinity, Infinity)).is.false;
    expect(Hu.util.isNotEqual('undefined', 'undefined')).is.false;
    expect(Hu.util.isNotEqual('null', 'null')).is.false;
    expect(Hu.util.isNotEqual('asd', 'asd')).is.false;
    expect(Hu.util.isNotEqual('', '')).is.false;
    expect(Hu.util.isNotEqual({}, {})).is.true;
    expect(Hu.util.isNotEqual({ asd: 123 }, { asd: 123 })).is.true;
    expect(Hu.util.isNotEqual(Object.create(null), Object.create(null))).is.true;
    expect(Hu.util.isNotEqual(Object.assign(Object.create(null), { asd: 123 }), Object.assign(Object.create(null), { asd: 123 }))).is.true;
    expect(Hu.util.isNotEqual([], [])).is.true;
    expect(Hu.util.isNotEqual([1], [1])).is.true;
    expect(Hu.util.isNotEqual(true, true)).is.false;
    expect(Hu.util.isNotEqual(false, false)).is.false;
    expect(Hu.util.isNotEqual(0, 0)).is.false;
    expect(Hu.util.isNotEqual(1, 1)).is.false;
    expect(Hu.util.isNotEqual(2, 2)).is.false;
    expect(Hu.util.isNotEqual(Symbol(), Symbol())).is.true; // eslint-disable-line symbol-description
    expect(Hu.util.isNotEqual(Symbol.iterator, Symbol.iterator)).is.false;
    expect(Hu.util.isNotEqual(Symbol(123), Symbol(123))).is.true;
    expect(Hu.util.isNotEqual(() => {}, () => {})).is.true;
  });

  it('Hu.util.isString: 判断传入对象是否是 String 类型', () => {
    expect(Hu.util.isString(undefined)).is.false;
    expect(Hu.util.isString(null)).is.false;
    expect(Hu.util.isString(NaN)).is.false;
    expect(Hu.util.isString(Infinity)).is.false;
    expect(Hu.util.isString('undefined')).is.true;
    expect(Hu.util.isString('null')).is.true;
    expect(Hu.util.isString('asd')).is.true;
    expect(Hu.util.isString('')).is.true;
    expect(Hu.util.isString({})).is.false;
    expect(Hu.util.isString({ asd: 123 })).is.false;
    expect(Hu.util.isString(Object.create(null))).is.false;
    expect(Hu.util.isString(Object.assign(Object.create(null), { asd: 123 }))).is.false;
    expect(Hu.util.isString([])).is.false;
    expect(Hu.util.isString([1])).is.false;
    expect(Hu.util.isString(true)).is.false;
    expect(Hu.util.isString(false)).is.false;
    expect(Hu.util.isString(0)).is.false;
    expect(Hu.util.isString(1)).is.false;
    expect(Hu.util.isString(2)).is.false;
    expect(Hu.util.isString(Symbol())).is.false; // eslint-disable-line symbol-description
    expect(Hu.util.isString(Symbol.iterator)).is.false;
    expect(Hu.util.isString(Symbol(123))).is.false;
    expect(Hu.util.isString(() => {})).is.false;
  });

  it('Hu.util.isObject: 判断传入对象是否是 Object 类型', () => {
    expect(Hu.util.isObject(undefined)).is.false;
    expect(Hu.util.isObject(null)).is.false;
    expect(Hu.util.isObject(NaN)).is.false;
    expect(Hu.util.isObject(Infinity)).is.false;
    expect(Hu.util.isObject('undefined')).is.false;
    expect(Hu.util.isObject('null')).is.false;
    expect(Hu.util.isObject('asd')).is.false;
    expect(Hu.util.isObject('')).is.false;
    expect(Hu.util.isObject({})).is.true;
    expect(Hu.util.isObject({ asd: 123 })).is.true;
    expect(Hu.util.isObject(Object.create(null))).is.true;
    expect(Hu.util.isObject(Object.assign(Object.create(null), { asd: 123 }))).is.true;
    expect(Hu.util.isObject([])).is.true;
    expect(Hu.util.isObject([1])).is.true;
    expect(Hu.util.isObject(true)).is.false;
    expect(Hu.util.isObject(false)).is.false;
    expect(Hu.util.isObject(0)).is.false;
    expect(Hu.util.isObject(1)).is.false;
    expect(Hu.util.isObject(2)).is.false;
    expect(Hu.util.isObject(Symbol())).is.false; // eslint-disable-line symbol-description
    expect(Hu.util.isObject(Symbol.iterator)).is.false;
    expect(Hu.util.isObject(Symbol(123))).is.false;
    expect(Hu.util.isObject(() => {})).is.false;
  });

  it('Hu.util.isFunction: 判断传入对象是否是 Function 类型', () => {
    expect(Hu.util.isFunction(undefined)).is.false;
    expect(Hu.util.isFunction(null)).is.false;
    expect(Hu.util.isFunction(NaN)).is.false;
    expect(Hu.util.isFunction(Infinity)).is.false;
    expect(Hu.util.isFunction('undefined')).is.false;
    expect(Hu.util.isFunction('null')).is.false;
    expect(Hu.util.isFunction('asd')).is.false;
    expect(Hu.util.isFunction('')).is.false;
    expect(Hu.util.isFunction({})).is.false;
    expect(Hu.util.isFunction({ asd: 123 })).is.false;
    expect(Hu.util.isFunction(Object.create(null))).is.false;
    expect(Hu.util.isFunction(Object.assign(Object.create(null), { asd: 123 }))).is.false;
    expect(Hu.util.isFunction([])).is.false;
    expect(Hu.util.isFunction([1])).is.false;
    expect(Hu.util.isFunction(true)).is.false;
    expect(Hu.util.isFunction(false)).is.false;
    expect(Hu.util.isFunction(0)).is.false;
    expect(Hu.util.isFunction(1)).is.false;
    expect(Hu.util.isFunction(2)).is.false;
    expect(Hu.util.isFunction(Symbol())).is.false; // eslint-disable-line symbol-description
    expect(Hu.util.isFunction(Symbol.iterator)).is.false;
    expect(Hu.util.isFunction(Symbol(123))).is.false;
    expect(Hu.util.isFunction(() => {})).is.true;
  });

  it('Hu.util.isSymbol: 判断传入对象是否是 Symbol 类型', () => {
    expect(Hu.util.isSymbol(undefined)).is.false;
    expect(Hu.util.isSymbol(null)).is.false;
    expect(Hu.util.isSymbol(NaN)).is.false;
    expect(Hu.util.isSymbol(Infinity)).is.false;
    expect(Hu.util.isSymbol('undefined')).is.false;
    expect(Hu.util.isSymbol('null')).is.false;
    expect(Hu.util.isSymbol('asd')).is.false;
    expect(Hu.util.isSymbol('')).is.false;
    expect(Hu.util.isSymbol({})).is.false;
    expect(Hu.util.isSymbol({ asd: 123 })).is.false;
    expect(Hu.util.isSymbol(Object.create(null))).is.false;
    expect(Hu.util.isSymbol(Object.assign(Object.create(null), { asd: 123 }))).is.false;
    expect(Hu.util.isSymbol([])).is.false;
    expect(Hu.util.isSymbol([1])).is.false;
    expect(Hu.util.isSymbol(true)).is.false;
    expect(Hu.util.isSymbol(false)).is.false;
    expect(Hu.util.isSymbol(0)).is.false;
    expect(Hu.util.isSymbol(1)).is.false;
    expect(Hu.util.isSymbol(2)).is.false;
    expect(Hu.util.isSymbol(Symbol())).is.true; // eslint-disable-line symbol-description
    expect(Hu.util.isSymbol(Symbol.iterator)).is.true;
    expect(Hu.util.isSymbol(Symbol(123))).is.true;
    expect(Hu.util.isSymbol(() => {})).is.false;
  });

  it('Hu.util.uid: 返回一个字符串 UID', () => {
    expect(Hu.util.uid()).is.a('string');
    expect(Hu.util.uid()).is.not.equals(Hu.util.uid());
  });

  it('Hu.util.safety: 用于防止方法执行时被依赖收集', (done) => {
    const hu = new Hu({
      el: div,
      data: {
        value: 123
      },
      render(html) {
        return Hu.util.safety(() => {
          return html`<div>${this.value}</div>`;
        });
      }
    });

    expect(stripExpressionMarkers(div.innerHTML)).is.equals('<div>123</div>');

    hu.value = 1234;
    hu.$nextTick(() => {
      expect(stripExpressionMarkers(div.innerHTML)).is.equals('<div>123</div>');

      done();
    });
  });

  it('Hu.use: 方法用于安装一个 Hu.js 插件', () => {
    let args;

    const plugin = {
      install(Hu, privateOptions, options) {
        args = [Hu, privateOptions, options];
      }
    };

    expect(args).is.undefined;

    Hu.use(plugin, {
      a: 1
    });

    expect(args).is.not.undefined;
    expect(args[0]).is.equals(Hu);
    expect(args[1]).is.a('object');
    expect(args[2]).is.deep.equals({
      a: 1
    });
  });

  it('Hu.use: 可以只提供一个方法用于安装插件', () => {
    let args;

    const plugin = function (Hu, privateOptions, options) {
      args = [Hu, privateOptions, options];
    };

    expect(args).is.undefined;

    Hu.use(plugin, {
      a: 1
    });

    expect(args).is.not.undefined;
    expect(args[0]).is.equals(Hu);
    expect(args[1]).is.a('object');
    expect(args[2]).is.deep.equals({
      a: 1
    });
  });
});
