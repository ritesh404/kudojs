import isFunction from "../isFunction";

export default function curry(fn: Function): Function {
    if (!isFunction(fn)) throw Error("Function not provided");
    const slice = Array.prototype.slice;

    const arity = fn.length;
    return function curried() {
        const args = slice.call(arguments, 0);
        if (args.length >= arity) return fn.apply(null, args);

        return function() {
            return curried.apply(null, args.concat(slice.call(arguments)));
        };
    };
}
