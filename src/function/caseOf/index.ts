import PatternMatch from "../../interface/Patternmatch";
import curry from "../curry";
import isFunction from "../isFunction";

function caseOf(
    o: { [k: string]: (a: any) => any },
    p: PatternMatch | string | number
): any {
    if (typeof p === "string" || p instanceof String || typeof p === "number") {
        if (!o._ && !o.default) throw Error("caseOf: Default case missing");
        else {
            // @ts-ignore
            if (o[p]) return o[p](p);
            if (o._) return o._(p);
            if (o.default) return o.default(p);
        }
    } else if (isFunction(p.caseOf)) return p.caseOf(o);
    else throw Error("caseOf: Unable to pattern match");
}
export default curry(caseOf);
