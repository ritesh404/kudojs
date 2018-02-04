import { Monad, Semigroup } from "../interfaces";
import { once, compose, throwError, isFunction } from "../functions/helpers";

const _of = (v: any) => {
  return new Task((_: any, resolve: Function) => resolve(v));
};

const _rejected = (v: any) => {
  return new Task((reject: Function, _: Function) => reject(v));
};

const _tasks = new WeakMap();
class Task implements Semigroup, Monad {
  constructor(f: Function) {
    isFunction(f)
      ? _tasks.set(this, f)
      : throwError("Task: Expected a Function");
  }

  fork(reject: Function, resolve: Function) {
    if (!isFunction(resolve) || !isFunction(reject))
      throwError("Task: Reject and Resolve need to be functions");
    const fn = this.getValue();
    fn(reject, resolve);
  }

  of(v: any) {
    return _of(v);
  }

  toString() {
    const fork = this.getValue();
    return `Task(${fork.name})`;
  }

  map(f: Function) {
    if (!isFunction(f)) throwError("Task: Expected a function");
    const fork = this.getValue();
    return new Task((rej: Function, res: Function) =>
      fork(rej, compose(res, f))
    );
  }

  getValue() {
    return _tasks.get(this);
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
        if (!(t instanceof Task))
          throwError("Task: function must return another Task");
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

export default Task;
export { _of, _rejected };
