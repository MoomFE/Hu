!function (a) {

  function b(a) {
    return r.typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? b = function (a) {
      return typeof a
    } : b = function (a) {
      return a && "function" === typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a
    }, b(a)
  }

  function c(a) {
    function b(d, e) {
      try {
        var f = a[d](e),
          g = f.value,
          h = g instanceof r.AwaitValue;
        Promise.resolve(h ? g.wrapped : g).then(function (a) {
          return h ? void b("next", a) : void c(f.done ? "return" : "normal", a)
        }, function (a) {
          b("throw", a)
        })
      } catch (a) {
        c("throw", a)
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
      d = d.next, d ? b(d.key, d.arg) : e = null
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
        e ? e = e.next = h : (d = e = h, b(a, c))
      })
    }, "function" !== typeof a.return && (this.return = void 0)
  }

  function d(a, b, c, d, e, f, g) {
    try {
      var h = a[f](g),
        i = h.value
    } catch (a) {
      return void c(a)
    }
    h.done ? b(i) : Promise.resolve(i).then(d, e)
  }

  function e(a, b) {
    for (var c, d = 0; d < b.length; d++) c = b[d], c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(a, c.key, c)
  }

  function f(a, b) {
    for (var c in b) {
      var d = b[c];
      d.configurable = d.enumerable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, c, d)
    }
    if (Object.getOwnPropertySymbols)
      for (var e = Object.getOwnPropertySymbols(b), f = 0; f < e.length; f++) {
        var g = e[f],
          d = b[g];
        d.configurable = d.enumerable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, g, d)
      }
    return a
  }

  function g(a, b, c) {
    return b in a ? Object.defineProperty(a, b, {
      value: c,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : a[b] = c, a
  }

  function h() {
    return r.extends = h = Object.assign || function (a) {
      for (var b, c = 1; c < arguments.length; c++)
        for (var d in b = arguments[c], b) Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);
      return a
    }, h.apply(this, arguments)
  }

  function i(a) {
    return r.getPrototypeOf = i = Object.setPrototypeOf ? Object.getPrototypeOf : function (a) {
      return a.__proto__ || Object.getPrototypeOf(a)
    }, i(a)
  }

  function j(a, b) {
    return r.setPrototypeOf = j = Object.setPrototypeOf || function (a, b) {
      return a.__proto__ = b, a
    }, j(a, b)
  }

  function k() {
    if ("undefined" === typeof Reflect || !Reflect.construct) return !1;
    if (Reflect.construct.sham) return !1;
    if ("function" === typeof Proxy) return !0;
    try {
      return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0
    } catch (a) {
      return !1
    }
  }

  function l() {
    return r.construct = k() ? l = Reflect.construct : l = function (b, c, d) {
      var e = [null];
      e.push.apply(e, c);
      var a = Function.bind.apply(b, e),
        f = new a;
      return d && r.setPrototypeOf(f, d.prototype), f
    }, l.apply(null, arguments)
  }

  function m(a) {
    var b = "function" === typeof Map ? new Map : void 0;
    return r.wrapNativeSuper = m = function (a) {
      function c() {
        return r.construct(a, arguments, r.getPrototypeOf(this).constructor)
      }
      if (null === a || !r.isNativeFunction(a)) return a;
      if ("function" !== typeof a) throw new TypeError("Super expression must either be null or a function");
      if ("undefined" !== typeof b) {
        if (b.has(a)) return b.get(a);
        b.set(a, c)
      }
      return c.prototype = Object.create(a.prototype, {
        constructor: {
          value: c,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }), r.setPrototypeOf(c, a)
    }, m(a)
  }

  function n(a, b, c) {
    return r.get = "undefined" !== typeof Reflect && Reflect.get ? n = Reflect.get : n = function (a, b, c) {
      var d = r.superPropBase(a, b);
      if (d) {
        var e = Object.getOwnPropertyDescriptor(d, b);
        return e.get ? e.get.call(c) : e.value
      }
    }, n(a, b, c || a)
  }

  function o(a, b, c, d) {
    return o = "undefined" !== typeof Reflect && Reflect.set ? Reflect.set : function (a, b, c, d) {
      var e, f = r.superPropBase(a, b);
      if (f) {
        if (e = Object.getOwnPropertyDescriptor(f, b), e.set) return e.set.call(d, c), !0;
        if (!e.writable) return !1
      }
      if (e = Object.getOwnPropertyDescriptor(d, b), e) {
        if (!e.writable) return !1;
        e.value = c, Object.defineProperty(d, b, e)
      } else r.defineProperty(d, b, c);
      return !0
    }, o(a, b, c, d)
  }

  function p(a, b, c, d, e) {
    var f = o(a, b, c, d || a);
    if (!f && e) throw new Error("failed to set property");
    return c
  }

  function q(a) {
    if (Symbol.iterator in Object(a) || "[object Arguments]" === Object.prototype.toString.call(a)) return Array.from(a)
  }
  var r = a.babelHelpers = {};
  r.typeof = b, r.asyncIterator = function (a) {
    var b;
    if ("function" === typeof Symbol) {
      if (Symbol.asyncIterator && (b = a[Symbol.asyncIterator], null != b)) return b.call(a);
      if (Symbol.iterator && (b = a[Symbol.iterator], null != b)) return b.call(a)
    }
    throw new TypeError("Object is not async iterable")
  }, r.AwaitValue = function (a) {
    this.wrapped = a
  }, "function" === typeof Symbol && Symbol.asyncIterator && (c.prototype[Symbol.asyncIterator] = function () {
    return this
  }), c.prototype.next = function (a) {
    return this._invoke("next", a)
  }, c.prototype.throw = function (a) {
    return this._invoke("throw", a)
  }, c.prototype.return = function (a) {
    return this._invoke("return", a)
  }, r.AsyncGenerator = c, r.wrapAsyncGenerator = function (a) {
    return function () {
      return new r.AsyncGenerator(a.apply(this, arguments))
    }
  }, r.awaitAsyncGenerator = function (a) {
    return new r.AwaitValue(a)
  }, r.asyncGeneratorDelegate = function (a, b) {
    function c(c, d) {
      return e = !0, d = new Promise(function (b) {
        b(a[c](d))
      }), {
        done: !1,
        value: b(d)
      }
    }
    var d = {},
      e = !1;
    return "function" === typeof Symbol && Symbol.iterator && (d[Symbol.iterator] = function () {
      return this
    }), d.next = function (a) {
      return e ? (e = !1, a) : c("next", a)
    }, "function" === typeof a.throw && (d.throw = function (a) {
      if (e) throw e = !1, a;
      return c("throw", a)
    }), "function" === typeof a.return && (d.return = function (a) {
      return c("return", a)
    }), d
  }, r.asyncToGenerator = function (a) {
    return function () {
      var b = this,
        c = arguments;
      return new Promise(function (e, f) {
        function g(a) {
          d(i, e, f, g, h, "next", a)
        }

        function h(a) {
          d(i, e, f, g, h, "throw", a)
        }
        var i = a.apply(b, c);
        g(void 0)
      })
    }
  }, r.classCallCheck = function (a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
  }, r.createClass = function (a, b, c) {
    return b && e(a.prototype, b), c && e(a, c), a
  }, r.defineEnumerableProperties = f, r.defaults = function (a, b) {
    for (var c = Object.getOwnPropertyNames(b), d = 0; d < c.length; d++) {
      var e = c[d],
        f = Object.getOwnPropertyDescriptor(b, e);
      f && f.configurable && a[e] === void 0 && Object.defineProperty(a, e, f)
    }
    return a
  }, r.defineProperty = g, r.extends = h, r.objectSpread = function (a) {
    for (var b = 1; b < arguments.length; b++) {
      var c = null == arguments[b] ? {} : arguments[b],
        d = Object.keys(c);
      "function" === typeof Object.getOwnPropertySymbols && (d = d.concat(Object.getOwnPropertySymbols(c).filter(function (a) {
        return Object.getOwnPropertyDescriptor(c, a).enumerable
      }))), d.forEach(function (b) {
        r.defineProperty(a, b, c[b])
      })
    }
    return a
  }, r.inherits = function (a, b) {
    if ("function" !== typeof b && null !== b) throw new TypeError("Super expression must either be null or a function");
    a.prototype = Object.create(b && b.prototype, {
      constructor: {
        value: a,
        writable: !0,
        configurable: !0
      }
    }), b && r.setPrototypeOf(a, b)
  }, r.getPrototypeOf = i, r.setPrototypeOf = j, r.construct = l, r.isNativeFunction = function (a) {
    return -1 !== Function.toString.call(a).indexOf("[native code]")
  }, r.wrapNativeSuper = m, r.instanceof = function (a, b) {
    return null != b && "undefined" !== typeof Symbol && b[Symbol.hasInstance] ? b[Symbol.hasInstance](a) : a instanceof b
  }, r.interopRequireDefault = function (a) {
    return a && a.__esModule ? a : {
      default: a
    }
  }, r.interopRequireWildcard = function (a) {
    if (a && a.__esModule) return a;
    var b = {};
    if (null != a)
      for (var c in a)
        if (Object.prototype.hasOwnProperty.call(a, c)) {
          var d = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(a, c) : {};
          d.get || d.set ? Object.defineProperty(b, c, d) : b[c] = a[c]
        } return b.default = a, b
  }, r.newArrowCheck = function (a, b) {
    if (a !== b) throw new TypeError("Cannot instantiate an arrow function")
  }, r.objectDestructuringEmpty = function (a) {
    if (null == a) throw new TypeError("Cannot destructure undefined")
  }, r.objectWithoutProperties = function (a, b) {
    if (null == a) return {};
    var c, d, e = r.objectWithoutPropertiesLoose(a, b);
    if (Object.getOwnPropertySymbols) {
      var f = Object.getOwnPropertySymbols(a);
      for (d = 0; d < f.length; d++) c = f[d], !(0 <= b.indexOf(c)) && Object.prototype.propertyIsEnumerable.call(a, c) && (e[c] = a[c])
    }
    return e
  }, r.assertThisInitialized = function (a) {
    if (void 0 === a) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a
  }, r.possibleConstructorReturn = function (a, b) {
    return b && ("object" === typeof b || "function" === typeof b) ? b : r.assertThisInitialized(a)
  }, r.superPropBase = function (a, b) {
    for (; !Object.prototype.hasOwnProperty.call(a, b) && (a = r.getPrototypeOf(a), null !== a););
    return a
  }, r.get = n, r.set = p, r.taggedTemplateLiteral = function (a, b) {
    return b || (b = a.slice(0)), Object.freeze(Object.defineProperties(a, {
      raw: {
        value: Object.freeze(b)
      }
    }))
  }, r.temporalRef = function (a, b) {
    if (a === r.temporalUndefined) throw new ReferenceError(b + " is not defined - temporal dead zone");
    else return a
  }, r.readOnlyError = function (a) {
    throw new Error("\"" + a + "\" is read-only")
  }, r.temporalUndefined = {}, r.slicedToArray = function (a, b) {
    return r.arrayWithHoles(a) || r.iterableToArrayLimit(a, b) || r.nonIterableRest()
  }, r.toArray = function (a) {
    return r.arrayWithHoles(a) || r.iterableToArray(a) || r.nonIterableRest()
  }, r.toConsumableArray = function (a) {
    return r.arrayWithoutHoles(a) || r.iterableToArray(a) || r.nonIterableSpread()
  }, r.arrayWithoutHoles = function (a) {
    if (Array.isArray(a)) {
      for (var b = 0, c = Array(a.length); b < a.length; b++) c[b] = a[b];
      return c
    }
  }, r.arrayWithHoles = function (a) {
    if (Array.isArray(a)) return a
  }, r.iterableToArray = q, r.iterableToArrayLimit = function (a, b) {
    var c = [],
      d = !0,
      e = !1,
      f = void 0;
    try {
      for (var g, h = a[Symbol.iterator](); !(d = (g = h.next()).done) && (c.push(g.value), !(b && c.length === b)); d = !0);
    } catch (a) {
      e = !0, f = a
    } finally {
      try {
        d || null == h["return"] || h["return"]()
      } finally {
        if (e) throw f
      }
    }
    return c
  }, r.nonIterableSpread = function () {
    throw new TypeError("Invalid attempt to spread non-iterable instance")
  }, r.nonIterableRest = function () {
    throw new TypeError("Invalid attempt to destructure non-iterable instance")
  }, r.toPropertyKey = function (a) {
    var b = r.toPrimitive(a, "string");
    return "symbol" === typeof b ? b : b + ""
  }
}( window );