import BiFunctor from "../interfaces/bifunctor";
import curry from "./curry";
import isFunction from "./isFunction";

function _bimap<A, B, C, D>(
    f1: (a1: A) => C,
    f2: (a2: B) => D,
    b: BiFunctor<A, B>
): BiFunctor<C, D> | never {
    if (!isFunction(f1) || !isFunction(f2)) throw Error("Expected functions");
    if (!b.bimap) throw Error("Expected a BiFunctor as last argument");
    return b.bimap(f1, f2);
}
export default curry(_bimap);
