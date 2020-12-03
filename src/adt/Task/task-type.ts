import compose from "../../function/compose";
import isFunction from "../../function/isFunction";
import once from "../../function/once";
import Monad from "../../interface/monad";
import Semigroup from "../../interface/Semigroup";

class Task implements Semigroup, Monad<(rej: Function, res: Function) => any> {
    private _value: (rej: Function, res: Function) => any;

    public constructor(f: (rej: Function, res: Function) => any) {
        if (isFunction(f)) this._value = f;
        else throw Error("Task: Expected a Function");
    }

    public static of(v: any) {
        return new Task((_: Function, resolve: Function) => resolve(v));
    }

    public static rejected(v: any) {
        return new Task((reject: Function, _: Function) => reject(v));
    }

    public of(v: any) {
        return new Task((_: Function, resolve: Function) => resolve(v));
    }

    public rejected(v: any) {
        return new Task((reject: Function, _: Function) => reject(v));
    }

    public fork(reject: Function, resolve: Function) {
        if (!isFunction(resolve) || !isFunction(reject))
            throw Error("Task: Reject and Resolve need to be functions");

        const fn = this.getValue();
        fn(reject, resolve);
    }

    public toString() {
        const fork: any = this.getValue();
        return `Task(${fork.name})`;
    }

    public map<A, B>(f: (a: A) => B): Task {
        if (!isFunction(f)) throw Error("Task: Expected a function");
        const fork = this.getValue();
        return new Task((rej: Function, res: Function) =>
            fork(rej, compose(res, f))
        );
    }

    public getValue() {
        return this._value;
    }

    public ap(t: Task) {
        if (!(t instanceof Task)) throw Error("Task: type mismatch");
        const thisFork = this.getValue();
        let value: Array<any>;
        let fn: Function;
        let gotValues: boolean = false;
        let gotFuction: boolean = false;
        let rejected: boolean = false;

        return new Task((rej: Function, res: Function) => {
            const rejOnce = compose(() => {
                rejected = true;
            }, once(rej));

            const resolveBoth = () => {
                if (gotValues && gotFuction && !rejected) {
                    const exec = compose(res, fn);
                    exec.apply(null, value);
                }
            };

            thisFork(rejOnce, (...values: Array<any>) => {
                value = values;
                gotValues = true;
                resolveBoth();
            });

            t.fork(rejOnce, (f: Function) => {
                if (!isFunction(f))
                    throw Error("Task: Wrapped value should be a function");

                fn = f;
                gotFuction = true;
                resolveBoth();
            });
        });
    }

    public concat(t: Task) {
        if (!(t instanceof Task)) throw Error("Task: type mismatch");
        const thisFork = this.getValue();
        const thatFork = t.getValue();

        return new Task((rej: Function, res: Function) => {
            let rejected: boolean = false;
            const rejOnce = compose(() => {
                rejected = true;
            }, once(rej));
            let result1: any;
            let result2: any;

            const resolveBoth = () => {
                if (result1 && result2 && !rejected)
                    res.apply(null, [...result1, ...result2]);
            };

            thisFork(rejOnce, (...values: Array<any>) => {
                result1 = values;
                resolveBoth();
            });

            thatFork(rejOnce, (...values: Array<any>) => {
                result2 = values;
                resolveBoth();
            });
        });
    }

    public chain(f: Function) {
        if (!isFunction(f)) throw Error("Task: Function required");
        const thisFork = this.getValue();

        return new Task((rej: Function, res: Function) => {
            thisFork(rej, (...args: Array<any>) => {
                const t = f.call(null, args);
                if (!t.fork)
                    throw Error("Task: function must return another Task");

                t.fork(rej, res);
            });
        });
    }

    public toPromise() {
        const thisFork = this.getValue();
        return new Promise((res: Function, rej: Function) => {
            thisFork(rej, res);
        });
    }
}

// @ts-ignore: implicit any
Task.prototype["fantasy-land/map"] = Task.prototype.map;
// @ts-ignore: implicit any
Task.prototype["fantasy-land/concat"] = Task.prototype.concat;
// @ts-ignore: implicit any
Task.prototype["fantasy-land/chain"] = Task.prototype.chain;
// @ts-ignore: implicit any
Task.prototype["fantasy-land/of"] = Task.prototype.of;
// @ts-ignore: implicit any
Task.prototype["fantasy-land/ap"] = Task.prototype.ap;

export default Task;
