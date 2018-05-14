import { isFunction, throwError } from "../functions/helpers";
import { Monad } from "../interfaces";
import Pair from "./pair";

class State<A, B> implements Monad<B> {
    /**
     * @function State.of
     * @constructor
     * @param {any} v - Any
     * @description State constructor
     */
    public static of<A, B>(v: A) {
        return new State((s: B) => Pair(v, s));
    }

    private _value: Function;

    /**
     * @function State
     * @constructor
     * @param {Function} fn
     * @description State constructor
     */
    constructor(fn: Function) {
        if (!isFunction(fn)) throwError("State: Must wrap a function");
        this._value = fn;
    }

    public of<C, D>(v: C) {
        return new State((s: D) => Pair(v, s));
    }

    /**
     * @function State.get
     * @memberof State
     * @param fn - Optional function to map over the state
     * @description A construction helper that returns a State. get can take a function, that can be used to map the over the state part.
     */
    public get(fn?: Function): State<A, B> {
        if (!fn) return new State((s: any) => Pair(s, s));

        if (isFunction(fn)) return new State((s: any) => Pair(fn(s), s));

        throwError("State: No argument or function required");
    }

    /**
     * @function State.put
     * @memberof State
     * @param s - An initial resultant state
     * @description A construction helper that returns a State. that when run returns a Pair(result, Unit).
     */
    public put(s: B): State<A, B> {
        if (s) return new State((_: any) => Pair(s, _));

        throwError("State: No argument or function required");
    }

    /**
     * @function State.runWith
     * @memberof State
     * @param s - Initial state
     * @description When called, runWith will run the state transition with the given value as the initial state and will return the resulting Pair (result, state).
     */
    public runWith(s: A) {
        const p = this._value(s);

        if (!p.fst || !p.snd)
            throwError("State: Must wrap a function of the form s -> Pair a s");

        return p;
    }

    /**
     * @function State.execWith
     * @memberof State
     * @param s - Initial state
     * @description When called, execWith will run the state transition with the given value as the initial state and will return the state.
     */
    public execWith(s: A) {
        const pair = this.runWith(s);
        return pair.snd();
    }

    /**
     * @function State.evalWith
     * @memberof State
     * @param s - Initial state
     * @description When called, evalWith will run the state transition with the given value as the initial state and will return the resultant.
     */
    public evalWith(s: A) {
        const pair = this.runWith(s);
        return pair.fst();
    }

    /**
     * @function State.ap
     * @memberof State
     * @param {State} j - State with function as the second element
     * @description Applies the resultant of a given State instance to a function wrapped in another instance. On a State instance that wraps a function, calling ap, providing it another State instance, will return a new State instance with the result of the function in the resultant portion.
     */
    public ap<C, D>(j: State<C, (b: B) => D>): State<C, D> {
        if (!(j instanceof State)) throwError("State: State required");
        const runWith = this._value;
        return new State(function(e: any) {
            const p = runWith(e);
            if (!p.fst || !p.snd)
                throwError(
                    "State: Must wrap a function of the form s -> Pair a s"
                );
            const fn = p.fst();

            if (!isFunction(fn))
                throwError("State: Source value must be a function");

            return j.map(fn).runWith(p.snd());
        });
    }

    /**
     * @function State.getValue
     * @memberof State
     * @description Get the values within the State
     */
    public getValue() {
        return this._value;
    }

    /**
     * @function State.map
     * @memberof State
     * @param {Function} f - Function
     * @description Apply the function f to the runWith value of the State
     */
    public map<C>(f: Function): State<A, C> {
        if (!isFunction(f)) throwError("State: Expected a function");
        const runWith = this._value;

        return new State((s: any) => {
            const m = runWith(s);
            return Pair(f(m.fst()), m.snd());
        });
    }

    /**
     * @function State.chain
     * @memberof State
     * @param {Function} f - Function that returns another State
     * @description Chain together many computations that return a State
     */
    public chain<C, D>(f: (a: B) => State<C, D>): State<C, D> {
        if (!isFunction(f)) throwError("State: Expected a function");

        const runWith = this.getValue();

        return new State(function(s: any) {
            const p = runWith(s);
            const m = f(p.fst());

            if (!(m instanceof State))
                throwError(`State: Function must return a State`);

            return m.runWith(p.snd());
        });
    }

    /**
     * @function State.toString
     * @memberof State
     * @description Get a stringified version of the State
     */
    public toString() {
        const v = this.getValue();
        return `State(${v})`;
    }
}

// @ts-ignore: implicit any
State.prototype["fantasy-land/map"] = State.prototype.map;
// @ts-ignore: implicit any
State.prototype["fantasy-land/chain"] = State.prototype.chain;
// @ts-ignore: implicit any
State.prototype["fantasy-land/of"] = State.prototype.of;
// @ts-ignore: implicit any
State.prototype["fantasy-land/ap"] = State.prototype.ap;

export default State;
