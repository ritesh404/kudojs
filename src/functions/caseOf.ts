import PatternMatch from "../interfaces/patternmatch";
import curry from "./curry";
import isFunction from "./isFunction";

function caseOf(o: { [k: string]: (a: any) => any }, p: PatternMatch): any {
    if (isFunction(p.caseOf)) return p.caseOf(o);
    else throw Error("Unable to pattern match");
}
export default curry(caseOf);
