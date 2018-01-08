// import Functor from "../implements/functor";
// import Monad from "../implements/monad";
// import PatternMatch from "../implements/patternmatch";
import {Setoid, Apply, Applicative, Functor, Monad, PatternMatch} from "../interfaces";
import {throwError} from "../functions/helpers";

class Nothing implements Monad, PatternMatch {

    equals(n: Nothing){
       return n instanceof Nothing
    }

    of(v: any){
        return new Nothing();
    }

    ap(n: Nothing){
        return this.of(n);
    }

    getValue(){
        return null;
    }

    map(f: Function){
        return this;
    }

    chain(f: Function){
        return this
    }

    isJust(){
        return false;
    }

    isNothing(){
        return true;
    }

    toString(){
        return "Nothing()";
    }

    caseOf(o: {Nothing: Function}){
        return o.Nothing ? o.Nothing() : throwError("Expected Nothing!");
    }
}

class Just implements Monad, PatternMatch {
    
    value: any;

    constructor(v: any){
        this.value = v;
    }

    equals(j: Just){
        return j instanceof Just && j.getValue() === this.value;
    }

    of(v: any){
        return new Just(v);
    }

    ap(j: Just | Nothing): Just | Nothing | Error{
        return typeof this.value === "function" ? j.map(this.value) : throwError("Wrapped value must be a function");
    }

    getValue(){
        return this.value;
    }

    map(f: Function){
        return new Just(f(this.value));
    }

    chain(f: Function){
        return f(this.value);
    }

    isJust(){
        return true;
    }

    isNothing(){
        return false;
    }

    toString(){
        return `Just(${this.value})`;
    }

    caseOf(o: {Just: Function}){
        return o.Just ? o.Just(this.value) : throwError("Expected Just");
    }
}

const Maybe = {
    of: (v: any) => new Just(v),
    Just: (v: any): Just => new Just(v),
    Nothing: (v: any): Nothing => new Nothing(),
    fromNullable: (v: any): Just | Nothing => v ? new Just(v) : new Nothing(),
    withDefault: (def: any, v: any): Just => v ? new Just(v) : new Just(def),
    andThen: (cb: Function, m: Just | Nothing): Just | Nothing | Error => m instanceof Just ? cb.call(null, m.getValue()) : m instanceof Nothing ? m : throwError("Unexpected Type"),
    catMaybes: (ar: Array<Just|Nothing>): Array<any> => ar.filter( m => m instanceof Just).map(m => m.getValue())
}

export default Maybe;