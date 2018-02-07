import { Setoid, Monad, Alt, PatternMatch } from "../interfaces";
import { throwError, isFunction, caseOf } from "../functions/helpers";

export default abstract class Maybe<A>
  implements Setoid, Monad<A>, Alt<A>, PatternMatch {
  _value: A;

  /** @function Maybe.equals
   * @memberof Maybe
   * @param {any} n - Any Value of Type Setoid
   * @description Returns true if the current and the passed element are of Maybe type with the same value
   */
  abstract equals(n: Setoid): boolean;

  /** @function Maybe.map
   * @memberof Maybe
   * @param {Function} f - Function
   * @description Applies the passed function to the value of the current Maybe if it is a Just
   */
  abstract map<B>(f: (a: A) => B): Maybe<B>;

  /** @function Maybe.chain
   * @memberof Maybe
   * @param {Function} f - Function that returns another Maybe
   * @description An instance method that can chain together many computations that return a Maybe type
   */
  abstract chain<B>(f: (a: A) => Maybe<B>): Maybe<B>;
  abstract caseOf(o: { Nothing: Function } | { Just: Function }): any;

  /** @function Maybe.isNothing
   * @memberof Maybe
   * @description An instance method that returns true if the current Maybe is a Nothing
   */
  abstract isNothing(): boolean;

  /** @function Maybe.isJust
   * @memberof Maybe
   * @description An instance method that returns true if the current Maybe is a Nothing
   */
  abstract isJust(): boolean;

  /** @function Maybe.of
   * @constructor
   * @memberof Maybe
   * @param {any} v - Value
   * @description Creates a Just
   */
  static of<A>(v: A): Maybe<A> {
    return new Just(v);
  }

  /** @function Maybe.zero
   * @constructor
   * @memberof Maybe
   * @description Creats a Nothing
   */
  static zero<A>(): Maybe<A> {
    return new Nothing();
  }

  /** @function Maybe.Just
   * @constructor
   * @memberof Maybe
   * @param {any} v - Value
   * @description Creates a Just
   */
  static Just<A>(v: A): Maybe<A> {
    return new Just(v);
  }

  /** @function Maybe.Nothing
   * @constructor
   * @memberof Maybe
   * @description Creats a Nothing
   */
  static Nothing<A>(): Maybe<A> {
    return new Nothing();
  }

  /** @function Maybe.fromNullable
   * @constructor
   * @memberof Maybe
   * @param {any} v - Value
   * @description Creates a Just if the value is not null or undefiend else creates a Nothing
   */
  static fromNullable<A>(v: any): Maybe<A> {
    return v !== null ? new Just(v) : new Nothing();
  }

  /** @function Maybe.withDefault
   * @constructor
   * @memberof Maybe
   * @param {any} def - Value
   * @param {any} v - Value
   * @description Creates a Just if the value v is not null or undefiend else creates a Just with the default value def
   */
  static withDefault<A>(def: any, v: any): Maybe<A> {
    return v !== null ? new Just(v) : new Just(def);
  }

  /** @function Maybe.catMaybes
   * @memberof Maybe
   * @param {Array<any>} ar - Array of Maybes
   * @description A static method that takes an Array of Maybes and returns back an Array of values of all the Just in the passed Array
   */
  static catMaybes<A>(ar: Array<Maybe<A>>): Array<any> {
    return ar.filter(m => m.isJust()).map(m => m.getValue());
  }

  /** @function Maybe.isNothing
   * @memberof Maybe
   * @param {any} v - Maybe
   * @description A static method that returns true if the passed Maybe is a Nothing
   */
  static isNothing<A>(v: Maybe<A>): boolean {
    return v.isNothing();
  }

  /** @function Maybe.isJust
   * @memberof Maybe
   * @param {any} v - Maybe
   * @description A static method that returns true if the passed Maybe is a Just
   */
  static isJust<A>(v: Maybe<A>): boolean {
    return v.isJust();
  }

  of<A>(v: A): Maybe<A> {
    return new Just(v);
  }

  /** @function Maybe.alt
   * @memberof Maybe
   * @param {any} v - Maybe
   * @description An instance method that returns the current maybe if it is a Just else returns the passed Maybe
   */
  alt<B>(v: Maybe<B>): Maybe<B> {
    return caseOf(
      {
        Nothing: (x: any) => v,
        Just: (x: any) => this
      },
      this
    );
  }

  /** @function Maybe.ap
   * @memberof Maybe
   * @param {any} j - Maybe with a function
   * @description Applies the function inside the passed Maybe to the current Maybe if it is a Just
   */
  ap<B>(j: Maybe<(a: A) => B>): Maybe<B> {
    if (!isFunction(j.getValue()))
      throwError("Maybe: Wrapped value is not a function");

    return caseOf(
      {
        Nothing: (v: A) => j,
        Just: (v: (a: A) => B) => this.map(v)
      },
      j
    );
  }

  /** @function Maybe.getValue
   * @memberof Maybe
   * @description Get the value within the Maybe
   */
  getValue(): A {
    return this._value;
  }
}
// @ts-ignore: implicit any
Maybe.prototype["fantasy-land/equals"] = Maybe.prototype.equals;
// @ts-ignore: implicit any
Maybe.prototype["fantasy-land/map"] = Maybe.prototype.map;
// @ts-ignore: implicit any
Maybe.prototype["fantasy-land/chain"] = Maybe.prototype.chain;
// @ts-ignore: implicit any
Maybe.prototype["fantasy-land/of"] = Maybe.prototype.of;
// @ts-ignore: implicit any
Maybe.prototype["fantasy-land/zero"] = Maybe.prototype.zero;
// @ts-ignore: implicit any
Maybe.prototype["fantasy-land/ap"] = Maybe.prototype.ap;

export class Nothing<A> extends Maybe<A> {
  equals(n: Setoid): boolean {
    return n instanceof Nothing && n.isNothing && n.isNothing();
  }

  map<B>(f: (a: A) => B): Maybe<B> {
    return new Nothing();
  }

  chain<B>(f: (a: A) => Maybe<B>): Maybe<B> {
    return new Nothing();
  }

  isJust() {
    return false;
  }

  isNothing() {
    return true;
  }

  toString() {
    return "Nothing()";
  }

  caseOf(o: { Nothing: Function }) {
    return o.Nothing ? o.Nothing() : throwError("Maybe: Expected Nothing!");
  }
}

export class Just<A> extends Maybe<A> {
  constructor(v: any) {
    super();
    this._value = v;
  }

  equals(j: Setoid): boolean {
    return (
      j instanceof Just &&
      j.isJust &&
      j.isJust() &&
      j.getValue() === this.getValue()
    );
  }

  map<B>(f: (a: A) => B): Maybe<B> {
    if (!isFunction(f)) throwError("Maybe: Expected a function");
    return new Just(f(this.getValue()));
  }

  chain<B>(f: (a: A) => Maybe<B>): Maybe<B> {
    if (!isFunction(f)) throwError("Maybe: Expected a function");
    return f(this.getValue());
  }

  isJust() {
    return true;
  }

  isNothing() {
    return false;
  }

  toString() {
    return `Just(${this.getValue()})`;
  }

  caseOf(o: { Just: Function }) {
    return o.Just
      ? o.Just(this.getValue())
      : throwError("Maybe: Expected Just");
  }
}
