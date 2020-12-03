import id from "../../function/id";
import isFunction from "../../function/isFunction";
import Monad from "../../interface/Monad";

class Reader<A, B> implements Monad<B> {
    private _value: Function;

    public constructor(fn: Function) {
        if (!isFunction(fn)) throw Error("Reader: Must wrap a function");
        this._value = fn;
    }

    public static of<C>(v: C) {
        return new Reader(() => v);
    }

    public of<C>(v: C) {
        return new Reader(() => v);
    }

    public ask(fn?: Function): Reader<A, B> {
        if (!fn) return new Reader(id);

        if (isFunction(fn)) return new Reader(fn);

        throw Error("Reader: No argument or function required");
    }

    public runWith(ctx: A) {
        return this._value(ctx);
    }

    public ap<C, D>(j: Reader<C, B>): Reader<C, D> {
        if (!(j instanceof Reader)) throw Error("Reader: Reader required");
        const runWith = this.getValue();
        return new Reader(function(e: any) {
            const fn = runWith(e);

            if (!isFunction(fn))
                throw Error("Reader: Wrapped function must return a function");

            return j.map(fn).runWith(e);
        });
    }

    public getValue() {
        return this._value;
    }

    public map<C>(f: Function): Reader<A, C> {
        if (!isFunction(f)) throw Error("Reader: Expected a function");
        const runWith = this.getValue();
        return new Reader((x: any) => f(runWith(x)));
    }

    public chain<C, D>(f: (a: B) => Reader<C, D>): Reader<C, D> {
        if (!isFunction(f)) throw Error("Reader: Expected a function");

        const runWith = this.getValue();

        return new Reader(function(e: any) {
            const m = f(runWith(e));

            if (!(m instanceof Reader))
                throw Error(`Reader: Function must return a Reader`);

            return m.runWith(e);
        });
    }

    public toString() {
        const v = this.getValue();
        return `Reader(${v})`;
    }
}

// @ts-ignore: implicit any
Reader.prototype["fantasy-land/map"] = Reader.prototype.map;
// @ts-ignore: implicit any
Reader.prototype["fantasy-land/chain"] = Reader.prototype.chain;
// @ts-ignore: implicit any
Reader.prototype["fantasy-land/of"] = Reader.prototype.of;
// @ts-ignore: implicit any
Reader.prototype["fantasy-land/ap"] = Reader.prototype.ap;

export default Reader;
