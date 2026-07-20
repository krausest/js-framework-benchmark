(() => {
  // output-es/runtime.js
  function fail() {
    throw new Error("Failed pattern match");
  }

  // output-es/Data.Functor/foreign.js
  var arrayMap = function(f) {
    return function(arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(arr[i]);
      }
      return result;
    };
  };

  // output-es/Control.Apply/index.js
  var identity = (x) => x;

  // output-es/Control.Bind/foreign.js
  var arrayBind = typeof Array.prototype.flatMap === "function" ? function(arr) {
    return function(f) {
      return arr.flatMap(f);
    };
  } : function(arr) {
    return function(f) {
      var result = [];
      var l = arr.length;
      for (var i = 0; i < l; i++) {
        var xs = f(arr[i]);
        var k = xs.length;
        for (var j = 0; j < k; j++) {
          result.push(xs[j]);
        }
      }
      return result;
    };
  };

  // output-es/Data.Show/foreign.js
  var showIntImpl = function(n) {
    return n.toString();
  };

  // output-es/Data.Ordering/index.js
  var $Ordering = (tag) => tag;
  var LT = /* @__PURE__ */ $Ordering("LT");
  var GT = /* @__PURE__ */ $Ordering("GT");
  var EQ = /* @__PURE__ */ $Ordering("EQ");

  // output-es/Data.Maybe/index.js
  var $Maybe = (tag, _1) => ({ tag, _1 });
  var Nothing = /* @__PURE__ */ $Maybe("Nothing");
  var Just = (value0) => $Maybe("Just", value0);

  // output-es/Data.Either/index.js
  var $Either = (tag, _1) => ({ tag, _1 });
  var Left = (value0) => $Either("Left", value0);
  var Right = (value0) => $Either("Right", value0);

  // output-es/Effect/foreign.js
  var pureE = function(a) {
    return function() {
      return a;
    };
  };
  var bindE = function(a) {
    return function(f) {
      return function() {
        return f(a())();
      };
    };
  };
  var untilE = function(f) {
    return function() {
      while (!f()) ;
    };
  };

  // output-es/Effect/index.js
  var monadEffect = { Applicative0: () => applicativeEffect, Bind1: () => bindEffect };
  var bindEffect = { bind: bindE, Apply0: () => applyEffect };
  var applyEffect = {
    apply: (f) => (a) => () => {
      const f$p = f();
      const a$p = a();
      return applicativeEffect.pure(f$p(a$p))();
    },
    Functor0: () => functorEffect
  };
  var applicativeEffect = { pure: pureE, Apply0: () => applyEffect };
  var functorEffect = {
    map: (f) => (a) => () => {
      const a$p = a();
      return f(a$p);
    }
  };

  // output-es/Control.Monad.Rec.Class/index.js
  var $Step = (tag, _1) => ({ tag, _1 });
  var Done = (value0) => $Step("Done", value0);
  var monadRecEffect = {
    tailRecM: (f) => (a) => {
      const $0 = f(a);
      return () => {
        const $1 = $0();
        let r = $1;
        untilE(() => {
          const v = r;
          if (v.tag === "Loop") {
            const e = f(v._1)();
            r = e;
            return false;
          }
          if (v.tag === "Done") {
            return true;
          }
          fail();
        })();
        const a$p = r;
        if (a$p.tag === "Done") {
          return a$p._1;
        }
        fail();
      };
    },
    Monad0: () => monadEffect
  };

  // output-es/Data.Foldable/foreign.js
  var foldrArray = function(f) {
    return function(init) {
      return function(xs) {
        var acc = init;
        var len = xs.length;
        for (var i = len - 1; i >= 0; i--) {
          acc = f(xs[i])(acc);
        }
        return acc;
      };
    };
  };
  var foldlArray = function(f) {
    return function(init) {
      return function(xs) {
        var acc = init;
        var len = xs.length;
        for (var i = 0; i < len; i++) {
          acc = f(acc)(xs[i]);
        }
        return acc;
      };
    };
  };

  // output-es/Data.Foldable/index.js
  var traverse_ = (dictApplicative) => {
    const $0 = dictApplicative.Apply0();
    return (dictFoldable) => (f) => dictFoldable.foldr((x) => {
      const $1 = f(x);
      return (b) => $0.apply($0.Functor0().map((v) => identity)($1))(b);
    })(dictApplicative.pure());
  };
  var for_ = (dictApplicative) => {
    const traverse_14 = traverse_(dictApplicative);
    return (dictFoldable) => {
      const $0 = traverse_14(dictFoldable);
      return (b) => (a) => $0(a)(b);
    };
  };
  var foldableMaybe = {
    foldr: (v) => (v1) => (v2) => {
      if (v2.tag === "Nothing") {
        return v1;
      }
      if (v2.tag === "Just") {
        return v(v2._1)(v1);
      }
      fail();
    },
    foldl: (v) => (v1) => (v2) => {
      if (v2.tag === "Nothing") {
        return v1;
      }
      if (v2.tag === "Just") {
        return v(v1)(v2._1);
      }
      fail();
    },
    foldMap: (dictMonoid) => {
      const mempty = dictMonoid.mempty;
      return (v) => (v1) => {
        if (v1.tag === "Nothing") {
          return mempty;
        }
        if (v1.tag === "Just") {
          return v(v1._1);
        }
        fail();
      };
    }
  };
  var foldableArray = {
    foldr: foldrArray,
    foldl: foldlArray,
    foldMap: (dictMonoid) => {
      const mempty = dictMonoid.mempty;
      return (f) => foldableArray.foldr((x) => (acc) => dictMonoid.Semigroup0().append(f(x))(acc))(mempty);
    }
  };

  // output-es/Data.NonEmpty/index.js
  var $NonEmpty = (_1, _2) => ({ tag: "NonEmpty", _1, _2 });

  // output-es/Data.Tuple/index.js
  var $Tuple = (_1, _2) => ({ tag: "Tuple", _1, _2 });
  var fst = (v) => v._1;

  // output-es/Data.List.Types/index.js
  var $List = (tag, _1, _2) => ({ tag, _1, _2 });
  var Nil = /* @__PURE__ */ $List("Nil");
  var foldableList = {
    foldr: (f) => (b) => {
      const $0 = foldableList.foldl((b$1) => (a) => f(a)(b$1))(b);
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const v = go$a0, v1 = go$a1;
          if (v1.tag === "Nil") {
            go$c = false;
            go$r = v;
            continue;
          }
          if (v1.tag === "Cons") {
            go$a0 = $List("Cons", v1._1, v);
            go$a1 = v1._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      const $1 = go(Nil);
      return (x) => $0($1(x));
    },
    foldl: (f) => {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const b = go$a0, v = go$a1;
          if (v.tag === "Nil") {
            go$c = false;
            go$r = b;
            continue;
          }
          if (v.tag === "Cons") {
            go$a0 = f(b)(v._1);
            go$a1 = v._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      return go;
    },
    foldMap: (dictMonoid) => {
      const mempty = dictMonoid.mempty;
      return (f) => foldableList.foldl((acc) => {
        const $0 = dictMonoid.Semigroup0().append(acc);
        return (x) => $0(f(x));
      })(mempty);
    }
  };

  // output-es/Unsafe.Coerce/foreign.js
  var unsafeCoerce = function(x) {
    return x;
  };

  // output-es/Data.CatQueue/index.js
  var $CatQueue = (_1, _2) => ({ tag: "CatQueue", _1, _2 });
  var uncons = (uncons$a0$copy) => {
    let uncons$a0 = uncons$a0$copy, uncons$c = true, uncons$r;
    while (uncons$c) {
      const v = uncons$a0;
      if (v._1.tag === "Nil") {
        if (v._2.tag === "Nil") {
          uncons$c = false;
          uncons$r = Nothing;
          continue;
        }
        uncons$a0 = $CatQueue(
          (() => {
            const go = (go$a0$copy) => (go$a1$copy) => {
              let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
              while (go$c) {
                const v$1 = go$a0, v1 = go$a1;
                if (v1.tag === "Nil") {
                  go$c = false;
                  go$r = v$1;
                  continue;
                }
                if (v1.tag === "Cons") {
                  go$a0 = $List("Cons", v1._1, v$1);
                  go$a1 = v1._2;
                  continue;
                }
                fail();
              }
              return go$r;
            };
            return go(Nil)(v._2);
          })(),
          Nil
        );
        continue;
      }
      if (v._1.tag === "Cons") {
        uncons$c = false;
        uncons$r = $Maybe("Just", $Tuple(v._1._1, $CatQueue(v._1._2, v._2)));
        continue;
      }
      fail();
    }
    return uncons$r;
  };

  // output-es/Data.CatList/index.js
  var $CatList = (tag, _1, _2) => ({ tag, _1, _2 });
  var CatNil = /* @__PURE__ */ $CatList("CatNil");
  var link = (v) => (v1) => {
    if (v.tag === "CatNil") {
      return v1;
    }
    if (v1.tag === "CatNil") {
      return v;
    }
    if (v.tag === "CatCons") {
      return $CatList("CatCons", v._1, $CatQueue(v._2._1, $List("Cons", v1, v._2._2)));
    }
    fail();
  };
  var foldr = (k) => (b) => (q) => {
    const foldl = (foldl$a0$copy) => (foldl$a1$copy) => (foldl$a2$copy) => {
      let foldl$a0 = foldl$a0$copy, foldl$a1 = foldl$a1$copy, foldl$a2 = foldl$a2$copy, foldl$c = true, foldl$r;
      while (foldl$c) {
        const v = foldl$a0, v1 = foldl$a1, v2 = foldl$a2;
        if (v2.tag === "Nil") {
          foldl$c = false;
          foldl$r = v1;
          continue;
        }
        if (v2.tag === "Cons") {
          foldl$a0 = v;
          foldl$a1 = v(v1)(v2._1);
          foldl$a2 = v2._2;
          continue;
        }
        fail();
      }
      return foldl$r;
    };
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const xs = go$a0, ys = go$a1;
        const v = uncons(xs);
        if (v.tag === "Nothing") {
          go$c = false;
          go$r = foldl((x) => (i) => i(x))(b)(ys);
          continue;
        }
        if (v.tag === "Just") {
          go$a0 = v._1._2;
          go$a1 = $List("Cons", k(v._1._1), ys);
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go(q)(Nil);
  };
  var uncons2 = (v) => {
    if (v.tag === "CatNil") {
      return Nothing;
    }
    if (v.tag === "CatCons") {
      return $Maybe("Just", $Tuple(v._1, v._2._1.tag === "Nil" && v._2._2.tag === "Nil" ? CatNil : foldr(link)(CatNil)(v._2)));
    }
    fail();
  };

  // output-es/Control.Monad.Free/index.js
  var $Free = (_1, _2) => ({ tag: "Free", _1, _2 });
  var $FreeView = (tag, _1, _2) => ({ tag, _1, _2 });
  var toView = (toView$a0$copy) => {
    let toView$a0 = toView$a0$copy, toView$c = true, toView$r;
    while (toView$c) {
      const v = toView$a0;
      if (v._1.tag === "Return") {
        const v2 = uncons2(v._2);
        if (v2.tag === "Nothing") {
          toView$c = false;
          toView$r = $FreeView("Return", v._1._1);
          continue;
        }
        if (v2.tag === "Just") {
          toView$a0 = (() => {
            const $0 = v2._1._1(v._1._1);
            return $Free(
              $0._1,
              (() => {
                if ($0._2.tag === "CatNil") {
                  return v2._1._2;
                }
                if (v2._1._2.tag === "CatNil") {
                  return $0._2;
                }
                if ($0._2.tag === "CatCons") {
                  return $CatList("CatCons", $0._2._1, $CatQueue($0._2._2._1, $List("Cons", v2._1._2, $0._2._2._2)));
                }
                fail();
              })()
            );
          })();
          continue;
        }
        fail();
      }
      if (v._1.tag === "Bind") {
        toView$c = false;
        toView$r = $FreeView(
          "Bind",
          v._1._1,
          (a) => {
            const $0 = v._1._2(a);
            return $Free(
              $0._1,
              (() => {
                if ($0._2.tag === "CatNil") {
                  return v._2;
                }
                if (v._2.tag === "CatNil") {
                  return $0._2;
                }
                if ($0._2.tag === "CatCons") {
                  return $CatList("CatCons", $0._2._1, $CatQueue($0._2._2._1, $List("Cons", v._2, $0._2._2._2)));
                }
                fail();
              })()
            );
          }
        );
        continue;
      }
      fail();
    }
    return toView$r;
  };
  var freeMonad = { Applicative0: () => freeApplicative, Bind1: () => freeBind };
  var freeFunctor = { map: (k) => (f) => freeBind.bind(f)((x) => freeApplicative.pure(k(x))) };
  var freeBind = {
    bind: (v) => (k) => $Free(
      v._1,
      (() => {
        if (v._2.tag === "CatNil") {
          return $CatList("CatCons", k, $CatQueue(Nil, Nil));
        }
        if (v._2.tag === "CatCons") {
          return $CatList(
            "CatCons",
            v._2._1,
            $CatQueue(
              v._2._2._1,
              $List("Cons", $CatList("CatCons", k, $CatQueue(Nil, Nil)), v._2._2._2)
            )
          );
        }
        fail();
      })()
    ),
    Apply0: () => freeApply
  };
  var freeApply = {
    apply: (f) => (a) => {
      const $0 = (f$p) => $Free(
        a._1,
        (() => {
          if (a._2.tag === "CatNil") {
            return $CatList("CatCons", (a$p) => freeApplicative.pure(f$p(a$p)), $CatQueue(Nil, Nil));
          }
          if (a._2.tag === "CatCons") {
            return $CatList(
              "CatCons",
              a._2._1,
              $CatQueue(
                a._2._2._1,
                $List(
                  "Cons",
                  $CatList("CatCons", (a$p) => freeApplicative.pure(f$p(a$p)), $CatQueue(Nil, Nil)),
                  a._2._2._2
                )
              )
            );
          }
          fail();
        })()
      );
      return $Free(
        f._1,
        (() => {
          if (f._2.tag === "CatNil") {
            return $CatList("CatCons", $0, $CatQueue(Nil, Nil));
          }
          if (f._2.tag === "CatCons") {
            return $CatList(
              "CatCons",
              f._2._1,
              $CatQueue(
                f._2._2._1,
                $List("Cons", $CatList("CatCons", $0, $CatQueue(Nil, Nil)), f._2._2._2)
              )
            );
          }
          fail();
        })()
      );
    },
    Functor0: () => freeFunctor
  };
  var freeApplicative = { pure: (x) => $Free($FreeView("Return", x), CatNil), Apply0: () => freeApply };
  var foldFree = (dictMonadRec) => {
    const Monad0 = dictMonadRec.Monad0();
    const $0 = Monad0.Bind1().Apply0().Functor0();
    return (k) => dictMonadRec.tailRecM((f) => {
      const v = toView(f);
      if (v.tag === "Return") {
        return $0.map(Done)(Monad0.Applicative0().pure(v._1));
      }
      if (v.tag === "Bind") {
        return $0.map((x) => $Step("Loop", v._2(x)))(k(v._1));
      }
      fail();
    });
  };

  // output-es/DOM.HTML.Indexed.ButtonType/index.js
  var $ButtonType = (tag) => tag;
  var ButtonButton = /* @__PURE__ */ $ButtonType("ButtonButton");

  // output-es/Data.FunctorWithIndex/foreign.js
  var mapWithIndexArray = function(f) {
    return function(xs) {
      var l = xs.length;
      var result = Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(i)(xs[i]);
      }
      return result;
    };
  };

  // output-es/Data.Eq/foreign.js
  var refEq = function(r1) {
    return function(r2) {
      return r1 === r2;
    };
  };
  var eqIntImpl = refEq;
  var eqStringImpl = refEq;

  // output-es/Data.Eq/index.js
  var eqString = { eq: eqStringImpl };
  var eqInt = { eq: eqIntImpl };

  // output-es/Data.Ord/foreign.js
  var unsafeCompareImpl = function(lt) {
    return function(eq) {
      return function(gt) {
        return function(x) {
          return function(y) {
            return x < y ? lt : x === y ? eq : gt;
          };
        };
      };
    };
  };
  var ordIntImpl = unsafeCompareImpl;
  var ordStringImpl = unsafeCompareImpl;

  // output-es/Data.Ord/index.js
  var ordString = { compare: /* @__PURE__ */ ordStringImpl(LT)(EQ)(GT), Eq0: () => eqString };
  var ordInt = { compare: /* @__PURE__ */ ordIntImpl(LT)(EQ)(GT), Eq0: () => eqInt };

  // output-es/Data.Array/foreign.js
  var replicateFill = function(count, value) {
    if (count < 1) {
      return [];
    }
    var result = new Array(count);
    return result.fill(value);
  };
  var replicatePolyfill = function(count, value) {
    var result = [];
    var n = 0;
    for (var i = 0; i < count; i++) {
      result[n++] = value;
    }
    return result;
  };
  var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
  var findIndexImpl = function(just, nothing, f, xs) {
    for (var i = 0, l = xs.length; i < l; i++) {
      if (f(xs[i])) return just(i);
    }
    return nothing;
  };
  var _deleteAt = function(just, nothing, i, l) {
    if (i < 0 || i >= l.length) return nothing;
    var l1 = l.slice();
    l1.splice(i, 1);
    return just(l1);
  };
  var _updateAt = function(just, nothing, i, a, l) {
    if (i < 0 || i >= l.length) return nothing;
    var l1 = l.slice();
    l1[i] = a;
    return just(l1);
  };
  var filterImpl = function(f, xs) {
    return xs.filter(f);
  };

  // output-es/Data.Array/index.js
  var deleteBy = (v) => (v1) => (v2) => {
    if (v2.length === 0) {
      return [];
    }
    const $0 = findIndexImpl(Just, Nothing, v(v1), v2);
    if ($0.tag === "Nothing") {
      return v2;
    }
    if ($0.tag === "Just") {
      const $1 = _deleteAt(Just, Nothing, $0._1, v2);
      if ($1.tag === "Just") {
        return $1._1;
      }
    }
    fail();
  };

  // output-es/Data.EuclideanRing/foreign.js
  var intMod = function(x) {
    return function(y) {
      if (y === 0) return 0;
      var yy = Math.abs(y);
      return (x % yy + yy) % yy;
    };
  };

  // output-es/Effect.Exception/foreign.js
  function error(msg) {
    return new Error(msg);
  }
  function throwException(e) {
    return function() {
      throw e;
    };
  }

  // output-es/Control.Monad.Error.Class/index.js
  var $$try = (dictMonadError) => {
    const Monad0 = dictMonadError.MonadThrow0().Monad0();
    return (a) => dictMonadError.catchError(Monad0.Bind1().Apply0().Functor0().map(Right)(a))((x) => Monad0.Applicative0().pure($Either("Left", x)));
  };

  // output-es/Control.Parallel/index.js
  var identity5 = (x) => x;
  var parTraverse_ = (dictParallel) => (dictApplicative) => {
    const traverse_7 = traverse_(dictApplicative);
    return (dictFoldable) => {
      const traverse_14 = traverse_7(dictFoldable);
      return (f) => {
        const $0 = traverse_14((x) => dictParallel.parallel(f(x)));
        return (x) => dictParallel.sequential($0(x));
      };
    };
  };

  // output-es/Partial/foreign.js
  var _crashWith = function(msg) {
    throw new Error(msg);
  };

  // output-es/Effect.Aff/foreign.js
  var Aff = function() {
    var EMPTY = {};
    var PURE = "Pure";
    var THROW = "Throw";
    var CATCH = "Catch";
    var SYNC = "Sync";
    var ASYNC = "Async";
    var BIND = "Bind";
    var BRACKET = "Bracket";
    var FORK = "Fork";
    var SEQ = "Sequential";
    var MAP = "Map";
    var APPLY = "Apply";
    var ALT = "Alt";
    var CONS = "Cons";
    var RESUME = "Resume";
    var RELEASE = "Release";
    var FINALIZER = "Finalizer";
    var FINALIZED = "Finalized";
    var FORKED = "Forked";
    var FIBER = "Fiber";
    var THUNK = "Thunk";
    function Aff2(tag, _1, _2, _3) {
      this.tag = tag;
      this._1 = _1;
      this._2 = _2;
      this._3 = _3;
    }
    function AffCtr(tag) {
      var fn = function(_1, _2, _3) {
        return new Aff2(tag, _1, _2, _3);
      };
      fn.tag = tag;
      return fn;
    }
    function nonCanceler2(error3) {
      return new Aff2(PURE, void 0);
    }
    function runEff(eff) {
      try {
        eff();
      } catch (error3) {
        setTimeout(function() {
          throw error3;
        }, 0);
      }
    }
    function runSync(left, right, eff) {
      try {
        return right(eff());
      } catch (error3) {
        return left(error3);
      }
    }
    function runAsync(left, eff, k) {
      try {
        return eff(k)();
      } catch (error3) {
        k(left(error3))();
        return nonCanceler2;
      }
    }
    var Scheduler = function() {
      var limit = 1024;
      var size2 = 0;
      var ix = 0;
      var queue = new Array(limit);
      var draining = false;
      function drain() {
        var thunk4;
        draining = true;
        while (size2 !== 0) {
          size2--;
          thunk4 = queue[ix];
          queue[ix] = void 0;
          ix = (ix + 1) % limit;
          thunk4();
        }
        draining = false;
      }
      return {
        isDraining: function() {
          return draining;
        },
        enqueue: function(cb) {
          var i, tmp;
          if (size2 === limit) {
            tmp = draining;
            drain();
            draining = tmp;
          }
          queue[(ix + size2) % limit] = cb;
          size2++;
          if (!draining) {
            drain();
          }
        }
      };
    }();
    function Supervisor(util) {
      var fibers = {};
      var fiberId = 0;
      var count = 0;
      return {
        register: function(fiber) {
          var fid = fiberId++;
          fiber.onComplete({
            rethrow: true,
            handler: function(result) {
              return function() {
                count--;
                delete fibers[fid];
              };
            }
          })();
          fibers[fid] = fiber;
          count++;
        },
        isEmpty: function() {
          return count === 0;
        },
        killAll: function(killError, cb) {
          return function() {
            if (count === 0) {
              return cb();
            }
            var killCount = 0;
            var kills = {};
            function kill(fid) {
              kills[fid] = fibers[fid].kill(killError, function(result) {
                return function() {
                  delete kills[fid];
                  killCount--;
                  if (util.isLeft(result) && util.fromLeft(result)) {
                    setTimeout(function() {
                      throw util.fromLeft(result);
                    }, 0);
                  }
                  if (killCount === 0) {
                    cb();
                  }
                };
              })();
            }
            for (var k in fibers) {
              if (fibers.hasOwnProperty(k)) {
                killCount++;
                kill(k);
              }
            }
            fibers = {};
            fiberId = 0;
            count = 0;
            return function(error3) {
              return new Aff2(SYNC, function() {
                for (var k2 in kills) {
                  if (kills.hasOwnProperty(k2)) {
                    kills[k2]();
                  }
                }
              });
            };
          };
        }
      };
    }
    var SUSPENDED = 0;
    var CONTINUE = 1;
    var STEP_BIND = 2;
    var STEP_RESULT = 3;
    var PENDING = 4;
    var RETURN = 5;
    var COMPLETED = 6;
    function Fiber(util, supervisor, aff) {
      var runTick = 0;
      var status = SUSPENDED;
      var step2 = aff;
      var fail2 = null;
      var interrupt = null;
      var bhead = null;
      var btail = null;
      var attempts = null;
      var bracketCount = 0;
      var joinId = 0;
      var joins = null;
      var rethrow = true;
      function run2(localRunTick) {
        var tmp, result, attempt;
        while (true) {
          tmp = null;
          result = null;
          attempt = null;
          switch (status) {
            case STEP_BIND:
              status = CONTINUE;
              try {
                step2 = bhead(step2);
                if (btail === null) {
                  bhead = null;
                } else {
                  bhead = btail._1;
                  btail = btail._2;
                }
              } catch (e) {
                status = RETURN;
                fail2 = util.left(e);
                step2 = null;
              }
              break;
            case STEP_RESULT:
              if (util.isLeft(step2)) {
                status = RETURN;
                fail2 = step2;
                step2 = null;
              } else if (bhead === null) {
                status = RETURN;
              } else {
                status = STEP_BIND;
                step2 = util.fromRight(step2);
              }
              break;
            case CONTINUE:
              switch (step2.tag) {
                case BIND:
                  if (bhead) {
                    btail = new Aff2(CONS, bhead, btail);
                  }
                  bhead = step2._2;
                  status = CONTINUE;
                  step2 = step2._1;
                  break;
                case PURE:
                  if (bhead === null) {
                    status = RETURN;
                    step2 = util.right(step2._1);
                  } else {
                    status = STEP_BIND;
                    step2 = step2._1;
                  }
                  break;
                case SYNC:
                  status = STEP_RESULT;
                  step2 = runSync(util.left, util.right, step2._1);
                  break;
                case ASYNC:
                  status = PENDING;
                  step2 = runAsync(util.left, step2._1, function(result2) {
                    return function() {
                      if (runTick !== localRunTick) {
                        return;
                      }
                      runTick++;
                      Scheduler.enqueue(function() {
                        if (runTick !== localRunTick + 1) {
                          return;
                        }
                        status = STEP_RESULT;
                        step2 = result2;
                        run2(runTick);
                      });
                    };
                  });
                  return;
                case THROW:
                  status = RETURN;
                  fail2 = util.left(step2._1);
                  step2 = null;
                  break;
                // Enqueue the Catch so that we can call the error handler later on
                // in case of an exception.
                case CATCH:
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step2, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step2, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step2 = step2._1;
                  break;
                // Enqueue the Bracket so that we can call the appropriate handlers
                // after resource acquisition.
                case BRACKET:
                  bracketCount++;
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step2, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step2, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step2 = step2._1;
                  break;
                case FORK:
                  status = STEP_RESULT;
                  tmp = Fiber(util, supervisor, step2._2);
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
                  if (step2._1) {
                    tmp.run();
                  }
                  step2 = util.right(tmp);
                  break;
                case SEQ:
                  status = CONTINUE;
                  step2 = sequential(util, supervisor, step2._1);
                  break;
              }
              break;
            case RETURN:
              bhead = null;
              btail = null;
              if (attempts === null) {
                status = COMPLETED;
                step2 = interrupt || fail2 || step2;
              } else {
                tmp = attempts._3;
                attempt = attempts._1;
                attempts = attempts._2;
                switch (attempt.tag) {
                  // We cannot recover from an unmasked interrupt. Otherwise we should
                  // continue stepping, or run the exception handler if an exception
                  // was raised.
                  case CATCH:
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      status = RETURN;
                    } else if (fail2) {
                      status = CONTINUE;
                      step2 = attempt._2(util.fromLeft(fail2));
                      fail2 = null;
                    }
                    break;
                  // We cannot resume from an unmasked interrupt or exception.
                  case RESUME:
                    if (interrupt && interrupt !== tmp && bracketCount === 0 || fail2) {
                      status = RETURN;
                    } else {
                      bhead = attempt._1;
                      btail = attempt._2;
                      status = STEP_BIND;
                      step2 = util.fromRight(step2);
                    }
                    break;
                  // If we have a bracket, we should enqueue the handlers,
                  // and continue with the success branch only if the fiber has
                  // not been interrupted. If the bracket acquisition failed, we
                  // should not run either.
                  case BRACKET:
                    bracketCount--;
                    if (fail2 === null) {
                      result = util.fromRight(step2);
                      attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                      if (interrupt === tmp || bracketCount > 0) {
                        status = CONTINUE;
                        step2 = attempt._3(result);
                      }
                    }
                    break;
                  // Enqueue the appropriate handler. We increase the bracket count
                  // because it should not be cancelled.
                  case RELEASE:
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step2, fail2), attempts, interrupt);
                    status = CONTINUE;
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      step2 = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                    } else if (fail2) {
                      step2 = attempt._1.failed(util.fromLeft(fail2))(attempt._2);
                    } else {
                      step2 = attempt._1.completed(util.fromRight(step2))(attempt._2);
                    }
                    fail2 = null;
                    bracketCount++;
                    break;
                  case FINALIZER:
                    bracketCount++;
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step2, fail2), attempts, interrupt);
                    status = CONTINUE;
                    step2 = attempt._1;
                    break;
                  case FINALIZED:
                    bracketCount--;
                    status = RETURN;
                    step2 = attempt._1;
                    fail2 = attempt._2;
                    break;
                }
              }
              break;
            case COMPLETED:
              for (var k in joins) {
                if (joins.hasOwnProperty(k)) {
                  rethrow = rethrow && joins[k].rethrow;
                  runEff(joins[k].handler(step2));
                }
              }
              joins = null;
              if (interrupt && fail2) {
                setTimeout(function() {
                  throw util.fromLeft(fail2);
                }, 0);
              } else if (util.isLeft(step2) && rethrow) {
                setTimeout(function() {
                  if (rethrow) {
                    throw util.fromLeft(step2);
                  }
                }, 0);
              }
              return;
            case SUSPENDED:
              status = CONTINUE;
              break;
            case PENDING:
              return;
          }
        }
      }
      function onComplete(join2) {
        return function() {
          if (status === COMPLETED) {
            rethrow = rethrow && join2.rethrow;
            join2.handler(step2)();
            return function() {
            };
          }
          var jid = joinId++;
          joins = joins || {};
          joins[jid] = join2;
          return function() {
            if (joins !== null) {
              delete joins[jid];
            }
          };
        };
      }
      function kill(error3, cb) {
        return function() {
          if (status === COMPLETED) {
            cb(util.right(void 0))();
            return function() {
            };
          }
          var canceler = onComplete({
            rethrow: false,
            handler: function() {
              return cb(util.right(void 0));
            }
          })();
          switch (status) {
            case SUSPENDED:
              interrupt = util.left(error3);
              status = COMPLETED;
              step2 = interrupt;
              run2(runTick);
              break;
            case PENDING:
              if (interrupt === null) {
                interrupt = util.left(error3);
              }
              if (bracketCount === 0) {
                if (status === PENDING) {
                  attempts = new Aff2(CONS, new Aff2(FINALIZER, step2(error3)), attempts, interrupt);
                }
                status = RETURN;
                step2 = null;
                fail2 = null;
                run2(++runTick);
              }
              break;
            default:
              if (interrupt === null) {
                interrupt = util.left(error3);
              }
              if (bracketCount === 0) {
                status = RETURN;
                step2 = null;
                fail2 = null;
              }
          }
          return canceler;
        };
      }
      function join(cb) {
        return function() {
          var canceler = onComplete({
            rethrow: false,
            handler: cb
          })();
          if (status === SUSPENDED) {
            run2(runTick);
          }
          return canceler;
        };
      }
      return {
        kill,
        join,
        onComplete,
        isSuspended: function() {
          return status === SUSPENDED;
        },
        run: function() {
          if (status === SUSPENDED) {
            if (!Scheduler.isDraining()) {
              Scheduler.enqueue(function() {
                run2(runTick);
              });
            } else {
              run2(runTick);
            }
          }
        }
      };
    }
    function runPar(util, supervisor, par, cb) {
      var fiberId = 0;
      var fibers = {};
      var killId = 0;
      var kills = {};
      var early = new Error("[ParAff] Early exit");
      var interrupt = null;
      var root = EMPTY;
      function kill(error3, par2, cb2) {
        var step2 = par2;
        var head = null;
        var tail = null;
        var count = 0;
        var kills2 = {};
        var tmp, kid;
        loop: while (true) {
          tmp = null;
          switch (step2.tag) {
            case FORKED:
              if (step2._3 === EMPTY) {
                tmp = fibers[step2._1];
                kills2[count++] = tmp.kill(error3, function(result) {
                  return function() {
                    count--;
                    if (count === 0) {
                      cb2(result)();
                    }
                  };
                });
              }
              if (head === null) {
                break loop;
              }
              step2 = head._2;
              if (tail === null) {
                head = null;
              } else {
                head = tail._1;
                tail = tail._2;
              }
              break;
            case MAP:
              step2 = step2._2;
              break;
            case APPLY:
            case ALT:
              if (head) {
                tail = new Aff2(CONS, head, tail);
              }
              head = step2;
              step2 = step2._1;
              break;
          }
        }
        if (count === 0) {
          cb2(util.right(void 0))();
        } else {
          kid = 0;
          tmp = count;
          for (; kid < tmp; kid++) {
            kills2[kid] = kills2[kid]();
          }
        }
        return kills2;
      }
      function join(result, head, tail) {
        var fail2, step2, lhs, rhs, tmp, kid;
        if (util.isLeft(result)) {
          fail2 = result;
          step2 = null;
        } else {
          step2 = result;
          fail2 = null;
        }
        loop: while (true) {
          lhs = null;
          rhs = null;
          tmp = null;
          kid = null;
          if (interrupt !== null) {
            return;
          }
          if (head === null) {
            cb(fail2 || step2)();
            return;
          }
          if (head._3 !== EMPTY) {
            return;
          }
          switch (head.tag) {
            case MAP:
              if (fail2 === null) {
                head._3 = util.right(head._1(util.fromRight(step2)));
                step2 = head._3;
              } else {
                head._3 = fail2;
              }
              break;
            case APPLY:
              lhs = head._1._3;
              rhs = head._2._3;
              if (fail2) {
                head._3 = fail2;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, fail2 === lhs ? head._2 : head._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join(fail2, null, null);
                    } else {
                      join(fail2, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              } else if (lhs === EMPTY || rhs === EMPTY) {
                return;
              } else {
                step2 = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                head._3 = step2;
              }
              break;
            case ALT:
              lhs = head._1._3;
              rhs = head._2._3;
              if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                return;
              }
              if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                fail2 = step2 === lhs ? rhs : lhs;
                step2 = null;
                head._3 = fail2;
              } else {
                head._3 = step2;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, step2 === lhs ? head._2 : head._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join(step2, null, null);
                    } else {
                      join(step2, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              }
              break;
          }
          if (tail === null) {
            head = null;
          } else {
            head = tail._1;
            tail = tail._2;
          }
        }
      }
      function resolve(fiber) {
        return function(result) {
          return function() {
            delete fibers[fiber._1];
            fiber._3 = result;
            join(result, fiber._2._1, fiber._2._2);
          };
        };
      }
      function run2() {
        var status = CONTINUE;
        var step2 = par;
        var head = null;
        var tail = null;
        var tmp, fid;
        loop: while (true) {
          tmp = null;
          fid = null;
          switch (status) {
            case CONTINUE:
              switch (step2.tag) {
                case MAP:
                  if (head) {
                    tail = new Aff2(CONS, head, tail);
                  }
                  head = new Aff2(MAP, step2._1, EMPTY, EMPTY);
                  step2 = step2._2;
                  break;
                case APPLY:
                  if (head) {
                    tail = new Aff2(CONS, head, tail);
                  }
                  head = new Aff2(APPLY, EMPTY, step2._2, EMPTY);
                  step2 = step2._1;
                  break;
                case ALT:
                  if (head) {
                    tail = new Aff2(CONS, head, tail);
                  }
                  head = new Aff2(ALT, EMPTY, step2._2, EMPTY);
                  step2 = step2._1;
                  break;
                default:
                  fid = fiberId++;
                  status = RETURN;
                  tmp = step2;
                  step2 = new Aff2(FORKED, fid, new Aff2(CONS, head, tail), EMPTY);
                  tmp = Fiber(util, supervisor, tmp);
                  tmp.onComplete({
                    rethrow: false,
                    handler: resolve(step2)
                  })();
                  fibers[fid] = tmp;
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
              }
              break;
            case RETURN:
              if (head === null) {
                break loop;
              }
              if (head._1 === EMPTY) {
                head._1 = step2;
                status = CONTINUE;
                step2 = head._2;
                head._2 = EMPTY;
              } else {
                head._2 = step2;
                step2 = head;
                if (tail === null) {
                  head = null;
                } else {
                  head = tail._1;
                  tail = tail._2;
                }
              }
          }
        }
        root = step2;
        for (fid = 0; fid < fiberId; fid++) {
          fibers[fid].run();
        }
      }
      function cancel(error3, cb2) {
        interrupt = util.left(error3);
        var innerKills;
        for (var kid in kills) {
          if (kills.hasOwnProperty(kid)) {
            innerKills = kills[kid];
            for (kid in innerKills) {
              if (innerKills.hasOwnProperty(kid)) {
                innerKills[kid]();
              }
            }
          }
        }
        kills = null;
        var newKills = kill(error3, root, cb2);
        return function(killError) {
          return new Aff2(ASYNC, function(killCb) {
            return function() {
              for (var kid2 in newKills) {
                if (newKills.hasOwnProperty(kid2)) {
                  newKills[kid2]();
                }
              }
              return nonCanceler2;
            };
          });
        };
      }
      run2();
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            return cancel(killError, killCb);
          };
        });
      };
    }
    function sequential(util, supervisor, par) {
      return new Aff2(ASYNC, function(cb) {
        return function() {
          return runPar(util, supervisor, par, cb);
        };
      });
    }
    Aff2.EMPTY = EMPTY;
    Aff2.Pure = AffCtr(PURE);
    Aff2.Throw = AffCtr(THROW);
    Aff2.Catch = AffCtr(CATCH);
    Aff2.Sync = AffCtr(SYNC);
    Aff2.Async = AffCtr(ASYNC);
    Aff2.Bind = AffCtr(BIND);
    Aff2.Bracket = AffCtr(BRACKET);
    Aff2.Fork = AffCtr(FORK);
    Aff2.Seq = AffCtr(SEQ);
    Aff2.ParMap = AffCtr(MAP);
    Aff2.ParApply = AffCtr(APPLY);
    Aff2.ParAlt = AffCtr(ALT);
    Aff2.Fiber = Fiber;
    Aff2.Supervisor = Supervisor;
    Aff2.Scheduler = Scheduler;
    Aff2.nonCanceler = nonCanceler2;
    return Aff2;
  }();
  var _pure = Aff.Pure;
  var _throwError = Aff.Throw;
  function _catchError(aff) {
    return function(k) {
      return Aff.Catch(aff, k);
    };
  }
  function _map(f) {
    return function(aff) {
      if (aff.tag === Aff.Pure.tag) {
        return Aff.Pure(f(aff._1));
      } else {
        return Aff.Bind(aff, function(value) {
          return Aff.Pure(f(value));
        });
      }
    };
  }
  function _bind(aff) {
    return function(k) {
      return Aff.Bind(aff, k);
    };
  }
  function _fork(immediate) {
    return function(aff) {
      return Aff.Fork(immediate, aff);
    };
  }
  var _liftEffect = Aff.Sync;
  function _parAffMap(f) {
    return function(aff) {
      return Aff.ParMap(f, aff);
    };
  }
  function _parAffApply(aff1) {
    return function(aff2) {
      return Aff.ParApply(aff1, aff2);
    };
  }
  var makeAff = Aff.Async;
  function generalBracket(acquire) {
    return function(options) {
      return function(k) {
        return Aff.Bracket(acquire, options, k);
      };
    };
  }
  function _makeFiber(util, aff) {
    return function() {
      return Aff.Fiber(util, null, aff);
    };
  }
  var _sequential = Aff.Seq;

  // output-es/Effect.Aff/index.js
  var functorParAff = { map: _parAffMap };
  var functorAff = { map: _map };
  var forkAff = /* @__PURE__ */ _fork(true);
  var ffiUtil = {
    isLeft: (v) => {
      if (v.tag === "Left") {
        return true;
      }
      if (v.tag === "Right") {
        return false;
      }
      fail();
    },
    fromLeft: (v) => {
      if (v.tag === "Left") {
        return v._1;
      }
      if (v.tag === "Right") {
        return _crashWith("unsafeFromLeft: Right");
      }
      fail();
    },
    fromRight: (v) => {
      if (v.tag === "Right") {
        return v._1;
      }
      if (v.tag === "Left") {
        return _crashWith("unsafeFromRight: Left");
      }
      fail();
    },
    left: Left,
    right: Right
  };
  var applyParAff = { apply: _parAffApply, Functor0: () => functorParAff };
  var monadAff = { Applicative0: () => applicativeAff, Bind1: () => bindAff };
  var bindAff = { bind: _bind, Apply0: () => applyAff };
  var applyAff = { apply: (f) => (a) => _bind(f)((f$p) => _bind(a)((a$p) => applicativeAff.pure(f$p(a$p)))), Functor0: () => functorAff };
  var applicativeAff = { pure: _pure, Apply0: () => applyAff };
  var $$finally = (fin) => (a) => generalBracket(_pure())({ killed: (v) => (v$1) => fin, failed: (v) => (v$1) => fin, completed: (v) => (v$1) => fin })((v) => a);
  var parallelAff = { parallel: unsafeCoerce, sequential: _sequential, Apply0: () => applyAff, Apply1: () => applyParAff };
  var applicativeParAff = { pure: (x) => _pure(x), Apply0: () => applyParAff };
  var monadEffectAff = { liftEffect: _liftEffect, Monad0: () => monadAff };
  var joinFiber = (v) => makeAff((k) => {
    const $0 = v.join(k);
    return () => {
      const a$p = $0();
      const $1 = _liftEffect(a$p);
      return (v$1) => $1;
    };
  });
  var killFiber = (e) => (v) => _bind(_liftEffect(v.isSuspended))((suspended) => {
    if (suspended) {
      return _liftEffect((() => {
        const $0 = v.kill(e, (v$1) => () => {
        });
        return () => {
          $0();
        };
      })());
    }
    return makeAff((k) => {
      const $0 = v.kill(e, k);
      return () => {
        const a$p = $0();
        const $1 = _liftEffect(a$p);
        return (v$1) => $1;
      };
    });
  });
  var monadThrowAff = { throwError: _throwError, Monad0: () => monadAff };
  var monadErrorAff = { catchError: _catchError, MonadThrow0: () => monadThrowAff };
  var $$try2 = /* @__PURE__ */ $$try(monadErrorAff);
  var runAff = (k) => (aff) => {
    const $0 = _makeFiber(ffiUtil, _bind($$try2(aff))((x) => _liftEffect(k(x))));
    return () => {
      const fiber = $0();
      fiber.run();
      return fiber;
    };
  };
  var runAff_ = (k) => (aff) => {
    const $0 = runAff(k)(aff);
    return () => {
      $0();
    };
  };
  var monadRecAff = {
    tailRecM: (k) => {
      const go = (a) => _bind(k(a))((res) => {
        if (res.tag === "Done") {
          return _pure(res._1);
        }
        if (res.tag === "Loop") {
          return go(res._1);
        }
        fail();
      });
      return go;
    },
    Monad0: () => monadAff
  };
  var nonCanceler = /* @__PURE__ */ (() => {
    const $0 = _pure();
    return (v) => $0;
  })();

  // output-es/Data.Nullable/foreign.js
  var nullImpl = null;
  function nullable(a, r, f) {
    return a == null ? r : f(a);
  }
  function notNull(x) {
    return x;
  }

  // output-es/Web.DOM.ParentNode/foreign.js
  var getEffProp = function(name2) {
    return function(node) {
      return function() {
        return node[name2];
      };
    };
  };
  var children = getEffProp("children");
  var _firstElementChild = getEffProp("firstElementChild");
  var _lastElementChild = getEffProp("lastElementChild");
  var childElementCount = getEffProp("childElementCount");
  function _querySelector(selector) {
    return function(node) {
      return function() {
        return node.querySelector(selector);
      };
    };
  }

  // output-es/Web.DOM.ParentNode/index.js
  var querySelector = (qs) => {
    const $0 = _querySelector(qs);
    return (x) => {
      const $1 = $0(x);
      return () => {
        const a$p = $1();
        return nullable(a$p, Nothing, Just);
      };
    };
  };

  // output-es/Web.Event.EventTarget/foreign.js
  function eventListener(fn) {
    return function() {
      return function(event) {
        return fn(event)();
      };
    };
  }
  function addEventListener(type) {
    return function(listener) {
      return function(useCapture) {
        return function(target) {
          return function() {
            return target.addEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }
  function removeEventListener(type) {
    return function(listener) {
      return function(useCapture) {
        return function(target) {
          return function() {
            return target.removeEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }

  // output-es/Web.HTML/foreign.js
  var windowImpl = function() {
    return window;
  };

  // output-es/Web.HTML.HTMLDocument.ReadyState/index.js
  var $ReadyState = (tag) => tag;
  var Loading = /* @__PURE__ */ $ReadyState("Loading");
  var Interactive = /* @__PURE__ */ $ReadyState("Interactive");
  var Complete = /* @__PURE__ */ $ReadyState("Complete");

  // output-es/Web.HTML.HTMLDocument/foreign.js
  function _readyState(doc) {
    return doc.readyState;
  }

  // output-es/Web.HTML.HTMLDocument/index.js
  var readyState = (doc) => () => {
    const a$p = _readyState(doc);
    if (a$p === "loading") {
      return Loading;
    }
    if (a$p === "interactive") {
      return Interactive;
    }
    if (a$p === "complete") {
      return Complete;
    }
    return Loading;
  };

  // output-es/Web.HTML.HTMLElement/foreign.js
  function _read(nothing, just, value) {
    var tag = Object.prototype.toString.call(value);
    if (tag.indexOf("[object HTML") === 0 && tag.indexOf("Element]") === tag.length - 8) {
      return just(value);
    } else {
      return nothing;
    }
  }

  // output-es/Web.HTML.Window/foreign.js
  function document(window2) {
    return function() {
      return window2.document;
    };
  }

  // output-es/Halogen.Aff.Util/index.js
  var selectElement = (query) => _bind(_liftEffect((() => {
    const $0 = querySelector(query);
    return () => {
      const $1 = windowImpl();
      const $2 = document($1)();
      return $0($2)();
    };
  })()))((mel) => _pure((() => {
    if (mel.tag === "Just") {
      return _read(Nothing, Just, mel._1);
    }
    if (mel.tag === "Nothing") {
      return Nothing;
    }
    fail();
  })()));
  var runHalogenAff = /* @__PURE__ */ runAff_((v2) => {
    if (v2.tag === "Left") {
      return throwException(v2._1);
    }
    if (v2.tag === "Right") {
      return () => {
      };
    }
    fail();
  });
  var awaitLoad = /* @__PURE__ */ makeAff((callback) => () => {
    const $0 = windowImpl();
    const $1 = document($0)();
    const rs = readyState($1)();
    if (rs === "Loading") {
      const et = windowImpl();
      const listener = eventListener((v) => callback($Either("Right", void 0)))();
      addEventListener("DOMContentLoaded")(listener)(false)(et)();
      const $2 = _liftEffect(removeEventListener("DOMContentLoaded")(listener)(false)(et));
      return (v) => $2;
    }
    callback($Either("Right", void 0))();
    return nonCanceler;
  });
  var awaitBody = /* @__PURE__ */ _bind(awaitLoad)(() => _bind(selectElement("body"))((body) => {
    const $0 = _throwError(error("Could not find body"));
    if (body.tag === "Nothing") {
      return $0;
    }
    if (body.tag === "Just") {
      return _pure(body._1);
    }
    fail();
  }));

  // output-es/Data.Map.Internal/index.js
  var $$$Map = (tag, _1, _2, _3, _4, _5, _6) => ({ tag, _1, _2, _3, _4, _5, _6 });
  var $Split = (_1, _2, _3) => ({ tag: "Split", _1, _2, _3 });
  var $SplitLast = (_1, _2, _3) => ({ tag: "SplitLast", _1, _2, _3 });
  var Leaf = /* @__PURE__ */ $$$Map("Leaf");
  var unsafeNode = (k, v, l, r) => {
    if (l.tag === "Leaf") {
      if (r.tag === "Leaf") {
        return $$$Map("Node", 1, 1, k, v, l, r);
      }
      if (r.tag === "Node") {
        return $$$Map("Node", 1 + r._1 | 0, 1 + r._2 | 0, k, v, l, r);
      }
      fail();
    }
    if (l.tag === "Node") {
      if (r.tag === "Leaf") {
        return $$$Map("Node", 1 + l._1 | 0, 1 + l._2 | 0, k, v, l, r);
      }
      if (r.tag === "Node") {
        return $$$Map("Node", l._1 > r._1 ? 1 + l._1 | 0 : 1 + r._1 | 0, (1 + l._2 | 0) + r._2 | 0, k, v, l, r);
      }
    }
    fail();
  };
  var unsafeBalancedNode = (k, v, l, r) => {
    if (l.tag === "Leaf") {
      if (r.tag === "Leaf") {
        return $$$Map("Node", 1, 1, k, v, Leaf, Leaf);
      }
      if (r.tag === "Node" && r._1 > 1) {
        if (r._5.tag === "Node" && (() => {
          if (r._6.tag === "Leaf") {
            return r._5._1 > 0;
          }
          if (r._6.tag === "Node") {
            return r._5._1 > r._6._1;
          }
          fail();
        })()) {
          return unsafeNode(r._5._3, r._5._4, unsafeNode(k, v, l, r._5._5), unsafeNode(r._3, r._4, r._5._6, r._6));
        }
        return unsafeNode(r._3, r._4, unsafeNode(k, v, l, r._5), r._6);
      }
      return unsafeNode(k, v, l, r);
    }
    if (l.tag === "Node") {
      if (r.tag === "Node") {
        if (r._1 > (l._1 + 1 | 0)) {
          if (r._5.tag === "Node" && (() => {
            if (r._6.tag === "Leaf") {
              return r._5._1 > 0;
            }
            if (r._6.tag === "Node") {
              return r._5._1 > r._6._1;
            }
            fail();
          })()) {
            return unsafeNode(r._5._3, r._5._4, unsafeNode(k, v, l, r._5._5), unsafeNode(r._3, r._4, r._5._6, r._6));
          }
          return unsafeNode(r._3, r._4, unsafeNode(k, v, l, r._5), r._6);
        }
        if (l._1 > (r._1 + 1 | 0)) {
          if (l._6.tag === "Node" && (() => {
            if (l._5.tag === "Leaf") {
              return 0 <= l._6._1;
            }
            if (l._5.tag === "Node") {
              return l._5._1 <= l._6._1;
            }
            fail();
          })()) {
            return unsafeNode(l._6._3, l._6._4, unsafeNode(l._3, l._4, l._5, l._6._5), unsafeNode(k, v, l._6._6, r));
          }
          return unsafeNode(l._3, l._4, l._5, unsafeNode(k, v, l._6, r));
        }
        return unsafeNode(k, v, l, r);
      }
      if (r.tag === "Leaf" && l._1 > 1) {
        if (l._6.tag === "Node" && (() => {
          if (l._5.tag === "Leaf") {
            return 0 <= l._6._1;
          }
          if (l._5.tag === "Node") {
            return l._5._1 <= l._6._1;
          }
          fail();
        })()) {
          return unsafeNode(l._6._3, l._6._4, unsafeNode(l._3, l._4, l._5, l._6._5), unsafeNode(k, v, l._6._6, r));
        }
        return unsafeNode(l._3, l._4, l._5, unsafeNode(k, v, l._6, r));
      }
      return unsafeNode(k, v, l, r);
    }
    fail();
  };
  var unsafeSplit = (comp, k, m) => {
    if (m.tag === "Leaf") {
      return $Split(Nothing, Leaf, Leaf);
    }
    if (m.tag === "Node") {
      const v = comp(k)(m._3);
      if (v === "LT") {
        const v1 = unsafeSplit(comp, k, m._5);
        return $Split(v1._1, v1._2, unsafeBalancedNode(m._3, m._4, v1._3, m._6));
      }
      if (v === "GT") {
        const v1 = unsafeSplit(comp, k, m._6);
        return $Split(v1._1, unsafeBalancedNode(m._3, m._4, m._5, v1._2), v1._3);
      }
      if (v === "EQ") {
        return $Split($Maybe("Just", m._4), m._5, m._6);
      }
    }
    fail();
  };
  var unsafeSplitLast = (k, v, l, r) => {
    if (r.tag === "Leaf") {
      return $SplitLast(k, v, l);
    }
    if (r.tag === "Node") {
      const v1 = unsafeSplitLast(r._3, r._4, r._5, r._6);
      return $SplitLast(v1._1, v1._2, unsafeBalancedNode(k, v, l, v1._3));
    }
    fail();
  };
  var unsafeJoinNodes = (v, v1) => {
    if (v.tag === "Leaf") {
      return v1;
    }
    if (v.tag === "Node") {
      const v2 = unsafeSplitLast(v._3, v._4, v._5, v._6);
      return unsafeBalancedNode(v2._1, v2._2, v2._3, v1);
    }
    fail();
  };
  var insert = (dictOrd) => (k) => (v) => {
    const go = (v1) => {
      if (v1.tag === "Leaf") {
        return $$$Map("Node", 1, 1, k, v, Leaf, Leaf);
      }
      if (v1.tag === "Node") {
        const v2 = dictOrd.compare(k)(v1._3);
        if (v2 === "LT") {
          return unsafeBalancedNode(v1._3, v1._4, go(v1._5), v1._6);
        }
        if (v2 === "GT") {
          return unsafeBalancedNode(v1._3, v1._4, v1._5, go(v1._6));
        }
        if (v2 === "EQ") {
          return $$$Map("Node", v1._1, v1._2, k, v, v1._5, v1._6);
        }
      }
      fail();
    };
    return go;
  };
  var foldableMap = {
    foldr: (f) => (z) => {
      const go = (m$p, z$p) => {
        if (m$p.tag === "Leaf") {
          return z$p;
        }
        if (m$p.tag === "Node") {
          return go(m$p._5, f(m$p._4)(go(m$p._6, z$p)));
        }
        fail();
      };
      return (m) => go(m, z);
    },
    foldl: (f) => (z) => {
      const go = (z$p, m$p) => {
        if (m$p.tag === "Leaf") {
          return z$p;
        }
        if (m$p.tag === "Node") {
          return go(f(go(z$p, m$p._5))(m$p._4), m$p._6);
        }
        fail();
      };
      return (m) => go(z, m);
    },
    foldMap: (dictMonoid) => {
      const mempty = dictMonoid.mempty;
      const $0 = dictMonoid.Semigroup0();
      return (f) => {
        const go = (v) => {
          if (v.tag === "Leaf") {
            return mempty;
          }
          if (v.tag === "Node") {
            return $0.append(go(v._5))($0.append(f(v._4))(go(v._6)));
          }
          fail();
        };
        return go;
      };
    }
  };
  var $$delete = (dictOrd) => (k) => {
    const go = (v) => {
      if (v.tag === "Leaf") {
        return Leaf;
      }
      if (v.tag === "Node") {
        const v1 = dictOrd.compare(k)(v._3);
        if (v1 === "LT") {
          return unsafeBalancedNode(v._3, v._4, go(v._5), v._6);
        }
        if (v1 === "GT") {
          return unsafeBalancedNode(v._3, v._4, v._5, go(v._6));
        }
        if (v1 === "EQ") {
          return unsafeJoinNodes(v._5, v._6);
        }
      }
      fail();
    };
    return go;
  };
  var alter = (dictOrd) => {
    const compare = dictOrd.compare;
    return (f) => (k) => (m) => {
      const v = unsafeSplit(compare, k, m);
      const v2 = f(v._1);
      if (v2.tag === "Nothing") {
        return unsafeJoinNodes(v._2, v._3);
      }
      if (v2.tag === "Just") {
        return unsafeBalancedNode(k, v2._1, v._2, v._3);
      }
      fail();
    };
  };

  // output-es/Halogen.Data.Slot/index.js
  var foreachSlot = (dictApplicative) => {
    const traverse_7 = traverse_(dictApplicative)(foldableMap);
    return (v) => (k) => traverse_7((x) => k(x))(v);
  };

  // output-es/Halogen.Query.Input/index.js
  var $Input = (tag, _1, _2) => ({ tag, _1, _2 });

  // output-es/Foreign/foreign.js
  function typeOf(value) {
    return typeof value;
  }
  var isArray = Array.isArray || function(value) {
    return Object.prototype.toString.call(value) === "[object Array]";
  };

  // output-es/Foreign.Object/foreign.js
  function _lookup(no, yes, k, m) {
    return k in m ? yes(m[k]) : no;
  }
  function toArrayWithKey(f) {
    return function(m) {
      var r = [];
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r.push(f(k)(m[k]));
        }
      }
      return r;
    };
  }
  var keys = Object.keys || toArrayWithKey(function(k) {
    return function() {
      return k;
    };
  });

  // output-es/Halogen.VDom.Machine/index.js
  var $Step$p = (_1, _2, _3, _4) => ({ tag: "Step", _1, _2, _3, _4 });
  var step = (v, $0) => {
    const $1 = v._2;
    return v._3($1, $0);
  };
  var halt = (v) => {
    const $0 = v._2;
    return v._4($0);
  };

  // output-es/Halogen.VDom.Util/foreign.js
  function unsafeGetAny(key, obj) {
    return obj[key];
  }
  function unsafeHasAny(key, obj) {
    return obj.hasOwnProperty(key);
  }
  function unsafeSetAny(key, val, obj) {
    obj[key] = val;
  }
  function forE2(a, f) {
    var b = [];
    for (var i = 0; i < a.length; i++) {
      b.push(f(i, a[i]));
    }
    return b;
  }
  function forEachE(a, f) {
    for (var i = 0; i < a.length; i++) {
      f(a[i]);
    }
  }
  function forInE(o, f) {
    var ks = Object.keys(o);
    for (var i = 0; i < ks.length; i++) {
      var k = ks[i];
      f(k, o[k]);
    }
  }
  function diffWithIxE(a1, a2, f1, f2, f3) {
    var a3 = [];
    var l1 = a1.length;
    var l2 = a2.length;
    var i = 0;
    while (1) {
      if (i < l1) {
        if (i < l2) {
          a3.push(f1(i, a1[i], a2[i]));
        } else {
          f2(i, a1[i]);
        }
      } else if (i < l2) {
        a3.push(f3(i, a2[i]));
      } else {
        break;
      }
      i++;
    }
    return a3;
  }
  function strMapWithIxE(as, fk, f) {
    var o = {};
    for (var i = 0; i < as.length; i++) {
      var a = as[i];
      var k = fk(a);
      o[k] = f(k, i, a);
    }
    return o;
  }
  function diffWithKeyAndIxE(o1, as, fk, f1, f2, f3) {
    var o2 = {};
    for (var i = 0; i < as.length; i++) {
      var a = as[i];
      var k = fk(a);
      if (o1.hasOwnProperty(k)) {
        o2[k] = f1(k, i, o1[k], a);
      } else {
        o2[k] = f3(k, i, a);
      }
    }
    for (var k in o1) {
      if (k in o2) {
        continue;
      }
      f2(k, o1[k]);
    }
    return o2;
  }
  function refEq2(a, b) {
    return a === b;
  }
  function createTextNode(s, doc) {
    return doc.createTextNode(s);
  }
  function setTextContent(s, n) {
    n.textContent = s;
  }
  function createElement(ns, name2, doc) {
    if (ns != null) {
      return doc.createElementNS(ns, name2);
    } else {
      return doc.createElement(name2);
    }
  }
  function insertChildIx(i, a, b) {
    var n = b.childNodes.item(i) || null;
    if (n !== a) {
      b.insertBefore(a, n);
    }
  }
  function removeChild(a, b) {
    if (b && a.parentNode === b) {
      b.removeChild(a);
    }
  }
  function parentNode(a) {
    return a.parentNode;
  }
  function setAttribute(ns, attr2, val, el) {
    if (ns != null) {
      el.setAttributeNS(ns, attr2, val);
    } else {
      el.setAttribute(attr2, val);
    }
  }
  function removeAttribute(ns, attr2, el) {
    if (ns != null) {
      el.removeAttributeNS(ns, attr2);
    } else {
      el.removeAttribute(attr2);
    }
  }
  function hasAttribute(ns, attr2, el) {
    if (ns != null) {
      return el.hasAttributeNS(ns, attr2);
    } else {
      return el.hasAttribute(attr2);
    }
  }
  function addEventListener2(ev, listener, el) {
    el.addEventListener(ev, listener, false);
  }
  function removeEventListener2(ev, listener, el) {
    el.removeEventListener(ev, listener, false);
  }
  var jsUndefined = void 0;

  // output-es/Halogen.VDom.DOM.Prop/index.js
  var $ElemRef = (tag, _1) => ({ tag, _1 });
  var $Prop = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
  var Property = (value0) => (value1) => $Prop("Property", value0, value1);
  var removeProperty = (key, el) => {
    const v = hasAttribute(nullImpl, key, el);
    if (v) {
      return removeAttribute(nullImpl, key, el);
    }
    if (typeOf(unsafeGetAny(key, el)) === "string") {
      return unsafeSetAny(key, "", el);
    }
    if (key === "rowSpan") {
      return unsafeSetAny(key, 1, el);
    }
    if (key === "colSpan") {
      return unsafeSetAny(key, 1, el);
    }
    return unsafeSetAny(key, jsUndefined, el);
  };
  var propToStrKey = (v) => {
    if (v.tag === "Attribute") {
      if (v._1.tag === "Just") {
        return "attr/" + v._1._1 + ":" + v._2;
      }
      return "attr/:" + v._2;
    }
    if (v.tag === "Property") {
      return "prop/" + v._1;
    }
    if (v.tag === "Handler") {
      return "handler/" + v._1;
    }
    if (v.tag === "Ref") {
      return "ref";
    }
    fail();
  };
  var buildProp = (emit) => (el) => {
    const haltProp = (state) => {
      const v = _lookup(Nothing, Just, "ref", state.props);
      if (v.tag === "Just" && v._1.tag === "Ref") {
        const $0 = v._1._1($ElemRef("Removed", el));
        if ($0.tag === "Just") {
          return emit($0._1)();
        }
      }
    };
    const applyProp = (events) => (v, v1, v2) => {
      if (v2.tag === "Attribute") {
        const $0 = v2._2;
        const $1 = v2._3;
        const $2 = (() => {
          if (v2._1.tag === "Nothing") {
            return nullImpl;
          }
          if (v2._1.tag === "Just") {
            return notNull(v2._1._1);
          }
          fail();
        })();
        setAttribute($2, $0, $1, el);
        return v2;
      }
      if (v2.tag === "Property") {
        const $0 = v2._1;
        const $1 = v2._2;
        unsafeSetAny($0, $1, el);
        return v2;
      }
      if (v2.tag === "Handler") {
        if (unsafeHasAny(v2._1, events)) {
          const $0 = unsafeGetAny(v2._1, events)._2;
          $0.value = v2._2;
          return v2;
        }
        const ref = { value: v2._2 };
        const listener = eventListener((ev) => () => {
          const f$p = ref.value;
          const $0 = f$p(ev);
          if ($0.tag === "Just") {
            return emit($0._1)();
          }
        })();
        unsafeSetAny(v2._1, $Tuple(listener, ref), events);
        addEventListener2(v2._1, listener, el);
        return v2;
      }
      if (v2.tag === "Ref") {
        const $0 = v2._1($ElemRef("Created", el));
        if ($0.tag === "Just") {
          emit($0._1)();
        }
        return v2;
      }
      fail();
    };
    const patchProp = (state, ps2) => {
      const events = {};
      const $0 = state.events;
      const props = diffWithKeyAndIxE(
        state.props,
        ps2,
        propToStrKey,
        (v, v1, v11, v2) => {
          if (v11.tag === "Attribute") {
            if (v2.tag === "Attribute") {
              if (v11._3 === v2._3) {
                return v2;
              }
              const $1 = (() => {
                if (v2._1.tag === "Nothing") {
                  return nullImpl;
                }
                if (v2._1.tag === "Just") {
                  return notNull(v2._1._1);
                }
                fail();
              })();
              setAttribute($1, v2._2, v2._3, el);
            }
            return v2;
          }
          if (v11.tag === "Property") {
            if (v2.tag === "Property") {
              if (refEq2(v11._2, v2._2)) {
                return v2;
              }
              if (v2._1 === "value" && refEq2(unsafeGetAny("value", el), v2._2)) {
                return v2;
              }
              unsafeSetAny(v2._1, v2._2, el);
            }
            return v2;
          }
          if (v11.tag === "Handler" && v2.tag === "Handler") {
            const $1 = v2._2;
            const $2 = v2._1;
            const handler = unsafeGetAny($2, $0);
            const $3 = handler._2;
            $3.value = $1;
            unsafeSetAny($2, handler, events);
          }
          return v2;
        },
        (v, v1) => {
          if (v1.tag === "Attribute") {
            const $1 = v1._2;
            const $2 = (() => {
              if (v1._1.tag === "Nothing") {
                return nullImpl;
              }
              if (v1._1.tag === "Just") {
                return notNull(v1._1._1);
              }
              fail();
            })();
            return removeAttribute($2, $1, el);
          }
          if (v1.tag === "Property") {
            const $1 = v1._1;
            return removeProperty($1, el);
          }
          if (v1.tag === "Handler") {
            const $1 = v1._1;
            const $2 = unsafeGetAny($1, $0)._1;
            return removeEventListener2($1, $2, el);
          }
          if (v1.tag === "Ref") {
            return;
          }
          fail();
        },
        applyProp(events)
      );
      return $Step$p(void 0, { events, props }, patchProp, haltProp);
    };
    return (ps1) => {
      const events = {};
      const ps1$p = strMapWithIxE(ps1, propToStrKey, applyProp(events));
      return $Step$p(void 0, { events, props: ps1$p }, patchProp, haltProp);
    };
  };

  // output-es/Halogen.VDom.Types/index.js
  var $GraftX = (_1, _2, _3) => ({ tag: "Graft", _1, _2, _3 });
  var $VDom = (tag, _1, _2, _3, _4) => ({ tag, _1, _2, _3, _4 });
  var runGraft = (x) => {
    const go = (v2) => {
      if (v2.tag === "Text") {
        return $VDom("Text", v2._1);
      }
      if (v2.tag === "Elem") {
        return $VDom("Elem", v2._1, v2._2, x._1(v2._3), arrayMap(go)(v2._4));
      }
      if (v2.tag === "Keyed") {
        return $VDom("Keyed", v2._1, v2._2, x._1(v2._3), arrayMap((m) => $Tuple(m._1, go(m._2)))(v2._4));
      }
      if (v2.tag === "Widget") {
        return $VDom("Widget", x._2(v2._1));
      }
      if (v2.tag === "Grafted") {
        const $0 = v2._1;
        return $VDom("Grafted", $GraftX((x$1) => x._1($0._1(x$1)), (x$1) => x._2($0._2(x$1)), $0._3));
      }
      fail();
    };
    return go(x._3);
  };

  // output-es/Control.Applicative.Free/index.js
  var $FreeAp = (tag, _1, _2) => ({ tag, _1, _2 });
  var identity7 = (x) => x;
  var Pure = (value0) => $FreeAp("Pure", value0);
  var goLeft = (goLeft$a0$copy) => (goLeft$a1$copy) => (goLeft$a2$copy) => (goLeft$a3$copy) => (goLeft$a4$copy) => (goLeft$a5$copy) => {
    let goLeft$a0 = goLeft$a0$copy;
    let goLeft$a1 = goLeft$a1$copy;
    let goLeft$a2 = goLeft$a2$copy;
    let goLeft$a3 = goLeft$a3$copy;
    let goLeft$a4 = goLeft$a4$copy;
    let goLeft$a5 = goLeft$a5$copy;
    let goLeft$c = true;
    let goLeft$r;
    while (goLeft$c) {
      const dictApplicative = goLeft$a0, fStack = goLeft$a1, valStack = goLeft$a2, nat = goLeft$a3, func = goLeft$a4, count = goLeft$a5;
      if (func.tag === "Pure") {
        goLeft$c = false;
        goLeft$r = $Tuple($List("Cons", { func: dictApplicative.pure(func._1), count }, fStack), valStack);
        continue;
      }
      if (func.tag === "Lift") {
        goLeft$c = false;
        goLeft$r = $Tuple($List("Cons", { func: nat(func._1), count }, fStack), valStack);
        continue;
      }
      if (func.tag === "Ap") {
        goLeft$a0 = dictApplicative;
        goLeft$a1 = fStack;
        goLeft$a2 = $NonEmpty(func._2, $List("Cons", valStack._1, valStack._2));
        goLeft$a3 = nat;
        goLeft$a4 = func._1;
        goLeft$a5 = count + 1 | 0;
        continue;
      }
      fail();
    }
    return goLeft$r;
  };
  var goApply = (goApply$a0$copy) => (goApply$a1$copy) => (goApply$a2$copy) => (goApply$a3$copy) => {
    let goApply$a0 = goApply$a0$copy, goApply$a1 = goApply$a1$copy, goApply$a2 = goApply$a2$copy, goApply$a3 = goApply$a3$copy, goApply$c = true, goApply$r;
    while (goApply$c) {
      const dictApplicative = goApply$a0, fStack = goApply$a1, vals = goApply$a2, gVal = goApply$a3;
      if (fStack.tag === "Nil") {
        goApply$c = false;
        goApply$r = $Either("Left", gVal);
        continue;
      }
      if (fStack.tag === "Cons") {
        const gRes = dictApplicative.Apply0().apply(fStack._1.func)(gVal);
        if (fStack._1.count === 1) {
          if (fStack._2.tag === "Nil") {
            goApply$c = false;
            goApply$r = $Either("Left", gRes);
            continue;
          }
          goApply$a0 = dictApplicative;
          goApply$a1 = fStack._2;
          goApply$a2 = vals;
          goApply$a3 = gRes;
          continue;
        }
        if (vals.tag === "Nil") {
          goApply$c = false;
          goApply$r = $Either("Left", gRes);
          continue;
        }
        if (vals.tag === "Cons") {
          goApply$c = false;
          goApply$r = $Either(
            "Right",
            $Tuple($List("Cons", { func: gRes, count: fStack._1.count - 1 | 0 }, fStack._2), $NonEmpty(vals._1, vals._2))
          );
          continue;
        }
      }
      fail();
    }
    return goApply$r;
  };
  var functorFreeAp = { map: (f) => (x) => $FreeAp("Ap", $FreeAp("Pure", f), x) };
  var foldFreeAp = (dictApplicative) => (nat) => (z) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v._2._1.tag === "Pure") {
          const v1 = goApply(dictApplicative)(v._1)(v._2._2)(dictApplicative.pure(v._2._1._1));
          if (v1.tag === "Left") {
            go$c = false;
            go$r = v1._1;
            continue;
          }
          if (v1.tag === "Right") {
            go$a0 = v1._1;
            continue;
          }
          fail();
        }
        if (v._2._1.tag === "Lift") {
          const v1 = goApply(dictApplicative)(v._1)(v._2._2)(nat(v._2._1._1));
          if (v1.tag === "Left") {
            go$c = false;
            go$r = v1._1;
            continue;
          }
          if (v1.tag === "Right") {
            go$a0 = v1._1;
            continue;
          }
          fail();
        }
        if (v._2._1.tag === "Ap") {
          go$a0 = goLeft(dictApplicative)(v._1)($NonEmpty(v._2._1._2, v._2._2))(nat)(v._2._1._1)(1);
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go($Tuple(Nil, $NonEmpty(z, Nil)));
  };
  var applyFreeAp = { apply: (fba) => (fb) => $FreeAp("Ap", fba, fb), Functor0: () => functorFreeAp };
  var applicativeFreeAp = { pure: Pure, Apply0: () => applyFreeAp };

  // output-es/Halogen.Query.HalogenM/index.js
  var $HalogenF = (tag, _1, _2) => ({ tag, _1, _2 });
  var SubscriptionId = (x) => x;
  var ForkId = (x) => x;
  var monadEffectHalogenM = (dictMonadEffect) => ({
    liftEffect: (x) => $Free(
      $FreeView(
        "Bind",
        $HalogenF("Lift", dictMonadEffect.liftEffect(x)),
        (x$1) => $Free($FreeView("Return", x$1), CatNil)
      ),
      CatNil
    ),
    Monad0: () => freeMonad
  });

  // output-es/Halogen.VDom.DOM/index.js
  var haltWidget = (v) => {
    const $0 = v.widget;
    return halt($0);
  };
  var patchWidget = (state, vdom) => {
    if (vdom.tag === "Grafted") {
      const $0 = runGraft(vdom._1);
      return patchWidget(state, $0);
    }
    if (vdom.tag === "Widget") {
      const $0 = vdom._1;
      const res = step(state.widget, $0);
      return $Step$p(res._1, { build: state.build, widget: res }, patchWidget, haltWidget);
    }
    haltWidget(state);
    return state.build(vdom);
  };
  var haltText = (v) => {
    const $0 = v.node;
    const parent2 = parentNode($0);
    return removeChild($0, parent2);
  };
  var patchText = (state, vdom) => {
    if (vdom.tag === "Grafted") {
      const $0 = runGraft(vdom._1);
      return patchText(state, $0);
    }
    if (vdom.tag === "Text") {
      if (state.value === vdom._1) {
        return $Step$p(state.node, state, patchText, haltText);
      }
      const $0 = vdom._1;
      setTextContent($0, state.node);
      return $Step$p(state.node, { build: state.build, node: state.node, value: $0 }, patchText, haltText);
    }
    haltText(state);
    return state.build(vdom);
  };
  var haltKeyed = (v) => {
    const $0 = v.attrs;
    const $1 = v.children;
    const $2 = v.node;
    const parent2 = parentNode($2);
    removeChild($2, parent2);
    forInE($1, (v1, s) => halt(s));
    return halt($0);
  };
  var haltElem = (v) => {
    const $0 = v.attrs;
    const $1 = v.children;
    const $2 = v.node;
    const parent2 = parentNode($2);
    removeChild($2, parent2);
    forEachE($1, halt);
    return halt($0);
  };
  var eqElemSpec = (ns1, v, ns2, v1) => v === v1 && (ns1.tag === "Just" ? ns2.tag === "Just" && ns1._1 === ns2._1 : ns1.tag === "Nothing" && ns2.tag === "Nothing");
  var patchElem = (state, vdom) => {
    if (vdom.tag === "Grafted") {
      const $0 = runGraft(vdom._1);
      return patchElem(state, $0);
    }
    if (vdom.tag === "Elem" && eqElemSpec(state.ns, state.name, vdom._1, vdom._2)) {
      if (state.children.length === 0 && vdom._4.length === 0) {
        const attrs22 = step(state.attrs, vdom._3);
        return $Step$p(
          state.node,
          { build: state.build, node: state.node, attrs: attrs22, ns: vdom._1, name: vdom._2, children: state.children },
          patchElem,
          haltElem
        );
      }
      const children2 = diffWithIxE(
        state.children,
        vdom._4,
        (ix, s, v2) => {
          const res = step(s, v2);
          insertChildIx(ix, res._1, state.node);
          return res;
        },
        (v2, s) => halt(s),
        (ix, v2) => {
          const res = state.build(v2);
          insertChildIx(ix, res._1, state.node);
          return res;
        }
      );
      const attrs2 = step(state.attrs, vdom._3);
      return $Step$p(state.node, { build: state.build, node: state.node, attrs: attrs2, ns: vdom._1, name: vdom._2, children: children2 }, patchElem, haltElem);
    }
    haltElem(state);
    return state.build(vdom);
  };
  var patchKeyed = (state, vdom) => {
    if (vdom.tag === "Grafted") {
      const $0 = runGraft(vdom._1);
      return patchKeyed(state, $0);
    }
    if (vdom.tag === "Keyed" && eqElemSpec(state.ns, state.name, vdom._1, vdom._2)) {
      const v = vdom._4.length;
      if (state.length === 0 && v === 0) {
        const attrs22 = step(state.attrs, vdom._3);
        return $Step$p(
          state.node,
          { build: state.build, node: state.node, attrs: attrs22, ns: vdom._1, name: vdom._2, children: state.children, length: 0 },
          patchKeyed,
          haltKeyed
        );
      }
      const children2 = diffWithKeyAndIxE(
        state.children,
        vdom._4,
        fst,
        (v2, ix$p, s, v3) => {
          const $0 = v3._2;
          const res = step(s, $0);
          insertChildIx(ix$p, res._1, state.node);
          return res;
        },
        (v2, s) => halt(s),
        (v2, ix, v3) => {
          const $0 = v3._2;
          const res = state.build($0);
          insertChildIx(ix, res._1, state.node);
          return res;
        }
      );
      const attrs2 = step(state.attrs, vdom._3);
      return $Step$p(
        state.node,
        { build: state.build, node: state.node, attrs: attrs2, ns: vdom._1, name: vdom._2, children: children2, length: v },
        patchKeyed,
        haltKeyed
      );
    }
    haltKeyed(state);
    return state.build(vdom);
  };
  var buildWidget = (v, build, w) => {
    const res = v.buildWidget(v)(w);
    return $Step$p(res._1, { build, widget: res }, patchWidget, haltWidget);
  };
  var buildText = (v, build, s) => {
    const $0 = v.document;
    const node = createTextNode(s, $0);
    return $Step$p(node, { build, node, value: s }, patchText, haltText);
  };
  var buildKeyed = (v, build, ns1, name1, as1, ch1) => {
    const $0 = (() => {
      if (ns1.tag === "Nothing") {
        return nullImpl;
      }
      if (ns1.tag === "Just") {
        return notNull(ns1._1);
      }
      fail();
    })();
    const $1 = v.document;
    const el = createElement($0, name1, $1);
    const children2 = strMapWithIxE(
      ch1,
      fst,
      (v1, ix, v2) => {
        const $2 = v2._2;
        const res = build($2);
        insertChildIx(ix, res._1, el);
        return res;
      }
    );
    const attrs = v.buildAttributes(el)(as1);
    return $Step$p(el, { build, node: el, attrs, ns: ns1, name: name1, children: children2, length: ch1.length }, patchKeyed, haltKeyed);
  };
  var buildElem = (v, build, ns1, name1, as1, ch1) => {
    const $0 = (() => {
      if (ns1.tag === "Nothing") {
        return nullImpl;
      }
      if (ns1.tag === "Just") {
        return notNull(ns1._1);
      }
      fail();
    })();
    const $1 = v.document;
    const el = createElement($0, name1, $1);
    const children2 = forE2(
      ch1,
      (ix, child) => {
        const res = build(child);
        insertChildIx(ix, res._1, el);
        return res;
      }
    );
    const attrs = v.buildAttributes(el)(as1);
    return $Step$p(el, { build, node: el, attrs, ns: ns1, name: name1, children: children2 }, patchElem, haltElem);
  };
  var buildVDom = (spec) => {
    const build = (v) => {
      if (v.tag === "Text") {
        const $0 = v._1;
        return buildText(spec, build, $0);
      }
      if (v.tag === "Elem") {
        const $0 = v._3;
        const $1 = v._4;
        const $2 = v._2;
        const $3 = v._1;
        return buildElem(spec, build, $3, $2, $0, $1);
      }
      if (v.tag === "Keyed") {
        const $0 = v._3;
        const $1 = v._4;
        const $2 = v._2;
        const $3 = v._1;
        return buildKeyed(spec, build, $3, $2, $0, $1);
      }
      if (v.tag === "Widget") {
        const $0 = v._1;
        return buildWidget(spec, build, $0);
      }
      if (v.tag === "Grafted") {
        const $0 = runGraft(v._1);
        return build($0);
      }
      fail();
    };
    return build;
  };

  // output-es/Halogen.VDom.Thunk/index.js
  var $Thunk = (_1, _2, _3, _4) => ({ tag: "Thunk", _1, _2, _3, _4 });
  var unsafeEqThunk = (v, $0) => refEq2(v._1, $0._1) && refEq2(v._2, $0._2) && v._2(v._4, $0._4);
  var thunk = (tid, eqFn, f, a) => $Thunk(tid, eqFn, f, a);
  var thunk1 = (f, a) => thunk(f, refEq2, f, a);
  var buildThunk = (toVDom) => {
    const patchThunk = (state, t2) => {
      if (unsafeEqThunk(state.thunk, t2)) {
        const $02 = $Step$p(
          state.vdom._1,
          state,
          patchThunk,
          (state$1) => {
            const $03 = state$1.vdom;
            return halt($03);
          }
        );
        return $02;
      }
      const $0 = toVDom(t2._3(t2._4));
      const vdom = step(state.vdom, $0);
      return $Step$p(
        vdom._1,
        { vdom, thunk: t2 },
        patchThunk,
        (state$1) => {
          const $1 = state$1.vdom;
          return halt($1);
        }
      );
    };
    return (spec) => (t) => {
      const $0 = toVDom(t._3(t._4));
      const vdom = buildVDom(spec)($0);
      return $Step$p(
        vdom._1,
        { thunk: t, vdom },
        patchThunk,
        (state) => {
          const $1 = state.vdom;
          return halt($1);
        }
      );
    };
  };

  // output-es/Halogen.Component/index.js
  var $ComponentSlot = (tag, _1) => ({ tag, _1 });
  var traverse_2 = /* @__PURE__ */ traverse_(freeApplicative)(foldableMaybe);
  var mkEval = (args) => (v) => {
    if (v.tag === "Initialize") {
      const $0 = traverse_2(args.handleAction)(args.initialize);
      return $Free(
        $0._1,
        (() => {
          if ($0._2.tag === "CatNil") {
            return $CatList(
              "CatCons",
              (x) => $Free($FreeView("Return", v._1), CatNil),
              $CatQueue(Nil, Nil)
            );
          }
          if ($0._2.tag === "CatCons") {
            return $CatList(
              "CatCons",
              $0._2._1,
              $CatQueue(
                $0._2._2._1,
                $List(
                  "Cons",
                  $CatList(
                    "CatCons",
                    (x) => $Free($FreeView("Return", v._1), CatNil),
                    $CatQueue(Nil, Nil)
                  ),
                  $0._2._2._2
                )
              )
            );
          }
          fail();
        })()
      );
    }
    if (v.tag === "Finalize") {
      const $0 = traverse_2(args.handleAction)(args.finalize);
      return $Free(
        $0._1,
        (() => {
          if ($0._2.tag === "CatNil") {
            return $CatList(
              "CatCons",
              (x) => $Free($FreeView("Return", v._1), CatNil),
              $CatQueue(Nil, Nil)
            );
          }
          if ($0._2.tag === "CatCons") {
            return $CatList(
              "CatCons",
              $0._2._1,
              $CatQueue(
                $0._2._2._1,
                $List(
                  "Cons",
                  $CatList(
                    "CatCons",
                    (x) => $Free($FreeView("Return", v._1), CatNil),
                    $CatQueue(Nil, Nil)
                  ),
                  $0._2._2._2
                )
              )
            );
          }
          fail();
        })()
      );
    }
    if (v.tag === "Receive") {
      const $0 = traverse_2(args.handleAction)(args.receive(v._1));
      return $Free(
        $0._1,
        (() => {
          if ($0._2.tag === "CatNil") {
            return $CatList(
              "CatCons",
              (x) => $Free($FreeView("Return", v._2), CatNil),
              $CatQueue(Nil, Nil)
            );
          }
          if ($0._2.tag === "CatCons") {
            return $CatList(
              "CatCons",
              $0._2._1,
              $CatQueue(
                $0._2._2._1,
                $List(
                  "Cons",
                  $CatList(
                    "CatCons",
                    (x) => $Free($FreeView("Return", v._2), CatNil),
                    $CatQueue(Nil, Nil)
                  ),
                  $0._2._2._2
                )
              )
            );
          }
          fail();
        })()
      );
    }
    if (v.tag === "Action") {
      const $0 = args.handleAction(v._1);
      return $Free(
        $0._1,
        (() => {
          if ($0._2.tag === "CatNil") {
            return $CatList(
              "CatCons",
              (x) => $Free($FreeView("Return", v._2), CatNil),
              $CatQueue(Nil, Nil)
            );
          }
          if ($0._2.tag === "CatCons") {
            return $CatList(
              "CatCons",
              $0._2._1,
              $CatQueue(
                $0._2._2._1,
                $List(
                  "Cons",
                  $CatList(
                    "CatCons",
                    (x) => $Free($FreeView("Return", v._2), CatNil),
                    $CatQueue(Nil, Nil)
                  ),
                  $0._2._2._2
                )
              )
            );
          }
          fail();
        })()
      );
    }
    if (v.tag === "Query") {
      const $0 = v._2();
      const $1 = args.handleQuery(v._1._2);
      return $Free(
        $1._1,
        (() => {
          if ($1._2.tag === "CatNil") {
            return $CatList(
              "CatCons",
              (x) => $Free(
                $FreeView(
                  "Return",
                  (() => {
                    if (x.tag === "Nothing") {
                      return $0;
                    }
                    if (x.tag === "Just") {
                      return v._1._1(x._1);
                    }
                    fail();
                  })()
                ),
                CatNil
              ),
              $CatQueue(Nil, Nil)
            );
          }
          if ($1._2.tag === "CatCons") {
            return $CatList(
              "CatCons",
              $1._2._1,
              $CatQueue(
                $1._2._2._1,
                $List(
                  "Cons",
                  $CatList(
                    "CatCons",
                    (x) => $Free(
                      $FreeView(
                        "Return",
                        (() => {
                          if (x.tag === "Nothing") {
                            return $0;
                          }
                          if (x.tag === "Just") {
                            return v._1._1(x._1);
                          }
                          fail();
                        })()
                      ),
                      CatNil
                    ),
                    $CatQueue(Nil, Nil)
                  ),
                  $1._2._2._2
                )
              )
            );
          }
          fail();
        })()
      );
    }
    fail();
  };
  var defaultEval = {
    handleAction: (v) => $Free($FreeView("Return", void 0), CatNil),
    handleQuery: (v) => $Free($FreeView("Return", Nothing), CatNil),
    receive: (v) => Nothing,
    initialize: Nothing,
    finalize: Nothing
  };

  // output-es/Halogen.HTML/index.js
  var lazy = (f) => (a) => $VDom("Widget", $ComponentSlot("ThunkSlot", thunk1(f, a)));

  // output-es/Halogen.HTML.Properties/index.js
  var id = /* @__PURE__ */ Property("id");
  var class_ = /* @__PURE__ */ Property("className");

  // output-es/Effect.Console/foreign.js
  var warn = function(s) {
    return function() {
      console.warn(s);
    };
  };

  // output-es/Data.Coyoneda/index.js
  var $CoyonedaF = (_1, _2) => ({ tag: "CoyonedaF", _1, _2 });

  // output-es/Effect.Ref/foreign.js
  var modifyImpl2 = function(f) {
    return function(ref) {
      return function() {
        var t = f(ref.value);
        ref.value = t.state;
        return t.value;
      };
    };
  };

  // output-es/Halogen.Query.HalogenQ/index.js
  var $HalogenQ = (tag, _1, _2) => ({ tag, _1, _2 });

  // output-es/Unsafe.Reference/foreign.js
  function reallyUnsafeRefEq(a) {
    return function(b) {
      return a === b;
    };
  }

  // output-es/Halogen.Subscription/index.js
  var traverse_3 = /* @__PURE__ */ traverse_(applicativeEffect);
  var traverse_1 = /* @__PURE__ */ traverse_3(foldableArray);
  var unsubscribe = (v) => v;
  var create = () => {
    let subscribers = [];
    return {
      emitter: (k) => () => {
        const $0 = subscribers;
        subscribers = [...$0, k];
        return () => {
          const $1 = subscribers;
          subscribers = deleteBy(reallyUnsafeRefEq)(k)($1);
        };
      },
      listener: (a) => {
        const $0 = traverse_1((k) => k(a));
        return () => {
          const $1 = subscribers;
          return $0($1)();
        };
      }
    };
  };

  // output-es/Halogen.Aff.Driver.Eval/index.js
  var traverse_4 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var lookup2 = (k) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Leaf") {
          go$c = false;
          go$r = Nothing;
          continue;
        }
        if (v.tag === "Node") {
          const v1 = ordInt.compare(k)(v._3);
          if (v1 === "LT") {
            go$a0 = v._5;
            continue;
          }
          if (v1 === "GT") {
            go$a0 = v._6;
            continue;
          }
          if (v1 === "EQ") {
            go$c = false;
            go$r = $Maybe("Just", v._4);
            continue;
          }
        }
        fail();
      }
      return go$r;
    };
    return go;
  };
  var traverse_12 = /* @__PURE__ */ traverse_(applicativeAff);
  var traverse_22 = /* @__PURE__ */ traverse_12(foldableList);
  var parSequence_ = /* @__PURE__ */ parTraverse_(parallelAff)(applicativeParAff)(foldableList)(identity5);
  var traverse_32 = /* @__PURE__ */ traverse_12(foldableMaybe);
  var lookup1 = (k) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Leaf") {
          go$c = false;
          go$r = Nothing;
          continue;
        }
        if (v.tag === "Node") {
          const v1 = ordInt.compare(k)(v._3);
          if (v1 === "LT") {
            go$a0 = v._5;
            continue;
          }
          if (v1 === "GT") {
            go$a0 = v._6;
            continue;
          }
          if (v1 === "EQ") {
            go$c = false;
            go$r = $Maybe("Just", v._4);
            continue;
          }
        }
        fail();
      }
      return go$r;
    };
    return go;
  };
  var lookup22 = (k) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Leaf") {
          go$c = false;
          go$r = Nothing;
          continue;
        }
        if (v.tag === "Node") {
          const v1 = ordString.compare(k)(v._3);
          if (v1 === "LT") {
            go$a0 = v._5;
            continue;
          }
          if (v1 === "GT") {
            go$a0 = v._6;
            continue;
          }
          if (v1 === "EQ") {
            go$c = false;
            go$r = $Maybe("Just", v._4);
            continue;
          }
        }
        fail();
      }
      return go$r;
    };
    return go;
  };
  var foldFree2 = /* @__PURE__ */ foldFree(monadRecAff);
  var alter2 = /* @__PURE__ */ alter(ordString);
  var unsubscribe2 = (sid) => (ref) => () => {
    const v = ref.value;
    const subs = v.subscriptions.value;
    return traverse_4(unsubscribe)((() => {
      const $0 = lookup2(sid);
      if (subs.tag === "Just") {
        return $0(subs._1);
      }
      if (subs.tag === "Nothing") {
        return Nothing;
      }
      fail();
    })())();
  };
  var queueOrRun = (ref) => (au) => _bind(_liftEffect(() => ref.value))((v) => {
    if (v.tag === "Nothing") {
      return au;
    }
    if (v.tag === "Just") {
      return _liftEffect(() => ref.value = $Maybe("Just", $List("Cons", au, v._1)));
    }
    fail();
  });
  var handleLifecycle = (lchs) => (f) => _bind(_liftEffect(() => lchs.value = { initializers: Nil, finalizers: Nil }))(() => _bind(_liftEffect(f))((result) => _bind(_liftEffect(() => lchs.value))((v) => {
    const $0 = v.initializers;
    return _bind(traverse_22(forkAff)(v.finalizers))(() => _bind(parSequence_($0))(() => _pure(result)));
  })));
  var handleAff = /* @__PURE__ */ runAff_((v2) => {
    if (v2.tag === "Left") {
      return throwException(v2._1);
    }
    if (v2.tag === "Right") {
      return () => {
      };
    }
    fail();
  });
  var fresh = (f) => (ref) => _bind(_liftEffect(() => ref.value))((v) => _liftEffect(modifyImpl2((i) => ({ state: i + 1 | 0, value: f(i) }))(v.fresh)));
  var evalQ = (render) => (ref) => (q) => _bind(_liftEffect(() => ref.value))((v) => evalM(render)(ref)(v.component.eval($HalogenQ(
    "Query",
    $CoyonedaF((x) => $Maybe("Just", x), q),
    (v$1) => Nothing
  ))));
  var evalM = (render) => (initRef) => (v) => foldFree2((v1) => {
    if (v1.tag === "State") {
      return _bind(_liftEffect(() => initRef.value))((v2) => {
        const v3 = v1._1(v2.state);
        if (reallyUnsafeRefEq(v2.state)(v3._2)) {
          return _pure(v3._1);
        }
        const $0 = v3._1;
        return _bind(_liftEffect((() => {
          const $1 = { ...v2, state: v3._2 };
          return () => initRef.value = $1;
        })()))(() => _bind(handleLifecycle(v2.lifecycleHandlers)(render(v2.lifecycleHandlers)(initRef)))(() => _pure($0)));
      });
    }
    if (v1.tag === "Subscribe") {
      return _bind(fresh(SubscriptionId)(initRef))((sid) => _bind(_liftEffect(v1._1(sid)((x) => {
        const $0 = handleAff(evalF(render)(initRef)($Input("Action", x)));
        return () => {
          $0();
        };
      })))((finalize) => _bind(_liftEffect(() => initRef.value))((v2) => _bind(_liftEffect((() => {
        const $0 = insert(ordInt)(sid)(finalize);
        const $1 = v2.subscriptions;
        return () => {
          const $2 = $1.value;
          $1.value = $2.tag === "Just" ? $Maybe("Just", $0($2._1)) : Nothing;
        };
      })()))(() => _pure(v1._2(sid))))));
    }
    if (v1.tag === "Unsubscribe") {
      const $0 = v1._2;
      return _bind(_liftEffect(unsubscribe2(v1._1)(initRef)))(() => _pure($0));
    }
    if (v1.tag === "Lift") {
      return v1._1;
    }
    if (v1.tag === "ChildQuery") {
      const $0 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v1$1) => {
        const $1 = $0._2;
        return _map($0._3)(_sequential($0._1(applicativeParAff)((v3) => _bind(_liftEffect(() => v3.value))((dsx) => evalQ(render)(dsx.selfRef)($1)))(v1$1.children)));
      });
    }
    if (v1.tag === "Raise") {
      const $0 = v1._2;
      const $1 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v2) => {
        const $2 = v2.handlerRef;
        const $3 = v2.pendingOuts;
        return _bind(_liftEffect(() => $2.value))((handler) => _bind(queueOrRun($3)(handler($1)))(() => _pure($0)));
      });
    }
    if (v1.tag === "Par") {
      return _sequential(foldFreeAp(applicativeParAff)(identity7)((() => {
        const $0 = evalM(render)(initRef);
        return foldFreeAp(applicativeFreeAp)((x) => $FreeAp("Lift", $0(x)))(v1._1);
      })()));
    }
    if (v1.tag === "Fork") {
      const $0 = v1._1;
      return _bind(fresh(ForkId)(initRef))((fid) => _bind(_liftEffect(() => initRef.value))((v2) => {
        const $1 = v2.forks;
        return _bind(_liftEffect(() => ({ value: false })))((doneRef) => _bind(forkAff($$finally(_liftEffect((() => {
          const $2 = $$delete(ordInt)(fid);
          return () => {
            const $3 = $1.value;
            $1.value = $2($3);
            return doneRef.value = true;
          };
        })()))(evalM(render)(initRef)($0))))((fiber) => _bind(_liftEffect((() => {
          const $2 = insert(ordInt)(fid)(fiber);
          return () => {
            const b = doneRef.value;
            if (!b) {
              const $3 = $1.value;
              $1.value = $2($3);
              return;
            }
            if (b) {
              return;
            }
            fail();
          };
        })()))(() => _pure(v1._2(fid)))));
      }));
    }
    if (v1.tag === "Join") {
      const $0 = v1._2;
      const $1 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v2) => {
        const $2 = v2.forks;
        return _bind(_liftEffect(() => $2.value))((forkMap) => _bind(traverse_32(joinFiber)(lookup1($1)(forkMap)))(() => _pure($0)));
      });
    }
    if (v1.tag === "Kill") {
      const $0 = v1._2;
      const $1 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v2) => {
        const $2 = v2.forks;
        return _bind(_liftEffect(() => $2.value))((forkMap) => _bind(traverse_32(killFiber(error("Cancelled")))(lookup1($1)(forkMap)))(() => _pure($0)));
      });
    }
    if (v1.tag === "GetRef") {
      const $0 = v1._1;
      return _bind(_liftEffect(() => initRef.value))((v2) => _pure(v1._2(lookup22($0)(v2.refs))));
    }
    fail();
  })(v);
  var evalF = (render) => (ref) => (v) => {
    if (v.tag === "RefUpdate") {
      const $0 = v._2;
      const $1 = v._1;
      return _liftEffect(() => {
        const $2 = ref.value;
        ref.value = { ...$2, refs: alter2((v$1) => $0)($1)($2.refs) };
      });
    }
    if (v.tag === "Action") {
      const $0 = v._1;
      return _bind(_liftEffect(() => ref.value))((v1) => evalM(render)(ref)(v1.component.eval($HalogenQ("Action", $0, void 0))));
    }
    fail();
  };

  // output-es/Halogen.Aff.Driver/index.js
  var for_2 = /* @__PURE__ */ for_(applicativeEffect)(foldableMaybe);
  var traverse_5 = /* @__PURE__ */ traverse_(applicativeAff)(foldableList);
  var traverse_13 = /* @__PURE__ */ traverse_(applicativeEffect);
  var traverse_23 = /* @__PURE__ */ traverse_13(foldableMaybe);
  var traverse_33 = /* @__PURE__ */ traverse_13(foldableMap);
  var parSequence_2 = /* @__PURE__ */ parTraverse_(parallelAff)(applicativeParAff)(foldableList)(identity5);
  var foreachSlot2 = /* @__PURE__ */ foreachSlot(applicativeEffect);
  var renderStateX_ = /* @__PURE__ */ (() => {
    const traverse_$1 = traverse_(applicativeEffect)(foldableMaybe);
    return (f) => (st) => traverse_$1(f)(st.rendering);
  })();
  var newLifecycleHandlers = () => ({ value: { initializers: Nil, finalizers: Nil } });
  var handlePending = (ref) => () => {
    const queue = ref.value;
    ref.value = Nothing;
    return for_2(queue)((() => {
      const $0 = traverse_5(forkAff);
      return (x) => handleAff($0((() => {
        const go = (go$a0$copy) => (go$a1$copy) => {
          let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
          while (go$c) {
            const v = go$a0, v1 = go$a1;
            if (v1.tag === "Nil") {
              go$c = false;
              go$r = v;
              continue;
            }
            if (v1.tag === "Cons") {
              go$a0 = $List("Cons", v1._1, v);
              go$a1 = v1._2;
              continue;
            }
            fail();
          }
          return go$r;
        };
        return go(Nil)(x);
      })()));
    })())();
  };
  var cleanupSubscriptionsAndForks = (v) => {
    const $0 = traverse_23(traverse_33(unsubscribe));
    const $1 = v.subscriptions;
    return () => {
      const $2 = $1.value;
      $0($2)();
      v.subscriptions.value = Nothing;
      const $3 = v.forks.value;
      traverse_33((() => {
        const $4 = killFiber(error("finalized"));
        return (x) => handleAff($4(x));
      })())($3)();
      return v.forks.value = Leaf;
    };
  };
  var runUI = (renderSpec2) => (component) => (i) => {
    const squashChildInitializers = (lchs) => (preInits) => (st) => {
      const parentInitializer = evalM(render)(st.selfRef)(st.component.eval($HalogenQ("Initialize", void 0)));
      return () => {
        const $0 = lchs.value;
        lchs.value = {
          initializers: $List(
            "Cons",
            _bind(parSequence_2((() => {
              const go = (go$a0$copy) => (go$a1$copy) => {
                let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
                while (go$c) {
                  const v = go$a0, v1 = go$a1;
                  if (v1.tag === "Nil") {
                    go$c = false;
                    go$r = v;
                    continue;
                  }
                  if (v1.tag === "Cons") {
                    go$a0 = $List("Cons", v1._1, v);
                    go$a1 = v1._2;
                    continue;
                  }
                  fail();
                }
                return go$r;
              };
              return go(Nil)($0.initializers);
            })()))(() => _bind(parentInitializer)(() => _liftEffect((() => {
              const $1 = handlePending(st.pendingQueries);
              return () => {
                $1();
                return handlePending(st.pendingOuts)();
              };
            })()))),
            preInits
          ),
          finalizers: $0.finalizers
        };
      };
    };
    const runComponent = (lchs) => (handler) => (j) => (c) => () => {
      const lchs$p = newLifecycleHandlers();
      const selfRef = { value: {} };
      const childrenIn = { value: Leaf };
      const childrenOut = { value: Leaf };
      const handlerRef = { value: handler };
      const pendingQueries = { value: $Maybe("Just", Nil) };
      const pendingOuts = { value: $Maybe("Just", Nil) };
      const pendingHandlers = { value: Nothing };
      const fresh2 = { value: 1 };
      const subscriptions = { value: $Maybe("Just", Leaf) };
      const forks = { value: Leaf };
      selfRef.value = {
        component: c,
        state: c.initialState(j),
        refs: Leaf,
        children: Leaf,
        childrenIn,
        childrenOut,
        selfRef,
        handlerRef,
        pendingQueries,
        pendingOuts,
        pendingHandlers,
        rendering: Nothing,
        fresh: fresh2,
        subscriptions,
        forks,
        lifecycleHandlers: lchs$p
      };
      const pre = lchs.value;
      lchs.value = { initializers: Nil, finalizers: pre.finalizers };
      const $0 = selfRef.value;
      render(lchs)($0.selfRef)();
      const $1 = selfRef.value;
      squashChildInitializers(lchs)(pre.initializers)($1)();
      return selfRef;
    };
    const renderChild = (lchs) => (handler) => (childrenInRef) => (childrenOutRef) => (slot) => () => {
      const a$p = childrenInRef.value;
      const childrenIn = slot.pop(a$p);
      const $$var = (() => {
        if (childrenIn.tag === "Just") {
          childrenInRef.value = childrenIn._1._2;
          const dsx = childrenIn._1._1.value;
          const $02 = _pure();
          dsx.handlerRef.value = (x) => {
            const $12 = slot.output(x);
            if ($12.tag === "Nothing") {
              return $02;
            }
            if ($12.tag === "Just") {
              return handler($12._1);
            }
            fail();
          };
          handleAff(evalM(render)(dsx.selfRef)(dsx.component.eval($HalogenQ(
            "Receive",
            slot.input,
            void 0
          ))))();
          return childrenIn._1._1;
        }
        if (childrenIn.tag === "Nothing") {
          return runComponent(lchs)((() => {
            const $02 = _pure();
            return (x) => {
              const $12 = slot.output(x);
              if ($12.tag === "Nothing") {
                return $02;
              }
              if ($12.tag === "Just") {
                return handler($12._1);
              }
              fail();
            };
          })())(slot.input)(slot.component)();
        }
        fail();
      })();
      const a$p$1 = childrenOutRef.value;
      const $0 = warn("Halogen: Duplicate slot address was detected during rendering, unexpected results may occur");
      if ((() => {
        const $12 = slot.get(a$p$1);
        if ($12.tag === "Nothing") {
          return false;
        }
        if ($12.tag === "Just") {
          return true;
        }
        fail();
      })()) {
        $0();
      }
      const $1 = childrenOutRef.value;
      childrenOutRef.value = slot.set($$var)($1);
      const $2 = $$var.value;
      if ($2.rendering.tag === "Nothing") {
        return throwException(error("Halogen internal error: child was not initialized in renderChild"))();
      }
      if ($2.rendering.tag === "Just") {
        return renderSpec2.renderChild($2.rendering._1);
      }
      fail();
    };
    const render = (lchs) => ($$var) => () => {
      const v = $$var.value;
      const a$p = v.pendingHandlers.value;
      const shouldProcessHandlers = (() => {
        if (a$p.tag === "Nothing") {
          return true;
        }
        if (a$p.tag === "Just") {
          return false;
        }
        fail();
      })();
      if (shouldProcessHandlers) {
        v.pendingHandlers.value = $Maybe("Just", Nil);
      }
      v.childrenOut.value = Leaf;
      v.childrenIn.value = v.children;
      const $0 = v.pendingHandlers;
      const rendering = renderSpec2.render((() => {
        const $12 = _map((v$1) => {
        });
        return (x) => handleAff(queueOrRun($0)($12(evalF(render)(v.selfRef)(x))));
      })())(renderChild(lchs)((() => {
        const $12 = _map((v$1) => {
        });
        return (x) => queueOrRun(v.pendingQueries)(queueOrRun($0)($12(evalF(render)(v.selfRef)($Input(
          "Action",
          x
        )))));
      })())(v.childrenIn)(v.childrenOut))(v.component.render(v.state))(v.rendering)();
      const children2 = v.childrenOut.value;
      const childrenIn = v.childrenIn.value;
      foreachSlot2(childrenIn)((v1) => () => {
        const childDS = v1.value;
        renderStateX_(renderSpec2.removeChild)(childDS)();
        return finalize(lchs)(childDS)();
      })();
      const $1 = v.selfRef.value;
      v.selfRef.value = { ...$1, rendering: $Maybe("Just", rendering), children: children2 };
      const $2 = monadRecEffect.tailRecM((v1) => () => {
        const handlers = $0.value;
        $0.value = $Maybe("Just", Nil);
        traverse_23((() => {
          const $22 = traverse_5(forkAff);
          return (x) => handleAff($22((() => {
            const go = (go$a0$copy) => (go$a1$copy) => {
              let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
              while (go$c) {
                const v$1 = go$a0, v1$1 = go$a1;
                if (v1$1.tag === "Nil") {
                  go$c = false;
                  go$r = v$1;
                  continue;
                }
                if (v1$1.tag === "Cons") {
                  go$a0 = $List("Cons", v1$1._1, v$1);
                  go$a1 = v1$1._2;
                  continue;
                }
                fail();
              }
              return go$r;
            };
            return go(Nil)(x);
          })()));
        })())(handlers)();
        const mmore = $0.value;
        if ((() => {
          if (mmore.tag === "Nothing") {
            return false;
          }
          if (mmore.tag === "Just") {
            return mmore._1.tag === "Nil";
          }
          fail();
        })()) {
          $0.value = Nothing;
          return $Step("Done", void 0);
        }
        return $Step("Loop", void 0);
      })();
      if (shouldProcessHandlers) {
        return $2();
      }
    };
    const finalize = (lchs) => (st) => {
      const $0 = cleanupSubscriptionsAndForks(st);
      return () => {
        $0();
        const $1 = lchs.value;
        lchs.value = {
          initializers: $1.initializers,
          finalizers: $List(
            "Cons",
            evalM(render)(st.selfRef)(st.component.eval($HalogenQ("Finalize", void 0))),
            $1.finalizers
          )
        };
        return foreachSlot2(st.children)((v) => () => {
          const dsx = v.value;
          return finalize(lchs)(dsx)();
        })();
      };
    };
    return _bind(_liftEffect(newLifecycleHandlers))((lchs) => _bind(_liftEffect(() => ({ value: false })))((disposed) => handleLifecycle(lchs)(() => {
      const sio = create();
      const $0 = runComponent(lchs)((x) => _liftEffect(sio.listener(x)))(i)(component)();
      const dsx = $0.value;
      return {
        query: (() => {
          const $1 = dsx.selfRef;
          return (q) => _bind(_liftEffect(() => disposed.value))((v) => {
            if (v) {
              return _pure(Nothing);
            }
            return evalQ(render)($1)(q);
          });
        })(),
        messages: sio.emitter,
        dispose: handleLifecycle(lchs)(() => {
          const v = disposed.value;
          if (v) {
            return;
          }
          disposed.value = true;
          finalize(lchs)(dsx)();
          const v2 = dsx.selfRef.value;
          return for_2(v2.rendering)(renderSpec2.dispose)();
        })
      };
    })));
  };

  // output-es/Web.DOM.Node/foreign.js
  var getEffProp2 = function(name2) {
    return function(node) {
      return function() {
        return node[name2];
      };
    };
  };
  var baseURI = getEffProp2("baseURI");
  var _ownerDocument = getEffProp2("ownerDocument");
  var _parentNode = getEffProp2("parentNode");
  var _parentElement = getEffProp2("parentElement");
  var childNodes = getEffProp2("childNodes");
  var _firstChild = getEffProp2("firstChild");
  var _lastChild = getEffProp2("lastChild");
  var _previousSibling = getEffProp2("previousSibling");
  var _nextSibling = getEffProp2("nextSibling");
  var _nodeValue = getEffProp2("nodeValue");
  var textContent = getEffProp2("textContent");
  function insertBefore(node1) {
    return function(node2) {
      return function(parent2) {
        return function() {
          parent2.insertBefore(node1, node2);
        };
      };
    };
  }
  function appendChild(node) {
    return function(parent2) {
      return function() {
        parent2.appendChild(node);
      };
    };
  }
  function removeChild2(node) {
    return function(parent2) {
      return function() {
        parent2.removeChild(node);
      };
    };
  }

  // output-es/Halogen.VDom.Driver/index.js
  var traverse_6 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var identity8 = (x) => x;
  var substInParent = (v) => (v1) => (v2) => {
    if (v2.tag === "Just") {
      if (v1.tag === "Just") {
        const $0 = insertBefore(v)(v1._1)(v2._1);
        return () => {
          $0();
        };
      }
      if (v1.tag === "Nothing") {
        const $0 = appendChild(v)(v2._1);
        return () => {
          $0();
        };
      }
    }
    return () => {
    };
  };
  var removeChild3 = (v) => {
    const $0 = v.node;
    const $1 = _parentNode($0);
    return () => {
      const a$p = $1();
      return traverse_6((pn) => removeChild2($0)(pn))(nullable(a$p, Nothing, Just))();
    };
  };
  var mkSpec = (handler) => (renderChildRef) => (document2) => ({
    buildWidget: (spec) => {
      const buildThunk2 = buildThunk(unsafeCoerce)(spec);
      const renderComponentSlot = (cs) => {
        const renderChild = renderChildRef.value;
        const rsx = renderChild(cs)();
        return $Step$p(
          rsx.node,
          Nothing,
          patch,
          (st) => {
            if (st.tag === "Just") {
              const $0 = st._1;
              return halt($0);
            }
          }
        );
      };
      const render = (slot) => {
        if (slot.tag === "ComponentSlot") {
          const $0 = slot._1;
          return renderComponentSlot($0);
        }
        if (slot.tag === "ThunkSlot") {
          const $0 = slot._1;
          const step2 = buildThunk2($0);
          return $Step$p(
            step2._1,
            $Maybe("Just", step2),
            patch,
            (st) => {
              if (st.tag === "Just") {
                const $1 = st._1;
                return halt($1);
              }
            }
          );
        }
        fail();
      };
      const patch = (st, slot) => {
        if (st.tag === "Just") {
          if (slot.tag === "ComponentSlot") {
            const $0 = slot._1;
            halt(st._1);
            return renderComponentSlot($0);
          }
          if (slot.tag === "ThunkSlot") {
            const $0 = slot._1;
            const step$p = step(st._1, $0);
            return $Step$p(
              step$p._1,
              $Maybe("Just", step$p),
              patch,
              (st$1) => {
                if (st$1.tag === "Just") {
                  const $1 = st$1._1;
                  return halt($1);
                }
              }
            );
          }
          fail();
        }
        return render(slot);
      };
      return render;
    },
    buildAttributes: buildProp(handler),
    document: document2
  });
  var renderSpec = (document2) => (container) => ({
    render: (handler) => (child) => (v) => (v1) => {
      if (v1.tag === "Nothing") {
        return () => {
          const renderChildRef = { value: child };
          const machine = buildVDom(mkSpec(handler)(renderChildRef)(document2))(v);
          appendChild(machine._1)(container)();
          return { machine, node: machine._1, renderChildRef };
        };
      }
      if (v1.tag === "Just") {
        const $0 = v1._1.machine;
        const $1 = v1._1.node;
        const $2 = v1._1.renderChildRef;
        return () => {
          $2.value = child;
          const a$p = _parentNode($1)();
          const a$p$1 = _nextSibling($1)();
          const machine$p = step($0, v);
          const $3 = substInParent(machine$p._1)(nullable(a$p$1, Nothing, Just))(nullable(
            a$p,
            Nothing,
            Just
          ));
          if (!reallyUnsafeRefEq($1)(machine$p._1)) {
            $3();
          }
          return { machine: machine$p, node: machine$p._1, renderChildRef: $2 };
        };
      }
      fail();
    },
    renderChild: identity8,
    removeChild: removeChild3,
    dispose: removeChild3
  });
  var runUI2 = (component) => (i) => (element) => _bind(_liftEffect(() => {
    const $0 = windowImpl();
    return document($0)();
  }))((document2) => runUI(renderSpec(document2)(element))(component)(i));

  // output-es/Main/foreign.js
  function _random(max2) {
    return Math.round(Math.random() * 1e3) % max2;
  }
  var createRandomNRowsImpl = function(adjectives2, colours2, nouns2, count, lastId) {
    var data = [];
    for (var i = 0; i < count; i++)
      data.push({
        id: ++lastId,
        label: adjectives2[_random(adjectives2.length)] + " " + colours2[_random(colours2.length)] + " " + nouns2[_random(nouns2.length)]
      });
    return data;
  };

  // output-es/Main/index.js
  var $Action = (tag, _1) => ({ tag, _1 });
  var type_ = /* @__PURE__ */ (() => {
    const $0 = Property("type");
    return (x) => $0((() => {
      if (x === "ButtonButton") {
        return "button";
      }
      if (x === "ButtonSubmit") {
        return "submit";
      }
      if (x === "ButtonReset") {
        return "reset";
      }
      fail();
    })());
  })();
  var $$get = /* @__PURE__ */ $Free(
    /* @__PURE__ */ $FreeView(
      "Bind",
      /* @__PURE__ */ $HalogenF("State", (s) => $Tuple(s, s)),
      (x) => $Free($FreeView("Return", x), CatNil)
    ),
    CatNil
  );
  var liftEffect = /* @__PURE__ */ (() => monadEffectHalogenM(monadEffectAff).liftEffect)();
  var AppendOneThousand = /* @__PURE__ */ $Action("AppendOneThousand");
  var UpdateEveryTenth = /* @__PURE__ */ $Action("UpdateEveryTenth");
  var Clear = /* @__PURE__ */ $Action("Clear");
  var Swap = /* @__PURE__ */ $Action("Swap");
  var swapRows = (arr) => (index1) => (index2) => {
    if (index1 >= 0 && index1 < arr.length) {
      const $0 = arr[index1];
      if (index2 >= 0 && index2 < arr.length) {
        const $1 = _updateAt(Just, Nothing, index1, arr[index2], arr);
        if ($1.tag === "Just") {
          const $2 = _updateAt(Just, Nothing, index2, $0, $1._1);
          if ($2.tag === "Just") {
            return $Maybe("Just", $2._1);
          }
          if ($2.tag === "Nothing") {
            return Nothing;
          }
          fail();
        }
        if ($1.tag === "Nothing") {
          return Nothing;
        }
        fail();
      }
    }
    return Nothing;
  };
  var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
  var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
  var colMd1 = [/* @__PURE__ */ class_("col-md-1")];
  var colMd4 = [/* @__PURE__ */ class_("col-md-4")];
  var footer = /* @__PURE__ */ $VDom(
    "Elem",
    Nothing,
    "span",
    [
      /* @__PURE__ */ class_("preloadicon glyphicon glyphicon-remove"),
      /* @__PURE__ */ $Prop("Attribute", Nothing, "aria-hidden", "true")
    ],
    []
  );
  var removeIcon = [
    /* @__PURE__ */ $VDom(
      "Elem",
      Nothing,
      "span",
      [
        /* @__PURE__ */ class_("glyphicon glyphicon-remove"),
        /* @__PURE__ */ $Prop("Attribute", Nothing, "aria-hidden", "true")
      ],
      []
    )
  ];
  var renderActionButton = (v) => {
    const $0 = v.action;
    return $VDom(
      "Elem",
      Nothing,
      "div",
      [class_("col-sm-6 smallpad")],
      [
        $VDom(
          "Elem",
          Nothing,
          "button",
          [
            type_(ButtonButton),
            class_("btn btn-primary btn-block"),
            id(v.id),
            $Prop("Attribute", Nothing, "ref", "text"),
            $Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $0)))
          ],
          [$VDom("Text", v.label)]
        )
      ]
    );
  };
  var spacer = /* @__PURE__ */ $VDom("Elem", Nothing, "td", [/* @__PURE__ */ class_("col-md-6")], []);
  var renderRow = (selectedId) => (row) => $VDom(
    "Elem",
    Nothing,
    "tr",
    selectedId === row.id ? [class_("danger"), $Prop("Attribute", Nothing, "selected", "true")] : [],
    [
      $VDom("Elem", Nothing, "td", colMd1, [$VDom("Text", showIntImpl(row.id))]),
      $VDom(
        "Elem",
        Nothing,
        "td",
        colMd4,
        [
          $VDom(
            "Elem",
            Nothing,
            "a",
            [$Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $Action("Select", row.id))))],
            [$VDom("Text", row.label)]
          )
        ]
      ),
      $VDom(
        "Elem",
        Nothing,
        "td",
        colMd1,
        [
          $VDom(
            "Elem",
            Nothing,
            "a",
            [$Prop("Handler", "click", (ev) => $Maybe("Just", $Input("Action", $Action("Remove", row.id))))],
            removeIcon
          )
        ]
      ),
      spacer
    ]
  );
  var buttons = [
    { id: "run", label: "Create 1,000 rows", action: /* @__PURE__ */ $Action("Create", 1e3) },
    { id: "runlots", label: "Create 10,000 rows", action: /* @__PURE__ */ $Action("Create", 1e4) },
    { id: "add", label: "Append 1,000 rows", action: AppendOneThousand },
    { id: "update", label: "Update every 10th row", action: UpdateEveryTenth },
    { id: "clear", label: "Clear", action: Clear },
    { id: "swaprows", label: "Swap Rows", action: Swap }
  ];
  var jumbotron = /* @__PURE__ */ $VDom(
    "Elem",
    Nothing,
    "div",
    [/* @__PURE__ */ class_("jumbotron")],
    [
      /* @__PURE__ */ $VDom(
        "Elem",
        Nothing,
        "div",
        [/* @__PURE__ */ class_("row")],
        [
          /* @__PURE__ */ $VDom(
            "Elem",
            Nothing,
            "div",
            [/* @__PURE__ */ class_("col-md-6")],
            [/* @__PURE__ */ $VDom("Elem", Nothing, "h1", [], [/* @__PURE__ */ $VDom("Text", "Halogen 7.0.0 (non-keyed)")])]
          ),
          /* @__PURE__ */ $VDom(
            "Elem",
            Nothing,
            "div",
            [/* @__PURE__ */ class_("col-md-6")],
            /* @__PURE__ */ arrayMap(/* @__PURE__ */ lazy(renderActionButton))(buttons)
          )
        ]
      )
    ]
  );
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
  var app = {
    initialState: (v) => ({ rows: [], lastId: 0, selectedId: 0 }),
    render: (state) => $VDom(
      "Elem",
      Nothing,
      "div",
      [class_("container")],
      [
        jumbotron,
        $VDom(
          "Elem",
          Nothing,
          "table",
          [class_("table table-hover table-striped test-data")],
          [$VDom("Elem", Nothing, "tbody", [], arrayMap(renderRow(state.selectedId))(state.rows))]
        ),
        footer
      ]
    ),
    eval: /* @__PURE__ */ mkEval({
      ...defaultEval,
      handleAction: (v) => {
        if (v.tag === "Create") {
          const $0 = v._1;
          return $Free(
            $$get._1,
            $CatList(
              "CatCons",
              (state) => {
                const $1 = liftEffect((() => {
                  const $12 = state.lastId;
                  return () => createRandomNRowsImpl(adjectives, colours, nouns, $0, $12);
                })());
                const $2 = (newRows) => $Free(
                  $FreeView(
                    "Bind",
                    $HalogenF("State", (s) => $Tuple(void 0, { ...s, rows: newRows, lastId: state.lastId + $0 | 0 })),
                    (x) => $Free($FreeView("Return", x), CatNil)
                  ),
                  CatNil
                );
                return $Free(
                  $1._1,
                  (() => {
                    if ($1._2.tag === "CatNil") {
                      return $CatList("CatCons", $2, $CatQueue(Nil, Nil));
                    }
                    if ($1._2.tag === "CatCons") {
                      return $CatList(
                        "CatCons",
                        $1._2._1,
                        $CatQueue(
                          $1._2._2._1,
                          $List("Cons", $CatList("CatCons", $2, $CatQueue(Nil, Nil)), $1._2._2._2)
                        )
                      );
                    }
                    fail();
                  })()
                );
              },
              $CatQueue(Nil, Nil)
            )
          );
        }
        if (v.tag === "AppendOneThousand") {
          return $Free(
            $$get._1,
            $CatList(
              "CatCons",
              (state) => {
                const $0 = liftEffect((() => {
                  const $02 = state.lastId;
                  return () => createRandomNRowsImpl(adjectives, colours, nouns, 1e3, $02);
                })());
                const $1 = (newRows) => $Free(
                  $FreeView(
                    "Bind",
                    $HalogenF("State", (s) => $Tuple(void 0, { ...s, rows: [...state.rows, ...newRows], lastId: state.lastId + 1e3 | 0 })),
                    (x) => $Free($FreeView("Return", x), CatNil)
                  ),
                  CatNil
                );
                return $Free(
                  $0._1,
                  (() => {
                    if ($0._2.tag === "CatNil") {
                      return $CatList("CatCons", $1, $CatQueue(Nil, Nil));
                    }
                    if ($0._2.tag === "CatCons") {
                      return $CatList(
                        "CatCons",
                        $0._2._1,
                        $CatQueue(
                          $0._2._2._1,
                          $List("Cons", $CatList("CatCons", $1, $CatQueue(Nil, Nil)), $0._2._2._2)
                        )
                      );
                    }
                    fail();
                  })()
                );
              },
              $CatQueue(Nil, Nil)
            )
          );
        }
        if (v.tag === "UpdateEveryTenth") {
          return $Free(
            $FreeView(
              "Bind",
              $HalogenF(
                "State",
                (s) => $Tuple(
                  void 0,
                  {
                    ...s,
                    rows: mapWithIndexArray((ix) => (row) => {
                      if (intMod(ix)(10) === 0) {
                        return { ...row, label: row.label + " !!!" };
                      }
                      return row;
                    })(s.rows)
                  }
                )
              ),
              (x) => $Free($FreeView("Return", x), CatNil)
            ),
            CatNil
          );
        }
        if (v.tag === "Clear") {
          return $Free(
            $FreeView(
              "Bind",
              $HalogenF("State", (s) => $Tuple(void 0, { ...s, rows: [] })),
              (x) => $Free($FreeView("Return", x), CatNil)
            ),
            CatNil
          );
        }
        if (v.tag === "Swap") {
          return $Free(
            $$get._1,
            $CatList(
              "CatCons",
              (state) => {
                const v1 = swapRows(state.rows)(1)(998);
                if (v1.tag === "Nothing") {
                  return $Free($FreeView("Return", void 0), CatNil);
                }
                if (v1.tag === "Just") {
                  const $0 = v1._1;
                  return $Free(
                    $FreeView(
                      "Bind",
                      $HalogenF("State", (s) => $Tuple(void 0, { ...s, rows: $0 })),
                      (x) => $Free($FreeView("Return", x), CatNil)
                    ),
                    CatNil
                  );
                }
                fail();
              },
              $CatQueue(Nil, Nil)
            )
          );
        }
        if (v.tag === "Remove") {
          const $0 = v._1;
          return $Free(
            $FreeView(
              "Bind",
              $HalogenF("State", (s) => $Tuple(void 0, { ...s, rows: filterImpl((r) => r.id !== $0, s.rows) })),
              (x) => $Free($FreeView("Return", x), CatNil)
            ),
            CatNil
          );
        }
        if (v.tag === "Select") {
          const $0 = v._1;
          return $Free(
            $$get._1,
            $CatList(
              "CatCons",
              (state) => {
                if (state.selectedId === $0) {
                  return $Free($FreeView("Return", void 0), CatNil);
                }
                return $Free(
                  $FreeView(
                    "Bind",
                    $HalogenF("State", (s) => $Tuple(void 0, { ...s, selectedId: $0 })),
                    (x) => $Free($FreeView("Return", x), CatNil)
                  ),
                  CatNil
                );
              },
              $CatQueue(Nil, Nil)
            )
          );
        }
        fail();
      }
    })
  };
  var main = /* @__PURE__ */ runHalogenAff(/* @__PURE__ */ _bind(awaitBody)((body) => runUI2(app)()(body)));

  // <stdin>
  main();
})();
