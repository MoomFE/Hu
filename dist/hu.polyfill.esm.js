/*!
 * Hu.js v1.0.0-bata.0
 * https://github.com/MoomFE/Hu
 * 
 * (c) 2018-present Wei Zhang
 * Released under the MIT License.
 */

typeof window !== "undefined" && function () {
  /**
  @license @nocompile
  Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  (function () {
    var r,
        t = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this,
        ba = "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) {
      a != Array.prototype && a != Object.prototype && (a[b] = c.value);
    };

    function ca() {
      ca = function () {};

      t.Symbol || (t.Symbol = da);
    }

    var da = function () {
      var a = 0;
      return function (b) {
        return "jscomp_symbol_" + (b || "") + a++;
      };
    }();

    function ea() {
      ca();
      var a = t.Symbol.iterator;
      a || (a = t.Symbol.iterator = t.Symbol("iterator"));
      "function" != typeof Array.prototype[a] && ba(Array.prototype, a, {
        configurable: !0,
        writable: !0,
        value: function () {
          return fa(this);
        }
      });

      ea = function () {};
    }

    function fa(a) {
      var b = 0;
      return ha(function () {
        return b < a.length ? {
          done: !1,
          value: a[b++]
        } : {
          done: !0
        };
      });
    }

    function ha(a) {
      ea();
      a = {
        next: a
      };

      a[t.Symbol.iterator] = function () {
        return this;
      };

      return a;
    }

    function ia(a) {
      ea();
      var b = a[Symbol.iterator];
      return b ? b.call(a) : fa(a);
    }

    function ja(a) {
      for (var b, c = []; !(b = a.next()).done;) c.push(b.value);

      return c;
    }

    var ka;
    if ("function" == typeof Object.setPrototypeOf) ka = Object.setPrototypeOf;else {
      var la;

      a: {
        var ma = {
          Ga: !0
        },
            na = {};

        try {
          na.__proto__ = ma;
          la = na.Ga;
          break a;
        } catch (a) {}

        la = !1;
      }

      ka = la ? function (a, b) {
        a.__proto__ = b;
        if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
        return a;
      } : null;
    }
    var oa = ka;

    function pa() {
      this.f = !1;
      this.b = null;
      this.ca = void 0;
      this.a = 1;
      this.F = 0;
      this.c = null;
    }

    function qa(a) {
      if (a.f) throw new TypeError("Generator is already running");
      a.f = !0;
    }

    pa.prototype.u = function (a) {
      this.ca = a;
    };

    function ra(a, b) {
      a.c = {
        Ja: b,
        Na: !0
      };
      a.a = a.F;
    }

    pa.prototype.return = function (a) {
      this.c = {
        return: a
      };
      this.a = this.F;
    };

    function sa(a, b) {
      a.a = 3;
      return {
        value: b
      };
    }

    function ta(a) {
      this.a = new pa();
      this.b = a;
    }

    function ua(a, b) {
      qa(a.a);
      var c = a.a.b;
      if (c) return va(a, "return" in c ? c["return"] : function (a) {
        return {
          value: a,
          done: !0
        };
      }, b, a.a.return);
      a.a.return(b);
      return wa(a);
    }

    function va(a, b, c, d) {
      try {
        var e = b.call(a.a.b, c);
        if (!(e instanceof Object)) throw new TypeError("Iterator result " + e + " is not an object");
        if (!e.done) return a.a.f = !1, e;
        var f = e.value;
      } catch (g) {
        return a.a.b = null, ra(a.a, g), wa(a);
      }

      a.a.b = null;
      d.call(a.a, f);
      return wa(a);
    }

    function wa(a) {
      for (; a.a.a;) try {
        var b = a.b(a.a);
        if (b) return a.a.f = !1, {
          value: b.value,
          done: !1
        };
      } catch (c) {
        a.a.ca = void 0, ra(a.a, c);
      }

      a.a.f = !1;

      if (a.a.c) {
        b = a.a.c;
        a.a.c = null;
        if (b.Na) throw b.Ja;
        return {
          value: b.return,
          done: !0
        };
      }

      return {
        value: void 0,
        done: !0
      };
    }

    function xa(a) {
      this.next = function (b) {
        qa(a.a);
        a.a.b ? b = va(a, a.a.b.next, b, a.a.u) : (a.a.u(b), b = wa(a));
        return b;
      };

      this.throw = function (b) {
        qa(a.a);
        a.a.b ? b = va(a, a.a.b["throw"], b, a.a.u) : (ra(a.a, b), b = wa(a));
        return b;
      };

      this.return = function (b) {
        return ua(a, b);
      };

      ea();

      this[Symbol.iterator] = function () {
        return this;
      };
    }

    function Aa(a, b) {
      b = new xa(new ta(b));
      oa && oa(b, a.prototype);
      return b;
    }

    (function () {
      if (!function () {
        var a = document.createEvent("Event");
        a.initEvent("foo", !0, !0);
        a.preventDefault();
        return a.defaultPrevented;
      }()) {
        var a = Event.prototype.preventDefault;

        Event.prototype.preventDefault = function () {
          this.cancelable && (a.call(this), Object.defineProperty(this, "defaultPrevented", {
            get: function () {
              return !0;
            },
            configurable: !0
          }));
        };
      }

      var b = false;
      if (!window.CustomEvent || b && "function" !== typeof window.CustomEvent) window.CustomEvent = function (a, b) {
        b = b || {};
        var c = document.createEvent("CustomEvent");
        c.initCustomEvent(a, !!b.bubbles, !!b.cancelable, b.detail);
        return c;
      }, window.CustomEvent.prototype = window.Event.prototype;

      if (!window.Event || b && "function" !== typeof window.Event) {
        var c = window.Event;

        window.Event = function (a, b) {
          b = b || {};
          var c = document.createEvent("Event");
          c.initEvent(a, !!b.bubbles, !!b.cancelable);
          return c;
        };

        if (c) for (var d in c) window.Event[d] = c[d];
        window.Event.prototype = c.prototype;
      }

      if (!window.MouseEvent || b && "function" !== typeof window.MouseEvent) {
        b = window.MouseEvent;

        window.MouseEvent = function (a, b) {
          b = b || {};
          var c = document.createEvent("MouseEvent");
          c.initMouseEvent(a, !!b.bubbles, !!b.cancelable, b.view || window, b.detail, b.screenX, b.screenY, b.clientX, b.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, b.button, b.relatedTarget);
          return c;
        };

        if (b) for (d in b) window.MouseEvent[d] = b[d];
        window.MouseEvent.prototype = b.prototype;
      }

      Array.from || (Array.from = function (a) {
        return [].slice.call(a);
      });
    })(window.WebComponents);

    (function () {
      function a() {}

      function b(a, b) {
        if (!a.childNodes.length) return [];

        switch (a.nodeType) {
          case Node.DOCUMENT_NODE:
            return Q.call(a, b);

          case Node.DOCUMENT_FRAGMENT_NODE:
            return Ab.call(a, b);

          default:
            return x.call(a, b);
        }
      }

      var d = !(document.createDocumentFragment().cloneNode() instanceof DocumentFragment);

      var f = Node.prototype.cloneNode,
          g = Document.prototype.createElement,
          h = Document.prototype.importNode,
          k = Node.prototype.removeChild,
          m = Node.prototype.appendChild,
          n = Node.prototype.replaceChild,
          p = DOMParser.prototype.parseFromString,
          G = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, "innerHTML") || {
        get: function () {
          return this.innerHTML;
        },
        set: function (a) {
          this.innerHTML = a;
        }
      },
          u = Object.getOwnPropertyDescriptor(window.Node.prototype, "childNodes") || {
        get: function () {
          return this.childNodes;
        }
      },
          x = Element.prototype.querySelectorAll,
          Q = Document.prototype.querySelectorAll,
          Ab = DocumentFragment.prototype.querySelectorAll,
          Bb = function () {
        {
          var a = document.createElement("template"),
              b = document.createElement("template");
          b.content.appendChild(document.createElement("div"));
          a.content.appendChild(b);
          a = a.cloneNode(!0);
          return 0 === a.content.childNodes.length || 0 === a.content.firstChild.content.childNodes.length || d;
        }
      }();

      if (Bb) {
        a.b = function (a, b) {
          var c = f.call(a, !1);
          this.P && this.P(c);
          b && (m.call(c.content, f.call(a.content, !0)), Na(c.content, a.content));
          return c;
        };

        var Na = function (c, d) {
          if (d.querySelectorAll && (d = b(d, "template"), 0 !== d.length)) {
            c = b(c, "template");

            for (var e = 0, f = c.length, g, h; e < f; e++) h = d[e], g = c[e], a && a.P && a.P(h), n.call(g.parentNode, mf.call(h, !0), g);
          }
        },
            mf = Node.prototype.cloneNode = function (b) {
          if (d && this instanceof DocumentFragment) {
            if (b) var c = nf.call(this.ownerDocument, this, !0);else return this.ownerDocument.createDocumentFragment();
          } else this.nodeType === Node.ELEMENT_NODE && "template" === this.localName && this.namespaceURI == document.documentElement.namespaceURI ? c = a.b(this, b) : c = f.call(this, b);

          b && Na(c, this);
          return c;
        },
            nf = Document.prototype.importNode = function (c, d) {
          d = d || !1;
          if ("template" === c.localName) return a.b(c, d);
          var e = h.call(this, c, d);

          if (d) {
            Na(e, c);
            c = b(e, 'script:not([type]),script[type="application/javascript"],script[type="text/javascript"]');

            for (var f, k = 0; k < c.length; k++) {
              f = c[k];
              d = g.call(document, "script");
              d.textContent = f.textContent;

              for (var m = f.attributes, l = 0, p; l < m.length; l++) p = m[l], d.setAttribute(p.name, p.value);

              n.call(f.parentNode, d, f);
            }
          }

          return e;
        };
      }
    })();

    (function (a) {
      var b = a.defineProperty,
          c = a.prototype,
          d = c.toString,
          e;
      "iterator match replace search split hasInstance isConcatSpreadable unscopables species toPrimitive toStringTag".split(" ").forEach(function (f) {
        if (!(f in Symbol)) switch (b(Symbol, f, {
          value: Symbol(f)
        }), f) {
          case "toStringTag":
            e = a.getOwnPropertyDescriptor(c, "toString"), e.value = function () {
              var a = d.call(this),
                  b = this[Symbol.toStringTag];
              return "undefined" === typeof b ? a : "[object " + b + "]";
            }, b(c, "toString", e);
        }
      });
    })(Object, Symbol);

    (function (a, b, c) {
      function d() {
        return this;
      }

      b[a] || (b[a] = function () {
        var b = 0,
            c = this,
            g = {
          next: function () {
            var a = c.length <= b;
            return a ? {
              done: a
            } : {
              done: a,
              value: c[b++]
            };
          }
        };
        g[a] = d;
        return g;
      });
      c[a] || (c[a] = function () {
        var b = String.fromCodePoint,
            c = this,
            g = 0,
            h = c.length,
            k = {
          next: function () {
            var a = h <= g,
                d = a ? "" : b(c.codePointAt(g));
            g += d.length;
            return a ? {
              done: a
            } : {
              done: a,
              value: d
            };
          }
        };
        k[a] = d;
        return k;
      });
    })(Symbol.iterator, Array.prototype, String.prototype);
    /*
    Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
    This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
    The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
    The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
    Code distributed by Google as part of the polymer project is also
    subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
    */


    var Va = Object.prototype.toString;

    Object.prototype.toString = function () {
      return void 0 === this ? "[object Undefined]" : null === this ? "[object Null]" : Va.call(this);
    };

    Object.keys = function (a) {
      return Object.getOwnPropertyNames(a).filter(function (b) {
        return (b = Object.getOwnPropertyDescriptor(a, b)) && b.enumerable;
      });
    };

    var Wa = window.Symbol.iterator;
    String.prototype[Wa] && String.prototype.codePointAt || (String.prototype[Wa] = function Xa() {
      var b,
          c = this;
      return Aa(Xa, function (d) {
        1 == d.a && (b = 0);
        if (3 != d.a) return b < c.length ? d = sa(d, c[b]) : (d.a = 0, d = void 0), d;
        b++;
        d.a = 2;
      });
    });
    Set.prototype[Wa] || (Set.prototype[Wa] = function Ya() {
      var b,
          c = this,
          d;
      return Aa(Ya, function (e) {
        1 == e.a && (b = [], c.forEach(function (c) {
          b.push(c);
        }), d = 0);
        if (3 != e.a) return d < b.length ? e = sa(e, b[d]) : (e.a = 0, e = void 0), e;
        d++;
        e.a = 2;
      });
    });
    Map.prototype[Wa] || (Map.prototype[Wa] = function Za() {
      var b,
          c = this,
          d;
      return Aa(Za, function (e) {
        1 == e.a && (b = [], c.forEach(function (c, d) {
          b.push([d, c]);
        }), d = 0);
        if (3 != e.a) return d < b.length ? e = sa(e, b[d]) : (e.a = 0, e = void 0), e;
        d++;
        e.a = 2;
      });
    });
    /*
    Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
    This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
    The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
    The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
    Code distributed by Google as part of the polymer project is also
    subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
    */

    window.WebComponents = window.WebComponents || {
      flags: {}
    };
    var $a = document.querySelector('script[src*="webcomponents-bundle"]'),
        ab = /wc-(.+)/,
        w = {};

    if (!w.noOpts) {
      location.search.slice(1).split("&").forEach(function (a) {
        a = a.split("=");
        var b;
        a[0] && (b = a[0].match(ab)) && (w[b[1]] = a[1] || !0);
      });
      if ($a) for (var bb = 0, cb = void 0; cb = $a.attributes[bb]; bb++) "src" !== cb.name && (w[cb.name] = cb.value || !0);

      if (w.log && w.log.split) {
        var db = w.log.split(",");
        w.log = {};
        db.forEach(function (a) {
          w.log[a] = !0;
        });
      } else w.log = {};
    }

    window.WebComponents.flags = w;
    var eb = w.shadydom;
    eb && (window.ShadyDOM = window.ShadyDOM || {}, window.ShadyDOM.force = eb);
    var fb = w.register || w.ce;
    fb && window.customElements && (window.customElements.forcePolyfill = fb);
    /*
    Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
    This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
    The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
    The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
    Code distributed by Google as part of the polymer project is also
    subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
    */

    function gb() {
      this.va = this.root = null;
      this.ba = !1;
      this.N = this.Z = this.ka = this.assignedSlot = this.assignedNodes = this.R = null;
      this.childNodes = this.nextSibling = this.previousSibling = this.lastChild = this.firstChild = this.parentNode = this.U = void 0;
      this.qa = this.ra = !1;
      this.Y = {};
    }

    gb.prototype.toJSON = function () {
      return {};
    };

    function z(a) {
      a.__shady || (a.__shady = new gb());
      return a.__shady;
    }

    function A(a) {
      return a && a.__shady;
    }

    var B = window.ShadyDOM || {};
    B.La = !(!Element.prototype.attachShadow || !Node.prototype.getRootNode);
    var hb = Object.getOwnPropertyDescriptor(Node.prototype, "firstChild");
    B.D = !!(hb && hb.configurable && hb.get);
    B.ma = B.force || !B.La;
    B.T = B.noPatch || !1;
    B.ua = B.preferPerformance;

    function ib(a) {
      return (a = A(a)) && void 0 !== a.firstChild;
    }

    function C(a) {
      return "ShadyRoot" === a.Da;
    }

    function jb(a) {
      return (a = (a = A(a)) && a.root) && kb(a);
    }

    var lb = Element.prototype,
        mb = lb.matches || lb.matchesSelector || lb.mozMatchesSelector || lb.msMatchesSelector || lb.oMatchesSelector || lb.webkitMatchesSelector,
        nb = document.createTextNode(""),
        ob = 0,
        pb = [];
    new MutationObserver(function () {
      for (; pb.length;) try {
        pb.shift()();
      } catch (a) {
        throw nb.textContent = ob++, a;
      }
    }).observe(nb, {
      characterData: !0
    });

    function qb(a) {
      pb.push(a);
      nb.textContent = ob++;
    }

    var rb = !!document.contains;

    function sb(a, b) {
      for (; b;) {
        if (b == a) return !0;
        b = b.__shady_parentNode;
      }

      return !1;
    }

    function tb(a) {
      for (var b = a.length - 1; 0 <= b; b--) {
        var c = a[b],
            d = c.getAttribute("id") || c.getAttribute("name");
        d && "length" !== d && isNaN(d) && (a[d] = c);
      }

      a.item = function (b) {
        return a[b];
      };

      a.namedItem = function (b) {
        if ("length" !== b && isNaN(b) && a[b]) return a[b];

        for (var c = ia(a), d = c.next(); !d.done; d = c.next()) if (d = d.value, (d.getAttribute("id") || d.getAttribute("name")) == b) return d;

        return null;
      };

      return a;
    }

    function D(a, b, c, d) {
      c = void 0 === c ? "" : c;

      for (var e in b) {
        var f = b[e];

        if (!(d && 0 <= d.indexOf(e))) {
          f.configurable = !0;
          var g = c + e;
          if (f.value) a[g] = f.value;else try {
            Object.defineProperty(a, g, f);
          } catch (h) {}
        }
      }
    }

    function E(a) {
      var b = {};
      Object.getOwnPropertyNames(a).forEach(function (c) {
        b[c] = Object.getOwnPropertyDescriptor(a, c);
      });
      return b;
    }

    var ub = [],
        vb;

    function wb(a) {
      vb || (vb = !0, qb(xb));
      ub.push(a);
    }

    function xb() {
      vb = !1;

      for (var a = !!ub.length; ub.length;) ub.shift()();

      return a;
    }

    xb.list = ub;

    function yb() {
      this.a = !1;
      this.addedNodes = [];
      this.removedNodes = [];
      this.aa = new Set();
    }

    function zb(a) {
      a.a || (a.a = !0, qb(function () {
        a.flush();
      }));
    }

    yb.prototype.flush = function () {
      if (this.a) {
        this.a = !1;
        var a = this.takeRecords();
        a.length && this.aa.forEach(function (b) {
          b(a);
        });
      }
    };

    yb.prototype.takeRecords = function () {
      if (this.addedNodes.length || this.removedNodes.length) {
        var a = [{
          addedNodes: this.addedNodes,
          removedNodes: this.removedNodes
        }];
        this.addedNodes = [];
        this.removedNodes = [];
        return a;
      }

      return [];
    };

    function Db(a, b) {
      var c = z(a);
      c.R || (c.R = new yb());
      c.R.aa.add(b);
      var d = c.R;
      return {
        Ca: b,
        O: d,
        Ea: a,
        takeRecords: function () {
          return d.takeRecords();
        }
      };
    }

    function Eb(a) {
      var b = a && a.O;
      b && (b.aa.delete(a.Ca), b.aa.size || (z(a.Ea).R = null));
    }

    function Fb(a, b) {
      var c = b.getRootNode();
      return a.map(function (a) {
        var b = c === a.target.getRootNode();

        if (b && a.addedNodes) {
          if (b = Array.from(a.addedNodes).filter(function (a) {
            return c === a.getRootNode();
          }), b.length) return a = Object.create(a), Object.defineProperty(a, "addedNodes", {
            value: b,
            configurable: !0
          }), a;
        } else if (b) return a;
      }).filter(function (a) {
        return a;
      });
    }

    var Gb = /[&\u00A0"]/g,
        Hb = /[&\u00A0<>]/g;

    function Ib(a) {
      switch (a) {
        case "&":
          return "&amp;";

        case "<":
          return "&lt;";

        case ">":
          return "&gt;";

        case '"':
          return "&quot;";

        case "\u00a0":
          return "&nbsp;";
      }
    }

    function Jb(a) {
      for (var b = {}, c = 0; c < a.length; c++) b[a[c]] = !0;

      return b;
    }

    var Kb = Jb("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),
        Lb = Jb("style script xmp iframe noembed noframes plaintext noscript".split(" "));

    function Mb(a, b) {
      "template" === a.localName && (a = a.content);

      for (var c = "", d = b ? b(a) : a.childNodes, e = 0, f = d.length, g = void 0; e < f && (g = d[e]); e++) {
        a: {
          var h = g;
          var k = a,
              m = b;

          switch (h.nodeType) {
            case Node.ELEMENT_NODE:
              k = h.localName;

              for (var n = "<" + k, p = h.attributes, G = 0, u; u = p[G]; G++) n += " " + u.name + '="' + u.value.replace(Gb, Ib) + '"';

              n += ">";
              h = Kb[k] ? n : n + Mb(h, m) + "</" + k + ">";
              break a;

            case Node.TEXT_NODE:
              h = h.data;
              h = k && Lb[k.localName] ? h : h.replace(Hb, Ib);
              break a;

            case Node.COMMENT_NODE:
              h = "\x3c!--" + h.data + "--\x3e";
              break a;

            default:
              throw window.console.error(h), Error("not implemented");
          }
        }

        c += h;
      }

      return c;
    }

    var Nb = B.D,
        Ob = {
      querySelector: function (a) {
        return this.__shady_native_querySelector(a);
      },
      querySelectorAll: function (a) {
        return this.__shady_native_querySelectorAll(a);
      }
    },
        Pb = {};

    function Qb(a) {
      Pb[a] = function (b) {
        return b["__shady_native_" + a];
      };
    }

    function Rb(a, b) {
      D(a, b, "__shady_native_");

      for (var c in b) Qb(c);
    }

    function F(a, b) {
      b = void 0 === b ? [] : b;

      for (var c = 0; c < b.length; c++) {
        var d = b[c],
            e = Object.getOwnPropertyDescriptor(a, d);
        e && (Object.defineProperty(a, "__shady_native_" + d, e), e.value ? Ob[d] || (Ob[d] = e.value) : Qb(d));
      }
    }

    var H = document.createTreeWalker(document, NodeFilter.SHOW_ALL, null, !1),
        I = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, null, !1),
        Sb = document.implementation.createHTMLDocument("inert");

    function Tb(a) {
      for (var b; b = a.__shady_native_firstChild;) a.__shady_native_removeChild(b);
    }

    var Ub = ["firstElementChild", "lastElementChild", "children", "childElementCount"],
        Vb = ["querySelector", "querySelectorAll"];

    function Wb() {
      var a = ["dispatchEvent", "addEventListener", "removeEventListener"];
      window.EventTarget ? F(window.EventTarget.prototype, a) : (F(Node.prototype, a), F(Window.prototype, a));
      Nb ? F(Node.prototype, "parentNode firstChild lastChild previousSibling nextSibling childNodes parentElement textContent".split(" ")) : Rb(Node.prototype, {
        parentNode: {
          get: function () {
            H.currentNode = this;
            return H.parentNode();
          }
        },
        firstChild: {
          get: function () {
            H.currentNode = this;
            return H.firstChild();
          }
        },
        lastChild: {
          get: function () {
            H.currentNode = this;
            return H.lastChild();
          }
        },
        previousSibling: {
          get: function () {
            H.currentNode = this;
            return H.previousSibling();
          }
        },
        nextSibling: {
          get: function () {
            H.currentNode = this;
            return H.nextSibling();
          }
        },
        childNodes: {
          get: function () {
            var a = [];
            H.currentNode = this;

            for (var c = H.firstChild(); c;) a.push(c), c = H.nextSibling();

            return a;
          }
        },
        parentElement: {
          get: function () {
            I.currentNode = this;
            return I.parentNode();
          }
        },
        textContent: {
          get: function () {
            switch (this.nodeType) {
              case Node.ELEMENT_NODE:
              case Node.DOCUMENT_FRAGMENT_NODE:
                for (var a = document.createTreeWalker(this, NodeFilter.SHOW_TEXT, null, !1), c = "", d; d = a.nextNode();) c += d.nodeValue;

                return c;

              default:
                return this.nodeValue;
            }
          },
          set: function (a) {
            if ("undefined" === typeof a || null === a) a = "";

            switch (this.nodeType) {
              case Node.ELEMENT_NODE:
              case Node.DOCUMENT_FRAGMENT_NODE:
                Tb(this);
                (0 < a.length || this.nodeType === Node.ELEMENT_NODE) && this.__shady_native_insertBefore(document.createTextNode(a), void 0);
                break;

              default:
                this.nodeValue = a;
            }
          }
        }
      });
      F(Node.prototype, "appendChild insertBefore removeChild replaceChild cloneNode contains".split(" "));
      a = {
        firstElementChild: {
          get: function () {
            I.currentNode = this;
            return I.firstChild();
          }
        },
        lastElementChild: {
          get: function () {
            I.currentNode = this;
            return I.lastChild();
          }
        },
        children: {
          get: function () {
            var a = [];
            I.currentNode = this;

            for (var c = I.firstChild(); c;) a.push(c), c = I.nextSibling();

            return tb(a);
          }
        },
        childElementCount: {
          get: function () {
            return this.children ? this.children.length : 0;
          }
        }
      };
      Nb ? (F(Element.prototype, Ub), F(Element.prototype, ["previousElementSibling", "nextElementSibling", "innerHTML"]), Object.getOwnPropertyDescriptor(HTMLElement.prototype, "children") && F(HTMLElement.prototype, ["children"]), Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerHTML") && F(HTMLElement.prototype, ["innerHTML"])) : (Rb(Element.prototype, a), Rb(Element.prototype, {
        previousElementSibling: {
          get: function () {
            I.currentNode = this;
            return I.previousSibling();
          }
        },
        nextElementSibling: {
          get: function () {
            I.currentNode = this;
            return I.nextSibling();
          }
        },
        innerHTML: {
          get: function () {
            return Mb(this, function (a) {
              return a.__shady_native_childNodes;
            });
          },
          set: function (a) {
            var b = "template" === this.localName ? this.content : this;
            Tb(b);
            var d = this.localName || "div";
            d = this.namespaceURI && this.namespaceURI !== Sb.namespaceURI ? Sb.createElementNS(this.namespaceURI, d) : Sb.createElement(d);
            d.innerHTML = a;

            for (a = "template" === this.localName ? d.content : d; d = a.__shady_native_firstChild;) b.__shady_native_insertBefore(d, void 0);
          }
        }
      }));
      F(Element.prototype, "setAttribute getAttribute hasAttribute removeAttribute focus blur".split(" "));
      F(Element.prototype, Vb);
      F(HTMLElement.prototype, ["focus", "blur", "contains"]);
      Nb && F(HTMLElement.prototype, ["parentElement", "children", "innerHTML"]);
      window.HTMLTemplateElement && F(window.HTMLTemplateElement.prototype, ["innerHTML"]);
      Nb ? F(DocumentFragment.prototype, Ub) : Rb(DocumentFragment.prototype, a);
      F(DocumentFragment.prototype, Vb);
      Nb ? (F(Document.prototype, Ub), F(Document.prototype, ["activeElement"])) : Rb(Document.prototype, a);
      F(Document.prototype, ["importNode", "getElementById"]);
      F(Document.prototype, Vb);
    }

    var Xb = E({
      get childNodes() {
        return this.__shady_childNodes;
      },

      get firstChild() {
        return this.__shady_firstChild;
      },

      get lastChild() {
        return this.__shady_lastChild;
      },

      get textContent() {
        return this.__shady_textContent;
      },

      set textContent(a) {
        this.__shady_textContent = a;
      },

      get childElementCount() {
        return this.__shady_childElementCount;
      },

      get children() {
        return this.__shady_children;
      },

      get firstElementChild() {
        return this.__shady_firstElementChild;
      },

      get lastElementChild() {
        return this.__shady_lastElementChild;
      },

      get innerHTML() {
        return this.__shady_innerHTML;
      },

      set innerHTML(a) {
        return this.__shady_innerHTML = a;
      },

      get shadowRoot() {
        return this.__shady_shadowRoot;
      }

    }),
        Yb = E({
      get parentElement() {
        return this.__shady_parentElement;
      },

      get parentNode() {
        return this.__shady_parentNode;
      },

      get nextSibling() {
        return this.__shady_nextSibling;
      },

      get previousSibling() {
        return this.__shady_previousSibling;
      },

      get nextElementSibling() {
        return this.__shady_nextElementSibling;
      },

      get previousElementSibling() {
        return this.__shady_previousElementSibling;
      },

      get className() {
        return this.__shady_className;
      },

      set className(a) {
        return this.__shady_className = a;
      }

    }),
        Zb;

    for (Zb in Xb) Xb[Zb].enumerable = !1;

    for (var $b in Yb) Yb[$b].enumerable = !1;

    var ac = B.D || B.T,
        bc = ac ? function () {} : function (a) {
      var b = z(a);
      b.ra || (b.ra = !0, D(a, Yb));
    },
        cc = ac ? function () {} : function (a) {
      var b = z(a);
      b.qa || (b.qa = !0, D(a, Xb));
    };

    var dc = "__eventWrappers" + Date.now(),
        ec = function () {
      var a = Object.getOwnPropertyDescriptor(Event.prototype, "composed");
      return a ? function (b) {
        return a.get.call(b);
      } : null;
    }(),
        fc = {
      blur: !0,
      focus: !0,
      focusin: !0,
      focusout: !0,
      click: !0,
      dblclick: !0,
      mousedown: !0,
      mouseenter: !0,
      mouseleave: !0,
      mousemove: !0,
      mouseout: !0,
      mouseover: !0,
      mouseup: !0,
      wheel: !0,
      beforeinput: !0,
      input: !0,
      keydown: !0,
      keyup: !0,
      compositionstart: !0,
      compositionupdate: !0,
      compositionend: !0,
      touchstart: !0,
      touchend: !0,
      touchmove: !0,
      touchcancel: !0,
      pointerover: !0,
      pointerenter: !0,
      pointerdown: !0,
      pointermove: !0,
      pointerup: !0,
      pointercancel: !0,
      pointerout: !0,
      pointerleave: !0,
      gotpointercapture: !0,
      lostpointercapture: !0,
      dragstart: !0,
      drag: !0,
      dragenter: !0,
      dragleave: !0,
      dragover: !0,
      drop: !0,
      dragend: !0,
      DOMActivate: !0,
      DOMFocusIn: !0,
      DOMFocusOut: !0,
      keypress: !0
    },
        gc = {
      DOMAttrModified: !0,
      DOMAttributeNameChanged: !0,
      DOMCharacterDataModified: !0,
      DOMElementNameChanged: !0,
      DOMNodeInserted: !0,
      DOMNodeInsertedIntoDocument: !0,
      DOMNodeRemoved: !0,
      DOMNodeRemovedFromDocument: !0,
      DOMSubtreeModified: !0
    };

    function hc(a) {
      return a instanceof Node ? a.__shady_getRootNode() : a;
    }

    function ic(a, b) {
      var c = [],
          d = a;

      for (a = hc(a); d;) c.push(d), d.__shady_assignedSlot ? d = d.__shady_assignedSlot : d.nodeType === Node.DOCUMENT_FRAGMENT_NODE && d.host && (b || d !== a) ? d = d.host : d = d.__shady_parentNode;

      c[c.length - 1] === document && c.push(window);
      return c;
    }

    function jc(a) {
      a.__composedPath || (a.__composedPath = ic(a.target, !0));
      return a.__composedPath;
    }

    function kc(a, b) {
      if (!C) return a;
      a = ic(a, !0);

      for (var c = 0, d, e = void 0, f, g = void 0; c < b.length; c++) if (d = b[c], f = hc(d), f !== e && (g = a.indexOf(f), e = f), !C(f) || -1 < g) return d;
    }

    function lc(a) {
      function b(b, d) {
        b = new a(b, d);
        b.__composed = d && !!d.composed;
        return b;
      }

      b.__proto__ = a;
      b.prototype = a.prototype;
      return b;
    }

    var mc = {
      focus: !0,
      blur: !0
    };

    function nc(a) {
      return a.__target !== a.target || a.__relatedTarget !== a.relatedTarget;
    }

    function oc(a, b, c) {
      if (c = b.__handlers && b.__handlers[a.type] && b.__handlers[a.type][c]) for (var d = 0, e; (e = c[d]) && (!nc(a) || a.target !== a.relatedTarget) && (e.call(b, a), !a.__immediatePropagationStopped); d++);
    }

    function pc(a) {
      var b = a.composedPath();
      Object.defineProperty(a, "currentTarget", {
        get: function () {
          return d;
        },
        configurable: !0
      });

      for (var c = b.length - 1; 0 <= c; c--) {
        var d = b[c];
        oc(a, d, "capture");
        if (a.ha) return;
      }

      Object.defineProperty(a, "eventPhase", {
        get: function () {
          return Event.AT_TARGET;
        }
      });
      var e;

      for (c = 0; c < b.length; c++) {
        d = b[c];
        var f = A(d);
        f = f && f.root;
        if (0 === c || f && f === e) if (oc(a, d, "bubble"), d !== window && (e = d.__shady_getRootNode()), a.ha) break;
      }
    }

    function qc(a, b, c, d, e, f) {
      for (var g = 0; g < a.length; g++) {
        var h = a[g],
            k = h.type,
            m = h.capture,
            n = h.once,
            p = h.passive;
        if (b === h.node && c === k && d === m && e === n && f === p) return g;
      }

      return -1;
    }

    function rc(a, b, c) {
      if (b) {
        var d = typeof b;
        if ("function" === d || "object" === d) if ("object" !== d || b.handleEvent && "function" === typeof b.handleEvent) {
          if (gc[a]) return this.__shady_native_addEventListener(a, b, c);

          if (c && "object" === typeof c) {
            var e = !!c.capture;
            var f = !!c.once;
            var g = !!c.passive;
          } else e = !!c, g = f = !1;

          var h = c && c.ia || this,
              k = b[dc];

          if (k) {
            if (-1 < qc(k, h, a, e, f, g)) return;
          } else b[dc] = [];

          k = function (e) {
            f && this.__shady_removeEventListener(a, b, c);
            e.__target || sc(e);

            if (h !== this) {
              var g = Object.getOwnPropertyDescriptor(e, "currentTarget");
              Object.defineProperty(e, "currentTarget", {
                get: function () {
                  return h;
                },
                configurable: !0
              });
            }

            e.__previousCurrentTarget = e.currentTarget;
            if (!C(h) || -1 != e.composedPath().indexOf(h)) if (e.composed || -1 < e.composedPath().indexOf(h)) if (nc(e) && e.target === e.relatedTarget) e.eventPhase === Event.BUBBLING_PHASE && e.stopImmediatePropagation();else if (e.eventPhase === Event.CAPTURING_PHASE || e.bubbles || e.target === h || h instanceof Window) {
              var k = "function" === d ? b.call(h, e) : b.handleEvent && b.handleEvent(e);
              h !== this && (g ? (Object.defineProperty(e, "currentTarget", g), g = null) : delete e.currentTarget);
              return k;
            }
          };

          b[dc].push({
            node: h,
            type: a,
            capture: e,
            once: f,
            passive: g,
            $a: k
          });
          mc[a] ? (this.__handlers = this.__handlers || {}, this.__handlers[a] = this.__handlers[a] || {
            capture: [],
            bubble: []
          }, this.__handlers[a][e ? "capture" : "bubble"].push(k)) : this.__shady_native_addEventListener(a, k, c);
        }
      }
    }

    function tc(a, b, c) {
      if (b) {
        if (gc[a]) return this.__shady_native_removeEventListener(a, b, c);

        if (c && "object" === typeof c) {
          var d = !!c.capture;
          var e = !!c.once;
          var f = !!c.passive;
        } else d = !!c, f = e = !1;

        var g = c && c.ia || this,
            h = void 0;
        var k = null;

        try {
          k = b[dc];
        } catch (m) {}

        k && (e = qc(k, g, a, d, e, f), -1 < e && (h = k.splice(e, 1)[0].$a, k.length || (b[dc] = void 0)));

        this.__shady_native_removeEventListener(a, h || b, c);

        h && mc[a] && this.__handlers && this.__handlers[a] && (a = this.__handlers[a][d ? "capture" : "bubble"], h = a.indexOf(h), -1 < h && a.splice(h, 1));
      }
    }

    function uc() {
      for (var a in mc) window.__shady_native_addEventListener(a, function (a) {
        a.__target || (sc(a), pc(a));
      }, !0);
    }

    var vc = E({
      get composed() {
        void 0 === this.__composed && (ec ? this.__composed = "focusin" === this.type || "focusout" === this.type || ec(this) : !1 !== this.isTrusted && (this.__composed = fc[this.type]));
        return this.__composed || !1;
      },

      composedPath: function () {
        this.__composedPath || (this.__composedPath = ic(this.__target, this.composed));
        return this.__composedPath;
      },

      get target() {
        return kc(this.currentTarget || this.__previousCurrentTarget, this.composedPath());
      },

      get relatedTarget() {
        if (!this.__relatedTarget) return null;
        this.__relatedTargetComposedPath || (this.__relatedTargetComposedPath = ic(this.__relatedTarget, !0));
        return kc(this.currentTarget || this.__previousCurrentTarget, this.__relatedTargetComposedPath);
      },

      stopPropagation: function () {
        Event.prototype.stopPropagation.call(this);
        this.ha = !0;
      },
      stopImmediatePropagation: function () {
        Event.prototype.stopImmediatePropagation.call(this);
        this.ha = this.__immediatePropagationStopped = !0;
      }
    });

    function sc(a) {
      a.__target = a.target;
      a.__relatedTarget = a.relatedTarget;

      if (B.D) {
        var b = Object.getPrototypeOf(a);

        if (!Object.hasOwnProperty(b, "__shady_patchedProto")) {
          var c = Object.create(b);
          c.__shady_sourceProto = b;
          D(c, vc);
          b.__shady_patchedProto = c;
        }

        a.__proto__ = b.__shady_patchedProto;
      } else D(a, vc);
    }

    var wc = lc(Event),
        xc = lc(CustomEvent),
        yc = lc(MouseEvent);

    function zc() {
      if (!ec && Object.getOwnPropertyDescriptor(Event.prototype, "isTrusted")) {
        var a = function () {
          var a = new MouseEvent("click", {
            bubbles: !0,
            cancelable: !0,
            composed: !0
          });

          this.__shady_dispatchEvent(a);
        };

        Element.prototype.click ? Element.prototype.click = a : HTMLElement.prototype.click && (HTMLElement.prototype.click = a);
      }
    }

    var Ac = Object.getOwnPropertyNames(Document.prototype).filter(function (a) {
      return "on" === a.substring(0, 2);
    });

    function Bc(a, b) {
      return {
        index: a,
        V: [],
        $: b
      };
    }

    function Cc(a, b, c, d) {
      var e = 0,
          f = 0,
          g = 0,
          h = 0,
          k = Math.min(b - e, d - f);
      if (0 == e && 0 == f) a: {
        for (g = 0; g < k; g++) if (a[g] !== c[g]) break a;

        g = k;
      }

      if (b == a.length && d == c.length) {
        h = a.length;

        for (var m = c.length, n = 0; n < k - g && Dc(a[--h], c[--m]);) n++;

        h = n;
      }

      e += g;
      f += g;
      b -= h;
      d -= h;
      if (0 == b - e && 0 == d - f) return [];

      if (e == b) {
        for (b = Bc(e, 0); f < d;) b.V.push(c[f++]);

        return [b];
      }

      if (f == d) return [Bc(e, b - e)];
      k = e;
      g = f;
      d = d - g + 1;
      h = b - k + 1;
      b = Array(d);

      for (m = 0; m < d; m++) b[m] = Array(h), b[m][0] = m;

      for (m = 0; m < h; m++) b[0][m] = m;

      for (m = 1; m < d; m++) for (n = 1; n < h; n++) if (a[k + n - 1] === c[g + m - 1]) b[m][n] = b[m - 1][n - 1];else {
        var p = b[m - 1][n] + 1,
            G = b[m][n - 1] + 1;
        b[m][n] = p < G ? p : G;
      }

      k = b.length - 1;
      g = b[0].length - 1;
      d = b[k][g];

      for (a = []; 0 < k || 0 < g;) 0 == k ? (a.push(2), g--) : 0 == g ? (a.push(3), k--) : (h = b[k - 1][g - 1], m = b[k - 1][g], n = b[k][g - 1], p = m < n ? m < h ? m : h : n < h ? n : h, p == h ? (h == d ? a.push(0) : (a.push(1), d = h), k--, g--) : p == m ? (a.push(3), k--, d = m) : (a.push(2), g--, d = n));

      a.reverse();
      b = void 0;
      k = [];

      for (g = 0; g < a.length; g++) switch (a[g]) {
        case 0:
          b && (k.push(b), b = void 0);
          e++;
          f++;
          break;

        case 1:
          b || (b = Bc(e, 0));
          b.$++;
          e++;
          b.V.push(c[f]);
          f++;
          break;

        case 2:
          b || (b = Bc(e, 0));
          b.$++;
          e++;
          break;

        case 3:
          b || (b = Bc(e, 0)), b.V.push(c[f]), f++;
      }

      b && k.push(b);
      return k;
    }

    function Dc(a, b) {
      return a === b;
    }

    function Ec(a, b, c) {
      bc(a);
      c = c || null;
      var d = z(a),
          e = z(b),
          f = c ? z(c) : null;
      d.previousSibling = c ? f.previousSibling : b.__shady_lastChild;
      if (f = A(d.previousSibling)) f.nextSibling = a;
      if (f = A(d.nextSibling = c)) f.previousSibling = a;
      d.parentNode = b;
      c ? c === e.firstChild && (e.firstChild = a) : (e.lastChild = a, e.firstChild || (e.firstChild = a));
      e.childNodes = null;
    }

    function Fc(a, b, c) {
      cc(b);
      var d = z(b);
      void 0 !== d.firstChild && (d.childNodes = null);

      if (a.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        d = a.__shady_childNodes;

        for (var e = 0; e < d.length; e++) Ec(d[e], b, c);

        a = z(a);
        b = void 0 !== a.firstChild ? null : void 0;
        a.firstChild = a.lastChild = b;
        a.childNodes = b;
      } else Ec(a, b, c);
    }

    function Gc(a, b) {
      var c = z(a);
      b = z(b);
      a === b.firstChild && (b.firstChild = c.nextSibling);
      a === b.lastChild && (b.lastChild = c.previousSibling);
      a = c.previousSibling;
      var d = c.nextSibling;
      a && (z(a).nextSibling = d);
      d && (z(d).previousSibling = a);
      c.parentNode = c.previousSibling = c.nextSibling = void 0;
      void 0 !== b.childNodes && (b.childNodes = null);
    }

    function Hc(a) {
      var b = z(a);

      if (void 0 === b.firstChild) {
        b.childNodes = null;
        var c = b.firstChild = a.__shady_native_firstChild || null;
        b.lastChild = a.__shady_native_lastChild || null;
        cc(a);
        b = c;

        for (c = void 0; b; b = b.__shady_native_nextSibling) {
          var d = z(b);
          d.parentNode = a;
          d.nextSibling = b.__shady_native_nextSibling || null;
          d.previousSibling = c || null;
          c = b;
          bc(b);
        }
      }
    }

    var Ic = null;

    function Jc() {
      Ic || (Ic = window.ShadyCSS && window.ShadyCSS.ScopingShim);
      return Ic || null;
    }

    function Kc(a, b) {
      var c = Jc();
      c && c.unscopeNode(a, b);
    }

    function Lc(a, b) {
      var c = Jc();
      if (!c) return !0;

      if (a.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        c = !0;
        a = a.__shady_childNodes;

        for (var d = 0; c && d < a.length; d++) c = c && Lc(a[d], b);

        return c;
      }

      return a.nodeType !== Node.ELEMENT_NODE ? !0 : c.currentScopeForNode(a) === b;
    }

    function Mc(a) {
      if (a.nodeType !== Node.ELEMENT_NODE) return "";
      var b = Jc();
      return b ? b.currentScopeForNode(a) : "";
    }

    function Nc(a, b) {
      if (a) {
        a.nodeType === Node.ELEMENT_NODE && b(a);
        a = a.__shady_childNodes;

        for (var c = 0, d; c < a.length; c++) d = a[c], d.nodeType === Node.ELEMENT_NODE && Nc(d, b);
      }
    }

    var Oc = window.document,
        Pc = B.ua,
        Qc = Object.getOwnPropertyDescriptor(Node.prototype, "isConnected"),
        Rc = Qc && Qc.get;

    function Sc(a) {
      for (var b; b = a.__shady_firstChild;) a.__shady_removeChild(b);
    }

    function Tc(a) {
      var b = A(a);

      if (b && void 0 !== b.U) {
        b = a.__shady_childNodes;

        for (var c = 0, d = b.length, e = void 0; c < d && (e = b[c]); c++) Tc(e);
      }

      if (a = A(a)) a.U = void 0;
    }

    function Uc(a) {
      var b = a;
      a && "slot" === a.localName && (b = (b = (b = A(a)) && b.N) && b.length ? b[0] : Uc(a.__shady_nextSibling));
      return b;
    }

    function Vc(a, b, c) {
      if (a = (a = A(a)) && a.R) b && a.addedNodes.push(b), c && a.removedNodes.push(c), zb(a);
    }

    var Zc = E({
      get parentNode() {
        var a = A(this);
        a = a && a.parentNode;
        return void 0 !== a ? a : this.__shady_native_parentNode;
      },

      get firstChild() {
        var a = A(this);
        a = a && a.firstChild;
        return void 0 !== a ? a : this.__shady_native_firstChild;
      },

      get lastChild() {
        var a = A(this);
        a = a && a.lastChild;
        return void 0 !== a ? a : this.__shady_native_lastChild;
      },

      get nextSibling() {
        var a = A(this);
        a = a && a.nextSibling;
        return void 0 !== a ? a : this.__shady_native_nextSibling;
      },

      get previousSibling() {
        var a = A(this);
        a = a && a.previousSibling;
        return void 0 !== a ? a : this.__shady_native_previousSibling;
      },

      get childNodes() {
        if (ib(this)) {
          var a = A(this);

          if (!a.childNodes) {
            a.childNodes = [];

            for (var b = this.__shady_firstChild; b; b = b.__shady_nextSibling) a.childNodes.push(b);
          }

          var c = a.childNodes;
        } else c = this.__shady_native_childNodes;

        c.item = function (a) {
          return c[a];
        };

        return c;
      },

      get parentElement() {
        var a = A(this);
        (a = a && a.parentNode) && a.nodeType !== Node.ELEMENT_NODE && (a = null);
        return void 0 !== a ? a : this.__shady_native_parentElement;
      },

      get isConnected() {
        if (Rc && Rc.call(this)) return !0;
        if (this.nodeType == Node.DOCUMENT_FRAGMENT_NODE) return !1;
        var a = this.ownerDocument;

        if (rb) {
          if (a.__shady_native_contains(this)) return !0;
        } else if (a.documentElement && a.documentElement.__shady_native_contains(this)) return !0;

        for (a = this; a && !(a instanceof Document);) a = a.__shady_parentNode || (C(a) ? a.host : void 0);

        return !!(a && a instanceof Document);
      },

      get textContent() {
        if (ib(this)) {
          for (var a = [], b = 0, c = this.__shady_childNodes, d; d = c[b]; b++) d.nodeType !== Node.COMMENT_NODE && a.push(d.__shady_textContent);

          return a.join("");
        }

        return this.__shady_native_textContent;
      },

      set textContent(a) {
        if ("undefined" === typeof a || null === a) a = "";

        switch (this.nodeType) {
          case Node.ELEMENT_NODE:
          case Node.DOCUMENT_FRAGMENT_NODE:
            if (!ib(this) && B.D) {
              var b = this.__shady_firstChild;
              (b != this.__shady_lastChild || b && b.nodeType != Node.TEXT_NODE) && Sc(this);
              this.__shady_native_textContent = a;
            } else Sc(this), (0 < a.length || this.nodeType === Node.ELEMENT_NODE) && this.__shady_insertBefore(document.createTextNode(a));

            break;

          default:
            this.nodeValue = a;
        }
      },

      insertBefore: function (a, b) {
        if (this.ownerDocument !== Oc && a.ownerDocument !== Oc) return this.__shady_native_insertBefore(a, b), a;
        if (a === this) throw Error("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");

        if (b) {
          var c = A(b);
          c = c && c.parentNode;
          if (void 0 !== c && c !== this || void 0 === c && b.__shady_native_parentNode !== this) throw Error("Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.");
        }

        if (b === a) return a;
        var d = [],
            e = (c = Wc(this)) ? c.host.localName : Mc(this),
            f = a.__shady_parentNode;

        if (f) {
          var g = Mc(a);

          f.__shady_removeChild(a, !!c || !Wc(a));
        }

        f = !0;
        var h = (!Pc || void 0 === a.__noInsertionPoint) && !Lc(a, e),
            k = c && !a.__noInsertionPoint && (!Pc || a.nodeType === Node.DOCUMENT_FRAGMENT_NODE);
        if (k || h) h && (g = g || Mc(a)), Nc(a, function (a) {
          k && "slot" === a.localName && d.push(a);

          if (h) {
            var b = g;
            Jc() && (b && Kc(a, b), (b = Jc()) && b.scopeNode(a, e));
          }
        });
        if ("slot" === this.localName || d.length) d.length && (c.c = c.c || [], c.a = c.a || [], c.b = c.b || {}, c.c.push.apply(c.c, d instanceof Array ? d : ja(ia(d)))), c && Xc(c);
        ib(this) && (Fc(a, this, b), c = A(this), jb(this) ? (Xc(c.root), f = !1) : c.root && (f = !1));
        f ? (c = C(this) ? this.host : this, b ? (b = Uc(b), c.__shady_native_insertBefore(a, b)) : c.__shady_native_appendChild(a)) : a.ownerDocument !== this.ownerDocument && this.ownerDocument.adoptNode(a);
        Vc(this, a);
        return a;
      },
      appendChild: function (a) {
        return this.__shady_insertBefore(a);
      },
      removeChild: function (a, b) {
        b = void 0 === b ? !1 : b;
        if (this.ownerDocument !== Oc) return this.__shady_native_removeChild(a);
        if (a.__shady_parentNode !== this) throw Error("The node to be removed is not a child of this node: " + a);
        var c = Wc(a),
            d = c && Yc(c, a),
            e = A(this);

        if (ib(this) && (Gc(a, this), jb(this))) {
          Xc(e.root);
          var f = !0;
        }

        if (Jc() && !b && c) {
          var g = Mc(a);
          Nc(a, function (a) {
            Kc(a, g);
          });
        }

        Tc(a);
        c && ((b = this && "slot" === this.localName) && (f = !0), (d || b) && Xc(c));
        f || (f = C(this) ? this.host : this, (!e.root && "slot" !== a.localName || f === a.__shady_native_parentNode) && f.__shady_native_removeChild(a));
        Vc(this, null, a);
        return a;
      },
      replaceChild: function (a, b) {
        this.__shady_insertBefore(a, b);

        this.__shady_removeChild(b);

        return a;
      },
      cloneNode: function (a) {
        if ("template" == this.localName) return this.__shady_native_cloneNode(a);

        var b = this.__shady_native_cloneNode(!1);

        if (a && b.nodeType !== Node.ATTRIBUTE_NODE) {
          a = this.__shady_childNodes;

          for (var c = 0, d; c < a.length; c++) d = a[c].__shady_cloneNode(!0), b.__shady_appendChild(d);
        }

        return b;
      },
      getRootNode: function (a) {
        if (this && this.nodeType) {
          var b = z(this),
              c = b.U;
          void 0 === c && (C(this) ? (c = this, b.U = c) : (c = (c = this.__shady_parentNode) ? c.__shady_getRootNode(a) : this, document.documentElement.__shady_native_contains(this) && (b.U = c)));
          return c;
        }
      },
      contains: function (a) {
        return sb(this, a);
      }
    });

    function $c(a, b, c) {
      var d = [];
      ad(a.__shady_childNodes, b, c, d);
      return d;
    }

    function ad(a, b, c, d) {
      for (var e = 0, f = a.length, g = void 0; e < f && (g = a[e]); e++) {
        var h;

        if (h = g.nodeType === Node.ELEMENT_NODE) {
          h = g;
          var k = b,
              m = c,
              n = d,
              p = k(h);
          p && n.push(h);
          m && m(p) ? h = p : (ad(h.__shady_childNodes, k, m, n), h = void 0);
        }

        if (h) break;
      }
    }

    var bd = E({
      get firstElementChild() {
        var a = A(this);

        if (a && void 0 !== a.firstChild) {
          for (a = this.__shady_firstChild; a && a.nodeType !== Node.ELEMENT_NODE;) a = a.__shady_nextSibling;

          return a;
        }

        return this.__shady_native_firstElementChild;
      },

      get lastElementChild() {
        var a = A(this);

        if (a && void 0 !== a.lastChild) {
          for (a = this.__shady_lastChild; a && a.nodeType !== Node.ELEMENT_NODE;) a = a.__shady_previousSibling;

          return a;
        }

        return this.__shady_native_lastElementChild;
      },

      get children() {
        return ib(this) ? tb(Array.prototype.filter.call(this.__shady_childNodes, function (a) {
          return a.nodeType === Node.ELEMENT_NODE;
        })) : this.__shady_native_children;
      },

      get childElementCount() {
        var a = this.__shady_children;
        return a ? a.length : 0;
      }

    }),
        cd = E({
      querySelector: function (a) {
        return $c(this, function (b) {
          return mb.call(b, a);
        }, function (a) {
          return !!a;
        })[0] || null;
      },
      querySelectorAll: function (a, b) {
        if (b) {
          b = Array.prototype.slice.call(this.__shady_native_querySelectorAll(a));

          var c = this.__shady_getRootNode();

          return b.filter(function (a) {
            return a.__shady_getRootNode() == c;
          });
        }

        return $c(this, function (b) {
          return mb.call(b, a);
        });
      }
    }),
        dd = B.ua ? Object.assign({}, bd) : bd;
    Object.assign(bd, cd);
    var ed = E({
      getElementById: function (a) {
        return "" === a ? null : $c(this, function (b) {
          return b.id == a;
        }, function (a) {
          return !!a;
        })[0] || null;
      }
    });
    var fd = E({
      get activeElement() {
        var a = B.D ? document.__shady_native_activeElement : document.activeElement;
        if (!a || !a.nodeType) return null;
        var b = !!C(this);
        if (!(this === document || b && this.host !== a && this.host.__shady_native_contains(a))) return null;

        for (b = Wc(a); b && b !== this;) a = b.host, b = Wc(a);

        return this === document ? b ? null : a : b === this ? a : null;
      }

    });
    var gd = document.implementation.createHTMLDocument("inert"),
        hd = E({
      get innerHTML() {
        return ib(this) ? Mb("template" === this.localName ? this.content : this, function (a) {
          return a.__shady_childNodes;
        }) : this.__shady_native_innerHTML;
      },

      set innerHTML(a) {
        if ("template" === this.localName) this.__shady_native_innerHTML = a;else {
          Sc(this);
          var b = this.localName || "div";
          b = this.namespaceURI && this.namespaceURI !== gd.namespaceURI ? gd.createElementNS(this.namespaceURI, b) : gd.createElement(b);

          for (B.D ? b.__shady_native_innerHTML = a : b.innerHTML = a; a = b.__shady_firstChild;) this.__shady_insertBefore(a);
        }
      }

    });
    var id = E({
      addEventListener: function (a, b, c) {
        "object" !== typeof c && (c = {
          capture: !!c
        });
        c.ia = this;

        this.host.__shady_addEventListener(a, b, c);
      },
      removeEventListener: function (a, b, c) {
        "object" !== typeof c && (c = {
          capture: !!c
        });
        c.ia = this;

        this.host.__shady_removeEventListener(a, b, c);
      }
    });

    function jd(a, b) {
      D(a, id, b);
      D(a, fd, b);
      D(a, hd, b);
      D(a, bd, b);
      B.T && !b ? (D(a, Zc, b), D(a, ed, b)) : B.D || (D(a, Yb), D(a, Xb));
    }

    var kd = {},
        ld = B.deferConnectionCallbacks && "loading" === document.readyState,
        md;

    function nd(a) {
      var b = [];

      do b.unshift(a); while (a = a.__shady_parentNode);

      return b;
    }

    function od(a, b, c) {
      if (a !== kd) throw new TypeError("Illegal constructor");
      this.Da = "ShadyRoot";
      this.host = b;
      this.mode = c && c.mode;
      Hc(b);
      a = z(b);
      a.root = this;
      a.va = "closed" !== this.mode ? this : null;
      a = z(this);
      a.firstChild = a.lastChild = a.parentNode = a.nextSibling = a.previousSibling = null;
      a.childNodes = [];
      this.ja = this.M = !1;
      this.c = this.b = this.a = null;
      if (B.preferPerformance) for (; a = b.__shady_native_firstChild;) b.__shady_native_removeChild(a);else Xc(this);
    }

    function Xc(a) {
      a.M || (a.M = !0, wb(function () {
        return pd(a);
      }));
    }

    function pd(a) {
      var b;

      if (b = a.M) {
        for (var c; a;) a: {
          a.M && (c = a), b = a;
          a = b.host.__shady_getRootNode();
          if (C(a) && (b = A(b.host)) && 0 < b.X) break a;
          a = void 0;
        }

        b = c;
      }

      (c = b) && c._renderSelf();
    }

    od.prototype._renderSelf = function () {
      var a = ld;
      ld = !0;
      this.M = !1;

      if (this.a) {
        qd(this);

        for (var b = 0, c; b < this.a.length; b++) {
          c = this.a[b];
          var d = A(c),
              e = d.assignedNodes;
          d.assignedNodes = [];
          d.N = [];
          if (d.ka = e) for (d = 0; d < e.length; d++) {
            var f = A(e[d]);
            f.Z = f.assignedSlot;
            f.assignedSlot === c && (f.assignedSlot = null);
          }
        }

        for (b = this.host.__shady_firstChild; b; b = b.__shady_nextSibling) rd(this, b);

        for (b = 0; b < this.a.length; b++) {
          c = this.a[b];
          e = A(c);
          if (!e.assignedNodes.length) for (d = c.__shady_firstChild; d; d = d.__shady_nextSibling) rd(this, d, c);
          (d = (d = A(c.__shady_parentNode)) && d.root) && (kb(d) || d.M) && d._renderSelf();
          sd(this, e.N, e.assignedNodes);

          if (d = e.ka) {
            for (f = 0; f < d.length; f++) A(d[f]).Z = null;

            e.ka = null;
            d.length > e.assignedNodes.length && (e.ba = !0);
          }

          e.ba && (e.ba = !1, td(this, c));
        }

        c = this.a;
        b = [];

        for (e = 0; e < c.length; e++) d = c[e].__shady_parentNode, (f = A(d)) && f.root || !(0 > b.indexOf(d)) || b.push(d);

        for (c = 0; c < b.length; c++) {
          f = b[c];
          e = f === this ? this.host : f;
          d = [];
          f = f.__shady_childNodes;

          for (var g = 0; g < f.length; g++) {
            var h = f[g];

            if ("slot" == h.localName) {
              h = A(h).N;

              for (var k = 0; k < h.length; k++) d.push(h[k]);
            } else d.push(h);
          }

          f = Array.prototype.slice.call(e.__shady_native_childNodes);
          g = Cc(d, d.length, f, f.length);
          k = h = 0;

          for (var m = void 0; h < g.length && (m = g[h]); h++) {
            for (var n = 0, p = void 0; n < m.V.length && (p = m.V[n]); n++) p.__shady_native_parentNode === e && e.__shady_native_removeChild(p), f.splice(m.index + k, 1);

            k -= m.$;
          }

          k = 0;

          for (m = void 0; k < g.length && (m = g[k]); k++) for (h = f[m.index], n = m.index; n < m.index + m.$; n++) p = d[n], e.__shady_native_insertBefore(p, h), f.splice(n, 0, p);
        }
      }

      if (!B.preferPerformance && !this.ja) for (b = this.host.__shady_childNodes, c = 0, e = b.length; c < e; c++) d = b[c], f = A(d), d.__shady_native_parentNode !== this.host || "slot" !== d.localName && f.assignedSlot || this.host.__shady_native_removeChild(d);
      this.ja = !0;
      ld = a;
      md && md();
    };

    function rd(a, b, c) {
      var d = z(b),
          e = d.Z;
      d.Z = null;
      c || (c = (a = a.b[b.__shady_slot || "__catchall"]) && a[0]);
      c ? (z(c).assignedNodes.push(b), d.assignedSlot = c) : d.assignedSlot = void 0;
      e !== d.assignedSlot && d.assignedSlot && (z(d.assignedSlot).ba = !0);
    }

    function sd(a, b, c) {
      for (var d = 0, e = void 0; d < c.length && (e = c[d]); d++) if ("slot" == e.localName) {
        var f = A(e).assignedNodes;
        f && f.length && sd(a, b, f);
      } else b.push(c[d]);
    }

    function td(a, b) {
      b.__shady_native_dispatchEvent(new Event("slotchange"));

      b = A(b);
      b.assignedSlot && td(a, b.assignedSlot);
    }

    function qd(a) {
      if (a.c && a.c.length) {
        for (var b = a.c, c, d = 0; d < b.length; d++) {
          var e = b[d];
          Hc(e);
          var f = e.__shady_parentNode;
          Hc(f);
          f = A(f);
          f.X = (f.X || 0) + 1;
          f = ud(e);
          a.b[f] ? (c = c || {}, c[f] = !0, a.b[f].push(e)) : a.b[f] = [e];
          a.a.push(e);
        }

        if (c) for (var g in c) a.b[g] = vd(a.b[g]);
        a.c = [];
      }
    }

    function ud(a) {
      var b = a.name || a.getAttribute("name") || "__catchall";
      return a.Ba = b;
    }

    function vd(a) {
      return a.sort(function (a, c) {
        a = nd(a);

        for (var b = nd(c), e = 0; e < a.length; e++) {
          c = a[e];
          var f = b[e];
          if (c !== f) return a = Array.from(c.__shady_parentNode.__shady_childNodes), a.indexOf(c) - a.indexOf(f);
        }
      });
    }

    function Yc(a, b) {
      if (a.a) {
        qd(a);
        var c = a.b,
            d;

        for (d in c) for (var e = c[d], f = 0; f < e.length; f++) {
          var g = e[f];

          if (sb(b, g)) {
            e.splice(f, 1);
            var h = a.a.indexOf(g);
            0 <= h && (a.a.splice(h, 1), (h = A(g.__shady_parentNode)) && h.X && h.X--);
            f--;
            g = A(g);
            if (h = g.N) for (var k = 0; k < h.length; k++) {
              var m = h[k],
                  n = m.__shady_native_parentNode;
              n && n.__shady_native_removeChild(m);
            }
            g.N = [];
            g.assignedNodes = [];
            h = !0;
          }
        }

        return h;
      }
    }

    function kb(a) {
      qd(a);
      return !(!a.a || !a.a.length);
    }

    (function (a) {
      a.__proto__ = DocumentFragment.prototype;
      jd(a, "__shady_");
      jd(a);
      Object.defineProperties(a, {
        nodeType: {
          value: Node.DOCUMENT_FRAGMENT_NODE,
          configurable: !0
        },
        nodeName: {
          value: "#document-fragment",
          configurable: !0
        },
        nodeValue: {
          value: null,
          configurable: !0
        }
      });
      ["localName", "namespaceURI", "prefix"].forEach(function (b) {
        Object.defineProperty(a, b, {
          value: void 0,
          configurable: !0
        });
      });
      ["ownerDocument", "baseURI", "isConnected"].forEach(function (b) {
        Object.defineProperty(a, b, {
          get: function () {
            return this.host[b];
          },
          configurable: !0
        });
      });
    })(od.prototype);

    if (window.customElements && B.ma && !B.preferPerformance) {
      var wd = new Map();

      md = function () {
        var a = [];
        wd.forEach(function (b, c) {
          a.push([c, b]);
        });
        wd.clear();

        for (var b = 0; b < a.length; b++) {
          var c = a[b][0];
          a[b][1] ? c.za() : c.Aa();
        }
      };

      ld && document.addEventListener("readystatechange", function () {
        ld = !1;
        md();
      }, {
        once: !0
      });

      var xd = function (a, b, c) {
        var d = 0,
            e = "__isConnected" + d++;
        if (b || c) a.prototype.connectedCallback = a.prototype.za = function () {
          ld ? wd.set(this, !0) : this[e] || (this[e] = !0, b && b.call(this));
        }, a.prototype.disconnectedCallback = a.prototype.Aa = function () {
          ld ? this.isConnected || wd.set(this, !1) : this[e] && (this[e] = !1, c && c.call(this));
        };
        return a;
      },
          define = window.customElements.define;

      Object.defineProperty(window.CustomElementRegistry.prototype, "define", {
        value: function (a, b) {
          var c = b.prototype.connectedCallback,
              d = b.prototype.disconnectedCallback;
          define.call(window.customElements, a, xd(b, c, d));
          b.prototype.connectedCallback = c;
          b.prototype.disconnectedCallback = d;
        }
      });
    }

    function Wc(a) {
      a = a.__shady_getRootNode();
      if (C(a)) return a;
    }

    function yd(a) {
      this.node = a;
    }

    r = yd.prototype;

    r.addEventListener = function (a, b, c) {
      return this.node.__shady_addEventListener(a, b, c);
    };

    r.removeEventListener = function (a, b, c) {
      return this.node.__shady_removeEventListener(a, b, c);
    };

    r.appendChild = function (a) {
      return this.node.__shady_appendChild(a);
    };

    r.insertBefore = function (a, b) {
      return this.node.__shady_insertBefore(a, b);
    };

    r.removeChild = function (a) {
      return this.node.__shady_removeChild(a);
    };

    r.replaceChild = function (a, b) {
      return this.node.__shady_replaceChild(a, b);
    };

    r.cloneNode = function (a) {
      return this.node.__shady_cloneNode(a);
    };

    r.getRootNode = function (a) {
      return this.node.__shady_getRootNode(a);
    };

    r.contains = function (a) {
      return this.node.__shady_contains(a);
    };

    r.dispatchEvent = function (a) {
      return this.node.__shady_dispatchEvent(a);
    };

    r.setAttribute = function (a, b) {
      this.node.__shady_setAttribute(a, b);
    };

    r.getAttribute = function (a) {
      return this.node.__shady_native_getAttribute(a);
    };

    r.hasAttribute = function (a) {
      return this.node.__shady_native_hasAttribute(a);
    };

    r.removeAttribute = function (a) {
      this.node.__shady_removeAttribute(a);
    };

    r.attachShadow = function (a) {
      return this.node.__shady_attachShadow(a);
    };

    r.focus = function () {
      this.node.__shady_native_focus();
    };

    r.blur = function () {
      this.node.__shady_blur();
    };

    r.importNode = function (a, b) {
      if (this.node.nodeType === Node.DOCUMENT_NODE) return this.node.__shady_importNode(a, b);
    };

    r.getElementById = function (a) {
      if (this.node.nodeType === Node.DOCUMENT_NODE) return this.node.__shady_getElementById(a);
    };

    r.querySelector = function (a) {
      return this.node.__shady_querySelector(a);
    };

    r.querySelectorAll = function (a, b) {
      return this.node.__shady_querySelectorAll(a, b);
    };

    r.assignedNodes = function (a) {
      if ("slot" === this.node.localName) return this.node.__shady_assignedNodes(a);
    };

    t.Object.defineProperties(yd.prototype, {
      activeElement: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          if (C(this.node) || this.node.nodeType === Node.DOCUMENT_NODE) return this.node.__shady_activeElement;
        }
      },
      _activeElement: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.activeElement;
        }
      },
      host: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          if (C(this.node)) return this.node.host;
        }
      },
      parentNode: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_parentNode;
        }
      },
      firstChild: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_firstChild;
        }
      },
      lastChild: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_lastChild;
        }
      },
      nextSibling: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_nextSibling;
        }
      },
      previousSibling: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_previousSibling;
        }
      },
      childNodes: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_childNodes;
        }
      },
      parentElement: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_parentElement;
        }
      },
      firstElementChild: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_firstElementChild;
        }
      },
      lastElementChild: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_lastElementChild;
        }
      },
      nextElementSibling: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_nextElementSibling;
        }
      },
      previousElementSibling: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_previousElementSibling;
        }
      },
      children: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_children;
        }
      },
      childElementCount: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_childElementCount;
        }
      },
      shadowRoot: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_shadowRoot;
        }
      },
      assignedSlot: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_assignedSlot;
        }
      },
      isConnected: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_isConnected;
        }
      },
      innerHTML: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_innerHTML;
        },
        set: function (a) {
          this.node.__shady_innerHTML = a;
        }
      },
      textContent: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_textContent;
        },
        set: function (a) {
          this.node.__shady_textContent = a;
        }
      },
      slot: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return this.node.__shady_slot;
        },
        set: function (a) {
          this.node.__shady_slot = a;
        }
      }
    });
    Ac.forEach(function (a) {
      Object.defineProperty(yd.prototype, a, {
        get: function () {
          return this.node["__shady_" + a];
        },
        set: function (b) {
          this.node["__shady_" + a] = b;
        },
        configurable: !0
      });
    });
    var zd = new WeakMap();

    function Ad(a) {
      if (C(a) || a instanceof yd) return a;
      var b = zd.get(a);
      b || (b = new yd(a), zd.set(a, b));
      return b;
    }

    var Bd = E({
      dispatchEvent: function (a) {
        xb();
        return this.__shady_native_dispatchEvent(a);
      },
      addEventListener: rc,
      removeEventListener: tc
    });
    var Cd = E({
      get assignedSlot() {
        var a = this.__shady_parentNode;
        (a = a && a.__shady_shadowRoot) && pd(a);
        return (a = A(this)) && a.assignedSlot || null;
      }

    });
    var Dd = window.document;

    function Ed(a, b) {
      if ("slot" === b) a = a.__shady_parentNode, jb(a) && Xc(A(a).root);else if ("slot" === a.localName && "name" === b && (b = Wc(a))) {
        if (b.a) {
          qd(b);
          var c = a.Ba,
              d = ud(a);

          if (d !== c) {
            c = b.b[c];
            var e = c.indexOf(a);
            0 <= e && c.splice(e, 1);
            c = b.b[d] || (b.b[d] = []);
            c.push(a);
            1 < c.length && (b.b[d] = vd(c));
          }
        }

        Xc(b);
      }
    }

    var Fd = E({
      get previousElementSibling() {
        var a = A(this);

        if (a && void 0 !== a.previousSibling) {
          for (a = this.__shady_previousSibling; a && a.nodeType !== Node.ELEMENT_NODE;) a = a.__shady_previousSibling;

          return a;
        }

        return this.__shady_native_previousElementSibling;
      },

      get nextElementSibling() {
        var a = A(this);

        if (a && void 0 !== a.nextSibling) {
          for (a = this.__shady_nextSibling; a && a.nodeType !== Node.ELEMENT_NODE;) a = a.__shady_nextSibling;

          return a;
        }

        return this.__shady_native_nextElementSibling;
      },

      get slot() {
        return this.getAttribute("slot");
      },

      set slot(a) {
        this.__shady_setAttribute("slot", a);
      },

      get shadowRoot() {
        var a = A(this);
        return a && a.va || null;
      },

      get className() {
        return this.getAttribute("class") || "";
      },

      set className(a) {
        this.__shady_setAttribute("class", a);
      },

      setAttribute: function (a, b) {
        if (this.ownerDocument !== Dd) this.__shady_native_setAttribute(a, b);else {
          var c;
          (c = Jc()) && "class" === a ? (c.setElementClass(this, b), c = !0) : c = !1;
          c || (this.__shady_native_setAttribute(a, b), Ed(this, a));
        }
      },
      removeAttribute: function (a) {
        this.__shady_native_removeAttribute(a);

        Ed(this, a);
      },
      attachShadow: function (a) {
        if (!this) throw Error("Must provide a host.");
        if (!a) throw Error("Not enough arguments.");
        return new od(kd, this, a);
      }
    });
    var Gd = E({
      blur: function () {
        var a = A(this);
        (a = (a = a && a.root) && a.activeElement) ? a.__shady_blur() : this.__shady_native_blur();
      }
    });
    Ac.forEach(function (a) {
      Gd[a] = {
        set: function (b) {
          var c = z(this),
              d = a.substring(2);
          c.Y[a] && this.removeEventListener(d, c.Y[a]);

          this.__shady_addEventListener(d, b);

          c.Y[a] = b;
        },
        get: function () {
          var b = A(this);
          return b && b.Y[a];
        },
        configurable: !0
      };
    });
    var Hd = E({
      assignedNodes: function (a) {
        if ("slot" === this.localName) {
          var b = this.__shady_getRootNode();

          b && C(b) && pd(b);
          return (b = A(this)) ? (a && a.flatten ? b.N : b.assignedNodes) || [] : [];
        }
      }
    });
    var Id = window.document,
        Jd = E({
      importNode: function (a, b) {
        if (a.ownerDocument !== Id || "template" === a.localName) return this.__shady_native_importNode(a, b);

        var c = this.__shady_native_importNode(a, !1);

        if (b) {
          a = a.__shady_childNodes;
          b = 0;

          for (var d; b < a.length; b++) d = this.__shady_importNode(a[b], !0), c.__shady_appendChild(d);
        }

        return c;
      }
    });
    var Kd = E({
      addEventListener: rc.bind(window),
      removeEventListener: tc.bind(window)
    });
    var Ld = {};
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, "parentElement") && (Ld.parentElement = Zc.parentElement);
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, "contains") && (Ld.contains = Zc.contains);
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, "children") && (Ld.children = bd.children);
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerHTML") && (Ld.innerHTML = hd.innerHTML);
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, "className") && (Ld.className = Fd.className);
    var Md = {
      EventTarget: [Bd],
      Node: [Zc, window.EventTarget ? null : Bd],
      Text: [Cd],
      Element: [Fd, bd, Cd, !B.D || "innerHTML" in Element.prototype ? hd : null, window.HTMLSlotElement ? null : Hd],
      HTMLElement: [Gd, Ld],
      HTMLSlotElement: [Hd],
      DocumentFragment: [dd, ed],
      Document: [Jd, dd, ed, fd],
      Window: [Kd]
    },
        Nd = B.D ? null : ["innerHTML", "textContent"];

    function Od(a) {
      var b = a ? null : Nd,
          c = {},
          d;

      for (d in Md) c.fa = window[d] && window[d].prototype, Md[d].forEach(function (c) {
        return function (d) {
          return c.fa && d && D(c.fa, d, a, b);
        };
      }(c)), c = {
        fa: c.fa
      };
    }

    if (B.ma) {
      var ShadyDOM = {
        inUse: B.ma,
        patch: function (a) {
          cc(a);
          bc(a);
          return a;
        },
        isShadyRoot: C,
        enqueue: wb,
        flush: xb,
        flushInitial: function (a) {
          !a.ja && a.M && pd(a);
        },
        settings: B,
        filterMutations: Fb,
        observeChildren: Db,
        unobserveChildren: Eb,
        deferConnectionCallbacks: B.deferConnectionCallbacks,
        preferPerformance: B.preferPerformance,
        handlesDynamicScoping: !0,
        wrap: B.T ? Ad : function (a) {
          return a;
        },
        Wrapper: yd,
        composedPath: jc,
        noPatch: B.T,
        nativeMethods: Ob,
        nativeTree: Pb
      };
      window.ShadyDOM = ShadyDOM;
      Wb();
      Od("__shady_");
      Object.defineProperty(document, "_activeElement", fd.activeElement);
      D(Window.prototype, Kd, "__shady_");
      B.T || (Od(), zc());
      uc();
      window.Event = wc;
      window.CustomEvent = xc;
      window.MouseEvent = yc;
      window.ShadowRoot = od;
    }

    var Pd = new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));

    function Qd(a) {
      var b = Pd.has(a);
      a = /^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(a);
      return !b && a;
    }

    function J(a) {
      var b = a.isConnected;
      if (void 0 !== b) return b;

      for (; a && !(a.__CE_isImportDocument || a instanceof Document);) a = a.parentNode || (window.ShadowRoot && a instanceof ShadowRoot ? a.host : void 0);

      return !(!a || !(a.__CE_isImportDocument || a instanceof Document));
    }

    function Rd(a, b) {
      for (; b && b !== a && !b.nextSibling;) b = b.parentNode;

      return b && b !== a ? b.nextSibling : null;
    }

    function Sd(a, b, c) {
      c = void 0 === c ? new Set() : c;

      for (var d = a; d;) {
        if (d.nodeType === Node.ELEMENT_NODE) {
          var e = d;
          b(e);
          var f = e.localName;

          if ("link" === f && "import" === e.getAttribute("rel")) {
            d = e.import;
            if (d instanceof Node && !c.has(d)) for (c.add(d), d = d.firstChild; d; d = d.nextSibling) Sd(d, b, c);
            d = Rd(a, e);
            continue;
          } else if ("template" === f) {
            d = Rd(a, e);
            continue;
          }

          if (e = e.__CE_shadowRoot) for (e = e.firstChild; e; e = e.nextSibling) Sd(e, b, c);
        }

        d = d.firstChild ? d.firstChild : Rd(a, d);
      }
    }

    function K(a, b, c) {
      a[b] = c;
    }

    function Td() {
      this.a = new Map();
      this.u = new Map();
      this.f = [];
      this.c = !1;
    }

    function Ud(a, b, c) {
      a.a.set(b, c);
      a.u.set(c.constructorFunction, c);
    }

    function Vd(a, b) {
      a.c = !0;
      a.f.push(b);
    }

    function Wd(a, b) {
      a.c && Sd(b, function (b) {
        return a.b(b);
      });
    }

    Td.prototype.b = function (a) {
      if (this.c && !a.__CE_patched) {
        a.__CE_patched = !0;

        for (var b = 0; b < this.f.length; b++) this.f[b](a);
      }
    };

    function L(a, b) {
      var c = [];
      Sd(b, function (a) {
        return c.push(a);
      });

      for (b = 0; b < c.length; b++) {
        var d = c[b];
        1 === d.__CE_state ? a.connectedCallback(d) : Xd(a, d);
      }
    }

    function M(a, b) {
      var c = [];
      Sd(b, function (a) {
        return c.push(a);
      });

      for (b = 0; b < c.length; b++) {
        var d = c[b];
        1 === d.__CE_state && a.disconnectedCallback(d);
      }
    }

    function N(a, b, c) {
      c = void 0 === c ? {} : c;

      var d = c.Za || new Set(),
          e = c.ga || function (b) {
        return Xd(a, b);
      },
          f = [];

      Sd(b, function (b) {
        if ("link" === b.localName && "import" === b.getAttribute("rel")) {
          var c = b.import;
          c instanceof Node && (c.__CE_isImportDocument = !0, c.__CE_hasRegistry = !0);
          c && "complete" === c.readyState ? c.__CE_documentLoadHandled = !0 : b.addEventListener("load", function () {
            var c = b.import;

            if (!c.__CE_documentLoadHandled) {
              c.__CE_documentLoadHandled = !0;
              var f = new Set(d);
              f.delete(c);
              N(a, c, {
                Za: f,
                ga: e
              });
            }
          });
        } else f.push(b);
      }, d);
      if (a.c) for (b = 0; b < f.length; b++) a.b(f[b]);

      for (b = 0; b < f.length; b++) e(f[b]);
    }

    function Xd(a, b) {
      if (void 0 === b.__CE_state) {
        var c = b.ownerDocument;
        if (c.defaultView || c.__CE_isImportDocument && c.__CE_hasRegistry) if (c = a.a.get(b.localName)) {
          c.constructionStack.push(b);
          var d = c.constructorFunction;

          try {
            try {
              if (new d() !== b) throw Error("The custom element constructor did not produce the element being upgraded.");
            } finally {
              c.constructionStack.pop();
            }
          } catch (g) {
            throw b.__CE_state = 2, g;
          }

          b.__CE_state = 1;
          b.__CE_definition = c;
          if (c.attributeChangedCallback) for (c = c.observedAttributes, d = 0; d < c.length; d++) {
            var e = c[d],
                f = b.getAttribute(e);
            null !== f && a.attributeChangedCallback(b, e, null, f, null);
          }
          J(b) && a.connectedCallback(b);
        }
      }
    }

    Td.prototype.connectedCallback = function (a) {
      var b = a.__CE_definition;
      b.connectedCallback && b.connectedCallback.call(a);
    };

    Td.prototype.disconnectedCallback = function (a) {
      var b = a.__CE_definition;
      b.disconnectedCallback && b.disconnectedCallback.call(a);
    };

    Td.prototype.attributeChangedCallback = function (a, b, c, d, e) {
      var f = a.__CE_definition;
      f.attributeChangedCallback && -1 < f.observedAttributes.indexOf(b) && f.attributeChangedCallback.call(a, b, c, d, e);
    };

    function Yd(a) {
      var b = document;
      this.b = a;
      this.a = b;
      this.O = void 0;
      N(this.b, this.a);
      "loading" === this.a.readyState && (this.O = new MutationObserver(this.c.bind(this)), this.O.observe(this.a, {
        childList: !0,
        subtree: !0
      }));
    }

    function Zd(a) {
      a.O && a.O.disconnect();
    }

    Yd.prototype.c = function (a) {
      var b = this.a.readyState;
      "interactive" !== b && "complete" !== b || Zd(this);

      for (b = 0; b < a.length; b++) for (var c = a[b].addedNodes, d = 0; d < c.length; d++) N(this.b, c[d]);
    };

    function $d() {
      var a = this;
      this.a = this.w = void 0;
      this.b = new Promise(function (b) {
        a.a = b;
        a.w && b(a.w);
      });
    }

    $d.prototype.resolve = function (a) {
      if (this.w) throw Error("Already resolved.");
      this.w = a;
      this.a && this.a(a);
    };

    function O(a) {
      this.c = !1;
      this.a = a;
      this.F = new Map();

      this.f = function (a) {
        return a();
      };

      this.b = !1;
      this.u = [];
      this.ca = new Yd(a);
    }

    r = O.prototype;

    r.xa = function (a, b) {
      var c = this;
      if (!(b instanceof Function)) throw new TypeError("Custom element constructors must be functions.");
      if (!Qd(a)) throw new SyntaxError("The element name '" + a + "' is not valid.");
      if (this.a.a.get(a)) throw Error("A custom element with name '" + a + "' has already been defined.");
      if (this.c) throw Error("A custom element is already being defined.");
      this.c = !0;

      try {
        var d = function (a) {
          var b = e[a];
          if (void 0 !== b && !(b instanceof Function)) throw Error("The '" + a + "' callback must be a function.");
          return b;
        },
            e = b.prototype;

        if (!(e instanceof Object)) throw new TypeError("The custom element constructor's prototype is not an object.");
        var f = d("connectedCallback");
        var g = d("disconnectedCallback");
        var h = d("adoptedCallback");
        var k = d("attributeChangedCallback");
        var m = b.observedAttributes || [];
      } catch (n) {
        return;
      } finally {
        this.c = !1;
      }

      b = {
        localName: a,
        constructorFunction: b,
        connectedCallback: f,
        disconnectedCallback: g,
        adoptedCallback: h,
        attributeChangedCallback: k,
        observedAttributes: m,
        constructionStack: []
      };
      Ud(this.a, a, b);
      this.u.push(b);
      this.b || (this.b = !0, this.f(function () {
        return ae(c);
      }));
    };

    r.ga = function (a) {
      N(this.a, a);
    };

    function ae(a) {
      if (!1 !== a.b) {
        a.b = !1;

        for (var b = a.u, c = [], d = new Map(), e = 0; e < b.length; e++) d.set(b[e].localName, []);

        N(a.a, document, {
          ga: function (b) {
            if (void 0 === b.__CE_state) {
              var e = b.localName,
                  f = d.get(e);
              f ? f.push(b) : a.a.a.get(e) && c.push(b);
            }
          }
        });

        for (e = 0; e < c.length; e++) Xd(a.a, c[e]);

        for (; 0 < b.length;) {
          var f = b.shift();
          e = f.localName;
          f = d.get(f.localName);

          for (var g = 0; g < f.length; g++) Xd(a.a, f[g]);

          (e = a.F.get(e)) && e.resolve(void 0);
        }
      }
    }

    r.get = function (a) {
      if (a = this.a.a.get(a)) return a.constructorFunction;
    };

    r.ya = function (a) {
      if (!Qd(a)) return Promise.reject(new SyntaxError("'" + a + "' is not a valid custom element name."));
      var b = this.F.get(a);
      if (b) return b.b;
      b = new $d();
      this.F.set(a, b);
      this.a.a.get(a) && !this.u.some(function (b) {
        return b.localName === a;
      }) && b.resolve(void 0);
      return b.b;
    };

    r.Ra = function (a) {
      Zd(this.ca);
      var b = this.f;

      this.f = function (c) {
        return a(function () {
          return b(c);
        });
      };
    };

    window.CustomElementRegistry = O;
    O.prototype.define = O.prototype.xa;
    O.prototype.upgrade = O.prototype.ga;
    O.prototype.get = O.prototype.get;
    O.prototype.whenDefined = O.prototype.ya;
    O.prototype.polyfillWrapFlushCallback = O.prototype.Ra;
    var be = window.Document.prototype.createElement,
        ce = window.Document.prototype.createElementNS,
        de = window.Document.prototype.importNode,
        ee = window.Document.prototype.prepend,
        fe = window.Document.prototype.append,
        ge = window.DocumentFragment.prototype.prepend,
        he = window.DocumentFragment.prototype.append,
        ie = window.Node.prototype.cloneNode,
        je = window.Node.prototype.appendChild,
        ke = window.Node.prototype.insertBefore,
        le = window.Node.prototype.removeChild,
        me = window.Node.prototype.replaceChild,
        ne = Object.getOwnPropertyDescriptor(window.Node.prototype, "textContent"),
        oe = window.Element.prototype.attachShadow,
        pe = Object.getOwnPropertyDescriptor(window.Element.prototype, "innerHTML"),
        qe = window.Element.prototype.getAttribute,
        re = window.Element.prototype.setAttribute,
        se = window.Element.prototype.removeAttribute,
        te = window.Element.prototype.getAttributeNS,
        ue = window.Element.prototype.setAttributeNS,
        ve = window.Element.prototype.removeAttributeNS,
        we = window.Element.prototype.insertAdjacentElement,
        xe = window.Element.prototype.insertAdjacentHTML,
        ye = window.Element.prototype.prepend,
        ze = window.Element.prototype.append,
        Ae = window.Element.prototype.before,
        Be = window.Element.prototype.after,
        Ce = window.Element.prototype.replaceWith,
        De = window.Element.prototype.remove,
        Ee = window.HTMLElement,
        Fe = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, "innerHTML"),
        Ge = window.HTMLElement.prototype.insertAdjacentElement,
        He = window.HTMLElement.prototype.insertAdjacentHTML;
    var Ie = new function () {}();

    function Je() {
      var a = Ke;

      window.HTMLElement = function () {
        function b() {
          var b = this.constructor,
              d = a.u.get(b);
          if (!d) throw Error("The custom element being constructed was not registered with `customElements`.");
          var e = d.constructionStack;
          if (0 === e.length) return e = be.call(document, d.localName), Object.setPrototypeOf(e, b.prototype), e.__CE_state = 1, e.__CE_definition = d, a.b(e), e;
          d = e.length - 1;
          var f = e[d];
          if (f === Ie) throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");
          e[d] = Ie;
          Object.setPrototypeOf(f, b.prototype);
          a.b(f);
          return f;
        }

        b.prototype = Ee.prototype;
        Object.defineProperty(b.prototype, "constructor", {
          writable: !0,
          configurable: !0,
          enumerable: !1,
          value: b
        });
        return b;
      }();
    }

    function Le(a, b, c) {
      function d(b) {
        return function (c) {
          for (var d = [], e = 0; e < arguments.length; ++e) d[e] = arguments[e];

          e = [];

          for (var f = [], m = 0; m < d.length; m++) {
            var n = d[m];
            n instanceof Element && J(n) && f.push(n);
            if (n instanceof DocumentFragment) for (n = n.firstChild; n; n = n.nextSibling) e.push(n);else e.push(n);
          }

          b.apply(this, d);

          for (d = 0; d < f.length; d++) M(a, f[d]);

          if (J(this)) for (d = 0; d < e.length; d++) f = e[d], f instanceof Element && L(a, f);
        };
      }

      void 0 !== c.ea && (b.prepend = d(c.ea));
      void 0 !== c.append && (b.append = d(c.append));
    }

    function Me() {
      var a = Ke;
      K(Document.prototype, "createElement", function (b) {
        if (this.__CE_hasRegistry) {
          var c = a.a.get(b);
          if (c) return new c.constructorFunction();
        }

        b = be.call(this, b);
        a.b(b);
        return b;
      });
      K(Document.prototype, "importNode", function (b, c) {
        b = de.call(this, b, !!c);
        this.__CE_hasRegistry ? N(a, b) : Wd(a, b);
        return b;
      });
      K(Document.prototype, "createElementNS", function (b, c) {
        if (this.__CE_hasRegistry && (null === b || "http://www.w3.org/1999/xhtml" === b)) {
          var d = a.a.get(c);
          if (d) return new d.constructorFunction();
        }

        b = ce.call(this, b, c);
        a.b(b);
        return b;
      });
      Le(a, Document.prototype, {
        ea: ee,
        append: fe
      });
    }

    function Ne() {
      function a(a, d) {
        Object.defineProperty(a, "textContent", {
          enumerable: d.enumerable,
          configurable: !0,
          get: d.get,
          set: function (a) {
            if (this.nodeType === Node.TEXT_NODE) d.set.call(this, a);else {
              var c = void 0;

              if (this.firstChild) {
                var e = this.childNodes,
                    h = e.length;

                if (0 < h && J(this)) {
                  c = Array(h);

                  for (var k = 0; k < h; k++) c[k] = e[k];
                }
              }

              d.set.call(this, a);
              if (c) for (a = 0; a < c.length; a++) M(b, c[a]);
            }
          }
        });
      }

      var b = Ke;
      K(Node.prototype, "insertBefore", function (a, d) {
        if (a instanceof DocumentFragment) {
          var c = Array.prototype.slice.apply(a.childNodes);
          a = ke.call(this, a, d);
          if (J(this)) for (d = 0; d < c.length; d++) L(b, c[d]);
          return a;
        }

        c = J(a);
        d = ke.call(this, a, d);
        c && M(b, a);
        J(this) && L(b, a);
        return d;
      });
      K(Node.prototype, "appendChild", function (a) {
        if (a instanceof DocumentFragment) {
          var c = Array.prototype.slice.apply(a.childNodes);
          a = je.call(this, a);
          if (J(this)) for (var e = 0; e < c.length; e++) L(b, c[e]);
          return a;
        }

        c = J(a);
        e = je.call(this, a);
        c && M(b, a);
        J(this) && L(b, a);
        return e;
      });
      K(Node.prototype, "cloneNode", function (a) {
        a = ie.call(this, !!a);
        this.ownerDocument.__CE_hasRegistry ? N(b, a) : Wd(b, a);
        return a;
      });
      K(Node.prototype, "removeChild", function (a) {
        var c = J(a),
            e = le.call(this, a);
        c && M(b, a);
        return e;
      });
      K(Node.prototype, "replaceChild", function (a, d) {
        if (a instanceof DocumentFragment) {
          var c = Array.prototype.slice.apply(a.childNodes);
          a = me.call(this, a, d);
          if (J(this)) for (M(b, d), d = 0; d < c.length; d++) L(b, c[d]);
          return a;
        }

        c = J(a);
        var f = me.call(this, a, d),
            g = J(this);
        g && M(b, d);
        c && M(b, a);
        g && L(b, a);
        return f;
      });
      ne && ne.get ? a(Node.prototype, ne) : Vd(b, function (b) {
        a(b, {
          enumerable: !0,
          configurable: !0,
          get: function () {
            for (var a = [], b = 0; b < this.childNodes.length; b++) a.push(this.childNodes[b].textContent);

            return a.join("");
          },
          set: function (a) {
            for (; this.firstChild;) le.call(this, this.firstChild);

            je.call(this, document.createTextNode(a));
          }
        });
      });
    }

    function Oe(a) {
      function b(b) {
        return function (c) {
          for (var d = [], e = 0; e < arguments.length; ++e) d[e] = arguments[e];

          e = [];

          for (var h = [], k = 0; k < d.length; k++) {
            var m = d[k];
            m instanceof Element && J(m) && h.push(m);
            if (m instanceof DocumentFragment) for (m = m.firstChild; m; m = m.nextSibling) e.push(m);else e.push(m);
          }

          b.apply(this, d);

          for (d = 0; d < h.length; d++) M(a, h[d]);

          if (J(this)) for (d = 0; d < e.length; d++) h = e[d], h instanceof Element && L(a, h);
        };
      }

      var c = Element.prototype;
      void 0 !== Ae && (c.before = b(Ae));
      void 0 !== Ae && (c.after = b(Be));
      void 0 !== Ce && K(c, "replaceWith", function (b) {
        for (var c = [], d = 0; d < arguments.length; ++d) c[d] = arguments[d];

        d = [];

        for (var g = [], h = 0; h < c.length; h++) {
          var k = c[h];
          k instanceof Element && J(k) && g.push(k);
          if (k instanceof DocumentFragment) for (k = k.firstChild; k; k = k.nextSibling) d.push(k);else d.push(k);
        }

        h = J(this);
        Ce.apply(this, c);

        for (c = 0; c < g.length; c++) M(a, g[c]);

        if (h) for (M(a, this), c = 0; c < d.length; c++) g = d[c], g instanceof Element && L(a, g);
      });
      void 0 !== De && K(c, "remove", function () {
        var b = J(this);
        De.call(this);
        b && M(a, this);
      });
    }

    function Pe() {
      function a(a, b) {
        Object.defineProperty(a, "innerHTML", {
          enumerable: b.enumerable,
          configurable: !0,
          get: b.get,
          set: function (a) {
            var c = this,
                e = void 0;
            J(this) && (e = [], Sd(this, function (a) {
              a !== c && e.push(a);
            }));
            b.set.call(this, a);
            if (e) for (var f = 0; f < e.length; f++) {
              var g = e[f];
              1 === g.__CE_state && d.disconnectedCallback(g);
            }
            this.ownerDocument.__CE_hasRegistry ? N(d, this) : Wd(d, this);
            return a;
          }
        });
      }

      function b(a, b) {
        K(a, "insertAdjacentElement", function (a, c) {
          var e = J(c);
          a = b.call(this, a, c);
          e && M(d, c);
          J(a) && L(d, c);
          return a;
        });
      }

      function c(a, b) {
        function c(a, b) {
          for (var c = []; a !== b; a = a.nextSibling) c.push(a);

          for (b = 0; b < c.length; b++) N(d, c[b]);
        }

        K(a, "insertAdjacentHTML", function (a, d) {
          a = a.toLowerCase();

          if ("beforebegin" === a) {
            var e = this.previousSibling;
            b.call(this, a, d);
            c(e || this.parentNode.firstChild, this);
          } else if ("afterbegin" === a) e = this.firstChild, b.call(this, a, d), c(this.firstChild, e);else if ("beforeend" === a) e = this.lastChild, b.call(this, a, d), c(e || this.firstChild, null);else if ("afterend" === a) e = this.nextSibling, b.call(this, a, d), c(this.nextSibling, e);else throw new SyntaxError("The value provided (" + String(a) + ") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.");
        });
      }

      var d = Ke;
      oe && K(Element.prototype, "attachShadow", function (a) {
        return this.__CE_shadowRoot = a = oe.call(this, a);
      });
      pe && pe.get ? a(Element.prototype, pe) : Fe && Fe.get ? a(HTMLElement.prototype, Fe) : Vd(d, function (b) {
        a(b, {
          enumerable: !0,
          configurable: !0,
          get: function () {
            return ie.call(this, !0).innerHTML;
          },
          set: function (a) {
            var b = "template" === this.localName,
                c = b ? this.content : this,
                d = ce.call(document, this.namespaceURI, this.localName);

            for (d.innerHTML = a; 0 < c.childNodes.length;) le.call(c, c.childNodes[0]);

            for (a = b ? d.content : d; 0 < a.childNodes.length;) je.call(c, a.childNodes[0]);
          }
        });
      });
      K(Element.prototype, "setAttribute", function (a, b) {
        if (1 !== this.__CE_state) return re.call(this, a, b);
        var c = qe.call(this, a);
        re.call(this, a, b);
        b = qe.call(this, a);
        d.attributeChangedCallback(this, a, c, b, null);
      });
      K(Element.prototype, "setAttributeNS", function (a, b, c) {
        if (1 !== this.__CE_state) return ue.call(this, a, b, c);
        var e = te.call(this, a, b);
        ue.call(this, a, b, c);
        c = te.call(this, a, b);
        d.attributeChangedCallback(this, b, e, c, a);
      });
      K(Element.prototype, "removeAttribute", function (a) {
        if (1 !== this.__CE_state) return se.call(this, a);
        var b = qe.call(this, a);
        se.call(this, a);
        null !== b && d.attributeChangedCallback(this, a, b, null, null);
      });
      K(Element.prototype, "removeAttributeNS", function (a, b) {
        if (1 !== this.__CE_state) return ve.call(this, a, b);
        var c = te.call(this, a, b);
        ve.call(this, a, b);
        var e = te.call(this, a, b);
        c !== e && d.attributeChangedCallback(this, b, c, e, a);
      });
      Ge ? b(HTMLElement.prototype, Ge) : we ? b(Element.prototype, we) : console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");
      He ? c(HTMLElement.prototype, He) : xe ? c(Element.prototype, xe) : console.warn("Custom Elements: `Element#insertAdjacentHTML` was not patched.");
      Le(d, Element.prototype, {
        ea: ye,
        append: ze
      });
      Oe(d);
    }

    var Qe = window.customElements;

    if (!Qe || Qe.forcePolyfill || "function" != typeof Qe.define || "function" != typeof Qe.get) {
      var Ke = new Td();
      Je();
      Me();
      Le(Ke, DocumentFragment.prototype, {
        ea: ge,
        append: he
      });
      Ne();
      Pe();
      document.__CE_hasRegistry = !0;
      var customElements = new O(Ke);
      Object.defineProperty(window, "customElements", {
        configurable: !0,
        enumerable: !0,
        value: customElements
      });
    }

    function Re() {
      this.end = this.start = 0;
      this.rules = this.parent = this.previous = null;
      this.cssText = this.parsedCssText = "";
      this.atRule = !1;
      this.type = 0;
      this.parsedSelector = this.selector = this.keyframesName = "";
    }

    function Se(a) {
      a = a.replace(Te, "").replace(Ue, "");
      var b = Ve,
          c = a,
          d = new Re();
      d.start = 0;
      d.end = c.length;

      for (var e = d, f = 0, g = c.length; f < g; f++) if ("{" === c[f]) {
        e.rules || (e.rules = []);
        var h = e,
            k = h.rules[h.rules.length - 1] || null;
        e = new Re();
        e.start = f + 1;
        e.parent = h;
        e.previous = k;
        h.rules.push(e);
      } else "}" === c[f] && (e.end = f + 1, e = e.parent || d);

      return b(d, a);
    }

    function Ve(a, b) {
      var c = b.substring(a.start, a.end - 1);
      a.parsedCssText = a.cssText = c.trim();
      a.parent && (c = b.substring(a.previous ? a.previous.end : a.parent.start, a.start - 1), c = We(c), c = c.replace(Xe, " "), c = c.substring(c.lastIndexOf(";") + 1), c = a.parsedSelector = a.selector = c.trim(), a.atRule = 0 === c.indexOf("@"), a.atRule ? 0 === c.indexOf("@media") ? a.type = Ye : c.match(Ze) && (a.type = $e, a.keyframesName = a.selector.split(Xe).pop()) : a.type = 0 === c.indexOf("--") ? af : bf);
      if (c = a.rules) for (var d = 0, e = c.length, f = void 0; d < e && (f = c[d]); d++) Ve(f, b);
      return a;
    }

    function We(a) {
      return a.replace(/\\([0-9a-f]{1,6})\s/gi, function (a, c) {
        a = c;

        for (c = 6 - a.length; c--;) a = "0" + a;

        return "\\" + a;
      });
    }

    function cf(a, b, c) {
      c = void 0 === c ? "" : c;
      var d = "";

      if (a.cssText || a.rules) {
        var e = a.rules,
            f;
        if (f = e) f = e[0], f = !(f && f.selector && 0 === f.selector.indexOf("--"));

        if (f) {
          f = 0;

          for (var g = e.length, h = void 0; f < g && (h = e[f]); f++) d = cf(h, b, d);
        } else b ? b = a.cssText : (b = a.cssText, b = b.replace(df, "").replace(ef, ""), b = b.replace(ff, "").replace(gf, "")), (d = b.trim()) && (d = "  " + d + "\n");
      }

      d && (a.selector && (c += a.selector + " {\n"), c += d, a.selector && (c += "}\n\n"));
      return c;
    }

    var bf = 1,
        $e = 7,
        Ye = 4,
        af = 1E3,
        Te = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
        Ue = /@import[^;]*;/gim,
        df = /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
        ef = /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
        ff = /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
        gf = /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
        Ze = /^@[^\s]*keyframes/,
        Xe = /\s+/g;
    var P = !(window.ShadyDOM && window.ShadyDOM.inUse),
        hf;

    function jf(a) {
      hf = a && a.shimcssproperties ? !1 : P || !(navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) || !window.CSS || !CSS.supports || !CSS.supports("box-shadow", "0 0 0 var(--foo)"));
    }

    var kf;
    window.ShadyCSS && void 0 !== window.ShadyCSS.cssBuild && (kf = window.ShadyCSS.cssBuild);
    var lf = !(!window.ShadyCSS || !window.ShadyCSS.disableRuntime);
    window.ShadyCSS && void 0 !== window.ShadyCSS.nativeCss ? hf = window.ShadyCSS.nativeCss : window.ShadyCSS ? (jf(window.ShadyCSS), window.ShadyCSS = void 0) : jf(window.WebComponents && window.WebComponents.flags);
    var R = hf,
        of = kf;
    var pf = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi,
        qf = /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,
        rf = /(--[\w-]+)\s*([:,;)]|$)/gi,
        sf = /(animation\s*:)|(animation-name\s*:)/,
        tf = /@media\s(.*)/,
        uf = /\{[^}]*\}/g;
    var vf = new Set();

    function wf(a, b) {
      if (!a) return "";
      "string" === typeof a && (a = Se(a));
      b && xf(a, b);
      return cf(a, R);
    }

    function yf(a) {
      !a.__cssRules && a.textContent && (a.__cssRules = Se(a.textContent));
      return a.__cssRules || null;
    }

    function zf(a) {
      return !!a.parent && a.parent.type === $e;
    }

    function xf(a, b, c, d) {
      if (a) {
        var e = !1,
            f = a.type;

        if (d && f === Ye) {
          var g = a.selector.match(tf);
          g && (window.matchMedia(g[1]).matches || (e = !0));
        }

        f === bf ? b(a) : c && f === $e ? c(a) : f === af && (e = !0);
        if ((a = a.rules) && !e) for (e = 0, f = a.length, g = void 0; e < f && (g = a[e]); e++) xf(g, b, c, d);
      }
    }

    function Af(a, b, c, d) {
      var e = document.createElement("style");
      b && e.setAttribute("scope", b);
      e.textContent = a;
      Bf(e, c, d);
      return e;
    }

    var Cf = null;

    function Df(a) {
      a = document.createComment(" Shady DOM styles for " + a + " ");
      var b = document.head;
      b.insertBefore(a, (Cf ? Cf.nextSibling : null) || b.firstChild);
      return Cf = a;
    }

    function Bf(a, b, c) {
      b = b || document.head;
      b.insertBefore(a, c && c.nextSibling || b.firstChild);
      Cf ? a.compareDocumentPosition(Cf) === Node.DOCUMENT_POSITION_PRECEDING && (Cf = a) : Cf = a;
    }

    function Ef(a, b) {
      for (var c = 0, d = a.length; b < d; b++) if ("(" === a[b]) c++;else if (")" === a[b] && 0 === --c) return b;

      return -1;
    }

    function Ff(a, b) {
      var c = a.indexOf("var(");
      if (-1 === c) return b(a, "", "", "");
      var d = Ef(a, c + 3),
          e = a.substring(c + 4, d);
      c = a.substring(0, c);
      a = Ff(a.substring(d + 1), b);
      d = e.indexOf(",");
      return -1 === d ? b(c, e.trim(), "", a) : b(c, e.substring(0, d).trim(), e.substring(d + 1).trim(), a);
    }

    function Gf(a, b) {
      P ? a.setAttribute("class", b) : window.ShadyDOM.nativeMethods.setAttribute.call(a, "class", b);
    }

    var Hf = window.ShadyDOM && window.ShadyDOM.wrap || function (a) {
      return a;
    };

    function If(a) {
      var b = a.localName,
          c = "";
      b ? -1 < b.indexOf("-") || (c = b, b = a.getAttribute && a.getAttribute("is") || "") : (b = a.is, c = a.extends);
      return {
        is: b,
        W: c
      };
    }

    function Jf(a) {
      for (var b = [], c = "", d = 0; 0 <= d && d < a.length; d++) if ("(" === a[d]) {
        var e = Ef(a, d);
        c += a.slice(d, e + 1);
        d = e;
      } else "," === a[d] ? (b.push(c), c = "") : c += a[d];

      c && b.push(c);
      return b;
    }

    function Kf(a) {
      if (void 0 !== of) return of;

      if (void 0 === a.__cssBuild) {
        var b = a.getAttribute("css-build");
        if (b) a.__cssBuild = b;else {
          a: {
            b = "template" === a.localName ? a.content.firstChild : a.firstChild;

            if (b instanceof Comment && (b = b.textContent.trim().split(":"), "css-build" === b[0])) {
              b = b[1];
              break a;
            }

            b = "";
          }

          if ("" !== b) {
            var c = "template" === a.localName ? a.content.firstChild : a.firstChild;
            c.parentNode.removeChild(c);
          }

          a.__cssBuild = b;
        }
      }

      return a.__cssBuild || "";
    }

    function Lf(a) {
      a = void 0 === a ? "" : a;
      return "" !== a && R ? P ? "shadow" === a : "shady" === a : !1;
    }

    function Mf() {}

    function Nf(a, b) {
      Of(S, a, function (a) {
        Pf(a, b || "");
      });
    }

    function Of(a, b, c) {
      b.nodeType === Node.ELEMENT_NODE && c(b);
      var d;
      "template" === b.localName ? d = (b.content || b._content || b).childNodes : d = b.children || b.childNodes;
      if (d) for (b = 0; b < d.length; b++) Of(a, d[b], c);
    }

    function Pf(a, b, c) {
      if (b) if (a.classList) c ? (a.classList.remove("style-scope"), a.classList.remove(b)) : (a.classList.add("style-scope"), a.classList.add(b));else if (a.getAttribute) {
        var d = a.getAttribute("class");
        c ? d && (b = d.replace("style-scope", "").replace(b, ""), Gf(a, b)) : Gf(a, (d ? d + " " : "") + "style-scope " + b);
      }
    }

    function Qf(a, b, c) {
      Of(S, a, function (a) {
        Pf(a, b, !0);
        Pf(a, c);
      });
    }

    function Rf(a, b) {
      Of(S, a, function (a) {
        Pf(a, b || "", !0);
      });
    }

    function Sf(a, b, c, d, e) {
      var f = S;
      e = void 0 === e ? "" : e;
      "" === e && (P || "shady" === (void 0 === d ? "" : d) ? e = wf(b, c) : (a = If(a), e = Tf(f, b, a.is, a.W, c) + "\n\n"));
      return e.trim();
    }

    function Tf(a, b, c, d, e) {
      var f = Uf(c, d);
      c = c ? "." + c : "";
      return wf(b, function (b) {
        b.c || (b.selector = b.C = Vf(a, b, a.b, c, f), b.c = !0);
        e && e(b, c, f);
      });
    }

    function Uf(a, b) {
      return b ? "[is=" + a + "]" : a;
    }

    function Vf(a, b, c, d, e) {
      var f = Jf(b.selector);

      if (!zf(b)) {
        b = 0;

        for (var g = f.length, h = void 0; b < g && (h = f[b]); b++) f[b] = c.call(a, h, d, e);
      }

      return f.filter(function (a) {
        return !!a;
      }).join(",");
    }

    function Wf(a) {
      return a.replace(Xf, function (a, c, d) {
        -1 < d.indexOf("+") ? d = d.replace(/\+/g, "___") : -1 < d.indexOf("___") && (d = d.replace(/___/g, "+"));
        return ":" + c + "(" + d + ")";
      });
    }

    function Yf(a) {
      for (var b = [], c; c = a.match(Zf);) {
        var d = c.index,
            e = Ef(a, d);
        if (-1 === e) throw Error(c.input + " selector missing ')'");
        c = a.slice(d, e + 1);
        a = a.replace(c, "\ue000");
        b.push(c);
      }

      return {
        pa: a,
        matches: b
      };
    }

    function $f(a, b) {
      var c = a.split("\ue000");
      return b.reduce(function (a, b, f) {
        return a + b + c[f + 1];
      }, c[0]);
    }

    Mf.prototype.b = function (a, b, c) {
      var d = !1;
      a = a.trim();
      var e = Xf.test(a);
      e && (a = a.replace(Xf, function (a, b, c) {
        return ":" + b + "(" + c.replace(/\s/g, "") + ")";
      }), a = Wf(a));
      var f = Zf.test(a);

      if (f) {
        var g = Yf(a);
        a = g.pa;
        g = g.matches;
      }

      a = a.replace(ag, ":host $1");
      a = a.replace(bg, function (a, e, f) {
        d || (a = cg(f, e, b, c), d = d || a.stop, e = a.Ha, f = a.value);
        return e + f;
      });
      f && (a = $f(a, g));
      e && (a = Wf(a));
      return a;
    };

    function cg(a, b, c, d) {
      var e = a.indexOf("::slotted");
      0 <= a.indexOf(":host") ? a = dg(a, d) : 0 !== e && (a = c ? eg(a, c) : a);
      c = !1;
      0 <= e && (b = "", c = !0);

      if (c) {
        var f = !0;
        c && (a = a.replace(fg, function (a, b) {
          return " > " + b;
        }));
      }

      a = a.replace(gg, function (a, b, c) {
        return '[dir="' + c + '"] ' + b + ", " + b + '[dir="' + c + '"]';
      });
      return {
        value: a,
        Ha: b,
        stop: f
      };
    }

    function eg(a, b) {
      a = a.split(/(\[.+?\])/);

      for (var c = [], d = 0; d < a.length; d++) if (1 === d % 2) c.push(a[d]);else {
        var e = a[d];
        if ("" !== e || d !== a.length - 1) e = e.split(":"), e[0] += b, c.push(e.join(":"));
      }

      return c.join("");
    }

    function dg(a, b) {
      var c = a.match(hg);
      return (c = c && c[2].trim() || "") ? c[0].match(ig) ? a.replace(hg, function (a, c, f) {
        return b + f;
      }) : c.split(ig)[0] === b ? c : "should_not_match" : a.replace(":host", b);
    }

    function jg(a) {
      ":root" === a.selector && (a.selector = "html");
    }

    Mf.prototype.c = function (a) {
      return a.match(":host") ? "" : a.match("::slotted") ? this.b(a, ":not(.style-scope)") : eg(a.trim(), ":not(.style-scope)");
    };

    t.Object.defineProperties(Mf.prototype, {
      a: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return "style-scope";
        }
      }
    });
    var Xf = /:(nth[-\w]+)\(([^)]+)\)/,
        bg = /(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=[])+)/g,
        ig = /[[.:#*]/,
        ag = /^(::slotted)/,
        hg = /(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,
        fg = /(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,
        gg = /(.*):dir\((?:(ltr|rtl))\)/,
        Zf = /:(?:matches|any|-(?:webkit|moz)-any)/,
        S = new Mf();

    function kg(a, b, c, d, e) {
      this.L = a || null;
      this.b = b || null;
      this.na = c || [];
      this.G = null;
      this.cssBuild = e || "";
      this.W = d || "";
      this.a = this.H = this.K = null;
    }

    function U(a) {
      return a ? a.__styleInfo : null;
    }

    function lg(a, b) {
      return a.__styleInfo = b;
    }

    kg.prototype.c = function () {
      return this.L;
    };

    kg.prototype._getStyleRules = kg.prototype.c;

    function mg(a) {
      var b = this.matches || this.matchesSelector || this.mozMatchesSelector || this.msMatchesSelector || this.oMatchesSelector || this.webkitMatchesSelector;
      return b && b.call(this, a);
    }

    function og() {}

    function pg(a) {
      var b = {},
          c = [],
          d = 0;
      xf(a, function (a) {
        qg(a);
        a.index = d++;
        a = a.A.cssText;

        for (var c; c = rf.exec(a);) {
          var e = c[1];
          ":" !== c[2] && (b[e] = !0);
        }
      }, function (a) {
        c.push(a);
      });
      a.b = c;
      a = [];

      for (var e in b) a.push(e);

      return a;
    }

    function qg(a) {
      if (!a.A) {
        var b = {},
            c = {};
        rg(a, c) && (b.J = c, a.rules = null);
        b.cssText = a.parsedCssText.replace(uf, "").replace(pf, "");
        a.A = b;
      }
    }

    function rg(a, b) {
      var c = a.A;

      if (c) {
        if (c.J) return Object.assign(b, c.J), !0;
      } else {
        c = a.parsedCssText;

        for (var d; a = pf.exec(c);) {
          d = (a[2] || a[3]).trim();
          if ("inherit" !== d || "unset" !== d) b[a[1].trim()] = d;
          d = !0;
        }

        return d;
      }
    }

    function sg(a, b, c) {
      b && (b = 0 <= b.indexOf(";") ? tg(a, b, c) : Ff(b, function (b, e, f, g) {
        if (!e) return b + g;
        (e = sg(a, c[e], c)) && "initial" !== e ? "apply-shim-inherit" === e && (e = "inherit") : e = sg(a, c[f] || f, c) || f;
        return b + (e || "") + g;
      }));
      return b && b.trim() || "";
    }

    function tg(a, b, c) {
      b = b.split(";");

      for (var d = 0, e, f; d < b.length; d++) if (e = b[d]) {
        qf.lastIndex = 0;
        if (f = qf.exec(e)) e = sg(a, c[f[1]], c);else if (f = e.indexOf(":"), -1 !== f) {
          var g = e.substring(f);
          g = g.trim();
          g = sg(a, g, c) || g;
          e = e.substring(0, f) + g;
        }
        b[d] = e && e.lastIndexOf(";") === e.length - 1 ? e.slice(0, -1) : e || "";
      }

      return b.join(";");
    }

    function ug(a, b) {
      var c = {},
          d = [];
      xf(a, function (a) {
        a.A || qg(a);
        var e = a.C || a.parsedSelector;
        b && a.A.J && e && mg.call(b, e) && (rg(a, c), a = a.index, e = parseInt(a / 32, 10), d[e] = (d[e] || 0) | 1 << a % 32);
      }, null, !0);
      return {
        J: c,
        key: d
      };
    }

    function vg(a, b, c, d) {
      b.A || qg(b);

      if (b.A.J) {
        var e = If(a);
        a = e.is;
        e = e.W;
        e = a ? Uf(a, e) : "html";
        var f = b.parsedSelector,
            g = ":host > *" === f || "html" === f,
            h = 0 === f.indexOf(":host") && !g;
        "shady" === c && (g = f === e + " > *." + e || -1 !== f.indexOf("html"), h = !g && 0 === f.indexOf(e));
        if (g || h) c = e, h && (b.C || (b.C = Vf(S, b, S.b, a ? "." + a : "", e)), c = b.C || e), d({
          pa: c,
          Oa: h,
          ab: g
        });
      }
    }

    function wg(a, b, c) {
      var d = {},
          e = {};
      xf(b, function (b) {
        vg(a, b, c, function (c) {
          mg.call(a._element || a, c.pa) && (c.Oa ? rg(b, d) : rg(b, e));
        });
      }, null, !0);
      return {
        Ta: e,
        Ma: d
      };
    }

    function xg(a, b, c, d) {
      var e = If(b),
          f = Uf(e.is, e.W),
          g = new RegExp("(?:^|[^.#[:])" + (b.extends ? "\\" + f.slice(0, -1) + "\\]" : f) + "($|[.:[\\s>+~])"),
          h = U(b);
      e = h.L;
      h = h.cssBuild;
      var k = yg(e, d);
      return Sf(b, e, function (b) {
        var e = "";
        b.A || qg(b);
        b.A.cssText && (e = tg(a, b.A.cssText, c));
        b.cssText = e;

        if (!P && !zf(b) && b.cssText) {
          var h = e = b.cssText;
          null == b.ta && (b.ta = sf.test(e));
          if (b.ta) if (null == b.da) {
            b.da = [];

            for (var m in k) h = k[m], h = h(e), e !== h && (e = h, b.da.push(m));
          } else {
            for (m = 0; m < b.da.length; ++m) h = k[b.da[m]], e = h(e);

            h = e;
          }
          b.cssText = h;
          b.C = b.C || b.selector;
          e = "." + d;
          m = Jf(b.C);
          h = 0;

          for (var u = m.length, x = void 0; h < u && (x = m[h]); h++) m[h] = x.match(g) ? x.replace(f, e) : e + " " + x;

          b.selector = m.join(",");
        }
      }, h);
    }

    function yg(a, b) {
      a = a.b;
      var c = {};
      if (!P && a) for (var d = 0, e = a[d]; d < a.length; e = a[++d]) {
        var f = e,
            g = b;
        f.f = new RegExp("\\b" + f.keyframesName + "(?!\\B|-)", "g");
        f.a = f.keyframesName + "-" + g;
        f.C = f.C || f.selector;
        f.selector = f.C.replace(f.keyframesName, f.a);
        c[e.keyframesName] = zg(e);
      }
      return c;
    }

    function zg(a) {
      return function (b) {
        return b.replace(a.f, a.a);
      };
    }

    function Ag(a, b) {
      var c = Bg,
          d = yf(a);
      a.textContent = wf(d, function (a) {
        var d = a.cssText = a.parsedCssText;
        a.A && a.A.cssText && (d = d.replace(df, "").replace(ef, ""), a.cssText = tg(c, d, b));
      });
    }

    t.Object.defineProperties(og.prototype, {
      a: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return "x-scope";
        }
      }
    });
    var Bg = new og();
    var Cg = {},
        Dg = window.customElements;

    if (Dg && !P && !lf) {
      var Eg = Dg.define;

      Dg.define = function (a, b, c) {
        Cg[a] || (Cg[a] = Df(a));
        Eg.call(Dg, a, b, c);
      };
    }

    function Fg() {
      this.cache = {};
    }

    Fg.prototype.store = function (a, b, c, d) {
      var e = this.cache[a] || [];
      e.push({
        J: b,
        styleElement: c,
        H: d
      });
      100 < e.length && e.shift();
      this.cache[a] = e;
    };

    function Gg() {}

    var Hg = new RegExp(S.a + "\\s*([^\\s]*)");

    function Ig(a) {
      return (a = (a.classList && a.classList.value ? a.classList.value : a.getAttribute("class") || "").match(Hg)) ? a[1] : "";
    }

    function Jg(a) {
      var b = Hf(a).getRootNode();
      return b === a || b === a.ownerDocument ? "" : (a = b.host) ? If(a).is : "";
    }

    function Kg(a) {
      for (var b = 0; b < a.length; b++) {
        var c = a[b];
        if (c.target !== document.documentElement && c.target !== document.head) for (var d = 0; d < c.addedNodes.length; d++) {
          var e = c.addedNodes[d];

          if (e.nodeType === Node.ELEMENT_NODE) {
            var f = e.getRootNode(),
                g = Ig(e);
            if (g && f === e.ownerDocument && ("style" !== e.localName && "template" !== e.localName || "" === Kf(e))) Rf(e, g);else if (f instanceof ShadowRoot) for (f = Jg(e), f !== g && Qf(e, g, f), e = window.ShadyDOM.nativeMethods.querySelectorAll.call(e, ":not(." + S.a + ")"), g = 0; g < e.length; g++) {
              f = e[g];
              var h = Jg(f);
              h && Pf(f, h);
            }
          }
        }
      }
    }

    if (!(P || window.ShadyDOM && window.ShadyDOM.handlesDynamicScoping)) {
      var Lg = new MutationObserver(Kg),
          Mg = function (a) {
        Lg.observe(a, {
          childList: !0,
          subtree: !0
        });
      };

      if (window.customElements && !window.customElements.polyfillWrapFlushCallback) Mg(document);else {
        var Ng = function () {
          Mg(document.body);
        };

        window.HTMLImports ? window.HTMLImports.whenReady(Ng) : requestAnimationFrame(function () {
          if ("loading" === document.readyState) {
            var a = function () {
              Ng();
              document.removeEventListener("readystatechange", a);
            };

            document.addEventListener("readystatechange", a);
          } else Ng();
        });
      }

      Gg = function () {
        Kg(Lg.takeRecords());
      };
    }

    var Og = Gg;
    var Pg = {};
    var Qg = Promise.resolve();

    function Rg(a) {
      if (a = Pg[a]) a._applyShimCurrentVersion = a._applyShimCurrentVersion || 0, a._applyShimValidatingVersion = a._applyShimValidatingVersion || 0, a._applyShimNextVersion = (a._applyShimNextVersion || 0) + 1;
    }

    function Sg(a) {
      return a._applyShimCurrentVersion === a._applyShimNextVersion;
    }

    function Tg(a) {
      a._applyShimValidatingVersion = a._applyShimNextVersion;
      a._validating || (a._validating = !0, Qg.then(function () {
        a._applyShimCurrentVersion = a._applyShimNextVersion;
        a._validating = !1;
      }));
    }

    var Ug = {},
        Vg = new Fg();

    function V() {
      this.F = {};
      this.c = document.documentElement;
      var a = new Re();
      a.rules = [];
      this.f = lg(this.c, new kg(a));
      this.u = !1;
      this.b = this.a = null;
    }

    r = V.prototype;

    r.flush = function () {
      Og();
    };

    r.Ka = function (a) {
      return yf(a);
    };

    r.Xa = function (a) {
      return wf(a);
    };

    r.prepareTemplate = function (a, b, c) {
      this.prepareTemplateDom(a, b);
      this.prepareTemplateStyles(a, b, c);
    };

    r.prepareTemplateStyles = function (a, b, c) {
      if (!a._prepared && !lf) {
        P || Cg[b] || (Cg[b] = Df(b));
        a._prepared = !0;
        a.name = b;
        a.extends = c;
        Pg[b] = a;
        var d = Kf(a),
            e = Lf(d);
        c = {
          is: b,
          extends: c
        };

        for (var f = [], g = a.content.querySelectorAll("style"), h = 0; h < g.length; h++) {
          var k = g[h];

          if (k.hasAttribute("shady-unscoped")) {
            if (!P) {
              var m = k.textContent;
              vf.has(m) || (vf.add(m), m = k.cloneNode(!0), document.head.appendChild(m));
              k.parentNode.removeChild(k);
            }
          } else f.push(k.textContent), k.parentNode.removeChild(k);
        }

        f = f.join("").trim() + (Ug[b] || "");
        Wg(this);

        if (!e) {
          if (g = !d) g = qf.test(f) || pf.test(f), qf.lastIndex = 0, pf.lastIndex = 0;
          h = Se(f);
          g && R && this.a && this.a.transformRules(h, b);
          a._styleAst = h;
        }

        g = [];
        R || (g = pg(a._styleAst));
        if (!g.length || R) h = P ? a.content : null, b = Cg[b] || null, d = Sf(c, a._styleAst, null, d, e ? f : ""), d = d.length ? Af(d, c.is, h, b) : null, a._style = d;
        a.a = g;
      }
    };

    r.Sa = function (a, b) {
      Ug[b] = a.join(" ");
    };

    r.prepareTemplateDom = function (a, b) {
      if (!lf) {
        var c = Kf(a);
        P || "shady" === c || a._domPrepared || (a._domPrepared = !0, Nf(a.content, b));
      }
    };

    function Xg(a) {
      var b = If(a),
          c = b.is;
      b = b.W;
      var d = Cg[c] || null,
          e = Pg[c];

      if (e) {
        c = e._styleAst;
        var f = e.a;
        e = Kf(e);
        b = new kg(c, d, f, b, e);
        lg(a, b);
        return b;
      }
    }

    function Yg(a) {
      !a.b && window.ShadyCSS && window.ShadyCSS.CustomStyleInterface && (a.b = window.ShadyCSS.CustomStyleInterface, a.b.transformCallback = function (b) {
        a.wa(b);
      }, a.b.validateCallback = function () {
        requestAnimationFrame(function () {
          (a.b.enqueued || a.u) && a.flushCustomStyles();
        });
      });
    }

    function Wg(a) {
      !a.a && window.ShadyCSS && window.ShadyCSS.ApplyShim && (a.a = window.ShadyCSS.ApplyShim, a.a.invalidCallback = Rg);
      Yg(a);
    }

    r.flushCustomStyles = function () {
      if (!lf && (Wg(this), this.b)) {
        var a = this.b.processStyles();

        if (this.b.enqueued && !Lf(this.f.cssBuild)) {
          if (R) {
            if (!this.f.cssBuild) for (var b = 0; b < a.length; b++) {
              var c = this.b.getStyleForCustomStyle(a[b]);

              if (c && R && this.a) {
                var d = yf(c);
                Wg(this);
                this.a.transformRules(d);
                c.textContent = wf(d);
              }
            }
          } else {
            Zg(this, this.c, this.f);

            for (b = 0; b < a.length; b++) (c = this.b.getStyleForCustomStyle(a[b])) && Ag(c, this.f.K);

            this.u && this.styleDocument();
          }

          this.b.enqueued = !1;
        }
      }
    };

    r.styleElement = function (a, b) {
      if (lf) {
        if (b) {
          U(a) || lg(a, new kg(null));
          var c = U(a);
          c.G = c.G || {};
          Object.assign(c.G, b);
          $g(this, a, c);
        }
      } else if (c = U(a) || Xg(a)) if (a !== this.c && (this.u = !0), b && (c.G = c.G || {}, Object.assign(c.G, b)), R) $g(this, a, c);else if (this.flush(), Zg(this, a, c), c.na && c.na.length) {
        b = If(a).is;
        var d;

        a: {
          if (d = Vg.cache[b]) for (var e = d.length - 1; 0 <= e; e--) {
            var f = d[e];

            b: {
              var g = c.na;

              for (var h = 0; h < g.length; h++) {
                var k = g[h];

                if (f.J[k] !== c.K[k]) {
                  g = !1;
                  break b;
                }
              }

              g = !0;
            }

            if (g) {
              d = f;
              break a;
            }
          }
          d = void 0;
        }

        g = d ? d.styleElement : null;
        e = c.H;
        (f = d && d.H) || (f = this.F[b] = (this.F[b] || 0) + 1, f = b + "-" + f);
        c.H = f;
        f = c.H;
        h = Bg;
        h = g ? g.textContent || "" : xg(h, a, c.K, f);
        k = U(a);
        var m = k.a;
        m && !P && m !== g && (m._useCount--, 0 >= m._useCount && m.parentNode && m.parentNode.removeChild(m));
        P ? k.a ? (k.a.textContent = h, g = k.a) : h && (g = Af(h, f, a.shadowRoot, k.b)) : g ? g.parentNode || Bf(g, null, k.b) : h && (g = Af(h, f, null, k.b));
        g && (g._useCount = g._useCount || 0, k.a != g && g._useCount++, k.a = g);
        f = g;
        P || (g = c.H, k = h = a.getAttribute("class") || "", e && (k = h.replace(new RegExp("\\s*x-scope\\s*" + e + "\\s*", "g"), " ")), k += (k ? " " : "") + "x-scope " + g, h !== k && Gf(a, k));
        d || Vg.store(b, c.K, f, c.H);
      }
    };

    function $g(a, b, c) {
      var d = If(b).is;

      if (c.G) {
        var e = c.G,
            f;

        for (f in e) null === f ? b.style.removeProperty(f) : b.style.setProperty(f, e[f]);
      }

      e = Pg[d];

      if (!(!e && b !== a.c || e && "" !== Kf(e)) && e && e._style && !Sg(e)) {
        if (Sg(e) || e._applyShimValidatingVersion !== e._applyShimNextVersion) Wg(a), a.a && a.a.transformRules(e._styleAst, d), e._style.textContent = Sf(b, c.L), Tg(e);
        P && (a = b.shadowRoot) && (a = a.querySelector("style")) && (a.textContent = Sf(b, c.L));
        c.L = e._styleAst;
      }
    }

    function ah(a, b) {
      return (b = Hf(b).getRootNode().host) ? U(b) || Xg(b) ? b : ah(a, b) : a.c;
    }

    function Zg(a, b, c) {
      var d = ah(a, b),
          e = U(d),
          f = e.K;
      d === a.c || f || (Zg(a, d, e), f = e.K);
      a = Object.create(f || null);
      d = wg(b, c.L, c.cssBuild);
      b = ug(e.L, b).J;
      Object.assign(a, d.Ma, b, d.Ta);
      b = c.G;

      for (var g in b) if ((e = b[g]) || 0 === e) a[g] = e;

      g = Bg;
      b = Object.getOwnPropertyNames(a);

      for (e = 0; e < b.length; e++) d = b[e], a[d] = sg(g, a[d], a);

      c.K = a;
    }

    r.styleDocument = function (a) {
      this.styleSubtree(this.c, a);
    };

    r.styleSubtree = function (a, b) {
      var c = Hf(a),
          d = c.shadowRoot;
      (d || a === this.c) && this.styleElement(a, b);
      if (a = d && (d.children || d.childNodes)) for (c = 0; c < a.length; c++) this.styleSubtree(a[c]);else if (c = c.children || c.childNodes) for (a = 0; a < c.length; a++) this.styleSubtree(c[a]);
    };

    r.wa = function (a) {
      var b = this,
          c = Kf(a);
      c !== this.f.cssBuild && (this.f.cssBuild = c);

      if (!Lf(c)) {
        var d = yf(a);
        xf(d, function (a) {
          if (P) jg(a);else {
            var d = S;
            a.selector = a.parsedSelector;
            jg(a);
            a.selector = a.C = Vf(d, a, d.c, void 0, void 0);
          }
          R && "" === c && (Wg(b), b.a && b.a.transformRule(a));
        });
        R ? a.textContent = wf(d) : this.f.L.rules.push(d);
      }
    };

    r.getComputedStyleValue = function (a, b) {
      var c;
      R || (c = (U(a) || U(ah(this, a))).K[b]);
      return (c = c || window.getComputedStyle(a).getPropertyValue(b)) ? c.trim() : "";
    };

    r.Wa = function (a, b) {
      var c = Hf(a).getRootNode();
      b = b ? b.split(/\s/) : [];
      c = c.host && c.host.localName;

      if (!c) {
        var d = a.getAttribute("class");

        if (d) {
          d = d.split(/\s/);

          for (var e = 0; e < d.length; e++) if (d[e] === S.a) {
            c = d[e + 1];
            break;
          }
        }
      }

      c && b.push(S.a, c);
      R || (c = U(a)) && c.H && b.push(Bg.a, c.H);
      Gf(a, b.join(" "));
    };

    r.Fa = function (a) {
      return U(a);
    };

    r.Va = function (a, b) {
      Pf(a, b);
    };

    r.Ya = function (a, b) {
      Pf(a, b, !0);
    };

    r.Ua = function (a) {
      return Jg(a);
    };

    r.Ia = function (a) {
      return Ig(a);
    };

    V.prototype.flush = V.prototype.flush;
    V.prototype.prepareTemplate = V.prototype.prepareTemplate;
    V.prototype.styleElement = V.prototype.styleElement;
    V.prototype.styleDocument = V.prototype.styleDocument;
    V.prototype.styleSubtree = V.prototype.styleSubtree;
    V.prototype.getComputedStyleValue = V.prototype.getComputedStyleValue;
    V.prototype.setElementClass = V.prototype.Wa;
    V.prototype._styleInfoForNode = V.prototype.Fa;
    V.prototype.transformCustomStyleForDocument = V.prototype.wa;
    V.prototype.getStyleAst = V.prototype.Ka;
    V.prototype.styleAstToString = V.prototype.Xa;
    V.prototype.flushCustomStyles = V.prototype.flushCustomStyles;
    V.prototype.scopeNode = V.prototype.Va;
    V.prototype.unscopeNode = V.prototype.Ya;
    V.prototype.scopeForNode = V.prototype.Ua;
    V.prototype.currentScopeForNode = V.prototype.Ia;
    V.prototype.prepareAdoptedCssText = V.prototype.Sa;
    Object.defineProperties(V.prototype, {
      nativeShadow: {
        get: function () {
          return P;
        }
      },
      nativeCss: {
        get: function () {
          return R;
        }
      }
    });
    var W = new V(),
        bh,
        ch;
    window.ShadyCSS && (bh = window.ShadyCSS.ApplyShim, ch = window.ShadyCSS.CustomStyleInterface);
    window.ShadyCSS = {
      ScopingShim: W,
      prepareTemplate: function (a, b, c) {
        W.flushCustomStyles();
        W.prepareTemplate(a, b, c);
      },
      prepareTemplateDom: function (a, b) {
        W.prepareTemplateDom(a, b);
      },
      prepareTemplateStyles: function (a, b, c) {
        W.flushCustomStyles();
        W.prepareTemplateStyles(a, b, c);
      },
      styleSubtree: function (a, b) {
        W.flushCustomStyles();
        W.styleSubtree(a, b);
      },
      styleElement: function (a) {
        W.flushCustomStyles();
        W.styleElement(a);
      },
      styleDocument: function (a) {
        W.flushCustomStyles();
        W.styleDocument(a);
      },
      flushCustomStyles: function () {
        W.flushCustomStyles();
      },
      getComputedStyleValue: function (a, b) {
        return W.getComputedStyleValue(a, b);
      },
      nativeCss: R,
      nativeShadow: P,
      cssBuild: of,
      disableRuntime: lf
    };
    bh && (window.ShadyCSS.ApplyShim = bh);
    ch && (window.ShadyCSS.CustomStyleInterface = ch);

    (function (a) {
      function b(a) {
        "" == a && (f.call(this), this.i = !0);
        return a.toLowerCase();
      }

      function c(a) {
        var b = a.charCodeAt(0);
        return 32 < b && 127 > b && -1 == [34, 35, 60, 62, 63, 96].indexOf(b) ? a : encodeURIComponent(a);
      }

      function d(a) {
        var b = a.charCodeAt(0);
        return 32 < b && 127 > b && -1 == [34, 35, 60, 62, 96].indexOf(b) ? a : encodeURIComponent(a);
      }

      function e(a, e, g) {
        function h(a) {}

        var k = e || "scheme start",
            x = 0,
            q = "",
            u = !1,
            Q = !1;

        a: for (; (void 0 != a[x - 1] || 0 == x) && !this.i;) {
          var l = a[x];

          switch (k) {
            case "scheme start":
              if (l && p.test(l)) q += l.toLowerCase(), k = "scheme";else if (e) {
                break a;
              } else {
                q = "";
                k = "no scheme";
                continue;
              }
              break;

            case "scheme":
              if (l && G.test(l)) q += l.toLowerCase();else if (":" == l) {
                this.h = q;
                q = "";
                if (e) break a;
                void 0 !== m[this.h] && (this.B = !0);
                k = "file" == this.h ? "relative" : this.B && g && g.h == this.h ? "relative or authority" : this.B ? "authority first slash" : "scheme data";
              } else if (e) {
                break a;
              } else {
                q = "";
                x = 0;
                k = "no scheme";
                continue;
              }
              break;

            case "scheme data":
              "?" == l ? (this.o = "?", k = "query") : "#" == l ? (this.v = "#", k = "fragment") : void 0 != l && "\t" != l && "\n" != l && "\r" != l && (this.la += c(l));
              break;

            case "no scheme":
              if (g && void 0 !== m[g.h]) {
                k = "relative";
                continue;
              } else f.call(this), this.i = !0;

              break;

            case "relative or authority":
              if ("/" == l && "/" == a[x + 1]) k = "authority ignore slashes";else {
                k = "relative";
                continue;
              }
              break;

            case "relative":
              this.B = !0;
              "file" != this.h && (this.h = g.h);

              if (void 0 == l) {
                this.j = g.j;
                this.m = g.m;
                this.l = g.l.slice();
                this.o = g.o;
                this.s = g.s;
                this.g = g.g;
                break a;
              } else if ("/" == l || "\\" == l) k = "relative slash";else if ("?" == l) this.j = g.j, this.m = g.m, this.l = g.l.slice(), this.o = "?", this.s = g.s, this.g = g.g, k = "query";else if ("#" == l) this.j = g.j, this.m = g.m, this.l = g.l.slice(), this.o = g.o, this.v = "#", this.s = g.s, this.g = g.g, k = "fragment";else {
                k = a[x + 1];
                var y = a[x + 2];
                if ("file" != this.h || !p.test(l) || ":" != k && "|" != k || void 0 != y && "/" != y && "\\" != y && "?" != y && "#" != y) this.j = g.j, this.m = g.m, this.s = g.s, this.g = g.g, this.l = g.l.slice(), this.l.pop();
                k = "relative path";
                continue;
              }

              break;

            case "relative slash":
              if ("/" == l || "\\" == l) k = "file" == this.h ? "file host" : "authority ignore slashes";else {
                "file" != this.h && (this.j = g.j, this.m = g.m, this.s = g.s, this.g = g.g);
                k = "relative path";
                continue;
              }
              break;

            case "authority first slash":
              if ("/" == l) k = "authority second slash";else {
                k = "authority ignore slashes";
                continue;
              }
              break;

            case "authority second slash":
              k = "authority ignore slashes";

              if ("/" != l) {
                continue;
              }

              break;

            case "authority ignore slashes":
              if ("/" != l && "\\" != l) {
                k = "authority";
                continue;
              }

              break;

            case "authority":
              if ("@" == l) {
                u && (q += "%40");
                u = !0;

                for (l = 0; l < q.length; l++) y = q[l], "\t" == y || "\n" == y || "\r" == y ? h("Invalid whitespace in authority.") : ":" == y && null === this.g ? this.g = "" : (y = c(y), null !== this.g ? this.g += y : this.s += y);

                q = "";
              } else if (void 0 == l || "/" == l || "\\" == l || "?" == l || "#" == l) {
                x -= q.length;
                q = "";
                k = "host";
                continue;
              } else q += l;

              break;

            case "file host":
              if (void 0 == l || "/" == l || "\\" == l || "?" == l || "#" == l) {
                2 != q.length || !p.test(q[0]) || ":" != q[1] && "|" != q[1] ? (0 != q.length && (this.j = b.call(this, q), q = ""), k = "relative path start") : k = "relative path";
                continue;
              } else "\t" == l || "\n" == l || "\r" == l ? h("Invalid whitespace in file host.") : q += l;

              break;

            case "host":
            case "hostname":
              if (":" != l || Q) {
                if (void 0 == l || "/" == l || "\\" == l || "?" == l || "#" == l) {
                  this.j = b.call(this, q);
                  q = "";
                  k = "relative path start";
                  if (e) break a;
                  continue;
                } else "\t" != l && "\n" != l && "\r" != l ? ("[" == l ? Q = !0 : "]" == l && (Q = !1), q += l) : h("Invalid code point in host/hostname: " + l);
              } else if (this.j = b.call(this, q), q = "", k = "port", "hostname" == e) break a;

              break;

            case "port":
              if (/[0-9]/.test(l)) q += l;else if (void 0 == l || "/" == l || "\\" == l || "?" == l || "#" == l || e) {
                "" != q && (q = parseInt(q, 10), q != m[this.h] && (this.m = q + ""), q = "");
                if (e) break a;
                k = "relative path start";
                continue;
              } else "\t" == l || "\n" == l || "\r" == l ? h("Invalid code point in port: " + l) : (f.call(this), this.i = !0);
              break;

            case "relative path start":
              k = "relative path";
              if ("/" != l && "\\" != l) continue;
              break;

            case "relative path":
              if (void 0 != l && "/" != l && "\\" != l && (e || "?" != l && "#" != l)) "\t" != l && "\n" != l && "\r" != l && (q += c(l));else {
                if (y = n[q.toLowerCase()]) q = y;
                ".." == q ? (this.l.pop(), "/" != l && "\\" != l && this.l.push("")) : "." == q && "/" != l && "\\" != l ? this.l.push("") : "." != q && ("file" == this.h && 0 == this.l.length && 2 == q.length && p.test(q[0]) && "|" == q[1] && (q = q[0] + ":"), this.l.push(q));
                q = "";
                "?" == l ? (this.o = "?", k = "query") : "#" == l && (this.v = "#", k = "fragment");
              }
              break;

            case "query":
              e || "#" != l ? void 0 != l && "\t" != l && "\n" != l && "\r" != l && (this.o += d(l)) : (this.v = "#", k = "fragment");
              break;

            case "fragment":
              void 0 != l && "\t" != l && "\n" != l && "\r" != l && (this.v += l);
          }

          x++;
        }
      }

      function f() {
        this.s = this.la = this.h = "";
        this.g = null;
        this.m = this.j = "";
        this.l = [];
        this.v = this.o = "";
        this.B = this.i = !1;
      }

      function g(a, b) {
        void 0 === b || b instanceof g || (b = new g(String(b)));
        this.a = a;
        f.call(this);
        a = this.a.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, "");
        e.call(this, a, null, b);
      }

      var h = !1;

      try {
        var k = new URL("b", "http://a");
        k.pathname = "c%20d";
        h = "http://a/c%20d" === k.href;
      } catch (x) {}

      if (!h) {
        var m = Object.create(null);
        m.ftp = 21;
        m.file = 0;
        m.gopher = 70;
        m.http = 80;
        m.https = 443;
        m.ws = 80;
        m.wss = 443;
        var n = Object.create(null);
        n["%2e"] = ".";
        n[".%2e"] = "..";
        n["%2e."] = "..";
        n["%2e%2e"] = "..";
        var p = /[a-zA-Z]/,
            G = /[a-zA-Z0-9\+\-\.]/;
        g.prototype = {
          toString: function () {
            return this.href;
          },

          get href() {
            if (this.i) return this.a;
            var a = "";
            if ("" != this.s || null != this.g) a = this.s + (null != this.g ? ":" + this.g : "") + "@";
            return this.protocol + (this.B ? "//" + a + this.host : "") + this.pathname + this.o + this.v;
          },

          set href(a) {
            f.call(this);
            e.call(this, a);
          },

          get protocol() {
            return this.h + ":";
          },

          set protocol(a) {
            this.i || e.call(this, a + ":", "scheme start");
          },

          get host() {
            return this.i ? "" : this.m ? this.j + ":" + this.m : this.j;
          },

          set host(a) {
            !this.i && this.B && e.call(this, a, "host");
          },

          get hostname() {
            return this.j;
          },

          set hostname(a) {
            !this.i && this.B && e.call(this, a, "hostname");
          },

          get port() {
            return this.m;
          },

          set port(a) {
            !this.i && this.B && e.call(this, a, "port");
          },

          get pathname() {
            return this.i ? "" : this.B ? "/" + this.l.join("/") : this.la;
          },

          set pathname(a) {
            !this.i && this.B && (this.l = [], e.call(this, a, "relative path start"));
          },

          get search() {
            return this.i || !this.o || "?" == this.o ? "" : this.o;
          },

          set search(a) {
            !this.i && this.B && (this.o = "?", "?" == a[0] && (a = a.slice(1)), e.call(this, a, "query"));
          },

          get hash() {
            return this.i || !this.v || "#" == this.v ? "" : this.v;
          },

          set hash(a) {
            this.i || (a ? (this.v = "#", "#" == a[0] && (a = a.slice(1)), e.call(this, a, "fragment")) : this.v = "");
          },

          get origin() {
            var a;
            if (this.i || !this.h) return "";

            switch (this.h) {
              case "data":
              case "file":
              case "javascript":
              case "mailto":
                return "null";
            }

            return (a = this.host) ? this.h + "://" + a : "";
          }

        };
        var u = a.URL;
        u && (g.createObjectURL = function (a) {
          return u.createObjectURL.apply(u, arguments);
        }, g.revokeObjectURL = function (a) {
          u.revokeObjectURL(a);
        });
        a.URL = g;
      }
    })(window);

    Object.getOwnPropertyDescriptor(Node.prototype, "baseURI") || Object.defineProperty(Node.prototype, "baseURI", {
      get: function () {
        var a = (this.ownerDocument || this).querySelector("base[href]");
        return a && a.href || window.location.href;
      },
      configurable: !0,
      enumerable: !0
    });
    var dh = document.createElement("style");
    dh.textContent = "body {transition: opacity ease-in 0.2s; } \nbody[unresolved] {opacity: 0; display: block; overflow: hidden; position: relative; } \n";
    var eh = document.querySelector("head");
    eh.insertBefore(dh, eh.firstChild);
    var fh = window.customElements,
        gh = !1,
        hh = null;
    fh.polyfillWrapFlushCallback && fh.polyfillWrapFlushCallback(function (a) {
      hh = a;
      gh && a();
    });

    function ih() {
      window.HTMLTemplateElement.bootstrap && window.HTMLTemplateElement.bootstrap(window.document);
      hh && hh();
      gh = !0;
      window.WebComponents.ready = !0;
      document.dispatchEvent(new CustomEvent("WebComponentsReady", {
        bubbles: !0
      }));
    }

    "complete" !== document.readyState ? (window.addEventListener("load", ih), window.addEventListener("DOMContentLoaded", function () {
      window.removeEventListener("load", ih);
      ih();
    })) : ih();
  }).call(window);
}();

const {
  prototype,
  assign,
  create,
  keys,
  freeze
} = Object;

/**
 * 调用堆栈
 * - 存放当前正在计算依赖的方法的 dependentsOptions 依赖集合数组
 * - [ dependentsOptions, dependentsOptions, ... ]
 */
const targetStack = [];

var isObject = (
/**
 * 判断传入对象是否是 Object 类型且不为 null
 * @param {any} value 需要判断的对象
 */
value => value !== null && typeof value === 'object');

var isEqual = (
/**
 * 判断传入的两个值是否相等
 * @param {any} value 需要判断的对象
 * @param {any} value2 需要判断的对象
 */
(value, value2) => {
  return !(value2 !== value && (value2 === value2 || value === value));
});

const {
  // apply,
  // construct,
  defineProperty,
  deleteProperty,
  // enumerate,
  // get,
  getOwnPropertyDescriptor,
  // getPrototypeOf,
  has,
  // isExtensible,
  ownKeys // preventExtensions,
  // set,
  // setPrototypeOf

} = Reflect;

var emptyObject = freeze({});

var isFunction = (
/**
 * 判断传入对象是否是 Function 类型
 * @param {any} value 需要判断的对象
 */
value => typeof value === 'function');

const {
  hasOwnProperty
} = prototype;

/**
 * 存放原始对象和观察者对象及其选项参数的映射
 */

const observeMap = new WeakMap();
/**
 * 存放观察者对象和观察者对象选项参数的映射
 */

const observeProxyMap = new WeakMap();
/**
 * 为传入对象创建观察者
 */

function observe(target, options) {
  // 如果创建过观察者
  // 则返回之前创建的观察者
  if (observeMap.has(target)) return observeMap.get(target).proxy; // 如果传入的就是观察者对象
  // 则直接返回

  if (observeProxyMap.has(target)) return target; // 否则立即创建观察者进行返回

  return createObserver(target, options);
}

function createObserver(target, options = {}) {
  /** 当前对象的观察者对象 */
  const proxy = new Proxy(target, {
    get: createObserverProxyGetter(options.get),
    set: createObserverProxySetter(options.set),
    ownKeys: observerProxyOwnKeys,
    deleteProperty: createObserverProxyDeleteProperty(options.deleteProperty)
  });
  /** 观察者对象选项参数 */

  const observeOptions = {
    // 可以使用观察者对象来获取原始对象
    target,
    // 可以使用原始对象来获取观察者对象
    proxy,
    // 当前对象的子级的被监听数据
    watches: create(null),
    // 当前对象的被深度监听数据
    deepWatches: new Set(),
    // 上次的值
    lastValue: create(null)
  }; // 存储观察者选项参数

  observeMap.set(target, observeOptions);
  observeProxyMap.set(proxy, observeOptions);
  return proxy;
}
/**
 * 创建依赖收集的响应方法
 */


const createObserverProxyGetter = ({
  before
} = emptyObject) => (target, name, targetProxy) => {
  // @return 0: 从原始对象放行
  if (before) {
    const beforeResult = before(target, name, targetProxy);

    if (beforeResult === 0) {
      return target[name];
    }
  } // 需要获取的值是使用 Object.defineProperty 定义的属性


  if ((getOwnPropertyDescriptor(target, name) || emptyObject).get) {
    return target[name];
  } // 获取当前值


  const value = target[name]; // 如果获取的是原型上的方法

  if (isFunction(value) && !hasOwnProperty.call(target, name) && has(target, name)) {
    return value;
  } // 获取当前在收集依赖的那个方法的参数


  const dependentsOptions = targetStack[targetStack.length - 1]; // 观察者选项参数

  const observeOptions = observeMap.get(target); // 当前有正在收集依赖的方法

  if (dependentsOptions) {
    const {
      watches
    } = observeOptions;
    let watch = watches[name]; // 当前参数没有被监听过, 初始化监听数组

    if (!watch) {
      watch = new Set();
      watches[name] = watch;
    } // 添加依赖方法信息到 watch
    // 当前值被改变时, 会调用依赖方法


    watch.add(dependentsOptions); // 添加 watch 的信息到依赖收集去
    // 当依赖方法被重新调用, 会移除依赖

    dependentsOptions.deps.add(watch);
  } // 存储本次值


  observeOptions.lastValue[name] = value; // 如果获取的值是对象类型
  // 则返回它的观察者对象

  return isObject(value) ? observe(value) : value;
};
/**
 * 创建响应更新方法
 */


const createObserverProxySetter = ({
  before
} = emptyObject) => (target, name, value, targetProxy) => {
  // @return 0: 阻止设置值
  if (before) {
    const beforeResult = before(target, name, value, targetProxy);

    if (beforeResult === 0) {
      return false;
    }
  } // 需要修改的值是使用 Object.defineProperty 定义的属性


  if ((getOwnPropertyDescriptor(target, name) || emptyObject).set) {
    target[name] = value;
    return true;
  } // 观察者选项参数


  const observeOptions = observeMap.get(target); // 旧值

  const oldValue = name in observeOptions.lastValue ? observeOptions.lastValue[name] : target[name]; // 值完全相等, 不进行修改

  if (isEqual(oldValue, value)) {
    return true;
  } // 改变值


  target[name] = value; // 获取子级监听数据

  const {
    watches,
    deepWatches
  } = observeOptions; // 获取当前参数的被监听数据和父级对象深度监听数据的集合

  let watch = [...(watches[name] || []), ...deepWatches]; // 如果有方法依赖于当前值, 则运行那个方法以达到更新的目的

  if (watch.length) {
    let executes = [];

    for (let dependentsOptions of watch) {
      // 通知所有依赖于此值的计算属性, 下次被访问时要更新值
      if (dependentsOptions.isComputed) {
        dependentsOptions.shouldUpdate = true; // 需要更新有依赖的计算属性

        if (!dependentsOptions.lazy) {
          executes.push(dependentsOptions);
        }
      } // 其它需要更新的依赖
      else {
          executes.push(dependentsOptions);
        }
    }

    for (let dependentsOptions of executes) {
      //           不是计算属性                      需要更新的计算属性
      if (!dependentsOptions.isComputed || dependentsOptions.shouldUpdate) {
        dependentsOptions.update();
      }
    }
  }

  return true;
};
/**
 * 响应以下方式的依赖收集:
 *   - for ... in
 *   - Object.keys
 *   - Object.values
 *   - Object.entries
 *   - Object.getOwnPropertyNames
 *   - Object.getOwnPropertySymbols
 *   - Reflect.ownKeys
 */


const observerProxyOwnKeys = target => {
  // 获取当前在收集依赖的那个方法的参数
  const dependentsOptions = targetStack[targetStack.length - 1]; // 当前有正在收集依赖的方法

  if (dependentsOptions) {
    // 深度监听数据
    const {
      deepWatches
    } = observeMap.get(target); // 标识深度监听

    deepWatches.add(dependentsOptions);
  }

  return ownKeys(target);
};
/**
 * 创建响应从观察者对象删除值的方法
 */


const createObserverProxyDeleteProperty = ({
  before
} = emptyObject) => (target, name) => {
  // @return 0: 禁止删除
  if (before) {
    const beforeResult = before(target, name);

    if (beforeResult === 0) {
      return false;
    }
  }

  return deleteProperty(target, name);
};

var isSymbol = (
/**
 * 判断传入对象是否是 Symbol 类型
 * @param {any} value 需要判断的对象
 */
value => typeof value === 'symbol');

var cached = (
/**
 * 创建一个可以缓存方法返回值的方法
 */
fn => {
  const cache = create(null);
  return str => {
    if (str in cache) return cache[str];
    return cache[str] = fn(str);
  };
});

var isReserved = /**
 * 判断字符串首字母是否为 $
 * @param {String} value
 */
cached(value => {
  const charCode = (value + '').charCodeAt(0);
  return charCode === 0x24;
});

var isSymbolOrNotReserved = (
/**
 * 判断传入名称是否是 Symbol 类型或是首字母不为 $ 的字符串
 * @param { string | symbol } name 需要判断的名称
 */
name => {
  return isSymbol(name) || !isReserved(name);
});

var isString = (
/**
 * 判断传入对象是否是 String 类型
 * @param {any} value 需要判断的对象
 */
value => typeof value === 'string');

var observeHu = {
  set: {
    before: (target, name) => {
      return isSymbolOrNotReserved(name) ? null : 0;
    }
  },
  get: {
    before: (target, name) => {
      return isString(name) && isReserved(name) ? 0 : null;
    }
  },
  deleteProperty: {
    before: (target, name) => {
      return isString(name) && isReserved(name) ? 0 : null;
    }
  }
};

const {
  isArray
} = Array;

var isPlainObject = (
/**
 * 判断传入对象是否是纯粹的对象
 * @param {any} value 需要判断的对象
 */
value => Object.prototype.toString.call(value) === '[object Object]');

var each = (
/**
 * 对象遍历方法
 * @param {{}} obj 需要遍历的对象
 * @param {( key:string, value: any ) => {}} cb 遍历对象的方法
 */
(obj, cb) => {
  if (obj) {
    const keys = ownKeys(obj);

    for (let key of keys) {
      cb(key, obj[key]);
    }
  }
});

var fromBooleanAttribute = (
/**
 * 序列化为 Boolean 属性
 */
value => value !== null);

var returnArg = (
/**
 * 返回传入的首个参数
 * @param {any} value 需要返回的参数
 */
value => value);

var rHyphenate = /\B([A-Z])/g;

var hyphenate = /**
 * 将驼峰转为以连字符号连接的小写名称
 */
cached(name => {
  return name.replace(rHyphenate, '-$1').toLowerCase();
});

/**
 * 初始化组件 props 配置
 * @param {{}} userOptions 用户传入的组件配置
 * @param {{}} options 格式化后的组件配置
 */

function initProps(userOptions, options) {
  /** 格式化后的 props 配置 */
  const props = options.props = {};
  /** 最终的 prop 与取值 attribute 的映射 */

  const propsMap = options.propsMap = {};
  /** 用户传入的 props 配置 */

  const userProps = userOptions.props;
  /** 用户传入的 props 配置是否是数组 */

  let propsIsArray = false; // 去除不合法参数

  if (userProps == null || !((propsIsArray = isArray(userProps)) || isPlainObject(userProps))) {
    return;
  } // 格式化数组参数


  if (propsIsArray) {
    if (!userProps.length) return;

    for (let name of userProps) {
      props[name] = initProp(name, null);
    }
  } // 格式化 JSON 参数
  else {
      each(userProps, (name, prop) => {
        props[name] = initProp(name, prop);
      });
    } // 生成 propsMap


  each(props, (name, prop) => {
    const {
      attr
    } = prop;

    if (attr) {
      const map = propsMap[attr] || (propsMap[attr] = []);
      map.push({
        name,
        from: prop.from || returnArg
      });
    }
  });
}
/**
 * 格式化组件 prop 配置
 * @param { string | symbol } name prop 名称
 * @param { {} | null } prop 用户传入的 prop
 */

function initProp(name, prop) {
  /** 格式化后的 props 配置 */
  const options = {};
  initPropAttribute(name, prop, options);

  if (prop) {
    // 单纯设置变量类型
    if (isFunction(prop)) {
      options.from = prop;
    } // 高级用法
    else {
        initPropType(prop, options);
        initPropDefault(prop, options);
      }
  } // 如果传入值是 Boolean 类型, 则需要另外处理


  if (options.from === Boolean) {
    options.from = fromBooleanAttribute;
  }

  return options;
}
/**
 * 初始化 options.attr
 */


function initPropAttribute(name, prop, options) {
  // 当前 prop 是否是 Symbol 类型的
  options.isSymbol = isSymbol(name); // 当前 prop 的取值 attribute

  options.attr = prop && prop.attr || (options.isSymbol // 没有定义 attr 名称且是 symbol 类型的 attr 名称, 则不设置 attr 名称
  ? null // 驼峰转为以连字符号连接的小写 attr 名称
  : hyphenate(name));
}
/**
 * 初始化 options.type 变量类型
 */


function initPropType(prop, options) {
  const type = prop.type;

  if (type != null) {
    // String || Number || Boolean || function( value ){ return value };
    if (isFunction(type)) {
      options.from = type;
    } // {
    //   from(){}
    //   to(){}
    // }
    else if (isPlainObject(type)) {
        if (isFunction(type.from)) options.from = type.from;
        if (isFunction(type.to)) options.to = type.to;
      }
  }
}
/**
 * 初始化 options.default 默认值
 */


function initPropDefault(prop, options) {
  if ('default' in prop) {
    const $default = prop.default;

    if (isFunction($default) || !isObject($default)) {
      options.default = $default;
    }
  }
}

var noop = (
/**
 * 空方法
 */
() => {});

function initLifecycle(userOptions, options) {
  [
  /** 在实例初始化后立即调用, 但是 computed, watch 还未初始化 */
  'beforeCreate',
  /** 在实例创建完成后被立即调用, 但是挂载阶段还没开始 */
  'created',
  /** 在自定义元素挂载开始之前被调用 */
  'beforeMount',
  /** 在自定义元素挂载开始之后被调用, 组件 DOM 已挂载 */
  'mounted',
  /** 数据更新时调用, 还未更新组件 DOM */
  'beforeUpdate',
  /** 数据更新时调用, 已更新组件 DOM */
  'updated',
  /** 实例销毁之前调用。在这一步，实例仍然完全可用 */
  'beforeDestroy',
  /** 实例销毁后调用 */
  'destroyed'].forEach(name => {
    const lifecycle = userOptions[name];
    options[name] = isFunction(lifecycle) ? lifecycle : noop;
  });
}

function initState(isCustomElement, userOptions, options) {
  const {
    methods,
    data,
    computed,
    watch
  } = userOptions;

  if (methods) {
    initMethods(methods, options);
  }

  if (data) {
    initData(isCustomElement, data, options);
  }

  if (computed) {
    initComputed(computed, options);
  }

  if (watch) {
    initWatch(watch, options);
  }
}

function initMethods(userMethods, options) {
  const methods = options.methods = {};
  each(userMethods, (key, method) => {
    isFunction(method) && (methods[key] = method);
  });
}

function initData(isCustomElement, userData, options) {
  if (isFunction(userData) || !isCustomElement && isPlainObject(userData)) {
    options.data = userData;
  }
}

function initComputed(userComputed, options) {
  const computed = options.computed = {};
  each(userComputed, (key, userComputed) => {
    if (userComputed) {
      const isFn = isFunction(userComputed);
      const get = isFn ? userComputed : userComputed.get || noop;
      const set = isFn ? noop : userComputed.set || noop;
      computed[key] = {
        get,
        set
      };
    }
  });
}

function initWatch(userWatch, options) {
  const watch = options.watch = {};
  each(userWatch, (key, handler) => {
    if (isArray(handler)) {
      for (const handler of handler) {
        createWatcher(key, handler, watch);
      }
    } else {
      createWatcher(key, handler, watch);
    }
  });
}

function createWatcher(key, handler, watch) {
  watch[key] = isPlainObject(handler) ? handler : {
    handler
  };
}

const inBrowser = typeof window !== 'undefined';
const UA = inBrowser && window.navigator.userAgent.toLowerCase();
const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);

function initOther(isCustomElement, userOptions, options) {
  const {
    render
  } = userOptions; // 渲染方法

  options.render = isFunction(render) ? render : null;

  if (inBrowser && !isCustomElement) {
    // 挂载目标
    options.el = userOptions.el || undefined;
  }
}

const optionsMap = {};
/**
 * 初始化组件配置
 * @param {boolean} isCustomElement 是否是初始化自定义元素
 * @param {string} name 自定义元素标签名
 * @param {{}} _userOptions 用户传入的组件配置
 */

function initOptions(isCustomElement, name, _userOptions) {
  /** 克隆一份用户配置 */
  const userOptions = assign({}, _userOptions);
  /** 格式化后的组件配置 */

  const options = optionsMap[name] = {};
  initProps(userOptions, options);
  initState(isCustomElement, userOptions, options);
  initLifecycle(userOptions, options);
  initOther(isCustomElement, userOptions, options);
  return [userOptions, options];
}

let uid = 0;
var uid$1 = (
/**
 * 返回一个字符串 UID
 */
() => '' + uid++);

var define = (
/**
 * 在传入对象上定义可枚举可删除的一个新属性
 * 
 * @param {any} 需要定义属性的对象
 * @param {string} attribute 需要定义的属性名称
 * @param {function} get 属性的 getter 方法
 * @param {function} set 属性的 setter 方法
 */
(obj, attribute, get, set) => {
  defineProperty(obj, attribute, {
    enumerable: true,
    configurable: true,
    get,
    set
  });
});

const callbacks = [];
let pending = false;

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;

  for (let copy of copies) copy();
}

const resolve = Promise.resolve();

const timerFunc = () => {
  resolve.then(flushCallbacks);

  if (isIOS) {
    setTimeout(noop);
  }
};

function nextTick(callback, ctx) {
  let resolve;
  callbacks.push(() => {
    if (callback) {
      callback.call(ctx);
    } else {
      resolve(ctx);
    }
  });

  if (!pending) {
    pending = true;
    timerFunc();
  }

  if (!callback) {
    return new Promise(_resolve => {
      resolve = _resolve;
    });
  }
}

/** 异步更新队列 */

const queue = new Set();
/** 是否已经有一个队列正在执行了 */

let waiting = false;
/**
 * 将一个更新请求放入队列中
 */

function queueUpdate(dependentsOptions) {
  if (queue.has(dependentsOptions)) {
    return;
  } else {
    queue.add(dependentsOptions);
  } // 如果当前没有异步更新队列在执行
  // 那么就执行当前的异步更新队列
  // 如果有的话
  // 当前的更新请求就会被当前的异步更新队列执行掉


  if (!waiting) {
    waiting = true;
    nextTick(flushSchedulerQueue);
  }
}
/**
 * 执行异步更新队列
 */

function flushSchedulerQueue() {
  for (let dependentsOptions of queue) {
    // 略过在等待队列执行的过程中就已经被更新了的计算属性
    if (dependentsOptions.isComputed && !dependentsOptions.shouldUpdate) {
      continue;
    }

    dependentsOptions.get();
  }

  queue.clear();
  waiting = false;
}

/**
 * 依赖集合
 * - 存放所有已收集到的依赖
 * - { id: dependentsOptions, ... }
 */

const dependentsMap = create(null);
/**
 * 返回一个方法为传入方法收集依赖
 */

function createCollectingDependents() {
  const cd = new CollectingDependents(...arguments);
  const {
    get,
    id
  } = cd; // 存储当前方法的依赖
  // 可以在下次收集依赖的时候对这次收集的依赖进行清空

  dependentsMap[id] = cd; // 存储当前收集依赖的 ID 到方法
  // - 未被其它方法依赖的计算属性可以用它来获取依赖参数判断是否被更新

  get.id = id;
  return get;
}

class CollectingDependents {
  /**
   * @param {function} fn 需要收集依赖的方法
   * @param {boolean} isComputed 是否是计算属性
   * @param {boolean} isWatch 是否是用于创建监听方法
   * @param {boolean} isWatchDeep 是否是用于创建深度监听
   */
  constructor(fn, isComputed, isWatch, isWatchDeep, observeOptions, name) {
    // 当前方法收集依赖的 ID, 用于从 dependentsMap ( 存储 / 读取 ) 依赖项
    this.id = uid$1(); // 当前方法的依赖存储数组

    this.deps = new Set(); // 需要收集依赖的方法

    this.fn = fn; // 当其中一个依赖更新后, 会调用当前方法重新计算依赖

    this.get = CollectingDependents.get.bind(this); // 存储其他参数

    if (isComputed) {
      let shouldUpdate;
      this.isComputed = isComputed;
      this.observeOptions = observeOptions;
      this.name = name; // 依赖是否需要更新 ( 无依赖时可只在使用时进行更新 )

      define(this, 'shouldUpdate', () => shouldUpdate, value => {
        if (shouldUpdate = value) this.ssu();
      });
    }

    if (isWatch) {
      this.isWatch = isWatch;
      this.isWatchDeep = isWatchDeep;
    }
  }
  /** 传入方法的依赖收集包装 */


  static get(result) {
    // 清空依赖
    this.cleanDeps(); // 标记已初始化

    this.isInit = true; // 标记计算属性已无需更新

    if (this.isComputed) this.shouldUpdate = false; // 开始收集依赖

    targetStack.push(this); // 执行方法
    // 方法执行的过程中触发响应对象的 getter 而将依赖存储进 deps

    result = this.fn(); // 需要进行深度监听

    if (this.isWatchDeep) this.wd(result); // 方法执行完成, 则依赖收集完成

    targetStack.pop(this);
    return result;
  }
  /** 依赖的重新收集 */


  update() {
    queueUpdate(this);
  }
  /** 清空之前收集的依赖 */


  cleanDeps() {
    // 对之前收集的依赖进行清空
    for (let watch of this.deps) watch.delete(this); // 清空依赖


    this.deps.clear();
  }
  /** 仅为监听方法时使用 -> 对依赖的最终返回值进行深度监听 ( watch deep ) */


  wd(result) {
    isObject(result) && observeProxyMap.get(result).deepWatches.add(this);
  }
  /** 仅为计算属性时使用 -> 遍历依赖于当前计算属性的依赖参数 ( each ) */


  ec(callback) {
    let {
      watches
    } = this.observeOptions;
    let watch;

    if (watches && (watch = watches[this.name]) && watch.size) {
      for (let cd of watch) if (callback(cd) === false) break;
    }
  }
  /** 仅为计算属性时使用 -> 递归设置当前计算属性的依赖计算属性需要更新 ( set should update ) */


  ssu() {
    this.ec(cd => {
      if (cd.isComputed && cd.lazy) {
        cd.shouldUpdate = true;
      }
    });
  }
  /** 仅为计算属性时使用 -> 判断当前计算属性是否没有依赖 */


  get lazy() {
    let lazy = true;
    this.ec(cd => {
      // 依赖是监听方法          依赖是 render 方法                依赖是计算属性且有依赖
      if (cd.isWatch || !cd.isComputed && !cd.isWatch || cd.isComputed && !cd.lazy) {
        return lazy = false;
      }
    });
    return lazy;
  }

}

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
const directives = new WeakMap();
/**
 * Brands a function as a directive so that lit-html will call the function
 * during template rendering, rather than passing as a value.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object
 *
 * @example
 *
 * ```
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 * ```
 */
// tslint:disable-next-line:no-any

const directive = f => (...args) => {
  const d = f(...args);
  directives.set(d, true);
  return d;
};
const isDirective = o => {
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

/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = window.customElements !== undefined && window.customElements.polyfillWrapFlushCallback !== undefined;
/**
 * Reparents nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), into another container (could be the same container), before
 * `beforeNode`. If `beforeNode` is null, it appends the nodes to the
 * container.
 */

const reparentNodes = (container, start, end = null, before = null) => {
  let node = start;

  while (node !== end) {
    const n = node.nextSibling;
    container.insertBefore(node, before);
    node = n;
  }
};
/**
 * Removes nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), from `container`.
 */

const removeNodes = (container, startNode, endNode = null) => {
  let node = startNode;

  while (node !== endNode) {
    const n = node.nextSibling;
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
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */

const nothing = {};

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
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */

const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */

const boundAttributeSuffix = '$lit$';
/**
 * An updateable Template that tracks the location of dynamic parts.
 */

class Template {
  constructor(result, element) {
    this.parts = [];
    this.element = element;
    let index = -1;
    let partIndex = 0;
    const nodesToRemove = [];

    const _prepareTemplate = template => {
      const content = template.content; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
      // null

      const walker = document.createTreeWalker(content, 133
      /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
      , null, false); // Keeps track of the last index associated with a part. We try to delete
      // unnecessary nodes, but we never want to associate two different parts
      // to the same index. They must have a constant node between.

      let lastPartIndex = 0;

      while (walker.nextNode()) {
        index++;
        const node = walker.currentNode;

        if (node.nodeType === 1
        /* Node.ELEMENT_NODE */
        ) {
            if (node.hasAttributes()) {
              const attributes = node.attributes; // Per
              // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
              // attributes are not guaranteed to be returned in document order.
              // In particular, Edge/IE can return them out of order, so we cannot
              // assume a correspondance between part index and attribute index.

              let count = 0;

              for (let i = 0; i < attributes.length; i++) {
                if (attributes[i].value.indexOf(marker) >= 0) {
                  count++;
                }
              }

              while (count-- > 0) {
                // Get the template literal section leading up to the first
                // expression in this attribute
                const stringForPart = result.strings[partIndex]; // Find the attribute name

                const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
                // All bound attributes have had a suffix added in
                // TemplateResult#getHTML to opt out of special attribute
                // handling. To look up the attribute value we also need to add
                // the suffix.

                const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                const attributeValue = node.getAttribute(attributeLookupName);
                const strings = attributeValue.split(markerRegex);
                this.parts.push({
                  type: 'attribute',
                  index,
                  name,
                  strings
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
            const data = node.data;

            if (data.indexOf(marker) >= 0) {
              const parent = node.parentNode;
              const strings = data.split(markerRegex);
              const lastIndex = strings.length - 1; // Generate a new text node for each literal section
              // These nodes are also used as the markers for node parts

              for (let i = 0; i < lastIndex; i++) {
                parent.insertBefore(strings[i] === '' ? createMarker() : document.createTextNode(strings[i]), node);
                this.parts.push({
                  type: 'node',
                  index: ++index
                });
              } // If there's no text, we must insert a comment to mark our place.
              // Else, we can trust it will stick around after cloning.


              if (strings[lastIndex] === '') {
                parent.insertBefore(createMarker(), node);
                nodesToRemove.push(node);
              } else {
                node.data = strings[lastIndex];
              } // We have a part for each match found


              partIndex += lastIndex;
            }
          } else if (node.nodeType === 8
        /* Node.COMMENT_NODE */
        ) {
            if (node.data === marker) {
              const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
              // the following are true:
              //  * We don't have a previousSibling
              //  * The previousSibling is already the start of a previous part

              if (node.previousSibling === null || index === lastPartIndex) {
                index++;
                parent.insertBefore(createMarker(), node);
              }

              lastPartIndex = index;
              this.parts.push({
                type: 'node',
                index
              }); // If we don't have a nextSibling, keep this node so we have an end.
              // Else, we can remove it to save future costs.

              if (node.nextSibling === null) {
                node.data = '';
              } else {
                nodesToRemove.push(node);
                index--;
              }

              partIndex++;
            } else {
              let i = -1;

              while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                // Comment node has a binding marker inside, make an inactive part
                // The binding won't work, but subsequent bindings will
                // TODO (justinfagnani): consider whether it's even worth it to
                // make bindings in comments work
                this.parts.push({
                  type: 'node',
                  index: -1
                });
              }
            }
          }
      }
    };

    _prepareTemplate(element); // Remove text binding nodes after the walk to not disturb the TreeWalker


    for (const n of nodesToRemove) {
      n.parentNode.removeChild(n);
    }
  }

}
const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
// small manual size-savings.

const createMarker = () => document.createComment('');
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

const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

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
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */

class TemplateInstance {
  constructor(template, processor, options) {
    this._parts = [];
    this.template = template;
    this.processor = processor;
    this.options = options;
  }

  update(values) {
    let i = 0;

    for (const part of this._parts) {
      if (part !== undefined) {
        part.setValue(values[i]);
      }

      i++;
    }

    for (const part of this._parts) {
      if (part !== undefined) {
        part.commit();
      }
    }
  }

  _clone() {
    // When using the Custom Elements polyfill, clone the node, rather than
    // importing it, to keep the fragment in the template's document. This
    // leaves the fragment inert so custom elements won't upgrade and
    // potentially modify their contents by creating a polyfilled ShadowRoot
    // while we traverse the tree.
    const fragment = isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
    const parts = this.template.parts;
    let partIndex = 0;
    let nodeIndex = 0;

    const _prepareInstance = fragment => {
      // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
      // null
      const walker = document.createTreeWalker(fragment, 133
      /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
      , null, false);
      let node = walker.nextNode(); // Loop through all the nodes and parts of a template

      while (partIndex < parts.length && node !== null) {
        const part = parts[partIndex]; // Consecutive Parts may have the same node index, in the case of
        // multiple bound attributes on an element. So each iteration we either
        // increment the nodeIndex, if we aren't on a node with a part, or the
        // partIndex if we are. By not incrementing the nodeIndex when we find a
        // part, we allow for the next part to be associated with the current
        // node if neccessasry.

        if (!isTemplatePartActive(part)) {
          this._parts.push(undefined);

          partIndex++;
        } else if (nodeIndex === part.index) {
          if (part.type === 'node') {
            const part = this.processor.handleTextExpression(this.options);
            part.insertAfterNode(node.previousSibling);

            this._parts.push(part);
          } else {
            this._parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
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

}

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
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */

class TemplateResult {
  constructor(strings, values, type, processor) {
    this.strings = strings;
    this.values = values;
    this.type = type;
    this.processor = processor;
  }
  /**
   * Returns a string of HTML used to create a `<template>` element.
   */


  getHTML() {
    const endIndex = this.strings.length - 1;
    let html = '';

    for (let i = 0; i < endIndex; i++) {
      const s = this.strings[i]; // This exec() call does two things:
      // 1) Appends a suffix to the bound attribute name to opt out of special
      // attribute value parsing that IE11 and Edge do, like for style and
      // many SVG attributes. The Template class also appends the same suffix
      // when looking up attributes to create Parts.
      // 2) Adds an unquoted-attribute-safe marker for the first expression in
      // an attribute. Subsequent attribute expressions will use node markers,
      // and this is safe since attributes with multiple expressions are
      // guaranteed to be quoted.

      const match = lastAttributeNameRegex.exec(s);

      if (match) {
        // We're starting a new bound attribute.
        // Add the safe attribute suffix, and use unquoted-attribute-safe
        // marker.
        html += s.substr(0, match.index) + match[1] + match[2] + boundAttributeSuffix + match[3] + marker;
      } else {
        // We're either in a bound node, or trailing bound attribute.
        // Either way, nodeMarker is safe to use.
        html += s + nodeMarker;
      }
    }

    return html + this.strings[endIndex];
  }

  getTemplateElement() {
    const template = document.createElement('template');
    template.innerHTML = this.getHTML();
    return template;
  }

}

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
const isPrimitive = value => {
  return value === null || !(typeof value === 'object' || typeof value === 'function');
};
/**
 * Sets attribute values for AttributeParts, so that the value is only set once
 * even if there are multiple parts for an attribute.
 */

class AttributeCommitter {
  constructor(element, name, strings) {
    this.dirty = true;
    this.element = element;
    this.name = name;
    this.strings = strings;
    this.parts = [];

    for (let i = 0; i < strings.length - 1; i++) {
      this.parts[i] = this._createPart();
    }
  }
  /**
   * Creates a single part. Override this to create a differnt type of part.
   */


  _createPart() {
    return new AttributePart(this);
  }

  _getValue() {
    const strings = this.strings;
    const l = strings.length - 1;
    let text = '';

    for (let i = 0; i < l; i++) {
      text += strings[i];
      const part = this.parts[i];

      if (part !== undefined) {
        const v = part.value;

        if (v != null && (Array.isArray(v) || // tslint:disable-next-line:no-any
        typeof v !== 'string' && v[Symbol.iterator])) {
          for (const t of v) {
            text += typeof t === 'string' ? t : String(t);
          }
        } else {
          text += typeof v === 'string' ? v : String(v);
        }
      }
    }

    text += strings[l];
    return text;
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element.setAttribute(this.name, this._getValue());
    }
  }

}
class AttributePart {
  constructor(comitter) {
    this.value = undefined;
    this.committer = comitter;
  }

  setValue(value) {
    if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
      this.value = value; // If the value is a not a directive, dirty the committer so that it'll
      // call setAttribute. If the value is a directive, it'll dirty the
      // committer if it calls setValue().

      if (!isDirective(value)) {
        this.committer.dirty = true;
      }
    }
  }

  commit() {
    while (isDirective(this.value)) {
      const directive$$1 = this.value;
      this.value = noChange;
      directive$$1(this);
    }

    if (this.value === noChange) {
      return;
    }

    this.committer.commit();
  }

}
class NodePart {
  constructor(options) {
    this.value = undefined;
    this._pendingValue = undefined;
    this.options = options;
  }
  /**
   * Inserts this part into a container.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendInto(container) {
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


  insertAfterNode(ref) {
    this.startNode = ref;
    this.endNode = ref.nextSibling;
  }
  /**
   * Appends this part into a parent part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendIntoPart(part) {
    part._insert(this.startNode = createMarker());

    part._insert(this.endNode = createMarker());
  }
  /**
   * Appends this part after `ref`
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterPart(ref) {
    ref._insert(this.startNode = createMarker());

    this.endNode = ref.endNode;
    ref.endNode = this.startNode;
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while (isDirective(this._pendingValue)) {
      const directive$$1 = this._pendingValue;
      this._pendingValue = noChange;
      directive$$1(this);
    }

    const value = this._pendingValue;

    if (value === noChange) {
      return;
    }

    if (isPrimitive(value)) {
      if (value !== this.value) {
        this._commitText(value);
      }
    } else if (value instanceof TemplateResult) {
      this._commitTemplateResult(value);
    } else if (value instanceof Node) {
      this._commitNode(value);
    } else if (Array.isArray(value) || // tslint:disable-next-line:no-any
    value[Symbol.iterator]) {
      this._commitIterable(value);
    } else if (value === nothing) {
      this.value = nothing;
      this.clear();
    } else {
      // Fallback, will render the string representation
      this._commitText(value);
    }
  }

  _insert(node) {
    this.endNode.parentNode.insertBefore(node, this.endNode);
  }

  _commitNode(value) {
    if (this.value === value) {
      return;
    }

    this.clear();

    this._insert(value);

    this.value = value;
  }

  _commitText(value) {
    const node = this.startNode.nextSibling;
    value = value == null ? '' : value;

    if (node === this.endNode.previousSibling && node.nodeType === 3
    /* Node.TEXT_NODE */
    ) {
        // If we only have a single text node between the markers, we can just
        // set its value, rather than replacing it.
        // TODO(justinfagnani): Can we just check if this.value is primitive?
        node.data = value;
      } else {
      this._commitNode(document.createTextNode(typeof value === 'string' ? value : String(value)));
    }

    this.value = value;
  }

  _commitTemplateResult(value) {
    const template = this.options.templateFactory(value);

    if (this.value instanceof TemplateInstance && this.value.template === template) {
      this.value.update(value.values);
    } else {
      // Make sure we propagate the template processor from the TemplateResult
      // so that we use its syntax extension, etc. The template factory comes
      // from the render function options so that it can control template
      // caching and preprocessing.
      const instance = new TemplateInstance(template, value.processor, this.options);

      const fragment = instance._clone();

      instance.update(value.values);

      this._commitNode(fragment);

      this.value = instance;
    }
  }

  _commitIterable(value) {
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


    const itemParts = this.value;
    let partIndex = 0;
    let itemPart;

    for (const item of value) {
      // Try to reuse an existing part
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

    if (partIndex < itemParts.length) {
      // Truncate the parts array so _value reflects the current state
      itemParts.length = partIndex;
      this.clear(itemPart && itemPart.endNode);
    }
  }

  clear(startNode = this.startNode) {
    removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
  }

}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */

class BooleanAttributePart {
  constructor(element, name, strings) {
    this.value = undefined;
    this._pendingValue = undefined;

    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
      throw new Error('Boolean attributes can only contain a single expression');
    }

    this.element = element;
    this.name = name;
    this.strings = strings;
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while (isDirective(this._pendingValue)) {
      const directive$$1 = this._pendingValue;
      this._pendingValue = noChange;
      directive$$1(this);
    }

    if (this._pendingValue === noChange) {
      return;
    }

    const value = !!this._pendingValue;

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

}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */

class PropertyCommitter extends AttributeCommitter {
  constructor(element, name, strings) {
    super(element, name, strings);
    this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
  }

  _createPart() {
    return new PropertyPart(this);
  }

  _getValue() {
    if (this.single) {
      return this.parts[0].value;
    }

    return super._getValue();
  }

  commit() {
    if (this.dirty) {
      this.dirty = false; // tslint:disable-next-line:no-any

      this.element[this.name] = this._getValue();
    }
  }

}
class PropertyPart extends AttributePart {} // Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the thrid
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.

let eventOptionsSupported = false;

try {
  const options = {
    get capture() {
      eventOptionsSupported = true;
      return false;
    }

  }; // tslint:disable-next-line:no-any

  window.addEventListener('test', options, options); // tslint:disable-next-line:no-any

  window.removeEventListener('test', options, options);
} catch (_e) {}

class EventPart {
  constructor(element, eventName, eventContext) {
    this.value = undefined;
    this._pendingValue = undefined;
    this.element = element;
    this.eventName = eventName;
    this.eventContext = eventContext;

    this._boundHandleEvent = e => this.handleEvent(e);
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while (isDirective(this._pendingValue)) {
      const directive$$1 = this._pendingValue;
      this._pendingValue = noChange;
      directive$$1(this);
    }

    if (this._pendingValue === noChange) {
      return;
    }

    const newListener = this._pendingValue;
    const oldListener = this.value;
    const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
    const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

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

  handleEvent(event) {
    if (typeof this.value === 'function') {
      this.value.call(this.eventContext || this.element, event);
    } else {
      this.value.handleEvent(event);
    }
  }

} // We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.

const getOptions = o => o && (eventOptionsSupported ? {
  capture: o.capture,
  passive: o.passive,
  once: o.once
} : o.capture);

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
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */

function templateFactory(result) {
  let templateCache = templateCaches.get(result.type);

  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };
    templateCaches.set(result.type, templateCache);
  }

  let template = templateCache.stringsArray.get(result.strings);

  if (template !== undefined) {
    return template;
  } // If the TemplateStringsArray is new, generate a key from the strings
  // This key is shared between all templates with identical content


  const key = result.strings.join(marker); // Check if we already have a Template for this key

  template = templateCache.keyString.get(key);

  if (template === undefined) {
    // If we have not seen this key before, create a new Template
    template = new Template(result, result.getTemplateElement()); // Cache the Template for this key

    templateCache.keyString.set(key, template);
  } // Cache all future queries for this TemplateStringsArray


  templateCache.stringsArray.set(result.strings, template);
  return template;
}
const templateCaches = new Map();

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
const parts = new WeakMap();
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

const render = (result, container, options) => {
  let part = parts.get(container);

  if (part === undefined) {
    removeNodes(container, container.firstChild);
    parts.set(container, part = new NodePart(Object.assign({
      templateFactory
    }, options)));
    part.appendInto(container);
  }

  part.setValue(result);
  part.commit();
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
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time

(window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.0.0');

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
// TODO(kschaaf): Refactor into Part API?

const createAndInsertPart = (containerPart, beforePart) => {
  const container = containerPart.startNode.parentNode;
  const beforeNode = beforePart === undefined ? containerPart.endNode : beforePart.startNode;
  const startNode = container.insertBefore(createMarker(), beforeNode);
  container.insertBefore(createMarker(), beforeNode);
  const newPart = new NodePart(containerPart.options);
  newPart.insertAfterNode(startNode);
  return newPart;
};

const updatePart = (part, value) => {
  part.setValue(value);
  part.commit();
  return part;
};

const insertPartBefore = (containerPart, part, ref) => {
  const container = containerPart.startNode.parentNode;
  const beforeNode = ref ? ref.startNode : containerPart.endNode;
  const endNode = part.endNode.nextSibling;

  if (endNode !== beforeNode) {
    reparentNodes(container, part.startNode, endNode, beforeNode);
  }
};

const removePart = part => {
  removeNodes(part.startNode.parentNode, part.startNode, part.endNode.nextSibling);
}; // Helper for generating a map of array item to its index over a subset
// of an array (used to lazily generate `newKeyToIndexMap` and
// `oldKeyToIndexMap`)


const generateMap = (list, start, end) => {
  const map = new Map();

  for (let i = start; i <= end; i++) {
    map.set(list[i], i);
  }

  return map;
}; // Stores previous ordered list of parts and map of key to index


const partListCache = new WeakMap();
const keyListCache = new WeakMap();
/**
 * A directive that repeats a series of values (usually `TemplateResults`)
 * generated from an iterable, and updates those items efficiently when the
 * iterable changes based on user-provided `keys` associated with each item.
 *
 * Note that if a `keyFn` is provided, strict key-to-DOM mapping is maintained,
 * meaning previous DOM for a given key is moved into the new position if
 * needed, and DOM will never be reused with values for different keys (new DOM
 * will always be created for new keys). This is generally the most efficient
 * way to use `repeat` since it performs minimum unnecessary work for insertions
 * amd removals.
 *
 * IMPORTANT: If providing a `keyFn`, keys *must* be unique for all items in a
 * given call to `repeat`. The behavior when two or more items have the same key
 * is undefined.
 *
 * If no `keyFn` is provided, this directive will perform similar to mapping
 * items to values, and DOM will be reused against potentially different items.
 */

const repeat = directive((items, keyFnOrTemplate, template) => {
  let keyFn;

  if (template === undefined) {
    template = keyFnOrTemplate;
  } else if (keyFnOrTemplate !== undefined) {
    keyFn = keyFnOrTemplate;
  }

  return containerPart => {
    if (!(containerPart instanceof NodePart)) {
      throw new Error('repeat can only be used in text bindings');
    } // Old part & key lists are retrieved from the last update
    // (associated with the part for this instance of the directive)


    const oldParts = partListCache.get(containerPart) || [];
    const oldKeys = keyListCache.get(containerPart) || []; // New part list will be built up as we go (either reused from
    // old parts or created for new keys in this update). This is
    // saved in the above cache at the end of the update.

    const newParts = []; // New value list is eagerly generated from items along with a
    // parallel array indicating its key.

    const newValues = [];
    const newKeys = [];
    let index = 0;

    for (const item of items) {
      newKeys[index] = keyFn ? keyFn(item, index) : index;
      newValues[index] = template(item, index);
      index++;
    } // Maps from key to index for current and previous update; these
    // are generated lazily only when needed as a performance
    // optimization, since they are only required for multiple
    // non-contiguous changes in the list, which are less common.


    let newKeyToIndexMap;
    let oldKeyToIndexMap; // Head and tail pointers to old parts and new values

    let oldHead = 0;
    let oldTail = oldParts.length - 1;
    let newHead = 0;
    let newTail = newValues.length - 1; // Overview of O(n) reconciliation algorithm (general approach
    // based on ideas found in ivi, vue, snabbdom, etc.):
    //
    // * We start with the list of old parts and new values (and
    // arrays of
    //   their respective keys), head/tail pointers into each, and
    //   we build up the new list of parts by updating (and when
    //   needed, moving) old parts or creating new ones. The initial
    //   scenario might look like this (for brevity of the diagrams,
    //   the numbers in the array reflect keys associated with the
    //   old parts or new values, although keys and parts/values are
    //   actually stored in parallel arrays indexed using the same
    //   head/tail pointers):
    //
    //      oldHead v                 v oldTail
    //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
    //   newParts: [ ,  ,  ,  ,  ,  ,  ]
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6] <- reflects the user's new
    //   item order
    //      newHead ^                 ^ newTail
    //
    // * Iterate old & new lists from both sides, updating,
    // swapping, or
    //   removing parts at the head/tail locations until neither
    //   head nor tail can move.
    //
    // * Example below: keys at head pointers match, so update old
    // part 0 in-
    //   place (no need to move it) and record part 0 in the
    //   `newParts` list. The last thing we do is advance the
    //   `oldHead` and `newHead` pointers (will be reflected in the
    //   next diagram).
    //
    //      oldHead v                 v oldTail
    //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
    //   newParts: [0,  ,  ,  ,  ,  ,  ] <- heads matched: update 0
    //   and newKeys:  [0, 2, 1, 4, 3, 7, 6]    advance both oldHead
    //   & newHead
    //      newHead ^                 ^ newTail
    //
    // * Example below: head pointers don't match, but tail pointers
    // do, so
    //   update part 6 in place (no need to move it), and record
    //   part 6 in the `newParts` list. Last, advance the `oldTail`
    //   and `oldHead` pointers.
    //
    //         oldHead v              v oldTail
    //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
    //   newParts: [0,  ,  ,  ,  ,  , 6] <- tails matched: update 6
    //   and newKeys:  [0, 2, 1, 4, 3, 7, 6]    advance both oldTail
    //   & newTail
    //         newHead ^              ^ newTail
    //
    // * If neither head nor tail match; next check if one of the
    // old head/tail
    //   items was removed. We first need to generate the reverse
    //   map of new keys to index (`newKeyToIndexMap`), which is
    //   done once lazily as a performance optimization, since we
    //   only hit this case if multiple non-contiguous changes were
    //   made. Note that for contiguous removal anywhere in the
    //   list, the head and tails would advance from either end and
    //   pass each other before we get to this case and removals
    //   would be handled in the final while loop without needing to
    //   generate the map.
    //
    // * Example below: The key at `oldTail` was removed (no longer
    // in the
    //   `newKeyToIndexMap`), so remove that part from the DOM and
    //   advance just the `oldTail` pointer.
    //
    //         oldHead v           v oldTail
    //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
    //   newParts: [0,  ,  ,  ,  ,  , 6] <- 5 not in new map; remove
    //   5 and newKeys:  [0, 2, 1, 4, 3, 7, 6]    advance oldTail
    //         newHead ^           ^ newTail
    //
    // * Once head and tail cannot move, any mismatches are due to
    // either new or
    //   moved items; if a new key is in the previous "old key to
    //   old index" map, move the old part to the new location,
    //   otherwise create and insert a new part. Note that when
    //   moving an old part we null its position in the oldParts
    //   array if it lies between the head and tail so we know to
    //   skip it when the pointers get there.
    //
    // * Example below: neither head nor tail match, and neither
    // were removed;
    //   so find the `newHead` key in the `oldKeyToIndexMap`, and
    //   move that old part's DOM into the next head position
    //   (before `oldParts[oldHead]`). Last, null the part in the
    //   `oldPart` array since it was somewhere in the remaining
    //   oldParts still to be scanned (between the head and tail
    //   pointers) so that we know to skip that old part on future
    //   iterations.
    //
    //         oldHead v        v oldTail
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
    //   newParts: [0, 2,  ,  ,  ,  , 6] <- stuck; update & move 2
    //   into place newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance
    //   newHead
    //         newHead ^           ^ newTail
    //
    // * Note that for moves/insertions like the one above, a part
    // inserted at
    //   the head pointer is inserted before the current
    //   `oldParts[oldHead]`, and a part inserted at the tail
    //   pointer is inserted before `newParts[newTail+1]`. The
    //   seeming asymmetry lies in the fact that new parts are moved
    //   into place outside in, so to the right of the head pointer
    //   are old parts, and to the right of the tail pointer are new
    //   parts.
    //
    // * We always restart back from the top of the algorithm,
    // allowing matching
    //   and simple updates in place to continue...
    //
    // * Example below: the head pointers once again match, so
    // simply update
    //   part 1 and record it in the `newParts` array.  Last,
    //   advance both head pointers.
    //
    //         oldHead v        v oldTail
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
    //   newParts: [0, 2, 1,  ,  ,  , 6] <- heads matched; update 1
    //   and newKeys:  [0, 2, 1, 4, 3, 7, 6]    advance both oldHead
    //   & newHead
    //            newHead ^        ^ newTail
    //
    // * As mentioned above, items that were moved as a result of
    // being stuck
    //   (the final else clause in the code below) are marked with
    //   null, so we always advance old pointers over these so we're
    //   comparing the next actual old value on either end.
    //
    // * Example below: `oldHead` is null (already placed in
    // newParts), so
    //   advance `oldHead`.
    //
    //            oldHead v     v oldTail
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6] // old head already used;
    //   advance newParts: [0, 2, 1,  ,  ,  , 6] // oldHead newKeys:
    //   [0, 2, 1, 4, 3, 7, 6]
    //               newHead ^     ^ newTail
    //
    // * Note it's not critical to mark old parts as null when they
    // are moved
    //   from head to tail or tail to head, since they will be
    //   outside the pointer range and never visited again.
    //
    // * Example below: Here the old tail key matches the new head
    // key, so
    //   the part at the `oldTail` position and move its DOM to the
    //   new head position (before `oldParts[oldHead]`). Last,
    //   advance `oldTail` and `newHead` pointers.
    //
    //               oldHead v  v oldTail
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
    //   newParts: [0, 2, 1, 4,  ,  , 6] <- old tail matches new
    //   head: update newKeys:  [0, 2, 1, 4, 3, 7, 6]   & move 4,
    //   advance oldTail & newHead
    //               newHead ^     ^ newTail
    //
    // * Example below: Old and new head keys match, so update the
    // old head
    //   part in place, and advance the `oldHead` and `newHead`
    //   pointers.
    //
    //               oldHead v oldTail
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
    //   newParts: [0, 2, 1, 4, 3,   ,6] <- heads match: update 3
    //   and advance newKeys:  [0, 2, 1, 4, 3, 7, 6]    oldHead &
    //   newHead
    //                  newHead ^  ^ newTail
    //
    // * Once the new or old pointers move past each other then all
    // we have
    //   left is additions (if old list exhausted) or removals (if
    //   new list exhausted). Those are handled in the final while
    //   loops at the end.
    //
    // * Example below: `oldHead` exceeded `oldTail`, so we're done
    // with the
    //   main loop.  Create the remaining part and insert it at the
    //   new head position, and the update is complete.
    //
    //                   (oldHead > oldTail)
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
    //   newParts: [0, 2, 1, 4, 3, 7 ,6] <- create and insert 7
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]
    //                     newHead ^ newTail
    //
    // * Note that the order of the if/else clauses is not important
    // to the
    //   algorithm, as long as the null checks come first (to ensure
    //   we're always working on valid old parts) and that the final
    //   else clause comes last (since that's where the expensive
    //   moves occur). The order of remaining clauses is is just a
    //   simple guess at which cases will be most common.
    //
    // * TODO(kschaaf) Note, we could calculate the longest
    // increasing
    //   subsequence (LIS) of old items in new position, and only
    //   move those not in the LIS set. However that costs O(nlogn)
    //   time and adds a bit more code, and only helps make rare
    //   types of mutations require fewer moves. The above handles
    //   removes, adds, reversal, swaps, and single moves of
    //   contiguous items in linear time, in the minimum number of
    //   moves. As the number of multiple moves where LIS might help
    //   approaches a random shuffle, the LIS optimization becomes
    //   less helpful, so it seems not worth the code at this point.
    //   Could reconsider if a compelling case arises.

    while (oldHead <= oldTail && newHead <= newTail) {
      if (oldParts[oldHead] === null) {
        // `null` means old part at head has already been used
        // below; skip
        oldHead++;
      } else if (oldParts[oldTail] === null) {
        // `null` means old part at tail has already been used
        // below; skip
        oldTail--;
      } else if (oldKeys[oldHead] === newKeys[newHead]) {
        // Old head matches new head; update in place
        newParts[newHead] = updatePart(oldParts[oldHead], newValues[newHead]);
        oldHead++;
        newHead++;
      } else if (oldKeys[oldTail] === newKeys[newTail]) {
        // Old tail matches new tail; update in place
        newParts[newTail] = updatePart(oldParts[oldTail], newValues[newTail]);
        oldTail--;
        newTail--;
      } else if (oldKeys[oldHead] === newKeys[newTail]) {
        // Old head matches new tail; update and move to new tail
        newParts[newTail] = updatePart(oldParts[oldHead], newValues[newTail]);
        insertPartBefore(containerPart, oldParts[oldHead], newParts[newTail + 1]);
        oldHead++;
        newTail--;
      } else if (oldKeys[oldTail] === newKeys[newHead]) {
        // Old tail matches new head; update and move to new head
        newParts[newHead] = updatePart(oldParts[oldTail], newValues[newHead]);
        insertPartBefore(containerPart, oldParts[oldTail], oldParts[oldHead]);
        oldTail--;
        newHead++;
      } else {
        if (newKeyToIndexMap === undefined) {
          // Lazily generate key-to-index maps, used for removals &
          // moves below
          newKeyToIndexMap = generateMap(newKeys, newHead, newTail);
          oldKeyToIndexMap = generateMap(oldKeys, oldHead, oldTail);
        }

        if (!newKeyToIndexMap.has(oldKeys[oldHead])) {
          // Old head is no longer in new list; remove
          removePart(oldParts[oldHead]);
          oldHead++;
        } else if (!newKeyToIndexMap.has(oldKeys[oldTail])) {
          // Old tail is no longer in new list; remove
          removePart(oldParts[oldTail]);
          oldTail--;
        } else {
          // Any mismatches at this point are due to additions or
          // moves; see if we have an old part we can reuse and move
          // into place
          const oldIndex = oldKeyToIndexMap.get(newKeys[newHead]);
          const oldPart = oldIndex !== undefined ? oldParts[oldIndex] : null;

          if (oldPart === null) {
            // No old part for this value; create a new one and
            // insert it
            const newPart = createAndInsertPart(containerPart, oldParts[oldHead]);
            updatePart(newPart, newValues[newHead]);
            newParts[newHead] = newPart;
          } else {
            // Reuse old part
            newParts[newHead] = updatePart(oldPart, newValues[newHead]);
            insertPartBefore(containerPart, oldPart, oldParts[oldHead]); // This marks the old part as having been used, so that
            // it will be skipped in the first two checks above

            oldParts[oldIndex] = null;
          }

          newHead++;
        }
      }
    } // Add parts for any remaining new values


    while (newHead <= newTail) {
      // For all remaining additions, we insert before last new
      // tail, since old pointers are no longer valid
      const newPart = createAndInsertPart(containerPart, newParts[newTail + 1]);
      updatePart(newPart, newValues[newHead]);
      newParts[newHead++] = newPart;
    } // Remove any remaining unused old parts


    while (oldHead <= oldTail) {
      const oldPart = oldParts[oldHead++];

      if (oldPart !== null) {
        removePart(oldPart);
      }
    } // Save order of new parts for next round


    partListCache.set(containerPart, newParts);
    keyListCache.set(containerPart, newKeys);
  };
});

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
// unsafeHTML directive, and the DocumentFragment that was last set as a value.
// The DocumentFragment is used as a unique key to check if the last value
// rendered to the part was with unsafeHTML. If not, we'll always re-render the
// value passed to unsafeHTML.

const previousValues = new WeakMap();
/**
 * Renders the result as HTML, rather than text.
 *
 * Note, this is unsafe to use with any user-provided input that hasn't been
 * sanitized or escaped, as it may lead to cross-site-scripting
 * vulnerabilities.
 */

const unsafeHTML = directive(value => part => {
  if (!(part instanceof NodePart)) {
    throw new Error('unsafeHTML can only be used in text bindings');
  }

  const previousValue = previousValues.get(part);

  if (previousValue !== undefined && isPrimitive(value) && value === previousValue.value && part.value === previousValue.fragment) {
    return;
  }

  const template = document.createElement('template');
  template.innerHTML = value; // innerHTML casts to string internally

  const fragment = document.importNode(template.content, true);
  part.setValue(fragment);
  previousValues.set(part, {
    value,
    fragment
  });
});

var rWhitespace = /\s+/;

/**
 * 存放上次设置的 class 内容
 */

const classesMap = new WeakMap();
/**
 * 格式化用户传入的 class 内容
 */

function parseClass(classes, value) {
  switch (typeof value) {
    case 'string':
      {
        value.split(rWhitespace).forEach(name => {
          return classes[name] = true;
        });
        break;
      }


    case 'object':
      {
        if (isArray(value)) {
          value.forEach(name => {
            return parseClass(classes, name);
          });
        } else {
          each(value, (name, truthy) => {
            return truthy ? parseClass(classes, name) : delete classes[name];
          });
        }
      }
  }
}

class ClassPart {
  constructor(element) {
    this.element = element;
  }

  setValue(value) {
    parseClass(this.value = {}, value);
  }

  commit() {
    const {
      value: classes,
      element: {
        classList
      }
    } = this; // 非首次运行

    if (classesMap.has(this)) {
      const oldClasses = classesMap.get(this); // 移除旧 class

      each(oldClasses, name => {
        name in classes || classList.remove(name);
      }); // 添加新 class

      each(classes, name => {
        name in oldClasses || classList.add(name);
      });
    } // 首次运行
    else {
        each(classes, name => {
          return classList.add(name);
        });
      } // 保存最新的 classes


    classesMap.set(this, classes);
  }

}

var rListDelimiter = /;(?![^(]*\))/g;

var rPropertyDelimiter = /:(.+)/;

var parseStyleText = /**
 * 解析 style 字符串, 转换为 JSON 格式
 * @param {String} value
 */
cached(styleText => {
  const styles = {};
  styleText.split(rListDelimiter).forEach(item => {
    if (item) {
      const tmp = item.split(rPropertyDelimiter);

      if (tmp.length > 1) {
        styles[tmp[0].trim()] = tmp[1].trim();
      }
    }
  });
  return styles;
});

/**
 * 存放上次设置的 style 内容
 */

const styleMap = new WeakMap();
/**
 * 格式化用户传入的 style 内容
 */

function parseStyle(styles, value) {
  switch (typeof value) {
    case 'string':
      {
        return parseStyle(styles, parseStyleText(value));
      }


    case 'object':
      {
        if (isArray(value)) {
          value.forEach(value => {
            return parseStyle(styles, value);
          });
        } else {
          each(value, (name, value) => {
            return styles[hyphenate(name)] = value;
          });
        }
      }
  }
}

class stylePart {
  constructor(element) {
    this.element = element;
  }

  setValue(value) {
    parseStyle(this.value = {}, value);
  }

  commit() {
    const {
      value: styles,
      element: {
        style
      }
    } = this;
    const oldStyles = styleMap.get(this); // 移除旧 style

    each(oldStyles, (name, value) => {
      name in styles || style.removeProperty(name);
    }); // 添加 style

    each(styles, (name, value) => {
      style.setProperty(name, value);
    }); // 保存最新的 styles

    styleMap.set(this, styles);
  }

}

class TemplateProcessor {
  handleAttributeExpressions(element, name, strings, options) {
    const prefix = name[0]; // 用于绑定 DOM 属性 ( property )

    if (prefix === '.') {
      const comitter = new PropertyCommitter(element, name.slice(1), strings);
      return comitter.parts;
    } // 事件绑定
    else if (prefix === '@') {
        return [new EventPart(element, name.slice(1), options.eventContext)];
      } // 若属性的值为真则保留 DOM 属性
      // 否则移除 DOM 属性
      else if (prefix === '?') {
          return [new BooleanAttributePart(element, name.slice(1), strings)];
        } // 扩展属性支持
        else if (prefix === ':') {
            const [currentName, ...options] = name.slice(1).split('.');

            if (currentName in attrHandler) {
              return [new attrHandler[currentName](element, currentName, strings, options)];
            }
          } // 正常属性
          else {
              const comitter = new AttributeCommitter(element, name, strings);
              return comitter.parts;
            }
  }

  handleTextExpression(options) {
    return new NodePart(options);
  }

}

var templateProcessor = new TemplateProcessor();
/**
 * 存放指定属性的特殊处理
 */

const attrHandler = {
  class: ClassPart,
  style: stylePart
};

function html$1(strings, ...values) {
  return new TemplateResult(strings, values, 'html', templateProcessor);
}

html$1.repeat = (items, userKey, template) => {
  const key = isString(userKey) ? item => item[userKey] : userKey;
  return repeat(items, key, template);
};

html$1.unsafeHTML = html$1.unsafe = unsafeHTML;

/** 迫使 Hu 实例重新渲染 */

var initForceUpdate = ((name, target, targetProxy) => {
  /** 当前实例的实例配置 */
  const userRender = optionsMap[name].render;

  if (userRender) {
    target.$forceUpdate = createCollectingDependents(() => {
      const $el = target.$el;

      if ($el) {
        render(userRender.call(targetProxy, html$1), $el);
        target.$refs = getRefs($el);
      }
    });
  } else {
    target.$forceUpdate = noop;
  }
});

function getRefs(root) {
  const refs = {};
  const elems = root.querySelectorAll('[ref]');

  if (elems.length) {
    Array.from(elems).forEach(elem => {
      const name = elem.getAttribute('ref');
      refs[name] = refs[name] ? [].concat(refs[name], elem) : elem;
    });
  }

  return Object.freeze(refs);
}

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
const unicodeLetters = 'a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD';
const bail = new RegExp(`[^${unicodeLetters}.$_\\d]`);
/**
 * Transplant from Vue
 */

function parsePath(path) {
  if (bail.test(path)) {
    return;
  }

  var segments = path.split('.');
  return function () {
    let obj = this;

    for (const segment of segments) {
      if (!obj) return;
      obj = obj[segment];
    }

    return obj;
  };
}

var returnFalse = (
/**
 * 返回 false
 */
() => false);

var createComputed = (
/**
 * @param {{}} computed
 * @param {any} self 计算属性的 this 指向
 * @param {boolean} isWatch 当前是否用于创建监听
 */
(computed, self, isWatch) => {
  /** 当前计算属性容器的子级的一些参数 */
  const computedOptionsMap = new Map();
  /** 当前计算属性容器对象 */

  const computedTarget = create(null);
  /** 当前计算属性容器的观察者对象 */

  const computedTargetProxy = observe(computedTarget);
  /** 当前计算属性容器的获取与修改拦截器 */

  const computedTargetProxyInterceptor = new Proxy(computedTargetProxy, {
    get: computedTargetProxyInterceptorGet(computedOptionsMap),
    set: computedTargetProxyInterceptorSet(computedOptionsMap),
    deleteProperty: returnFalse
  });
  /** 给当前计算属性添加子级的方法 */

  const appendComputed = createAppendComputed.call(self, computedTarget, computedTargetProxy, computedOptionsMap, isWatch);
  /** 给当前计算属性移除子级的方法, 目前仅有监听需要使用 */

  let removeComputed = isWatch ? createRemoveComputed.call(self, computedOptionsMap) : void 0; // 添加计算属性

  each(computed, appendComputed);
  return [computedTarget, computedTargetProxyInterceptor, appendComputed, removeComputed];
});
/**
 * 返回添加单个计算属性的方法
 */

function createAppendComputed(computedTarget, computedTargetProxy, computedOptionsMap, isWatch) {
  const isComputed = !isWatch;
  const observeOptions = isComputed && observeMap.get(computedTarget);
  /**
   * @param {string} name 计算属性存储的名称
   * @param {{}} computed 计算属性 getter / setter 对象
   * @param {boolean} isWatchDeep 当前计算属性是否是用于创建深度监听
   */

  return (name, computed, isWatchDeep) => {
    /** 计算属性的 setter */
    const set = (computed.set || noop).bind(this);
    /** 计算属性的 getter */

    const get = computed.get.bind(this);
    /** 计算属性的 getter 依赖收集包装 */

    const collectingDependentsGet = createCollectingDependents(() => computedTargetProxy[name] = get(), isComputed, isWatch, isWatchDeep, observeOptions, name); // 添加占位符

    computedTarget[name] = void 0; // 存储计算属性参数

    computedOptionsMap.set(name, {
      id: collectingDependentsGet.id,
      get: collectingDependentsGet,
      set
    });
  };
}
/**
 * 返回移除单个计算属性的方法
 */


function createRemoveComputed(computedOptionsMap) {
  /**
   * @param name 需要移除的计算属性
   */
  return name => {
    // 获取计算属性的参数
    const computedOptions = computedOptionsMap.get(name); // 有这个计算属性

    if (computedOptions) {
      // 清空依赖
      dependentsMap[computedOptions.id].cleanDeps();
    }
  };
}
/**
 * 返回计算属性的获取拦截器
 */


const computedTargetProxyInterceptorGet = computedOptionsMap => (target, name) => {
  // 获取计算属性的参数
  const computedOptions = computedOptionsMap.get(name); // 防止用户通过 $computed 获取不存在的计算属性

  if (computedOptions) {
    const dependentsOptions = dependentsMap[computedOptions.id]; // 计算属性未初始化或需要更新

    if (!dependentsOptions.isInit || dependentsOptions.shouldUpdate) {
      computedOptions.get();
    }
  }

  return target[name];
};
/**
 * 返回计算属性的设置拦截器
 */


const computedTargetProxyInterceptorSet = computedOptionsMap => (target, name, value) => {
  const computedOptions = computedOptionsMap.get(name); // 防止用户通过 $computed 设置不存在的计算属性

  if (computedOptions) {
    return computedOptions.set(value), true;
  }

  return false;
};

/**
 * 存放每个实例的 watch 数据
 */

const watcherMap = new WeakMap();
/**
 * 监听 Hu 实例对象
 */

function $watch(expOrFn, callback, options) {
  let watchFn; // 另一种写法

  if (isPlainObject(callback)) {
    return this.$watch(expOrFn, callback.handler, callback);
  } // 使用键路径表达式


  if (isString(expOrFn)) {
    watchFn = parsePath(expOrFn).bind(this);
  } // 使用计算属性函数
  else if (isFunction(expOrFn)) {
      watchFn = expOrFn.bind(this);
    } // 不支持其他写法
    else return;

  let watchTarget, watchTargetProxyInterceptor, appendComputed, removeComputed;

  if (watcherMap.has(this)) {
    [watchTarget, watchTargetProxyInterceptor, appendComputed, removeComputed] = watcherMap.get(this);
  } else {
    watcherMap.set(this, [watchTarget, watchTargetProxyInterceptor, appendComputed, removeComputed] = createComputed(null, null, true));
  } // 初始化选项参数


  options = options || {};
  /** 当前 watch 的存储名称 */

  const name = uid$1();
  /** 当前 watch 的回调函数 */

  const watchCallback = callback.bind(this);
  /** 监听对象内部值的变化 */

  const isWatchDeep = !!options.deep;
  /** 值改变是否运行回调 */

  let immediate,
      runCallback = immediate = !!options.immediate; // 添加监听

  appendComputed(name, {
    get: () => {
      const oldValue = watchTarget[name];
      const value = watchFn();

      if (runCallback) {
        //   首次运行             值不一样        值一样的话, 判断是否是深度监听
        if (immediate || !isEqual(value, oldValue) || isWatchDeep) {
          watchCallback(value, oldValue);
        }
      }

      return value;
    }
  }, isWatchDeep); // 首次运行, 以收集依赖

  watchTargetProxyInterceptor[name]; // 下次值改变时运行回调

  runCallback = true;
  immediate = false; // 返回取消监听的方法

  return () => {
    removeComputed(name);
  };
}

/**
 * 在下次 DOM 更新循环结束之后执行回调
 */

function $nextTick (callback) {
  return nextTick(callback, this);
}

/**
 * 挂载实例
 */

function $mount (selectors) {
  const {
    $info
  } = this; // 首次挂载

  if (!$info.isMounted) {
    // 使用 new 创建的实例
    if (!$info.isCustomElement) {
      const el = selectors && (isString(selectors) ? document.querySelector(selectors) : selectors);

      if (!el || el === document.body || el === document.documentElement) {
        return this;
      }

      observeProxyMap.get(this).target.$el = el;
    }
    /** 当前实例的实例配置 */


    const options = optionsMap[$info.name];
    /** 当前实例 $info 原始对象 */

    const infoTarget = observeProxyMap.get($info).target; // 运行 beforeMount 生命周期方法

    options.beforeMount.call(this); // 执行 render 方法, 进行渲染

    this.$forceUpdate(); // 标记首次实例挂载已完成

    infoTarget.isMounted = true; // 运行 mounted 生命周期方法

    options.mounted.call(this);
  }

  return this;
}

class HuConstructor {
  constructor(name) {
    /** 当前实例观察者对象 */
    const targetProxy = observe(this, observeHu); // 初始化 $forceUpdate 方法

    initForceUpdate(name, this, targetProxy);
  }

}
assign(HuConstructor.prototype, {
  $watch,
  $mount,
  $nextTick
});

/**
 * 初始化当前组件 props 属性
 * @param {boolean} isCustomElement 是否是初始化自定义元素
 * @param {HTMLElement} root 
 * @param {{}} options 
 * @param {{}} target 
 * @param {{}} targetProxy 
 */

function initProps$1(isCustomElement, root, options, target, targetProxy) {
  const props = options.props;
  const propsTarget = create(null);
  const propsTargetProxy = target.$props = observe(propsTarget); // 尝试从标签上获取 props 属性, 否则取默认值

  each(props, (name, options) => {
    let value = null;

    if (isCustomElement && options.attr) {
      value = root.getAttribute(options.attr);
    } // 定义了该属性


    if (value !== null) {
      propsTarget[name] = (options.from || returnArg)(value);
    } // 使用默认值
    else {
        propsTarget[name] = isFunction(options.default) ? options.default.call(targetProxy) : options.default;
      }
  }); // 将 $props 上的属性在 $hu 上建立引用

  each(props, (name, options) => {
    if (options.isSymbol || !isReserved(name)) {
      define(target, name, () => propsTargetProxy[name], value => propsTargetProxy[name] = value);
    }
  });
}

var injectionToLit = (
/**
 * 在 $hu 上建立对象的映射
 * 
 * @param {{}} litTarget $hu 实例
 * @param {string} key 对象名称
 * @param {any} value 对象值
 * @param {function} set 属性的 getter 方法, 若传值, 则视为使用 Object.defineProperty 对值进行定义
 * @param {function} get 属性的 setter 方法
 */
(litTarget, key, value, set, get) => {
  // 首字母为 $ 则不允许映射到 $hu 实例中去
  if (!isSymbolOrNotReserved(key)) return; // 若在 $hu 下有同名变量, 则删除

  has(litTarget, key) && delete litTarget[key]; // 使用 Object.defineProperty 对值进行定义

  if (set) {
    define(litTarget, key, set, get);
  } // 直接写入到 $hu 上
  else {
      litTarget[key] = value;
    }
});

/**
 * 初始化当前组件 methods 属性
 * @param {{}} options 
 * @param {{}} target 
 * @param {{}} targetProxy 
 */

function initMethods$1(options, target, targetProxy) {
  const methodsTarget = target.$methods = create(null);
  each(options.methods, (name, value) => {
    const method = methodsTarget[name] = value.bind(targetProxy);
    injectionToLit(target, name, method);
  });
}

/**
 * 初始化当前组件 data 属性
 * @param {{}} options 
 * @param {{}} target 
 * @param {{}} targetProxy 
 */

function initData$1(options, target, targetProxy) {
  const dataTarget = create(null);
  const dataTargetProxy = target.$data = observe(dataTarget);
  const {
    data
  } = options;

  if (data) {
    const dataObj = isFunction(data) ? data.call(targetProxy) : data;
    each(dataObj, (name, value) => {
      dataTarget[name] = value;
      injectionToLit(target, name, 0, () => dataTargetProxy[name], value => dataTargetProxy[name] = value);
    });
  }
}

var isEmptyObject = (
/**
 * 判断传入对象是否是一个空对象
 * @param {any} value 需要判断的对象
 */
value => {
  for (let item in value) return false;

  return true;
});

/**
 * 使观察者对象只读 ( 不可删, 不可写 )
 */
var observeReadonly = {
  set: {
    before: () => 0
  },
  deleteProperty: {
    before: () => 0
  }
};

let emptyComputed;
function initComputed$1(options, target, targetProxy) {
  const computed = options.computed; // 如果定义当前实例时未定义 computed 属性
  // 则当前实例的 $computed 就是个普通的观察者对象

  if (isEmptyObject(computed)) {
    return target.$computed = emptyComputed || (emptyComputed = observe({}, observeReadonly));
  }

  const [computedTarget, computedTargetProxyInterceptor] = createComputed(options.computed, targetProxy);
  target.$computed = computedTargetProxyInterceptor; // 将拦截器伪造成观察者对象

  observeProxyMap.set(computedTargetProxyInterceptor, {});
  each(computed, (name, computed) => {
    injectionToLit(target, name, 0, () => computedTargetProxyInterceptor[name], value => computedTargetProxyInterceptor[name] = value);
  });
}

function initWatch$1(options, target, targetProxy) {
  // 添加监听方法
  each(options.watch, (expOrFn, options) => {
    return targetProxy.$watch(expOrFn, options);
  });
}

function initOptions$1(isCustomElement, name, target, userOptions) {
  // Hu 的初始化选项
  target.$options = observe(userOptions, observeReadonly); // Hu 实例信息选项

  target.$info = observe({
    name,
    isMounted: false,
    isCustomElement
  }, observeReadonly);
}

/**
 * 初始化当前组件属性
 * @param {boolean} isCustomElement 是否是初始化自定义元素
 * @param {HTMLElement} root 自定义元素组件节点
 * @param {string} name 组件名称
 * @param {{}} options 组件配置
 * @param {{}} userOptions 用户组件配置
 */

function init(isCustomElement, root, name, options, userOptions) {
  /** 当前实例对象 */
  const target = new HuConstructor(name);
  /** 当前实例观察者对象 */

  const targetProxy = observeMap.get(target).proxy;

  if (isCustomElement) {
    target.$el = root.attachShadow({
      mode: 'open'
    });
    target.$customElement = root;
  }

  initOptions$1(isCustomElement, name, target, userOptions);
  initProps$1(isCustomElement, root, options, target, targetProxy);
  initMethods$1(options, target, targetProxy);
  initData$1(options, target, targetProxy);
  options.beforeCreate.call(targetProxy);
  initComputed$1(options, target, targetProxy);
  initWatch$1(options, target, targetProxy);
  options.created.call(targetProxy);

  if (!isCustomElement && options.el) {
    targetProxy.$mount(options.el);
  }

  return targetProxy;
}

const Hu = new Proxy(HuConstructor, {
  construct(HuConstructor$$1, [_userOptions]) {
    const name = 'anonymous-' + uid$1();
    const [userOptions, options] = initOptions(false, name, _userOptions);
    const targetProxy = init(false, void 0, name, options, userOptions);
    return targetProxy;
  }

});
Hu.version = '1.0.0-bata.0';

var initAttributeChangedCallback = (propsMap => function (name, oldValue, value) {
  if (value === oldValue) return;
  const {
    $props: propsTargetProxy
  } = this.$hu;
  const {
    target: propsTarget
  } = observeProxyMap.get(propsTargetProxy);
  const props = propsMap[name];

  for (const {
    name,
    from
  } of props) {
    const fromValue = from(value);
    isEqual(propsTarget[name], fromValue) || (propsTargetProxy[name] = fromValue);
  }
});

var initDisconnectedCallback = (options => function () {});

var initAdoptedCallback = (options => function () {});

/**
 * 定义自定义元素
 * @param {string} name 标签名
 * @param {{}} _userOptions 组件配置
 */

function define$1(name, _userOptions) {
  const [userOptions, options] = initOptions(true, name, _userOptions);

  class HuElement extends HTMLElement {
    constructor() {
      super();
      this.$hu = init(true, this, name, options, userOptions);
    }

  } // 定义需要监听的属性


  HuElement.observedAttributes = keys(options.propsMap);
  assign(HuElement.prototype, {
    // 自定义元素被添加到文档流
    connectedCallback,
    // 自定义元素被从文档流移除
    disconnectedCallback: initDisconnectedCallback(options),
    // 自定义元素位置被移动
    adoptedCallback: initAdoptedCallback(options),
    // 自定义元素属性被更改
    attributeChangedCallback: initAttributeChangedCallback(options.propsMap)
  }); // 注册组件

  customElements.define(name, HuElement);
}

function connectedCallback() {
  this.$hu.$mount();
}

function render$1(result, container) {
  if (arguments.length > 1) {
    return render(result, container);
  }

  container = result;
  return function () {
    const result = html$1.apply(null, arguments);
    return render(result, container);
  };
}

Hu.observable = obj => {
  return isObject(obj) ? observe(obj) : obj;
};

const otherHu = window.Hu;

Hu.noConflict = () => {
  if (window.Hu === Hu) window.Hu = otherHu;
  return Hu;
};

if (typeof window !== 'undefined') {
  window.Hu = Hu;
}

assign(Hu, {
  define: define$1,
  render: render$1,
  html: html$1,
  nextTick
});

export default Hu;
