import Functor from "../implements/functor";
import PatternMatch from "../implements/patternmatch";
import Monad from "../implements/monad";
import { Applicative, Apply } from "../interfaces";

const slice = Array.prototype.slice;

//throwError :: String -> Error
const throwError = (x: String): Error => {
    throw x;
};

//id :: a -> a
const id = (x: any): any => x;

const isFunction = (f: any) => typeof f === "function";

//curry :: Function -> Function
const curry = (fn: Function): Function | Error => {
    if (!isFunction(fn)) return throwError("Function not provided");

    const arity = fn.length;
    return function curried() {
        let args = slice.call(arguments, 0);
        if (args.length >= arity) return fn.apply(null, args);

        return function() {
            return curried.apply(null, args.concat(slice.call(arguments)));
        };
    };
};

//ncurry :: Function -> Function
const ncurry = (fn: Function, args: Array<string>): Function | Error => {
    if (!isFunction(fn)) return throwError("Function not provided");
    if (fn.length > 1)
        return throwError("Function Arity cannot be greater than 1");
    //if (typeof fn.arguments[0] !== "object") return throwError("Function argument must be an object type");
    //const args = Object.keys(fn.arguments[0]);

    return function curried(ar: Object): Function {
        const curArgs = Object.keys(ar);
        const diff = args.filter(x => curArgs.indexOf(x) < 0);
        if (diff.length > 0)
            return (ar2: Object): Function =>
                curried.call(null, (<any>Object).assign({}, ar, ar2));
        return fn.call(null, ar);
    };
};

//compose :: Array<Function> -> Function
const compose = (...fns: Array<Function>): Function | Error =>
    fns.length > 0
        ? fns.reduce((f, g) => (...args: Array<any>) => f(g(...args)))
        : throwError("Nothing to compose!");

//fmap :: Functor f  => (a -> b) -> f a -> f b
const _fmap = (fn: Function, f: Functor): Functor | Error =>
    !isFunction(fn)
        ? throwError("function not provided")
        : !f.map ? throwError("map not implemented") : f.map.call(f, fn);
const fmap = curry(_fmap);

//chain :: Monad m => m a -> (a -> m b) -> m b
const _chain = (m: Monad, f: Function): Monad | Error =>
    !m.chain
        ? throwError("chain not implemented")
        : !isFunction(f)
          ? throwError("function not provided")
          : m.chain.call(m, f);
const chain = curry(_chain);

//caseOf :: Object -> patternMatch -> a
const _caseOf = (o: Object, p: PatternMatch): any =>
    !p.caseOf ? throwError("caseOf not implemented") : p.caseOf.call(null, o);
const caseOf = curry(_caseOf);

const _liftAn = (f: Function, fn: Array<Apply>) => {
    if (!isFunction(f)) throwError("Function not found");
    if (fn.length <= 0) throwError("No Functors found!");
    const init: Apply = fn[0].map(f);
    let res = init;
    if (fn.length > 1) {
        const rest = fn.slice(1);
        res = rest.reduce((a: Apply, ca: Apply) => a.ap(ca), init);
    }
    return res;
};
const _liftA1 = (f: Function, f1: Apply) => _liftAn(f, [f1]);
const _liftA2 = (f: Function, f1: Apply, f2: Apply) => _liftAn(f, [f1, f2]);
const _liftA3 = (f: Function, f1: Apply, f2: Apply, f3: Apply) =>
    _liftAn(f, [f1, f2, f3]);
const _liftA4 = (f: Function, f1: Apply, f2: Apply, f3: Apply, f4: Apply) =>
    _liftAn(f, [f1, f2, f3, f4]);
const _liftA5 = (
    f: Function,
    f1: Apply,
    f2: Apply,
    f3: Apply,
    f4: Apply,
    f5: Apply
) => _liftAn(f, [f1, f2, f3, f4, f5]);
const liftAn = curry(_liftAn);
const liftA1 = curry(_liftA1);
const liftA2 = curry(_liftA2);
const liftA3 = curry(_liftA3);
const liftA4 = curry(_liftA4);
const liftA5 = curry(_liftA5);

export {
    id,
    throwError,
    fmap,
    caseOf,
    curry,
    ncurry,
    compose,
    liftAn,
    liftA1,
    liftA2,
    liftA3,
    liftA4,
    liftA5
};
