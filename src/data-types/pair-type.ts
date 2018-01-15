import {Setoid, Semigroup, BiFunctor, Monad, PatternMatch} from "../interfaces";
import {throwError, isFunction} from "../functions/helpers";

const _pairs = new WeakMap();
class Pair implements Setoid, Semigroup, BiFunctor, Monad {

    constructor(v1: any, v2: any){
        if(v1 === undefined || v2 === undefined) throwError("Pair: Both first and second values must be defined")
        _pairs.set(this, [v1, v2]);
    }

    equals(j: Pair){
        return j.fst() === this.fst() && j.snd() === this.snd();
    }

    // isEqual(n: any){
    //     return this.equals(n);
    // }

    concat(p: Pair){
        if(!(p instanceof Pair)) throwError("Pair: Pair required");
        const lf = this.fst()
        const ls = this.snd()
        const rf = p.fst()
        const rs = p.snd()

        if(!lf.concat || !ls.concat || !rf.concat || !rs.concat) throwError("Pair: Both Pairs must contain Semigroups");

        return new Pair(
            lf.concat(rf),
            ls.concat(rs)
        );
    }

    of(v: any){
        return new Pair(v, v);
    }

    fst(){
        return this.getValue()[0];
    }

    snd(){
        return this.getValue()[1];
    }

    ap(j: Pair): Pair{
        if(!(j instanceof Pair)) throwError("Pair: Pair required");
        const fn = this.snd();
        if(!isFunction(fn)) throwError("Pair: Second wrapped value should be a function");
        const l = this.fst();
        const r = j.fst();

        if(!l.concat && !r.concat) throwError('Pair: Types should be Semigroups');
      
      return new Pair(l.concat(r), fn(j.snd()));
    }

    getValue(){
        return _pairs.get(this);
    }

    map(f: Function){
        if(!isFunction(f)) throwError("Pair: Expected a function");
        return new Pair(this.fst(), f(this.snd()));
    }

    bimap(f1: Function, f2:Function){
        if(!isFunction(f1) || !isFunction(f2)) throwError("Pair: Expected functions for both parts");
        return new Pair(f1(this.fst()), f2(this.snd()));
    }

    chain(f: Function){
        if(!isFunction(f)) throwError("Pair: Expected a function");
        const l = this.fst();
        if(!l.concat) throwError("Pair: First value should be a Semigroup");
        const p = f(this.snd());
        if(!(p instanceof Pair)) throwError("Pair: Function must return a Pair");
        const r = p.fst();
        if(!r.concat) throwError("Pair: First value of the returned Pair should be a Semigroup");

        return new Pair(
            l.concat(r),
            p.snd()
        );
    }

    swap() {
        const v = this.getValue();
        return new Pair(v[1], v[0]);
    }

    toString(){
        const v = this.getValue();
        return `Pair(${v[0]}, ${v[1]})`;
    }

}