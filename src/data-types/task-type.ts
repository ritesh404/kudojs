
import {Monad, PatternMatch} from "../interfaces";
import {once, compose, throwError, isFunction} from "../functions/helpers";

const _tasks = new WeakMap();
class Task implements Monad {

    constructor(f: Function/*, cancel: Function*/){
        isFunction(f) ? _tasks.set(this, f) : throwError("Task: Expected a Function");
        //cancel && isFunction(cancel) ? _cancels.set(this, cancel) : _cancels.set(this, function(){})
    }

    fork(reject: Function, resolve: Function){
        if(!isFunction(resolve) || !isFunction(reject)) throwError("Task: Reject and Resolve need to be functions");
        const fn = _tasks.get(this);
        fn(reject, resolve);
    }

    of(v: any) {
        return new Task((_: any, resolve: Function) => resolve(v));
    }

    toString(){
        const fork = _tasks.get(this);
        return `Task(${fork.toString()})`;
    }

    map(f: Function){
        if(!isFunction(f)) throwError("Task: Expected a function");
        const fork = _tasks.get(this);
        return new Task((rej: Function, res: Function) => fork(rej, compose(res, f)));
    }

    ap(t: Task){
        if(!(t instanceof Task)) throwError("Task: type mismatch");
        const thisFork = _tasks.get(this);
        let value: Array<any>;
        let fn: Function;
        let gotValues: boolean = false;
        let gotFuction: boolean = false;
        let rejected: boolean = false;

        return new Task((rej: Function, res: Function) => {
            const rejOnce = compose(() => {rejected = true;}, once)(rej);

            const resolveBoth = () => {
                if(gotValues && gotFuction && !rejected){
                    const exec = compose(res, fn);
                    exec.apply(null, value);
                }
            }

            thisFork(rejOnce, (f: Function) => {
                if(!isFunction(f)) throwError("Task: Wrapped value should be a function");
                fn = f;
                gotFuction = true;
                resolveBoth();
            })

            t.fork(rejOnce, (...values: Array<any>) => {
                value = values;
                gotValues = true;
                resolveBoth();
            });
        })
    }

    chain(f: Function){
        if(!isFunction(f)) throwError("Task: Function required");
        const thisFork = _tasks.get(this);

        return new Task((rej: Function, res: Function) => {
            thisFork(rej, (...args: Array<any>) => {
                const t = f.call(null, args);
                if(!(t instanceof Task)) throwError("Task: function must return another Task");
                t.fork(rej, res);
            })
        });
    }
    
    toPromise(){
        const thisFork = _tasks.get(this);
        return new Promise((res, rej) => {
            thisFork(rej, res);
        });
    }
}

export default Task;