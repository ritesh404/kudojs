import isFunction from "../../function/isFunction";
import Monad from "../../interface/monad";
import Pair from "../Pair";

class State<A, B> implements Monad<B> {
    private _value: Function;

    public constructor(fn: Function) {
        if (!isFunction(fn)) throw Error("State: Must wrap a function");
        this._value = fn;
    }

    public static of<G, K>(v: G) {
        return new State((s: K) => Pair(v, s));
    }

    public of<C, D>(v: C) {
        return new State((s: D) => Pair(v, s));
    }

    public get(fn?: Function): State<A, B> {
        if (!fn) return new State((s: any) => Pair(s, s));

        if (isFunction(fn)) return new State((s: any) => Pair(fn(s), s));

        throw Error("State: No argument or function required");
    }

    public put(s: B): State<A, B> {
        if (s) return new State((_: any) => Pair(s, _));

        throw Error("State: No argument or function required");
    }

    public runWith(s: A) {
        const p = this._value(s);

        if (!p.fst || !p.snd)
            throw Error(
                "State: Must wrap a function of the form s -> Pair a s"
            );

        return p;
    }

    public execWith(s: A) {
        const pair = this.runWith(s);
        return pair.snd();
    }

    public evalWith(s: A) {
        const pair = this.runWith(s);
        return pair.fst();
    }

    public ap<C, D>(j: State<C, (b: B) => D>): State<C, D> {
        if (!(j instanceof State)) throw Error("State: State required");
        const runWith = this._value;
        return new State(function(e: any) {
            const p = runWith(e);
            if (!p.fst || !p.snd)
                throw Error(
                    "State: Must wrap a function of the form s -> Pair a s"
                );
            const fn = p.fst();

            if (!isFunction(fn))
                throw Error("State: Source value must be a function");

            return j.map(fn).runWith(p.snd());
        });
    }

    public getValue() {
        return this._value;
    }

    public map<C>(f: Function): State<A, C> {
        if (!isFunction(f)) throw Error("State: Expected a function");
        const runWith = this._value;

        return new State((s: any) => {
            const m = runWith(s);
            return Pair(f(m.fst()), m.snd());
        });
    }

    public chain<C, D>(f: (a: B) => State<C, D>): State<C, D> {
        if (!isFunction(f)) throw Error("State: Expected a function");

        const runWith = this.getValue();

        return new State(function(s: any) {
            const p = runWith(s);
            const m = f(p.fst());

            if (!(m instanceof State))
                throw Error(`State: Function must return a State`);

            return m.runWith(p.snd());
        });
    }

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
