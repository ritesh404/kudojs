import { Setoid, Monad, PatternMatch, BiFunctor } from "../interfaces";
import { throwError, isFunction } from "../functions/helpers";

const _lefts = new WeakMap();
class Left implements Setoid, BiFunctor, Monad, PatternMatch {
  constructor(v: any) {
    _lefts.set(this, v);
  }

  equals(n: Setoid): boolean {
    return (
      n instanceof Left &&
      n.isLeft &&
      n.isLeft() &&
      n.getValue() === this.getValue()
    );
  }

  // isEqual(n: any){
  //     return this.equals(n);
  // }

  of(v: any) {
    return new Left(v);
  }

  ap(n: Left) {
    return this;
  }

  getValue() {
    return _lefts.get(this);
  }

  map(f: Function) {
    return this;
  }

  bimap(f: Function, _: Function): Left {
    return this.of(f(this.getValue()));
  }

  chain(f: Function) {
    return this;
  }

  isRight() {
    return false;
  }

  isLeft() {
    return true;
  }

  swap() {
    return new Right(this.getValue());
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

const _rights = new WeakMap();
class Right implements Setoid, BiFunctor, Monad, PatternMatch {
  constructor(v: any) {
    _rights.set(this, v);
  }

  equals(j: Setoid): boolean {
    return (
      j instanceof Right &&
      j.isRight &&
      j.isRight() &&
      j.getValue() === this.getValue()
    );
  }

  // isEqual(n: any){
  //     return this.equals(n);
  // }

  of(v: any) {
    return new Right(v);
  }

  ap(j: Right | Left): Right | Left {
    if (!isFunction(j.getValue()))
      throwError("Either: Wrapped value is not a function");
    return this.map(j.getValue());
  }

  getValue() {
    return _rights.get(this);
  }

  map(f: Function) {
    if (!isFunction(f)) throwError("Either: Expected a function");
    return new Right(f(this.getValue()));
  }

  bimap(_: Function, f: Function): Right {
    return this.of(f(this.getValue()));
  }

  chain(f: Function) {
    if (!isFunction(f)) throwError("Either: Expected a function");
    return f(this.getValue());
  }

  isRight() {
    return true;
  }

  isLeft() {
    return false;
  }

  swap() {
    return new Left(this.getValue());
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

const Either = {
  of: (v: any) => new Right(v),
  Right: (v: any): Right => new Right(v),
  Left: (v: any): Left => new Left(v),
  fromNullable: (v: any): Right | Left => (v ? new Right(v) : new Left(v)),
  withDefault: (def: any, v: any): Right => (v ? new Right(v) : new Right(def)),
  swap: (e: Left | Right) => e.swap(),
  try: (f: Function) => (...args: Array<any>) => {
    try {
      return new Right(f.apply(null, args));
    } catch (error) {
      return new Left(error);
    }
  },
  bimap: (e: Left | Right, fl: Function, fr: Function): Left | Right =>
    e.bimap(fl, fr),
  isLeft: (v: Left | Right) => v.isLeft && v.isLeft(),
  isRight: (v: Left | Right) => v.isRight && v.isRight()
};

export default Either;
