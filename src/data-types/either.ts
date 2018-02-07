import { Setoid, Monad, PatternMatch, BiFunctor } from "../interfaces";
import { caseOf, throwError, isFunction } from "../functions/helpers";

abstract class Either<A, B>
  implements Setoid, BiFunctor<A, B>, Monad<B>, PatternMatch {
  _value: A | B;

  /** @function Either.equals
   * @memberof Either
   * @param {any} n - Any Value of Type Setoid
   * @description Returns true if the current and the passed element are of Either type with the same value
   */
  abstract equals(n: Setoid): boolean;

  /** @function Either.map
   * @memberof Either
   * @param {Function} f - Function
   * @description Applies the passed function to the value of the current Either if it is a Just
   */
  abstract map<C>(f: (a: B) => C): Either<A, C>;

  /** @function Either.bimap
   * @memberof Either
   * @param {Function} fl - Function to be applied on the Left element
   * @param {Function} fr - Function to be applied on the Right element
   * @description Apply fl to the Left element or fr to the Right element of the current Either
   */
  abstract bimap<C, D>(fl: (a: A) => C, fr: (a: B) => D): Either<C, D>;

  /** @function Either.chain
   * @memberof Either
   * @param {Function} f - Function that returns another Either
   * @description An instance method that can chain together many computations that return a Either type
   */
  abstract chain<C>(f: (a: B) => Either<A, C>): Either<A, C>;
  abstract caseOf(o: { Left: Function } | { Right: Function }): any;

  /** @function Either.swap
   * @memberof Either
   * @description Swap the Left and Right elements of the current Either
   */
  abstract swap(): Either<A, B>;

  /** @function Either.isLeft
   * @memberof Either
   * @description An instance method that returns true if the current Either is a Left
   */
  abstract isLeft(): boolean;

  /** @function Either.isRight
   * @memberof Either
   * @description An instance method that returns true if the current Either is a Right
   */
  abstract isRight(): boolean;

  /** @function Either.of
   * @constructor
   * @memberof Either
   * @param {any} v - Value
   * @description Creates a Right Either
   */
  static of<A, B>(v: B): Either<A, B> {
    return new Right(v);
  }

  /** @function Either.Right
   * @constructor
   * @memberof Either
   * @param {any} v - Value
   * @description Creates a Right Either
   */
  static Right<A, B>(v: B): Either<A, B> {
    return new Right(v);
  }

  /** @function Either.Left
   * @constructor
   * @memberof Either
   * @param {any} v - Value
   * @description Creates a Left Either
   */
  static Left<A, B>(v: A): Either<A, B> {
    return new Left(v);
  }

  /** @function Either.fromNullable
   * @constructor
   * @memberof Either
   * @param {any} v - Value
   * @description Creates a Right if the value is not null or undefiend else creates a Left
   */
  static fromNullable<A, B>(v: any): Either<A, B> {
    return v ? new Right(v) : new Left(v);
  }

  /** @function Either.withDefault
   * @constructor
   * @memberof Either
   * @param {any} def - Value
   * @param {any} v - Value
   * @description Creates a Right if the value v is not null or undefiend else creates a Right with the default value def
   */
  static withDefault<A, B>(def: any, v: any): Either<A, B> {
    return v ? new Right(v) : new Right(def);
  }

  /** @function Either.swap
   * @memberof Either
   * @description Swap the Left and Right elements of the current Either
   */
  static swap<A, B>(e: Either<A, B>) {
    return e.swap();
  }

  /** @function Either.try
   * @memberof Either
   * @param {Function} f - A function that may throw an error
   * @description * Executes the passed function that may throw and converts it to an Either type.
   */
  static try(f: Function) {
    return <A, B>(...args: Array<any>): Either<A, B> => {
      try {
        return new Right<A, B>(f.apply(null, args));
      } catch (e) {
        return new Left<A, B>(e);
      }
    };
  }

  /** @function Either.bimap
   * @memberof Either
   * @param {any} e - Etiher type
   * @param {Function} fl - Function to be applied on the Left element
   * @param {Function} fr - Function to be applied on the Right element
   * @description A static method that applies fl to the Left element or fr to the Right element of the current Either
   */
  static bimap<A, B, C, D>(e: Either<A, B>, fl: (a: A) => C, fr: (a: B) => D) {
    return e.bimap(fl, fr);
  }

  /** @function Either.isLeft
   * @memberof Either
   * @description An static method that returns true if the current Either is a Left
   */
  static isLeft<A, B>(v: Either<A, B>): boolean {
    return v.isLeft();
  }

  /** @function Either.isRight
   * @memberof Either
   * @description An static method that returns true if the current Either is a Right
   */
  static isRight<A, B>(v: Either<A, B>): boolean {
    return v.isRight();
  }

  of<B>(v: B): Either<A, B> {
    return new Right(v);
  }

  /** @function Either.ap
   * @memberof Either
   * @param {any} j - Either with a function
   * @description Applies the function inside the passed Either to the current Either if it is a Right
   */
  ap<C>(j: Either<A, (a: B) => C>): Either<B, C> {
    if (!isFunction(j.getValue()))
      throwError("Either: Wrapped value is not a function");

    return caseOf(
      {
        Left: (v: A) => j,
        Right: (v: (a: B) => C) => this.map(v)
      },
      j
    );
  }

  /** @function Either.getValue
   * @memberof Either
   * @description Get the value within the Either
   */
  getValue(): A | B {
    return this._value;
  }
}
// @ts-ignore: implicit any
Either.prototype["fantasy-land/equals"] = Either.prototype.equals;
// @ts-ignore: implicit any
Either.prototype["fantasy-land/map"] = Either.prototype.map;
// @ts-ignore: implicit any
Either.prototype["fantasy-land/bimap"] = Either.prototype.bimap;
// @ts-ignore: implicit any
Either.prototype["fantasy-land/chain"] = Either.prototype.chain;
// @ts-ignore: implicit any
Either.prototype["fantasy-land/of"] = Either.prototype.of;
// @ts-ignore: implicit any
Either.prototype["fantasy-land/ap"] = Either.prototype.ap;

class Left<A, B> extends Either<A, B> {
  constructor(v: A) {
    super();
    this._value = v;
  }

  equals(n: Setoid): boolean {
    return (
      n instanceof Left &&
      n.isLeft &&
      n.isLeft() &&
      n.getValue() === this.getValue()
    );
  }

  map<C>(f: (a: B) => C): Either<A, C> {
    return new Left<A, C>(<A>this.getValue());
  }

  bimap<C, D>(fl: (a: A) => C, fr: (a: B) => D): Either<C, D> {
    return new Left(fl(<A>this.getValue()));
  }

  chain<C>(f: (a: B) => Either<A, C>): Either<A, C> {
    return new Left<A, C>(<A>this.getValue());
  }

  isRight() {
    return false;
  }

  isLeft() {
    return true;
  }

  swap(): Either<A, B> {
    return new Right<A, B>(<B>this.getValue());
  }

  toString() {
    return `Left(${this.getValue()})`;
  }

  caseOf(o: { Left: Function }) {
    return o.Left
      ? o.Left(this.getValue())
      : throwError("Either: Expected Left!");
  }
}

class Right<A, B> extends Either<A, B> {
  constructor(v: B) {
    super();
    this._value = v;
  }

  equals(j: Setoid): boolean {
    return (
      j instanceof Right &&
      j.isRight &&
      j.isRight() &&
      j.getValue() === this.getValue()
    );
  }

  map<C>(f: (a: B) => C): Either<A, C> {
    if (!isFunction(f)) throwError("Either: Expected a function");
    return new Right<A, C>(f(<B>this.getValue()));
  }

  bimap<C, D>(fl: (a: A) => C, fr: (a: B) => D): Either<C, D> {
    return new Right(fr(<B>this.getValue()));
  }

  chain<C>(f: (a: B) => Either<A, C>): Either<A, C> {
    if (!isFunction(f)) throwError("Either: Expected a function");
    return f(<B>this.getValue());
  }

  isRight() {
    return true;
  }

  isLeft() {
    return false;
  }

  swap(): Either<A, B> {
    return new Left<A, B>(<A>this.getValue());
  }

  toString() {
    return `Right(${this.getValue()})`;
  }

  caseOf(o: { Right: Function }) {
    return o.Right
      ? o.Right(this.getValue())
      : throwError("Either: Expected Right");
  }
}

export default Either;
