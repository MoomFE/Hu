/* eslint-disable no-lone-blocks */
/* eslint-disable symbol-description */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-classes-per-file */


import { expect } from 'chai';
import Hu from '../../../../src/build/index';
import { userDirectives } from '../../../../src/html/const';
import { ownKeys, deleteProperty } from '../../../../src/shared/global/Reflect/index';


describe('Hu.static.directive', () => {
  const render = Hu.render;
  const html = Hu.html;

  /** @type {Element} */
  let div;
  beforeEach(() => {
    div = document.createElement('div').$appendTo(document.body);
  });
  afterEach(() => {
    div.$remove();
    ownKeys(userDirectives).forEach((key) => {
      deleteProperty(userDirectives, key);
    });
  });

  it('Hu.directive: 使用该方法可用于注册自定义指令', () => {
    Hu.directive('html', class {
      constructor(element, strings, modifires) {
        this.elm = element;
      }

      commit(value) {
        this.elm.innerHTML = value;
      }
    });

    render(div)`
      <div :html=${123}></div>
    `;
    expect(div.firstElementChild.innerHTML).is.equals('123');
  });

  it('Hu.directive: 注册的指令可以定义 constructor 接收指令使用时的相关参数, 第一个参数为绑定了指令的 DOM 元素', () => {
    let result;

    Hu.directive('test', class {
      constructor(element) {
        result = element;
      }

      commit() {}
    });

    render(div)`
      <div :test=${0}></div>
    `;
    expect(result).is.equals(div.firstElementChild).includes({
      nodeName: 'DIV'
    });

    render(div)`
      <span :test=${0}></span>
    `;
    expect(result).is.equals(div.firstElementChild).includes({
      nodeName: 'SPAN'
    });

    render(div)`
      <b :test=${0}></b>
    `;
    expect(result).is.equals(div.firstElementChild).includes({
      nodeName: 'B'
    });
  });

  it('Hu.directive: 注册的指令可以定义 constructor 接收指令使用时的相关参数, 第二个参数为使用指令时除了插值绑定的其他部分', () => {
    let result;

    Hu.directive('test', class {
      constructor(element, strings) {
        result = strings;
      }

      commit() {}
    });

    render(div)`
      <div :test=${'Hu'}></div>
    `;
    expect(result).is.deep.equals(['', '']);

    render(div)`
      <div :test="${'Hu'}"></div>
    `;
    expect(result).is.deep.equals(['', '']);

    render(div)`
      <span :test="I am ${'Hu'}.js"></span>
    `;
    expect(result).is.deep.equals(['I am ', '.js']);

    render(div)`
      <span :test="${'I'} am ${'Hu'}.js"></span>
    `;
    expect(result).is.deep.equals(['', ' am ', '.js']);

    render(div)`
      <span :test="${'I'} am ${'Hu'}.${'js'}"></span>
    `;
    expect(result).is.deep.equals(['', ' am ', '.', '']);
  });

  it('Hu.directive: 注册的指令可以定义 constructor 接收指令使用时的相关参数, 第二个参数为使用指令时除了插值绑定的其他部分', () => {
    let result;

    Hu.directive('test', class {
      constructor(element, strings, modifires) {
        result = modifires;
      }

      commit() {}
    });

    render(div)`
      <div :test=${'Hu'}></div>
    `;
    expect(result).is.deep.equals({});

    render(div)`
      <div :test.a=${'Hu'}></div>
    `;
    expect(result).is.deep.equals({
      a: true
    });

    render(div)`
      <div :test.a.b=${'Hu'}></div>
    `;
    expect(result).is.deep.equals({
      a: true,
      b: true
    });

    render(div)`
      <div :test.a.b.c=${'Hu'}></div>
    `;
    expect(result).is.deep.equals({
      a: true,
      b: true,
      c: true
    });
  });

  it('Hu.directive: 注册的指令可以定义 commit 接收用户传递的值, 第一个参数为传递进来的值', () => {
    let result;

    Hu.directive('test', class {
      commit(value) {
        result = value;
      }
    });

    render(div)`
      <div :test=${1}></div>
    `;
    expect(result).is.equals(1);

    render(div)`
      <div :test=${'2'}></div>
    `;
    expect(result).is.equals('2');

    render(div)`
      <div :test=${true}></div>
    `;
    expect(result).is.equals(true);

    render(div)`
      <div :test=${false}></div>
    `;
    expect(result).is.equals(false);

    render(div)`
      <div :test=${[]}></div>
    `;
    expect(result).is.deep.equals([]);

    render(div)`
      <div :test=${{}}></div>
    `;
    expect(result).is.deep.equals({});
  });

  it('Hu.directive: 注册的指令可以定义 commit 接收用户传递的值, 第二个参数用于判断用户传递的值是否是指令方法', () => {
    let result;
    let directiveFn;
    let fn;

    Hu.directive('test', class {
      commit(value, isDirectiveFn) {
        result = [value, isDirectiveFn];
      }
    });

    render(div)`
      <div :test=${1}></div>
    `;
    expect(result).is.deep.equals([1, false]);

    render(div)`
      <div :test=${'2'}></div>
    `;
    expect(result).is.deep.equals(['2', false]);

    render(div)`
      <div :test=${true}></div>
    `;
    expect(result).is.deep.equals([true, false]);

    render(div)`
      <div :test=${false}></div>
    `;
    expect(result).is.deep.equals([false, false]);

    render(div)`
      <div :test=${[]}></div>
    `;
    expect(result).is.deep.equals([[], false]);

    render(div)`
      <div :test=${{}}></div>
    `;
    expect(result).is.deep.equals([{}, false]);

    render(div)`
      <div :test=${fn = () => {}}></div>
    `;
    expect(result).is.deep.equals([fn, false]);

    render(div)`
      <div :test=${directiveFn = html.unsafe('')}></div>
    `;
    expect(result).is.deep.equals([directiveFn, true]);
  });

  it('Hu.directive: 注册的指令可以定义 destroy 接收指令被注销事件', () => {
    let index = 0;

    Hu.directive('test', class {
      commit() {}

      destroy() {
        index++;
      }
    });

    render(div)`
      <div :test=${'test'}></div>
    `;
    expect(index).is.equals(0);
    render(null, div);
    expect(index).is.equals(1);
  });

  it('Hu.directive: 注册的指令只能在 DOM 元素上使用', () => {
    let result;

    Hu.directive('test', class {
      commit(value) {
        result = value;
      }
    });

    render(div)`
      <div :test=${1}></div>
    `;
    expect(result).is.equals(1);

    render(div)`
      <div :test=${2}></div>
    `;
    expect(result).is.equals(2);

    render(div)`
      <div>:test=${3}</div>
    `;
    expect(result).is.equals(2);
  });

  it('------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------');

  it('Hu.directive: 指令在被弃用时会触发 destroy 方法 ( 切换模板 )', () => {
    let destroyIndex = 0;

    Hu.directive('test', class {
      commit() {}

      destroy() {
        destroyIndex++;
      }
    });


    render(div)`
      <div :test=${null}></div>
    `;
    expect(destroyIndex).is.equals(0);

    render(div)`
      <div></div>
    `;
    expect(destroyIndex).is.equals(1);

    // --

    render(div)`
      <div :test=${null}></div>
    `;
    expect(destroyIndex).is.equals(1);

    render(div)`
      <div></div>
    `;
    expect(destroyIndex).is.equals(2);
  });

  it('Hu.directive: 指令在被弃用时会触发 destroy 方法 ( 切换数组内的模板 )', () => {
    let destroyIndex = 0;

    Hu.directive('test', class {
      commit() {}

      destroy() {
        destroyIndex++;
      }
    });


    render(div)`${
      [1, 2, 3].map(() => {
        return html`<div :test=${null}></div>`;
      })
    }`;
    expect(destroyIndex).is.equals(0);

    render(div)`
      <div></div>
    `;
    expect(destroyIndex).is.equals(3);

    // --

    render(div)`${
      [1, 2, 3].map(() => {
        return html`<div :test=${null}></div>`;
      })
    }`;
    expect(destroyIndex).is.equals(3);

    render(div)`
      <div></div>
    `;
    expect(destroyIndex).is.equals(6);
  });

  it('Hu.directive: 指令在被弃用时会触发 destroy 方法 ( 切换数组内的模板 )', () => {
    let destroyIndex = 0;

    Hu.directive('test', class {
      commit() {}

      destroy() {
        destroyIndex++;
      }
    });


    render(div)`${
      [1, 2, 3].map(() => {
        return html`<div :test=${null}></div>`;
      })
    }`;
    expect(destroyIndex).is.equals(0);

    render(div)`${
      [1, 2, 3, 4, 5, 6, 7].map(() => {
        return html`<div :test=${null}></div>`;
      })
    }`;
    expect(destroyIndex).is.equals(0);

    // --

    render(div)`${
      [1, 2, 3].map(() => {
        return html`<div :test=${null}></div>`;
      })
    }`;
    expect(destroyIndex).is.equals(4);

    render(div)`
      <div></div>
    `;
    expect(destroyIndex).is.equals(7);
  });

  it('Hu.directive: 指令在被弃用时会触发 destroy 方法 ( 插值内切换: 模板 )', () => {
    let destroyIndex = 0;

    Hu.directive('test', class {
      commit() {}

      destroy() {
        destroyIndex++;
      }
    });


    render(div)`${
      html`<div :test=${null}></div>`
    }`;
    expect(destroyIndex).is.equals(0);

    render(div)`${
      html`<div></div>`
    }`;
    expect(destroyIndex).is.equals(1);

    // --

    render(div)`${
      html`<div :test=${null}></div>`
    }`;
    expect(destroyIndex).is.equals(1);

    render(div)`${
      html`<div></div>`
    }`;
    expect(destroyIndex).is.equals(2);
  });

  it('Hu.directive: 指令在被弃用时会触发 destroy 方法 ( 插值内切换: 模板 <-> 原始类型,对象,元素节点,指令方法 )', () => {
    const types = [];

    // 原始类型
    {
      types.push(
        'undefined', 'null', 'Hu', '',
        Number.MIN_SAFE_INTEGER, -1, 0, 1, Number.MAX_VALUE,
        true, false,
        undefined, null,
        Symbol(), Symbol.iterator, Symbol(123)
      );

      if (typeof BigInt === 'function') {
        types.push(
          BigInt(Number.MIN_SAFE_INTEGER), // eslint-disable-line no-undef
          BigInt(-1), // eslint-disable-line no-undef
          BigInt(0), // eslint-disable-line no-undef
          BigInt(1), // eslint-disable-line no-undef
          BigInt(Number.MAX_VALUE) // eslint-disable-line no-undef
        );
      }
    }

    // 对象
    {
      types.push(
        [], [-1], [0], [1], [1, 2], [1, 2, 3],
        {}, { a: 1 }, { a: 1, b: 2 },
        Object.create(null), Object.assign(Object.create(null), { a: 1 }), Object.assign(Object.create(null), { a: 1, b: 2 })
      );
    }

    // 元素节点
    {
      types.push(
        document.createElement('div')
      );
    }

    // 指令方法
    {
      types.push(
        html.unsafe(''),
        html.unsafe('Hu')
      );
    }

    for (let index = 0; index < types.length; index++) {
      let destroyIndex = 0;

      Hu.directive('test', class {
        commit() {}

        destroy() {
          destroyIndex++;
        }
      });

      expect(destroyIndex).is.equals(0);

      // 从纯模板切换到对象
      {
        const nowDestroyIndex = destroyIndex;

        render(div)`${
          html`<div :test=${null}></div>`
        }`;
        expect(destroyIndex).is.equals(nowDestroyIndex);

        render(div)`${
          types[index]
        }`;
        expect(destroyIndex).is.equals(nowDestroyIndex + 1);

        // 重复测试

        render(div)`${
          html`<div :test=${null}></div>`
        }`;
        expect(destroyIndex).is.equals(nowDestroyIndex + 1);

        render(div)`${
          types[index]
        }`;
        expect(destroyIndex).is.equals(nowDestroyIndex + 2);
      }

      // 从纯模板切换到数组中的对象
      {
        const nowDestroyIndex = destroyIndex;

        render(div)`${
          html`<div :test=${null}></div>`
        }`;
        expect(destroyIndex).is.equals(nowDestroyIndex);

        render(div)`${[
          types[index]
        ]}`;
        expect(destroyIndex).is.equals(nowDestroyIndex + 1);

        // 重复测试

        render(div)`${
          html`<div :test=${null}></div>`
        }`;
        expect(destroyIndex).is.equals(nowDestroyIndex + 1);

        render(div)`${[
          types[index]
        ]}`;
        expect(destroyIndex).is.equals(nowDestroyIndex + 2);
      }

      // 从数组中的模板切换到对象
      {
        const nowDestroyIndex = destroyIndex;

        render(div)`${[
          html`<div :test=${null}></div>`
        ]}`;
        expect(destroyIndex).is.equals(nowDestroyIndex);

        render(div)`${
          types[index]
        }`;
        expect(destroyIndex).is.equals(nowDestroyIndex + 1);

        // 重复测试

        render(div)`${[
          html`<div :test=${null}></div>`
        ]}`;
        expect(destroyIndex).is.equals(nowDestroyIndex + 1);

        render(div)`${
          types[index]
        }`;
        expect(destroyIndex).is.equals(nowDestroyIndex + 2);
      }

      // 从数组中的模板切换到数组中的对象
      {
        const nowDestroyIndex = destroyIndex;

        render(div)`${[
          html`<div :test=${null}></div>`
        ]}`;
        expect(destroyIndex).is.equals(nowDestroyIndex);

        render(div)`${[
          types[index]
        ]}`;
        expect(destroyIndex).is.equals(nowDestroyIndex + 1);

        // 重复测试

        render(div)`${[
          html`<div :test=${null}></div>`
        ]}`;
        expect(destroyIndex).is.equals(nowDestroyIndex + 1);

        render(div)`${[
          types[index]
        ]}`;
        expect(destroyIndex).is.equals(nowDestroyIndex + 2);
      }
    }
  });
});
