import { Monad, Semigroup } from "../interfaces";
import { once, compose, throwError, isFunction } from "../functions/helpers";

class Task implements Semigroup, Monad<(rej: Function, res: Function) => any> {
  _value: (rej: Function, res: Function) => any;

  constructor(f: (rej: Function, res: Function) => any) {
    isFunction(f) ? (this._value = f) : throwError("Task: Expected a Function");
  }

  static of(v: any) {
    return new Task((_: Function, resolve: Function) => resolve(v));
  }

  static rejected(v: any) {
    return new Task((reject: Function, _: Function) => reject(v));
  }

  of(v: any) {
    return new Task((_: Function, resolve: Function) => resolve(v));
  }

  rejected(v: any) {
    return new Task((reject: Function, _: Function) => reject(v));
  }

  fork(reject: Function, resolve: Function) {
    if (!isFunction(resolve) || !isFunction(reject))
      throwError("Task: Reject and Resolve need to be functions");
    const fn = this.getValue();
    fn(reject, resolve);
  }

  toString() {
    const fork = this.getValue();
    return `Task(${fork.name})`;
  }

  map<A, B>(f: (a: A) => B): Task {
    if (!isFunction(f)) throwError("Task: Expected a function");
    const fork = this.getValue();
    return new Task((rej: Function, res: Function) =>
      fork(rej, compose(res, f))
    );
  }

  getValue() {
    return this._value;
  }

  ap(t: Task) {
    if (!(t instanceof Task)) throwError("Task: type mismatch");
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
          throwError("Task: Wrapped value should be a function");
        fn = f;
        gotFuction = true;
        resolveBoth();
      });
    });
  }

  concat(t: Task) {
    if (!(t instanceof Task)) throwError("Task: type mismatch");
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
        if (result1 && result2 && !rejected) {
          res.apply(null, [...result1, ...result2]);
        }
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

  chain(f: Function) {
    if (!isFunction(f)) throwError("Task: Function required");
    const thisFork = this.getValue();

    return new Task((rej: Function, res: Function) => {
      thisFork(rej, (...args: Array<any>) => {
        const t = f.call(null, args);
        if (!t.fork) throwError("Task: function must return another Task");
        t.fork(rej, res);
      });
    });
  }

  toPromise() {
    const thisFork = this.getValue();
    return new Promise((res, rej) => {
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
