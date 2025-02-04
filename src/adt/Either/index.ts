import caseOf from "../../function/caseOf";
import isFunction from "../../function/isFunction";
import BiFunctor from "../../interface/Bifunctor";
import Monad from "../../interface/Monad";
import PatternMatch from "../../interface/Patternmatch";
import Setoid from "../../interface/Setoid";
import Maybe from "../Maybe";

abstract class Either<A, B>
    implements Setoid, BiFunctor<A, B>, Monad<B>, PatternMatch
{
    protected _value!: A | B;

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
        return v !== null && v !== undefined ? new Right(v) : new Left(v);
    }

    public static withDefault<A, B>(
        def: B | null | undefined,
        v: B,
    ): Either<A, B> {
        if (def === null || def === undefined) return new Right(v);
        return new Right(def);
    }

    public static swap<C, D>(e: Either<C, D>) {
        return e.swap();
    }

    public static try(f: Function) {
        return <C, D>(...args: Array<unknown>): Either<C, D> => {
            try {
                return new Right<C, D>(f.apply(null, args));
            } catch (e) {
                return new Left<C, D>(e as C);
            }
        };
    }

    public static bimap<G, K, C, D>(
        e: Either<G, K>,
        fl: (a: G) => C,
        fr: (b: K) => D,
    ) {
        return e.bimap(fl, fr);
    }

    public static isLeft<C, D>(v: Either<C, D>): boolean {
        return v.isLeft();
    }

    public static isRight<C, D>(v: Either<C, D>): boolean {
        return v.isRight();
    }

    public of(v: B): Either<A, B> {
        return new Right<A, B>(v);
    }

    public ap<C, D, E>(j: Either<C, D>): Either<C, E> {
        return this.caseOf({
            Left: (v: A) => j as unknown as Either<C, E>,
            Right: (v: B) => {
                if (!isFunction(v))
                    throw Error("Either: Wrapped value is not a function");
                return j.map(v as unknown as (a: D) => E);
            },
        });
    }

    public getValue(): A | B {
        return this._value;
    }
    public abstract equals(n: Setoid): boolean;

    public abstract map<C>(f: (a: B) => C): Either<A, C>;

    public abstract bimap<C, D>(fl: (a: A) => C, fr: (a: B) => D): Either<C, D>;

    public abstract chain<C>(f: (a: B) => Either<A, C>): Either<A, C>;

    public abstract caseOf<T>(o: { Left: (a: A) => T; Right: (a: B) => T }): T;

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

    public caseOf<C>(o: { Left: (a: A) => C; Right: (a: B) => C }): C {
        if (!o.Right) throw new Error("Either: case for Right missing");
        if (o.Left) return o.Left(this.getValue() as A);
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

    public caseOf<C>(o: { Right: (a: B) => C; Left: (a: A) => C }): C {
        if (!o.Left) throw new Error("Either: case for Left missing");
        if (o.Right) return o.Right(this.getValue() as B);
        else throw Error("Either: Expected Right");
    }
}

export default Either;

export const maybeToEither = <A>(m: Maybe<A>) =>
    caseOf(
        {
            Nothing: (v: any) => Either.Left(null),
            Just: (v: any) => Either.Right(v),
        },
        m,
    );
