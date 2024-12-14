import Functor from "../../interface/Functor";
import curry from "../curry";
import isFunction from "../isFunction";

function fmap<A, B>(fn: (a: A) => B, f: Functor<A>): Functor<B> {
    if (!isFunction(fn)) throw Error("function not provided");
    if (!f.map) throw Error("Functor not found");
    return f.map(fn);
}
export default curry(fmap);
