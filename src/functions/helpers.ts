import Functor from "../implements/functor";
import PatternMatch from "../implements/patternmatch";
import Monad from "../implements/monad";
import { Applicative } from "../interfaces";

const slice = Array.prototype.slice;

//throwError :: String -> Error
const throwError = (x: String): Error => {
    throw x;
};

//id :: a -> a
const id = (x: any): any => x;

//curry :: Function -> Function
const curry = (fn: Function): Function | Error => {
    if (typeof fn !== "function") return throwError("Function not provided");

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
    if (typeof fn !== "function") return throwError("Function not provided");
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
    typeof fn !== "function"
        ? throwError("function not provided")
        : !f.map ? throwError("map not implemented") : f.map.call(f, fn);
const fmap = curry(_fmap);

//chain :: Monad m => m a -> (a -> m b) -> m b
const _chain = (m: Monad, f: Function): Monad | Error =>
    !m.chain
        ? throwError("chain not implemented")
        : typeof f !== "function"
          ? throwError("function not provided")
          : m.chain.call(m, f);
const chain = curry(_chain);

//caseOf :: Object -> patternMatch -> a
const _caseOf = (o: Object, p: PatternMatch): any =>
    !p.caseOf ? throwError("caseOf not implemented") : p.caseOf.call(null, o);
const caseOf = curry(_caseOf);

export { id, throwError, fmap, caseOf, curry, ncurry, compose };
