/* global Vue, stripExpressionMarkers */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-new */


import { expect } from 'chai';
import Hu from '../../../../src/build/index';


describe('options.lifecycle', () => {
  const options = {
    props: {
      a: { default: 1 }
    },
    data: () => ({
      b: 2
    }),
    methods: {
      c: () => 3
    },
    computed: {
      d: () => 4
    }
  };

  it('beforeCreate 生命周期回调: 实例初始化后被调用, 计算属性 computed 和数据监听 watch 还未初始化', () => {
    let isBeforeCreateRun = false;
    let isWatchRun = false;

    new Hu({
      mixins: [options],
      beforeCreate() {
        isBeforeCreateRun = true;

        expect(this).has.property('a').is.equals(1);
        expect(this).has.property('b').is.equals(2);
        expect(this).has.property('c').is.a('function'); expect(this.c()).is.equals(3);
        expect(this).not.has.property('d');
        expect(isWatchRun).is.false;
      },
      watch: {
        a: {
          immediate: true,
          handler: () => (isWatchRun = true)
        }
      }
    });

    expect(isBeforeCreateRun).is.true;
    expect(isWatchRun).is.true;
  });

  it('beforeCreate 生命周期回调: 实例初始化后被调用, 计算属性 computed 和数据监听 watch 还未初始化 ( Vue ) ( 细节不一致 )', () => {
    let isBeforeCreateRun = false;
    let isWatchRun = false;

    new Vue({
      el: document.createElement('div'),
      mixins: [options],
      beforeCreate() {
        isBeforeCreateRun = true;

        expect(this).not.has.property('a');
        expect(this).not.has.property('b');
        expect(this).not.has.property('c');
        expect(this).not.has.property('d');
        expect(isWatchRun).is.false;
      },
      watch: {
        a: {
          immediate: true,
          handler: () => (isWatchRun = true)
        }
      }
    });

    expect(isBeforeCreateRun).is.true;
    expect(isWatchRun).is.true;
  });

  it('beforeCreate 生命周期回调: 实例初始化后被调用, 计算属性 computed 和数据监听 watch 还未初始化 ( 自定义元素 )', () => {
    const customName = window.customName;
    let isBeforeCreateRun = false;
    let isWatchRun = false;

    Hu.define(customName, {
      mixins: [options],
      beforeCreate() {
        isBeforeCreateRun = true;

        expect(this).has.property('a').is.equals(1);
        expect(this).has.property('b').is.equals(2);
        expect(this).has.property('c').is.a('function'); expect(this.c()).is.equals(3);
        expect(this).not.has.property('d');
        expect(isWatchRun).is.false;
      },
      watch: {
        a: {
          immediate: true,
          handler: () => (isWatchRun = true)
        }
      }
    });

    expect(isBeforeCreateRun).is.false;
    expect(isWatchRun).is.false;

    document.createElement(customName);

    expect(isBeforeCreateRun).is.true;
    expect(isWatchRun).is.true;
  });

  it('created 生命周期回调: 实例创建完成后被调用, 但是挂载还未开始', () => {
    let isCreatedRun = false;
    let isMountedRun = false;
    let isWatchRun = false;

    new Hu({
      el: document.createElement('div'),
      mixins: [options],
      created() {
        isCreatedRun = true;

        expect(this).has.property('a').is.equals(1);
        expect(this).has.property('b').is.equals(2);
        expect(this).has.property('c').is.a('function'); expect(this.c()).is.equals(3);
        expect(this).has.property('d').is.equals(4);
        expect(isMountedRun).is.false;
        expect(isWatchRun).is.true;
      },
      mounted: () => (isMountedRun = true),
      watch: {
        a: {
          immediate: true,
          handler: () => (isWatchRun = true)
        }
      }
    });

    expect(isCreatedRun).is.true;
    expect(isMountedRun).is.true;
    expect(isWatchRun).is.true;
  });

  it('created 生命周期回调: 实例创建完成后被调用, 但是挂载还未开始 ( 自定义元素 )', () => {
    const customName = window.customName;
    let isCreatedRun = false;
    let isMountedRun = false;
    let isWatchRun = false;

    Hu.define(customName, {
      mixins: [options],
      created() {
        isCreatedRun = true;

        expect(this).has.property('a').is.equals(1);
        expect(this).has.property('b').is.equals(2);
        expect(this).has.property('c').is.a('function'); expect(this.c()).is.equals(3);
        expect(this).has.property('d').is.equals(4);
        expect(isMountedRun).is.false;
        expect(isWatchRun).is.true;
      },
      mounted: () => (isMountedRun = true),
      watch: {
        a: {
          immediate: true,
          handler: () => (isWatchRun = true)
        }
      }
    });

    expect(isCreatedRun).is.false;
    expect(isMountedRun).is.false;
    expect(isWatchRun).is.false;

    document.createElement(customName).$appendTo(document.body).$remove();

    expect(isCreatedRun).is.true;
    expect(isMountedRun).is.true;
    expect(isWatchRun).is.true;
  });

  it('beforeMount 生命周期回调: 首次挂载开始之前被调用', () => {
    let isBeforeMountRun = false;
    let isRenderRun = false;

    new Hu({
      el: document.createElement('div'),
      render: () => {
        isRenderRun = true;

        expect(isBeforeMountRun).is.true;
      },
      beforeMount: () => {
        isBeforeMountRun = true;

        expect(isRenderRun).is.false;
      }
    });

    expect(isRenderRun).is.true;
    expect(isBeforeMountRun).is.true;
  });

  it('beforeMount 生命周期回调: 首次挂载开始之前被调用 ( Vue )', () => {
    let isBeforeMountRun = false;
    let isRenderRun = false;

    new Vue({
      el: document.createElement('div'),
      render: () => {
        isRenderRun = true;

        expect(isBeforeMountRun).is.true;
      },
      beforeMount: () => {
        isBeforeMountRun = true;

        expect(isRenderRun).is.false;
      }
    });

    expect(isRenderRun).is.true;
    expect(isBeforeMountRun).is.true;
  });

  it('beforeMount 生命周期回调: 首次挂载开始之前被调用 ( use $mount )', () => {
    let isBeforeMountRun = false;
    let isRenderRun = false;
    let index = 0;

    const hu = new Hu({
      render: () => {
        isRenderRun = true;

        expect(isBeforeMountRun).is.true;
      },
      beforeMount: () => {
        isBeforeMountRun = true;
        index++;

        expect(isRenderRun).is.false;
      }
    });

    expect(index).is.equals(0);
    expect(isRenderRun).is.false;
    expect(isBeforeMountRun).is.false;

    hu.$mount(
      document.createElement('div')
    );

    expect(index).is.equals(1);
    expect(isRenderRun).is.true;
    expect(isBeforeMountRun).is.true;

    hu.$mount(
      document.createElement('div')
    );

    expect(index).is.equals(1);
    expect(isRenderRun).is.true;
    expect(isBeforeMountRun).is.true;
  });

  it('beforeMount 生命周期回调: 首次挂载开始之前被调用 ( use $mount ) ( Vue ) ( 细节不一致 )', () => {
    let isBeforeMountRun = false;
    let isRenderRun = false;
    let index = 0;

    const vm = new Vue({
      render: () => {
        isRenderRun = true;

        expect(isBeforeMountRun).is.true;
      },
      beforeMount: () => {
        isBeforeMountRun = true;
        index++;

        expect(isRenderRun).is.equals(!!(index - 1));
      }
    });

    expect(index).is.equals(0);
    expect(isRenderRun).is.false;
    expect(isBeforeMountRun).is.false;

    vm.$mount(
      document.createElement('div')
    );

    expect(index).is.equals(1);
    expect(isRenderRun).is.true;
    expect(isBeforeMountRun).is.true;

    vm.$mount(
      document.createElement('div')
    );

    expect(index).is.equals(2);
    expect(isRenderRun).is.true;
    expect(isBeforeMountRun).is.true;
  });

  it('beforeMount 生命周期回调: 首次挂载开始之前被调用 ( 自定义元素 )', () => {
    const customName = window.customName;
    let isBeforeMountRun = false;
    let isRenderRun = false;
    let index = 0;

    Hu.define(customName, {
      render: () => {
        isRenderRun = true;

        expect(isBeforeMountRun).is.true;
      },
      beforeMount: () => {
        isBeforeMountRun = true;
        index++;

        expect(isRenderRun).is.false;
      }
    });

    expect(index).is.equals(0);
    expect(isRenderRun).is.false;
    expect(isBeforeMountRun).is.false;

    const custom = document.createElement(customName);

    expect(index).is.equals(0);
    expect(isRenderRun).is.false;
    expect(isBeforeMountRun).is.false;

    custom.$appendTo(document.body);

    expect(index).is.equals(1);
    expect(isRenderRun).is.true;
    expect(isBeforeMountRun).is.true;

    custom.$remove();

    expect(index).is.equals(1);
    expect(isRenderRun).is.true;
    expect(isBeforeMountRun).is.true;

    custom.$appendTo(document.body);

    expect(index).is.equals(1);
    expect(isRenderRun).is.true;
    expect(isBeforeMountRun).is.true;

    custom.$remove();
  });

  it('mounted 生命周期回调: 首次挂载之后被调用', () => {
    let isMountedRun = false;
    let isRenderRun = false;

    new Hu({
      el: document.createElement('div'),
      render() {
        isRenderRun = true;

        expect(isMountedRun).is.false;
      },
      mounted() {
        isMountedRun = true;

        expect(isRenderRun).is.true;
      }
    });

    expect(isRenderRun).is.true;
    expect(isMountedRun).is.true;
  });

  it('mounted 生命周期回调: 首次挂载之后被调用 ( Vue )', () => {
    let isMountedRun = false;
    let isRenderRun = false;

    new Vue({
      el: document.createElement('div'),
      render() {
        isRenderRun = true;

        expect(isMountedRun).is.false;
      },
      mounted() {
        isMountedRun = true;

        expect(isRenderRun).is.true;
      }
    });

    expect(isRenderRun).is.true;
    expect(isMountedRun).is.true;
  });

  it('mounted 生命周期回调: 首次挂载之后被调用 ( use $mount )', () => {
    let isMountedRun = false;
    let isRenderRun = false;
    let index = 0;

    const hu = new Hu({
      render() {
        isRenderRun = true;

        expect(isMountedRun).is.false;
      },
      mounted() {
        isMountedRun = true;
        index++;

        expect(isRenderRun).is.true;
      }
    });

    expect(index).is.equals(0);
    expect(isRenderRun).is.false;
    expect(isMountedRun).is.false;

    hu.$mount(
      document.createElement('div')
    );

    expect(index).is.equals(1);
    expect(isRenderRun).is.true;
    expect(isMountedRun).is.true;

    hu.$mount(
      document.createElement('div')
    );

    expect(index).is.equals(1);
    expect(isRenderRun).is.true;
    expect(isMountedRun).is.true;
  });

  it('mounted 生命周期回调: 首次挂载之后被调用 ( use $mount ) ( Vue ) ( 细节不一致 )', () => {
    let isMountedRun = false;
    let isRenderRun = false;
    let index = 0;

    const vm = new Vue({
      render() {
        isRenderRun = true;

        expect(isMountedRun).is.equals(!!index);
      },
      mounted() {
        isMountedRun = true;
        index++;

        expect(isRenderRun).is.true;
      }
    });

    expect(index).is.equals(0);
    expect(isRenderRun).is.false;
    expect(isMountedRun).is.false;

    vm.$mount(
      document.createElement('div')
    );

    expect(index).is.equals(1);
    expect(isRenderRun).is.true;
    expect(isMountedRun).is.true;

    vm.$mount(
      document.createElement('div')
    );

    expect(index).is.equals(2);
    expect(isRenderRun).is.true;
    expect(isMountedRun).is.true;
  });

  it('mounted 生命周期回调: 首次挂载之后被调用 ( 自定义元素 )', () => {
    const customName = window.customName;
    let isMountedRun = false;
    let isRenderRun = false;
    let index = 0;

    Hu.define(customName, {
      render() {
        expect(isMountedRun).is.equals(isRenderRun);

        isRenderRun = true;
      },
      mounted() {
        index++;
        isMountedRun = true;

        expect(isRenderRun).is.true;
      }
    });

    expect(index).is.equals(0);
    expect(isRenderRun).is.false;
    expect(isMountedRun).is.false;

    const custom = document.createElement(customName);

    expect(index).is.equals(0);
    expect(isRenderRun).is.false;
    expect(isMountedRun).is.false;

    custom.$appendTo(document.body);

    expect(index).is.equals(1);
    expect(isRenderRun).is.true;
    expect(isMountedRun).is.true;

    custom.$remove();

    expect(index).is.equals(1);
    expect(isRenderRun).is.true;
    expect(isMountedRun).is.true;

    custom.$appendTo(document.body);

    expect(index).is.equals(1);
    expect(isRenderRun).is.true;
    expect(isMountedRun).is.true;

    custom.$remove();
  });

  it('beforeDestroy 生命周期回调: 实例销毁之前调用, 在这一步, 实例仍然完全可用', () => {
    let index = 0;
    const hu = new Hu({
      data: {
        a: 1
      },
      computed: {
        b() {
          return this.a * 2;
        }
      },
      beforeDestroy() {
        index++;
        expect(this.b).is.equals(2);
      }
    });

    expect(index).is.equals(0);

    hu.$destroy();

    expect(index).is.equals(1);
  });

  it('beforeDestroy 生命周期回调: 实例销毁之前调用, 在这一步, 实例仍然完全可用 ( Vue )', () => {
    let index = 0;
    const vm = new Vue({
      data: {
        a: 1
      },
      computed: {
        b() {
          return this.a * 2;
        }
      },
      beforeDestroy() {
        index++;
        expect(this.b).is.equals(2);
      }
    });

    expect(index).is.equals(0);

    vm.$destroy();

    expect(index).is.equals(1);
  });

  it('beforeDestroy 生命周期回调: 实例销毁之前调用, 在这一步, 实例仍然完全可用 ( 自定义元素 )', () => {
    const customName = window.customName;
    let index = 0;

    Hu.define(customName, {
      data: () => ({
        a: 1
      }),
      computed: {
        b() {
          return this.a * 2;
        }
      },
      beforeDestroy() {
        index++;
        expect(this.b).is.equals(2);
      }
    });

    const custom = document.createElement(customName);
    const hu = custom.$hu;

    expect(index).is.equals(0);

    hu.$destroy();

    expect(index).is.equals(1);
  });

  it('destroyed 生命周期回调: 实例销毁后调用', () => {
    let index = 0;
    const hu = new Hu({
      data: {
        a: 1
      },
      computed: {
        b() {
          return this.a * 2;
        }
      },
      destroyed() {
        index++;
        expect(this.b).is.equals(undefined);
      }
    });

    expect(index).is.equals(0);

    hu.$destroy();

    expect(index).is.equals(1);
  });

  it('destroyed 生命周期回调: 实例销毁后调用 ( Vue ) ( 细节不一致 )', () => {
    let index = 0;
    const vm = new Vue({
      data: {
        a: 1
      },
      computed: {
        b() {
          return this.a * 2;
        }
      },
      destroyed() {
        index++;
        expect(this.b).is.equals(2);
      }
    });

    expect(index).is.equals(0);

    vm.$destroy();

    expect(index).is.equals(1);
  });

  it('destroyed 生命周期回调: 实例销毁后调用 ( 自定义元素 )', () => {
    const customName = window.customName;
    let index = 0;

    Hu.define(customName, {
      data: () => ({
        a: 1
      }),
      computed: {
        b() {
          return this.a * 2;
        }
      },
      destroyed() {
        index++;
        expect(this.b).is.equals(undefined);
      }
    });

    const custom = document.createElement(customName);
    const hu = custom.$hu;

    expect(index).is.equals(0);

    hu.$destroy();

    expect(index).is.equals(1);
  });

  it('connected 生命周期回调: 自定义元素被添加到文档流', () => {
    const customName = window.customName;
    let index = 0;

    Hu.define(customName, {
      connected() {
        index++;
      }
    });

    expect(index).is.equals(0);

    const custom = document.createElement(customName);

    expect(index).is.equals(0);

    custom.$appendTo(document.body);
    expect(index).is.equals(1);

    custom.$remove();
    expect(index).is.equals(1);

    custom.$appendTo(document.body);
    expect(index).is.equals(2);

    custom.$remove();
    expect(index).is.equals(2);

    custom.$appendTo(document.body);
    expect(index).is.equals(3);

    custom.$remove();
    expect(index).is.equals(3);

    custom.$appendTo(document.body);
    expect(index).is.equals(4);

    custom.$remove();
  });

  if (customElements.polyfillWrapFlushCallback === undefined) {
    it('adopted 生命周期回调: 自定义元素被移动到新文档时调用', () => {
      const customName = window.customName;
      let index = 0;
      let result;

      Hu.define(customName, {
        adopted() {
          result = [...arguments];
          index++;
        }
      });

      expect(index).is.equals(0);
      expect(result).is.undefined;

      const custom = document.createElement(customName);

      expect(index).is.equals(0);
      expect(result).is.undefined;

      document.body.appendChild(custom);

      expect(index).is.equals(0);
      expect(result).is.undefined;

      const iframe = document.createElement('iframe').$appendTo(document.body);
      const iframeDocument = iframe.contentWindow.document;
      const iframeBody = iframeDocument.body;

      iframeBody.appendChild(custom);

      expect(index).is.equals(1);
      expect(result).is.deep.equals([iframeDocument, document]);

      document.body.appendChild(custom);
      expect(result).is.deep.equals([document, iframeDocument]);

      expect(index).is.equals(2);

      custom.$remove();
      iframe.$remove();
    });
  }

  it('disconnected 生命周期回调: 自定义元素被从文档流移除', () => {
    const customName = window.customName;
    let index = 0;

    Hu.define(customName, {
      disconnected() {
        index++;
      }
    });

    expect(index).is.equals(0);

    const custom = document.createElement(customName);

    expect(index).is.equals(0);

    custom.$appendTo(document.body);

    expect(index).is.equals(0);

    custom.$remove();

    expect(index).is.equals(1);

    custom.$appendTo(document.body);

    expect(index).is.equals(1);

    custom.$remove();

    expect(index).is.equals(2);
  });

  it('disconnected 生命周期回调: 自定义元素被从文档流移除后, Shadow DOM 也会被清空', () => {
    const customName = window.customName;
    let index = 0;

    Hu.define(customName, {
      render(html) {
        return html`<div>123</div>`;
      },
      disconnected() {
        index++;
      }
    });

    const custom = document.createElement(customName).$appendTo(document.body);
    const hu = custom.$hu;

    expect(stripExpressionMarkers(hu.$el.innerHTML)).is.equals('<div>123</div>');
    expect(index).is.equals(0);

    custom.$remove();

    expect(stripExpressionMarkers(hu.$el.innerHTML)).is.equals('');
    expect(index).is.equals(1);
  });

  it('生命周期回调的 this 指向的都是当前实例', () => {
    const result = [];
    const returnSelf = function () {
      result.push(this);
    };

    const hu = new Hu({
      beforeCreate: returnSelf,
      created: returnSelf,
      beforeMount: returnSelf,
      mounted: returnSelf,
      beforeDestroy: returnSelf,
      destroyed: returnSelf
    });

    hu.$mount(
      document.createElement('div')
    );
    hu.$destroy();

    expect(result.length).is.equals(6);
    expect([...new Set(result)]).is.deep.equals([hu]);
  });

  it('生命周期回调触发后会同时触发 hook:name 的自定义事件', () => {
    const result = [];

    const hu = new Hu({
      beforeCreate() {
        this.$on('hook:beforeCreate', () => result.push('beforeCreate'));
        this.$on('hook:created', () => result.push('created'));
        this.$on('hook:beforeMount', () => result.push('beforeMount'));
        this.$on('hook:mounted', () => result.push('mounted'));
        this.$on('hook:beforeDestroy', () => result.push('beforeDestroy'));
        this.$on('hook:destroyed', () => result.push('destroyed'));
      }
    });

    hu.$mount(
      document.createElement('div')
    );
    hu.$destroy();

    expect(result.length).is.equals(6);
    expect(result).is.deep.equals(['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeDestroy', 'destroyed']);
  });
});
