/* eslint-disable no-unused-vars */


import { expect } from 'chai';
import Hu from '../../../../src/build/index';


describe('options.methods', () => {
  function fn1() { return 1; }
  function fn2() { return 2; }
  function fn3() { return 3; }
  function fn4() { return 4; }

  it('定义方法时非 function 类型的将会被忽略', () => {
    const hu = new Hu({
      methods: {
        a: fn1,
        b: '',
        c: true,
        d: false,
        e: {},
        f: [],
        g: null,
        h: undefined,
        i: Symbol('i')
      }
    });

    expect(hu).has.property('a');
    expect(hu).not.has.property('b');
    expect(hu).not.has.property('c');
    expect(hu).not.has.property('d');
    expect(hu).not.has.property('e');
    expect(hu).not.has.property('f');
    expect(hu).not.has.property('g');
    expect(hu).not.has.property('h');
    expect(hu).not.has.property('i');

    expect(hu.$methods).has.property('a');
    expect(hu.$methods).not.has.property('b');
    expect(hu.$methods).not.has.property('c');
    expect(hu.$methods).not.has.property('d');
    expect(hu.$methods).not.has.property('e');
    expect(hu.$methods).not.has.property('f');
    expect(hu.$methods).not.has.property('g');
    expect(hu.$methods).not.has.property('h');
    expect(hu.$methods).not.has.property('i');

    expect(hu.a()).is.equals(1);
  });

  it('定义的方法在执行时, this 的指向是当前实例', () => {
    const hu = new Hu({
      methods: {
        a() {
          return this;
        }
      }
    });

    expect(hu.a()).is.equals(hu);
  });

  it('------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------');

  it('实例化后所定义的方法会全部添加到 $methods 实例属性中', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      methods: {
        a: fn1,
        [b]: fn2,
        $c: fn3,
        _d: fn4
      }
    });

    const div = document.createElement('div').$html(`<${customName}></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu.$methods).has.property('a');
    expect(hu.$methods).has.property(b);
    expect(hu.$methods).has.property('$c');
    expect(hu.$methods).has.property('_d');

    expect(hu.$methods.a).is.a('function');
    expect(hu.$methods[b]).is.a('function');
    expect(hu.$methods.$c).is.a('function');
    expect(hu.$methods._d).is.a('function');

    expect(hu.$methods.a()).is.equals(1);
    expect(hu.$methods[b]()).is.equals(2);
    expect(hu.$methods.$c()).is.equals(3);
    expect(hu.$methods._d()).is.equals(4);
  });

  it('实例化后会在实例本身添加 $methods 下所有首字母不为 $ 的方法的副本', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      methods: {
        a: fn1,
        [b]: fn2,
        $c: fn3,
        _d: fn4
      }
    });

    const div = document.createElement('div').$html(`<${customName}></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(hu).has.not.property('$c');
    expect(hu).has.property('_d');

    expect(hu.a).is.a('function');
    expect(hu[b]).is.a('function');
    expect(hu._d).is.a('function');

    expect(hu.a()).is.equals(1);
    expect(hu[b]()).is.equals(2);
    expect(hu._d()).is.equals(4);
  });

  it('实例化后会在自定义元素本身添加 $methods 下所有首字母不为 $ 和 _ 的方法的副本', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      methods: {
        a: fn1,
        [b]: fn2,
        $c: fn3,
        _d: fn4
      }
    });

    const div = document.createElement('div').$html(`<${customName}></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(custom).has.property('a');
    expect(custom).has.property(b);
    expect(custom).has.not.property('$c');
    expect(custom).has.not.property('_d');

    expect(custom.a).is.a('function');
    expect(custom[b]).is.a('function');

    expect(custom.a()).is.equals(1);
    expect(custom[b]()).is.equals(2);
  });

  it('实例化后若删除在实例本身添加的 $methods 的方法的副本, 不会影响到 $methods 的方法本体', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      methods: {
        a: fn1,
        [b]: fn2
      }
    });

    const div = document.createElement('div').$html(`<${customName}></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(hu.a).is.a('function');
    expect(hu[b]).is.a('function');
    expect(custom).has.property('a');
    expect(custom).has.property(b);
    expect(custom.a).is.a('function');
    expect(custom[b]).is.a('function');
    expect(hu.$methods).has.property('a');
    expect(hu.$methods).has.property(b);
    expect(hu.$methods.a).is.a('function');
    expect(hu.$methods[b]).is.a('function');

    delete hu.a;
    delete hu[b];

    expect(hu.a).is.equals(undefined);
    expect(hu[b]).is.equals(undefined);
    expect(custom.a).is.a('function');
    expect(custom[b]).is.a('function');
    expect(custom.a()).is.equals(1);
    expect(custom[b]()).is.equals(2);
    expect(hu.$methods.a).is.a('function');
    expect(hu.$methods[b]).is.a('function');
    expect(hu.$methods.a()).is.equals(1);
    expect(hu.$methods[b]()).is.equals(2);
  });

  it('实例化后若删除在自定义元素本身添加的 $methods 的方法的副本, 不会影响到 $methods 的方法本体', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      methods: {
        a: fn1,
        [b]: fn2
      }
    });

    const div = document.createElement('div').$html(`<${customName}></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(hu.a).is.a('function');
    expect(hu[b]).is.a('function');
    expect(custom).has.property('a');
    expect(custom).has.property(b);
    expect(custom.a).is.a('function');
    expect(custom[b]).is.a('function');
    expect(hu.$methods).has.property('a');
    expect(hu.$methods).has.property(b);
    expect(hu.$methods.a).is.a('function');
    expect(hu.$methods[b]).is.a('function');

    delete custom.a;
    delete custom[b];

    expect(hu.a).is.a('function');
    expect(hu[b]).is.a('function');
    expect(hu.a()).is.equals(1);
    expect(hu[b]()).is.equals(2);
    expect(custom.a).is.equals(undefined);
    expect(custom[b]).is.equals(undefined);
    expect(hu.$methods.a).is.a('function');
    expect(hu.$methods[b]).is.a('function');
    expect(hu.$methods.a()).is.equals(1);
    expect(hu.$methods[b]()).is.equals(2);
  });

  it('实例化后不可以通过改变实例本身的方法对 $methods 内的的方法进行更改', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      methods: {
        a: fn1,
        [b]: fn2
      }
    });

    const div = document.createElement('div').$html(`<${customName}></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(hu.a).is.a('function');
    expect(hu[b]).is.a('function');
    expect(hu.a()).is.equals(1);
    expect(hu[b]()).is.equals(2);
    expect(hu.$methods).has.property('a');
    expect(hu.$methods).has.property(b);
    expect(hu.$methods.a).is.a('function');
    expect(hu.$methods[b]).is.a('function');
    expect(hu.$methods.a()).is.equals(1);
    expect(hu.$methods[b]()).is.equals(2);

    hu.a = 3;

    expect(hu.a).is.equals(3);
    expect(hu).has.property(b);
    expect(hu[b]).is.a('function');
    expect(hu[b]()).is.equals(2);
    expect(hu.$methods).has.property('a');
    expect(hu.$methods).has.property(b);
    expect(hu.$methods.a).is.a('function');
    expect(hu.$methods[b]).is.a('function');
    expect(hu.$methods.a()).is.equals(1);
    expect(hu.$methods[b]()).is.equals(2);

    hu[b] = 4;

    expect(hu.a).is.equals(3);
    expect(hu[b]).is.equals(4);
    expect(hu.$methods).has.property('a');
    expect(hu.$methods).has.property(b);
    expect(hu.$methods.a).is.a('function');
    expect(hu.$methods[b]).is.a('function');
    expect(hu.$methods.a()).is.equals(1);
    expect(hu.$methods[b]()).is.equals(2);
  });

  it('实例化后不可以通过改变自定义元素本身的方法对 $methods 内的的方法进行更改', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      methods: {
        a: fn1,
        [b]: fn2
      }
    });

    const div = document.createElement('div').$html(`<${customName}></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(hu.a).is.a('function');
    expect(hu[b]).is.a('function');
    expect(hu.a()).is.equals(1);
    expect(hu[b]()).is.equals(2);
    expect(custom).has.property('a');
    expect(custom).has.property(b);
    expect(custom.a).is.a('function');
    expect(custom[b]).is.a('function');
    expect(custom.a()).is.equals(1);
    expect(custom[b]()).is.equals(2);
    expect(hu.$methods).has.property('a');
    expect(hu.$methods).has.property(b);
    expect(hu.$methods.a).is.a('function');
    expect(hu.$methods[b]).is.a('function');
    expect(hu.$methods.a()).is.equals(1);
    expect(hu.$methods[b]()).is.equals(2);

    custom.a = 3;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(hu.a).is.a('function');
    expect(hu[b]).is.a('function');
    expect(hu.a()).is.equals(1);
    expect(hu[b]()).is.equals(2);
    expect(custom.a).is.equals(3);
    expect(custom).has.property(b);
    expect(custom[b]).is.a('function');
    expect(custom[b]()).is.equals(2);
    expect(hu.$methods).has.property('a');
    expect(hu.$methods).has.property(b);
    expect(hu.$methods.a).is.a('function');
    expect(hu.$methods[b]).is.a('function');
    expect(hu.$methods.a()).is.equals(1);
    expect(hu.$methods[b]()).is.equals(2);

    custom[b] = 4;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(hu.a).is.a('function');
    expect(hu[b]).is.a('function');
    expect(hu.a()).is.equals(1);
    expect(hu[b]()).is.equals(2);
    expect(custom.a).is.equals(3);
    expect(custom[b]).is.equals(4);
    expect(hu.$methods).has.property('a');
    expect(hu.$methods).has.property(b);
    expect(hu.$methods.a).is.a('function');
    expect(hu.$methods[b]).is.a('function');
    expect(hu.$methods.a()).is.equals(1);
    expect(hu.$methods[b]()).is.equals(2);
  });

  it('实例化后不可以通过改变 $methods 内的方法对当前实例上方法的映射进行更改', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      methods: {
        a: fn1,
        [b]: fn2
      }
    });

    const div = document.createElement('div').$html(`<${customName}></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(hu.a).is.a('function');
    expect(hu[b]).is.a('function');
    expect(hu.a()).is.equals(1);
    expect(hu[b]()).is.equals(2);
    expect(hu.$methods).has.property('a');
    expect(hu.$methods).has.property(b);
    expect(hu.$methods.a).is.a('function');
    expect(hu.$methods[b]).is.a('function');
    expect(hu.$methods.a()).is.equals(1);
    expect(hu.$methods[b]()).is.equals(2);

    hu.$methods.a = 3;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(hu.a).is.a('function');
    expect(hu[b]).is.a('function');
    expect(hu.a()).is.equals(1);
    expect(hu[b]()).is.equals(2);
    expect(hu.$methods.a).is.equals(3);
    expect(hu.$methods).has.property(b);
    expect(hu.$methods[b]).is.a('function');
    expect(hu.$methods[b]()).is.equals(2);

    hu.$methods[b] = 4;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(hu.a).is.a('function');
    expect(hu[b]).is.a('function');
    expect(hu.a()).is.equals(1);
    expect(hu[b]()).is.equals(2);
    expect(hu.$methods.a).is.equals(3);
    expect(hu.$methods[b]).is.equals(4);
  });

  it('实例化后不可以通过改变 $methods 内的方法对当前自定义元素上方法的映射进行更改', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      methods: {
        a: fn1,
        [b]: fn2
      }
    });

    const div = document.createElement('div').$html(`<${customName}></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(custom).has.property('a');
    expect(custom).has.property(b);
    expect(custom.a).is.a('function');
    expect(custom[b]).is.a('function');
    expect(custom.a()).is.equals(1);
    expect(custom[b]()).is.equals(2);
    expect(hu.$methods).has.property('a');
    expect(hu.$methods).has.property(b);
    expect(hu.$methods.a).is.a('function');
    expect(hu.$methods[b]).is.a('function');
    expect(hu.$methods.a()).is.equals(1);
    expect(hu.$methods[b]()).is.equals(2);

    hu.$methods.a = 3;

    expect(custom).has.property('a');
    expect(custom).has.property(b);
    expect(custom.a).is.a('function');
    expect(custom[b]).is.a('function');
    expect(custom.a()).is.equals(1);
    expect(custom[b]()).is.equals(2);
    expect(hu.$methods.a).is.equals(3);
    expect(hu.$methods).has.property(b);
    expect(hu.$methods[b]).is.a('function');
    expect(hu.$methods[b]()).is.equals(2);

    hu.$methods[b] = 4;

    expect(custom).has.property('a');
    expect(custom).has.property(b);
    expect(custom.a).is.a('function');
    expect(custom[b]).is.a('function');
    expect(custom.a()).is.equals(1);
    expect(custom[b]()).is.equals(2);
    expect(hu.$methods.a).is.equals(3);
    expect(hu.$methods[b]).is.equals(4);
  });
});
