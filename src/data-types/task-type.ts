import { Monad, Semigroup } from "../interfaces";
import { once, compose, throwError, isFunction } from "../functions/helpers";

class Task implements Semigroup, Monad<(rej: Function, res: Function) => any> {
  _value: (rej: Function, res: Function) => any;

  /** @function Task
   * @constructor
   * @param {Function} f - A function that is passed with the arguments reject and resolve functions. When reject or resolve functions are called the Task gets rejected or resolved, respectively. Function f normally initiates an asynchronous work or one that has effects, and then, once that completes, either calls the resolve function to resolve the Task or else rejects it.
   * @description Task constructor
   */
  constructor(f: (rej: Function, res: Function) => any) {
    isFunction(f) ? (this._value = f) : throwError("Task: Expected a Function");
  }

  /** @function Task.of
   * @constructor
   * @param {any} v - value that is passed to the resolve function
   * @description Task constructor that creates a Task which immediately resolves
   */
  static of(v: any) {
    return new Task((_: Function, resolve: Function) => resolve(v));
  }

  /** @function Task.rejected
   * @constructor
   * @param {any} v - value that is passed to the rejected function
   * @description Task constructor that creates a Task which immediately gets rejected
   */
  static rejected(v: any) {
    return new Task((reject: Function, _: Function) => reject(v));
  }

  of(v: any) {
    return new Task((_: Function, resolve: Function) => resolve(v));
  }

  rejected(v: any) {
    return new Task((reject: Function, _: Function) => reject(v));
  }

  /** @function Task.fork
   * @constructor
   * @param {Function} reject - Function to be called when the Task is rejected
   * @param {Function} resolve - Function to be called when the Task is resolved
   * @description Executes the Task
   */
  fork(reject: Function, resolve: Function) {
    if (!isFunction(resolve) || !isFunction(reject))
      throwError("Task: Reject and Resolve need to be functions");
    const fn = this.getValue();
    fn(reject, resolve);
  }

  /** @function Task.toString
   * @memberof Task
   * @description Get a stringified version of the Task
   */
  toString() {
    const fork: any = this.getValue();
    return `Task(${fork.name})`;
  }

  /** @function Task.map
   * @memberof Task
   * @param {Function} f - Function
   * @description Apply the function f to value of a successfully resolved Task
   */
  map<A, B>(f: (a: A) => B): Task {
    if (!isFunction(f)) throwError("Task: Expected a function");
    const fork = this.getValue();
    return new Task((rej: Function, res: Function) =>
      fork(rej, compose(res, f))
    );
  }

  /** @function Task.getValue
   * @memberof Task
   * @description Get the function within the Task
   */
  getValue() {
    return this._value;
  }

  /** @function Task.ap
   * @memberof Task
   * @param {Task} t - Task with function as the second element
   * @description * Applys the successful value of the Task t to the successful value of the current Task
   */
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

  /** @function Task.concat
   * @memberof Task
   * @param {Task} t - Task to concat
   * @description Concat the current Task with the passed one and get a new Task. Which when resloved would get the successfull result of both the task in an array.
   */
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

  /** @function Task.chain
   * @memberof Task
   * @param {Function} f - Function that returns another Task
   * @description Chain together many computations that return a Task
   */
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

  /** @function Task.toPromise
   * @memberof Task
   * @description Converts the current task to a Promise
   */
  toPromise() {
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
