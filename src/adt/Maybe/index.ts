import caseOf from "../../function/caseOf";
import curry from "../../function/curry";
import isFunction from "../../function/isFunction";
import Alt from "../../interface/Alt";
import Monad from "../../interface/Monad";
import PatternMatch from "../../interface/Patternmatch";
import Setoid from "../../interface/Setoid";
import Either from "./../Either";

export default abstract class Maybe<A>
    implements Setoid, Monad<A>, Alt<A>, PatternMatch
{
    protected _value!: A;

    public static of<B>(v: B): Maybe<B> {
        return new Just(v);
    }

    public static zero<B>(): Maybe<B> {
        return new Nothing();
    }

    public static Just<B>(v: B): Maybe<B> {
        return new Just(v);
    }

    public static Nothing<B>(): Maybe<B> {
        return new Nothing();
    }

    public static fromNullable<B>(v: any): Maybe<B> {
        return v !== undefined && v !== null ? new Just(v) : new Nothing();
    }

    public static withDefault<B>(def: any, v: any): Maybe<B> {
        return v !== undefined && v !== null ? new Just(v) : new Just(def);
    }

    public static catMaybes<B>(ar: Array<Maybe<B>>): Array<any> {
        return ar.filter((m) => m.isJust()).map((m) => m.getValue());
    }

    public static isNothing<B>(v: Maybe<B>): boolean {
        return v.isNothing();
    }

    public static isJust<B>(v: Maybe<B>): boolean {
        return v.isJust();
    }
    public of<A>(v: A): Maybe<A> {
        return new Just(v);
    }

    public alt<B>(v: Maybe<B>): Maybe<B> {
        return caseOf(
            {
                Nothing: (x: A) => v,
                Just: (x: A) => this,
            },
            this,
        );
    }

    public ap<B, C>(j: Maybe<B>): Maybe<C> {
        return this.caseOf({
            Nothing: () => new Nothing(),
            Just: (f: A) => {
                if (!isFunction(f))
                    throw Error("Maybe: Wrapped value is not a function");
                return j.map(f as unknown as (b: B) => C);
            },
        });
    }

    public getValue(): A {
        return this._value;
    }

    public abstract equals(n: Setoid): boolean;

    public abstract map<B>(f: (a: A) => B): Maybe<B>;

    public abstract chain<B>(f: (a: A) => Maybe<B>): Maybe<B>;

    public abstract caseOf<T>(o: { Nothing: () => T; Just: (a: A) => T }): T;

    public abstract isNothing(): boolean;

    public abstract isJust(): boolean;
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
    public equals(n: Setoid): boolean {
        return n instanceof Nothing && n.isNothing && n.isNothing();
    }

    public map<B>(f: (a: A) => B): Maybe<B> {
        return new Nothing();
    }

    public chain<B>(f: (a: A) => Maybe<B>): Maybe<B> {
        return new Nothing();
    }

    public isJust() {
        return false;
    }

    public isNothing() {
        return true;
    }

    public toString() {
        return "Nothing()";
    }

    public caseOf<B>(o: { Nothing: () => B; Just: (a: A) => B }) {
        if (!o.Just) throw new Error("Maybe: case for Just missing");
        if (o.Nothing) return o.Nothing();
        else throw Error("Maybe: Expected Nothing!");
    }
}

export class Just<A> extends Maybe<A> {
    public constructor(v: any) {
        super();
        this._value = v;
    }

    public equals(j: Setoid): boolean {
        return (
            j instanceof Just &&
            j.isJust &&
            j.isJust() &&
            j.getValue() === this.getValue()
        );
    }

    public map<B>(f: (a: A) => B): Maybe<B> {
        if (!isFunction(f)) throw Error("Maybe: Expected a function");
        return new Just(f(this.getValue()));
    }

    public chain<B>(f: (a: A) => Maybe<B>): Maybe<B> {
        if (!isFunction(f)) throw Error("Maybe: Expected a function");
        return f(this.getValue());
    }

    public isJust() {
        return true;
    }

    public isNothing() {
        return false;
    }

    public toString() {
        return `Just(${this.getValue()})`;
    }

    public caseOf<B>(o: { Just: (a: A) => B; Nothing: () => B }) {
        if (!o.Nothing) throw new Error("Maybe: case for Nothing missing");
        if (o.Just) return o.Just(this.getValue());
        else throw Error("Maybe: Expected Just");
    }
}

export const eitherToMaybe = <A, B>(e: Either<A, B>) =>
    caseOf(
        {
            Left: (v: A) => Maybe.Nothing(),
            Right: (v: B) => Maybe.Just(v),
        },
        e,
    );

const _prop = <A>(
    key: string | number,
    o: { [k: string]: A; [k: number]: A },
): Maybe<A> => {
    if (typeof key !== "string" && typeof key !== "number")
        throw Error("Key should be either string or number");
    if (!o) return Maybe.Nothing();
    return key in o ? Maybe.fromNullable(o[key]) : Maybe.Nothing();
};
export const prop = curry(_prop);

function _pick(arr: Array<string>, o: any) {
    if (!o || arr.length <= 0) return Maybe.Nothing();
    const v = arr.reduce((acc: any, key) => {
        if (o[key]) acc[key] = o[key];
        return acc;
    }, {});

    return Object.keys(v).length > 0 ? Maybe.Just(v) : Maybe.Nothing();
}
export const pick = curry(_pick);
