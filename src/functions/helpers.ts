import Functor from "../implements/functor";
import PatternMatch from "../implements/patternmatch";

const slice = Array.prototype.slice;

//throwError :: String -> Error
const throwError = (x: String): Error => {
    throw x;
};

//id :: a -> a
const id = (x: any): any => x;

//fmap :: Functor f  => (a -> b) -> f a -> f b
const fmap = (fn: Function, f: Functor): Functor | Error =>
    typeof fn !== "function"
        ? throwError("function not provided")
        : !f.map ? throwError("map not implemented") : f.map.call(null, fn);

//caseOf :: Object -> patternMatch -> a
const caseOf = (o: Object, p: PatternMatch): any =>
    !p.caseOf ? throwError("caseOf not implemented") : p.caseOf.call(null, o);

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
const ncurry = (fn: Function): Function | Error => {
    if (typeof fn !== "function") return throwError("Function not provided");
    if (fn.arguments.length > 1) return throwError("Function Arity cannot be greater than 1");
    if (typeof fn.arguments[0] !== "object") return throwError("Function argument must be an object type");
    const args = Object.keys(fn.arguments[0]);

    return function curried(ar: Object): Function {
        const curArgs = Object.keys(ar);
        const diff = args.filter(x => curArgs.indexOf(x) < 0);
        if(diff.length > 0) return (ar2: Object): Function => curried.call(null, (<any>Object).assign({}, ar, ar2));
        return fn.call(null, ar);
    };
};

//compose :: Array<Function> -> Function
const compose = (...fns: Array<Function>) => fns.reduce((f,g) => (...args:Array<any>) => f(g(...args)));

export {
    id,
    throwError,
    fmap,
    caseOf,
    curry,
    ncurry,
    compose
}