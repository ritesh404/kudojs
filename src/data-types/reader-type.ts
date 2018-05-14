import { id, isFunction, throwError } from "../functions/helpers";
import { Monad } from "../interfaces";

class Reader<A, B> implements Monad<B> {
    /**
     * @function Reader.of
     * @constructor
     * @param {any} v - Any
     * @description Reader constructor
     */
    public static of<A>(v: A) {
        return new Reader(() => v);
    }

    private _value: Function;

    /**
     * @function Reader
     * @constructor
     * @param {any} fn - A function of the form (e -> a) that is wrapped by the Reader, nothing is executed until it is run with an environment
     * @description Reader constructor
     */
    constructor(fn: Function) {
        if (!isFunction(fn)) throwError("Reader: Must wrap a function");
        this._value = fn;
    }

    public of<C>(v: C) {
        return new Reader(() => v);
    }

    /**
     * @function Reader.ask
     * @memberof Reader
     * @param fn - Optional function to map over the environment
     * @description A construction helper that returns a Reader. ask can take a function, that can be used to map the environment to a different type or value.
     */
    public ask(fn?: Function): Reader<A, B> {
        if (!fn) return new Reader(id);

        if (isFunction(fn)) return new Reader(fn);

        throwError("Reader: No argument or function required");
    }

    public runWith(ctx: A) {
        return this._value(ctx);
    }

    /**
     * @function Reader.ap
     * @memberof Reader
     * @param {Reader} j - Reader with function as the second element
     * @description ap allows for values wrapped in a Reader to be applied to functions also wrapped in a Reader. In order to use ap, the Reader must contain a function as its value.
     */
    public ap<C, D>(j: Reader<C, (b: B) => D>): Reader<C, D> {
        if (!(j instanceof Reader)) throwError("Reader: Reader required");
        const runWith = this.getValue();
        return new Reader(function(e: any) {
            const fn = runWith(e);

            if (!isFunction(fn))
                throwError("Reader: Wrapped function must return a function");

            return j.map(fn).runWith(e);
        });
    }

    /**
     * @function Reader.getValue
     * @memberof Reader
     * @description Get the values within the Reader
     */
    public getValue() {
        return this._value;
    }

    /**
     * @function Reader.map
     * @memberof Reader
     * @param {Function} f - Function
     * @description Apply the function f to the runWith value of the Reader
     */
    public map<C>(f: Function): Reader<A, C> {
        if (!isFunction(f)) throwError("Reader: Expected a function");
        const runWith = this.getValue();
        return new Reader((x: any) => f(runWith(x)));
    }

    /**
     * @function Reader.chain
     * @memberof Reader
     * @param {Function} f - Function that returns another Reader
     * @description Chain together many computations that return a Reader
     */
    public chain<C, D>(f: (a: B) => Reader<C, D>): Reader<C, D> {
        if (!isFunction(f)) throwError("Reader: Expected a function");

        const runWith = this.getValue();

        return new Reader(function(e: any) {
            const m = f(runWith(e));

            if (!(m instanceof Reader))
                throwError(`Reader: Function must return a Reader`);

            return m.runWith(e);
        });
    }

    /**
     * @function Reader.toString
     * @memberof Reader
     * @description Get a stringified version of the Reader
     */
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
