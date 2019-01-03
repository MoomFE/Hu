var a = {};

!function () {

  function b(a, b, c, e) {
    var f = b && b.prototype instanceof d ? b : d,
      g = Object.create(f.prototype),
      h = new m(e || []);
    return g._invoke = i(a, c, h), g
  }

  function c(a, b, c) {
    try {
      return {
        type: "normal",
        arg: a.call(b, c)
      }
    } catch (a) {
      return {
        type: "throw",
        arg: a
      }
    }
  }

  function d() {}

  function e() {}

  function f() {}

  function g(a) {
    ["next", "throw", "return"].forEach(function (b) {
      a[b] = function (a) {
        return this._invoke(b, a)
      }
    })
  }

  function h(a) {
    function b(d, e, f, g) {
      var h = c(a[d], a, e);
      if ("throw" === h.type) g(h.arg);
      else {
        var i = h.arg,
          j = i.value;
        return j && "object" === typeof j && q.call(j, "__await") ? Promise.resolve(j.__await).then(function (a) {
          b("next", a, f, g)
        }, function (a) {
          b("throw", a, f, g)
        }) : Promise.resolve(j).then(function (a) {
          i.value = a, f(i)
        }, g)
      }
    }

    function d(a, c) {
      function d() {
        return new Promise(function (d, e) {
          b(a, c, d, e)
        })
      }
      return e = e ? e.then(d, d) : d()
    }
    var e;
    this._invoke = d
  }

  function i(a, b, d) {
    var e = "suspendedStart";
    return function (f, g) {
      if (e === "executing") throw new Error("Generator is already running");
      if ("completed" === e) {
        if ("throw" === f) throw g;
        return o()
      }
      for (d.method = f, d.arg = g;;) {
        var h = d.delegate;
        if (h) {
          var i = j(h, d);
          if (i) {
            if (i === x) continue;
            return i
          }
        }
        if ("next" === d.method) d.sent = d._sent = d.arg;
        else if ("throw" === d.method) {
          if ("suspendedStart" === e) throw e = "completed", d.arg;
          d.dispatchException(d.arg)
        } else "return" === d.method && d.abrupt("return", d.arg);
        e = "executing";
        var k = c(a, b, d);
        if ("normal" === k.type) {
          if (e = d.done ? "completed" : "suspendedYield", k.arg === x) continue;
          return {
            value: k.arg,
            done: d.done
          }
        }
        "throw" === k.type && (e = "completed", d.method = "throw", d.arg = k.arg)
      }
    }
  }

  function j(a, b) {
    var d = a.iterator[b.method];
    if (void 0 === d) {
      if (b.delegate = null, "throw" === b.method) {
        if (a.iterator.return && (b.method = "return", b.arg = void 0, j(a, b), "throw" === b.method)) return x;
        b.method = "throw", b.arg = new TypeError("The iterator does not provide a 'throw' method")
      }
      return x
    }
    var e = c(d, a.iterator, b.arg);
    if ("throw" === e.type) return b.method = "throw", b.arg = e.arg, b.delegate = null, x;
    var f = e.arg;
    if (!f) return b.method = "throw", b.arg = new TypeError("iterator result is not an object"), b.delegate = null, x;
    if (f.done) b[a.resultName] = f.value, b.next = a.nextLoc, "return" !== b.method && (b.method = "next", b.arg = void 0);
    else return f;
    return b.delegate = null, x
  }

  function k(a) {
    var b = {
      tryLoc: a[0]
    };
    1 in a && (b.catchLoc = a[1]), 2 in a && (b.finallyLoc = a[2], b.afterLoc = a[3]), this.tryEntries.push(b)
  }

  function l(a) {
    var b = a.completion || {};
    b.type = "normal", delete b.arg, a.completion = b
  }

  function m(a) {
    this.tryEntries = [{
      tryLoc: "root"
    }], a.forEach(k, this), this.reset(!0)
  }

  function n(a) {
    if (a) {
      var b = a[s];
      if (b) return b.call(a);
      if ("function" === typeof a.next) return a;
      if (!isNaN(a.length)) {
        var c = -1,
          d = function b() {
            for (; ++c < a.length;)
              if (q.call(a, c)) return b.value = a[c], b.done = !1, b;
            return b.value = void 0, b.done = !0, b
          };
        return d.next = d
      }
    }
    return {
      next: o
    }
  }

  function o() {
    return {
      value: void 0,
      done: !0
    }
  }
  var p = Object.prototype,
    q = p.hasOwnProperty,
    r = "function" === typeof Symbol ? Symbol : {},
    s = r.iterator || "@@iterator",
    t = r.asyncIterator || "@@asyncIterator",
    u = r.toStringTag || "@@toStringTag",
    v = "object" === typeof module,
    w = a.regeneratorRuntime;
  if (w) return void(v && (module.exports = w));
  w = a.regeneratorRuntime = v ? module.exports : {}, w.wrap = b;
  var x = {},
    y = {};
  y[s] = function () {
    return this
  };
  var z = Object.getPrototypeOf,
    A = z && z(z(n([])));
  A && A !== p && q.call(A, s) && (y = A);
  var B = f.prototype = d.prototype = Object.create(y);
  e.prototype = B.constructor = f, f.constructor = e, f[u] = e.displayName = "GeneratorFunction", w.isGeneratorFunction = function (a) {
    var b = "function" === typeof a && a.constructor;
    return !!b && (b === e || "GeneratorFunction" === (b.displayName || b.name))
  }, w.mark = function (a) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(a, f) : (a.__proto__ = f, !(u in a) && (a[u] = "GeneratorFunction")), a.prototype = Object.create(B), a
  }, w.awrap = function (a) {
    return {
      __await: a
    }
  }, g(h.prototype), h.prototype[t] = function () {
    return this
  }, w.AsyncIterator = h, w.async = function (a, c, d, e) {
    var f = new h(b(a, c, d, e));
    return w.isGeneratorFunction(c) ? f : f.next().then(function (a) {
      return a.done ? a.value : f.next()
    })
  }, g(B), B[u] = "Generator", B[s] = function () {
    return this
  }, B.toString = function () {
    return "[object Generator]"
  }, w.keys = function (a) {
    var b = [];
    for (var c in a) b.push(c);
    return b.reverse(),
      function c() {
        for (; b.length;) {
          var d = b.pop();
          if (d in a) return c.value = d, c.done = !1, c
        }
        return c.done = !0, c
      }
  }, w.values = n, m.prototype = {
    constructor: m,
    reset: function (a) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(l), !a)
        for (var b in this) "t" === b.charAt(0) && q.call(this, b) && !isNaN(+b.slice(1)) && (this[b] = void 0)
    },
    stop: function () {
      this.done = !0;
      var a = this.tryEntries[0],
        b = a.completion;
      if ("throw" === b.type) throw b.arg;
      return this.rval
    },
    dispatchException: function (a) {
      function b(b, d) {
        return f.type = "throw", f.arg = a, c.next = b, d && (c.method = "next", c.arg = void 0), !!d
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
            if (this.prev < e.finallyLoc) return b(e.finallyLoc)
          } else if (g) {
            if (this.prev < e.catchLoc) return b(e.catchLoc, !0);
          } else if (!h) throw new Error("try statement without catch or finally");
          else if (this.prev < e.finallyLoc) return b(e.finallyLoc)
        }
      }
    },
    abrupt: function (a, b) {
      for (var c, d = this.tryEntries.length - 1; 0 <= d; --d)
        if (c = this.tryEntries[d], c.tryLoc <= this.prev && q.call(c, "finallyLoc") && this.prev < c.finallyLoc) {
          var e = c;
          break
        } e && ("break" === a || "continue" === a) && e.tryLoc <= b && b <= e.finallyLoc && (e = null);
      var f = e ? e.completion : {};
      return f.type = a, f.arg = b, e ? (this.method = "next", this.next = e.finallyLoc, x) : this.complete(f)
    },
    complete: function (a, b) {
      if ("throw" === a.type) throw a.arg;
      return "break" === a.type || "continue" === a.type ? this.next = a.arg : "return" === a.type ? (this.rval = this.arg = a.arg, this.method = "return", this.next = "end") : "normal" === a.type && b && (this.next = b), x
    },
    finish: function (a) {
      for (var b, c = this.tryEntries.length - 1; 0 <= c; --c)
        if (b = this.tryEntries[c], b.finallyLoc === a) return this.complete(b.completion, b.afterLoc), l(b), x
    },
    catch: function (a) {
      for (var b, c = this.tryEntries.length - 1; 0 <= c; --c)
        if (b = this.tryEntries[c], b.tryLoc === a) {
          var d = b.completion;
          if ("throw" === d.type) {
            var e = d.arg;
            l(b)
          }
          return e
        } throw new Error("illegal catch attempt")
    },
    delegateYield: function (a, b, c) {
      return this.delegate = {
        iterator: n(a),
        resultName: b,
        nextLoc: c
      }, "next" === this.method && (this.arg = void 0), x
    }
  }
}();

export default a.regeneratorRuntime;