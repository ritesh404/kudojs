// import Functor from "../implements/functor";
// import Monad from "../implements/monad";
// import PatternMatch from "../implements/patternmatch";
import {Setoid, Monad, PatternMatch} from "../interfaces";
import {throwError, isFunction} from "../functions/helpers";

class Nothing implements Setoid, Monad, PatternMatch {

    equals(n: Nothing){
       return n instanceof Nothing
    }

    // isEqual(n: Nothing){
    //     return this.equals(n);
    // }

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
        return o.Nothing ? o.Nothing() : throwError("Maybe: Expected Nothing!");
    }
}

const _justs = new WeakMap();
class Just implements Setoid, Monad, PatternMatch {

    constructor(v: any){
        _justs.set(this, v);
    }

    equals(j: Just){
        return j instanceof Just && j.getValue() === this.getValue();
    }

    // isEqual(n: Just){
    //     return this.equals(n);
    // }

    of(v: any){
        return new Just(v);
    }

    ap(j: Just | Nothing): Just | Nothing{
        if(!isFunction(this.getValue())) throwError("Maybe: Wrapped value is not a function");
        return j.map(this.getValue());
    }

    getValue(){
        return _justs.get(this);
    }

    map(f: Function){
        if(!isFunction(f)) throwError("Maybe: Expected a function");
        return new Just(f(this.getValue()));
    }

    chain(f: Function){
        if(!isFunction(f)) throwError("Maybe: Expected a function");
        return f(this.getValue());
    }

    isJust(){
        return true;
    }

    isNothing(){
        return false;
    }

    toString(){
        return `Just(${this.getValue()})`;
    }

    caseOf(o: {Just: Function}){
        return o.Just ? o.Just(this.getValue()) : throwError("Maybe: Expected Just");
    }
}

const Maybe = {
    of: (v: any) => new Just(v),
    Just: (v: any): Just => new Just(v),
    Nothing: (v: any): Nothing => new Nothing(),
    fromNullable: (v: any): Just | Nothing => v ? new Just(v) : new Nothing(),
    withDefault: (def: any, v: any): Just => v ? new Just(v) : new Just(def),
    andThen: (cb: Function, m: Just | Nothing): Just | Nothing | Error => m instanceof Just ? cb.call(null, m.getValue()) : m instanceof Nothing ? m : throwError("Maybe: Unexpected Type"),
    catMaybes: (ar: Array<Just|Nothing>): Array<any> => ar.filter( m => m instanceof Just).map(m => m.getValue()),
    isJust: (v: Just| Nothing) => v.isJust(),
    isNothing: (v: Just| Nothing) => v.isNothing()
}

export default Maybe;