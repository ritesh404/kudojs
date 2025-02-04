import PatternMatch from "../../interface/Patternmatch";
import curry from "../curry";
import isFunction from "../isFunction";

function caseOf<A, B>(
    o: { [k: string]: (a?: A) => B },
    p: PatternMatch | string | number,
): B {
    if (typeof p === "string" || p instanceof String || typeof p === "number") {
        if (!o._ && !o.default) throw Error("caseOf: Default case missing");
        else {
            // @ts-ignore
            if (o[p]) return o[p](p);
            if (o._) return o._(p as unknown as A);
            if (o.default) return o.default(p as unknown as A);
        }
    } else if (isFunction(p.caseOf)) return p.caseOf(o);
    throw Error("caseOf: Unable to pattern match");
}
export default curry(caseOf);
