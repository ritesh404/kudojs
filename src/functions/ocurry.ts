import isFunction from "./isFunction";

export default function ocurry(fn: Function, args: Array<string>): Function {
    if (!isFunction(fn))
        throw Error("Expected a function as first argument to ocurry");

    if (fn.length > 1)
        throw Error(
            "Function passed as first argument should not take more than one argument. Argument should be a dictionary"
        );

    return function ocurried(ar: Record<string, any>): Function {
        const curArgs = Object.keys(ar);
        const diff = args.filter(x => curArgs.indexOf(x) < 0);
        if (diff.length > 0)
            return (ar2: Record<string, any>): Function =>
                ocurried.call(null, (<any>Object).assign({}, ar, ar2));

        return fn.call(null, ar);
    };
}
