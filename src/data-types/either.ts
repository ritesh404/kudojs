import caseOf from "../functions/caseOf";
import isFunction from "../functions/isFunction";
import BiFunctor from "../interfaces/bifunctor";
import Monad from "../interfaces/monad";
import PatternMatch from "../interfaces/patternmatch";
import Setoid from "../interfaces/setoid";
import Maybe from "./maybe";

abstract class Either<A, B>
    implements Setoid, BiFunctor<A, B>, Monad<B>, PatternMatch {
    protected _value: A | B;

    public static of<C, D>(v: D): Either<C, D> {
        return new Right(v);
    }

    public static Right<C, D>(v: D): Either<C, D> {
        return new Right(v);
    }

    public static Left<C, D>(v: C): Either<C, D> {
        return new Left(v);
    }

    public static fromNullable<C, D>(v: any): Either<C, D> {
        return v !== null || v !== undefined ? new Right(v) : new Left(v);
    }

    public static withDefault<C, D, F>(
        def: any,
        v: Either<F, D>
    ): Either<C, D> {
        return v.caseOf({ Left: () => Either.of(def), Right: () => v });
    }

    public static swap<C, D>(e: Either<C, D>) {
        return e.swap();
    }

    public static try(f: Function) {
        return <C, D>(...args: Array<any>): Either<C, D> => {
            try {
                return new Right<C, D>(f.apply(null, args));
            } catch (e) {
                return new Left<C, D>(e);
            }
        };
    }

    public static bimap<G, K, C, D>(
        e: Either<G, K>,
        fl: (a: G) => C,
        fr: (b: K) => D
    ) {
        return e.bimap(fl, fr);
    }

    public static isLeft<C, D>(v: Either<C, D>): boolean {
        return v.isLeft();
    }

    public static isRight<C, D>(v: Either<C, D>): boolean {
        return v.isRight();
    }
    // @ts-ignore
    public of<C>(v: C): Either<A, C> {
        return new Right(v);
    }

    // @ts-ignore
    public ap<C, D>(j: Either<C, B>): Either<C, D> {
        return this.caseOf({
            Left: (v: A) => j,
            Right: (v: (a: B) => D) => {
                if (!isFunction(v))
                    throw Error("Either: Wrapped value is not a function");

                return j.map(v);
            }
        });
    }

    public getValue(): A | B {
        return this._value;
    }
    public abstract equals(n: Setoid): boolean;

    public abstract map<C>(f: (a: B) => C): Either<A, C>;

    public abstract bimap<C, D>(fl: (a: A) => C, fr: (a: B) => D): Either<C, D>;

    // @ts-ignore
    public abstract chain<C>(f: (a: B) => Either<A, C>): Either<A, C>;

    public abstract caseOf(o: {
        Left: (a: any) => any;
        Right: (a: any) => any;
    }): any;

    public abstract swap(): Either<A, B>;

    public abstract isLeft(): boolean;

    public abstract isRight(): boolean;
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
    public constructor(v: A) {
        super();
        this._value = v;
    }

    public equals(n: Setoid): boolean {
        return (
            n instanceof Left &&
            n.isLeft &&
            n.isLeft() &&
            n.getValue() === this.getValue()
        );
    }

    public map<C>(f: (a: B) => C): Either<A, C> {
        return new Left<A, C>(<A>this.getValue());
    }

    public bimap<C, D>(fl: (a: A) => C, fr: (a: B) => D): Either<C, D> {
        return new Left(fl(<A>this.getValue()));
    }

    public chain<C>(f: (a: B) => Either<A, C>): Either<A, C> {
        return new Left<A, C>(<A>this.getValue());
    }

    public isRight() {
        return false;
    }

    public isLeft() {
        return true;
    }

    public swap(): Either<A, B> {
        return new Right<A, B>(<B>this.getValue());
    }

    public toString() {
        return `Left(${this.getValue()})`;
    }

    public caseOf(o: { Left: Function }) {
        if (o.Left) return o.Left(this.getValue());
        else throw Error("Either: Expected Left!");
    }
}

class Right<A, B> extends Either<A, B> {
    public constructor(v: B) {
        super();
        this._value = v;
    }

    public equals(j: Setoid): boolean {
        return (
            j instanceof Right &&
            j.isRight &&
            j.isRight() &&
            j.getValue() === this.getValue()
        );
    }

    public map<C>(f: (a: B) => C): Either<A, C> {
        if (!isFunction(f)) throw Error("Either: Expected a function to map");
        return new Right<A, C>(f(<B>this.getValue()));
    }

    public bimap<C, D>(fl: (a: A) => C, fr: (a: B) => D): Either<C, D> {
        return new Right(fr(<B>this.getValue()));
    }

    public chain<C>(f: (a: B) => Either<A, C>): Either<A, C> {
        if (!isFunction(f)) throw Error("Either: Expected a function to chain");
        return f(<B>this.getValue());
    }

    public isRight() {
        return true;
    }

    public isLeft() {
        return false;
    }

    public swap(): Either<A, B> {
        return new Left<A, B>(<A>this.getValue());
    }

    public toString() {
        return `Right(${this.getValue()})`;
    }

    public caseOf(o: { Right: Function }) {
        if (o.Right) return o.Right(this.getValue());
        else throw Error("Either: Expected Right");
    }
}

export default Either;

export const maybeToEither = <A>(m: Maybe<A>) =>
    caseOf(
        {
            Nothing: (v: any) => Either.Left(null),
            Just: (v: any) => Either.Right(v)
        },
        m
    );
