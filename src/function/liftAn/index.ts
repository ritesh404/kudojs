import Apply from "../../interface/Apply";
import curry from "../curry";
import isFunction from "../isFunction";

function liftAn<A, B>(f: (a: A) => B, fns: Array<Apply<A>>) {
    if (!isFunction(f)) throw Error("Expected a function");

    const init: any = fns[0].map(f);
    let res = init;
    if (fns.length > 1) {
        const rest = fns.slice(1);
        // @ts-ignore
        res = rest.reduce(function applyFn(
            a: Apply<(ar: A) => B>,
            ca: Apply<A>
        ) {
            return a.ap(ca);
        },
        init);
    }
    return res;
}
export default curry(liftAn);
