(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.initGoCart = factory());
})(this, (function () { 'use strict';

  function _regeneratorRuntime() {
    _regeneratorRuntime = function () {
      return exports;
    };
    var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      defineProperty = Object.defineProperty || function (obj, key, desc) {
        obj[key] = desc.value;
      },
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    function define(obj, key, value) {
      return Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), obj[key];
    }
    try {
      define({}, "");
    } catch (err) {
      define = function (obj, key, value) {
        return obj[key] = value;
      };
    }
    function wrap(innerFn, outerFn, self, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
      return defineProperty(generator, "_invoke", {
        value: makeInvokeMethod(innerFn, self, context)
      }), generator;
    }
    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }
    exports.wrap = wrap;
    var ContinueSentinel = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });
    var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }
    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if ("throw" !== record.type) {
          var result = record.arg,
            value = result.value;
          return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          }) : PromiseImpl.resolve(value).then(function (unwrapped) {
            result.value = unwrapped, resolve(result);
          }, function (error) {
            return invoke("throw", error, resolve, reject);
          });
        }
        reject(record.arg);
      }
      var previousPromise;
      defineProperty(this, "_invoke", {
        value: function (method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }
          return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");
        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }
        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }
          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);
          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }
          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }
    function maybeInvokeDelegate(delegate, context) {
      var methodName = context.method,
        method = delegate.iterator[methodName];
      if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
      var record = tryCatch(method, delegate.iterator, context.arg);
      if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
      var info = record.arg;
      return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
    }
    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };
      1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
    }
    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal", delete record.arg, entry.completion = record;
    }
    function Context(tryLocsList) {
      this.tryEntries = [{
        tryLoc: "root"
      }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) return iteratorMethod.call(iterable);
        if ("function" == typeof iterable.next) return iterable;
        if (!isNaN(iterable.length)) {
          var i = -1,
            next = function next() {
              for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
              return next.value = undefined, next.done = !0, next;
            };
          return next.next = next;
        }
      }
      return {
        next: doneResult
      };
    }
    function doneResult() {
      return {
        value: undefined,
        done: !0
      };
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0
    }), defineProperty(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
      var ctor = "function" == typeof genFun && genFun.constructor;
      return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
    }, exports.mark = function (genFun) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
    }, exports.awrap = function (arg) {
      return {
        __await: arg
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      void 0 === PromiseImpl && (PromiseImpl = Promise);
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
      return this;
    }), define(Gp, "toString", function () {
      return "[object Generator]";
    }), exports.keys = function (val) {
      var object = Object(val),
        keys = [];
      for (var key in object) keys.push(key);
      return keys.reverse(), function next() {
        for (; keys.length;) {
          var key = keys.pop();
          if (key in object) return next.value = key, next.done = !1, next;
        }
        return next.done = !0, next;
      };
    }, exports.values = values, Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      },
      stop: function () {
        this.done = !0;
        var rootRecord = this.tryEntries[0].completion;
        if ("throw" === rootRecord.type) throw rootRecord.arg;
        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) throw exception;
        var context = this;
        function handle(loc, caught) {
          return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i],
            record = entry.completion;
          if ("root" === entry.tryLoc) return handle("end");
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            } else {
              if (!hasFinally) throw new Error("try statement without catch or finally");
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }
        finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
        var record = finallyEntry ? finallyEntry.completion : {};
        return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
      },
      complete: function (record, afterLoc) {
        if ("throw" === record.type) throw record.arg;
        return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
        }
      },
      catch: function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if ("throw" === record.type) {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        return this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
      }
    }, exports;
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
        args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var GoCart = function () {
    var _scriptDir = (typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('go-cart.js', document.baseURI).href));
    return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var GoCart,
        Module,
        readyPromiseResolve,
        readyPromiseReject,
        moduleOverrides,
        quit_,
        ENVIRONMENT_IS_WEB,
        ENVIRONMENT_IS_WORKER,
        ENVIRONMENT_IS_NODE,
        scriptDirectory,
        locateFile,
        read_,
        readAsync,
        readBinary,
        _yield$import,
        createRequire,
        require$1,
        fs,
        nodePath,
        out,
        err,
        wasmBinary,
        noExitRuntime,
        wasmMemory,
        ABORT,
        assert,
        HEAP8,
        HEAPU8,
        HEAP16,
        HEAPU16,
        HEAP32,
        HEAPU32,
        HEAPF32,
        HEAPF64,
        updateMemoryViews,
        __ATPRERUN__,
        __ATINIT__,
        __ATPOSTRUN__,
        runtimeKeepaliveCounter,
        keepRuntimeAlive,
        preRun,
        initRuntime,
        postRun,
        addOnPreRun,
        addOnInit,
        addOnPostRun,
        runDependencies,
        runDependencyWatcher,
        dependenciesFulfilled,
        getUniqueRunDependency,
        addRunDependency,
        removeRunDependency,
        abort,
        dataURIPrefix,
        isDataURI,
        isFileURI,
        wasmBinaryFile,
        getBinary,
        getBinaryPromise,
        instantiateArrayBuffer,
        instantiateAsync,
        createWasm,
        tempDouble,
        tempI64,
        ExitStatus,
        callRuntimeCallbacks,
        setErrNo,
        PATH,
        initRandomFill,
        randomFill,
        PATH_FS,
        lengthBytesUTF8,
        stringToUTF8Array,
        intArrayFromString,
        UTF8Decoder,
        UTF8ArrayToString,
        TTY,
        mmapAlloc,
        MEMFS,
        asyncLoad,
        preloadPlugins,
        FS_handledByPreloadPlugin,
        FS_createPreloadedFile,
        FS_modeStringToFlags,
        FS_getMode,
        FS,
        UTF8ToString,
        SYSCALLS,
        ___syscall_fcntl64,
        ___syscall_ioctl,
        ___syscall_openat,
        __embind_register_bigint,
        getShiftFromSize,
        embind_init_charCodes,
        embind_charCodes,
        readLatin1String,
        awaitingDependencies,
        registeredTypes,
        typeDependencies,
        char_0,
        char_9,
        makeLegalFunctionName,
        createNamedFunction,
        extendError,
        BindingError,
        throwBindingError,
        registerType,
        __embind_register_bool,
        HandleAllocator,
        emval_handles,
        __emval_decref,
        count_emval_handles,
        init_emval,
        Emval,
        simpleReadValueFromPointer,
        __embind_register_emval,
        floatReadValueFromPointer,
        __embind_register_float,
        integerReadValueFromPointer,
        __embind_register_integer,
        __embind_register_memory_view,
        stringToUTF8,
        __embind_register_std_string,
        UTF16Decoder,
        UTF16ToString,
        stringToUTF16,
        lengthBytesUTF16,
        UTF32ToString,
        stringToUTF32,
        lengthBytesUTF32,
        __embind_register_std_wstring,
        __embind_register_void,
        nowIsMonotonic,
        __emscripten_get_now_is_monotonic,
        _abort,
        _emscripten_date_now,
        _emscripten_memcpy_big,
        getHeapMax,
        emscripten_realloc_buffer,
        _emscripten_resize_heap,
        _proc_exit,
        exitJS,
        _exit,
        _fd_close,
        doReadv,
        _fd_read,
        convertI32PairToI53Checked,
        _fd_seek,
        doWritev,
        _fd_write,
        getCFunc,
        writeArrayToMemory,
        stringToUTF8OnStack,
        ccall,
        FSNode,
        readMode,
        writeMode,
        wasmImports,
        _malloc2,
        _free2,
        _errno_location,
        _stackSave,
        _stackRestore,
        _stackAlloc,
        calledRun,
        run,
        _args = arguments;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              run = function _run() {
                if (runDependencies > 0) {
                  return;
                }
                preRun();
                if (runDependencies > 0) {
                  return;
                }
                function doRun() {
                  if (calledRun) return;
                  calledRun = true;
                  Module["calledRun"] = true;
                  if (ABORT) return;
                  initRuntime();
                  readyPromiseResolve(Module);
                  if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
                  postRun();
                }
                if (Module["setStatus"]) {
                  Module["setStatus"]("Running...");
                  setTimeout(function () {
                    setTimeout(function () {
                      Module["setStatus"]("");
                    }, 1);
                    doRun();
                  }, 1);
                } else {
                  doRun();
                }
              };
              ccall = function _ccall(ident, returnType, argTypes, args, opts) {
                var toC = {
                  "string": function string(str) {
                    var ret = 0;
                    if (str !== null && str !== undefined && str !== 0) {
                      ret = stringToUTF8OnStack(str);
                    }
                    return ret;
                  },
                  "array": function array(arr) {
                    var ret = _stackAlloc(arr.length);
                    writeArrayToMemory(arr, ret);
                    return ret;
                  }
                };
                function convertReturnValue(ret) {
                  if (returnType === "string") {
                    return UTF8ToString(ret);
                  }
                  if (returnType === "boolean") return Boolean(ret);
                  return ret;
                }
                var func = getCFunc(ident);
                var cArgs = [];
                var stack = 0;
                if (args) {
                  for (var i = 0; i < args.length; i++) {
                    var converter = toC[argTypes[i]];
                    if (converter) {
                      if (stack === 0) stack = _stackSave();
                      cArgs[i] = converter(args[i]);
                    } else {
                      cArgs[i] = args[i];
                    }
                  }
                }
                var ret = func.apply(null, cArgs);
                function onDone(ret) {
                  if (stack !== 0) _stackRestore(stack);
                  return convertReturnValue(ret);
                }
                ret = onDone(ret);
                return ret;
              };
              stringToUTF8OnStack = function _stringToUTF8OnStack(str) {
                var size = lengthBytesUTF8(str) + 1;
                var ret = _stackAlloc(size);
                stringToUTF8(str, ret, size);
                return ret;
              };
              writeArrayToMemory = function _writeArrayToMemory(array, buffer) {
                HEAP8.set(array, buffer);
              };
              getCFunc = function _getCFunc(ident) {
                var func = Module["_" + ident];
                return func;
              };
              _fd_write = function _fd_write2(fd, iov, iovcnt, pnum) {
                try {
                  var stream = SYSCALLS.getStreamFromFD(fd);
                  var num = doWritev(stream, iov, iovcnt);
                  HEAPU32[pnum >> 2] = num;
                  return 0;
                } catch (e) {
                  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                  return e.errno;
                }
              };
              doWritev = function _doWritev(stream, iov, iovcnt, offset) {
                var ret = 0;
                for (var i = 0; i < iovcnt; i++) {
                  var ptr = HEAPU32[iov >> 2];
                  var len = HEAPU32[iov + 4 >> 2];
                  iov += 8;
                  var curr = FS.write(stream, HEAP8, ptr, len, offset);
                  if (curr < 0) return -1;
                  ret += curr;
                  if (typeof offset !== "undefined") {
                    offset += curr;
                  }
                }
                return ret;
              };
              _fd_seek = function _fd_seek2(fd, offset_low, offset_high, whence, newOffset) {
                try {
                  var offset = convertI32PairToI53Checked(offset_low, offset_high);
                  if (isNaN(offset)) return 61;
                  var stream = SYSCALLS.getStreamFromFD(fd);
                  FS.llseek(stream, offset, whence);
                  tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >> 2] = tempI64[0], HEAP32[newOffset + 4 >> 2] = tempI64[1];
                  if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
                  return 0;
                } catch (e) {
                  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                  return e.errno;
                }
              };
              convertI32PairToI53Checked = function _convertI32PairToI53C(lo, hi) {
                return hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
              };
              _fd_read = function _fd_read2(fd, iov, iovcnt, pnum) {
                try {
                  var stream = SYSCALLS.getStreamFromFD(fd);
                  var num = doReadv(stream, iov, iovcnt);
                  HEAPU32[pnum >> 2] = num;
                  return 0;
                } catch (e) {
                  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                  return e.errno;
                }
              };
              doReadv = function _doReadv(stream, iov, iovcnt, offset) {
                var ret = 0;
                for (var i = 0; i < iovcnt; i++) {
                  var ptr = HEAPU32[iov >> 2];
                  var len = HEAPU32[iov + 4 >> 2];
                  iov += 8;
                  var curr = FS.read(stream, HEAP8, ptr, len, offset);
                  if (curr < 0) return -1;
                  ret += curr;
                  if (curr < len) break;
                  if (typeof offset !== "undefined") {
                    offset += curr;
                  }
                }
                return ret;
              };
              _fd_close = function _fd_close2(fd) {
                try {
                  var stream = SYSCALLS.getStreamFromFD(fd);
                  FS.close(stream);
                  return 0;
                } catch (e) {
                  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                  return e.errno;
                }
              };
              exitJS = function _exitJS(status, implicit) {
                _proc_exit(status);
              };
              _proc_exit = function _proc_exit2(code) {
                if (!keepRuntimeAlive()) {
                  if (Module["onExit"]) Module["onExit"](code);
                  ABORT = true;
                }
                quit_(code, new ExitStatus(code));
              };
              _emscripten_resize_heap = function _emscripten_resize_he(requestedSize) {
                var oldSize = HEAPU8.length;
                requestedSize = requestedSize >>> 0;
                var maxHeapSize = getHeapMax();
                if (requestedSize > maxHeapSize) {
                  return false;
                }
                var alignUp = function alignUp(x, multiple) {
                  return x + (multiple - x % multiple) % multiple;
                };
                for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
                  var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
                  overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
                  var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
                  var replacement = emscripten_realloc_buffer(newSize);
                  if (replacement) {
                    return true;
                  }
                }
                return false;
              };
              emscripten_realloc_buffer = function _emscripten_realloc_b(size) {
                var b = wasmMemory.buffer;
                try {
                  wasmMemory.grow(size - b.byteLength + 65535 >>> 16);
                  updateMemoryViews();
                  return 1;
                } catch (e) {}
              };
              getHeapMax = function _getHeapMax() {
                return 2147483648;
              };
              _emscripten_memcpy_big = function _emscripten_memcpy_bi(dest, src, num) {
                HEAPU8.copyWithin(dest, src, src + num);
              };
              _emscripten_date_now = function _emscripten_date_now2() {
                return Date.now();
              };
              _abort = function _abort3() {
                abort("");
              };
              __emscripten_get_now_is_monotonic = function _emscripten_get_now_() {
                return nowIsMonotonic;
              };
              __embind_register_void = function _embind_register_voi(rawType, name) {
                name = readLatin1String(name);
                registerType(rawType, {
                  isVoid: true,
                  name: name,
                  "argPackAdvance": 0,
                  "fromWireType": function fromWireType() {
                    return undefined;
                  },
                  "toWireType": function toWireType(destructors, o) {
                    return undefined;
                  }
                });
              };
              __embind_register_std_wstring = function _embind_register_std2(rawType, charSize, name) {
                name = readLatin1String(name);
                var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
                if (charSize === 2) {
                  decodeString = UTF16ToString;
                  encodeString = stringToUTF16;
                  lengthBytesUTF = lengthBytesUTF16;
                  getHeap = function getHeap() {
                    return HEAPU16;
                  };
                  shift = 1;
                } else if (charSize === 4) {
                  decodeString = UTF32ToString;
                  encodeString = stringToUTF32;
                  lengthBytesUTF = lengthBytesUTF32;
                  getHeap = function getHeap() {
                    return HEAPU32;
                  };
                  shift = 2;
                }
                registerType(rawType, {
                  name: name,
                  "fromWireType": function fromWireType(value) {
                    var length = HEAPU32[value >> 2];
                    var HEAP = getHeap();
                    var str;
                    var decodeStartPtr = value + 4;
                    for (var i = 0; i <= length; ++i) {
                      var currentBytePtr = value + 4 + i * charSize;
                      if (i == length || HEAP[currentBytePtr >> shift] == 0) {
                        var maxReadBytes = currentBytePtr - decodeStartPtr;
                        var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
                        if (str === undefined) {
                          str = stringSegment;
                        } else {
                          str += String.fromCharCode(0);
                          str += stringSegment;
                        }
                        decodeStartPtr = currentBytePtr + charSize;
                      }
                    }
                    _free2(value);
                    return str;
                  },
                  "toWireType": function toWireType(destructors, value) {
                    if (!(typeof value == "string")) {
                      throwBindingError("Cannot pass non-string to C++ string type ".concat(name));
                    }
                    var length = lengthBytesUTF(value);
                    var ptr = _malloc2(4 + length + charSize);
                    HEAPU32[ptr >> 2] = length >> shift;
                    encodeString(value, ptr + 4, length + charSize);
                    if (destructors !== null) {
                      destructors.push(_free2, ptr);
                    }
                    return ptr;
                  },
                  "argPackAdvance": 8,
                  "readValueFromPointer": simpleReadValueFromPointer,
                  destructorFunction: function destructorFunction(ptr) {
                    _free2(ptr);
                  }
                });
              };
              lengthBytesUTF32 = function _lengthBytesUTF3(str) {
                var len = 0;
                for (var i = 0; i < str.length; ++i) {
                  var codeUnit = str.charCodeAt(i);
                  if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
                  len += 4;
                }
                return len;
              };
              stringToUTF32 = function _stringToUTF3(str, outPtr, maxBytesToWrite) {
                if (maxBytesToWrite === undefined) {
                  maxBytesToWrite = 2147483647;
                }
                if (maxBytesToWrite < 4) return 0;
                var startPtr = outPtr;
                var endPtr = startPtr + maxBytesToWrite - 4;
                for (var i = 0; i < str.length; ++i) {
                  var codeUnit = str.charCodeAt(i);
                  if (codeUnit >= 55296 && codeUnit <= 57343) {
                    var trailSurrogate = str.charCodeAt(++i);
                    codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
                  }
                  HEAP32[outPtr >> 2] = codeUnit;
                  outPtr += 4;
                  if (outPtr + 4 > endPtr) break;
                }
                HEAP32[outPtr >> 2] = 0;
                return outPtr - startPtr;
              };
              UTF32ToString = function _UTF32ToString(ptr, maxBytesToRead) {
                var i = 0;
                var str = "";
                while (!(i >= maxBytesToRead / 4)) {
                  var utf32 = HEAP32[ptr + i * 4 >> 2];
                  if (utf32 == 0) break;
                  ++i;
                  if (utf32 >= 65536) {
                    var ch = utf32 - 65536;
                    str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
                  } else {
                    str += String.fromCharCode(utf32);
                  }
                }
                return str;
              };
              lengthBytesUTF16 = function _lengthBytesUTF2(str) {
                return str.length * 2;
              };
              stringToUTF16 = function _stringToUTF2(str, outPtr, maxBytesToWrite) {
                if (maxBytesToWrite === undefined) {
                  maxBytesToWrite = 2147483647;
                }
                if (maxBytesToWrite < 2) return 0;
                maxBytesToWrite -= 2;
                var startPtr = outPtr;
                var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
                for (var i = 0; i < numCharsToWrite; ++i) {
                  var codeUnit = str.charCodeAt(i);
                  HEAP16[outPtr >> 1] = codeUnit;
                  outPtr += 2;
                }
                HEAP16[outPtr >> 1] = 0;
                return outPtr - startPtr;
              };
              UTF16ToString = function _UTF16ToString(ptr, maxBytesToRead) {
                var endPtr = ptr;
                var idx = endPtr >> 1;
                var maxIdx = idx + maxBytesToRead / 2;
                while (!(idx >= maxIdx) && HEAPU16[idx]) {
                  ++idx;
                }
                endPtr = idx << 1;
                if (endPtr - ptr > 32 && UTF16Decoder) return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
                var str = "";
                for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
                  var codeUnit = HEAP16[ptr + i * 2 >> 1];
                  if (codeUnit == 0) break;
                  str += String.fromCharCode(codeUnit);
                }
                return str;
              };
              __embind_register_std_string = function _embind_register_std(rawType, name) {
                name = readLatin1String(name);
                var stdStringIsUTF8 = name === "std::string";
                registerType(rawType, {
                  name: name,
                  "fromWireType": function fromWireType(value) {
                    var length = HEAPU32[value >> 2];
                    var payload = value + 4;
                    var str;
                    if (stdStringIsUTF8) {
                      var decodeStartPtr = payload;
                      for (var i = 0; i <= length; ++i) {
                        var currentBytePtr = payload + i;
                        if (i == length || HEAPU8[currentBytePtr] == 0) {
                          var maxRead = currentBytePtr - decodeStartPtr;
                          var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                          if (str === undefined) {
                            str = stringSegment;
                          } else {
                            str += String.fromCharCode(0);
                            str += stringSegment;
                          }
                          decodeStartPtr = currentBytePtr + 1;
                        }
                      }
                    } else {
                      var a = new Array(length);
                      for (var i = 0; i < length; ++i) {
                        a[i] = String.fromCharCode(HEAPU8[payload + i]);
                      }
                      str = a.join("");
                    }
                    _free2(value);
                    return str;
                  },
                  "toWireType": function toWireType(destructors, value) {
                    if (value instanceof ArrayBuffer) {
                      value = new Uint8Array(value);
                    }
                    var length;
                    var valueIsOfTypeString = typeof value == "string";
                    if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
                      throwBindingError("Cannot pass non-string to std::string");
                    }
                    if (stdStringIsUTF8 && valueIsOfTypeString) {
                      length = lengthBytesUTF8(value);
                    } else {
                      length = value.length;
                    }
                    var base = _malloc2(4 + length + 1);
                    var ptr = base + 4;
                    HEAPU32[base >> 2] = length;
                    if (stdStringIsUTF8 && valueIsOfTypeString) {
                      stringToUTF8(value, ptr, length + 1);
                    } else {
                      if (valueIsOfTypeString) {
                        for (var i = 0; i < length; ++i) {
                          var charCode = value.charCodeAt(i);
                          if (charCode > 255) {
                            _free2(ptr);
                            throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
                          }
                          HEAPU8[ptr + i] = charCode;
                        }
                      } else {
                        for (var i = 0; i < length; ++i) {
                          HEAPU8[ptr + i] = value[i];
                        }
                      }
                    }
                    if (destructors !== null) {
                      destructors.push(_free2, base);
                    }
                    return base;
                  },
                  "argPackAdvance": 8,
                  "readValueFromPointer": simpleReadValueFromPointer,
                  destructorFunction: function destructorFunction(ptr) {
                    _free2(ptr);
                  }
                });
              };
              stringToUTF8 = function _stringToUTF(str, outPtr, maxBytesToWrite) {
                return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
              };
              __embind_register_memory_view = function _embind_register_mem(rawType, dataTypeIndex, name) {
                var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
                var TA = typeMapping[dataTypeIndex];
                function decodeMemoryView(handle) {
                  handle = handle >> 2;
                  var heap = HEAPU32;
                  var size = heap[handle];
                  var data = heap[handle + 1];
                  return new TA(heap.buffer, data, size);
                }
                name = readLatin1String(name);
                registerType(rawType, {
                  name: name,
                  "fromWireType": decodeMemoryView,
                  "argPackAdvance": 8,
                  "readValueFromPointer": decodeMemoryView
                }, {
                  ignoreDuplicateRegistrations: true
                });
              };
              __embind_register_integer = function _embind_register_int(primitiveType, name, size, minRange, maxRange) {
                name = readLatin1String(name);
                var shift = getShiftFromSize(size);
                var fromWireType = function fromWireType(value) {
                  return value;
                };
                if (minRange === 0) {
                  var bitshift = 32 - 8 * size;
                  fromWireType = function fromWireType(value) {
                    return value << bitshift >>> bitshift;
                  };
                }
                var isUnsignedType = name.includes("unsigned");
                var checkAssertions = function checkAssertions(value, toTypeName) {};
                var toWireType;
                if (isUnsignedType) {
                  toWireType = function toWireType(destructors, value) {
                    checkAssertions(value, this.name);
                    return value >>> 0;
                  };
                } else {
                  toWireType = function toWireType(destructors, value) {
                    checkAssertions(value, this.name);
                    return value;
                  };
                }
                registerType(primitiveType, {
                  name: name,
                  "fromWireType": fromWireType,
                  "toWireType": toWireType,
                  "argPackAdvance": 8,
                  "readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0),
                  destructorFunction: null
                });
              };
              integerReadValueFromPointer = function _integerReadValueFrom(name, shift, signed) {
                switch (shift) {
                  case 0:
                    return signed ? function readS8FromPointer(pointer) {
                      return HEAP8[pointer];
                    } : function readU8FromPointer(pointer) {
                      return HEAPU8[pointer];
                    };
                  case 1:
                    return signed ? function readS16FromPointer(pointer) {
                      return HEAP16[pointer >> 1];
                    } : function readU16FromPointer(pointer) {
                      return HEAPU16[pointer >> 1];
                    };
                  case 2:
                    return signed ? function readS32FromPointer(pointer) {
                      return HEAP32[pointer >> 2];
                    } : function readU32FromPointer(pointer) {
                      return HEAPU32[pointer >> 2];
                    };
                  default:
                    throw new TypeError("Unknown integer type: " + name);
                }
              };
              __embind_register_float = function _embind_register_flo(rawType, name, size) {
                var shift = getShiftFromSize(size);
                name = readLatin1String(name);
                registerType(rawType, {
                  name: name,
                  "fromWireType": function fromWireType(value) {
                    return value;
                  },
                  "toWireType": function toWireType(destructors, value) {
                    return value;
                  },
                  "argPackAdvance": 8,
                  "readValueFromPointer": floatReadValueFromPointer(name, shift),
                  destructorFunction: null
                });
              };
              floatReadValueFromPointer = function _floatReadValueFromPo(name, shift) {
                switch (shift) {
                  case 2:
                    return function (pointer) {
                      return this["fromWireType"](HEAPF32[pointer >> 2]);
                    };
                  case 3:
                    return function (pointer) {
                      return this["fromWireType"](HEAPF64[pointer >> 3]);
                    };
                  default:
                    throw new TypeError("Unknown float type: " + name);
                }
              };
              __embind_register_emval = function _embind_register_emv(rawType, name) {
                name = readLatin1String(name);
                registerType(rawType, {
                  name: name,
                  "fromWireType": function fromWireType(handle) {
                    var rv = Emval.toValue(handle);
                    __emval_decref(handle);
                    return rv;
                  },
                  "toWireType": function toWireType(destructors, value) {
                    return Emval.toHandle(value);
                  },
                  "argPackAdvance": 8,
                  "readValueFromPointer": simpleReadValueFromPointer,
                  destructorFunction: null
                });
              };
              simpleReadValueFromPointer = function _simpleReadValueFromP(pointer) {
                return this["fromWireType"](HEAP32[pointer >> 2]);
              };
              init_emval = function _init_emval() {
                emval_handles.allocated.push({
                  value: undefined
                }, {
                  value: null
                }, {
                  value: true
                }, {
                  value: false
                });
                emval_handles.reserved = emval_handles.allocated.length;
                Module["count_emval_handles"] = count_emval_handles;
              };
              count_emval_handles = function _count_emval_handles() {
                var count = 0;
                for (var i = emval_handles.reserved; i < emval_handles.allocated.length; ++i) {
                  if (emval_handles.allocated[i] !== undefined) {
                    ++count;
                  }
                }
                return count;
              };
              __emval_decref = function _emval_decref(handle) {
                if (handle >= emval_handles.reserved && 0 === --emval_handles.get(handle).refcount) {
                  emval_handles.free(handle);
                }
              };
              HandleAllocator = function _HandleAllocator() {
                this.allocated = [undefined];
                this.freelist = [];
                this.get = function (id) {
                  return this.allocated[id];
                };
                this.has = function (id) {
                  return this.allocated[id] !== undefined;
                };
                this.allocate = function (handle) {
                  var id = this.freelist.pop() || this.allocated.length;
                  this.allocated[id] = handle;
                  return id;
                };
                this.free = function (id) {
                  this.allocated[id] = undefined;
                  this.freelist.push(id);
                };
              };
              __embind_register_bool = function _embind_register_boo(rawType, name, size, trueValue, falseValue) {
                var shift = getShiftFromSize(size);
                name = readLatin1String(name);
                registerType(rawType, {
                  name: name,
                  "fromWireType": function fromWireType(wt) {
                    return !!wt;
                  },
                  "toWireType": function toWireType(destructors, o) {
                    return o ? trueValue : falseValue;
                  },
                  "argPackAdvance": 8,
                  "readValueFromPointer": function readValueFromPointer(pointer) {
                    var heap;
                    if (size === 1) {
                      heap = HEAP8;
                    } else if (size === 2) {
                      heap = HEAP16;
                    } else if (size === 4) {
                      heap = HEAP32;
                    } else {
                      throw new TypeError("Unknown boolean type size: " + name);
                    }
                    return this["fromWireType"](heap[pointer >> shift]);
                  },
                  destructorFunction: null
                });
              };
              registerType = function _registerType(rawType, registeredInstance) {
                var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                if (!("argPackAdvance" in registeredInstance)) {
                  throw new TypeError("registerType registeredInstance requires argPackAdvance");
                }
                var name = registeredInstance.name;
                if (!rawType) {
                  throwBindingError("type \"".concat(name, "\" must have a positive integer typeid pointer"));
                }
                if (registeredTypes.hasOwnProperty(rawType)) {
                  if (options.ignoreDuplicateRegistrations) {
                    return;
                  } else {
                    throwBindingError("Cannot register type '".concat(name, "' twice"));
                  }
                }
                registeredTypes[rawType] = registeredInstance;
                delete typeDependencies[rawType];
                if (awaitingDependencies.hasOwnProperty(rawType)) {
                  var callbacks = awaitingDependencies[rawType];
                  delete awaitingDependencies[rawType];
                  callbacks.forEach(function (cb) {
                    return cb();
                  });
                }
              };
              throwBindingError = function _throwBindingError(message) {
                throw new BindingError(message);
              };
              extendError = function _extendError(baseErrorType, errorName) {
                var errorClass = createNamedFunction(errorName, function (message) {
                  this.name = errorName;
                  this.message = message;
                  var stack = new Error(message).stack;
                  if (stack !== undefined) {
                    this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
                  }
                });
                errorClass.prototype = Object.create(baseErrorType.prototype);
                errorClass.prototype.constructor = errorClass;
                errorClass.prototype.toString = function () {
                  if (this.message === undefined) {
                    return this.name;
                  } else {
                    return "".concat(this.name, ": ").concat(this.message);
                  }
                };
                return errorClass;
              };
              createNamedFunction = function _createNamedFunction(name, body) {
                name = makeLegalFunctionName(name);
                return _defineProperty({}, name, function () {
                  return body.apply(this, arguments);
                })[name];
              };
              makeLegalFunctionName = function _makeLegalFunctionNam(name) {
                if (undefined === name) {
                  return "_unknown";
                }
                name = name.replace(/[^a-zA-Z0-9_]/g, "$");
                var f = name.charCodeAt(0);
                if (f >= char_0 && f <= char_9) {
                  return "_".concat(name);
                }
                return name;
              };
              readLatin1String = function _readLatin1String(ptr) {
                var ret = "";
                var c = ptr;
                while (HEAPU8[c]) {
                  ret += embind_charCodes[HEAPU8[c++]];
                }
                return ret;
              };
              embind_init_charCodes = function _embind_init_charCode() {
                var codes = new Array(256);
                for (var i = 0; i < 256; ++i) {
                  codes[i] = String.fromCharCode(i);
                }
                embind_charCodes = codes;
              };
              getShiftFromSize = function _getShiftFromSize(size) {
                switch (size) {
                  case 1:
                    return 0;
                  case 2:
                    return 1;
                  case 4:
                    return 2;
                  case 8:
                    return 3;
                  default:
                    throw new TypeError("Unknown type size: ".concat(size));
                }
              };
              __embind_register_bigint = function _embind_register_big(primitiveType, name, size, minRange, maxRange) {};
              ___syscall_openat = function _syscall_openat(dirfd, path, flags, varargs) {
                SYSCALLS.varargs = varargs;
                try {
                  path = SYSCALLS.getStr(path);
                  path = SYSCALLS.calculateAt(dirfd, path);
                  var mode = varargs ? SYSCALLS.get() : 0;
                  return FS.open(path, flags, mode).fd;
                } catch (e) {
                  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                  return -e.errno;
                }
              };
              ___syscall_ioctl = function _syscall_ioctl(fd, op, varargs) {
                SYSCALLS.varargs = varargs;
                try {
                  var stream = SYSCALLS.getStreamFromFD(fd);
                  switch (op) {
                    case 21509:
                    case 21505:
                      {
                        if (!stream.tty) return -59;
                        return 0;
                      }
                    case 21510:
                    case 21511:
                    case 21512:
                    case 21506:
                    case 21507:
                    case 21508:
                      {
                        if (!stream.tty) return -59;
                        return 0;
                      }
                    case 21519:
                      {
                        if (!stream.tty) return -59;
                        var argp = SYSCALLS.get();
                        HEAP32[argp >> 2] = 0;
                        return 0;
                      }
                    case 21520:
                      {
                        if (!stream.tty) return -59;
                        return -28;
                      }
                    case 21531:
                      {
                        var argp = SYSCALLS.get();
                        return FS.ioctl(stream, op, argp);
                      }
                    case 21523:
                      {
                        if (!stream.tty) return -59;
                        return 0;
                      }
                    case 21524:
                      {
                        if (!stream.tty) return -59;
                        return 0;
                      }
                    default:
                      return -28;
                  }
                } catch (e) {
                  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                  return -e.errno;
                }
              };
              ___syscall_fcntl64 = function _syscall_fcntl(fd, cmd, varargs) {
                SYSCALLS.varargs = varargs;
                try {
                  var stream = SYSCALLS.getStreamFromFD(fd);
                  switch (cmd) {
                    case 0:
                      {
                        var arg = SYSCALLS.get();
                        if (arg < 0) {
                          return -28;
                        }
                        var newStream;
                        newStream = FS.createStream(stream, arg);
                        return newStream.fd;
                      }
                    case 1:
                    case 2:
                      return 0;
                    case 3:
                      return stream.flags;
                    case 4:
                      {
                        var arg = SYSCALLS.get();
                        stream.flags |= arg;
                        return 0;
                      }
                    case 5:
                      {
                        var arg = SYSCALLS.get();
                        var offset = 0;
                        HEAP16[arg + offset >> 1] = 2;
                        return 0;
                      }
                    case 6:
                    case 7:
                      return 0;
                    case 16:
                    case 8:
                      return -28;
                    case 9:
                      setErrNo(28);
                      return -1;
                    default:
                      {
                        return -28;
                      }
                  }
                } catch (e) {
                  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                  return -e.errno;
                }
              };
              UTF8ToString = function _UTF8ToString(ptr, maxBytesToRead) {
                return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
              };
              FS_getMode = function _FS_getMode(canRead, canWrite) {
                var mode = 0;
                if (canRead) mode |= 292 | 73;
                if (canWrite) mode |= 146;
                return mode;
              };
              FS_modeStringToFlags = function _FS_modeStringToFlags(str) {
                var flagModes = {
                  "r": 0,
                  "r+": 2,
                  "w": 512 | 64 | 1,
                  "w+": 512 | 64 | 2,
                  "a": 1024 | 64 | 1,
                  "a+": 1024 | 64 | 2
                };
                var flags = flagModes[str];
                if (typeof flags == "undefined") {
                  throw new Error("Unknown file open mode: ".concat(str));
                }
                return flags;
              };
              FS_createPreloadedFile = function _FS_createPreloadedFi(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
                var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
                var dep = getUniqueRunDependency("cp ".concat(fullname));
                function processData(byteArray) {
                  function finish(byteArray) {
                    if (preFinish) preFinish();
                    if (!dontCreateFile) {
                      FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
                    }
                    if (onload) onload();
                    removeRunDependency(dep);
                  }
                  if (FS_handledByPreloadPlugin(byteArray, fullname, finish, function () {
                    if (onerror) onerror();
                    removeRunDependency(dep);
                  })) {
                    return;
                  }
                  finish(byteArray);
                }
                addRunDependency(dep);
                if (typeof url == "string") {
                  asyncLoad(url, function (byteArray) {
                    return processData(byteArray);
                  }, onerror);
                } else {
                  processData(url);
                }
              };
              FS_handledByPreloadPlugin = function _FS_handledByPreloadP(byteArray, fullname, finish, onerror) {
                if (typeof Browser != "undefined") Browser.init();
                var handled = false;
                preloadPlugins.forEach(function (plugin) {
                  if (handled) return;
                  if (plugin["canHandle"](fullname)) {
                    plugin["handle"](byteArray, fullname, finish, onerror);
                    handled = true;
                  }
                });
                return handled;
              };
              asyncLoad = function _asyncLoad(url, onload, onerror, noRunDep) {
                var dep = !noRunDep ? getUniqueRunDependency("al ".concat(url)) : "";
                readAsync(url, function (arrayBuffer) {
                  assert(arrayBuffer, "Loading data file \"".concat(url, "\" failed (no arrayBuffer)."));
                  onload(new Uint8Array(arrayBuffer));
                  if (dep) removeRunDependency(dep);
                }, function (event) {
                  if (onerror) {
                    onerror();
                  } else {
                    throw "Loading data file \"".concat(url, "\" failed.");
                  }
                });
                if (dep) addRunDependency(dep);
              };
              mmapAlloc = function _mmapAlloc(size) {
                abort();
              };
              UTF8ArrayToString = function _UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
                var endIdx = idx + maxBytesToRead;
                var endPtr = idx;
                while (heapOrArray[endPtr] && !(endPtr >= endIdx)) {
                  ++endPtr;
                }
                if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
                  return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
                }
                var str = "";
                while (idx < endPtr) {
                  var u0 = heapOrArray[idx++];
                  if (!(u0 & 128)) {
                    str += String.fromCharCode(u0);
                    continue;
                  }
                  var u1 = heapOrArray[idx++] & 63;
                  if ((u0 & 224) == 192) {
                    str += String.fromCharCode((u0 & 31) << 6 | u1);
                    continue;
                  }
                  var u2 = heapOrArray[idx++] & 63;
                  if ((u0 & 240) == 224) {
                    u0 = (u0 & 15) << 12 | u1 << 6 | u2;
                  } else {
                    u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
                  }
                  if (u0 < 65536) {
                    str += String.fromCharCode(u0);
                  } else {
                    var ch = u0 - 65536;
                    str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
                  }
                }
                return str;
              };
              intArrayFromString = function _intArrayFromString(stringy, dontAddNull, length) {
                var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
                var u8array = new Array(len);
                var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
                if (dontAddNull) u8array.length = numBytesWritten;
                return u8array;
              };
              stringToUTF8Array = function _stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
                if (!(maxBytesToWrite > 0)) return 0;
                var startIdx = outIdx;
                var endIdx = outIdx + maxBytesToWrite - 1;
                for (var i = 0; i < str.length; ++i) {
                  var u = str.charCodeAt(i);
                  if (u >= 55296 && u <= 57343) {
                    var u1 = str.charCodeAt(++i);
                    u = 65536 + ((u & 1023) << 10) | u1 & 1023;
                  }
                  if (u <= 127) {
                    if (outIdx >= endIdx) break;
                    heap[outIdx++] = u;
                  } else if (u <= 2047) {
                    if (outIdx + 1 >= endIdx) break;
                    heap[outIdx++] = 192 | u >> 6;
                    heap[outIdx++] = 128 | u & 63;
                  } else if (u <= 65535) {
                    if (outIdx + 2 >= endIdx) break;
                    heap[outIdx++] = 224 | u >> 12;
                    heap[outIdx++] = 128 | u >> 6 & 63;
                    heap[outIdx++] = 128 | u & 63;
                  } else {
                    if (outIdx + 3 >= endIdx) break;
                    heap[outIdx++] = 240 | u >> 18;
                    heap[outIdx++] = 128 | u >> 12 & 63;
                    heap[outIdx++] = 128 | u >> 6 & 63;
                    heap[outIdx++] = 128 | u & 63;
                  }
                }
                heap[outIdx] = 0;
                return outIdx - startIdx;
              };
              lengthBytesUTF8 = function _lengthBytesUTF(str) {
                var len = 0;
                for (var i = 0; i < str.length; ++i) {
                  var c = str.charCodeAt(i);
                  if (c <= 127) {
                    len++;
                  } else if (c <= 2047) {
                    len += 2;
                  } else if (c >= 55296 && c <= 57343) {
                    len += 4;
                    ++i;
                  } else {
                    len += 3;
                  }
                }
                return len;
              };
              randomFill = function _randomFill(view) {
                return (randomFill = initRandomFill())(view);
              };
              initRandomFill = function _initRandomFill() {
                if ((typeof crypto === "undefined" ? "undefined" : _typeof(crypto)) == "object" && typeof crypto["getRandomValues"] == "function") {
                  return function (view) {
                    return crypto.getRandomValues(view);
                  };
                } else if (ENVIRONMENT_IS_NODE) {
                  try {
                    var crypto_module = require$1("crypto");
                    var randomFillSync = crypto_module["randomFillSync"];
                    if (randomFillSync) {
                      return function (view) {
                        return crypto_module["randomFillSync"](view);
                      };
                    }
                    var randomBytes = crypto_module["randomBytes"];
                    return function (view) {
                      return view.set(randomBytes(view.byteLength)), view;
                    };
                  } catch (e) {}
                }
                abort("initRandomDevice");
              };
              setErrNo = function _setErrNo(value) {
                HEAP32[_errno_location() >> 2] = value;
                return value;
              };
              callRuntimeCallbacks = function _callRuntimeCallbacks(callbacks) {
                while (callbacks.length > 0) {
                  callbacks.shift()(Module);
                }
              };
              ExitStatus = function _ExitStatus(status) {
                this.name = "ExitStatus";
                this.message = "Program terminated with exit(" + status + ")";
                this.status = status;
              };
              createWasm = function _createWasm() {
                var info = {
                  "a": wasmImports
                };
                function receiveInstance(instance, module) {
                  var exports = instance.exports;
                  Module["asm"] = exports;
                  wasmMemory = Module["asm"]["w"];
                  updateMemoryViews();
                  Module["asm"]["B"];
                  addOnInit(Module["asm"]["x"]);
                  removeRunDependency("wasm-instantiate");
                  return exports;
                }
                addRunDependency("wasm-instantiate");
                function receiveInstantiationResult(result) {
                  receiveInstance(result["instance"]);
                }
                if (Module["instantiateWasm"]) {
                  try {
                    return Module["instantiateWasm"](info, receiveInstance);
                  } catch (e) {
                    err("Module.instantiateWasm callback failed with error: " + e);
                    readyPromiseReject(e);
                  }
                }
                instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult)["catch"](readyPromiseReject);
                return {};
              };
              instantiateAsync = function _instantiateAsync(binary, binaryFile, imports, callback) {
                if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
                  return fetch(binaryFile, {
                    credentials: "same-origin"
                  }).then(function (response) {
                    var result = WebAssembly.instantiateStreaming(response, imports);
                    return result.then(callback, function (reason) {
                      err("wasm streaming compile failed: " + reason);
                      err("falling back to ArrayBuffer instantiation");
                      return instantiateArrayBuffer(binaryFile, imports, callback);
                    });
                  });
                } else {
                  return instantiateArrayBuffer(binaryFile, imports, callback);
                }
              };
              instantiateArrayBuffer = function _instantiateArrayBuff(binaryFile, imports, receiver) {
                return getBinaryPromise(binaryFile).then(function (binary) {
                  return WebAssembly.instantiate(binary, imports);
                }).then(function (instance) {
                  return instance;
                }).then(receiver, function (reason) {
                  err("failed to asynchronously prepare wasm: " + reason);
                  abort(reason);
                });
              };
              getBinaryPromise = function _getBinaryPromise(binaryFile) {
                if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
                  if (typeof fetch == "function" && !isFileURI(binaryFile)) {
                    return fetch(binaryFile, {
                      credentials: "same-origin"
                    }).then(function (response) {
                      if (!response["ok"]) {
                        throw "failed to load wasm binary file at '" + binaryFile + "'";
                      }
                      return response["arrayBuffer"]();
                    })["catch"](function () {
                      return getBinary(binaryFile);
                    });
                  } else {
                    if (readAsync) {
                      return new Promise(function (resolve, reject) {
                        readAsync(binaryFile, function (response) {
                          return resolve(new Uint8Array(response));
                        }, reject);
                      });
                    }
                  }
                }
                return Promise.resolve().then(function () {
                  return getBinary(binaryFile);
                });
              };
              getBinary = function _getBinary(file) {
                try {
                  if (file == wasmBinaryFile && wasmBinary) {
                    return new Uint8Array(wasmBinary);
                  }
                  if (readBinary) {
                    return readBinary(file);
                  }
                  throw "both async and sync fetching of the wasm failed";
                } catch (err) {
                  abort(err);
                }
              };
              isFileURI = function _isFileURI(filename) {
                return filename.startsWith("file://");
              };
              isDataURI = function _isDataURI(filename) {
                return filename.startsWith(dataURIPrefix);
              };
              abort = function _abort2(what) {
                if (Module["onAbort"]) {
                  Module["onAbort"](what);
                }
                what = "Aborted(" + what + ")";
                err(what);
                ABORT = true;
                what += ". Build with -sASSERTIONS for more info.";
                var e = new WebAssembly.RuntimeError(what);
                readyPromiseReject(e);
                throw e;
              };
              removeRunDependency = function _removeRunDependency(id) {
                runDependencies--;
                if (Module["monitorRunDependencies"]) {
                  Module["monitorRunDependencies"](runDependencies);
                }
                if (runDependencies == 0) {
                  if (runDependencyWatcher !== null) {
                    clearInterval(runDependencyWatcher);
                    runDependencyWatcher = null;
                  }
                  if (dependenciesFulfilled) {
                    var callback = dependenciesFulfilled;
                    dependenciesFulfilled = null;
                    callback();
                  }
                }
              };
              addRunDependency = function _addRunDependency(id) {
                runDependencies++;
                if (Module["monitorRunDependencies"]) {
                  Module["monitorRunDependencies"](runDependencies);
                }
              };
              getUniqueRunDependency = function _getUniqueRunDependen(id) {
                return id;
              };
              addOnPostRun = function _addOnPostRun(cb) {
                __ATPOSTRUN__.unshift(cb);
              };
              addOnInit = function _addOnInit(cb) {
                __ATINIT__.unshift(cb);
              };
              addOnPreRun = function _addOnPreRun(cb) {
                __ATPRERUN__.unshift(cb);
              };
              postRun = function _postRun() {
                if (Module["postRun"]) {
                  if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
                  while (Module["postRun"].length) {
                    addOnPostRun(Module["postRun"].shift());
                  }
                }
                callRuntimeCallbacks(__ATPOSTRUN__);
              };
              initRuntime = function _initRuntime() {
                if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
                FS.ignorePermissions = false;
                TTY.init();
                callRuntimeCallbacks(__ATINIT__);
              };
              preRun = function _preRun() {
                if (Module["preRun"]) {
                  if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
                  while (Module["preRun"].length) {
                    addOnPreRun(Module["preRun"].shift());
                  }
                }
                callRuntimeCallbacks(__ATPRERUN__);
              };
              keepRuntimeAlive = function _keepRuntimeAlive() {
                return noExitRuntime || runtimeKeepaliveCounter > 0;
              };
              updateMemoryViews = function _updateMemoryViews() {
                var b = wasmMemory.buffer;
                Module["HEAP8"] = HEAP8 = new Int8Array(b);
                Module["HEAP16"] = HEAP16 = new Int16Array(b);
                Module["HEAP32"] = HEAP32 = new Int32Array(b);
                Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
                Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
                Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
                Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
                Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
              };
              assert = function _assert(condition, text) {
                if (!condition) {
                  abort(text);
                }
              };
              locateFile = function _locateFile(path) {
                if (Module["locateFile"]) {
                  return Module["locateFile"](path, scriptDirectory);
                }
                return scriptDirectory + path;
              };
              GoCart = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
              Module = typeof GoCart != "undefined" ? GoCart : {};
              Module["ready"] = new Promise(function (resolve, reject) {
                readyPromiseResolve = resolve;
                readyPromiseReject = reject;
              });
              moduleOverrides = Object.assign({}, Module);
              quit_ = function quit_(status, toThrow) {
                throw toThrow;
              };
              ENVIRONMENT_IS_WEB = (typeof window === "undefined" ? "undefined" : _typeof(window)) == "object";
              ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
              ENVIRONMENT_IS_NODE = (typeof process === "undefined" ? "undefined" : _typeof(process)) == "object" && _typeof(process.versions) == "object" && typeof process.versions.node == "string";
              scriptDirectory = "";
              if (!ENVIRONMENT_IS_NODE) {
                _context.next = 121;
                break;
              }
              _context.next = 106;
              return import('module');
            case 106:
              _yield$import = _context.sent;
              createRequire = _yield$import.createRequire;
              require$1 = createRequire((typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('go-cart.js', document.baseURI).href)));
              fs = require$1("fs");
              nodePath = require$1("path");
              if (ENVIRONMENT_IS_WORKER) {
                scriptDirectory = nodePath.dirname(scriptDirectory) + "/";
              } else {
                scriptDirectory = require$1("url").fileURLToPath(new URL("./", (typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('go-cart.js', document.baseURI).href))));
              }
              read_ = function read_(filename, binary) {
                filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
                return fs.readFileSync(filename, binary ? undefined : "utf8");
              };
              readBinary = function readBinary(filename) {
                var ret = read_(filename, true);
                if (!ret.buffer) {
                  ret = new Uint8Array(ret);
                }
                return ret;
              };
              readAsync = function readAsync(filename, onload, onerror) {
                var binary = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
                filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
                fs.readFile(filename, binary ? undefined : "utf8", function (err, data) {
                  if (err) onerror(err);else onload(binary ? data.buffer : data);
                });
              };
              if (!Module["thisProgram"] && process.argv.length > 1) {
                process.argv[1].replace(/\\/g, "/");
              }
              process.argv.slice(2);
              quit_ = function quit_(status, toThrow) {
                process.exitCode = status;
                throw toThrow;
              };
              Module["inspect"] = function () {
                return "[Emscripten Module object]";
              };
              _context.next = 122;
              break;
            case 121:
              if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
                if (ENVIRONMENT_IS_WORKER) {
                  scriptDirectory = self.location.href;
                } else if (typeof document != "undefined" && document.currentScript) {
                  scriptDirectory = document.currentScript.src;
                }
                if (_scriptDir) {
                  scriptDirectory = _scriptDir;
                }
                if (scriptDirectory.indexOf("blob:") !== 0) {
                  scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
                } else {
                  scriptDirectory = "";
                }
                {
                  read_ = function read_(url) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url, false);
                    xhr.send(null);
                    return xhr.responseText;
                  };
                  if (ENVIRONMENT_IS_WORKER) {
                    readBinary = function readBinary(url) {
                      var xhr = new XMLHttpRequest();
                      xhr.open("GET", url, false);
                      xhr.responseType = "arraybuffer";
                      xhr.send(null);
                      return new Uint8Array(xhr.response);
                    };
                  }
                  readAsync = function readAsync(url, onload, onerror) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url, true);
                    xhr.responseType = "arraybuffer";
                    xhr.onload = function () {
                      if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                        onload(xhr.response);
                        return;
                      }
                      onerror();
                    };
                    xhr.onerror = onerror;
                    xhr.send(null);
                  };
                }
              }
            case 122:
              out = Module["print"] || console.log.bind(console);
              err = Module["printErr"] || console.error.bind(console);
              Object.assign(Module, moduleOverrides);
              moduleOverrides = null;
              if (Module["arguments"]) Module["arguments"];
              if (Module["thisProgram"]) Module["thisProgram"];
              if (Module["quit"]) quit_ = Module["quit"];
              if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
              noExitRuntime = Module["noExitRuntime"] || true;
              if ((typeof WebAssembly === "undefined" ? "undefined" : _typeof(WebAssembly)) != "object") {
                abort("no native wasm support detected");
              }
              ABORT = false;
              __ATPRERUN__ = [];
              __ATINIT__ = [];
              __ATPOSTRUN__ = [];
              runtimeKeepaliveCounter = 0;
              runDependencies = 0;
              runDependencyWatcher = null;
              dependenciesFulfilled = null;
              dataURIPrefix = "data:application/octet-stream;base64,";
              if (Module["locateFile"]) {
                wasmBinaryFile = "cart.wasm";
                if (!isDataURI(wasmBinaryFile)) {
                  wasmBinaryFile = locateFile(wasmBinaryFile);
                }
              } else {
                wasmBinaryFile = new URL("cart.wasm", (typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('go-cart.js', document.baseURI).href))).href;
              }
              PATH = {
                isAbs: function isAbs(path) {
                  return path.charAt(0) === "/";
                },
                splitPath: function splitPath(filename) {
                  var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                  return splitPathRe.exec(filename).slice(1);
                },
                normalizeArray: function normalizeArray(parts, allowAboveRoot) {
                  var up = 0;
                  for (var i = parts.length - 1; i >= 0; i--) {
                    var last = parts[i];
                    if (last === ".") {
                      parts.splice(i, 1);
                    } else if (last === "..") {
                      parts.splice(i, 1);
                      up++;
                    } else if (up) {
                      parts.splice(i, 1);
                      up--;
                    }
                  }
                  if (allowAboveRoot) {
                    for (; up; up--) {
                      parts.unshift("..");
                    }
                  }
                  return parts;
                },
                normalize: function normalize(path) {
                  var isAbsolute = PATH.isAbs(path),
                    trailingSlash = path.substr(-1) === "/";
                  path = PATH.normalizeArray(path.split("/").filter(function (p) {
                    return !!p;
                  }), !isAbsolute).join("/");
                  if (!path && !isAbsolute) {
                    path = ".";
                  }
                  if (path && trailingSlash) {
                    path += "/";
                  }
                  return (isAbsolute ? "/" : "") + path;
                },
                dirname: function dirname(path) {
                  var result = PATH.splitPath(path),
                    root = result[0],
                    dir = result[1];
                  if (!root && !dir) {
                    return ".";
                  }
                  if (dir) {
                    dir = dir.substr(0, dir.length - 1);
                  }
                  return root + dir;
                },
                basename: function basename(path) {
                  if (path === "/") return "/";
                  path = PATH.normalize(path);
                  path = path.replace(/\/$/, "");
                  var lastSlash = path.lastIndexOf("/");
                  if (lastSlash === -1) return path;
                  return path.substr(lastSlash + 1);
                },
                join: function join() {
                  var paths = Array.prototype.slice.call(arguments);
                  return PATH.normalize(paths.join("/"));
                },
                join2: function join2(l, r) {
                  return PATH.normalize(l + "/" + r);
                }
              };
              PATH_FS = {
                resolve: function resolve() {
                  var resolvedPath = "",
                    resolvedAbsolute = false;
                  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                    var path = i >= 0 ? arguments[i] : FS.cwd();
                    if (typeof path != "string") {
                      throw new TypeError("Arguments to path.resolve must be strings");
                    } else if (!path) {
                      return "";
                    }
                    resolvedPath = path + "/" + resolvedPath;
                    resolvedAbsolute = PATH.isAbs(path);
                  }
                  resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(function (p) {
                    return !!p;
                  }), !resolvedAbsolute).join("/");
                  return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
                },
                relative: function relative(from, to) {
                  from = PATH_FS.resolve(from).substr(1);
                  to = PATH_FS.resolve(to).substr(1);
                  function trim(arr) {
                    var start = 0;
                    for (; start < arr.length; start++) {
                      if (arr[start] !== "") break;
                    }
                    var end = arr.length - 1;
                    for (; end >= 0; end--) {
                      if (arr[end] !== "") break;
                    }
                    if (start > end) return [];
                    return arr.slice(start, end - start + 1);
                  }
                  var fromParts = trim(from.split("/"));
                  var toParts = trim(to.split("/"));
                  var length = Math.min(fromParts.length, toParts.length);
                  var samePartsLength = length;
                  for (var i = 0; i < length; i++) {
                    if (fromParts[i] !== toParts[i]) {
                      samePartsLength = i;
                      break;
                    }
                  }
                  var outputParts = [];
                  for (var i = samePartsLength; i < fromParts.length; i++) {
                    outputParts.push("..");
                  }
                  outputParts = outputParts.concat(toParts.slice(samePartsLength));
                  return outputParts.join("/");
                }
              };
              UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;
              TTY = {
                ttys: [],
                init: function init() {},
                shutdown: function shutdown() {},
                register: function register(dev, ops) {
                  TTY.ttys[dev] = {
                    input: [],
                    output: [],
                    ops: ops
                  };
                  FS.registerDevice(dev, TTY.stream_ops);
                },
                stream_ops: {
                  open: function open(stream) {
                    var tty = TTY.ttys[stream.node.rdev];
                    if (!tty) {
                      throw new FS.ErrnoError(43);
                    }
                    stream.tty = tty;
                    stream.seekable = false;
                  },
                  close: function close(stream) {
                    stream.tty.ops.fsync(stream.tty);
                  },
                  fsync: function fsync(stream) {
                    stream.tty.ops.fsync(stream.tty);
                  },
                  read: function read(stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.get_char) {
                      throw new FS.ErrnoError(60);
                    }
                    var bytesRead = 0;
                    for (var i = 0; i < length; i++) {
                      var result;
                      try {
                        result = stream.tty.ops.get_char(stream.tty);
                      } catch (e) {
                        throw new FS.ErrnoError(29);
                      }
                      if (result === undefined && bytesRead === 0) {
                        throw new FS.ErrnoError(6);
                      }
                      if (result === null || result === undefined) break;
                      bytesRead++;
                      buffer[offset + i] = result;
                    }
                    if (bytesRead) {
                      stream.node.timestamp = Date.now();
                    }
                    return bytesRead;
                  },
                  write: function write(stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.put_char) {
                      throw new FS.ErrnoError(60);
                    }
                    try {
                      for (var i = 0; i < length; i++) {
                        stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
                      }
                    } catch (e) {
                      throw new FS.ErrnoError(29);
                    }
                    if (length) {
                      stream.node.timestamp = Date.now();
                    }
                    return i;
                  }
                },
                default_tty_ops: {
                  get_char: function get_char(tty) {
                    if (!tty.input.length) {
                      var result = null;
                      if (ENVIRONMENT_IS_NODE) {
                        var BUFSIZE = 256;
                        var buf = Buffer.alloc(BUFSIZE);
                        var bytesRead = 0;
                        try {
                          bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE, -1);
                        } catch (e) {
                          if (e.toString().includes("EOF")) bytesRead = 0;else throw e;
                        }
                        if (bytesRead > 0) {
                          result = buf.slice(0, bytesRead).toString("utf-8");
                        } else {
                          result = null;
                        }
                      } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                        result = window.prompt("Input: ");
                        if (result !== null) {
                          result += "\n";
                        }
                      } else if (typeof readline == "function") {
                        result = readline();
                        if (result !== null) {
                          result += "\n";
                        }
                      }
                      if (!result) {
                        return null;
                      }
                      tty.input = intArrayFromString(result, true);
                    }
                    return tty.input.shift();
                  },
                  put_char: function put_char(tty, val) {
                    if (val === null || val === 10) {
                      out(UTF8ArrayToString(tty.output, 0));
                      tty.output = [];
                    } else {
                      if (val != 0) tty.output.push(val);
                    }
                  },
                  fsync: function fsync(tty) {
                    if (tty.output && tty.output.length > 0) {
                      out(UTF8ArrayToString(tty.output, 0));
                      tty.output = [];
                    }
                  }
                },
                default_tty1_ops: {
                  put_char: function put_char(tty, val) {
                    if (val === null || val === 10) {
                      err(UTF8ArrayToString(tty.output, 0));
                      tty.output = [];
                    } else {
                      if (val != 0) tty.output.push(val);
                    }
                  },
                  fsync: function fsync(tty) {
                    if (tty.output && tty.output.length > 0) {
                      err(UTF8ArrayToString(tty.output, 0));
                      tty.output = [];
                    }
                  }
                }
              };
              MEMFS = {
                ops_table: null,
                mount: function mount(_mount) {
                  return MEMFS.createNode(null, "/", 16384 | 511, 0);
                },
                createNode: function createNode(parent, name, mode, dev) {
                  if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
                    throw new FS.ErrnoError(63);
                  }
                  if (!MEMFS.ops_table) {
                    MEMFS.ops_table = {
                      dir: {
                        node: {
                          getattr: MEMFS.node_ops.getattr,
                          setattr: MEMFS.node_ops.setattr,
                          lookup: MEMFS.node_ops.lookup,
                          mknod: MEMFS.node_ops.mknod,
                          rename: MEMFS.node_ops.rename,
                          unlink: MEMFS.node_ops.unlink,
                          rmdir: MEMFS.node_ops.rmdir,
                          readdir: MEMFS.node_ops.readdir,
                          symlink: MEMFS.node_ops.symlink
                        },
                        stream: {
                          llseek: MEMFS.stream_ops.llseek
                        }
                      },
                      file: {
                        node: {
                          getattr: MEMFS.node_ops.getattr,
                          setattr: MEMFS.node_ops.setattr
                        },
                        stream: {
                          llseek: MEMFS.stream_ops.llseek,
                          read: MEMFS.stream_ops.read,
                          write: MEMFS.stream_ops.write,
                          allocate: MEMFS.stream_ops.allocate,
                          mmap: MEMFS.stream_ops.mmap,
                          msync: MEMFS.stream_ops.msync
                        }
                      },
                      link: {
                        node: {
                          getattr: MEMFS.node_ops.getattr,
                          setattr: MEMFS.node_ops.setattr,
                          readlink: MEMFS.node_ops.readlink
                        },
                        stream: {}
                      },
                      chrdev: {
                        node: {
                          getattr: MEMFS.node_ops.getattr,
                          setattr: MEMFS.node_ops.setattr
                        },
                        stream: FS.chrdev_stream_ops
                      }
                    };
                  }
                  var node = FS.createNode(parent, name, mode, dev);
                  if (FS.isDir(node.mode)) {
                    node.node_ops = MEMFS.ops_table.dir.node;
                    node.stream_ops = MEMFS.ops_table.dir.stream;
                    node.contents = {};
                  } else if (FS.isFile(node.mode)) {
                    node.node_ops = MEMFS.ops_table.file.node;
                    node.stream_ops = MEMFS.ops_table.file.stream;
                    node.usedBytes = 0;
                    node.contents = null;
                  } else if (FS.isLink(node.mode)) {
                    node.node_ops = MEMFS.ops_table.link.node;
                    node.stream_ops = MEMFS.ops_table.link.stream;
                  } else if (FS.isChrdev(node.mode)) {
                    node.node_ops = MEMFS.ops_table.chrdev.node;
                    node.stream_ops = MEMFS.ops_table.chrdev.stream;
                  }
                  node.timestamp = Date.now();
                  if (parent) {
                    parent.contents[name] = node;
                    parent.timestamp = node.timestamp;
                  }
                  return node;
                },
                getFileDataAsTypedArray: function getFileDataAsTypedArray(node) {
                  if (!node.contents) return new Uint8Array(0);
                  if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
                  return new Uint8Array(node.contents);
                },
                expandFileStorage: function expandFileStorage(node, newCapacity) {
                  var prevCapacity = node.contents ? node.contents.length : 0;
                  if (prevCapacity >= newCapacity) return;
                  var CAPACITY_DOUBLING_MAX = 1024 * 1024;
                  newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
                  if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
                  var oldContents = node.contents;
                  node.contents = new Uint8Array(newCapacity);
                  if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
                },
                resizeFileStorage: function resizeFileStorage(node, newSize) {
                  if (node.usedBytes == newSize) return;
                  if (newSize == 0) {
                    node.contents = null;
                    node.usedBytes = 0;
                  } else {
                    var oldContents = node.contents;
                    node.contents = new Uint8Array(newSize);
                    if (oldContents) {
                      node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
                    }
                    node.usedBytes = newSize;
                  }
                },
                node_ops: {
                  getattr: function getattr(node) {
                    var attr = {};
                    attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
                    attr.ino = node.id;
                    attr.mode = node.mode;
                    attr.nlink = 1;
                    attr.uid = 0;
                    attr.gid = 0;
                    attr.rdev = node.rdev;
                    if (FS.isDir(node.mode)) {
                      attr.size = 4096;
                    } else if (FS.isFile(node.mode)) {
                      attr.size = node.usedBytes;
                    } else if (FS.isLink(node.mode)) {
                      attr.size = node.link.length;
                    } else {
                      attr.size = 0;
                    }
                    attr.atime = new Date(node.timestamp);
                    attr.mtime = new Date(node.timestamp);
                    attr.ctime = new Date(node.timestamp);
                    attr.blksize = 4096;
                    attr.blocks = Math.ceil(attr.size / attr.blksize);
                    return attr;
                  },
                  setattr: function setattr(node, attr) {
                    if (attr.mode !== undefined) {
                      node.mode = attr.mode;
                    }
                    if (attr.timestamp !== undefined) {
                      node.timestamp = attr.timestamp;
                    }
                    if (attr.size !== undefined) {
                      MEMFS.resizeFileStorage(node, attr.size);
                    }
                  },
                  lookup: function lookup(parent, name) {
                    throw FS.genericErrors[44];
                  },
                  mknod: function mknod(parent, name, mode, dev) {
                    return MEMFS.createNode(parent, name, mode, dev);
                  },
                  rename: function rename(old_node, new_dir, new_name) {
                    if (FS.isDir(old_node.mode)) {
                      var new_node;
                      try {
                        new_node = FS.lookupNode(new_dir, new_name);
                      } catch (e) {}
                      if (new_node) {
                        for (var i in new_node.contents) {
                          throw new FS.ErrnoError(55);
                        }
                      }
                    }
                    delete old_node.parent.contents[old_node.name];
                    old_node.parent.timestamp = Date.now();
                    old_node.name = new_name;
                    new_dir.contents[new_name] = old_node;
                    new_dir.timestamp = old_node.parent.timestamp;
                    old_node.parent = new_dir;
                  },
                  unlink: function unlink(parent, name) {
                    delete parent.contents[name];
                    parent.timestamp = Date.now();
                  },
                  rmdir: function rmdir(parent, name) {
                    var node = FS.lookupNode(parent, name);
                    for (var i in node.contents) {
                      throw new FS.ErrnoError(55);
                    }
                    delete parent.contents[name];
                    parent.timestamp = Date.now();
                  },
                  readdir: function readdir(node) {
                    var entries = [".", ".."];
                    for (var key in node.contents) {
                      if (!node.contents.hasOwnProperty(key)) {
                        continue;
                      }
                      entries.push(key);
                    }
                    return entries;
                  },
                  symlink: function symlink(parent, newname, oldpath) {
                    var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
                    node.link = oldpath;
                    return node;
                  },
                  readlink: function readlink(node) {
                    if (!FS.isLink(node.mode)) {
                      throw new FS.ErrnoError(28);
                    }
                    return node.link;
                  }
                },
                stream_ops: {
                  read: function read(stream, buffer, offset, length, position) {
                    var contents = stream.node.contents;
                    if (position >= stream.node.usedBytes) return 0;
                    var size = Math.min(stream.node.usedBytes - position, length);
                    if (size > 8 && contents.subarray) {
                      buffer.set(contents.subarray(position, position + size), offset);
                    } else {
                      for (var i = 0; i < size; i++) {
                        buffer[offset + i] = contents[position + i];
                      }
                    }
                    return size;
                  },
                  write: function write(stream, buffer, offset, length, position, canOwn) {
                    if (buffer.buffer === HEAP8.buffer) {
                      canOwn = false;
                    }
                    if (!length) return 0;
                    var node = stream.node;
                    node.timestamp = Date.now();
                    if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                      if (canOwn) {
                        node.contents = buffer.subarray(offset, offset + length);
                        node.usedBytes = length;
                        return length;
                      } else if (node.usedBytes === 0 && position === 0) {
                        node.contents = buffer.slice(offset, offset + length);
                        node.usedBytes = length;
                        return length;
                      } else if (position + length <= node.usedBytes) {
                        node.contents.set(buffer.subarray(offset, offset + length), position);
                        return length;
                      }
                    }
                    MEMFS.expandFileStorage(node, position + length);
                    if (node.contents.subarray && buffer.subarray) {
                      node.contents.set(buffer.subarray(offset, offset + length), position);
                    } else {
                      for (var i = 0; i < length; i++) {
                        node.contents[position + i] = buffer[offset + i];
                      }
                    }
                    node.usedBytes = Math.max(node.usedBytes, position + length);
                    return length;
                  },
                  llseek: function llseek(stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) {
                      position += stream.position;
                    } else if (whence === 2) {
                      if (FS.isFile(stream.node.mode)) {
                        position += stream.node.usedBytes;
                      }
                    }
                    if (position < 0) {
                      throw new FS.ErrnoError(28);
                    }
                    return position;
                  },
                  allocate: function allocate(stream, offset, length) {
                    MEMFS.expandFileStorage(stream.node, offset + length);
                    stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
                  },
                  mmap: function mmap(stream, length, position, prot, flags) {
                    if (!FS.isFile(stream.node.mode)) {
                      throw new FS.ErrnoError(43);
                    }
                    var ptr;
                    var allocated;
                    var contents = stream.node.contents;
                    if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
                      allocated = false;
                      ptr = contents.byteOffset;
                    } else {
                      if (position > 0 || position + length < contents.length) {
                        if (contents.subarray) {
                          contents = contents.subarray(position, position + length);
                        } else {
                          contents = Array.prototype.slice.call(contents, position, position + length);
                        }
                      }
                      allocated = true;
                      ptr = mmapAlloc(length);
                      if (!ptr) {
                        throw new FS.ErrnoError(48);
                      }
                      HEAP8.set(contents, ptr);
                    }
                    return {
                      ptr: ptr,
                      allocated: allocated
                    };
                  },
                  msync: function msync(stream, buffer, offset, length, mmapFlags) {
                    MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
                    return 0;
                  }
                }
              };
              preloadPlugins = Module["preloadPlugins"] || [];
              FS = {
                root: null,
                mounts: [],
                devices: {},
                streams: [],
                nextInode: 1,
                nameTable: null,
                currentPath: "/",
                initialized: false,
                ignorePermissions: true,
                ErrnoError: null,
                genericErrors: {},
                filesystems: null,
                syncFSRequests: 0,
                lookupPath: function lookupPath(path) {
                  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                  path = PATH_FS.resolve(path);
                  if (!path) return {
                    path: "",
                    node: null
                  };
                  var defaults = {
                    follow_mount: true,
                    recurse_count: 0
                  };
                  opts = Object.assign(defaults, opts);
                  if (opts.recurse_count > 8) {
                    throw new FS.ErrnoError(32);
                  }
                  var parts = path.split("/").filter(function (p) {
                    return !!p;
                  });
                  var current = FS.root;
                  var current_path = "/";
                  for (var i = 0; i < parts.length; i++) {
                    var islast = i === parts.length - 1;
                    if (islast && opts.parent) {
                      break;
                    }
                    current = FS.lookupNode(current, parts[i]);
                    current_path = PATH.join2(current_path, parts[i]);
                    if (FS.isMountpoint(current)) {
                      if (!islast || islast && opts.follow_mount) {
                        current = current.mounted.root;
                      }
                    }
                    if (!islast || opts.follow) {
                      var count = 0;
                      while (FS.isLink(current.mode)) {
                        var link = FS.readlink(current_path);
                        current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                        var lookup = FS.lookupPath(current_path, {
                          recurse_count: opts.recurse_count + 1
                        });
                        current = lookup.node;
                        if (count++ > 40) {
                          throw new FS.ErrnoError(32);
                        }
                      }
                    }
                  }
                  return {
                    path: current_path,
                    node: current
                  };
                },
                getPath: function getPath(node) {
                  var path;
                  while (true) {
                    if (FS.isRoot(node)) {
                      var mount = node.mount.mountpoint;
                      if (!path) return mount;
                      return mount[mount.length - 1] !== "/" ? "".concat(mount, "/").concat(path) : mount + path;
                    }
                    path = path ? "".concat(node.name, "/").concat(path) : node.name;
                    node = node.parent;
                  }
                },
                hashName: function hashName(parentid, name) {
                  var hash = 0;
                  for (var i = 0; i < name.length; i++) {
                    hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
                  }
                  return (parentid + hash >>> 0) % FS.nameTable.length;
                },
                hashAddNode: function hashAddNode(node) {
                  var hash = FS.hashName(node.parent.id, node.name);
                  node.name_next = FS.nameTable[hash];
                  FS.nameTable[hash] = node;
                },
                hashRemoveNode: function hashRemoveNode(node) {
                  var hash = FS.hashName(node.parent.id, node.name);
                  if (FS.nameTable[hash] === node) {
                    FS.nameTable[hash] = node.name_next;
                  } else {
                    var current = FS.nameTable[hash];
                    while (current) {
                      if (current.name_next === node) {
                        current.name_next = node.name_next;
                        break;
                      }
                      current = current.name_next;
                    }
                  }
                },
                lookupNode: function lookupNode(parent, name) {
                  var errCode = FS.mayLookup(parent);
                  if (errCode) {
                    throw new FS.ErrnoError(errCode, parent);
                  }
                  var hash = FS.hashName(parent.id, name);
                  for (var node = FS.nameTable[hash]; node; node = node.name_next) {
                    var nodeName = node.name;
                    if (node.parent.id === parent.id && nodeName === name) {
                      return node;
                    }
                  }
                  return FS.lookup(parent, name);
                },
                createNode: function createNode(parent, name, mode, rdev) {
                  var node = new FS.FSNode(parent, name, mode, rdev);
                  FS.hashAddNode(node);
                  return node;
                },
                destroyNode: function destroyNode(node) {
                  FS.hashRemoveNode(node);
                },
                isRoot: function isRoot(node) {
                  return node === node.parent;
                },
                isMountpoint: function isMountpoint(node) {
                  return !!node.mounted;
                },
                isFile: function isFile(mode) {
                  return (mode & 61440) === 32768;
                },
                isDir: function isDir(mode) {
                  return (mode & 61440) === 16384;
                },
                isLink: function isLink(mode) {
                  return (mode & 61440) === 40960;
                },
                isChrdev: function isChrdev(mode) {
                  return (mode & 61440) === 8192;
                },
                isBlkdev: function isBlkdev(mode) {
                  return (mode & 61440) === 24576;
                },
                isFIFO: function isFIFO(mode) {
                  return (mode & 61440) === 4096;
                },
                isSocket: function isSocket(mode) {
                  return (mode & 49152) === 49152;
                },
                flagsToPermissionString: function flagsToPermissionString(flag) {
                  var perms = ["r", "w", "rw"][flag & 3];
                  if (flag & 512) {
                    perms += "w";
                  }
                  return perms;
                },
                nodePermissions: function nodePermissions(node, perms) {
                  if (FS.ignorePermissions) {
                    return 0;
                  }
                  if (perms.includes("r") && !(node.mode & 292)) {
                    return 2;
                  } else if (perms.includes("w") && !(node.mode & 146)) {
                    return 2;
                  } else if (perms.includes("x") && !(node.mode & 73)) {
                    return 2;
                  }
                  return 0;
                },
                mayLookup: function mayLookup(dir) {
                  var errCode = FS.nodePermissions(dir, "x");
                  if (errCode) return errCode;
                  if (!dir.node_ops.lookup) return 2;
                  return 0;
                },
                mayCreate: function mayCreate(dir, name) {
                  try {
                    var node = FS.lookupNode(dir, name);
                    return 20;
                  } catch (e) {}
                  return FS.nodePermissions(dir, "wx");
                },
                mayDelete: function mayDelete(dir, name, isdir) {
                  var node;
                  try {
                    node = FS.lookupNode(dir, name);
                  } catch (e) {
                    return e.errno;
                  }
                  var errCode = FS.nodePermissions(dir, "wx");
                  if (errCode) {
                    return errCode;
                  }
                  if (isdir) {
                    if (!FS.isDir(node.mode)) {
                      return 54;
                    }
                    if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                      return 10;
                    }
                  } else {
                    if (FS.isDir(node.mode)) {
                      return 31;
                    }
                  }
                  return 0;
                },
                mayOpen: function mayOpen(node, flags) {
                  if (!node) {
                    return 44;
                  }
                  if (FS.isLink(node.mode)) {
                    return 32;
                  } else if (FS.isDir(node.mode)) {
                    if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                      return 31;
                    }
                  }
                  return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
                },
                MAX_OPEN_FDS: 4096,
                nextfd: function nextfd() {
                  var fd_start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                  var fd_end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FS.MAX_OPEN_FDS;
                  for (var fd = fd_start; fd <= fd_end; fd++) {
                    if (!FS.streams[fd]) {
                      return fd;
                    }
                  }
                  throw new FS.ErrnoError(33);
                },
                getStream: function getStream(fd) {
                  return FS.streams[fd];
                },
                createStream: function createStream(stream, fd_start, fd_end) {
                  if (!FS.FSStream) {
                    FS.FSStream = function () {
                      this.shared = {};
                    };
                    FS.FSStream.prototype = {};
                    Object.defineProperties(FS.FSStream.prototype, {
                      object: {
                        get: function get() {
                          return this.node;
                        },
                        set: function set(val) {
                          this.node = val;
                        }
                      },
                      isRead: {
                        get: function get() {
                          return (this.flags & 2097155) !== 1;
                        }
                      },
                      isWrite: {
                        get: function get() {
                          return (this.flags & 2097155) !== 0;
                        }
                      },
                      isAppend: {
                        get: function get() {
                          return this.flags & 1024;
                        }
                      },
                      flags: {
                        get: function get() {
                          return this.shared.flags;
                        },
                        set: function set(val) {
                          this.shared.flags = val;
                        }
                      },
                      position: {
                        get: function get() {
                          return this.shared.position;
                        },
                        set: function set(val) {
                          this.shared.position = val;
                        }
                      }
                    });
                  }
                  stream = Object.assign(new FS.FSStream(), stream);
                  var fd = FS.nextfd(fd_start, fd_end);
                  stream.fd = fd;
                  FS.streams[fd] = stream;
                  return stream;
                },
                closeStream: function closeStream(fd) {
                  FS.streams[fd] = null;
                },
                chrdev_stream_ops: {
                  open: function open(stream) {
                    var device = FS.getDevice(stream.node.rdev);
                    stream.stream_ops = device.stream_ops;
                    if (stream.stream_ops.open) {
                      stream.stream_ops.open(stream);
                    }
                  },
                  llseek: function llseek() {
                    throw new FS.ErrnoError(70);
                  }
                },
                major: function major(dev) {
                  return dev >> 8;
                },
                minor: function minor(dev) {
                  return dev & 255;
                },
                makedev: function makedev(ma, mi) {
                  return ma << 8 | mi;
                },
                registerDevice: function registerDevice(dev, ops) {
                  FS.devices[dev] = {
                    stream_ops: ops
                  };
                },
                getDevice: function getDevice(dev) {
                  return FS.devices[dev];
                },
                getMounts: function getMounts(mount) {
                  var mounts = [];
                  var check = [mount];
                  while (check.length) {
                    var m = check.pop();
                    mounts.push(m);
                    check.push.apply(check, m.mounts);
                  }
                  return mounts;
                },
                syncfs: function syncfs(populate, callback) {
                  if (typeof populate == "function") {
                    callback = populate;
                    populate = false;
                  }
                  FS.syncFSRequests++;
                  if (FS.syncFSRequests > 1) {
                    err("warning: ".concat(FS.syncFSRequests, " FS.syncfs operations in flight at once, probably just doing extra work"));
                  }
                  var mounts = FS.getMounts(FS.root.mount);
                  var completed = 0;
                  function doCallback(errCode) {
                    FS.syncFSRequests--;
                    return callback(errCode);
                  }
                  function done(errCode) {
                    if (errCode) {
                      if (!done.errored) {
                        done.errored = true;
                        return doCallback(errCode);
                      }
                      return;
                    }
                    if (++completed >= mounts.length) {
                      doCallback(null);
                    }
                  }
                  mounts.forEach(function (mount) {
                    if (!mount.type.syncfs) {
                      return done(null);
                    }
                    mount.type.syncfs(mount, populate, done);
                  });
                },
                mount: function mount(type, opts, mountpoint) {
                  var root = mountpoint === "/";
                  var pseudo = !mountpoint;
                  var node;
                  if (root && FS.root) {
                    throw new FS.ErrnoError(10);
                  } else if (!root && !pseudo) {
                    var lookup = FS.lookupPath(mountpoint, {
                      follow_mount: false
                    });
                    mountpoint = lookup.path;
                    node = lookup.node;
                    if (FS.isMountpoint(node)) {
                      throw new FS.ErrnoError(10);
                    }
                    if (!FS.isDir(node.mode)) {
                      throw new FS.ErrnoError(54);
                    }
                  }
                  var mount = {
                    type: type,
                    opts: opts,
                    mountpoint: mountpoint,
                    mounts: []
                  };
                  var mountRoot = type.mount(mount);
                  mountRoot.mount = mount;
                  mount.root = mountRoot;
                  if (root) {
                    FS.root = mountRoot;
                  } else if (node) {
                    node.mounted = mount;
                    if (node.mount) {
                      node.mount.mounts.push(mount);
                    }
                  }
                  return mountRoot;
                },
                unmount: function unmount(mountpoint) {
                  var lookup = FS.lookupPath(mountpoint, {
                    follow_mount: false
                  });
                  if (!FS.isMountpoint(lookup.node)) {
                    throw new FS.ErrnoError(28);
                  }
                  var node = lookup.node;
                  var mount = node.mounted;
                  var mounts = FS.getMounts(mount);
                  Object.keys(FS.nameTable).forEach(function (hash) {
                    var current = FS.nameTable[hash];
                    while (current) {
                      var next = current.name_next;
                      if (mounts.includes(current.mount)) {
                        FS.destroyNode(current);
                      }
                      current = next;
                    }
                  });
                  node.mounted = null;
                  var idx = node.mount.mounts.indexOf(mount);
                  node.mount.mounts.splice(idx, 1);
                },
                lookup: function lookup(parent, name) {
                  return parent.node_ops.lookup(parent, name);
                },
                mknod: function mknod(path, mode, dev) {
                  var lookup = FS.lookupPath(path, {
                    parent: true
                  });
                  var parent = lookup.node;
                  var name = PATH.basename(path);
                  if (!name || name === "." || name === "..") {
                    throw new FS.ErrnoError(28);
                  }
                  var errCode = FS.mayCreate(parent, name);
                  if (errCode) {
                    throw new FS.ErrnoError(errCode);
                  }
                  if (!parent.node_ops.mknod) {
                    throw new FS.ErrnoError(63);
                  }
                  return parent.node_ops.mknod(parent, name, mode, dev);
                },
                create: function create(path, mode) {
                  mode = mode !== undefined ? mode : 438;
                  mode &= 4095;
                  mode |= 32768;
                  return FS.mknod(path, mode, 0);
                },
                mkdir: function mkdir(path, mode) {
                  mode = mode !== undefined ? mode : 511;
                  mode &= 511 | 512;
                  mode |= 16384;
                  return FS.mknod(path, mode, 0);
                },
                mkdirTree: function mkdirTree(path, mode) {
                  var dirs = path.split("/");
                  var d = "";
                  for (var i = 0; i < dirs.length; ++i) {
                    if (!dirs[i]) continue;
                    d += "/" + dirs[i];
                    try {
                      FS.mkdir(d, mode);
                    } catch (e) {
                      if (e.errno != 20) throw e;
                    }
                  }
                },
                mkdev: function mkdev(path, mode, dev) {
                  if (typeof dev == "undefined") {
                    dev = mode;
                    mode = 438;
                  }
                  mode |= 8192;
                  return FS.mknod(path, mode, dev);
                },
                symlink: function symlink(oldpath, newpath) {
                  if (!PATH_FS.resolve(oldpath)) {
                    throw new FS.ErrnoError(44);
                  }
                  var lookup = FS.lookupPath(newpath, {
                    parent: true
                  });
                  var parent = lookup.node;
                  if (!parent) {
                    throw new FS.ErrnoError(44);
                  }
                  var newname = PATH.basename(newpath);
                  var errCode = FS.mayCreate(parent, newname);
                  if (errCode) {
                    throw new FS.ErrnoError(errCode);
                  }
                  if (!parent.node_ops.symlink) {
                    throw new FS.ErrnoError(63);
                  }
                  return parent.node_ops.symlink(parent, newname, oldpath);
                },
                rename: function rename(old_path, new_path) {
                  var old_dirname = PATH.dirname(old_path);
                  var new_dirname = PATH.dirname(new_path);
                  var old_name = PATH.basename(old_path);
                  var new_name = PATH.basename(new_path);
                  var lookup, old_dir, new_dir;
                  lookup = FS.lookupPath(old_path, {
                    parent: true
                  });
                  old_dir = lookup.node;
                  lookup = FS.lookupPath(new_path, {
                    parent: true
                  });
                  new_dir = lookup.node;
                  if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
                  if (old_dir.mount !== new_dir.mount) {
                    throw new FS.ErrnoError(75);
                  }
                  var old_node = FS.lookupNode(old_dir, old_name);
                  var relative = PATH_FS.relative(old_path, new_dirname);
                  if (relative.charAt(0) !== ".") {
                    throw new FS.ErrnoError(28);
                  }
                  relative = PATH_FS.relative(new_path, old_dirname);
                  if (relative.charAt(0) !== ".") {
                    throw new FS.ErrnoError(55);
                  }
                  var new_node;
                  try {
                    new_node = FS.lookupNode(new_dir, new_name);
                  } catch (e) {}
                  if (old_node === new_node) {
                    return;
                  }
                  var isdir = FS.isDir(old_node.mode);
                  var errCode = FS.mayDelete(old_dir, old_name, isdir);
                  if (errCode) {
                    throw new FS.ErrnoError(errCode);
                  }
                  errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
                  if (errCode) {
                    throw new FS.ErrnoError(errCode);
                  }
                  if (!old_dir.node_ops.rename) {
                    throw new FS.ErrnoError(63);
                  }
                  if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
                    throw new FS.ErrnoError(10);
                  }
                  if (new_dir !== old_dir) {
                    errCode = FS.nodePermissions(old_dir, "w");
                    if (errCode) {
                      throw new FS.ErrnoError(errCode);
                    }
                  }
                  FS.hashRemoveNode(old_node);
                  try {
                    old_dir.node_ops.rename(old_node, new_dir, new_name);
                  } catch (e) {
                    throw e;
                  } finally {
                    FS.hashAddNode(old_node);
                  }
                },
                rmdir: function rmdir(path) {
                  var lookup = FS.lookupPath(path, {
                    parent: true
                  });
                  var parent = lookup.node;
                  var name = PATH.basename(path);
                  var node = FS.lookupNode(parent, name);
                  var errCode = FS.mayDelete(parent, name, true);
                  if (errCode) {
                    throw new FS.ErrnoError(errCode);
                  }
                  if (!parent.node_ops.rmdir) {
                    throw new FS.ErrnoError(63);
                  }
                  if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(10);
                  }
                  parent.node_ops.rmdir(parent, name);
                  FS.destroyNode(node);
                },
                readdir: function readdir(path) {
                  var lookup = FS.lookupPath(path, {
                    follow: true
                  });
                  var node = lookup.node;
                  if (!node.node_ops.readdir) {
                    throw new FS.ErrnoError(54);
                  }
                  return node.node_ops.readdir(node);
                },
                unlink: function unlink(path) {
                  var lookup = FS.lookupPath(path, {
                    parent: true
                  });
                  var parent = lookup.node;
                  if (!parent) {
                    throw new FS.ErrnoError(44);
                  }
                  var name = PATH.basename(path);
                  var node = FS.lookupNode(parent, name);
                  var errCode = FS.mayDelete(parent, name, false);
                  if (errCode) {
                    throw new FS.ErrnoError(errCode);
                  }
                  if (!parent.node_ops.unlink) {
                    throw new FS.ErrnoError(63);
                  }
                  if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(10);
                  }
                  parent.node_ops.unlink(parent, name);
                  FS.destroyNode(node);
                },
                readlink: function readlink(path) {
                  var lookup = FS.lookupPath(path);
                  var link = lookup.node;
                  if (!link) {
                    throw new FS.ErrnoError(44);
                  }
                  if (!link.node_ops.readlink) {
                    throw new FS.ErrnoError(28);
                  }
                  return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
                },
                stat: function stat(path, dontFollow) {
                  var lookup = FS.lookupPath(path, {
                    follow: !dontFollow
                  });
                  var node = lookup.node;
                  if (!node) {
                    throw new FS.ErrnoError(44);
                  }
                  if (!node.node_ops.getattr) {
                    throw new FS.ErrnoError(63);
                  }
                  return node.node_ops.getattr(node);
                },
                lstat: function lstat(path) {
                  return FS.stat(path, true);
                },
                chmod: function chmod(path, mode, dontFollow) {
                  var node;
                  if (typeof path == "string") {
                    var lookup = FS.lookupPath(path, {
                      follow: !dontFollow
                    });
                    node = lookup.node;
                  } else {
                    node = path;
                  }
                  if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(63);
                  }
                  node.node_ops.setattr(node, {
                    mode: mode & 4095 | node.mode & ~4095,
                    timestamp: Date.now()
                  });
                },
                lchmod: function lchmod(path, mode) {
                  FS.chmod(path, mode, true);
                },
                fchmod: function fchmod(fd, mode) {
                  var stream = FS.getStream(fd);
                  if (!stream) {
                    throw new FS.ErrnoError(8);
                  }
                  FS.chmod(stream.node, mode);
                },
                chown: function chown(path, uid, gid, dontFollow) {
                  var node;
                  if (typeof path == "string") {
                    var lookup = FS.lookupPath(path, {
                      follow: !dontFollow
                    });
                    node = lookup.node;
                  } else {
                    node = path;
                  }
                  if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(63);
                  }
                  node.node_ops.setattr(node, {
                    timestamp: Date.now()
                  });
                },
                lchown: function lchown(path, uid, gid) {
                  FS.chown(path, uid, gid, true);
                },
                fchown: function fchown(fd, uid, gid) {
                  var stream = FS.getStream(fd);
                  if (!stream) {
                    throw new FS.ErrnoError(8);
                  }
                  FS.chown(stream.node, uid, gid);
                },
                truncate: function truncate(path, len) {
                  if (len < 0) {
                    throw new FS.ErrnoError(28);
                  }
                  var node;
                  if (typeof path == "string") {
                    var lookup = FS.lookupPath(path, {
                      follow: true
                    });
                    node = lookup.node;
                  } else {
                    node = path;
                  }
                  if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(63);
                  }
                  if (FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(31);
                  }
                  if (!FS.isFile(node.mode)) {
                    throw new FS.ErrnoError(28);
                  }
                  var errCode = FS.nodePermissions(node, "w");
                  if (errCode) {
                    throw new FS.ErrnoError(errCode);
                  }
                  node.node_ops.setattr(node, {
                    size: len,
                    timestamp: Date.now()
                  });
                },
                ftruncate: function ftruncate(fd, len) {
                  var stream = FS.getStream(fd);
                  if (!stream) {
                    throw new FS.ErrnoError(8);
                  }
                  if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(28);
                  }
                  FS.truncate(stream.node, len);
                },
                utime: function utime(path, atime, mtime) {
                  var lookup = FS.lookupPath(path, {
                    follow: true
                  });
                  var node = lookup.node;
                  node.node_ops.setattr(node, {
                    timestamp: Math.max(atime, mtime)
                  });
                },
                open: function open(path, flags, mode) {
                  if (path === "") {
                    throw new FS.ErrnoError(44);
                  }
                  flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
                  mode = typeof mode == "undefined" ? 438 : mode;
                  if (flags & 64) {
                    mode = mode & 4095 | 32768;
                  } else {
                    mode = 0;
                  }
                  var node;
                  if (_typeof(path) == "object") {
                    node = path;
                  } else {
                    path = PATH.normalize(path);
                    try {
                      var lookup = FS.lookupPath(path, {
                        follow: !(flags & 131072)
                      });
                      node = lookup.node;
                    } catch (e) {}
                  }
                  var created = false;
                  if (flags & 64) {
                    if (node) {
                      if (flags & 128) {
                        throw new FS.ErrnoError(20);
                      }
                    } else {
                      node = FS.mknod(path, mode, 0);
                      created = true;
                    }
                  }
                  if (!node) {
                    throw new FS.ErrnoError(44);
                  }
                  if (FS.isChrdev(node.mode)) {
                    flags &= ~512;
                  }
                  if (flags & 65536 && !FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(54);
                  }
                  if (!created) {
                    var errCode = FS.mayOpen(node, flags);
                    if (errCode) {
                      throw new FS.ErrnoError(errCode);
                    }
                  }
                  if (flags & 512 && !created) {
                    FS.truncate(node, 0);
                  }
                  flags &= ~(128 | 512 | 131072);
                  var stream = FS.createStream({
                    node: node,
                    path: FS.getPath(node),
                    flags: flags,
                    seekable: true,
                    position: 0,
                    stream_ops: node.stream_ops,
                    ungotten: [],
                    error: false
                  });
                  if (stream.stream_ops.open) {
                    stream.stream_ops.open(stream);
                  }
                  if (Module["logReadFiles"] && !(flags & 1)) {
                    if (!FS.readFiles) FS.readFiles = {};
                    if (!(path in FS.readFiles)) {
                      FS.readFiles[path] = 1;
                    }
                  }
                  return stream;
                },
                close: function close(stream) {
                  if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                  }
                  if (stream.getdents) stream.getdents = null;
                  try {
                    if (stream.stream_ops.close) {
                      stream.stream_ops.close(stream);
                    }
                  } catch (e) {
                    throw e;
                  } finally {
                    FS.closeStream(stream.fd);
                  }
                  stream.fd = null;
                },
                isClosed: function isClosed(stream) {
                  return stream.fd === null;
                },
                llseek: function llseek(stream, offset, whence) {
                  if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                  }
                  if (!stream.seekable || !stream.stream_ops.llseek) {
                    throw new FS.ErrnoError(70);
                  }
                  if (whence != 0 && whence != 1 && whence != 2) {
                    throw new FS.ErrnoError(28);
                  }
                  stream.position = stream.stream_ops.llseek(stream, offset, whence);
                  stream.ungotten = [];
                  return stream.position;
                },
                read: function read(stream, buffer, offset, length, position) {
                  if (length < 0 || position < 0) {
                    throw new FS.ErrnoError(28);
                  }
                  if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                  }
                  if ((stream.flags & 2097155) === 1) {
                    throw new FS.ErrnoError(8);
                  }
                  if (FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(31);
                  }
                  if (!stream.stream_ops.read) {
                    throw new FS.ErrnoError(28);
                  }
                  var seeking = typeof position != "undefined";
                  if (!seeking) {
                    position = stream.position;
                  } else if (!stream.seekable) {
                    throw new FS.ErrnoError(70);
                  }
                  var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
                  if (!seeking) stream.position += bytesRead;
                  return bytesRead;
                },
                write: function write(stream, buffer, offset, length, position, canOwn) {
                  if (length < 0 || position < 0) {
                    throw new FS.ErrnoError(28);
                  }
                  if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                  }
                  if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(8);
                  }
                  if (FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(31);
                  }
                  if (!stream.stream_ops.write) {
                    throw new FS.ErrnoError(28);
                  }
                  if (stream.seekable && stream.flags & 1024) {
                    FS.llseek(stream, 0, 2);
                  }
                  var seeking = typeof position != "undefined";
                  if (!seeking) {
                    position = stream.position;
                  } else if (!stream.seekable) {
                    throw new FS.ErrnoError(70);
                  }
                  var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
                  if (!seeking) stream.position += bytesWritten;
                  return bytesWritten;
                },
                allocate: function allocate(stream, offset, length) {
                  if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                  }
                  if (offset < 0 || length <= 0) {
                    throw new FS.ErrnoError(28);
                  }
                  if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(8);
                  }
                  if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(43);
                  }
                  if (!stream.stream_ops.allocate) {
                    throw new FS.ErrnoError(138);
                  }
                  stream.stream_ops.allocate(stream, offset, length);
                },
                mmap: function mmap(stream, length, position, prot, flags) {
                  if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
                    throw new FS.ErrnoError(2);
                  }
                  if ((stream.flags & 2097155) === 1) {
                    throw new FS.ErrnoError(2);
                  }
                  if (!stream.stream_ops.mmap) {
                    throw new FS.ErrnoError(43);
                  }
                  return stream.stream_ops.mmap(stream, length, position, prot, flags);
                },
                msync: function msync(stream, buffer, offset, length, mmapFlags) {
                  if (!stream.stream_ops.msync) {
                    return 0;
                  }
                  return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
                },
                munmap: function munmap(stream) {
                  return 0;
                },
                ioctl: function ioctl(stream, cmd, arg) {
                  if (!stream.stream_ops.ioctl) {
                    throw new FS.ErrnoError(59);
                  }
                  return stream.stream_ops.ioctl(stream, cmd, arg);
                },
                readFile: function readFile(path) {
                  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                  opts.flags = opts.flags || 0;
                  opts.encoding = opts.encoding || "binary";
                  if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
                    throw new Error("Invalid encoding type \"".concat(opts.encoding, "\""));
                  }
                  var ret;
                  var stream = FS.open(path, opts.flags);
                  var stat = FS.stat(path);
                  var length = stat.size;
                  var buf = new Uint8Array(length);
                  FS.read(stream, buf, 0, length, 0);
                  if (opts.encoding === "utf8") {
                    ret = UTF8ArrayToString(buf, 0);
                  } else if (opts.encoding === "binary") {
                    ret = buf;
                  }
                  FS.close(stream);
                  return ret;
                },
                writeFile: function writeFile(path, data) {
                  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                  opts.flags = opts.flags || 577;
                  var stream = FS.open(path, opts.flags, opts.mode);
                  if (typeof data == "string") {
                    var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
                    var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
                    FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
                  } else if (ArrayBuffer.isView(data)) {
                    FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
                  } else {
                    throw new Error("Unsupported data type");
                  }
                  FS.close(stream);
                },
                cwd: function cwd() {
                  return FS.currentPath;
                },
                chdir: function chdir(path) {
                  var lookup = FS.lookupPath(path, {
                    follow: true
                  });
                  if (lookup.node === null) {
                    throw new FS.ErrnoError(44);
                  }
                  if (!FS.isDir(lookup.node.mode)) {
                    throw new FS.ErrnoError(54);
                  }
                  var errCode = FS.nodePermissions(lookup.node, "x");
                  if (errCode) {
                    throw new FS.ErrnoError(errCode);
                  }
                  FS.currentPath = lookup.path;
                },
                createDefaultDirectories: function createDefaultDirectories() {
                  FS.mkdir("/tmp");
                  FS.mkdir("/home");
                  FS.mkdir("/home/web_user");
                },
                createDefaultDevices: function createDefaultDevices() {
                  FS.mkdir("/dev");
                  FS.registerDevice(FS.makedev(1, 3), {
                    read: function read() {
                      return 0;
                    },
                    write: function write(stream, buffer, offset, length, pos) {
                      return length;
                    }
                  });
                  FS.mkdev("/dev/null", FS.makedev(1, 3));
                  TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
                  TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
                  FS.mkdev("/dev/tty", FS.makedev(5, 0));
                  FS.mkdev("/dev/tty1", FS.makedev(6, 0));
                  var randomBuffer = new Uint8Array(1024),
                    randomLeft = 0;
                  var randomByte = function randomByte() {
                    if (randomLeft === 0) {
                      randomLeft = randomFill(randomBuffer).byteLength;
                    }
                    return randomBuffer[--randomLeft];
                  };
                  FS.createDevice("/dev", "random", randomByte);
                  FS.createDevice("/dev", "urandom", randomByte);
                  FS.mkdir("/dev/shm");
                  FS.mkdir("/dev/shm/tmp");
                },
                createSpecialDirectories: function createSpecialDirectories() {
                  FS.mkdir("/proc");
                  var proc_self = FS.mkdir("/proc/self");
                  FS.mkdir("/proc/self/fd");
                  FS.mount({
                    mount: function mount() {
                      var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
                      node.node_ops = {
                        lookup: function lookup(parent, name) {
                          var fd = +name;
                          var stream = FS.getStream(fd);
                          if (!stream) throw new FS.ErrnoError(8);
                          var ret = {
                            parent: null,
                            mount: {
                              mountpoint: "fake"
                            },
                            node_ops: {
                              readlink: function readlink() {
                                return stream.path;
                              }
                            }
                          };
                          ret.parent = ret;
                          return ret;
                        }
                      };
                      return node;
                    }
                  }, {}, "/proc/self/fd");
                },
                createStandardStreams: function createStandardStreams() {
                  if (Module["stdin"]) {
                    FS.createDevice("/dev", "stdin", Module["stdin"]);
                  } else {
                    FS.symlink("/dev/tty", "/dev/stdin");
                  }
                  if (Module["stdout"]) {
                    FS.createDevice("/dev", "stdout", null, Module["stdout"]);
                  } else {
                    FS.symlink("/dev/tty", "/dev/stdout");
                  }
                  if (Module["stderr"]) {
                    FS.createDevice("/dev", "stderr", null, Module["stderr"]);
                  } else {
                    FS.symlink("/dev/tty1", "/dev/stderr");
                  }
                  FS.open("/dev/stdin", 0);
                  FS.open("/dev/stdout", 1);
                  FS.open("/dev/stderr", 1);
                },
                ensureErrnoError: function ensureErrnoError() {
                  if (FS.ErrnoError) return;
                  FS.ErrnoError = function ErrnoError(errno, node) {
                    this.name = "ErrnoError";
                    this.node = node;
                    this.setErrno = function (errno) {
                      this.errno = errno;
                    };
                    this.setErrno(errno);
                    this.message = "FS error";
                  };
                  FS.ErrnoError.prototype = new Error();
                  FS.ErrnoError.prototype.constructor = FS.ErrnoError;
                  [44].forEach(function (code) {
                    FS.genericErrors[code] = new FS.ErrnoError(code);
                    FS.genericErrors[code].stack = "<generic error, no stack>";
                  });
                },
                staticInit: function staticInit() {
                  FS.ensureErrnoError();
                  FS.nameTable = new Array(4096);
                  FS.mount(MEMFS, {}, "/");
                  FS.createDefaultDirectories();
                  FS.createDefaultDevices();
                  FS.createSpecialDirectories();
                  FS.filesystems = {
                    "MEMFS": MEMFS
                  };
                },
                init: function init(input, output, error) {
                  FS.init.initialized = true;
                  FS.ensureErrnoError();
                  Module["stdin"] = input || Module["stdin"];
                  Module["stdout"] = output || Module["stdout"];
                  Module["stderr"] = error || Module["stderr"];
                  FS.createStandardStreams();
                },
                quit: function quit() {
                  FS.init.initialized = false;
                  for (var i = 0; i < FS.streams.length; i++) {
                    var stream = FS.streams[i];
                    if (!stream) {
                      continue;
                    }
                    FS.close(stream);
                  }
                },
                findObject: function findObject(path, dontResolveLastLink) {
                  var ret = FS.analyzePath(path, dontResolveLastLink);
                  if (!ret.exists) {
                    return null;
                  }
                  return ret.object;
                },
                analyzePath: function analyzePath(path, dontResolveLastLink) {
                  try {
                    var lookup = FS.lookupPath(path, {
                      follow: !dontResolveLastLink
                    });
                    path = lookup.path;
                  } catch (e) {}
                  var ret = {
                    isRoot: false,
                    exists: false,
                    error: 0,
                    name: null,
                    path: null,
                    object: null,
                    parentExists: false,
                    parentPath: null,
                    parentObject: null
                  };
                  try {
                    var lookup = FS.lookupPath(path, {
                      parent: true
                    });
                    ret.parentExists = true;
                    ret.parentPath = lookup.path;
                    ret.parentObject = lookup.node;
                    ret.name = PATH.basename(path);
                    lookup = FS.lookupPath(path, {
                      follow: !dontResolveLastLink
                    });
                    ret.exists = true;
                    ret.path = lookup.path;
                    ret.object = lookup.node;
                    ret.name = lookup.node.name;
                    ret.isRoot = lookup.path === "/";
                  } catch (e) {
                    ret.error = e.errno;
                  }
                  return ret;
                },
                createPath: function createPath(parent, path, canRead, canWrite) {
                  parent = typeof parent == "string" ? parent : FS.getPath(parent);
                  var parts = path.split("/").reverse();
                  while (parts.length) {
                    var part = parts.pop();
                    if (!part) continue;
                    var current = PATH.join2(parent, part);
                    try {
                      FS.mkdir(current);
                    } catch (e) {}
                    parent = current;
                  }
                  return current;
                },
                createFile: function createFile(parent, name, properties, canRead, canWrite) {
                  var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
                  var mode = FS_getMode(canRead, canWrite);
                  return FS.create(path, mode);
                },
                createDataFile: function createDataFile(parent, name, data, canRead, canWrite, canOwn) {
                  var path = name;
                  if (parent) {
                    parent = typeof parent == "string" ? parent : FS.getPath(parent);
                    path = name ? PATH.join2(parent, name) : parent;
                  }
                  var mode = FS_getMode(canRead, canWrite);
                  var node = FS.create(path, mode);
                  if (data) {
                    if (typeof data == "string") {
                      var arr = new Array(data.length);
                      for (var i = 0, len = data.length; i < len; ++i) {
                        arr[i] = data.charCodeAt(i);
                      }
                      data = arr;
                    }
                    FS.chmod(node, mode | 146);
                    var stream = FS.open(node, 577);
                    FS.write(stream, data, 0, data.length, 0, canOwn);
                    FS.close(stream);
                    FS.chmod(node, mode);
                  }
                  return node;
                },
                createDevice: function createDevice(parent, name, input, output) {
                  var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
                  var mode = FS_getMode(!!input, !!output);
                  if (!FS.createDevice.major) FS.createDevice.major = 64;
                  var dev = FS.makedev(FS.createDevice.major++, 0);
                  FS.registerDevice(dev, {
                    open: function open(stream) {
                      stream.seekable = false;
                    },
                    close: function close(stream) {
                      if (output && output.buffer && output.buffer.length) {
                        output(10);
                      }
                    },
                    read: function read(stream, buffer, offset, length, pos) {
                      var bytesRead = 0;
                      for (var i = 0; i < length; i++) {
                        var result;
                        try {
                          result = input();
                        } catch (e) {
                          throw new FS.ErrnoError(29);
                        }
                        if (result === undefined && bytesRead === 0) {
                          throw new FS.ErrnoError(6);
                        }
                        if (result === null || result === undefined) break;
                        bytesRead++;
                        buffer[offset + i] = result;
                      }
                      if (bytesRead) {
                        stream.node.timestamp = Date.now();
                      }
                      return bytesRead;
                    },
                    write: function write(stream, buffer, offset, length, pos) {
                      for (var i = 0; i < length; i++) {
                        try {
                          output(buffer[offset + i]);
                        } catch (e) {
                          throw new FS.ErrnoError(29);
                        }
                      }
                      if (length) {
                        stream.node.timestamp = Date.now();
                      }
                      return i;
                    }
                  });
                  return FS.mkdev(path, mode, dev);
                },
                forceLoadFile: function forceLoadFile(obj) {
                  if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
                  if (typeof XMLHttpRequest != "undefined") {
                    throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
                  } else if (read_) {
                    try {
                      obj.contents = intArrayFromString(read_(obj.url), true);
                      obj.usedBytes = obj.contents.length;
                    } catch (e) {
                      throw new FS.ErrnoError(29);
                    }
                  } else {
                    throw new Error("Cannot load without read() or XMLHttpRequest.");
                  }
                },
                createLazyFile: function createLazyFile(parent, name, url, canRead, canWrite) {
                  function LazyUint8Array() {
                    this.lengthKnown = false;
                    this.chunks = [];
                  }
                  LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
                    if (idx > this.length - 1 || idx < 0) {
                      return undefined;
                    }
                    var chunkOffset = idx % this.chunkSize;
                    var chunkNum = idx / this.chunkSize | 0;
                    return this.getter(chunkNum)[chunkOffset];
                  };
                  LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
                    this.getter = getter;
                  };
                  LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
                    var xhr = new XMLHttpRequest();
                    xhr.open("HEAD", url, false);
                    xhr.send(null);
                    if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                    var datalength = Number(xhr.getResponseHeader("Content-length"));
                    var header;
                    var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
                    var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
                    var chunkSize = 1024 * 1024;
                    if (!hasByteServing) chunkSize = datalength;
                    var doXHR = function doXHR(from, to) {
                      if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                      if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
                      var xhr = new XMLHttpRequest();
                      xhr.open("GET", url, false);
                      if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                      xhr.responseType = "arraybuffer";
                      if (xhr.overrideMimeType) {
                        xhr.overrideMimeType("text/plain; charset=x-user-defined");
                      }
                      xhr.send(null);
                      if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                      if (xhr.response !== undefined) {
                        return new Uint8Array(xhr.response || []);
                      }
                      return intArrayFromString(xhr.responseText || "", true);
                    };
                    var lazyArray = this;
                    lazyArray.setDataGetter(function (chunkNum) {
                      var start = chunkNum * chunkSize;
                      var end = (chunkNum + 1) * chunkSize - 1;
                      end = Math.min(end, datalength - 1);
                      if (typeof lazyArray.chunks[chunkNum] == "undefined") {
                        lazyArray.chunks[chunkNum] = doXHR(start, end);
                      }
                      if (typeof lazyArray.chunks[chunkNum] == "undefined") throw new Error("doXHR failed!");
                      return lazyArray.chunks[chunkNum];
                    });
                    if (usesGzip || !datalength) {
                      chunkSize = datalength = 1;
                      datalength = this.getter(0).length;
                      chunkSize = datalength;
                      out("LazyFiles on gzip forces download of the whole file when length is accessed");
                    }
                    this._length = datalength;
                    this._chunkSize = chunkSize;
                    this.lengthKnown = true;
                  };
                  if (typeof XMLHttpRequest != "undefined") {
                    if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                    var lazyArray = new LazyUint8Array();
                    Object.defineProperties(lazyArray, {
                      length: {
                        get: function get() {
                          if (!this.lengthKnown) {
                            this.cacheLength();
                          }
                          return this._length;
                        }
                      },
                      chunkSize: {
                        get: function get() {
                          if (!this.lengthKnown) {
                            this.cacheLength();
                          }
                          return this._chunkSize;
                        }
                      }
                    });
                    var properties = {
                      isDevice: false,
                      contents: lazyArray
                    };
                  } else {
                    var properties = {
                      isDevice: false,
                      url: url
                    };
                  }
                  var node = FS.createFile(parent, name, properties, canRead, canWrite);
                  if (properties.contents) {
                    node.contents = properties.contents;
                  } else if (properties.url) {
                    node.contents = null;
                    node.url = properties.url;
                  }
                  Object.defineProperties(node, {
                    usedBytes: {
                      get: function get() {
                        return this.contents.length;
                      }
                    }
                  });
                  var stream_ops = {};
                  var keys = Object.keys(node.stream_ops);
                  keys.forEach(function (key) {
                    var fn = node.stream_ops[key];
                    stream_ops[key] = function forceLoadLazyFile() {
                      FS.forceLoadFile(node);
                      return fn.apply(null, arguments);
                    };
                  });
                  function writeChunks(stream, buffer, offset, length, position) {
                    var contents = stream.node.contents;
                    if (position >= contents.length) return 0;
                    var size = Math.min(contents.length - position, length);
                    if (contents.slice) {
                      for (var i = 0; i < size; i++) {
                        buffer[offset + i] = contents[position + i];
                      }
                    } else {
                      for (var i = 0; i < size; i++) {
                        buffer[offset + i] = contents.get(position + i);
                      }
                    }
                    return size;
                  }
                  stream_ops.read = function (stream, buffer, offset, length, position) {
                    FS.forceLoadFile(node);
                    return writeChunks(stream, buffer, offset, length, position);
                  };
                  stream_ops.mmap = function (stream, length, position, prot, flags) {
                    FS.forceLoadFile(node);
                    var ptr = mmapAlloc(length);
                    if (!ptr) {
                      throw new FS.ErrnoError(48);
                    }
                    writeChunks(stream, HEAP8, ptr, length, position);
                    return {
                      ptr: ptr,
                      allocated: true
                    };
                  };
                  node.stream_ops = stream_ops;
                  return node;
                }
              };
              SYSCALLS = {
                DEFAULT_POLLMASK: 5,
                calculateAt: function calculateAt(dirfd, path, allowEmpty) {
                  if (PATH.isAbs(path)) {
                    return path;
                  }
                  var dir;
                  if (dirfd === -100) {
                    dir = FS.cwd();
                  } else {
                    var dirstream = SYSCALLS.getStreamFromFD(dirfd);
                    dir = dirstream.path;
                  }
                  if (path.length == 0) {
                    if (!allowEmpty) {
                      throw new FS.ErrnoError(44);
                    }
                    return dir;
                  }
                  return PATH.join2(dir, path);
                },
                doStat: function doStat(func, path, buf) {
                  try {
                    var stat = func(path);
                  } catch (e) {
                    if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
                      return -54;
                    }
                    throw e;
                  }
                  HEAP32[buf >> 2] = stat.dev;
                  HEAP32[buf + 8 >> 2] = stat.ino;
                  HEAP32[buf + 12 >> 2] = stat.mode;
                  HEAPU32[buf + 16 >> 2] = stat.nlink;
                  HEAP32[buf + 20 >> 2] = stat.uid;
                  HEAP32[buf + 24 >> 2] = stat.gid;
                  HEAP32[buf + 28 >> 2] = stat.rdev;
                  tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1];
                  HEAP32[buf + 48 >> 2] = 4096;
                  HEAP32[buf + 52 >> 2] = stat.blocks;
                  var atime = stat.atime.getTime();
                  var mtime = stat.mtime.getTime();
                  var ctime = stat.ctime.getTime();
                  tempI64 = [Math.floor(atime / 1e3) >>> 0, (tempDouble = Math.floor(atime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 56 >> 2] = tempI64[0], HEAP32[buf + 60 >> 2] = tempI64[1];
                  HEAPU32[buf + 64 >> 2] = atime % 1e3 * 1e3;
                  tempI64 = [Math.floor(mtime / 1e3) >>> 0, (tempDouble = Math.floor(mtime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 72 >> 2] = tempI64[0], HEAP32[buf + 76 >> 2] = tempI64[1];
                  HEAPU32[buf + 80 >> 2] = mtime % 1e3 * 1e3;
                  tempI64 = [Math.floor(ctime / 1e3) >>> 0, (tempDouble = Math.floor(ctime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 88 >> 2] = tempI64[0], HEAP32[buf + 92 >> 2] = tempI64[1];
                  HEAPU32[buf + 96 >> 2] = ctime % 1e3 * 1e3;
                  tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 104 >> 2] = tempI64[0], HEAP32[buf + 108 >> 2] = tempI64[1];
                  return 0;
                },
                doMsync: function doMsync(addr, stream, len, flags, offset) {
                  if (!FS.isFile(stream.node.mode)) {
                    throw new FS.ErrnoError(43);
                  }
                  if (flags & 2) {
                    return 0;
                  }
                  var buffer = HEAPU8.slice(addr, addr + len);
                  FS.msync(stream, buffer, offset, len, flags);
                },
                varargs: undefined,
                get: function get() {
                  SYSCALLS.varargs += 4;
                  var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
                  return ret;
                },
                getStr: function getStr(ptr) {
                  var ret = UTF8ToString(ptr);
                  return ret;
                },
                getStreamFromFD: function getStreamFromFD(fd) {
                  var stream = FS.getStream(fd);
                  if (!stream) throw new FS.ErrnoError(8);
                  return stream;
                }
              };
              embind_charCodes = undefined;
              awaitingDependencies = {};
              registeredTypes = {};
              typeDependencies = {};
              char_0 = 48;
              char_9 = 57;
              BindingError = undefined;
              emval_handles = new HandleAllocator();
              Emval = {
                toValue: function toValue(handle) {
                  if (!handle) {
                    throwBindingError("Cannot use deleted val. handle = " + handle);
                  }
                  return emval_handles.get(handle).value;
                },
                toHandle: function toHandle(value) {
                  switch (value) {
                    case undefined:
                      return 1;
                    case null:
                      return 2;
                    case true:
                      return 3;
                    case false:
                      return 4;
                    default:
                      {
                        return emval_handles.allocate({
                          refcount: 1,
                          value: value
                        });
                      }
                  }
                }
              };
              UTF16Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : undefined;
              nowIsMonotonic = true;
              _exit = exitJS;
              FSNode = function FSNode(parent, name, mode, rdev) {
                if (!parent) {
                  parent = this;
                }
                this.parent = parent;
                this.mount = parent.mount;
                this.mounted = null;
                this.id = FS.nextInode++;
                this.name = name;
                this.mode = mode;
                this.node_ops = {};
                this.stream_ops = {};
                this.rdev = rdev;
              };
              readMode = 292 | 73;
              writeMode = 146;
              Object.defineProperties(FSNode.prototype, {
                read: {
                  get: function get() {
                    return (this.mode & readMode) === readMode;
                  },
                  set: function set(val) {
                    val ? this.mode |= readMode : this.mode &= ~readMode;
                  }
                },
                write: {
                  get: function get() {
                    return (this.mode & writeMode) === writeMode;
                  },
                  set: function set(val) {
                    val ? this.mode |= writeMode : this.mode &= ~writeMode;
                  }
                },
                isFolder: {
                  get: function get() {
                    return FS.isDir(this.mode);
                  }
                },
                isDevice: {
                  get: function get() {
                    return FS.isChrdev(this.mode);
                  }
                }
              });
              FS.FSNode = FSNode;
              FS.createPreloadedFile = FS_createPreloadedFile;
              FS.staticInit();
              Module["FS_createPath"] = FS.createPath;
              Module["FS_createDataFile"] = FS.createDataFile;
              Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
              Module["FS_unlink"] = FS.unlink;
              Module["FS_createLazyFile"] = FS.createLazyFile;
              Module["FS_createDevice"] = FS.createDevice;
              embind_init_charCodes();
              BindingError = Module["BindingError"] = extendError(Error, "BindingError");
              Module["InternalError"] = extendError(Error, "InternalError");
              init_emval();
              wasmImports = {
                "i": ___syscall_fcntl64,
                "q": ___syscall_ioctl,
                "r": ___syscall_openat,
                "m": __embind_register_bigint,
                "k": __embind_register_bool,
                "j": __embind_register_emval,
                "f": __embind_register_float,
                "b": __embind_register_integer,
                "a": __embind_register_memory_view,
                "e": __embind_register_std_string,
                "d": __embind_register_std_wstring,
                "n": __embind_register_void,
                "s": __emscripten_get_now_is_monotonic,
                "v": _abort,
                "t": _emscripten_date_now,
                "u": _emscripten_memcpy_big,
                "o": _emscripten_resize_heap,
                "c": _exit,
                "g": _fd_close,
                "p": _fd_read,
                "l": _fd_seek,
                "h": _fd_write
              };
              createWasm();
              Module["_doCartogram"] = function () {
                return (Module["_doCartogram"] = Module["asm"]["y"]).apply(null, arguments);
              };
              _malloc2 = function _malloc() {
                return (_malloc2 = Module["asm"]["z"]).apply(null, arguments);
              };
              _free2 = function _free() {
                return (_free2 = Module["asm"]["A"]).apply(null, arguments);
              };
              Module["__embind_initialize_bindings"] = function () {
                return (Module["__embind_initialize_bindings"] = Module["asm"]["C"]).apply(null, arguments);
              };
              _errno_location = function ___errno_location() {
                return (_errno_location = Module["asm"]["D"]).apply(null, arguments);
              };
              _stackSave = function stackSave() {
                return (_stackSave = Module["asm"]["E"]).apply(null, arguments);
              };
              _stackRestore = function stackRestore() {
                return (_stackRestore = Module["asm"]["F"]).apply(null, arguments);
              };
              _stackAlloc = function stackAlloc() {
                return (_stackAlloc = Module["asm"]["G"]).apply(null, arguments);
              };
              Module["addRunDependency"] = addRunDependency;
              Module["removeRunDependency"] = removeRunDependency;
              Module["FS_createPath"] = FS.createPath;
              Module["FS_createDataFile"] = FS.createDataFile;
              Module["FS_createLazyFile"] = FS.createLazyFile;
              Module["FS_createDevice"] = FS.createDevice;
              Module["FS_unlink"] = FS.unlink;
              Module["ccall"] = ccall;
              Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
              Module["FS"] = FS;
              dependenciesFulfilled = function runCaller() {
                if (!calledRun) run();
                if (!calledRun) dependenciesFulfilled = runCaller;
              };
              if (Module["preInit"]) {
                if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
                while (Module["preInit"].length > 0) {
                  Module["preInit"].pop()();
                }
              }
              run();
              return _context.abrupt("return", GoCart.ready);
            case 208:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
  }();

  // eslint-disable-next-line no-restricted-globals
  var isNumber = function isNumber(value) {
    return value != null && value !== '' && isFinite(value);
  };

  /**
   * Prepare GeoJSON and CSV data for GoCart.
   *
   * @param geojson
   * @param fieldName
   * @return {{rawGeoJSON: string, rawCsv: string}}
   */
  var prepareGeoJSONandCSV = function prepareGeoJSONandCSV(geojson, fieldName) {
    var newGeojson = JSON.parse(JSON.stringify(geojson));
    var values = [];
    var xmin = Infinity;
    var xmax = -Infinity;
    var ymin = Infinity;
    var ymax = -Infinity;
    var bboxFn = function bboxFn(point) {
      xmin = Math.min(xmin, point[0]);
      xmax = Math.max(xmax, point[0]);
      ymin = Math.min(ymin, point[1]);
      ymax = Math.max(ymax, point[1]);
    };
    newGeojson.features.forEach(function (feature, i) {
      var cartogramId = i + 1;
      // eslint-disable-next-line no-param-reassign
      feature.properties.cartogram_id = "".concat(cartogramId);
      if (feature.geometry.type === 'Polygon') {
        feature.geometry.coordinates.forEach(function (ring) {
          ring.forEach(bboxFn);
        });
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach(function (polygon) {
          polygon.forEach(function (ring) {
            ring.forEach(bboxFn);
          });
        });
      }

      // Replace inexistent values and not number values by 0
      var valueIsNumber = isNumber(feature.properties[fieldName]);
      var value = valueIsNumber ? feature.properties[fieldName] : 0;
      values.push({
        cartogramId: cartogramId,
        value: value
      });
    });
    newGeojson.bbox = [xmin, ymin, xmax, ymax];
    var rawCsv = "Region Id, Region Data\n".concat(values.map(function (v) {
      return "".concat(v.cartogramId, ", ").concat(v.value);
    }).join('\n'));
    var rawGeoJSON = JSON.stringify(newGeojson);
    return {
      rawGeoJSON: rawGeoJSON,
      rawCsv: rawCsv
    };
  };
  var initGoCart = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var options,
        GoCartWasm,
        _args = arguments;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
              _context.next = 3;
              return GoCart(options);
            case 3:
              GoCartWasm = _context.sent;
              /**
               * Make a cartogram according to Gastner, Seguy and More (2018) algorithm.
               * This function expects a GeoJSON object (FeatureCollection) and a field name.
               *
               * @param geojson {Object} - The FeatureCollection to be handled.
               * @param fieldName {String} - The name of the field to be used as data.
               * @return {Object}
               */
              GoCartWasm.makeCartogram = function makeCartogram(geojson, fieldName) {
                // Check the arguments
                if (!geojson || !fieldName || _typeof(geojson) !== 'object' || !Object.prototype.hasOwnProperty.call(geojson, 'features')) {
                  throw new Error('Invalid arguments : first argument must be a GeoJSON FeatureCollection and second argument must be a field name');
                }
                // Prepare the data
                var _prepareGeoJSONandCSV = prepareGeoJSONandCSV(geojson, fieldName),
                  rawGeoJSON = _prepareGeoJSONandCSV.rawGeoJSON,
                  rawCsv = _prepareGeoJSONandCSV.rawCsv;

                // Save the data in GoCart memory / file system
                var pathInputJsonFile = '/data/test.json';
                var pathInputCsvFile = '/data/test.csv';
                if (GoCartWasm.FS.findObject('/data') === null) {
                  GoCartWasm.FS.mkdir('/data');
                }
                GoCartWasm.FS.writeFile(pathInputJsonFile, rawGeoJSON);
                GoCartWasm.FS.writeFile(pathInputCsvFile, rawCsv);
                var cleanUp = function cleanUp() {
                  GoCartWasm.FS.unlink(pathInputJsonFile);
                  GoCartWasm.FS.unlink(pathInputCsvFile);
                  GoCartWasm.FS.unlink('cartogram.json');
                  GoCartWasm.FS.unlink('area_error.dat');
                };
                try {
                  // Actually run the algorithm
                  var retVal = GoCartWasm.ccall('doCartogram', 'number', ['string', 'string'], [pathInputJsonFile, pathInputCsvFile]);
                  if (retVal !== 0) {
                    cleanUp();
                    throw new Error('Error while running the cartogram algorithm');
                  }
                } catch (e) {
                  cleanUp();
                  throw e;
                }

                // Read the result
                var data = GoCartWasm.FS.readFile('cartogram.json', {
                  encoding: 'utf8'
                });

                // Read the log file about area errors
                var areaErrors = GoCartWasm.FS.readFile('area_error.dat', {
                  encoding: 'utf8'
                });
                var t = {};
                areaErrors.split('\n').forEach(function (line) {
                  var id = line.substring(7, line.indexOf(': '));
                  var errorValue = line.substring(line.indexOf('relative error = ') + 'relative error = '.length);
                  t[id] = +errorValue;
                });

                // Store the area error in each feature properties
                var result = JSON.parse(data);
                result.features.forEach(function (feature) {
                  var id = feature.properties.cartogram_id;
                  // eslint-disable-next-line no-param-reassign
                  feature.properties.area_error = t[id];
                });

                // Clean the memory / file system
                cleanUp();

                // Return the result
                return result;
              };
              return _context.abrupt("return", GoCartWasm);
            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return function initGoCart() {
      return _ref.apply(this, arguments);
    };
  }();

  return initGoCart;

}));
