// node_modules/tslib/tslib.es6.mjs
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}
function __spreadArray(to, from2, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from2.length, ar; i < l; i++) {
    if (ar || !(i in from2)) {
      if (!ar) ar = Array.prototype.slice.call(from2, 0, i);
      ar[i] = from2[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from2));
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f) {
    return function(v) {
      return Promise.resolve(v).then(f, reject);
    };
  }
  function verb(n, f) {
    if (g[n]) {
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
      if (f) i[n] = f(i[n]);
    }
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}

// node_modules/rxjs/dist/esm5/internal/util/isFunction.js
function isFunction(value) {
  return typeof value === "function";
}

// node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js
function createErrorClass(createImpl) {
  var _super = function(instance) {
    Error.call(instance);
    instance.stack = new Error().stack;
  };
  var ctorFunc = createImpl(_super);
  ctorFunc.prototype = Object.create(Error.prototype);
  ctorFunc.prototype.constructor = ctorFunc;
  return ctorFunc;
}

// node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js
var UnsubscriptionError = createErrorClass(function(_super) {
  return function UnsubscriptionErrorImpl(errors) {
    _super(this);
    this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
      return i + 1 + ") " + err.toString();
    }).join("\n  ") : "";
    this.name = "UnsubscriptionError";
    this.errors = errors;
  };
});

// node_modules/rxjs/dist/esm5/internal/util/arrRemove.js
function arrRemove(arr, item) {
  if (arr) {
    var index = arr.indexOf(item);
    0 <= index && arr.splice(index, 1);
  }
}

// node_modules/rxjs/dist/esm5/internal/Subscription.js
var Subscription = function() {
  function Subscription2(initialTeardown) {
    this.initialTeardown = initialTeardown;
    this.closed = false;
    this._parentage = null;
    this._finalizers = null;
  }
  Subscription2.prototype.unsubscribe = function() {
    var e_1, _a, e_2, _b;
    var errors;
    if (!this.closed) {
      this.closed = true;
      var _parentage = this._parentage;
      if (_parentage) {
        this._parentage = null;
        if (Array.isArray(_parentage)) {
          try {
            for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
              var parent_1 = _parentage_1_1.value;
              parent_1.remove(this);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        } else {
          _parentage.remove(this);
        }
      }
      var initialFinalizer = this.initialTeardown;
      if (isFunction(initialFinalizer)) {
        try {
          initialFinalizer();
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? e.errors : [e];
        }
      }
      var _finalizers = this._finalizers;
      if (_finalizers) {
        this._finalizers = null;
        try {
          for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
            var finalizer = _finalizers_1_1.value;
            try {
              execFinalizer(finalizer);
            } catch (err) {
              errors = errors !== null && errors !== void 0 ? errors : [];
              if (err instanceof UnsubscriptionError) {
                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
              } else {
                errors.push(err);
              }
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      }
      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    }
  };
  Subscription2.prototype.add = function(teardown) {
    var _a;
    if (teardown && teardown !== this) {
      if (this.closed) {
        execFinalizer(teardown);
      } else {
        if (teardown instanceof Subscription2) {
          if (teardown.closed || teardown._hasParent(this)) {
            return;
          }
          teardown._addParent(this);
        }
        (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
      }
    }
  };
  Subscription2.prototype._hasParent = function(parent) {
    var _parentage = this._parentage;
    return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
  };
  Subscription2.prototype._addParent = function(parent) {
    var _parentage = this._parentage;
    this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
  };
  Subscription2.prototype._removeParent = function(parent) {
    var _parentage = this._parentage;
    if (_parentage === parent) {
      this._parentage = null;
    } else if (Array.isArray(_parentage)) {
      arrRemove(_parentage, parent);
    }
  };
  Subscription2.prototype.remove = function(teardown) {
    var _finalizers = this._finalizers;
    _finalizers && arrRemove(_finalizers, teardown);
    if (teardown instanceof Subscription2) {
      teardown._removeParent(this);
    }
  };
  Subscription2.EMPTY = function() {
    var empty = new Subscription2();
    empty.closed = true;
    return empty;
  }();
  return Subscription2;
}();
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
  return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
}
function execFinalizer(finalizer) {
  if (isFunction(finalizer)) {
    finalizer();
  } else {
    finalizer.unsubscribe();
  }
}

// node_modules/rxjs/dist/esm5/internal/config.js
var config = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: false,
  useDeprecatedNextContext: false
};

// node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js
var timeoutProvider = {
  setTimeout: function(handler, timeout) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    var delegate = timeoutProvider.delegate;
    if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
      return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout], __read(args)));
    }
    return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
  },
  clearTimeout: function(handle) {
    var delegate = timeoutProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js
function reportUnhandledError(err) {
  timeoutProvider.setTimeout(function() {
    var onUnhandledError = config.onUnhandledError;
    if (onUnhandledError) {
      onUnhandledError(err);
    } else {
      throw err;
    }
  });
}

// node_modules/rxjs/dist/esm5/internal/util/noop.js
function noop() {
}

// node_modules/rxjs/dist/esm5/internal/NotificationFactories.js
var COMPLETE_NOTIFICATION = function() {
  return createNotification("C", void 0, void 0);
}();
function errorNotification(error) {
  return createNotification("E", void 0, error);
}
function nextNotification(value) {
  return createNotification("N", value, void 0);
}
function createNotification(kind, value, error) {
  return {
    kind,
    value,
    error
  };
}

// node_modules/rxjs/dist/esm5/internal/util/errorContext.js
var context = null;
function errorContext(cb) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    var isRoot = !context;
    if (isRoot) {
      context = { errorThrown: false, error: null };
    }
    cb();
    if (isRoot) {
      var _a = context, errorThrown = _a.errorThrown, error = _a.error;
      context = null;
      if (errorThrown) {
        throw error;
      }
    }
  } else {
    cb();
  }
}
function captureError(err) {
  if (config.useDeprecatedSynchronousErrorHandling && context) {
    context.errorThrown = true;
    context.error = err;
  }
}

// node_modules/rxjs/dist/esm5/internal/Subscriber.js
var Subscriber = function(_super) {
  __extends(Subscriber2, _super);
  function Subscriber2(destination) {
    var _this = _super.call(this) || this;
    _this.isStopped = false;
    if (destination) {
      _this.destination = destination;
      if (isSubscription(destination)) {
        destination.add(_this);
      }
    } else {
      _this.destination = EMPTY_OBSERVER;
    }
    return _this;
  }
  Subscriber2.create = function(next, error, complete) {
    return new SafeSubscriber(next, error, complete);
  };
  Subscriber2.prototype.next = function(value) {
    if (this.isStopped) {
      handleStoppedNotification(nextNotification(value), this);
    } else {
      this._next(value);
    }
  };
  Subscriber2.prototype.error = function(err) {
    if (this.isStopped) {
      handleStoppedNotification(errorNotification(err), this);
    } else {
      this.isStopped = true;
      this._error(err);
    }
  };
  Subscriber2.prototype.complete = function() {
    if (this.isStopped) {
      handleStoppedNotification(COMPLETE_NOTIFICATION, this);
    } else {
      this.isStopped = true;
      this._complete();
    }
  };
  Subscriber2.prototype.unsubscribe = function() {
    if (!this.closed) {
      this.isStopped = true;
      _super.prototype.unsubscribe.call(this);
      this.destination = null;
    }
  };
  Subscriber2.prototype._next = function(value) {
    this.destination.next(value);
  };
  Subscriber2.prototype._error = function(err) {
    try {
      this.destination.error(err);
    } finally {
      this.unsubscribe();
    }
  };
  Subscriber2.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  };
  return Subscriber2;
}(Subscription);
var _bind = Function.prototype.bind;
function bind(fn, thisArg) {
  return _bind.call(fn, thisArg);
}
var ConsumerObserver = function() {
  function ConsumerObserver2(partialObserver) {
    this.partialObserver = partialObserver;
  }
  ConsumerObserver2.prototype.next = function(value) {
    var partialObserver = this.partialObserver;
    if (partialObserver.next) {
      try {
        partialObserver.next(value);
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  ConsumerObserver2.prototype.error = function(err) {
    var partialObserver = this.partialObserver;
    if (partialObserver.error) {
      try {
        partialObserver.error(err);
      } catch (error) {
        handleUnhandledError(error);
      }
    } else {
      handleUnhandledError(err);
    }
  };
  ConsumerObserver2.prototype.complete = function() {
    var partialObserver = this.partialObserver;
    if (partialObserver.complete) {
      try {
        partialObserver.complete();
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  return ConsumerObserver2;
}();
var SafeSubscriber = function(_super) {
  __extends(SafeSubscriber2, _super);
  function SafeSubscriber2(observerOrNext, error, complete) {
    var _this = _super.call(this) || this;
    var partialObserver;
    if (isFunction(observerOrNext) || !observerOrNext) {
      partialObserver = {
        next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
        error: error !== null && error !== void 0 ? error : void 0,
        complete: complete !== null && complete !== void 0 ? complete : void 0
      };
    } else {
      var context_1;
      if (_this && config.useDeprecatedNextContext) {
        context_1 = Object.create(observerOrNext);
        context_1.unsubscribe = function() {
          return _this.unsubscribe();
        };
        partialObserver = {
          next: observerOrNext.next && bind(observerOrNext.next, context_1),
          error: observerOrNext.error && bind(observerOrNext.error, context_1),
          complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
        };
      } else {
        partialObserver = observerOrNext;
      }
    }
    _this.destination = new ConsumerObserver(partialObserver);
    return _this;
  }
  return SafeSubscriber2;
}(Subscriber);
function handleUnhandledError(error) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    captureError(error);
  } else {
    reportUnhandledError(error);
  }
}
function defaultErrorHandler(err) {
  throw err;
}
function handleStoppedNotification(notification, subscriber) {
  var onStoppedNotification = config.onStoppedNotification;
  onStoppedNotification && timeoutProvider.setTimeout(function() {
    return onStoppedNotification(notification, subscriber);
  });
}
var EMPTY_OBSERVER = {
  closed: true,
  next: noop,
  error: defaultErrorHandler,
  complete: noop
};

// node_modules/rxjs/dist/esm5/internal/symbol/observable.js
var observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();

// node_modules/rxjs/dist/esm5/internal/util/identity.js
function identity(x) {
  return x;
}

// node_modules/rxjs/dist/esm5/internal/util/pipe.js
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce(function(prev, fn) {
      return fn(prev);
    }, input);
  };
}

// node_modules/rxjs/dist/esm5/internal/Observable.js
var Observable = function() {
  function Observable2(subscribe) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  Observable2.prototype.lift = function(operator) {
    var observable2 = new Observable2();
    observable2.source = this;
    observable2.operator = operator;
    return observable2;
  };
  Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
    var _this = this;
    var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
    errorContext(function() {
      var _a = _this, operator = _a.operator, source = _a.source;
      subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
    });
    return subscriber;
  };
  Observable2.prototype._trySubscribe = function(sink) {
    try {
      return this._subscribe(sink);
    } catch (err) {
      sink.error(err);
    }
  };
  Observable2.prototype.forEach = function(next, promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var subscriber = new SafeSubscriber({
        next: function(value) {
          try {
            next(value);
          } catch (err) {
            reject(err);
            subscriber.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
      _this.subscribe(subscriber);
    });
  };
  Observable2.prototype._subscribe = function(subscriber) {
    var _a;
    return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
  };
  Observable2.prototype[observable] = function() {
    return this;
  };
  Observable2.prototype.pipe = function() {
    var operations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      operations[_i] = arguments[_i];
    }
    return pipeFromArray(operations)(this);
  };
  Observable2.prototype.toPromise = function(promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var value;
      _this.subscribe(function(x) {
        return value = x;
      }, function(err) {
        return reject(err);
      }, function() {
        return resolve(value);
      });
    });
  };
  Observable2.create = function(subscribe) {
    return new Observable2(subscribe);
  };
  return Observable2;
}();
function getPromiseCtor(promiseCtor) {
  var _a;
  return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
  return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
  return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
}

// node_modules/rxjs/dist/esm5/internal/util/lift.js
function hasLift(source) {
  return isFunction(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
  return function(source) {
    if (hasLift(source)) {
      return source.lift(function(liftedSource) {
        try {
          return init(liftedSource, this);
        } catch (err) {
          this.error(err);
        }
      });
    }
    throw new TypeError("Unable to lift unknown Observable type");
  };
}

// node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js
function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
  return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = function(_super) {
  __extends(OperatorSubscriber2, _super);
  function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
    var _this = _super.call(this, destination) || this;
    _this.onFinalize = onFinalize;
    _this.shouldUnsubscribe = shouldUnsubscribe;
    _this._next = onNext ? function(value) {
      try {
        onNext(value);
      } catch (err) {
        destination.error(err);
      }
    } : _super.prototype._next;
    _this._error = onError ? function(err) {
      try {
        onError(err);
      } catch (err2) {
        destination.error(err2);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._error;
    _this._complete = onComplete ? function() {
      try {
        onComplete();
      } catch (err) {
        destination.error(err);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._complete;
    return _this;
  }
  OperatorSubscriber2.prototype.unsubscribe = function() {
    var _a;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var closed_1 = this.closed;
      _super.prototype.unsubscribe.call(this);
      !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
    }
  };
  return OperatorSubscriber2;
}(Subscriber);

// node_modules/rxjs/dist/esm5/internal/scheduler/animationFrameProvider.js
var animationFrameProvider = {
  schedule: function(callback) {
    var request = requestAnimationFrame;
    var cancel = cancelAnimationFrame;
    var delegate = animationFrameProvider.delegate;
    if (delegate) {
      request = delegate.requestAnimationFrame;
      cancel = delegate.cancelAnimationFrame;
    }
    var handle = request(function(timestamp) {
      cancel = void 0;
      callback(timestamp);
    });
    return new Subscription(function() {
      return cancel === null || cancel === void 0 ? void 0 : cancel(handle);
    });
  },
  requestAnimationFrame: function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var delegate = animationFrameProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.requestAnimationFrame) || requestAnimationFrame).apply(void 0, __spreadArray([], __read(args)));
  },
  cancelAnimationFrame: function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var delegate = animationFrameProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.cancelAnimationFrame) || cancelAnimationFrame).apply(void 0, __spreadArray([], __read(args)));
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js
var ObjectUnsubscribedError = createErrorClass(function(_super) {
  return function ObjectUnsubscribedErrorImpl() {
    _super(this);
    this.name = "ObjectUnsubscribedError";
    this.message = "object unsubscribed";
  };
});

// node_modules/rxjs/dist/esm5/internal/Subject.js
var Subject = function(_super) {
  __extends(Subject2, _super);
  function Subject2() {
    var _this = _super.call(this) || this;
    _this.closed = false;
    _this.currentObservers = null;
    _this.observers = [];
    _this.isStopped = false;
    _this.hasError = false;
    _this.thrownError = null;
    return _this;
  }
  Subject2.prototype.lift = function(operator) {
    var subject = new AnonymousSubject(this, this);
    subject.operator = operator;
    return subject;
  };
  Subject2.prototype._throwIfClosed = function() {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
  };
  Subject2.prototype.next = function(value) {
    var _this = this;
    errorContext(function() {
      var e_1, _a;
      _this._throwIfClosed();
      if (!_this.isStopped) {
        if (!_this.currentObservers) {
          _this.currentObservers = Array.from(_this.observers);
        }
        try {
          for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
            var observer = _c.value;
            observer.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }
    });
  };
  Subject2.prototype.error = function(err) {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.hasError = _this.isStopped = true;
        _this.thrownError = err;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().error(err);
        }
      }
    });
  };
  Subject2.prototype.complete = function() {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.isStopped = true;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().complete();
        }
      }
    });
  };
  Subject2.prototype.unsubscribe = function() {
    this.isStopped = this.closed = true;
    this.observers = this.currentObservers = null;
  };
  Object.defineProperty(Subject2.prototype, "observed", {
    get: function() {
      var _a;
      return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
    },
    enumerable: false,
    configurable: true
  });
  Subject2.prototype._trySubscribe = function(subscriber) {
    this._throwIfClosed();
    return _super.prototype._trySubscribe.call(this, subscriber);
  };
  Subject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._checkFinalizedStatuses(subscriber);
    return this._innerSubscribe(subscriber);
  };
  Subject2.prototype._innerSubscribe = function(subscriber) {
    var _this = this;
    var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
    if (hasError || isStopped) {
      return EMPTY_SUBSCRIPTION;
    }
    this.currentObservers = null;
    observers.push(subscriber);
    return new Subscription(function() {
      _this.currentObservers = null;
      arrRemove(observers, subscriber);
    });
  };
  Subject2.prototype._checkFinalizedStatuses = function(subscriber) {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped) {
      subscriber.complete();
    }
  };
  Subject2.prototype.asObservable = function() {
    var observable2 = new Observable();
    observable2.source = this;
    return observable2;
  };
  Subject2.create = function(destination, source) {
    return new AnonymousSubject(destination, source);
  };
  return Subject2;
}(Observable);
var AnonymousSubject = function(_super) {
  __extends(AnonymousSubject2, _super);
  function AnonymousSubject2(destination, source) {
    var _this = _super.call(this) || this;
    _this.destination = destination;
    _this.source = source;
    return _this;
  }
  AnonymousSubject2.prototype.next = function(value) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
  };
  AnonymousSubject2.prototype.error = function(err) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
  };
  AnonymousSubject2.prototype.complete = function() {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
  };
  AnonymousSubject2.prototype._subscribe = function(subscriber) {
    var _a, _b;
    return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
  };
  return AnonymousSubject2;
}(Subject);

// node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js
var BehaviorSubject = function(_super) {
  __extends(BehaviorSubject2, _super);
  function BehaviorSubject2(_value) {
    var _this = _super.call(this) || this;
    _this._value = _value;
    return _this;
  }
  Object.defineProperty(BehaviorSubject2.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: false,
    configurable: true
  });
  BehaviorSubject2.prototype._subscribe = function(subscriber) {
    var subscription = _super.prototype._subscribe.call(this, subscriber);
    !subscription.closed && subscriber.next(this._value);
    return subscription;
  };
  BehaviorSubject2.prototype.getValue = function() {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, _value = _a._value;
    if (hasError) {
      throw thrownError;
    }
    this._throwIfClosed();
    return _value;
  };
  BehaviorSubject2.prototype.next = function(value) {
    _super.prototype.next.call(this, this._value = value);
  };
  return BehaviorSubject2;
}(Subject);

// node_modules/rxjs/dist/esm5/internal/scheduler/dateTimestampProvider.js
var dateTimestampProvider = {
  now: function() {
    return (dateTimestampProvider.delegate || Date).now();
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/scheduler/Action.js
var Action = function(_super) {
  __extends(Action2, _super);
  function Action2(scheduler, work) {
    return _super.call(this) || this;
  }
  Action2.prototype.schedule = function(state, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    return this;
  };
  return Action2;
}(Subscription);

// node_modules/rxjs/dist/esm5/internal/scheduler/intervalProvider.js
var intervalProvider = {
  setInterval: function(handler, timeout) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    var delegate = intervalProvider.delegate;
    if (delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) {
      return delegate.setInterval.apply(delegate, __spreadArray([handler, timeout], __read(args)));
    }
    return setInterval.apply(void 0, __spreadArray([handler, timeout], __read(args)));
  },
  clearInterval: function(handle) {
    var delegate = intervalProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/scheduler/AsyncAction.js
var AsyncAction = function(_super) {
  __extends(AsyncAction2, _super);
  function AsyncAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    _this.pending = false;
    return _this;
  }
  AsyncAction2.prototype.schedule = function(state, delay) {
    var _a;
    if (delay === void 0) {
      delay = 0;
    }
    if (this.closed) {
      return this;
    }
    this.state = state;
    var id = this.id;
    var scheduler = this.scheduler;
    if (id != null) {
      this.id = this.recycleAsyncId(scheduler, id, delay);
    }
    this.pending = true;
    this.delay = delay;
    this.id = (_a = this.id) !== null && _a !== void 0 ? _a : this.requestAsyncId(scheduler, this.id, delay);
    return this;
  };
  AsyncAction2.prototype.requestAsyncId = function(scheduler, _id, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay);
  };
  AsyncAction2.prototype.recycleAsyncId = function(_scheduler, id, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    if (delay != null && this.delay === delay && this.pending === false) {
      return id;
    }
    if (id != null) {
      intervalProvider.clearInterval(id);
    }
    return void 0;
  };
  AsyncAction2.prototype.execute = function(state, delay) {
    if (this.closed) {
      return new Error("executing a cancelled action");
    }
    this.pending = false;
    var error = this._execute(state, delay);
    if (error) {
      return error;
    } else if (this.pending === false && this.id != null) {
      this.id = this.recycleAsyncId(this.scheduler, this.id, null);
    }
  };
  AsyncAction2.prototype._execute = function(state, _delay) {
    var errored = false;
    var errorValue;
    try {
      this.work(state);
    } catch (e) {
      errored = true;
      errorValue = e ? e : new Error("Scheduled action threw falsy error");
    }
    if (errored) {
      this.unsubscribe();
      return errorValue;
    }
  };
  AsyncAction2.prototype.unsubscribe = function() {
    if (!this.closed) {
      var _a = this, id = _a.id, scheduler = _a.scheduler;
      var actions = scheduler.actions;
      this.work = this.state = this.scheduler = null;
      this.pending = false;
      arrRemove(actions, this);
      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, null);
      }
      this.delay = null;
      _super.prototype.unsubscribe.call(this);
    }
  };
  return AsyncAction2;
}(Action);

// node_modules/rxjs/dist/esm5/internal/Scheduler.js
var Scheduler = function() {
  function Scheduler2(schedulerActionCtor, now) {
    if (now === void 0) {
      now = Scheduler2.now;
    }
    this.schedulerActionCtor = schedulerActionCtor;
    this.now = now;
  }
  Scheduler2.prototype.schedule = function(work, delay, state) {
    if (delay === void 0) {
      delay = 0;
    }
    return new this.schedulerActionCtor(this, work).schedule(state, delay);
  };
  Scheduler2.now = dateTimestampProvider.now;
  return Scheduler2;
}();

// node_modules/rxjs/dist/esm5/internal/scheduler/AsyncScheduler.js
var AsyncScheduler = function(_super) {
  __extends(AsyncScheduler2, _super);
  function AsyncScheduler2(SchedulerAction, now) {
    if (now === void 0) {
      now = Scheduler.now;
    }
    var _this = _super.call(this, SchedulerAction, now) || this;
    _this.actions = [];
    _this._active = false;
    return _this;
  }
  AsyncScheduler2.prototype.flush = function(action) {
    var actions = this.actions;
    if (this._active) {
      actions.push(action);
      return;
    }
    var error;
    this._active = true;
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while (action = actions.shift());
    this._active = false;
    if (error) {
      while (action = actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AsyncScheduler2;
}(Scheduler);

// node_modules/rxjs/dist/esm5/internal/scheduler/async.js
var asyncScheduler = new AsyncScheduler(AsyncAction);

// node_modules/rxjs/dist/esm5/internal/scheduler/AnimationFrameAction.js
var AnimationFrameAction = function(_super) {
  __extends(AnimationFrameAction2, _super);
  function AnimationFrameAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }
  AnimationFrameAction2.prototype.requestAsyncId = function(scheduler, id, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    if (delay !== null && delay > 0) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
    }
    scheduler.actions.push(this);
    return scheduler._scheduled || (scheduler._scheduled = animationFrameProvider.requestAnimationFrame(function() {
      return scheduler.flush(void 0);
    }));
  };
  AnimationFrameAction2.prototype.recycleAsyncId = function(scheduler, id, delay) {
    var _a;
    if (delay === void 0) {
      delay = 0;
    }
    if (delay != null ? delay > 0 : this.delay > 0) {
      return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
    }
    var actions = scheduler.actions;
    if (id != null && id === scheduler._scheduled && ((_a = actions[actions.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== id) {
      animationFrameProvider.cancelAnimationFrame(id);
      scheduler._scheduled = void 0;
    }
    return void 0;
  };
  return AnimationFrameAction2;
}(AsyncAction);

// node_modules/rxjs/dist/esm5/internal/scheduler/AnimationFrameScheduler.js
var AnimationFrameScheduler = function(_super) {
  __extends(AnimationFrameScheduler2, _super);
  function AnimationFrameScheduler2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  AnimationFrameScheduler2.prototype.flush = function(action) {
    this._active = true;
    var flushId;
    if (action) {
      flushId = action.id;
    } else {
      flushId = this._scheduled;
      this._scheduled = void 0;
    }
    var actions = this.actions;
    var error;
    action = action || actions.shift();
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while ((action = actions[0]) && action.id === flushId && actions.shift());
    this._active = false;
    if (error) {
      while ((action = actions[0]) && action.id === flushId && actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AnimationFrameScheduler2;
}(AsyncScheduler);

// node_modules/rxjs/dist/esm5/internal/scheduler/animationFrame.js
var animationFrameScheduler = new AnimationFrameScheduler(AnimationFrameAction);

// node_modules/rxjs/dist/esm5/internal/observable/empty.js
var EMPTY = new Observable(function(subscriber) {
  return subscriber.complete();
});

// node_modules/rxjs/dist/esm5/internal/util/isScheduler.js
function isScheduler(value) {
  return value && isFunction(value.schedule);
}

// node_modules/rxjs/dist/esm5/internal/util/args.js
function last(arr) {
  return arr[arr.length - 1];
}
function popResultSelector(args) {
  return isFunction(last(args)) ? args.pop() : void 0;
}
function popScheduler(args) {
  return isScheduler(last(args)) ? args.pop() : void 0;
}
function popNumber(args, defaultValue) {
  return typeof last(args) === "number" ? args.pop() : defaultValue;
}

// node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js
var isArrayLike = function(x) {
  return x && typeof x.length === "number" && typeof x !== "function";
};

// node_modules/rxjs/dist/esm5/internal/util/isPromise.js
function isPromise(value) {
  return isFunction(value === null || value === void 0 ? void 0 : value.then);
}

// node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js
function isInteropObservable(input) {
  return isFunction(input[observable]);
}

// node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js
function isAsyncIterable(obj) {
  return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
}

// node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js
function createInvalidObservableTypeError(input) {
  return new TypeError("You provided " + (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}

// node_modules/rxjs/dist/esm5/internal/symbol/iterator.js
function getSymbolIterator() {
  if (typeof Symbol !== "function" || !Symbol.iterator) {
    return "@@iterator";
  }
  return Symbol.iterator;
}
var iterator = getSymbolIterator();

// node_modules/rxjs/dist/esm5/internal/util/isIterable.js
function isIterable(input) {
  return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
}

// node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js
function readableStreamLikeToAsyncGenerator(readableStream) {
  return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
    var reader, _a, value, done;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          reader = readableStream.getReader();
          _b.label = 1;
        case 1:
          _b.trys.push([1, , 9, 10]);
          _b.label = 2;
        case 2:
          if (false) return [3, 8];
          return [4, __await(reader.read())];
        case 3:
          _a = _b.sent(), value = _a.value, done = _a.done;
          if (!done) return [3, 5];
          return [4, __await(void 0)];
        case 4:
          return [2, _b.sent()];
        case 5:
          return [4, __await(value)];
        case 6:
          return [4, _b.sent()];
        case 7:
          _b.sent();
          return [3, 2];
        case 8:
          return [3, 10];
        case 9:
          reader.releaseLock();
          return [7];
        case 10:
          return [2];
      }
    });
  });
}
function isReadableStreamLike(obj) {
  return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
}

// node_modules/rxjs/dist/esm5/internal/observable/innerFrom.js
function innerFrom(input) {
  if (input instanceof Observable) {
    return input;
  }
  if (input != null) {
    if (isInteropObservable(input)) {
      return fromInteropObservable(input);
    }
    if (isArrayLike(input)) {
      return fromArrayLike(input);
    }
    if (isPromise(input)) {
      return fromPromise(input);
    }
    if (isAsyncIterable(input)) {
      return fromAsyncIterable(input);
    }
    if (isIterable(input)) {
      return fromIterable(input);
    }
    if (isReadableStreamLike(input)) {
      return fromReadableStreamLike(input);
    }
  }
  throw createInvalidObservableTypeError(input);
}
function fromInteropObservable(obj) {
  return new Observable(function(subscriber) {
    var obs = obj[observable]();
    if (isFunction(obs.subscribe)) {
      return obs.subscribe(subscriber);
    }
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function fromArrayLike(array) {
  return new Observable(function(subscriber) {
    for (var i = 0; i < array.length && !subscriber.closed; i++) {
      subscriber.next(array[i]);
    }
    subscriber.complete();
  });
}
function fromPromise(promise) {
  return new Observable(function(subscriber) {
    promise.then(function(value) {
      if (!subscriber.closed) {
        subscriber.next(value);
        subscriber.complete();
      }
    }, function(err) {
      return subscriber.error(err);
    }).then(null, reportUnhandledError);
  });
}
function fromIterable(iterable) {
  return new Observable(function(subscriber) {
    var e_1, _a;
    try {
      for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
        var value = iterable_1_1.value;
        subscriber.next(value);
        if (subscriber.closed) {
          return;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    subscriber.complete();
  });
}
function fromAsyncIterable(asyncIterable) {
  return new Observable(function(subscriber) {
    process(asyncIterable, subscriber).catch(function(err) {
      return subscriber.error(err);
    });
  });
}
function fromReadableStreamLike(readableStream) {
  return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
}
function process(asyncIterable, subscriber) {
  var asyncIterable_1, asyncIterable_1_1;
  var e_2, _a;
  return __awaiter(this, void 0, void 0, function() {
    var value, e_2_1;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 5, 6, 11]);
          asyncIterable_1 = __asyncValues(asyncIterable);
          _b.label = 1;
        case 1:
          return [4, asyncIterable_1.next()];
        case 2:
          if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
          value = asyncIterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return [2];
          }
          _b.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          e_2_1 = _b.sent();
          e_2 = { error: e_2_1 };
          return [3, 11];
        case 6:
          _b.trys.push([6, , 9, 10]);
          if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))) return [3, 8];
          return [4, _a.call(asyncIterable_1)];
        case 7:
          _b.sent();
          _b.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (e_2) throw e_2.error;
          return [7];
        case 10:
          return [7];
        case 11:
          subscriber.complete();
          return [2];
      }
    });
  });
}

// node_modules/rxjs/dist/esm5/internal/util/executeSchedule.js
function executeSchedule(parentSubscription, scheduler, work, delay, repeat) {
  if (delay === void 0) {
    delay = 0;
  }
  if (repeat === void 0) {
    repeat = false;
  }
  var scheduleSubscription = scheduler.schedule(function() {
    work();
    if (repeat) {
      parentSubscription.add(this.schedule(null, delay));
    } else {
      this.unsubscribe();
    }
  }, delay);
  parentSubscription.add(scheduleSubscription);
  if (!repeat) {
    return scheduleSubscription;
  }
}

// node_modules/rxjs/dist/esm5/internal/operators/observeOn.js
function observeOn(scheduler, delay) {
  if (delay === void 0) {
    delay = 0;
  }
  return operate(function(source, subscriber) {
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.next(value);
      }, delay);
    }, function() {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.complete();
      }, delay);
    }, function(err) {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.error(err);
      }, delay);
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/subscribeOn.js
function subscribeOn(scheduler, delay) {
  if (delay === void 0) {
    delay = 0;
  }
  return operate(function(source, subscriber) {
    subscriber.add(scheduler.schedule(function() {
      return source.subscribe(subscriber);
    }, delay));
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleObservable.js
function scheduleObservable(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

// node_modules/rxjs/dist/esm5/internal/scheduled/schedulePromise.js
function schedulePromise(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js
function scheduleArray(input, scheduler) {
  return new Observable(function(subscriber) {
    var i = 0;
    return scheduler.schedule(function() {
      if (i === input.length) {
        subscriber.complete();
      } else {
        subscriber.next(input[i++]);
        if (!subscriber.closed) {
          this.schedule();
        }
      }
    });
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleIterable.js
function scheduleIterable(input, scheduler) {
  return new Observable(function(subscriber) {
    var iterator2;
    executeSchedule(subscriber, scheduler, function() {
      iterator2 = input[iterator]();
      executeSchedule(subscriber, scheduler, function() {
        var _a;
        var value;
        var done;
        try {
          _a = iterator2.next(), value = _a.value, done = _a.done;
        } catch (err) {
          subscriber.error(err);
          return;
        }
        if (done) {
          subscriber.complete();
        } else {
          subscriber.next(value);
        }
      }, 0, true);
    });
    return function() {
      return isFunction(iterator2 === null || iterator2 === void 0 ? void 0 : iterator2.return) && iterator2.return();
    };
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleAsyncIterable.js
function scheduleAsyncIterable(input, scheduler) {
  if (!input) {
    throw new Error("Iterable cannot be null");
  }
  return new Observable(function(subscriber) {
    executeSchedule(subscriber, scheduler, function() {
      var iterator2 = input[Symbol.asyncIterator]();
      executeSchedule(subscriber, scheduler, function() {
        iterator2.next().then(function(result) {
          if (result.done) {
            subscriber.complete();
          } else {
            subscriber.next(result.value);
          }
        });
      }, 0, true);
    });
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleReadableStreamLike.js
function scheduleReadableStreamLike(input, scheduler) {
  return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduled.js
function scheduled(input, scheduler) {
  if (input != null) {
    if (isInteropObservable(input)) {
      return scheduleObservable(input, scheduler);
    }
    if (isArrayLike(input)) {
      return scheduleArray(input, scheduler);
    }
    if (isPromise(input)) {
      return schedulePromise(input, scheduler);
    }
    if (isAsyncIterable(input)) {
      return scheduleAsyncIterable(input, scheduler);
    }
    if (isIterable(input)) {
      return scheduleIterable(input, scheduler);
    }
    if (isReadableStreamLike(input)) {
      return scheduleReadableStreamLike(input, scheduler);
    }
  }
  throw createInvalidObservableTypeError(input);
}

// node_modules/rxjs/dist/esm5/internal/observable/from.js
function from(input, scheduler) {
  return scheduler ? scheduled(input, scheduler) : innerFrom(input);
}

// node_modules/rxjs/dist/esm5/internal/observable/of.js
function of() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  return from(args, scheduler);
}

// node_modules/rxjs/dist/esm5/internal/util/isObservable.js
function isObservable(obj) {
  return !!obj && (obj instanceof Observable || isFunction(obj.lift) && isFunction(obj.subscribe));
}

// node_modules/rxjs/dist/esm5/internal/operators/map.js
function map(project, thisArg) {
  return operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      subscriber.next(project.call(thisArg, value, index++));
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/util/mapOneOrManyArgs.js
var isArray = Array.isArray;
function callOrApply(fn, args) {
  return isArray(args) ? fn.apply(void 0, __spreadArray([], __read(args))) : fn(args);
}
function mapOneOrManyArgs(fn) {
  return map(function(args) {
    return callOrApply(fn, args);
  });
}

// node_modules/rxjs/dist/esm5/internal/util/argsArgArrayOrObject.js
var isArray2 = Array.isArray;
var getPrototypeOf = Object.getPrototypeOf;
var objectProto = Object.prototype;
var getKeys = Object.keys;
function argsArgArrayOrObject(args) {
  if (args.length === 1) {
    var first_1 = args[0];
    if (isArray2(first_1)) {
      return { args: first_1, keys: null };
    }
    if (isPOJO(first_1)) {
      var keys = getKeys(first_1);
      return {
        args: keys.map(function(key) {
          return first_1[key];
        }),
        keys
      };
    }
  }
  return { args, keys: null };
}
function isPOJO(obj) {
  return obj && typeof obj === "object" && getPrototypeOf(obj) === objectProto;
}

// node_modules/rxjs/dist/esm5/internal/util/createObject.js
function createObject(keys, values) {
  return keys.reduce(function(result, key, i) {
    return result[key] = values[i], result;
  }, {});
}

// node_modules/rxjs/dist/esm5/internal/observable/combineLatest.js
function combineLatest() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  var resultSelector = popResultSelector(args);
  var _a = argsArgArrayOrObject(args), observables = _a.args, keys = _a.keys;
  if (observables.length === 0) {
    return from([], scheduler);
  }
  var result = new Observable(combineLatestInit(observables, scheduler, keys ? function(values) {
    return createObject(keys, values);
  } : identity));
  return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
}
function combineLatestInit(observables, scheduler, valueTransform) {
  if (valueTransform === void 0) {
    valueTransform = identity;
  }
  return function(subscriber) {
    maybeSchedule(scheduler, function() {
      var length = observables.length;
      var values = new Array(length);
      var active = length;
      var remainingFirstValues = length;
      var _loop_1 = function(i2) {
        maybeSchedule(scheduler, function() {
          var source = from(observables[i2], scheduler);
          var hasFirstValue = false;
          source.subscribe(createOperatorSubscriber(subscriber, function(value) {
            values[i2] = value;
            if (!hasFirstValue) {
              hasFirstValue = true;
              remainingFirstValues--;
            }
            if (!remainingFirstValues) {
              subscriber.next(valueTransform(values.slice()));
            }
          }, function() {
            if (!--active) {
              subscriber.complete();
            }
          }));
        }, subscriber);
      };
      for (var i = 0; i < length; i++) {
        _loop_1(i);
      }
    }, subscriber);
  };
}
function maybeSchedule(scheduler, execute, subscription) {
  if (scheduler) {
    executeSchedule(subscription, scheduler, execute);
  } else {
    execute();
  }
}

// node_modules/rxjs/dist/esm5/internal/operators/mergeInternals.js
function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
  var buffer = [];
  var active = 0;
  var index = 0;
  var isComplete = false;
  var checkComplete = function() {
    if (isComplete && !buffer.length && !active) {
      subscriber.complete();
    }
  };
  var outerNext = function(value) {
    return active < concurrent ? doInnerSub(value) : buffer.push(value);
  };
  var doInnerSub = function(value) {
    expand && subscriber.next(value);
    active++;
    var innerComplete = false;
    innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function(innerValue) {
      onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
      if (expand) {
        outerNext(innerValue);
      } else {
        subscriber.next(innerValue);
      }
    }, function() {
      innerComplete = true;
    }, void 0, function() {
      if (innerComplete) {
        try {
          active--;
          var _loop_1 = function() {
            var bufferedValue = buffer.shift();
            if (innerSubScheduler) {
              executeSchedule(subscriber, innerSubScheduler, function() {
                return doInnerSub(bufferedValue);
              });
            } else {
              doInnerSub(bufferedValue);
            }
          };
          while (buffer.length && active < concurrent) {
            _loop_1();
          }
          checkComplete();
        } catch (err) {
          subscriber.error(err);
        }
      }
    }));
  };
  source.subscribe(createOperatorSubscriber(subscriber, outerNext, function() {
    isComplete = true;
    checkComplete();
  }));
  return function() {
    additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
  };
}

// node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js
function mergeMap(project, resultSelector, concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  if (isFunction(resultSelector)) {
    return mergeMap(function(a, i) {
      return map(function(b, ii) {
        return resultSelector(a, b, i, ii);
      })(innerFrom(project(a, i)));
    }, concurrent);
  } else if (typeof resultSelector === "number") {
    concurrent = resultSelector;
  }
  return operate(function(source, subscriber) {
    return mergeInternals(source, subscriber, project, concurrent);
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js
function mergeAll(concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  return mergeMap(identity, concurrent);
}

// node_modules/rxjs/dist/esm5/internal/operators/concatAll.js
function concatAll() {
  return mergeAll(1);
}

// node_modules/rxjs/dist/esm5/internal/observable/concat.js
function concat() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return concatAll()(from(args, popScheduler(args)));
}

// node_modules/rxjs/dist/esm5/internal/observable/fromEvent.js
var nodeEventEmitterMethods = ["addListener", "removeListener"];
var eventTargetMethods = ["addEventListener", "removeEventListener"];
var jqueryMethods = ["on", "off"];
function fromEvent(target, eventName, options, resultSelector) {
  if (isFunction(options)) {
    resultSelector = options;
    options = void 0;
  }
  if (resultSelector) {
    return fromEvent(target, eventName, options).pipe(mapOneOrManyArgs(resultSelector));
  }
  var _a = __read(isEventTarget(target) ? eventTargetMethods.map(function(methodName) {
    return function(handler) {
      return target[methodName](eventName, handler, options);
    };
  }) : isNodeStyleEventEmitter(target) ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName)) : isJQueryStyleEventEmitter(target) ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName)) : [], 2), add = _a[0], remove = _a[1];
  if (!add) {
    if (isArrayLike(target)) {
      return mergeMap(function(subTarget) {
        return fromEvent(subTarget, eventName, options);
      })(innerFrom(target));
    }
  }
  if (!add) {
    throw new TypeError("Invalid event target");
  }
  return new Observable(function(subscriber) {
    var handler = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return subscriber.next(1 < args.length ? args : args[0]);
    };
    add(handler);
    return function() {
      return remove(handler);
    };
  });
}
function toCommonHandlerRegistry(target, eventName) {
  return function(methodName) {
    return function(handler) {
      return target[methodName](eventName, handler);
    };
  };
}
function isNodeStyleEventEmitter(target) {
  return isFunction(target.addListener) && isFunction(target.removeListener);
}
function isJQueryStyleEventEmitter(target) {
  return isFunction(target.on) && isFunction(target.off);
}
function isEventTarget(target) {
  return isFunction(target.addEventListener) && isFunction(target.removeEventListener);
}

// node_modules/rxjs/dist/esm5/internal/observable/merge.js
function merge() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  var concurrent = popNumber(args, Infinity);
  var sources = args;
  return !sources.length ? EMPTY : sources.length === 1 ? innerFrom(sources[0]) : mergeAll(concurrent)(from(sources, scheduler));
}

// node_modules/rxjs/dist/esm5/internal/observable/never.js
var NEVER = new Observable(noop);

// node_modules/rxjs/dist/esm5/internal/operators/filter.js
function filter(predicate, thisArg) {
  return operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return predicate.call(thisArg, value, index++) && subscriber.next(value);
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/observable/range.js
function range(start, count, scheduler) {
  if (count == null) {
    count = start;
    start = 0;
  }
  if (count <= 0) {
    return EMPTY;
  }
  var end = count + start;
  return new Observable(scheduler ? function(subscriber) {
    var n = start;
    return scheduler.schedule(function() {
      if (n < end) {
        subscriber.next(n++);
        this.schedule();
      } else {
        subscriber.complete();
      }
    });
  } : function(subscriber) {
    var n = start;
    while (n < end && !subscriber.closed) {
      subscriber.next(n++);
    }
    subscriber.complete();
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/bufferTime.js
function bufferTime(bufferTimeSpan) {
  var _a, _b;
  var otherArgs = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    otherArgs[_i - 1] = arguments[_i];
  }
  var scheduler = (_a = popScheduler(otherArgs)) !== null && _a !== void 0 ? _a : asyncScheduler;
  var bufferCreationInterval = (_b = otherArgs[0]) !== null && _b !== void 0 ? _b : null;
  var maxBufferSize = otherArgs[1] || Infinity;
  return operate(function(source, subscriber) {
    var bufferRecords = [];
    var restartOnEmit = false;
    var emit = function(record) {
      var buffer = record.buffer, subs = record.subs;
      subs.unsubscribe();
      arrRemove(bufferRecords, record);
      subscriber.next(buffer);
      restartOnEmit && startBuffer();
    };
    var startBuffer = function() {
      if (bufferRecords) {
        var subs = new Subscription();
        subscriber.add(subs);
        var buffer = [];
        var record_1 = {
          buffer,
          subs
        };
        bufferRecords.push(record_1);
        executeSchedule(subs, scheduler, function() {
          return emit(record_1);
        }, bufferTimeSpan);
      }
    };
    if (bufferCreationInterval !== null && bufferCreationInterval >= 0) {
      executeSchedule(subscriber, scheduler, startBuffer, bufferCreationInterval, true);
    } else {
      restartOnEmit = true;
    }
    startBuffer();
    var bufferTimeSubscriber = createOperatorSubscriber(subscriber, function(value) {
      var e_1, _a2;
      var recordsCopy = bufferRecords.slice();
      try {
        for (var recordsCopy_1 = __values(recordsCopy), recordsCopy_1_1 = recordsCopy_1.next(); !recordsCopy_1_1.done; recordsCopy_1_1 = recordsCopy_1.next()) {
          var record = recordsCopy_1_1.value;
          var buffer = record.buffer;
          buffer.push(value);
          maxBufferSize <= buffer.length && emit(record);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (recordsCopy_1_1 && !recordsCopy_1_1.done && (_a2 = recordsCopy_1.return)) _a2.call(recordsCopy_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }, function() {
      while (bufferRecords === null || bufferRecords === void 0 ? void 0 : bufferRecords.length) {
        subscriber.next(bufferRecords.shift().buffer);
      }
      bufferTimeSubscriber === null || bufferTimeSubscriber === void 0 ? void 0 : bufferTimeSubscriber.unsubscribe();
      subscriber.complete();
      subscriber.unsubscribe();
    }, void 0, function() {
      return bufferRecords = null;
    });
    source.subscribe(bufferTimeSubscriber);
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/scanInternals.js
function scanInternals(accumulator, seed, hasSeed, emitOnNext, emitBeforeComplete) {
  return function(source, subscriber) {
    var hasState = hasSeed;
    var state = seed;
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      var i = index++;
      state = hasState ? accumulator(state, value, i) : (hasState = true, value);
      emitOnNext && subscriber.next(state);
    }, emitBeforeComplete && function() {
      hasState && subscriber.next(state);
      subscriber.complete();
    }));
  };
}

// node_modules/rxjs/dist/esm5/internal/operators/distinctUntilChanged.js
function distinctUntilChanged(comparator, keySelector) {
  if (keySelector === void 0) {
    keySelector = identity;
  }
  comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
  return operate(function(source, subscriber) {
    var previousKey;
    var first = true;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      var currentKey = keySelector(value);
      if (first || !comparator(previousKey, currentKey)) {
        first = false;
        previousKey = currentKey;
        subscriber.next(value);
      }
    }));
  });
}
function defaultCompare(a, b) {
  return a === b;
}

// node_modules/rxjs/dist/esm5/internal/operators/scan.js
function scan(accumulator, seed) {
  return operate(scanInternals(accumulator, seed, arguments.length >= 2, true));
}

// node_modules/rxjs/dist/esm5/internal/operators/switchMap.js
function switchMap(project, resultSelector) {
  return operate(function(source, subscriber) {
    var innerSubscriber = null;
    var index = 0;
    var isComplete = false;
    var checkComplete = function() {
      return isComplete && !innerSubscriber && subscriber.complete();
    };
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
      var innerIndex = 0;
      var outerIndex = index++;
      innerFrom(project(value, outerIndex)).subscribe(innerSubscriber = createOperatorSubscriber(subscriber, function(innerValue) {
        return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue);
      }, function() {
        innerSubscriber = null;
        checkComplete();
      }));
    }, function() {
      isComplete = true;
      checkComplete();
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/takeUntil.js
function takeUntil(notifier) {
  return operate(function(source, subscriber) {
    innerFrom(notifier).subscribe(createOperatorSubscriber(subscriber, function() {
      return subscriber.complete();
    }, noop));
    !subscriber.closed && source.subscribe(subscriber);
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/withLatestFrom.js
function withLatestFrom() {
  var inputs = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    inputs[_i] = arguments[_i];
  }
  var project = popResultSelector(inputs);
  return operate(function(source, subscriber) {
    var len = inputs.length;
    var otherValues = new Array(len);
    var hasValue = inputs.map(function() {
      return false;
    });
    var ready = false;
    var _loop_1 = function(i2) {
      innerFrom(inputs[i2]).subscribe(createOperatorSubscriber(subscriber, function(value) {
        otherValues[i2] = value;
        if (!ready && !hasValue[i2]) {
          hasValue[i2] = true;
          (ready = hasValue.every(identity)) && (hasValue = null);
        }
      }, noop));
    };
    for (var i = 0; i < len; i++) {
      _loop_1(i);
    }
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      if (ready) {
        var values = __spreadArray([value], __read(otherValues));
        subscriber.next(project ? project.apply(void 0, __spreadArray([], __read(values))) : values);
      }
    }));
  });
}

// node_modules/butterfloat/events.js
var ButterfloatEvent = Symbol("Butterfloat Event");
var EventProxyHandler = class {
  #subjects = /* @__PURE__ */ new WeakMap();
  #componentName;
  get componentName() {
    return this.#componentName;
  }
  constructor(componentName) {
    this.#componentName = componentName;
  }
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    }
    const subject = new Subject();
    const observable2 = subject.asObservable();
    observable2[ButterfloatEvent] = `${this.componentName} ${prop}`;
    this.#subjects.set(observable2, subject);
    target[prop] = observable2;
    return target[prop];
  }
  applyEvent(event, element, eventName) {
    const subject = this.#subjects.get(event);
    if (!subject) {
      throw new Error(`Unhandled event subject: ${event[ButterfloatEvent]}`);
    }
    if (eventName === "bfDomAttach") {
      subject.next(element);
      return new Subscription();
    }
    const observable2 = fromEvent(element, eventName);
    return observable2.subscribe(subject);
  }
};
function makeEventProxy(componentName, baseEvents = {}) {
  const events = { ...baseEvents };
  const handler = new EventProxyHandler(componentName);
  const proxy = new Proxy(events, handler);
  return { events: proxy, handler };
}

// node_modules/butterfloat/component.js
function hasAnyBinds(description) {
  return Boolean(description.childrenBind) || Object.keys(description.bind).length > 0 || Object.keys(description.immediateBind).length > 0 || Object.keys(description.events).length > 0 || Object.keys(description.styleBind).length > 0 || Object.keys(description.immediateStyleBind).length > 0 || Object.keys(description.classBind).length > 0 || Object.keys(description.immediateClassBind).length > 0;
}

// node_modules/butterfloat/butterfly.js
function butterfly(startingValue) {
  const subject = new BehaviorSubject(startingValue);
  function setState(value) {
    if (typeof value === "function") {
      const setter = value;
      subject.next(setter(subject.getValue()));
    } else {
      subject.next(value);
    }
  }
  return [
    subject.asObservable(),
    setState,
    subject.error.bind(subject),
    subject.complete.bind(subject)
  ];
}

// node_modules/butterfloat/jsx.js
function Children({ context: context2 }) {
  return {
    type: "children",
    context: context2
  };
}
function Fragment(attributes, ...children) {
  const { childrenBind, childrenBindMode, ...otherAttributes } = attributes ?? {};
  return {
    type: "fragment",
    attributes: otherAttributes,
    children,
    childrenBind,
    childrenBindMode
  };
}
function Static({ element }) {
  return {
    type: "static",
    element
  };
}
function Comment({ comment }) {
  return {
    type: "comment",
    comment
  };
}
function Empty() {
  return {
    type: "empty"
  };
}
function jsx(element, attributes, ...children) {
  children = children.flat().map((child) => {
    if (typeof child === "number") {
      return child.toLocaleString();
    }
    return child;
  });
  if (typeof element === "string") {
    const { bind: bind2, immediateBind, childrenBind, childrenBindMode, events, styleBind, immediateStyleBind, classBind, immediateClassBind, ...otherAttributes } = attributes ?? {};
    return {
      type: "element",
      element,
      attributes: otherAttributes,
      bind: bind2 ?? {},
      immediateBind: immediateBind ?? {},
      children,
      childrenBind,
      childrenBindMode,
      events: events ?? {},
      styleBind: styleBind ?? {},
      immediateStyleBind: immediateStyleBind ?? {},
      classBind: classBind ?? {},
      immediateClassBind: immediateClassBind ?? {}
    };
  }
  if (typeof element === "function") {
    if (element === Fragment || element === Children || element === Static || element === Empty || element === Comment) {
      const func = element;
      return func(attributes ?? {}, ...children);
    }
    const { childrenBind, childrenBindMode, ...otherAttributes } = attributes ?? {};
    return {
      type: "component",
      component: element,
      properties: otherAttributes,
      children,
      childrenBind,
      childrenBindMode
    };
  }
  throw new Error(`Unsupported jsx in ${element}`);
}

// node_modules/butterfloat/binding.js
function bindObjectKey(item, key, observable2, error, complete) {
  return observable2.subscribe({
    next: (value) => {
      item[key] = value;
    },
    error,
    complete: () => {
      console.debug(`${key.toString()} binding completed`, item);
      complete();
    }
  });
}
function bindObjectChanges(item, observable2, error, complete) {
  return observable2.subscribe({
    next: (changes) => {
      Object.assign(item, changes);
    },
    error,
    complete: () => {
      console.debug(`Change binding completed`, item);
      complete();
    }
  });
}
function bindClassListKey(item, key, observable2, error, complete) {
  return observable2.subscribe({
    next: (value) => {
      if (value) {
        item.classList.add(key);
      } else {
        item.classList.remove(key);
      }
    },
    error,
    complete: () => {
      console.debug(`${key.toString()} classList binding completed`, item);
      complete();
    }
  });
}
function bindClassListChanges(item, observable2, error, complete) {
  return observable2.subscribe({
    next: (changes) => {
      const adds = [];
      const removes = [];
      for (const [key, add] of Object.entries(changes)) {
        if (add) {
          adds.push(key);
        } else {
          removes.push(key);
        }
      }
      if (adds.length > 0) {
        item.classList.add(...adds);
      }
      if (removes.length > 0) {
        item.classList.remove(...removes);
      }
    },
    error,
    complete: () => {
      console.debug(`classList changes binding completed`, item);
      complete();
    }
  });
}
function bufferEntries(observable2, suspense) {
  if (suspense) {
    return combineLatest([suspense, observable2]).pipe(bufferTime(0, animationFrameScheduler), map((states) => states.reduce((acc, [suspend, entry]) => ({
      suspend,
      entries: [...acc.entries, entry]
    }), { suspend: false, entries: [] })), scan((acc, cur) => ({
      changes: acc.suspend && cur.suspend ? Object.assign(acc.changes, Object.fromEntries(cur.entries)) : Object.fromEntries(cur.entries),
      suspend: cur.suspend
    }), { suspend: false, changes: {} }), filter(({ suspend }) => !suspend), map(({ changes }) => changes));
  }
  return observable2.pipe(bufferTime(0, animationFrameScheduler), map((entries) => Object.fromEntries(entries)));
}
function schedulable(key, immediate) {
  return !(immediate || key === "value");
}
function scheduledKey(key) {
  if (key === "bfDelayValue") {
    return "value";
  }
  return key;
}
function makeEntries(key, observable2) {
  return observable2.pipe(map((value) => [key, value]));
}
function bindElementBinds(element, description, { complete, error, suspense, subscription }) {
  const schedulables = [];
  const binds = [
    ...Object.entries(description.bind).map(([key, observable2]) => [key, observable2, false]),
    ...Object.entries(description.immediateBind).map(([key, observable2]) => [key, observable2, true])
  ];
  for (const [key, observable2, immediate] of binds) {
    if (schedulable(key, immediate)) {
      schedulables.push([scheduledKey(key), observable2]);
    } else {
      subscription.add(bindObjectKey(element, key, observable2, error, complete));
    }
  }
  if (schedulables.length) {
    const scheduled2 = schedulables.map(([key, observable2]) => makeEntries(key, observable2));
    subscription.add(bindObjectChanges(element, bufferEntries(merge(...scheduled2), suspense), error, complete));
  }
}
function bindElementEvents(element, description, { eventBinder, subscription }) {
  for (const [key, event] of Object.entries(description.events)) {
    subscription.add(eventBinder.applyEvent(event, element, key));
  }
}
function bindElementChildren(element, description, context2, document2 = globalThis.document) {
  const { complete, componentRunner, componentWirer, error, subscription } = context2;
  if (description.childrenBind) {
    if (description.childrenBindMode === "replace") {
      const placeholder = document2.createComment(`replaceable child component`);
      element.append(placeholder);
      const activeChild = description.childrenBind.pipe(switchMap((child) => componentWirer(child, context2, void 0, document2)));
      const childComponent = activeChild;
      childComponent.name = `${element.nodeName} replaceable child`;
      childComponent.isReplaceAll = true;
      subscription.add(componentRunner(element, childComponent, context2, placeholder, document2));
    } else {
      subscription.add(description.childrenBind.subscribe({
        next(child) {
          const placeholder = document2.createComment(`${child.name} component`);
          if (description.childrenBindMode === "prepend") {
            element.prepend(placeholder);
          } else {
            element.append(placeholder);
          }
          subscription.add(componentRunner(element, child, context2, placeholder, document2));
        },
        error,
        complete: () => {
          console.debug(`Children binding completed`, element);
          complete();
        }
      }));
    }
  }
}
function bindElementClasses(element, description, { complete, error, subscription, suspense }) {
  if (Object.keys(description.classBind).length > 0) {
    const entries = [];
    for (const [key, observable2] of Object.entries(description.classBind)) {
      entries.push(makeEntries(key, observable2));
    }
    subscription.add(bindClassListChanges(element, bufferEntries(merge(...entries), suspense), error, complete));
  }
  for (const [key, observable2] of Object.entries(description.immediateClassBind)) {
    subscription.add(bindClassListKey(element, key, observable2, error, complete));
  }
}
function bindElementStyles(element, description, { complete, error, subscription, suspense }) {
  if (Object.keys(description.styleBind).length > 0) {
    const entries = [];
    for (const [key, observable2] of Object.entries(description.styleBind)) {
      entries.push(makeEntries(key, observable2));
    }
    subscription.add(bindObjectChanges(element.style, bufferEntries(merge(...entries), suspense), error, complete));
  }
  for (const [key, observable2] of Object.entries(description.immediateStyleBind)) {
    subscription.add(bindObjectKey(element.style, key, observable2, error, complete));
  }
}
function bindElement(element, description, context2, document2 = globalThis.document) {
  const { subscription } = context2;
  bindElementBinds(element, description, context2);
  bindElementEvents(element, description, context2);
  bindElementChildren(element, description, context2, document2);
  bindElementClasses(element, description, context2);
  bindElementStyles(element, description, context2);
  return subscription;
}
function bindFragmentChildren(nodeDescription, node, subscription, context2, document2 = globalThis.document) {
  const { complete, error, componentRunner, componentWirer } = context2;
  if (nodeDescription.childrenBind) {
    const parent = node.parentElement;
    if (!parent) {
      throw new Error("Attempted to bind children to an unattached fragment");
    }
    if (nodeDescription.childrenBindMode === "replace") {
      const activeChild = nodeDescription.childrenBind.pipe(switchMap((child) => componentWirer(child, context2, void 0, document2)));
      const childComponent = activeChild;
      childComponent.name = `${node.nodeName} replaceable child`;
      subscription.add(componentRunner(node.parentElement, childComponent, context2, node, document2));
    } else {
      subscription.add(nodeDescription.childrenBind.subscribe({
        next(child) {
          const placeholder = document2.createComment(`${child.name} component`);
          if (nodeDescription.childrenBindMode === "prepend") {
            parent.insertBefore(node, placeholder);
          } else {
            const next = node.nextSibling;
            if (next) {
              parent.insertBefore(next, placeholder);
            } else {
              parent.append(placeholder);
            }
          }
          subscription.add(componentRunner(parent, {
            type: "component",
            component: child,
            properties: {},
            children: []
          }, context2, placeholder));
        },
        error,
        complete
      }));
    }
  }
}

// node_modules/butterfloat/suspense.js
var Suspense = () => {
  throw new Error("Suspense is a custom-wired component");
};
function wireSuspense(description, context2, document2 = globalThis.document) {
  context2.isStaticComponent = false;
  context2.isStaticTree = false;
  const props = description.properties;
  const suspense = context2.suspense ? combineLatest([props.when, context2.suspense]).pipe(map(([a, b]) => a || b)) : props.when;
  const mainComponentFragment = {
    type: "fragment",
    attributes: {},
    children: description.children,
    childrenBind: description.childrenBind,
    childrenBindMode: description.childrenBindMode
  };
  const mainComponent = () => mainComponentFragment;
  const mainContext = { ...context2, suspense };
  const main2 = wire(mainComponent, mainContext, void 0, document2);
  if (props.suspenseView) {
    const suspenseView = wire(props.suspenseView, { ...context2 }, void 0, document2);
    return combineLatest([props.when, main2, suspenseView]).pipe(map(([suspend, main3, suspenseView2]) => suspend ? suspenseView2 : main3), distinctUntilChanged());
  } else {
    return main2;
  }
}

// node_modules/butterfloat/wiring.js
var contextChildrenDescriptions = /* @__PURE__ */ new WeakMap();
function isCommentNode(node) {
  return node.nodeType === node.COMMENT_NODE;
}
function wireInternal(description, subscriber, context2, outerContainer, document2 = globalThis.document) {
  const { treeError } = context2;
  const subscription = new Subscription();
  const componentName = description.component.name;
  const error = treeError ? (error2) => {
    console.error(`Error in component ${componentName}`, error2);
    treeError(error2);
  } : (error2) => {
    console.error(`Error in component ${componentName}`, error2);
  };
  const { events, handler } = makeEventProxy(componentName);
  const componentContext = {
    bindEffect(observable2, effect) {
      context2.isStaticComponent = false;
      subscription.add(observable2.pipe(observeOn(animationFrameScheduler)).subscribe({
        next(value) {
          const promise = effect(value);
          if (promise && "catch" in promise) {
            promise.catch(error);
          }
        },
        error,
        complete: () => {
          console.debug(`Effect in component ${componentName} completed`);
          subscriber.complete();
        }
      }));
    },
    bindImmediateEffect(observable2, effect) {
      context2.isStaticComponent = false;
      subscription.add(observable2.subscribe({
        next(value) {
          const promise = effect(value);
          if (promise && "catch" in promise) {
            promise.catch(error);
          }
        },
        error,
        complete: () => {
          console.debug(`Immediate effect in component ${componentName} completed`);
          subscriber.complete();
        }
      }));
    },
    events
  };
  contextChildrenDescriptions.set(componentContext, description);
  try {
    const { elementBinds, nodeBinds, container, isSameContainer } = context2.domStrategy(description.component, description.properties, componentContext, outerContainer, document2);
    context2.isStaticComponent &&= elementBinds.length === 0;
    context2.isStaticTree &&= context2.isStaticComponent;
    if (!isSameContainer) {
      subscriber.next(container);
    } else {
      subscriber.next(document2.createComment("prestamp bound"));
    }
    if (isCommentNode(container)) {
      if (elementBinds.length > 0 || nodeBinds.length > 0) {
        console.warn(`Trying to bind to an empty component named ${componentName}`);
      }
      return () => {
        subscription.unsubscribe();
      };
    }
    const bindContext = {
      ...context2,
      complete: () => {
        console.debug(`Binding in component ${componentName} completed`);
        subscriber.complete();
      },
      error,
      componentRunner: runInternal,
      componentWirer: wire,
      eventBinder: handler,
      subscription
    };
    for (const [element, bindDescription] of elementBinds) {
      subscription.add(bindElement(element, bindDescription, bindContext, document2));
    }
    for (const [node, nodeDescription] of nodeBinds) {
      switch (nodeDescription.type) {
        case "component": {
          const nestedContext = {
            ...context2,
            isStaticComponent: true,
            isStaticTree: true
          };
          subscription.add(runInternal(container, nodeDescription, nestedContext, node));
          context2.isStaticTree &&= nestedContext.isStaticTree;
          break;
        }
        case "children": {
          const nestedContext = {
            ...context2,
            isStaticComponent: true,
            isStaticTree: true
          };
          subscription.add(wireChildrenComponent(nodeDescription, componentContext, description, container, nestedContext, node));
          context2.isStaticTree &&= nestedContext.isStaticTree;
          break;
        }
        case "fragment":
          context2.isStaticComponent = false;
          context2.isStaticTree = false;
          bindFragmentChildren(nodeDescription, node, subscription, bindContext);
          break;
      }
    }
  } catch (err) {
    subscriber.error(err);
  }
  return () => {
    subscription.unsubscribe();
  };
}
function wireChildrenComponent(nodeDescription, componentContext, description, container, context2, node) {
  const parentDescription = contextChildrenDescriptions.get(nodeDescription.context ?? componentContext);
  if (!parentDescription) {
    throw new Error(`Unable to bind children for Children request in ${description.component.name}`);
  }
  const childrenComponent = () => ({
    type: "fragment",
    attributes: {},
    children: [...parentDescription.children],
    childrenBind: parentDescription.childrenBind,
    childrenBindMode: parentDescription.childrenBindMode
  });
  return runInternal(container, {
    type: "component",
    component: childrenComponent,
    properties: {},
    children: []
  }, context2, node);
}
function wire(component, context2, outerContainer, document2 = globalThis.document) {
  if (isObservable(component)) {
    return component;
  }
  let description;
  if ("type" in component) {
    description = component;
  } else {
    description = {
      type: "component",
      component,
      children: [],
      properties: {}
    };
  }
  if (description.component === ErrorBoundary) {
    return wireErrorBoundary(description, context2, document2);
  }
  if (description.component === Suspense) {
    return wireSuspense(description, context2, document2);
  }
  return new Observable((subscriber) => wireInternal(description, subscriber, context2, outerContainer, document2));
}
function runInternal(container, component, context2, placeholder, document2 = globalThis.document) {
  const isObservableComponent = isObservable(component);
  const observable2 = isObservableComponent ? component : wire(component, context2, container, document2);
  let previousNode = null;
  const componentName = "type" in component ? component.component.name : component.name;
  return observable2.subscribe({
    next(node) {
      if (isObservableComponent && component.isReplaceAll) {
        container.replaceChildren(node);
      } else if (previousNode) {
        try {
          previousNode.replaceWith(node);
        } catch (error) {
          console.warn(`Cannot exactly replace previous node in ${componentName}, replacing all children in container`, node, previousNode);
          container.replaceChildren(node);
        }
      } else if (placeholder) {
        placeholder.replaceWith(node);
      } else {
        container.appendChild(node);
      }
      previousNode = node;
    },
    error(error) {
      console.error(`Error in component ${componentName}`, error);
    },
    complete() {
      if (!context2?.preserveOnComplete && previousNode) {
        try {
          previousNode.remove();
        } catch (error1) {
          try {
            container.removeChild(previousNode);
          } catch (error2) {
            console.error(`Could not remove completed node in ${componentName}`, previousNode, error1, error2);
          }
        }
      }
    }
  });
}

// node_modules/butterfloat/error-boundary.js
var ErrorBoundary = () => {
  throw new Error("ErrorBoundary is a custom-wired component");
};
function wireErrorBoundary(description, context2, document2 = globalThis.document) {
  context2.isStaticComponent = false;
  context2.isStaticTree = false;
  const { errorView, errorViewBindMode, preserveOnComplete } = description.properties;
  const errorOccurred = new Subject();
  const treeError = errorOccurred.next.bind(errorOccurred);
  const errorViewChildren = errorOccurred.pipe(map((error) => () => {
    const childComponent = {
      type: "component",
      component: errorView,
      children: [],
      properties: { error }
    };
    return childComponent;
  }));
  const mainComponentFragment = {
    type: "fragment",
    attributes: {},
    children: description.children,
    childrenBind: description.childrenBind,
    childrenBindMode: description.childrenBindMode
  };
  const errorViewComponentFragment = {
    type: "fragment",
    attributes: {},
    children: [mainComponentFragment],
    childrenBind: errorViewChildren,
    childrenBindMode: errorViewBindMode ?? "prepend"
  };
  const mainComponent = () => errorViewComponentFragment;
  const mainContext = { ...context2, treeError, preserveOnComplete };
  const main2 = wire(mainComponent, mainContext, void 0, document2);
  return main2;
}

// node_modules/butterfloat/stamp-collector.js
function nodeNamePrefix(desc) {
  switch (desc.type) {
    case "children":
      return "bf-c";
    case "component":
      return "bf-x";
    case "fragment":
      return "bf-f";
    default:
      return "bf-u";
  }
}
function collectBindings(description, elementSelectors, nodeSelectors) {
  elementSelectors ??= [];
  nodeSelectors ??= [];
  switch (description.type) {
    case "element":
      if (hasAnyBinds(description)) {
        const idSelector = description.attributes.id ? `#${description.attributes.id}` : "";
        elementSelectors.push([
          `${description.element}${idSelector}[data-bf-bind="${elementSelectors.length.toString(36)}"]`,
          description
        ]);
      }
      for (const child of description.children) {
        if (typeof child !== "string") {
          collectBindings(child, elementSelectors, nodeSelectors);
        }
      }
      break;
    case "children":
    case "component":
      nodeSelectors.push([
        `slot[name="${nodeNamePrefix(description)}${nodeSelectors.length.toString(36)}"]`,
        description
      ]);
      break;
    case "fragment":
      if (description.childrenBind && description.childrenBindMode === "prepend") {
        nodeSelectors.push([
          `slot[name="${nodeNamePrefix(description)}${nodeSelectors.length.toString(36)}"]`,
          description
        ]);
      }
      for (const child of description.children) {
        if (typeof child !== "string") {
          collectBindings(child, elementSelectors, nodeSelectors);
        }
      }
      if (description.childrenBind && description.childrenBindMode !== "prepend") {
        nodeSelectors.push([
          `slot[name="${nodeNamePrefix(description)}${nodeSelectors.length.toString(36)}"]`,
          description
        ]);
      }
      break;
  }
  return { elementSelectors, nodeSelectors };
}
function isElement(node) {
  return node.nodeType === node.ELEMENT_NODE;
}
var qs = (container, selector) => {
  const node = container.querySelector(selector);
  if (node) {
    return node;
  }
  if (isElement(container) && container.matches(selector)) {
    return container;
  }
  throw new Error("Stamp does not match component");
};
function selectBindings(container, description) {
  const { elementSelectors, nodeSelectors } = collectBindings(description);
  const elementBinds = elementSelectors.map(([selector, desc]) => [qs(container, selector), desc]);
  const nodeBinds = nodeSelectors.map(([selector, desc]) => [
    qs(container, selector),
    desc
  ]);
  return { container, nodeBinds, elementBinds };
}

// node_modules/butterfloat/static-dom.js
function buildElement(description, context2, document2 = globalThis.document) {
  if (description.attributes.xmlns) {
    context2 = {
      defaultNamespace: description.attributes.xmlns,
      namespaceMap: { ...context2?.namespaceMap }
    };
  }
  let element;
  if (description.element.includes(":")) {
    const [nsAbbrev, elementName] = description.element.split(":");
    let ns = context2?.namespaceMap[nsAbbrev];
    if (!ns) {
      for (const [key, value] of Object.entries(description.attributes)) {
        if (key.startsWith("xmlns:")) {
          const nsAbbrev2 = key.replace("xmlns:", "");
          context2 = {
            ...context2,
            defaultNamespace: context2?.defaultNamespace ?? null,
            namespaceMap: {
              ...context2?.namespaceMap,
              [nsAbbrev2]: value
            }
          };
        }
      }
      ns = context2?.namespaceMap[nsAbbrev];
      if (!ns) {
        throw new Error(`Unknown namespace for '${description.element}'`);
      }
    }
    element = document2.createElementNS(ns, elementName);
  } else if (context2?.defaultNamespace) {
    element = document2.createElementNS(context2.defaultNamespace, description.element);
  } else {
    element = document2.createElement(description.element);
  }
  for (const [key, value] of Object.entries(description.attributes)) {
    if (key.startsWith("xmlns:")) {
      const nsAbbrev = key.replace("xmlns:", "");
      context2 = {
        ...context2,
        defaultNamespace: context2?.defaultNamespace ?? null,
        namespaceMap: {
          ...context2?.namespaceMap,
          [nsAbbrev]: value
        }
      };
    } else if (key.includes(":")) {
      const [nsAbbrev, attributeName] = key.split(":");
      const ns = context2?.namespaceMap?.[nsAbbrev];
      if (!ns) {
        throw new Error(`Unknown namespace for '${key}' attribute`);
      }
      element.setAttributeNS(ns, attributeName, (value ?? "").toString());
    } else if (key.includes("-")) {
      element.setAttribute(key, (value ?? "").toString());
    } else if (key === "class") {
      element.className = value;
    } else if (key === "for") {
      ;
      element.htmlFor = value;
    } else {
      ;
      element[key] = value;
    }
  }
  return { element, context: context2 };
}
function buildNode(description, container, elementBinds, nodeBinds, context2, document2 = globalThis.document) {
  switch (description.type) {
    case "element": {
      const { element, context: newContext } = buildElement(description, context2, document2);
      if (hasAnyBinds(description)) {
        elementBinds.push([element, description]);
      }
      container.appendChild(element);
      return { container: element, context: newContext };
    }
    case "children": {
      const childrenComment = document2.createComment("Children component");
      container.appendChild(childrenComment);
      nodeBinds.push([childrenComment, description]);
      return null;
    }
    case "component": {
      const componentComment = document2.createComment(`${description.component.name} component`);
      container.appendChild(componentComment);
      nodeBinds.push([componentComment, description]);
      return null;
    }
    case "fragment":
      if (description.childrenBind && description.childrenBindMode === "prepend") {
        const fragmentComment = document2.createComment("fragment children binding");
        container.appendChild(fragmentComment);
        nodeBinds.push([fragmentComment, description]);
      }
      for (const child of description.children) {
        if (typeof child === "string") {
          container.appendChild(document2.createTextNode(child));
          continue;
        }
        buildTree(child, container, elementBinds, nodeBinds, context2, document2);
      }
      if (description.childrenBind && description.childrenBindMode !== "prepend") {
        const fragmentComment = document2.createComment("fragment children binding");
        container.appendChild(fragmentComment);
        nodeBinds.push([fragmentComment, description]);
      }
      return { container, context: context2 };
    case "static":
      container.appendChild(description.element);
      return { container, context: context2 };
    case "empty":
      if (!context2?.skipEmpty) {
        const emptyComment = document2.createComment("empty");
        container.appendChild(emptyComment);
      }
      return { container, context: context2 };
    case "comment": {
      const comment = document2.createComment(description.comment);
      container.appendChild(comment);
      return { container, context: context2 };
    }
  }
}
function buildTree(description, container = null, elementBinds = [], nodeBinds = [], context2, document2 = globalThis.document) {
  if (!container && description.type === "element") {
    const { element, context: newContext } = buildElement(description, context2, document2);
    context2 = newContext;
    container = element;
    if (hasAnyBinds(description)) {
      elementBinds.push([element, description]);
    }
  } else if (!container && description.type === "static") {
    return {
      elementBinds,
      nodeBinds,
      container: description.element
    };
  } else if (!container && description.type === "empty" && !context2?.skipEmpty) {
    const emptyComment = document2.createComment("empty");
    return {
      elementBinds,
      nodeBinds,
      container: emptyComment
    };
  } else if (!container) {
    container = document2.createDocumentFragment();
    buildNode(description, container, elementBinds, nodeBinds, context2, document2);
  } else {
    const nextNode = buildNode(description, container, elementBinds, nodeBinds, context2, document2);
    if (nextNode !== null) {
      const { container: newContainer, context: newContext } = nextNode;
      container = newContainer;
      context2 = newContext;
    }
  }
  if (description.type !== "children" && description.type !== "fragment" && description.type !== "static" && description.type !== "comment" && description.type !== "empty") {
    for (const child of description.children) {
      if (typeof child === "string") {
        container.appendChild(document2.createTextNode(child));
        continue;
      }
      buildTree(child, container, elementBinds, nodeBinds, context2, document2);
    }
  }
  return {
    elementBinds,
    nodeBinds,
    container
  };
}

// node_modules/butterfloat/stamp-collection.js
var StampCollection = class {
  #map = /* @__PURE__ */ new WeakMap();
  #prestampMap = /* @__PURE__ */ new WeakMap();
  /**
   * Get a Stamp for a component, given applicable properties
   * @param c Component
   * @param properties Properties that apply to the component
   * @returns A stamp
   */
  getStamp(c, properties) {
    const alternatives = this.#map.get(c);
    if (alternatives) {
      for (const [applies, stamp] of alternatives) {
        if (applies(properties)) {
          return stamp;
        }
      }
    }
  }
  /**
   * Check if a container was registered as a prestamp for this component with given properties
   * @param c Component
   * @param properties Properties that apply to the component
   * @param container Container to test for prestamp
   * @returns Is registered as a valid prestamp
   */
  isPrestamp(c, properties, container) {
    const stampApplies = this.#prestampMap.get(container);
    if (stampApplies) {
      return stampApplies[0] === c && stampApplies[1](properties);
    }
    return false;
  }
  /**
   * Register one Stamp for all possible properties for the given Component
   * @param c Component
   * @param stamp Stamp to register
   * @returns this (for chaining)
   */
  registerOnlyStamp(c, stamp) {
    this.#map.set(c, [[(_) => true, stamp]]);
    return this;
  }
  /**
   * Register a possible Stamp for subset of possible properties for the given Component
   * @param c Component
   * @param when Property filter for when the Stamp applies
   * @param stamp Stamp to register
   * @returns this (for chaining)
   */
  registerStampAlternative(c, when, stamp) {
    const alternatives = this.#map.get(c) ?? [];
    alternatives.push([when, stamp]);
    this.#map.set(c, alternatives);
    return this;
  }
  /**
   * Register a container that was pre-stamped
   * @param c Component
   * @param container Prestamped container
   * @param when Property filter for when the prestamp applies
   * @returns this (for chaining)
   */
  registerPrestamp(c, container, when) {
    this.#prestampMap.set(container, [c, when ?? (() => true)]);
    return this;
  }
};

// node_modules/butterfloat/wiring-dom-stamp.js
var stampOrBuildStrategy = (stamps2) => (component, properties, context2, container, document2) => {
  if (container && stamps2.isPrestamp(component, properties, container)) {
    return {
      ...selectBindings(container, component(properties, context2)),
      isSameContainer: true
    };
  }
  const stamp = stamps2.getStamp(component, properties);
  if (stamp) {
    let container2 = stamp.content.cloneNode(true);
    if (container2.nodeType === container2.DOCUMENT_FRAGMENT_NODE && container2.children.length === 1) {
      const child = container2.firstElementChild;
      if (child) {
        container2 = child;
      }
    }
    return {
      ...selectBindings(container2, component(properties, context2)),
      isSameContainer: false
    };
  }
  const tree = component(properties, context2);
  return {
    ...buildTree(tree, void 0, void 0, void 0, void 0, document2),
    isSameContainer: false
  };
};
var wiring_dom_stamp_default = stampOrBuildStrategy;

// node_modules/butterfloat/runtime-stamps.js
function runStamps(container, component, stamps2, options, placeholder, document2 = globalThis.document) {
  const { preserveOnComplete } = options ?? {};
  return runInternal(container, component, {
    domStrategy: wiring_dom_stamp_default(stamps2),
    isStaticComponent: true,
    isStaticTree: true,
    preserveOnComplete
  }, placeholder, document2);
}

// data.js
var adjectives = [
  "pretty",
  "large",
  "big",
  "small",
  "tall",
  "short",
  "long",
  "handsome",
  "plain",
  "quaint",
  "clean",
  "elegant",
  "easy",
  "angry",
  "crazy",
  "helpful",
  "mushy",
  "odd",
  "unsightly",
  "adorable",
  "important",
  "inexpensive",
  "cheap",
  "expensive",
  "fancy"
];
var colors = [
  "red",
  "yellow",
  "blue",
  "green",
  "pink",
  "brown",
  "purple",
  "brown",
  "white",
  "black",
  "orange"
];
var nouns = [
  "table",
  "chair",
  "house",
  "bbq",
  "desk",
  "car",
  "pony",
  "cookie",
  "sandwich",
  "burger",
  "pizza",
  "mouse",
  "keyboard"
];
function randomLabel() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${color} ${noun}`;
}

// row-vm.js
var RowViewModel = class {
  #app;
  get app() {
    return this.#app;
  }
  #id;
  get id() {
    return this.#id;
  }
  #label;
  #setLabel;
  get label() {
    return this.#label;
  }
  #remove;
  #setRemove;
  #removed;
  get removed() {
    return this.#removed;
  }
  #selected;
  get selected() {
    return this.#selected;
  }
  constructor(app, id) {
    this.#app = app;
    this.#id = id;
    [this.#label, this.#setLabel] = butterfly(randomLabel());
    [this.#remove, this.#setRemove] = butterfly(false);
    this.#removed = merge(
      this.#remove.pipe(filter((remove) => remove)),
      this.#app.idRange.pipe(
        filter((range2) => range2.min > this.#id),
        map(() => true)
      )
    );
    this.#selected = this.#app.selectedId.pipe(map((id2) => id2 === this.#id));
  }
  updateLabel() {
    this.#setLabel((current) => current + " !!!");
  }
  remove() {
    this.#setRemove(true);
  }
  select() {
    this.#app.selectRow(this.#id);
  }
};

// app-vm.js
var AppViewModel = class {
  #idRange;
  #setIdRange;
  get idRange() {
    return this.#idRange;
  }
  #selectedId;
  #setSelectedId;
  get selectedId() {
    return this.#selectedId;
  }
  #rows;
  get rows() {
    return this.#rows;
  }
  #rowsToUpdate;
  #setRowsToUpdate;
  get rowsToUpdate() {
    return this.#rowsToUpdate;
  }
  constructor() {
    ;
    [this.#idRange, this.#setIdRange] = butterfly({
      min: 0,
      max: 0,
      added: [-1, -1]
    });
    [this.#selectedId, this.#setSelectedId] = butterfly(-1);
    [this.#rowsToUpdate, this.#setRowsToUpdate] = butterfly(-1);
    this.#rows = this.#idRange.pipe(
      filter((idRange) => idRange.added[1] > 0),
      mergeMap((idRange) => range(idRange.added[0], idRange.added[1])),
      map((id) => new RowViewModel(this, id))
    );
  }
  clear() {
    this.#setIdRange((current) => ({
      min: current.max,
      max: current.max,
      added: [-1, -1]
    }));
  }
  selectRow(id) {
    this.#setSelectedId(id);
  }
  createRows(count) {
    this.#setIdRange((current) => {
      const min = current.max;
      const max = current.max + count;
      return { min, max, added: [current.max, count] };
    });
  }
  appendRows(count) {
    this.#setIdRange((current) => {
      const min = current.min;
      const max = current.max + count;
      return { min, max, added: [current.max, count] };
    });
  }
  updateRow(id) {
    this.#setRowsToUpdate(id);
  }
};

// row.js
function Row({ vm }, { bindEffect, bindImmediateEffect, events }) {
  bindImmediateEffect(events.attach, (element) => {
    element.dataset.id = vm.id.toString();
  });
  bindImmediateEffect(events.select, () => vm.select());
  bindImmediateEffect(
    events.remove.pipe(takeUntil(vm.removed)),
    () => vm.remove()
  );
  bindEffect(
    vm.app.rowsToUpdate.pipe(filter((id2) => id2 === vm.id)),
    () => vm.updateLabel()
  );
  const id = concat(of((vm.id + 1).toString()), NEVER);
  return /* @__PURE__ */ jsx(
    "tr",
    {
      classBind: { danger: vm.selected },
      events: { bfDomAttach: events.attach }
    },
    /* @__PURE__ */ jsx("td", { class: "col-md-1", bind: { innerText: id } }),
    /* @__PURE__ */ jsx("td", { class: "col-md-4" }, /* @__PURE__ */ jsx("a", { bind: { innerText: vm.label }, events: { click: events.select } })),
    /* @__PURE__ */ jsx("td", { class: "col-md-1" }, /* @__PURE__ */ jsx("a", { type: "button", events: { click: events.remove } }, /* @__PURE__ */ jsx("span", { class: "glyphicon glyphicon-remove", "aria-hidden": "true" }))),
    /* @__PURE__ */ jsx("td", { class: "col-md-6" })
  );
}

// app.js
function App(_props, { bindEffect, bindImmediateEffect, events }) {
  const vm = new AppViewModel();
  const children = vm.rows.pipe(map((row) => () => /* @__PURE__ */ jsx(Row, { vm: row })));
  bindImmediateEffect(events.run, () => vm.createRows(1e3));
  bindImmediateEffect(events.runlots, () => vm.createRows(1e4));
  bindImmediateEffect(events.add, () => vm.appendRows(1e3));
  bindImmediateEffect(events.clear, () => vm.clear());
  bindEffect(
    events.update.pipe(withLatestFrom(events.tbodyAttach)),
    ([_, tbody]) => {
      const rows = tbody.querySelectorAll("tr");
      for (let i = 0; i < rows.length; i += 10) {
        const row = rows[i];
        const id = Number.parseInt(row.dataset.id, 10);
        vm.updateRow(id);
      }
    }
  );
  bindEffect(
    events.swaprows.pipe(withLatestFrom(events.tbodyAttach)),
    ([_, tbody]) => {
      const rows = tbody.querySelectorAll("tr");
      if (rows.length > 998) {
        const row0 = rows[0];
        const row1 = rows[1];
        const row997 = rows[997];
        const row998 = rows[998];
        row0.after(row998);
        row997.after(row1);
      }
    }
  );
  return /* @__PURE__ */ jsx("div", { class: "container" }, /* @__PURE__ */ jsx("div", { class: "jumbotron" }, /* @__PURE__ */ jsx("div", { class: "row" }, /* @__PURE__ */ jsx("div", { class: "col-md-6" }, /* @__PURE__ */ jsx("h1", null, "Butterfloat")), /* @__PURE__ */ jsx("div", { class: "col-md-6" }, /* @__PURE__ */ jsx("div", { class: "row" }, /* @__PURE__ */ jsx("div", { class: "col-sm-6 smallpad" }, /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      class: "btn btn-primary btn-block",
      id: "run",
      events: { click: events.run }
    },
    "Create 1,000 rows"
  )), /* @__PURE__ */ jsx("div", { class: "col-sm-6 smallpad" }, /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      class: "btn btn-primary btn-block",
      id: "runlots",
      events: { click: events.runlots }
    },
    "Create 10,000 rows"
  )), /* @__PURE__ */ jsx("div", { class: "col-sm-6 smallpad" }, /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      class: "btn btn-primary btn-block",
      id: "add",
      events: { click: events.add }
    },
    "Append 1,000 rows"
  )), /* @__PURE__ */ jsx("div", { class: "col-sm-6 smallpad" }, /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      class: "btn btn-primary btn-block",
      id: "update",
      events: { click: events.update }
    },
    "Update every 10th row"
  )), /* @__PURE__ */ jsx("div", { class: "col-sm-6 smallpad" }, /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      class: "btn btn-primary btn-block",
      id: "clear",
      events: { click: events.clear }
    },
    "Clear"
  )), /* @__PURE__ */ jsx("div", { class: "col-sm-6 smallpad" }, /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      class: "btn btn-primary btn-block",
      id: "swaprows",
      events: { click: events.swaprows }
    },
    "Swap Rows"
  )))))), /* @__PURE__ */ jsx("table", { class: "table table-hover table-striped test-data" }, /* @__PURE__ */ jsx(
    "tbody",
    {
      id: "tbody",
      childrenBind: children,
      childrenBindMode: "append",
      events: { bfDomAttach: events.tbodyAttach }
    }
  )));
}

// main.ts
var stamps = new StampCollection();
var appStamp = document.querySelector("template#app");
if (appStamp) {
  stamps.registerOnlyStamp(App, appStamp);
}
var rowStamp = document.querySelector("template#row");
if (rowStamp) {
  stamps.registerOnlyStamp(Row, rowStamp);
}
var main = document.querySelector("#main");
runStamps(main, App, stamps);
