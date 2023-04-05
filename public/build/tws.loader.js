function createUnityInstance(e, t, n) {
  function r(e, n) {
    if (!r.aborted && t.showBanner)
      return 'error' == n && (r.aborted = !0), t.showBanner(e, n);
    switch (n) {
      case 'error':
        console.error(e);
        break;
      case 'warning':
        console.warn(e);
        break;
      default:
        console.log(e);
    }
  }
  function o(e) {
    var t = e.reason || e.error,
      n = t ? t.toString() : e.message || e.reason || '',
      r = t && t.stack ? t.stack.toString() : '';
    (n += '\n' + (r = r.startsWith(n) ? r.substring(n.length) : r).trim()) &&
      s.stackTraceRegExp &&
      s.stackTraceRegExp.test(n) &&
      h(
        n,
        e.filename || (t && (t.fileName || t.sourceURL)) || '',
        e.lineno || (t && (t.lineNumber || t.line)) || 0
      );
  }
  function i(e, t, n) {
    var r = e[t];
    (void 0 !== r && r) ||
      (console.warn(
        'Config option "' +
          t +
          '" is missing or empty. Falling back to default value: "' +
          n +
          '". Consider updating your WebGL template to include the missing config option.'
      ),
      (e[t] = n));
  }
  n = n || function () {};
  var a,
    s = {
      canvas: e,
      webglContextAttributes: { preserveDrawingBuffer: !1, powerPreference: 2 },
      streamingAssetsUrl: 'StreamingAssets',
      downloadProgress: {},
      deinitializers: [],
      intervals: {},
      setInterval: function (e, t) {
        return (e = window.setInterval(e, t)), (this.intervals[e] = !0), e;
      },
      clearInterval: function (e) {
        delete this.intervals[e], window.clearInterval(e);
      },
      preRun: [],
      postRun: [],
      print: function (e) {
        console.log(e);
      },
      printErr: function (e) {
        console.error(e),
          'string' == typeof e &&
            -1 != e.indexOf('wasm streaming compile failed') &&
            (-1 != e.toLowerCase().indexOf('mime')
              ? r(
                  'HTTP Response Header "Content-Type" configured incorrectly on the server for file ' +
                    s.codeUrl +
                    ' , should be "application/wasm". Startup time performance will suffer.',
                  'warning'
                )
              : r(
                  'WebAssembly streaming compilation failed! This can happen for example if "Content-Encoding" HTTP header is incorrectly enabled on the server for file ' +
                    s.codeUrl +
                    ', but the file is not pre-compressed on disk (or vice versa). Check the Network tab in browser Devtools to debug server header configuration.',
                  'warning'
                ));
      },
      locateFile: function (e) {
        return e;
      },
      disabledCanvasEvents: ['contextmenu', 'dragstart'],
    };
  for (a in (i(t, 'companyName', 'Unity'),
  i(t, 'productName', 'WebGL Player'),
  i(t, 'productVersion', '1.0'),
  t))
    s[a] = t[a];
  s.streamingAssetsUrl = new URL(s.streamingAssetsUrl, document.URL).href;
  var l = s.disabledCanvasEvents.slice();
  function d(e) {
    e.preventDefault();
  }
  l.forEach(function (t) {
    e.addEventListener(t, d);
  }),
    window.addEventListener('error', o),
    window.addEventListener('unhandledrejection', o),
    s.deinitializers.push(function () {
      for (var t in (s.disableAccessToMediaDevices(),
      l.forEach(function (t) {
        e.removeEventListener(t, d);
      }),
      window.removeEventListener('error', o),
      window.removeEventListener('unhandledrejection', o),
      s.intervals))
        window.clearInterval(t);
      s.intervals = {};
    }),
    (s.QuitCleanup = function () {
      for (var e = 0; e < s.deinitializers.length; e++) s.deinitializers[e]();
      (s.deinitializers = []), 'function' == typeof s.onQuit && s.onQuit();
    });
  var f = '',
    u = '',
    c =
      (document.addEventListener('webkitfullscreenchange', function (t) {
        document.webkitCurrentFullScreenElement === e
          ? e.style.width &&
            ((f = e.style.width),
            (u = e.style.height),
            (e.style.width = '100%'),
            (e.style.height = '100%'))
          : f && ((e.style.width = f), (e.style.height = u), (u = f = ''));
      }),
      {
        Module: s,
        SetFullscreen: function () {
          if (s.SetFullscreen) return s.SetFullscreen.apply(s, arguments);
          s.print('Failed to set Fullscreen mode: Player not loaded yet.');
        },
        SendMessage: function () {
          if (s.SendMessage) return s.SendMessage.apply(s, arguments);
          s.print('Failed to execute SendMessage: Player not loaded yet.');
        },
        Quit: function () {
          return new Promise(function (e, t) {
            (s.shouldQuit = !0), (s.onQuit = e);
          });
        },
      });
  function h(e, t, n) {
    -1 == e.indexOf('fullscreen error') &&
      (s.startupErrorHandler
        ? s.startupErrorHandler(e, t, n)
        : (s.errorHandler && s.errorHandler(e, t, n)) ||
          (console.log('Invoking error handler due to\n' + e),
          'function' == typeof dump &&
            dump('Invoking error handler due to\n' + e),
          h.didShowErrorMessage ||
            (-1 !=
            (e =
              'An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was:\n' +
              e).indexOf('DISABLE_EXCEPTION_CATCHING')
              ? (e =
                  'An exception has occurred, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project WebGL player settings to be able to catch the exception or see the stack trace.')
              : -1 != e.indexOf('Cannot enlarge memory arrays')
              ? (e =
                  'Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings.')
              : (-1 == e.indexOf('Invalid array buffer length') &&
                  -1 == e.indexOf('Invalid typed array length') &&
                  -1 == e.indexOf('out of memory') &&
                  -1 == e.indexOf('could not allocate memory')) ||
                (e =
                  'The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings.'),
            alert(e),
            (h.didShowErrorMessage = !0))));
  }
  function b(e, t) {
    if ('symbolsUrl' != e) {
      var r = s.downloadProgress[e],
        o =
          ((r =
            r ||
            (s.downloadProgress[e] = {
              started: !1,
              finished: !1,
              lengthComputable: !1,
              total: 0,
              loaded: 0,
            })),
          'object' != typeof t ||
            ('progress' != t.type && 'load' != t.type) ||
            (r.started ||
              ((r.started = !0), (r.lengthComputable = t.lengthComputable)),
            (r.total = t.total),
            (r.loaded = t.loaded),
            'load' == t.type && (r.finished = !0)),
          0),
        i = 0,
        a = 0,
        l = 0,
        d = 0;
      for (e in s.downloadProgress) {
        if (!(r = s.downloadProgress[e]).started) return;
        a++,
          r.lengthComputable
            ? ((o += r.loaded), (i += r.total), l++)
            : r.finished || d++;
      }
      n(0.9 * (a ? (a - d - (i ? (l * (i - o)) / i : 0)) / a : 0));
    }
  }
  (s.SystemInfo = (function () {
    var e,
      t,
      n,
      r,
      o = navigator.userAgent + ' ',
      i = [
        ['Firefox', 'Firefox'],
        ['OPR', 'Opera'],
        ['Edg', 'Edge'],
        ['SamsungBrowser', 'Samsung Browser'],
        ['Trident', 'Internet Explorer'],
        ['MSIE', 'Internet Explorer'],
        ['Chrome', 'Chrome'],
        ['CriOS', 'Chrome on iOS Safari'],
        ['FxiOS', 'Firefox on iOS Safari'],
        ['Safari', 'Safari'],
      ];
    function a(e, t, n) {
      return (e = RegExp(e, 'i').exec(t)) && e[n];
    }
    for (var s = 0; s < i.length; ++s)
      if ((t = a(i[s][0] + '[/ ](.*?)[ \\)]', o, 1))) {
        e = i[s][1];
        break;
      }
    'Safari' == e && (t = a('Version/(.*?) ', o, 1)),
      'Internet Explorer' == e && (t = a('rv:(.*?)\\)? ', o, 1) || t);
    for (
      var l = [
          ['Windows (.*?)[;)]', 'Windows'],
          ['Android ([0-9_.]+)', 'Android'],
          ['iPhone OS ([0-9_.]+)', 'iPhoneOS'],
          ['iPad.*? OS ([0-9_.]+)', 'iPadOS'],
          ['FreeBSD( )', 'FreeBSD'],
          ['OpenBSD( )', 'OpenBSD'],
          ['Linux|X11()', 'Linux'],
          ['Mac OS X ([0-9_.]+)', 'MacOS'],
          ['bot|google|baidu|bing|msn|teoma|slurp|yandex', 'Search Bot'],
        ],
        d = 0;
      d < l.length;
      ++d
    )
      if ((f = a(l[d][0], o, 1))) {
        (n = l[d][1]), (f = f.replace(/_/g, '.'));
        break;
      }
    var f =
        {
          'NT 5.0': '2000',
          'NT 5.1': 'XP',
          'NT 5.2': 'Server 2003',
          'NT 6.0': 'Vista',
          'NT 6.1': '7',
          'NT 6.2': '8',
          'NT 6.3': '8.1',
          'NT 10.0': '10',
        }[f] || f,
      u =
        ((u = document.createElement('canvas')) &&
          ((gl = u.getContext('webgl2')),
          (glVersion = gl ? 2 : 0),
          gl || ((gl = u && u.getContext('webgl')) && (glVersion = 1)),
          gl &&
            (r =
              (gl.getExtension('WEBGL_debug_renderer_info') &&
                gl.getParameter(37446)) ||
              gl.getParameter(7937))),
        'undefined' != typeof SharedArrayBuffer),
      c =
        'object' == typeof WebAssembly &&
        'function' == typeof WebAssembly.compile;
    return {
      width: screen.width,
      height: screen.height,
      userAgent: o.trim(),
      browser: e || 'Unknown browser',
      browserVersion: t || 'Unknown version',
      mobile: /Mobile|Android|iP(ad|hone)/.test(navigator.appVersion),
      os: n || 'Unknown OS',
      osVersion: f || 'Unknown OS Version',
      gpu: r || 'Unknown GPU',
      language: navigator.userLanguage || navigator.language,
      hasWebGL: glVersion,
      hasCursorLock: !!document.body.requestPointerLock,
      hasFullscreen:
        !!document.body.requestFullscreen ||
        !!document.body.webkitRequestFullscreen,
      hasThreads: u,
      hasWasm: c,
      hasWasmThreads: !1,
    };
  })()),
    (s.abortHandler = function (e) {
      return h(e, '', 0), !0;
    }),
    (Error.stackTraceLimit = Math.max(Error.stackTraceLimit || 0, 50)),
    (s.readBodyWithProgress = function (e, t, n) {
      var r = e.body ? e.body.getReader() : void 0,
        o = void 0 !== e.headers.get('Content-Length'),
        i = (function (e, t) {
          if (!t) return 0;
          t = e.headers.get('Content-Encoding');
          var n = parseInt(e.headers.get('Content-Length'));
          switch (t) {
            case 'br':
              return Math.round(5 * n);
            case 'gzip':
              return Math.round(4 * n);
            default:
              return n;
          }
        })(e, o),
        a = new Uint8Array(i),
        s = [],
        l = 0,
        d = 0;
      return (
        o ||
          console.warn(
            '[UnityCache] Response is served without Content-Length header. Please reconfigure server to include valid Content-Length for better download performance.'
          ),
        (function f() {
          return void 0 === r
            ? e.arrayBuffer().then(function (r) {
                var i = new Uint8Array(r);
                return (
                  t({
                    type: 'progress',
                    response: e,
                    total: r.length,
                    loaded: 0,
                    lengthComputable: o,
                    chunk: n ? i : null,
                  }),
                  i
                );
              })
            : r.read().then(function (r) {
                if (r.done) {
                  if (l === i) return a;
                  if (l < i) return a.slice(0, l);
                  for (
                    var u = new Uint8Array(l), c = (u.set(a, 0), d), h = 0;
                    h < s.length;
                    ++h
                  )
                    u.set(s[h], c), (c += s[h].length);
                  return u;
                }
                return (
                  l + r.value.length <= a.length
                    ? (a.set(r.value, l), (d = l + r.value.length))
                    : s.push(r.value),
                  (l += r.value.length),
                  t({
                    type: 'progress',
                    response: e,
                    total: Math.max(i, l),
                    loaded: l,
                    lengthComputable: o,
                    chunk: n ? r.value : null,
                  }),
                  f()
                );
              });
        })().then(function (n) {
          return (
            t({
              type: 'load',
              response: e,
              total: n.length,
              loaded: n.length,
              lengthComputable: o,
              chunk: null,
            }),
            (e.parsedBody = n),
            e
          );
        })
      );
    }),
    (s.fetchWithProgress = function (e, t) {
      var n = function () {};
      return (
        t && t.onProgress && (n = t.onProgress),
        fetch(e, t).then(function (e) {
          return s.readBodyWithProgress(e, n, t.enableStreamingDownload);
        })
      );
    });
  var g = {
    gzip: {
      require: function (e) {
        var t,
          n = {
            'inflate.js': function (e, t, n) {
              'use strict';
              var r = e('./zlib/inflate'),
                o = e('./utils/common'),
                i = e('./utils/strings'),
                a = e('./zlib/constants'),
                s = e('./zlib/messages'),
                l = e('./zlib/zstream'),
                d = e('./zlib/gzheader'),
                f = Object.prototype.toString;
              function u(e) {
                if (!(this instanceof u)) return new u(e);
                this.options = o.assign(
                  { chunkSize: 16384, windowBits: 0, to: '' },
                  e || {}
                );
                var t = this.options;
                if (
                  (t.raw &&
                    0 <= t.windowBits &&
                    t.windowBits < 16 &&
                    ((t.windowBits = -t.windowBits),
                    0 === t.windowBits && (t.windowBits = -15)),
                  !(0 <= t.windowBits && t.windowBits < 16) ||
                    (e && e.windowBits) ||
                    (t.windowBits += 32),
                  15 < t.windowBits &&
                    t.windowBits < 48 &&
                    0 == (15 & t.windowBits) &&
                    (t.windowBits |= 15),
                  (this.err = 0),
                  (this.msg = ''),
                  (this.ended = !1),
                  (this.chunks = []),
                  (this.strm = new l()),
                  (this.strm.avail_out = 0),
                  (e = r.inflateInit2(this.strm, t.windowBits)) !== a.Z_OK)
                )
                  throw new Error(s[e]);
                (this.header = new d()),
                  r.inflateGetHeader(this.strm, this.header);
              }
              function c(e, t) {
                if (((t = new u(t)).push(e, !0), t.err))
                  throw t.msg || s[t.err];
                return t.result;
              }
              (u.prototype.push = function (e, t) {
                var n,
                  s,
                  l,
                  d,
                  u,
                  c = this.strm,
                  h = this.options.chunkSize,
                  b = this.options.dictionary,
                  g = !1;
                if (this.ended) return !1;
                (s = t === ~~t ? t : !0 === t ? a.Z_FINISH : a.Z_NO_FLUSH),
                  'string' == typeof e
                    ? (c.input = i.binstring2buf(e))
                    : '[object ArrayBuffer]' === f.call(e)
                    ? (c.input = new Uint8Array(e))
                    : (c.input = e),
                  (c.next_in = 0),
                  (c.avail_in = c.input.length);
                do {
                  if (
                    (0 === c.avail_out &&
                      ((c.output = new o.Buf8(h)),
                      (c.next_out = 0),
                      (c.avail_out = h)),
                    (n = r.inflate(c, a.Z_NO_FLUSH)) === a.Z_NEED_DICT &&
                      b &&
                      ((u =
                        'string' == typeof b
                          ? i.string2buf(b)
                          : '[object ArrayBuffer]' === f.call(b)
                          ? new Uint8Array(b)
                          : b),
                      (n = r.inflateSetDictionary(this.strm, u))),
                    n === a.Z_BUF_ERROR && !0 === g && ((n = a.Z_OK), (g = !1)),
                    n !== a.Z_STREAM_END && n !== a.Z_OK)
                  )
                    return this.onEnd(n), !(this.ended = !0);
                } while (
                  (!c.next_out ||
                    (0 !== c.avail_out &&
                      n !== a.Z_STREAM_END &&
                      (0 !== c.avail_in ||
                        (s !== a.Z_FINISH && s !== a.Z_SYNC_FLUSH))) ||
                    ('string' === this.options.to
                      ? ((u = i.utf8border(c.output, c.next_out)),
                        (l = c.next_out - u),
                        (d = i.buf2string(c.output, u)),
                        (c.next_out = l),
                        (c.avail_out = h - l),
                        l && o.arraySet(c.output, c.output, u, l, 0),
                        this.onData(d))
                      : this.onData(o.shrinkBuf(c.output, c.next_out))),
                  0 === c.avail_in && 0 === c.avail_out && (g = !0),
                  (0 < c.avail_in || 0 === c.avail_out) && n !== a.Z_STREAM_END)
                );
                return (s = n === a.Z_STREAM_END ? a.Z_FINISH : s) ===
                  a.Z_FINISH
                  ? ((n = r.inflateEnd(this.strm)),
                    this.onEnd(n),
                    (this.ended = !0),
                    n === a.Z_OK)
                  : s !== a.Z_SYNC_FLUSH ||
                      (this.onEnd(a.Z_OK), !(c.avail_out = 0));
              }),
                (u.prototype.onData = function (e) {
                  this.chunks.push(e);
                }),
                (u.prototype.onEnd = function (e) {
                  e === a.Z_OK &&
                    ('string' === this.options.to
                      ? (this.result = this.chunks.join(''))
                      : (this.result = o.flattenChunks(this.chunks))),
                    (this.chunks = []),
                    (this.err = e),
                    (this.msg = this.strm.msg);
                }),
                (n.Inflate = u),
                (n.inflate = c),
                (n.inflateRaw = function (e, t) {
                  return ((t = t || {}).raw = !0), c(e, t);
                }),
                (n.ungzip = c);
            },
            'utils/common.js': function (e, t, n) {
              'use strict';
              var r =
                  'undefined' != typeof Uint8Array &&
                  'undefined' != typeof Uint16Array &&
                  'undefined' != typeof Int32Array,
                o =
                  ((n.assign = function (e) {
                    for (
                      var t = Array.prototype.slice.call(arguments, 1);
                      t.length;

                    ) {
                      var n = t.shift();
                      if (n) {
                        if ('object' != typeof n)
                          throw new TypeError(n + 'must be non-object');
                        for (var r in n) n.hasOwnProperty(r) && (e[r] = n[r]);
                      }
                    }
                    return e;
                  }),
                  (n.shrinkBuf = function (e, t) {
                    if (e.length !== t) {
                      if (e.subarray) return e.subarray(0, t);
                      e.length = t;
                    }
                    return e;
                  }),
                  {
                    arraySet: function (e, t, n, r, o) {
                      if (t.subarray && e.subarray)
                        e.set(t.subarray(n, n + r), o);
                      else for (var i = 0; i < r; i++) e[o + i] = t[n + i];
                    },
                    flattenChunks: function (e) {
                      for (var t, n, r, o = 0, i = 0, a = e.length; i < a; i++)
                        o += e[i].length;
                      for (
                        r = new Uint8Array(o), i = t = 0, a = e.length;
                        i < a;
                        i++
                      )
                        (n = e[i]), r.set(n, t), (t += n.length);
                      return r;
                    },
                  }),
                i = {
                  arraySet: function (e, t, n, r, o) {
                    for (var i = 0; i < r; i++) e[o + i] = t[n + i];
                  },
                  flattenChunks: function (e) {
                    return [].concat.apply([], e);
                  },
                };
              (n.setTyped = function (e) {
                e
                  ? ((n.Buf8 = Uint8Array),
                    (n.Buf16 = Uint16Array),
                    (n.Buf32 = Int32Array),
                    n.assign(n, o))
                  : ((n.Buf8 = Array),
                    (n.Buf16 = Array),
                    (n.Buf32 = Array),
                    n.assign(n, i));
              }),
                n.setTyped(r);
            },
            'utils/strings.js': function (e, t, n) {
              'use strict';
              var r = e('./common'),
                o = !0,
                i = !0;
              try {
                String.fromCharCode.apply(null, [0]);
              } catch (e) {
                o = !1;
              }
              try {
                String.fromCharCode.apply(null, new Uint8Array(1));
              } catch (e) {
                i = !1;
              }
              for (var a = new r.Buf8(256), s = 0; s < 256; s++)
                a[s] =
                  252 <= s
                    ? 6
                    : 248 <= s
                    ? 5
                    : 240 <= s
                    ? 4
                    : 224 <= s
                    ? 3
                    : 192 <= s
                    ? 2
                    : 1;
              function l(e, t) {
                if (t < 65537 && ((e.subarray && i) || (!e.subarray && o)))
                  return String.fromCharCode.apply(null, r.shrinkBuf(e, t));
                for (var n = '', a = 0; a < t; a++)
                  n += String.fromCharCode(e[a]);
                return n;
              }
              (a[254] = a[254] = 1),
                (n.string2buf = function (e) {
                  for (var t, n, o, i, a = e.length, s = 0, l = 0; l < a; l++)
                    55296 == (64512 & (n = e.charCodeAt(l))) &&
                      l + 1 < a &&
                      56320 == (64512 & (o = e.charCodeAt(l + 1))) &&
                      ((n = 65536 + ((n - 55296) << 10) + (o - 56320)), l++),
                      (s += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4);
                  for (t = new r.Buf8(s), l = i = 0; i < s; l++)
                    55296 == (64512 & (n = e.charCodeAt(l))) &&
                      l + 1 < a &&
                      56320 == (64512 & (o = e.charCodeAt(l + 1))) &&
                      ((n = 65536 + ((n - 55296) << 10) + (o - 56320)), l++),
                      n < 128
                        ? (t[i++] = n)
                        : (n < 2048
                            ? (t[i++] = 192 | (n >>> 6))
                            : (n < 65536
                                ? (t[i++] = 224 | (n >>> 12))
                                : ((t[i++] = 240 | (n >>> 18)),
                                  (t[i++] = 128 | ((n >>> 12) & 63))),
                              (t[i++] = 128 | ((n >>> 6) & 63))),
                          (t[i++] = 128 | (63 & n)));
                  return t;
                }),
                (n.buf2binstring = function (e) {
                  return l(e, e.length);
                }),
                (n.binstring2buf = function (e) {
                  for (
                    var t = new r.Buf8(e.length), n = 0, o = t.length;
                    n < o;
                    n++
                  )
                    t[n] = e.charCodeAt(n);
                  return t;
                }),
                (n.buf2string = function (e, t) {
                  for (
                    var n,
                      r,
                      o = t || e.length,
                      i = new Array(2 * o),
                      s = 0,
                      d = 0;
                    d < o;

                  )
                    if ((n = e[d++]) < 128) i[s++] = n;
                    else if (4 < (r = a[n])) (i[s++] = 65533), (d += r - 1);
                    else {
                      for (
                        n &= 2 === r ? 31 : 3 === r ? 15 : 7;
                        1 < r && d < o;

                      )
                        (n = (n << 6) | (63 & e[d++])), r--;
                      1 < r
                        ? (i[s++] = 65533)
                        : n < 65536
                        ? (i[s++] = n)
                        : ((n -= 65536),
                          (i[s++] = 55296 | ((n >> 10) & 1023)),
                          (i[s++] = 56320 | (1023 & n)));
                    }
                  return l(i, s);
                }),
                (n.utf8border = function (e, t) {
                  for (
                    var n =
                      (t = (t = t || e.length) > e.length ? e.length : t) - 1;
                    0 <= n && 128 == (192 & e[n]);

                  )
                    n--;
                  return !(n < 0) && 0 !== n && n + a[e[n]] > t ? n : t;
                });
            },
            'zlib/inflate.js': function (e, t, n) {
              'use strict';
              var r = e('../utils/common'),
                o = e('./adler32'),
                i = e('./crc32'),
                a = e('./inffast'),
                s = e('./inftrees'),
                l = -2;
              function d(e) {
                return (
                  ((e >>> 24) & 255) +
                  ((e >>> 8) & 65280) +
                  ((65280 & e) << 8) +
                  ((255 & e) << 24)
                );
              }
              function f() {
                (this.mode = 0),
                  (this.last = !1),
                  (this.wrap = 0),
                  (this.havedict = !1),
                  (this.flags = 0),
                  (this.dmax = 0),
                  (this.check = 0),
                  (this.total = 0),
                  (this.head = null),
                  (this.wbits = 0),
                  (this.wsize = 0),
                  (this.whave = 0),
                  (this.wnext = 0),
                  (this.window = null),
                  (this.hold = 0),
                  (this.bits = 0),
                  (this.length = 0),
                  (this.offset = 0),
                  (this.extra = 0),
                  (this.lencode = null),
                  (this.distcode = null),
                  (this.lenbits = 0),
                  (this.distbits = 0),
                  (this.ncode = 0),
                  (this.nlen = 0),
                  (this.ndist = 0),
                  (this.have = 0),
                  (this.next = null),
                  (this.lens = new r.Buf16(320)),
                  (this.work = new r.Buf16(288)),
                  (this.lendyn = null),
                  (this.distdyn = null),
                  (this.sane = 0),
                  (this.back = 0),
                  (this.was = 0);
              }
              function u(e) {
                var t;
                return e && e.state
                  ? ((t = e.state),
                    (e.total_in = e.total_out = t.total = 0),
                    (e.msg = ''),
                    t.wrap && (e.adler = 1 & t.wrap),
                    (t.mode = 1),
                    (t.last = 0),
                    (t.havedict = 0),
                    (t.dmax = 32768),
                    (t.head = null),
                    (t.hold = 0),
                    (t.bits = 0),
                    (t.lencode = t.lendyn = new r.Buf32(852)),
                    (t.distcode = t.distdyn = new r.Buf32(592)),
                    (t.sane = 1),
                    (t.back = -1),
                    0)
                  : l;
              }
              function c(e) {
                var t;
                return e && e.state
                  ? (((t = e.state).wsize = 0),
                    (t.whave = 0),
                    (t.wnext = 0),
                    u(e))
                  : l;
              }
              function h(e, t) {
                var n, r;
                return !e ||
                  !e.state ||
                  ((r = e.state),
                  t < 0
                    ? ((n = 0), (t = -t))
                    : ((n = 1 + (t >> 4)), t < 48 && (t &= 15)),
                  t && (t < 8 || 15 < t))
                  ? l
                  : (null !== r.window && r.wbits !== t && (r.window = null),
                    (r.wrap = n),
                    (r.wbits = t),
                    c(e));
              }
              function b(e, t) {
                var n;
                return e
                  ? ((n = new f()),
                    ((e.state = n).window = null),
                    0 !== (n = h(e, t)) && (e.state = null),
                    n)
                  : l;
              }
              var g,
                m,
                w = !0;
              function p(e, t, n, o) {
                var i;
                return (
                  null === (e = e.state).window &&
                    ((e.wsize = 1 << e.wbits),
                    (e.wnext = 0),
                    (e.whave = 0),
                    (e.window = new r.Buf8(e.wsize))),
                  o >= e.wsize
                    ? (r.arraySet(e.window, t, n - e.wsize, e.wsize, 0),
                      (e.wnext = 0),
                      (e.whave = e.wsize))
                    : (o < (i = e.wsize - e.wnext) && (i = o),
                      r.arraySet(e.window, t, n - o, i, e.wnext),
                      (o -= i)
                        ? (r.arraySet(e.window, t, n - o, o, 0),
                          (e.wnext = o),
                          (e.whave = e.wsize))
                        : ((e.wnext += i),
                          e.wnext === e.wsize && (e.wnext = 0),
                          e.whave < e.wsize && (e.whave += i))),
                  0
                );
              }
              (n.inflateReset = c),
                (n.inflateReset2 = h),
                (n.inflateResetKeep = u),
                (n.inflateInit = function (e) {
                  return b(e, 15);
                }),
                (n.inflateInit2 = b),
                (n.inflate = function (e, t) {
                  var n,
                    f,
                    u,
                    c,
                    h,
                    b,
                    v,
                    k,
                    y,
                    _,
                    x,
                    S,
                    E,
                    C,
                    U,
                    B,
                    L,
                    T,
                    R,
                    A,
                    O,
                    I,
                    P,
                    z,
                    F = 0,
                    N = new r.Buf8(4),
                    Z = [
                      16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14,
                      1, 15,
                    ];
                  if (
                    !e ||
                    !e.state ||
                    !e.output ||
                    (!e.input && 0 !== e.avail_in)
                  )
                    return l;
                  12 === (n = e.state).mode && (n.mode = 13),
                    (h = e.next_out),
                    (u = e.output),
                    (v = e.avail_out),
                    (c = e.next_in),
                    (f = e.input),
                    (b = e.avail_in),
                    (k = n.hold),
                    (y = n.bits),
                    (_ = b),
                    (x = v),
                    (I = 0);
                  e: for (;;)
                    switch (n.mode) {
                      case 1:
                        if (0 === n.wrap) n.mode = 13;
                        else {
                          for (; y < 16; ) {
                            if (0 === b) break e;
                            b--, (k += f[c++] << y), (y += 8);
                          }
                          if (2 & n.wrap && 35615 === k)
                            (N[(n.check = 0)] = 255 & k),
                              (N[1] = (k >>> 8) & 255),
                              (n.check = i(n.check, N, 2, 0)),
                              (y = k = 0),
                              (n.mode = 2);
                          else if (
                            ((n.flags = 0),
                            n.head && (n.head.done = !1),
                            !(1 & n.wrap) || (((255 & k) << 8) + (k >> 8)) % 31)
                          )
                            (e.msg = 'incorrect header check'), (n.mode = 30);
                          else if (8 != (15 & k))
                            (e.msg = 'unknown compression method'),
                              (n.mode = 30);
                          else {
                            if (
                              ((y -= 4),
                              (O = 8 + (15 & (k >>>= 4))),
                              0 === n.wbits)
                            )
                              n.wbits = O;
                            else if (O > n.wbits) {
                              (e.msg = 'invalid window size'), (n.mode = 30);
                              break;
                            }
                            (n.dmax = 1 << O),
                              (e.adler = n.check = 1),
                              (n.mode = 512 & k ? 10 : 12),
                              (y = k = 0);
                          }
                        }
                        break;
                      case 2:
                        for (; y < 16; ) {
                          if (0 === b) break e;
                          b--, (k += f[c++] << y), (y += 8);
                        }
                        if (((n.flags = k), 8 != (255 & n.flags))) {
                          (e.msg = 'unknown compression method'), (n.mode = 30);
                          break;
                        }
                        if (57344 & n.flags) {
                          (e.msg = 'unknown header flags set'), (n.mode = 30);
                          break;
                        }
                        n.head && (n.head.text = (k >> 8) & 1),
                          512 & n.flags &&
                            ((N[0] = 255 & k),
                            (N[1] = (k >>> 8) & 255),
                            (n.check = i(n.check, N, 2, 0))),
                          (y = k = 0),
                          (n.mode = 3);
                      case 3:
                        for (; y < 32; ) {
                          if (0 === b) break e;
                          b--, (k += f[c++] << y), (y += 8);
                        }
                        n.head && (n.head.time = k),
                          512 & n.flags &&
                            ((N[0] = 255 & k),
                            (N[1] = (k >>> 8) & 255),
                            (N[2] = (k >>> 16) & 255),
                            (N[3] = (k >>> 24) & 255),
                            (n.check = i(n.check, N, 4, 0))),
                          (y = k = 0),
                          (n.mode = 4);
                      case 4:
                        for (; y < 16; ) {
                          if (0 === b) break e;
                          b--, (k += f[c++] << y), (y += 8);
                        }
                        n.head &&
                          ((n.head.xflags = 255 & k), (n.head.os = k >> 8)),
                          512 & n.flags &&
                            ((N[0] = 255 & k),
                            (N[1] = (k >>> 8) & 255),
                            (n.check = i(n.check, N, 2, 0))),
                          (y = k = 0),
                          (n.mode = 5);
                      case 5:
                        if (1024 & n.flags) {
                          for (; y < 16; ) {
                            if (0 === b) break e;
                            b--, (k += f[c++] << y), (y += 8);
                          }
                          (n.length = k),
                            n.head && (n.head.extra_len = k),
                            512 & n.flags &&
                              ((N[0] = 255 & k),
                              (N[1] = (k >>> 8) & 255),
                              (n.check = i(n.check, N, 2, 0))),
                            (y = k = 0);
                        } else n.head && (n.head.extra = null);
                        n.mode = 6;
                      case 6:
                        if (
                          1024 & n.flags &&
                          ((S = b < (S = n.length) ? b : S) &&
                            (n.head &&
                              ((O = n.head.extra_len - n.length),
                              n.head.extra ||
                                (n.head.extra = new Array(n.head.extra_len)),
                              r.arraySet(n.head.extra, f, c, S, O)),
                            512 & n.flags && (n.check = i(n.check, f, S, c)),
                            (b -= S),
                            (c += S),
                            (n.length -= S)),
                          n.length)
                        )
                          break e;
                        (n.length = 0), (n.mode = 7);
                      case 7:
                        if (2048 & n.flags) {
                          if (0 === b) break e;
                          for (
                            S = 0;
                            (O = f[c + S++]),
                              n.head &&
                                O &&
                                n.length < 65536 &&
                                (n.head.name += String.fromCharCode(O)),
                              O && S < b;

                          );
                          if (
                            (512 & n.flags && (n.check = i(n.check, f, S, c)),
                            (b -= S),
                            (c += S),
                            O)
                          )
                            break e;
                        } else n.head && (n.head.name = null);
                        (n.length = 0), (n.mode = 8);
                      case 8:
                        if (4096 & n.flags) {
                          if (0 === b) break e;
                          for (
                            S = 0;
                            (O = f[c + S++]),
                              n.head &&
                                O &&
                                n.length < 65536 &&
                                (n.head.comment += String.fromCharCode(O)),
                              O && S < b;

                          );
                          if (
                            (512 & n.flags && (n.check = i(n.check, f, S, c)),
                            (b -= S),
                            (c += S),
                            O)
                          )
                            break e;
                        } else n.head && (n.head.comment = null);
                        n.mode = 9;
                      case 9:
                        if (512 & n.flags) {
                          for (; y < 16; ) {
                            if (0 === b) break e;
                            b--, (k += f[c++] << y), (y += 8);
                          }
                          if (k !== (65535 & n.check)) {
                            (e.msg = 'header crc mismatch'), (n.mode = 30);
                            break;
                          }
                          y = k = 0;
                        }
                        n.head &&
                          ((n.head.hcrc = (n.flags >> 9) & 1),
                          (n.head.done = !0)),
                          (e.adler = n.check = 0),
                          (n.mode = 12);
                        break;
                      case 10:
                        for (; y < 32; ) {
                          if (0 === b) break e;
                          b--, (k += f[c++] << y), (y += 8);
                        }
                        (e.adler = n.check = d(k)), (y = k = 0), (n.mode = 11);
                      case 11:
                        if (0 === n.havedict)
                          return (
                            (e.next_out = h),
                            (e.avail_out = v),
                            (e.next_in = c),
                            (e.avail_in = b),
                            (n.hold = k),
                            (n.bits = y),
                            2
                          );
                        (e.adler = n.check = 1), (n.mode = 12);
                      case 12:
                        if (5 === t || 6 === t) break e;
                      case 13:
                        if (n.last) (k >>>= 7 & y), (y -= 7 & y), (n.mode = 27);
                        else {
                          for (; y < 3; ) {
                            if (0 === b) break e;
                            b--, (k += f[c++] << y), (y += 8);
                          }
                          switch (((n.last = 1 & k), --y, 3 & (k >>>= 1))) {
                            case 0:
                              n.mode = 14;
                              break;
                            case 1:
                              var D = (H = void 0),
                                H = n;
                              if (w) {
                                for (
                                  g = new r.Buf32(512),
                                    m = new r.Buf32(32),
                                    D = 0;
                                  D < 144;

                                )
                                  H.lens[D++] = 8;
                                for (; D < 256; ) H.lens[D++] = 9;
                                for (; D < 280; ) H.lens[D++] = 7;
                                for (; D < 288; ) H.lens[D++] = 8;
                                for (
                                  s(1, H.lens, 0, 288, g, 0, H.work, {
                                    bits: 9,
                                  }),
                                    D = 0;
                                  D < 32;

                                )
                                  H.lens[D++] = 5;
                                s(2, H.lens, 0, 32, m, 0, H.work, { bits: 5 }),
                                  (w = !1);
                              }
                              if (
                                ((H.lencode = g),
                                (H.lenbits = 9),
                                (H.distcode = m),
                                (H.distbits = 5),
                                (n.mode = 20),
                                6 !== t)
                              )
                                break;
                              (k >>>= 2), (y -= 2);
                              break e;
                            case 2:
                              n.mode = 17;
                              break;
                            case 3:
                              (e.msg = 'invalid block type'), (n.mode = 30);
                          }
                          (k >>>= 2), (y -= 2);
                        }
                        break;
                      case 14:
                        for (k >>>= 7 & y, y -= 7 & y; y < 32; ) {
                          if (0 === b) break e;
                          b--, (k += f[c++] << y), (y += 8);
                        }
                        if ((65535 & k) != ((k >>> 16) ^ 65535)) {
                          (e.msg = 'invalid stored block lengths'),
                            (n.mode = 30);
                          break;
                        }
                        if (
                          ((n.length = 65535 & k),
                          (y = k = 0),
                          (n.mode = 15),
                          6 === t)
                        )
                          break e;
                      case 15:
                        n.mode = 16;
                      case 16:
                        if ((S = n.length)) {
                          if (0 === (S = v < (S = b < S ? b : S) ? v : S))
                            break e;
                          r.arraySet(u, f, c, S, h),
                            (b -= S),
                            (c += S),
                            (v -= S),
                            (h += S),
                            (n.length -= S);
                        } else n.mode = 12;
                        break;
                      case 17:
                        for (; y < 14; ) {
                          if (0 === b) break e;
                          b--, (k += f[c++] << y), (y += 8);
                        }
                        if (
                          ((n.nlen = 257 + (31 & k)),
                          (k >>>= 5),
                          (y -= 5),
                          (n.ndist = 1 + (31 & k)),
                          (k >>>= 5),
                          (y -= 5),
                          (n.ncode = 4 + (15 & k)),
                          (k >>>= 4),
                          (y -= 4),
                          286 < n.nlen || 30 < n.ndist)
                        ) {
                          (e.msg = 'too many length or distance symbols'),
                            (n.mode = 30);
                          break;
                        }
                        (n.have = 0), (n.mode = 18);
                      case 18:
                        for (; n.have < n.ncode; ) {
                          for (; y < 3; ) {
                            if (0 === b) break e;
                            b--, (k += f[c++] << y), (y += 8);
                          }
                          (n.lens[Z[n.have++]] = 7 & k), (k >>>= 3), (y -= 3);
                        }
                        for (; n.have < 19; ) n.lens[Z[n.have++]] = 0;
                        if (
                          ((n.lencode = n.lendyn),
                          (n.lenbits = 7),
                          (P = { bits: n.lenbits }),
                          (I = s(0, n.lens, 0, 19, n.lencode, 0, n.work, P)),
                          (n.lenbits = P.bits),
                          I)
                        ) {
                          (e.msg = 'invalid code lengths set'), (n.mode = 30);
                          break;
                        }
                        (n.have = 0), (n.mode = 19);
                      case 19:
                        for (; n.have < n.nlen + n.ndist; ) {
                          for (
                            ;
                            (B =
                              ((F = n.lencode[k & ((1 << n.lenbits) - 1)]) >>>
                                16) &
                              255),
                              (L = 65535 & F),
                              !((U = F >>> 24) <= y);

                          ) {
                            if (0 === b) break e;
                            b--, (k += f[c++] << y), (y += 8);
                          }
                          if (L < 16)
                            (k >>>= U), (y -= U), (n.lens[n.have++] = L);
                          else {
                            if (16 === L) {
                              for (z = U + 2; y < z; ) {
                                if (0 === b) break e;
                                b--, (k += f[c++] << y), (y += 8);
                              }
                              if (((k >>>= U), (y -= U), 0 === n.have)) {
                                (e.msg = 'invalid bit length repeat'),
                                  (n.mode = 30);
                                break;
                              }
                              (O = n.lens[n.have - 1]),
                                (S = 3 + (3 & k)),
                                (k >>>= 2),
                                (y -= 2);
                            } else if (17 === L) {
                              for (z = U + 3; y < z; ) {
                                if (0 === b) break e;
                                b--, (k += f[c++] << y), (y += 8);
                              }
                              (O = 0),
                                (S = 3 + (7 & (k >>>= U))),
                                (k >>>= 3),
                                (y = y - U - 3);
                            } else {
                              for (z = U + 7; y < z; ) {
                                if (0 === b) break e;
                                b--, (k += f[c++] << y), (y += 8);
                              }
                              (O = 0),
                                (S = 11 + (127 & (k >>>= U))),
                                (k >>>= 7),
                                (y = y - U - 7);
                            }
                            if (n.have + S > n.nlen + n.ndist) {
                              (e.msg = 'invalid bit length repeat'),
                                (n.mode = 30);
                              break;
                            }
                            for (; S--; ) n.lens[n.have++] = O;
                          }
                        }
                        if (30 === n.mode) break;
                        if (0 === n.lens[256]) {
                          (e.msg = 'invalid code -- missing end-of-block'),
                            (n.mode = 30);
                          break;
                        }
                        if (
                          ((n.lenbits = 9),
                          (P = { bits: n.lenbits }),
                          (I = s(
                            1,
                            n.lens,
                            0,
                            n.nlen,
                            n.lencode,
                            0,
                            n.work,
                            P
                          )),
                          (n.lenbits = P.bits),
                          I)
                        ) {
                          (e.msg = 'invalid literal/lengths set'),
                            (n.mode = 30);
                          break;
                        }
                        if (
                          ((n.distbits = 6),
                          (n.distcode = n.distdyn),
                          (P = { bits: n.distbits }),
                          (I = s(
                            2,
                            n.lens,
                            n.nlen,
                            n.ndist,
                            n.distcode,
                            0,
                            n.work,
                            P
                          )),
                          (n.distbits = P.bits),
                          I)
                        ) {
                          (e.msg = 'invalid distances set'), (n.mode = 30);
                          break;
                        }
                        if (((n.mode = 20), 6 === t)) break e;
                      case 20:
                        n.mode = 21;
                      case 21:
                        if (6 <= b && 258 <= v) {
                          (e.next_out = h),
                            (e.avail_out = v),
                            (e.next_in = c),
                            (e.avail_in = b),
                            (n.hold = k),
                            (n.bits = y),
                            a(e, x),
                            (h = e.next_out),
                            (u = e.output),
                            (v = e.avail_out),
                            (c = e.next_in),
                            (f = e.input),
                            (b = e.avail_in),
                            (k = n.hold),
                            (y = n.bits),
                            12 === n.mode && (n.back = -1);
                          break;
                        }
                        for (
                          n.back = 0;
                          (B =
                            ((F = n.lencode[k & ((1 << n.lenbits) - 1)]) >>>
                              16) &
                            255),
                            (L = 65535 & F),
                            !((U = F >>> 24) <= y);

                        ) {
                          if (0 === b) break e;
                          b--, (k += f[c++] << y), (y += 8);
                        }
                        if (B && 0 == (240 & B)) {
                          for (
                            T = U, R = B, A = L;
                            (B =
                              ((F =
                                n.lencode[
                                  A + ((k & ((1 << (T + R)) - 1)) >> T)
                                ]) >>>
                                16) &
                              255),
                              (L = 65535 & F),
                              !(T + (U = F >>> 24) <= y);

                          ) {
                            if (0 === b) break e;
                            b--, (k += f[c++] << y), (y += 8);
                          }
                          (k >>>= T), (y -= T), (n.back += T);
                        }
                        if (
                          ((k >>>= U),
                          (y -= U),
                          (n.back += U),
                          (n.length = L),
                          0 === B)
                        ) {
                          n.mode = 26;
                          break;
                        }
                        if (32 & B) {
                          (n.back = -1), (n.mode = 12);
                          break;
                        }
                        if (64 & B) {
                          (e.msg = 'invalid literal/length code'),
                            (n.mode = 30);
                          break;
                        }
                        (n.extra = 15 & B), (n.mode = 22);
                      case 22:
                        if (n.extra) {
                          for (z = n.extra; y < z; ) {
                            if (0 === b) break e;
                            b--, (k += f[c++] << y), (y += 8);
                          }
                          (n.length += k & ((1 << n.extra) - 1)),
                            (k >>>= n.extra),
                            (y -= n.extra),
                            (n.back += n.extra);
                        }
                        (n.was = n.length), (n.mode = 23);
                      case 23:
                        for (
                          ;
                          (B =
                            ((F = n.distcode[k & ((1 << n.distbits) - 1)]) >>>
                              16) &
                            255),
                            (L = 65535 & F),
                            !((U = F >>> 24) <= y);

                        ) {
                          if (0 === b) break e;
                          b--, (k += f[c++] << y), (y += 8);
                        }
                        if (0 == (240 & B)) {
                          for (
                            T = U, R = B, A = L;
                            (B =
                              ((F =
                                n.distcode[
                                  A + ((k & ((1 << (T + R)) - 1)) >> T)
                                ]) >>>
                                16) &
                              255),
                              (L = 65535 & F),
                              !(T + (U = F >>> 24) <= y);

                          ) {
                            if (0 === b) break e;
                            b--, (k += f[c++] << y), (y += 8);
                          }
                          (k >>>= T), (y -= T), (n.back += T);
                        }
                        if (((k >>>= U), (y -= U), (n.back += U), 64 & B)) {
                          (e.msg = 'invalid distance code'), (n.mode = 30);
                          break;
                        }
                        (n.offset = L), (n.extra = 15 & B), (n.mode = 24);
                      case 24:
                        if (n.extra) {
                          for (z = n.extra; y < z; ) {
                            if (0 === b) break e;
                            b--, (k += f[c++] << y), (y += 8);
                          }
                          (n.offset += k & ((1 << n.extra) - 1)),
                            (k >>>= n.extra),
                            (y -= n.extra),
                            (n.back += n.extra);
                        }
                        if (n.offset > n.dmax) {
                          (e.msg = 'invalid distance too far back'),
                            (n.mode = 30);
                          break;
                        }
                        n.mode = 25;
                      case 25:
                        if (0 === v) break e;
                        if (n.offset > (S = x - v)) {
                          if ((S = n.offset - S) > n.whave && n.sane) {
                            (e.msg = 'invalid distance too far back'),
                              (n.mode = 30);
                            break;
                          }
                          (E =
                            S > n.wnext
                              ? ((S -= n.wnext), n.wsize - S)
                              : n.wnext - S),
                            S > n.length && (S = n.length),
                            (C = n.window);
                        } else (C = u), (E = h - n.offset), (S = n.length);
                        for (
                          v -= S = v < S ? v : S, n.length -= S;
                          (u[h++] = C[E++]), --S;

                        );
                        0 === n.length && (n.mode = 21);
                        break;
                      case 26:
                        if (0 === v) break e;
                        (u[h++] = n.length), v--, (n.mode = 21);
                        break;
                      case 27:
                        if (n.wrap) {
                          for (; y < 32; ) {
                            if (0 === b) break e;
                            b--, (k |= f[c++] << y), (y += 8);
                          }
                          if (
                            ((x -= v),
                            (e.total_out += x),
                            (n.total += x),
                            x &&
                              (e.adler = n.check =
                                (n.flags ? i : o)(n.check, u, x, h - x)),
                            (x = v),
                            (n.flags ? k : d(k)) !== n.check)
                          ) {
                            (e.msg = 'incorrect data check'), (n.mode = 30);
                            break;
                          }
                          y = k = 0;
                        }
                        n.mode = 28;
                      case 28:
                        if (n.wrap && n.flags) {
                          for (; y < 32; ) {
                            if (0 === b) break e;
                            b--, (k += f[c++] << y), (y += 8);
                          }
                          if (k !== (4294967295 & n.total)) {
                            (e.msg = 'incorrect length check'), (n.mode = 30);
                            break;
                          }
                          y = k = 0;
                        }
                        n.mode = 29;
                      case 29:
                        I = 1;
                        break e;
                      case 30:
                        I = -3;
                        break e;
                      case 31:
                        return -4;
                      default:
                        return l;
                    }
                  return (
                    (e.next_out = h),
                    (e.avail_out = v),
                    (e.next_in = c),
                    (e.avail_in = b),
                    (n.hold = k),
                    (n.bits = y),
                    (n.wsize ||
                      (x !== e.avail_out &&
                        n.mode < 30 &&
                        (n.mode < 27 || 4 !== t))) &&
                    p(e, e.output, e.next_out, x - e.avail_out)
                      ? ((n.mode = 31), -4)
                      : ((_ -= e.avail_in),
                        (x -= e.avail_out),
                        (e.total_in += _),
                        (e.total_out += x),
                        (n.total += x),
                        n.wrap &&
                          x &&
                          (e.adler = n.check =
                            (n.flags ? i : o)(n.check, u, x, e.next_out - x)),
                        (e.data_type =
                          n.bits +
                          (n.last ? 64 : 0) +
                          (12 === n.mode ? 128 : 0) +
                          (20 === n.mode || 15 === n.mode ? 256 : 0)),
                        ((0 == _ && 0 === x) || 4 === t) && 0 === I ? -5 : I)
                  );
                }),
                (n.inflateEnd = function (e) {
                  var t;
                  return e && e.state
                    ? ((t = e.state).window && (t.window = null),
                      (e.state = null),
                      0)
                    : l;
                }),
                (n.inflateGetHeader = function (e, t) {
                  return e && e.state && 0 != (2 & (e = e.state).wrap)
                    ? (((e.head = t).done = !1), 0)
                    : l;
                }),
                (n.inflateSetDictionary = function (e, t) {
                  var n,
                    r = t.length;
                  return !e ||
                    !e.state ||
                    (0 !== (n = e.state).wrap && 11 !== n.mode)
                    ? l
                    : 11 === n.mode && o(1, t, r, 0) !== n.check
                    ? -3
                    : p(e, t, r, r)
                    ? ((n.mode = 31), -4)
                    : ((n.havedict = 1), 0);
                }),
                (n.inflateInfo = 'pako inflate (from Nodeca project)');
            },
            'zlib/constants.js': function (e, t, n) {
              'use strict';
              t.exports = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8,
              };
            },
            'zlib/messages.js': function (e, t, n) {
              'use strict';
              t.exports = {
                2: 'need dictionary',
                1: 'stream end',
                0: '',
                '-1': 'file error',
                '-2': 'stream error',
                '-3': 'data error',
                '-4': 'insufficient memory',
                '-5': 'buffer error',
                '-6': 'incompatible version',
              };
            },
            'zlib/zstream.js': function (e, t, n) {
              'use strict';
              t.exports = function () {
                (this.input = null),
                  (this.next_in = 0),
                  (this.avail_in = 0),
                  (this.total_in = 0),
                  (this.output = null),
                  (this.next_out = 0),
                  (this.avail_out = 0),
                  (this.total_out = 0),
                  (this.msg = ''),
                  (this.state = null),
                  (this.data_type = 2),
                  (this.adler = 0);
              };
            },
            'zlib/gzheader.js': function (e, t, n) {
              'use strict';
              t.exports = function () {
                (this.text = 0),
                  (this.time = 0),
                  (this.xflags = 0),
                  (this.os = 0),
                  (this.extra = null),
                  (this.extra_len = 0),
                  (this.name = ''),
                  (this.comment = ''),
                  (this.hcrc = 0),
                  (this.done = !1);
              };
            },
            'zlib/adler32.js': function (e, t, n) {
              'use strict';
              t.exports = function (e, t, n, r) {
                for (
                  var o = (65535 & e) | 0, i = ((e >>> 16) & 65535) | 0, a = 0;
                  0 !== n;

                ) {
                  for (
                    n -= a = 2e3 < n ? 2e3 : n;
                    (i = (i + (o = (o + t[r++]) | 0)) | 0), --a;

                  );
                  (o %= 65521), (i %= 65521);
                }
                return o | (i << 16) | 0;
              };
            },
            'zlib/crc32.js': function (e, t, n) {
              'use strict';
              var r = (function () {
                for (var e = [], t = 0; t < 256; t++) {
                  for (var n = t, r = 0; r < 8; r++)
                    n = 1 & n ? 3988292384 ^ (n >>> 1) : n >>> 1;
                  e[t] = n;
                }
                return e;
              })();
              t.exports = function (e, t, n, o) {
                var i = r,
                  a = o + n;
                e ^= -1;
                for (var s = o; s < a; s++) e = (e >>> 8) ^ i[255 & (e ^ t[s])];
                return -1 ^ e;
              };
            },
            'zlib/inffast.js': function (e, t, n) {
              'use strict';
              t.exports = function (e, t) {
                var n,
                  r,
                  o,
                  i,
                  a,
                  s,
                  l = e.state,
                  d = e.next_in,
                  f = e.input,
                  u = d + (e.avail_in - 5),
                  c = e.next_out,
                  h = e.output,
                  b = c - (t - e.avail_out),
                  g = c + (e.avail_out - 257),
                  m = l.dmax,
                  w = l.wsize,
                  p = l.whave,
                  v = l.wnext,
                  k = l.window,
                  y = l.hold,
                  _ = l.bits,
                  x = l.lencode,
                  S = l.distcode,
                  E = (1 << l.lenbits) - 1,
                  C = (1 << l.distbits) - 1;
                e: do {
                  for (
                    _ < 15 &&
                      ((y += f[d++] << _),
                      (_ += 8),
                      (y += f[d++] << _),
                      (_ += 8)),
                      n = x[y & E];
                    ;

                  ) {
                    if (
                      ((y >>>= r = n >>> 24),
                      (_ -= r),
                      0 == (r = (n >>> 16) & 255))
                    )
                      h[c++] = 65535 & n;
                    else {
                      if (!(16 & r)) {
                        if (0 == (64 & r)) {
                          n = x[(65535 & n) + (y & ((1 << r) - 1))];
                          continue;
                        }
                        if (32 & r) {
                          l.mode = 12;
                          break e;
                        }
                        (e.msg = 'invalid literal/length code'), (l.mode = 30);
                        break e;
                      }
                      for (
                        o = 65535 & n,
                          (r &= 15) &&
                            (_ < r && ((y += f[d++] << _), (_ += 8)),
                            (o += y & ((1 << r) - 1)),
                            (y >>>= r),
                            (_ -= r)),
                          _ < 15 &&
                            ((y += f[d++] << _),
                            (_ += 8),
                            (y += f[d++] << _),
                            (_ += 8)),
                          n = S[y & C];
                        ;

                      ) {
                        if (
                          ((y >>>= r = n >>> 24),
                          (_ -= r),
                          !(16 & (r = (n >>> 16) & 255)))
                        ) {
                          if (0 == (64 & r)) {
                            n = S[(65535 & n) + (y & ((1 << r) - 1))];
                            continue;
                          }
                          (e.msg = 'invalid distance code'), (l.mode = 30);
                          break e;
                        }
                        if (
                          ((i = 65535 & n),
                          _ < (r &= 15) &&
                            ((y += f[d++] << _),
                            (_ += 8) < r && ((y += f[d++] << _), (_ += 8))),
                          m < (i += y & ((1 << r) - 1)))
                        ) {
                          (e.msg = 'invalid distance too far back'),
                            (l.mode = 30);
                          break e;
                        }
                        if (((y >>>= r), (_ -= r), (r = c - b) < i)) {
                          if (p < (r = i - r) && l.sane) {
                            (e.msg = 'invalid distance too far back'),
                              (l.mode = 30);
                            break e;
                          }
                          if (((s = k), (a = 0) === v)) {
                            if (((a += w - r), r < o)) {
                              for (o -= r; (h[c++] = k[a++]), --r; );
                              (a = c - i), (s = h);
                            }
                          } else if (v < r) {
                            if (((a += w + v - r), (r -= v) < o)) {
                              for (o -= r; (h[c++] = k[a++]), --r; );
                              if (((a = 0), v < o)) {
                                for (o -= r = v; (h[c++] = k[a++]), --r; );
                                (a = c - i), (s = h);
                              }
                            }
                          } else if (((a += v - r), r < o)) {
                            for (o -= r; (h[c++] = k[a++]), --r; );
                            (a = c - i), (s = h);
                          }
                          for (; 2 < o; )
                            (h[c++] = s[a++]),
                              (h[c++] = s[a++]),
                              (h[c++] = s[a++]),
                              (o -= 3);
                          o && ((h[c++] = s[a++]), 1 < o && (h[c++] = s[a++]));
                        } else {
                          for (
                            a = c - i;
                            (h[c++] = h[a++]),
                              (h[c++] = h[a++]),
                              (h[c++] = h[a++]),
                              2 < (o -= 3);

                          );
                          o && ((h[c++] = h[a++]), 1 < o && (h[c++] = h[a++]));
                        }
                        break;
                      }
                    }
                    break;
                  }
                } while (d < u && c < g);
                (y &= (1 << (_ -= (o = _ >> 3) << 3)) - 1),
                  (e.next_in = d -= o),
                  (e.next_out = c),
                  (e.avail_in = d < u ? u - d + 5 : 5 - (d - u)),
                  (e.avail_out = c < g ? g - c + 257 : 257 - (c - g)),
                  (l.hold = y),
                  (l.bits = _);
              };
            },
            'zlib/inftrees.js': function (e, t, n) {
              'use strict';
              var r = e('../utils/common'),
                o = [
                  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35,
                  43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
                ],
                i = [
                  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18,
                  18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72,
                  78,
                ],
                a = [
                  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
                  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193,
                  12289, 16385, 24577, 0, 0,
                ],
                s = [
                  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22,
                  22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29,
                  64, 64,
                ];
              t.exports = function (e, t, n, l, d, f, u, c) {
                var h,
                  b,
                  g,
                  m,
                  w,
                  p,
                  v,
                  k,
                  y,
                  _ = c.bits,
                  x = 0,
                  S = 0,
                  E = 0,
                  C = 0,
                  U = 0,
                  B = 0,
                  L = 0,
                  T = 0,
                  R = 0,
                  A = 0,
                  O = null,
                  I = 0,
                  P = new r.Buf16(16),
                  z = new r.Buf16(16),
                  F = null,
                  N = 0;
                for (x = 0; x <= 15; x++) P[x] = 0;
                for (S = 0; S < l; S++) P[t[n + S]]++;
                for (U = _, C = 15; 1 <= C && 0 === P[C]; C--);
                if ((C < U && (U = C), 0 === C))
                  (d[f++] = 20971520), (d[f++] = 20971520), (c.bits = 1);
                else {
                  for (E = 1; E < C && 0 === P[E]; E++);
                  for (U < E && (U = E), x = T = 1; x <= 15; x++)
                    if ((T = (T <<= 1) - P[x]) < 0) return -1;
                  if (0 < T && (0 === e || 1 !== C)) return -1;
                  for (z[1] = 0, x = 1; x < 15; x++) z[x + 1] = z[x] + P[x];
                  for (S = 0; S < l; S++)
                    0 !== t[n + S] && (u[z[t[n + S]]++] = S);
                  if (
                    ((p =
                      0 === e
                        ? ((O = F = u), 19)
                        : 1 === e
                        ? ((O = o), (I -= 257), (F = i), (N -= 257), 256)
                        : ((O = a), (F = s), -1)),
                    (x = E),
                    (w = f),
                    (L = S = A = 0),
                    (g = -1),
                    (m = (R = 1 << (B = U)) - 1),
                    (1 === e && 852 < R) || (2 === e && 592 < R))
                  )
                    return 1;
                  for (;;) {
                    for (
                      y =
                        u[S] < p
                          ? ((k = 0), u[S])
                          : u[S] > p
                          ? ((k = F[N + u[S]]), O[I + u[S]])
                          : ((k = 96), 0),
                        h = 1 << (v = x - L),
                        E = b = 1 << B;
                      (d[w + (A >> L) + (b -= h)] =
                        (v << 24) | (k << 16) | y | 0),
                        0 !== b;

                    );
                    for (h = 1 << (x - 1); A & h; ) h >>= 1;
                    if (
                      ((A = 0 !== h ? (A & (h - 1)) + h : 0), S++, 0 == --P[x])
                    ) {
                      if (x === C) break;
                      x = t[n + u[S]];
                    }
                    if (U < x && (A & m) !== g) {
                      for (
                        w += E, T = 1 << (B = x - (L = 0 === L ? U : L));
                        B + L < C && !((T -= P[B + L]) <= 0);

                      )
                        B++, (T <<= 1);
                      if (
                        ((R += 1 << B),
                        (1 === e && 852 < R) || (2 === e && 592 < R))
                      )
                        return 1;
                      d[(g = A & m)] = (U << 24) | (B << 16) | (w - f) | 0;
                    }
                  }
                  0 !== A && (d[w + A] = ((x - L) << 24) | (64 << 16) | 0),
                    (c.bits = U);
                }
                return 0;
              };
            },
          };
        for (t in n) n[t].folder = t.substring(0, t.lastIndexOf('/') + 1);
        var r = function (e) {
            var t = [];
            return (e = e.split('/').every(function (e) {
              return '..' == e ? t.pop() : '.' == e || '' == e || t.push(e);
            })
              ? t.join('/')
              : null)
              ? n[e] || n[e + '.js'] || n[e + '/index.js']
              : null;
          },
          o = function (e, t) {
            return e
              ? r(e.folder + 'node_modules/' + t) || o(e.parent, t)
              : null;
          };
        return (function e(t, n) {
          var i = n.match(/^\//)
            ? null
            : t
            ? n.match(/^\.\.?\//)
              ? r(t.folder + n)
              : o(t, n)
            : r(n);
          if (i)
            return (
              i.exports ||
                ((i.parent = t), i(e.bind(null, i), i, (i.exports = {}))),
              i.exports
            );
          throw 'module not found: ' + n;
        })(null, e);
      },
      decompress: function (e) {
        this.exports || (this.exports = this.require('inflate.js'));
        try {
          return this.exports.inflate(e);
        } catch (e) {}
      },
      hasUnityMarker: function (e) {
        var t = 10,
          n = 'UnityWeb Compressed Content (gzip)';
        if (t > e.length || 31 != e[0] || 139 != e[1]) return !1;
        var r = e[3];
        if (4 & r) {
          if (t + 2 > e.length) return !1;
          if ((t += 2 + e[t] + (e[t + 1] << 8)) > e.length) return !1;
        }
        if (8 & r) {
          for (; t < e.length && e[t]; ) t++;
          if (t + 1 > e.length) return !1;
          t++;
        }
        return (
          16 & r &&
          String.fromCharCode.apply(null, e.subarray(t, t + n.length + 1)) ==
            n + '\0'
        );
      },
    },
  };
  function m(e) {
    b(e);
    var t = s.fetchWithProgress,
      n = s[e];
    return (
      (n = /file:\/\//.exec(n) ? 'same-origin' : void 0),
      t(s[e], {
        method: 'GET',
        companyName: s.companyName,
        productName: s.productName,
        control: 'no-store',
        mode: n,
        onProgress: function (t) {
          b(e, t);
        },
      })
        .then(function (t) {
          return (
            (n = t.parsedBody),
            (r = s[e]),
            new Promise(function (e, t) {
              try {
                for (var o in g) {
                  var i, a, s;
                  if (g[o].hasUnityMarker(n))
                    return (
                      r &&
                        console.log(
                          'You can reduce startup time if you configure your web server to add "Content-Encoding: ' +
                            o +
                            '" response header when serving "' +
                            r +
                            '" file.'
                        ),
                      (i = g[o]).worker ||
                        ((a = URL.createObjectURL(
                          new Blob(
                            [
                              'this.require = ',
                              i.require.toString(),
                              '; this.decompress = ',
                              i.decompress.toString(),
                              '; this.onmessage = ',
                              function (e) {
                                (e = {
                                  id: e.data.id,
                                  decompressed: this.decompress(
                                    e.data.compressed
                                  ),
                                }),
                                  postMessage(
                                    e,
                                    e.decompressed
                                      ? [e.decompressed.buffer]
                                      : []
                                  );
                              }.toString(),
                              '; postMessage({ ready: true });',
                            ],
                            { type: 'application/javascript' }
                          )
                        )),
                        (i.worker = new Worker(a)),
                        (i.worker.onmessage = function (e) {
                          e.data.ready
                            ? URL.revokeObjectURL(a)
                            : (this.callbacks[e.data.id](e.data.decompressed),
                              delete this.callbacks[e.data.id]);
                        }),
                        (i.worker.callbacks = {}),
                        (i.worker.nextCallbackId = 0)),
                      (s = i.worker.nextCallbackId++),
                      (i.worker.callbacks[s] = e),
                      void i.worker.postMessage({ id: s, compressed: n }, [
                        n.buffer,
                      ])
                    );
                }
                e(n);
              } catch (e) {
                t(e);
              }
            })
          );
          var n, r;
        })
        .catch(function (t) {
          var n = 'Failed to download file ' + s[e];
          'file:' == location.protocol
            ? r(
                n +
                  '. Loading web pages via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host Unity content, or use the Unity Build and Run option.',
                'error'
              )
            : console.error(n);
        })
    );
  }
  return new Promise(function (e, t) {
    s.SystemInfo.hasWebGL
      ? s.SystemInfo.hasWasm
        ? (1 == s.SystemInfo.hasWebGL &&
            s.print(
              'Warning: Your browser does not support "WebGL 2" Graphics API, switching to "WebGL 1"'
            ),
          (s.startupErrorHandler = t),
          n(0),
          s.postRun.push(function () {
            n(1), delete s.startupErrorHandler, e(c);
          }),
          (function () {
            Promise.all([
              m('frameworkUrl').then(function (e) {
                var t = URL.createObjectURL(
                  new Blob([e], { type: 'application/javascript' })
                );
                return new Promise(function (e, n) {
                  var o = document.createElement('script');
                  (o.src = t),
                    (o.onload = function () {
                      if (
                        'undefined' == typeof unityFramework ||
                        !unityFramework
                      ) {
                        var n,
                          i = [
                            ['br', 'br'],
                            ['gz', 'gzip'],
                          ];
                        for (n in i) {
                          var a,
                            l = i[n];
                          if (s.frameworkUrl.endsWith('.' + l[0]))
                            return (
                              (a = 'Unable to parse ' + s.frameworkUrl + '!'),
                              'file:' == location.protocol
                                ? void r(
                                    a +
                                      ' Loading pre-compressed (brotli or gzip) content via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host compressed Unity content, or use the Unity Build and Run option.',
                                    'error'
                                  )
                                : ((a +=
                                    ' This can happen if build compression was enabled but web server hosting the content was misconfigured to not serve the file with HTTP Response Header "Content-Encoding: ' +
                                    l[1] +
                                    '" present. Check browser Console and Devtools Network tab to debug.'),
                                  'br' == l[0] &&
                                    'http:' == location.protocol &&
                                    ((l =
                                      -1 !=
                                      ['localhost', '127.0.0.1'].indexOf(
                                        location.hostname
                                      )
                                        ? ''
                                        : 'Migrate your server to use HTTPS.'),
                                    (a = /Firefox/.test(navigator.userAgent)
                                      ? 'Unable to parse ' +
                                        s.frameworkUrl +
                                        '!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported in Firefox over HTTP connections. ' +
                                        l +
                                        ' See <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1670675">https://bugzilla.mozilla.org/show_bug.cgi?id=1670675</a> for more information.'
                                      : 'Unable to parse ' +
                                        s.frameworkUrl +
                                        '!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported over HTTP connections. Migrate your server to use HTTPS.')),
                                  void r(a, 'error'))
                            );
                        }
                        r(
                          'Unable to parse ' +
                            s.frameworkUrl +
                            '! The file is corrupt, or compression was misconfigured? (check Content-Encoding HTTP Response Header on web server)',
                          'error'
                        );
                      }
                      var d = unityFramework;
                      (unityFramework = null),
                        (o.onload = null),
                        URL.revokeObjectURL(t),
                        e(d);
                    }),
                    (o.onerror = function (e) {
                      r(
                        'Unable to load file ' +
                          s.frameworkUrl +
                          '! Check that the file exists on the remote server. (also check browser Console and Devtools Network tab to debug)',
                        'error'
                      );
                    }),
                    document.body.appendChild(o),
                    s.deinitializers.push(function () {
                      document.body.removeChild(o);
                    });
                });
              }),
              m('codeUrl'),
            ]).then(function (e) {
              (s.wasmBinary = e[1]), e[0](s);
            });
            var e = m('dataUrl');
            s.preRun.push(function () {
              s.addRunDependency('dataUrl'),
                e.then(function (e) {
                  var t = new DataView(e.buffer, e.byteOffset, e.byteLength),
                    n = 0,
                    r = 'UnityWebData1.0\0';
                  if (
                    !String.fromCharCode.apply(
                      null,
                      e.subarray(n, n + r.length)
                    ) == r
                  )
                    throw 'unknown data format';
                  var o = t.getUint32((n += r.length), !0);
                  for (n += 4; n < o; ) {
                    var i = t.getUint32(n, !0),
                      a = ((n += 4), t.getUint32(n, !0)),
                      l = ((n += 4), t.getUint32(n, !0)),
                      d =
                        ((n += 4),
                        String.fromCharCode.apply(null, e.subarray(n, n + l)));
                    n += l;
                    for (
                      var f = 0, u = d.indexOf('/', f) + 1;
                      0 < u;
                      f = u, u = d.indexOf('/', f) + 1
                    )
                      s.FS_createPath(
                        d.substring(0, f),
                        d.substring(f, u - 1),
                        !0,
                        !0
                      );
                    s.FS_createDataFile(
                      d,
                      null,
                      e.subarray(i, i + a),
                      !0,
                      !0,
                      !0
                    );
                  }
                  s.removeRunDependency('dataUrl');
                });
            });
          })())
        : t('Your browser does not support WebAssembly.')
      : t('Your browser does not support WebGL.');
  });
}
