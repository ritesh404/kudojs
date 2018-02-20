import { caseOf, isFunction, throwError } from "../functions/helpers";
import { Alt, Monad, PatternMatch, Setoid } from "../interfaces";
import Either from "./either";

export default abstract class Maybe<A>
    implements Setoid, Monad<A>, Alt<A>, PatternMatch {
    /**
     * @function Maybe.of
     * @constructor
     * @memberof Maybe
     * @param {any} v - Value
     * @description Creates a Just
     */
    public static of<A>(v: A): Maybe<A> {
        return new Just(v);
    }

    /**
     * @function Maybe.zero
     * @constructor
     * @memberof Maybe
     * @description Creats a Nothing
     */
    public static zero<A>(): Maybe<A> {
        return new Nothing();
    }

    /**
     * @function Maybe.Just
     * @constructor
     * @memberof Maybe
     * @param {any} v - Value
     * @description Creates a Just
     */
    public static Just<A>(v: A): Maybe<A> {
        return new Just(v);
    }

    /**
     * @function Maybe.Nothing
     * @constructor
     * @memberof Maybe
     * @description Creats a Nothing
     */
    public static Nothing<A>(): Maybe<A> {
        return new Nothing();
    }

    /**
     * @function Maybe.fromNullable
     * @constructor
     * @memberof Maybe
     * @param {any} v - Value
     * @description Creates a Just if the value is not null or undefiend else creates a Nothing
     */
    public static fromNullable<A>(v: any): Maybe<A> {
        return v !== null ? new Just(v) : new Nothing();
    }

    /**
     * @function Maybe.withDefault
     * @constructor
     * @memberof Maybe
     * @param {any} def - Value
     * @param {any} v - Value
     * @description Creates a Just if the value v is not null or undefiend else creates a Just with the default value def
     */
    public static withDefault<A>(def: any, v: any): Maybe<A> {
        return v !== null ? new Just(v) : new Just(def);
    }

    /**
     * @function Maybe.catMaybes
     * @memberof Maybe
     * @param {Array<any>} ar - Array of Maybes
     * @description A static method that takes an Array of Maybes and returns back an Array of values of all the Just in the passed Array
     */
    public static catMaybes<A>(ar: Array<Maybe<A>>): Array<any> {
        return ar.filter(m => m.isJust()).map(m => m.getValue());
    }

    /**
     * @function Maybe.isNothing
     * @memberof Maybe
     * @param {any} v - Maybe
     * @description A static method that returns true if the passed Maybe is a Nothing
     */
    public static isNothing<A>(v: Maybe<A>): boolean {
        return v.isNothing();
    }

    /**
     * @function Maybe.isJust
     * @memberof Maybe
     * @param {any} v - Maybe
     * @description A static method that returns true if the passed Maybe is a Just
     */
    public static isJust<A>(v: Maybe<A>): boolean {
        return v.isJust();
    }

    protected _value: A;

    /**
     * @function Maybe.equals
     * @memberof Maybe
     * @param {any} n - Any Value of Type Setoid
     * @description Returns true if the current and the passed element are of Maybe type with the same value
     */
    public abstract equals(n: Setoid): boolean;

    /**
     * @function Maybe.map
     * @memberof Maybe
     * @param {Function} f - Function
     * @description Applies the passed function to the value of the current Maybe if it is a Just
     */
    public abstract map<B>(f: (a: A) => B): Maybe<B>;

    /**
     * @function Maybe.chain
     * @memberof Maybe
     * @param {Function} f - Function that returns another Maybe
     * @description An instance method that can chain together many computations that return a Maybe type
     */
    public abstract chain<B>(f: (a: A) => Maybe<B>): Maybe<B>;
    public abstract caseOf(o: { Nothing: Function } | { Just: Function }): any;

    /**
     * @function Maybe.isNothing
     * @memberof Maybe
     * @description An instance method that returns true if the current Maybe is a Nothing
     */
    public abstract isNothing(): boolean;

    /**
     * @function Maybe.isJust
     * @memberof Maybe
     * @description An instance method that returns true if the current Maybe is a Nothing
     */
    public abstract isJust(): boolean;

    public of<B>(v: B): Maybe<B> {
        return new Just(v);
    }

    /**
     * @function Maybe.alt
     * @memberof Maybe
     * @param {any} v - Maybe
     * @description An instance method that returns the current maybe if it is a Just else returns the passed Maybe
     */
    public alt<B>(v: Maybe<B>): Maybe<B> {
        return caseOf(
            {
                Nothing: (x: any) => v,
                Just: (x: any) => this
            },
            this
        );
    }

    /**
     * @function Maybe.ap
     * @memberof Maybe
     * @param {any} j - Maybe with a function
     * @description Applies the function inside the passed Maybe to the current Maybe if it is a Just
     */
    public ap<B>(j: Maybe<(a: A) => B>): Maybe<B> {
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

    /**
     * @function Maybe.getValue
     * @memberof Maybe
     * @description Get the value within the Maybe
     */
    public getValue(): A {
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

    public caseOf(o: { Nothing: Function }) {
        return o.Nothing ? o.Nothing() : throwError("Maybe: Expected Nothing!");
    }
}

export class Just<A> extends Maybe<A> {
    constructor(v: any) {
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
        if (!isFunction(f)) throwError("Maybe: Expected a function");
        return new Just(f(this.getValue()));
    }

    public chain<B>(f: (a: A) => Maybe<B>): Maybe<B> {
        if (!isFunction(f)) throwError("Maybe: Expected a function");
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

    public caseOf(o: { Just: Function }) {
        return o.Just
            ? o.Just(this.getValue())
            : throwError("Maybe: Expected Just");
    }
}

/**
 * @function eitherToMaybe
 * @param {Maybe} m - Maybe type
 * @description Converts a Either type to an Maybe Type
 */
export const eitherToMaybe = <A, B>(e: Either<A, B>) =>
    caseOf(
        {
            Left: (v: any) => Maybe.Nothing(),
            Right: (v: any) => Maybe.Just(v)
        },
        e
    );
