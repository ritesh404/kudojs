import Functor from "../implements/functor";
import PatternMatch from "../implements/patternmatch";
import Monad from "../implements/monad";
import { Apply, BiFunctor } from "../interfaces";

const slice = Array.prototype.slice;

//throwError :: String -> Error
const throwError = (x: String): Error => {
    throw x;
};

//id :: a -> a
const id = (x: any): any => x;

//isFunction :: Function -> boolean
const isFunction = (f: any) => typeof f === "function";

//once :: Function -> Function
const once = (f: Function) => {
    if(!isFunction(f)) throwError("Function not provided");
    let _called = false;
    let _result: any = undefined;

    return (...args: Array<any>) => {
        if(!_called){
            _called = true;
            _result = f.apply(null, args);
        }
        return _result;
    }
}
//curry :: Function -> Function
const curry = (fn: Function): Function => {
    if (!isFunction(fn)) throwError("Function not provided");

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
const ncurry = (fn: Function, args: Array<string>): Function => {
    if (!isFunction(fn)) throwError("Function not provided");
    if (fn.length > 1) throwError("Function Arity cannot be greater than 1");
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
const compose = (...fns: Array<Function>): Function => {
    if(fns.length <= 0) throwError("Nothing to compose!");
    return fns.reduce((f, g) => (...args: Array<any>) => f(g(...args)));
}
    

//fmap :: Functor f  => (a -> b) -> f a -> f b
const _fmap = (fn: Function, f: Functor): Functor => {
    if(!isFunction(fn)) throwError("function not provided");
    if(!f.map) throwError("Functor not found");
    return f.map.call(f, fn);
}
const fmap = curry(_fmap);

//bimap :: BiFunctor b => b a c ~> (a -> e) -> (c -> d) ->  b a c -> b e d  
const _bimap = (f1: Function, f2: Function, b: BiFunctor): BiFunctor => {
    if(!isFunction(f1) || !isFunction(f2)) throwError("Functions not provided");
    if(!b.bimap) throwError("BiFunctor not found");
    return b.bimap(f1, f2);
}
const bimap = curry(_bimap);

//chain :: Monad m => (a -> m b) -> m a -> m b
const _chain = (f: Function, m: Monad,): Monad =>{
    if(!m.chain) throwError("chain not implemented");
    if(!isFunction(f)) throwError("function not provided");
    return m.chain.call(m, f);
}
const chain = curry(_chain);

//caseOf :: Object -> patternMatch -> a
const _caseOf = (o: Object, p: PatternMatch): any =>
    !p.caseOf ? throwError("caseOf not implemented") : p.caseOf(o);
const caseOf = curry(_caseOf);

//liftAn :: Apply a => f -> Array<a> -> a 
const _liftAn = (f: Function, fn: Array<Apply>) => {
    if (!isFunction(f)) throwError("Function not found");
    if (fn.length <= 0) throwError("No Apply found!");
    const init: Apply = fn[0].map(f);
    let res = init;
    if (fn.length > 1) {
        const rest = fn.slice(1);
        res = rest.reduce((a: Apply, ca: Apply) => ca.ap(a), init);
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
    isFunction,
    throwError,
    once,
    fmap,
    bimap,
    chain,
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
