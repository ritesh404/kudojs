(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.kudoJS = factory());
}(this, (function () { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var Either = function () {
    function Either() {}
    Either.of = function (v) {
        return new Right(v);
    };
    Either.Right = function (v) {
        return new Right(v);
    };
    Either.Left = function (v) {
        return new Left(v);
    };
    Either.fromNullable = function (v) {
        return v ? new Right(v) : new Left(v);
    };
    Either.withDefault = function (def, v) {
        return v ? new Right(v) : new Right(def);
    };
    Either.swap = function (e) {
        return e.swap();
    };
    Either.try = function (f) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            try {
                return new Right(f.apply(null, args));
            } catch (e) {
                return new Left(e);
            }
        };
    };
    Either.bimap = function (e, fl, fr) {
        return e.bimap(fl, fr);
    };
    Either.isLeft = function (v) {
        return v.isLeft();
    };
    Either.isRight = function (v) {
        return v.isRight();
    };
    Either.prototype.of = function (v) {
        return new Right(v);
    };
    Either.prototype.ap = function (j) {
        var _this = this;
        if (!isFunction(j.getValue())) throwError("Either: Wrapped value is not a function");
        return caseOf({
            Left: function Left(v) {
                return j;
            },
            Right: function Right(v) {
                return _this.map(v);
            }
        }, j);
    };
    Either.prototype.getValue = function () {
        return this._value;
    };
    return Either;
}();
Either.prototype['fantasy-land/equals'] = Either.prototype.equals;
Either.prototype['fantasy-land/map'] = Either.prototype.map;
Either.prototype['fantasy-land/bimap'] = Either.prototype.bimap;
Either.prototype['fantasy-land/chain'] = Either.prototype.chain;
Either.prototype['fantasy-land/of'] = Either.prototype.of;
Either.prototype['fantasy-land/ap'] = Either.prototype.ap;
var Left = function (_super) {
    __extends(Left, _super);
    function Left(v) {
        var _this = _super.call(this) || this;
        _this._value = v;
        return _this;
    }
    Left.prototype.equals = function (n) {
        return n instanceof Left && n.isLeft && n.isLeft() && n.getValue() === this.getValue();
    };
    Left.prototype.map = function (f) {
        return new Left(this.getValue());
    };
    Left.prototype.bimap = function (fl, fr) {
        return new Left(fl(this.getValue()));
    };
    Left.prototype.chain = function (f) {
        return new Left(this.getValue());
    };
    Left.prototype.isRight = function () {
        return false;
    };
    Left.prototype.isLeft = function () {
        return true;
    };
    Left.prototype.swap = function () {
        return new Right(this.getValue());
    };
    Left.prototype.toString = function () {
        return "Left(" + this.getValue() + ")";
    };
    Left.prototype.caseOf = function (o) {
        return o.Left ? o.Left(this.getValue()) : throwError("Either: Expected Left!");
    };
    return Left;
}(Either);
var Right = function (_super) {
    __extends(Right, _super);
    function Right(v) {
        var _this = _super.call(this) || this;
        _this._value = v;
        return _this;
    }
    Right.prototype.equals = function (j) {
        return j instanceof Right && j.isRight && j.isRight() && j.getValue() === this.getValue();
    };
    Right.prototype.map = function (f) {
        if (!isFunction(f)) throwError("Either: Expected a function");
        return new Right(f(this.getValue()));
    };
    Right.prototype.bimap = function (fl, fr) {
        return new Right(fr(this.getValue()));
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
        return new Left(this.getValue());
    };
    Right.prototype.toString = function () {
        return "Right(" + this.getValue() + ")";
    };
    Right.prototype.caseOf = function (o) {
        return o.Right ? o.Right(this.getValue()) : throwError("Either: Expected Right");
    };
    return Right;
}(Either);

var Maybe = function () {
    function Maybe() {}
    Maybe.of = function (v) {
        return new Just(v);
    };
    Maybe.zero = function () {
        return new Nothing();
    };
    Maybe.Just = function (v) {
        return new Just(v);
    };
    Maybe.Nothing = function () {
        return new Nothing();
    };
    Maybe.fromNullable = function (v) {
        return v ? new Just(v) : new Nothing();
    };
    Maybe.withDefault = function (def, v) {
        return v ? new Just(v) : new Just(def);
    };
    Maybe.catMaybes = function (ar) {
        return ar.filter(function (m) {
            return m.isJust();
        }).map(function (m) {
            return m.getValue();
        });
    };
    Maybe.isNothing = function (v) {
        return v.isNothing();
    };
    Maybe.isJust = function (v) {
        return v.isJust();
    };
    Maybe.prototype.of = function (v) {
        return new Just(v);
    };
    Maybe.prototype.alt = function (v) {
        var _this = this;
        return caseOf({
            Nothing: function Nothing(x) {
                return v;
            },
            Just: function Just(x) {
                return _this;
            }
        }, this);
    };
    Maybe.prototype.ap = function (j) {
        var _this = this;
        if (!isFunction(j.getValue())) throwError("Maybe: Wrapped value is not a function");
        return caseOf({
            Nothing: function Nothing(v) {
                return j;
            },
            Just: function Just(v) {
                return _this.map(v);
            }
        }, j);
    };
    Maybe.prototype.getValue = function () {
        return this._value;
    };
    return Maybe;
}();
Maybe.prototype['fantasy-land/equals'] = Maybe.prototype.equals;
Maybe.prototype['fantasy-land/map'] = Maybe.prototype.map;
Maybe.prototype['fantasy-land/chain'] = Maybe.prototype.chain;
Maybe.prototype['fantasy-land/of'] = Maybe.prototype.of;
Maybe.prototype['fantasy-land/zero'] = Maybe.prototype.zero;
Maybe.prototype['fantasy-land/ap'] = Maybe.prototype.ap;
var Nothing = function (_super) {
    __extends(Nothing, _super);
    function Nothing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Nothing.prototype.equals = function (n) {
        return n instanceof Nothing && n.isNothing && n.isNothing();
    };
    Nothing.prototype.map = function (f) {
        return new Nothing();
    };
    Nothing.prototype.chain = function (f) {
        return new Nothing();
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
}(Maybe);
var Just = function (_super) {
    __extends(Just, _super);
    function Just(v) {
        var _this = _super.call(this) || this;
        _this._value = v;
        return _this;
    }
    Just.prototype.equals = function (j) {
        return j instanceof Just && j.isJust && j.isJust() && j.getValue() === this.getValue();
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
}(Maybe);

var slice = Array.prototype.slice;
var throwError = function throwError(x) {
    throw x;
};
var id = function id(x) {
    return x;
};
var isFunction = function isFunction(f) {
    return typeof f === "function";
};
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
var ncurry = function ncurry(fn, args) {
    if (!isFunction(fn)) throwError("Function not provided");
    if (fn.length > 1) throwError("Function Arity cannot be greater than 1");
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
var _fmap = function _fmap(fn, f) {
    if (!isFunction(fn)) throwError("function not provided");
    if (!f.map) throwError("Functor not found");
    return f.map.call(f, fn);
};
var fmap = curry(_fmap);
var _bimap = function _bimap(f1, f2, b) {
    if (!isFunction(f1) || !isFunction(f2)) throwError("Functions not provided");
    if (!b.bimap) throwError("BiFunctor not found");
    return b.bimap(f1, f2);
};
var bimap = curry(_bimap);
var _chain = function _chain(f, m) {
    if (!m.chain) throwError("chain not implemented");
    if (!isFunction(f)) throwError("function not provided");
    return m.chain.call(m, f);
};
var chain = curry(_chain);
var _caseOf = function _caseOf(o, p) {
    return !p.caseOf ? throwError("unable to match patterns") : p.caseOf(o);
};
var caseOf = curry(_caseOf);
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

var Pair$2 = function () {
    function Pair(v1, v2) {
        if (v1 === undefined || v2 === undefined) throwError("Pair: Both first and second values must be defined");
        this._value = [v1, v2];
    }
    Pair.of = function (v) {
        return new Pair(v, v);
    };
    Pair.prototype.of = function (v) {
        return new Pair(v, v);
    };
    Pair.prototype.equals = function (j) {
        return j.fst() === this.fst() && j.snd() === this.snd();
    };
    Pair.prototype.concat = function (p) {
        if (!(p instanceof Pair)) throwError("Pair: Pair required");
        var lf = this.fst();
        var ls = this.snd();
        var rf = p.fst();
        var rs = p.snd();
        if (!lf.concat || !ls.concat || !rf.concat || !rs.concat) throwError("Pair: Both Pairs must contain Semigroups");
        return new Pair(lf.concat(rf), ls.concat(rs));
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
        if (!l.concat || !r.concat) throwError("Pair: Types should be Semigroups");
        return new Pair(l.concat(r), fn(this.snd()));
    };
    Pair.prototype.getValue = function () {
        return this._value;
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
Pair$2.prototype['fantasy-land/equals'] = Pair$2.prototype.equals;
Pair$2.prototype['fantasy-land/map'] = Pair$2.prototype.map;
Pair$2.prototype['fantasy-land/concat'] = Pair$2.prototype.concat;
Pair$2.prototype['fantasy-land/bimap'] = Pair$2.prototype.bimap;
Pair$2.prototype['fantasy-land/chain'] = Pair$2.prototype.chain;
Pair$2.prototype['fantasy-land/of'] = Pair$2.prototype.of;
Pair$2.prototype['fantasy-land/ap'] = Pair$2.prototype.ap;

var Pair = function Pair(v1, v2) {
  return new Pair$2(v1, v2);
};
Pair.of = Pair$2.prototype.of;
Pair.prototype['fantasy-land/of'] = Pair$2.prototype.of;

var Task$2 = function () {
    function Task(f) {
        isFunction(f) ? this._value = f : throwError("Task: Expected a Function");
    }
    Task.of = function (v) {
        return new Task(function (_, resolve) {
            return resolve(v);
        });
    };
    Task.rejected = function (v) {
        return new Task(function (reject, _) {
            return reject(v);
        });
    };
    Task.prototype.of = function (v) {
        return new Task(function (_, resolve) {
            return resolve(v);
        });
    };
    Task.prototype.rejected = function (v) {
        return new Task(function (reject, _) {
            return reject(v);
        });
    };
    Task.prototype.fork = function (reject, resolve) {
        if (!isFunction(resolve) || !isFunction(reject)) throwError("Task: Reject and Resolve need to be functions");
        var fn = this.getValue();
        fn(reject, resolve);
    };
    Task.prototype.toString = function () {
        var fork = this.getValue();
        return "Task(" + fork.name + ")";
    };
    Task.prototype.map = function (f) {
        if (!isFunction(f)) throwError("Task: Expected a function");
        var fork = this.getValue();
        return new Task(function (rej, res) {
            return fork(rej, compose(res, f));
        });
    };
    Task.prototype.getValue = function () {
        return this._value;
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
                if (!t.fork) throwError("Task: function must return another Task");
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
Task$2.prototype['fantasy-land/map'] = Task$2.prototype.map;
Task$2.prototype['fantasy-land/concat'] = Task$2.prototype.concat;
Task$2.prototype['fantasy-land/chain'] = Task$2.prototype.chain;
Task$2.prototype['fantasy-land/of'] = Task$2.prototype.of;
Task$2.prototype['fantasy-land/ap'] = Task$2.prototype.ap;

var Task = function Task(f) {
  return new Task$2(f);
};
Task.of = Task$2.of;
Task.rejected = Task$2.rejected;

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
