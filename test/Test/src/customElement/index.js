/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-rest-params */


import { expect } from 'chai';
import Hu from '../../../../src/build/index';


describe('hu.customElement', () => {
  let customName;
  let custom;
  let hu;
  beforeEach(() => {
    Hu.define(customName = window.customName);
    custom = document.createElement(customName).$appendTo(document.body);
    hu = custom.$hu;
  });
  afterEach(() => {
    custom.$remove();
  });


  it('自定义元素上的 $hu 属性为当前自定义元素的 Hu 实例', () => {
    expect(hu).is.instanceOf(Hu);
    expect(hu.$customElement).is.equals(custom);
  });

  it('自定义元素上的 $on 方法为当前自定义元素的 Hu 实例上 $on 方法的映射', () => {
    let index = 0;
    let result; let
      result1;

    custom.$on('test', function () {
      index++;
      result = [...arguments];
      expect(hu).is.equals(this);
    });

    custom.$on(['test1', 'test2'], function () {
      index++;
      result1 = [...arguments];
      expect(hu).is.equals(this);
    });

    hu.$emit('test', 1, 2, 3);
    expect(index).is.equals(1);
    expect(result).is.deep.equals([1, 2, 3]);
    expect(result1).is.undefined;

    hu.$emit('test1', 4, 5, 6);
    expect(index).is.equals(2);
    expect(result).is.deep.equals([1, 2, 3]);
    expect(result1).is.deep.equals([4, 5, 6]);

    hu.$emit('test2', 7, 8, 9);
    expect(index).is.equals(3);
    expect(result).is.deep.equals([1, 2, 3]);
    expect(result1).is.deep.equals([7, 8, 9]);
  });

  it('自定义元素上的 $once 方法为当前自定义元素的 Hu 实例上 $once 方法的映射', () => {
    let index = 0;
    let result; let
      result1;

    custom.$once('test', function () {
      index++;
      result = [...arguments];
      expect(hu).is.equals(this);
    });

    hu.$on('test1', function () {
      index++;
      result1 = [...arguments];
      expect(hu).is.equals(this);
    });

    hu.$emit('test', 1, 2, 3);
    expect(index).is.equals(1);
    expect(result).is.deep.equals([1, 2, 3]);
    expect(result1).is.undefined;

    hu.$emit('test', 1, 2, 3);
    expect(index).is.equals(1);
    expect(result).is.deep.equals([1, 2, 3]);
    expect(result1).is.undefined;

    hu.$emit('test1', 4, 5, 6);
    expect(index).is.equals(2);
    expect(result).is.deep.equals([1, 2, 3]);
    expect(result1).is.deep.equals([4, 5, 6]);

    hu.$emit('test1', 7, 8, 9);
    expect(index).is.equals(3);
    expect(result).is.deep.equals([1, 2, 3]);
    expect(result1).is.deep.equals([7, 8, 9]);
  });

  it('自定义元素上的 $off 方法为当前自定义元素的 Hu 实例上 $off 方法的映射', () => {
    let index = 0;
    let result; let
      result1;

    function fn() {
      index++;
      result = [...arguments];
    }

    function fn1() {
      index++;
      result1 = [...arguments];
    }

    hu.$on(['test', 'test1'], fn);
    hu.$on(['test', 'test1'], fn1);

    // 解绑某个事件的某个回调
    hu.$emit('test', 1, 2, 3);
    expect(index).is.equals(2);
    expect(result).is.deep.equals([1, 2, 3]);
    expect(result1).is.deep.equals([1, 2, 3]);

    custom.$off('test', fn);
    hu.$emit('test', 4, 5, 6);
    expect(index).is.equals(3);
    expect(result).is.deep.equals([1, 2, 3]);
    expect(result1).is.deep.equals([4, 5, 6]);

    // 解绑某个事件的全部回调
    hu.$emit('test1', 7, 8, 9);
    expect(index).is.equals(5);
    expect(result).is.deep.equals([7, 8, 9]);
    expect(result1).is.deep.equals([7, 8, 9]);

    custom.$off('test1');
    hu.$emit('test1', 1, 2, 3);
    expect(index).is.equals(5);
    expect(result).is.deep.equals([7, 8, 9]);
    expect(result1).is.deep.equals([7, 8, 9]);

    // 解绑所有事件
    hu.$emit('test', 4, 5, 6);
    expect(index).is.equals(6);
    expect(result).is.deep.equals([7, 8, 9]);
    expect(result1).is.deep.equals([4, 5, 6]);

    custom.$off();
    hu.$emit('test', 1, 2, 3);
    expect(index).is.equals(6);
    expect(result).is.deep.equals([7, 8, 9]);
    expect(result1).is.deep.equals([4, 5, 6]);
  });

  it('自定义元素上的 $emit 方法为当前自定义元素的 Hu 实例上 $emit 方法的映射', () => {
    let index = 0;
    let result;

    hu.$on('test', function () {
      index++;
      result = [...arguments];
    });

    custom.$emit('test');
    expect(index).is.equals(1);
    expect(result).is.deep.equals([]);

    custom.$emit('test', 1);
    expect(index).is.equals(2);
    expect(result).is.deep.equals([1]);

    custom.$emit('test', 1, 2);
    expect(index).is.equals(3);
    expect(result).is.deep.equals([1, 2]);
  });

  it('自定义元素上的 addEventListener 方法为当前自定义元素的 Hu 实例上 $on 方法的映射', () => {
    let index = 0;
    let result; let
      result1;

    custom.addEventListener('test', function () {
      index++;
      result = [...arguments];
      expect(hu).is.equals(this);
    });

    custom.addEventListener(['test1', 'test2'], function () {
      index++;
      result1 = [...arguments];
      expect(hu).is.equals(this);
    });

    hu.$emit('test', 1, 2, 3);
    expect(index).is.equals(1);
    expect(result).is.deep.equals([1, 2, 3]);
    expect(result1).is.undefined;

    hu.$emit('test1', 4, 5, 6);
    expect(index).is.equals(2);
    expect(result).is.deep.equals([1, 2, 3]);
    expect(result1).is.deep.equals([4, 5, 6]);

    hu.$emit('test2', 7, 8, 9);
    expect(index).is.equals(3);
    expect(result).is.deep.equals([1, 2, 3]);
    expect(result1).is.deep.equals([7, 8, 9]);
  });

  it('自定义元素上的 removeEventListener 方法为当前自定义元素的 Hu 实例上 $off 方法的映射', () => {
    let index = 0;
    let result; let
      result1;

    function fn() {
      index++;
      result = [...arguments];
    }

    function fn1() {
      index++;
      result1 = [...arguments];
    }

    hu.$on(['test', 'test1'], fn);
    hu.$on(['test', 'test1'], fn1);

    // 解绑某个事件的某个回调
    hu.$emit('test', 1, 2, 3);
    expect(index).is.equals(2);
    expect(result).is.deep.equals([1, 2, 3]);
    expect(result1).is.deep.equals([1, 2, 3]);

    custom.removeEventListener('test', fn);
    hu.$emit('test', 4, 5, 6);
    expect(index).is.equals(3);
    expect(result).is.deep.equals([1, 2, 3]);
    expect(result1).is.deep.equals([4, 5, 6]);

    // 解绑某个事件的全部回调
    hu.$emit('test1', 7, 8, 9);
    expect(index).is.equals(5);
    expect(result).is.deep.equals([7, 8, 9]);
    expect(result1).is.deep.equals([7, 8, 9]);

    custom.removeEventListener('test1');
    hu.$emit('test1', 1, 2, 3);
    expect(index).is.equals(5);
    expect(result).is.deep.equals([7, 8, 9]);
    expect(result1).is.deep.equals([7, 8, 9]);

    // 解绑所有事件
    hu.$emit('test', 4, 5, 6);
    expect(index).is.equals(6);
    expect(result).is.deep.equals([7, 8, 9]);
    expect(result1).is.deep.equals([4, 5, 6]);

    custom.$off();
    hu.$emit('test', 1, 2, 3);
    expect(index).is.equals(6);
    expect(result).is.deep.equals([7, 8, 9]);
    expect(result1).is.deep.equals([4, 5, 6]);
  });

  it('自定义元素上的 $watch 方法为当前自定义元素的 Hu 实例上 $watch 方法的映射', (done) => {
    let result;
    hu.$watch('a', (value, oldValue) => {
      result = [value, oldValue];
    });

    expect(result).is.undefined;

    hu.a = 2;
    expect(result).is.undefined;
    hu.$nextTick(() => {
      expect(result).is.deep.equals([2, undefined]);

      hu.a = 3;
      expect(result).is.deep.equals([2, undefined]);
      hu.$nextTick(() => {
        expect(result).is.deep.equals([3, 2]);

        done();
      });
    });
  });

  it('自定义元素上的 $nextTick 方法为当前自定义元素的 Hu 实例上 $nextTick 方法的映射', (done) => {
    let index = 0;

    hu.$nextTick(() => {
      index++;
      expect(index).is.equals(1);

      custom.$nextTick(() => {
        index++;
        expect(index).is.equals(2);

        done();
      });

      expect(index).is.equals(1);
    });

    expect(index).is.equals(0);
  });

  it('自定义元素上的 $destroy 方法为当前自定义元素的 Hu 实例上 $destroy 方法的映射', () => {
    const steps = [];

    hu.$on('hook:beforeDestroy', () => {
      steps.push('beforeDestroy');
    });
    hu.$on('hook:destroyed', () => {
      steps.push('destroyed');
    });

    expect(steps).is.deep.equals([]);

    custom.$destroy();

    expect(steps).is.deep.equals(['beforeDestroy', 'destroyed']);
  });

  it('自定义元素上的 $root 方法为当前自定义元素的 Hu 实例上 $root 方法的映射', () => {
    expect(custom.$root).is.equals(hu.$root).is.equals(hu);
  });

  it('自定义元素上的 $parent 方法为当前自定义元素的 Hu 实例上 $parent 方法的映射', () => {
    expect(custom.$parent).is.equals(hu.$parent).is.equals(undefined);
  });

  it('自定义元素上的 $children 方法为当前自定义元素的 Hu 实例上 $children 方法的映射', () => {
    expect(custom.$children).is.equals(hu.$children).is.deep.equals([]);
  });

  it('自定义元素上的 $options 方法为当前自定义元素的 Hu 实例上 $options 方法的映射', () => {
    expect(custom.$options).is.equals(hu.$options).is.not.undefined;
  });

  it('自定义元素上的 $info 属性为当前自定义元素的 Hu 实例上 $info 属性的映射', () => {
    expect(custom.$info).is.equals(hu.$info).is.not.undefined;
  });

  it('自定义元素上的 $props 方法为当前自定义元素的 Hu 实例上 $props 方法的映射', () => {
    expect(custom.$props).is.equals(hu.$props).is.not.undefined;
  });

  it('自定义元素上的 $methods 方法为当前自定义元素的 Hu 实例上 $methods 方法的映射', () => {
    expect(custom.$methods).is.equals(hu.$methods).is.not.undefined;
  });

  it('自定义元素上的 $data 方法为当前自定义元素的 Hu 实例上 $data 方法的映射', () => {
    expect(custom.$data).is.equals(hu.$data).is.not.undefined;
  });

  it('自定义元素上的 $computed 方法为当前自定义元素的 Hu 实例上 $computed 方法的映射', () => {
    expect(custom.$computed).is.equals(hu.$computed).is.not.undefined;
  });
});
