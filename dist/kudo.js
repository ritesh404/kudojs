(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.kudoJS = factory());
}(this, (function () { 'use strict';

var slice = Array.prototype.slice;
//throwError :: String -> Error
var throwError = function throwError(x) {
    throw x;
};
//id :: a -> a
var id = function id(x) {
    return x;
};
//isFunction :: Function -> boolean
var isFunction = function isFunction(f) {
    return typeof f === "function";
};
//once :: Function -> Function
var once = function once(f) {
    if (!isFunction(f)) throwError("Function not provided");
    var _called = false;
    var _result = undefined;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!_called) {
            _called = true;
            _result = f.apply(null, args);
        }
        return _result;
    };
};
//curry :: Function -> Function
var curry = function curry(fn) {
    if (!isFunction(fn)) throwError("Function not provided");
    var arity = fn.length;
    return function curried() {
        var args = slice.call(arguments, 0);
        if (args.length >= arity) return fn.apply(null, args);
        return function () {
            return curried.apply(null, args.concat(slice.call(arguments)));
        };
    };
};
//ncurry :: Function -> Function
var ncurry = function ncurry(fn, args) {
    if (!isFunction(fn)) throwError("Function not provided");
    if (fn.length > 1) throwError("Function Arity cannot be greater than 1");
    //if (typeof fn.arguments[0] !== "object") return throwError("Function argument must be an object type");
    //const args = Object.keys(fn.arguments[0]);
    return function curried(ar) {
        var curArgs = Object.keys(ar);
        var diff = args.filter(function (x) {
            return curArgs.indexOf(x) < 0;
        });
        if (diff.length > 0) return function (ar2) {
            return curried.call(null, Object.assign({}, ar, ar2));
        };
        return fn.call(null, ar);
    };
};
//compose :: Array<Function> -> Function
var compose = function compose() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    if (fns.length <= 0) throwError("Nothing to compose!");
    return fns.reduce(function (f, g) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return f(g.apply(void 0, args));
        };
    });
};
//fmap :: Functor f  => (a -> b) -> f a -> f b
var _fmap = function _fmap(fn, f) {
    if (!isFunction(fn)) throwError("function not provided");
    if (!f.map) throwError("Functor not found");
    return f.map.call(f, fn);
};
var fmap = curry(_fmap);
//bimap :: BiFunctor b => b a c ~> (a -> e) -> (c -> d) ->  b a c -> b e d  
var _bimap = function _bimap(f1, f2, b) {
    if (!isFunction(f1) || !isFunction(f2)) throwError("Functions not provided");
    if (!b.bimap) throwError("BiFunctor not found");
    return b.bimap(f1, f2);
};
var bimap = curry(_bimap);
//chain :: Monad m => (a -> m b) -> m a -> m b
var _chain = function _chain(f, m) {
    if (!m.chain) throwError("chain not implemented");
    if (!isFunction(f)) throwError("function not provided");
    return m.chain.call(m, f);
};
var chain = curry(_chain);
//caseOf :: Object -> patternMatch -> a
var _caseOf = function _caseOf(o, p) {
    return !p.caseOf ? throwError("caseOf not implemented") : p.caseOf(o);
};
var caseOf = curry(_caseOf);
//liftAn :: Apply a => f -> Array<a> -> a 
var _liftAn = function _liftAn(f, fn) {
    if (!isFunction(f)) throwError("Function not found");
    if (fn.length <= 0) throwError("No Apply found!");
    var init = fn[0].map(f);
    var res = init;
    if (fn.length > 1) {
        var rest = fn.slice(1);
        res = rest.reduce(function (a, ca) {
            return ca.ap(a);
        }, init);
    }
    return res;
};
var _liftA1 = function _liftA1(f, f1) {
    return _liftAn(f, [f1]);
};
var _liftA2 = function _liftA2(f, f1, f2) {
    return _liftAn(f, [f1, f2]);
};
var _liftA3 = function _liftA3(f, f1, f2, f3) {
    return _liftAn(f, [f1, f2, f3]);
};
var _liftA4 = function _liftA4(f, f1, f2, f3, f4) {
    return _liftAn(f, [f1, f2, f3, f4]);
};
var _liftA5 = function _liftA5(f, f1, f2, f3, f4, f5) {
    return _liftAn(f, [f1, f2, f3, f4, f5]);
};
var liftAn = curry(_liftAn);
var liftA1 = curry(_liftA1);
var liftA2 = curry(_liftA2);
var liftA3 = curry(_liftA3);
var liftA4 = curry(_liftA4);
var liftA5 = curry(_liftA5);

var _of = function _of(v) {
    return new Pair$2(v, v);
};
var _pairs = new WeakMap();
var Pair$2 = /** @class */function () {
    function Pair(v1, v2) {
        if (v1 === undefined || v2 === undefined) throwError("Pair: Both first and second values must be defined");
        _pairs.set(this, [v1, v2]);
    }
    Pair.prototype.equals = function (j) {
        return j.fst() === this.fst() && j.snd() === this.snd();
    };
    // isEqual(n: any){
    //     return this.equals(n);
    // }
    Pair.prototype.concat = function (p) {
        if (!(p instanceof Pair)) throwError("Pair: Pair required");
        var lf = this.fst();
        var ls = this.snd();
        var rf = p.fst();
        var rs = p.snd();
        if (!lf.concat || !ls.concat || !rf.concat || !rs.concat) throwError("Pair: Both Pairs must contain Semigroups");
        return new Pair(lf.concat(rf), ls.concat(rs));
    };
    Pair.prototype.of = function (v) {
        return _of(v);
    };
    Pair.prototype.fst = function () {
        return this.getValue()[0];
    };
    Pair.prototype.snd = function () {
        return this.getValue()[1];
    };
    Pair.prototype.ap = function (j) {
        if (!(j instanceof Pair)) throwError("Pair: Pair required");
        var fn = j.snd();
        if (!isFunction(fn)) throwError("Pair: Second wrapped value should be a function");
        var l = this.fst();
        var r = j.fst();
        //console.log(l, r, fn);
        if (!l.concat || !r.concat) throwError('Pair: Types should be Semigroups');
        return new Pair(l.concat(r), fn(this.snd()));
    };
    Pair.prototype.getValue = function () {
        return _pairs.get(this);
    };
    Pair.prototype.map = function (f) {
        if (!isFunction(f)) throwError("Pair: Expected a function");
        return new Pair(this.fst(), f(this.snd()));
    };
    Pair.prototype.bimap = function (f1, f2) {
        if (!isFunction(f1) || !isFunction(f2)) throwError("Pair: Expected functions for both parts");
        return new Pair(f1(this.fst()), f2(this.snd()));
    };
    Pair.prototype.chain = function (f) {
        if (!isFunction(f)) throwError("Pair: Expected a function");
        var l = this.fst();
        if (!l.concat) throwError("Pair: First value should be a Semigroup");
        var p = f(this.snd());
        if (!(p instanceof Pair)) throwError("Pair: Function must return a Pair");
        var r = p.fst();
        if (!r.concat) throwError("Pair: First value of the returned Pair should be a Semigroup");
        return new Pair(l.concat(r), p.snd());
    };
    Pair.prototype.swap = function () {
        var v = this.getValue();
        return new Pair(v[1], v[0]);
    };
    Pair.prototype.toString = function () {
        var v = this.getValue();
        return "Pair((" + v[0] + "), (" + v[1] + "))";
    };
    return Pair;
}();
Pair$2.prototype.of = _of;

var Pair = function Pair(v1, v2) {
  return new Pair$2(v1, v2);
};
Pair.of = Pair$2.prototype.of;

var _lefts = new WeakMap();
var _Left = /** @class */function () {
    function Left(v) {
        _lefts.set(this, v);
    }
    Left.prototype.equals = function (n) {
        return n instanceof Left && n.isLeft && n.isLeft() && n.getValue() === this.getValue();
    };
    // isEqual(n: any){
    //     return this.equals(n);
    // }
    Left.prototype.of = function (v) {
        return new Left(v);
    };
    Left.prototype.ap = function (n) {
        return this;
    };
    Left.prototype.getValue = function () {
        return _lefts.get(this);
    };
    Left.prototype.map = function (f) {
        return this;
    };
    Left.prototype.bimap = function (f, _) {
        return this.of(f(this.getValue()));
    };
    Left.prototype.chain = function (f) {
        return this;
    };
    Left.prototype.isRight = function () {
        return false;
    };
    Left.prototype.isLeft = function () {
        return true;
    };
    Left.prototype.swap = function () {
        return new _Right(this.getValue());
    };
    Left.prototype.toString = function () {
        return "Left(" + this.getValue() + ")";
    };
    Left.prototype.caseOf = function (o) {
        return o.Left ? o.Left(this.getValue()) : throwError("Either: Expected Left!");
    };
    return Left;
}();
var _rights = new WeakMap();
var _Right = /** @class */function () {
    function Right(v) {
        _rights.set(this, v);
    }
    Right.prototype.equals = function (j) {
        return j instanceof Right && j.isRight && j.isRight() && j.getValue() === this.getValue();
    };
    // isEqual(n: any){
    //     return this.equals(n);
    // }
    Right.prototype.of = function (v) {
        return new Right(v);
    };
    Right.prototype.ap = function (j) {
        if (!isFunction(j.getValue())) throwError("Either: Wrapped value is not a function");
        return this.map(j.getValue());
    };
    Right.prototype.getValue = function () {
        return _rights.get(this);
    };
    Right.prototype.map = function (f) {
        if (!isFunction(f)) throwError("Either: Expected a function");
        return new Right(f(this.getValue()));
    };
    Right.prototype.bimap = function (_, f) {
        return this.of(f(this.getValue()));
    };
    Right.prototype.chain = function (f) {
        if (!isFunction(f)) throwError("Either: Expected a function");
        return f(this.getValue());
    };
    Right.prototype.isRight = function () {
        return true;
    };
    Right.prototype.isLeft = function () {
        return false;
    };
    Right.prototype.swap = function () {
        return new _Left(this.getValue());
    };
    Right.prototype.toString = function () {
        return "Right(" + this.getValue() + ")";
    };
    Right.prototype.caseOf = function (o) {
        return o.Right ? o.Right(this.getValue()) : throwError("Either: Expected Right");
    };
    return Right;
}();
var Either = {
    of: function of(v) {
        return new _Right(v);
    },
    Right: function Right(v) {
        return new _Right(v);
    },
    Left: function Left(v) {
        return new _Left(v);
    },
    fromNullable: function fromNullable(v) {
        return v ? new _Right(v) : new _Left(v);
    },
    withDefault: function withDefault(def, v) {
        return v ? new _Right(v) : new _Right(def);
    },
    swap: function swap(e) {
        return e.swap();
    },
    try: function _try(f) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            try {
                return new _Right(f.apply(null, args));
            } catch (error) {
                return new _Left(error);
            }
        };
    },
    bimap: function bimap$$1(e, fl, fr) {
        return e.bimap(fl, fr);
    },
    isLeft: function isLeft(v) {
        return v.isLeft && v.isLeft();
    },
    isRight: function isRight(v) {
        return v.isRight && v.isRight();
    }
    //catMaybes: (ar: Array<Right|Left>): Array<any> => ar.filter( m => m instanceof Right).map(m => m.getValue())
    // partitionEithers: 
};

var _Nothing = /** @class */function () {
    function Nothing() {}
    Nothing.prototype.equals = function (n) {
        return n instanceof Nothing && n.isNothing && n.isNothing();
    };
    // isEqual(n: Nothing){
    //     return this.equals(n);
    // }
    Nothing.prototype.of = function (v) {
        return new Nothing();
    };
    Nothing.prototype.ap = function (n) {
        return this;
    };
    Nothing.prototype.getValue = function () {
        return null;
    };
    Nothing.prototype.map = function (f) {
        return this;
    };
    Nothing.prototype.chain = function (f) {
        return this;
    };
    Nothing.prototype.isJust = function () {
        return false;
    };
    Nothing.prototype.isNothing = function () {
        return true;
    };
    Nothing.prototype.toString = function () {
        return "Nothing()";
    };
    Nothing.prototype.caseOf = function (o) {
        return o.Nothing ? o.Nothing() : throwError("Maybe: Expected Nothing!");
    };
    return Nothing;
}();
var _justs = new WeakMap();
var _Just = /** @class */function () {
    function Just(v) {
        _justs.set(this, v);
    }
    Just.prototype.equals = function (j) {
        return j instanceof Just && j.isJust && j.isJust() && j.getValue() === this.getValue();
    };
    // isEqual(n: Just){
    //     return this.equals(n);
    // }
    Just.prototype.of = function (v) {
        return new Just(v);
    };
    Just.prototype.ap = function (j) {
        if (!isFunction(j.getValue())) throwError("Maybe: Wrapped value is not a function");
        return this.map(j.getValue());
    };
    Just.prototype.getValue = function () {
        return _justs.get(this);
    };
    Just.prototype.map = function (f) {
        if (!isFunction(f)) throwError("Maybe: Expected a function");
        return new Just(f(this.getValue()));
    };
    Just.prototype.chain = function (f) {
        if (!isFunction(f)) throwError("Maybe: Expected a function");
        return f(this.getValue());
    };
    Just.prototype.isJust = function () {
        return true;
    };
    Just.prototype.isNothing = function () {
        return false;
    };
    Just.prototype.toString = function () {
        return "Just(" + this.getValue() + ")";
    };
    Just.prototype.caseOf = function (o) {
        return o.Just ? o.Just(this.getValue()) : throwError("Maybe: Expected Just");
    };
    return Just;
}();
var Maybe = {
    of: function of(v) {
        return new _Just(v);
    },
    zero: function zero() {
        return new _Nothing();
    },
    Just: function Just(v) {
        return new _Just(v);
    },
    Nothing: function Nothing(v) {
        return new _Nothing();
    },
    fromNullable: function fromNullable(v) {
        return v ? new _Just(v) : new _Nothing();
    },
    withDefault: function withDefault(def, v) {
        return v ? new _Just(v) : new _Just(def);
    },
    catMaybes: function catMaybes(ar) {
        return ar.filter(function (m) {
            return m instanceof _Just;
        }).map(function (m) {
            return m.getValue();
        });
    },
    isJust: function isJust(v) {
        return v.isJust();
    },
    isNothing: function isNothing(v) {
        return v.isNothing();
    }
};

var _of$1 = function _of(v) {
    return new Task$2(function (_, resolve) {
        return resolve(v);
    });
};
var _rejected = function _rejected(v) {
    return new Task$2(function (rej, _) {
        return rej(v);
    });
};
var _tasks = new WeakMap();
var Task$2 = /** @class */function () {
    function Task(f /*, cancel: Function*/) {
        isFunction(f) ? _tasks.set(this, f) : throwError("Task: Expected a Function");
        //cancel && isFunction(cancel) ? _cancels.set(this, cancel) : _cancels.set(this, function(){})
    }
    Task.prototype.fork = function (reject, resolve) {
        if (!isFunction(resolve) || !isFunction(reject)) throwError("Task: Reject and Resolve need to be functions");
        var fn = this.getValue();
        fn(reject, resolve);
    };
    Task.prototype.of = function (v) {
        return _of$1(v);
    };
    Task.prototype.rejected = function (v) {
        return _rejected(v);
    };
    Task.prototype.toString = function () {
        var fork = this.getValue();
        return "Task(" + fork.toString() + ")";
    };
    Task.prototype.map = function (f) {
        if (!isFunction(f)) throwError("Task: Expected a function");
        var fork = this.getValue();
        return new Task(function (rej, res) {
            return fork(rej, compose(res, f));
        });
    };
    Task.prototype.getValue = function () {
        return _tasks.get(this);
    };
    Task.prototype.ap = function (t) {
        if (!(t instanceof Task)) throwError("Task: type mismatch");
        var thisFork = this.getValue();
        var value;
        var fn;
        var gotValues = false;
        var gotFuction = false;
        var rejected = false;
        return new Task(function (rej, res) {
            var rejOnce = compose(function () {
                rejected = true;
            }, once(rej));
            var resolveBoth = function resolveBoth() {
                if (gotValues && gotFuction && !rejected) {
                    var exec = compose(res, fn);
                    exec.apply(null, value);
                }
            };
            thisFork(rejOnce, function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                value = values;
                gotValues = true;
                resolveBoth();
            });
            t.fork(rejOnce, function (f) {
                if (!isFunction(f)) throwError("Task: Wrapped value should be a function");
                fn = f;
                gotFuction = true;
                resolveBoth();
            });
        });
    };
    Task.prototype.concat = function (t) {
        if (!(t instanceof Task)) throwError("Task: type mismatch");
        var thisFork = this.getValue();
        var thatFork = t.getValue();
        return new Task(function (rej, res) {
            var rejected = false;
            var rejOnce = compose(function () {
                rejected = true;
            }, once(rej));
            var result1;
            var result2;
            var resolveBoth = function resolveBoth() {
                if (result1 && result2 && !rejected) {
                    res.apply(null, result1.concat(result2));
                }
            };
            thisFork(rejOnce, function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                result1 = values;
                resolveBoth();
            });
            thatFork(rejOnce, function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                result2 = values;
                resolveBoth();
            });
        });
    };
    Task.prototype.chain = function (f) {
        if (!isFunction(f)) throwError("Task: Function required");
        var thisFork = this.getValue();
        return new Task(function (rej, res) {
            thisFork(rej, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var t = f.call(null, args);
                if (!(t instanceof Task)) throwError("Task: function must return another Task");
                t.fork(rej, res);
            });
        });
    };
    Task.prototype.toPromise = function () {
        var thisFork = this.getValue();
        return new Promise(function (res, rej) {
            thisFork(rej, res);
        });
    };
    return Task;
}();
Task$2.prototype.of = _of$1;
Task$2.prototype.rejected = _rejected;

var Task = function Task(f) {
  return new Task$2(f);
};
Task.of = Task$2.prototype.of;
Task.rejected = Task$2.prototype.rejected;

//Algebraic Data Types
var index = {
    id: id,
    once: once,
    fmap: fmap,
    bimap: bimap,
    chain: chain,
    caseOf: caseOf,
    curry: curry,
    ncurry: ncurry,
    compose: compose,
    liftAn: liftAn,
    liftA1: liftA1,
    liftA2: liftA2,
    liftA3: liftA3,
    liftA4: liftA4,
    liftA5: liftA5,
    Pair: Pair,
    Either: Either,
    Maybe: Maybe,
    Task: Task
};

return index;

})));
//# sourceMappingURL=kudo.js.map
