import isFunction from "../isFunction";

export default function curry(fn: Function): Function {
    if (!isFunction(fn)) throw Error("Function not provided");

    const arity = fn.length;
    return function curried(...args: any[]) {
        if (args.length >= arity) {
            return fn.apply(null, args);
        }
        return function(...moreArgs: any[]) {
            return curried.apply(null, [...args, ...moreArgs]);
        };
    };
}
