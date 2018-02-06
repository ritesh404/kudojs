import { Setoid, Monad, PatternMatch, BiFunctor } from "../interfaces";
import { caseOf, throwError, isFunction } from "../functions/helpers";

abstract class Either<A, B>
  implements Setoid, BiFunctor<A, B>, Monad<B>, PatternMatch {
  _value: A | B;

  abstract equals(n: Setoid): boolean;
  abstract map<C>(f: (a: B) => C): Either<A, C>;
  abstract bimap<C, D>(fl: (a: A) => C, fr: (a: B) => D): Either<C, D>;
  abstract chain<C>(f: (a: B) => Either<A, C>): Either<A, C>;
  abstract caseOf(o: { Left: Function } | { Right: Function }): any;
  abstract swap(): Either<A, B>;
  abstract isLeft(): boolean;
  abstract isRight(): boolean;

  static of<A, B>(v: B): Either<A, B> {
    return new Right(v);
  }

  static Right<A, B>(v: B): Either<A, B> {
    return new Right(v);
  }

  static Left<A, B>(v: A): Either<A, B> {
    return new Left(v);
  }

  static fromNullable<A, B>(v: any): Either<A, B> {
    return v ? new Right(v) : new Left(v);
  }

  static withDefault<A, B>(def: any, v: any): Either<A, B> {
    return v ? new Right(v) : new Right(def);
  }

  static swap<A, B>(e: Either<A, B>) {
    return e.swap();
  }

  static try(f: Function) {
    return <A, B>(...args: Array<any>): Either<A, B> => {
      try {
        return new Right<A, B>(f.apply(null, args));
      } catch (e) {
        return new Left<A, B>(e);
      }
    };
  }

  static bimap<A, B, C, D>(e: Either<A, B>, fl: (a: A) => C, fr: (a: B) => D) {
    return e.bimap(fl, fr);
  }

  static isLeft<A, B>(v: Either<A, B>): boolean {
    return v.isLeft();
  }

  static isRight<A, B>(v: Either<A, B>): boolean {
    return v.isRight();
  }

  of<B>(v: B): Either<A, B> {
    return new Right(v);
  }

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
