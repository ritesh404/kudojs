import { Setoid, Monad, Alt, PatternMatch } from "../interfaces";
import { throwError, isFunction, caseOf } from "../functions/helpers";

export default abstract class Maybe<A>
  implements Setoid, Monad<A>, Alt<A>, PatternMatch {
  _value: A;

  abstract equals(n: Setoid): boolean;
  abstract map<B>(f: (a: A) => B): Maybe<B>;
  abstract chain<B>(f: (a: A) => Maybe<B>): Maybe<B>;
  abstract caseOf(o: { Nothing: Function } | { Just: Function }): any;
  abstract isNothing(): boolean;
  abstract isJust(): boolean;

  static of<A>(v: A): Maybe<A> {
    return new Just(v);
  }

  static zero<A>(): Maybe<A> {
    return new Nothing();
  }

  static Just<A>(v: A): Maybe<A> {
    return new Just(v);
  }

  static Nothing<A>(): Maybe<A> {
    return new Nothing();
  }

  static fromNullable<A>(v: any): Maybe<A> {
    return v ? new Just(v) : new Nothing();
  }

  static withDefault<A>(def: any, v: any): Maybe<A> {
    return v ? new Just(v) : new Just(def);
  }

  static catMaybes<A>(ar: Array<Maybe<A>>): Array<any> {
    return ar.filter(m => m.isJust()).map(m => m.getValue());
  }

  static isNothing<A>(v: Maybe<A>): boolean {
    return v.isNothing();
  }

  static isJust<A>(v: Maybe<A>): boolean {
    return v.isJust();
  }

  of<A>(v: A): Maybe<A> {
    return new Just(v);
  }

  alt<B>(v: Maybe<B>): Maybe<B> {
    return caseOf(
      {
        Nothing: (x: any) => v,
        Just: (x: any) => this
      },
      this
    );
  }

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
