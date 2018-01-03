import Functor from "./implements/functor";
import PatternMatch from "./implements/patternmatch";

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

//Algebraic Data Types
class Nothing implements Functor, PatternMatch {
    constructor() {
        
    }

    getValue(){
        return null;
    }

    map(f: Function){
        return this;
    }

    isJust(){
        return false;
    }

    isNothing(){
        return true;
    }

    caseOf(o: {Nothing: Function}){
        return o.Nothing ? o.Nothing() : throwError("Expected Nothing!");
    }
}

class Just implements Functor, PatternMatch {
    
    value: any;

    constructor(v: any){
        this.value = v;
    }

    getValue(){
        return this.value;
    }

    map(f: Function){
        return new Just(f(this.value));
    }

    isJust(){
        return true;
    }

    isNothing(){
        return false;
    }

    caseOf(o: {Just: Function}){
        return o.Just ? o.Just(this.value) : throwError("Expected Just");
    }
}

const Maybe = {
    Just: (v: any) => new Just(v),
    Nothing: (v: any) => new Nothing(),
    fromNullable: (v: any) => v ? new Just(v) : new Nothing(),
    withDefault: (def: any, v: any) => v ? new Just(v) : new Just(def),
    andThen: (cb: Function, m: Just | Nothing) => m instanceof Just ? cb.call(null, m.getValue()) : m instanceof Nothing ? m : throwError("Unexpected Type"),
    catMaybes: (ar: Array<Just|Nothing>) => ar.filter( m => m instanceof Just).map(m => m.getValue())
}

const Kudo = {
    fmap,
    caseOf,
    curry,
    ncurry,
    compose,
    Maybe
};

export default Kudo;
