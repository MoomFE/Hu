import { expect } from 'chai';
import Hu from '../../../../src/build/index';


describe('options.props', () => {
  it('使用数组的方式定义 props', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: ['a', 'b']
    });

    const div = document.createElement('div').$html(`<${customName} a="3"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');

    expect(hu.a).is.equals('3');
    expect(hu.b).is.equals(undefined);
    expect(hu.$props.a).is.equals('3');
    expect(hu.$props.b).is.equals(undefined);
  });

  it('使用对象的方式定义 props', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: null,
        b: null
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="3"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');

    expect(hu.a).is.equals('3');
    expect(hu.b).is.equals(undefined);
    expect(hu.$props.a).is.equals('3');
    expect(hu.$props.b).is.equals(undefined);
  });

  it('使用对象的方式定义 props 且设置 prop 的类型为 String ( 写法一 )', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: String,
        b: String,
        c: String
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="5" b></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');

    expect(hu.a).is.equals('5');
    expect(hu.b).is.equals('');
    expect(hu.c).is.equals(undefined);
    expect(hu.$props.a).is.equals('5');
    expect(hu.$props.b).is.equals('');
    expect(hu.$props.c).is.equals(undefined);
  });

  it('使用对象的方式定义 props 且设置 prop 的类型为 String ( 写法二 )', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: {
          type: String
        },
        b: {
          type: String
        },
        c: {
          type: String
        }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="5" b></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');

    expect(hu.a).is.equals('5');
    expect(hu.b).is.equals('');
    expect(hu.c).is.equals(undefined);
    expect(hu.$props.a).is.equals('5');
    expect(hu.$props.b).is.equals('');
    expect(hu.$props.c).is.equals(undefined);
  });

  it('使用对象的方式定义 props 且设置 prop 的类型为 String ( 写法三 )', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: {
          type: {
            from: String
          }
        },
        b: {
          type: {
            from: String
          }
        },
        c: {
          type: {
            from: String
          }
        }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="5" b></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');

    expect(hu.a).is.equals('5');
    expect(hu.b).is.equals('');
    expect(hu.c).is.equals(undefined);
    expect(hu.$props.a).is.equals('5');
    expect(hu.$props.b).is.equals('');
    expect(hu.$props.c).is.equals(undefined);
  });

  it('使用对象的方式定义 props 且设置 prop 的类型为 Boolean ( 写法一 )', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: Boolean,
        b: Boolean,
        c: Boolean
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="5" b></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');

    expect(hu.a).is.equals(true);
    expect(hu.b).is.equals(true);
    expect(hu.c).is.equals(undefined);
    expect(hu.$props.a).is.equals(true);
    expect(hu.$props.b).is.equals(true);
    expect(hu.$props.c).is.equals(undefined);
  });

  it('使用对象的方式定义 props 且设置 prop 的类型为 Boolean ( 写法二 )', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: {
          type: Boolean
        },
        b: {
          type: Boolean
        },
        c: {
          type: Boolean
        }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="5" b></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');

    expect(hu.a).is.equals(true);
    expect(hu.b).is.equals(true);
    expect(hu.c).is.equals(undefined);
    expect(hu.$props.a).is.equals(true);
    expect(hu.$props.b).is.equals(true);
    expect(hu.$props.c).is.equals(undefined);
  });

  it('使用对象的方式定义 props 且设置 prop 的类型为 Boolean ( 写法三 )', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: {
          type: {
            from: Boolean
          }
        },
        b: {
          type: {
            from: Boolean
          }
        },
        c: {
          type: {
            from: Boolean
          }
        }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="5" b></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');

    expect(hu.a).is.equals(true);
    expect(hu.b).is.equals(true);
    expect(hu.c).is.equals(undefined);
    expect(hu.$props.a).is.equals(true);
    expect(hu.$props.b).is.equals(true);
    expect(hu.$props.c).is.equals(undefined);
  });

  it('使用对象的方式定义 props 且设置 prop 的类型为 Number ( 写法一 )', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: Number,
        b: Number,
        c: Number
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="5" b></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');

    expect(hu.a).is.equals(5);
    expect(hu.b).is.equals(0);
    expect(hu.c).is.equals(undefined);
    expect(hu.$props.a).is.equals(5);
    expect(hu.$props.b).is.equals(0);
    expect(hu.$props.c).is.equals(undefined);
  });

  it('使用对象的方式定义 props 且设置 prop 的类型为 Number ( 写法二 )', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: {
          type: Number
        },
        b: {
          type: Number
        },
        c: {
          type: Number
        }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="5" b></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');

    expect(hu.a).is.equals(5);
    expect(hu.b).is.equals(0);
    expect(hu.c).is.equals(undefined);
    expect(hu.$props.a).is.equals(5);
    expect(hu.$props.b).is.equals(0);
    expect(hu.$props.c).is.equals(undefined);
  });

  it('使用对象的方式定义 props 且设置 prop 的类型为 Number ( 写法三 )', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: {
          type: {
            from: Number
          }
        },
        b: {
          type: {
            from: Number
          }
        },
        c: {
          type: {
            from: Number
          }
        }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="5" b></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');

    expect(hu.a).is.equals(5);
    expect(hu.b).is.equals(0);
    expect(hu.c).is.equals(undefined);
    expect(hu.$props.a).is.equals(5);
    expect(hu.$props.b).is.equals(0);
    expect(hu.$props.c).is.equals(undefined);
  });

  it('使用对象的方式定义 props 且设置 prop 的类型为自定义的方法 ( 写法一 )', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: (value) => Number(value) + 1,
        b: (value) => Number(value) + 1,
        c: (value) => Number(value) + 1
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="5" b></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');

    expect(hu.a).is.equals(6);
    expect(hu.b).is.equals(1);
    expect(hu.c).is.equals(undefined);
    expect(hu.$props.a).is.equals(6);
    expect(hu.$props.b).is.equals(1);
    expect(hu.$props.c).is.equals(undefined);
  });

  it('使用对象的方式定义 props 且设置 prop 的类型为自定义的方法 ( 写法二 )', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: {
          type: (value) => Number(value) + 1
        },
        b: {
          type: (value) => Number(value) + 1
        },
        c: {
          type: (value) => Number(value) + 1
        }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="5" b></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');

    expect(hu.a).is.equals(6);
    expect(hu.b).is.equals(1);
    expect(hu.c).is.equals(undefined);
    expect(hu.$props.a).is.equals(6);
    expect(hu.$props.b).is.equals(1);
    expect(hu.$props.c).is.equals(undefined);
  });

  it('使用对象的方式定义 props 且设置 prop 的类型为自定义的方法 ( 写法二 )', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: {
          type: {
            from: (value) => Number(value) + 1
          }
        },
        b: {
          type: {
            from: (value) => Number(value) + 1
          }
        },
        c: {
          type: {
            from: (value) => Number(value) + 1
          }
        }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="5" b></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');

    expect(hu.a).is.equals(6);
    expect(hu.b).is.equals(1);
    expect(hu.c).is.equals(undefined);
    expect(hu.$props.a).is.equals(6);
    expect(hu.$props.b).is.equals(1);
    expect(hu.$props.c).is.equals(undefined);
  });

  it('使用对象的方式定义 props 且设置 prop 的默认值为非引用类型', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: {
          default: 123
        },
        b: {
          default: '123'
        },
        c: {
          default: false
        },
        d: {
          default: true
        },
        e: {
          default: null
        }
      }
    });

    const div = document.createElement('div').$html(`<${customName}></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu).has.property('d');
    expect(hu).has.property('e');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');
    expect(hu.$props).has.property('d');
    expect(hu.$props).has.property('e');

    expect(hu.a).is.equals(123);
    expect(hu.b).is.equals('123');
    expect(hu.c).is.equals(false);
    expect(hu.d).is.equals(true);
    expect(hu.e).is.equals(null);
    expect(hu.$props.a).is.equals(123);
    expect(hu.$props.b).is.equals('123');
    expect(hu.$props.c).is.equals(false);
    expect(hu.$props.d).is.equals(true);
    expect(hu.$props.e).is.equals(null);
  });

  it('使用对象的方式定义 props 且设置 prop 的默认值为引用类型', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: {
          default: [1, 2, 3]
        },
        b: {
          default: { a: 1, b: 2, c: 3 }
        },
        c: {
          default: /RegExp/
        },
        d: {
          default: () => [1, 2, 3]
        },
        e: {
          default: () => ({ a: 1, b: 2, c: 3 })
        },
        f: {
          default: () => /RegExp/
        },
        g: {
          default: () => ZenJS.noop
        }
      }
    });

    const div = document.createElement('div').$html(`<${customName}></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu).has.property('d');
    expect(hu).has.property('e');
    expect(hu).has.property('f');
    expect(hu).has.property('g');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');
    expect(hu.$props).has.property('d');
    expect(hu.$props).has.property('e');
    expect(hu.$props).has.property('f');
    expect(hu.$props).has.property('g');

    expect(hu.a).is.equals(undefined);
    expect(hu.b).is.equals(undefined);
    expect(hu.c).is.equals(undefined);
    expect(hu.d).is.deep.equals([1, 2, 3]);
    expect(hu.e).is.deep.equals({ a: 1, b: 2, c: 3 });
    expect(hu.f).is.deep.equals(/RegExp/);
    expect(hu.g).is.equals(ZenJS.noop);
    expect(hu.$props.a).is.equals(undefined);
    expect(hu.$props.b).is.equals(undefined);
    expect(hu.$props.c).is.equals(undefined);
    expect(hu.$props.d).is.deep.equals([1, 2, 3]);
    expect(hu.$props.e).is.deep.equals({ a: 1, b: 2, c: 3 });
    expect(hu.$props.f).is.deep.equals(/RegExp/);
    expect(hu.$props.g).is.equals(ZenJS.noop);
  });

  it('使用对象的方式定义 props 且设置 prop 的默认值, 在已传递了值时, 默认值不起效', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a1: { default: 'a1', type: String },
        a2: { default: 'a2', type: String },
        a3: { default: 'a3', type: String },
        a4: { default: 'a4', type: Boolean },
        a5: { default: 'a5', type: Boolean },
        a6: { default: 'a6', type: Boolean },
        a7: { default: 'a7', type: Number },
        a8: { default: 'a8', type: Number },
        a9: { default: 'a9', type: Number },
        b1: { default: 'c1', type: String },
        b2: { default: 'c2', type: String },
        b3: { default: 'c3', type: String },
        b4: { default: 'c4', type: Boolean },
        b5: { default: 'c5', type: Boolean },
        b6: { default: 'c6', type: Boolean },
        b7: { default: 'c7', type: Number },
        b8: { default: 'c8', type: Number },
        b9: { default: 'c9', type: Number }
      }
    });

    const div = document.createElement('div').$html(`
      <${customName}
        a1 a2="" a3="b3"
        a4 a5="" a6="b5"
        a7 a8="" a9="9"
      >
      </${customName}>
    `);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a1');
    expect(hu).has.property('a2');
    expect(hu).has.property('a3');
    expect(hu).has.property('a4');
    expect(hu).has.property('a5');
    expect(hu).has.property('a6');
    expect(hu).has.property('a7');
    expect(hu).has.property('a8');
    expect(hu).has.property('a9');
    expect(hu).has.property('b1');
    expect(hu).has.property('b2');
    expect(hu).has.property('b3');
    expect(hu).has.property('b4');
    expect(hu).has.property('b5');
    expect(hu).has.property('b6');
    expect(hu).has.property('b7');
    expect(hu).has.property('b8');
    expect(hu).has.property('b9');
    expect(hu.$props).has.property('a1');
    expect(hu.$props).has.property('a2');
    expect(hu.$props).has.property('a3');
    expect(hu.$props).has.property('a4');
    expect(hu.$props).has.property('a5');
    expect(hu.$props).has.property('a6');
    expect(hu.$props).has.property('a7');
    expect(hu.$props).has.property('a8');
    expect(hu.$props).has.property('a9');
    expect(hu.$props).has.property('b1');
    expect(hu.$props).has.property('b2');
    expect(hu.$props).has.property('b3');
    expect(hu.$props).has.property('b4');
    expect(hu.$props).has.property('b5');
    expect(hu.$props).has.property('b6');
    expect(hu.$props).has.property('b7');
    expect(hu.$props).has.property('b8');
    expect(hu.$props).has.property('b9');

    expect(hu.a1).is.equals('');
    expect(hu.a2).is.equals('');
    expect(hu.a3).is.equals('b3');
    expect(hu.a4).is.equals(true);
    expect(hu.a5).is.equals(true);
    expect(hu.a6).is.equals(true);
    expect(hu.a7).is.equals(0);
    expect(hu.a8).is.equals(0);
    expect(hu.a9).is.equals(9);
    expect(hu.b1).is.equals('c1');
    expect(hu.b2).is.equals('c2');
    expect(hu.b3).is.equals('c3');
    expect(hu.b4).is.equals('c4');
    expect(hu.b5).is.equals('c5');
    expect(hu.b6).is.equals('c6');
    expect(hu.b7).is.equals('c7');
    expect(hu.b8).is.equals('c8');
    expect(hu.b9).is.equals('c9');
    expect(hu.$props.a1).is.equals('');
    expect(hu.$props.a2).is.equals('');
    expect(hu.$props.a3).is.equals('b3');
    expect(hu.$props.a4).is.equals(true);
    expect(hu.$props.a5).is.equals(true);
    expect(hu.$props.a6).is.equals(true);
    expect(hu.$props.a7).is.equals(0);
    expect(hu.$props.a8).is.equals(0);
    expect(hu.$props.a9).is.equals(9);
    expect(hu.$props.b1).is.equals('c1');
    expect(hu.$props.b2).is.equals('c2');
    expect(hu.$props.b3).is.equals('c3');
    expect(hu.$props.b4).is.equals('c4');
    expect(hu.$props.b5).is.equals('c5');
    expect(hu.$props.b6).is.equals('c6');
    expect(hu.$props.b7).is.equals('c7');
    expect(hu.$props.b8).is.equals('c8');
    expect(hu.$props.b9).is.equals('c9');
  });

  it('使用对象的方式定义 props 且设置 prop 的默认值时使用方法返回默认值时, 方法的 this 指向的是当前实例', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: {
          default() {
            return this;
          }
        }
      }
    });

    const div = document.createElement('div').$html(`<${customName} b="3"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu.$props).has.property('a');

    expect(hu.a).is.equals(hu);
    expect(hu.$props.a).is.equals(hu);
  });

  it('使用对象的方式定义 props 且设置 prop 的来源属性时会从相应的 attribute 属性中取值', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: { attr: 'b' },
        b: { attr: 'a' },
        c: null,
        aA: { attr: 'a-B' },
        aB: { attr: 'a-a' },
        aC: null
      }
    });

    const div = document.createElement('div').$html(`
      <${customName} a="1" b="2" c="3" a-a="4" a-b="5" a-c="6"></${customName}>
    `);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu).has.property('aA');
    expect(hu).has.property('aB');
    expect(hu).has.property('aC');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');
    expect(hu.$props).has.property('aA');
    expect(hu.$props).has.property('aB');
    expect(hu.$props).has.property('aC');

    expect(hu.a).is.equals('2');
    expect(hu.b).is.equals('1');
    expect(hu.c).is.equals('3');
    expect(hu.aA).is.equals('5');
    expect(hu.aB).is.equals('4');
    expect(hu.aC).is.equals('6');
    expect(hu.$props.a).is.equals('2');
    expect(hu.$props.b).is.equals('1');
    expect(hu.$props.c).is.equals('3');
    expect(hu.$props.aA).is.equals('5');
    expect(hu.$props.aB).is.equals('4');
    expect(hu.$props.aC).is.equals('6');
  });

  it('使用数组的方式定义 props 且设置 prop 的来源属性时会将大写名称转为以连字符连接的小写名称', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: ['a', 'aB', 'a-c']
    });

    const div = document.createElement('div').$html(`<${customName} a="1" a-b="2" a-c="3"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('aB');
    expect(hu).has.property('a-c');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('aB');
    expect(hu.$props).has.property('a-c');

    expect(hu.a).is.equals('1');
    expect(hu.aB).is.equals('2');
    expect(hu['a-c']).is.equals('3');
    expect(hu.$props.a).is.equals('1');
    expect(hu.$props.aB).is.equals('2');
    expect(hu.$props['a-c']).is.equals('3');
  });

  it('使用对象的方式定义 props 且设置 prop 的来源属性时会将大写名称转为以连字符连接的小写名称', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: null,
        aB: null,
        'a-c': null
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="1" a-b="2" a-c="3"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('aB');
    expect(hu).has.property('a-c');
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('aB');
    expect(hu.$props).has.property('a-c');

    expect(hu.a).is.equals('1');
    expect(hu.aB).is.equals('2');
    expect(hu['a-c']).is.equals('3');
    expect(hu.$props.a).is.equals('1');
    expect(hu.$props.aB).is.equals('2');
    expect(hu.$props['a-c']).is.equals('3');
  });

  it('使用对象的方式定义 props 且 prop 是 Symbol 类型时可以设置默认值属性进行赋值', () => {
    const customName = window.customName;
    const a = Symbol('a');
    const b = Symbol('b');

    Hu.define(customName, {
      props: {
        [a]: { default: 'c' },
        [b]: { default: 'd' }
      }
    });

    const div = document.createElement('div').$html(`<${customName}></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property(a);
    expect(hu).has.property(b);
    expect(hu.$props).has.property(a);
    expect(hu.$props).has.property(b);

    expect(hu[a]).is.equals('c');
    expect(hu[b]).is.equals('d');
    expect(hu.$props[a]).is.equals('c');
    expect(hu.$props[b]).is.equals('d');
  });

  it('使用对象的方式定义 props 且 prop 是 Symbol 类型时可以设置来源属性从相应的 attribute 属性中取值', () => {
    const customName = window.customName;
    const a = Symbol('a');
    const b = Symbol('b');

    Hu.define(customName, {
      props: {
        [a]: { attr: 'c' },
        [b]: { attr: 'd' }
      }
    });

    const div = document.createElement('div').$html(`<${customName} c="e" d="f"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property(a);
    expect(hu).has.property(b);
    expect(hu.$props).has.property(a);
    expect(hu.$props).has.property(b);

    expect(hu[a]).is.equals('e');
    expect(hu[b]).is.equals('f');
    expect(hu.$props[a]).is.equals('e');
    expect(hu.$props[b]).is.equals('f');
  });

  it('使用对象的方式定义 props 时可以使用来源属性将多个 prop 绑定到同一个 attribute 上', () => {
    const customName = window.customName;
    const a = Symbol('d');

    Hu.define(customName, {
      props: {
        [a]: { attr: 'a' },
        a: null,
        b: { attr: 'a' },
        c: { attr: 'a', type: Number }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="1"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property(a);
    expect(hu).has.property('a');
    expect(hu).has.property('b');
    expect(hu).has.property('c');
    expect(hu.$props).has.property(a);
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('b');
    expect(hu.$props).has.property('c');

    expect(hu[a]).is.equals('1');
    expect(hu.a).is.equals('1');
    expect(hu.b).is.equals('1');
    expect(hu.c).is.equals(1);
    expect(hu.$props[a]).is.equals('1');
    expect(hu.$props.a).is.equals('1');
    expect(hu.$props.b).is.equals('1');
    expect(hu.$props.c).is.equals(1);

    custom.setAttribute('a', '2');
    expect(hu[a]).is.equals('2');
    expect(hu.a).is.equals('2');
    expect(hu.b).is.equals('2');
    expect(hu.c).is.equals(2);
    expect(hu.$props[a]).is.equals('2');
    expect(hu.$props.a).is.equals('2');
    expect(hu.$props.b).is.equals('2');
    expect(hu.$props.c).is.equals(2);
  });

  it('实例的 prop 对应的 attribute 属性值被更改时, 会立即将改变同步到实例中', () => {
    const customName = window.customName;
    const aE = Symbol('aE');

    Hu.define(customName, {
      props: {
        a: null,
        aB: { attr: 'b' },
        aC: { attr: 'a-d' },
        aD: { attr: 'a-c' },
        [aE]: { attr: 'a-e' }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="1" b="2" a-c="4" a-d="3" a-e="5"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property('aB');
    expect(hu).has.property('aC');
    expect(hu).has.property('aD');
    expect(hu).has.property(aE);
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property('aB');
    expect(hu.$props).has.property('aC');
    expect(hu.$props).has.property('aD');
    expect(hu.$props).has.property(aE);

    expect(hu.a).is.equals('1');
    expect(hu.aB).is.equals('2');
    expect(hu.aC).is.equals('3');
    expect(hu.aD).is.equals('4');
    expect(hu[aE]).is.equals('5');
    expect(hu.$props.a).is.equals('1');
    expect(hu.$props.aB).is.equals('2');
    expect(hu.$props.aC).is.equals('3');
    expect(hu.$props.aD).is.equals('4');
    expect(hu.$props[aE]).is.equals('5');

    custom.setAttribute('a', '11');
    expect(hu.a).is.equals('11');
    expect(hu.aB).is.equals('2');
    expect(hu.aC).is.equals('3');
    expect(hu.aD).is.equals('4');
    expect(hu[aE]).is.equals('5');
    expect(hu.$props.a).is.equals('11');
    expect(hu.$props.aB).is.equals('2');
    expect(hu.$props.aC).is.equals('3');
    expect(hu.$props.aD).is.equals('4');
    expect(hu.$props[aE]).is.equals('5');

    custom.setAttribute('b', '22');
    expect(hu.a).is.equals('11');
    expect(hu.aB).is.equals('22');
    expect(hu.aC).is.equals('3');
    expect(hu.aD).is.equals('4');
    expect(hu[aE]).is.equals('5');
    expect(hu.$props.a).is.equals('11');
    expect(hu.$props.aB).is.equals('22');
    expect(hu.$props.aC).is.equals('3');
    expect(hu.$props.aD).is.equals('4');
    expect(hu.$props[aE]).is.equals('5');

    custom.setAttribute('a-c', '44');
    expect(hu.a).is.equals('11');
    expect(hu.aB).is.equals('22');
    expect(hu.aC).is.equals('3');
    expect(hu.aD).is.equals('44');
    expect(hu[aE]).is.equals('5');
    expect(hu.$props.a).is.equals('11');
    expect(hu.$props.aB).is.equals('22');
    expect(hu.$props.aC).is.equals('3');
    expect(hu.$props.aD).is.equals('44');
    expect(hu.$props[aE]).is.equals('5');

    custom.setAttribute('a-d', '33');
    expect(hu.a).is.equals('11');
    expect(hu.aB).is.equals('22');
    expect(hu.aC).is.equals('33');
    expect(hu.aD).is.equals('44');
    expect(hu[aE]).is.equals('5');
    expect(hu.$props.a).is.equals('11');
    expect(hu.$props.aB).is.equals('22');
    expect(hu.$props.aC).is.equals('33');
    expect(hu.$props.aD).is.equals('44');
    expect(hu.$props[aE]).is.equals('5');

    custom.setAttribute('a-e', '55');
    expect(hu.a).is.equals('11');
    expect(hu.aB).is.equals('22');
    expect(hu.aC).is.equals('33');
    expect(hu.aD).is.equals('44');
    expect(hu[aE]).is.equals('55');
    expect(hu.$props.a).is.equals('11');
    expect(hu.$props.aB).is.equals('22');
    expect(hu.$props.aC).is.equals('33');
    expect(hu.$props.aD).is.equals('44');
    expect(hu.$props[aE]).is.equals('55');
  });

  it('使用对象的方式定义 props 且设置 prop 的类型为 Boolean 且默认值为 true, 传入字符串 false 时实例应该解析为布尔值 false', () => {
    const customName = window.customName;

    Hu.define(customName, {
      props: {
        a: {
          type: {
            from: Boolean,
            default: true
          }
        }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="false"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu.$props).has.property('a');

    expect(hu.a).is.equals(false);
    expect(hu.$props.a).is.equals(false);

    // ------

    const div2 = document.createElement('div').$html(`<${customName} a="true"></${customName}>`);
    const custom2 = div2.firstElementChild;
    const hu2 = custom2.$hu;

    expect(hu2).has.property('a');
    expect(hu2.$props).has.property('a');

    expect(hu2.a).is.equals(true);
    expect(hu2.$props.a).is.equals(true);
  });

  it('------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------');

  it('实例化后所定义的 props 会全部添加到 $props 实例属性中', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      props: {
        a: null,
        [b]: { attr: 'b' },
        $c: { attr: 'c' },
        _d: { attr: 'd' }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="1" b="2" c="3" d="4"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property(b);
    expect(hu.$props).has.property('$c');
    expect(hu.$props).has.property('_d');

    expect(hu.$props.a).is.equals('1');
    expect(hu.$props[b]).is.equals('2');
    expect(hu.$props.$c).is.equals('3');
    expect(hu.$props._d).is.equals('4');
  });

  it('实例化后会在实例本身添加 $props 下所有首字母不为 $ 的 prop 的映射', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      props: {
        a: null,
        [b]: { attr: 'b' },
        $c: { attr: 'c' },
        _d: { attr: 'd' }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="1" b="2" c="3" d="4"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(hu).has.not.property('$c');
    expect(hu).has.property('_d');

    expect(hu.a).is.equals('1');
    expect(hu[b]).is.equals('2');
    expect(hu._d).is.equals('4');
  });

  it('实例化后会在自定义元素本身添加 $props 下所有首字母不为 $ 和 _ 的 prop 的映射', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      props: {
        a: null,
        [b]: { attr: 'b' },
        $c: { attr: 'c' },
        _d: { attr: 'd' }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="1" b="2" c="3" d="4"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(custom).has.property('a');
    expect(custom).has.property(b);
    expect(custom).has.not.property('$c');
    expect(custom).has.not.property('_d');

    expect(custom.a).is.equals('1');
    expect(custom[b]).is.equals('2');
  });

  it('实例化后若删除在实例本身添加的 prop 的映射, 不会影响到 $props 实例属性内的 prop 本体', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      props: {
        a: null,
        [b]: { attr: 'b' }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="1" b="2"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property(b);

    expect(hu.a).is.equals('1');
    expect(hu[b]).is.equals('2');
    expect(hu.$props.a).is.equals('1');
    expect(hu.$props[b]).is.equals('2');

    delete hu.a;
    delete hu[b];

    expect(hu).has.not.property('a');
    expect(hu).has.not.property(b);
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property(b);

    expect(hu.a).is.equals(undefined);
    expect(hu[b]).is.equals(undefined);
    expect(hu.$props.a).is.equals('1');
    expect(hu.$props[b]).is.equals('2');
  });

  it('实例化后若删除在自定义元素本身添加的 prop 的映射, 不会影响到 $props 实例属性内的 prop 本体', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      props: {
        a: null,
        [b]: { attr: 'b' }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="1" b="2"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(custom).has.property('a');
    expect(custom).has.property(b);
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property(b);

    expect(hu.a).is.equals('1');
    expect(hu[b]).is.equals('2');
    expect(custom.a).is.equals('1');
    expect(custom[b]).is.equals('2');
    expect(hu.$props.a).is.equals('1');
    expect(hu.$props[b]).is.equals('2');

    delete custom.a;
    delete custom[b];

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(custom).has.not.property('a');
    expect(custom).has.not.property(b);
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property(b);

    expect(hu.a).is.equals('1');
    expect(hu[b]).is.equals('2');
    expect(custom.a).is.equals(undefined);
    expect(custom[b]).is.equals(undefined);
    expect(hu.$props.a).is.equals('1');
    expect(hu.$props[b]).is.equals('2');
  });

  it('实例化后可以通过实例本身对 prop 进行更改', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      props: {
        a: null,
        [b]: { attr: 'b' }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="1" b="2"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property(b);

    expect(hu.a).is.equals('1');
    expect(hu[b]).is.equals('2');
    expect(hu.$props.a).is.equals('1');
    expect(hu.$props[b]).is.equals('2');

    hu.a = 3;
    expect(hu.a).is.equals(3);
    expect(hu[b]).is.equals('2');
    expect(hu.$props.a).is.equals(3);
    expect(hu.$props[b]).is.equals('2');

    hu[b] = 4;
    expect(hu.a).is.equals(3);
    expect(hu[b]).is.equals(4);
    expect(hu.$props.a).is.equals(3);
    expect(hu.$props[b]).is.equals(4);
  });

  it('实例化后可以通过自定义元素本身对 prop 进行更改', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      props: {
        a: null,
        [b]: { attr: 'b' }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="1" b="2"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(custom).has.property('a');
    expect(custom).has.property(b);
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property(b);

    expect(hu.a).is.equals('1');
    expect(hu[b]).is.equals('2');
    expect(custom.a).is.equals('1');
    expect(custom[b]).is.equals('2');
    expect(hu.$props.a).is.equals('1');
    expect(hu.$props[b]).is.equals('2');

    hu.a = 3;
    expect(hu.a).is.equals(3);
    expect(hu[b]).is.equals('2');
    expect(custom.a).is.equals(3);
    expect(custom[b]).is.equals('2');
    expect(hu.$props.a).is.equals(3);
    expect(hu.$props[b]).is.equals('2');

    hu[b] = 4;
    expect(hu.a).is.equals(3);
    expect(hu[b]).is.equals(4);
    expect(custom.a).is.equals(3);
    expect(custom[b]).is.equals(4);
    expect(hu.$props.a).is.equals(3);
    expect(hu.$props[b]).is.equals(4);
  });

  it('实例化后可以通过 $props 实例属性对 prop 进行更改', () => {
    const customName = window.customName;
    const b = Symbol('b');

    Hu.define(customName, {
      props: {
        a: null,
        [b]: { attr: 'b' }
      }
    });

    const div = document.createElement('div').$html(`<${customName} a="1" b="2"></${customName}>`);
    const custom = div.firstElementChild;
    const hu = custom.$hu;

    expect(hu).has.property('a');
    expect(hu).has.property(b);
    expect(custom).has.property('a');
    expect(custom).has.property(b);
    expect(hu.$props).has.property('a');
    expect(hu.$props).has.property(b);

    expect(hu.a).is.equals('1');
    expect(hu[b]).is.equals('2');
    expect(custom.a).is.equals('1');
    expect(custom[b]).is.equals('2');
    expect(hu.$props.a).is.equals('1');
    expect(hu.$props[b]).is.equals('2');

    hu.$props.a = 3;
    expect(hu.a).is.equals(3);
    expect(hu[b]).is.equals('2');
    expect(custom.a).is.equals(3);
    expect(custom[b]).is.equals('2');
    expect(hu.$props.a).is.equals(3);
    expect(hu.$props[b]).is.equals('2');

    hu.$props[b] = 4;
    expect(hu.a).is.equals(3);
    expect(hu[b]).is.equals(4);
    expect(custom.a).is.equals(3);
    expect(custom[b]).is.equals(4);
    expect(hu.$props.a).is.equals(3);
    expect(hu.$props[b]).is.equals(4);
  });
});
