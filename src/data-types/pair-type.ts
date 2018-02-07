import { Setoid, Semigroup, BiFunctor, Monad } from "../interfaces";
import { throwError, isFunction } from "../functions/helpers";

class Pair<A, B> implements Setoid, Semigroup, BiFunctor<A, B>, Monad<B> {
  _value: Array<A | B>;

  /** @function Pair
   * @constructor
   * @param {any} v1 - First element of the Pair
   * @param {any} v2 - second element of the Pair
   * @description Pair constructor
   */
  constructor(v1: A, v2: B) {
    if (v1 === undefined || v2 === undefined)
      throwError("Pair: Both first and second values must be defined");
    // _pairs.set(this, [v1, v2]);
    this._value = [v1, v2];
  }

  /** @function Pair.of
   * @constructor
   * @param {any} v - Element that will be stored as first and second element of the Pair
   * @description Pair constructor
   */
  static of<A>(v: A) {
    return new Pair(v, v);
  }

  of<A>(v: A) {
    return new Pair(v, v);
  }

  /** @function Pair.equals
   * @memberof Pair
   * @param {Pair} j - The Pair to compare with
   * @description Check if the values of the current pair is equal to the values of the passed Pair. Pairs are equal only if the first and second values of both Pairs are equal
   */
  equals(j: Pair<A, B>) {
    return <A>j.fst() === <A>this.fst() && <B>j.snd() === <B>this.snd();
  }

  /** @function Pair.concat
   * @memberof Pair
   * @param {Pair} p - Pair to concat
   * @description Concat the current pair with the passed one. Note that both first and second elements of the Pair should be of type semigroup for cancat to work
   */
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

  /** @function Pair.fst
   * @memberof Pair
   * @description Get the first element of the Pair
   */
  fst(): A {
    return <A>this.getValue()[0];
  }

  /** @function Pair.snd
   * @memberof Pair
   * @description Get the second element of the Pair
   */
  snd(): B {
    return <B>this.getValue()[1];
  }

  /** @function Pair.ap
   * @memberof Pair
   * @param {Pair} j - Pair with function as the second element
   * @description Applies the function inside the second element of the passed Pair to the current Pair and concats the first element of the second Pair to the first element of the current Pair
   */
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

  /** @function Pair.getValue
   * @memberof Pair
   * @description Get the values within the Pair as an Array of length 2
   */
  getValue() {
    return this._value;
  }

  /** @function Pair.map
   * @memberof Pair
   * @param {Function} f - Function
   * @description Apply the function to the second element of the current Pair
   */
  map<C>(f: (a: B) => C): Pair<A, C> {
    if (!isFunction(f)) throwError("Pair: Expected a function");
    return new Pair(<A>this.fst(), f(<B>this.snd()));
  }

  /** @function Pair.bimap
   * @memberof Pair
   * @param {Function} f1 - Function to be applied on the first element
   * @param {Function} f2 - Function to be applied on the second element
   * @description Apply f1 to the first element and f2 to the second element of the current Pair
   */
  bimap<C, D>(f1: (a: A) => C, f2: (a: B) => D): Pair<C, D> {
    if (!isFunction(f1) || !isFunction(f2))
      throwError("Pair: Expected functions for both parts");
    return new Pair(f1(<A>this.fst()), f2(<B>this.snd()));
  }

  /** @function Pair.chain
   * @memberof Pair
   * @param {Function} f - Function that returns another Pair
   * @description Chain together many computations that return a Pair
   */
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

  /** @function Pair.swap
   * @memberof Pair
   * @description Swap the elements of the current pair
   */
  swap() {
    const v = this.getValue();
    return new Pair(v[1], v[0]);
  }

  /** @function Pair.toString
   * @memberof Pair
   * @description Get a stringified version of the Pair
   */
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
