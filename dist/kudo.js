(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.kudoJS = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var slice = Array.prototype.slice;
//throwError :: String -> Error
var throwError = function throwError(x) {
    throw x;
};
//fmap :: Functor f  => (a -> b) -> f a -> f b
var fmap = function fmap(fn, f) {
    return typeof fn !== "function" ? throwError("function not provided") : !f.map ? throwError("map not implemented") : f.map.call(null, fn);
};
//caseOf :: Object -> patternMatch -> a
var caseOf = function caseOf(o, p) {
    return !p.caseOf ? throwError("caseOf not implemented") : p.caseOf.call(null, o);
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
var ncurry = function ncurry(fn) {
    if (typeof fn !== "function") return throwError("Function not provided");
    if (fn.arguments.length > 1) return throwError("Function Arity cannot be greater than 1");
    if (_typeof(fn.arguments[0]) !== "object") return throwError("Function argument must be an object type");
    var args = Object.keys(fn.arguments[0]);
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

var _Nothing = /** @class */function () {
    function Nothing() {}
    Nothing.prototype.getValue = function () {
        return null;
    };
    Nothing.prototype.map = function (f) {
        return this;
    };
    Nothing.prototype.isJust = function () {
        return false;
    };
    Nothing.prototype.isNothing = function () {
        return true;
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
    Just.prototype.getValue = function () {
        return this.value;
    };
    Just.prototype.map = function (f) {
        return new Just(f(this.value));
    };
    Just.prototype.isJust = function () {
        return true;
    };
    Just.prototype.isNothing = function () {
        return false;
    };
    Just.prototype.caseOf = function (o) {
        return o.Just ? o.Just(this.value) : throwError("Expected Just");
    };
    return Just;
}();
var Maybe = {
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

return Kudo;

})));
//# sourceMappingURL=kudo.js.map
