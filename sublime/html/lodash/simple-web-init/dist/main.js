(() => {
  var e,
    r,
    t = {},
    o = {};
  function n(e) {
    var r = o[e];
    if (void 0 !== r) return r.exports;
    var a = (o[e] = { exports: {} });
    return t[e](a, a.exports, n), a.exports;
  }
  (n.m = t),
    (n.d = (e, r) => {
      for (var t in r)
        n.o(r, t) &&
          !n.o(e, t) &&
          Object.defineProperty(e, t, { enumerable: !0, get: r[t] });
    }),
    (n.f = {}),
    (n.e = (e) =>
      Promise.all(Object.keys(n.f).reduce((r, t) => (n.f[t](e, r), r), []))),
    (n.u = (e) => e + ".js"),
    (n.g = (function () {
      if ("object" == typeof globalThis) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (e) {
        if ("object" == typeof window) return window;
      }
    })()),
    (n.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)),
    (e = {}),
    (r = "my-webpack-project:"),
    (n.l = (t, o, a, i) => {
      if (e[t]) e[t].push(o);
      else {
        var l, c;
        if (void 0 !== a)
          for (
            var u = document.getElementsByTagName("script"), p = 0;
            p < u.length;
            p++
          ) {
            var s = u[p];
            if (
              s.getAttribute("src") == t ||
              s.getAttribute("data-webpack") == r + a
            ) {
              l = s;
              break;
            }
          }
        l ||
          ((c = !0),
          ((l = document.createElement("script")).charset = "utf-8"),
          (l.timeout = 120),
          n.nc && l.setAttribute("nonce", n.nc),
          l.setAttribute("data-webpack", r + a),
          (l.src = t)),
          (e[t] = [o]);
        var d = (r, o) => {
            (l.onerror = l.onload = null), clearTimeout(f);
            var n = e[t];
            if (
              (delete e[t],
              l.parentNode && l.parentNode.removeChild(l),
              n && n.forEach((e) => e(o)),
              r)
            )
              return r(o);
          },
          f = setTimeout(
            d.bind(null, void 0, { type: "timeout", target: l }),
            12e4
          );
        (l.onerror = d.bind(null, l.onerror)),
          (l.onload = d.bind(null, l.onload)),
          c && document.head.appendChild(l);
      }
    }),
    (n.r = (e) => {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (() => {
      var e;
      n.g.importScripts && (e = n.g.location + "");
      var r = n.g.document;
      if (!e && r && (r.currentScript && (e = r.currentScript.src), !e)) {
        var t = r.getElementsByTagName("script");
        t.length && (e = t[t.length - 1].src);
      }
      if (!e)
        throw new Error(
          "Automatic publicPath is not supported in this browser"
        );
      (e = e
        .replace(/#.*$/, "")
        .replace(/\?.*$/, "")
        .replace(/\/[^\/]+$/, "/")),
        (n.p = e);
    })(),
    (() => {
      var e = { 179: 0 };
      n.f.j = (r, t) => {
        var o = n.o(e, r) ? e[r] : void 0;
        if (0 !== o)
          if (o) t.push(o[2]);
          else {
            var a = new Promise((t, n) => (o = e[r] = [t, n]));
            t.push((o[2] = a));
            var i = n.p + n.u(r),
              l = new Error();
            n.l(
              i,
              (t) => {
                if (n.o(e, r) && (0 !== (o = e[r]) && (e[r] = void 0), o)) {
                  var a = t && ("load" === t.type ? "missing" : t.type),
                    i = t && t.target && t.target.src;
                  (l.message =
                    "Loading chunk " + r + " failed.\n(" + a + ": " + i + ")"),
                    (l.name = "ChunkLoadError"),
                    (l.type = a),
                    (l.request = i),
                    o[1](l);
                }
              },
              "chunk-" + r,
              r
            );
          }
      };
      var r = (r, t) => {
          var o,
            a,
            [i, l, c] = t,
            u = 0;
          if (i.some((r) => 0 !== e[r])) {
            for (o in l) n.o(l, o) && (n.m[o] = l[o]);
            c && c(n);
          }
          for (r && r(t); u < i.length; u++)
            (a = i[u]), n.o(e, a) && e[a] && e[a][0](), (e[a] = 0);
        },
        t = (self.webpackChunkmy_webpack_project =
          self.webpackChunkmy_webpack_project || []);
      t.forEach(r.bind(null, 0)), (t.push = r.bind(null, t.push.bind(t)));
    })(),
    console.log("Hello World!"),
    n
      .e(4)
      .then(n.bind(n, 4))
      .then((e) => {
        console.log(e.default());
      });
})();
