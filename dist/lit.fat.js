(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

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
        aa = "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) {
      a != Array.prototype && a != Object.prototype && (a[b] = c.value);
    },
        da = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this;

    function ha() {
      ha = function () {};

      da.Symbol || (da.Symbol = ia);
    }

    var ia = function () {
      var a = 0;
      return function (b) {
        return "jscomp_symbol_" + (b || "") + a++;
      };
    }();

    function ja() {
      ha();
      var a = da.Symbol.iterator;
      a || (a = da.Symbol.iterator = da.Symbol("iterator"));
      "function" != typeof Array.prototype[a] && aa(Array.prototype, a, {
        configurable: !0,
        writable: !0,
        value: function () {
          return ka(this);
        }
      });

      ja = function () {};
    }

    function ka(a) {
      var b = 0;
      return la(function () {
        return b < a.length ? {
          done: !1,
          value: a[b++]
        } : {
          done: !0
        };
      });
    }

    function la(a) {
      ja();
      a = {
        next: a
      };

      a[da.Symbol.iterator] = function () {
        return this;
      };

      return a;
    }

    function ma(a) {
      ja();
      var b = a[Symbol.iterator];
      return b ? b.call(a) : ka(a);
    }

    function na(a) {
      for (var b, c = []; !(b = a.next()).done;) {
        c.push(b.value);
      }

      return c;
    }

    var oa;
    if ("function" == typeof Object.setPrototypeOf) oa = Object.setPrototypeOf;else {
      var pa;

      a: {
        var qa = {
          Ja: !0
        },
            ra = {};

        try {
          ra.__proto__ = qa;
          pa = ra.Ja;
          break a;
        } catch (a) {}

        pa = !1;
      }

      oa = pa ? function (a, b) {
        a.__proto__ = b;
        if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
        return a;
      } : null;
    }
    var sa = oa;

    function ta() {
      this.f = !1;
      this.b = null;
      this.ea = void 0;
      this.a = 1;
      this.G = 0;
      this.c = null;
    }

    function ua(a) {
      if (a.f) throw new TypeError("Generator is already running");
      a.f = !0;
    }

    ta.prototype.v = function (a) {
      this.ea = a;
    };

    function va(a, b) {
      a.c = {
        Ma: b,
        Ra: !0
      };
      a.a = a.G;
    }

    ta.prototype.return = function (a) {
      this.c = {
        return: a
      };
      this.a = this.G;
    };

    function wa(a, b) {
      a.a = 3;
      return {
        value: b
      };
    }

    function xa(a) {
      this.a = new ta();
      this.b = a;
    }

    function ya(a, b) {
      ua(a.a);
      var c = a.a.b;
      if (c) return Ba(a, "return" in c ? c["return"] : function (a) {
        return {
          value: a,
          done: !0
        };
      }, b, a.a.return);
      a.a.return(b);
      return Ca(a);
    }

    function Ba(a, b, c, d) {
      try {
        var e = b.call(a.a.b, c);
        if (!(e instanceof Object)) throw new TypeError("Iterator result " + e + " is not an object");
        if (!e.done) return a.a.f = !1, e;
        var f = e.value;
      } catch (g) {
        return a.a.b = null, va(a.a, g), Ca(a);
      }

      a.a.b = null;
      d.call(a.a, f);
      return Ca(a);
    }

    function Ca(a) {
      for (; a.a.a;) {
        try {
          var b = a.b(a.a);
          if (b) return a.a.f = !1, {
            value: b.value,
            done: !1
          };
        } catch (c) {
          a.a.ea = void 0, va(a.a, c);
        }
      }

      a.a.f = !1;

      if (a.a.c) {
        b = a.a.c;
        a.a.c = null;
        if (b.Ra) throw b.Ma;
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

    function Da(a) {
      this.next = function (b) {
        ua(a.a);
        a.a.b ? b = Ba(a, a.a.b.next, b, a.a.v) : (a.a.v(b), b = Ca(a));
        return b;
      };

      this.throw = function (b) {
        ua(a.a);
        a.a.b ? b = Ba(a, a.a.b["throw"], b, a.a.v) : (va(a.a, b), b = Ca(a));
        return b;
      };

      this.return = function (b) {
        return ya(a, b);
      };

      ja();

      this[Symbol.iterator] = function () {
        return this;
      };
    }

    function Ea(a, b) {
      b = new Da(new xa(b));
      sa && sa(b, a.prototype);
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

      var b = /Trident/.test(navigator.userAgent);
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

        if (c) for (var d in c) {
          window.Event[d] = c[d];
        }
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

        if (b) for (d in b) {
          window.MouseEvent[d] = b[d];
        }
        window.MouseEvent.prototype = b.prototype;
      }

      Array.from || (Array.from = function (a) {
        return [].slice.call(a);
      });
      Object.assign || (Object.assign = function (a, b) {
        for (var c = [].slice.call(arguments, 1), d = 0, e; d < c.length; d++) {
          if (e = c[d]) for (var f = a, n = e, p = Object.getOwnPropertyNames(n), G = 0; G < p.length; G++) {
            e = p[G], f[e] = n[e];
          }
        }

        return a;
      });
    })(window.WebComponents);

    (function () {
      function a() {}

      function b(a, b) {
        if (!a.childNodes.length) return [];

        switch (a.nodeType) {
          case Node.DOCUMENT_NODE:
            return R.call(a, b);

          case Node.DOCUMENT_FRAGMENT_NODE:
            return Cb.call(a, b);

          default:
            return w.call(a, b);
        }
      }

      var c = "undefined" === typeof HTMLTemplateElement,
          d = !(document.createDocumentFragment().cloneNode() instanceof DocumentFragment),
          e = !1;
      /Trident/.test(navigator.userAgent) && function () {
        function a(a, b) {
          if (a instanceof DocumentFragment) for (var d; d = a.firstChild;) {
            c.call(this, d, b);
          } else c.call(this, a, b);
          return a;
        }

        e = !0;
        var b = Node.prototype.cloneNode;

        Node.prototype.cloneNode = function (a) {
          a = b.call(this, a);
          this instanceof DocumentFragment && (a.__proto__ = DocumentFragment.prototype);
          return a;
        };

        DocumentFragment.prototype.querySelectorAll = HTMLElement.prototype.querySelectorAll;
        DocumentFragment.prototype.querySelector = HTMLElement.prototype.querySelector;
        Object.defineProperties(DocumentFragment.prototype, {
          nodeType: {
            get: function () {
              return Node.DOCUMENT_FRAGMENT_NODE;
            },
            configurable: !0
          },
          localName: {
            get: function () {},
            configurable: !0
          },
          nodeName: {
            get: function () {
              return "#document-fragment";
            },
            configurable: !0
          }
        });
        var c = Node.prototype.insertBefore;
        Node.prototype.insertBefore = a;
        var d = Node.prototype.appendChild;

        Node.prototype.appendChild = function (b) {
          b instanceof DocumentFragment ? a.call(this, b, null) : d.call(this, b);
          return b;
        };

        var f = Node.prototype.removeChild,
            g = Node.prototype.replaceChild;

        Node.prototype.replaceChild = function (b, c) {
          b instanceof DocumentFragment ? (a.call(this, b, c), f.call(this, c)) : g.call(this, b, c);
          return c;
        };

        Document.prototype.createDocumentFragment = function () {
          var a = this.createElement("df");
          a.__proto__ = DocumentFragment.prototype;
          return a;
        };

        var h = Document.prototype.importNode;

        Document.prototype.importNode = function (a, b) {
          b = h.call(this, a, b || !1);
          a instanceof DocumentFragment && (b.__proto__ = DocumentFragment.prototype);
          return b;
        };
      }();

      var f = Node.prototype.cloneNode,
          g = Document.prototype.createElement,
          h = Document.prototype.importNode,
          k = Node.prototype.removeChild,
          l = Node.prototype.appendChild,
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
          w = Element.prototype.querySelectorAll,
          R = Document.prototype.querySelectorAll,
          Cb = DocumentFragment.prototype.querySelectorAll,
          Db = function () {
        if (!c) {
          var a = document.createElement("template"),
              b = document.createElement("template");
          b.content.appendChild(document.createElement("div"));
          a.content.appendChild(b);
          a = a.cloneNode(!0);
          return 0 === a.content.childNodes.length || 0 === a.content.firstChild.content.childNodes.length || d;
        }
      }();

      if (c) {
        var U = document.implementation.createHTMLDocument("template"),
            Ma = !0,
            q = document.createElement("style");
        q.textContent = "template{display:none;}";
        var za = document.head;
        za.insertBefore(q, za.firstElementChild);
        a.prototype = Object.create(HTMLElement.prototype);
        var ea = !document.createElement("div").hasOwnProperty("innerHTML");

        a.R = function (b) {
          if (!b.content && b.namespaceURI === document.documentElement.namespaceURI) {
            b.content = U.createDocumentFragment();

            for (var c; c = b.firstChild;) {
              l.call(b.content, c);
            }

            if (ea) b.__proto__ = a.prototype;else if (b.cloneNode = function (b) {
              return a.b(this, b);
            }, Ma) try {
              m(b), z(b);
            } catch (Gh) {
              Ma = !1;
            }
            a.a(b.content);
          }
        };

        var ba = {
          option: ["select"],
          thead: ["table"],
          col: ["colgroup", "table"],
          tr: ["tbody", "table"],
          th: ["tr", "tbody", "table"],
          td: ["tr", "tbody", "table"]
        },
            m = function (b) {
          Object.defineProperty(b, "innerHTML", {
            get: function () {
              return fa(this);
            },
            set: function (b) {
              var c = ba[(/<([a-z][^/\0>\x20\t\r\n\f]+)/i.exec(b) || ["", ""])[1].toLowerCase()];
              if (c) for (var d = 0; d < c.length; d++) {
                b = "<" + c[d] + ">" + b + "</" + c[d] + ">";
              }
              U.body.innerHTML = b;

              for (a.a(U); this.content.firstChild;) {
                k.call(this.content, this.content.firstChild);
              }

              b = U.body;
              if (c) for (d = 0; d < c.length; d++) {
                b = b.lastChild;
              }

              for (; b.firstChild;) {
                l.call(this.content, b.firstChild);
              }
            },
            configurable: !0
          });
        },
            z = function (a) {
          Object.defineProperty(a, "outerHTML", {
            get: function () {
              return "<template>" + this.innerHTML + "</template>";
            },
            set: function (a) {
              if (this.parentNode) {
                U.body.innerHTML = a;

                for (a = this.ownerDocument.createDocumentFragment(); U.body.firstChild;) {
                  l.call(a, U.body.firstChild);
                }

                n.call(this.parentNode, a, this);
              } else throw Error("Failed to set the 'outerHTML' property on 'Element': This element has no parent node.");
            },
            configurable: !0
          });
        };

        m(a.prototype);
        z(a.prototype);

        a.a = function (c) {
          c = b(c, "template");

          for (var d = 0, e = c.length, f; d < e && (f = c[d]); d++) {
            a.R(f);
          }
        };

        document.addEventListener("DOMContentLoaded", function () {
          a.a(document);
        });

        Document.prototype.createElement = function () {
          var b = g.apply(this, arguments);
          "template" === b.localName && a.R(b);
          return b;
        };

        DOMParser.prototype.parseFromString = function () {
          var b = p.apply(this, arguments);
          a.a(b);
          return b;
        };

        Object.defineProperty(HTMLElement.prototype, "innerHTML", {
          get: function () {
            return fa(this);
          },
          set: function (b) {
            G.set.call(this, b);
            a.a(this);
          },
          configurable: !0,
          enumerable: !0
        });

        var ca = /[&\u00A0"]/g,
            Eb = /[&\u00A0<>]/g,
            Na = function (a) {
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
        };

        q = function (a) {
          for (var b = {}, c = 0; c < a.length; c++) {
            b[a[c]] = !0;
          }

          return b;
        };

        var Aa = q("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),
            Oa = q("style script xmp iframe noembed noframes plaintext noscript".split(" ")),
            fa = function (a, b) {
          "template" === a.localName && (a = a.content);

          for (var c = "", d = b ? b(a) : u.get.call(a), e = 0, f = d.length, g; e < f && (g = d[e]); e++) {
            a: {
              var h = g;
              var k = a;
              var l = b;

              switch (h.nodeType) {
                case Node.ELEMENT_NODE:
                  for (var n = h.localName, m = "<" + n, p = h.attributes, w = 0; k = p[w]; w++) {
                    m += " " + k.name + '="' + k.value.replace(ca, Na) + '"';
                  }

                  m += ">";
                  h = Aa[n] ? m : m + fa(h, l) + "</" + n + ">";
                  break a;

                case Node.TEXT_NODE:
                  h = h.data;
                  h = k && Oa[k.localName] ? h : h.replace(Eb, Na);
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
        };
      }

      if (c || Db) {
        a.b = function (a, b) {
          var c = f.call(a, !1);
          this.R && this.R(c);
          b && (l.call(c.content, f.call(a.content, !0)), Pa(c.content, a.content));
          return c;
        };

        var Pa = function (c, d) {
          if (d.querySelectorAll && (d = b(d, "template"), 0 !== d.length)) {
            c = b(c, "template");

            for (var e = 0, f = c.length, g, h; e < f; e++) {
              h = d[e], g = c[e], a && a.R && a.R(h), n.call(g.parentNode, uf.call(h, !0), g);
            }
          }
        },
            uf = Node.prototype.cloneNode = function (b) {
          if (!e && d && this instanceof DocumentFragment) {
            if (b) var c = vf.call(this.ownerDocument, this, !0);else return this.ownerDocument.createDocumentFragment();
          } else this.nodeType === Node.ELEMENT_NODE && "template" === this.localName && this.namespaceURI == document.documentElement.namespaceURI ? c = a.b(this, b) : c = f.call(this, b);
          b && Pa(c, this);
          return c;
        },
            vf = Document.prototype.importNode = function (c, d) {
          d = d || !1;
          if ("template" === c.localName) return a.b(c, d);
          var e = h.call(this, c, d);

          if (d) {
            Pa(e, c);
            c = b(e, 'script:not([type]),script[type="application/javascript"],script[type="text/javascript"]');

            for (var f, k = 0; k < c.length; k++) {
              f = c[k];
              d = g.call(document, "script");
              d.textContent = f.textContent;

              for (var l = f.attributes, m = 0, p; m < l.length; m++) {
                p = l[m], d.setAttribute(p.name, p.value);
              }

              n.call(f.parentNode, d, f);
            }
          }

          return e;
        };
      }

      c && (window.HTMLTemplateElement = a);
    })();

    var Fa = setTimeout;

    function Ga() {}

    function Ha(a, b) {
      return function () {
        a.apply(b, arguments);
      };
    }

    function t(a) {
      if (!(this instanceof t)) throw new TypeError("Promises must be constructed via new");
      if ("function" !== typeof a) throw new TypeError("not a function");
      this.J = 0;
      this.ta = !1;
      this.B = void 0;
      this.U = [];
      Ia(a, this);
    }

    function Ja(a, b) {
      for (; 3 === a.J;) {
        a = a.B;
      }

      0 === a.J ? a.U.push(b) : (a.ta = !0, Ka(function () {
        var c = 1 === a.J ? b.Ta : b.Ua;
        if (null === c) (1 === a.J ? La : Qa)(b.oa, a.B);else {
          try {
            var d = c(a.B);
          } catch (e) {
            Qa(b.oa, e);
            return;
          }

          La(b.oa, d);
        }
      }));
    }

    function La(a, b) {
      try {
        if (b === a) throw new TypeError("A promise cannot be resolved with itself.");

        if (b && ("object" === typeof b || "function" === typeof b)) {
          var c = b.then;

          if (b instanceof t) {
            a.J = 3;
            a.B = b;
            Ra(a);
            return;
          }

          if ("function" === typeof c) {
            Ia(Ha(c, b), a);
            return;
          }
        }

        a.J = 1;
        a.B = b;
        Ra(a);
      } catch (d) {
        Qa(a, d);
      }
    }

    function Qa(a, b) {
      a.J = 2;
      a.B = b;
      Ra(a);
    }

    function Ra(a) {
      2 === a.J && 0 === a.U.length && Ka(function () {
        a.ta || "undefined" !== typeof console && console && console.warn("Possible Unhandled Promise Rejection:", a.B);
      });

      for (var b = 0, c = a.U.length; b < c; b++) {
        Ja(a, a.U[b]);
      }

      a.U = null;
    }

    function Sa(a, b, c) {
      this.Ta = "function" === typeof a ? a : null;
      this.Ua = "function" === typeof b ? b : null;
      this.oa = c;
    }

    function Ia(a, b) {
      var c = !1;

      try {
        a(function (a) {
          c || (c = !0, La(b, a));
        }, function (a) {
          c || (c = !0, Qa(b, a));
        });
      } catch (d) {
        c || (c = !0, Qa(b, d));
      }
    }

    t.prototype["catch"] = function (a) {
      return this.then(null, a);
    };

    t.prototype.then = function (a, b) {
      var c = new this.constructor(Ga);
      Ja(this, new Sa(a, b, c));
      return c;
    };

    t.prototype["finally"] = function (a) {
      var b = this.constructor;
      return this.then(function (c) {
        return b.resolve(a()).then(function () {
          return c;
        });
      }, function (c) {
        return b.resolve(a()).then(function () {
          return b.reject(c);
        });
      });
    };

    function Ta(a) {
      return new t(function (b, c) {
        function d(a, g) {
          try {
            if (g && ("object" === typeof g || "function" === typeof g)) {
              var h = g.then;

              if ("function" === typeof h) {
                h.call(g, function (b) {
                  d(a, b);
                }, c);
                return;
              }
            }

            e[a] = g;
            0 === --f && b(e);
          } catch (n) {
            c(n);
          }
        }

        if (!a || "undefined" === typeof a.length) throw new TypeError("Promise.all accepts an array");
        var e = Array.prototype.slice.call(a);
        if (0 === e.length) return b([]);

        for (var f = e.length, g = 0; g < e.length; g++) {
          d(g, e[g]);
        }
      });
    }

    function Ua(a) {
      return a && "object" === typeof a && a.constructor === t ? a : new t(function (b) {
        b(a);
      });
    }

    function Va(a) {
      return new t(function (b, c) {
        c(a);
      });
    }

    function Wa(a) {
      return new t(function (b, c) {
        for (var d = 0, e = a.length; d < e; d++) {
          a[d].then(b, c);
        }
      });
    }

    var Ka = "function" === typeof setImmediate && function (a) {
      setImmediate(a);
    } || function (a) {
      Fa(a, 0);
    };
    /*
    Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
    This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
    The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
    The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
    Code distributed by Google as part of the polymer project is also
    subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
    */


    if (!window.Promise) {
      window.Promise = t;
      t.prototype.then = t.prototype.then;
      t.all = Ta;
      t.race = Wa;
      t.resolve = Ua;
      t.reject = Va;
      var Xa = document.createTextNode(""),
          Ya = [];
      new MutationObserver(function () {
        for (var a = Ya.length, b = 0; b < a; b++) {
          Ya[b]();
        }

        Ya.splice(0, a);
      }).observe(Xa, {
        characterData: !0
      });

      Ka = function (a) {
        Ya.push(a);
        Xa.textContent = 0 < Xa.textContent.length ? "" : "a";
      };
    }
    /*
    Copyright (C) 2015 by WebReflection
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
    */

    (function (a, b) {
      if (!(b in a)) {
        var c = typeof global === typeof c ? window : global,
            d = 0,
            e = "" + Math.random(),
            f = "__\u0001symbol@@" + e,
            g = a.getOwnPropertyNames,
            h = a.getOwnPropertyDescriptor,
            k = a.create,
            l = a.keys,
            n = a.freeze || a,
            p = a.defineProperty,
            G = a.defineProperties,
            u = h(a, "getOwnPropertyNames"),
            w = a.prototype,
            R = w.hasOwnProperty,
            Cb = w.propertyIsEnumerable,
            Db = w.toString,
            U = function (a, b, c) {
          R.call(a, f) || p(a, f, {
            enumerable: !1,
            configurable: !1,
            writable: !1,
            value: {}
          });
          a[f]["@@" + b] = c;
        },
            Ma = function (a, b) {
          var c = k(a);
          g(b).forEach(function (a) {
            ba.call(b, a) && Aa(c, a, b[a]);
          });
          return c;
        },
            q = function () {},
            za = function (a) {
          return a != f && !R.call(ca, a);
        },
            ea = function (a) {
          return a != f && R.call(ca, a);
        },
            ba = function (a) {
          var b = "" + a;
          return ea(b) ? R.call(this, b) && this[f]["@@" + b] : Cb.call(this, a);
        },
            m = function (b) {
          p(w, b, {
            enumerable: !1,
            configurable: !0,
            get: q,
            set: function (a) {
              fa(this, b, {
                enumerable: !1,
                configurable: !0,
                writable: !0,
                value: a
              });
              U(this, b, !0);
            }
          });
          return n(ca[b] = p(a(b), "constructor", Eb));
        },
            z = function (a) {
          if (this && this !== c) throw new TypeError("Symbol is not a constructor");
          return m("__\u0001symbol:".concat(a || "", e, ++d));
        },
            ca = k(null),
            Eb = {
          value: z
        },
            Na = function (a) {
          return ca[a];
        },
            Aa = function (a, b, c) {
          var d = "" + b;

          if (ea(d)) {
            b = fa;

            if (c.enumerable) {
              var e = k(c);
              e.enumerable = !1;
            } else e = c;

            b(a, d, e);
            U(a, d, !!c.enumerable);
          } else p(a, b, c);

          return a;
        },
            Oa = function (a) {
          return g(a).filter(ea).map(Na);
        };

        u.value = Aa;
        p(a, "defineProperty", u);
        u.value = Oa;
        p(a, b, u);

        u.value = function (a) {
          return g(a).filter(za);
        };

        p(a, "getOwnPropertyNames", u);

        u.value = function (a, b) {
          var c = Oa(b);
          c.length ? l(b).concat(c).forEach(function (c) {
            ba.call(b, c) && Aa(a, c, b[c]);
          }) : G(a, b);
          return a;
        };

        p(a, "defineProperties", u);
        u.value = ba;
        p(w, "propertyIsEnumerable", u);
        u.value = z;
        p(c, "Symbol", u);

        u.value = function (a) {
          a = "__\u0001symbol:".concat("__\u0001symbol:", a, e);
          return a in w ? ca[a] : m(a);
        };

        p(z, "for", u);

        u.value = function (a) {
          if (za(a)) throw new TypeError(a + " is not a symbol");
          return R.call(ca, a) ? a.slice(20, -e.length) : void 0;
        };

        p(z, "keyFor", u);

        u.value = function (a, b) {
          var c = h(a, b);
          c && ea(b) && (c.enumerable = ba.call(a, b));
          return c;
        };

        p(a, "getOwnPropertyDescriptor", u);

        u.value = function (a, b) {
          return 1 === arguments.length ? k(a) : Ma(a, b);
        };

        p(a, "create", u);

        u.value = function () {
          var a = Db.call(this);
          return "[object String]" === a && ea(this) ? "[object Symbol]" : a;
        };

        p(w, "toString", u);

        try {
          var fa = k(p({}, "__\u0001symbol:", {
            get: function () {
              return p(this, "__\u0001symbol:", {
                value: !1
              })["__\u0001symbol:"];
            }
          }))["__\u0001symbol:"] || p;
        } catch (Pa) {
          fa = function (a, b, c) {
            var d = h(w, b);
            delete w[b];
            p(a, b, c);
            p(w, b, d);
          };
        }
      }
    })(Object, "getOwnPropertySymbols");

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


    var Za = Object.prototype.toString;

    Object.prototype.toString = function () {
      return void 0 === this ? "[object Undefined]" : null === this ? "[object Null]" : Za.call(this);
    };

    Object.keys = function (a) {
      return Object.getOwnPropertyNames(a).filter(function (b) {
        return (b = Object.getOwnPropertyDescriptor(a, b)) && b.enumerable;
      });
    };

    var $a = window.Symbol.iterator;
    String.prototype[$a] && String.prototype.codePointAt || (String.prototype[$a] = function ab() {
      var b,
          c = this;
      return Ea(ab, function (d) {
        1 == d.a && (b = 0);
        if (3 != d.a) return b < c.length ? d = wa(d, c[b]) : (d.a = 0, d = void 0), d;
        b++;
        d.a = 2;
      });
    });
    Set.prototype[$a] || (Set.prototype[$a] = function bb() {
      var b,
          c = this,
          d;
      return Ea(bb, function (e) {
        1 == e.a && (b = [], c.forEach(function (c) {
          b.push(c);
        }), d = 0);
        if (3 != e.a) return d < b.length ? e = wa(e, b[d]) : (e.a = 0, e = void 0), e;
        d++;
        e.a = 2;
      });
    });
    Map.prototype[$a] || (Map.prototype[$a] = function cb() {
      var b,
          c = this,
          d;
      return Ea(cb, function (e) {
        1 == e.a && (b = [], c.forEach(function (c, d) {
          b.push([d, c]);
        }), d = 0);
        if (3 != e.a) return d < b.length ? e = wa(e, b[d]) : (e.a = 0, e = void 0), e;
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
    var db = document.querySelector('script[src*="webcomponents-bundle"]'),
        eb = /wc-(.+)/,
        v = {};

    if (!v.noOpts) {
      location.search.slice(1).split("&").forEach(function (a) {
        a = a.split("=");
        var b;
        a[0] && (b = a[0].match(eb)) && (v[b[1]] = a[1] || !0);
      });
      if (db) for (var fb = 0, gb = void 0; gb = db.attributes[fb]; fb++) {
        "src" !== gb.name && (v[gb.name] = gb.value || !0);
      }

      if (v.log && v.log.split) {
        var hb = v.log.split(",");
        v.log = {};
        hb.forEach(function (a) {
          v.log[a] = !0;
        });
      } else v.log = {};
    }

    window.WebComponents.flags = v;
    var ib = v.shadydom;
    ib && (window.ShadyDOM = window.ShadyDOM || {}, window.ShadyDOM.force = ib);
    var jb = v.register || v.ce;
    jb && window.customElements && (window.customElements.forcePolyfill = jb);
    /*
    Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
    This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
    The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
    The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
    Code distributed by Google as part of the polymer project is also
    subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
    */

    function kb() {
      this.wa = this.root = null;
      this.da = !1;
      this.N = this.aa = this.la = this.assignedSlot = this.assignedNodes = this.S = null;
      this.childNodes = this.nextSibling = this.previousSibling = this.lastChild = this.firstChild = this.parentNode = this.W = void 0;
      this.Ba = this.ra = !1;
      this.$ = {};
    }

    kb.prototype.toJSON = function () {
      return {};
    };

    function x(a) {
      a.__shady || (a.__shady = new kb());
      return a.__shady;
    }

    function y(a) {
      return a && a.__shady;
    }
    var A = window.ShadyDOM || {};
    A.Pa = !(!Element.prototype.attachShadow || !Node.prototype.getRootNode);
    var lb = Object.getOwnPropertyDescriptor(Node.prototype, "firstChild");
    A.K = !!(lb && lb.configurable && lb.get);
    A.na = A.force || !A.Pa;
    var mb = navigator.userAgent.match("Trident"),
        nb = navigator.userAgent.match("Edge");
    void 0 === A.ya && (A.ya = A.K && (mb || nb));

    function ob(a) {
      return (a = y(a)) && void 0 !== a.firstChild;
    }

    function B(a) {
      return "ShadyRoot" === a.Ga;
    }

    function pb(a) {
      a = a.getRootNode();
      if (B(a)) return a;
    }

    var qb = Element.prototype,
        rb = qb.matches || qb.matchesSelector || qb.mozMatchesSelector || qb.msMatchesSelector || qb.oMatchesSelector || qb.webkitMatchesSelector;

    function sb(a, b) {
      if (a && b) for (var c = Object.getOwnPropertyNames(b), d = 0, e = void 0; d < c.length && (e = c[d]); d++) {
        var f = e,
            g = a,
            h = Object.getOwnPropertyDescriptor(b, f);
        h && Object.defineProperty(g, f, h);
      }
    }

    function tb(a, b) {
      for (var c = [], d = 1; d < arguments.length; ++d) {
        c[d - 1] = arguments[d];
      }

      for (d = 0; d < c.length; d++) {
        sb(a, c[d]);
      }

      return a;
    }

    function ub(a, b) {
      for (var c in b) {
        a[c] = b[c];
      }
    }

    var vb = document.createTextNode(""),
        wb = 0,
        xb = [];
    new MutationObserver(function () {
      for (; xb.length;) {
        try {
          xb.shift()();
        } catch (a) {
          throw vb.textContent = wb++, a;
        }
      }
    }).observe(vb, {
      characterData: !0
    });

    function yb(a) {
      xb.push(a);
      vb.textContent = wb++;
    }

    var zb = !!document.contains;

    function Ab(a, b) {
      for (; b;) {
        if (b == a) return !0;
        b = b.parentNode;
      }

      return !1;
    }

    function Bb(a) {
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

        for (var c = ma(a), d = c.next(); !d.done; d = c.next()) {
          if (d = d.value, (d.getAttribute("id") || d.getAttribute("name")) == b) return d;
        }

        return null;
      };

      return a;
    }
    var Fb = [],
        Gb;

    function Hb(a) {
      Gb || (Gb = !0, yb(Ib));
      Fb.push(a);
    }

    function Ib() {
      Gb = !1;

      for (var a = !!Fb.length; Fb.length;) {
        Fb.shift()();
      }

      return a;
    }

    Ib.list = Fb;

    function Jb() {
      this.a = !1;
      this.addedNodes = [];
      this.removedNodes = [];
      this.ca = new Set();
    }

    function Kb(a) {
      a.a || (a.a = !0, yb(function () {
        a.flush();
      }));
    }

    Jb.prototype.flush = function () {
      if (this.a) {
        this.a = !1;
        var a = this.takeRecords();
        a.length && this.ca.forEach(function (b) {
          b(a);
        });
      }
    };

    Jb.prototype.takeRecords = function () {
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

    function Lb(a, b) {
      var c = x(a);
      c.S || (c.S = new Jb());
      c.S.ca.add(b);
      var d = c.S;
      return {
        Fa: b,
        P: d,
        Ha: a,
        takeRecords: function () {
          return d.takeRecords();
        }
      };
    }

    function Mb(a) {
      var b = a && a.P;
      b && (b.ca.delete(a.Fa), b.ca.size || (x(a.Ha).S = null));
    }

    function Nb(a, b) {
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
    var Ob = Element.prototype.insertBefore,
        Pb = Element.prototype.replaceChild,
        Qb = Element.prototype.removeChild,
        Rb = Element.prototype.setAttribute,
        Sb = Element.prototype.removeAttribute,
        Tb = Element.prototype.cloneNode,
        Ub = Document.prototype.importNode,
        Vb = Element.prototype.addEventListener,
        Wb = Element.prototype.removeEventListener,
        Xb = Window.prototype.addEventListener,
        Yb = Window.prototype.removeEventListener,
        Zb = Element.prototype.dispatchEvent,
        $b = Node.prototype.contains || HTMLElement.prototype.contains,
        ac = Document.prototype.getElementById,
        bc = Element.prototype.querySelector,
        cc = DocumentFragment.prototype.querySelector,
        dc = Document.prototype.querySelector,
        ec = Element.prototype.querySelectorAll,
        fc = DocumentFragment.prototype.querySelectorAll,
        gc = Document.prototype.querySelectorAll,
        C = {};
    C.appendChild = Element.prototype.appendChild;
    C.insertBefore = Ob;
    C.replaceChild = Pb;
    C.removeChild = Qb;
    C.setAttribute = Rb;
    C.removeAttribute = Sb;
    C.cloneNode = Tb;
    C.importNode = Ub;
    C.addEventListener = Vb;
    C.removeEventListener = Wb;
    C.cb = Xb;
    C.eb = Yb;
    C.dispatchEvent = Zb;
    C.contains = $b;
    C.getElementById = ac;
    C.kb = bc;
    C.nb = cc;
    C.ib = dc;

    C.querySelector = function (a) {
      switch (this.nodeType) {
        case Node.ELEMENT_NODE:
          return bc.call(this, a);

        case Node.DOCUMENT_NODE:
          return dc.call(this, a);

        default:
          return cc.call(this, a);
      }
    };

    C.lb = ec;
    C.ob = fc;
    C.jb = gc;

    C.querySelectorAll = function (a) {
      switch (this.nodeType) {
        case Node.ELEMENT_NODE:
          return ec.call(this, a);

        case Node.DOCUMENT_NODE:
          return gc.call(this, a);

        default:
          return fc.call(this, a);
      }
    };

    var hc = /[&\u00A0"]/g,
        ic = /[&\u00A0<>]/g;

    function jc(a) {
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

    function kc(a) {
      for (var b = {}, c = 0; c < a.length; c++) {
        b[a[c]] = !0;
      }

      return b;
    }

    var lc = kc("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),
        mc = kc("style script xmp iframe noembed noframes plaintext noscript".split(" "));

    function nc(a, b) {
      "template" === a.localName && (a = a.content);

      for (var c = "", d = b ? b(a) : a.childNodes, e = 0, f = d.length, g = void 0; e < f && (g = d[e]); e++) {
        a: {
          var h = g;
          var k = a,
              l = b;

          switch (h.nodeType) {
            case Node.ELEMENT_NODE:
              k = h.localName;

              for (var n = "<" + k, p = h.attributes, G = 0, u; u = p[G]; G++) {
                n += " " + u.name + '="' + u.value.replace(hc, jc) + '"';
              }

              n += ">";
              h = lc[k] ? n : n + nc(h, l) + "</" + k + ">";
              break a;

            case Node.TEXT_NODE:
              h = h.data;
              h = k && mc[k.localName] ? h : h.replace(ic, jc);
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
    var D = document.createTreeWalker(document, NodeFilter.SHOW_ALL, null, !1),
        E = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, null, !1);

    function oc(a) {
      var b = [];
      D.currentNode = a;

      for (a = D.firstChild(); a;) {
        b.push(a), a = D.nextSibling();
      }

      return b;
    }

    var F = {
      parentNode: function (a) {
        D.currentNode = a;
        return D.parentNode();
      },
      firstChild: function (a) {
        D.currentNode = a;
        return D.firstChild();
      },
      lastChild: function (a) {
        D.currentNode = a;
        return D.lastChild();
      },
      previousSibling: function (a) {
        D.currentNode = a;
        return D.previousSibling();
      },
      nextSibling: function (a) {
        D.currentNode = a;
        return D.nextSibling();
      }
    };
    F.childNodes = oc;

    F.parentElement = function (a) {
      E.currentNode = a;
      return E.parentNode();
    };

    F.firstElementChild = function (a) {
      E.currentNode = a;
      return E.firstChild();
    };

    F.lastElementChild = function (a) {
      E.currentNode = a;
      return E.lastChild();
    };

    F.previousElementSibling = function (a) {
      E.currentNode = a;
      return E.previousSibling();
    };

    F.nextElementSibling = function (a) {
      E.currentNode = a;
      return E.nextSibling();
    };

    F.children = function (a) {
      var b = [];
      E.currentNode = a;

      for (a = E.firstChild(); a;) {
        b.push(a), a = E.nextSibling();
      }

      return Bb(b);
    };

    F.innerHTML = function (a) {
      return nc(a, function (a) {
        return oc(a);
      });
    };

    F.textContent = function (a) {
      switch (a.nodeType) {
        case Node.ELEMENT_NODE:
        case Node.DOCUMENT_FRAGMENT_NODE:
          a = document.createTreeWalker(a, NodeFilter.SHOW_TEXT, null, !1);

          for (var b = "", c; c = a.nextNode();) {
            b += c.nodeValue;
          }

          return b;

        default:
          return a.nodeValue;
      }
    };

    var pc = A.K,
        qc = [Node.prototype, Element.prototype, HTMLElement.prototype];

    function H(a) {
      var b;

      a: {
        for (b = 0; b < qc.length; b++) {
          var c = qc[b];

          if (c.hasOwnProperty(a)) {
            b = c;
            break a;
          }
        }

        b = void 0;
      }

      if (!b) throw Error("Could not find descriptor for " + a);
      return Object.getOwnPropertyDescriptor(b, a);
    }

    var I = pc ? {
      parentNode: H("parentNode"),
      firstChild: H("firstChild"),
      lastChild: H("lastChild"),
      previousSibling: H("previousSibling"),
      nextSibling: H("nextSibling"),
      childNodes: H("childNodes"),
      parentElement: H("parentElement"),
      previousElementSibling: H("previousElementSibling"),
      nextElementSibling: H("nextElementSibling"),
      innerHTML: H("innerHTML"),
      textContent: H("textContent"),
      firstElementChild: H("firstElementChild"),
      lastElementChild: H("lastElementChild"),
      children: H("children")
    } : {},
        rc = pc ? {
      firstElementChild: Object.getOwnPropertyDescriptor(DocumentFragment.prototype, "firstElementChild"),
      lastElementChild: Object.getOwnPropertyDescriptor(DocumentFragment.prototype, "lastElementChild"),
      children: Object.getOwnPropertyDescriptor(DocumentFragment.prototype, "children")
    } : {},
        sc = pc ? {
      firstElementChild: Object.getOwnPropertyDescriptor(Document.prototype, "firstElementChild"),
      lastElementChild: Object.getOwnPropertyDescriptor(Document.prototype, "lastElementChild"),
      children: Object.getOwnPropertyDescriptor(Document.prototype, "children")
    } : {},
        tc = {
      va: I,
      mb: rc,
      hb: sc,
      parentNode: function (a) {
        return I.parentNode.get.call(a);
      },
      firstChild: function (a) {
        return I.firstChild.get.call(a);
      },
      lastChild: function (a) {
        return I.lastChild.get.call(a);
      },
      previousSibling: function (a) {
        return I.previousSibling.get.call(a);
      },
      nextSibling: function (a) {
        return I.nextSibling.get.call(a);
      },
      childNodes: function (a) {
        return Array.prototype.slice.call(I.childNodes.get.call(a));
      },
      parentElement: function (a) {
        return I.parentElement.get.call(a);
      },
      previousElementSibling: function (a) {
        return I.previousElementSibling.get.call(a);
      },
      nextElementSibling: function (a) {
        return I.nextElementSibling.get.call(a);
      },
      innerHTML: function (a) {
        return I.innerHTML.get.call(a);
      },
      textContent: function (a) {
        return I.textContent.get.call(a);
      },
      children: function (a) {
        switch (a.nodeType) {
          case Node.DOCUMENT_FRAGMENT_NODE:
            return rc.children.get.call(a);

          case Node.DOCUMENT_NODE:
            return sc.children.get.call(a);

          default:
            return I.children.get.call(a);
        }
      },
      firstElementChild: function (a) {
        switch (a.nodeType) {
          case Node.DOCUMENT_FRAGMENT_NODE:
            return rc.firstElementChild.get.call(a);

          case Node.DOCUMENT_NODE:
            return sc.firstElementChild.get.call(a);

          default:
            return I.firstElementChild.get.call(a);
        }
      },
      lastElementChild: function (a) {
        switch (a.nodeType) {
          case Node.DOCUMENT_FRAGMENT_NODE:
            return rc.lastElementChild.get.call(a);

          case Node.DOCUMENT_NODE:
            return sc.lastElementChild.get.call(a);

          default:
            return I.lastElementChild.get.call(a);
        }
      }
    };
    var J = A.ya ? tc : F;

    function uc(a) {
      for (; a.firstChild;) {
        a.removeChild(a.firstChild);
      }
    }

    var vc = A.K,
        wc = document.implementation.createHTMLDocument("inert"),
        xc = Object.getOwnPropertyDescriptor(Node.prototype, "isConnected"),
        yc = xc && xc.get,
        zc = Object.getOwnPropertyDescriptor(Document.prototype, "activeElement"),
        Ac = {
      parentElement: {
        get: function () {
          var a = y(this);
          (a = a && a.parentNode) && a.nodeType !== Node.ELEMENT_NODE && (a = null);
          return void 0 !== a ? a : J.parentElement(this);
        },
        configurable: !0
      },
      parentNode: {
        get: function () {
          var a = y(this);
          a = a && a.parentNode;
          return void 0 !== a ? a : J.parentNode(this);
        },
        configurable: !0
      },
      nextSibling: {
        get: function () {
          var a = y(this);
          a = a && a.nextSibling;
          return void 0 !== a ? a : J.nextSibling(this);
        },
        configurable: !0
      },
      previousSibling: {
        get: function () {
          var a = y(this);
          a = a && a.previousSibling;
          return void 0 !== a ? a : J.previousSibling(this);
        },
        configurable: !0
      },
      nextElementSibling: {
        get: function () {
          var a = y(this);

          if (a && void 0 !== a.nextSibling) {
            for (a = this.nextSibling; a && a.nodeType !== Node.ELEMENT_NODE;) {
              a = a.nextSibling;
            }

            return a;
          }

          return J.nextElementSibling(this);
        },
        configurable: !0
      },
      previousElementSibling: {
        get: function () {
          var a = y(this);

          if (a && void 0 !== a.previousSibling) {
            for (a = this.previousSibling; a && a.nodeType !== Node.ELEMENT_NODE;) {
              a = a.previousSibling;
            }

            return a;
          }

          return J.previousElementSibling(this);
        },
        configurable: !0
      }
    },
        Bc = {
      className: {
        get: function () {
          return this.getAttribute("class") || "";
        },
        set: function (a) {
          this.setAttribute("class", a);
        },
        configurable: !0
      }
    },
        Cc = {
      childNodes: {
        get: function () {
          if (ob(this)) {
            var a = y(this);

            if (!a.childNodes) {
              a.childNodes = [];

              for (var b = this.firstChild; b; b = b.nextSibling) {
                a.childNodes.push(b);
              }
            }

            var c = a.childNodes;
          } else c = J.childNodes(this);

          c.item = function (a) {
            return c[a];
          };

          return c;
        },
        configurable: !0
      },
      childElementCount: {
        get: function () {
          return this.children.length;
        },
        configurable: !0
      },
      firstChild: {
        get: function () {
          var a = y(this);
          a = a && a.firstChild;
          return void 0 !== a ? a : J.firstChild(this);
        },
        configurable: !0
      },
      lastChild: {
        get: function () {
          var a = y(this);
          a = a && a.lastChild;
          return void 0 !== a ? a : J.lastChild(this);
        },
        configurable: !0
      },
      textContent: {
        get: function () {
          if (ob(this)) {
            for (var a = [], b = 0, c = this.childNodes, d; d = c[b]; b++) {
              d.nodeType !== Node.COMMENT_NODE && a.push(d.textContent);
            }

            return a.join("");
          }

          return J.textContent(this);
        },
        set: function (a) {
          if ("undefined" === typeof a || null === a) a = "";

          switch (this.nodeType) {
            case Node.ELEMENT_NODE:
            case Node.DOCUMENT_FRAGMENT_NODE:
              if (!ob(this) && vc) {
                var b = this.firstChild;
                (b != this.lastChild || b && b.nodeType != Node.TEXT_NODE) && uc(this);
                tc.va.textContent.set.call(this, a);
              } else uc(this), (0 < a.length || this.nodeType === Node.ELEMENT_NODE) && this.appendChild(document.createTextNode(a));

              break;

            default:
              this.nodeValue = a;
          }
        },
        configurable: !0
      },
      firstElementChild: {
        get: function () {
          var a = y(this);

          if (a && void 0 !== a.firstChild) {
            for (a = this.firstChild; a && a.nodeType !== Node.ELEMENT_NODE;) {
              a = a.nextSibling;
            }

            return a;
          }

          return J.firstElementChild(this);
        },
        configurable: !0
      },
      lastElementChild: {
        get: function () {
          var a = y(this);

          if (a && void 0 !== a.lastChild) {
            for (a = this.lastChild; a && a.nodeType !== Node.ELEMENT_NODE;) {
              a = a.previousSibling;
            }

            return a;
          }

          return J.lastElementChild(this);
        },
        configurable: !0
      },
      children: {
        get: function () {
          return ob(this) ? Bb(Array.prototype.filter.call(this.childNodes, function (a) {
            return a.nodeType === Node.ELEMENT_NODE;
          })) : J.children(this);
        },
        configurable: !0
      },
      innerHTML: {
        get: function () {
          return ob(this) ? nc("template" === this.localName ? this.content : this) : J.innerHTML(this);
        },
        set: function (a) {
          var b = "template" === this.localName ? this.content : this;
          uc(b);
          var c = this.localName || "div";
          c = this.namespaceURI && this.namespaceURI !== wc.namespaceURI ? wc.createElementNS(this.namespaceURI, c) : wc.createElement(c);
          vc ? tc.va.innerHTML.set.call(c, a) : c.innerHTML = a;

          for (a = "template" === this.localName ? c.content : c; a.firstChild;) {
            b.appendChild(a.firstChild);
          }
        },
        configurable: !0
      }
    },
        Dc = {
      shadowRoot: {
        get: function () {
          var a = y(this);
          return a && a.wa || null;
        },
        configurable: !0
      }
    },
        Ec = {
      activeElement: {
        get: function () {
          var a = zc && zc.get ? zc.get.call(document) : A.K ? void 0 : document.activeElement;

          if (a && a.nodeType) {
            var b = !!B(this);

            if (this === document || b && this.host !== a && C.contains.call(this.host, a)) {
              for (b = pb(a); b && b !== this;) {
                a = b.host, b = pb(a);
              }

              a = this === document ? b ? null : a : b === this ? a : null;
            } else a = null;
          } else a = null;

          return a;
        },
        set: function () {},
        configurable: !0
      }
    };

    function K(a, b, c) {
      for (var d in b) {
        var e = Object.getOwnPropertyDescriptor(a, d);
        e && e.configurable || !e && c ? Object.defineProperty(a, d, b[d]) : c && console.warn("Could not define", d, "on", a);
      }
    }

    function Fc(a) {
      K(a, Ac);
      K(a, Bc);
      K(a, Cc);
      K(a, Ec);
    }

    function Gc() {
      var a = Hc.prototype;
      a.__proto__ = DocumentFragment.prototype;
      K(a, Ac, !0);
      K(a, Cc, !0);
      K(a, Ec, !0);
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
    }

    var Ic = A.K ? function () {} : function (a) {
      var b = x(a);
      b.ra || (b.ra = !0, K(a, Ac, !0), K(a, Bc, !0));
    },
        Jc = A.K ? function () {} : function (a) {
      x(a).Ba || (K(a, Cc, !0), K(a, Dc, !0));
    };
    var Kc = J.childNodes;

    function Lc(a, b, c) {
      Jc(b);
      var d = x(b);
      void 0 !== d.firstChild && (d.childNodes = null);

      if (a.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        d = a.childNodes;

        for (var e = 0; e < d.length; e++) {
          Mc(d[e], b, c);
        }

        a = x(a);
        b = void 0 !== a.firstChild ? null : void 0;
        a.firstChild = a.lastChild = b;
        a.childNodes = b;
      } else Mc(a, b, c);
    }

    function Mc(a, b, c) {
      Ic(a);
      c = c || null;
      var d = x(a),
          e = x(b),
          f = c ? x(c) : null;
      d.previousSibling = c ? f.previousSibling : b.lastChild;
      if (f = y(d.previousSibling)) f.nextSibling = a;
      if (f = y(d.nextSibling = c)) f.previousSibling = a;
      d.parentNode = b;
      c ? c === e.firstChild && (e.firstChild = a) : (e.lastChild = a, e.firstChild || (e.firstChild = a));
      e.childNodes = null;
    }

    function Nc(a, b) {
      var c = x(a);
      b = x(b);
      a === b.firstChild && (b.firstChild = c.nextSibling);
      a === b.lastChild && (b.lastChild = c.previousSibling);
      a = c.previousSibling;
      var d = c.nextSibling;
      a && (x(a).nextSibling = d);
      d && (x(d).previousSibling = a);
      c.parentNode = c.previousSibling = c.nextSibling = void 0;
      void 0 !== b.childNodes && (b.childNodes = null);
    }

    function Oc(a, b) {
      var c = x(a);
      if (void 0 === c.firstChild) for (c.childNodes = null, b = b || Kc(a), c.firstChild = b[0] || null, c.lastChild = b[b.length - 1] || null, Jc(a), c = 0; c < b.length; c++) {
        var d = b[c],
            e = x(d);
        e.parentNode = a;
        e.nextSibling = b[c + 1] || null;
        e.previousSibling = b[c - 1] || null;
        Ic(d);
      }
    }
    var Pc = J.parentNode,
        Qc = window.document,
        Rc = A.qb;

    function Sc(a, b, c) {
      if (a.ownerDocument !== Qc && b.ownerDocument !== Qc) return C.insertBefore.call(a, b, c);
      if (b === a) throw Error("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");

      if (c) {
        var d = y(c);
        d = d && d.parentNode;
        if (void 0 !== d && d !== a || void 0 === d && Pc(c) !== a) throw Error("Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.");
      }

      if (c === b) return b;
      var e = [],
          f = Tc,
          g = pb(a),
          h;
      g ? h = g.host.localName : h = Uc(a);

      if (b.parentNode) {
        var k = Uc(b);
        Vc(b.parentNode, b, !!g || !(b.getRootNode() instanceof ShadowRoot));

        f = function (a, b) {
          Wc() && (Xc(a, k), Tc(a, b));
        };
      }

      d = !0;
      var l = (!Rc || void 0 === b.__noInsertionPoint) && !Yc(b, h);
      if (g) b.__noInsertionPoint && !l || Zc(b, function (a) {
        "slot" === a.localName && e.push(a);
        l && f(a, h);
      });else if (l) {
        var n = Uc(b);
        Zc(b, function (a) {
          var b = h;
          Wc() && (Xc(a, n), Tc(a, b));
        });
      }
      e.length && $c(g, e);
      ("slot" === a.localName || e.length) && g && ad(g);
      ob(a) && (Lc(b, a, c), g = y(a), bd(a) ? (ad(g.root), d = !1) : g.root && (d = !1));
      d ? (d = B(a) ? a.host : a, c ? (c = cd(c), C.insertBefore.call(d, b, c)) : C.appendChild.call(d, b)) : b.ownerDocument !== a.ownerDocument && a.ownerDocument.adoptNode(b);
      dd(a, b);
      return b;
    }

    function Vc(a, b, c) {
      c = void 0 === c ? !1 : c;
      if (a.ownerDocument !== Qc) return C.removeChild.call(a, b);
      if (b.parentNode !== a) throw Error("The node to be removed is not a child of this node: " + b);
      var d = pb(b),
          e = y(a);

      if (ob(a) && (Nc(b, a), bd(a))) {
        ad(e.root);
        var f = !0;
      }

      if (Wc() && !c && d) {
        var g = Uc(b);
        Zc(b, function (a) {
          Xc(a, g);
        });
      }

      ed(b);

      if (d) {
        var h = a && "slot" === a.localName;
        h && (f = !0);
        ((c = fd(d, b)) || h) && ad(d);
      }

      f || (f = B(a) ? a.host : a, (!e.root && "slot" !== b.localName || f === Pc(b)) && C.removeChild.call(f, b));
      dd(a, null, b);
      return b;
    }

    function ed(a) {
      var b = y(a);

      if (b && void 0 !== b.W) {
        b = a.childNodes;

        for (var c = 0, d = b.length, e = void 0; c < d && (e = b[c]); c++) {
          ed(e);
        }
      }

      if (a = y(a)) a.W = void 0;
    }

    function cd(a) {
      var b = a;
      a && "slot" === a.localName && (b = (b = (b = y(a)) && b.N) && b.length ? b[0] : cd(a.nextSibling));
      return b;
    }

    function bd(a) {
      return (a = (a = y(a)) && a.root) && gd(a);
    }

    function hd(a, b) {
      if ("slot" === b) a = a.parentNode, bd(a) && ad(y(a).root);else if ("slot" === a.localName && "name" === b && (b = pb(a))) {
        if (b.m) {
          id(b);
          var c = a.Ea,
              d = jd(a);

          if (d !== c) {
            c = b.w[c];
            var e = c.indexOf(a);
            0 <= e && c.splice(e, 1);
            c = b.w[d] || (b.w[d] = []);
            c.push(a);
            1 < c.length && (b.w[d] = kd(c));
          }
        }

        ad(b);
      }
    }

    function dd(a, b, c) {
      if (a = (a = y(a)) && a.S) b && a.addedNodes.push(b), c && a.removedNodes.push(c), Kb(a);
    }

    function ld(a) {
      if (a && a.nodeType) {
        var b = x(a),
            c = b.W;
        void 0 === c && (B(a) ? (c = a, b.W = c) : (c = (c = a.parentNode) ? ld(c) : a, C.contains.call(document.documentElement, a) && (b.W = c)));
        return c;
      }
    }

    function md(a, b, c) {
      var d = [];
      nd(a.childNodes, b, c, d);
      return d;
    }

    function nd(a, b, c, d) {
      for (var e = 0, f = a.length, g = void 0; e < f && (g = a[e]); e++) {
        var h;

        if (h = g.nodeType === Node.ELEMENT_NODE) {
          h = g;
          var k = b,
              l = c,
              n = d,
              p = k(h);
          p && n.push(h);
          l && l(p) ? h = p : (nd(h.childNodes, k, l, n), h = void 0);
        }

        if (h) break;
      }
    }

    var od = null;

    function Wc() {
      od || (od = window.ShadyCSS && window.ShadyCSS.ScopingShim);
      return od || null;
    }

    function pd(a, b, c) {
      if (a.ownerDocument !== Qc) C.setAttribute.call(a, b, c);else {
        var d = Wc();
        d && "class" === b ? d.setElementClass(a, c) : (C.setAttribute.call(a, b, c), hd(a, b));
      }
    }

    function qd(a, b) {
      if (a.ownerDocument !== document || "template" === a.localName) return C.importNode.call(document, a, b);
      var c = C.importNode.call(document, a, !1);

      if (b) {
        a = a.childNodes;
        b = 0;

        for (var d; b < a.length; b++) {
          d = qd(a[b], !0), c.appendChild(d);
        }
      }

      return c;
    }

    function Tc(a, b) {
      var c = Wc();
      c && c.scopeNode(a, b);
    }

    function Xc(a, b) {
      var c = Wc();
      c && c.unscopeNode(a, b);
    }

    function Yc(a, b) {
      var c = Wc();
      if (!c) return !0;

      if (a.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        c = !0;

        for (var d = 0; c && d < a.childNodes.length; d++) {
          c = c && Yc(a.childNodes[d], b);
        }

        return c;
      }

      return a.nodeType !== Node.ELEMENT_NODE ? !0 : c.currentScopeForNode(a) === b;
    }

    function Uc(a) {
      if (a.nodeType !== Node.ELEMENT_NODE) return "";
      var b = Wc();
      return b ? b.currentScopeForNode(a) : "";
    }

    function Zc(a, b) {
      if (a) {
        a.nodeType === Node.ELEMENT_NODE && b(a);

        for (var c = 0, d; c < a.childNodes.length; c++) {
          d = a.childNodes[c], d.nodeType === Node.ELEMENT_NODE && Zc(d, b);
        }
      }
    }

    var rd = "__eventWrappers" + Date.now(),
        sd = function () {
      var a = Object.getOwnPropertyDescriptor(Event.prototype, "composed");
      return a ? function (b) {
        return a.get.call(b);
      } : null;
    }(),
        td = {
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
        ud = {
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

    function vd(a, b) {
      var c = [],
          d = a;

      for (a = a === window ? window : a.getRootNode(); d;) {
        c.push(d), d = d.assignedSlot ? d.assignedSlot : d.nodeType === Node.DOCUMENT_FRAGMENT_NODE && d.host && (b || d !== a) ? d.host : d.parentNode;
      }

      c[c.length - 1] === document && c.push(window);
      return c;
    }

    function wd(a, b) {
      if (!B) return a;
      a = vd(a, !0);

      for (var c = 0, d, e = void 0, f, g = void 0; c < b.length; c++) {
        if (d = b[c], f = d === window ? window : d.getRootNode(), f !== e && (g = a.indexOf(f), e = f), !B(f) || -1 < g) return d;
      }
    }

    var xd = {
      get composed() {
        void 0 === this.Z && (sd ? this.Z = "focusin" === this.type || "focusout" === this.type || sd(this) : !1 !== this.isTrusted && (this.Z = td[this.type]));
        return this.Z || !1;
      },

      composedPath: function () {
        this.qa || (this.qa = vd(this.__target, this.composed));
        return this.qa;
      },

      get target() {
        return wd(this.currentTarget || this.__previousCurrentTarget, this.composedPath());
      },

      get relatedTarget() {
        if (!this.ja) return null;
        this.sa || (this.sa = vd(this.ja, !0));
        return wd(this.currentTarget || this.__previousCurrentTarget, this.sa);
      },

      stopPropagation: function () {
        Event.prototype.stopPropagation.call(this);
        this.ia = !0;
      },
      stopImmediatePropagation: function () {
        Event.prototype.stopImmediatePropagation.call(this);
        this.ia = this.Aa = !0;
      }
    };

    function yd(a) {
      function b(b, d) {
        b = new a(b, d);
        b.Z = d && !!d.composed;
        return b;
      }

      ub(b, a);
      b.prototype = a.prototype;
      return b;
    }

    var zd = {
      focus: !0,
      blur: !0
    };

    function Ad(a) {
      return a.__target !== a.target || a.ja !== a.relatedTarget;
    }

    function Bd(a, b, c) {
      if (c = b.__handlers && b.__handlers[a.type] && b.__handlers[a.type][c]) for (var d = 0, e; (e = c[d]) && (!Ad(a) || a.target !== a.relatedTarget) && (e.call(b, a), !a.Aa); d++) {
      }
    }

    function Cd(a) {
      var b = a.composedPath();
      Object.defineProperty(a, "currentTarget", {
        get: function () {
          return d;
        },
        configurable: !0
      });

      for (var c = b.length - 1; 0 <= c; c--) {
        var d = b[c];
        Bd(a, d, "capture");
        if (a.ia) return;
      }

      Object.defineProperty(a, "eventPhase", {
        get: function () {
          return Event.AT_TARGET;
        }
      });
      var e;

      for (c = 0; c < b.length; c++) {
        d = b[c];
        var f = y(d);
        f = f && f.root;
        if (0 === c || f && f === e) if (Bd(a, d, "bubble"), d !== window && (e = d.getRootNode()), a.ia) break;
      }
    }

    function Dd(a, b, c, d, e, f) {
      for (var g = 0; g < a.length; g++) {
        var h = a[g],
            k = h.type,
            l = h.capture,
            n = h.once,
            p = h.passive;
        if (b === h.node && c === k && d === l && e === n && f === p) return g;
      }

      return -1;
    }

    function Ed(a, b, c) {
      if (b) {
        var d = typeof b;
        if ("function" === d || "object" === d) if ("object" !== d || b.handleEvent && "function" === typeof b.handleEvent) {
          var e = this instanceof Window ? C.cb : C.addEventListener;
          if (ud[a]) return e.call(this, a, b, c);

          if (c && "object" === typeof c) {
            var f = !!c.capture;
            var g = !!c.once;
            var h = !!c.passive;
          } else f = !!c, h = g = !1;

          var k = c && c.ka || this,
              l = b[rd];

          if (l) {
            if (-1 < Dd(l, k, a, f, g, h)) return;
          } else b[rd] = [];

          l = function (e) {
            g && this.removeEventListener(a, b, c);
            e.__target || Fd(e);

            if (k !== this) {
              var f = Object.getOwnPropertyDescriptor(e, "currentTarget");
              Object.defineProperty(e, "currentTarget", {
                get: function () {
                  return k;
                },
                configurable: !0
              });
            }

            e.__previousCurrentTarget = e.currentTarget;
            if (!B(k) || -1 != e.composedPath().indexOf(k)) if (e.composed || -1 < e.composedPath().indexOf(k)) if (Ad(e) && e.target === e.relatedTarget) e.eventPhase === Event.BUBBLING_PHASE && e.stopImmediatePropagation();else if (e.eventPhase === Event.CAPTURING_PHASE || e.bubbles || e.target === k || k instanceof Window) {
              var h = "function" === d ? b.call(k, e) : b.handleEvent && b.handleEvent(e);
              k !== this && (f ? (Object.defineProperty(e, "currentTarget", f), f = null) : delete e.currentTarget);
              return h;
            }
          };

          b[rd].push({
            node: k,
            type: a,
            capture: f,
            once: g,
            passive: h,
            fb: l
          });
          zd[a] ? (this.__handlers = this.__handlers || {}, this.__handlers[a] = this.__handlers[a] || {
            capture: [],
            bubble: []
          }, this.__handlers[a][f ? "capture" : "bubble"].push(l)) : e.call(this, a, l, c);
        }
      }
    }

    function Gd(a, b, c) {
      if (b) {
        var d = this instanceof Window ? C.eb : C.removeEventListener;
        if (ud[a]) return d.call(this, a, b, c);

        if (c && "object" === typeof c) {
          var e = !!c.capture;
          var f = !!c.once;
          var g = !!c.passive;
        } else e = !!c, g = f = !1;

        var h = c && c.ka || this,
            k = void 0;
        var l = null;

        try {
          l = b[rd];
        } catch (n) {}

        l && (f = Dd(l, h, a, e, f, g), -1 < f && (k = l.splice(f, 1)[0].fb, l.length || (b[rd] = void 0)));
        d.call(this, a, k || b, c);
        k && zd[a] && this.__handlers && this.__handlers[a] && (a = this.__handlers[a][e ? "capture" : "bubble"], k = a.indexOf(k), -1 < k && a.splice(k, 1));
      }
    }

    function Hd() {
      for (var a in zd) {
        window.addEventListener(a, function (a) {
          a.__target || (Fd(a), Cd(a));
        }, !0);
      }
    }

    function Fd(a) {
      a.__target = a.target;
      a.ja = a.relatedTarget;

      if (A.K) {
        var b = Object.getPrototypeOf(a);

        if (!b.hasOwnProperty("__patchProto")) {
          var c = Object.create(b);
          c.gb = b;
          sb(c, xd);
          b.__patchProto = c;
        }

        a.__proto__ = b.__patchProto;
      } else sb(a, xd);
    }

    var Id = yd(window.Event),
        Jd = yd(window.CustomEvent),
        Kd = yd(window.MouseEvent);

    function Ld() {
      window.Event = Id;
      window.CustomEvent = Jd;
      window.MouseEvent = Kd;
      Hd();

      if (!sd && Object.getOwnPropertyDescriptor(Event.prototype, "isTrusted")) {
        var a = function () {
          var a = new MouseEvent("click", {
            bubbles: !0,
            cancelable: !0,
            composed: !0
          });
          this.dispatchEvent(a);
        };

        Element.prototype.click ? Element.prototype.click = a : HTMLElement.prototype.click && (HTMLElement.prototype.click = a);
      }
    }

    function Md(a, b) {
      return {
        index: a,
        X: [],
        ba: b
      };
    }

    function Nd(a, b, c, d) {
      var e = 0,
          f = 0,
          g = 0,
          h = 0,
          k = Math.min(b - e, d - f);
      if (0 == e && 0 == f) a: {
        for (g = 0; g < k; g++) {
          if (a[g] !== c[g]) break a;
        }

        g = k;
      }

      if (b == a.length && d == c.length) {
        h = a.length;

        for (var l = c.length, n = 0; n < k - g && Od(a[--h], c[--l]);) {
          n++;
        }

        h = n;
      }

      e += g;
      f += g;
      b -= h;
      d -= h;
      if (0 == b - e && 0 == d - f) return [];

      if (e == b) {
        for (b = Md(e, 0); f < d;) {
          b.X.push(c[f++]);
        }

        return [b];
      }

      if (f == d) return [Md(e, b - e)];
      k = e;
      g = f;
      d = d - g + 1;
      h = b - k + 1;
      b = Array(d);

      for (l = 0; l < d; l++) {
        b[l] = Array(h), b[l][0] = l;
      }

      for (l = 0; l < h; l++) {
        b[0][l] = l;
      }

      for (l = 1; l < d; l++) {
        for (n = 1; n < h; n++) {
          if (a[k + n - 1] === c[g + l - 1]) b[l][n] = b[l - 1][n - 1];else {
            var p = b[l - 1][n] + 1,
                G = b[l][n - 1] + 1;
            b[l][n] = p < G ? p : G;
          }
        }
      }

      k = b.length - 1;
      g = b[0].length - 1;
      d = b[k][g];

      for (a = []; 0 < k || 0 < g;) {
        0 == k ? (a.push(2), g--) : 0 == g ? (a.push(3), k--) : (h = b[k - 1][g - 1], l = b[k - 1][g], n = b[k][g - 1], p = l < n ? l < h ? l : h : n < h ? n : h, p == h ? (h == d ? a.push(0) : (a.push(1), d = h), k--, g--) : p == l ? (a.push(3), k--, d = l) : (a.push(2), g--, d = n));
      }

      a.reverse();
      b = void 0;
      k = [];

      for (g = 0; g < a.length; g++) {
        switch (a[g]) {
          case 0:
            b && (k.push(b), b = void 0);
            e++;
            f++;
            break;

          case 1:
            b || (b = Md(e, 0));
            b.ba++;
            e++;
            b.X.push(c[f]);
            f++;
            break;

          case 2:
            b || (b = Md(e, 0));
            b.ba++;
            e++;
            break;

          case 3:
            b || (b = Md(e, 0)), b.X.push(c[f]), f++;
        }
      }

      b && k.push(b);
      return k;
    }

    function Od(a, b) {
      return a === b;
    }
    var Pd = J.parentNode,
        Qd = J.childNodes,
        Rd = {},
        Sd = A.deferConnectionCallbacks && "loading" === document.readyState,
        Td;

    function Ud(a) {
      var b = [];

      do {
        b.unshift(a);
      } while (a = a.parentNode);

      return b;
    }

    function Hc(a, b, c) {
      if (a !== Rd) throw new TypeError("Illegal constructor");
      this.Ga = "ShadyRoot";
      this.host = b;
      this.c = c && c.mode;
      a = Qd(b);
      Oc(b, a);
      c = x(b);
      c.root = this;
      c.wa = "closed" !== this.c ? this : null;
      c = x(this);
      c.firstChild = c.lastChild = c.parentNode = c.nextSibling = c.previousSibling = null;
      c.childNodes = [];
      this.b = this.V = !1;
      this.a = this.w = this.m = null;

      if (A.preferPerformance) {
        c = 0;

        for (var d = a.length; c < d; c++) {
          C.removeChild.call(b, a[c]);
        }
      } else ad(this);
    }

    function ad(a) {
      a.V || (a.V = !0, Hb(function () {
        return Vd(a);
      }));
    }

    function Vd(a) {
      for (var b; a;) {
        a.V && (b = a);

        a: {
          var c = a;
          a = c.host.getRootNode();
          if (B(a)) for (var d = c.host.childNodes, e = 0; e < d.length; e++) {
            if (c = d[e], "slot" == c.localName) break a;
          }
          a = void 0;
        }
      }

      b && b._renderRoot();
    }

    Hc.prototype._renderRoot = function () {
      var a = Sd;
      Sd = !0;
      this.V = !1;

      if (this.m) {
        id(this);

        for (var b = 0, c; b < this.m.length; b++) {
          c = this.m[b];
          var d = y(c),
              e = d.assignedNodes;
          d.assignedNodes = [];
          d.N = [];
          if (d.la = e) for (d = 0; d < e.length; d++) {
            var f = y(e[d]);
            f.aa = f.assignedSlot;
            f.assignedSlot === c && (f.assignedSlot = null);
          }
        }

        for (b = this.host.firstChild; b; b = b.nextSibling) {
          Wd(this, b);
        }

        for (b = 0; b < this.m.length; b++) {
          c = this.m[b];
          e = y(c);
          if (!e.assignedNodes.length) for (d = c.firstChild; d; d = d.nextSibling) {
            Wd(this, d, c);
          }
          (d = (d = y(c.parentNode)) && d.root) && (gd(d) || d.V) && d._renderRoot();
          Xd(this, e.N, e.assignedNodes);

          if (d = e.la) {
            for (f = 0; f < d.length; f++) {
              y(d[f]).aa = null;
            }

            e.la = null;
            d.length > e.assignedNodes.length && (e.da = !0);
          }

          e.da && (e.da = !1, Yd(this, c));
        }

        c = this.m;
        b = [];

        for (e = 0; e < c.length; e++) {
          d = c[e].parentNode, (f = y(d)) && f.root || !(0 > b.indexOf(d)) || b.push(d);
        }

        for (c = 0; c < b.length; c++) {
          f = b[c];
          e = f === this ? this.host : f;
          d = [];
          f = f.childNodes;

          for (var g = 0; g < f.length; g++) {
            var h = f[g];

            if ("slot" == h.localName) {
              h = y(h).N;

              for (var k = 0; k < h.length; k++) {
                d.push(h[k]);
              }
            } else d.push(h);
          }

          f = Qd(e);
          g = Nd(d, d.length, f, f.length);
          k = h = 0;

          for (var l = void 0; h < g.length && (l = g[h]); h++) {
            for (var n = 0, p = void 0; n < l.X.length && (p = l.X[n]); n++) {
              Pd(p) === e && C.removeChild.call(e, p), f.splice(l.index + k, 1);
            }

            k -= l.ba;
          }

          k = 0;

          for (l = void 0; k < g.length && (l = g[k]); k++) {
            for (h = f[l.index], n = l.index; n < l.index + l.ba; n++) {
              p = d[n], C.insertBefore.call(e, p, h), f.splice(n, 0, p);
            }
          }
        }
      }

      if (!A.preferPerformance && !this.b) for (b = this.host.childNodes, c = 0, e = b.length; c < e; c++) {
        d = b[c], f = y(d), Pd(d) !== this.host || "slot" !== d.localName && f.assignedSlot || C.removeChild.call(this.host, d);
      }
      this.b = !0;
      Sd = a;
      Td && Td();
    };

    function Wd(a, b, c) {
      var d = x(b),
          e = d.aa;
      d.aa = null;
      c || (c = (a = a.w[b.slot || "__catchall"]) && a[0]);
      c ? (x(c).assignedNodes.push(b), d.assignedSlot = c) : d.assignedSlot = void 0;
      e !== d.assignedSlot && d.assignedSlot && (x(d.assignedSlot).da = !0);
    }

    function Xd(a, b, c) {
      for (var d = 0, e = void 0; d < c.length && (e = c[d]); d++) {
        if ("slot" == e.localName) {
          var f = y(e).assignedNodes;
          f && f.length && Xd(a, b, f);
        } else b.push(c[d]);
      }
    }

    function Yd(a, b) {
      C.dispatchEvent.call(b, new Event("slotchange"));
      b = y(b);
      b.assignedSlot && Yd(a, b.assignedSlot);
    }

    function $c(a, b) {
      a.a = a.a || [];
      a.m = a.m || [];
      a.w = a.w || {};
      a.a.push.apply(a.a, b instanceof Array ? b : na(ma(b)));
    }

    function id(a) {
      if (a.a && a.a.length) {
        for (var b = a.a, c, d = 0; d < b.length; d++) {
          var e = b[d];
          Oc(e);
          Oc(e.parentNode);
          var f = jd(e);
          a.w[f] ? (c = c || {}, c[f] = !0, a.w[f].push(e)) : a.w[f] = [e];
          a.m.push(e);
        }

        if (c) for (var g in c) {
          a.w[g] = kd(a.w[g]);
        }
        a.a = [];
      }
    }

    function jd(a) {
      var b = a.name || a.getAttribute("name") || "__catchall";
      return a.Ea = b;
    }

    function kd(a) {
      return a.sort(function (a, c) {
        a = Ud(a);

        for (var b = Ud(c), e = 0; e < a.length; e++) {
          c = a[e];
          var f = b[e];
          if (c !== f) return a = Array.from(c.parentNode.childNodes), a.indexOf(c) - a.indexOf(f);
        }
      });
    }

    function fd(a, b) {
      if (a.m) {
        id(a);
        var c = a.w,
            d;

        for (d in c) {
          for (var e = c[d], f = 0; f < e.length; f++) {
            var g = e[f];

            if (Ab(b, g)) {
              e.splice(f, 1);
              var h = a.m.indexOf(g);
              0 <= h && a.m.splice(h, 1);
              f--;
              g = y(g);
              if (h = g.N) for (var k = 0; k < h.length; k++) {
                var l = h[k],
                    n = Pd(l);
                n && C.removeChild.call(n, l);
              }
              g.N = [];
              g.assignedNodes = [];
              h = !0;
            }
          }
        }

        return h;
      }
    }

    function gd(a) {
      id(a);
      return !(!a.m || !a.m.length);
    }

    if (window.customElements && A.na && !A.preferPerformance) {
      var Zd = new Map();

      Td = function () {
        var a = Array.from(Zd);
        Zd.clear();
        a = ma(a);

        for (var b = a.next(); !b.done; b = a.next()) {
          b = ma(b.value);
          var c = b.next().value;
          b.next().value ? c.Ca() : c.Da();
        }
      };

      Sd && document.addEventListener("readystatechange", function () {
        Sd = !1;
        Td();
      }, {
        once: !0
      });

      var $d = function (a, b, c) {
        var d = 0,
            e = "__isConnected" + d++;
        if (b || c) a.prototype.connectedCallback = a.prototype.Ca = function () {
          Sd ? Zd.set(this, !0) : this[e] || (this[e] = !0, b && b.call(this));
        }, a.prototype.disconnectedCallback = a.prototype.Da = function () {
          Sd ? this.isConnected || Zd.set(this, !1) : this[e] && (this[e] = !1, c && c.call(this));
        };
        return a;
      },
          define = window.customElements.define;

      Object.defineProperty(window.CustomElementRegistry.prototype, "define", {
        value: function (a, b) {
          var c = b.prototype.connectedCallback,
              d = b.prototype.disconnectedCallback;
          define.call(window.customElements, a, $d(b, c, d));
          b.prototype.connectedCallback = c;
          b.prototype.disconnectedCallback = d;
        }
      });
    }

    function ae(a) {
      var b = a.getRootNode();
      B(b) && Vd(b);
      return (a = y(a)) && a.assignedSlot || null;
    }

    var be = {
      addEventListener: Ed.bind(window),
      removeEventListener: Gd.bind(window)
    },
        ce = {
      addEventListener: Ed,
      removeEventListener: Gd,
      appendChild: function (a) {
        return Sc(this, a);
      },
      insertBefore: function (a, b) {
        return Sc(this, a, b);
      },
      removeChild: function (a) {
        return Vc(this, a);
      },
      replaceChild: function (a, b) {
        Sc(this, a, b);
        Vc(this, b);
        return a;
      },
      cloneNode: function (a) {
        if ("template" == this.localName) var b = C.cloneNode.call(this, a);else if (b = C.cloneNode.call(this, !1), a && b.nodeType !== Node.ATTRIBUTE_NODE) {
          a = this.childNodes;

          for (var c = 0, d; c < a.length; c++) {
            d = a[c].cloneNode(!0), b.appendChild(d);
          }
        }
        return b;
      },
      getRootNode: function () {
        return ld(this);
      },
      contains: function (a) {
        return Ab(this, a);
      },
      dispatchEvent: function (a) {
        Ib();
        return C.dispatchEvent.call(this, a);
      }
    };
    Object.defineProperties(ce, {
      isConnected: {
        get: function () {
          if (yc && yc.call(this)) return !0;
          if (this.nodeType == Node.DOCUMENT_FRAGMENT_NODE) return !1;
          var a = this.ownerDocument;

          if (zb) {
            if (C.contains.call(a, this)) return !0;
          } else if (a.documentElement && C.contains.call(a.documentElement, this)) return !0;

          for (a = this; a && !(a instanceof Document);) {
            a = a.parentNode || (B(a) ? a.host : void 0);
          }

          return !!(a && a instanceof Document);
        },
        configurable: !0
      }
    });
    var de = {
      get assignedSlot() {
        return ae(this);
      }

    },
        ee = {
      querySelector: function (a) {
        return md(this, function (b) {
          return rb.call(b, a);
        }, function (a) {
          return !!a;
        })[0] || null;
      },
      querySelectorAll: function (a, b) {
        if (b) {
          b = Array.prototype.slice.call(C.querySelectorAll.call(this, a));
          var c = this.getRootNode();
          return b.filter(function (a) {
            return a.getRootNode() == c;
          });
        }

        return md(this, function (b) {
          return rb.call(b, a);
        });
      }
    },
        fe = {},
        ge = {
      assignedNodes: function (a) {
        if ("slot" === this.localName) {
          var b = this.getRootNode();
          B(b) && Vd(b);
          return (b = y(this)) ? (a && a.flatten ? b.N : b.assignedNodes) || [] : [];
        }
      }
    },
        he = tb({
      setAttribute: function (a, b) {
        pd(this, a, b);
      },
      removeAttribute: function (a) {
        C.removeAttribute.call(this, a);
        hd(this, a);
      },
      attachShadow: function (a) {
        if (!this) throw "Must provide a host.";
        if (!a) throw "Not enough arguments.";
        return new Hc(Rd, this, a);
      },

      get slot() {
        return this.getAttribute("slot");
      },

      set slot(a) {
        pd(this, "slot", a);
      },

      get assignedSlot() {
        return ae(this);
      }

    }, ee, ge);
    Object.defineProperties(he, Dc);
    var ie = {
      importNode: function (a, b) {
        return qd(a, b);
      },
      getElementById: function (a) {
        return md(this, function (b) {
          return b.id == a;
        }, function (a) {
          return !!a;
        })[0] || null;
      }
    };
    Object.defineProperties(ie, {
      _activeElement: Ec.activeElement
    });

    for (var je = HTMLElement.prototype.blur, ke = {
      blur: function () {
        var a = y(this);
        (a = (a = a && a.root) && a.activeElement) ? a.blur() : je.call(this);
      }
    }, le = {}, me = ma(Object.getOwnPropertyNames(Document.prototype)), ne = me.next(); !ne.done; le = {
      H: le.H
    }, ne = me.next()) {
      le.H = ne.value, "on" === le.H.substring(0, 2) && Object.defineProperty(ke, le.H, {
        set: function (a) {
          return function (b) {
            var c = x(this),
                d = a.H.substring(2);
            c.$[a.H] && this.removeEventListener(d, c.$[a.H]);
            this.addEventListener(d, b, {});
            c.$[a.H] = b;
          };
        }(le),
        get: function (a) {
          return function () {
            var b = y(this);
            return b && b.$[a.H];
          };
        }(le),
        configurable: !0
      });
    }

    var oe = tb({
      addEventListener: function (a, b, c) {
        "object" !== typeof c && (c = {
          capture: !!c
        });
        c.ka = this;
        this.host.addEventListener(a, b, c);
      },
      removeEventListener: function (a, b, c) {
        "object" !== typeof c && (c = {
          capture: !!c
        });
        c.ka = this;
        this.host.removeEventListener(a, b, c);
      },
      getElementById: function (a) {
        return md(this, function (b) {
          return b.id == a;
        }, function (a) {
          return !!a;
        })[0] || null;
      }
    }, ee);
    A.preferPerformance || (tb(ie, ee), tb(fe, ee));

    function L(a, b) {
      for (var c = Object.getOwnPropertyNames(b), d = 0; d < c.length; d++) {
        var e = c[d],
            f = Object.getOwnPropertyDescriptor(b, e);
        f.value ? a[e] = f.value : Object.defineProperty(a, e, f);
      }
    }

    if (A.na) {
      var ShadyDOM = {
        inUse: A.na,
        patch: function (a) {
          Jc(a);
          Ic(a);
          return a;
        },
        isShadyRoot: B,
        enqueue: Hb,
        flush: Ib,
        settings: A,
        filterMutations: Nb,
        observeChildren: Lb,
        unobserveChildren: Mb,
        nativeMethods: C,
        nativeTree: J,
        deferConnectionCallbacks: A.deferConnectionCallbacks,
        preferPerformance: A.preferPerformance,
        handlesDynamicScoping: !0
      };
      window.ShadyDOM = ShadyDOM;
      Ld();
      var pe = window.customElements && window.customElements.nativeHTMLElement || HTMLElement;
      L(Hc.prototype, oe);
      L(window.Node.prototype, ce);
      L(window.Window.prototype, be);
      L(window.Text.prototype, de);
      L(window.Element.prototype, he);
      L(window.DocumentFragment.prototype, fe);
      L(window.Document.prototype, ie);
      window.HTMLSlotElement && L(window.HTMLSlotElement.prototype, ge);
      L(pe.prototype, ke);
      A.K && (Fc(window.Node.prototype), Fc(window.Text.prototype), Fc(window.DocumentFragment.prototype), Fc(window.Element.prototype), Fc(pe.prototype), Fc(window.Document.prototype), window.HTMLSlotElement && Fc(window.HTMLSlotElement.prototype));
      Gc();
      window.ShadowRoot = Hc;
    }
    var qe = new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));

    function re(a) {
      var b = qe.has(a);
      a = /^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(a);
      return !b && a;
    }

    function M(a) {
      var b = a.isConnected;
      if (void 0 !== b) return b;

      for (; a && !(a.__CE_isImportDocument || a instanceof Document);) {
        a = a.parentNode || (window.ShadowRoot && a instanceof ShadowRoot ? a.host : void 0);
      }

      return !(!a || !(a.__CE_isImportDocument || a instanceof Document));
    }

    function se(a, b) {
      for (; b && b !== a && !b.nextSibling;) {
        b = b.parentNode;
      }

      return b && b !== a ? b.nextSibling : null;
    }

    function te(a, b, c) {
      c = void 0 === c ? new Set() : c;

      for (var d = a; d;) {
        if (d.nodeType === Node.ELEMENT_NODE) {
          var e = d;
          b(e);
          var f = e.localName;

          if ("link" === f && "import" === e.getAttribute("rel")) {
            d = e.import;
            if (d instanceof Node && !c.has(d)) for (c.add(d), d = d.firstChild; d; d = d.nextSibling) {
              te(d, b, c);
            }
            d = se(a, e);
            continue;
          } else if ("template" === f) {
            d = se(a, e);
            continue;
          }

          if (e = e.__CE_shadowRoot) for (e = e.firstChild; e; e = e.nextSibling) {
            te(e, b, c);
          }
        }

        d = d.firstChild ? d.firstChild : se(a, d);
      }
    }

    function N(a, b, c) {
      a[b] = c;
    }

    function ue() {
      this.a = new Map();
      this.v = new Map();
      this.f = [];
      this.c = !1;
    }

    function ve(a, b, c) {
      a.a.set(b, c);
      a.v.set(c.constructorFunction, c);
    }

    function we(a, b) {
      a.c = !0;
      a.f.push(b);
    }

    function xe(a, b) {
      a.c && te(b, function (b) {
        return a.b(b);
      });
    }

    ue.prototype.b = function (a) {
      if (this.c && !a.__CE_patched) {
        a.__CE_patched = !0;

        for (var b = 0; b < this.f.length; b++) {
          this.f[b](a);
        }
      }
    };

    function O(a, b) {
      var c = [];
      te(b, function (a) {
        return c.push(a);
      });

      for (b = 0; b < c.length; b++) {
        var d = c[b];
        1 === d.__CE_state ? a.connectedCallback(d) : ye(a, d);
      }
    }

    function P(a, b) {
      var c = [];
      te(b, function (a) {
        return c.push(a);
      });

      for (b = 0; b < c.length; b++) {
        var d = c[b];
        1 === d.__CE_state && a.disconnectedCallback(d);
      }
    }

    function Q(a, b, c) {
      c = void 0 === c ? {} : c;

      var d = c.bb || new Set(),
          e = c.ha || function (b) {
        return ye(a, b);
      },
          f = [];

      te(b, function (b) {
        if ("link" === b.localName && "import" === b.getAttribute("rel")) {
          var c = b.import;
          c instanceof Node && (c.__CE_isImportDocument = !0, c.__CE_hasRegistry = !0);
          c && "complete" === c.readyState ? c.__CE_documentLoadHandled = !0 : b.addEventListener("load", function () {
            var c = b.import;

            if (!c.__CE_documentLoadHandled) {
              c.__CE_documentLoadHandled = !0;
              var f = new Set(d);
              f.delete(c);
              Q(a, c, {
                bb: f,
                ha: e
              });
            }
          });
        } else f.push(b);
      }, d);
      if (a.c) for (b = 0; b < f.length; b++) {
        a.b(f[b]);
      }

      for (b = 0; b < f.length; b++) {
        e(f[b]);
      }
    }

    function ye(a, b) {
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
          M(b) && a.connectedCallback(b);
        }
      }
    }

    ue.prototype.connectedCallback = function (a) {
      var b = a.__CE_definition;
      b.connectedCallback && b.connectedCallback.call(a);
    };

    ue.prototype.disconnectedCallback = function (a) {
      var b = a.__CE_definition;
      b.disconnectedCallback && b.disconnectedCallback.call(a);
    };

    ue.prototype.attributeChangedCallback = function (a, b, c, d, e) {
      var f = a.__CE_definition;
      f.attributeChangedCallback && -1 < f.observedAttributes.indexOf(b) && f.attributeChangedCallback.call(a, b, c, d, e);
    };

    function ze(a) {
      var b = document;
      this.b = a;
      this.a = b;
      this.P = void 0;
      Q(this.b, this.a);
      "loading" === this.a.readyState && (this.P = new MutationObserver(this.c.bind(this)), this.P.observe(this.a, {
        childList: !0,
        subtree: !0
      }));
    }

    function Ae(a) {
      a.P && a.P.disconnect();
    }

    ze.prototype.c = function (a) {
      var b = this.a.readyState;
      "interactive" !== b && "complete" !== b || Ae(this);

      for (b = 0; b < a.length; b++) {
        for (var c = a[b].addedNodes, d = 0; d < c.length; d++) {
          Q(this.b, c[d]);
        }
      }
    };

    function Be() {
      var a = this;
      this.a = this.B = void 0;
      this.b = new Promise(function (b) {
        a.a = b;
        a.B && b(a.B);
      });
    }

    Be.prototype.resolve = function (a) {
      if (this.B) throw Error("Already resolved.");
      this.B = a;
      this.a && this.a(a);
    };

    function S(a) {
      this.c = !1;
      this.a = a;
      this.G = new Map();

      this.f = function (a) {
        return a();
      };

      this.b = !1;
      this.v = [];
      this.ea = new ze(a);
    }

    r = S.prototype;

    r.define = function (a, b) {
      var c = this;
      if (!(b instanceof Function)) throw new TypeError("Custom element constructors must be functions.");
      if (!re(a)) throw new SyntaxError("The element name '" + a + "' is not valid.");
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
        var l = b.observedAttributes || [];
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
        observedAttributes: l,
        constructionStack: []
      };
      ve(this.a, a, b);
      this.v.push(b);
      this.b || (this.b = !0, this.f(function () {
        return Ce(c);
      }));
    };

    r.ha = function (a) {
      Q(this.a, a);
    };

    function Ce(a) {
      if (!1 !== a.b) {
        a.b = !1;

        for (var b = a.v, c = [], d = new Map(), e = 0; e < b.length; e++) {
          d.set(b[e].localName, []);
        }

        Q(a.a, document, {
          ha: function (b) {
            if (void 0 === b.__CE_state) {
              var e = b.localName,
                  f = d.get(e);
              f ? f.push(b) : a.a.a.get(e) && c.push(b);
            }
          }
        });

        for (e = 0; e < c.length; e++) {
          ye(a.a, c[e]);
        }

        for (; 0 < b.length;) {
          var f = b.shift();
          e = f.localName;
          f = d.get(f.localName);

          for (var g = 0; g < f.length; g++) {
            ye(a.a, f[g]);
          }

          (e = a.G.get(e)) && e.resolve(void 0);
        }
      }
    }

    r.get = function (a) {
      if (a = this.a.a.get(a)) return a.constructorFunction;
    };

    r.za = function (a) {
      if (!re(a)) return Promise.reject(new SyntaxError("'" + a + "' is not a valid custom element name."));
      var b = this.G.get(a);
      if (b) return b.b;
      b = new Be();
      this.G.set(a, b);
      this.a.a.get(a) && !this.v.some(function (b) {
        return b.localName === a;
      }) && b.resolve(void 0);
      return b.b;
    };

    r.Va = function (a) {
      Ae(this.ea);
      var b = this.f;

      this.f = function (c) {
        return a(function () {
          return b(c);
        });
      };
    };

    window.CustomElementRegistry = S;
    S.prototype.define = S.prototype.define;
    S.prototype.upgrade = S.prototype.ha;
    S.prototype.get = S.prototype.get;
    S.prototype.whenDefined = S.prototype.za;
    S.prototype.polyfillWrapFlushCallback = S.prototype.Va;
    var De = window.Document.prototype.createElement,
        Ee = window.Document.prototype.createElementNS,
        Fe = window.Document.prototype.importNode,
        Ge = window.Document.prototype.prepend,
        He = window.Document.prototype.append,
        Ie = window.DocumentFragment.prototype.prepend,
        Je = window.DocumentFragment.prototype.append,
        Ke = window.Node.prototype.cloneNode,
        Le = window.Node.prototype.appendChild,
        Me = window.Node.prototype.insertBefore,
        Ne = window.Node.prototype.removeChild,
        Oe = window.Node.prototype.replaceChild,
        Pe = Object.getOwnPropertyDescriptor(window.Node.prototype, "textContent"),
        Qe = window.Element.prototype.attachShadow,
        Re = Object.getOwnPropertyDescriptor(window.Element.prototype, "innerHTML"),
        Se = window.Element.prototype.getAttribute,
        Te = window.Element.prototype.setAttribute,
        Ue = window.Element.prototype.removeAttribute,
        Ve = window.Element.prototype.getAttributeNS,
        We = window.Element.prototype.setAttributeNS,
        Xe = window.Element.prototype.removeAttributeNS,
        Ye = window.Element.prototype.insertAdjacentElement,
        Ze = window.Element.prototype.insertAdjacentHTML,
        $e = window.Element.prototype.prepend,
        af = window.Element.prototype.append,
        bf = window.Element.prototype.before,
        cf = window.Element.prototype.after,
        df = window.Element.prototype.replaceWith,
        ef = window.Element.prototype.remove,
        ff = window.HTMLElement,
        gf = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, "innerHTML"),
        hf = window.HTMLElement.prototype.insertAdjacentElement,
        jf = window.HTMLElement.prototype.insertAdjacentHTML;
    var kf = new function () {}();

    function lf() {
      var a = mf;

      window.HTMLElement = function () {
        function b() {
          var b = this.constructor,
              d = a.v.get(b);
          if (!d) throw Error("The custom element being constructed was not registered with `customElements`.");
          var e = d.constructionStack;
          if (0 === e.length) return e = De.call(document, d.localName), Object.setPrototypeOf(e, b.prototype), e.__CE_state = 1, e.__CE_definition = d, a.b(e), e;
          d = e.length - 1;
          var f = e[d];
          if (f === kf) throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");
          e[d] = kf;
          Object.setPrototypeOf(f, b.prototype);
          a.b(f);
          return f;
        }

        b.prototype = ff.prototype;
        Object.defineProperty(b.prototype, "constructor", {
          writable: !0,
          configurable: !0,
          enumerable: !1,
          value: b
        });
        return b;
      }();
    }

    function nf(a, b, c) {
      function d(b) {
        return function (c) {
          for (var d = [], e = 0; e < arguments.length; ++e) {
            d[e] = arguments[e];
          }

          e = [];

          for (var f = [], l = 0; l < d.length; l++) {
            var n = d[l];
            n instanceof Element && M(n) && f.push(n);
            if (n instanceof DocumentFragment) for (n = n.firstChild; n; n = n.nextSibling) {
              e.push(n);
            } else e.push(n);
          }

          b.apply(this, d);

          for (d = 0; d < f.length; d++) {
            P(a, f[d]);
          }

          if (M(this)) for (d = 0; d < e.length; d++) {
            f = e[d], f instanceof Element && O(a, f);
          }
        };
      }

      void 0 !== c.ga && (b.prepend = d(c.ga));
      void 0 !== c.append && (b.append = d(c.append));
    }

    function of() {
      var a = mf;
      N(Document.prototype, "createElement", function (b) {
        if (this.__CE_hasRegistry) {
          var c = a.a.get(b);
          if (c) return new c.constructorFunction();
        }

        b = De.call(this, b);
        a.b(b);
        return b;
      });
      N(Document.prototype, "importNode", function (b, c) {
        b = Fe.call(this, b, !!c);
        this.__CE_hasRegistry ? Q(a, b) : xe(a, b);
        return b;
      });
      N(Document.prototype, "createElementNS", function (b, c) {
        if (this.__CE_hasRegistry && (null === b || "http://www.w3.org/1999/xhtml" === b)) {
          var d = a.a.get(c);
          if (d) return new d.constructorFunction();
        }

        b = Ee.call(this, b, c);
        a.b(b);
        return b;
      });
      nf(a, Document.prototype, {
        ga: Ge,
        append: He
      });
    }

    function pf() {
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

                if (0 < h && M(this)) {
                  c = Array(h);

                  for (var k = 0; k < h; k++) {
                    c[k] = e[k];
                  }
                }
              }

              d.set.call(this, a);
              if (c) for (a = 0; a < c.length; a++) {
                P(b, c[a]);
              }
            }
          }
        });
      }

      var b = mf;
      N(Node.prototype, "insertBefore", function (a, d) {
        if (a instanceof DocumentFragment) {
          var c = Array.prototype.slice.apply(a.childNodes);
          a = Me.call(this, a, d);
          if (M(this)) for (d = 0; d < c.length; d++) {
            O(b, c[d]);
          }
          return a;
        }

        c = M(a);
        d = Me.call(this, a, d);
        c && P(b, a);
        M(this) && O(b, a);
        return d;
      });
      N(Node.prototype, "appendChild", function (a) {
        if (a instanceof DocumentFragment) {
          var c = Array.prototype.slice.apply(a.childNodes);
          a = Le.call(this, a);
          if (M(this)) for (var e = 0; e < c.length; e++) {
            O(b, c[e]);
          }
          return a;
        }

        c = M(a);
        e = Le.call(this, a);
        c && P(b, a);
        M(this) && O(b, a);
        return e;
      });
      N(Node.prototype, "cloneNode", function (a) {
        a = Ke.call(this, !!a);
        this.ownerDocument.__CE_hasRegistry ? Q(b, a) : xe(b, a);
        return a;
      });
      N(Node.prototype, "removeChild", function (a) {
        var c = M(a),
            e = Ne.call(this, a);
        c && P(b, a);
        return e;
      });
      N(Node.prototype, "replaceChild", function (a, d) {
        if (a instanceof DocumentFragment) {
          var c = Array.prototype.slice.apply(a.childNodes);
          a = Oe.call(this, a, d);
          if (M(this)) for (P(b, d), d = 0; d < c.length; d++) {
            O(b, c[d]);
          }
          return a;
        }

        c = M(a);
        var f = Oe.call(this, a, d),
            g = M(this);
        g && P(b, d);
        c && P(b, a);
        g && O(b, a);
        return f;
      });
      Pe && Pe.get ? a(Node.prototype, Pe) : we(b, function (b) {
        a(b, {
          enumerable: !0,
          configurable: !0,
          get: function () {
            for (var a = [], b = 0; b < this.childNodes.length; b++) {
              a.push(this.childNodes[b].textContent);
            }

            return a.join("");
          },
          set: function (a) {
            for (; this.firstChild;) {
              Ne.call(this, this.firstChild);
            }

            Le.call(this, document.createTextNode(a));
          }
        });
      });
    }

    function qf(a) {
      function b(b) {
        return function (c) {
          for (var d = [], e = 0; e < arguments.length; ++e) {
            d[e] = arguments[e];
          }

          e = [];

          for (var h = [], k = 0; k < d.length; k++) {
            var l = d[k];
            l instanceof Element && M(l) && h.push(l);
            if (l instanceof DocumentFragment) for (l = l.firstChild; l; l = l.nextSibling) {
              e.push(l);
            } else e.push(l);
          }

          b.apply(this, d);

          for (d = 0; d < h.length; d++) {
            P(a, h[d]);
          }

          if (M(this)) for (d = 0; d < e.length; d++) {
            h = e[d], h instanceof Element && O(a, h);
          }
        };
      }

      var c = Element.prototype;
      void 0 !== bf && (c.before = b(bf));
      void 0 !== bf && (c.after = b(cf));
      void 0 !== df && N(c, "replaceWith", function (b) {
        for (var c = [], d = 0; d < arguments.length; ++d) {
          c[d] = arguments[d];
        }

        d = [];

        for (var g = [], h = 0; h < c.length; h++) {
          var k = c[h];
          k instanceof Element && M(k) && g.push(k);
          if (k instanceof DocumentFragment) for (k = k.firstChild; k; k = k.nextSibling) {
            d.push(k);
          } else d.push(k);
        }

        h = M(this);
        df.apply(this, c);

        for (c = 0; c < g.length; c++) {
          P(a, g[c]);
        }

        if (h) for (P(a, this), c = 0; c < d.length; c++) {
          g = d[c], g instanceof Element && O(a, g);
        }
      });
      void 0 !== ef && N(c, "remove", function () {
        var b = M(this);
        ef.call(this);
        b && P(a, this);
      });
    }

    function rf() {
      function a(a, b) {
        Object.defineProperty(a, "innerHTML", {
          enumerable: b.enumerable,
          configurable: !0,
          get: b.get,
          set: function (a) {
            var c = this,
                e = void 0;
            M(this) && (e = [], te(this, function (a) {
              a !== c && e.push(a);
            }));
            b.set.call(this, a);
            if (e) for (var f = 0; f < e.length; f++) {
              var g = e[f];
              1 === g.__CE_state && d.disconnectedCallback(g);
            }
            this.ownerDocument.__CE_hasRegistry ? Q(d, this) : xe(d, this);
            return a;
          }
        });
      }

      function b(a, b) {
        N(a, "insertAdjacentElement", function (a, c) {
          var e = M(c);
          a = b.call(this, a, c);
          e && P(d, c);
          M(a) && O(d, c);
          return a;
        });
      }

      function c(a, b) {
        function c(a, b) {
          for (var c = []; a !== b; a = a.nextSibling) {
            c.push(a);
          }

          for (b = 0; b < c.length; b++) {
            Q(d, c[b]);
          }
        }

        N(a, "insertAdjacentHTML", function (a, d) {
          a = a.toLowerCase();

          if ("beforebegin" === a) {
            var e = this.previousSibling;
            b.call(this, a, d);
            c(e || this.parentNode.firstChild, this);
          } else if ("afterbegin" === a) e = this.firstChild, b.call(this, a, d), c(this.firstChild, e);else if ("beforeend" === a) e = this.lastChild, b.call(this, a, d), c(e || this.firstChild, null);else if ("afterend" === a) e = this.nextSibling, b.call(this, a, d), c(this.nextSibling, e);else throw new SyntaxError("The value provided (" + String(a) + ") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.");
        });
      }

      var d = mf;
      Qe && N(Element.prototype, "attachShadow", function (a) {
        return this.__CE_shadowRoot = a = Qe.call(this, a);
      });
      Re && Re.get ? a(Element.prototype, Re) : gf && gf.get ? a(HTMLElement.prototype, gf) : we(d, function (b) {
        a(b, {
          enumerable: !0,
          configurable: !0,
          get: function () {
            return Ke.call(this, !0).innerHTML;
          },
          set: function (a) {
            var b = "template" === this.localName,
                c = b ? this.content : this,
                d = Ee.call(document, this.namespaceURI, this.localName);

            for (d.innerHTML = a; 0 < c.childNodes.length;) {
              Ne.call(c, c.childNodes[0]);
            }

            for (a = b ? d.content : d; 0 < a.childNodes.length;) {
              Le.call(c, a.childNodes[0]);
            }
          }
        });
      });
      N(Element.prototype, "setAttribute", function (a, b) {
        if (1 !== this.__CE_state) return Te.call(this, a, b);
        var c = Se.call(this, a);
        Te.call(this, a, b);
        b = Se.call(this, a);
        d.attributeChangedCallback(this, a, c, b, null);
      });
      N(Element.prototype, "setAttributeNS", function (a, b, c) {
        if (1 !== this.__CE_state) return We.call(this, a, b, c);
        var e = Ve.call(this, a, b);
        We.call(this, a, b, c);
        c = Ve.call(this, a, b);
        d.attributeChangedCallback(this, b, e, c, a);
      });
      N(Element.prototype, "removeAttribute", function (a) {
        if (1 !== this.__CE_state) return Ue.call(this, a);
        var b = Se.call(this, a);
        Ue.call(this, a);
        null !== b && d.attributeChangedCallback(this, a, b, null, null);
      });
      N(Element.prototype, "removeAttributeNS", function (a, b) {
        if (1 !== this.__CE_state) return Xe.call(this, a, b);
        var c = Ve.call(this, a, b);
        Xe.call(this, a, b);
        var e = Ve.call(this, a, b);
        c !== e && d.attributeChangedCallback(this, b, c, e, a);
      });
      hf ? b(HTMLElement.prototype, hf) : Ye ? b(Element.prototype, Ye) : console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");
      jf ? c(HTMLElement.prototype, jf) : Ze ? c(Element.prototype, Ze) : console.warn("Custom Elements: `Element#insertAdjacentHTML` was not patched.");
      nf(d, Element.prototype, {
        ga: $e,
        append: af
      });
      qf(d);
    }
    var sf = window.customElements;

    if (!sf || sf.forcePolyfill || "function" != typeof sf.define || "function" != typeof sf.get) {
      var mf = new ue();
      lf();
      of();
      nf(mf, DocumentFragment.prototype, {
        ga: Ie,
        append: Je
      });
      pf();
      rf();
      document.__CE_hasRegistry = !0;
      var customElements = new S(mf);
      Object.defineProperty(window, "customElements", {
        configurable: !0,
        enumerable: !0,
        value: customElements
      });
    }

    function tf() {
      this.end = this.start = 0;
      this.rules = this.parent = this.previous = null;
      this.cssText = this.parsedCssText = "";
      this.atRule = !1;
      this.type = 0;
      this.parsedSelector = this.selector = this.keyframesName = "";
    }

    function wf(a) {
      a = a.replace(xf, "").replace(yf, "");
      var b = zf,
          c = a,
          d = new tf();
      d.start = 0;
      d.end = c.length;

      for (var e = d, f = 0, g = c.length; f < g; f++) {
        if ("{" === c[f]) {
          e.rules || (e.rules = []);
          var h = e,
              k = h.rules[h.rules.length - 1] || null;
          e = new tf();
          e.start = f + 1;
          e.parent = h;
          e.previous = k;
          h.rules.push(e);
        } else "}" === c[f] && (e.end = f + 1, e = e.parent || d);
      }

      return b(d, a);
    }

    function zf(a, b) {
      var c = b.substring(a.start, a.end - 1);
      a.parsedCssText = a.cssText = c.trim();
      a.parent && (c = b.substring(a.previous ? a.previous.end : a.parent.start, a.start - 1), c = Af(c), c = c.replace(Bf, " "), c = c.substring(c.lastIndexOf(";") + 1), c = a.parsedSelector = a.selector = c.trim(), a.atRule = 0 === c.indexOf("@"), a.atRule ? 0 === c.indexOf("@media") ? a.type = Cf : c.match(Df) && (a.type = Ef, a.keyframesName = a.selector.split(Bf).pop()) : a.type = 0 === c.indexOf("--") ? Ff : Gf);
      if (c = a.rules) for (var d = 0, e = c.length, f = void 0; d < e && (f = c[d]); d++) {
        zf(f, b);
      }
      return a;
    }

    function Af(a) {
      return a.replace(/\\([0-9a-f]{1,6})\s/gi, function (a, c) {
        a = c;

        for (c = 6 - a.length; c--;) {
          a = "0" + a;
        }

        return "\\" + a;
      });
    }

    function Hf(a, b, c) {
      c = void 0 === c ? "" : c;
      var d = "";

      if (a.cssText || a.rules) {
        var e = a.rules,
            f;
        if (f = e) f = e[0], f = !(f && f.selector && 0 === f.selector.indexOf("--"));

        if (f) {
          f = 0;

          for (var g = e.length, h = void 0; f < g && (h = e[f]); f++) {
            d = Hf(h, b, d);
          }
        } else b ? b = a.cssText : (b = a.cssText, b = b.replace(If, "").replace(Jf, ""), b = b.replace(Kf, "").replace(Lf, "")), (d = b.trim()) && (d = "  " + d + "\n");
      }

      d && (a.selector && (c += a.selector + " {\n"), c += d, a.selector && (c += "}\n\n"));
      return c;
    }

    var Gf = 1,
        Ef = 7,
        Cf = 4,
        Ff = 1E3,
        xf = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
        yf = /@import[^;]*;/gim,
        If = /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
        Jf = /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
        Kf = /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
        Lf = /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
        Df = /^@[^\s]*keyframes/,
        Bf = /\s+/g;
    var T = !(window.ShadyDOM && window.ShadyDOM.inUse),
        Mf;

    function Nf(a) {
      Mf = a && a.shimcssproperties ? !1 : T || !(navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) || !window.CSS || !CSS.supports || !CSS.supports("box-shadow", "0 0 0 var(--foo)"));
    }

    var Of;
    window.ShadyCSS && void 0 !== window.ShadyCSS.cssBuild && (Of = window.ShadyCSS.cssBuild);
    window.ShadyCSS && void 0 !== window.ShadyCSS.nativeCss ? Mf = window.ShadyCSS.nativeCss : window.ShadyCSS ? (Nf(window.ShadyCSS), window.ShadyCSS = void 0) : Nf(window.WebComponents && window.WebComponents.flags);
    var V = Mf,
        Pf = Of;
    var Qf = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi,
        Rf = /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,
        Sf = /(--[\w-]+)\s*([:,;)]|$)/gi,
        Tf = /(animation\s*:)|(animation-name\s*:)/,
        Uf = /@media\s(.*)/,
        Vf = /\{[^}]*\}/g;
    var Wf = new Set();

    function Xf(a, b) {
      if (!a) return "";
      "string" === typeof a && (a = wf(a));
      b && Yf(a, b);
      return Hf(a, V);
    }

    function Zf(a) {
      !a.__cssRules && a.textContent && (a.__cssRules = wf(a.textContent));
      return a.__cssRules || null;
    }

    function $f(a) {
      return !!a.parent && a.parent.type === Ef;
    }

    function Yf(a, b, c, d) {
      if (a) {
        var e = !1,
            f = a.type;

        if (d && f === Cf) {
          var g = a.selector.match(Uf);
          g && (window.matchMedia(g[1]).matches || (e = !0));
        }

        f === Gf ? b(a) : c && f === Ef ? c(a) : f === Ff && (e = !0);
        if ((a = a.rules) && !e) for (e = 0, f = a.length, g = void 0; e < f && (g = a[e]); e++) {
          Yf(g, b, c, d);
        }
      }
    }

    function ag(a, b, c, d) {
      var e = document.createElement("style");
      b && e.setAttribute("scope", b);
      e.textContent = a;
      bg(e, c, d);
      return e;
    }

    var cg = null;

    function dg(a) {
      a = document.createComment(" Shady DOM styles for " + a + " ");
      var b = document.head;
      b.insertBefore(a, (cg ? cg.nextSibling : null) || b.firstChild);
      return cg = a;
    }

    function bg(a, b, c) {
      b = b || document.head;
      b.insertBefore(a, c && c.nextSibling || b.firstChild);
      cg ? a.compareDocumentPosition(cg) === Node.DOCUMENT_POSITION_PRECEDING && (cg = a) : cg = a;
    }

    function eg(a, b) {
      for (var c = 0, d = a.length; b < d; b++) {
        if ("(" === a[b]) c++;else if (")" === a[b] && 0 === --c) return b;
      }

      return -1;
    }

    function fg(a, b) {
      var c = a.indexOf("var(");
      if (-1 === c) return b(a, "", "", "");
      var d = eg(a, c + 3),
          e = a.substring(c + 4, d);
      c = a.substring(0, c);
      a = fg(a.substring(d + 1), b);
      d = e.indexOf(",");
      return -1 === d ? b(c, e.trim(), "", a) : b(c, e.substring(0, d).trim(), e.substring(d + 1).trim(), a);
    }

    function gg(a, b) {
      T ? a.setAttribute("class", b) : window.ShadyDOM.nativeMethods.setAttribute.call(a, "class", b);
    }

    function hg(a) {
      var b = a.localName,
          c = "";
      b ? -1 < b.indexOf("-") || (c = b, b = a.getAttribute && a.getAttribute("is") || "") : (b = a.is, c = a.extends);
      return {
        is: b,
        Y: c
      };
    }

    function ig(a) {
      for (var b = [], c = "", d = 0; 0 <= d && d < a.length; d++) {
        if ("(" === a[d]) {
          var e = eg(a, d);
          c += a.slice(d, e + 1);
          d = e;
        } else "," === a[d] ? (b.push(c), c = "") : c += a[d];
      }

      c && b.push(c);
      return b;
    }

    function jg(a) {
      if (void 0 !== Pf) return Pf;

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

    function kg(a) {
      a = void 0 === a ? "" : a;
      return "" !== a && V ? T ? "shadow" === a : "shady" === a : !1;
    }

    function lg() {}

    function mg(a, b) {
      ng(W, a, function (a) {
        og(a, b || "");
      });
    }

    function ng(a, b, c) {
      b.nodeType === Node.ELEMENT_NODE && c(b);
      var d;
      "template" === b.localName ? d = (b.content || b._content || b).childNodes : d = b.children || b.childNodes;
      if (d) for (b = 0; b < d.length; b++) {
        ng(a, d[b], c);
      }
    }

    function og(a, b, c) {
      if (b) if (a.classList) c ? (a.classList.remove("style-scope"), a.classList.remove(b)) : (a.classList.add("style-scope"), a.classList.add(b));else if (a.getAttribute) {
        var d = a.getAttribute("class");
        c ? d && (b = d.replace("style-scope", "").replace(b, ""), gg(a, b)) : gg(a, (d ? d + " " : "") + "style-scope " + b);
      }
    }

    function pg(a, b, c) {
      ng(W, a, function (a) {
        og(a, b, !0);
        og(a, c);
      });
    }

    function qg(a, b) {
      ng(W, a, function (a) {
        og(a, b || "", !0);
      });
    }

    function rg(a, b, c, d, e) {
      var f = W;
      e = void 0 === e ? "" : e;
      "" === e && (T || "shady" === (void 0 === d ? "" : d) ? e = Xf(b, c) : (a = hg(a), e = sg(f, b, a.is, a.Y, c) + "\n\n"));
      return e.trim();
    }

    function sg(a, b, c, d, e) {
      var f = tg(c, d);
      c = c ? "." + c : "";
      return Xf(b, function (b) {
        b.c || (b.selector = b.F = ug(a, b, a.b, c, f), b.c = !0);
        e && e(b, c, f);
      });
    }

    function tg(a, b) {
      return b ? "[is=" + a + "]" : a;
    }

    function ug(a, b, c, d, e) {
      var f = ig(b.selector);

      if (!$f(b)) {
        b = 0;

        for (var g = f.length, h = void 0; b < g && (h = f[b]); b++) {
          f[b] = c.call(a, h, d, e);
        }
      }

      return f.filter(function (a) {
        return !!a;
      }).join(",");
    }

    function vg(a) {
      return a.replace(wg, function (a, c, d) {
        -1 < d.indexOf("+") ? d = d.replace(/\+/g, "___") : -1 < d.indexOf("___") && (d = d.replace(/___/g, "+"));
        return ":" + c + "(" + d + ")";
      });
    }

    function xg(a) {
      for (var b = [], c; c = a.match(yg);) {
        var d = c.index,
            e = eg(a, d);
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

    function zg(a, b) {
      var c = a.split("\ue000");
      return b.reduce(function (a, b, f) {
        return a + b + c[f + 1];
      }, c[0]);
    }

    lg.prototype.b = function (a, b, c) {
      var d = !1;
      a = a.trim();
      var e = wg.test(a);
      e && (a = a.replace(wg, function (a, b, c) {
        return ":" + b + "(" + c.replace(/\s/g, "") + ")";
      }), a = vg(a));
      var f = yg.test(a);

      if (f) {
        var g = xg(a);
        a = g.pa;
        g = g.matches;
      }

      a = a.replace(Ag, ":host $1");
      a = a.replace(Bg, function (a, e, f) {
        d || (a = Cg(f, e, b, c), d = d || a.stop, e = a.Ka, f = a.value);
        return e + f;
      });
      f && (a = zg(a, g));
      e && (a = vg(a));
      return a;
    };

    function Cg(a, b, c, d) {
      var e = a.indexOf("::slotted");
      0 <= a.indexOf(":host") ? a = Dg(a, d) : 0 !== e && (a = c ? Eg(a, c) : a);
      c = !1;
      0 <= e && (b = "", c = !0);

      if (c) {
        var f = !0;
        c && (a = a.replace(Fg, function (a, b) {
          return " > " + b;
        }));
      }

      a = a.replace(Gg, function (a, b, c) {
        return '[dir="' + c + '"] ' + b + ", " + b + '[dir="' + c + '"]';
      });
      return {
        value: a,
        Ka: b,
        stop: f
      };
    }

    function Eg(a, b) {
      a = a.split(/(\[.+?\])/);

      for (var c = [], d = 0; d < a.length; d++) {
        if (1 === d % 2) c.push(a[d]);else {
          var e = a[d];
          if ("" !== e || d !== a.length - 1) e = e.split(":"), e[0] += b, c.push(e.join(":"));
        }
      }

      return c.join("");
    }

    function Dg(a, b) {
      var c = a.match(Hg);
      return (c = c && c[2].trim() || "") ? c[0].match(Ig) ? a.replace(Hg, function (a, c, f) {
        return b + f;
      }) : c.split(Ig)[0] === b ? c : "should_not_match" : a.replace(":host", b);
    }

    function Jg(a) {
      ":root" === a.selector && (a.selector = "html");
    }

    lg.prototype.c = function (a) {
      return a.match(":host") ? "" : a.match("::slotted") ? this.b(a, ":not(.style-scope)") : Eg(a.trim(), ":not(.style-scope)");
    };

    da.Object.defineProperties(lg.prototype, {
      a: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return "style-scope";
        }
      }
    });
    var wg = /:(nth[-\w]+)\(([^)]+)\)/,
        Bg = /(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=[])+)/g,
        Ig = /[[.:#*]/,
        Ag = /^(::slotted)/,
        Hg = /(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,
        Fg = /(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,
        Gg = /(.*):dir\((?:(ltr|rtl))\)/,
        yg = /:(?:matches|any|-(?:webkit|moz)-any)/,
        W = new lg();

    function Kg(a, b, c, d, e) {
      this.M = a || null;
      this.b = b || null;
      this.c = c || [];
      this.T = null;
      this.cssBuild = e || "";
      this.Y = d || "";
      this.a = this.I = this.O = null;
    }

    function X(a) {
      return a ? a.__styleInfo : null;
    }

    function Lg(a, b) {
      return a.__styleInfo = b;
    }

    Kg.prototype.f = function () {
      return this.M;
    };

    Kg.prototype._getStyleRules = Kg.prototype.f;

    function Mg(a) {
      var b = this.matches || this.matchesSelector || this.mozMatchesSelector || this.msMatchesSelector || this.oMatchesSelector || this.webkitMatchesSelector;
      return b && b.call(this, a);
    }

    var Ng = navigator.userAgent.match("Trident");

    function Og() {}

    function Pg(a) {
      var b = {},
          c = [],
          d = 0;
      Yf(a, function (a) {
        Qg(a);
        a.index = d++;
        a = a.C.cssText;

        for (var c; c = Sf.exec(a);) {
          var e = c[1];
          ":" !== c[2] && (b[e] = !0);
        }
      }, function (a) {
        c.push(a);
      });
      a.b = c;
      a = [];

      for (var e in b) {
        a.push(e);
      }

      return a;
    }

    function Qg(a) {
      if (!a.C) {
        var b = {},
            c = {};
        Rg(a, c) && (b.L = c, a.rules = null);
        b.cssText = a.parsedCssText.replace(Vf, "").replace(Qf, "");
        a.C = b;
      }
    }

    function Rg(a, b) {
      var c = a.C;

      if (c) {
        if (c.L) return Object.assign(b, c.L), !0;
      } else {
        c = a.parsedCssText;

        for (var d; a = Qf.exec(c);) {
          d = (a[2] || a[3]).trim();
          if ("inherit" !== d || "unset" !== d) b[a[1].trim()] = d;
          d = !0;
        }

        return d;
      }
    }

    function Sg(a, b, c) {
      b && (b = 0 <= b.indexOf(";") ? Tg(a, b, c) : fg(b, function (b, e, f, g) {
        if (!e) return b + g;
        (e = Sg(a, c[e], c)) && "initial" !== e ? "apply-shim-inherit" === e && (e = "inherit") : e = Sg(a, c[f] || f, c) || f;
        return b + (e || "") + g;
      }));
      return b && b.trim() || "";
    }

    function Tg(a, b, c) {
      b = b.split(";");

      for (var d = 0, e, f; d < b.length; d++) {
        if (e = b[d]) {
          Rf.lastIndex = 0;
          if (f = Rf.exec(e)) e = Sg(a, c[f[1]], c);else if (f = e.indexOf(":"), -1 !== f) {
            var g = e.substring(f);
            g = g.trim();
            g = Sg(a, g, c) || g;
            e = e.substring(0, f) + g;
          }
          b[d] = e && e.lastIndexOf(";") === e.length - 1 ? e.slice(0, -1) : e || "";
        }
      }

      return b.join(";");
    }

    function Ug(a, b) {
      var c = {},
          d = [];
      Yf(a, function (a) {
        a.C || Qg(a);
        var e = a.F || a.parsedSelector;
        b && a.C.L && e && Mg.call(b, e) && (Rg(a, c), a = a.index, e = parseInt(a / 32, 10), d[e] = (d[e] || 0) | 1 << a % 32);
      }, null, !0);
      return {
        L: c,
        key: d
      };
    }

    function Vg(a, b, c, d) {
      b.C || Qg(b);

      if (b.C.L) {
        var e = hg(a);
        a = e.is;
        e = e.Y;
        e = a ? tg(a, e) : "html";
        var f = b.parsedSelector,
            g = ":host > *" === f || "html" === f,
            h = 0 === f.indexOf(":host") && !g;
        "shady" === c && (g = f === e + " > *." + e || -1 !== f.indexOf("html"), h = !g && 0 === f.indexOf(e));
        if (g || h) c = e, h && (b.F || (b.F = ug(W, b, W.b, a ? "." + a : "", e)), c = b.F || e), d({
          pa: c,
          Sa: h,
          pb: g
        });
      }
    }

    function Wg(a, b, c) {
      var d = {},
          e = {};
      Yf(b, function (b) {
        Vg(a, b, c, function (c) {
          Mg.call(a._element || a, c.pa) && (c.Sa ? Rg(b, d) : Rg(b, e));
        });
      }, null, !0);
      return {
        Wa: e,
        Qa: d
      };
    }

    function Xg(a, b, c, d) {
      var e = hg(b),
          f = tg(e.is, e.Y),
          g = new RegExp("(?:^|[^.#[:])" + (b.extends ? "\\" + f.slice(0, -1) + "\\]" : f) + "($|[.:[\\s>+~])"),
          h = X(b);
      e = h.M;
      h = h.cssBuild;
      var k = Yg(e, d);
      return rg(b, e, function (b) {
        var e = "";
        b.C || Qg(b);
        b.C.cssText && (e = Tg(a, b.C.cssText, c));
        b.cssText = e;

        if (!T && !$f(b) && b.cssText) {
          var h = e = b.cssText;
          null == b.ua && (b.ua = Tf.test(e));
          if (b.ua) if (null == b.fa) {
            b.fa = [];

            for (var l in k) {
              h = k[l], h = h(e), e !== h && (e = h, b.fa.push(l));
            }
          } else {
            for (l = 0; l < b.fa.length; ++l) {
              h = k[b.fa[l]], e = h(e);
            }

            h = e;
          }
          b.cssText = h;
          b.F = b.F || b.selector;
          e = "." + d;
          l = ig(b.F);
          h = 0;

          for (var u = l.length, w = void 0; h < u && (w = l[h]); h++) {
            l[h] = w.match(g) ? w.replace(f, e) : e + " " + w;
          }

          b.selector = l.join(",");
        }
      }, h);
    }

    function Yg(a, b) {
      a = a.b;
      var c = {};
      if (!T && a) for (var d = 0, e = a[d]; d < a.length; e = a[++d]) {
        var f = e,
            g = b;
        f.f = new RegExp("\\b" + f.keyframesName + "(?!\\B|-)", "g");
        f.a = f.keyframesName + "-" + g;
        f.F = f.F || f.selector;
        f.selector = f.F.replace(f.keyframesName, f.a);
        c[e.keyframesName] = Zg(e);
      }
      return c;
    }

    function Zg(a) {
      return function (b) {
        return b.replace(a.f, a.a);
      };
    }

    function $g(a, b) {
      var c = ah,
          d = Zf(a);
      a.textContent = Xf(d, function (a) {
        var d = a.cssText = a.parsedCssText;
        a.C && a.C.cssText && (d = d.replace(If, "").replace(Jf, ""), a.cssText = Tg(c, d, b));
      });
    }

    da.Object.defineProperties(Og.prototype, {
      a: {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return "x-scope";
        }
      }
    });
    var ah = new Og();
    var bh = {},
        ch = window.customElements;

    if (ch && !T) {
      var dh = ch.define;

      ch.define = function (a, b, c) {
        bh[a] || (bh[a] = dg(a));
        dh.call(ch, a, b, c);
      };
    }

    function eh() {
      this.cache = {};
    }

    eh.prototype.store = function (a, b, c, d) {
      var e = this.cache[a] || [];
      e.push({
        L: b,
        styleElement: c,
        I: d
      });
      100 < e.length && e.shift();
      this.cache[a] = e;
    };

    eh.prototype.fetch = function (a, b, c) {
      if (a = this.cache[a]) for (var d = a.length - 1; 0 <= d; d--) {
        var e = a[d],
            f;

        a: {
          for (f = 0; f < c.length; f++) {
            var g = c[f];

            if (e.L[g] !== b[g]) {
              f = !1;
              break a;
            }
          }

          f = !0;
        }

        if (f) return e;
      }
    };

    function fh() {}

    var gh = new RegExp(W.a + "\\s*([^\\s]*)");

    function hh(a) {
      return (a = (a.classList && a.classList.value ? a.classList.value : a.getAttribute("class") || "").match(gh)) ? a[1] : "";
    }

    function ih(a) {
      var b = a.getRootNode();
      return b === a || b === a.ownerDocument ? "" : (a = b.host) ? hg(a).is : "";
    }

    function jh(a) {
      for (var b = 0; b < a.length; b++) {
        var c = a[b];
        if (c.target !== document.documentElement && c.target !== document.head) for (var d = 0; d < c.addedNodes.length; d++) {
          var e = c.addedNodes[d];

          if (e.nodeType === Node.ELEMENT_NODE) {
            var f = e.getRootNode(),
                g = hh(e);
            if (g && f === e.ownerDocument && ("style" !== e.localName && "template" !== e.localName || "" === jg(e))) qg(e, g);else if (f instanceof ShadowRoot) for (f = ih(e), f !== g && pg(e, g, f), e = window.ShadyDOM.nativeMethods.querySelectorAll.call(e, ":not(." + W.a + ")"), g = 0; g < e.length; g++) {
              f = e[g];
              var h = ih(f);
              h && og(f, h);
            }
          }
        }
      }
    }

    if (!(T || window.ShadyDOM && window.ShadyDOM.handlesDynamicScoping)) {
      var kh = new MutationObserver(jh),
          lh = function (a) {
        kh.observe(a, {
          childList: !0,
          subtree: !0
        });
      };

      if (window.customElements && !window.customElements.polyfillWrapFlushCallback) lh(document);else {
        var mh = function () {
          lh(document.body);
        };

        window.HTMLImports ? window.HTMLImports.whenReady(mh) : requestAnimationFrame(function () {
          if ("loading" === document.readyState) {
            var a = function () {
              mh();
              document.removeEventListener("readystatechange", a);
            };

            document.addEventListener("readystatechange", a);
          } else mh();
        });
      }

      fh = function () {
        jh(kh.takeRecords());
      };
    }

    var nh = fh;
    var oh = {};
    var ph = Promise.resolve();

    function qh(a) {
      if (a = oh[a]) a._applyShimCurrentVersion = a._applyShimCurrentVersion || 0, a._applyShimValidatingVersion = a._applyShimValidatingVersion || 0, a._applyShimNextVersion = (a._applyShimNextVersion || 0) + 1;
    }

    function rh(a) {
      return a._applyShimCurrentVersion === a._applyShimNextVersion;
    }

    function sh(a) {
      a._applyShimValidatingVersion = a._applyShimNextVersion;
      a._validating || (a._validating = !0, ph.then(function () {
        a._applyShimCurrentVersion = a._applyShimNextVersion;
        a._validating = !1;
      }));
    }
    var th = new eh();

    function Y() {
      this.G = {};
      this.c = document.documentElement;
      var a = new tf();
      a.rules = [];
      this.f = Lg(this.c, new Kg(a));
      this.v = !1;
      this.b = this.a = null;
    }

    r = Y.prototype;

    r.flush = function () {
      nh();
    };

    r.Oa = function (a) {
      return Zf(a);
    };

    r.$a = function (a) {
      return Xf(a);
    };

    r.prepareTemplate = function (a, b, c) {
      this.prepareTemplateDom(a, b);
      this.prepareTemplateStyles(a, b, c);
    };

    r.prepareTemplateStyles = function (a, b, c) {
      if (!a._prepared) {
        T || bh[b] || (bh[b] = dg(b));
        a._prepared = !0;
        a.name = b;
        a.extends = c;
        oh[b] = a;
        var d = jg(a),
            e = kg(d);
        c = {
          is: b,
          extends: c
        };
        var f = [];

        for (var g = a.content.querySelectorAll("style"), h = 0; h < g.length; h++) {
          var k = g[h];

          if (k.hasAttribute("shady-unscoped")) {
            if (!T) {
              var l = k.textContent;
              Wf.has(l) || (Wf.add(l), l = k.cloneNode(!0), document.head.appendChild(l));
              k.parentNode.removeChild(k);
            }
          } else f.push(k.textContent), k.parentNode.removeChild(k);
        }

        f = f.join("").trim();
        uh(this);

        if (!e) {
          if (g = !d) g = Rf.test(f) || Qf.test(f), Rf.lastIndex = 0, Qf.lastIndex = 0;
          h = wf(f);
          g && V && this.a && this.a.transformRules(h, b);
          a._styleAst = h;
        }

        g = [];
        V || (g = Pg(a._styleAst));
        if (!g.length || V) h = T ? a.content : null, b = bh[b] || null, d = rg(c, a._styleAst, null, d, e ? f : ""), d = d.length ? ag(d, c.is, h, b) : null, a._style = d;
        a.a = g;
      }
    };

    r.prepareTemplateDom = function (a, b) {
      var c = jg(a);
      T || "shady" === c || a._domPrepared || (a._domPrepared = !0, mg(a.content, b));
    };

    function vh(a) {
      !a.b && window.ShadyCSS && window.ShadyCSS.CustomStyleInterface && (a.b = window.ShadyCSS.CustomStyleInterface, a.b.transformCallback = function (b) {
        a.xa(b);
      }, a.b.validateCallback = function () {
        requestAnimationFrame(function () {
          (a.b.enqueued || a.v) && a.flushCustomStyles();
        });
      });
    }

    function uh(a) {
      !a.a && window.ShadyCSS && window.ShadyCSS.ApplyShim && (a.a = window.ShadyCSS.ApplyShim, a.a.invalidCallback = qh);
      vh(a);
    }

    r.flushCustomStyles = function () {
      uh(this);

      if (this.b) {
        var a = this.b.processStyles();

        if (this.b.enqueued && !kg(this.f.cssBuild)) {
          if (V) {
            if (!this.f.cssBuild) for (var b = 0; b < a.length; b++) {
              var c = this.b.getStyleForCustomStyle(a[b]);

              if (c && V && this.a) {
                var d = Zf(c);
                uh(this);
                this.a.transformRules(d);
                c.textContent = Xf(d);
              }
            }
          } else {
            wh(this, this.c, this.f);

            for (b = 0; b < a.length; b++) {
              (c = this.b.getStyleForCustomStyle(a[b])) && $g(c, this.f.O);
            }

            this.v && this.styleDocument();
          }

          this.b.enqueued = !1;
        }
      }
    };

    r.styleElement = function (a, b) {
      var c = X(a);

      if (!c) {
        var d = hg(a);
        c = d.is;
        d = d.Y;
        var e = bh[c] || null;
        c = oh[c];

        if (c) {
          var f = c._styleAst;
          var g = c.a;
          var h = jg(c);
        }

        f = new Kg(f, e, g, d, h);
        c && Lg(a, f);
        c = f;
      }

      a !== this.c && (this.v = !0);
      b && (c.T = c.T || {}, Object.assign(c.T, b));

      if (V) {
        b = c;
        f = hg(a).is;

        if (b.T) {
          g = b.T;

          for (var k in g) {
            null === k ? a.style.removeProperty(k) : a.style.setProperty(k, g[k]);
          }
        }

        if (!(!(k = oh[f]) && a !== this.c || k && "" !== jg(k)) && k && k._style && !rh(k)) {
          if (rh(k) || k._applyShimValidatingVersion !== k._applyShimNextVersion) uh(this), this.a && this.a.transformRules(k._styleAst, f), k._style.textContent = rg(a, b.M), sh(k);
          T && (f = a.shadowRoot) && (f = f.querySelector("style")) && (f.textContent = rg(a, b.M));
          b.M = k._styleAst;
        }
      } else if (k = c, this.flush(), wh(this, a, k), k.c && k.c.length) {
        b = hg(a).is;
        c = (f = th.fetch(b, k.O, k.c)) ? f.styleElement : null;
        g = k.I;
        (h = f && f.I) || (h = this.G[b] = (this.G[b] || 0) + 1, h = b + "-" + h);
        k.I = h;
        h = k.I;
        d = ah;
        d = c ? c.textContent || "" : Xg(d, a, k.O, h);
        e = X(a);
        var l = e.a;
        l && !T && l !== c && (l._useCount--, 0 >= l._useCount && l.parentNode && l.parentNode.removeChild(l));
        T ? e.a ? (e.a.textContent = d, c = e.a) : d && (c = ag(d, h, a.shadowRoot, e.b)) : c ? c.parentNode || (Ng && -1 < d.indexOf("@media") && (c.textContent = d), bg(c, null, e.b)) : d && (c = ag(d, h, null, e.b));
        c && (c._useCount = c._useCount || 0, e.a != c && c._useCount++, e.a = c);
        h = c;
        T || (c = k.I, e = d = a.getAttribute("class") || "", g && (e = d.replace(new RegExp("\\s*x-scope\\s*" + g + "\\s*", "g"), " ")), e += (e ? " " : "") + "x-scope " + c, d !== e && gg(a, e));
        f || th.store(b, k.O, h, k.I);
      }
    };

    function xh(a, b) {
      return (b = b.getRootNode().host) ? X(b) ? b : xh(a, b) : a.c;
    }

    function wh(a, b, c) {
      a = xh(a, b);
      var d = X(a);
      a = Object.create(d.O || null);
      var e = Wg(b, c.M, c.cssBuild);
      b = Ug(d.M, b).L;
      Object.assign(a, e.Qa, b, e.Wa);
      b = c.T;

      for (var f in b) {
        if ((e = b[f]) || 0 === e) a[f] = e;
      }

      f = ah;
      b = Object.getOwnPropertyNames(a);

      for (e = 0; e < b.length; e++) {
        d = b[e], a[d] = Sg(f, a[d], a);
      }

      c.O = a;
    }

    r.styleDocument = function (a) {
      this.styleSubtree(this.c, a);
    };

    r.styleSubtree = function (a, b) {
      var c = a.shadowRoot;
      (c || a === this.c) && this.styleElement(a, b);
      if (b = c && (c.children || c.childNodes)) for (a = 0; a < b.length; a++) {
        this.styleSubtree(b[a]);
      } else if (a = a.children || a.childNodes) for (b = 0; b < a.length; b++) {
        this.styleSubtree(a[b]);
      }
    };

    r.xa = function (a) {
      var b = this,
          c = jg(a);
      c !== this.f.cssBuild && (this.f.cssBuild = c);

      if (!kg(c)) {
        var d = Zf(a);
        Yf(d, function (a) {
          if (T) Jg(a);else {
            var d = W;
            a.selector = a.parsedSelector;
            Jg(a);
            a.selector = a.F = ug(d, a, d.c, void 0, void 0);
          }
          V && "" === c && (uh(b), b.a && b.a.transformRule(a));
        });
        V ? a.textContent = Xf(d) : this.f.M.rules.push(d);
      }
    };

    r.getComputedStyleValue = function (a, b) {
      var c;
      V || (c = (X(a) || X(xh(this, a))).O[b]);
      return (c = c || window.getComputedStyle(a).getPropertyValue(b)) ? c.trim() : "";
    };

    r.Za = function (a, b) {
      var c = a.getRootNode();
      b = b ? b.split(/\s/) : [];
      c = c.host && c.host.localName;

      if (!c) {
        var d = a.getAttribute("class");

        if (d) {
          d = d.split(/\s/);

          for (var e = 0; e < d.length; e++) {
            if (d[e] === W.a) {
              c = d[e + 1];
              break;
            }
          }
        }
      }

      c && b.push(W.a, c);
      V || (c = X(a)) && c.I && b.push(ah.a, c.I);
      gg(a, b.join(" "));
    };

    r.Ia = function (a) {
      return X(a);
    };

    r.Ya = function (a, b) {
      og(a, b);
    };

    r.ab = function (a, b) {
      og(a, b, !0);
    };

    r.Xa = function (a) {
      return ih(a);
    };

    r.La = function (a) {
      return hh(a);
    };

    Y.prototype.flush = Y.prototype.flush;
    Y.prototype.prepareTemplate = Y.prototype.prepareTemplate;
    Y.prototype.styleElement = Y.prototype.styleElement;
    Y.prototype.styleDocument = Y.prototype.styleDocument;
    Y.prototype.styleSubtree = Y.prototype.styleSubtree;
    Y.prototype.getComputedStyleValue = Y.prototype.getComputedStyleValue;
    Y.prototype.setElementClass = Y.prototype.Za;
    Y.prototype._styleInfoForNode = Y.prototype.Ia;
    Y.prototype.transformCustomStyleForDocument = Y.prototype.xa;
    Y.prototype.getStyleAst = Y.prototype.Oa;
    Y.prototype.styleAstToString = Y.prototype.$a;
    Y.prototype.flushCustomStyles = Y.prototype.flushCustomStyles;
    Y.prototype.scopeNode = Y.prototype.Ya;
    Y.prototype.unscopeNode = Y.prototype.ab;
    Y.prototype.scopeForNode = Y.prototype.Xa;
    Y.prototype.currentScopeForNode = Y.prototype.La;
    Object.defineProperties(Y.prototype, {
      nativeShadow: {
        get: function () {
          return T;
        }
      },
      nativeCss: {
        get: function () {
          return V;
        }
      }
    });
    var Z = new Y(),
        yh,
        zh;
    window.ShadyCSS && (yh = window.ShadyCSS.ApplyShim, zh = window.ShadyCSS.CustomStyleInterface);
    window.ShadyCSS = {
      ScopingShim: Z,
      prepareTemplate: function (a, b, c) {
        Z.flushCustomStyles();
        Z.prepareTemplate(a, b, c);
      },
      prepareTemplateDom: function (a, b) {
        Z.prepareTemplateDom(a, b);
      },
      prepareTemplateStyles: function (a, b, c) {
        Z.flushCustomStyles();
        Z.prepareTemplateStyles(a, b, c);
      },
      styleSubtree: function (a, b) {
        Z.flushCustomStyles();
        Z.styleSubtree(a, b);
      },
      styleElement: function (a) {
        Z.flushCustomStyles();
        Z.styleElement(a);
      },
      styleDocument: function (a) {
        Z.flushCustomStyles();
        Z.styleDocument(a);
      },
      flushCustomStyles: function () {
        Z.flushCustomStyles();
      },
      getComputedStyleValue: function (a, b) {
        return Z.getComputedStyleValue(a, b);
      },
      nativeCss: V,
      nativeShadow: T,
      cssBuild: Pf
    };
    yh && (window.ShadyCSS.ApplyShim = yh);
    zh && (window.ShadyCSS.CustomStyleInterface = zh);
    Window.prototype.Na = !1;

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
        function h(a) {
        }

        var k = e || "scheme start",
            w = 0,
            q = "",
            u = !1,
            R = !1;

        a: for (; (void 0 != a[w - 1] || 0 == w) && !this.i;) {
          var m = a[w];

          switch (k) {
            case "scheme start":
              if (m && p.test(m)) q += m.toLowerCase(), k = "scheme";else if (e) {
                break a;
              } else {
                q = "";
                k = "no scheme";
                continue;
              }
              break;

            case "scheme":
              if (m && G.test(m)) q += m.toLowerCase();else if (":" == m) {
                this.h = q;
                q = "";
                if (e) break a;
                void 0 !== l[this.h] && (this.D = !0);
                k = "file" == this.h ? "relative" : this.D && g && g.h == this.h ? "relative or authority" : this.D ? "authority first slash" : "scheme data";
              } else if (e) {
                break a;
              } else {
                q = "";
                w = 0;
                k = "no scheme";
                continue;
              }
              break;

            case "scheme data":
              "?" == m ? (this.s = "?", k = "query") : "#" == m ? (this.A = "#", k = "fragment") : void 0 != m && "\t" != m && "\n" != m && "\r" != m && (this.ma += c(m));
              break;

            case "no scheme":
              if (g && void 0 !== l[g.h]) {
                k = "relative";
                continue;
              } else f.call(this), this.i = !0;

              break;

            case "relative or authority":
              if ("/" == m && "/" == a[w + 1]) k = "authority ignore slashes";else {
                k = "relative";
                continue;
              }
              break;

            case "relative":
              this.D = !0;
              "file" != this.h && (this.h = g.h);

              if (void 0 == m) {
                this.j = g.j;
                this.o = g.o;
                this.l = g.l.slice();
                this.s = g.s;
                this.u = g.u;
                this.g = g.g;
                break a;
              } else if ("/" == m || "\\" == m) k = "relative slash";else if ("?" == m) this.j = g.j, this.o = g.o, this.l = g.l.slice(), this.s = "?", this.u = g.u, this.g = g.g, k = "query";else if ("#" == m) this.j = g.j, this.o = g.o, this.l = g.l.slice(), this.s = g.s, this.A = "#", this.u = g.u, this.g = g.g, k = "fragment";else {
                k = a[w + 1];
                var z = a[w + 2];
                if ("file" != this.h || !p.test(m) || ":" != k && "|" != k || void 0 != z && "/" != z && "\\" != z && "?" != z && "#" != z) this.j = g.j, this.o = g.o, this.u = g.u, this.g = g.g, this.l = g.l.slice(), this.l.pop();
                k = "relative path";
                continue;
              }

              break;

            case "relative slash":
              if ("/" == m || "\\" == m) k = "file" == this.h ? "file host" : "authority ignore slashes";else {
                "file" != this.h && (this.j = g.j, this.o = g.o, this.u = g.u, this.g = g.g);
                k = "relative path";
                continue;
              }
              break;

            case "authority first slash":
              if ("/" == m) k = "authority second slash";else {
                k = "authority ignore slashes";
                continue;
              }
              break;

            case "authority second slash":
              k = "authority ignore slashes";

              if ("/" != m) {
                continue;
              }

              break;

            case "authority ignore slashes":
              if ("/" != m && "\\" != m) {
                k = "authority";
                continue;
              }

              break;

            case "authority":
              if ("@" == m) {
                u && (q += "%40");
                u = !0;

                for (m = 0; m < q.length; m++) {
                  z = q[m], "\t" == z || "\n" == z || "\r" == z ? h("Invalid whitespace in authority.") : ":" == z && null === this.g ? this.g = "" : (z = c(z), null !== this.g ? this.g += z : this.u += z);
                }

                q = "";
              } else if (void 0 == m || "/" == m || "\\" == m || "?" == m || "#" == m) {
                w -= q.length;
                q = "";
                k = "host";
                continue;
              } else q += m;

              break;

            case "file host":
              if (void 0 == m || "/" == m || "\\" == m || "?" == m || "#" == m) {
                2 != q.length || !p.test(q[0]) || ":" != q[1] && "|" != q[1] ? (0 != q.length && (this.j = b.call(this, q), q = ""), k = "relative path start") : k = "relative path";
                continue;
              } else "\t" == m || "\n" == m || "\r" == m ? h("Invalid whitespace in file host.") : q += m;

              break;

            case "host":
            case "hostname":
              if (":" != m || R) {
                if (void 0 == m || "/" == m || "\\" == m || "?" == m || "#" == m) {
                  this.j = b.call(this, q);
                  q = "";
                  k = "relative path start";
                  if (e) break a;
                  continue;
                } else "\t" != m && "\n" != m && "\r" != m ? ("[" == m ? R = !0 : "]" == m && (R = !1), q += m) : h("Invalid code point in host/hostname: " + m);
              } else if (this.j = b.call(this, q), q = "", k = "port", "hostname" == e) break a;
              break;

            case "port":
              if (/[0-9]/.test(m)) q += m;else if (void 0 == m || "/" == m || "\\" == m || "?" == m || "#" == m || e) {
                "" != q && (q = parseInt(q, 10), q != l[this.h] && (this.o = q + ""), q = "");
                if (e) break a;
                k = "relative path start";
                continue;
              } else "\t" == m || "\n" == m || "\r" == m ? h("Invalid code point in port: " + m) : (f.call(this), this.i = !0);
              break;

            case "relative path start":
              k = "relative path";
              if ("/" != m && "\\" != m) continue;
              break;

            case "relative path":
              if (void 0 != m && "/" != m && "\\" != m && (e || "?" != m && "#" != m)) "\t" != m && "\n" != m && "\r" != m && (q += c(m));else {
                if (z = n[q.toLowerCase()]) q = z;
                ".." == q ? (this.l.pop(), "/" != m && "\\" != m && this.l.push("")) : "." == q && "/" != m && "\\" != m ? this.l.push("") : "." != q && ("file" == this.h && 0 == this.l.length && 2 == q.length && p.test(q[0]) && "|" == q[1] && (q = q[0] + ":"), this.l.push(q));
                q = "";
                "?" == m ? (this.s = "?", k = "query") : "#" == m && (this.A = "#", k = "fragment");
              }
              break;

            case "query":
              e || "#" != m ? void 0 != m && "\t" != m && "\n" != m && "\r" != m && (this.s += d(m)) : (this.A = "#", k = "fragment");
              break;

            case "fragment":
              void 0 != m && "\t" != m && "\n" != m && "\r" != m && (this.A += m);
          }

          w++;
        }
      }

      function f() {
        this.u = this.ma = this.h = "";
        this.g = null;
        this.o = this.j = "";
        this.l = [];
        this.A = this.s = "";
        this.D = this.i = !1;
      }

      function g(a, b) {
        void 0 === b || b instanceof g || (b = new g(String(b)));
        this.a = a;
        f.call(this);
        a = this.a.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, "");
        e.call(this, a, null, b);
      }

      var h = !1;
      if (!a.Na) try {
        var k = new URL("b", "http://a");
        k.pathname = "c%20d";
        h = "http://a/c%20d" === k.href;
      } catch (w) {}

      if (!h) {
        var l = Object.create(null);
        l.ftp = 21;
        l.file = 0;
        l.gopher = 70;
        l.http = 80;
        l.https = 443;
        l.ws = 80;
        l.wss = 443;
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
            if ("" != this.u || null != this.g) a = this.u + (null != this.g ? ":" + this.g : "") + "@";
            return this.protocol + (this.D ? "//" + a + this.host : "") + this.pathname + this.s + this.A;
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
            return this.i ? "" : this.o ? this.j + ":" + this.o : this.j;
          },

          set host(a) {
            !this.i && this.D && e.call(this, a, "host");
          },

          get hostname() {
            return this.j;
          },

          set hostname(a) {
            !this.i && this.D && e.call(this, a, "hostname");
          },

          get port() {
            return this.o;
          },

          set port(a) {
            !this.i && this.D && e.call(this, a, "port");
          },

          get pathname() {
            return this.i ? "" : this.D ? "/" + this.l.join("/") : this.ma;
          },

          set pathname(a) {
            !this.i && this.D && (this.l = [], e.call(this, a, "relative path start"));
          },

          get search() {
            return this.i || !this.s || "?" == this.s ? "" : this.s;
          },

          set search(a) {
            !this.i && this.D && (this.s = "?", "?" == a[0] && (a = a.slice(1)), e.call(this, a, "query"));
          },

          get hash() {
            return this.i || !this.A || "#" == this.A ? "" : this.A;
          },

          set hash(a) {
            this.i || (a ? (this.A = "#", "#" == a[0] && (a = a.slice(1)), e.call(this, a, "fragment")) : this.A = "");
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
    var Ah = document.createElement("style");
    Ah.textContent = "body {transition: opacity ease-in 0.2s; } \nbody[unresolved] {opacity: 0; display: block; overflow: hidden; position: relative; } \n";
    var Bh = document.querySelector("head");
    Bh.insertBefore(Ah, Bh.firstChild);
    var Ch = window.customElements,
        Dh = !1,
        Eh = null;
    Ch.polyfillWrapFlushCallback && Ch.polyfillWrapFlushCallback(function (a) {
      Eh = a;
      Dh && a();
    });

    function Fh() {
      window.HTMLTemplateElement.bootstrap && window.HTMLTemplateElement.bootstrap(window.document);
      Eh && Eh();
      Dh = !0;
      window.WebComponents.ready = !0;
      document.dispatchEvent(new CustomEvent("WebComponentsReady", {
        bubbles: !0
      }));
    }

    "complete" !== document.readyState ? (window.addEventListener("load", Fh), window.addEventListener("DOMContentLoaded", function () {
      window.removeEventListener("load", Fh);
      Fh();
    })) : Fh();
  }).call(window);

  /*!
   * Zen.js v5.0.0-beta.5
   * https://github.com/MoomFE/ZenJS
   * 
   * (c) 2018 Wei Zhang
   * Released under the MIT License.
   */
  var defineProperty = Object.defineProperty;
  var keys = Object.keys;
  /**
   * 方法返回一个给定对象自身可枚举属性的键值对数组.
   * Object.entries polyfill
   */

  function entries(obj) {
    var index, key;
    var ownKeys = keys(obj);
    var result = Array(index = ownKeys.length);

    while (index--) {
      result[index] = [key = ownKeys[index], obj[key]];
    }

    return result;
  }

  var ObjectProto = Object.prototype;
  var toString = ObjectProto.toString;
  var getPrototypeOf = Object.getPrototypeOf;
  var hasOwnProperty = Object.hasOwnProperty;
  /**
   * 判断传入对象是否是 Function 类型
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */

  function isFunction(obj) {
    return typeof obj === 'function';
  }
  /**
   * Transplant from jQuery
   * Version: 3.3.1
   * Homepage: https://jquery.com
   */


  var fnToString = hasOwnProperty.toString,
      ObjectFunctionString = fnToString.call(Object);
  /**
   * 判断传入对象是否是纯粹的对象
   * @param {any} obj 需要判断的对象
   */

  function isPlainObject(obj) {
    if (!obj || toString.call(obj) !== '[object Object]') {
      return false;
    }

    var proto = getPrototypeOf(obj);

    if (!proto) {
      return true;
    }

    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return isFunction(Ctor) && fnToString.call(Ctor) === ObjectFunctionString;
  }

  var create = Object.create;
  var StringProto = String.prototype;
  var BooleanProto = Boolean.prototype;
  var ArrayProto = Array.prototype;
  var FunctionProto = Function.prototype;
  [['String', StringProto], ['Boolean', BooleanProto], ['Array', ArrayProto], ['Function', FunctionProto]].forEach(function (obj) {
    defineProperty(obj[1], "__is" + obj[0] + "__", {
      value: true,
      configurable: false,
      // 删除/定义
      enumerable: false,
      // 枚举
      writable: false // 写入

    });
  });
  var isString = '__isString__';
  var isBoolean = '__isBoolean__';
  var isArray = '__isArray__';
  var isFunction$1 = '__isFunction__';
  var slice = ArrayProto.slice;
  /**
   * 将多个源对象的可枚举属性合并到第一个对象中
   * @param {Boolean} shallow 是否使用浅拷贝模式, 类似于使用 Object.assign
   */

  function assign(shallow, args, parent, noProto) {
    var length = args.length;
    /** 首个源对象下标 */

    var index = 1;
    /** 目标对象 */

    var target = args[0] || (args[0] !== null ? {} : (noProto = true, create(null)));
    /** 当前源对象 */

    var options;
    /** 当前源对象所有可枚举属性名及属性 */

    var ownEntries;
    var ownLength, ownIndex, ownEntrie, ownEntrieName;
    var ownValue, targetValue, cloneValue; // 遍历参数

    for (; index < length; index++) {
      // 无用参数
      if ((options = args[index]) == null) continue; // 所有可枚举属性
      // [ [ key, value ], [ key, value ], [ key, value ] ]

      ownEntries = entries(options);
      ownLength = ownEntries.length;
      ownIndex = 0;

      for (; ownIndex < ownLength; ownIndex++) {
        // [ key, value ]
        ownEntrie = ownEntries[ownIndex];
        ownEntrieName = ownEntrie[0];
        ownValue = ownEntrie[1]; // 非浅拷贝模式下, 当前值是原生对象或数组, 则进行深拷贝

        if (!shallow && ownValue && (isPlainObject(ownValue) || ownValue[isArray])) {
          // 防御下面这种无限引用
          // var target = {};
          // var source = { infiniteLoop: target };
          // 
          // Object.$assign( target, source );
          if (ownValue === target) continue; // 防御下面这种无限引用
          // var target = {};
          // var source = {};
          // target.source = source;
          // source.target = target;
          // 
          // Object.$assign( {}, target )
          else if (parent && parent === ownValue) {
              if (ownLength === 1) return undefined;
              continue;
            }
          targetValue = target[ownEntrieName];

          if (ownValue[isArray]) {
            cloneValue = [];
          } else {
            cloneValue = targetValue && isPlainObject(targetValue) ? targetValue : noProto ? create(null) : {};
          }

          if (assign(false, [cloneValue, ownValue], options, noProto) !== undefined) {
            target[ownEntrieName] = cloneValue;
          }
        } else if (ownValue !== undefined || hasOwnProperty.call(target, ownEntrieName) === false) {
          target[ownEntrieName] = ownValue;
        }
      }
    }

    return target;
  }
  /**
   * 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象. 它将返回目标对象.
   * Object.assign polyfill
   */


  var assign$1 = Object.assign || function () {
    return assign(true, arguments);
  };

  var isArray$1 = Array.isArray;
  /**
   * 在一个对象上定义/修改一个新属性 ( 对 Object.defineProperty 的封装 )
   * @param {any} obj 要在其上定义属性的对象, 为数组时将对数组内对象都进行属性定义
   * @param {String} name 要定义或修改的属性的名称
   * @param {any} options 将被定义或修改的属性描述符
   * @param {any} options2 将被定义或修改的属性描述符, 会覆盖前一个 options
   */

  function define(obj, name, options, options2) {
    if (obj == null) {
      return;
    } // define( [ window, document ], name, options )


    if (isArray$1(obj) && obj instanceof Array) {
      obj.forEach(function (obj) {
        return define(obj, name, options, options2);
      });
      return;
    }

    name.split(' ').forEach(function (name) {
      defineProperty(obj, name, assign$1({}, options, options2));
    });
  }

  var definePropertyOptions = {
    configurable: true,
    // 删除/定义
    enumerable: false,
    // 枚举
    writable: true // 写入

  };
  var defineGetPropertyOptions = {
    configurable: true,
    // 删除/定义
    enumerable: false // 枚举

  };
  /**
   * 在一个对象上定义/修改一个新属性的 value 描述符
   * @param {any} obj 要在其上定义属性的对象, 为数组时将对数组内对象都进行属性定义
   * @param {String} name 要定义或修改的属性的名称
   * @param {Function} value 将被定义或修改的 value 描述符
   * @param {any} options 将被定义或修改的属性描述符
   */

  function defineValue(obj, name, value, options) {
    define(obj, name, {
      value: value
    }, options || definePropertyOptions);
    return value;
  }
  /**
   * 判断传入对象是否是 String 类型
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */


  function isString$1(obj) {
    return typeof obj === 'string';
  }
  /**
   * 判断传入对象是否是 Number 类型, 并且不为 NaN
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */


  function isNumber(obj) {
    return typeof obj === 'number' && obj === obj;
  }
  /**
   * 判断传入对象是否是数字类型或可转为数字
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */


  function $isNumber(obj) {
    var num = obj;

    if ((isNumber(obj) || isString$1(obj) && !isNaN(obj - (num = parseFloat(obj)))) && isFinite(num)) {
      return true;
    }

    return false;
  }
  /**
   * 快捷创建数组
   * @param length 需要创建的数组的长度
   * @param insert 需要填充到数组中的内容, 若传入方法, 将会向方法内传入当前 index, 然后将方法的返回值填充到数组中
   * @param isInsert 若值为真, 即使二个参数 insert 是方法, 都会直接进行插入
   */


  function create$1(length, insert, isInsert) {
    if (!isNumber(length) || length < 1) {
      return [];
    }

    var i = 0;
    var result = Array(length);

    if (!isInsert && isFunction(insert)) {
      for (; i < length; i++) {
        result[i] = insert(i);
      }
    } else {
      for (; i < length; i++) {
        result[i] = insert;
      }
    }

    return result;
  }

  var ceil = Math.ceil;
  /**
   * 创建一个新的数组, 将传入数组按照指定的长度进行分割, 如果数组不能均分, 则最后的数组中是数组剩余的元素
   * @param array 需要进行分割的数组
   * @param size 分割的长度
   */

  function chunk(array, size) {
    var length;

    if (!array || size < 1 || !(length = array.length)) {
      return [];
    }

    return create$1(ceil(length / size), function (index) {
      var start = index * size;
      return array.slice(start, start + size);
    });
  }

  defineValue(Array, '$chunk', chunk);
  defineValue(ArrayProto, '$chunk', function (size) {
    return chunk(this, size);
  });
  defineValue(Array, '$copy', function (source, array) {
    if (!source || !source.length) {
      return [];
    }

    if (isArray$1(array)) {
      return array.concat(source);
    }

    return slice.call(source);
  });
  defineValue(Array, '$create', create$1);

  function $each(array, callback) {
    if (!array || !array.length || !isFunction(callback)) {
      return array;
    }

    var length = array.length;
    var index = 0,
        value;

    for (; index < length; index++) {
      value = array[index];

      if (callback.call(value, value, index, array) === false) {
        break;
      }
    }

    return array;
  }

  defineValue(Array, '$each', $each);
  defineValue(ArrayProto, '$each', function (callback) {
    return $each(this, callback);
  });
  var MAX_SAFE_INTEGER = 9007199254740991;
  /**
   * 判断传入对象是否是一个类数组对象
   * @param value 需要判断的对象
   */

  function isArrayLike(value) {
    if (value == null || value[isFunction$1]) {
      return false;
    }

    if (value[isArray]) {
      return true;
    }

    var length = value.length;

    if (isNumber(length) && length > -1 && length % 1 === 0 && length <= MAX_SAFE_INTEGER) {
      return true;
    }

    return false;
  }
  /**
   * 获取方法指定位参数, 若未传入参数, 则取默认值
   * @param {IArguments} args arguments
   * @param {Number} index 需要在 argument 中取得默认值的下标
   * @param {any} defaultValue 若未传入值时取得默认值
   * @returns {any}
   */


  function parametersDefault(args, index, defaultValue) {
    var arg;

    if (args.length > index && (arg = args[index]) !== undefined) {
      return arg;
    }

    return defaultValue;
  }
  /**
   * 判断传入的两个参数是否相等 ( == )
   * @param {any} one 需要判断的第一参数
   * @param {any} two 需要判断的第二参数
   * @returns {Boolean}
   */


  function equals(one, two) {
    return one == two;
  }
  /**
   * 判断传入的两个参数是否全等 ( === )
   * @param {any} one 需要判断的第一参数
   * @param {any} two 需要判断的第二参数
   * @returns {Boolean}
   */


  function congruence(one, two) {
    return one === two;
  }
  /**
   * 返回一个可以判断两个值的方法.
   * 如果传入值为 Function 类型, 说明是用户传的方法, 则直接返回;
   * 如果传入值不为 Function 类型, 则值是真值, 则返回全等判断方法, 否则返回双等判断方法
   * 
   * @param {*} predicate 
   */


  function getPredicate(predicate) {
    if (isFunction(predicate)) {
      return predicate;
    }

    return predicate ? congruence : equals;
  }

  function autoGetPredicate(args, value, predicateIndex, predicate) {
    if (args.length > 1) {
      predicate = getPredicate(parametersDefault(args, predicateIndex, true));
    } else if (isFunction(value)) {
      predicate = value;
      value = undefined;
    } else {
      predicate = congruence;
    }

    return [value, predicate];
  }

  function equals$1(array, array2) {
    // 可比较数组及类数组的内容
    if (!(isArrayLike(array) && isArrayLike(array2))) {
      return false;
    }

    var length = array.length;

    if (length !== array2.length) {
      return false;
    }

    var predicate = getPredicate(parametersDefault(arguments, 2, true));

    for (var index = 0; index < length; index++) {
      if (!predicate(array[index], array2[index])) {
        return false;
      }
    }

    return true;
  }

  defineValue(Array, '$equals', equals$1);
  defineValue(ArrayProto, '$equals', function (obj, predicate) {
    return equals$1(this, obj, predicate);
  });
  defineValue(Array, '$isArrayLike', isArrayLike);
  var reHasUnicode = /[\u200d\ud800-\udfff\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff\ufe0e\ufe0f]/;
  var reUnicode = /\ud83c[\udffb-\udfff](?=\ud83c[\udffb-\udfff])|(?:[^\ud800-\udfff][\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]?|[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?)*/g;
  /**
   * 判断传入对象是否是 Map 对象
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */

  function isMap(obj) {
    return isFunction(Map) && obj instanceof Map;
  }
  /**
   * 判断传入对象是否是 Set 对象
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */


  function isSet(obj) {
    return isFunction(Set) && obj instanceof Set;
  }
  /**
   * 将 Map 或 Set 类型转换为数组类型,
   * 执行到这之前必须确定传进来的是 Map 或 Set 类型
   * @param { Map | Set } map 
   */


  function mapSetToArray(map) {
    var result = [];

    if (map instanceof Map) {
      map.forEach(function (key, value) {
        return result.push([value, key]);
      });
    } else {
      map.forEach(function (value) {
        return result.push(value);
      });
    }

    return result;
  }
  /**
   * 方法返回一个给定对象自身的所有可枚举属性值的数组.
   * Object.values polyfill
   */


  function values(obj) {
    return keys(obj).map(function (key) {
      return obj[key];
    });
  }

  function $toArray(value, transKey) {
    // 不可转为数组的, 直接返回空数组
    if (!value || value[isBoolean]) {
      return [];
    } // 是字符串类型


    if (value[isString]) {
      if (reHasUnicode.test(value)) {
        return value.match(reUnicode) || [];
      } else {
        return value.split('');
      }
    } // 是数组类型, 那就直接返回一个副本


    if (isArrayLike(value)) {
      return slice.call(value);
    } // 转换 Map, Set 类型


    if (isMap(value) || isSet(value)) {
      return mapSetToArray(value);
    } // 转换 JSON


    if (isPlainObject(value)) {
      return transKey ? keys(value) : values(value);
    }

    return [];
  }

  defineValue(Array, '$toArray', $toArray);
  /**
   * 获取方法从指定位开始的剩余参数
   * @param { IArguments } args arguments
   * @param { Number } index 需要在 arguments 中开始取参数的下标 - default: 0
   * @returns {any[]}
   */

  function parametersRest(args, index) {
    return slice.call(args, index || 0);
  }
  /**
   * 将一个传入的数组的下标修复到正确的位置上,
   * 下标不是数字则返回 0,
   * 下标为负数, 则计算出在数组中应有的下标,
   * 下标为负数且计算完后的下标依旧小于 0, 则返回 0
   * 
   * @param {Array} array 原数组
   * @param {Number} index 传入的下标, 可为负数
   * @param {Number} add 额外值
   * @returns {Number}
   */


  function fixArrayIndex(array, index, add) {
    if (!$isNumber(index) || index < 0 && (index = array.length + Number(index) + (add || 0)) < 0) {
      index = 0;
    }

    return index;
  }

  function $add(self, index, args) {
    var length = args.length;

    if (!length) {
      return self;
    }

    index = fixArrayIndex(self, index, 1);

    for (var i = 0; i < length; i++) {
      self.splice(index++, 0, args[i]);
    }

    return self;
  }

  defineValue(ArrayProto, '$add', function (index) {
    return $add(this, index, parametersRest(arguments, 1));
  });
  defineValue(ArrayProto, '$delete $remove', function (index, noop, returnDeleted) {
    var length = this.length;

    if ((index = fixArrayIndex(this, index)) >= length) {
      index = length - 1;
    }

    var num = parametersDefault(arguments, 1, 1);
    var deleted = this.splice(index, num);
    return returnDeleted ? deleted : this;
  });
  defineValue(ArrayProto, '$deleteValue $removeValue', function (_value) {
    var length = this.length,
        index;

    if (!length) {
      return this;
    }

    var args = autoGetPredicate(arguments, _value, 1);
    var value = args[0];
    var predicate = args[1];

    for (index = 0; index < length;) {
      if (predicate(this[index], value)) {
        this.$delete(index);
        length--;
      } else {
        index++;
      }
    }

    return this;
  });
  defineValue(ArrayProto, '$concat', function () {
    var _this = this;

    slice.call(arguments).forEach(function (arg) {
      $add(_this, -1, isArray$1(arg) ? arg : [arg]);
    });
    return this;
  });
  defineValue(ArrayProto, '$concatTo', function (index) {
    var _this2 = this;

    var args = parametersRest(arguments, 1);

    if (!args.length) {
      return this;
    }

    var originLength = this.length;
    var increasedLength = 0;
    index = fixArrayIndex(this, index, 1);
    args.forEach(function (arg) {
      $add(_this2, increasedLength + index, isArray$1(arg) ? arg : [arg]); // 用于修正 index, 后续的 arg 需要插入到前面的 arg 后面

      increasedLength = _this2.length - originLength;
    });
    return this;
  });
  /**
   * 判断传入对象是否是 Boolean 类型
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */

  function isBoolean$1(obj) {
    return typeof obj === 'boolean';
  }
  /**
   * 判断传入对象是否是空对象
   * @param {*} obj 需要判断的对象
   */


  function isEmptyObject(obj) {
    for (var a in obj) {
      return false;
    }

    return true;
  }
  /**
   * 方法返回对象的遍历方法
   * @param {*} obj 
   * @param {*} predicate 
   */


  function getTraversal(obj, predicate) {
    var objIsArray = obj[isArray];
    return function (object) {
      if (obj == null || isEmptyObject(object)) {
        return false;
      }

      return (objIsArray ? checkArray : checkObject)(obj, object, predicate);
    };
  }

  function checkArray(source, object, predicate) {
    var length = source.length;
    var index = 0,
        chunk,
        key; // 遍历检测对象

    for (; index < length; index++) {
      chunk = source[index];
      key = chunk[0];

      if (!(key in object && (chunk.length === 1 || predicate(chunk[1], object[key])))) {
        return false;
      }
    }

    return true;
  }

  function checkObject(source, object, predicate) {
    var sKeys = keys(source),
        sLength = sKeys.length;
    var index = 0,
        key; // 遍历检测对象

    for (; index < sLength; index++) {
      key = sKeys[index];

      if (!(key in object && predicate(source[key], object[key]))) {
        return false;
      }
    }

    return true;
  }

  function each(obj, callback) {
    if (obj == null) {
      return obj;
    }

    var oKeys = keys(obj),
        length = oKeys.length;
    var index = 0,
        key,
        value;

    for (; index < length; index++) {
      key = oKeys[index];
      value = obj[key];

      if (callback.call(value, key, value, obj) === false) {
        break;
      }
    }

    return obj;
  }

  defineValue(Object, '$each', each);
  defineValue(ObjectProto, '$each', function (callback) {
    return each(this, callback);
  });
  /**
   * @param {Array} self 进行遍历的数组
   * @param {Boolean} reverse 是否反向查询
   * @param {Number} count 保存的查找结果数量
   * @param {Boolean} not 返回 NOT 结果集 ( 非 )
   */

  function find(self, reverse, count, not,
  /**/
  obj, predicate, fromIndex
  /**/
  ) {
    /** 返回值 */
    var result = [];
    /** 当前数组长度 */

    var length; // 1. 传入的内容不可检索
    // 2. 数组为空
    // 3. 结果集过小

    if (obj == null || !(length = self.length) || count < 1) {
      return result;
    }
    /** 遍历方法 */


    var traversal; // 首个参数是方法或布尔值
    // $findIndex( Function, fromIndex? )

    if (isFunction(obj)) {
      traversal = obj;
      fromIndex = predicate;
    } // $findIndex( Array | Object )
    // $findIndex( Array | Object, fromIndex )
    // $findIndex( Array | Object, Function | Boolean )
    // $findIndex( Array | Object, Function | Boolean, fromIndex )
    else {
        // $findIndex( Array | Object, fromIndex )
        if (isNumber(predicate)) {
          fromIndex = predicate;
          predicate = congruence;
        } // $findIndex( Array | Object )
        // $findIndex( Array | Object, Boolean )
        // $findIndex( Array | Object, Boolean, fromIndex )
        else if (!isFunction(predicate)) {
            // $findIndex( Array | Object, Boolean )
            // $findIndex( Array | Object, Boolean, fromIndex )
            if (isBoolean$1(predicate)) {
              predicate = predicate ? congruence : equals;
            } // $findIndex( Array | Object )
            else {
                predicate = congruence;
              }
          }
      } // 指定值遍历时的检测方法


    if (!traversal) {
      if (isArrayLike(obj)) {
        obj = chunk(obj, 2);
      }

      traversal = getTraversal(obj, predicate);
    } // 矫正 fromIndex


    fromIndex = fromIndex || (reverse ? -1 : 0);
    /** 初始开始遍历的 index */

    var index = isNumber(fromIndex) ? fixArrayIndex(self, fromIndex) : reverse ? length - 1 : 0;
    /** 值, 缓存 */

    var value;
    /** 每次自增的值 */

    var add = reverse ? -1 : 1;

    for (; index >= 0 && index <= length - 1; index += add) {
      if ((!!traversal(value = self[index]) ? !not : not) && result.$push([index, value]).length >= count) {
        return result;
      }
    }

    return result;
  }

  each({
    $find: [false, 1],
    $findLast: [true, 1],
    $findAll: [false, Infinity],
    $findSome: [false],
    $findLastSome: [true]
  }, function (name, args) {
    /** 是否反向查询 */
    var reverse = args[0];
    /** 保存的查找结果数量 */

    var count = args[1];
    /** 是否是返回全部结果集 */

    var returnAll = name.indexOf('All') > -1 || !count; // Index, Not, Chunk

    ['', 'Index', 'Chunk'].forEach(function (suffix2, index) {
      /** 是否是返回 index */
      var returnIndex = index === 1 ? 0 : 1;
      /** 是否直接返回 chunk */

      var returnChunk = index === 2;
      ['', 'Not'].forEach(function (suffix, index) {
        /** 全名 */
        var fullname = name + suffix + suffix2;
        /** 是否是返回 NOT 结果集 */

        var not = !!index;
        defineValue(ArrayProto, fullname, function (obj, predicate, fromIndex) {
          var some;

          if (!count) {
            if (isNumber(obj)) {
              some = obj;
              obj = predicate;
              predicate = fromIndex;
              fromIndex = arguments[3];
            } else {
              some = Infinity;
            }
          } // 获取结果集


          var result = find(this, reverse, count || some, not, obj, predicate, fromIndex); // 返回全部结果集

          if (returnAll) {
            return returnChunk ? result : result.map(function (arr) {
              return arr[returnIndex];
            });
          } // 返回单个结果集


          if (result.length) {
            return returnChunk ? result[0] : result[0][returnIndex];
          } else {
            // 返回 chunk 时, 没找到结果也返回 undefined
            return returnIndex || returnChunk ? undefined : -1;
          }
        });
      });
    });
  });
  defineValue(ArrayProto, '$get', function () {
    var args = arguments;
    var index = fixArrayIndex(this, parametersDefault(args, 0, 0));

    if (args.length <= 1) {
      return this[index];
    }

    var num = parametersDefault(args, 1, 1);
    return this.slice(index, num + index);
  });
  /**
   * 判断传入对象是否是 Object 类型, 并且不为 null
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */

  function isObject(obj) {
    return obj !== null && typeof obj === 'object';
  }

  function set(array, index, value) {
    index = fixArrayIndex(array, index); // 占位, 如果位数超过数组长度, 使用 splice 不会创建多余空间
    // [ 1, 2, 3 ].$splice( 99, 1, 4 );
    // [ 1, 2, 3, 4 ]

    array[index] = undefined; // 使 Vue 能够刷新数据

    array.splice(index, 1, value);
  }

  function edit(array, index, value) {
    var length = array.length;

    if ((index = fixArrayIndex(array, index)) >= length) {
      index = length - 1;
    }

    array.splice(index, 1, value);
  }

  ['$set', '$edit'].forEach(function (name, index) {
    var fn = index ? edit : set;
    defineValue(ArrayProto, name, function (index, value) {
      var _this = this;

      if (isObject(index)) {
        entries(index).forEach(function (arr) {
          fn(_this, arr[0], arr[1]);
        });
      } else {
        fn(this, index, value);
      }

      return this;
    });
  });
  defineValue(ArrayProto, '$inArray', function (_value) {
    var index,
        length = this.length;

    if (!length) {
      return false;
    }

    var args = autoGetPredicate(arguments, _value, 1);
    var value = args[0];
    var predicate = args[1];

    for (index = 0; index < length; index++) {
      if (predicate(this[index], value)) {
        return true;
      }
    }

    return false;
  });
  defineValue(ArrayProto, '$move', function (from, to) {
    this.splice(fixArrayIndex(this, to), 0, this.splice(from, 1)[0]);
    return this;
  });
  defineValue(ArrayProto, '$moveRange', function (start, moveCount, toIndex) {
    return $add(this, fixArrayIndex(this, toIndex), this.splice(start, moveCount));
  });
  ['push', 'pop', 'unshift', 'shift', 'splice'].forEach(function (key) {
    defineValue(ArrayProto, '$' + key, function () {
      this[key].apply(this, arguments);
      return this;
    });
  });
  defineValue(Object, '$assign', function (shallow) {
    if (isBoolean$1(shallow)) {
      return assign(shallow, parametersRest(arguments, 1));
    }

    return assign(false, arguments);
  });
  defineValue(ObjectProto, '$assign', function (shallow) {
    if (isBoolean$1(shallow)) {
      return assign(shallow, [this].concat(parametersRest(arguments, 1)));
    }

    return assign(false, [this].concat(slice.call(arguments)));
  });
  /**
   * @type {Boolean} 当前是否是浏览器环境
   */

  var inBrowser = typeof window !== 'undefined';
  /**
   * @type {Element}
   */

  var DomElement = inBrowser ? window.Element : undefined;
  var rType = /^\[object\s([^\]]+)]$/;
  /**
   * 判断一个对象是否是引用类型
   * @param {any} obj 需要判断的对象
   */

  function isReferenceType(obj) {
    var type = typeof obj;
    return type === 'object' || type === 'function';
  }

  function equals$2(obj, obj2, parent, parent2) {
    if (obj === obj2) {
      return true;
    } // 其中一个是假值 ( undefined, null, false, '', 0, NaN )


    if (!obj || !obj2) {
      // 对付 NaN 用的, 要不然直接就返回 false 了
      return obj !== obj && obj2 !== obj2;
    }

    var oString = toString.call(obj); // 实际类型不一样 ( RegExp, Element, ... )
    // 比如上面两种类型都是 object, 但是实际上却是不一样的
    // 过了这一步骤, 类型比对时就只需要比对一个值, 因为类型是完全相同的

    if (oString !== toString.call(obj2)) {
      return false;
    } // 非引用类型 ( String, Boolean, Number )


    if (!isReferenceType(obj)) {
      return false;
    } // 对于 object 更加细致点的比对 ( Map, Set, ... )
    // 它们两都是 [object Object]


    if (obj.constructor !== obj2.constructor) {
      return false;
    } // 是数组类型或类数组类型 ( Array, LikeArray )


    if (isArrayLike(obj)) {
      return types.array(obj, obj2, parent, parent2);
    } // 原始对象类型 ( JSON )


    if (isPlainObject(obj)) {
      return types.object(obj, obj2, parent, parent2);
    }

    var oType = oString.match(rType)[1].toLowerCase(); // 有针对性的比对方法 ( Regexp, Date, Function )

    if (oType in types) {
      return types[oType](obj, obj2, parent, parent2);
    } // ( Elemnet )


    if (DomElement && obj instanceof DomElement) {
      return types.element(obj, obj2);
    } // ( Map, Set )


    if (isMap(obj) || isSet(obj)) {
      return equals$2(mapSetToArray(obj), mapSetToArray(obj2));
    }

    return types.object(obj, obj2, parent, parent2);
  }

  var types = {
    /**
     * @param {Array} obj 
     * @param {Array} obj2 
     */
    array: function (obj, obj2, parent, parent2) {
      var length = obj.length,
          i;

      if (length !== obj2.length) {
        return false;
      }

      for (i = 0; i < length; i++) {
        switch (checkInfiniteLoop(obj[i], obj2[i], parent, parent2, obj, obj2)) {
          case 0:
            return false;

          case 1:
            continue;
        }
      }

      return true;
    },

    /**
     * @param {Object} obj 
     * @param {Object} obj2 
     */
    object: function (obj, obj2, parent, parent2) {
      var _keys = keys(obj);

      var length = _keys.length;
      var i, key;

      if (length !== keys(obj2).length) {
        return false;
      }

      for (i = 0; i < length; i++) {
        key = _keys[i];

        switch (checkInfiniteLoop(obj[key], obj2[key], parent, parent2, obj, obj2)) {
          case 0:
            return false;

          case 1:
            continue;
        }
      }

      return true;
    },

    /**
     * @param {Element} obj 
     * @param {Element} obj2 
     */
    element: function (obj, obj2) {
      return obj.outerHTML === obj2.outerHTML;
    },

    /**
     * @param {RegExp} obj 
     * @param {RegExp} obj2 
     */
    regexp: function (obj, obj2) {
      return obj.toString() === obj2.toString();
    },

    /**
     * @param {Date} obj 
     * @param {Date} obj2 
     */
    date: function (obj, obj2) {
      return +obj === +obj2;
    },

    /**
     * @param {Function} obj 
     * @param {Function} obj2 
     */
    'function': function (obj, obj2) {
      return obj.toString() === obj2.toString();
    }
  };
  /**
   * 检查是否无限引用, 然后继续进行下一步判断
   * @returns {Number} 0: 执行 return;
   *                   1: 执行 continue;
   */

  function checkInfiniteLoop(value, value2, parent, parent2, obj, obj2) {
    // 避免无限引用
    if (parent && (parent === value || parent2 === value2)) {
      return parent === value ? parent2 === value2 ? 1 : 0 : parent === value ? 1 : 0;
    } // 进行下一步判断


    if (!equals$2(value, value2, obj, obj2)) {
      return 0;
    }
  }

  defineValue(Object, '$equals', function (obj, obj2) {
    return equals$2(obj, obj2);
  });
  defineValue(ObjectProto, '$equals', function (obj2) {
    return equals$2(this, obj2);
  });
  defineValue(Object, '$isEmptyObject', isEmptyObject);
  defineValue(Object, '$isPlainObject', isPlainObject); // import './$delete/index';
  // import './$deleteValue/index';
  // import './$each/index';
  // import './$get/index';
  // import './$isEmptyObject/index';
  // import './$isPlainObject/index';
  // import './$self/index';
  // import './$set/index';

  defineValue(ObjectProto, '$get', function (key) {
    var _this = this;

    if (arguments.length < 2) {
      return this[key];
    }

    var result = {};
    slice.call(arguments).forEach(function (key) {
      result[key] = _this[key];
    });
    return result;
  });
  defineValue(ObjectProto, '$set $edit', function (key, value) {
    var _this = this;

    if (isObject(key)) {
      each(key, function (key, value) {
        _this[key] = value;
      });
      return this;
    }

    this[key] = value;
    return this;
  });
  var concat = ArrayProto.concat;
  defineValue(ObjectProto, '$delete $remove', function () {
    var _this = this;

    concat.apply([], arguments).forEach(function (key) {
      delete _this[key];
    });
    return this;
  });
  defineValue(ObjectProto, '$deleteValue $removeValue', function (_value) {
    var _this = this;

    var args = autoGetPredicate(arguments, _value, 1);
    var value = args[0];
    var predicate = args[1];
    entries(this).forEach(function (obj) {
      if (predicate(obj[1], value)) {
        delete _this[obj[0]];
      }
    });
    return this;
  });

  function self() {
    return this;
  }

  defineValue(ObjectProto, '$self', self);
  defineValue(Number, '$isNumber', $isNumber);
  var floor = Math.floor;
  var random = Math.random;
  /**
   * 在传入的两个正整数中随机一个数字
   * @param {Number} from 
   * @param {Number} to 
   */

  function intRandom(from, to) {
    return floor(random() * (to - from + 1) + from);
  }

  var abs = Math.abs;
  defineValue(Math, '$random', function () {
    var args = arguments;
    var from = parametersDefault(args, 0, 0);
    var to = args.length !== 1 ? parametersDefault(args, 1, 9) : 0;

    if (from > to) {
      var _ref = [to, from];
      from = _ref[0];
      to = _ref[1];
    }

    if (from > 0) {
      return intRandom(from, to);
    }

    var result = intRandom(0, to + abs(from));
    return result > to ? to - result : result;
  });
  /**
   * 获取传入数字的小数位长度
   * @param {Number} num
   * @returns {Number}
   */

  function getDecimalLength(num) {
    return (('' + num).split('.')[1] || '').length;
  }

  var max = Math.max;
  var pow = Math.pow;
  /**
   * 构造并返回一个新字符串, 该字符串包含被连接在一起的指定数量的字符串的副本.
   * 是 String.prototype.repeat 的降级方案
   * @param {String} str 需要重复的字符串
   * @param {Number} count 需要重复的次数
   */

  function repeat(str, count) {
    var result = '';

    while (count--) {
      result += str;
    }

    return result;
  }

  var NumberProto = Number.prototype;

  function defineOperation(name, handlerFn) {
    defineValue(Math, name, handlerFn);
    defineValue(NumberProto, name, function (num) {
      return handlerFn(this, num);
    });
  }
  /**
   * 
   * @param {Number} num1 
   * @param {Number} num2 
   * @param {Function} handlerFn 
   * @param {Function} lastHandlerFn 
   */


  function handler(num1, num2, handlerFn, lastHandlerFn) {
    var decimal1 = getDecimalLength(num1 = num1 || 0);
    var decimal2 = getDecimalLength(num2 = num2 || 0);
    var maxDecimal = max(decimal1, decimal2);
    var exponent = maxDecimal ? pow(10, maxDecimal) : 1;

    if (maxDecimal) {
      num1 = integer(num1, decimal1, maxDecimal);
      num2 = integer(num2, decimal2, maxDecimal);
    }

    var result = handlerFn(num1, num2);

    if (lastHandlerFn) {
      return lastHandlerFn(result, exponent);
    }

    return result / exponent;
  }
  /**
   * 将传入数字乘以一定的倍数, 不使用乘法的方式, 防止出现乘法精度不准的问题
   * @param {Number} num 需要处理的数字
   * @param {Number} decimal 当前数字的小数位
   * @param {Number} maxDecimal 最大小数位
   */


  function integer(num, decimal, maxDecimal) {
    num = ('' + num).replace('.', '');

    if (decimal !== maxDecimal) {
      num += repeat('0', maxDecimal - decimal);
    }

    return Number(num);
  } // add


  defineOperation('$jia $add', $add$1);

  function $add$1(num1, num2) {
    return handler(num1, num2, function (num1, num2) {
      return num1 + num2;
    });
  } // subtract


  defineOperation('$jian $subtract', function (num1, num2) {
    return handler(num1, num2, function (num1, num2) {
      return num1 - num2;
    });
  }); // multiply

  defineOperation('$cheng $multiply', function (num1, num2) {
    return handler(num1, num2, function (num1, num2) {
      return num1 * num2;
    }, function (result, exponent) {
      return result / pow(exponent, 2);
    });
  }); // divide

  defineOperation('$chu $divide', $divide);

  function $divide(num1, num2) {
    return handler(num1, num2, function (num1, num2) {
      return num1 / num2;
    }, function (result) {
      return result;
    });
  }

  defineValue(Math, '$mean', function () {
    var count = slice.call(arguments).reduce(function (count, next) {
      return $add$1(count, next);
    });
    return $divide(count, arguments.length);
  });
  var fromCharCode = String.fromCharCode;

  function stringRandom()
  /* uppercase */
  {
    var uppercase = parametersDefault(arguments, 0, false);
    return fromCharCode(uppercase ? intRandom(65, 90) : intRandom(97, 122));
  }

  defineValue(String, '$random', stringRandom);
  defineValue(String, '$someRandom', function ()
  /* length, uppercase, number */
  {
    var args = arguments;
    var uppercase = parametersDefault(args, 1, false);
    var number = parametersDefault(args, 2, false);
    var result = '';
    var length = parametersDefault(args, 0, 12);

    while (length-- > 0) {
      // 指定了也随机大写字母, 则几率是三分之一
      // 否则只是随机小写字母及数字, 则几率是二分之一
      if (number && intRandom(0, uppercase ? 2 : 1) === 0) {
        result += intRandom(0, 9);
      } // 随机大小写字母
      else {
          result += stringRandom(uppercase && intRandom(0, 1) === 0);
        }
    }

    return result;
  });
  var rkeyword = /([\.\*\+\?\|\(\)\[\]\{\}\^\$\\])/g;
  /**
   * 判断传入对象是否是 RegExp 类型
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */

  function isRegExp(obj) {
    return toString.call(obj) === '[object RegExp]';
  }

  var RegExpProto = RegExp.prototype;
  /**
   * 在一个对象上定义/修改一个新属性的 get 描述符
   * @param {any} obj 要在其上定义属性的对象, 为数组时将对数组内对象都进行属性定义
   * @param {String} name 要定义或修改的属性的名称
   * @param {Function} get 将被定义或修改的 get 描述符
   * @param {any} options 将被定义或修改的属性描述符
   */

  function defineGet(obj, name, get, options) {
    define(obj, name, {
      get: get
    }, options || defineGetPropertyOptions);
    return get;
  }

  var rflags = /[gimsuy]*$/;

  if (RegExpProto.flags === undefined) {
    defineGet(RegExpProto, 'flags', function () {
      return this.toString().match(rflags)[0];
    });
  }

  defineValue(StringProto, '$replaceAll', function (searchValue, replaceValue) {
    var flags = 'g';

    if (searchValue == null) {
      return this;
    }

    if (searchValue[isString]) {
      searchValue = searchValue.replace(rkeyword, '\\$1');
    } else if (isRegExp(searchValue)) {
      if (searchValue.global) {
        flags = searchValue.flags;
      } else {
        flags += searchValue.flags;
      }

      searchValue = searchValue.source;
    }

    return this.replace(new RegExp(searchValue, flags), replaceValue || '');
  });
  ['$toCapitalize', ''].forEach(function (name, index) {
    var fn = ['toUpperCase', 'toLowerCase'][index ? 'reverse' : '$self']();
    var toUpperCase = fn[0];
    var toLowerCase = fn[1];
    defineValue(StringProto, name + " $" + toUpperCase.replace('C', 'FirstC'), function (ignoreNext) {
      return this.substr(0, 1)[toUpperCase]() + this.substr(1)[ignoreNext ? '$self' : toLowerCase]();
    });
  });
  var SECONDS_A_MINUTE = 60;
  var SECONDS_A_HOUR = SECONDS_A_MINUTE * 60;
  var SECONDS_A_DAY = SECONDS_A_HOUR * 24;
  var SECONDS_A_WEEK = SECONDS_A_DAY * 7;
  var MILLISECONDS_A_SECOND = 1e3;
  var MILLISECONDS_A_MINUTE = SECONDS_A_MINUTE * MILLISECONDS_A_SECOND;
  var MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND;
  var MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND;
  var MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND; // English locales

  var MS = 'millisecond';
  var S = 'second';
  var MIN = 'minute';
  var H = 'hour';
  var D = 'day';
  var W = 'week';
  var M = 'month';
  var Q = 'quarter';
  var Y = 'year';
  var DATE = 'date';
  var FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ssZ'; // regex

  var REGEX_PARSE = /^(\d{4})-?(\d{1,2})-?(\d{0,2})(.*?(\d{1,2}):(\d{1,2}):(\d{1,2}))?.?(\d{1,3})?$/;
  var REGEX_FORMAT = /\[.*?\]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
  var en = {
    name: 'en',
    weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_')
  };

  var padStart = function padStart(string, length, pad) {
    var s = String(string);
    if (!s || s.length >= length) return string;
    return "" + Array(length + 1 - s.length).join(pad) + string;
  };

  var padZoneStr = function padZoneStr(negMinuts) {
    var minutes = Math.abs(negMinuts);
    var hourOffset = Math.floor(minutes / 60);
    var minuteOffset = minutes % 60;
    return "" + (negMinuts <= 0 ? '+' : '-') + padStart(hourOffset, 2, '0') + ":" + padStart(minuteOffset, 2, '0');
  };

  var monthDiff = function monthDiff(a, b) {
    // function from moment.js in order to keep the same result
    var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month());
    var anchor = a.clone().add(wholeMonthDiff, 'months');
    var c = b - anchor < 0;
    var anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), 'months');
    return Number(-(wholeMonthDiff + (b - anchor) / (c ? anchor - anchor2 : anchor2 - anchor)));
  };

  var absFloor = function absFloor(n) {
    return n < 0 ? Math.ceil(n) || 0 : Math.floor(n);
  };

  var prettyUnit = function prettyUnit(u) {
    var special = {
      M: M,
      y: Y,
      w: W,
      d: D,
      h: H,
      m: MIN,
      s: S,
      ms: MS
    };
    return special[u] || String(u || '').toLowerCase().replace(/s$/, '');
  };

  var isUndefined = function isUndefined(s) {
    return s === undefined;
  };

  var U = {
    padStart: padStart,
    padZoneStr: padZoneStr,
    monthDiff: monthDiff,
    absFloor: absFloor,
    prettyUnit: prettyUnit,
    isUndefined: isUndefined
  };
  var L = 'en'; // global locale

  var Ls = {}; // global loaded locale

  Ls[L] = en;

  var isDayjs = function isDayjs(d) {
    return d instanceof Dayjs;
  }; // eslint-disable-line no-use-before-define


  var parseLocale = function parseLocale(preset, object, isLocal) {
    var l;
    if (!preset) return null;

    if (typeof preset === 'string') {
      if (Ls[preset]) {
        l = preset;
      }

      if (object) {
        Ls[preset] = object;
        l = preset;
      }
    } else {
      var name = preset.name;
      Ls[name] = preset;
      l = name;
    }

    if (!isLocal) L = l;
    return l;
  };

  var dayjs = function dayjs(date, c) {
    if (isDayjs(date)) {
      return date.clone();
    }

    var cfg = c || {};
    cfg.date = date;
    return new Dayjs(cfg); // eslint-disable-line no-use-before-define
  };

  var wrapper = function wrapper(date, instance) {
    return dayjs(date, {
      locale: instance.$L
    });
  };

  var Utils = U; // for plugin use

  Utils.parseLocale = parseLocale;
  Utils.isDayjs = isDayjs;
  Utils.wrapper = wrapper;

  var parseDate = function parseDate(date) {
    var reg;
    if (date === null) return new Date(NaN); // Treat null as an invalid date

    if (Utils.isUndefined(date)) return new Date();
    if (date instanceof Date) return date; // eslint-disable-next-line no-cond-assign

    if (typeof date === 'string' && /.*[^Z]$/i.test(date) // looking for a better way
    && (reg = date.match(REGEX_PARSE))) {
      // 2018-08-08 or 20180808
      return new Date(reg[1], reg[2] - 1, reg[3] || 1, reg[5] || 0, reg[6] || 0, reg[7] || 0, reg[8] || 0);
    }

    return new Date(date); // timestamp
  };

  var Dayjs =
  /*#__PURE__*/
  function () {
    function Dayjs(cfg) {
      this.parse(cfg); // for plugin
    }

    var _proto = Dayjs.prototype;

    _proto.parse = function parse(cfg) {
      this.$d = parseDate(cfg.date);
      this.init(cfg);
    };

    _proto.init = function init(cfg) {
      var $d = this.$d;
      this.$y = $d.getFullYear();
      this.$M = $d.getMonth();
      this.$D = $d.getDate();
      this.$W = $d.getDay();
      this.$H = $d.getHours();
      this.$m = $d.getMinutes();
      this.$s = $d.getSeconds();
      this.$ms = $d.getMilliseconds();
      this.$L = this.$L || parseLocale(cfg.locale, null, true) || L;
    } // eslint-disable-next-line class-methods-use-this
    ;

    _proto.$utils = function $utils() {
      return Utils;
    };

    _proto.isValid = function isValid() {
      return !(this.$d.toString() === 'Invalid Date');
    };

    _proto.isSame = function isSame(that, units) {
      var other = dayjs(that);
      return this.startOf(units) <= other && other <= this.endOf(units);
    };

    _proto.isAfter = function isAfter(that, units) {
      return dayjs(that) < this.startOf(units);
    };

    _proto.isBefore = function isBefore(that, units) {
      return this.endOf(units) < dayjs(that);
    };

    _proto.year = function year() {
      return this.$y;
    };

    _proto.month = function month() {
      return this.$M;
    };

    _proto.day = function day() {
      return this.$W;
    };

    _proto.date = function date() {
      return this.$D;
    };

    _proto.hour = function hour() {
      return this.$H;
    };

    _proto.minute = function minute() {
      return this.$m;
    };

    _proto.second = function second() {
      return this.$s;
    };

    _proto.millisecond = function millisecond() {
      return this.$ms;
    };

    _proto.unix = function unix() {
      return Math.floor(this.valueOf() / 1000);
    };

    _proto.valueOf = function valueOf() {
      // timezone(hour) * 60 * 60 * 1000 => ms
      return this.$d.getTime();
    };

    _proto.startOf = function startOf(units, _startOf) {
      var _this = this; // startOf -> endOf


      var isStartOf = !Utils.isUndefined(_startOf) ? _startOf : true;
      var unit = Utils.prettyUnit(units);

      var instanceFactory = function instanceFactory(d, m) {
        var ins = wrapper(new Date(_this.$y, m, d), _this);
        return isStartOf ? ins : ins.endOf(D);
      };

      var instanceFactorySet = function instanceFactorySet(method, slice) {
        var argumentStart = [0, 0, 0, 0];
        var argumentEnd = [23, 59, 59, 999];
        return wrapper(_this.toDate()[method].apply( // eslint-disable-line prefer-spread
        _this.toDate(), (isStartOf ? argumentStart : argumentEnd).slice(slice)), _this);
      };

      switch (unit) {
        case Y:
          return isStartOf ? instanceFactory(1, 0) : instanceFactory(31, 11);

        case M:
          return isStartOf ? instanceFactory(1, this.$M) : instanceFactory(0, this.$M + 1);

        case W:
          return isStartOf ? instanceFactory(this.$D - this.$W, this.$M) : instanceFactory(this.$D + (6 - this.$W), this.$M);

        case D:
        case DATE:
          return instanceFactorySet('setHours', 0);

        case H:
          return instanceFactorySet('setMinutes', 1);

        case MIN:
          return instanceFactorySet('setSeconds', 2);

        case S:
          return instanceFactorySet('setMilliseconds', 3);

        default:
          return this.clone();
      }
    };

    _proto.endOf = function endOf(arg) {
      return this.startOf(arg, false);
    };

    _proto.$set = function $set(units, int) {
      var _C$D$C$DATE$C$M$C$Y$C; // private set


      var unit = Utils.prettyUnit(units);
      var name = (_C$D$C$DATE$C$M$C$Y$C = {}, _C$D$C$DATE$C$M$C$Y$C[D] = 'setDate', _C$D$C$DATE$C$M$C$Y$C[DATE] = 'setDate', _C$D$C$DATE$C$M$C$Y$C[M] = 'setMonth', _C$D$C$DATE$C$M$C$Y$C[Y] = 'setFullYear', _C$D$C$DATE$C$M$C$Y$C[H] = 'setHours', _C$D$C$DATE$C$M$C$Y$C[MIN] = 'setMinutes', _C$D$C$DATE$C$M$C$Y$C[S] = 'setSeconds', _C$D$C$DATE$C$M$C$Y$C[MS] = 'setMilliseconds', _C$D$C$DATE$C$M$C$Y$C)[unit];
      var arg = unit === D ? this.$D + (int - this.$W) : int;
      if (this.$d[name]) this.$d[name](arg);
      this.init();
      return this;
    };

    _proto.set = function set(string, int) {
      return this.clone().$set(string, int);
    };

    _proto.add = function add(number, units) {
      var _this2 = this,
          _C$MIN$C$H$C$S$unit;

      number = Number(number); // eslint-disable-line no-param-reassign

      var unit = Utils.prettyUnit(units);

      var instanceFactory = function instanceFactory(u, n) {
        var date = _this2.set(DATE, 1).set(u, n + number);

        return date.set(DATE, Math.min(_this2.$D, date.daysInMonth()));
      };

      var instanceFactorySet = function instanceFactorySet(n) {
        var date = new Date(_this2.$d);
        date.setDate(date.getDate() + n * number);
        return wrapper(date, _this2);
      };

      if (unit === M) {
        return instanceFactory(M, this.$M);
      }

      if (unit === Y) {
        return instanceFactory(Y, this.$y);
      }

      if (unit === D) {
        return instanceFactorySet(1);
      }

      if (unit === W) {
        return instanceFactorySet(7);
      }

      var step = (_C$MIN$C$H$C$S$unit = {}, _C$MIN$C$H$C$S$unit[MIN] = MILLISECONDS_A_MINUTE, _C$MIN$C$H$C$S$unit[H] = MILLISECONDS_A_HOUR, _C$MIN$C$H$C$S$unit[S] = MILLISECONDS_A_SECOND, _C$MIN$C$H$C$S$unit)[unit] || 1; // ms

      var nextTimeStamp = this.valueOf() + number * step;
      return wrapper(nextTimeStamp, this);
    };

    _proto.subtract = function subtract(number, string) {
      return this.add(number * -1, string);
    };

    _proto.format = function format(formatStr) {
      var _this3 = this;

      var str = formatStr || FORMAT_DEFAULT;
      var zoneStr = Utils.padZoneStr(this.$d.getTimezoneOffset());
      var locale = this.$locale();
      var weekdays = locale.weekdays,
          months = locale.months;

      var getShort = function getShort(arr, index, full, length) {
        return arr && arr[index] || full[index].substr(0, length);
      };

      var get$H = function get$H(match) {
        if (_this3.$H === 0) return 12;
        return Utils.padStart(_this3.$H < 13 ? _this3.$H : _this3.$H - 12, match === 'hh' ? 2 : 1, '0');
      };

      return str.replace(REGEX_FORMAT, function (match) {
        if (match.indexOf('[') > -1) return match.replace(/\[|\]/g, '');
        return {
          YY: String(_this3.$y).slice(-2),
          YYYY: String(_this3.$y),
          M: String(_this3.$M + 1),
          MM: Utils.padStart(_this3.$M + 1, 2, '0'),
          MMM: getShort(locale.monthsShort, _this3.$M, months, 3),
          MMMM: months[_this3.$M],
          D: String(_this3.$D),
          DD: Utils.padStart(_this3.$D, 2, '0'),
          d: String(_this3.$W),
          dd: getShort(locale.weekdaysMin, _this3.$W, weekdays, 2),
          ddd: getShort(locale.weekdaysShort, _this3.$W, weekdays, 3),
          dddd: weekdays[_this3.$W],
          H: String(_this3.$H),
          HH: Utils.padStart(_this3.$H, 2, '0'),
          h: get$H(match),
          hh: get$H(match),
          a: _this3.$H < 12 ? 'am' : 'pm',
          A: _this3.$H < 12 ? 'AM' : 'PM',
          m: String(_this3.$m),
          mm: Utils.padStart(_this3.$m, 2, '0'),
          s: String(_this3.$s),
          ss: Utils.padStart(_this3.$s, 2, '0'),
          SSS: Utils.padStart(_this3.$ms, 3, '0'),
          Z: zoneStr
        }[match] || zoneStr.replace(':', ''); // 'ZZ'
      });
    };

    _proto.diff = function diff(input, units, float) {
      var _C$Y$C$M$C$Q$C$W$C$D$;

      var unit = Utils.prettyUnit(units);
      var that = dayjs(input);
      var diff = this - that;
      var result = Utils.monthDiff(this, that);
      result = (_C$Y$C$M$C$Q$C$W$C$D$ = {}, _C$Y$C$M$C$Q$C$W$C$D$[Y] = result / 12, _C$Y$C$M$C$Q$C$W$C$D$[M] = result, _C$Y$C$M$C$Q$C$W$C$D$[Q] = result / 3, _C$Y$C$M$C$Q$C$W$C$D$[W] = diff / MILLISECONDS_A_WEEK, _C$Y$C$M$C$Q$C$W$C$D$[D] = diff / MILLISECONDS_A_DAY, _C$Y$C$M$C$Q$C$W$C$D$[H] = diff / MILLISECONDS_A_HOUR, _C$Y$C$M$C$Q$C$W$C$D$[MIN] = diff / MILLISECONDS_A_MINUTE, _C$Y$C$M$C$Q$C$W$C$D$[S] = diff / MILLISECONDS_A_SECOND, _C$Y$C$M$C$Q$C$W$C$D$)[unit] || diff; // milliseconds

      return float ? result : Utils.absFloor(result);
    };

    _proto.daysInMonth = function daysInMonth() {
      return this.endOf(M).$D;
    };

    _proto.$locale = function $locale() {
      // get locale object
      return Ls[this.$L];
    };

    _proto.locale = function locale(preset, object) {
      var that = this.clone();
      that.$L = parseLocale(preset, object, true);
      return that;
    };

    _proto.clone = function clone() {
      return wrapper(this.toDate(), this);
    };

    _proto.toDate = function toDate() {
      return new Date(this.$d);
    };

    _proto.toArray = function toArray() {
      return [this.$y, this.$M, this.$D, this.$H, this.$m, this.$s, this.$ms];
    };

    _proto.toJSON = function toJSON() {
      return this.toISOString();
    };

    _proto.toISOString = function toISOString() {
      // ie 8 return
      // new Dayjs(this.valueOf() + this.$d.getTimezoneOffset() * 60000)
      // .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      return this.$d.toISOString();
    };

    _proto.toObject = function toObject() {
      return {
        years: this.$y,
        months: this.$M,
        date: this.$D,
        hours: this.$H,
        minutes: this.$m,
        seconds: this.$s,
        milliseconds: this.$ms
      };
    };

    _proto.toString = function toString() {
      return this.$d.toUTCString();
    };

    return Dayjs;
  }();

  dayjs.extend = function (plugin, option) {
    plugin(option, Dayjs, dayjs);
    return dayjs;
  };

  dayjs.locale = parseLocale;
  dayjs.isDayjs = isDayjs;

  dayjs.unix = function (timestamp) {
    return dayjs(timestamp * 1e3);
  };

  dayjs.en = Ls[L];
  var DateProto = Date.prototype;
  var DAYJS = '__ZENJS_DAYJS__';
  defineValue(DateProto, '$dayjs', function () {
    var $dayjs = this[DAYJS];

    if (!$dayjs || $dayjs.valueOf() !== +this) {
      return this[DAYJS] = dayjs(this);
    }

    return $dayjs;
  });
  defineValue(Date, '$parse', function (date) {
    var $dayjs = dayjs(date);
    var $date = $dayjs.toDate().$set(DAYJS, $dayjs);
    return $date;
  });
  defineValue(Date, '$format', function (date, formatStr) {
    return dayjs(date).format(formatStr);
  });
  /**
   * @type {Boolean} 当前是否是 Node 环境
   */

  var inNode = typeof global !== 'undefined';
  var root = inBrowser ? window : inNode ? global : {};
  defineValue(root, 'dayjs', dayjs);

  var index = function (o, c, d) {
    c.prototype.isBetween = function (a, b, u) {
      var dA = d(a);
      var dB = d(b);
      return this.isAfter(dA, u) && this.isBefore(dB, u) || this.isBefore(dA, u) && this.isAfter(dB, u);
    };
  };

  var index$1 = function (o, c) {
    c.prototype.isSameOrBefore = function (that, units) {
      return this.isSame(that, units) || this.isBefore(that, units);
    };
  };

  var index$2 = function (o, c) {
    c.prototype.isSameOrAfter = function (that, units) {
      return this.isSame(that, units) || this.isAfter(that, units);
    };
  };

  var index$3 = function (o, c) {
    var proto = c.prototype;

    proto.isLeapYear = function () {
      return this.$y % 4 === 0 && this.$y % 100 !== 0 || this.$y % 400 === 0;
    };
  };

  [index, index$1, index$2, index$3].forEach(dayjs.extend);
  var ignore = 'clone_init_parse_toDate_toISOString_toJSON_toString_locale'.split('_');
  var isDayjs$1 = dayjs.isDayjs;
  dayjs.extend(function (option, Dayjs) {
    entries(Dayjs.prototype).forEach(function (obj) {
      obj[0].indexOf('$') === 0 || ignore.indexOf(obj[0]) > -1 || install(obj[0], obj[1]);
    });
  });

  function install(name, fn) {
    defineValue(DateProto, '$' + name, function () {
      var result = fn.apply(this.$dayjs(), arguments);

      if (isDayjs$1(result)) {
        this.setTime(result.valueOf());
        this[DAYJS] = result;
        return this;
      }

      return result;
    });
    ['isValid', 'format'].$inArray(name) || defineValue(Date, '$' + name, function () {
      var result = fn.apply(dayjs(), arguments);
      return isDayjs$1(result) ? result.$d.$set(DAYJS, result) : result;
    });
  }

  defineValue(FunctionProto, '$after', function () {
    var func = this;
    var num = parametersDefault(arguments, 0, 1);
    return function () {
      num-- < 1 && func.apply(this, arguments);
    };
  });
  defineValue(FunctionProto, '$args', function (oArgs) {
    var func = this;
    return function () {
      var args = [];
      var currentArgs = arguments;
      var oArgsKeys = keys(oArgs);
      var length = oArgsKeys.length + currentArgs.length;
      var currentIndex = 0;
      var index = 0;

      for (; index < length; index++) {
        args[index] = index in oArgs ? oArgs[index] : currentArgs[currentIndex++];
      }

      oArgsKeys.forEach(function (index) {
        index in args || args.$set(index, oArgs[index]);
      });
      return func.apply(this, args);
    };
  });
  defineValue(FunctionProto, '$one $once', function () {
    var func = this;
    var num = parametersDefault(arguments, 0, 1);
    var index = 1;
    return function () {
      index++ === num && func.apply(this, arguments);
    };
  });
  defineValue(RegExp, '$parse', function (keyword, flags) {
    return new RegExp(keyword.replace(rkeyword, '\\$1'), flags);
  });
  defineValue(root, '$typeof', function (obj) {
    if (obj == null) return obj + '';
    return obj[isArray] ? 'array' : typeof obj;
  });
  var rBackSlant = /\+/g;

  function toString$1(obj) {
    switch (typeof obj) {
      case 'string':
        return obj;

      case 'boolean':
        return obj ? 'true' : 'false';

      case 'number':
        return isFinite(obj) ? obj : '';

      default:
        return '';
    }
  }

  function stringify(obj) {
    var args = arguments;
    var sep = parametersDefault(args, 1, '&');
    var eq = parametersDefault(args, 2, '=');

    if (isObject(obj)) {
      return keys(obj).map(function (key) {
        return encodeURIComponent(toString$1(key)) + eq + encodeURIComponent(toString$1(obj[key]));
      }).join(sep);
    }

    return '';
  }

  function parse(str) {
    var result = {};

    if (!str || !isString$1(str)) {
      return result;
    }

    var args = arguments;
    var sep = parametersDefault(args, 1, '&');
    var eq = parametersDefault(args, 2, '=');
    str.split(sep).forEach(function (_value) {
      var cache = _value.replace(rBackSlant, '%20');

      var index = cache.indexOf(eq);
      var key,
          value = '';

      if (index > -1) {
        key = cache.substr(0, index);
        value = cache.substr(index + 1);
      } else {
        key = cache;
      }

      result[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return result;
  }

  defineValue(root, '$querystring', assign(false, [null, {
    stringify: stringify,
    parse: parse
  }]));
  /**
   * 传入一个键值对的列表, 并返回一个带有这些键值对的新对象 ( 是 Object.entries 的反转 )
   * Object.fromEntries polyfill
   */

  function fromEntries(iterable) {
    var result = {};
    var newIterable = $toArray(iterable);
    var item;
    var index = newIterable.length;

    while (index--) {
      item = newIterable[index];

      if (item && item.length) {
        result[item[0]] = item[1];
      }
    }

    return result;
  }
  /**
   * 返回传入的第一个参数
   * @param {any} arg 
   * @returns {any} arg
   */


  function returnArg(arg) {
    return arg;
  }
  /**
   * 始终返回 true
   * @returns {Boolean} true
   */


  function returnTrue() {
    return true;
  }
  /**
   * 始终返回 false
   * @returns {Boolean} false
   */


  function returnFalse() {
    return false;
  }
  /**
   * 一个空方法
   */


  function noop() {}

  var ZenJS$1 = root.ZenJS = assign(false, [null, {
    assign: assign$1,
    repeat: repeat,
    keys: keys,
    values: values,
    entries: entries,
    fromEntries: fromEntries,
    congruence: congruence,
    equals: equals,
    define: define,
    defineValue: defineValue,
    defineGet: defineGet,
    intRandom: intRandom,
    returnArg: returnArg,
    returnTrue: returnTrue,
    returnFalse: returnFalse,
    noop: noop,
    parametersDefault: parametersDefault,
    parametersRest: parametersRest,
    isString: isString$1,
    isBoolean: isBoolean$1,
    isArray: isArray$1,
    isNumber: isNumber,
    isRegExp: isRegExp,
    isSet: isSet,
    isMap: isMap,
    isFunction: isFunction,
    isObject: isObject,
    isReferenceType: isReferenceType,
    mapSetToArray: mapSetToArray,
    config: {
      event: {
        modifiers: true,
        returnFalse: true
      }
    }
  }]);
  var guid = 1;
  defineProperty(ZenJS$1, 'guid', {
    get: function () {
      return guid++;
    }
  });

  if (inBrowser) {
    defineValue(document, '$id', document.getElementById);
  }

  var addEventListener = 'addEventListener';
  var removeEventListener = 'removeEventListener';
  var DOMContentLoaded = 'DOMContentLoaded';
  var load = 'load';

  if (inBrowser) {
    defineValue(document, '$ready', function (func, data) {
      if (document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll) {
        func.apply(window, data);
      } else {
        document[addEventListener](DOMContentLoaded, function callback() {
          document[removeEventListener](DOMContentLoaded, callback);
          func.apply(window, data);
        });
      }
    });
  }

  if (inBrowser) {
    defineValue(window, '$ready', function (func, data) {
      if (document.readyState === 'complete') {
        func.apply(window, data);
      } else {
        window[addEventListener](load, function callback() {
          window[removeEventListener](load, callback);
          func.apply(window, data);
        });
      }
    });
  }
  /**
   * @type {Element}
   */


  var ElementProto = inBrowser ? DomElement.prototype : undefined;
  var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;

  function access(elem, _className, handle) {
    var classList = elem.classList;
    var className = (_className || '').match(rnothtmlwhite) || []; // 判断是 class 否存在

    if (handle === 'has') {
      var length = className.length;
      var index = 0;

      for (; index < length; index++) {
        if (classList.contains(className[index]) === false) {
          return false;
        }
      } // 以防传入空等值时返回 true


      return length !== 0;
    } // 切换 class
    else if (handle === null) {
        className.forEach(function (name) {
          classList[classList.contains(name) ? 'remove' : 'add'](name);
        });
      } // 正常添加删除
      else {
          className.forEach(function (name) {
            return classList[handle](name);
          });
        }

    return elem;
  }

  if (inBrowser) {
    defineValue(ElementProto, '$addClass', function (className) {
      return access(this, className, 'add');
    });
    defineValue(ElementProto, '$removeClass $deleteClass', function (className) {
      // 移除所有 class
      if (!className && className !== '') {
        return this.className = '', this;
      } // 移除指定 class


      return access(this, className, 'remove');
    });
    defineValue(ElementProto, '$hasClass', function (className) {
      return access(this, className, 'has');
    });
    defineValue(ElementProto, '$toggleClass', function (className, tSwitch) {
      var handle = arguments.length > 1 ? tSwitch ? 'add' : 'remove' : null;
      return access(this, className, handle);
    });
  }

  if (inBrowser && !ElementProto.matches) {
    ['webkit', 'o', 'ms', 'moz'].$each(function (core) {
      var matchesKey = core + 'MatchesSelector';
      var matchesValue = ElementProto[matchesKey];

      if (matchesValue) {
        ElementProto.matches = matchesValue;
        return false;
      }
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$is', function (selector) {
      if (selector.nodeType) return this === selector;else if (isString$1(selector)) return this.matches(selector);else if (isFunction(selector)) return !!selector(this);
      return false;
    });
    defineValue(ElementProto, '$not', function (selector) {
      return !this.$is(selector);
    });
  }
  /**
   * 
   * @param {Element} node 当前 DOM 元素, 也可是 DOM 元素数组
   * @param {String} filter 过滤元素的 CSS 选择器和方法
   * @param {String} handler 获取下一个 DOM 元素的属性名
   * @param {Boolean} checkSelf 检测完当前 DOM 元素后再检测其他 DOM 元素
   */


  function Filter(node, filter, handler, checkSelf) {
    // 没有可过滤的元素
    if (node == null || node.length === 0) return node; // 没有过滤条件

    if (filter == null) {
      if (node.nodeType) {
        return checkSelf ? node : node[handler];
      }

      return node;
    } // 传入的 filter 是否是方法
    // 传入了方法则使用传入的方法进行过滤
    // 否则使用 $is 来进行过滤


    var filterIsFunction = filter[isFunction$1]; // Node

    if (node.nodeType) {
      // 首先检测当前 DOM 元素, 检测通过就直接返回
      if (checkSelf && (filterIsFunction ? filter(node) : node.$is(filter))) {
        return node;
      } // 检测没通过就去获取下一个 DOM 元素再进行检测


      if (filterIsFunction) {
        while ((node = node[handler]) && !filter(node)) {}
      } else {
        while ((node = node[handler]) && !node.$is(filter)) {}
      }

      return node;
    } // Node Array


    return node.filter(filterIsFunction ? filter : function (elem) {
      return elem.$is(filter);
    });
  }

  function dir(elem, handler) {
    var matched = [];
    var index = 0;

    while (elem = elem[handler]) {
      matched[index++] = elem;
    }

    return matched;
  }

  if (inBrowser) {
    defineValue(ElementProto, '$first $firstChild', function (filter) {
      return Filter(this.firstElementChild, filter, 'nextElementSibling', true);
    });
    defineValue(ElementProto, '$last $lastChild', function (filter) {
      return Filter(this.lastElementChild, filter, 'previousElementSibling', true);
    });
  }

  inBrowser && [['$next', 'nextElementSibling'], ['$prev', 'previousElementSibling']].forEach(function (arr) {
    var name = arr[0];
    var fn = arr[1];
    defineValue(ElementProto, name, function (filter) {
      return Filter(this, filter, fn);
    });
    defineValue(ElementProto, name + 'All', function (filter) {
      return Filter(dir(this, fn), filter);
    });
  });

  if (inBrowser) {
    defineValue(ElementProto, '$child $children', function (filter) {
      return Filter(slice.call(this.children), filter);
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$parent', function (filter) {
      return Filter(this.parentElement, filter, null, true);
    });
    defineValue(ElementProto, '$parents', function (filter, checkSelf) {
      return Filter(this, filter, 'parentElement', checkSelf);
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$siblings', function (filter) {
      var parent = this.parentElement;

      if (parent) {
        var children = slice.call(parent.children);
        return Filter(children.$splice(children.indexOf(this), 1), filter);
      }

      return [];
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$append', function (elem) {
      return this.appendChild(elem), this;
    });
    defineValue(ElementProto, '$prepend', function (elem) {
      return this.insertBefore(elem, this.firstElementChild), this;
    });
    defineValue(ElementProto, '$appendTo', function (elem) {
      return elem.appendChild(this), this;
    });
    defineValue(ElementProto, '$prependTo', function (elem) {
      return elem.insertBefore(this, elem.firstElementChild), this;
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$before', function (elem, parent) {
      if (parent = this.parentNode) {
        parent.insertBefore(elem, this);
      }

      return this;
    });
    defineValue(ElementProto, '$after', function (elem, parent) {
      if (parent = this.parentNode) {
        parent.insertBefore(elem, this.nextElementSibling);
      }

      return this;
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$delete $remove', function (parent) {
      if (parent = this.parentNode) {
        parent.removeChild(this);
      }
    });
  }

  if (inBrowser) {
    [document, ElementProto].forEach(function (elem) {
      var querySelectorAll = elem.querySelectorAll;
      defineValue(elem, '$query $find', function () {
        return slice.call(querySelectorAll.apply(this, arguments));
      });
      defineValue(elem, '$queryFirst $findFirst', elem.querySelector);
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$replaceWith $replace', function (elem, parent) {
      if (parent = this.parentNode) {
        parent.replaceChild(elem, this);
      }
    });
  }

  var propFix = {
    "for": "htmlFor",
    "class": "className"
  };
  ["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"].forEach(function (prop) {
    propFix[prop.toLowerCase()] = prop;
  });
  var rfocusable = /^(?:input|select|textarea|button)$/i;
  var rclickable = /^(?:a|area)$/i;
  /**
   * 判断当前浏览器的 option 是否在不激活 selectedIndex 属性时, 是始终返回 false 的
   */

  var supportsSelectedIndex = true;

  if (inBrowser) {
    var select = document.createElement('select');
    var option = document.createElement('option').$appendTo(select); // Support: IE <=11 only
    // Must access selectedIndex to make default options select

    supportsSelectedIndex = option.selected;
  }

  var supportsSelectedIndex$1 = supportsSelectedIndex;
  var propHooks = {
    tabIndex: {
      get: function (elem, name) {
        var tabIndex = elem.getAttribute(name);

        if (tabIndex) {
          return parseInt(tabIndex, 10);
        }

        if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
          return 0;
        }

        return -1;
      }
    }
  };

  if (!supportsSelectedIndex$1) {
    var selected = function (elem) {
      var parent = elem.parentNode;

      if (parent) {
        parent.selectedIndex;
      }
    };

    propHooks.selected = {
      get: selected,
      set: selected
    };
  }

  function access$1(elem, arg, args, func) {
    var name;

    if (isObject(arg)) {
      args = slice.call(args).splice(0, 1);

      for (name in arg) {
        func.apply(elem, [name, arg[name]].concat(args));
      }
    } else {
      return func.apply(elem, args);
    }

    return elem;
  }

  if (inBrowser) {
    defineValue(ElementProto, '$prop', function (prop, value) {
      return access$1(this, prop, arguments, function (prop, value) {
        var name = propFix[prop] || prop;
        var hooks = propHooks[name];
        var result;

        if (arguments.length > 1) {
          if (hooks && 'set' in hooks) hooks.set(this);
          this[name] = value;
          return this;
        }

        if (hooks && 'get' in hooks && (result = hooks.get(this, name)) !== undefined) {
          return result;
        }

        return this[name];
      });
    });
    defineValue(ElementProto, '$hasProp', function (prop) {
      return hasOwnProperty.call(this, propFix[prop] || prop);
    });
    defineValue(ElementProto, '$removeProp $deleteProp', function (props) {
      if (props = props && props.match(rnothtmlwhite)) {
        var prop;
        var index = 0;

        while (prop = props[index++]) {
          prop = propFix[prop] || prop;
          this[prop] = '';
          delete this[prop];
        }
      }

      return this;
    });
  }
  /**
   * 判断当前浏览器将 input 的 type 类型切换到 radio 时, 是否会丢失 value 值
   */


  var supportsRadioValue = true;

  if (inBrowser) {
    var input = document.createElement('input');
    input.value = 't';
    input.type = 'radio'; // Support: IE <=11 only
    // An input loses its value after becoming a radio

    supportsRadioValue = input.value === 't';
  }

  var supportsRadioValue$1 = supportsRadioValue;
  var attrHooks = {
    type: function (elem, value) {
      if (!supportsRadioValue$1 && value === 'radio' && elem._nodeName === 'input') {
        var val = elem.value;
        elem.setAttribute('type', value);

        if (val) {
          elem.value = val;
        }

        return true;
      }
    }
  };

  function boolHook(elem, value, name) {
    if (value === false) elem.$removeAttr(name);else elem.setAttribute(name, name);
    return true;
  }

  var rBool = /^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$/i;

  if (inBrowser) {
    defineValue(ElementProto, '$attr', function (name, value) {
      return access$1(this, name, arguments, function (name, value) {
        var result;

        if (value === undefined) {
          return (result = this.getAttribute(name)) == null ? undefined : result;
        }

        if (value === null) {
          return this.$removeAttr(name);
        }

        var hooks = attrHooks[name.toLowerCase()] || (rBool.test(name) ? boolHook : undefined);

        if (!(hooks && hooks(this, value, name))) {
          this.setAttribute(name, value + '');
        }

        return this;
      });
    });
    defineValue(ElementProto, '$hasAttr', ElementProto.hasAttribute);
    defineValue(ElementProto, '$removeAttr $deleteAttr', function (names) {
      if (names = names && names.match(rnothtmlwhite)) {
        var name;
        var index = 0;

        while (name = names[index++]) {
          this.removeAttribute(name);
        }
      }

      return this;
    });
  }

  var reg = /-([a-z])/g;

  function toUpperCase(all, char) {
    return char.toUpperCase();
  }

  function camelCase(name) {
    return name.replace(reg, toUpperCase);
  }
  /**
   * @param {Element} elem 
   */


  function getStyles(elem) {
    // Support: IE <=11 only, Firefox <=30 (#15098, #14150)
    // IE throws on elements created in popups
    // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
    var view = elem.ownerDocument.defaultView;

    if (!view || !view.opener) {
      view = window;
    }

    return view.getComputedStyle(elem);
  }
  /**
   * 判断当前浏览器的 getComputedStyle 方法是否支持返回复合样式
   */


  var supportsCompoundStyle = true;

  if (inBrowser) {
    var div = document.createElement('div').$appendTo(document.documentElement);
    div.style.margin = '10px';
    var margin = getStyles(div).getPropertyValue('margin');
    supportsCompoundStyle = margin !== '';
    div.$remove();
  }

  var supportsCompoundStyle$1 = supportsCompoundStyle;
  var cssSide = ['Top', 'Right', 'Bottom', 'Left'];
  var cssRadius = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'];
  var cssHooks = {};

  if (!supportsCompoundStyle$1) {
    var CreateSideHook = function (styles, cssSide$$1) {
      each(styles, function (name, suffix) {
        cssHooks[name + suffix] = function (elem) {
          var computed = getStyles(elem);
          var result = [];

          for (var index = 0; index < 4; index++) {
            result[index] = computed[name + cssSide$$1[index] + suffix] || '0px';
          }

          var top = result[0];
          var right = result[1];
          var bottom = result[2];
          var left = result[3];

          if (right === left) {
            // 左右边相等
            if (top === bottom) {
              // 上下边相等
              return top === right ? top // 单值语法
              : top + " " + right; // 二值语法
            } else {
              return top + " " + right + " " + bottom; // 三值语法
            }
          }

          return result.join(' '); // 四值语法
        };
      });
    }; // margin
    // padding
    // border-width


    CreateSideHook({
      margin: '',
      padding: '',
      border: 'Width'
    }, cssSide); // border-radius

    CreateSideHook({
      border: 'Radius'
    }, cssRadius);
  }

  var rcustomProp = /^--/;
  var cssPrefixes = ["Webkit", "Moz", "ms"];
  var emptyStyle = document.createElement('div').style;

  function vendorPropName(name) {
    var capName = name.$toCapitalize(true);
    var index = cssPrefixes.length;

    while (index--) {
      name = cssPrefixes[i] + capName;

      if (name in emptyStyle) {
        return name;
      }
    }
  }

  function finalPropName(name) {
    if (name in emptyStyle) {
      return name;
    }

    return vendorPropName(name) || name;
  }

  var cssNumber = {
    "animationIterationCount": true,
    "columnCount": true,
    "fillOpacity": true,
    "flexGrow": true,
    "flexShrink": true,
    "fontWeight": true,
    "lineHeight": true,
    "opacity": true,
    "order": true,
    "orphans": true,
    "widows": true,
    "zIndex": true,
    "zoom": true
  };
  /**
   * 判断当设置克隆元素的背景相关样式为空时, 是否会清空原元素的样式
   */

  var supportsClearCloneStyle = false;

  if (inBrowser) {
    var div$1 = document.createElement('div');
    div$1.style.backgroundClip = 'content-box';
    div$1.cloneNode(true).style.backgroundClip = '';
    supportsClearCloneStyle = div$1.style.backgroundClip === "content-box";
  }

  var supportsClearCloneStyle$1 = supportsClearCloneStyle;

  function style(elem, name, value) {
    // 转为驼峰写法
    var origName = camelCase(name); // 是否是 css 变量

    var isCustomProp = rcustomProp.test(name); // 

    var style = elem.style; // 转为浏览器兼容写法

    if (!isCustomProp) {
      name = finalPropName(origName);
    } // setter


    if (value !== undefined) {
      if (value == null || value !== value) {
        return;
      }

      if (isNumber(value)) {
        value += cssNumber[origName] ? '' : 'px';
      }

      if (supportsClearCloneStyle$1 && value === '' && name.indexOf("background") === 0) {
        style[name] = 'inherit';
      }

      if (isCustomProp) {
        style.setProperty(name, value);
      } else {
        style[name] = value;
      }
    } else {
      return style[name];
    }
  }

  function getCss(elem, name) {
    var computed = getStyles(elem);
    var result = computed.getPropertyValue(name) || computed[name]; // 元素不在 DOM 树中, 尝试从 style 中取值

    if ((result === '' || result === 'auto') && !elem.$parents(document.documentElement)) {
      result = style(elem, name);
    }

    return result !== undefined ? result + '' : result;
  }

  var cssDefault = {
    opacity: '1'
  };

  if (inBrowser) {
    var css = function (elem, name) {
      // 转为驼峰写法
      var origName = camelCase(name); // 是否是 css 变量

      var isCustomProp = rcustomProp.test(name); // 转为浏览器兼容写法

      if (!isCustomProp) {
        name = finalPropName(origName);
      } // 获取可能的兼容方法


      var hooks = cssHooks[name] || cssHooks[origName];
      var value;

      if (hooks) {
        value = hooks(elem);
      }

      if (value === undefined) {
        value = getCss(elem, name);
      } // 结果为空, 但是有默认值时, 返回默认值


      if (value === '' && name in cssDefault) {
        value = cssDefault[name];
      }

      if (value === 'normal' && name in cssNormalDefault) {
        val = cssNormalDefault[name];
      }

      return value;
    };

    defineValue(ElementProto, '$css', function (name) {
      return access$1(this, name, arguments, function (name, value) {
        return value === undefined ? css(this, name) : style(this, name, value);
      });
    });
  }

  var min = Math.min;

  if (inBrowser) {
    defineValue(ElementProto, '$index', function (toIndex) {
      if (arguments.length) {
        var parent = this.parentElement;

        if (parent) {
          var siblings = parent.children;
          var selfIndex = this.$prevAll().length;
          var currentIndex = min(siblings.length - 1, toIndex);

          if (selfIndex !== currentIndex) {
            var currentElem = siblings[currentIndex];
            parent.insertBefore(this, selfIndex < currentIndex ? currentElem.nextElementSibling : currentElem);
          }
        }

        return this;
      }

      return this.parentElement ? this.$prevAll().length : -1;
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$html', function (value) {
      if (arguments.length) {
        this.innerHTML = value;
        return this;
      }

      return this.innerHTML;
    });
  }

  var valHooks = {
    option: {
      get: function (elem) {
        var value = elem.getAttribute('value');

        if (value == null) {
          return (elem.textContent.match(rnothtmlwhite) || []).join(' ');
        }

        return value;
      }
    },
    select: {
      get: function (elem) {
        var options = elem.options;
        var index = elem.selectedIndex;
        var one = elem.type === 'select-one';
        var max = one ? index + 1 : options.length;
        var values = one ? null : [];
        var value, option, i;

        for (i = index < 0 ? max : one ? index : 0; i < max; i++) {
          option = options[i];

          if ((option.selected || i === index) && !option.disabled && (!option.parentNode.disabled || option.parentNode._nodeName !== 'optgroup')) {
            value = valHooks.option.get(option);

            if (one) {
              return value;
            }

            values.push(value);
          }
        }

        return values;
      },
      set: function (elem, value) {
        var options = elem.options;
        var values = $toArray(value);
        var i = options.length;
        var optionSet, option;

        while (i--) {
          option = options[i];

          if (option.selected = values.$inArray(valHooks.option.get(option))) {
            optionSet = true;
          }
        }

        if (!optionSet) {
          elem.selectedIndex = -1;
        }
      }
    }
  };
  var rreturn = /\r/g;

  if (inBrowser) {
    defineValue(ElementProto, '$val $value', function (value) {
      if (arguments.length) {
        if (value == null) {
          value = '';
        } else if (isNumber(value)) {
          value += '';
        } else if (value[isArray]) {
          value = value.map(function (val) {
            return val == null ? '' : val + '';
          });
        }

        var _hooks = valHooks[this.type] || valHooks[this._nodeName];

        if (_hooks && 'set' in _hooks) _hooks.set(this, value);else {
          this.value = value;
        }
        return this;
      }

      var hooks = valHooks[this.type] || valHooks[this._nodeName];
      var result;

      if (hooks && 'get' in hooks && (result = hooks.get(this)) !== undefined) {
        return result;
      }

      if (isString$1(result = this.value)) {
        return result.replace(rreturn, '');
      }

      if (result == null) {
        return '';
      }

      return result;
    });
  }

  if (inBrowser) {
    ['width', 'height'].forEach(function (prop) {
      defineValue(ElementProto, "$" + prop, function (value) {
        if (arguments.length) {
          this.style.setProperty(prop, $isNumber(value) ? value + "px" : value);
          return this;
        }

        try {
          return this.getBoundingClientRect()[prop];
        } catch (error) {
          return 0;
        }
      });
    });
  }

  if (inBrowser) {
    defineGet(ElementProto, '_nodeName', function () {
      return this.nodeName.toLowerCase();
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$clone', ElementProto.cloneNode);
  }
  /**
   * @type {EventTarget}
   */


  var DomEventTarget = inBrowser ? 'EventTarget' in window ? EventTarget.prototype : [window, document, ElementProto] : undefined;
  var DATA = '__ZENJS_DATA__';
  /**
   * 获取存储在元素上的整个数据集, 如数据集不存在则创建
   * @param {Element} elem
   * @returns {Object}
   */

  function getDatas(elem) {
    return elem[DATA] || (defineValue(elem, DATA, {}), elem[DATA]);
  }

  if (inBrowser) {
    defineValue(DomEventTarget, '$data', function (name) {
      var self = this || window;
      var Data = getDatas(self);
      return access$1(self, name, arguments, function (name, value, weakRead) {
        // 读取
        // $data( name )
        // $data( name, value, true )
        if (weakRead || arguments.length < 2) {
          if (name == null) return Data;
          if (weakRead && !(name in Data)) return Data[name] = value;
          return Data[name];
        } // $data( name, value )


        Data[name] = value;
        return self;
      });
    });
    defineValue(DomEventTarget, '$hasData', function (name) {
      var Data = getDatas(this || window);

      if (isEmptyObject(Data)) {
        return false;
      }

      if (name == null) {
        return true;
      }

      return name in Data;
    });
    defineValue(DomEventTarget, '$deleteData $removeData', function (names) {
      var self = this || window;

      if (names == null) {
        self[DATA] = {};
        return self;
      }

      var Data = getDatas(self);
      (names.match(rnothtmlwhite) || []).forEach(function (name) {
        delete Data[name];
      });
      return self;
    });
  }
  /**
   * @type {Boolean} 当前环境是否支持 addEventListener 的 passive 属性
   */


  var supportsPassiveEvent = false;

  try {
    var options = defineProperty({}, 'passive', {
      get: function () {
        supportsPassiveEvent = true;
      }
    });
    window[addEventListener]('test', null, options);
  } catch (e) {}

  var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
  /**
   * 事件处理 => 功能性命名空间
   * @private
   * @param {String} name 需要解析哪一块的功能命名空间
   * @param {String[]} namespace 元素的命名空间列表
   * @param {EventTarget} elem 绑定事件的元素
   * @param {String} type 绑定的事件
   * @param {Object} options 其他属性
   */

  function modifiers(name, namespace, elem, type, options) {
    // 没有命名空间
    if (namespace.length === 0) {
      return;
    }

    return CheckForHandlers(ModifiersList[name], name, namespace, elem, type, options);
  }
  /**
   * @param {any} handlers 当前功能的修饰符列表
   */


  function CheckForHandlers(handlers, name, namespace, elem, type, options) {
    var result;
    namespace.filter(function (name) {
      return name in handlers;
    }).$each(function (handler) {
      return result = handlers[handler](elem, type, options, namespace);
    });

    if (result !== false && handlers._next) {
      return CheckForHandlers(handlers._next, name, namespace, elem, type, options);
    }

    return result;
  }

  var ModifiersList = {
    /**
     * 添加事件时
     */
    add: {},

    /**
     * 触发事件时
     */
    dispatch: {
      /**
       * 当事件是从绑定的元素本身触发时才触发回调
       */
      self: function (elem, type, event) {
        return event.target === event.currentTarget;
      }
    },

    /**
     * 触发事件的修饰符通过之后的下一步检测
     */
    dispatched: {
      /**
       * 阻止事件冒泡
       */
      stop: function (elem, type, event) {
        event.stopPropagation();
      },

      /**
       * 阻止浏览器默认事件
       */
      prevent: function (elem, type, event) {
        event.preventDefault();
      }
    }
  };
  var add = ModifiersList.add;
  var dispatch = ModifiersList.dispatch;
  dispatch._next = ModifiersList.dispatched;
  /**
   * .once || .one
   * 当命名空间有 .once 或 .one, 则会去已绑定的事件中进行查找,
   * 如果之前绑定过相同的命名空间 ( 也同样有 .once 或 .one ), 则本次绑定无效
   */

  add.once = add.one = function (elem, type, events, namespace) {
    events = events[type] || [];
    return events.$findIndex({
      namespace: namespace
    }, equals$1) === -1;
  };
  /**
   * .ctrl || .shift || .alt || .meta
   * 当按下了对应键盘按键时才触发回调
   */


  ['ctrlKey', 'shiftKey', 'altKey', 'metaKey'].forEach(function (key) {
    dispatch[key] = function (elem, type, event) {
      return !!event[key];
    };
  });
  /**
   * .left || .middle || .right
   * 当按下了对应鼠标按键时才触发回调
   */

  ['left', 'middle', 'right'].forEach(function (button, index) {
    dispatch[button] = function (elem, type, event) {
      return 'button' in event && event.button === index;
    };
  });
  /**
   * 按下了相应的键盘按键则触发
   */

  each({
    keyEsc: 27,
    keyTab: 9,
    keyEnter: 13,
    keySpace: 32,
    keyUp: 38,
    keyLeft: 37,
    keyRight: 39,
    keyDown: 40,
    keyDelete: [8, 46]
  }, function (key, keyCode) {
    dispatch[key] = function (elem, type, event) {
      if (keyCode[isArray]) {
        return keyCode.indexOf(event.keyCode) === -1;
      }

      return event.keyCode === keyCode;
    };
  });

  function init(elem, types, whileFn, whileEndFn) {
    /** 存放当前元素下的所有事件 */
    var events = elem.$data('events', {}, true);
    /** 事件总数 */

    var length = types.length;
    var tmp, type, namespace, rNamespace, handlers, handlersLength;

    while (length--) {
      /** 分离事件名称和命名空间 */
      tmp = rtypenamespace.exec(types[length]) || [];
      /** 事件名称 */

      type = tmp[1];
      if (!type) continue;
      /** 事件集 */

      handlers = events[type] || [];
      /** 事件集数量 */

      handlersLength = handlers.length;
      if (!handlersLength) continue;
      /** 命名空间 */

      namespace = (tmp[2] || '').split('.').sort().join('.');
      /** 匹配命名空间 */

      rNamespace = tmp[2] && new RegExp('^' + namespace + '$');

      while (handlersLength--) {
        whileFn(handlers[handlersLength], rNamespace, type, handlers, handlersLength);
      }

      whileEndFn && whileEndFn(handlers, events, type);
    }
  }
  /**
   * 所有事件分组的存储
   */


  var GROUPS = {// group1: [
    //   handleOptions1,
    //   handleOptions2
    // ]
  };
  /**
   * 事件分组主分组
   */

  var MAINGROUPS = {// group: [
    //   handleOptions1,
    //   handleOptions2,
    //   handleOptions3,
    //   handleOptions4
    // ]
  };
  /**
   * 事件处理 => 绑定事件
   * @private
   * @param {EventTarget} elem 需要绑定事件的对象
   * @param {String} _type 需要绑定的事件
   * @param {String} selector 事件委托的选择器
   * @param {Function} listener 绑定的事件回调
   * @param {Object} options 事件绑定参数
   * @param {String} mainGroup 事件分组参数 - 主分组, 移除主分组也会同时移除所有次分组
   * @param {String} group 事件分组参数 - 次分组
   * @param {Object} data 传递给事件的数据
   */

  function add$1(elem, _type, selector, listener, options, mainGroup, group, data) {
    /** 存放当前元素下的所有事件 */
    var events = elem.$data('events', {}, true);
    /** 事件 GUID */

    var guid = listener.guid || (listener.guid = ZenJS$1.guid);
    /** 分离事件名称和命名空间 */

    var tmp = rtypenamespace.exec(_type) || [];
    /** 事件名称 */

    var type = tmp[1];
    if (!type) return;
    /** 命名空间 */

    var namespace = (tmp[2] || '').split('.').sort(); // 处理功能性命名空间

    if (ZenJS$1.config.event.modifiers && modifiers('add', namespace, elem, type, events) === false) {
      return;
    }
    /** 该事件所有相关参数 */


    var handleOptions = {
      elem: elem,
      selector: selector,
      type: type,
      namespace: namespace,
      listener: listener,
      guid: guid,
      options: options,
      mainGroup: mainGroup,
      group: group,
      data: data,
      namespaceStr: namespace.join('.'),
      handler: function () {
        return ZenJS$1.EventListener.dispatch(this, arguments, handleOptions);
      }
    }; // 存储相关数据

    (events[type] || (events[type] = [])).push(handleOptions); // 存储分组数据

    if (group) {
      var myGroup = GROUPS[group] || (GROUPS[group] = []);
      myGroup.push(handleOptions);

      if (mainGroup) {
        var myMainGroup = MAINGROUPS[mainGroup] || (MAINGROUPS[mainGroup] = []);
        myMainGroup.push(handleOptions);
      }
    } // 绑定事件


    if (options.passive) {
      elem[addEventListener](type, handleOptions.handler, {
        passive: true,
        capture: options.capture || false
      });
    } else {
      elem[addEventListener](type, handleOptions.handler, options.capture || false);
    }
  }
  /**
   * 事件处理 => 触发事件
   * @private
   * @param {EventTarget} self 触发事件的对象
   * @param {IArguments} oArgs 原生事件触发时方法的 arguments
   * @param {Object} handleOptions 该事件的所有详细参数
   */


  function dispatch$1(self, oArgs, handleOptions) {
    /** 重写的 event 事件对象 */
    var event = new ZenJS$1.Event(oArgs[0]);
    /** 新 argument, 存放了新的 event 事件对象 */

    var args = slice.call(oArgs).$splice(0, 1, event);
    /** 事件委托选择器 */

    var selector = handleOptions.selector;
    /**  */

    var target = event.target,
        type = event.type;
    var elem = handleOptions.elem;
    event.delegateTarget = elem;
    event.handleOptions = handleOptions; // 有事件委托

    if (selector && !(type === 'click' && event.button >= 1)) {
      // 从被点击的元素开始, 一层一层往上找
      for (; target !== elem; target = target.parentNode || elem) {
        // 是元素节点
        // 点击事件, 将不处理禁用的元素
        if (target.nodeType === 1 && !(type === 'click' && target.disabled === true) && target.matches(selector)) {
          elem = event.currentTarget = target;
          break;
        }
      }

      if (event.delegateTarget === elem) {
        return;
      }
    }

    if (!event.currentTarget) {
      event.currentTarget = elem;
    }

    if (!target) {
      event.target = elem;
    } // 处理功能性命名空间


    if (ZenJS$1.config.event.modifiers && modifiers('dispatch', handleOptions.namespace, elem, type, event) === false) {
      return;
    }

    var result = handleOptions.listener.apply(self, args); // 返回 false, 阻止浏览器默认事件和冒泡

    if (result === false && ZenJS$1.config.event.returnFalse) {
      event.preventDefault();
      event.stopPropagation();
    }

    return result;
  }
  /**
   * 事件处理 => 移除事件
   * @private
   * @param {EventTarget} elem 需要移除事件的独享
   * @param {Array} types 需要移除的事件集
   * @param {Function} listener 需要移除的事件回调
   * @param {String} selector 事件委托选择器
   */


  function remove(elem, types, listener, selector) {
    init(elem, types, function (handleOptions, rNamespace, type, handlers, handlersLength) {
      // 检查注入到方法上的 guid 是否相同 ( 如果有 )
      if (!listener || listener.guid === handleOptions.guid) {
        // 检查命名空间是否相同 ( 如果有 )
        if (!rNamespace || rNamespace.test(handleOptions.namespaceStr)) {
          // 检查事件委托
          if (selector // 允许所有绑定的事件通过, 不管有没有事件委托
          ? selector === '**' || // 允许所有有事件委托的事件通过
          selector === '*' && handleOptions.selector || // 事件委托必须相同才能通过
          selector === handleOptions.selector // 允许所有没事件委托的事件通过
          : !handleOptions.selector) {
            // 移除事件
            elem[removeEventListener](type, handleOptions.handler); // 移除事件缓存

            handlers.splice(handlersLength, 1); // 移除分组缓存

            var group = handleOptions.group;
            var mainGroup = handleOptions.mainGroup; // 移除副分组

            if (group && (group = GROUPS[group]) && !group.$deleteValue(handleOptions).length) {
              delete GROUPS[handleOptions.group];
            } // 移除主分组


            if (mainGroup && (mainGroup = MAINGROUPS[mainGroup]) && !mainGroup.$deleteValue(handleOptions).length) {
              delete MAINGROUPS[handleOptions.mainGroup];
            }
          }
        }
      }
    }, function (handlers, events, type) {
      if (!handlers.length) {
        delete events[type];
      }
    });
  }
  /**
   * 事件处理 => 触发事件
   * @private
   * @param {EventTarget} elem 需要触发事件的对象
   * @param {Array} types 需要触发的事件集
   * @param {Array} data 需要传递到事件回调的参数
   */


  function emit(elem, types, data) {
    init(elem, types, function (handleOptions, rNamespace, type) {
      // 检查命名空间是否相同 ( 如果有 )
      if (!rNamespace || rNamespace.test(handleOptions.namespaceStr)) {
        // 检查事件委托 ( 不触发有事件委托的方法 )
        if (!handleOptions.selector) {
          handleOptions.handler.apply(handleOptions.elem, [type].concat(data));
        }
      }
    });
  }

  var EventListener = ZenJS$1.EventListener = assign(false, [null, {
    add: add$1,
    dispatch: dispatch$1,
    modifiers: modifiers,
    remove: remove,
    emit: emit
  }]);
  /**
   * 绑定事件 => 参数处理
   * @param {Element} elem 需要绑定事件的对象
   * @param {String} types 需要绑定的事件集
   * @param {String} selector 事件委托的选择器
   * @param {Function} listener 绑定的事件
   * @param {Object} options 事件绑定参数
   * @param {Boolean} once 事件只执行一次
   */

  function on(elem, types, selector, listener, options, once) {
    var events;
    var mainGroup, group, data; // 1. on( elem, { type: listener || Boolean } )
    // 2. on( elem, { type: listener || Boolean }, options )
    // 3. on( elem, { type: listener || Boolean }, options, selector )
    // 4. on( elem, { type: listener || Boolean }, selector )
    // 5. on( elem, { type: listener || Boolean }, selector, options )

    if (isObject(types)) {
      events = types;

      if (isString$1(selector)) {
        // 4, 5
        options = listener;
      } else {
        // 1, 2, 3
        options = selector;
        selector = listener;
      }
    } // on( elem, selector, { type: listener || Boolean } )
    // on( elem, selector, { type: listener || Boolean }, options )
    else if (isObject(selector)) {
        events = selector;
        selector = types;
        options = listener;
      }

    if (events) {
      for (var type in events) {
        on(elem, type, events[type], selector, options);
      }

      return elem;
    }

    if (!types) return elem;else {
      types = types.match(rnothtmlwhite);

      if (types == null || types.length === 0) {
        return elem;
      }
    } // on( elem, types, listener || Boolean )
    // on( elem, types, listener || Boolean, selector )
    // on( elem, types, listener || Boolean, selector, options )

    if (!isString$1(selector)) {
      var _ref = [listener, selector];
      selector = _ref[0];
      listener = _ref[1]; // on( elem, types, listener || Boolean, options )
      // on( elem, types, listener || Boolean, options, selector )

      if (!isString$1(selector) && (options === undefined || isString$1(options))) {
        var _ref2 = [selector, options];
        options = _ref2[0];
        selector = _ref2[1];
      }
    }

    if (isBoolean$1(listener)) {
      listener = listener ? returnTrue : returnFalse;
    }

    if (!listener) {
      return elem;
    } // useCapture


    if (isBoolean$1(options)) {
      options = {
        capture: options
      };
    } else {
      options = options ? assign$1({}, options) : {};
    } // mainGroup
    // group
    // 事件分组功能, 分到同一组的事件可进行同时移除


    if ('group' in options) {
      group = options.group;

      if (group[isArray]) {
        mainGroup = group[0];
        group = group[1];
      }

      delete options.group;
    }

    if ('data' in options) {
      data = options.data;
      delete options.data;
    }

    keys(options).forEach(function (key) {
      options[key] ? options[key] = true : delete options[key];
    });

    if (once || options.one || options.once) {
      var origListener = listener;

      listener = function (event) {
        elem.$off(event);
        return origListener.apply(this, arguments);
      };

      listener.guid = origListener.guid || (origListener.guid = ZenJS$1.guid);
      delete options.one;
      delete options.once;
    }

    if (options.passive && !supportsPassiveEvent) {
      delete options.passive;
    }

    types.forEach(function (type) {
      EventListener.add(elem, type, selector, listener, options, mainGroup, group, data);
    });
    return elem;
  }

  if (inBrowser) {
    defineValue(DomEventTarget, '$on', function (types, selector, listener, options) {
      var elem = this || window;
      return on(elem, types, selector, listener, options);
    });
    defineValue(DomEventTarget, '$one $once', function (types, selector, listener, options) {
      var elem = this || window;
      return on(elem, types, selector, listener, options, true);
    });
  }
  /**
   * 移除事件 => 参数处理
   * @param {*} types 
   * @param {*} selector 
   * @param {*} listener 
   * @param {*} options 
   */


  function off(elem, types, selector, listener) {
    // $off( ZenJS.Event )
    if (types instanceof ZenJS.Event) {
      return offByHandleOptions(types.handleOptions);
    } // $off( object, selector )
    // $off({ group: 'group' })
    // $off({ group: [ 'group', 'group-1' ] })


    if (isObject(types)) {
      if ('group' in types) {
        var group = types.group;
        var groups; // 移除时传入主分组或主分组与副分组时, 始终认为移除所有主分组下的内容

        if (group[isArray]) {
          var mainGroup = group[0];

          if (mainGroup && (mainGroup = MAINGROUPS[mainGroup])) {
            groups = mainGroup.slice();
          }
        } // 只移除副分组
        else if (group && (group = GROUPS[group])) {
            groups = group.slice();
          }

        if (groups) {
          groups.forEach(function (handleOptions) {
            offByHandleOptions(handleOptions);
          });
        }
      } // $off( object, selector )
      else {
          for (var type in types) {
            off(elem, type, selector, types[type]);
          }
        }

      return elem;
    }

    if (!types) return elem;else {
      types = types.match(rnothtmlwhite);

      if (types == null || types.length === 0) {
        return elem;
      }
    } // $off( types, listener )
    // $off( types, listener, selector )

    if (selector !== undefined && !isString$1(selector)) {
      var _ref = [listener, selector];
      selector = _ref[0];
      listener = _ref[1];
    } // $off( types, true || false )


    if (isBoolean$1(listener)) {
      listener = listener ? returnTrue : returnFalse;
    }

    EventListener.remove(elem, types, listener, selector);
    return elem;
  }

  function offByHandleOptions(handleOptions) {
    var namespace = handleOptions.namespaceStr;
    var handleTypes = namespace ? handleOptions.type + "." + namespace : handleOptions.type;
    return off(handleOptions.elem, handleTypes, handleOptions.selector, handleOptions.listener);
  }

  if (inBrowser) {
    defineValue(DomEventTarget, '$off', function (types, selector, listener) {
      var elem = this || window;
      return off(elem, types, selector, listener);
    });
  }
  /**
   * 触发事件 => 参数处理
   * @param {String} types 
   * @param {any} args 
   */


  function emit$1(elem, types, args) {
    if (!types) return elem;else {
      types = types.match(rnothtmlwhite);

      if (types == null || types.length === 0) {
        return elem;
      }
    }
    EventListener.emit(elem, types, parametersRest(args, 1));
    return elem;
  }

  if (inBrowser) {
    defineValue(DomEventTarget, '$emit', function (types) {
      var elem = this || window;
      return emit$1(elem, types, arguments);
    });
  }

  var rSearch = /\?.*?(?=#|$)/;

  if (inBrowser) {
    var SetSearch = function (oSearch, name, value) {
      // remove
      if (value == null) delete oSearch[name]; // setter
      else oSearch[name] = value;
    };

    var Search = function (search, name, value, isSet, isObj, isGetAll) {
      var oSearch = parse(search);
      if (isGetAll) return oSearch; // setter
      else if (isSet) {
          if (isObj) {
            each(name, function (name, value) {
              SetSearch(oSearch, name, value);
            });
          } else {
            SetSearch(oSearch, name, value);
          }

          return stringify(oSearch);
        } // getter

      return oSearch[name];
    };

    location.$search = function (name, value) {
      var isObj, isSet, isGetAll;

      if (!(isGetAll = arguments.length < 1)) {
        isSet = arguments.length > 1 || (isObj = isObject(name));
      }

      var newSearch = Search(location.search.substr(1), name, value, isSet, isObj, isGetAll);
      if (isSet) location.search = newSearch;else return newSearch;
    };

    location.$urlSearch = function (url, name, value) {
      if (isString$1(url)) {
        var isObj, isSet, isGetAll;
        var search = ((url.match(rSearch) || [])[0] || '').substr(1);

        if (!(isGetAll = arguments.length < 2)) {
          isSet = arguments.length > 2 || (isObj = isObject(name));
        }

        if (!isSet) {
          return search ? Search(search, name, value, isSet, isObj, isGetAll) : isGetAll ? {} : '';
        }

        var newSearch = '?' + Search(search, name, value, isSet, isObj); // http://www.zenjs.net/?asd=123#xxx

        if (search || url.indexOf('?') > -1) url = url.replace(rSearch, newSearch); // http://www.zenjs.net/#xxx
        else if (url.indexOf('#') > -1) url = url.replace('#', newSearch + '#'); // http://www.zenjs.net/
          else url = url + newSearch;
        return url;
      }
    };
  }
  /*
   * event.target : 触发事件的元素
   * event.originalTarget : 绑定事件的元素, 如果是委托代理, 则为代理的元素
   * event.delegateTarget : 绑定事件的元素
   * event.relatedTarget : 事件的相关节点, mouseover 时移出的节点, mouseout 时移入的节点
   *
   * event.preventDefault() : 阻止浏览器默认行为
   * event.stopPropagation() : 停止将事件冒泡到父节点
   * event.stopImmediatePropagation() : 停止将事件冒泡到父节点且停止当前元素后续事件执行
   */


  var Event$1 = ZenJS$1.Event = function (src, props) {
    if (this instanceof Event$1 === false) {
      return new ZenJS$1.Event(src, props);
    }

    if (src instanceof Event$1) {
      return src;
    } // Event object


    if (src && src.type) {
      this.originalEvent = src;
      this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined && src.returnValue === false ? returnTrue : returnFalse;
      this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;

      for (var key in src) {
        if (!(key in this)) {
          this[key] = src[key];
        }
      }
    } // Event type
    else {
        this.type = src;
      }

    if (props) {
      assign$1(this, props);
    }

    this.timeStamp = src && src.timeStamp || Date.now();
  };

  var EventProto = Event$1.prototype = {
    constructor: Event$1
  };
  ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'].forEach(function (fn) {
    EventProto[fn] = function () {
      if (this.originalEvent) {
        this.originalEvent[fn]();
      }
    };
  });

  var addProp = Event$1.addProp = function (name, get) {
    defineProperty(EventProto, name, {
      enumerable: true,
      configurable: true,
      get: isFunction(get) ? function () {
        if (this.originalEvent) return get(this.originalEvent);
      } : function () {
        return this[name];
      },
      set: function (value) {
        this[name] = value;
      }
    });
  };

  var rkeyEvent = /^key/,
      rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;
  addProp('which', function (event) {
    var button;

    if (event.which == null && rkeyEvent.test(event.type)) {
      return event.charCode != null ? event.charCode : event.keyCode;
    }

    if (!event.which && (button = event.button) !== undefined && rmouseEvent.test(event.type)) {
      if (button & 1) return 1;
      if (button & 2) return 3;
      if (button & 4) return 2;
      return 0;
    }

    return event.which;
  });
  addProp('wheelDelta', function (event, wheelDelta) {
    if (wheelDelta = event.wheelDelta) {
      return wheelDelta;
    } else if (wheelDelta = event.detail) {
      return wheelDelta > 0 ? -120 : 120;
    }
  });
  addProp('detail', function (event, detail) {
    if (detail = event.detail) {
      return detail;
    } else if (detail = event.wheelDelta) {
      return detail > 0 ? -3 : 3;
    }
  });

  var noop$1 = ZenJS.noop;

  function Lit() {}

  window.Lit = Lit;

  var a$1 = {};

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
    for (var c, d = 0; d < b.length; d++) {
      c = b[d], c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(a, c.key, c);
    }
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
      for (var b, c = 1; c < arguments.length; c++) {
        for (var d in b = arguments[c], b) {
          Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);
        }
      }

      return a;
    }, h.apply(this, arguments);
  }

  function i$1(a) {
    return r.getPrototypeOf = i$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function (a) {
      return a.__proto__ || Object.getPrototypeOf(a);
    }, i$1(a);
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

  var r = a$1.babelHelpers = {};
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
  }, r.getPrototypeOf = i$1, r.setPrototypeOf = j, r.construct = l, r.isNativeFunction = function (a) {
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
    if (null != a) for (var c in a) {
      if (Object.prototype.hasOwnProperty.call(a, c)) {
        var d = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(a, c) : {};
        d.get || d.set ? Object.defineProperty(b, c, d) : b[c] = a[c];
      }
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

      for (d = 0; d < f.length; d++) {
        c = f[d], !(0 <= b.indexOf(c)) && Object.prototype.propertyIsEnumerable.call(a, c) && (e[c] = a[c]);
      }
    }

    return e;
  }, r.assertThisInitialized = function (a) {
    if (void 0 === a) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a;
  }, r.possibleConstructorReturn = function (a, b) {
    return b && ("object" === typeof b || "function" === typeof b) ? b : r.assertThisInitialized(a);
  }, r.superPropBase = function (a, b) {
    for (; !Object.prototype.hasOwnProperty.call(a, b) && (a = r.getPrototypeOf(a), null !== a);) {
    }

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
      for (var b = 0, c = Array(a.length); b < a.length; b++) {
        c[b] = a[b];
      }

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
      for (var g, h = a[Symbol.iterator](); !(d = (g = h.next()).done) && (c.push(g.value), !(b && c.length === b)); d = !0) {
      }
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

  var a$2 = {};
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
            for (; ++c < a.length;) {
              if (q.call(a, c)) return b.value = a[c], b.done = !1, b;
            }

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
        w = a$2.regeneratorRuntime;
    if (w) return void (v && (module.exports = w));
    w = a$2.regeneratorRuntime = v ? module.exports : {}, w.wrap = b;
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

      for (var c in a) {
        b.push(c);
      }

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
        if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(l), !a) for (var b in this) {
          "t" === b.charAt(0) && q.call(this, b) && !isNaN(+b.slice(1)) && (this[b] = void 0);
        }
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
        for (var c, d = this.tryEntries.length - 1; 0 <= d; --d) {
          if (c = this.tryEntries[d], c.tryLoc <= this.prev && q.call(c, "finallyLoc") && this.prev < c.finallyLoc) {
            var e = c;
            break;
          }
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
        for (var b, c = this.tryEntries.length - 1; 0 <= c; --c) {
          if (b = this.tryEntries[c], b.finallyLoc === a) return this.complete(b.completion, b.afterLoc), l(b), x;
        }
      },
      catch: function (a) {
        for (var b, c = this.tryEntries.length - 1; 0 <= c; --c) {
          if (b = this.tryEntries[c], b.tryLoc === a) {
            var d = b.completion;

            if ("throw" === d.type) {
              var e = d.arg;
              l(b);
            }

            return e;
          }
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
  var regeneratorRuntime = a$2.regeneratorRuntime;

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
   * Class decorator factory that defines the decorated class as a custom element.
   *
   * @param tagName the name of the custom element to define
   *
   * In TypeScript, the `tagName` passed to `customElement` should be a key of the
   * `HTMLElementTagNameMap` interface. To add your element to the interface,
   * declare the interface in this module:
   *
   *     @customElement('my-element')
   *     export class MyElement extends LitElement {}
   *
   *     declare global {
   *       interface HTMLElementTagNameMap {
   *         'my-element': MyElement;
   *       }
   *     }
   *
   */

  var customElement = function customElement(tagName) {
    return function (clazz) {
      window.customElements.define(tagName, clazz); // Cast as any because TS doesn't recognize the return type as being a
      // subtype of the decorated class when clazz is typed as
      // `Constructor<HTMLElement>` for some reason. `Constructor<HTMLElement>`
      // is helpful to make sure the decorator is applied to elements however.

      return clazz;
    };
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
    var options$1 = {
      get capture() {
        eventOptionsSupported = true;
        return false;
      }

    };
    window.addEventListener('test', options$1, options$1);
    window.removeEventListener('test', options$1, options$1);
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

  var html = function html(strings) {
    for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    return new TemplateResult(strings, values, 'html', defaultTemplateProcessor);
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

  function define$1(options) {
    return (
      /*#__PURE__*/
      function (_LitElement) {
        r.inherits(_class, _LitElement);

        function _class() {
          var _this7;

          r.classCallCheck(this, _class);
          _this7 = r.possibleConstructorReturn(this, r.getPrototypeOf(_class).call(this));
          options.constructor.call(r.assertThisInitialized(r.assertThisInitialized(_this7)));
          return _this7;
        } // 组件被插入 DOM 时触发
        //   - 此时还没触发 render 方法
        //   - 此时已经将 props 初始化完毕


        r.createClass(_class, [{
          key: "connectedCallback",
          value: function connectedCallback() {
            r.get(r.getPrototypeOf(_class.prototype), "connectedCallback", this).call(this);
            options.connectedCallback.call(this);
          }
        }, {
          key: "update",
          value: function update(changedProperties) {
            options.updateStart.call(this, changedProperties);
            r.get(r.getPrototypeOf(_class.prototype), "update", this).call(this, changedProperties);
            options.updateEnd.call(this, changedProperties);
          } // 第一次更新元素后调用

        }, {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            options.firstUpdated.call(this, changedProperties);
          }
        }, {
          key: "updated",
          value: function updated(changedProperties) {
            options.updated.call(this, changedProperties);
          }
        }, {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            r.get(r.getPrototypeOf(_class.prototype), "disconnectedCallback", this).call(this);
            options.disconnectedCallback.call(this);
          }
        }]);
        return _class;
      }(LitElement)
    );
  }

  var $assign = Object.$assign;

  function lifecycle(options) {
    ["constructor", "connectedCallback", "disconnectedCallback", "updateStart", "updateEnd", "firstUpdated", "updated"].forEach(function (lifecycle) {
      var events = [];

      options[lifecycle] = function () {
        var _this = this,
            _arguments = arguments;

        events.forEach(function (fn) {
          return fn.apply(_this, _arguments);
        });
      };

      $assign(true, options[lifecycle], {
        push: function () {
          [].push.apply(events, arguments);
        }
      });
    });
  }

  function get(object, name) {
    var value = object[name];
    delete object[name];
    return value;
  }

  /**
   * 初始化渲染方法
   */

  function render$3(options, custom, customProto) {
    var render$$1 = get(options, 'render'),
        template; // 有 render 方法

    if (render$$1) {
      render$$1 = render$$1.$args({
        0: html
      });
    } // 有 template 模板
    else if (template = get(options, 'template')) {
        render$$1 = function () {
          return html([template]);
        };
      } // 啥都没有
      else {
          render$$1 = noop$1;
        } // 渲染方法


    customProto.render = render$$1;
  }

  /**
   * 生命周期 -> 组件挂载并渲染完成
   */

  function mounted(options) {
    var mounted = get(options, 'mounted');

    if (mounted) {
      options.firstUpdated.push(mounted);
    }
  }

  var defineGet$1 = ZenJS.defineGet;

  var isArray$2 = ZenJS.isArray;

  var $isPlainObject = Object.$isPlainObject;

  var fromEntries$1 = ZenJS.fromEntries;

  var entries$1 = ZenJS.entries;

  var isString$2 = ZenJS.isString;

  var isFunction$2 = ZenJS.isFunction;

  var defineValue$1 = ZenJS.defineValue;

  var hasOwnProperty$1 = Object.hasOwnProperty;

  var $each$1 = Object.$each;

  /**
   * 初始化 props
   */

  function props(options, custom) {
    var props = get(options, 'props');
    var propsIsArray = false; // 去除不合法参数

    if (props == null || !((propsIsArray = isArray$2(props)) || $isPlainObject(props))) {
      return;
    } // 格式化数组参数


    if (propsIsArray) {
      if (!props.length) return;
      props = fromEntries$1(props.map(function (prop) {
        return [prop, {}];
      }));
    } // 格式化 JSON 参数
    else {
        props = entries$1(props).map(function (keyValue) {
          var key = keyValue[0],
              value = keyValue[1];
          var options = {};

          if (value) {
            // 设置变量类型
            if (isFunction$2(value)) {
              options.type = value;
            } // 高级用法
            else {
                // 变量取值属性名
                if (isString$2(value.attr)) {
                  options.attribute = value.attr;
                } // 变量发生变化联动属性一起更改


                if (value.reflect) {
                  options.reflect = true;
                } // 变量类型


                if (value.type != null) {
                  var type = value.type; // String || Number || Boolean
                  // function( value ){ return value };

                  if (isFunction$2(type)) {
                    options.type = type;
                  } // {
                  //   from(){},
                  //   to(){}
                  // }
                  else if ($isPlainObject(type)) {
                      options.type = {};
                      if (isFunction$2(type.from)) options.type.fromAttribute = type.from;
                      if (isFunction$2(type.to)) options.type.toAttribute = type.to;
                    }
                } // 默认值


                if ('default' in value) {
                  var _default = value.default;

                  switch (typeof _default) {
                    case 'object':
                      break;

                    case 'function':
                      {
                        defineGet$1(options, 'default', _default.bind(void 0));
                        break;
                      }

                    default:
                      {
                        defineValue$1(options, 'default', _default);
                        break;
                      }
                  }
                }
              }
          } // 当显式的设定了类型后, 比如: ( String || Number || Boolean )
          // 对没有默认值的类型定义一个初始值


          if (options.type && !('default' in options)) {
            switch (options.type) {
              case String:
                {
                  options.default = '';
                  break;
                }

              case Number:
                {
                  options.default = 0;
                  break;
                }

              case Boolean:
                {
                  options.default = false;
                  break;
                }
            }
          }

          return [key, options];
        });
        props = fromEntries$1(props);
      }

    defineGet$1(custom, 'properties', function () {
      return props;
    });
    options.connectedCallback.push(function () {
      var _this = this;

      $each$1(props, function (name, options) {
        if (!hasOwnProperty$1.call(_this, name) && 'default' in options) {
          _this[name] = options.default;
        }
      });
    });
  }

  var defineProperty$1 = Object.defineProperty;

  function methods(options) {
    if (options.methods) {
      var keyValues = entries$1(options.methods);

      if (keyValues.length) {
        options.connectedCallback.push(function () {
          var _this = this;

          keyValues.forEach(function (keyValue) {
            var name = keyValue[0],
                value = keyValue[1];
            defineProperty$1(_this, name, {
              value: value,
              configurable: false,
              enumerable: true,
              writable: false
            });
          });
        });
      }
    }
  }

  ZenJS.defineValue(Lit, 'define', function (name, _options) {
    // 克隆一份配置, 保证配置传进来后不被更改
    var options = $assign(null, _options); // 先初始化元素

    var custom = define$1(options); // 获取原型对象

    var customProto = custom.prototype; // 初始化参数

    processing.forEach(function (fn) {
      fn(options, custom, customProto);
    }); // 定义组件

    customElement(name)(custom);
  });
  var processing = [lifecycle, render$3, mounted, props, methods];

}));
