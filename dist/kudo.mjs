var slice = Array.prototype.slice;
//throwError :: String -> Error
var throwError = function throwError(x) {
    throw x;
};
//curry :: Function -> Function
var curry = function curry(fn) {
    if (typeof fn !== "function") return throwError("Function not provided");
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
    if (typeof fn !== "function") return throwError("Function not provided");
    if (fn.length > 1) return throwError("Function Arity cannot be greater than 1");
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
    return fns.length > 0 ? fns.reduce(function (f, g) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return f(g.apply(void 0, args));
        };
    }) : throwError("Nothing to compose!");
};
//fmap :: Functor f  => (a -> b) -> f a -> f b
var _fmap = function _fmap(fn, f) {
    return typeof fn !== "function" ? throwError("function not provided") : !f.map ? throwError("map not implemented") : f.map.call(f, fn);
};
var fmap = curry(_fmap);
//chain :: Monad m => m a -> (a -> m b) -> m b
var _chain = function _chain(m, f) {
    return !m.chain ? throwError("chain not implemented") : typeof f !== "function" ? throwError("function not provided") : m.chain.call(m, f);
};
var chain = curry(_chain);
//caseOf :: Object -> patternMatch -> a
var _caseOf = function _caseOf(o, p) {
    return !p.caseOf ? throwError("caseOf not implemented") : p.caseOf.call(null, o);
};
var caseOf = curry(_caseOf);

var _Nothing = /** @class */function () {
    function Nothing() {}
    Nothing.prototype.equals = function (n) {
        return n instanceof Nothing;
    };
    Nothing.prototype.of = function (v) {
        return new Nothing();
    };
    Nothing.prototype.ap = function (n) {
        return this.of(n);
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
        return o.Nothing ? o.Nothing() : throwError("Expected Nothing!");
    };
    return Nothing;
}();
var _Just = /** @class */function () {
    function Just(v) {
        this.value = v;
    }
    Just.prototype.equals = function (j) {
        return j instanceof Just && j.getValue() === this.value;
    };
    Just.prototype.of = function (v) {
        return new Just(v);
    };
    Just.prototype.ap = function (j) {
        return j.map(this.value);
    };
    Just.prototype.getValue = function () {
        return this.value;
    };
    Just.prototype.map = function (f) {
        return new Just(f(this.value));
    };
    Just.prototype.chain = function (f) {
        return f(this.value);
    };
    Just.prototype.isJust = function () {
        return true;
    };
    Just.prototype.isNothing = function () {
        return false;
    };
    Just.prototype.toString = function () {
        return "Just(" + this.value + ")";
    };
    Just.prototype.caseOf = function (o) {
        return o.Just ? o.Just(this.value) : throwError("Expected Just");
    };
    return Just;
}();
var Maybe = {
    of: function of(v) {
        return new _Just(v);
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
    andThen: function andThen(cb, m) {
        return m instanceof _Just ? cb.call(null, m.getValue()) : m instanceof _Nothing ? m : throwError("Unexpected Type");
    },
    catMaybes: function catMaybes(ar) {
        return ar.filter(function (m) {
            return m instanceof _Just;
        }).map(function (m) {
            return m.getValue();
        });
    }
};

//Algebraic Data Types
var Kudo = {
    fmap: fmap,
    caseOf: caseOf,
    curry: curry,
    ncurry: ncurry,
    compose: compose,
    Maybe: Maybe
};

export default Kudo;
//# sourceMappingURL=kudo.mjs.map
