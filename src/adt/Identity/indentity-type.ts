import isFunction from "../../function/isFunction";
import Monad from "../../interface/Monad";
import Semigroup from "../../interface/Semigroup";
import Setoid from "../../interface/Setoid";

class Identity<A> implements Setoid, Semigroup, Monad<A> {
    private _value: A;

    public constructor(value: A) {
        if (value === undefined)
            throw new Error("Identity: Value is undefined");

        this._value = value;
    }

    public static of<C>(v: C) {
        return new Identity(v);
    }

    // @ts-ignore
    public of<C>(v: C) {
        return new Identity(v);
    }

    public getValue() {
        return this._value;
    }

    public equals(j: Identity<A>) {
        return this.getValue() === j.getValue();
    }

    public concat(i: Identity<Semigroup>): Identity<A> {
        const v = i.getValue();
        if (typeof v !== typeof this.getValue())
            throw new Error("Identity: types do not match to concat");
        // @ts-ignore
        if (!v.concat || !this.getValue().concat)
            throw new Error("Identity: Semigroup required to concat");
        // @ts-ignore
        return this.map(x => x.concat(v));
    }

    public ap<B, C>(i: Identity<B>): Identity<C> {
        // @ts-ignore
        const fn: (a: B) => C = this.getValue();
        if (!isFunction(fn)) throw Error("Identity: Function not found");
        return new Identity(fn(i.getValue()));
    }

    public map<B>(f: (a: A) => B): Identity<B> {
        if (!isFunction(f)) throw Error("Identity: Expected a function");
        return new Identity(f(this.getValue()));
    }

    // @ts-ignore
    public chain<B>(f: (a: A) => Identity<B>): Identity<B> {
        if (!isFunction(f)) throw Error("Identity: Expected a function");
        const res = f(this.getValue());
        if (!(res instanceof Identity))
            throw Error("Identity: Function must return Identity");
        return res;
    }

    public toString() {
        const v = this.getValue();
        return `Identity(${v})`;
    }
}

// @ts-ignore: implicit any
Identity.prototype["fantasy-land/equals"] = Identity.prototype.equals;
// @ts-ignore: implicit any
Identity.prototype["fantasy-land/map"] = Identity.prototype.map;
// @ts-ignore: implicit any
Identity.prototype["fantasy-land/concat"] = Identity.prototype.concat;
// @ts-ignore: implicit any
Identity.prototype["fantasy-land/chain"] = Identity.prototype.chain;
// @ts-ignore: implicit any
Identity.prototype["fantasy-land/of"] = Identity.prototype.of;
// @ts-ignore: implicit any
Identity.prototype["fantasy-land/ap"] = Identity.prototype.ap;

export default Identity;
