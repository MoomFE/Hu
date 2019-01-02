(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  var a = {};

  function b(a) {
    return r.typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? b = function (a) {
      return typeof a;
    } : b = function (a) {
      return a && "function" === typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
    }, b(a);
  }

  function c(a) {
    function b(d, e) {
      try {
        var f = a[d](e),
            g = f.value,
            h = g instanceof r.AwaitValue;
        Promise.resolve(h ? g.wrapped : g).then(function (a) {
          return h ? void b("next", a) : void c(f.done ? "return" : "normal", a);
        }, function (a) {
          b("throw", a);
        });
      } catch (a) {
        c("throw", a);
      }
    }

    function c(a, c) {
      switch (a) {
        case "return":
          d.resolve({
            value: c,
            done: !0
          });
          break;

        case "throw":
          d.reject(c);
          break;

        default:
          d.resolve({
            value: c,
            done: !1
          });
      }

      d = d.next, d ? b(d.key, d.arg) : e = null;
    }

    var d, e;
    this._invoke = function (a, c) {
      return new Promise(function (f, g) {
        var h = {
          key: a,
          arg: c,
          resolve: f,
          reject: g,
          next: null
        };
        e ? e = e.next = h : (d = e = h, b(a, c));
      });
    }, "function" !== typeof a.return && (this.return = void 0);
  }

  function d(a, b, c, d, e, f, g) {
    try {
      var h = a[f](g),
          i = h.value;
    } catch (a) {
      return void c(a);
    }

    h.done ? b(i) : Promise.resolve(i).then(d, e);
  }

  function e(a, b) {
    for (var c, d = 0; d < b.length; d++) c = b[d], c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(a, c.key, c);
  }

  function f(a, b) {
    for (var c in b) {
      var d = b[c];
      d.configurable = d.enumerable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, c, d);
    }

    if (Object.getOwnPropertySymbols) for (var e = Object.getOwnPropertySymbols(b), f = 0; f < e.length; f++) {
      var g = e[f],
          d = b[g];
      d.configurable = d.enumerable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, g, d);
    }
    return a;
  }

  function g(a, b, c) {
    return b in a ? Object.defineProperty(a, b, {
      value: c,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : a[b] = c, a;
  }

  function h() {
    return r.extends = h = Object.assign || function (a) {
      for (var b, c = 1; c < arguments.length; c++) for (var d in b = arguments[c], b) Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);

      return a;
    }, h.apply(this, arguments);
  }

  function i(a) {
    return r.getPrototypeOf = i = Object.setPrototypeOf ? Object.getPrototypeOf : function (a) {
      return a.__proto__ || Object.getPrototypeOf(a);
    }, i(a);
  }

  function j(a, b) {
    return r.setPrototypeOf = j = Object.setPrototypeOf || function (a, b) {
      return a.__proto__ = b, a;
    }, j(a, b);
  }

  function k() {
    if ("undefined" === typeof Reflect || !Reflect.construct) return !1;
    if (Reflect.construct.sham) return !1;
    if ("function" === typeof Proxy) return !0;

    try {
      return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
    } catch (a) {
      return !1;
    }
  }

  function l() {
    return r.construct = k() ? l = Reflect.construct : l = function (b, c, d) {
      var e = [null];
      e.push.apply(e, c);
      var a = Function.bind.apply(b, e),
          f = new a();
      return d && r.setPrototypeOf(f, d.prototype), f;
    }, l.apply(null, arguments);
  }

  function m(a) {
    var b = "function" === typeof Map ? new Map() : void 0;
    return r.wrapNativeSuper = m = function (a) {
      function c() {
        return r.construct(a, arguments, r.getPrototypeOf(this).constructor);
      }

      if (null === a || !r.isNativeFunction(a)) return a;
      if ("function" !== typeof a) throw new TypeError("Super expression must either be null or a function");

      if ("undefined" !== typeof b) {
        if (b.has(a)) return b.get(a);
        b.set(a, c);
      }

      return c.prototype = Object.create(a.prototype, {
        constructor: {
          value: c,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }), r.setPrototypeOf(c, a);
    }, m(a);
  }

  function n(a, b, c) {
    return r.get = "undefined" !== typeof Reflect && Reflect.get ? n = Reflect.get : n = function (a, b, c) {
      var d = r.superPropBase(a, b);

      if (d) {
        var e = Object.getOwnPropertyDescriptor(d, b);
        return e.get ? e.get.call(c) : e.value;
      }
    }, n(a, b, c || a);
  }

  function o(a, b, c, d) {
    return o = "undefined" !== typeof Reflect && Reflect.set ? Reflect.set : function (a, b, c, d) {
      var e,
          f = r.superPropBase(a, b);

      if (f) {
        if (e = Object.getOwnPropertyDescriptor(f, b), e.set) return e.set.call(d, c), !0;
        if (!e.writable) return !1;
      }

      if (e = Object.getOwnPropertyDescriptor(d, b), e) {
        if (!e.writable) return !1;
        e.value = c, Object.defineProperty(d, b, e);
      } else r.defineProperty(d, b, c);

      return !0;
    }, o(a, b, c, d);
  }

  function p(a, b, c, d, e) {
    var f = o(a, b, c, d || a);
    if (!f && e) throw new Error("failed to set property");
    return c;
  }

  function q(a) {
    if (Symbol.iterator in Object(a) || "[object Arguments]" === Object.prototype.toString.call(a)) return Array.from(a);
  }

  var r = a.babelHelpers = {};
  r.typeof = b, r.asyncIterator = function (a) {
    var b;

    if ("function" === typeof Symbol) {
      if (Symbol.asyncIterator && (b = a[Symbol.asyncIterator], null != b)) return b.call(a);
      if (Symbol.iterator && (b = a[Symbol.iterator], null != b)) return b.call(a);
    }

    throw new TypeError("Object is not async iterable");
  }, r.AwaitValue = function (a) {
    this.wrapped = a;
  }, "function" === typeof Symbol && Symbol.asyncIterator && (c.prototype[Symbol.asyncIterator] = function () {
    return this;
  }), c.prototype.next = function (a) {
    return this._invoke("next", a);
  }, c.prototype.throw = function (a) {
    return this._invoke("throw", a);
  }, c.prototype.return = function (a) {
    return this._invoke("return", a);
  }, r.AsyncGenerator = c, r.wrapAsyncGenerator = function (a) {
    return function () {
      return new r.AsyncGenerator(a.apply(this, arguments));
    };
  }, r.awaitAsyncGenerator = function (a) {
    return new r.AwaitValue(a);
  }, r.asyncGeneratorDelegate = function (a, b) {
    function c(c, d) {
      return e = !0, d = new Promise(function (b) {
        b(a[c](d));
      }), {
        done: !1,
        value: b(d)
      };
    }

    var d = {},
        e = !1;
    return "function" === typeof Symbol && Symbol.iterator && (d[Symbol.iterator] = function () {
      return this;
    }), d.next = function (a) {
      return e ? (e = !1, a) : c("next", a);
    }, "function" === typeof a.throw && (d.throw = function (a) {
      if (e) throw e = !1, a;
      return c("throw", a);
    }), "function" === typeof a.return && (d.return = function (a) {
      return c("return", a);
    }), d;
  }, r.asyncToGenerator = function (a) {
    return function () {
      var b = this,
          c = arguments;
      return new Promise(function (e, f) {
        function g(a) {
          d(i, e, f, g, h, "next", a);
        }

        function h(a) {
          d(i, e, f, g, h, "throw", a);
        }

        var i = a.apply(b, c);
        g(void 0);
      });
    };
  }, r.classCallCheck = function (a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
  }, r.createClass = function (a, b, c) {
    return b && e(a.prototype, b), c && e(a, c), a;
  }, r.defineEnumerableProperties = f, r.defaults = function (a, b) {
    for (var c = Object.getOwnPropertyNames(b), d = 0; d < c.length; d++) {
      var e = c[d],
          f = Object.getOwnPropertyDescriptor(b, e);
      f && f.configurable && a[e] === void 0 && Object.defineProperty(a, e, f);
    }

    return a;
  }, r.defineProperty = g, r.extends = h, r.objectSpread = function (a) {
    for (var b = 1; b < arguments.length; b++) {
      var c = null == arguments[b] ? {} : arguments[b],
          d = Object.keys(c);
      "function" === typeof Object.getOwnPropertySymbols && (d = d.concat(Object.getOwnPropertySymbols(c).filter(function (a) {
        return Object.getOwnPropertyDescriptor(c, a).enumerable;
      }))), d.forEach(function (b) {
        r.defineProperty(a, b, c[b]);
      });
    }

    return a;
  }, r.inherits = function (a, b) {
    if ("function" !== typeof b && null !== b) throw new TypeError("Super expression must either be null or a function");
    a.prototype = Object.create(b && b.prototype, {
      constructor: {
        value: a,
        writable: !0,
        configurable: !0
      }
    }), b && r.setPrototypeOf(a, b);
  }, r.getPrototypeOf = i, r.setPrototypeOf = j, r.construct = l, r.isNativeFunction = function (a) {
    return -1 !== Function.toString.call(a).indexOf("[native code]");
  }, r.wrapNativeSuper = m, r.instanceof = function (a, b) {
    return null != b && "undefined" !== typeof Symbol && b[Symbol.hasInstance] ? b[Symbol.hasInstance](a) : a instanceof b;
  }, r.interopRequireDefault = function (a) {
    return a && a.__esModule ? a : {
      default: a
    };
  }, r.interopRequireWildcard = function (a) {
    if (a && a.__esModule) return a;
    var b = {};
    if (null != a) for (var c in a) if (Object.prototype.hasOwnProperty.call(a, c)) {
      var d = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(a, c) : {};
      d.get || d.set ? Object.defineProperty(b, c, d) : b[c] = a[c];
    }
    return b.default = a, b;
  }, r.newArrowCheck = function (a, b) {
    if (a !== b) throw new TypeError("Cannot instantiate an arrow function");
  }, r.objectDestructuringEmpty = function (a) {
    if (null == a) throw new TypeError("Cannot destructure undefined");
  }, r.objectWithoutProperties = function (a, b) {
    if (null == a) return {};
    var c,
        d,
        e = r.objectWithoutPropertiesLoose(a, b);

    if (Object.getOwnPropertySymbols) {
      var f = Object.getOwnPropertySymbols(a);

      for (d = 0; d < f.length; d++) c = f[d], !(0 <= b.indexOf(c)) && Object.prototype.propertyIsEnumerable.call(a, c) && (e[c] = a[c]);
    }

    return e;
  }, r.assertThisInitialized = function (a) {
    if (void 0 === a) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a;
  }, r.possibleConstructorReturn = function (a, b) {
    return b && ("object" === typeof b || "function" === typeof b) ? b : r.assertThisInitialized(a);
  }, r.superPropBase = function (a, b) {
    for (; !Object.prototype.hasOwnProperty.call(a, b) && (a = r.getPrototypeOf(a), null !== a););

    return a;
  }, r.get = n, r.set = p, r.taggedTemplateLiteral = function (a, b) {
    return b || (b = a.slice(0)), Object.freeze(Object.defineProperties(a, {
      raw: {
        value: Object.freeze(b)
      }
    }));
  }, r.temporalRef = function (a, b) {
    if (a === r.temporalUndefined) throw new ReferenceError(b + " is not defined - temporal dead zone");else return a;
  }, r.readOnlyError = function (a) {
    throw new Error("\"" + a + "\" is read-only");
  }, r.temporalUndefined = {}, r.slicedToArray = function (a, b) {
    return r.arrayWithHoles(a) || r.iterableToArrayLimit(a, b) || r.nonIterableRest();
  }, r.toArray = function (a) {
    return r.arrayWithHoles(a) || r.iterableToArray(a) || r.nonIterableRest();
  }, r.toConsumableArray = function (a) {
    return r.arrayWithoutHoles(a) || r.iterableToArray(a) || r.nonIterableSpread();
  }, r.arrayWithoutHoles = function (a) {
    if (Array.isArray(a)) {
      for (var b = 0, c = Array(a.length); b < a.length; b++) c[b] = a[b];

      return c;
    }
  }, r.arrayWithHoles = function (a) {
    if (Array.isArray(a)) return a;
  }, r.iterableToArray = q, r.iterableToArrayLimit = function (a, b) {
    var c = [],
        d = !0,
        e = !1,
        f = void 0;

    try {
      for (var g, h = a[Symbol.iterator](); !(d = (g = h.next()).done) && (c.push(g.value), !(b && c.length === b)); d = !0);
    } catch (a) {
      e = !0, f = a;
    } finally {
      try {
        d || null == h["return"] || h["return"]();
      } finally {
        if (e) throw f;
      }
    }

    return c;
  }, r.nonIterableSpread = function () {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }, r.nonIterableRest = function () {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }, r.toPropertyKey = function (a) {
    var b = r.toPrimitive(a, "string");
    return "symbol" === typeof b ? b : b + "";
  };

  var a$1 = {};
  !function () {
    function b(a, b, c, e) {
      var f = b && b.prototype instanceof d ? b : d,
          g = Object.create(f.prototype),
          h = new m(e || []);
      return g._invoke = i(a, c, h), g;
    }

    function c(a, b, c) {
      try {
        return {
          type: "normal",
          arg: a.call(b, c)
        };
      } catch (a) {
        return {
          type: "throw",
          arg: a
        };
      }
    }

    function d() {}

    function e() {}

    function f() {}

    function g(a) {
      ["next", "throw", "return"].forEach(function (b) {
        a[b] = function (a) {
          return this._invoke(b, a);
        };
      });
    }

    function h(a) {
      function b(d, e, f, g) {
        var h = c(a[d], a, e);
        if ("throw" === h.type) g(h.arg);else {
          var i = h.arg,
              j = i.value;
          return j && "object" === typeof j && q.call(j, "__await") ? Promise.resolve(j.__await).then(function (a) {
            b("next", a, f, g);
          }, function (a) {
            b("throw", a, f, g);
          }) : Promise.resolve(j).then(function (a) {
            i.value = a, f(i);
          }, g);
        }
      }

      function d(a, c) {
        function d() {
          return new Promise(function (d, e) {
            b(a, c, d, e);
          });
        }

        return e = e ? e.then(d, d) : d();
      }

      var e;
      this._invoke = d;
    }

    function i(a, b, d) {
      var e = "suspendedStart";
      return function (f, g) {
        if (e === "executing") throw new Error("Generator is already running");

        if ("completed" === e) {
          if ("throw" === f) throw g;
          return o();
        }

        for (d.method = f, d.arg = g;;) {
          var h = d.delegate;

          if (h) {
            var i = j(h, d);

            if (i) {
              if (i === x) continue;
              return i;
            }
          }

          if ("next" === d.method) d.sent = d._sent = d.arg;else if ("throw" === d.method) {
            if ("suspendedStart" === e) throw e = "completed", d.arg;
            d.dispatchException(d.arg);
          } else "return" === d.method && d.abrupt("return", d.arg);
          e = "executing";
          var k = c(a, b, d);

          if ("normal" === k.type) {
            if (e = d.done ? "completed" : "suspendedYield", k.arg === x) continue;
            return {
              value: k.arg,
              done: d.done
            };
          }

          "throw" === k.type && (e = "completed", d.method = "throw", d.arg = k.arg);
        }
      };
    }

    function j(a, b) {
      var d = a.iterator[b.method];

      if (void 0 === d) {
        if (b.delegate = null, "throw" === b.method) {
          if (a.iterator.return && (b.method = "return", b.arg = void 0, j(a, b), "throw" === b.method)) return x;
          b.method = "throw", b.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return x;
      }

      var e = c(d, a.iterator, b.arg);
      if ("throw" === e.type) return b.method = "throw", b.arg = e.arg, b.delegate = null, x;
      var f = e.arg;
      if (!f) return b.method = "throw", b.arg = new TypeError("iterator result is not an object"), b.delegate = null, x;
      if (f.done) b[a.resultName] = f.value, b.next = a.nextLoc, "return" !== b.method && (b.method = "next", b.arg = void 0);else return f;
      return b.delegate = null, x;
    }

    function k(a) {
      var b = {
        tryLoc: a[0]
      };
      1 in a && (b.catchLoc = a[1]), 2 in a && (b.finallyLoc = a[2], b.afterLoc = a[3]), this.tryEntries.push(b);
    }

    function l(a) {
      var b = a.completion || {};
      b.type = "normal", delete b.arg, a.completion = b;
    }

    function m(a) {
      this.tryEntries = [{
        tryLoc: "root"
      }], a.forEach(k, this), this.reset(!0);
    }

    function n(a) {
      if (a) {
        var b = a[s];
        if (b) return b.call(a);
        if ("function" === typeof a.next) return a;

        if (!isNaN(a.length)) {
          var c = -1,
              d = function b() {
            for (; ++c < a.length;) if (q.call(a, c)) return b.value = a[c], b.done = !1, b;

            return b.value = void 0, b.done = !0, b;
          };

          return d.next = d;
        }
      }

      return {
        next: o
      };
    }

    function o() {
      return {
        value: void 0,
        done: !0
      };
    }

    var p = Object.prototype,
        q = p.hasOwnProperty,
        r = "function" === typeof Symbol ? Symbol : {},
        s = r.iterator || "@@iterator",
        t = r.asyncIterator || "@@asyncIterator",
        u = r.toStringTag || "@@toStringTag",
        v = "object" === typeof module,
        w = a$1.regeneratorRuntime;
    if (w) return void (v && (module.exports = w));
    w = a$1.regeneratorRuntime = v ? module.exports : {}, w.wrap = b;
    var x = {},
        y = {};

    y[s] = function () {
      return this;
    };

    var z = Object.getPrototypeOf,
        A = z && z(z(n([])));
    A && A !== p && q.call(A, s) && (y = A);
    var B = f.prototype = d.prototype = Object.create(y);
    e.prototype = B.constructor = f, f.constructor = e, f[u] = e.displayName = "GeneratorFunction", w.isGeneratorFunction = function (a) {
      var b = "function" === typeof a && a.constructor;
      return !!b && (b === e || "GeneratorFunction" === (b.displayName || b.name));
    }, w.mark = function (a) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(a, f) : (a.__proto__ = f, !(u in a) && (a[u] = "GeneratorFunction")), a.prototype = Object.create(B), a;
    }, w.awrap = function (a) {
      return {
        __await: a
      };
    }, g(h.prototype), h.prototype[t] = function () {
      return this;
    }, w.AsyncIterator = h, w.async = function (a, c, d, e) {
      var f = new h(b(a, c, d, e));
      return w.isGeneratorFunction(c) ? f : f.next().then(function (a) {
        return a.done ? a.value : f.next();
      });
    }, g(B), B[u] = "Generator", B[s] = function () {
      return this;
    }, B.toString = function () {
      return "[object Generator]";
    }, w.keys = function (a) {
      var b = [];

      for (var c in a) b.push(c);

      return b.reverse(), function c() {
        for (; b.length;) {
          var d = b.pop();
          if (d in a) return c.value = d, c.done = !1, c;
        }

        return c.done = !0, c;
      };
    }, w.values = n, m.prototype = {
      constructor: m,
      reset: function (a) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(l), !a) for (var b in this) "t" === b.charAt(0) && q.call(this, b) && !isNaN(+b.slice(1)) && (this[b] = void 0);
      },
      stop: function () {
        this.done = !0;
        var a = this.tryEntries[0],
            b = a.completion;
        if ("throw" === b.type) throw b.arg;
        return this.rval;
      },
      dispatchException: function (a) {
        function b(b, d) {
          return f.type = "throw", f.arg = a, c.next = b, d && (c.method = "next", c.arg = void 0), !!d;
        }

        if (this.done) throw a;

        for (var c = this, d = this.tryEntries.length - 1; 0 <= d; --d) {
          var e = this.tryEntries[d],
              f = e.completion;
          if ("root" === e.tryLoc) return b("end");

          if (e.tryLoc <= this.prev) {
            var g = q.call(e, "catchLoc"),
                h = q.call(e, "finallyLoc");

            if (g && h) {
              if (this.prev < e.catchLoc) return b(e.catchLoc, !0);
              if (this.prev < e.finallyLoc) return b(e.finallyLoc);
            } else if (g) {
              if (this.prev < e.catchLoc) return b(e.catchLoc, !0);
            } else if (!h) throw new Error("try statement without catch or finally");else if (this.prev < e.finallyLoc) return b(e.finallyLoc);
          }
        }
      },
      abrupt: function (a, b) {
        for (var c, d = this.tryEntries.length - 1; 0 <= d; --d) if (c = this.tryEntries[d], c.tryLoc <= this.prev && q.call(c, "finallyLoc") && this.prev < c.finallyLoc) {
          var e = c;
          break;
        }

        e && ("break" === a || "continue" === a) && e.tryLoc <= b && b <= e.finallyLoc && (e = null);
        var f = e ? e.completion : {};
        return f.type = a, f.arg = b, e ? (this.method = "next", this.next = e.finallyLoc, x) : this.complete(f);
      },
      complete: function (a, b) {
        if ("throw" === a.type) throw a.arg;
        return "break" === a.type || "continue" === a.type ? this.next = a.arg : "return" === a.type ? (this.rval = this.arg = a.arg, this.method = "return", this.next = "end") : "normal" === a.type && b && (this.next = b), x;
      },
      finish: function (a) {
        for (var b, c = this.tryEntries.length - 1; 0 <= c; --c) if (b = this.tryEntries[c], b.finallyLoc === a) return this.complete(b.completion, b.afterLoc), l(b), x;
      },
      catch: function (a) {
        for (var b, c = this.tryEntries.length - 1; 0 <= c; --c) if (b = this.tryEntries[c], b.tryLoc === a) {
          var d = b.completion;

          if ("throw" === d.type) {
            var e = d.arg;
            l(b);
          }

          return e;
        }

        throw new Error("illegal catch attempt");
      },
      delegateYield: function (a, b, c) {
        return this.delegate = {
          iterator: n(a),
          resultName: b,
          nextLoc: c
        }, "next" === this.method && (this.arg = void 0), x;
      }
    };
  }();
  var regeneratorRuntime = a$1.regeneratorRuntime;

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // serializer/deserializers for boolean attribute

  var fromBooleanAttribute = function fromBooleanAttribute(value) {
    return value !== null;
  };

  var toBooleanAttribute = function toBooleanAttribute(value) {
    return value ? '' : null;
  };
  /**
   * Change function that returns true if `value` is different from `oldValue`.
   * This method is used as the default for a property's `hasChanged` function.
   */


  var notEqual = function notEqual(value, old) {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
  };

  var defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    reflect: false,
    hasChanged: notEqual
  };
  var microtaskPromise = new Promise(function (resolve) {
    return resolve(true);
  });
  var STATE_HAS_UPDATED = 1;
  var STATE_UPDATE_REQUESTED = 1 << 2;
  var STATE_IS_REFLECTING = 1 << 3;
  /**
   * Base element class which manages element properties and attributes. When
   * properties change, the `update` method is asynchronously called. This method
   * should be supplied by subclassers to render updates as desired.
   */

  var UpdatingElement =
  /*#__PURE__*/
  function (_HTMLElement) {
    r.inherits(UpdatingElement, _HTMLElement);

    function UpdatingElement() {
      var _this;

      r.classCallCheck(this, UpdatingElement);
      _this = r.possibleConstructorReturn(this, r.getPrototypeOf(UpdatingElement).call(this));
      _this._updateState = 0;
      _this._instanceProperties = undefined;
      _this._updatePromise = microtaskPromise;
      /**
       * Map with keys for any properties that have changed since the last
       * update cycle with previous values.
       */

      _this._changedProperties = new Map();
      /**
       * Map with keys of properties that should be reflected when updated.
       */

      _this._reflectingProperties = undefined;

      _this.initialize();

      return _this;
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     */


    r.createClass(UpdatingElement, [{
      key: "initialize",

      /**
       * Performs element initialization. By default this calls `createRenderRoot`
       * to create the element `renderRoot` node and captures any pre-set values for
       * registered properties.
       */
      value: function initialize() {
        this.renderRoot = this.createRenderRoot();

        this._saveInstanceProperties();
      }
      /**
       * Fixes any properties set on the instance before upgrade time.
       * Otherwise these would shadow the accessor and break these properties.
       * The properties are stored in a Map which is played back after the
       * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
       * (<=41), properties created for native platform properties like (`id` or
       * `name`) may not have default values set in the element constructor. On
       * these browsers native properties appear on instances and therefore their
       * default value will overwrite any element default (e.g. if the element sets
       * this.id = 'id' in the constructor, the 'id' will become '' since this is
       * the native platform default).
       */

    }, {
      key: "_saveInstanceProperties",
      value: function _saveInstanceProperties() {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.constructor._classProperties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = r.slicedToArray(_step.value, 1),
                p = _step$value[0];

            if (this.hasOwnProperty(p)) {
              var value = this[p];
              delete this[p];

              if (!this._instanceProperties) {
                this._instanceProperties = new Map();
              }

              this._instanceProperties.set(p, value);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
      /**
       * Applies previously saved instance properties.
       */

    }, {
      key: "_applyInstanceProperties",
      value: function _applyInstanceProperties() {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this._instanceProperties[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = r.slicedToArray(_step2.value, 2),
                p = _step2$value[0],
                v = _step2$value[1];

            this[p] = v;
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        this._instanceProperties = undefined;
      }
      /**
       * Returns the node into which the element should render and by default
       * creates and returns an open shadowRoot. Implement to customize where the
       * element's DOM is rendered. For example, to render into the element's
       * childNodes, return `this`.
       * @returns {Element|DocumentFragment} Returns a node into which to render.
       */

    }, {
      key: "createRenderRoot",
      value: function createRenderRoot() {
        return this.attachShadow({
          mode: 'open'
        });
      }
      /**
       * Uses ShadyCSS to keep element DOM updated.
       */

    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        if (this._updateState & STATE_HAS_UPDATED) {
          if (window.ShadyCSS !== undefined) {
            window.ShadyCSS.styleElement(this);
          }
        } else {
          this.requestUpdate();
        }
      }
      /**
       * Allows for `super.disconnectedCallback()` in extensions while
       * reserving the possibility of making non-breaking feature additions
       * when disconnecting at some point in the future.
       */

    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {}
      /**
       * Synchronizes property values when attributes change.
       */

    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, old, value) {
        if (old !== value) {
          this._attributeToProperty(name, value);
        }
      }
    }, {
      key: "_propertyToAttribute",
      value: function _propertyToAttribute(name, value) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultPropertyDeclaration;
        var ctor = this.constructor;

        var attrValue = ctor._propertyValueToAttribute(value, options);

        if (attrValue !== undefined) {
          var attr = ctor._attributeNameForProperty(name, options);

          if (attr !== undefined) {
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING;

            if (attrValue === null) {
              this.removeAttribute(attr);
            } else {
              this.setAttribute(attr, attrValue);
            } // mark state not reflecting


            this._updateState = this._updateState & ~STATE_IS_REFLECTING;
          }
        }
      }
    }, {
      key: "_attributeToProperty",
      value: function _attributeToProperty(name, value) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        if (!(this._updateState & STATE_IS_REFLECTING)) {
          var ctor = this.constructor;

          var propName = ctor._attributeToPropertyMap.get(name);

          if (propName !== undefined) {
            var options = ctor._classProperties.get(propName);

            this[propName] = ctor._propertyValueFromAttribute(value, options);
          }
        }
      }
      /**
       * Requests an update which is processed asynchronously. This should
       * be called when an element should update based on some state not triggered
       * by setting a property. In this case, pass no arguments. It should also be
       * called when manually implementing a property setter. In this case, pass the
       * property `name` and `oldValue` to ensure that any configured property
       * options are honored. Returns the `updateComplete` Promise which is resolved
       * when the update completes.
       *
       * @param name {PropertyKey} (optional) name of requesting property
       * @param oldValue {any} (optional) old value of requesting property
       * @returns {Promise} A Promise that is resolved when the update completes.
       */

    }, {
      key: "requestUpdate",
      value: function requestUpdate(name, oldValue) {
        if (name !== undefined) {
          var options = this.constructor._classProperties.get(name) || defaultPropertyDeclaration;
          return this._requestPropertyUpdate(name, oldValue, options);
        }

        return this._invalidate();
      }
      /**
       * Requests an update for a specific property and records change information.
       * @param name {PropertyKey} name of requesting property
       * @param oldValue {any} old value of requesting property
       * @param options {PropertyDeclaration}
       */

    }, {
      key: "_requestPropertyUpdate",
      value: function _requestPropertyUpdate(name, oldValue, options) {
        if (!this.constructor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
          return this.updateComplete;
        } // track old value when changing.


        if (!this._changedProperties.has(name)) {
          this._changedProperties.set(name, oldValue);
        } // add to reflecting properties set


        if (options.reflect === true) {
          if (this._reflectingProperties === undefined) {
            this._reflectingProperties = new Map();
          }

          this._reflectingProperties.set(name, options);
        }

        return this._invalidate();
      }
      /**
       * Invalidates the element causing it to asynchronously update regardless
       * of whether or not any property changes are pending. This method is
       * automatically called when any registered property changes.
       */

    }, {
      key: "_invalidate",
      value: function () {
        var _invalidate2 = r.asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var resolver, previousValidatePromise;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (this._hasRequestedUpdate) {
                    _context.next = 8;
                    break;
                  } // mark state updating...


                  this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
                  previousValidatePromise = this._updatePromise;
                  this._updatePromise = new Promise(function (r$$1) {
                    return resolver = r$$1;
                  });
                  _context.next = 6;
                  return previousValidatePromise;

                case 6:
                  this._validate();

                  resolver(!this._hasRequestedUpdate);

                case 8:
                  return _context.abrupt("return", this.updateComplete);

                case 9:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function _invalidate() {
          return _invalidate2.apply(this, arguments);
        }

        return _invalidate;
      }()
    }, {
      key: "_validate",

      /**
       * Validates the element by updating it.
       */
      value: function _validate() {
        // Mixin instance properties once, if they exist.
        if (this._instanceProperties) {
          this._applyInstanceProperties();
        }

        if (this.shouldUpdate(this._changedProperties)) {
          var changedProperties = this._changedProperties;
          this.update(changedProperties);

          this._markUpdated();

          if (!(this._updateState & STATE_HAS_UPDATED)) {
            this._updateState = this._updateState | STATE_HAS_UPDATED;
            this.firstUpdated(changedProperties);
          }

          this.updated(changedProperties);
        } else {
          this._markUpdated();
        }
      }
    }, {
      key: "_markUpdated",
      value: function _markUpdated() {
        this._changedProperties = new Map();
        this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
      }
      /**
       * Returns a Promise that resolves when the element has completed updating.
       * The Promise value is a boolean that is `true` if the element completed the
       * update without triggering another update. The Promise result is `false` if
       * a property was set inside `updated()`. This getter can be implemented to
       * await additional state. For example, it is sometimes useful to await a
       * rendered element before fulfilling this Promise. To do this, first await
       * `super.updateComplete` then any subsequent state.
       *
       * @returns {Promise} The Promise returns a boolean that indicates if the
       * update resolved without triggering another update.
       */

    }, {
      key: "shouldUpdate",

      /**
       * Controls whether or not `update` should be called when the element requests
       * an update. By default, this method always returns `true`, but this can be
       * customized to control when to update.
       *
       * * @param _changedProperties Map of changed properties with old values
       */
      value: function shouldUpdate(_changedProperties) {
        return true;
      }
      /**
       * Updates the element. This method reflects property values to attributes.
       * It can be overridden to render and keep updated DOM in the element's
       * `renderRoot`. Setting properties inside this method will *not* trigger
       * another update.
       *
       * * @param _changedProperties Map of changed properties with old values
       */

    }, {
      key: "update",
      value: function update(_changedProperties) {
        if (this._reflectingProperties !== undefined && this._reflectingProperties.size > 0) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = this._reflectingProperties[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _step3$value = r.slicedToArray(_step3.value, 2),
                  k = _step3$value[0],
                  v = _step3$value[1];

              this._propertyToAttribute(k, this[k], v);
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          this._reflectingProperties = undefined;
        }
      }
      /**
       * Invoked whenever the element is updated. Implement to perform
       * post-updating tasks via DOM APIs, for example, focusing an element.
       *
       * Setting properties inside this method will trigger the element to update
       * again after this update cycle completes.
       *
       * * @param _changedProperties Map of changed properties with old values
       */

    }, {
      key: "updated",
      value: function updated(_changedProperties) {}
      /**
       * Invoked when the element is first updated. Implement to perform one time
       * work on the element after update.
       *
       * Setting properties inside this method will trigger the element to update
       * again after this update cycle completes.
       *
       * * @param _changedProperties Map of changed properties with old values
       */

    }, {
      key: "firstUpdated",
      value: function firstUpdated(_changedProperties) {}
    }, {
      key: "_hasRequestedUpdate",
      get: function get() {
        return this._updateState & STATE_UPDATE_REQUESTED;
      }
    }, {
      key: "updateComplete",
      get: function get() {
        return this._updatePromise;
      }
    }], [{
      key: "createProperty",

      /**
       * Creates a property accessor on the element prototype if one does not exist.
       * The property setter calls the property's `hasChanged` property option
       * or uses a strict identity check to determine whether or not to request
       * an update.
       */
      value: function createProperty(name) {
        var _this2 = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultPropertyDeclaration; // ensure private storage for property declarations.

        if (!this.hasOwnProperty('_classProperties')) {
          this._classProperties = new Map(); // NOTE: Workaround IE11 not supporting Map constructor argument.

          var superProperties = Object.getPrototypeOf(this)._classProperties;

          if (superProperties !== undefined) {
            superProperties.forEach(function (v, k) {
              return _this2._classProperties.set(k, v);
            });
          }
        }

        this._classProperties.set(name, options); // Allow user defined accessors by not replacing an existing own-property
        // accessor.


        if (this.prototype.hasOwnProperty(name)) {
          return;
        }

        var key = r.typeof(name) === 'symbol' ? Symbol() : "__".concat(name);
        Object.defineProperty(this.prototype, name, {
          get: function get() {
            return this[key];
          },
          set: function set(value) {
            var oldValue = this[name];
            this[key] = value;

            this._requestPropertyUpdate(name, oldValue, options);
          },
          configurable: true,
          enumerable: true
        });
      }
      /**
       * Creates property accessors for registered properties and ensures
       * any superclasses are also finalized.
       */

    }, {
      key: "_finalize",
      value: function _finalize() {
        if (this.hasOwnProperty('_finalized') && this._finalized) {
          return;
        } // finalize any superclasses


        var superCtor = Object.getPrototypeOf(this);

        if (typeof superCtor._finalize === 'function') {
          superCtor._finalize();
        }

        this._finalized = true; // initialize Map populated in observedAttributes

        this._attributeToPropertyMap = new Map(); // make any properties

        var props = this.properties; // support symbols in properties (IE11 does not support this)

        var propKeys = [].concat(r.toConsumableArray(Object.getOwnPropertyNames(props)), r.toConsumableArray(typeof Object.getOwnPropertySymbols === 'function' ? Object.getOwnPropertySymbols(props) : []));
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = propKeys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var p = _step4.value; // note, use of `any` is due to TypeSript lack of support for symbol in
            // index types

            this.createProperty(p, props[p]);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }
      /**
       * Returns the property name for the given attribute `name`.
       */

    }, {
      key: "_attributeNameForProperty",
      value: function _attributeNameForProperty(name, options) {
        var attribute = options !== undefined && options.attribute;
        return attribute === false ? undefined : typeof attribute === 'string' ? attribute : typeof name === 'string' ? name.toLowerCase() : undefined;
      }
      /**
       * Returns true if a property should request an update.
       * Called when a property value is set and uses the `hasChanged`
       * option for the property if present or a strict identity check.
       */

    }, {
      key: "_valueHasChanged",
      value: function _valueHasChanged(value, old) {
        var hasChanged = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : notEqual;
        return hasChanged(value, old);
      }
      /**
       * Returns the property value for the given attribute value.
       * Called via the `attributeChangedCallback` and uses the property's `type`
       * or `type.fromAttribute` property option.
       */

    }, {
      key: "_propertyValueFromAttribute",
      value: function _propertyValueFromAttribute(value, options) {
        var type = options && options.type;

        if (type === undefined) {
          return value;
        } // Note: special case `Boolean` so users can use it as a `type`.


        var fromAttribute = type === Boolean ? fromBooleanAttribute : typeof type === 'function' ? type : type.fromAttribute;
        return fromAttribute ? fromAttribute(value) : value;
      }
      /**
       * Returns the attribute value for the given property value. If this
       * returns undefined, the property will *not* be reflected to an attribute.
       * If this returns null, the attribute will be removed, otherwise the
       * attribute will be set to the value.
       * This uses the property's `reflect` and `type.toAttribute` property options.
       */

    }, {
      key: "_propertyValueToAttribute",
      value: function _propertyValueToAttribute(value, options) {
        if (options === undefined || options.reflect === undefined) {
          return;
        } // Note: special case `Boolean` so users can use it as a `type`.


        var toAttribute = options.type === Boolean ? toBooleanAttribute : options.type && options.type.toAttribute || String;
        return toAttribute(value);
      }
    }, {
      key: "observedAttributes",
      get: function get() {
        // note: piggy backing on this to ensure we're _finalized.
        this._finalize();

        var attributes = [];
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this._classProperties[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _step5$value = r.slicedToArray(_step5.value, 2),
                p = _step5$value[0],
                v = _step5$value[1];

            var attr = this._attributeNameForProperty(p, v);

            if (attr !== undefined) {
              this._attributeToPropertyMap.set(attr, p);

              attributes.push(attr);
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        return attributes;
      }
    }]);
    return UpdatingElement;
  }(r.wrapNativeSuper(HTMLElement));
  /**
   * Maps attribute names to properties; for example `foobar` attribute
   * to `fooBar` property.
   */


  UpdatingElement._attributeToPropertyMap = new Map();
  /**
   * Marks class as having finished creating properties.
   */

  UpdatingElement._finalized = true;
  /**
   * Memoized list of all class properties, including any superclass properties.
   */

  UpdatingElement._classProperties = new Map();
  UpdatingElement.properties = {};
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  var directives = new WeakMap();

  var isDirective = function isDirective(o) {
    return typeof o === 'function' && directives.has(o);
  };
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  var isCEPolyfill = window.customElements !== undefined && window.customElements.polyfillWrapFlushCallback !== undefined;
  /**
          * Reparents nodes, starting from `startNode` (inclusive) to `endNode`
          * (exclusive), into another container (could be the same container), before
          * `beforeNode`. If `beforeNode` is null, it appends the nodes to the
          * container.
          */

  var reparentNodes = function reparentNodes(container, start) {
    var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var before = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var node = start;

    while (node !== end) {
      var n = node.nextSibling;
      container.insertBefore(node, before);
      node = n;
    }
  };
  /**
   * Removes nodes, starting from `startNode` (inclusive) to `endNode`
   * (exclusive), from `container`.
   */


  var removeNodes = function removeNodes(container, startNode) {
    var endNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var node = startNode;

    while (node !== endNode) {
      var n = node.nextSibling;
      container.removeChild(node);
      node = n;
    }
  };
  /**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * A sentinel value that signals that a value was handled by a directive and
   * should not be written to the DOM.
   */

  var noChange = {};
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * An expression marker with embedded unique key to avoid collision with
   * possible text in templates.
   */

  var marker = "{{lit-".concat(String(Math.random()).slice(2), "}}");
  /**
          * An expression marker used text-positions, multi-binding attributes, and
          * attributes with markup-like text values.
          */

  var nodeMarker = "<!--".concat(marker, "-->");
  var markerRegex = new RegExp("".concat(marker, "|").concat(nodeMarker));
  /**
          * Suffix appended to all bound attribute names.
          */

  var boundAttributeSuffix = '$lit$';
  /**
          * An updateable Template that tracks the location of dynamic parts.
          */

  var Template = function Template(result, element) {
    var _this3 = this;

    r.classCallCheck(this, Template);
    this.parts = [];
    this.element = element;
    var index = -1;
    var partIndex = 0;
    var nodesToRemove = [];

    var _prepareTemplate = function _prepareTemplate(template) {
      var content = template.content; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
      // null

      var walker = document.createTreeWalker(content, 133
      /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
      NodeFilter.SHOW_TEXT */
      , null, false); // The actual previous node, accounting for removals: if a node is removed
      // it will never be the previousNode.

      var previousNode; // Used to set previousNode at the top of the loop.

      var currentNode;

      while (walker.nextNode()) {
        index++;
        previousNode = currentNode;
        var node = currentNode = walker.currentNode;

        if (node.nodeType === 1
        /* Node.ELEMENT_NODE */
        ) {
            if (node.hasAttributes()) {
              var attributes = node.attributes; // Per
              // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
              // attributes are not guaranteed to be returned in document order.
              // In particular, Edge/IE can return them out of order, so we cannot
              // assume a correspondance between part index and attribute index.

              var count = 0;

              for (var i = 0; i < attributes.length; i++) {
                if (attributes[i].value.indexOf(marker) >= 0) {
                  count++;
                }
              }

              while (count-- > 0) {
                // Get the template literal section leading up to the first
                // expression in this attribute
                var stringForPart = result.strings[partIndex]; // Find the attribute name

                var name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
                // All bound attributes have had a suffix added in
                // TemplateResult#getHTML to opt out of special attribute
                // handling. To look up the attribute value we also need to add
                // the suffix.

                var attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                var attributeValue = node.getAttribute(attributeLookupName);
                var strings = attributeValue.split(markerRegex);

                _this3.parts.push({
                  type: 'attribute',
                  index: index,
                  name: name,
                  strings: strings
                });

                node.removeAttribute(attributeLookupName);
                partIndex += strings.length - 1;
              }
            }

            if (node.tagName === 'TEMPLATE') {
              _prepareTemplate(node);
            }
          } else if (node.nodeType === 3
        /* Node.TEXT_NODE */
        ) {
            var nodeValue = node.nodeValue;

            if (nodeValue.indexOf(marker) < 0) {
              continue;
            }

            var parent = node.parentNode;

            var _strings = nodeValue.split(markerRegex);

            var lastIndex = _strings.length - 1; // We have a part for each match found

            partIndex += lastIndex; // Generate a new text node for each literal section
            // These nodes are also used as the markers for node parts

            for (var _i = 0; _i < lastIndex; _i++) {
              parent.insertBefore(_strings[_i] === '' ? createMarker() : document.createTextNode(_strings[_i]), node);

              _this3.parts.push({
                type: 'node',
                index: index++
              });
            }

            parent.insertBefore(_strings[lastIndex] === '' ? createMarker() : document.createTextNode(_strings[lastIndex]), node);
            nodesToRemove.push(node);
          } else if (node.nodeType === 8
        /* Node.COMMENT_NODE */
        ) {
            if (node.nodeValue === marker) {
              var _parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
              // the following are true:
              //  * We don't have a previousSibling
              //  * previousSibling is being removed (thus it's not the
              //    `previousNode`)
              //  * previousSibling is not a Text node
              //
              // TODO(justinfagnani): We should be able to use the previousNode
              // here as the marker node and reduce the number of extra nodes we
              // add to a template. See
              // https://github.com/PolymerLabs/lit-html/issues/147

              var previousSibling = node.previousSibling;

              if (previousSibling === null || previousSibling !== previousNode || previousSibling.nodeType !== Node.TEXT_NODE) {
                _parent.insertBefore(createMarker(), node);
              } else {
                index--;
              }

              _this3.parts.push({
                type: 'node',
                index: index++
              });

              nodesToRemove.push(node); // If we don't have a nextSibling add a marker node.
              // We don't have to check if the next node is going to be removed,
              // because that node will induce a new marker if so.

              if (node.nextSibling === null) {
                _parent.insertBefore(createMarker(), node);
              } else {
                index--;
              }

              currentNode = previousNode;
              partIndex++;
            } else {
              var _i2 = -1;

              while ((_i2 = node.nodeValue.indexOf(marker, _i2 + 1)) !== -1) {
                // Comment node has a binding marker inside, make an inactive part
                // The binding won't work, but subsequent bindings will
                // TODO (justinfagnani): consider whether it's even worth it to
                // make bindings in comments work
                _this3.parts.push({
                  type: 'node',
                  index: -1
                });
              }
            }
          }
      }
    };

    _prepareTemplate(element); // Remove text binding nodes after the walk to not disturb the TreeWalker


    for (var _i3 = 0; _i3 < nodesToRemove.length; _i3++) {
      var n = nodesToRemove[_i3];
      n.parentNode.removeChild(n);
    }
  };

  var isTemplatePartActive = function isTemplatePartActive(part) {
    return part.index !== -1;
  }; // Allows `document.createComment('')` to be renamed for a
  // small manual size-savings.


  var createMarker = function createMarker() {
    return document.createComment('');
  };
  /**
          * This regex extracts the attribute name preceding an attribute-position
          * expression. It does this by matching the syntax allowed for attributes
          * against the string literal directly preceding the expression, assuming that
          * the expression is in an attribute-value position.
          *
          * See attributes in the HTML spec:
          * https://www.w3.org/TR/html5/syntax.html#attributes-0
          *
          * "\0-\x1F\x7F-\x9F" are Unicode control characters
          *
          * " \x09\x0a\x0c\x0d" are HTML space characters:
          * https://www.w3.org/TR/html5/infrastructure.html#space-character
          *
          * So an attribute is:
          *  * The name: any character except a control character, space character, ('),
          *    ("), ">", "=", or "/"
          *  * Followed by zero or more space characters
          *  * Followed by "="
          *  * Followed by zero or more space characters
          *  * Followed by:
          *    * Any character except space, ('), ("), "<", ">", "=", (`), or
          *    * (") then any non-("), or
          *    * (') then any non-(')
          */


  var lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

  var TemplateInstance =
  /*#__PURE__*/
  function () {
    function TemplateInstance(template, processor, options) {
      r.classCallCheck(this, TemplateInstance);
      this._parts = [];
      this.template = template;
      this.processor = processor;
      this.options = options;
    }

    r.createClass(TemplateInstance, [{
      key: "update",
      value: function update(values) {
        var i = 0;
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = this._parts[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var _part = _step6.value;

            if (_part !== undefined) {
              _part.setValue(values[i]);
            }

            i++;
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }

        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = this._parts[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var _part2 = _step7.value;

            if (_part2 !== undefined) {
              _part2.commit();
            }
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
              _iterator7.return();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }
      }
    }, {
      key: "_clone",
      value: function _clone() {
        var _this4 = this; // When using the Custom Elements polyfill, clone the node, rather than
        // importing it, to keep the fragment in the template's document. This
        // leaves the fragment inert so custom elements won't upgrade and
        // potentially modify their contents by creating a polyfilled ShadowRoot
        // while we traverse the tree.


        var fragment = isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
        var parts = this.template.parts;
        var partIndex = 0;
        var nodeIndex = 0;

        var _prepareInstance = function _prepareInstance(fragment) {
          // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
          // null
          var walker = document.createTreeWalker(fragment, 133
          /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
          , null, false);
          var node = walker.nextNode(); // Loop through all the nodes and parts of a template

          while (partIndex < parts.length && node !== null) {
            var _part3 = parts[partIndex]; // Consecutive Parts may have the same node index, in the case of
            // multiple bound attributes on an element. So each iteration we either
            // increment the nodeIndex, if we aren't on a node with a part, or the
            // partIndex if we are. By not incrementing the nodeIndex when we find a
            // part, we allow for the next part to be associated with the current
            // node if neccessasry.

            if (!isTemplatePartActive(_part3)) {
              _this4._parts.push(undefined);

              partIndex++;
            } else if (nodeIndex === _part3.index) {
              if (_part3.type === 'node') {
                var _part4 = _this4.processor.handleTextExpression(_this4.options);

                _part4.insertAfterNode(node);

                _this4._parts.push(_part4);
              } else {
                var _this4$_parts;

                (_this4$_parts = _this4._parts).push.apply(_this4$_parts, r.toConsumableArray(_this4.processor.handleAttributeExpressions(node, _part3.name, _part3.strings, _this4.options)));
              }

              partIndex++;
            } else {
              nodeIndex++;

              if (node.nodeName === 'TEMPLATE') {
                _prepareInstance(node.content);
              }

              node = walker.nextNode();
            }
          }
        };

        _prepareInstance(fragment);

        if (isCEPolyfill) {
          document.adoptNode(fragment);
          customElements.upgrade(fragment);
        }

        return fragment;
      }
    }]);
    return TemplateInstance;
  }();

  var TemplateResult =
  /*#__PURE__*/
  function () {
    function TemplateResult(strings, values, type, processor) {
      r.classCallCheck(this, TemplateResult);
      this.strings = strings;
      this.values = values;
      this.type = type;
      this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */


    r.createClass(TemplateResult, [{
      key: "getHTML",
      value: function getHTML() {
        var endIndex = this.strings.length - 1;
        var html = '';

        for (var i = 0; i < endIndex; i++) {
          var s = this.strings[i]; // This replace() call does two things:
          // 1) Appends a suffix to all bound attribute names to opt out of special
          // attribute value parsing that IE11 and Edge do, like for style and
          // many SVG attributes. The Template class also appends the same suffix
          // when looking up attributes to creat Parts.
          // 2) Adds an unquoted-attribute-safe marker for the first expression in
          // an attribute. Subsequent attribute expressions will use node markers,
          // and this is safe since attributes with multiple expressions are
          // guaranteed to be quoted.

          var addedMarker = false;
          html += s.replace(lastAttributeNameRegex, function (_match, whitespace, name, value) {
            addedMarker = true;
            return whitespace + name + boundAttributeSuffix + value + marker;
          });

          if (!addedMarker) {
            html += nodeMarker;
          }
        }

        return html + this.strings[endIndex];
      }
    }, {
      key: "getTemplateElement",
      value: function getTemplateElement() {
        var template = document.createElement('template');
        template.innerHTML = this.getHTML();
        return template;
      }
    }]);
    return TemplateResult;
  }();
  /**
   * A TemplateResult for SVG fragments.
   *
   * This class wraps HTMl in an `<svg>` tag in order to parse its contents in the
   * SVG namespace, then modifies the template to remove the `<svg>` tag so that
   * clones only container the original fragment.
   */


  var SVGTemplateResult =
  /*#__PURE__*/
  function (_TemplateResult) {
    r.inherits(SVGTemplateResult, _TemplateResult);

    function SVGTemplateResult() {
      r.classCallCheck(this, SVGTemplateResult);
      return r.possibleConstructorReturn(this, r.getPrototypeOf(SVGTemplateResult).apply(this, arguments));
    }

    r.createClass(SVGTemplateResult, [{
      key: "getHTML",
      value: function getHTML() {
        return "<svg>".concat(r.get(r.getPrototypeOf(SVGTemplateResult.prototype), "getHTML", this).call(this), "</svg>");
      }
    }, {
      key: "getTemplateElement",
      value: function getTemplateElement() {
        var template = r.get(r.getPrototypeOf(SVGTemplateResult.prototype), "getTemplateElement", this).call(this);
        var content = template.content;
        var svgElement = content.firstChild;
        content.removeChild(svgElement);
        reparentNodes(content, svgElement.firstChild);
        return template;
      }
    }]);
    return SVGTemplateResult;
  }(TemplateResult);

  var isPrimitive = function isPrimitive(value) {
    return value === null || !(r.typeof(value) === 'object' || typeof value === 'function');
  };
  /**
          * Sets attribute values for AttributeParts, so that the value is only set once
          * even if there are multiple parts for an attribute.
          */


  var AttributeCommitter =
  /*#__PURE__*/
  function () {
    function AttributeCommitter(element, name, strings) {
      r.classCallCheck(this, AttributeCommitter);
      this.dirty = true;
      this.element = element;
      this.name = name;
      this.strings = strings;
      this.parts = [];

      for (var i = 0; i < strings.length - 1; i++) {
        this.parts[i] = this._createPart();
      }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */


    r.createClass(AttributeCommitter, [{
      key: "_createPart",
      value: function _createPart() {
        return new AttributePart(this);
      }
    }, {
      key: "_getValue",
      value: function _getValue() {
        var strings = this.strings;
        var l = strings.length - 1;
        var text = '';

        for (var i = 0; i < l; i++) {
          text += strings[i];
          var _part5 = this.parts[i];

          if (_part5 !== undefined) {
            var v = _part5.value;

            if (v != null && (Array.isArray(v) || typeof v !== 'string' && v[Symbol.iterator])) {
              var _iteratorNormalCompletion8 = true;
              var _didIteratorError8 = false;
              var _iteratorError8 = undefined;

              try {
                for (var _iterator8 = v[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                  var t = _step8.value;
                  text += typeof t === 'string' ? t : String(t);
                }
              } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
                    _iterator8.return();
                  }
                } finally {
                  if (_didIteratorError8) {
                    throw _iteratorError8;
                  }
                }
              }
            } else {
              text += typeof v === 'string' ? v : String(v);
            }
          }
        }

        text += strings[l];
        return text;
      }
    }, {
      key: "commit",
      value: function commit() {
        if (this.dirty) {
          this.dirty = false;
          this.element.setAttribute(this.name, this._getValue());
        }
      }
    }]);
    return AttributeCommitter;
  }();

  var AttributePart =
  /*#__PURE__*/
  function () {
    function AttributePart(comitter) {
      r.classCallCheck(this, AttributePart);
      this.value = undefined;
      this.committer = comitter;
    }

    r.createClass(AttributePart, [{
      key: "setValue",
      value: function setValue(value) {
        if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
          this.value = value; // If the value is a not a directive, dirty the committer so that it'll
          // call setAttribute. If the value is a directive, it'll dirty the
          // committer if it calls setValue().

          if (!isDirective(value)) {
            this.committer.dirty = true;
          }
        }
      }
    }, {
      key: "commit",
      value: function commit() {
        while (isDirective(this.value)) {
          var directive$$1 = this.value;
          this.value = noChange;
          directive$$1(this);
        }

        if (this.value === noChange) {
          return;
        }

        this.committer.commit();
      }
    }]);
    return AttributePart;
  }();

  var NodePart =
  /*#__PURE__*/
  function () {
    function NodePart(options) {
      r.classCallCheck(this, NodePart);
      this.value = undefined;
      this._pendingValue = undefined;
      this.options = options;
    }
    /**
     * Inserts this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    r.createClass(NodePart, [{
      key: "appendInto",
      value: function appendInto(container) {
        this.startNode = container.appendChild(createMarker());
        this.endNode = container.appendChild(createMarker());
      }
      /**
       * Inserts this part between `ref` and `ref`'s next sibling. Both `ref` and
       * its next sibling must be static, unchanging nodes such as those that appear
       * in a literal section of a template.
       *
       * This part must be empty, as its contents are not automatically moved.
       */

    }, {
      key: "insertAfterNode",
      value: function insertAfterNode(ref) {
        this.startNode = ref;
        this.endNode = ref.nextSibling;
      }
      /**
       * Appends this part into a parent part.
       *
       * This part must be empty, as its contents are not automatically moved.
       */

    }, {
      key: "appendIntoPart",
      value: function appendIntoPart(part) {
        part._insert(this.startNode = createMarker());

        part._insert(this.endNode = createMarker());
      }
      /**
       * Appends this part after `ref`
       *
       * This part must be empty, as its contents are not automatically moved.
       */

    }, {
      key: "insertAfterPart",
      value: function insertAfterPart(ref) {
        ref._insert(this.startNode = createMarker());

        this.endNode = ref.endNode;
        ref.endNode = this.startNode;
      }
    }, {
      key: "setValue",
      value: function setValue(value) {
        this._pendingValue = value;
      }
    }, {
      key: "commit",
      value: function commit() {
        while (isDirective(this._pendingValue)) {
          var directive$$1 = this._pendingValue;
          this._pendingValue = noChange;
          directive$$1(this);
        }

        var value = this._pendingValue;

        if (value === noChange) {
          return;
        }

        if (isPrimitive(value)) {
          if (value !== this.value) {
            this._commitText(value);
          }
        } else if (r.instanceof(value, TemplateResult)) {
          this._commitTemplateResult(value);
        } else if (r.instanceof(value, Node)) {
          this._commitNode(value);
        } else if (Array.isArray(value) || value[Symbol.iterator]) {
          this._commitIterable(value);
        } else {
          // Fallback, will render the string representation
          this._commitText(value);
        }
      }
    }, {
      key: "_insert",
      value: function _insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
      }
    }, {
      key: "_commitNode",
      value: function _commitNode(value) {
        if (this.value === value) {
          return;
        }

        this.clear();

        this._insert(value);

        this.value = value;
      }
    }, {
      key: "_commitText",
      value: function _commitText(value) {
        var node = this.startNode.nextSibling;
        value = value == null ? '' : value;

        if (node === this.endNode.previousSibling && node.nodeType === Node.TEXT_NODE) {
          // If we only have a single text node between the markers, we can just
          // set its value, rather than replacing it.
          // TODO(justinfagnani): Can we just check if this.value is primitive?
          node.textContent = value;
        } else {
          this._commitNode(document.createTextNode(typeof value === 'string' ? value : String(value)));
        }

        this.value = value;
      }
    }, {
      key: "_commitTemplateResult",
      value: function _commitTemplateResult(value) {
        var template = this.options.templateFactory(value);

        if (this.value && this.value.template === template) {
          this.value.update(value.values);
        } else {
          // Make sure we propagate the template processor from the TemplateResult
          // so that we use its syntax extension, etc. The template factory comes
          // from the render function options so that it can control template
          // caching and preprocessing.
          var instance = new TemplateInstance(template, value.processor, this.options);

          var fragment = instance._clone();

          instance.update(value.values);

          this._commitNode(fragment);

          this.value = instance;
        }
      }
    }, {
      key: "_commitIterable",
      value: function _commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _value is an array, then the previous render was of an
        // iterable and _value will contain the NodeParts from the previous
        // render. If _value is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this.value)) {
          this.value = [];
          this.clear();
        } // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render


        var itemParts = this.value;
        var partIndex = 0;
        var itemPart;
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = value[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var item = _step9.value; // Try to reuse an existing part

            itemPart = itemParts[partIndex]; // If no existing part, create a new one

            if (itemPart === undefined) {
              itemPart = new NodePart(this.options);
              itemParts.push(itemPart);

              if (partIndex === 0) {
                itemPart.appendIntoPart(this);
              } else {
                itemPart.insertAfterPart(itemParts[partIndex - 1]);
              }
            }

            itemPart.setValue(item);
            itemPart.commit();
            partIndex++;
          }
        } catch (err) {
          _didIteratorError9 = true;
          _iteratorError9 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
              _iterator9.return();
            }
          } finally {
            if (_didIteratorError9) {
              throw _iteratorError9;
            }
          }
        }

        if (partIndex < itemParts.length) {
          // Truncate the parts array so _value reflects the current state
          itemParts.length = partIndex;
          this.clear(itemPart && itemPart.endNode);
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        var startNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.startNode;
        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
      }
    }]);
    return NodePart;
  }();
  /**
   * Implements a boolean attribute, roughly as defined in the HTML
   * specification.
   *
   * If the value is truthy, then the attribute is present with a value of
   * ''. If the value is falsey, the attribute is removed.
   */


  var BooleanAttributePart =
  /*#__PURE__*/
  function () {
    function BooleanAttributePart(element, name, strings) {
      r.classCallCheck(this, BooleanAttributePart);
      this.value = undefined;
      this._pendingValue = undefined;

      if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
        throw new Error('Boolean attributes can only contain a single expression');
      }

      this.element = element;
      this.name = name;
      this.strings = strings;
    }

    r.createClass(BooleanAttributePart, [{
      key: "setValue",
      value: function setValue(value) {
        this._pendingValue = value;
      }
    }, {
      key: "commit",
      value: function commit() {
        while (isDirective(this._pendingValue)) {
          var directive$$1 = this._pendingValue;
          this._pendingValue = noChange;
          directive$$1(this);
        }

        if (this._pendingValue === noChange) {
          return;
        }

        var value = !!this._pendingValue;

        if (this.value !== value) {
          if (value) {
            this.element.setAttribute(this.name, '');
          } else {
            this.element.removeAttribute(this.name);
          }
        }

        this.value = value;
        this._pendingValue = noChange;
      }
    }]);
    return BooleanAttributePart;
  }();
  /**
   * Sets attribute values for PropertyParts, so that the value is only set once
   * even if there are multiple parts for a property.
   *
   * If an expression controls the whole property value, then the value is simply
   * assigned to the property under control. If there are string literals or
   * multiple expressions, then the strings are expressions are interpolated into
   * a string first.
   */


  var PropertyCommitter =
  /*#__PURE__*/
  function (_AttributeCommitter) {
    r.inherits(PropertyCommitter, _AttributeCommitter);

    function PropertyCommitter(element, name, strings) {
      var _this5;

      r.classCallCheck(this, PropertyCommitter);
      _this5 = r.possibleConstructorReturn(this, r.getPrototypeOf(PropertyCommitter).call(this, element, name, strings));
      _this5.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
      return _this5;
    }

    r.createClass(PropertyCommitter, [{
      key: "_createPart",
      value: function _createPart() {
        return new PropertyPart(this);
      }
    }, {
      key: "_getValue",
      value: function _getValue() {
        if (this.single) {
          return this.parts[0].value;
        }

        return r.get(r.getPrototypeOf(PropertyCommitter.prototype), "_getValue", this).call(this);
      }
    }, {
      key: "commit",
      value: function commit() {
        if (this.dirty) {
          this.dirty = false;
          this.element[this.name] = this._getValue();
        }
      }
    }]);
    return PropertyCommitter;
  }(AttributeCommitter);

  var PropertyPart =
  /*#__PURE__*/
  function (_AttributePart) {
    r.inherits(PropertyPart, _AttributePart);

    function PropertyPart() {
      r.classCallCheck(this, PropertyPart);
      return r.possibleConstructorReturn(this, r.getPrototypeOf(PropertyPart).apply(this, arguments));
    }

    return PropertyPart;
  }(AttributePart); // Detect event listener options support. If the `capture` property is read
  // from the options object, then options are supported. If not, then the thrid
  // argument to add/removeEventListener is interpreted as the boolean capture
  // value so we should only pass the `capture` property.


  var eventOptionsSupported = false;

  try {
    var options = {
      get capture() {
        eventOptionsSupported = true;
        return false;
      }

    };
    window.addEventListener('test', options, options);
    window.removeEventListener('test', options, options);
  } catch (_e) {}

  var EventPart =
  /*#__PURE__*/
  function () {
    function EventPart(element, eventName, eventContext) {
      var _this6 = this;

      r.classCallCheck(this, EventPart);
      this.value = undefined;
      this._pendingValue = undefined;
      this.element = element;
      this.eventName = eventName;
      this.eventContext = eventContext;

      this._boundHandleEvent = function (e) {
        return _this6.handleEvent(e);
      };
    }

    r.createClass(EventPart, [{
      key: "setValue",
      value: function setValue(value) {
        this._pendingValue = value;
      }
    }, {
      key: "commit",
      value: function commit() {
        while (isDirective(this._pendingValue)) {
          var directive$$1 = this._pendingValue;
          this._pendingValue = noChange;
          directive$$1(this);
        }

        if (this._pendingValue === noChange) {
          return;
        }

        var newListener = this._pendingValue;
        var oldListener = this.value;
        var shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
        var shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

        if (shouldRemoveListener) {
          this.element.removeEventListener(this.eventName, this._boundHandleEvent, this._options);
        }

        if (shouldAddListener) {
          this._options = getOptions(newListener);
          this.element.addEventListener(this.eventName, this._boundHandleEvent, this._options);
        }

        this.value = newListener;
        this._pendingValue = noChange;
      }
    }, {
      key: "handleEvent",
      value: function handleEvent(event) {
        if (typeof this.value === 'function') {
          this.value.call(this.eventContext || this.element, event);
        } else {
          this.value.handleEvent(event);
        }
      }
    }]);
    return EventPart;
  }(); // We copy options because of the inconsistent behavior of browsers when reading
  // the third argument of add/removeEventListener. IE11 doesn't support options
  // at all. Chrome 41 only reads `capture` if the argument is an object.


  var getOptions = function getOptions(o) {
    return o && (eventOptionsSupported ? {
      capture: o.capture,
      passive: o.passive,
      once: o.once
    } : o.capture);
  };

  var DefaultTemplateProcessor =
  /*#__PURE__*/
  function () {
    function DefaultTemplateProcessor() {
      r.classCallCheck(this, DefaultTemplateProcessor);
    }

    r.createClass(DefaultTemplateProcessor, [{
      key: "handleAttributeExpressions",

      /**
       * Create parts for an attribute-position binding, given the event, attribute
       * name, and string literals.
       *
       * @param element The element containing the binding
       * @param name  The attribute name
       * @param strings The string literals. There are always at least two strings,
       *   event for fully-controlled bindings with a single expression.
       */
      value: function handleAttributeExpressions(element, name, strings, options) {
        var prefix = name[0];

        if (prefix === '.') {
          var _comitter = new PropertyCommitter(element, name.slice(1), strings);

          return _comitter.parts;
        }

        if (prefix === '@') {
          return [new EventPart(element, name.slice(1), options.eventContext)];
        }

        if (prefix === '?') {
          return [new BooleanAttributePart(element, name.slice(1), strings)];
        }

        var comitter = new AttributeCommitter(element, name, strings);
        return comitter.parts;
      }
      /**
       * Create parts for a text-position binding.
       * @param templateFactory
       */

    }, {
      key: "handleTextExpression",
      value: function handleTextExpression(options) {
        return new NodePart(options);
      }
    }]);
    return DefaultTemplateProcessor;
  }();

  var defaultTemplateProcessor = new DefaultTemplateProcessor();

  function templateFactory(result) {
    var templateCache = templateCaches.get(result.type);

    if (templateCache === undefined) {
      templateCache = {
        stringsArray: new WeakMap(),
        keyString: new Map()
      };
      templateCaches.set(result.type, templateCache);
    }

    var template = templateCache.stringsArray.get(result.strings);

    if (template !== undefined) {
      return template;
    } // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content


    var key = result.strings.join(marker); // Check if we already have a Template for this key

    template = templateCache.keyString.get(key);

    if (template === undefined) {
      // If we have not seen this key before, create a new Template
      template = new Template(result, result.getTemplateElement()); // Cache the Template for this key

      templateCache.keyString.set(key, template);
    } // Cache all future queries for this TemplateStringsArray


    templateCache.stringsArray.set(result.strings, template);
    return template;
  }

  var templateCaches = new Map();
  var parts$1 = new WeakMap();
  /**
        * Renders a template to a container.
        *
        * To update a container with new values, reevaluate the template literal and
        * call `render` with the new result.
        *
        * @param result a TemplateResult created by evaluating a template tag like
        *     `html` or `svg`.
        * @param container A DOM parent to render to. The entire contents are either
        *     replaced, or efficiently updated if the same result type was previous
        *     rendered there.
        * @param options RenderOptions for the entire render tree rendered to this
        *     container. Render options must *not* change between renders to the same
        *     container, as those changes will not effect previously rendered DOM.
        */

  var render = function render(result, container, options) {
    var part = parts$1.get(container);

    if (part === undefined) {
      removeNodes(container, container.firstChild);
      parts$1.set(container, part = new NodePart(Object.assign({
        templateFactory: templateFactory
      }, options)));
      part.appendInto(container);
    }

    part.setValue(result);
    part.commit();
  };
  var walkerNodeFilter = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT;
  /**
   * Removes the list of nodes from a Template safely. In addition to removing
   * nodes from the Template, the Template part indices are updated to match
   * the mutated Template DOM.
   *
   * As the template is walked the removal state is tracked and
   * part indices are adjusted as needed.
   *
   * div
   *   div#1 (remove) <-- start removing (removing node is div#1)
   *     div
   *       div#2 (remove)  <-- continue removing (removing node is still div#1)
   *         div
   * div <-- stop removing since previous sibling is the removing node (div#1,
   * removed 4 nodes)
   */

  function removeNodesFromTemplate(template, nodesToRemove) {
    var content = template.element.content,
        parts = template.parts;
    var walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    var partIndex = nextActiveIndexInTemplateParts(parts);
    var part = parts[partIndex];
    var nodeIndex = -1;
    var removeCount = 0;
    var nodesToRemoveInTemplate = [];
    var currentRemovingNode = null;

    while (walker.nextNode()) {
      nodeIndex++;
      var node = walker.currentNode; // End removal if stepped past the removing node

      if (node.previousSibling === currentRemovingNode) {
        currentRemovingNode = null;
      } // A node to remove was found in the template


      if (nodesToRemove.has(node)) {
        nodesToRemoveInTemplate.push(node); // Track node we're removing

        if (currentRemovingNode === null) {
          currentRemovingNode = node;
        }
      } // When removing, increment count by which to adjust subsequent part indices


      if (currentRemovingNode !== null) {
        removeCount++;
      }

      while (part !== undefined && part.index === nodeIndex) {
        // If part is in a removed node deactivate it by setting index to -1 or
        // adjust the index as needed.
        part.index = currentRemovingNode !== null ? -1 : part.index - removeCount; // go to the next active part.

        partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        part = parts[partIndex];
      }
    }

    nodesToRemoveInTemplate.forEach(function (n) {
      return n.parentNode.removeChild(n);
    });
  }

  var countNodes = function countNodes(node) {
    var count = node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? 0 : 1;
    var walker = document.createTreeWalker(node, walkerNodeFilter, null, false);

    while (walker.nextNode()) {
      count++;
    }

    return count;
  };

  var nextActiveIndexInTemplateParts = function nextActiveIndexInTemplateParts(parts) {
    var startIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

    for (var i = startIndex + 1; i < parts.length; i++) {
      var _part6 = parts[i];

      if (isTemplatePartActive(_part6)) {
        return i;
      }
    }

    return -1;
  };
  /**
   * Inserts the given node into the Template, optionally before the given
   * refNode. In addition to inserting the node into the Template, the Template
   * part indices are updated to match the mutated Template DOM.
   */


  function insertNodeIntoTemplate(template, node) {
    var refNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var content = template.element.content,
        parts = template.parts; // If there's no refNode, then put node at end of template.
    // No part indices need to be shifted in this case.

    if (refNode === null || refNode === undefined) {
      content.appendChild(node);
      return;
    }

    var walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    var partIndex = nextActiveIndexInTemplateParts(parts);
    var insertCount = 0;
    var walkerIndex = -1;

    while (walker.nextNode()) {
      walkerIndex++;
      var walkerNode = walker.currentNode;

      if (walkerNode === refNode) {
        insertCount = countNodes(node);
        refNode.parentNode.insertBefore(node, refNode);
      }

      while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
        // If we've inserted the node, simply adjust all subsequent parts
        if (insertCount > 0) {
          while (partIndex !== -1) {
            parts[partIndex].index += insertCount;
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
          }

          return;
        }

        partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
      }
    }
  }

  var getTemplateCacheKey = function getTemplateCacheKey(type, scopeName) {
    return "".concat(type, "--").concat(scopeName);
  };

  var compatibleShadyCSSVersion = true;

  if (typeof window.ShadyCSS === 'undefined') {
    compatibleShadyCSSVersion = false;
  } else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn("Incompatible ShadyCSS version detected." + "Please update to at least @webcomponents/webcomponentsjs@2.0.2 and" + "@webcomponents/shadycss@1.3.1.");
    compatibleShadyCSSVersion = false;
  }
  /**
   * Template factory which scopes template DOM using ShadyCSS.
   * @param scopeName {string}
   */


  var shadyTemplateFactory = function shadyTemplateFactory(scopeName) {
    return function (result) {
      var cacheKey = getTemplateCacheKey(result.type, scopeName);
      var templateCache = templateCaches.get(cacheKey);

      if (templateCache === undefined) {
        templateCache = {
          stringsArray: new WeakMap(),
          keyString: new Map()
        };
        templateCaches.set(cacheKey, templateCache);
      }

      var template = templateCache.stringsArray.get(result.strings);

      if (template !== undefined) {
        return template;
      }

      var key = result.strings.join(marker);
      template = templateCache.keyString.get(key);

      if (template === undefined) {
        var element = result.getTemplateElement();

        if (compatibleShadyCSSVersion) {
          window.ShadyCSS.prepareTemplateDom(element, scopeName);
        }

        template = new Template(result, element);
        templateCache.keyString.set(key, template);
      }

      templateCache.stringsArray.set(result.strings, template);
      return template;
    };
  };

  var TEMPLATE_TYPES = ['html', 'svg'];
  /**
   * Removes all style elements from Templates for the given scopeName.
   */

  var removeStylesFromLitTemplates = function removeStylesFromLitTemplates(scopeName) {
    TEMPLATE_TYPES.forEach(function (type) {
      var templates = templateCaches.get(getTemplateCacheKey(type, scopeName));

      if (templates !== undefined) {
        templates.keyString.forEach(function (template) {
          var content = template.element.content; // IE 11 doesn't support the iterable param Set constructor

          var styles = new Set();
          Array.from(content.querySelectorAll('style')).forEach(function (s) {
            styles.add(s);
          });
          removeNodesFromTemplate(template, styles);
        });
      }
    });
  };

  var shadyRenderSet = new Set();
  /**
   * For the given scope name, ensures that ShadyCSS style scoping is performed.
   * This is done just once per scope name so the fragment and template cannot
   * be modified.
   * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
   * to be scoped and appended to the document
   * (2) removes style elements from all lit-html Templates for this scope name.
   *
   * Note, <style> elements can only be placed into templates for the
   * initial rendering of the scope. If <style> elements are included in templates
   * dynamically rendered to the scope (after the first scope render), they will
   * not be scoped and the <style> will be left in the template and rendered
   * output.
   */

  var prepareTemplateStyles = function prepareTemplateStyles(renderedDOM, template, scopeName) {
    shadyRenderSet.add(scopeName); // Move styles out of rendered DOM and store.

    var styles = renderedDOM.querySelectorAll('style'); // If there are no styles, there's no work to do.

    if (styles.length === 0) {
      return;
    }

    var condensedStyle = document.createElement('style'); // Collect styles into a single style. This helps us make sure ShadyCSS
    // manipulations will not prevent us from being able to fix up template
    // part indices.
    // NOTE: collecting styles is inefficient for browsers but ShadyCSS
    // currently does this anyway. When it does not, this should be changed.

    for (var i = 0; i < styles.length; i++) {
      var style = styles[i];
      style.parentNode.removeChild(style);
      condensedStyle.textContent += style.textContent;
    } // Remove styles from nested templates in this scope.


    removeStylesFromLitTemplates(scopeName); // And then put the condensed style into the "root" template passed in as
    // `template`.

    insertNodeIntoTemplate(template, condensedStyle, template.element.content.firstChild); // Note, it's important that ShadyCSS gets the template that `lit-html`
    // will actually render so that it can update the style inside when
    // needed (e.g. @apply native Shadow DOM case).

    window.ShadyCSS.prepareTemplateStyles(template.element, scopeName);

    if (window.ShadyCSS.nativeShadow) {
      // When in native Shadow DOM, re-add styling to rendered content using
      // the style ShadyCSS produced.
      var _style = template.element.content.querySelector('style');

      renderedDOM.insertBefore(_style.cloneNode(true), renderedDOM.firstChild);
    } else {
      // When not in native Shadow DOM, at this point ShadyCSS will have
      // removed the style from the lit template and parts will be broken as a
      // result. To fix this, we put back the style node ShadyCSS removed
      // and then tell lit to remove that node from the template.
      // NOTE, ShadyCSS creates its own style so we can safely add/remove
      // `condensedStyle` here.
      template.element.content.insertBefore(condensedStyle, template.element.content.firstChild);
      var removes = new Set();
      removes.add(condensedStyle);
      removeNodesFromTemplate(template, removes);
    }
  };
  /**
   * Extension to the standard `render` method which supports rendering
   * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
   * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
   * or when the webcomponentsjs
   * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
   *
   * Adds a `scopeName` option which is used to scope element DOM and stylesheets
   * when native ShadowDOM is unavailable. The `scopeName` will be added to
   * the class attribute of all rendered DOM. In addition, any style elements will
   * be automatically re-written with this `scopeName` selector and moved out
   * of the rendered DOM and into the document <head>.
   *
   * It is common to use this render method in conjunction with a custom element
   * which renders a shadowRoot. When this is done, typically the element's
   * `localName` should be used as the `scopeName`.
   *
   * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
   * custom properties (needed only on older browsers like IE11) and a shim for
   * a deprecated feature called `@apply` that supports applying a set of css
   * custom properties to a given location.
   *
   * Usage considerations:
   *
   * * Part values in <style> elements are only applied the first time a given
   * `scopeName` renders. Subsequent changes to parts in style elements will have
   * no effect. Because of this, parts in style elements should only be used for
   * values that will never change, for example parts that set scope-wide theme
   * values or parts which render shared style elements.
   *
   * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
   * custom element's `constructor` is not supported. Instead rendering should
   * either done asynchronously, for example at microtask timing (e.g.
   * Promise.resolve()), or be deferred until the element's `connectedCallback`
   * first runs.
   *
   * Usage considerations when using shimmed custom properties or `@apply`:
   *
   * * Whenever any dynamic changes are made which affect
   * css custom properties, `ShadyCSS.styleElement(element)` must be called
   * to update the element. There are two cases when this is needed:
   * (1) the element is connected to a new parent, (2) a class is added to the
   * element that causes it to match different custom properties.
   * To address the first case when rendering a custom element, `styleElement`
   * should be called in the element's `connectedCallback`.
   *
   * * Shimmed custom properties may only be defined either for an entire
   * shadowRoot (e.g. via `:host`) or via a rule that directly matches an element
   * with a shadowRoot. In other words, instead of flowing from parent to child as
   * do native css custom properties, shimmed custom properties flow only from
   * shadowRoots to nested shadowRoots.
   *
   * * When using `@apply` mixing css shorthand property names with
   * non-shorthand names (for example `border` and `border-width`) is not
   * supported.
   */


  var render$2 = function render$2(result, container, options) {
    var scopeName = options.scopeName;
    var hasRendered = parts$1.has(container);
    var needsScoping = r.instanceof(container, ShadowRoot) && compatibleShadyCSSVersion && r.instanceof(result, TemplateResult); // Handle first render to a scope specially...

    var firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName); // On first scope render, render into a fragment; this cannot be a single
    // fragment that is reused since nested renders can occur synchronously.

    var renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
    render(result, renderContainer, Object.assign({
      templateFactory: shadyTemplateFactory(scopeName)
    }, options)); // When performing first scope render,
    // (1) We've rendered into a fragment so that there's a chance to
    // `prepareTemplateStyles` before sub-elements hit the DOM
    // (which might cause them to render based on a common pattern of
    // rendering in a custom element's `connectedCallback`);
    // (2) Scope the template with ShadyCSS one time only for this scope.
    // (3) Render the fragment into the container and make sure the
    // container knows its `part` is the one we just rendered. This ensures
    // DOM will be re-used on subsequent renders.

    if (firstScopeRender) {
      var _part7 = parts$1.get(renderContainer);

      parts$1.delete(renderContainer);

      if (r.instanceof(_part7.value, TemplateInstance)) {
        prepareTemplateStyles(renderContainer, _part7.value.template, scopeName);
      }

      removeNodes(container, container.firstChild);
      container.appendChild(renderContainer);
      parts$1.set(container, _part7);
    } // After elements have hit the DOM, update styling if this is the
    // initial render to this container.
    // This is needed whenever dynamic changes are made so it would be
    // safest to do every render; however, this would regress performance
    // so we leave it up to the user to call `ShadyCSSS.styleElement`
    // for dynamic changes.


    if (!hasRendered && needsScoping) {
      window.ShadyCSS.styleElement(container.host);
    }
  };

  var LitElement =
  /*#__PURE__*/
  function (_UpdatingElement) {
    r.inherits(LitElement, _UpdatingElement);

    function LitElement() {
      r.classCallCheck(this, LitElement);
      return r.possibleConstructorReturn(this, r.getPrototypeOf(LitElement).apply(this, arguments));
    }

    r.createClass(LitElement, [{
      key: "update",

      /**
       * Updates the element. This method reflects property values to attributes
       * and calls `render` to render DOM via lit-html. Setting properties inside
       * this method will *not* trigger another update.
       * * @param _changedProperties Map of changed properties with old values
       */
      value: function update(changedProperties) {
        r.get(r.getPrototypeOf(LitElement.prototype), "update", this).call(this, changedProperties);
        var templateResult = this.render();

        if (r.instanceof(templateResult, TemplateResult)) {
          this.constructor.render(templateResult, this.renderRoot, {
            scopeName: this.localName,
            eventContext: this
          });
        }
      }
      /**
       * Invoked on each update to perform rendering tasks. This method must return
       * a lit-html TemplateResult. Setting properties inside this method will *not*
       * trigger the element to update.
       */

    }, {
      key: "render",
      value: function render() {}
    }]);
    return LitElement;
  }(UpdatingElement);
  /**
   * Render method used to render the lit-html TemplateResult to the element's
   * DOM.
   * @param {TemplateResult} Template to render.
   * @param {Element|DocumentFragment} Node into which to render.
   * @param {String} Element name.
   */


  LitElement.render = render$2;

}));
