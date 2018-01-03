import Functor from "../implements/functor";
import PatternMatch from "../implements/patternmatch";
import {throwError} from "../functions/helpers";

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

export default Maybe;