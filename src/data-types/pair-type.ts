import { Setoid, Semigroup, BiFunctor, Monad } from "../interfaces";
import { throwError, isFunction } from "../functions/helpers";

class Pair<A, B> implements Setoid, Semigroup, BiFunctor<A, B>, Monad<B> {
  _value: Array<A | B>;

  constructor(v1: A, v2: B) {
    if (v1 === undefined || v2 === undefined)
      throwError("Pair: Both first and second values must be defined");
    // _pairs.set(this, [v1, v2]);
    this._value = [v1, v2];
  }

  static of<A>(v: A) {
    return new Pair(v, v);
  }

  of<A>(v: A) {
    return new Pair(v, v);
  }

  equals(j: Pair<A, B>) {
    return <A>j.fst() === <A>this.fst() && <B>j.snd() === <B>this.snd();
  }

  concat(p: Pair<Semigroup, Semigroup>): Pair<A, B> {
    if (!(p instanceof Pair)) throwError("Pair: Pair required");
    const lf: any = this.fst();
    const ls: any = this.snd();
    const rf = p.fst();
    const rs = p.snd();

    if (!lf.concat || !ls.concat || !rf.concat || !rs.concat)
      throwError("Pair: Both Pairs must contain Semigroups");

    return new Pair(lf.concat(rf), ls.concat(rs));
  }

  fst(): A {
    return <A>this.getValue()[0];
  }

  snd(): B {
    return <B>this.getValue()[1];
  }

  ap<C, D>(j: Pair<C, (b: B) => D>): Pair<Semigroup, D> {
    if (!(j instanceof Pair)) throwError("Pair: Pair required");
    const fn: any = j.snd();
    if (!isFunction(fn))
      throwError("Pair: Second wrapped value should be a function");
    const l: any = this.fst();
    const r: any = j.fst();
    //console.log(l, r, fn);
    if (!l.concat || !r.concat) throwError("Pair: Types should be Semigroups");

    return new Pair(l.concat(r), fn(this.snd()));
  }

  getValue() {
    return this._value;
  }

  map<C>(f: (a: B) => C): Pair<A, C> {
    if (!isFunction(f)) throwError("Pair: Expected a function");
    return new Pair(<A>this.fst(), f(<B>this.snd()));
  }

  bimap<C, D>(f1: (a: A) => C, f2: (a: B) => D): Pair<C, D> {
    if (!isFunction(f1) || !isFunction(f2))
      throwError("Pair: Expected functions for both parts");
    return new Pair(f1(<A>this.fst()), f2(<B>this.snd()));
  }

  chain<C, D>(f: (a: B) => Pair<C, D>): Pair<C, D> {
    if (!isFunction(f)) throwError("Pair: Expected a function");
    const l: any = this.fst();
    if (!l.concat) throwError("Pair: First value should be a Semigroup");
    const p = f(<B>this.snd());
    if (!(p instanceof Pair)) throwError("Pair: Function must return a Pair");
    const r: any = p.fst();
    if (!r.concat)
      throwError(
        "Pair: First value of the returned Pair should be a Semigroup"
      );

    return new Pair(<C>l.concat(r), <D>p.snd());
  }

  swap() {
    const v = this.getValue();
    return new Pair(v[1], v[0]);
  }

  toString() {
    const v = this.getValue();
    return `Pair((${v[0]}), (${v[1]}))`;
  }
}

// @ts-ignore: implicit any
Pair.prototype["fantasy-land/equals"] = Pair.prototype.equals;
// @ts-ignore: implicit any
Pair.prototype["fantasy-land/map"] = Pair.prototype.map;
// @ts-ignore: implicit any
Pair.prototype["fantasy-land/concat"] = Pair.prototype.concat;
// @ts-ignore: implicit any
Pair.prototype["fantasy-land/bimap"] = Pair.prototype.bimap;
// @ts-ignore: implicit any
Pair.prototype["fantasy-land/chain"] = Pair.prototype.chain;
// @ts-ignore: implicit any
Pair.prototype["fantasy-land/of"] = Pair.prototype.of;
// @ts-ignore: implicit any
Pair.prototype["fantasy-land/ap"] = Pair.prototype.ap;

export default Pair;
